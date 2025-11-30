import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import MyBidsScreen from '../screens/MyBidsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SellerProfileScreen from '../screens/SellerProfileScreen';
import CreateLotScreen from '../screens/CreateLotScreen';
import MySalesScreen from '../screens/MySalesScreen';
import TransactionScreen from '../screens/TransactionScreen';
import { COLORS } from '../constants/theme';
import { Home, Gavel, User, Package } from 'lucide-react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textMuted,
                headerShown: false,
                tabBarStyle: {
                    borderTopColor: COLORS.border,
                    backgroundColor: COLORS.surface,
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Home color={color} size={Number(size)} />
                }}
            />
            <Tab.Screen
                name="MyBids"
                component={MyBidsScreen}
                options={{
                    tabBarLabel: 'My Bids',
                    tabBarIcon: ({ color, size }) => <Gavel color={color} size={Number(size)} />
                }}
            />
            <Tab.Screen
                name="MySales"
                component={MySalesScreen}
                options={{
                    tabBarLabel: 'My Sales',
                    tabBarIcon: ({ color, size }) => <Package color={color} size={Number(size)} />
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <User color={color} size={Number(size)} />
                }}
            />
        </Tab.Navigator>
    );
}

import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import SignUpScreen from '../screens/SignUpScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import VerificationScreen from '../screens/VerificationScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import AddressesScreen from '../screens/AddressesScreen';
import TransactionConfirmationScreen from '../screens/TransactionConfirmationScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import InvoiceScreen from '../screens/InvoiceScreen';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from '../services/NotificationService';
import * as Notifications from 'expo-notifications';

export default function RootNavigator() {
    const { session, loading } = useAuth();
    const navigationRef = useNavigationContainerRef();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                // Navigate to ResetPassword screen
                if (navigationRef.isReady()) {
                    // @ts-ignore
                    navigationRef.navigate('ResetPassword');
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [navigationRef]);

    useEffect(() => {
        if (session) {
            registerForPushNotificationsAsync();
        }

        // Handle notification tap
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;

            if (data?.type === 'new_message' && data?.transactionId) {
                if (navigationRef.isReady()) {
                    // @ts-ignore
                    navigationRef.navigate('TransactionConfirmation', {
                        transactionId: data.transactionId,
                        initialChatOpen: true
                    });
                }
            } else if (data?.type === 'auction_won' && data?.transactionId) {
                if (navigationRef.isReady()) {
                    // @ts-ignore
                    navigationRef.navigate('TransactionConfirmation', {
                        transactionId: data.transactionId
                    });
                }
            }
        });

        return () => subscription.remove();
    }, [session, navigationRef]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!session ? (
                    // Auth Stack
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    </>
                ) : (
                    // App Stack
                    <>
                        <Stack.Screen name="Main" component={TabNavigator} />
                        <Stack.Screen
                            name="ItemDetails"
                            component={ItemDetailsScreen}
                            options={{
                                headerShown: true,
                                title: 'Item Details',
                                headerTintColor: COLORS.text,
                            }}
                        />
                        <Stack.Screen
                            name="SellerProfile"
                            component={SellerProfileScreen}
                            options={{
                                headerShown: true,
                                title: 'Seller Profile',
                                headerTintColor: COLORS.text,
                            }}
                        />
                        <Stack.Screen
                            name="Transaction"
                            component={TransactionScreen}
                            options={{
                                headerShown: true,
                                title: 'Transaction Details',
                                headerTintColor: COLORS.text,
                            }}
                        />
                        <Stack.Screen
                            name="CreateLot"
                            component={CreateLotScreen}
                            options={{
                                headerShown: true,
                                title: 'Create New Lot',
                                headerTintColor: COLORS.text,
                            }}
                        />
                        <Stack.Screen
                            name="EditProfile"
                            component={EditProfileScreen}
                            options={{
                                headerShown: true,
                                title: 'Edit Profile',
                                headerTintColor: COLORS.text,
                            }}
                        />
                        <Stack.Screen
                            name="Verification"
                            component={VerificationScreen}
                            options={{
                                headerShown: true,
                                title: 'Business Verification',
                                headerTintColor: COLORS.text,
                            }}
                        />
                        <Stack.Screen
                            name="PaymentMethods"
                            component={PaymentMethodsScreen}
                            options={{
                                headerShown: true,
                                title: 'Payment Methods',
                                headerTintColor: COLORS.text,
                            }}
                        />
                        <Stack.Screen
                            name="Addresses"
                            component={AddressesScreen}
                            options={{
                                headerShown: true,
                                title: 'My Addresses',
                                headerTintColor: COLORS.text,
                            }}
                        />
                        <Stack.Screen
                            name="TransactionConfirmation"
                            component={TransactionConfirmationScreen}
                            options={{
                                headerShown: false, // Custom header in screen
                            }}
                        />
                        <Stack.Screen
                            name="ResetPassword"
                            component={ResetPasswordScreen}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="Invoice"
                            component={InvoiceScreen}
                            options={{
                                headerShown: false,
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
