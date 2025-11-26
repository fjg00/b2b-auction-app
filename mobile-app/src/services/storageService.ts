import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';

export interface PickedFile {
    uri: string;
    name: string;
    mimeType?: string;
    size?: number;
}

export const pickDocument = async (): Promise<PickedFile | null> => {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['application/pdf', 'image/*'], // Allow PDFs and Images
            copyToCacheDirectory: true,
        });

        if (result.canceled) {
            return null;
        }

        const asset = result.assets[0];
        return {
            uri: asset.uri,
            name: asset.name,
            mimeType: asset.mimeType,
            size: asset.size,
        };
    } catch (error) {
        console.error('Error picking document:', error);
        return null;
    }
};

export const uploadFile = async (
    file: PickedFile,
    bucket: string,
    path: string
): Promise<string | null> => {
    try {
        const base64 = await FileSystem.readAsStringAsync(file.uri, {
            encoding: 'base64',
        });

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, decode(base64), {
                contentType: file.mimeType || 'application/octet-stream',
                upsert: true,
            });

        if (error) {
            console.error('Error uploading file:', error);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return publicUrl;
    } catch (error) {
        console.error('Upload failed:', error);
        return null;
    }
};
