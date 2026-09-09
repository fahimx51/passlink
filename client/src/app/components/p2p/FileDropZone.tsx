'use client';

import { ChangeEvent, DragEvent, useState } from 'react';
import { Upload, FolderOpen } from 'lucide-react';

interface FileDropZoneProps {
    peerConnected: boolean;
    isTransferring: boolean;
    onFileSelected: (file: File) => void;
}

export function FileDropZone({
    peerConnected,
    isTransferring,
    onFileSelected,
}: FileDropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const isDisabled = !peerConnected || isTransferring;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelected(e.target.files[0]);
            // Reset input so the same file can be uploaded again if needed
            e.target.value = '';
        }
    };

    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (peerConnected && !isTransferring) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (peerConnected && !isTransferring && e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelected(e.dataTransfer.files[0]);
        }
    };

    return (
        <label
            htmlFor="file-input"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group relative flex flex-col items-center justify-center gap-4 text-center rounded-xl border-2 py-10 px-6 transition-all duration-200 select-none ${
                isDisabled
                    ? 'border-dashed border-base-content/10 opacity-50 cursor-not-allowed bg-base-200/30'
                    : isDragging
                    ? 'border-solid border-primary bg-primary/10 scale-[1.01] cursor-pointer shadow-lg'
                    : 'border-dashed border-base-content/20 hover:border-primary/60 hover:bg-base-200/50 cursor-pointer'
            }`}
        >
            {/* Upload Icon Badge */}
            <div
                className={`p-3.5 rounded-full border transition-transform duration-200 ${
                    isDisabled
                        ? 'border-base-content/10 bg-base-200 text-base-content/30'
                        : isDragging
                        ? 'border-primary bg-primary text-primary-content scale-110'
                        : 'border-base-content/15 bg-base-200/80 text-base-content/80 group-hover:scale-105 group-hover:border-primary/40 group-hover:text-primary'
                }`}
            >
                <Upload className="w-6 h-6" />
            </div>

            {/* Text Information */}
            <div className="space-y-1">
                <p className="font-semibold text-base text-base-content">
                    {isDisabled
                        ? 'Waiting for peer connection'
                        : isDragging
                        ? 'Drop file here'
                        : 'Drag & drop your file here'}
                </p>
                <p className="text-xs text-base-content/60 max-w-xs mx-auto">
                    {peerConnected
                        ? 'Direct P2P transfer — files are encrypted and never stored on a server.'
                        : 'Connect with another device using the link ID above to start sending files.'}
                </p>
            </div>

            {/* Action Button */}
            <div className="pt-1">
                <span
                    className={`btn btn-sm sm:btn-md gap-2 rounded-lg font-medium transition-all ${
                        isDisabled
                            ? 'btn-disabled opacity-50'
                            : 'btn-primary shadow-sm hover:shadow-md'
                    }`}
                >
                    <FolderOpen className="w-4 h-4" />
                    <span>Browse files</span>
                </span>
            </div>

            {/* Hidden File Input */}
            <input
                id="file-input"
                type="file"
                className="hidden"
                disabled={isDisabled}
                suppressHydrationWarning
                onChange={handleFileChange}
            />
        </label>
    );
}