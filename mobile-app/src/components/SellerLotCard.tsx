import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Lot } from '@shared/types';
import { Clock, Eye, Gavel } from 'lucide-react-native';

interface SellerLotCardProps {
    lot: Lot;
    onPress: () => void;
    footer?: React.ReactNode;
}

export function SellerLotCard({ lot, onPress, footer }: SellerLotCardProps) {
    const getStatusBadge = () => {
        if (lot.status === 'won') return null;

        if ((lot.status as any) === 'unsold') {
            return (
                <View style={[styles.statusBadge, { backgroundColor: '#FEE2E2' }]}>
                    <Text style={[styles.statusBadgeText, { color: '#991B1B' }]}>UNSOLD</Text>
                </View>
            );
        }
        return (
            <View style={[styles.statusBadge, { backgroundColor: '#E0F2F1' }]}>
                <Text style={[styles.statusBadgeText, { color: COLORS.primary }]}>ACTIVE</Text>
            </View>
        );
    };

    const renderTransactionStatus = () => {
        if (lot.status !== 'won') return null;

        let bg, color, text;
        switch (lot.transactionStatus) {
            case 'pending_payment':
                bg = '#FEF3C7'; color = '#D97706'; text = 'AWAITING PAYMENT'; break;
            case 'payment_sent':
                bg = '#DBEAFE'; color = '#1E40AF'; text = 'CONFIRM PAYMENT'; break;
            case 'completed':
                bg = '#D1FAE5'; color = '#059669'; text = 'AWAITING PICKUP'; break;
            case 'handed_over':
                bg = '#E5E7EB'; color = '#6B7280'; text = 'COMPLETED'; break;
            default:
                bg = '#D1FAE5'; color = '#059669'; text = 'SOLD';
        }

        return (
            <View style={[styles.transactionStatusBadge, { backgroundColor: bg }]}>
                <Text style={[styles.transactionStatusText, { color }]}>{text}</Text>
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
                <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={2}>
                        {lot.title}
                    </Text>
                    {renderTransactionStatus()}
                </View>

                {lot.status !== 'won' && (
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
                )}

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

                {footer}
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
        fontSize: 13, // Increased from 11
        fontWeight: 'bold',
    },
    content: {
        padding: SPACING.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.sm,
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1,
    },
    transactionStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
    },
    transactionStatusText: {
        fontSize: 13, // Increased from 11
        fontWeight: 'bold',
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
