import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { User, Settings, LogOut, ChevronRight, CreditCard, Bell, Package } from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }: any) {
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            // Navigation to Login is handled by RootNavigator
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <User size={40} color={COLORS.primary} />
                </View>
                <Text style={styles.name}>{user?.user_metadata?.full_name || 'User'}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Verified Buyer</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SellerProfile', { id: '1' })}>
                    <View style={styles.menuIcon}>
                        <User size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.menuText}>View Demo Seller Profile</Text>
                    <ChevronRight size={20} color={COLORS.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <User size={20} color={COLORS.text} />
                    </View>
                    <Text style={styles.menuText}>Personal Information</Text>
                    <ChevronRight size={20} color={COLORS.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <CreditCard size={20} color={COLORS.text} />
                    </View>
                    <Text style={styles.menuText}>Payment Methods</Text>
                    <ChevronRight size={20} color={COLORS.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIcon}>
                        <Bell size={20} color={COLORS.text} />
                    </View>
                    <Text style={styles.menuText}>Notifications</Text>
                    <ChevronRight size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Developer / Testing</Text>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('SellerTransaction', { transactionId: 'TX-12345' })}
                >
                    <View style={styles.menuIcon}>
                        <Package size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.menuText}>View Seller Transaction (Test)</Text>
                    <ChevronRight size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>App Settings</Text>
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <View style={styles.menuIcon}>
                        <LogOut size={20} color={COLORS.error} />
                    </View>
                    <Text style={[styles.menuText, { color: COLORS.error }]}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        alignItems: 'center',
        padding: SPACING.xl,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        marginBottom: SPACING.lg,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: SPACING.md,
    },
    badge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: 4,
        borderRadius: RADIUS.full,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    section: {
        backgroundColor: COLORS.surface,
        marginBottom: SPACING.lg,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMuted,
        padding: SPACING.md,
        paddingBottom: SPACING.xs,
        backgroundColor: COLORS.background,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    menuIcon: {
        width: 32,
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
});
