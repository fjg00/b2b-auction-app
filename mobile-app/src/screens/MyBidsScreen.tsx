import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING } from '../constants/theme';
import { LotCard } from '../components/LotCard';
import { fetchMyBids } from '../services/auctionService';
import { Lot } from '@shared/types';
import { useAuth } from '../context/AuthContext';

export default function MyBidsScreen({ navigation }: any) {
    const { user } = useAuth();
    const [bids, setBids] = useState<Lot[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (user) {
                loadBids();
            }
        }, [user])
    );

    const loadBids = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await fetchMyBids(user.id);
            setBids(data);
        } catch (error) {
            console.error('Error loading bids:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = (item: Lot) => {
        if (item.status === 'won') {
            navigation.navigate('Transaction', { lotId: item.id });
        } else {
            navigation.navigate('ItemDetails', { id: item.id });
        }
    };

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
                <Text style={styles.headerTitle}>My Bids</Text>
            </View>
            <FlatList
                data={bids}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <LotCard lot={item} onPress={() => handlePress(item)} />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={{ color: COLORS.textMuted }}>No bids yet</Text>
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
    },
    list: {
        padding: SPACING.md,
        flexGrow: 1,
    },
});
