import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  preferred_language?: string;
  avatar_url?: string;
}

interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  voice_feedback?: boolean;
  text_animations?: boolean;
  question_read_aloud?: boolean;
  timezone?: string;
}

interface UserNotifications {
  email_reminders?: boolean;
  sms_alerts?: boolean;
  interview_prep_tips?: boolean;
  notification_frequency?: 'weekly' | 'bi-weekly' | 'off';
}

interface SecuritySettings {
  recent_logins?: {
    device: string;
    location: string;
    timestamp: string;
  }[];
}

export interface UserSettings {
  profile: UserProfile;
  preferences: UserPreferences;
  notifications: UserNotifications;
  security: SecuritySettings;
}

export const useUserSettings = (userId: string | undefined) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  // Fetch user settings from Supabase
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch profile data from user_profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;

        // For now, let's create mock data for the other settings
        // In a real implementation, these would come from other tables or profile JSON fields
        const defaultSettings: UserSettings = {
          profile: {
            id: userId,
            full_name: profileData?.full_name || '',
            email: '',
            preferred_language: profileData?.preferred_language || 'English',
            avatar_url: '',
          },
          preferences: {
            theme: 'auto',
            voice_feedback: true,
            text_animations: true,
            question_read_aloud: false,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          notifications: {
            email_reminders: true,
            sms_alerts: false,
            interview_prep_tips: true,
            notification_frequency: 'weekly',
          },
          security: {
            recent_logins: [
              {
                device: 'Chrome on Windows',
                location: 'San Francisco, CA',
                timestamp: new Date().toISOString(),
              },
            ],
          },
        };

        // Merge the fetched profile data with our default settings
        setUserSettings(defaultSettings);
      } catch (error) {
        console.error('Error fetching user settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load user settings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [userId]);

  // Update user profile
  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!userSettings || !userId) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.full_name,
          preferred_language: profile.preferred_language,
          // We'd handle avatar_url separately with storage
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      setUserSettings({
        ...userSettings,
        profile: { ...userSettings.profile, ...profile },
      });
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Update user preferences
  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!userSettings || !userId) return;
    
    try {
      setSaving(true);
      
      // In a real implementation, you would save to a preferences table or JSON field
      // For now, we'll just update the state
      
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setUserSettings({
        ...userSettings,
        preferences: { ...userSettings.preferences, ...preferences },
      });
      
      toast({
        title: 'Success',
        description: 'Preferences updated successfully',
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update preferences',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Update notification settings
  const updateNotifications = async (notifications: Partial<UserNotifications>) => {
    if (!userSettings || !userId) return;
    
    try {
      setSaving(true);
      
      // In a real implementation, you would save to a notifications table or JSON field
      // For now, we'll just update the state
      
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setUserSettings({
        ...userSettings,
        notifications: { ...userSettings.notifications, ...notifications },
      });
      
      toast({
        title: 'Success',
        description: 'Notification settings updated successfully',
      });
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notifications',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setSaving(true);
      
      // In a real implementation, you would use Supabase Auth to update password
      // This is just a mock for now
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: 'Failed to change password',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Logout from all devices
  const logoutAllDevices = async () => {
    try {
      setSaving(true);
      
      // In a real implementation, you would use Supabase Auth
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: 'Success',
        description: 'Logged out from all devices',
      });
      
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error',
        description: 'Failed to logout from all devices',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      setSaving(true);
      
      // This would typically involve multiple steps:
      // 1. Delete user data from various tables
      // 2. Delete the auth user
      // For now, we'll just mock it
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: 'Account Deleted',
        description: 'Your account has been deleted successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete account',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    userSettings,
    setUserSettings, // Make sure we're exporting this function
    updateProfile,
    updatePreferences,
    updateNotifications,
    changePassword,
    logoutAllDevices,
    deleteAccount,
  };
};
