import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Upload, CheckCircle, Building2, User, FileText, Shield } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getBusinessVerification, updateBusinessVerification, uploadBusinessDocument, AccountType, LegalForm } from '../services/profileService';

export default function VerificationScreen({ navigation }: any) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [accountType, setAccountType] = useState<AccountType>('individual');

    // Individual fields
    const [nationalId, setNationalId] = useState('');
    const [nationalIdDocument, setNationalIdDocument] = useState<string | null>(null);

    // Business fields
    const [legalEntityName, setLegalEntityName] = useState('');
    const [tradeName, setTradeName] = useState('');
    const [legalForm, setLegalForm] = useState<LegalForm>('sole_proprietorship');
    const [commercialRegisterNumber, setCommercialRegisterNumber] = useState('');
    const [taxId, setTaxId] = useState('');
    const [vatNumber, setVatNumber] = useState('');
    const [isVatRegistered, setIsVatRegistered] = useState(false);

    // Business address & contact
    const [registeredAddress, setRegisteredAddress] = useState('');
    const [officialEmail, setOfficialEmail] = useState('');
    const [supportPhone, setSupportPhone] = useState('');

    // Document uploads
    const [commercialRegisterDoc, setCommercialRegisterDoc] = useState<string | null>(null);
    const [mofCertificate, setMofCertificate] = useState<string | null>(null);
    const [vatCertificate, setVatCertificate] = useState<string | null>(null);

    useEffect(() => {
        loadVerificationData();
    }, []);

    const loadVerificationData = async () => {
        if (!user?.id) return;

        try {
            const data = await getBusinessVerification(user.id);

            // Set account type
            if (data.account_type) {
                setAccountType(data.account_type);
            }

            // Individual fields
            if (data.national_id) setNationalId(data.national_id);
            if (data.national_id_document_url) setNationalIdDocument(data.national_id_document_url);

            // Business fields
            if (data.legal_entity_name) setLegalEntityName(data.legal_entity_name);
            if (data.trade_name) setTradeName(data.trade_name);
            if (data.legal_form) setLegalForm(data.legal_form);
            if (data.commercial_register_number) setCommercialRegisterNumber(data.commercial_register_number);
            if (data.ministry_of_finance_tax_id) setTaxId(data.ministry_of_finance_tax_id);
            if (data.vat_registration_number) setVatNumber(data.vat_registration_number);
            if (data.is_vat_registered !== undefined) setIsVatRegistered(data.is_vat_registered);

            // Documents
            if (data.commercial_register_document_url) setCommercialRegisterDoc(data.commercial_register_document_url);
            if (data.mof_certificate_url) setMofCertificate(data.mof_certificate_url);
            if (data.vat_certificate_url) setVatCertificate(data.vat_certificate_url);

            // Contact
            if (data.registered_business_address) setRegisteredAddress(data.registered_business_address);
            if (data.official_email) setOfficialEmail(data.official_email);
            if (data.support_phone) setSupportPhone(data.support_phone);
        } catch (error) {
            console.error('Error loading verification data:', error);
            Alert.alert('Error', 'Failed to load verification data');
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentUpload = (docType: 'national_id' | 'commercial_register' | 'mof_certificate' | 'vat_certificate') => {
        // TODO: Implement document picker
        // For now, just show alert
        Alert.alert('Upload', `Upload ${docType} document - Document picker to be implemented`);

        // Example of how to use the upload function:
        // const result = await DocumentPicker.getDocumentAsync({});
        // if (result.type === 'success') {
        //     const url = await uploadBusinessDocument(user.id, docType, result.file, result.name);
        //     // Update state based on docType
        // }
    };

    const validateForm = () => {
        if (accountType === 'individual') {
            if (!nationalId.trim()) {
                Alert.alert('Validation Error', 'National ID number is required');
                return false;
            }
            if (!nationalIdDocument) {
                Alert.alert('Validation Error', 'Please upload your National ID document');
                return false;
            }
        } else if (accountType === 'business') {
            if (!legalEntityName.trim()) {
                Alert.alert('Validation Error', 'Legal entity name is required');
                return false;
            }
            if (!tradeName.trim()) {
                Alert.alert('Validation Error', 'Trade name is required');
                return false;
            }
            if (!commercialRegisterNumber.trim()) {
                Alert.alert('Validation Error', 'Commercial Register number is required');
                return false;
            }
            if (!taxId.trim()) {
                Alert.alert('Validation Error', 'Ministry of Finance Tax ID is required');
                return false;
            }
            if (isVatRegistered && !vatNumber.trim()) {
                Alert.alert('Validation Error', 'VAT registration number is required for VAT registered businesses');
                return false;
            }
            if (!commercialRegisterDoc) {
                Alert.alert('Validation Error', 'Please upload Commercial Register extract');
                return false;
            }
            if (!mofCertificate) {
                Alert.alert('Validation Error', 'Please upload MoF registration certificate');
                return false;
            }
            if (isVatRegistered && !vatCertificate) {
                Alert.alert('Validation Error', 'Please upload VAT certificate');
                return false;
            }
            if (!registeredAddress.trim()) {
                Alert.alert('Validation Error', 'Registered business address is required');
                return false;
            }
            if (!officialEmail.trim()) {
                Alert.alert('Validation Error', 'Official email is required');
                return false;
            }
            if (!supportPhone.trim()) {
                Alert.alert('Validation Error', 'Support phone number is required');
                return false;
            }
        }
        return true;
    };

    const handleSave = async () => {
        if (!user?.id) return;

        if (!validateForm()) {
            return;
        }

        setSaving(true);
        try {
            const verificationData = {
                account_type: accountType,

                // Individual fields
                ...(accountType === 'individual' && {
                    national_id: nationalId,
                    national_id_document_url: nationalIdDocument || undefined,
                }),

                // Business fields
                ...(accountType === 'business' && {
                    legal_entity_name: legalEntityName,
                    trade_name: tradeName,
                    legal_form: legalForm,
                    commercial_register_number: commercialRegisterNumber,
                    ministry_of_finance_tax_id: taxId,
                    vat_registration_number: isVatRegistered ? vatNumber : undefined,
                    is_vat_registered: isVatRegistered,
                    commercial_register_document_url: commercialRegisterDoc || undefined,
                    mof_certificate_url: mofCertificate || undefined,
                    vat_certificate_url: isVatRegistered ? (vatCertificate || undefined) : undefined,
                    registered_business_address: registeredAddress,
                    official_email: officialEmail,
                    support_phone: supportPhone,
                }),
            };

            await updateBusinessVerification(user.id, verificationData);

            Alert.alert(
                'Success',
                'Verification information saved! Your submission is under review.',
                [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]
            );
        } catch (error) {
            console.error('Error saving verification:', error);
            Alert.alert('Error', 'Failed to save verification information. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const getLegalFormLabel = (form: LegalForm) => {
        switch (form) {
            case 'sole_proprietorship': return 'Sole Proprietorship';
            case 'sarl': return 'SARL';
            case 'sal': return 'SAL';
            case 'other': return 'Other';
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading verification data...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
            >
                {/* Account Type Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Are you selling as:</Text>

                    <View style={styles.typeSelector}>
                        <TouchableOpacity
                            style={[styles.typeCard, accountType === 'individual' && styles.typeCardActive]}
                            onPress={() => setAccountType('individual')}
                        >
                            <User size={32} color={accountType === 'individual' ? COLORS.primary : COLORS.textMuted} />
                            <Text style={[styles.typeTitle, accountType === 'individual' && styles.typeTitleActive]}>
                                Individual
                            </Text>
                            <Text style={styles.typeDescription}>Personal seller</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.typeCard, accountType === 'business' && styles.typeCardActive]}
                            onPress={() => setAccountType('business')}
                        >
                            <Building2 size={32} color={accountType === 'business' ? COLORS.primary : COLORS.textMuted} />
                            <Text style={[styles.typeTitle, accountType === 'business' && styles.typeTitleActive]}>
                                Registered Business
                            </Text>
                            <Text style={styles.typeDescription}>Company or organization</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Individual Verification */}
                {accountType === 'individual' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Individual Verification</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>National ID Number *</Text>
                            <TextInput
                                style={styles.input}
                                value={nationalId}
                                onChangeText={setNationalId}
                                placeholder="Enter your national ID number"
                                placeholderTextColor={COLORS.textMuted}
                            />
                        </View>

                        <View style={styles.uploadSection}>
                            <Text style={styles.label}>National ID Document *</Text>
                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={() => handleDocumentUpload('national_id')}
                            >
                                <Upload size={20} color={COLORS.primary} />
                                <Text style={styles.uploadButtonText}>
                                    {nationalIdDocument ? 'Change Document' : 'Upload National ID'}
                                </Text>
                            </TouchableOpacity>
                            {nationalIdDocument && (
                                <View style={styles.uploadedBadge}>
                                    <CheckCircle size={16} color={COLORS.success} />
                                    <Text style={styles.uploadedText}>Document uploaded</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* Business Verification */}
                {accountType === 'business' && (
                    <>
                        {/* Business Identity */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Business Identity</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Legal Entity Name *</Text>
                                <Text style={styles.helperText}>As registered in Commercial Register</Text>
                                <TextInput
                                    style={styles.input}
                                    value={legalEntityName}
                                    onChangeText={setLegalEntityName}
                                    placeholder="e.g., ABC Trading Company S.A.R.L."
                                    placeholderTextColor={COLORS.textMuted}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Trade Name / Brand Name *</Text>
                                <Text style={styles.helperText}>What customers see</Text>
                                <TextInput
                                    style={styles.input}
                                    value={tradeName}
                                    onChangeText={setTradeName}
                                    placeholder="e.g., ABC Store"
                                    placeholderTextColor={COLORS.textMuted}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Legal Form *</Text>
                                <View style={styles.legalFormSelector}>
                                    {(['sole_proprietorship', 'sarl', 'sal', 'other'] as LegalForm[]).map((form) => (
                                        <TouchableOpacity
                                            key={form}
                                            style={[
                                                styles.legalFormOption,
                                                legalForm === form && styles.legalFormOptionActive
                                            ]}
                                            onPress={() => setLegalForm(form)}
                                        >
                                            <Text style={[
                                                styles.legalFormText,
                                                legalForm === form && styles.legalFormTextActive
                                            ]}>
                                                {getLegalFormLabel(form)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* Business Registration */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Business Registration</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Commercial Register Number *</Text>
                                <Text style={styles.helperText}>رقم السجل التجاري</Text>
                                <TextInput
                                    style={styles.input}
                                    value={commercialRegisterNumber}
                                    onChangeText={setCommercialRegisterNumber}
                                    placeholder="Enter Commercial Register number"
                                    placeholderTextColor={COLORS.textMuted}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Ministry of Finance Tax ID / TIN *</Text>
                                <Text style={styles.helperText}>رقم المكلف</Text>
                                <TextInput
                                    style={styles.input}
                                    value={taxId}
                                    onChangeText={setTaxId}
                                    placeholder="Enter Tax ID"
                                    placeholderTextColor={COLORS.textMuted}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <TouchableOpacity
                                    style={styles.checkboxRow}
                                    onPress={() => setIsVatRegistered(!isVatRegistered)}
                                >
                                    <View style={[styles.checkbox, isVatRegistered && styles.checkboxChecked]}>
                                        {isVatRegistered && <CheckCircle size={16} color="white" />}
                                    </View>
                                    <Text style={styles.checkboxLabel}>VAT Registered</Text>
                                </TouchableOpacity>
                            </View>

                            {isVatRegistered && (
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>VAT Registration Number *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={vatNumber}
                                        onChangeText={setVatNumber}
                                        placeholder="Enter VAT number"
                                        placeholderTextColor={COLORS.textMuted}
                                    />
                                </View>
                            )}
                        </View>

                        {/* Business Documents */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Business Documents</Text>

                            <View style={styles.uploadSection}>
                                <Text style={styles.label}>Recent Commercial Register Extract *</Text>
                                <TouchableOpacity
                                    style={styles.uploadButton}
                                    onPress={() => handleDocumentUpload('commercial_register')}
                                >
                                    <Upload size={20} color={COLORS.primary} />
                                    <Text style={styles.uploadButtonText}>
                                        {commercialRegisterDoc ? 'Change Document' : 'Upload CR Extract'}
                                    </Text>
                                </TouchableOpacity>
                                {commercialRegisterDoc && (
                                    <View style={styles.uploadedBadge}>
                                        <CheckCircle size={16} color={COLORS.success} />
                                        <Text style={styles.uploadedText}>Document uploaded</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.uploadSection}>
                                <Text style={styles.label}>MoF Registration Certificate *</Text>
                                <TouchableOpacity
                                    style={styles.uploadButton}
                                    onPress={() => handleDocumentUpload('mof_certificate')}
                                >
                                    <Upload size={20} color={COLORS.primary} />
                                    <Text style={styles.uploadButtonText}>
                                        {mofCertificate ? 'Change Document' : 'Upload MoF Certificate'}
                                    </Text>
                                </TouchableOpacity>
                                {mofCertificate && (
                                    <View style={styles.uploadedBadge}>
                                        <CheckCircle size={16} color={COLORS.success} />
                                        <Text style={styles.uploadedText}>Document uploaded</Text>
                                    </View>
                                )}
                            </View>

                            {isVatRegistered && (
                                <View style={styles.uploadSection}>
                                    <Text style={styles.label}>VAT Registration Certificate *</Text>
                                    <TouchableOpacity
                                        style={styles.uploadButton}
                                        onPress={() => handleDocumentUpload('vat_certificate')}
                                    >
                                        <Upload size={20} color={COLORS.primary} />
                                        <Text style={styles.uploadButtonText}>
                                            {vatCertificate ? 'Change Document' : 'Upload VAT Certificate'}
                                        </Text>
                                    </TouchableOpacity>
                                    {vatCertificate && (
                                        <View style={styles.uploadedBadge}>
                                            <CheckCircle size={16} color={COLORS.success} />
                                            <Text style={styles.uploadedText}>Document uploaded</Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>

                        {/* Business Contact & Address */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Business Contact & Address</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Registered Business Address *</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={registeredAddress}
                                    onChangeText={setRegisteredAddress}
                                    placeholder="Full registered address as per Commercial Register"
                                    placeholderTextColor={COLORS.textMuted}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Official Email *</Text>
                                <Text style={styles.helperText}>For invoices and contracts</Text>
                                <TextInput
                                    style={styles.input}
                                    value={officialEmail}
                                    onChangeText={setOfficialEmail}
                                    placeholder="business@company.com"
                                    placeholderTextColor={COLORS.textMuted}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Phone / WhatsApp *</Text>
                                <Text style={styles.helperText}>For customer support</Text>
                                <TextInput
                                    style={styles.input}
                                    value={supportPhone}
                                    onChangeText={setSupportPhone}
                                    placeholder="+961 XX XXX XXX"
                                    placeholderTextColor={COLORS.textMuted}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                    </>
                )}

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>📋 Verification Guidelines</Text>
                    <Text style={styles.infoText}>
                        • All documents must be clear and legible{'\n'}
                        • Documents must be current and not expired{'\n'}
                        • Business names must match across all documents{'\n'}
                        • Processing time: 1-3 business days{'\n'}
                        • You'll be notified via email once reviewed
                    </Text>
                </View>

                {/* Save Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Verification Info</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
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
    section: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    typeSelector: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    typeCard: {
        flex: 1,
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.border,
        padding: SPACING.md,
        alignItems: 'center',
    },
    typeCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    typeTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: SPACING.sm,
    },
    typeTitleActive: {
        color: COLORS.primary,
    },
    typeDescription: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 4,
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
    helperText: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: SPACING.xs,
    },
    input: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        fontSize: 16,
        color: COLORS.text,
    },
    textArea: {
        minHeight: 80,
        paddingTop: SPACING.md,
    },
    legalFormSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    legalFormOption: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
    },
    legalFormOptionActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    legalFormText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    legalFormTextActive: {
        color: 'white',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: RADIUS.sm,
        borderWidth: 2,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    checkboxChecked: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    checkboxLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    uploadSection: {
        marginBottom: SPACING.md,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryLight,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        borderStyle: 'dashed',
    },
    uploadButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        marginLeft: SPACING.sm,
    },
    uploadedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.xs,
    },
    uploadedText: {
        fontSize: 12,
        color: COLORS.success,
        marginLeft: SPACING.xs,
        fontWeight: '600',
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
    buttonContainer: {
        padding: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    saveButtonDisabled: {
        opacity: 0.6,
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
