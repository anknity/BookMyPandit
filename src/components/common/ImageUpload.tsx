import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import api from '@/config/api';

interface ImageUploadProps {
    defaultUrl?: string;
    onUpload: (url: string) => void;
    label?: string;
    className?: string;
    shape?: 'square' | 'circle';
}

export function ImageUpload({ defaultUrl, onUpload, label = 'Upload Image', className, shape = 'square' }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | undefined>(defaultUrl);
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = async (file: File) => {
        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size too large (max 5MB)');
            return;
        }

        // Preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', file);

            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (data.url) {
                onUpload(data.url);
            } else {
                throw new Error('Upload failed');
            }
        } catch (err: any) {
            console.error('Upload Error:', err);
            setError(err.message || 'Failed to upload image');
            setPreview(defaultUrl); // Revert
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    return (
        <div className={cn("space-y-2", className)}>
            <label className="block text-sm font-semibold text-slate-700">{label}</label>
            <div
                className={cn(
                    "relative border-2 border-dashed transition-all cursor-pointer overflow-hidden flex items-center justify-center bg-slate-50",
                    isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-slate-300 hover:border-primary hover:bg-slate-100",
                    shape === 'circle' ? "rounded-full aspect-square w-32 mx-auto" : "rounded-xl h-48 w-full"
                )}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center text-slate-400">
                        <span className="material-symbols-outlined text-3xl mb-1">add_photo_alternate</span>
                        <span className="text-xs font-semibold">Click to upload</span>
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
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}
