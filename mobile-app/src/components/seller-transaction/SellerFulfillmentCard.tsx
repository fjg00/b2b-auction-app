import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { AlertTriangle, CheckCircle, Info, Package } from 'lucide-react-native';

interface SellerFulfillmentCardProps {
    status: 'AWAITING_BUYER_PAYMENT' | 'PAYMENT_UNDER_REVIEW' | 'READY_FOR_RELEASE' | 'HANDED_OVER' | 'COMPLETED' | 'CANCELLED';
    onConfirmReady: () => void;
    onReportIssue: () => void;
}

export const SellerFulfillmentCard = ({ status, onConfirmReady, onReportIssue }: SellerFulfillmentCardProps) => {
    const renderContent = () => {
        switch (status) {
            case 'AWAITING_BUYER_PAYMENT':
                return (
                    <View style={[styles.statusBox, styles.bgGray]}>
                        <Info size={20} color="#9CA3AF" style={styles.icon} />
                        <View style={styles.textContainer}>
                            <Text style={[styles.statusTitle, styles.textGrayDark]}>Waiting for Payment</Text>
                            <Text style={[styles.statusDesc, styles.textGray]}>
                                Waiting for the buyer to complete payment. You don’t need to do anything yet.
                            </Text>
                        </View>
                    </View>
                );
            case 'PAYMENT_UNDER_REVIEW':
                return (
                    <View style={[styles.statusBox, styles.bgAmber]}>
                        <AlertTriangle size={20} color="#D97706" style={styles.icon} />
                        <View style={styles.textContainer}>
                            <Text style={[styles.statusTitle, styles.textAmberDark]}>Payment Under Review</Text>
                            <Text style={[styles.statusDesc, styles.textAmber]}>
                                Buyer payment is being verified by the platform. Please do not release goods yet.
                            </Text>
                        </View>
                    </View>
                );
            case 'READY_FOR_RELEASE':
                return (
                    <View>
                        <View style={[styles.statusBox, styles.bgGreen, styles.marginBottom]}>
                            <CheckCircle size={20} color="#16A34A" style={styles.icon} />
                            <View style={styles.textContainer}>
                                <Text style={[styles.statusTitle, styles.textGreenDark]}>Payment Verified</Text>
                                <Text style={[styles.statusDesc, styles.textGreen]}>
                                    Payment has been secured. Please confirm the goods are available and ready for pickup/shipping.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={onConfirmReady}
                                style={styles.primaryButton}
                            >
                                <Text style={styles.primaryButtonText}>Ready for Release</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onReportIssue}
                                style={styles.secondaryButton}
                            >
                                <Text style={styles.secondaryButtonText}>Report Issue</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.explanationText}>
                            By clicking ‘Ready for release’, you confirm that the buyer can pick up this lot. Your payout will be processed after pickup is confirmed.
                        </Text>
                    </View>
                );
            case 'HANDED_OVER':
            case 'COMPLETED':
                return (
                    <View style={[styles.statusBox, styles.bgBlue]}>
                        <Package size={20} color="#2563EB" style={styles.icon} />
                        <View style={styles.textContainer}>
                            <Text style={[styles.statusTitle, styles.textBlueDark]}>Goods Handed Over</Text>
                            <Text style={[styles.statusDesc, styles.textBlue]}>
                                Goods were marked as handed over. Payout will be processed shortly.
                            </Text>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fulfillment Status</Text>
            {renderContent()}
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
    statusBox: {
        flexDirection: 'row',
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        borderWidth: 1,
    },
    marginBottom: {
        marginBottom: SPACING.md,
    },
    icon: {
        marginRight: SPACING.sm,
        marginTop: 2,
    },
    textContainer: {
        flex: 1,
    },
    statusTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    statusDesc: {
        fontSize: 13,
        lineHeight: 18,
    },
    // Colors
    bgGray: { backgroundColor: '#F9FAFB', borderColor: '#F3F4F6' },
    textGrayDark: { color: '#111827' },
    textGray: { color: '#4B5563' },

    bgAmber: { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' },
    textAmberDark: { color: '#78350F' },
    textAmber: { color: '#B45309' },

    bgGreen: { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' },
    textGreenDark: { color: '#14532D' },
    textGreen: { color: '#15803D' },

    bgBlue: { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' },
    textBlueDark: { color: '#1E3A8A' },
    textBlue: { color: '#1D4ED8' },

    // Buttons
    buttonRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: '#16A34A',
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    secondaryButton: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#374151',
        fontWeight: '500',
        fontSize: 14,
    },
    explanationText: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: SPACING.sm,
        lineHeight: 16,
    },
});
