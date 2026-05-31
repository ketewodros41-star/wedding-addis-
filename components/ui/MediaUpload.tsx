'use client';

import { useState, useRef } from 'react';
import { uploadMedia } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaUploadProps {
    onUploadComplete: (url: string) => void;
    label?: string;
    description?: string;
    pathSegment?: string;
    currentValue?: string;
}

export default function MediaUpload({
    onUploadComplete,
    label = 'Upload Media',
    description = 'JPG, PNG or WEBP. Max 5MB.',
    pathSegment = 'uploads',
    currentValue
}: MediaUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentValue || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) {
            setError('File size exceeds 5MB');
            return;
        }

        await upload(file);
    };

    const upload = async (file: File) => {
        setUploading(true);
        setError(null);

        // Show local preview immediately
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        try {
            const url = await uploadMedia(file, pathSegment);
            onUploadComplete(url);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload file');
            setPreview(currentValue || null);
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) await upload(file);
    };

    return (
        <div className="space-y-3">
            {label && <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">{label}</label>}

            <div
                className={`relative group border-2 border-dashed rounded-3xl transition-all duration-500 overflow-hidden ${uploading ? 'border-primary/50' : 'border-stone-200 hover:border-primary/30'} bg-stone-50/50`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {preview ? (
                    <div className="aspect-video w-full relative">
                        <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-2 bg-white text-stone-900 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                            >
                                Change Image
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="py-12 px-8 text-center cursor-pointer flex flex-col items-center"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-16 h-16 rounded-full bg-white shadow-premium flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className={`material-symbols-outlined text-3xl ${uploading ? 'animate-bounce text-primary' : 'text-stone-300'}`}>
                                {uploading ? 'cloud_upload' : 'add_photo_alternate'}
                            </span>
                        </div>
                        <p className="text-sm font-bold text-stone-900 mb-1">Drag or click to upload</p>
                        <p className="text-[10px] text-stone-400 font-medium">{description}</p>
                    </div>
                )}

                <AnimatePresence>
                    {uploading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center"
                        >
                            <div className="w-48 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">Uploading to Legacy Cloud...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                </motion.p>
            )}

            <style jsx global>{`
                .shadow-premium {
                    box-shadow: 0 12px 30px -4px rgba(115, 92, 0, 0.08);
                }
            `}</style>
        </div>
    );
}
