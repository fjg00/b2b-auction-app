import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { Building2, Calendar } from 'lucide-react-native';

interface SellerPayoutDetailsCardProps {
    method: string;
    bankName: string;
    accountName: string;
    maskedAccount: string;
    expectedDate: string;
}

export const SellerPayoutDetailsCard = ({
    method,
    bankName,
    accountName,
    maskedAccount,
    expectedDate,
}: SellerPayoutDetailsCardProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payout Details</Text>

            <View style={styles.row}>
                <View style={styles.iconBox}>
                    <Building2 size={20} color="#4B5563" />
                </View>
                <View style={styles.textBlock}>
                    <Text style={styles.label}>Payout Method</Text>
                    <Text style={styles.value}>{method}</Text>
                    <Text style={styles.subValue}>{bankName} • {accountName}</Text>
                    <Text style={styles.subValue}>{maskedAccount}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.iconBox}>
                    <Calendar size={20} color="#4B5563" />
                </View>
                <View style={styles.textBlock}>
                    <Text style={styles.label}>Expected Payout Date</Text>
                    <Text style={styles.value}>{expectedDate}</Text>
                </View>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    Payouts are processed within 1 business day after goods are confirmed as released.
                </Text>
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
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    iconBox: {
        padding: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: RADIUS.sm,
        height: 36,
        width: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBlock: {
        flex: 1,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
        marginBottom: 2,
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 2,
    },
    subValue: {
        fontSize: 13,
        color: COLORS.textMuted,
    },
    infoBox: {
        backgroundColor: '#F9FAFB',
        padding: SPACING.sm,
        borderRadius: RADIUS.sm,
        marginTop: 4,
    },
    infoText: {
        fontSize: 11,
        color: COLORS.textMuted,
        fontStyle: 'italic',
        lineHeight: 16,
    },
});
