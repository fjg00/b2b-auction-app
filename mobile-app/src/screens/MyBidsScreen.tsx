import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LotCard } from '../components/LotCard';
import { fetchMyBids, fetchMyTransactions } from '../services/auctionService';
import { Lot, Transaction } from '@shared/types';
import { useAuth } from '../context/AuthContext';

type Tab = 'bids' | 'purchased';

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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Activity</Text>
            </View>

            <View style={styles.tabContainer}>
                {renderTab('bids', 'Active Bids')}
                {renderTab('purchased', 'Purchased Items')}
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
                            return (
                                <LotCard
                                    lot={{ ...tx.lot, status: 'won' }}
                                    onPress={() => handleTransactionPress(tx)}
                                />
                            );
                        }
                    }}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={{ color: COLORS.textMuted }}>
                                {activeTab === 'bids' ? 'No active bids' : 'No purchased items yet'}
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

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
