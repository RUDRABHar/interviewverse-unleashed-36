
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { useUserSettings } from '@/hooks/useUserSettings';
import { motion } from 'framer-motion';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Loader2,
  Upload,
  LogOut,
  Trash2,
  Clock,
  Eye,
  EyeOff,
  ChevronRight
} from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  
  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    saving,
    userSettings,
    setUserSettings,
    updateProfile,
    updatePreferences,
    updateNotifications,
    changePassword,
    logoutAllDevices,
    deleteAccount
  } = useUserSettings(user?.id);

  // Handle profile submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userSettings) {
      updateProfile({
        full_name: userSettings.profile.full_name,
        preferred_language: userSettings.profile.preferred_language,
      });
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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

  if (loading || !userSettings) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-interview-primary" />
        <span className="ml-2 text-lg">Loading settings...</span>
      </div>
    );
  }

  // Handler for updating full name input
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userSettings && setUserSettings) {
      setUserSettings({
        ...userSettings,
        profile: {
          ...userSettings.profile,
          full_name: e.target.value
        }
      });
    }
  };

  // Handler for updating preferred language
  const handleLanguageChange = (value: string) => {
    if (userSettings && setUserSettings) {
      setUserSettings({
        ...userSettings,
        profile: {
          ...userSettings.profile,
          preferred_language: value
        }
      });
    }
  };

  return (
    <motion.div 
      className="container py-8 md:py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Account Settings</h1>
        </div>
      </motion.div>

      <Tabs 
        defaultValue="profile" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} /> Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <SettingsIcon size={16} /> Preferences
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield size={16} /> Security
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                      <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {userSettings.profile.avatar_url ? (
                          <img 
                            src={userSettings.profile.avatar_url}
                            alt="Profile"
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <User className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <Button type="button" variant="outline" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName"
                      value={userSettings.profile.full_name || ''}
                      onChange={handleFullNameChange}
                      placeholder="Your full name" 
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      value={user?.email || ''}
                      disabled
                      placeholder="Your email" 
                    />
                    <p className="text-sm text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select
                      value={userSettings.profile.preferred_language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Appearance & Experience</CardTitle>
                <CardDescription>Customize how InterviewXpert looks and behaves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Theme Preference</p>
                    <p className="text-sm text-muted-foreground">Choose how the interface appears</p>
                  </div>
                  <Select
                    value={userSettings.preferences.theme}
                    onValueChange={(value: 'light' | 'dark' | 'auto') => {
                      updatePreferences({ theme: value });
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Voice Feedback</p>
                    <p className="text-sm text-muted-foreground">Enable audio feedback during interviews</p>
                  </div>
                  <Switch 
                    checked={userSettings.preferences.voice_feedback}
                    onCheckedChange={(checked) => {
                      updatePreferences({ voice_feedback: checked });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Text Animations</p>
                    <p className="text-sm text-muted-foreground">Enable animated transitions for content</p>
                  </div>
                  <Switch 
                    checked={userSettings.preferences.text_animations}
                    onCheckedChange={(checked) => {
                      updatePreferences({ text_animations: checked });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Question Read Aloud</p>
                    <p className="text-sm text-muted-foreground">Have questions read aloud during interviews</p>
                  </div>
                  <Switch 
                    checked={userSettings.preferences.question_read_aloud}
                    onCheckedChange={(checked) => {
                      updatePreferences({ question_read_aloud: checked });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Timezone</p>
                    <p className="text-sm text-muted-foreground">Select your preferred timezone for scheduling</p>
                  </div>
                  <Select
                    value={userSettings.preferences.timezone}
                    onValueChange={(value) => {
                      updatePreferences({ timezone: value });
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">GMT/UTC</SelectItem>
                      <SelectItem value="Asia/Tokyo">Japan Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Control which notifications you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="email-reminders" 
                      checked={userSettings.notifications.email_reminders}
                      onCheckedChange={(checked) => {
                        updateNotifications({ email_reminders: checked === true });
                      }}
                    />
                    <div>
                      <Label htmlFor="email-reminders" className="font-medium">Email Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about upcoming interviews</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sms-alerts" 
                      checked={userSettings.notifications.sms_alerts}
                      onCheckedChange={(checked) => {
                        updateNotifications({ sms_alerts: checked === true });
                      }}
                    />
                    <div>
                      <Label htmlFor="sms-alerts" className="font-medium">SMS Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive text messages for important notifications</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="interview-tips" 
                      checked={userSettings.notifications.interview_prep_tips}
                      onCheckedChange={(checked) => {
                        updateNotifications({ interview_prep_tips: checked === true });
                      }}
                    />
                    <div>
                      <Label htmlFor="interview-tips" className="font-medium">Interview Prep Tips</Label>
                      <p className="text-sm text-muted-foreground">Receive tips to improve interview performance</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency" className="font-medium">Notification Frequency</Label>
                  <Select
                    value={userSettings.notifications.notification_frequency}
                    onValueChange={(value: 'weekly' | 'bi-weekly' | 'off') => {
                      updateNotifications({ notification_frequency: value });
                    }}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="off">Off</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">How often you want to receive non-urgent notifications</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Password Change</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input 
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input 
                        id="new-password"
                        type={newPasswordVisible ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password" 
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                      >
                        {newPasswordVisible ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirm-password"
                        type={confirmPasswordVisible ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password" 
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      >
                        {confirmPasswordVisible ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}

                  <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">Protect your account with two-factor authentication</p>
                  </div>
                  <Switch disabled />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Device Logins</CardTitle>
                <CardDescription>See where your account is being used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userSettings.security.recent_logins?.map((login, index) => (
                    <div key={index} className="flex items-start justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{login.device}</p>
                        <p className="text-sm text-muted-foreground">{login.location}</p>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{new Date(login.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      {index === 0 && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account access and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => setLogoutDialogOpen(true)}
                >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout from All Devices</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-between text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:text-red-400"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <div className="flex items-center">
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span>Delete Account</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteAccount();
                navigate('/auth');
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout from all devices?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out from all devices where you are currently signed in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await logoutAllDevices();
                navigate('/auth');
              }}
            >
              Logout All Devices
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </motion.div>
  );
};

export default Settings;
