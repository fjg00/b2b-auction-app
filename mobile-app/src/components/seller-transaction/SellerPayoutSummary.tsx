import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface SellerPayoutSummaryProps {
    winningBid: number;
    buyerPremium: number;
    platformFee: number;
    vat: number;
    netPayout: number;
    currency: string;
}

export const SellerPayoutSummary = ({
    winningBid,
    buyerPremium,
    platformFee,
    vat,
    netPayout,
    currency,
}: SellerPayoutSummaryProps) => {
    const formatMoney = (amount: number) => amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payout Summary</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Winning Bid</Text>
                <Text style={styles.value}>{currency} {formatMoney(winningBid)}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Buyer Premium <Text style={styles.subLabel}>(paid by buyer)</Text>
                </Text>
                <Text style={styles.value}>{currency} {formatMoney(buyerPremium)}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Platform Fee (Seller)</Text>
                <Text style={[styles.value, styles.negative]}>-{currency} {formatMoney(platformFee)}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>VAT / Taxes Withheld</Text>
                <Text style={[styles.value, styles.negative]}>-{currency} {formatMoney(vat)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Net Payout to You</Text>
                <Text style={styles.totalValue}>{currency} {formatMoney(netPayout)}</Text>
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
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 13,
        color: COLORS.textMuted,
    },
    subLabel: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    value: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.text,
    },
    negative: {
        color: '#DC2626', // Red 600
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.md,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#15803d', // Green 700
    },
});
