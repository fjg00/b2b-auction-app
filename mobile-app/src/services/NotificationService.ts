import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }

        // Get the token
        try {
            const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;

            if (!projectId) {
                console.warn('Project ID not found. Skipping push token registration.');
                console.warn('To fix this: Set EXPO_PUBLIC_PROJECT_ID in your .env file.');
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            console.log('Expo Push Token:', token);

            // Save token to user profile if logged in
            await savePushToken(token);
        } catch (error) {
            console.error('Error fetching push token:', error);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

async function savePushToken(token: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update profile with push token (assuming column exists, or we can store in a separate table)
    // For now, we'll just log it as we might need to add a column to profiles
    console.log('Saving push token for user:', user.id, token);

    const { error } = await supabase
        .from('users')
        .update({ push_token: token })
        .eq('id', user.id);

    if (error) console.error('Error saving push token:', error);
}
