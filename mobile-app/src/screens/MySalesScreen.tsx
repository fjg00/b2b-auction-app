import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Alert, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import * as auctionService from '../services/auctionService';
import { Lot } from '@shared/types';
import { useAuth } from '../context/AuthContext';
import { PlusCircle } from 'lucide-react-native';
import { SellerLotCard } from '../components/SellerLotCard';

export default function MySalesScreen({ navigation }: any) {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'completed' | 'unsold'>('active');
    const [sales, setSales] = useState<Lot[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadSales();
    }, [user]);

    const loadSales = async () => {
        if (!user) return;
        try {
            const data = await auctionService.fetchMySales(user.id);
            setSales(data);
        } catch (error) {
            console.error('Error loading sales:', error);
            Alert.alert('Error', 'Failed to load sales');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadSales();
    };

    const handleRelist = async (lotId: string) => {
        try {
            Alert.alert(
                'Relist Item',
                'Are you sure you want to relist this item for 7 days?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Relist',
                        onPress: async () => {
                            setLoading(true);
                            await auctionService.relistLot(lotId);
                            await loadSales(); // Reload to see changes
                            Alert.alert('Success', 'Item relisted successfully');
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to relist item');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLot = () => {
        navigation.navigate('CreateLot');
    };

    const filteredSales = sales.filter(item => {
        const isExpired = new Date(item.endTime) < new Date();
        const hasBids = (item.bidsCount || 0) > 0;
        const isSold = item.status === 'won';
        const isCompleted = item.transactionStatus === 'handed_over';

        if (activeTab === 'active') return !isExpired && !isSold;

        // Sold means won but NOT yet handed over (pending)
        if (activeTab === 'sold') return isSold && !isCompleted;

        // Completed means won AND handed over
        if (activeTab === 'completed') return isSold && isCompleted;

        // Unsold means expired AND no bids (and not marked as won)
        if (activeTab === 'unsold') return isExpired && !hasBids && !isSold;

        return false;
    });

    const renderItem = ({ item }: { item: any }) => {
        if (activeTab === 'completed') {
            return (
                <TouchableOpacity
                    style={styles.completedCard}
                    onPress={() => {
                        if (item.transactionId) {
                            navigation.navigate('Invoice', { transactionId: item.transactionId });
                        } else {
                            Alert.alert('Error', 'Invoice not available yet');
                        }
                    }}
                >
                    <View style={styles.completedContent}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Text style={styles.completedTitle}>{item.title}</Text>
                            <View style={styles.invoiceBadge}>
                                <Text style={styles.invoiceText}>Invoice Available</Text>
                            </View>
                        </View>

                        <View style={styles.detailsRow}>
                            <Text style={styles.detailText}>ID: #{item.transactionId ? item.transactionId.slice(0, 8).toUpperCase() : 'N/A'}</Text>
                            <Text style={styles.detailText}>•</Text>
                            <Text style={styles.detailText}>{new Date(item.created_at).toLocaleDateString()}</Text>
                        </View>

                        <Text style={styles.priceText}>
                            {item.currency || '$'} {(item.currentBid || 0).toLocaleString()}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }

        // Prepare lot object for SellerLotCard
        const displayLot = { ...item };
        if (activeTab === 'unsold') {
            displayLot.status = 'unsold';
        } else if (activeTab === 'active') {
            displayLot.status = 'active';
        }

        return (
            <SellerLotCard
                lot={displayLot}
                onPress={() => {
                    if (activeTab === 'sold') {
                        if (item.transactionId) {
                            navigation.navigate('TransactionConfirmation', { transactionId: item.transactionId });
                        } else {
                            Alert.alert('Processing', 'Transaction is being generated...');
                        }
                    } else {
                        navigation.navigate('ItemDetails', { id: item.id });
                    }
                }}
                footer={
                    activeTab === 'unsold' ? (
                        <TouchableOpacity
                            style={styles.relistButton}
                            onPress={() => handleRelist(item.id)}
                        >
                            <Text style={styles.relistButtonText}>Relist Item</Text>
                        </TouchableOpacity>
                    ) : null
                }
            />
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Sales</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleCreateLot}>
                    <PlusCircle size={24} color="white" />
                    <Text style={styles.addButtonText}>List New Item</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                {['active', 'sold', 'completed', 'unsold'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab as any)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredSales}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No items found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: RADIUS.md,
        gap: 4,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
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
        color: COLORS.textMuted,
        fontWeight: '600',
        fontSize: 14,
    },
    activeTabText: {
        color: 'white',
    },
    listContent: {
        padding: SPACING.md,
    },
    emptyContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.textMuted,
        fontSize: 16,
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
    completedPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    completedDate: {
        fontSize: 14,
        color: COLORS.textMuted,
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
    relistButton: {
        marginTop: SPACING.sm,
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.sm,
        alignItems: 'center',
    },
    relistButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
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
