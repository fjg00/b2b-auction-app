'use client';

import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PaymentProofUploadProps {
    transactionId: string;
    onUploadComplete: (url: string) => void;
}

export function PaymentProofUpload({ transactionId, onUploadComplete }: PaymentProofUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            setError('Please upload an image or PDF file.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB.');
            return;
        }

        setError(null);
        setIsUploading(true);

        // Simulate upload delay
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock success - in real app, this would upload to Supabase Storage
            const mockUrl = URL.createObjectURL(file);
            setPreviewUrl(mockUrl);
            onUploadComplete(mockUrl);
        } catch (err) {
            setError('Failed to upload file. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Proof of Payment</h3>

            {!previewUrl ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors relative">
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                    />

                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                            <p className="text-sm text-gray-600">Uploading proof...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Upload className="w-10 h-10 text-gray-400 mb-3" />
                            <p className="text-sm font-medium text-gray-900">Click to upload receipt</p>
                            <p className="text-xs text-gray-500 mt-1">Image or PDF (max 5MB)</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-green-900">Proof uploaded successfully</p>
                        <p className="text-xs text-green-700 mt-1">
                            The seller has been notified and will verify your payment shortly.
                        </p>
                        <a
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-700 underline mt-2 block"
                        >
                            View uploaded file
                        </a>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
