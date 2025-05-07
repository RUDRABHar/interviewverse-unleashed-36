
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useSupportCenter, SupportTicket } from '@/hooks/useSupportCenter';
import { Toaster } from '@/components/ui/toaster';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import GlassCard from '@/components/ui/design-system/GlassCard';
import {
  Loader2,
  Search,
  Send,
  Upload,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  User,
  Bot,
  MessageSquare
} from 'lucide-react';

const Support: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("knowledge-base");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Form states
  const [ticket, setTicket] = useState<SupportTicket>({
    category: 'bug',
    subject: '',
    description: '',
    priority: 'medium'
  });

  // Get user from Supabase on mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUser(user);
    };
    
    getCurrentUser();
  }, [navigate]);

  const { 
    loading,
    submitting,
    filteredFAQs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    chatMessages,
    sendMessage,
    userProfile,
    submitTicket
  } = useSupportCenter(user?.id);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Handle ticket form submission
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticket.subject || !ticket.description) {
      return;
    }
    
    const newTicketId = await submitTicket(ticket);
    
    if (newTicketId) {
      setTicketId(newTicketId);
      setTicketSubmitted(true);
    }
  };

  // Handle chat form submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    
    if (input.value.trim()) {
      sendMessage(input.value);
      input.value = '';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  const messageBubbleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-interview-primary" />
        <span className="ml-2 text-lg">Loading support center...</span>
      </div>
    );
  }

  // Suggested chat prompts
  const chatSuggestions = [
    "How do I reset my password?",
    "How to retake an interview?",
    "Where is my interview history?"
  ];

  return (
    <motion.div 
      className="container py-8 md:py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Need Help?</h1>
        </div>
      </motion.div>

      <Tabs 
        defaultValue="knowledge-base" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <TabsList className="w-full md:w-auto grid grid-cols-3 gap-2">
            <TabsTrigger value="knowledge-base" className="flex items-center gap-2 text-sm md:text-base">
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger value="submit-ticket" className="flex items-center gap-2 text-sm md:text-base">
              Submit Ticket
            </TabsTrigger>
            <TabsTrigger value="live-support" className="flex items-center gap-2 text-sm md:text-base">
              AI Assistant
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge-base" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>Find answers to common questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search for help articles..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge 
                    variant={selectedCategory === 'all' || !selectedCategory ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All
                  </Badge>
                  <Badge 
                    variant={selectedCategory === 'account' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory('account')}
                  >
                    Account
                  </Badge>
                  <Badge 
                    variant={selectedCategory === 'interview' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory('interview')}
                  >
                    Interview
                  </Badge>
                  <Badge 
                    variant={selectedCategory === 'voice' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory('voice')}
                  >
                    Voice
                  </Badge>
                  <Badge 
                    variant={selectedCategory === 'analytics' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory('analytics')}
                  >
                    Analytics
                  </Badge>
                  <Badge 
                    variant={selectedCategory === 'billing' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory('billing')}
                  >
                    Billing
                  </Badge>
                </div>

                <div className="mt-6 space-y-2">
                  {filteredFAQs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFAQs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-start">
                              <span>{faq.question}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {faq.category}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                              {faq.answer}
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                              <Button variant="ghost" size="sm" className="text-xs">
                                Was this helpful?
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">No results found. Try adjusting your search.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory(null);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Submit Ticket Tab */}
        <TabsContent value="submit-ticket" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
                <CardDescription>Let us know how we can help you</CardDescription>
              </CardHeader>
              <CardContent>
                {!ticketSubmitted ? (
                  <form onSubmit={handleTicketSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="ticket-category">Category</Label>
                        <Select
                          value={ticket.category}
                          onValueChange={(value: SupportTicket['category']) => {
                            setTicket({...ticket, category: value});
                          }}
                        >
                          <SelectTrigger id="ticket-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bug">Bug Report</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ticket-priority">Priority</Label>
                        <Select
                          value={ticket.priority}
                          onValueChange={(value: SupportTicket['priority']) => {
                            setTicket({...ticket, priority: value});
                          }}
                        >
                          <SelectTrigger id="ticket-priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ticket-subject">Subject</Label>
                      <Input 
                        id="ticket-subject" 
                        placeholder="Brief summary of your issue"
                        value={ticket.subject}
                        onChange={(e) => setTicket({...ticket, subject: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ticket-description">Description</Label>
                      <Textarea 
                        id="ticket-description" 
                        placeholder="Please provide details about your issue"
                        rows={5}
                        value={ticket.description}
                        onChange={(e) => setTicket({...ticket, description: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ticket-screenshot">Attachment (Optional)</Label>
                      <div className="flex items-center gap-3">
                        <Button type="button" variant="outline" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Upload Screenshot
                        </Button>
                        <p className="text-sm text-muted-foreground">Max size: 5MB</p>
                      </div>
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Ticket'
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="py-8 text-center">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-8 w-8 text-green-600 dark:text-green-300" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ticket Submitted!</h3>
                    <p className="text-muted-foreground mb-4">
                      Your ticket has been submitted successfully.<br />
                      Ticket ID: <span className="font-medium">{ticketId}</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setTicketSubmitted(false);
                          setTicket({
                            category: 'bug',
                            subject: '',
                            description: '',
                            priority: 'medium'
                          });
                        }}
                      >
                        Submit Another Ticket
                      </Button>
                      <Button onClick={() => setActiveTab("knowledge-base")}>
                        Back to Knowledge Base
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Live Support Tab */}
        <TabsContent value="live-support" className="space-y-6">
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-interview-primary/20 flex items-center justify-center mr-2">
                        <Bot className="h-5 w-5 text-interview-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">AI Support Assistant</CardTitle>
                        <CardDescription>Quick help for common questions</CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="rounded-full h-8 w-8"
                    >
                      {soundEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                  <div className="h-[400px] overflow-y-auto flex flex-col gap-4 pr-2">
                    <AnimatePresence>
                      {chatMessages.map((message) => (
                        <motion.div
                          key={message.id}
                          variants={messageBubbleVariants}
                          initial="hidden"
                          animate="visible"
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`flex max-w-[80%] ${
                              message.role === 'user' 
                                ? 'flex-row-reverse' 
                                : 'flex-row'
                            }`}
                          >
                            <div 
                              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                message.role === 'user'
                                  ? 'ml-2 bg-gray-200 dark:bg-gray-700'
                                  : 'mr-2 bg-interview-primary/20'
                              }`}
                            >
                              {message.role === 'user' ? (
                                <User className="h-4 w-4" />
                              ) : (
                                <Bot className="h-4 w-4 text-interview-primary" />
                              )}
                            </div>
                            <div 
                              className={`rounded-2xl px-4 py-2 ${
                                message.role === 'user'
                                  ? 'bg-interview-primary text-white'
                                  : 'bg-gray-100 dark:bg-gray-800'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{message.content}</p>
                              <p 
                                className={`text-xs mt-1 ${
                                  message.role === 'user'
                                    ? 'text-white/70'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50/50 dark:bg-gray-800/20">
                  <form onSubmit={handleChatSubmit} className="w-full space-y-2">
                    <div className="flex gap-2">
                      <Input 
                        name="message" 
                        placeholder="Type your question..."
                        className="flex-grow"
                      />
                      <Button type="submit" className="flex-shrink-0" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {chatSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => sendMessage(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </form>
                </CardFooter>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <GlassCard className="h-full p-4">
                <h3 className="text-lg font-semibold mb-4">Tips for using AI Support</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-interview-primary/10 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-interview-primary"></div>
                    </div>
                    <span>Ask specific questions for better answers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-interview-primary/10 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-interview-primary"></div>
                    </div>
                    <span>Provide context about what you're trying to do</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-interview-primary/10 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-interview-primary"></div>
                    </div>
                    <span>For complex issues, submit a ticket instead</span>
                  </li>
                </ul>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
                  <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      onClick={() => setActiveTab("submit-ticket")}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Submit Support Ticket
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      onClick={() => navigate('/settings')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Go to Account Settings
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      <Toaster />
    </motion.div>
  );
};

export default Support;
