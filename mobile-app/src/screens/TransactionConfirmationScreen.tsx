import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { CheckCircle, Clock, Truck, CreditCard, ChevronRight, AlertTriangle, MessageSquare, X, Upload, FileText } from 'lucide-react-native';

import { getTransaction, updateTransactionStatus } from '../services/auctionService';
import { Transaction } from '@shared/types';
import { useAuth } from '../context/AuthContext';

export default function TransactionConfirmationScreen({ navigation, route }: any) {
    const { transactionId } = route.params;
    const { user } = useAuth();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [chatOpen, setChatOpen] = useState(false);
    const [proofOfPayment, setProofOfPayment] = useState<string | null>(null);

    useEffect(() => {
        loadTransaction();
    }, [transactionId]);

    const loadTransaction = async () => {
        if (!transactionId) return;
        setLoading(true);
        const data = await getTransaction(transactionId);
        if (data) {
            setTransaction(data);
            if (data.proofOfPaymentUrl) {
                setProofOfPayment(data.proofOfPaymentUrl);
            }
        } else {
            Alert.alert('Error', 'Transaction not found');
            navigation.goBack();
        }
        setLoading(false);
    };

    // Derive step from status
    const getStep = () => {
        if (!transaction) return 'payment';
        if (transaction.status === 'completed') return 'logistics';
        if (transaction.status === 'payment_sent') return 'receipt';
        return 'payment';
    };

    const step = getStep();
    const role = user?.id === transaction?.sellerId ? 'seller' : 'buyer';

    const handleUploadProof = () => {
        Alert.alert(
            "Upload Proof",
            "Select a file to upload",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Select Image/PDF",
                    onPress: () => setProofOfPayment("payment_receipt_123.pdf") // Mock file selection
                }
            ]
        );
    };

    const handleConfirmPayment = async () => {
        if (!proofOfPayment || !transaction) {
            Alert.alert("Required", "Please upload proof of payment before confirming.");
            return;
        }

        Alert.alert(
            "Confirm Payment",
            "Are you sure you have sent the payment? The seller will be notified to verify receipt.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes, Payment Sent",
                    onPress: async () => {
                        setUploading(true);
                        const result = await updateTransactionStatus(transaction.id, 'payment_sent', proofOfPayment);
                        setUploading(false);

                        if (result.success) {
                            loadTransaction();
                            Alert.alert("Success", "Payment status updated!");
                        } else {
                            Alert.alert("Error", result.message);
                        }
                    }
                }
            ]
        );
    };

    const handleConfirmReceipt = () => {
        if (!transaction) return;

        Alert.alert(
            "Confirm Receipt",
            "Have you received the full amount in your bank account?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Payment Received",
                    onPress: async () => {
                        setUploading(true);
                        const result = await updateTransactionStatus(transaction.id, 'completed');
                        setUploading(false);

                        if (result.success) {
                            loadTransaction();
                            Alert.alert("Success", "Transaction completed! Logistics unlocked.");
                        } else {
                            Alert.alert("Error", result.message);
                        }
                    }
                }
            ]
        );
    };

    if (loading) return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        </SafeAreaView>
    );

    if (!transaction) return null;

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
                <Text style={styles.title}>Transaction #{transaction.id.slice(0, 8)}</Text>
                <Text style={styles.subtitle}>{transaction.lot?.title}</Text>
            </View>

            <TouchableOpacity style={styles.chatButton} onPress={() => setChatOpen(true)}>
                <MessageSquare size={20} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.devToggle}
                onPress={() => Alert.alert('Dev Info', `Role: ${role}\nStatus: ${transaction.status}`)}
            >
                <Text style={styles.devToggleText}>{role.toUpperCase()}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStepper = () => (
        <View style={styles.stepperContainer}>
            <View style={[styles.stepItem, step === 'payment' && styles.activeStep]}>
                <View style={[styles.stepIcon, (step === 'payment' || step === 'receipt' || step === 'logistics') && styles.completedStepIcon]}>
                    <CreditCard size={16} color="white" />
                </View>
                <Text style={styles.stepText}>Payment</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={[styles.stepItem, step === 'receipt' && styles.activeStep]}>
                <View style={[styles.stepIcon, (step === 'receipt' || step === 'logistics') ? styles.completedStepIcon : styles.inactiveStepIcon]}>
                    <CheckCircle size={16} color="white" />
                </View>
                <Text style={styles.stepText}>Verify</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={[styles.stepItem, step === 'logistics' && styles.activeStep]}>
                <View style={[styles.stepIcon, step === 'logistics' ? styles.completedStepIcon : styles.inactiveStepIcon]}>
                    <Truck size={16} color="white" />
                </View>
                <Text style={styles.stepText}>Logistics</Text>
            </View>
        </View>
    );

    const renderPaymentStep = () => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Payment Required</Text>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Pending</Text>
                </View>
            </View>

            {/* Transaction Info */}
            <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Auction ID:</Text>
                    <Text style={styles.infoValue}>{transaction.lotId.slice(0, 8)}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Closed:</Text>
                    <Text style={styles.infoValue}>{new Date(transaction.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Amount:</Text>
                    <Text style={styles.infoValue}>{transaction.currency} ${transaction.amount.toLocaleString()}</Text>
                </View>
                {role === 'buyer' && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Seller:</Text>
                        <TouchableOpacity onPress={() => Alert.alert('Navigate to Seller Profile', transaction.seller?.name)}>
                            <Text style={styles.linkValue}>{transaction.seller?.name}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.divider} />

            {role === 'buyer' ? (
                <>
                    <Text style={styles.instructionText}>
                        Please transfer the total amount to the seller's bank account below.
                    </Text>

                    {/* Payment Deadline */}
                    <View style={styles.deadlineBox}>
                        <Clock size={18} color={COLORS.error} />
                        <Text style={styles.deadlineText}>Payment Due: {new Date(new Date(transaction.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</Text>
                    </View>

                    {/* Price Breakdown */}
                    <Text style={styles.sectionHeader}>Price Breakdown ({transaction.currency})</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Winning Bid</Text>
                        <Text style={styles.detailValue}>{transaction.currency} ${transaction.amount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Buyer Premium (5%)</Text>
                        <Text style={styles.detailValue}>{transaction.currency} ${(transaction.amount * 0.05).toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>VAT (11%)</Text>
                        <Text style={styles.detailValue}>{transaction.currency} ${(transaction.amount * 0.11).toLocaleString()}</Text>
                    </View>
                    <View style={styles.totalDivider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Due</Text>
                        <Text style={styles.totalValue}>{transaction.currency} ${(transaction.amount * 1.16).toLocaleString()}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.bankDetails}>
                        <Text style={styles.sectionHeader}>Bank Details</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Bank Name</Text>
                            <Text style={styles.detailValue}>Global Bank Corp</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Account Name</Text>
                            <Text style={styles.detailValue}>{transaction.seller?.name}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>IBAN</Text>
                            <Text style={styles.detailValue}>US12 3456 7890 1234 5678</Text>
                        </View>
                    </View>

                    {/* Proof of Payment Upload */}
                    <View style={styles.uploadSection}>
                        <Text style={styles.sectionHeader}>Proof of Payment</Text>

                        {proofOfPayment ? (
                            <View style={styles.filePreview}>
                                <FileText size={24} color={COLORS.primary} />
                                <Text style={styles.fileName}>{proofOfPayment}</Text>
                                <TouchableOpacity onPress={() => setProofOfPayment(null)}>
                                    <X size={20} color={COLORS.textMuted} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadProof}>
                                <Upload size={20} color={COLORS.primary} />
                                <Text style={styles.uploadButtonText}>Upload Receipt (PDF or Image)</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.primaryButton, !proofOfPayment && styles.disabledButton]}
                        onPress={handleConfirmPayment}
                        disabled={!proofOfPayment}
                    >
                        <Text style={styles.primaryButtonText}>I Have Sent the Payment</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    {/* Seller View - Net Payout */}
                    <View style={styles.payoutBox}>
                        <Text style={styles.payoutLabel}>Net Payout to You</Text>
                        <Text style={styles.payoutValue}>{transaction.currency} ${transaction.amount.toLocaleString()}</Text>
                        <Text style={styles.payoutSubtext}>After buyer payment is confirmed</Text>
                    </View>

                    {/* Buyer Payment Deadline */}
                    <View style={styles.deadlineBox}>
                        <Clock size={18} color={COLORS.error} />
                        <Text style={styles.deadlineText}>Buyer must pay by: {new Date(new Date(transaction.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</Text>
                    </View>

                    {/* Buyer Contact Info */}
                    <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Buyer Contact</Text>
                        <TouchableOpacity onPress={() => Alert.alert('Navigate to Buyer Profile', transaction.buyer?.name)}>
                            <Text style={styles.linkValue}>{transaction.buyer?.name}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Payout Breakdown */}
                    <Text style={styles.sectionHeader}>Payout Breakdown ({transaction.currency})</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Winning Bid</Text>
                        <Text style={styles.detailValue}>{transaction.currency} ${transaction.amount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Platform Fee (0%)</Text>
                        <Text style={styles.detailValue}>- {transaction.currency} $0.00</Text>
                    </View>

                    <View style={styles.totalDivider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Net Payout</Text>
                        <Text style={styles.totalValue}>{transaction.currency} ${transaction.amount.toLocaleString()}</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.instructionText}>
                        The buyer has been notified to send payment. You will be able to confirm receipt once the funds arrive in your account.
                    </Text>

                    <View style={styles.waitingBox}>
                        <Clock size={20} color={COLORS.textMuted} />
                        <Text style={styles.waitingText}>Waiting for buyer to send payment...</Text>
                    </View>

                    {/* Seller's Bank Details Reference */}
                    <View style={styles.bankDetails}>
                        <Text style={styles.sectionHeader}>Your Bank Details (Reference)</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Bank Name</Text>
                            <Text style={styles.detailValue}>Global Bank Corp</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Account Name</Text>
                            <Text style={styles.detailValue}>{transaction.seller?.name}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>IBAN</Text>
                            <Text style={styles.detailValue}>US12 3456 7890 1234 5678</Text>
                        </View>
                    </View>
                </>
            )}
        </View>
    );

    const renderReceiptStep = () => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Verify Payment</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#E0F2F1' }]}>
                    <Text style={[styles.statusText, { color: COLORS.primary }]}>Action Required</Text>
                </View>
            </View>

            <Text style={styles.instructionText}>
                {role === 'seller'
                    ? "The buyer has marked this transaction as paid. Please check your bank account."
                    : "You have marked this transaction as paid. Waiting for the seller to confirm receipt."}
            </Text>

            {role === 'seller' && (
                <Text style={styles.warningText}>
                    Note: Bank transfers may take 1-3 business days to appear in your account.
                </Text>
            )}

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Buyer</Text>
                {role === 'seller' ? (
                    <TouchableOpacity onPress={() => Alert.alert('Navigate to Buyer Profile', transaction.buyer?.name)}>
                        <Text style={styles.linkValue}>{transaction.buyer?.name}</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.infoValue}>{transaction.buyer?.name}</Text>
                )}
                {role === 'buyer' && (
                    <>
                        <Text style={styles.infoLabel}>Seller</Text>
                        <TouchableOpacity onPress={() => Alert.alert('Navigate to Seller Profile', transaction.seller?.name)}>
                            <Text style={styles.linkValue}>{transaction.seller?.name}</Text>
                        </TouchableOpacity>
                    </>
                )}
                <Text style={styles.infoLabel}>Amount</Text>
                <Text style={styles.infoValue}>{transaction.currency} ${transaction.amount.toLocaleString()}</Text>
            </View>

            {role === 'seller' ? (
                <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmReceipt}>
                    <Text style={styles.primaryButtonText}>Confirm Payment Received</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.waitingBox}>
                    <Clock size={20} color={COLORS.textMuted} />
                    <Text style={styles.waitingText}>Waiting for seller to verify receipt...</Text>
                </View>
            )}
        </View>
    );

    const renderLogisticsStep = () => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Logistics & Handover</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#DCFCE7' }]}>
                    <Text style={[styles.statusText, { color: '#166534' }]}>Ready</Text>
                </View>
            </View>

            <View style={styles.successBox}>
                <CheckCircle size={24} color={COLORS.primary} />
                <Text style={styles.successText}>Payment Confirmed!</Text>
            </View>

            <Text style={styles.instructionText}>
                The transaction is now ready for handover. Please coordinate the pickup/delivery.
            </Text>

            {role === 'buyer' && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Seller Contact</Text>
                    <TouchableOpacity onPress={() => Alert.alert('Navigate to Seller Profile', transaction.seller?.name)}>
                        <Text style={styles.linkValue}>{transaction.seller?.name}</Text>
                    </TouchableOpacity>
                </View>
            )}

            {role === 'seller' && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Buyer Contact</Text>
                    <TouchableOpacity onPress={() => Alert.alert('Navigate to Buyer Profile', transaction.buyer?.name)}>
                        <Text style={styles.linkValue}>{transaction.buyer?.name}</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.logisticsDetails}>
                <View style={styles.logisticsRow}>
                    <Truck size={20} color={COLORS.text} />
                    <View>
                        <Text style={styles.detailValue}>Pickup at Seller's Warehouse</Text>
                        <Text style={styles.subDetailText}>
                            123 Industrial Park, Sector 7{'\n'}
                            New York, NY 10001
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.logisticsRow}>
                    <Clock size={20} color={COLORS.text} />
                    <View>
                        <Text style={styles.detailValue}>Pickup Window</Text>
                        <Text style={styles.subDetailText}>Mon - Fri • 9:00 AM - 5:00 PM</Text>
                    </View>
                </View>

                <View style={styles.logisticsRow}>
                    <AlertTriangle size={20} color={COLORS.text} />
                    <View>
                        <Text style={styles.detailValue}>Site Instructions</Text>
                        <Text style={styles.subDetailText}>Enter via Gate 3. Safety vest required.</Text>
                    </View>
                </View>

                <View style={styles.logisticsRow}>
                    <MessageSquare size={20} color={COLORS.text} />
                    <View>
                        <Text style={styles.detailValue}>Site Contact</Text>
                        <Text style={styles.subDetailText}>Mike Ross (Logistics Mgr) • +1 555-0199</Text>
                    </View>
                </View>
            </View>

            <View style={styles.releaseCodeBox}>
                <Text style={styles.releaseCodeLabel}>RELEASE CODE</Text>
                <Text style={styles.releaseCodeValue}>REL-8899-X</Text>
                <Text style={styles.releaseCodeHint}>Present this code to claim goods</Text>
            </View>
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
                            <Text style={styles.chatSubtitle}>{role === 'buyer' ? transaction.seller?.name : transaction.buyer?.name}</Text>
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                {renderHeader()}
                {renderStepper()}

                <View style={styles.content}>
                    {step === 'payment' && renderPaymentStep()}
                    {step === 'receipt' && renderReceiptStep()}
                    {step === 'logistics' && renderLogisticsStep()}
                </View>
            </ScrollView>
            {renderChatBottomSheet()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        marginRight: SPACING.md,
    },
    backButtonText: {
        color: COLORS.primary,
        fontSize: 16,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    devToggle: {
        backgroundColor: '#eee',
        padding: 4,
        borderRadius: 4,
    },
    devToggleText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        marginBottom: SPACING.md,
    },
    stepItem: {
        alignItems: 'center',
        zIndex: 1,
    },
    stepIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    completedStepIcon: {
        backgroundColor: COLORS.primary,
    },
    inactiveStepIcon: {
        backgroundColor: COLORS.border,
    },
    activeStep: {
        opacity: 1,
    },
    stepText: {
        fontSize: 12,
        color: COLORS.text,
        fontWeight: '600',
    },
    stepLine: {
        height: 2,
        backgroundColor: COLORS.border,
        flex: 1,
        marginHorizontal: -10,
        marginBottom: 16,
    },
    content: {
        padding: SPACING.md,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statusBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#D97706',
    },
    instructionText: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: SPACING.lg,
        lineHeight: 20,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    bankDetails: {
        marginBottom: SPACING.lg,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
    detailValue: {
        color: COLORS.text,
        fontWeight: '500',
        fontSize: 14,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: COLORS.border,
    },
    waitingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        backgroundColor: '#F1F5F9',
        borderRadius: RADIUS.md,
        gap: 8,
        marginBottom: SPACING.lg,
    },
    waitingText: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
    infoBox: {
        backgroundColor: '#F8FAFC',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.lg,
    },
    infoLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: '500',
        marginBottom: 12,
    },
    linkValue: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    successBox: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    successText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginTop: 8,
    },
    logisticsDetails: {
        marginBottom: SPACING.lg,
    },
    logisticsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 16,
    },
    chatButton: {
        marginRight: SPACING.sm,
    },
    infoSection: {
        marginBottom: SPACING.md,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.md,
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
    warningText: {
        fontSize: 12,
        color: COLORS.textMuted,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: SPACING.md,
    },
    deadlineBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: SPACING.sm,
        backgroundColor: '#FEF2F2',
        borderRadius: RADIUS.sm,
        borderWidth: 1,
        borderColor: '#FCA5A5',
        marginBottom: SPACING.lg,
    },
    deadlineText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.error,
    },
    payoutBox: {
        alignItems: 'center',
        padding: SPACING.lg,
        backgroundColor: '#F0F9FF',
        borderRadius: RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.primary,
        marginBottom: SPACING.lg,
    },
    payoutLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        marginBottom: 8,
    },
    payoutValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    payoutSubtext: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    uploadSection: {
        marginBottom: SPACING.lg,
        marginTop: SPACING.md,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        borderRadius: RADIUS.md,
        backgroundColor: '#F0F9FF',
        gap: 8,
    },
    uploadButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    filePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: '#F1F5F9',
        borderRadius: RADIUS.md,
        gap: 12,
    },
    fileName: {
        flex: 1,
        color: COLORS.text,
        fontSize: 14,
    },
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
    subDetailText: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    releaseCodeBox: {
        marginTop: SPACING.lg,
        padding: SPACING.md,
        backgroundColor: '#F0F9FF',
        borderRadius: RADIUS.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
    },
    releaseCodeLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    releaseCodeValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        letterSpacing: 2,
        marginBottom: 4,
    },
    releaseCodeHint: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
});
