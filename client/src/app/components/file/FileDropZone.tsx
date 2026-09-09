"use client";

import React, { useRef } from "react";
import { UploadCloud } from "lucide-react";

interface FileDropzoneProps {
    onFilesAdded: (files: FileList | File[]) => void;
    isDragging: boolean;
    setIsDragging: (dragging: boolean) => void;
}

export function FileDropzone({ onFilesAdded, isDragging, setIsDragging }: FileDropzoneProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
            }}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) {
                    onFilesAdded(e.dataTransfer.files);
                }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`relative group border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer overflow-hidden ${isDragging
                ? "border-primary bg-primary/10 scale-[0.99]"
                : "border-base-300 hover:border-primary/60 bg-base-200/20 hover:bg-base-200/50"
                }`}
        >
            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => e.target.files && onFilesAdded(e.target.files)}
                className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-4 bg-primary/10 text-primary rounded-2xl transition group-hover:scale-110 duration-300">
                    <UploadCloud size={32} />
                </div>

                <div className="space-y-1">
                    <p className="text-sm font-semibold text-base-content">
                        Drop files here or <span className="text-primary underline decoration-2 underline-offset-4">browse</span>
                    </p>
                    <p className="text-xs text-base-content/50">
                        Upload multiple files up to 9.5MB total. Fast uncompressed ZIP packaging.
                    </p>
                </div>
            </div>
        </div>
    );
}