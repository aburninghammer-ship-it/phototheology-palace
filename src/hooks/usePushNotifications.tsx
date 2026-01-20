import { useEffect, useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UsePushNotificationsReturn {
  isSupported: boolean;
  isRegistered: boolean;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unknown';
  requestPermission: () => Promise<boolean>;
  registerToken: () => Promise<void>;
  unregisterToken: () => Promise<void>;
}

export const usePushNotifications = (): UsePushNotificationsReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');

  // Check if push notifications are supported (native platforms only)
  useEffect(() => {
    const checkSupport = async () => {
      const isNative = Capacitor.isNativePlatform();
      setIsSupported(isNative);

      if (isNative) {
        try {
          const result = await PushNotifications.checkPermissions();
          setPermissionStatus(result.receive as 'prompt' | 'granted' | 'denied');
        } catch (error) {
          console.error('Error checking push permission:', error);
          setPermissionStatus('unknown');
        }
      }
    };

    checkSupport();
  }, []);

  // Request permission for push notifications
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.log('Push notifications not supported on this platform');
      return false;
    }

    try {
      const result = await PushNotifications.requestPermissions();
      const granted = result.receive === 'granted';
      setPermissionStatus(result.receive as 'prompt' | 'granted' | 'denied');
      return granted;
    } catch (error) {
      console.error('Error requesting push permission:', error);
      return false;
    }
  }, [isSupported]);

  // Register device token with backend
  const registerToken = useCallback(async () => {
    if (!isSupported || !user) return;

    try {
      // Request permission first
      const granted = await requestPermission();
      if (!granted) {
        toast({
          title: 'Permission denied',
          description: 'Enable notifications in your device settings to receive updates.',
          variant: 'destructive',
        });
        return;
      }

      // Register with APNS/FCM
      await PushNotifications.register();
    } catch (error) {
      console.error('Error registering for push:', error);
    }
  }, [isSupported, user, requestPermission, toast]);

  // Unregister device token
  const unregisterToken = useCallback(async () => {
    if (!user) return;

    try {
      // Get current token from storage
      const storedToken = localStorage.getItem('push_token');
      if (storedToken) {
        // Deactivate token in database
        await supabase
          .from('push_tokens')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('token', storedToken);

        localStorage.removeItem('push_token');
        setIsRegistered(false);
      }
    } catch (error) {
      console.error('Error unregistering push token:', error);
    }
  }, [user]);

  // Set up push notification listeners
  useEffect(() => {
    if (!isSupported || !user) return;

    // Handle registration success
    const registrationListener = PushNotifications.addListener('registration', async (token: Token) => {
      console.log('Push registration success, token:', token.value);

      try {
        const platform = Capacitor.getPlatform() as 'ios' | 'android' | 'web';

        // Store token in database
        const { error } = await supabase
          .from('push_tokens')
          .upsert({
            user_id: user.id,
            token: token.value,
            platform,
            is_active: true,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,token',
          });

        if (error) {
          console.error('Error storing push token:', error);
        } else {
          localStorage.setItem('push_token', token.value);
          setIsRegistered(true);
        }
      } catch (error) {
        console.error('Error saving push token:', error);
      }
    });

    // Handle registration error
    const registrationErrorListener = PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
      toast({
        title: 'Notification Setup Failed',
        description: 'Could not enable push notifications. Please try again.',
        variant: 'destructive',
      });
    });

    // Handle incoming notification when app is in foreground
    const notificationReceivedListener = PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received:', notification);

      // Show in-app toast for foreground notifications
      toast({
        title: notification.title || 'New Notification',
        description: notification.body || '',
      });
    });

    // Handle notification tap (app opened from notification)
    const notificationActionListener = PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      console.log('Push notification action:', action);

      const data = action.notification.data;

      // Handle navigation based on notification type
      if (data?.type === 'dm') {
        // Open DM conversation
        window.dispatchEvent(new CustomEvent('open-chat-sidebar', {
          detail: { conversationId: data.conversationId }
        }));
      } else if (data?.type === 'group_chat') {
        // Navigate to group chat room
        window.location.href = `/living-manna?room=${data.roomId}`;
      } else if (data?.type === 'announcement') {
        // Navigate to announcements
        window.location.href = '/living-manna?tab=chat';
      }
    });

    // Check if already registered
    const checkRegistration = async () => {
      const storedToken = localStorage.getItem('push_token');
      if (storedToken) {
        const { data } = await supabase
          .from('push_tokens')
          .select('is_active')
          .eq('user_id', user.id)
          .eq('token', storedToken)
          .single();

        setIsRegistered(data?.is_active ?? false);
      }
    };

    checkRegistration();

    // Cleanup listeners
    return () => {
      registrationListener.then(l => l.remove());
      registrationErrorListener.then(l => l.remove());
      notificationReceivedListener.then(l => l.remove());
      notificationActionListener.then(l => l.remove());
    };
  }, [isSupported, user, toast]);

  return {
    isSupported,
    isRegistered,
    permissionStatus,
    requestPermission,
    registerToken,
    unregisterToken,
  };
};
