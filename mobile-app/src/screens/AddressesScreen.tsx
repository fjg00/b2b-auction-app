import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { MapPin, Plus, Trash2, Star, Edit2 } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress, Address as AddressType } from '../services/profileService';

// Lebanese Governorates and their Cazas
const GOVERNORATES = [
    { name: 'Beirut', cazas: ['Beirut'] },
    { name: 'Mount Lebanon', cazas: ['Baabda', 'Aley', 'Chouf', 'Keserwan', 'Matn', 'Jbeil'] },
    { name: 'North', cazas: ['Tripoli', 'Zgharta', 'Bsharri', 'Batroun', 'Koura', 'Miniyeh-Danniyeh', 'Akkar'] },
    { name: 'South', cazas: ['Sidon', 'Tyre', 'Jezzine'] },
    { name: 'Beqaa', cazas: ['Zahle', 'Rashaya', 'Western Beqaa', 'Baalbek', 'Hermel'] },
    { name: 'Nabatieh', cazas: ['Nabatieh', 'Bint Jbeil', 'Marjeyoun', 'Hasbaya'] },
];

export default function AddressesScreen({ navigation }: any) {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<AddressType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        if (!user?.id) return;

        try {
            const data = await getAddresses(user.id);
            setAddresses(data);
        } catch (error) {
            console.error('Error loading addresses:', error);
            Alert.alert('Error', 'Failed to load addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!user?.id) return;

        Alert.alert(
            'Delete Address',
            'Are you sure you want to delete this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAddress(id, user.id);
                            setAddresses(addresses.filter(addr => addr.id !== id));
                            Alert.alert('Success', 'Address deleted successfully');
                        } catch (error) {
                            console.error('Error deleting address:', error);
                            Alert.alert('Error', 'Failed to delete address');
                        }
                    },
                },
            ]
        );
    };

    const handleSetDefault = async (id: string) => {
        if (!user?.id) return;

        try {
            await setDefaultAddress(id, user.id);
            setAddresses(addresses.map(addr => ({
                ...addr,
                is_default: addr.id === id,
            })));
            Alert.alert('Success', 'Default address updated');
        } catch (error) {
            console.error('Error setting default:', error);
            Alert.alert('Error', 'Failed to set default address');
        }
    };

    const handleEdit = (address: AddressType) => {
        setEditingAddress(address);
        setShowAddModal(true);
    };

    const handleSaveAddress = async (addressData: Omit<AddressType, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
        if (!user?.id) return;

        try {
            if (editingAddress?.id) {
                // Update existing
                await updateAddress(editingAddress.id, user.id, addressData);
                Alert.alert('Success', 'Address updated successfully');
            } else {
                // Create new
                await createAddress(user.id, addressData);
                Alert.alert('Success', 'Address added successfully');
            }

            // Reload addresses
            await loadAddresses();
            setShowAddModal(false);
            setEditingAddress(null);
        } catch (error) {
            console.error('Error saving address:', error);
            Alert.alert('Error', 'Failed to save address');
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'pickup': return 'Pickup Only';
            case 'delivery': return 'Delivery Only';
            case 'both': return 'Pickup & Delivery';
            default: return type;
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading addresses...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Addresses</Text>
                    <Text style={styles.headerSubtitle}>
                        Manage your pickup and delivery locations
                    </Text>
                </View>

                {/* Addresses List */}
                <View style={styles.section}>
                    {addresses.map((address) => (
                        <View key={address.id} style={styles.addressCard}>
                            <View style={styles.addressHeader}>
                                <View style={styles.addressTitleRow}>
                                    <MapPin size={20} color={COLORS.primary} />
                                    <Text style={styles.addressName}>{address.name}</Text>
                                    {address.is_default && (
                                        <View style={styles.defaultBadge}>
                                            <Star size={12} color="white" fill="white" />
                                            <Text style={styles.defaultText}>Default</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.typeBadge}>
                                    <Text style={styles.typeText}>{getTypeLabel(address.type)}</Text>
                                </View>
                            </View>

                            <View style={styles.addressBody}>
                                <Text style={styles.addressStreet}>{address.street}</Text>
                                <Text style={styles.addressCity}>
                                    {address.city}, {address.state} ({address.zip_code})
                                </Text>
                                <Text style={styles.addressCountry}>{address.country}</Text>
                                <Text style={styles.addressPhone}>📞 {address.phone}</Text>

                                {address.notes && (
                                    <View style={styles.notesBox}>
                                        <Text style={styles.notesLabel}>Notes:</Text>
                                        <Text style={styles.notesText}>{address.notes}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.addressActions}>
                                {!address.is_default && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => address.id && handleSetDefault(address.id)}
                                    >
                                        <Star size={16} color={COLORS.primary} />
                                        <Text style={styles.actionText}>Set Default</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleEdit(address)}
                                >
                                    <Edit2 size={16} color={COLORS.text} />
                                    <Text style={styles.actionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => address.id && handleDelete(address.id)}
                                >
                                    <Trash2 size={16} color={COLORS.error} />
                                    <Text style={[styles.actionText, { color: COLORS.error }]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {addresses.length === 0 && (
                        <View style={styles.emptyState}>
                            <MapPin size={48} color={COLORS.textMuted} />
                            <Text style={styles.emptyText}>No addresses added yet</Text>
                        </View>
                    )}
                </View>

                {/* Add Address Button */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        setEditingAddress(null);
                        setShowAddModal(true);
                    }}
                >
                    <Plus size={20} color="white" />
                    <Text style={styles.addButtonText}>Add New Address</Text>
                </TouchableOpacity>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>📍 Address Tips</Text>
                    <Text style={styles.infoText}>
                        • Add detailed notes about loading docks, access hours, and equipment{'\n'}
                        • Set a default address for faster checkout{'\n'}
                        • Specify if location is pickup-only or supports delivery{'\n'}
                        • Keep contact numbers up to date for coordination
                    </Text>
                </View>
            </ScrollView>

            {/* Add/Edit Address Modal */}
            <Modal
                visible={showAddModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowAddModal(false)}
            >
                <AddressForm
                    address={editingAddress}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingAddress(null);
                    }}
                    onSave={handleSaveAddress}
                />
            </Modal>
        </SafeAreaView>
    );
}

// Address Form Component
function AddressForm({ address, onClose, onSave }: { address: AddressType | null; onClose: () => void; onSave: (address: any) => void }) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: address?.name || '',
        street: address?.street || '',
        city: address?.city || '',
        governorate: address?.state || '',
        caza: address?.zip_code || '',
        country: address?.country || 'Lebanon',
        phone: address?.phone || '',
        notes: address?.notes || '',
        type: address?.type || 'both',
        isDefault: address?.is_default || false,
    });

    const selectedGovernorate = GOVERNORATES.find(g => g.name === formData.governorate);

    const validateForm = () => {
        if (!formData.name.trim()) {
            Alert.alert('Validation Error', 'Address name is required');
            return false;
        }
        if (!formData.street.trim()) {
            Alert.alert('Validation Error', 'Street address is required');
            return false;
        }
        if (!formData.city.trim()) {
            Alert.alert('Validation Error', 'City is required');
            return false;
        }
        if (!formData.governorate.trim()) {
            Alert.alert('Validation Error', 'Governorate is required');
            return false;
        }
        if (!formData.caza.trim()) {
            Alert.alert('Validation Error', 'Caza is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setSaving(true);
        try {
            await onSave({
                name: formData.name,
                street: formData.street,
                city: formData.city,
                state: formData.governorate,
                zip_code: formData.caza,
                country: formData.country,
                phone: formData.phone,
                notes: formData.notes,
                type: formData.type,
                is_default: formData.isDefault,
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{address ? 'Edit Address' : 'Add New Address'}</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Location Name *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        placeholder="e.g., Main Warehouse, Store #1"
                        placeholderTextColor={COLORS.textMuted}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Street Address *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.street}
                        onChangeText={(text) => setFormData({ ...formData, street: text })}
                        placeholder="123 Main Street"
                        placeholderTextColor={COLORS.textMuted}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>City *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.city}
                        onChangeText={(text) => setFormData({ ...formData, city: text })}
                        placeholder="e.g., Beirut, Tripoli, Sidon"
                        placeholderTextColor={COLORS.textMuted}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Governorate (Mohafazah) *</Text>
                    <View style={styles.dropdownList}>
                        {GOVERNORATES.map((gov) => (
                            <TouchableOpacity
                                key={gov.name}
                                style={[
                                    styles.dropdownItem,
                                    formData.governorate === gov.name && styles.dropdownItemActive
                                ]}
                                onPress={() => setFormData({ ...formData, governorate: gov.name, caza: '' })}
                            >
                                <View style={[
                                    styles.radioButton,
                                    formData.governorate === gov.name && styles.radioButtonActive
                                ]}>
                                    {formData.governorate === gov.name && (
                                        <View style={styles.radioDot} />
                                    )}
                                </View>
                                <Text style={[
                                    styles.dropdownText,
                                    formData.governorate === gov.name && styles.dropdownTextActive
                                ]}>
                                    {gov.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {selectedGovernorate && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Caza (District) *</Text>
                        <View style={styles.dropdownList}>
                            {selectedGovernorate.cazas.map((caza) => (
                                <TouchableOpacity
                                    key={caza}
                                    style={[
                                        styles.dropdownItem,
                                        formData.caza === caza && styles.dropdownItemActive
                                    ]}
                                    onPress={() => setFormData({ ...formData, caza })}
                                >
                                    <View style={[
                                        styles.radioButton,
                                        formData.caza === caza && styles.radioButtonActive
                                    ]}>
                                        {formData.caza === caza && (
                                            <View style={styles.radioDot} />
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.dropdownText,
                                        formData.caza === caza && styles.dropdownTextActive
                                    ]}>
                                        {caza}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.phone}
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        placeholder="+961 71 123 456"
                        placeholderTextColor={COLORS.textMuted}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Location Type *</Text>
                    <View style={styles.typeSelector}>
                        {(['both', 'pickup', 'delivery'] as const).map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.typeOption,
                                    formData.type === type && styles.typeOptionActive
                                ]}
                                onPress={() => setFormData({ ...formData, type: type })}
                            >
                                <Text style={[
                                    styles.typeOptionText,
                                    formData.type === type && styles.typeOptionTextActive
                                ]}>
                                    {type === 'both' ? 'Both' : type === 'pickup' ? 'Pickup' : 'Delivery'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Notes (Optional)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.notes}
                        onChangeText={(text) => setFormData({ ...formData, notes: text })}
                        placeholder="Loading dock info, access hours, special instructions..."
                        placeholderTextColor={COLORS.textMuted}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
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
                            <Text style={styles.submitButtonText}>
                                {address ? 'Update Address' : 'Add Address'}
                            </Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelFormButton}
                        onPress={onClose}
                        disabled={saving}
                    >
                        <Text style={styles.cancelFormButtonText}>Cancel</Text>
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
    addressCard: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
    addressHeader: {
        marginBottom: SPACING.sm,
    },
    addressTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    addressName: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginLeft: SPACING.xs,
        flex: 1,
    },
    defaultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: RADIUS.full,
    },
    defaultText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
        marginLeft: 4,
    },
    typeBadge: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
    },
    typeText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.primary,
    },
    addressBody: {
        marginBottom: SPACING.sm,
    },
    addressStreet: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 2,
    },
    addressCity: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 2,
    },
    addressCountry: {
        fontSize: 13,
        color: COLORS.textMuted,
        marginBottom: SPACING.xs,
    },
    addressPhone: {
        fontSize: 13,
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    notesBox: {
        backgroundColor: COLORS.primaryLight,
        padding: SPACING.sm,
        borderRadius: RADIUS.sm,
        marginTop: SPACING.xs,
    },
    notesLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    notesText: {
        fontSize: 12,
        color: COLORS.text,
        lineHeight: 16,
    },
    addressActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: SPACING.sm,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
    },
    actionText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 4,
    },
    emptyState: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: SPACING.sm,
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
    typeSelector: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    typeOption: {
        flex: 1,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
    },
    typeOptionActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    typeOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    typeOptionTextActive: {
        color: 'white',
    },
    textArea: {
        minHeight: 80,
        paddingTop: SPACING.md,
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
    pickerContainer: {
        marginTop: SPACING.xs,
    },
    pickerScroll: {
        flexDirection: 'row',
    },
    pickerOption: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        marginRight: SPACING.xs,
    },
    pickerOptionActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    pickerOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.surface,
        overflow: 'hidden',
        maxHeight: 250,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    dropdownItemActive: {
        backgroundColor: COLORS.primaryLight,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.border,
        marginRight: SPACING.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonActive: {
        borderColor: COLORS.primary,
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
    },
    dropdownText: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: '500',
    },
    dropdownTextActive: {
        color: COLORS.primary,
        fontWeight: '600',
    },

});
