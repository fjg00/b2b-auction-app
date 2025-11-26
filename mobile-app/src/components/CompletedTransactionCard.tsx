import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function CompletedTransactionCard() {
    return (
        <View style={styles.card}>
            <Text style={styles.text}>Completed Transaction</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    text: {
        color: COLORS.text,
    },
});
