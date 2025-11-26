import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { SellerLotCard } from '../components/SellerLotCard';
import { fetchMySales } from '../services/auctionService';
import { Lot } from '@shared/types';
import { PlusCircle } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export default function MySalesScreen({ navigation }: any) {
    const { user } = useAuth();
    const [sales, setSales] = useState<Lot[]>([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active');

    useFocusEffect(
        useCallback(() => {
            if (user) {
                loadSales();
            }
        }, [user])
    );

    const loadSales = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await fetchMySales(user.id);
            setSales(data);
        } catch (error) {
            console.error('Error loading sales:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = (item: Lot) => {
        if (item.status === 'won') {
            navigation.navigate('Transaction', { lotId: item.id, role: 'seller' });
        } else {
            navigation.navigate('ItemDetails', { id: item.id, isSeller: true });
        }
    };

    const handleCreateLot = () => {
        navigation.navigate('CreateLot');
    };

    const filteredSales = sales.filter(item => {
        if (activeTab === 'active') return item.status === 'active';
        return item.status === 'won';
    });

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Sales</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleCreateLot}>
                    <PlusCircle size={24} color="white" />
                    <Text style={styles.addButtonText}>List New Item</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'active' && styles.activeTab]}
                    onPress={() => setActiveTab('active')}
                >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active Listings</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'sold' && styles.activeTab]}
                    onPress={() => setActiveTab('sold')}
                >
                    <Text style={[styles.tabText, activeTab === 'sold' && styles.activeTabText]}>Sold Items</Text>
                </TouchableOpacity>
            </View>

            {filteredSales.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>
                        {activeTab === 'active' ? 'No active listings' : 'No sold items yet'}
                    </Text>
                    <Text style={styles.emptyText}>
                        {activeTab === 'active'
                            ? 'Start selling by listing your first item'
                            : 'Items you sell will appear here'}
                    </Text>
                    {activeTab === 'active' && (
                        <TouchableOpacity style={styles.emptyButton} onPress={handleCreateLot}>
                            <PlusCircle size={20} color={COLORS.primary} />
                            <Text style={styles.emptyButtonText}>List Your First Item</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <FlatList
                    data={filteredSales}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <SellerLotCard lot={item} onPress={() => handlePress(item)} />
                    )}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
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
        marginBottom: SPACING.md,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.md,
        gap: 8,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
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
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: COLORS.surface,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    emptyButtonText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
