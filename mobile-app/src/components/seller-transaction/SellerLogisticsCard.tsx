import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { MapPin, Truck, ExternalLink } from 'lucide-react-native';

interface SellerLogisticsCardProps {
    mode: 'pickup' | 'shipping';
    pickupLocation?: string;
    pickupWindow?: string;
    carrier?: string;
    trackingNumber?: string;
    shipFromAddress?: string;
}

export const SellerLogisticsCard = ({
    mode,
    pickupLocation,
    pickupWindow,
    carrier,
    trackingNumber,
    shipFromAddress,
}: SellerLogisticsCardProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Logistics</Text>

            {mode === 'pickup' ? (
                <View style={styles.content}>
                    <View style={styles.row}>
                        <View style={styles.iconBox}>
                            <MapPin size={20} color="#4B5563" />
                        </View>
                        <View style={styles.textBlock}>
                            <Text style={styles.label}>Pickup Location</Text>
                            <Text style={styles.value}>{pickupLocation}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.iconBox}>
                            <Truck size={20} color="#4B5563" />
                        </View>
                        <View style={styles.textBlock}>
                            <Text style={styles.label}>Pickup Window</Text>
                            <Text style={styles.value}>{pickupWindow}</Text>
                        </View>
                    </View>
                    <View style={styles.warningBox}>
                        <Text style={styles.warningText}>
                            <Text style={styles.bold}>Important:</Text> Buyer or courier must present Release Note and valid ID.
                        </Text>
                    </View>
                </View>
            ) : (
                <View style={styles.content}>
                    <View style={styles.row}>
                        <View style={styles.iconBox}>
                            <Truck size={20} color="#4B5563" />
                        </View>
                        <View style={styles.textBlock}>
                            <Text style={styles.label}>Carrier Info</Text>
                            <Text style={styles.value}>{carrier}</Text>
                            {trackingNumber && (
                                <TouchableOpacity onPress={() => Linking.openURL(`https://example.com/track/${trackingNumber}`)}>
                                    <View style={styles.linkRow}>
                                        <Text style={styles.linkText}>Tracking: {trackingNumber}</Text>
                                        <ExternalLink size={12} color="#2563EB" />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.iconBox}>
                            <MapPin size={20} color="#4B5563" />
                        </View>
                        <View style={styles.textBlock}>
                            <Text style={styles.label}>Ship-from Address</Text>
                            <Text style={styles.value}>{shipFromAddress}</Text>
                        </View>
                    </View>
                </View>
            )}

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Do not release goods before status is ‘Ready for release’ and buyer or courier presents valid reference.
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
    content: {
        gap: SPACING.md,
    },
    row: {
        flexDirection: 'row',
        gap: SPACING.sm,
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
        color: COLORS.text,
    },
    value: {
        fontSize: 13,
        color: '#4B5563',
        marginTop: 2,
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    linkText: {
        fontSize: 13,
        color: '#2563EB',
    },
    warningBox: {
        backgroundColor: '#FEF3C7',
        padding: SPACING.sm,
        borderRadius: RADIUS.sm,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    warningText: {
        fontSize: 12,
        color: '#92400E',
    },
    bold: {
        fontWeight: 'bold',
    },
    footer: {
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    footerText: {
        fontSize: 11,
        color: COLORS.textMuted,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
