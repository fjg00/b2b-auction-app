import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { CreditCard, Truck, MessageSquare, Clock, AlertTriangle, X } from 'lucide-react-native';

// Import new Seller Components
import { SellerTransactionHeader } from '../components/seller-transaction/SellerTransactionHeader';
import { SellerTimeline } from '../components/seller-transaction/SellerTimeline';
import { SellerPayoutSummary } from '../components/seller-transaction/SellerPayoutSummary';
import { SellerFulfillmentCard } from '../components/seller-transaction/SellerFulfillmentCard';
import { SellerLogisticsCard } from '../components/seller-transaction/SellerLogisticsCard';
import { SellerPayoutDetailsCard } from '../components/seller-transaction/SellerPayoutDetailsCard';
import { SellerDocumentsCard } from '../components/seller-transaction/SellerDocumentsCard';

export default function TransactionScreen({ route, navigation }: any) {
    const { lotId, role = 'buyer' } = route.params || {};
    const [activeTab, setActiveTab] = useState<'payment' | 'logistics'>('payment');
    const [chatOpen, setChatOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(1); // Mock unread count

    // Mock Data
    const transaction = {
        id: 'TX-12345',
        lotTitle: 'Mixed Beverages (48 units)',
        amount: 1250.00,
        status: 'awaiting_payment',
        seller: 'Global Distributors Inc.',
        dueDate: 'Nov 22, 2025',
    };

    // Mock Data for Seller View
    const sellerTransaction = {
        transactionId: 'TX-12345',
        auctionId: '13452',
        itemTitle: 'Mixed Beverages',
        itemQuantity: 48,
        unitPrice: 26.04,
        buyerName: 'John Doe',
        buyerCompany: 'Retail King LLC',
        netPayout: 1456.88,
        payoutMethod: 'Bank Transfer',
        payoutDate: 'Nov 25, 2025',
        status: 'READY_FOR_RELEASE' as const,
        winningBid: 1250.00,
        buyerPremium: 62.50,
        platformFee: 0.00,
        vat: 144.38,
        currency: 'USD',
        timeline: [
            { id: '1', label: 'Auction closed', date: 'Nov 20, 10:00 AM', status: 'completed' as const },
            { id: '2', label: 'Buyer payment initiated', date: 'Nov 20, 11:30 AM', status: 'completed' as const },
            { id: '3', label: 'Payment verified', date: 'Nov 21, 09:00 AM', status: 'completed' as const },
            { id: '4', label: 'Seller confirm goods', status: 'current' as const },
            { id: '5', label: 'Goods handed over', status: 'pending' as const },
            { id: '6', label: 'Payout sent', status: 'pending' as const },
        ],
        logistics: {
            mode: 'pickup' as const,
            pickupLocation: '123 Warehouse Blvd, Logistics City, NY 10001',
            pickupWindow: 'Nov 22 - Nov 24, 9 AM - 5 PM',
        },
        payoutDetails: {
            method: 'Bank Transfer',
            bankName: 'Bank Audi',
            accountName: 'Global Distributors Inc.',
            maskedAccount: '**** 9114',
            expectedDate: 'Nov 25, 2025',
        }
    };

    const handleOpenChat = () => {
        setChatOpen(true);
        setUnreadCount(0); // Mark as read
    };

    const renderTabButton = (id: 'payment' | 'logistics', label: string, icon: React.ReactNode) => (
        <TouchableOpacity
            style={[styles.tabButton, activeTab === id && styles.activeTabButton]}
            onPress={() => setActiveTab(id)}
        >
            {icon}
            <Text style={[styles.tabText, activeTab === id && styles.activeTabText]}>{label}</Text>
        </TouchableOpacity>
    );

    const renderPaymentTab = () => (
        <View style={styles.contentCard}>
            {/* Buyer & Invoice Info */}
            <View style={styles.invoiceHeader}>
                <Text style={styles.invoiceTitle}>Invoice #{transaction.id.replace('TX-', 'INV-')}</Text>
                <Text style={styles.invoiceDate}>Issued: Nov 20, 2025</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.partySection}>
                <View style={styles.partyBlock}>
                    <Text style={styles.partyLabel}>BUYER</Text>
                    <Text style={styles.partyName}>Retail King LLC</Text>
                    <Text style={styles.partyDetail}>123 Commerce St, Beirut</Text>
                    <Text style={styles.partyDetail}>VAT: LB-123456789</Text>
                </View>
                <View style={styles.partyBlock}>
                    <Text style={styles.partyLabel}>SELLER</Text>
                    <Text style={styles.partyName}>{transaction.seller}</Text>
                    <Text style={styles.partyDetail}>Beirut Warehouse</Text>
                    <Text style={styles.partyDetail}>VAT: LB-987654321</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Transaction Info */}
            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Auction ID:</Text>
                    <Text style={styles.infoValue}>{lotId || '13452'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Closed:</Text>
                    <Text style={styles.infoValue}>Nov 20, 2025 • 10:00 AM</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Quantity:</Text>
                    <Text style={styles.infoValue}>48 units • USD $26.04 / unit</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Payment Status & Urgency */}
            <View style={styles.statusSection}>
                <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>Payment Pending</Text>
                </View>
                <View style={styles.urgencyBox}>
                    <Clock size={16} color={COLORS.error} />
                    <Text style={styles.urgencyText}>Payment due in 1 day 4 hrs</Text>
                </View>
                <Text style={styles.warningText}>
                    If payment is not completed by {transaction.dueDate}, the transaction may be cancelled.
                </Text>
                <Text style={styles.confirmationNote}>
                    Bank transfers are confirmed within 1 business day after receipt.
                </Text>
            </View>

            <View style={styles.divider} />

            {/* Price Breakdown */}
            <Text style={styles.sectionHeader}>Price Breakdown (USD)</Text>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Winning Bid</Text>
                <Text style={styles.detailValue}>USD $1,250.00</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Buyer Premium (5%)</Text>
                <Text style={styles.detailValue}>USD $62.50</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Platform Fees</Text>
                <Text style={styles.detailValue}>USD $0.00</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>VAT (11%)</Text>
                <Text style={styles.detailValue}>USD $144.38</Text>
            </View>

            <View style={styles.totalDivider} />

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Due</Text>
                <Text style={styles.totalValue}>USD $1,456.88</Text>
            </View>

            <Text style={styles.currencyNote}>
                All amounts charged in USD. Exchange rates may apply for local currency payments.
            </Text>

            <View style={styles.divider} />

            {/* Logistics Context */}
            <View style={styles.logisticsContext}>
                <Text style={styles.logisticsTitle}>📦 Pickup Information</Text>
                <Text style={styles.logisticsText}>
                    Pickup at Beirut Warehouse – available 2–3 business days after payment confirmation.
                </Text>
                <Text style={styles.logisticsHint}>
                    Full details and scheduling available in the Logistics tab.
                </Text>
            </View>

            <View style={styles.divider} />

            {/* Payment Method - Only show for Buyer */}
            {role === 'buyer' && (
                <>
                    <Text style={styles.sectionHeader}>Payment Method</Text>
                    <View style={styles.paymentMethodBox}>
                        <Text style={styles.paymentMethodTitle}>Bank Transfer</Text>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankLabel}>Bank Name:</Text>
                            <Text style={styles.bankValue}>Bank Audi</Text>
                        </View>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankLabel}>Account Name:</Text>
                            <Text style={styles.bankValue}>ExpiryX Marketplace Ltd.</Text>
                        </View>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankLabel}>IBAN:</Text>
                            <Text style={styles.bankValue}>LB62 0999 0000 0001 0019 0122 9114</Text>
                        </View>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankLabel}>SWIFT:</Text>
                            <Text style={styles.bankValue}>AUDBLBBX</Text>
                        </View>
                        <View style={styles.bankDetailRow}>
                            <Text style={styles.bankLabel}>Reference:</Text>
                            <Text style={[styles.bankValue, styles.referenceCode]}>{transaction.id}</Text>
                        </View>
                        <Text style={styles.referenceNote}>
                            ⚠️ Important: Include reference code in transfer notes
                        </Text>

                        <View style={styles.complianceFooter}>
                            <Text style={styles.complianceText}>ExpiryX Marketplace Ltd.</Text>
                            <Text style={styles.complianceText}>Registered in Lebanon • VAT: LB-555-888-999</Text>
                            <Text style={styles.complianceText}>456 Tech Park, Beirut Central District</Text>
                        </View>
                    </View>

                    <Text style={styles.emailNote}>
                        📧 You'll receive an email confirmation once payment is verified.
                    </Text>

                    <View style={styles.divider} />
                </>
            )}

            {/* Invoice Actions */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert('Invoice', 'Downloading proforma invoice...')}>
                    <Text style={styles.secondaryButtonText}>Download Proforma Invoice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert('Contract', 'Viewing terms...')}>
                    <Text style={styles.secondaryButtonText}>View Contract / Terms</Text>
                </TouchableOpacity>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Payment', 'Redirecting to payment gateway...')}>
                <Text style={styles.primaryButtonText}>Mark as Paid / Upload Proof</Text>
            </TouchableOpacity>

            {/* Support Info */}
            <View style={styles.supportSection}>
                <Text style={styles.supportText}>Need help? Contact support at support@expiryx.com</Text>
                <Text style={styles.supportText}>🔒 All payments are processed securely. We never store full card numbers.</Text>
            </View>
        </View>
    );

    const renderLogisticsTab = () => (
        <View style={styles.contentCard}>
            <View style={styles.statusRow}>
                <AlertTriangle size={20} color={COLORS.textMuted} />
                <Text style={styles.statusText}>Pending Payment</Text>
            </View>

            <Text style={styles.sectionHeader}>Pickup Location</Text>
            <Text style={styles.addressText}>
                123 Warehouse Blvd{'\n'}
                Logistics City, NY 10001
            </Text>

            <View style={styles.divider} />

            <Text style={styles.sectionHeader}>Instructions</Text>
            <Text style={styles.bodyText}>
                Please complete payment to unlock pickup instructions and schedule your slot.
            </Text>
        </View>
    );

    const renderChatBottomSheet = () => (
        <Modal
            visible={chatOpen}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setChatOpen(false)}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    activeOpacity={1}
                    onPress={() => setChatOpen(false)}
                />
                <View style={styles.bottomSheet}>
                    <View style={styles.chatHeader}>
                        <View>
                            <Text style={styles.chatTitle}>Chat with {role === 'buyer' ? 'Seller' : 'Buyer'}</Text>
                            <Text style={styles.chatSubtitle}>{role === 'buyer' ? transaction.seller : sellerTransaction.buyerCompany}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setChatOpen(false)} style={styles.closeButton}>
                            <X size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.chatMessages}>
                        <View style={styles.messageBubble}>
                            <Text style={styles.messageText}>
                                Congratulations on winning the lot! Let me know when you've made the payment.
                            </Text>
                            <Text style={styles.messageTime}>10:30 AM</Text>
                        </View>
                    </ScrollView>

                    <View style={styles.chatInputContainer}>
                        <TouchableOpacity
                            style={styles.inputButton}
                            onPress={() => Alert.alert('Chat', 'Opening keyboard...')}
                        >
                            <Text style={styles.inputText}>Type a message...</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    // RENDER SELLER VIEW
    if (role === 'seller') {
        return (
            <>
                <ScrollView style={styles.container}>
                    <SellerTransactionHeader
                        {...sellerTransaction}
                        onBack={() => navigation.goBack()}
                        onChatPress={handleOpenChat}
                        unreadCount={unreadCount}
                    />

                    <SellerTimeline events={sellerTransaction.timeline} />

                    <SellerPayoutSummary
                        winningBid={sellerTransaction.winningBid}
                        buyerPremium={sellerTransaction.buyerPremium}
                        platformFee={sellerTransaction.platformFee}
                        vat={sellerTransaction.vat}
                        netPayout={sellerTransaction.netPayout}
                        currency={sellerTransaction.currency}
                    />

                    <SellerPayoutDetailsCard
                        {...sellerTransaction.payoutDetails}
                    />

                    <SellerDocumentsCard
                        onDownloadInvoice={() => Alert.alert('Download', 'Downloading Buyer Invoice...')}
                        onDownloadStatement={() => Alert.alert('Download', 'Downloading Seller Statement...')}
                        onDownloadReleaseNote={() => Alert.alert('Download', 'Downloading Release Note...')}
                    />

                    <SellerFulfillmentCard
                        status={sellerTransaction.status}
                        onConfirmReady={() => Alert.alert('Success', 'Goods confirmed ready!')}
                        onReportIssue={() => Alert.alert('Report Issue', 'Opening issue report...')}
                    />

                    <SellerLogisticsCard
                        mode={sellerTransaction.logistics.mode}
                        pickupLocation={sellerTransaction.logistics.pickupLocation}
                        pickupWindow={sellerTransaction.logistics.pickupWindow}
                    />
                </ScrollView>
                {renderChatBottomSheet()}
            </>
        );
    }

    // RENDER BUYER VIEW (Existing)
    return (
        <>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.title}>Transaction #{transaction.id}</Text>
                        <Text style={styles.subtitle}>{transaction.lotTitle}</Text>
                        <Text style={styles.sellerName}>Seller: {transaction.seller}</Text>
                    </View>
                    <TouchableOpacity style={styles.chatButton} onPress={handleOpenChat}>
                        <View style={styles.chatButtonContent}>
                            <MessageSquare size={20} color={COLORS.primary} />
                            {unreadCount > 0 && (
                                <View style={styles.unreadBadge}>
                                    <Text style={styles.unreadText}>{unreadCount}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.chatButtonText}>Chat with Seller</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.tabsContainer}>
                    {renderTabButton('payment', 'Payment', <CreditCard size={18} color={activeTab === 'payment' ? COLORS.primary : COLORS.textMuted} />)}
                    {renderTabButton('logistics', 'Logistics', <Truck size={18} color={activeTab === 'logistics' ? COLORS.primary : COLORS.textMuted} />)}
                </View>

                {activeTab === 'payment' && renderPaymentTab()}
                {activeTab === 'logistics' && renderLogisticsTab()}
            </ScrollView>

            {renderChatBottomSheet()}
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.lg,
    },
    headerLeft: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    sellerName: {
        fontSize: 13,
        color: COLORS.text,
        marginTop: 2,
        fontWeight: '500',
    },
    chatButton: {
        alignItems: 'center',
        marginLeft: SPACING.sm,
    },
    chatButtonContent: {
        position: 'relative',
        marginBottom: 4,
    },
    unreadBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#ef4444', // Red 500
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    unreadText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    chatButtonText: {
        fontSize: 11,
        color: COLORS.primary,
        fontWeight: '600',
        textAlign: 'center',
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.sm,
        gap: 6,
    },
    activeTabButton: {
        backgroundColor: '#E0F2F1', // Light teal
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    activeTabText: {
        color: COLORS.primary,
    },
    contentCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: SPACING.md,
        backgroundColor: '#FFF8E1', // Light amber
        padding: SPACING.sm,
        borderRadius: RADIUS.sm,
    },
    statusText: {
        color: COLORS.secondary,
        fontWeight: '600',
    },
    amountLabel: {
        fontSize: 14,
        color: COLORS.textMuted,
        textAlign: 'center',
    },
    amountValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginVertical: SPACING.sm,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        color: COLORS.textMuted,
    },
    detailValue: {
        fontWeight: '600',
        color: COLORS.text,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    primaryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    addressText: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
    },
    bodyText: {
        color: COLORS.textMuted,
        lineHeight: 20,
    },
    // Bottom Sheet Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomSheet: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: RADIUS.lg,
        borderTopRightRadius: RADIUS.lg,
        height: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    chatSubtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    closeButton: {
        padding: SPACING.xs,
    },
    chatMessages: {
        flex: 1,
        padding: SPACING.md,
    },
    messageBubble: {
        backgroundColor: '#E0F2F1',
        padding: SPACING.sm,
        borderRadius: RADIUS.md,
        alignSelf: 'flex-start',
        maxWidth: '80%',
    },
    messageText: {
        color: COLORS.text,
        lineHeight: 20,
    },
    messageTime: {
        fontSize: 10,
        color: COLORS.textMuted,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    chatInputContainer: {
        padding: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        backgroundColor: COLORS.background,
    },
    inputButton: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
    },
    inputText: {
        color: COLORS.textMuted,
    },
    // New Payment Tab Styles
    infoSection: {
        marginBottom: SPACING.sm,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    infoLabel: {
        fontSize: 13,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 13,
        color: COLORS.text,
        fontWeight: '600',
    },
    statusSection: {
        alignItems: 'center',
    },
    statusPill: {
        backgroundColor: '#FEF3C7', // Amber 100
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.full,
        marginBottom: SPACING.sm,
    },
    statusPillText: {
        color: '#D97706', // Amber 600
        fontWeight: 'bold',
        fontSize: 13,
    },
    urgencyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: SPACING.sm,
    },
    urgencyText: {
        color: COLORS.error,
        fontWeight: '600',
        fontSize: 14,
    },
    warningText: {
        fontSize: 12,
        color: COLORS.textMuted,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    totalDivider: {
        height: 2,
        backgroundColor: COLORS.primary,
        marginVertical: SPACING.sm,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    paymentMethodBox: {
        backgroundColor: COLORS.background,
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    paymentMethodTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    bankDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    bankLabel: {
        fontSize: 13,
        color: COLORS.textMuted,
    },
    bankValue: {
        fontSize: 13,
        color: COLORS.text,
        fontWeight: '500',
    },
    referenceCode: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    referenceNote: {
        fontSize: 11,
        color: '#D97706', // Amber 600
        marginTop: SPACING.sm,
        fontStyle: 'italic',
    },
    actionButtons: {
        gap: SPACING.sm,
    },
    secondaryButton: {
        backgroundColor: COLORS.background,
        padding: SPACING.sm,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    secondaryButtonText: {
        color: COLORS.text,
        fontWeight: '600',
        fontSize: 14,
    },
    hintText: {
        fontSize: 12,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: SPACING.md,
        fontStyle: 'italic',
    },
    supportSection: {
        marginTop: SPACING.lg,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        gap: 4,
    },
    supportText: {
        fontSize: 11,
        color: COLORS.textMuted,
        textAlign: 'center',
    },
    // Invoice & Compliance Styles
    invoiceHeader: {
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    invoiceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    invoiceDate: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    partySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.md,
    },
    partyBlock: {
        flex: 1,
    },
    partyLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.textMuted,
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    partyName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 2,
    },
    partyDetail: {
        fontSize: 12,
        color: COLORS.textMuted,
        lineHeight: 16,
    },
    confirmationNote: {
        fontSize: 11,
        color: COLORS.primary,
        textAlign: 'center',
        marginTop: SPACING.xs,
        fontStyle: 'italic',
    },
    currencyNote: {
        fontSize: 11,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: SPACING.sm,
        fontStyle: 'italic',
    },
    logisticsContext: {
        backgroundColor: '#E0F2F1', // Light teal
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
    },
    logisticsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    logisticsText: {
        fontSize: 13,
        color: COLORS.text,
        lineHeight: 18,
        marginBottom: 4,
    },
    logisticsHint: {
        fontSize: 11,
        color: COLORS.textMuted,
        fontStyle: 'italic',
    },
    complianceFooter: {
        marginTop: SPACING.md,
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    complianceText: {
        fontSize: 10,
        color: COLORS.textMuted,
        textAlign: 'center',
        lineHeight: 14,
    },
    emailNote: {
        fontSize: 12,
        color: COLORS.primary,
        textAlign: 'center',
        marginTop: SPACING.md,
        fontStyle: 'italic',
    },
    chatButtonFloating: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#16A34A',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    chatButtonFloatingText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
