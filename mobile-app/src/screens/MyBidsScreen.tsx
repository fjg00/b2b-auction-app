import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LotCard } from '../components/LotCard';
import { CompletedTransactionCard } from '../components/CompletedTransactionCard';
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

    useFocusEffect(
        useCallback(() => {
            if (user) {
                loadData();
            }
        }, [user, activeTab])
    );

    const loadData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            if (activeTab === 'bids') {
                const data = await fetchMyBids(user.id);
                setBids(data);
            } else {
                const data = await fetchMyTransactions(user.id);
                // Filter based on tab
                if (activeTab === 'purchased') {
                    setTransactions(data.filter(t => t.status !== 'handed_over'));
                } else {
                    setTransactions(data.filter(t => t.status === 'handed_over'));
                }
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
        if (transaction.status === 'handed_over') {
            navigation.navigate('Invoice', { transactionId: transaction.id });
        } else {
            navigation.navigate('TransactionConfirmation', { transactionId: transaction.id });
        }
    };

    const renderTab = (tab: Tab, label: string) => (
        <TouchableOpacity
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
        >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{label}</Text>
        </TouchableOpacity>
    );

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
                    data={(activeTab === 'bids' ? bids : transactions) as any}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        if (activeTab === 'bids') {
                            return <LotCard lot={item as Lot} onPress={() => handlePress(item as Lot)} />;
                        } else {
                            const tx = item as unknown as Transaction;
                            if (!tx.lot) return null;

                            if (activeTab === 'history') {
                                return (
                                    <CompletedTransactionCard
                                        title={tx.lot.title}
                                        amount={tx.amount}
                                        currency={tx.currency}
                                        date={tx.updatedAt}
                                        otherPartyName={tx.seller?.name || 'Seller'}
                                        transactionId={tx.id}
                                        role="buyer"
                                        onPress={() => handleTransactionPress(tx)}
                                    />
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
});
