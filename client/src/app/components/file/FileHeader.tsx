"use client";

import React from "react";
import { Link as LinkIcon, Settings, Trash2 } from "lucide-react";

interface FileHeaderProps {
    slug: string;
    isExpired: boolean;
    onOpenUpdateModal: () => void;
    onOpenDeleteModal: () => void;
}

export const FileHeader: React.FC<FileHeaderProps> = ({
    slug,
    isExpired,
    onOpenUpdateModal,
    onOpenDeleteModal,
}) => {
    return (
        <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-base-200">
            <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-mono font-bold px-2.5 sm:px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
                    <LinkIcon size={12} className="sm:w-3.5 sm:h-3.5" /> /{slug}
                </span>
                {isExpired ? (
                    <span className="badge badge-error badge-xs sm:badge-sm text-[9px] sm:text-[10px] font-bold text-white uppercase">
                        Expired
                    </span>
                ) : (
                    <span className="badge badge-success badge-xs sm:badge-sm text-[9px] sm:text-[10px] font-bold text-white uppercase">
                        Active
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1 bg-base-200 p-1 rounded-xl border border-base-300/50">
                <button
                    onClick={onOpenUpdateModal}
                    className="btn btn-ghost btn-xs btn-square hover:text-primary"
                    title="Edit Link Settings"
                >
                    <Settings size={15} />
                </button>
                <button
                    onClick={onOpenDeleteModal}
                    className="btn btn-ghost btn-xs btn-square hover:text-error"
                    title="Delete Package"
                >
                    <Trash2 size={15} />
                </button>
            </div>
        </div>
    );
};