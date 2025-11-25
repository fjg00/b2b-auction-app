import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { User, Camera } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/profileService';

export default function EditProfileScreen({ navigation }: any) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        businessType: '',
        taxId: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        governorate: '',
        caza: '',
        zipCode: '',
        bio: '',
    });

    // Lebanese Governorates and their Cazas
    const governorates = [
        { name: 'Beirut', cazas: ['Beirut'] },
        { name: 'Mount Lebanon', cazas: ['Baabda', 'Aley', 'Chouf', 'Keserwan', 'Matn', 'Jbeil'] },
        { name: 'North', cazas: ['Tripoli', 'Zgharta', 'Bsharri', 'Batroun', 'Koura', 'Miniyeh-Danniyeh', 'Akkar'] },
        { name: 'South', cazas: ['Sidon', 'Tyre', 'Jezzine'] },
        { name: 'Beqaa', cazas: ['Zahle', 'Rashaya', 'Western Beqaa', 'Baalbek', 'Hermel'] },
        { name: 'Nabatieh', cazas: ['Nabatieh', 'Bint Jbeil', 'Marjeyoun', 'Hasbaya'] },
    ];

    const selectedGovernorate = governorates.find(g => g.name === formData.governorate);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        if (!user?.id) return;

        try {
            const profile = await getUserProfile(user.id);
            setFormData({
                fullName: profile.full_name || '',
                companyName: profile.company_name || '',
                businessType: profile.business_type || '',
                taxId: profile.tax_id || '',
                phone: profile.phone || '',
                website: profile.website || '',
                address: profile.address || '',
                city: profile.city || '',
                governorate: profile.state || '',
                caza: profile.zip_code || '',
                zipCode: '',
                bio: profile.bio || '',
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        // Personal info
        if (!formData.fullName.trim()) {
            Alert.alert('Validation Error', 'Full name is required');
            return false;
        }
        if (!formData.phone.trim()) {
            Alert.alert('Validation Error', 'Phone number is required');
            return false;
        }

        // Business info
        if (!formData.companyName.trim()) {
            Alert.alert('Validation Error', 'Company name is required');
            return false;
        }
        if (!formData.businessType.trim()) {
            Alert.alert('Validation Error', 'Business type is required');
            return false;
        }
        if (!formData.taxId.trim()) {
            Alert.alert('Validation Error', 'Tax ID / EIN is required');
            return false;
        }

        // Business address
        if (!formData.address.trim()) {
            Alert.alert('Validation Error', 'Business address is required');
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

    const handleSave = async () => {
        if (!user?.id) return;

        if (!validateForm()) {
            return;
        }

        setSaving(true);
        try {
            await updateUserProfile(user.id, {
                full_name: formData.fullName,
                company_name: formData.companyName,
                business_type: formData.businessType,
                tax_id: formData.taxId,
                phone: formData.phone,
                website: formData.website,
                address: formData.address,
                city: formData.city,
                state: formData.governorate,
                zip_code: formData.caza,
                bio: formData.bio,
            });

            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleImagePick = () => {
        // TODO: Implement image picker
        console.log('Pick image');
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Profile Photo Section */}
                <View style={styles.photoSection}>
                    <View style={styles.photoContainer}>
                        <View style={styles.avatarPlaceholder}>
                            <User size={40} color={COLORS.primary} />
                        </View>
                        <TouchableOpacity style={styles.cameraButton} onPress={handleImagePick}>
                            <Camera size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.photoLabel}>Upload Photo</Text>
                </View>

                {/* Personal Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.fullName}
                            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                            placeholder="Enter your full name"
                            placeholderTextColor={COLORS.textMuted}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={user?.email}
                            editable={false}
                        />
                        <Text style={styles.helperText}>Email cannot be changed</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            placeholder="+1 (555) 123-4567"
                            placeholderTextColor={COLORS.textMuted}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                {/* Business Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Business Information</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Company Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.companyName}
                            onChangeText={(text) => setFormData({ ...formData, companyName: text })}
                            placeholder="Your Company LLC"
                            placeholderTextColor={COLORS.textMuted}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Business Type *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.businessType}
                            onChangeText={(text) => setFormData({ ...formData, businessType: text })}
                            placeholder="e.g., Retail, Wholesale, Restaurant"
                            placeholderTextColor={COLORS.textMuted}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tax ID / EIN *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.taxId}
                            onChangeText={(text) => setFormData({ ...formData, taxId: text })}
                            placeholder="XX-XXXXXXX"
                            placeholderTextColor={COLORS.textMuted}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Website</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.website}
                            onChangeText={(text) => setFormData({ ...formData, website: text })}
                            placeholder="https://yourcompany.com"
                            placeholderTextColor={COLORS.textMuted}
                            keyboardType="url"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.bio}
                            onChangeText={(text) => setFormData({ ...formData, bio: text })}
                            placeholder="Tell buyers and sellers about your business..."
                            placeholderTextColor={COLORS.textMuted}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Business Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Business Address</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Street Address *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.address}
                            onChangeText={(text) => setFormData({ ...formData, address: text })}
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

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: SPACING.sm }]}>
                            <Text style={styles.label}>Governorate (Mohafazah) *</Text>
                            <View style={styles.pickerContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                                    {governorates.map((gov) => (
                                        <TouchableOpacity
                                            key={gov.name}
                                            style={[
                                                styles.pickerOption,
                                                formData.governorate === gov.name && styles.pickerOptionActive
                                            ]}
                                            onPress={() => setFormData({ ...formData, governorate: gov.name, caza: '' })}
                                        >
                                            <Text style={[
                                                styles.pickerOptionText,
                                                formData.governorate === gov.name && styles.pickerOptionTextActive
                                            ]}>
                                                {gov.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    {selectedGovernorate && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Caza (District) *</Text>
                            <View style={styles.pickerContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                                    {selectedGovernorate.cazas.map((caza) => (
                                        <TouchableOpacity
                                            key={caza}
                                            style={[
                                                styles.pickerOption,
                                                formData.caza === caza && styles.pickerOptionActive
                                            ]}
                                            onPress={() => setFormData({ ...formData, caza })}
                                        >
                                            <Text style={[
                                                styles.pickerOptionText,
                                                formData.caza === caza && styles.pickerOptionTextActive
                                            ]}>
                                                {caza}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    )}


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
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
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
    photoSection: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        backgroundColor: COLORS.surface,
        marginBottom: SPACING.md,
    },
    photoContainer: {
        position: 'relative',
        marginBottom: SPACING.sm,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: COLORS.surface,
    },
    photoLabel: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
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
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        fontSize: 16,
        color: COLORS.text,
    },
    disabledInput: {
        backgroundColor: COLORS.border,
        color: COLORS.textMuted,
    },
    textArea: {
        minHeight: 100,
        paddingTop: SPACING.md,
    },
    helperText: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: SPACING.xs,
    },
    row: {
        flexDirection: 'row',
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
        marginBottom: SPACING.sm,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    cancelButton: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cancelButtonText: {
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
    saveButtonDisabled: {
        opacity: 0.6,
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
    pickerOptionTextActive: {
        color: 'white',
    },
});
