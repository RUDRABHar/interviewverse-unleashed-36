
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, addMinutes } from "date-fns";
import { CalendarIcon, ChevronRightIcon, CheckCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Define minimum date (today)
const today = new Date();
today.setHours(0, 0, 0, 0);

// Minimum time (30 minutes from now)
const thirtyMinutesFromNow = addMinutes(new Date(), 30);

// InterviewScheduleFormSchema - handles validation for all form fields
const InterviewScheduleFormSchema = z.object({
  interviewType: z.string({
    required_error: "Please select an interview type",
  }),
  domain: z.string().optional(),
  difficultyLevel: z.string({
    required_error: "Please select a difficulty level",
  }),
  numberOfQuestions: z.number({
    required_error: "Please specify number of questions",
  }).min(5, {
    message: "Minimum 5 questions required",
  }).max(50, {
    message: "Maximum 50 questions allowed",
  }),
  scheduledDate: z.date({
    required_error: "Please select a date",
  }),
  scheduledTime: z.string({
    required_error: "Please select a time",
  }),
  enableReminder: z.boolean().default(false),
  reminderType: z.string().optional(),
  reminderTime: z.string().optional(),
}).refine((data) => {
  // Skip validation if no reminder is enabled
  if (!data.enableReminder) return true;
  
  // If reminder is enabled, both type and time must be provided
  return data.reminderType && data.reminderTime;
}, {
  message: "Please complete reminder settings",
  path: ["reminderType"],
});

type InterviewScheduleFormValues = z.infer<typeof InterviewScheduleFormSchema>;

// Generate time slots in 15-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      // Skip times in the past for today
      if (
        format(today, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd') &&
        (hour < currentHour || (hour === currentHour && minute <= currentMinute))
      ) {
        continue;
      }
      
      const formattedHour = hour % 12 || 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      const formattedMinute = minute.toString().padStart(2, '0');
      const timeValue = `${hour.toString().padStart(2, '0')}:${formattedMinute}`;
      const timeLabel = `${formattedHour}:${formattedMinute} ${amPm}`;
      
      slots.push({ value: timeValue, label: timeLabel });
    }
  }
  
  return slots;
};

const timeSlots = generateTimeSlots();

interface InterviewSchedulerProps {
  user: any;
}

