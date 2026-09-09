"use client";

import React from "react";
import { X } from "lucide-react";

interface FileModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactNode;
    children: React.ReactNode;
}

export const FileModal: React.FC<FileModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-base-100 border border-base-300 w-full max-w-xs sm:max-w-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-sm sm:text-base">{title}</div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-ghost btn-xs btn-circle opacity-60"
                    >
                        <X size={16} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};