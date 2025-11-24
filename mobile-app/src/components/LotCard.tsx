import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Clock, MapPin } from 'lucide-react-native';
import { Lot } from '@shared/types';

interface LotCardProps {
    lot: Lot;
    onPress: () => void;
}

export const LotCard: React.FC<LotCardProps> = ({ lot, onPress }) => {
    const getTimeRemaining = () => {
        const now = new Date();
        const end = new Date(lot.endTime);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return 'Ended';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <Image source={{ uri: lot.image }} style={styles.image} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={2}>{lot.title}</Text>
                    <View style={[styles.badge, { backgroundColor: COLORS.primaryLight }]}>
                        <Text style={[styles.badgeText, { color: COLORS.primary }]}>{lot.condition}</Text>
                    </View>
                </View>

                <View style={styles.metaRow}>
                    <MapPin size={14} color={COLORS.textMuted} />
                    <Text style={styles.metaText}>{lot.location}</Text>
                </View>

                <View style={styles.footer}>
                    <View>
                        <Text style={styles.label}>{lot.status === 'won' ? 'Winning Bid' : 'Current Bid'}</Text>
                        <Text style={styles.price}>${lot.currentBid.toLocaleString()}</Text>
                    </View>

                    {lot.status === 'won' ? (
                        <View style={styles.wonBadge}>
                            <Text style={styles.wonText}>WON</Text>
                        </View>
                    ) : (
                        <View style={styles.timer}>
                            <Clock size={14} color={COLORS.error} />
                            <Text style={styles.timerText}>{getTimeRemaining()}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: COLORS.border,
    },
    content: {
        padding: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.sm,
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginRight: SPACING.sm,
    },
    badge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.full,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    metaText: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginLeft: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: SPACING.sm,
    },
    label: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    timer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fee2e2', // Red 100
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.sm,
    },
    timerText: {
        fontSize: 12,
        color: COLORS.error,
        fontWeight: '500',
        marginLeft: 4,
    },
    wonBadge: {
        backgroundColor: '#d1fae5', // Green 100
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.sm,
    },
    wonText: {
        fontSize: 14,
        color: '#059669', // Green 600
        fontWeight: 'bold',
    },
});
