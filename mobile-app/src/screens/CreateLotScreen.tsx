import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Modal, FlatList } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { createLot, updateAndRelistLot } from '../services/auctionService';
import { getAddresses, Address } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import { PRODUCT_CATEGORIES, CONDITION_CATEGORIES } from '@shared/constants';
import { Package, DollarSign, Upload, Calendar, ChevronDown, X, MapPin, Truck } from 'lucide-react-native';

export default function CreateLotScreen({ navigation, route }: any) {
    const { user } = useAuth();
    const editingLot = route.params?.lot; // Check if we are editing an existing lot
    const [submitting, setSubmitting] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        quantity: '',
        condition: '',
        warehouseId: '',
        deliveryMethod: 'Pickup',
        startBid: '',
        buyNow: '',
        duration: '3 Days',
    });

    // Picker State
    const [pickerVisible, setPickerVisible] = useState(false);
    const [pickerTitle, setPickerTitle] = useState('');
    const [pickerData, setPickerData] = useState<{ label: string; value: string }[]>([]);
    const [currentField, setCurrentField] = useState<string | null>(null);

    const openPicker = (field: string, title: string, data: { label: string; value: string }[]) => {
        setCurrentField(field);
        setPickerTitle(title);
        setPickerData(data);
        setPickerVisible(true);
    };

    const handleSelect = (value: string) => {
        if (currentField) {
            handleChange(currentField, value);
        }
        setPickerVisible(false);
    };

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const loadAddresses = async () => {
        if (user?.id) {
            const data = await getAddresses(user.id);
            setAddresses(data);
        }
    };

    useEffect(() => {
        loadAddresses();
        if (editingLot) {
            // Pre-fill form if editing
            setFormData({
                title: editingLot.title,
                category: '', // Category might not be in Lot type, leave empty or infer
                description: editingLot.description || '',
                quantity: editingLot.details?.quantity || '',
                condition: editingLot.condition || '',
                warehouseId: editingLot.warehouseId || '', // Map warehouse ID
                deliveryMethod: editingLot.details?.deliveryMethod || 'Pickup',
                startBid: editingLot.currentBid?.toString() || '',
                buyNow: editingLot.buyNowPrice?.toString() || '',
                duration: '7 Days', // Default for relist
            });
        }
    }, [user, editingLot]);

    const handleSubmit = async () => {
        if (!formData.title || !formData.quantity || !formData.startBid || !formData.warehouseId) {
            Alert.alert('Missing Fields', 'Please fill in all required fields, including warehouse location.');
            return;
        }

        if (!user) {
            Alert.alert('Error', 'You must be logged in to create a lot');
            return;
        }

        setSubmitting(true);
        try {
            let result;
            if (editingLot) {
                result = await updateAndRelistLot(editingLot.id, formData);
            } else {
                result = await createLot(formData, user.id);
            }

            if (result.success) {
                Alert.alert('Success', result.message, [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to submit lot');
        } finally {
            setSubmitting(false);
        }
    };

    const renderSectionHeader = (icon: React.ReactNode, title: string) => (
        <View style={styles.sectionHeader}>
            {icon}
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView
                style={styles.container}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>{editingLot ? 'Relist Item' : 'Create New Lot'}</Text>
                    <Text style={styles.subtitle}>{editingLot ? 'Update details and relist for 7 days.' : 'List your excess inventory for auction.'}</Text>
                </View>

                {/* Lot Details */}
                <View style={styles.card}>
                    {renderSectionHeader(<Package size={20} color={COLORS.primary} />, "Lot Details")}

                    <Text style={styles.label}>Lot Title *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Mixed Dairy Products"
                        value={formData.title}
                        onChangeText={t => handleChange('title', t)}
                    />

                    <Text style={styles.label}>Category</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => openPicker('category', 'Select Category', PRODUCT_CATEGORIES.map(c => ({ label: c, value: c })))}
                    >
                        <Text style={[styles.pickerText, !formData.category && styles.placeholderText]}>
                            {formData.category || 'Select Category'}
                        </Text>
                        <ChevronDown size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Describe items, brands, condition..."
                        multiline
                        numberOfLines={4}
                        value={formData.description}
                        onChangeText={t => handleChange('description', t)}
                    />
                </View>

                {/* Inventory */}
                <View style={styles.card}>
                    {renderSectionHeader(<Package size={20} color={COLORS.primary} />, "Inventory & Condition")}

                    <Text style={styles.label}>Quantity *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., 100 Cases"
                        value={formData.quantity}
                        onChangeText={t => handleChange('quantity', t)}
                    />

                    <Text style={styles.label}>Condition</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => openPicker('condition', 'Select Condition', CONDITION_CATEGORIES.map(c => ({ label: c, value: c })))}
                    >
                        <Text style={[styles.pickerText, !formData.condition && styles.placeholderText]}>
                            {formData.condition || 'Select Condition'}
                        </Text>
                        <ChevronDown size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    <Text style={styles.label}>Warehouse Location *</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => openPicker(
                            'warehouseId',
                            'Select Warehouse',
                            addresses.map(a => ({ label: a.name, value: a.id || '' }))
                        )}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MapPin size={16} color={COLORS.textMuted} style={{ marginRight: 8 }} />
                            <Text style={[styles.pickerText, !formData.warehouseId && styles.placeholderText]}>
                                {addresses.find(a => a.id === formData.warehouseId)?.name || 'Select Warehouse'}
                            </Text>
                        </View>
                        <ChevronDown size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    <Text style={styles.label}>Delivery Method *</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => openPicker(
                            'deliveryMethod',
                            'Select Delivery Method',
                            [
                                { label: 'Pickup Only', value: 'Pickup' },
                                { label: 'Delivery Only', value: 'Delivery' },
                                { label: 'Negotiable', value: 'Negotiable' }
                            ]
                        )}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Truck size={16} color={COLORS.textMuted} style={{ marginRight: 8 }} />
                            <Text style={[styles.pickerText, !formData.deliveryMethod && styles.placeholderText]}>
                                {formData.deliveryMethod || 'Select Method'}
                            </Text>
                        </View>
                        <ChevronDown size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* Pricing */}
                <View style={styles.card}>
                    {renderSectionHeader(<DollarSign size={20} color={COLORS.primary} />, "Pricing & Auction")}

                    <Text style={styles.label}>Starting Bid ($) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={formData.startBid}
                        onChangeText={t => handleChange('startBid', t)}
                    />

                    <Text style={styles.label}>Buy Now Price ($)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={formData.buyNow}
                        onChangeText={t => handleChange('buyNow', t)}
                    />

                    <Text style={styles.label}>Duration</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.duration}
                        editable={false}
                    />
                </View>

                {/* Photos */}
                <View style={styles.card}>
                    {renderSectionHeader(<Upload size={20} color={COLORS.primary} />, "Photos")}
                    <TouchableOpacity style={styles.uploadArea}>
                        <Upload size={32} color={COLORS.textMuted} />
                        <Text style={styles.uploadText}>Tap to upload photos</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, submitting && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    <Text style={styles.submitButtonText}>{submitting ? 'Processing...' : (editingLot ? 'Update & Relist' : 'Publish Lot')}</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Selection Modal */}
            <Modal
                visible={pickerVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setPickerVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{pickerTitle}</Text>
                            <TouchableOpacity onPress={() => setPickerVisible(false)}>
                                <X size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={pickerData}
                            keyExtractor={item => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => handleSelect(item.value)}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        formData[currentField as keyof typeof formData] === item.value && styles.selectedItemText
                                    ]}>
                                        {item.label}
                                    </Text>
                                    {formData[currentField as keyof typeof formData] === item.value && (
                                        <View style={styles.selectedDot} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.md,
    },
    header: {
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        paddingBottom: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginLeft: SPACING.sm,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.sm,
        padding: SPACING.sm,
        fontSize: 16,
        color: COLORS.text,
        marginBottom: SPACING.md,
        backgroundColor: COLORS.background,
    },
    pickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.sm,
        padding: SPACING.sm,
        marginBottom: SPACING.md,
        backgroundColor: COLORS.background,
    },
    pickerText: {
        fontSize: 16,
        color: COLORS.text,
    },
    placeholderText: {
        color: '#9ca3af', // gray-400
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    uploadArea: {
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        borderRadius: RADIUS.md,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    uploadText: {
        marginTop: SPACING.sm,
        color: COLORS.textMuted,
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    disabledButton: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: RADIUS.lg,
        borderTopRightRadius: RADIUS.lg,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalItemText: {
        fontSize: 16,
        color: COLORS.text,
    },
    selectedItemText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    selectedDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },
});
