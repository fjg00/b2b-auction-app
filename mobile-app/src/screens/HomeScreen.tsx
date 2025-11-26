import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TextInput, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { LotCard } from '../components/LotCard';
import { fetchAuctionsFromSupabase } from '../services/auctionService';
import { Lot } from '@shared/types';
import { Search } from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
    const { user } = useAuth();
    const [auctions, setAuctions] = useState<Lot[]>([]);
    const [filteredAuctions, setFilteredAuctions] = useState<Lot[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useFocusEffect(
        useCallback(() => {
            loadAuctions();
        }, [user])
    );

    const loadAuctions = async () => {
        setLoading(true);
        try {
            const data = await fetchAuctionsFromSupabase(user?.id);
            // Deduplicate by ID just in case
            const uniqueAuctions = Array.from(new Map(data.map(item => [item.id, item])).values());

            setAuctions(uniqueAuctions);
            setFilteredAuctions(uniqueAuctions);
        } catch (error) {
            console.error('Error loading auctions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = auctions.filter(lot =>
            lot.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredAuctions(filtered);
    }, [searchQuery, auctions]);

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
                <Text style={styles.headerTitle}>Browse Auctions</Text>
                <View style={styles.searchBar}>
                    <Search size={20} color={COLORS.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search auctions..."
                        placeholderTextColor={COLORS.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <FlatList
                data={filteredAuctions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <LotCard
                        lot={item}
                        onPress={() => navigation.navigate('ItemDetails', { id: item.id })}
                    />
                )}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
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
        marginBottom: SPACING.md,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: SPACING.sm,
        fontSize: 16,
        color: COLORS.text,
    },
    list: {
        padding: SPACING.md,
    },
});
