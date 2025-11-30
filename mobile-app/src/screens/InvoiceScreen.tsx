import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { supabase } from '../lib/supabase';
import { FileText, Download, Share2, ArrowLeft } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function InvoiceScreen({ route, navigation }: any) {
    const { transactionId } = route.params;
    const [transaction, setTransaction] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generatingPdf, setGeneratingPdf] = useState(false);

    useEffect(() => {
        fetchTransaction();
    }, [transactionId]);

    const fetchTransaction = async () => {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select(`
                    *,
                    lot:lots(title),
                    seller:users!seller_id(full_name, company_name, email, address, city, state, zip_code, country, tax_id),
                    buyer:users!buyer_id(full_name, company_name, email, address, city, state, zip_code, country, tax_id)
                `)
                .eq('id', transactionId)
                .single();

            if (error) throw error;
            setTransaction(data);
        } catch (error) {
            console.error('Error fetching invoice:', error);
            Alert.alert('Error', 'Failed to load invoice details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const generatePdf = async () => {
        if (!transaction) return;
        setGeneratingPdf(true);

        const formatAddress = (user: any) => {
            const country = user.country === 'USA' ? 'Lebanon' : user.country; // Override default DB value
            const parts = [
                user.address,
                user.city,
                user.state,
                user.zip_code,
                country
            ].filter(Boolean);
            return parts.join(', ');
        };

        try {
            const html = `
                <html>
                    <head>
                        <style>
                            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
                            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
                            .company-name { font-size: 24px; font-weight: bold; color: #0f766e; }
                            .invoice-label { font-size: 12px; color: #6B7280; letter-spacing: 1px; margin-top: 5px; }
                            .invoice-details { text-align: right; }
                            .invoice-number { font-size: 16px; font-weight: bold; }
                            .date { font-size: 14px; color: #6B7280; margin-top: 5px; }
                            .status-badge { 
                                display: inline-block; 
                                padding: 4px 12px; 
                                background-color: #dcfce7; 
                                color: #166534; 
                                border-radius: 9999px; 
                                font-size: 12px; 
                                font-weight: bold; 
                                margin-top: 10px;
                            }
                            .divider { height: 1px; background-color: #E5E7EB; margin: 20px 0; }
                            .row { display: flex; justify-content: space-between; margin-bottom: 20px; }
                            .col { flex: 1; }
                            .label { font-size: 10px; color: #6B7280; font-weight: bold; margin-bottom: 5px; }
                            .value { font-size: 14px; font-weight: bold; }
                            .sub-value { font-size: 12px; color: #6B7280; margin-top: 2px; }
                            .section-title { font-size: 12px; font-weight: bold; color: #6B7280; margin-bottom: 15px; letter-spacing: 0.5px; }
                            .item-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                            .item-title { font-size: 16px; }
                            .item-price { font-size: 16px; font-weight: bold; }
                            .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                            .total-label { font-size: 14px; color: #6B7280; }
                            .total-value { font-size: 14px; font-weight: 500; }
                            .final-total { margin-top: 20px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
                            .final-label { font-size: 16px; font-weight: bold; }
                            .final-value { font-size: 20px; font-weight: bold; color: #0f766e; }
                            .terms { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
                            .terms-title { font-size: 12px; font-weight: bold; color: #374151; margin-bottom: 8px; }
                            .terms-text { font-size: 10px; color: #6B7280; line-height: 1.5; }
                            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #6B7280; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <div>
                                <div class="company-name">ExpiryX Marketplace</div>
                                <div class="invoice-label">OFFICIAL INVOICE</div>
                            </div>
                            <div class="invoice-details">
                                <div class="invoice-number">#${transaction.id.slice(0, 8).toUpperCase()}</div>
                                <div class="date">${new Date(transaction.created_at).toLocaleDateString()}</div>
                                <div class="status-badge">PAID</div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col">
                                <div class="label">BILLED TO (BUYER)</div>
                                <div class="value">${transaction.buyer?.company_name || transaction.buyer?.full_name}</div>
                                <div class="sub-value">${transaction.buyer?.email}</div>
                                <div class="sub-value">${formatAddress(transaction.buyer || {})}</div>
                                ${transaction.buyer?.tax_id ? `<div class="sub-value">Tax ID: ${transaction.buyer.tax_id}</div>` : ''}
                            </div>
                            <div class="col" style="text-align: right;">
                                <div class="label">FROM (SELLER)</div>
                                <div class="value">${transaction.seller?.company_name || transaction.seller?.full_name}</div>
                                <div class="sub-value">${transaction.seller?.email}</div>
                                <div class="sub-value">${formatAddress(transaction.seller || {})}</div>
                                ${transaction.seller?.tax_id ? `<div class="sub-value">Tax ID: ${transaction.seller.tax_id}</div>` : ''}
                            </div>
                        </div>

                        <div class="divider"></div>

                        <div class="section-title">ITEM DETAILS</div>
                        <div class="item-row">
                            <div class="item-title">${transaction.lot?.title}</div>
                            <div class="item-price">${transaction.currency} ${transaction.amount.toLocaleString()}</div>
                        </div>

                        <div class="final-total">
                            <div class="total-row">
                                <div class="final-label">TOTAL PAID</div>
                                <div class="final-value">${transaction.currency} ${transaction.amount.toLocaleString()}</div>
                            </div>
                        </div>

                        <div class="terms">
                            <div class="terms-title">TERMS & CONDITIONS</div>
                            <div class="terms-text">
                                1. Payment is due upon receipt of this invoice.<br>
                                2. All goods are sold "as is" and "where is" without warranty of any kind.<br>
                                3. Title to the goods shall pass to the buyer upon full payment.<br>
                                4. Any claims must be made within 3 days of receipt of goods.<br>
                                5. This invoice serves as proof of purchase and payment.
                            </div>
                        </div>

                        <div class="footer">
                            Thank you for your business!
                        </div>
                    </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (error) {
            console.error('Error generating PDF:', error);
            Alert.alert('Error', 'Failed to generate PDF');
        } finally {
            setGeneratingPdf(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!transaction) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Invoice Preview</Text>
                <TouchableOpacity onPress={generatePdf} disabled={generatingPdf}>
                    <Share2 size={24} color={generatingPdf ? COLORS.textMuted : COLORS.text} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <View style={styles.invoicePaper}>
                    {/* Header */}
                    <View style={styles.invoiceHeader}>
                        <View>
                            <Text style={styles.companyName}>ExpiryX Marketplace</Text>
                            <Text style={styles.invoiceLabel}>OFFICIAL INVOICE</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.invoiceNumber}>#{transaction.id.slice(0, 8).toUpperCase()}</Text>
                            <Text style={styles.date}>{new Date(transaction.created_at).toLocaleDateString()}</Text>
                            <View style={{
                                backgroundColor: '#dcfce7',
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                                borderRadius: 12,
                                marginTop: 4
                            }}>
                                <Text style={{ color: '#166534', fontSize: 10, fontWeight: 'bold' }}>PAID</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Parties */}
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>BILLED TO (BUYER)</Text>
                            <Text style={styles.value}>{transaction.buyer?.company_name || transaction.buyer?.full_name}</Text>
                            <Text style={styles.subValue}>{transaction.buyer?.email}</Text>
                            {transaction.buyer?.tax_id && <Text style={styles.subValue}>Tax ID: {transaction.buyer.tax_id}</Text>}
                        </View>
                        <View style={[styles.col, { alignItems: 'flex-end' }]}>
                            <Text style={styles.label}>FROM (SELLER)</Text>
                            <Text style={styles.value}>{transaction.seller?.company_name || transaction.seller?.full_name}</Text>
                            <Text style={styles.subValue}>{transaction.seller?.email}</Text>
                            {transaction.seller?.tax_id && <Text style={styles.subValue}>Tax ID: {transaction.seller.tax_id}</Text>}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Item Details */}
                    <Text style={styles.sectionTitle}>ITEM DETAILS</Text>
                    <View style={styles.itemRow}>
                        <Text style={styles.itemTitle}>{transaction.lot?.title}</Text>
                        <Text style={styles.itemPrice}>{transaction.currency} {transaction.amount.toLocaleString()}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Totals */}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>{transaction.currency} {transaction.amount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Fees (0%)</Text>
                        <Text style={styles.totalValue}>{transaction.currency} 0.00</Text>
                    </View>
                    <View style={[styles.totalRow, styles.finalTotal]}>
                        <Text style={styles.finalLabel}>TOTAL PAID</Text>
                        <Text style={styles.finalValue}>{transaction.currency} {transaction.amount.toLocaleString()}</Text>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Thank you for your business.</Text>
                        <Text style={styles.footerText}>This is a computer-generated invoice.</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.downloadButton, generatingPdf && { opacity: 0.7 }]}
                    onPress={generatePdf}
                    disabled={generatingPdf}
                >
                    {generatingPdf ? (
                        <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
                    ) : (
                        <Download size={20} color="white" style={{ marginRight: 8 }} />
                    )}
                    <Text style={styles.downloadText}>{generatingPdf ? 'Generating PDF...' : 'Download PDF'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    invoicePaper: {
        backgroundColor: 'white',
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        minHeight: 500,
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
    },
    companyName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    invoiceLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 4,
        letterSpacing: 1,
    },
    invoiceNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    date: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: SPACING.lg,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    col: {
        flex: 1,
    },
    label: {
        fontSize: 11,
        color: COLORS.textMuted,
        marginBottom: 4,
        fontWeight: '600',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    subValue: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textMuted,
        marginBottom: SPACING.md,
        letterSpacing: 0.5,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTitle: {
        fontSize: 16,
        color: COLORS.text,
        flex: 1,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    totalValue: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    finalTotal: {
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    finalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    finalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    footer: {
        marginTop: SPACING.xl * 2,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: 4,
    },
    bottomBar: {
        padding: SPACING.md,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    downloadButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
    },
    downloadText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
