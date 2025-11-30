import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LotCard } from '../components/LotCard';
import { fetchMyBids, fetchMyTransactions } from '../services/auctionService';
import { Lot, Transaction } from '@shared/types';
import { useAuth } from '../context/AuthContext';

type Tab = 'bids' | 'purchased' | 'history';

export default function MyBidsScreen({ navigation }: any) {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('bids');
    const [bids, setBids] = useState<Lot[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        loadData();

        // Subscribe to changes in 'bids' table
        const bidsSubscription = supabase
            .channel('public:bids')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bids' },
                (payload) => {
                    console.log('Bid change received!', payload);
                    loadData(); // Reload data on any bid change
                }
            )
            .subscribe();

        // Subscribe to changes in 'transactions' table
        const transactionsSubscription = supabase
            .channel('public:transactions')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'transactions' },
                (payload) => {
                    console.log('Transaction change received!', payload);
                    loadData(); // Reload data on any transaction change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(bidsSubscription);
            supabase.removeChannel(transactionsSubscription);
        };
    }, [user, activeTab]);

    const loadData = async () => {
        if (!user) return;
        // Don't set loading to true on updates to avoid flickering
        if (bids.length === 0 && transactions.length === 0) setLoading(true);

        try {
            if (activeTab === 'bids') {
                const data = await fetchMyBids(user.id);
                setBids(data);
            } else {
                // Fetch all transactions regardless of tab
                const data = await fetchMyTransactions(user.id);
                setTransactions(data);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = (item: Lot) => {
        if (item.status === 'won') {
            // Find transaction id if possible, or navigate to item details
            navigation.navigate('ItemDetails', { id: item.id });
        } else {
            navigation.navigate('ItemDetails', { id: item.id });
        }
    };

    const handleTransactionPress = (transaction: Transaction) => {
        navigation.navigate('TransactionConfirmation', { transactionId: transaction.id });
    };

    const renderTab = (tab: Tab, label: string) => (
        <TouchableOpacity
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
        >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{label}</Text>
        </TouchableOpacity>
    );

    // Filter data based on active tab
    const getDisplayData = () => {
        if (activeTab === 'bids') return bids;
        if (activeTab === 'purchased') {
            return transactions.filter(t => t.status !== 'handed_over');
        }
        return transactions.filter(t => t.status === 'handed_over');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Activity</Text>
            </View>

            <View style={styles.tabContainer}>
                {renderTab('bids', 'Active Bids')}
                {renderTab('purchased', 'Purchased Items')}
                {renderTab('history', 'Purchase History')}
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={getDisplayData() as any}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        if (activeTab === 'bids') {
                            return <LotCard lot={item as Lot} onPress={() => handlePress(item as Lot)} />;
                        } else {
                            const tx = item as unknown as Transaction;
                            if (!tx.lot) return null;

                            if (activeTab === 'history') {
                                return (
                                    <TouchableOpacity
                                        style={styles.completedCard}
                                        onPress={() => navigation.navigate('Invoice', { transactionId: tx.id })}
                                    >
                                        <View style={styles.completedContent}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Text style={styles.completedTitle}>{tx.lot.title}</Text>
                                                <View style={styles.invoiceBadge}>
                                                    <Text style={styles.invoiceText}>Invoice Available</Text>
                                                </View>
                                            </View>

                                            <View style={styles.detailsRow}>
                                                <Text style={styles.detailText}>ID: #{tx.id.slice(0, 8).toUpperCase()}</Text>
                                                <Text style={styles.detailText}>•</Text>
                                                <Text style={styles.detailText}>{new Date(tx.createdAt).toLocaleDateString()}</Text>
                                            </View>

                                            <Text style={styles.priceText}>
                                                {tx.currency} {(tx.amount || 0).toLocaleString()}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }

                            const { label, color } = getStatusDetails(tx.status);

                            return (
                                <LotCard
                                    lot={{ ...tx.lot, status: 'won' }}
                                    onPress={() => handleTransactionPress(tx)}
                                    statusLabel={label}
                                    statusColor={color}
                                />
                            );
                        }
                    }}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={{ color: COLORS.textMuted }}>
                                {activeTab === 'bids' ? 'No active bids' : activeTab === 'purchased' ? 'No purchased items yet' : 'No completed purchases'}
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const getStatusDetails = (status: string) => {
    switch (status) {
        case 'pending_payment':
            return { label: 'Pending Payment', color: '#f59e0b' }; // Orange
        case 'payment_sent':
            return { label: 'Payment Sent', color: '#3b82f6' }; // Blue
        case 'payment_confirmed':
            return { label: 'Payment Confirmed', color: '#10b981' }; // Green
        case 'completed':
            return { label: 'Completed', color: '#10b981' }; // Green
        case 'cancelled':
            return { label: 'Cancelled', color: COLORS.error };
        default:
            return { label: 'Won', color: '#10b981' };
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    header: {
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    tabContainer: {
        flexDirection: 'row',
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        gap: SPACING.md,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.sm,
        alignItems: 'center',
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.background,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    activeTabText: {
        color: 'white',
    },
    list: {
        padding: SPACING.md,
        flexGrow: 1,
    },
    completedCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    completedContent: {
        gap: 8,
    },
    completedTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1,
        marginRight: 8,
    },
    invoiceBadge: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    invoiceText: {
        fontSize: 10,
        color: COLORS.textMuted,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    priceText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});
