import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { FileText, User, Calendar } from 'lucide-react-native';

interface CompletedTransactionCardProps {
    title: string;
    amount: number;
    currency: string;
    date: string;
    otherPartyName: string;
    transactionId: string;
    role: 'buyer' | 'seller';
    onPress: () => void;
}

export function CompletedTransactionCard({
    title,
    amount,
    currency,
    date,
    otherPartyName,
    transactionId,
    role,
    onPress
}: CompletedTransactionCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.header}>
                <Text style={styles.transactionId}>Transaction #{transactionId.slice(0, 8)}</Text>
                <View style={styles.dateContainer}>
                    <Calendar size={12} color={COLORS.textMuted} />
                    <Text style={styles.dateText}>{new Date(date).toLocaleDateString()}</Text>
                </View>
            </View>

            <Text style={styles.title} numberOfLines={1}>
                {title}
            </Text>

            <View style={styles.detailsRow}>
                <View style={styles.partyInfo}>
                    <User size={14} color={COLORS.textMuted} />
                    <Text style={styles.partyText}>
                        {role === 'seller' ? 'Sold to: ' : 'Seller: '}
                        <Text style={styles.partyName}>{otherPartyName}</Text>
                    </Text>
                </View>
                <Text style={styles.amount}>
                    {currency} ${amount.toLocaleString()}
                </Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.invoiceBadge}>
                    <FileText size={12} color={COLORS.textMuted} />
                    <Text style={styles.invoiceText}>Invoice Available</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F9FAFB', // Light grey background
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        opacity: 0.9,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    transactionId: {
        fontSize: 12,
        color: COLORS.textMuted,
        fontFamily: 'monospace',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text, // Keep title readable
        marginBottom: SPACING.sm,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    partyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    partyText: {
        fontSize: 13,
        color: COLORS.textMuted,
    },
    partyName: {
        fontWeight: '500',
        color: COLORS.text,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#059669', // Muted green
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: SPACING.sm,
        marginTop: 4,
    },
    invoiceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    invoiceText: {
        fontSize: 11,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
});
