import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { CreditCard, Plus, Trash2, Check, Building2, Smartphone } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getPaymentMethods, createPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod, PaymentMethodType, PaymentMethod as PaymentMethodData } from '../services/profileService';

export default function PaymentMethodsScreen({ navigation }: any) {
    const { user } = useAuth();
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedType, setSelectedType] = useState<PaymentMethodType | null>(null);

    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const loadPaymentMethods = async () => {
        if (!user?.id) return;

        try {
            const data = await getPaymentMethods(user.id);
            setPaymentMethods(data);
        } catch (error) {
            console.error('Error loading payment methods:', error);
            Alert.alert('Error', 'Failed to load payment methods');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!user?.id) return;

        Alert.alert(
            'Delete Payment Method',
            'Are you sure you want to delete this payment method?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePaymentMethod(id, user.id);
                            setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
                            Alert.alert('Success', 'Payment method deleted');
                        } catch (error) {
                            console.error('Error deleting payment method:', error);
                            Alert.alert('Error', 'Failed to delete payment method');
                        }
                    },
                },
            ]
        );
    };

    const handleSetDefault = async (id: string) => {
        if (!user?.id) return;

        try {
            await setDefaultPaymentMethod(id, user.id);
            setPaymentMethods(paymentMethods.map(pm => ({
                ...pm,
                is_default: pm.id === id,
            })));
            Alert.alert('Success', 'Default payment method updated');
        } catch (error) {
            console.error('Error setting default:', error);
            Alert.alert('Error', 'Failed to set default payment method');
        }
    };

    const handleAddPaymentMethod = async (methodData: Omit<PaymentMethodData, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
        if (!user?.id) return;

        try {
            const newMethod = await createPaymentMethod(user.id, methodData);
            setPaymentMethods([...paymentMethods, newMethod]);
            setShowAddModal(false);
            setSelectedType(null);
            Alert.alert('Success', 'Payment method added successfully!');
        } catch (error) {
            console.error('Error adding payment method:', error);
            Alert.alert('Error', 'Failed to add payment method');
        }
    };

    const getIcon = (type: PaymentMethodType) => {
        switch (type) {
            case 'bank':
                return <Building2 size={24} color={COLORS.primary} />;
            case 'card':
                return <CreditCard size={24} color={COLORS.primary} />;
            case 'omt':
            case 'whish':
                return <Smartphone size={24} color={COLORS.primary} />;
        }
    };

    const getTypeLabel = (type: PaymentMethodType) => {
        switch (type) {
            case 'bank': return 'Bank Account';
            case 'card': return 'Credit/Debit Card';
            case 'omt': return 'OMT';
            case 'whish': return 'Whish Money';
        }
    };

    const getMethodDetails = (method: PaymentMethodData) => {
        switch (method.type) {
            case 'bank':
                return `****${method.account_number_encrypted?.slice(-4) || '****'}`;
            case 'card':
                return `****${method.card_last_four || '****'}`;
            case 'omt':
                return method.omt_phone_number || '';
            case 'whish':
                return method.whish_id || '';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading payment methods...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Payment Methods</Text>
                    <Text style={styles.headerSubtitle}>
                        Manage how you receive payments as a seller
                    </Text>
                </View>

                {/* Payment Methods List */}
                <View style={styles.section}>
                    {paymentMethods.map((method) => (
                        <View key={method.id} style={styles.methodCard}>
                            <View style={styles.methodIcon}>
                                {getIcon(method.type)}
                            </View>
                            <View style={styles.methodInfo}>
                                <View style={styles.methodHeader}>
                                    <Text style={styles.methodName}>{method.name}</Text>
                                    {method.is_default && (
                                        <View style={styles.defaultBadge}>
                                            <Text style={styles.defaultText}>Default</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.methodDetails}>{getMethodDetails(method)}</Text>
                                <Text style={styles.methodType}>{getTypeLabel(method.type)}</Text>
                            </View>
                            <View style={styles.methodActions}>
                                {!method.is_default && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => method.id && handleSetDefault(method.id)}
                                    >
                                        <Check size={18} color={COLORS.primary} />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => method.id && handleDelete(method.id)}
                                >
                                    <Trash2 size={18} color={COLORS.error} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {paymentMethods.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No payment methods added yet</Text>
                        </View>
                    )}
                </View>

                {/* Add Payment Method Button */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowAddModal(true)}
                >
                    <Plus size={20} color="white" />
                    <Text style={styles.addButtonText}>Add Payment Method</Text>
                </TouchableOpacity>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>💡 Payment Options</Text>
                    <Text style={styles.infoText}>
                        • <Text style={styles.infoBold}>Bank Account:</Text> Direct ACH transfers (2-3 business days){'\n'}
                        • <Text style={styles.infoBold}>OMT:</Text> Instant mobile money transfer in Lebanon{'\n'}
                        • <Text style={styles.infoBold}>Whish Money:</Text> Fast digital wallet payments{'\n'}
                        • <Text style={styles.infoBold}>Credit Card:</Text> For buyer payments only
                    </Text>
                </View>
            </ScrollView>

            {/* Add Payment Method Modal */}
            <Modal
                visible={showAddModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowAddModal(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {selectedType ? 'Add ' + getTypeLabel(selectedType) : 'Choose Payment Method'}
                        </Text>
                        <TouchableOpacity onPress={() => {
                            setShowAddModal(false);
                            setSelectedType(null);
                        }}>
                            <Text style={styles.modalClose}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {!selectedType ? (
                        <ScrollView style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.typeOption}
                                onPress={() => setSelectedType('bank')}
                            >
                                <Building2 size={24} color={COLORS.primary} />
                                <View style={styles.typeInfo}>
                                    <Text style={styles.typeName}>Bank Account</Text>
                                    <Text style={styles.typeDescription}>ACH transfers (2-3 days)</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.typeOption}
                                onPress={() => setSelectedType('omt')}
                            >
                                <Smartphone size={24} color={COLORS.primary} />
                                <View style={styles.typeInfo}>
                                    <Text style={styles.typeName}>OMT</Text>
                                    <Text style={styles.typeDescription}>Instant mobile money (Lebanon)</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.typeOption}
                                onPress={() => setSelectedType('whish')}
                            >
                                <Smartphone size={24} color={COLORS.primary} />
                                <View style={styles.typeInfo}>
                                    <Text style={styles.typeName}>Whish Money</Text>
                                    <Text style={styles.typeDescription}>Fast digital wallet</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.typeOption}
                                onPress={() => setSelectedType('card')}
                            >
                                <CreditCard size={24} color={COLORS.primary} />
                                <View style={styles.typeInfo}>
                                    <Text style={styles.typeName}>Credit/Debit Card</Text>
                                    <Text style={styles.typeDescription}>For making payments</Text>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    ) : (
                        <ScrollView style={styles.modalContent}>
                            {selectedType === 'bank' && <BankAccountForm onCancel={() => setSelectedType(null)} onSubmit={handleAddPaymentMethod} />}
                            {selectedType === 'omt' && <OMTForm onCancel={() => setSelectedType(null)} onSubmit={handleAddPaymentMethod} />}
                            {selectedType === 'whish' && <WhishMoneyForm onCancel={() => setSelectedType(null)} onSubmit={handleAddPaymentMethod} />}
                            {selectedType === 'card' && <CardForm onCancel={() => setSelectedType(null)} onSubmit={handleAddPaymentMethod} />}
                        </ScrollView>
                    )}
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

// Bank Account Form Component
function BankAccountForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (data: any) => void }) {
    const [formData, setFormData] = useState({
        accountName: '',
        routingNumber: '',
        accountNumber: '',
        accountType: 'checking',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await onSubmit({
                type: 'bank' as PaymentMethodType,
                name: `${formData.accountName} - ${formData.accountType}`,
                account_holder_name: formData.accountName,
                routing_number: formData.routingNumber,
                account_number_encrypted: formData.accountNumber, // In production, encrypt this
                account_type: formData.accountType,
                is_default: false,
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Account Holder Name *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.accountName}
                    onChangeText={(text) => setFormData({ ...formData, accountName: text })}
                    placeholder="John Doe"
                    placeholderTextColor={COLORS.textMuted}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Routing Number *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.routingNumber}
                    onChangeText={(text) => setFormData({ ...formData, routingNumber: text })}
                    placeholder="123456789"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Account Number *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.accountNumber}
                    onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
                    placeholder="1234567890"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="numeric"
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={[styles.submitButton, saving && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>Add Bank Account</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelFormButton} onPress={onCancel} disabled={saving}>
                    <Text style={styles.cancelFormButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// OMT Form Component
function OMTForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (data: any) => void }) {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        idNumber: '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await onSubmit({
                type: 'omt' as PaymentMethodType,
                name: `OMT - ${formData.phoneNumber}`,
                omt_full_name: formData.fullName,
                omt_phone_number: formData.phoneNumber,
                omt_id_number: formData.idNumber,
                is_default: false,
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name (as per ID) *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.fullName}
                    onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                    placeholder="John Doe"
                    placeholderTextColor={COLORS.textMuted}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Mobile Number *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.phoneNumber}
                    onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                    placeholder="+961 71 123 456"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>ID Number (Optional)</Text>
                <TextInput
                    style={styles.input}
                    value={formData.idNumber}
                    onChangeText={(text) => setFormData({ ...formData, idNumber: text })}
                    placeholder="Lebanese ID Number"
                    placeholderTextColor={COLORS.textMuted}
                />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    ℹ️ OMT transfers are instant and available in Lebanon. Ensure your mobile number is registered with OMT.
                </Text>
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={[styles.submitButton, saving && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>Add OMT Account</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelFormButton} onPress={onCancel} disabled={saving}>
                    <Text style={styles.cancelFormButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Whish Money Form Component
function WhishMoneyForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (data: any) => void }) {
    const [formData, setFormData] = useState({
        whishId: '',
        phoneNumber: '',
        email: '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await onSubmit({
                type: 'whish' as PaymentMethodType,
                name: `Whish - ${formData.whishId}`,
                whish_id: formData.whishId,
                whish_phone_number: formData.phoneNumber,
                whish_email: formData.email,
                is_default: false,
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Whish ID *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.whishId}
                    onChangeText={(text) => setFormData({ ...formData, whishId: text })}
                    placeholder="@yourwhishid"
                    placeholderTextColor={COLORS.textMuted}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.phoneNumber}
                    onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                    placeholder="+1 (555) 123-4567"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="your@email.com"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    ℹ️ Whish Money provides fast digital wallet transfers. Make sure your account is verified.
                </Text>
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={[styles.submitButton, saving && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>Add Whish Account</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelFormButton} onPress={onCancel} disabled={saving}>
                    <Text style={styles.cancelFormButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Card Form Component
function CardForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (data: any) => void }) {
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const lastFour = formData.cardNumber.slice(-4);
            const [month, year] = formData.expiryDate.split('/');

            await onSubmit({
                type: 'card' as PaymentMethodType,
                name: `Card ending in ${lastFour}`,
                card_last_four: lastFour,
                card_brand: 'Unknown', // In production, detect card brand
                card_expiry_month: parseInt(month),
                card_expiry_year: parseInt(`20${year}`),
                is_default: false,
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Card Number *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.cardNumber}
                    onChangeText={(text) => setFormData({ ...formData, cardNumber: text })}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: SPACING.sm }]}>
                    <Text style={styles.label}>Expiry Date *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.expiryDate}
                        onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
                        placeholder="MM/YY"
                        placeholderTextColor={COLORS.textMuted}
                        keyboardType="numeric"
                    />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>CVV *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.cvv}
                        onChangeText={(text) => setFormData({ ...formData, cvv: text })}
                        placeholder="123"
                        placeholderTextColor={COLORS.textMuted}
                        keyboardType="numeric"
                        secureTextEntry
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Name on Card *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.nameOnCard}
                    onChangeText={(text) => setFormData({ ...formData, nameOnCard: text })}
                    placeholder="John Doe"
                    placeholderTextColor={COLORS.textMuted}
                />
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={[styles.submitButton, saving && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>Add Card</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelFormButton} onPress={onCancel} disabled={saving}>
                    <Text style={styles.cancelFormButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        marginBottom: SPACING.md,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    section: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
    methodCard: {
        flexDirection: 'row',
        padding: SPACING.md,
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.sm,
    },
    methodIcon: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    methodInfo: {
        flex: 1,
    },
    methodHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    methodName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginRight: SPACING.sm,
    },
    defaultBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: RADIUS.sm,
    },
    defaultText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
    },
    methodDetails: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 2,
    },
    methodType: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    methodActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: SPACING.sm,
        marginLeft: SPACING.xs,
    },
    emptyState: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.md,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: SPACING.sm,
    },
    infoBox: {
        backgroundColor: COLORS.primaryLight,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.md,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    infoText: {
        fontSize: 13,
        color: COLORS.text,
        lineHeight: 20,
    },
    infoBold: {
        fontWeight: '700',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    modalClose: {
        fontSize: 24,
        color: COLORS.textMuted,
    },
    modalContent: {
        flex: 1,
        padding: SPACING.md,
    },
    typeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.sm,
    },
    typeInfo: {
        marginLeft: SPACING.md,
        flex: 1,
    },
    typeName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    typeDescription: {
        fontSize: 13,
        color: COLORS.textMuted,
    },
    formContainer: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        fontSize: 16,
        color: COLORS.text,
    },
    row: {
        flexDirection: 'row',
    },
    buttonGroup: {
        marginTop: SPACING.lg,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    cancelFormButton: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cancelFormButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: 16,
        color: COLORS.textMuted,
    },
});
