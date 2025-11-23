import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { LotCard } from '../components/LotCard';
import { fetchAuctions } from '@shared/api';
import { Lot } from '@shared/types';

export default function MyBidsScreen({ navigation }: any) {
    const [lots, setLots] = useState<Lot[]>([]);

    useEffect(() => {
        loadBids();
    }, []);

    const loadBids = async () => {
        const data = await fetchAuctions();
        // Show items that are won or have bids (simulate "my bids")
        const myBids = data.filter(item => item.status === 'won' || item.bidsCount && item.bidsCount > 0);
        setLots(myBids.slice(0, 3)); // Show up to 3 items
    };

    const handlePress = (item: any) => {
        if (item.status === 'won') {
            navigation.navigate('Transaction', { lotId: item.id });
        } else {
            navigation.navigate('ItemDetails', { id: item.id });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Bids</Text>
            </View>
            <FlatList
                data={lots}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <LotCard lot={item} onPress={() => handlePress(item)} />
                )}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
    },
});