export function InterviewScheduler({ user }: InterviewSchedulerProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Initialize form with default values
  const form = useForm<InterviewScheduleFormValues>({
    resolver: zodResolver(InterviewScheduleFormSchema),
    defaultValues: {
      interviewType: "",
      difficultyLevel: "",
      numberOfQuestions: 10,
      enableReminder: false,
    },
  });
  
  // Get current values for conditional rendering
  const interviewType = form.watch("interviewType");
  const enableReminder = form.watch("enableReminder");
  const scheduledDate = form.watch("scheduledDate");
  
  // Determine if domain field should be shown
  const showDomainField = interviewType === "Technical";
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };
  
  // Disable dates in the past
  const disablePastDates = (date: Date) => {
    return date < today;
  };
  
  // Format datetime for display
  const formatDateTime = (date: Date, time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const datetime = new Date(date);
    datetime.setHours(hours, minutes);
    return format(datetime, "PPPp");
  };
  
  // Submit form data
  const onSubmit = async (data: InterviewScheduleFormValues) => {
    try {
      // Create a datetime from date and time components
      const [hours, minutes] = data.scheduledTime.split(':').map(Number);
      const scheduledDatetime = new Date(data.scheduledDate);
      scheduledDatetime.setHours(hours, minutes, 0, 0);
      
      // Prepare data for Supabase
      const sessionData = {
        user_id: user.id,
        interview_type: data.interviewType,
        domain: data.domain || null,
        difficulty_level: data.difficultyLevel,
        number_of_questions: data.numberOfQuestions,
        scheduled_for: scheduledDatetime.toISOString(),
        reminder_type: data.enableReminder ? data.reminderType : null,
        reminder_time: data.enableReminder ? data.reminderTime : null,
        status: 'scheduled'
      };
      
      const { error } = await supabase
        .from('scheduled_sessions')
        .insert([sessionData]);
      
      if (error) {
        console.error("Error scheduling interview:", error);
        toast({
          variant: "destructive",
          title: "Schedule Error",
          description: "There was a problem scheduling your interview. Please try again.",
        });
      } else {
        setShowSuccessDialog(true);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        variant: "destructive", 
        title: "Something went wrong",
        description: "Please try again later.",
      });
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Schedule Your Next Mock Interview</h1>
        <p className="text-gray-500 dark:text-gray-400">Set a time that works for you. Practice with AI on your terms.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center w-full max-w-xl">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div 
                className={cn(
                  "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium transition-colors",
                  currentStep === step 
                    ? "border-interview-primary bg-interview-primary text-white" 
                    : currentStep > step 
                      ? "border-interview-primary bg-interview-primary/10 text-interview-primary"
                      : "border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                )}
              >
                {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              {step < 4 && (
                <div 
                  className={cn(
                    "flex-1 h-0.5",
                    currentStep > step 
                      ? "bg-interview-primary" 
                      : "bg-gray-200 dark:bg-gray-700"
                  )}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Interview Preferences */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Preferences</CardTitle>
                  <CardDescription>Configure your interview parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Interview Type */}
                  <FormField
                    control={form.control}
                    name="interviewType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interview Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select interview type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="Behavioral">Behavioral</SelectItem>
                            <SelectItem value="Communication">Communication</SelectItem>
                            <SelectItem value="Language">Language</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Domain (conditional) */}
                  {showDomainField && (
                    <FormField
                      control={form.control}
                      name="domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Domain</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select domain" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Full Stack">Full Stack</SelectItem>
                              <SelectItem value="Backend">Backend</SelectItem>
                              <SelectItem value="Frontend">Frontend</SelectItem>
                              <SelectItem value="App Development">App Development</SelectItem>
                              <SelectItem value="AI/ML">AI/ML</SelectItem>
                              <SelectItem value="DSA">Data Structures & Algorithms</SelectItem>
                              <SelectItem value="DevOps">DevOps</SelectItem>
                              <SelectItem value="Cloud">Cloud</SelectItem>
                              <SelectItem value="Database">Database</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {/* Difficulty Level */}
                  <FormField
                    control={form.control}
                    name="difficultyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Easy">Easy (0-1 years experience)</SelectItem>
                            <SelectItem value="Medium">Medium (2-3 years experience)</SelectItem>
                            <SelectItem value="Hard">Hard (4-6 years experience)</SelectItem>
                            <SelectItem value="Expert">Expert (7+ years experience)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Number of Questions */}
                  <FormField
                    control={form.control}
                    name="numberOfQuestions"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              min={5}
                              max={50}
                              step={1}
                              defaultValue={[value]}
                              onValueChange={(vals) => onChange(vals[0])}
                              className="py-4"
                            />
                            <div className="flex justify-between">
                              <span className="text-sm">5</span>
                              <span className="font-medium">{value} questions</span>
                              <span className="text-sm">50</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Each question takes approximately 2-3 minutes to complete.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={handleNextStep}
                  disabled={!form.getValues().interviewType || !form.getValues().difficultyLevel}
                >
                  Next Step
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <Card>
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                  <CardDescription>Choose when you want to take this interview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Picker */}
                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={disablePastDates}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Select a date for your interview session.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Time Picker */}
                  <FormField
                    control={form.control}
                    name="scheduledTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!scheduledDate}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot.value} value={slot.value}>
                                {slot.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select a time slot for your interview.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                >
                  Previous
                </Button>
                <Button 
                  type="button" 
                  onClick={handleNextStep}
                  disabled={!form.getValues().scheduledDate || !form.getValues().scheduledTime}
                >
                  Next Step
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 3: Reminders */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <Card>
                <CardHeader>
                  <CardTitle>Set Reminders (Optional)</CardTitle>
                  <CardDescription>Configure notifications to help you remember your interview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Enable Reminders */}
                  <FormField
                    control={form.control}
                    name="enableReminder"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Reminders</FormLabel>
                          <FormDescription>
                            Receive notifications before your interview
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {/* Reminder Type (conditional) */}
                  {enableReminder && (
                    <FormField
                      control={form.control}
                      name="reminderType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reminder Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select reminder type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Email">Email</SelectItem>
                              <SelectItem value="SMS">SMS</SelectItem>
                              <SelectItem value="Push">Push Notification</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {/* Reminder Time (conditional) */}
                  {enableReminder && (
                    <FormField
                      control={form.control}
                      name="reminderTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>When to remind</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select when to remind" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="15min">15 minutes before</SelectItem>
                              <SelectItem value="1hour">1 hour before</SelectItem>
                              <SelectItem value="1day">1 day before</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                >
                  Previous
                </Button>
                <Button 
                  type="button" 
                  onClick={handleNextStep}
                  disabled={enableReminder && (!form.getValues().reminderType || !form.getValues().reminderTime)}
                >
                  Next Step
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 4: Review & Confirm */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
                  <CardTitle>Review & Confirm</CardTitle>
                  <CardDescription>Please review your interview configuration before confirming</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <dl className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
                    <div className="flex justify-between py-2">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Interview Type</dt>
                      <dd className="text-sm font-semibold">
                        {form.getValues().interviewType}
                        {form.getValues().domain && ` - ${form.getValues().domain}`}
                      </dd>
                    </div>
                    
                    <div className="flex justify-between py-2">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Difficulty Level</dt>
                      <dd className="text-sm font-semibold">{form.getValues().difficultyLevel}</dd>
                    </div>
                    
                    <div className="flex justify-between py-2">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Number of Questions</dt>
                      <dd className="text-sm font-semibold">{form.getValues().numberOfQuestions}</dd>
                    </div>
                    
                    {form.getValues().scheduledDate && form.getValues().scheduledTime && (
                      <div className="flex justify-between py-2">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled For</dt>
                        <dd className="text-sm font-semibold">
                          {formatDateTime(form.getValues().scheduledDate, form.getValues().scheduledTime)}
                        </dd>
                      </div>
                    )}
                    
                    <div className="flex justify-between py-2">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Reminder</dt>
                      <dd className="text-sm">
                        {form.getValues().enableReminder ? (
                          <span className="font-semibold">
                            {form.getValues().reminderTime === "15min" && "15 minutes before"}
                            {form.getValues().reminderTime === "1hour" && "1 hour before"}
                            {form.getValues().reminderTime === "1day" && "1 day before"}
                            {' via '}
                            {form.getValues().reminderType}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">None</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-interview-primary hover:bg-interview-primary/90"
                  >
                    Schedule Interview
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </form>
      </Form>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Interview Scheduled!</DialogTitle>
            <DialogDescription className="text-center">
              Your interview has been successfully scheduled.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-500 mb-4">
            Your interview is set for {form.getValues().scheduledDate && form.getValues().scheduledTime && (
              formatDateTime(form.getValues().scheduledDate, form.getValues().scheduledTime)
            )}
          </p>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="w-full sm:w-auto"
              onClick={() => navigate('/dashboard')}
              variant="outline"
            >
              View Dashboard
            </Button>
            <Button 
              className="w-full sm:w-auto"
              onClick={() => {
                setShowSuccessDialog(false);
                form.reset();
                setCurrentStep(1);
              }}
            >
              Schedule Another
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
