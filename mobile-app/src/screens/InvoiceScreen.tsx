import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { ArrowLeft, Download, Share2, FileText, User, Calendar, MapPin } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { supabase } from '../lib/supabase';
import { Transaction } from '@shared/types';
import { useAuth } from '../context/AuthContext';

export default function InvoiceScreen({ route, navigation }: any) {
    const { transactionId } = route.params;
    const { user } = useAuth();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactionDetails();
    }, [transactionId]);

    const fetchTransactionDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select(`
                    *,
                    lot:lots(*, warehouse:addresses!warehouse_id(*)),
                    buyer:users!buyer_id(full_name, email),
                    seller:users!seller_id(full_name, email)
                `)
                .eq('id', transactionId)
                .single();

            if (error) throw error;

            // Map DB fields to camelCase for UI
            const mappedTransaction: Transaction = {
                ...data,
                lot: data.lot,
                buyer: { name: data.buyer.full_name, email: data.buyer.email },
                seller: {
                    name: data.seller.full_name,
                    email: data.seller.email
                },
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                lotId: data.lot_id,
                buyerId: data.buyer_id,
                sellerId: data.seller_id,
                releaseCode: data.release_code
            };

            setTransaction(mappedTransaction);
        } catch (error) {
            console.error('Error fetching invoice:', error);
            Alert.alert('Error', 'Failed to load invoice details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    if (loading || !transaction) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const isSeller = user?.id === transaction.sellerId;
    const otherPartyName = isSeller ? transaction.buyer?.name : transaction.seller?.name;
    const otherPartyId = isSeller ? transaction.buyerId : transaction.sellerId;
    const otherPartyLabel = isSeller ? 'Buyer' : 'Seller';

    const handleDownloadPDF = async () => {
        if (!transaction) return;

        const html = `
            <html>
                <head>
                    <style>
                        body { font-family: 'Helvetica', sans-serif; padding: 20px; }
                        h1 { color: #333; }
                        .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                        .invoice-details { margin-bottom: 20px; }
                        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        .table th { background-color: #f2f2f2; }
                        .total { font-weight: bold; text-align: right; margin-top: 20px; font-size: 18px; }
                        .party-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
                        .party-box { width: 45%; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>INVOICE</h1>
                        <div style="text-align: right;">
                            <p><strong>Date:</strong> ${new Date(transaction.updatedAt).toLocaleDateString()}</p>
                            <p><strong>Invoice #:</strong> INV-${transaction.id.slice(0, 8).toUpperCase()}</p>
                            <p><strong>Status:</strong> PAID</p>
                        </div>
                    </div>
                    
                    <div class="party-section">
                        <div class="party-box">
                            <h3>Bill To:</h3>
                            <p><strong>${transaction.buyer?.name}</strong></p>
                            <p>${transaction.buyer?.email}</p>
                        </div>

                        <div class="party-box">
                            <h3>Bill From:</h3>
                            <p><strong>${transaction.seller?.name}</strong></p>
                            <p>${transaction.seller?.email}</p>
                        </div>
                    </div>

                    <table class="table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${transaction.lot?.title}</td>
                                <td>${transaction.lot?.details?.quantity || '1'}</td>
                                <td>${transaction.currency} ${transaction.amount.toLocaleString()}</td>
                                <td>${transaction.currency} ${transaction.amount.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="total">
                        <p>Total: ${transaction.currency} ${transaction.amount.toLocaleString()}</p>
                    </div>
                </body>
            </html>
        `;

        try {
            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (error) {
            console.error('Error generating PDF:', error);
            Alert.alert('Error', 'Failed to generate PDF');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Invoice</Text>
                <TouchableOpacity style={styles.shareButton}>
                    <Share2 size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Status Banner */}
                <View style={styles.statusBanner}>
                    <View style={styles.paidBadge}>
                        <Text style={styles.paidText}>PAID</Text>
                    </View>
                    <Text style={styles.dateText}>
                        Issued: {new Date(transaction.updatedAt).toLocaleDateString()}
                    </Text>
                </View>

                {/* Invoice Card */}
                <View style={styles.card}>
                    <View style={styles.invoiceHeader}>
                        <View>
                            <Text style={styles.label}>Invoice Number</Text>
                            <Text style={styles.value}>INV-{transaction.id.slice(0, 8).toUpperCase()}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.label}>Total Amount</Text>
                            <Text style={styles.totalAmount}>
                                {transaction.currency} ${transaction.amount.toLocaleString()}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Item Details */}
                    <Text style={styles.sectionTitle}>Item Details</Text>
                    <View style={styles.itemRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemTitle}>{transaction.lot?.title}</Text>
                            <Text style={styles.itemSubtitle}>Qty: {transaction.lot?.details?.quantity || '1 Unit'}</Text>
                        </View>
                        <Text style={styles.itemPrice}>
                            {transaction.currency} ${transaction.amount.toLocaleString()}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Parties */}
                    <View style={styles.partiesContainer}>
                        <View style={styles.partyBox}>
                            <Text style={styles.label}>{otherPartyLabel}</Text>
                            <TouchableOpacity
                                style={styles.partyLink}
                                onPress={() => navigation.navigate('SellerProfile', { id: otherPartyId })}
                            >
                                <User size={16} color={COLORS.primary} />
                                <Text style={styles.linkText}>{otherPartyName}</Text>
                            </TouchableOpacity>
                            <Text style={styles.emailText}>{isSeller ? transaction.buyer?.email : transaction.seller?.email}</Text>
                        </View>
                    </View>
                </View>

                {/* Download Button */}
                <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPDF}>
                    <Download size={20} color="white" />
                    <Text style={styles.downloadText}>Download Invoice PDF</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        padding: 4,
    },
    shareButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: SPACING.md,
    },
    statusBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    paidBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: SPACING.md,
        paddingVertical: 4,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: '#059669',
    },
    paidText: {
        color: '#059669',
        fontWeight: 'bold',
        fontSize: 14,
    },
    dateText: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.xl,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        fontFamily: 'monospace',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.lg,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 4,
    },
    itemSubtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    partiesContainer: {
        flexDirection: 'row',
        gap: SPACING.xl,
    },
    partyBox: {
        flex: 1,
    },
    partyLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    linkText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.primary,
        textDecorationLine: 'underline',
    },
    emailText: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        gap: 8,
    },
    downloadText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
