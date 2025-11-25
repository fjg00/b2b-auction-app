import { supabase } from '../lib/supabase';

// ==================== PROFILE FUNCTIONS ====================

export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    company_name?: string;
    business_type?: string;
    tax_id?: string;
    phone?: string;
    website?: string;
    bio?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    profile_photo_url?: string;
    is_verified: boolean;
    verification_progress: number;
}

export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>) {
    const { data, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
}

// ==================== ADDRESS FUNCTIONS ====================

export interface Address {
    id?: string;
    user_id?: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone: string;
    notes?: string;
    is_default: boolean;
    type: 'pickup' | 'delivery' | 'both';
    created_at?: string;
    updated_at?: string;
}

export async function getAddresses(userId: string): Promise<Address[]> {
    const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function createAddress(userId: string, address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    // If this is set as default, unset other defaults first
    if (address.is_default) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', userId);
    }

    const { data, error } = await supabase
        .from('addresses')
        .insert([{ ...address, user_id: userId }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateAddress(addressId: string, userId: string, updates: Partial<Address>) {
    // If setting as default, unset other defaults first
    if (updates.is_default) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', userId);
    }

    const { data, error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', addressId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteAddress(addressId: string, userId: string) {
    const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', userId);

    if (error) throw error;
}

export async function setDefaultAddress(addressId: string, userId: string) {
    // Unset all defaults
    await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

    // Set new default
    const { data, error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ==================== PAYMENT METHOD FUNCTIONS ====================

export type PaymentMethodType = 'bank' | 'card' | 'omt' | 'whish';

export interface PaymentMethod {
    id?: string;
    user_id?: string;
    type: PaymentMethodType;
    name: string;
    is_default: boolean;

    // Bank fields
    account_holder_name?: string;
    routing_number?: string;
    account_number_encrypted?: string;
    account_type?: string;

    // Card fields
    card_last_four?: string;
    card_brand?: string;
    card_expiry_month?: number;
    card_expiry_year?: number;

    // OMT fields
    omt_full_name?: string;
    omt_phone_number?: string;
    omt_id_number?: string;

    // Whish fields
    whish_id?: string;
    whish_phone_number?: string;
    whish_email?: string;

    created_at?: string;
    updated_at?: string;
}

export async function getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function createPaymentMethod(userId: string, paymentMethod: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    // If this is set as default, unset other defaults first
    if (paymentMethod.is_default) {
        await supabase
            .from('payment_methods')
            .update({ is_default: false })
            .eq('user_id', userId);
    }

    const { data, error } = await supabase
        .from('payment_methods')
        .insert([{ ...paymentMethod, user_id: userId }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deletePaymentMethod(paymentMethodId: string, userId: string) {
    const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentMethodId)
        .eq('user_id', userId);

    if (error) throw error;
}

export async function setDefaultPaymentMethod(paymentMethodId: string, userId: string) {
    // Unset all defaults
    await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);

    // Set new default
    const { data, error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', paymentMethodId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ==================== VERIFICATION FUNCTIONS ====================

export type DocumentType = 'business_license' | 'tax_id' | 'resale_certificate' | 'insurance' | 'government_id';
export type DocumentStatus = 'pending' | 'verified' | 'rejected';

export interface VerificationDocument {
    id?: string;
    user_id?: string;
    type: DocumentType;
    status: DocumentStatus;
    document_url: string;
    rejection_reason?: string;
    uploaded_at?: string;
    reviewed_at?: string;
}

export async function getVerificationDocuments(userId: string): Promise<VerificationDocument[]> {
    const { data, error } = await supabase
        .from('verification_documents')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function uploadVerificationDocument(
    userId: string,
    documentType: DocumentType,
    file: File | Blob,
    fileName: string
): Promise<VerificationDocument> {
    // Upload file to Supabase Storage
    const filePath = `verification/${userId}/${documentType}/${Date.now()}_${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

    // Create database record
    const { data, error } = await supabase
        .from('verification_documents')
        .insert([{
            user_id: userId,
            type: documentType,
            status: 'pending' as DocumentStatus,
            document_url: urlData.publicUrl
        }])
        .select()
        .single();

    if (error) throw error;

    // Update user verification progress
    await updateVerificationProgress(userId);

    return data;
}

async function updateVerificationProgress(userId: string) {
    const documents = await getVerificationDocuments(userId);
    const requiredTypes: DocumentType[] = ['business_license', 'tax_id', 'government_id'];

    const verifiedCount = documents.filter(
        doc => requiredTypes.includes(doc.type) && doc.status === 'verified'
    ).length;

    const progress = Math.round((verifiedCount / requiredTypes.length) * 100);
    const isVerified = progress === 100;

    await supabase
        .from('users')
        .update({
            verification_progress: progress,
            is_verified: isVerified
        })
        .eq('id', userId);
}

// ==================== PROFILE PHOTO UPLOAD ====================

export async function uploadProfilePhoto(userId: string, file: File | Blob, fileName: string): Promise<string> {
    const filePath = `profiles/${userId}/${Date.now()}_${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    // Update user profile
    await supabase
        .from('users')
        .update({ profile_photo_url: urlData.publicUrl })
        .eq('id', userId);

    return urlData.publicUrl;
}

// ==================== BUSINESS VERIFICATION FUNCTIONS ====================

export type AccountType = 'individual' | 'business';
export type LegalForm = 'sole_proprietorship' | 'sarl' | 'sal' | 'other';

export interface BusinessVerificationData {
    account_type: AccountType;

    // Individual fields
    national_id?: string;
    national_id_document_url?: string;

    // Business identity
    legal_entity_name?: string;
    trade_name?: string;
    legal_form?: LegalForm;

    // Business registration
    commercial_register_number?: string;
    ministry_of_finance_tax_id?: string;
    vat_registration_number?: string;
    is_vat_registered?: boolean;

    // Business documents
    commercial_register_document_url?: string;
    mof_certificate_url?: string;
    vat_certificate_url?: string;

    // Business contact
    registered_business_address?: string;
    official_email?: string;
    support_phone?: string;
}

export async function updateBusinessVerification(userId: string, verificationData: BusinessVerificationData) {
    const { data, error } = await supabase
        .from('users')
        .update({
            ...verificationData,
            business_verification_status: 'under_review'
        })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getBusinessVerification(userId: string): Promise<BusinessVerificationData> {
    const { data, error } = await supabase
        .from('users')
        .select(`
            account_type,
            national_id,
            national_id_document_url,
            legal_entity_name,
            trade_name,
            legal_form,
            commercial_register_number,
            ministry_of_finance_tax_id,
            vat_registration_number,
            is_vat_registered,
            commercial_register_document_url,
            mof_certificate_url,
            vat_certificate_url,
            registered_business_address,
            official_email,
            support_phone
        `)
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
}

export async function uploadBusinessDocument(
    userId: string,
    documentType: 'national_id' | 'commercial_register' | 'mof_certificate' | 'vat_certificate',
    file: File | Blob,
    fileName: string
): Promise<string> {
    const filePath = `business_verification/${userId}/${documentType}/${Date.now()}_${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

    // Update user record with document URL
    const fieldMap = {
        'national_id': 'national_id_document_url',
        'commercial_register': 'commercial_register_document_url',
        'mof_certificate': 'mof_certificate_url',
        'vat_certificate': 'vat_certificate_url',
    };

    await supabase
        .from('users')
        .update({ [fieldMap[documentType]]: urlData.publicUrl })
        .eq('id', userId);

    return urlData.publicUrl;
}

