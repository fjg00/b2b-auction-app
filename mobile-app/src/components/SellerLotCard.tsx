import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Lot } from '@shared/types';
import { Clock, Eye, Gavel } from 'lucide-react-native';

interface SellerLotCardProps {
    lot: Lot;
    onPress: () => void;
}

export function SellerLotCard({ lot, onPress }: SellerLotCardProps) {
    const getStatusBadge = () => {
        if (lot.status === 'won') {
            // Show transaction status for sold items
            switch (lot.transactionStatus) {
                case 'pending_payment':
                    return (
                        <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7' }]}>
                            <Text style={[styles.statusBadgeText, { color: '#D97706' }]}>AWAITING PAYMENT</Text>
                        </View>
                    );
                case 'payment_sent':
                    return (
                        <View style={[styles.statusBadge, { backgroundColor: '#DBEAFE' }]}>
                            <Text style={[styles.statusBadgeText, { color: '#1E40AF' }]}>CONFIRM PAYMENT</Text>
                        </View>
                    );
                case 'completed':
                    return (
                        <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5' }]}>
                            <Text style={[styles.statusBadgeText, { color: '#059669' }]}>AWAITING PICKUP</Text>
                        </View>
                    );
                case 'handed_over':
                    return (
                        <View style={[styles.statusBadge, { backgroundColor: '#E5E7EB' }]}>
                            <Text style={[styles.statusBadgeText, { color: '#6B7280' }]}>COMPLETED</Text>
                        </View>
                    );
                default:
                    return (
                        <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5' }]}>
                            <Text style={[styles.statusBadgeText, { color: '#059669' }]}>SOLD</Text>
                        </View>
                    );
            }
        }
        return (
            <View style={[styles.statusBadge, { backgroundColor: '#E0F2F1' }]}>
                <Text style={[styles.statusBadgeText, { color: COLORS.primary }]}>ACTIVE</Text>
            </View>
        );
    };

    const formatTimeRemaining = () => {
        const now = new Date();
        const end = new Date(lot.endTime);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return 'Ended';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h left`;
        }
        return `${hours}h ${minutes}m left`;
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.imageContainer}>
                {(lot.images && lot.images.length > 0) || lot.image ? (
                    <Image
                        source={{ uri: lot.images?.[0] || lot.image }}
                        style={styles.image}
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.imagePlaceholderText}>📦</Text>
                    </View>
                )}
                {getStatusBadge()}
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {lot.title}
                </Text>

                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Gavel size={14} color={COLORS.textMuted} />
                        <Text style={styles.metaText}>{lot.bidsCount} bids</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Eye size={14} color={COLORS.textMuted} />
                        <Text style={styles.metaText}>{lot.watchCount || 0} watching</Text>
                    </View>
                </View>

                <View style={styles.priceRow}>
                    <View>
                        <Text style={styles.priceLabel}>
                            {lot.status === 'won' ? 'Sold for' : 'Current Bid'}
                        </Text>
                        <Text style={styles.priceValue}>${lot.currentBid}</Text>
                    </View>
                    {lot.status !== 'won' && (
                        <View style={styles.timeContainer}>
                            <Clock size={14} color={COLORS.secondary} />
                            <Text style={styles.timeText}>{formatTimeRemaining()}</Text>
                        </View>
                    )}
                </View>

                {lot.status === 'won' && (
                    <View style={styles.actionHint}>
                        <Text style={styles.actionHintText}>Tap to manage transaction</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    imageContainer: {
        position: 'relative',
        height: 120,
        backgroundColor: COLORS.background,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        fontSize: 48,
    },
    statusBadge: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
    },
    statusBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    content: {
        padding: SPACING.md,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    metaRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.sm,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: SPACING.sm,
    },
    priceLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: 2,
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFF8E1',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
    },
    timeText: {
        fontSize: 12,
        color: COLORS.secondary,
        fontWeight: '600',
    },
    actionHint: {
        marginTop: SPACING.sm,
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    actionHintText: {
        fontSize: 12,
        color: COLORS.primary,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});
