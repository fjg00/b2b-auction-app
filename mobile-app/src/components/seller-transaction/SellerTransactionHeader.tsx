import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { ChevronLeft, MessageSquare } from 'lucide-react-native';

interface SellerTransactionHeaderProps {
    transactionId: string;
    auctionId: string;
    itemTitle: string;
    itemQuantity: number;
    unitPrice: number;
    buyerName: string;
    buyerCompany: string;
    netPayout: number;
    payoutMethod: string;
    payoutDate: string;
    status: 'AWAITING_BUYER_PAYMENT' | 'PAYMENT_UNDER_REVIEW' | 'READY_FOR_RELEASE' | 'HANDED_OVER' | 'COMPLETED' | 'CANCELLED';
    onBack: () => void;
    onChatPress: () => void;
    unreadCount: number;
}

export const SellerTransactionHeader = ({
    transactionId,
    auctionId,
    itemTitle,
    itemQuantity,
    unitPrice,
    buyerName,
    buyerCompany,
    netPayout,
    payoutMethod,
    payoutDate,
    status,
    onBack,
    onChatPress,
    unreadCount,
}: SellerTransactionHeaderProps) => {
    const statusConfig = {
        AWAITING_BUYER_PAYMENT: { label: 'Awaiting buyer payment', color: '#FEF3C7', textColor: '#92400E', borderColor: '#FDE68A' },
        PAYMENT_UNDER_REVIEW: { label: 'Payment under review', color: '#FEF9C3', textColor: '#854D0E', borderColor: '#FEF08A' },
        READY_FOR_RELEASE: { label: 'Ready for release', color: '#DCFCE7', textColor: '#166534', borderColor: '#BBF7D0' },
        HANDED_OVER: { label: 'Goods handed over', color: '#DBEAFE', textColor: '#1E40AF', borderColor: '#BFDBFE' },
        COMPLETED: { label: 'Completed', color: '#F3F4F6', textColor: '#374151', borderColor: '#E5E7EB' },
        CANCELLED: { label: 'Cancelled', color: '#FEE2E2', textColor: '#991B1B', borderColor: '#FECACA' },
    };

    const currentStatus = statusConfig[status];

    return (
        <View style={styles.container}>
            <View style={styles.headerTop}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <ChevronLeft size={24} color={COLORS.textMuted} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Transaction Details (Seller)</Text>
                </View>
                <TouchableOpacity style={styles.chatButton} onPress={onChatPress}>
                    <View style={styles.chatButtonContent}>
                        <MessageSquare size={24} color={COLORS.primary} />
                        {unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{unreadCount}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.chatButtonText}>Chat with Buyer</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoBlock}>
                <View style={styles.idRow}>
                    <Text style={styles.idText}>Transaction #{transactionId}</Text>
                    <Text style={styles.idSeparator}>|</Text>
                    <Text style={styles.idText}>Auction ID: {auctionId}</Text>
                </View>

                <Text style={styles.itemTitle}>
                    {itemTitle} <Text style={styles.itemDetails}>({itemQuantity} units • ${unitPrice.toFixed(2)} / unit)</Text>
                </Text>

                <View style={styles.buyerRow}>
                    <Text style={styles.buyerLabel}>Buyer:</Text>
                    <Text style={styles.buyerName}>{buyerCompany}</Text>
                    <Text style={styles.buyerSeparator}>–</Text>
                    <Text style={styles.buyerContact}>{buyerName}</Text>
                </View>
            </View>

            <View style={styles.payoutBlock}>
                <Text style={styles.payoutLabel}>NET PAYOUT TO YOU</Text>
                <Text style={styles.payoutAmount}>
                    ${netPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
                <Text style={styles.payoutDetail}>
                    Payout via {payoutMethod} on {payoutDate}
                </Text>
            </View>

            <View style={styles.statusContainer}>
                <View style={[styles.statusPill, { backgroundColor: currentStatus.color, borderColor: currentStatus.borderColor }]}>
                    <Text style={[styles.statusText, { color: currentStatus.textColor }]}>{currentStatus.label}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        marginRight: SPACING.sm,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
    },
    chatButton: {
        alignItems: 'center',
        marginLeft: SPACING.sm,
    },
    chatButtonContent: {
        position: 'relative',
        marginBottom: 4,
    },
    unreadBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#ef4444', // Red 500
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    unreadText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    chatButtonText: {
        fontSize: 11,
        color: COLORS.primary,
        fontWeight: '600',
        textAlign: 'center',
    },
    infoBlock: {
        marginBottom: SPACING.md,
    },
    idRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    idText: {
        fontSize: 12,
        color: COLORS.textMuted,
        fontFamily: 'System', // Or your mono font if available
    },
    idSeparator: {
        marginHorizontal: 6,
        color: COLORS.border,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    itemDetails: {
        fontSize: 14,
        fontWeight: '400',
        color: COLORS.textMuted,
    },
    buyerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    buyerLabel: {
        fontSize: 13,
        color: COLORS.textMuted,
        marginRight: 4,
    },
    buyerName: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text,
    },
    buyerSeparator: {
        marginHorizontal: 4,
        color: COLORS.textMuted,
    },
    buyerContact: {
        fontSize: 13,
        color: COLORS.text,
    },
    payoutBlock: {
        backgroundColor: '#F9FAFB',
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        alignItems: 'flex-end',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.lg,
    },
    payoutLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    payoutAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#15803d', // Green 700
        marginBottom: 2,
    },
    payoutDetail: {
        fontSize: 11,
        color: COLORS.textMuted,
        textAlign: 'right',
    },
    statusContainer: {
        alignItems: 'center',
    },
    statusPill: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.full,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '700',
    },
});
