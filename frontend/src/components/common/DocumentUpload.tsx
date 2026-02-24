import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import api from '@/config/api';

interface DocumentUploadProps {
    defaultUrl?: string;
    onUpload: (url: string) => void;
    label?: string;
    className?: string;
    accept?: string;
}

export function DocumentUpload({ defaultUrl, onUpload, label = 'Upload Document', className, accept = "image/*,application/pdf" }: DocumentUploadProps) {
    const [preview, setPreview] = useState<string | undefined>(defaultUrl);
    const [fileName, setFileName] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size too large (max 5MB)');
            return;
        }

        setFileName(file.name);
        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', file); // Controller expects 'image' key even for docs

            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (data.url) {
                onUpload(data.url);
                setPreview(data.url);
            } else {
                throw new Error('Upload failed');
            }
        } catch (err: any) {
            console.error('Upload Error:', err);
            setError(err.message || 'Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const isPdf = preview?.toLowerCase().endsWith('.pdf') || fileName.toLowerCase().endsWith('.pdf');

    return (
        <div className={cn("space-y-2", className)}>
            <label className="block text-sm font-semibold text-slate-700">{label}</label>
            <div
                className={cn(
                    "relative border-2 border-dashed border-slate-300 hover:border-primary transition-colors cursor-pointer overflow-hidden flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl",
                    "h-32 w-full"
                )}
                onClick={() => fileInputRef.current?.click()}
            >
                {preview ? (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                        {isPdf ? (
                            <span className="material-symbols-outlined text-4xl text-red-500 mb-2">picture_as_pdf</span>
                        ) : (
                            <span className="material-symbols-outlined text-4xl text-green-500 mb-2">image</span>
                        )}
                        <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{fileName || 'Document Uploaded'}</p>
                        <p className="text-xs text-slate-500 mt-1">Click to replace</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-slate-400">
                        <span className="material-symbols-outlined text-3xl mb-1">upload_file</span>
                        <span className="text-xs font-semibold">Click to upload (PDF/JPG)</span>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            {preview && (
                <a href={preview} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                    View Document
                </a>
            )}
        </div>
    );
}
