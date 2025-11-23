import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { FileText, Download } from 'lucide-react-native';

interface SellerDocumentsCardProps {
    onDownloadInvoice: () => void;
    onDownloadStatement: () => void;
    onDownloadReleaseNote: () => void;
}

export const SellerDocumentsCard = ({
    onDownloadInvoice,
    onDownloadStatement,
    onDownloadReleaseNote,
}: SellerDocumentsCardProps) => {
    const renderDocRow = (label: string, onPress: () => void) => (
        <TouchableOpacity style={styles.docRow} onPress={onPress}>
            <View style={styles.docInfo}>
                <FileText size={20} color={COLORS.textMuted} />
                <Text style={styles.docLabel}>{label}</Text>
            </View>
            <Download size={18} color={COLORS.primary} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Documents</Text>
            {renderDocRow('Buyer Invoice (PDF)', onDownloadInvoice)}
            <View style={styles.divider} />
            {renderDocRow('Seller Statement (PDF)', onDownloadStatement)}
            <View style={styles.divider} />
            {renderDocRow('Release Note / Pickup Slip', onDownloadReleaseNote)}
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
    docRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
    },
    docInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    docLabel: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
});
