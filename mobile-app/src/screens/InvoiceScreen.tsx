import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export default function InvoiceScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Invoice</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.text}>Invoice details will appear here.</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        marginRight: SPACING.md,
    },
    backButtonText: {
        color: COLORS.primary,
        fontSize: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    text: {
        color: COLORS.textMuted,
        fontSize: 16,
    },
});
