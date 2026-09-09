"use client";

import React from "react";
import { Clock, HardDrive, FileSpreadsheet, Lock, ShieldCheck } from "lucide-react";
import { FileMetadata } from "@/api/fileApi";

interface FileStatsProps {
    fileData: FileMetadata;
    timeRemaining: string;
    isExpired: boolean;
    formatBytes: (bytes: number) => string;
}

export const FileStats: React.FC<FileStatsProps> = ({
    fileData,
    timeRemaining,
    isExpired,
    formatBytes,
}) => {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="bg-base-200/60 border border-base-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl space-y-1 text-left">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium opacity-70">
                        <Clock size={14} className="text-primary shrink-0" />
                        <span>Expiration</span>
                    </div>
                    <p className={`text-xs sm:text-sm font-bold ${isExpired ? "text-error" : "text-base-content"}`}>
                        {timeRemaining || "Calculating..."}
                    </p>
                </div>

                <div className="bg-base-200/60 border border-base-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl space-y-1 text-left">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium opacity-70">
                        <HardDrive size={14} className="text-primary shrink-0" />
                        <span>Downloads</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-base-content">
                        {fileData.downloadLimit
                            ? `${fileData.downloadCount} / ${fileData.downloadLimit}`
                            : `${fileData.downloadCount} / Unlimited`}
                    </p>
                </div>

                <div className="bg-base-200/60 border border-base-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl space-y-1 text-left">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium opacity-70">
                        <FileSpreadsheet size={14} className="text-primary shrink-0" />
                        <span>File Size</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-base-content">
                        {formatBytes(fileData.fileSize)}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between bg-base-200/40 px-3.5 sm:px-4 py-3 rounded-xl sm:rounded-2xl border border-base-200 text-xs">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-success shrink-0" />
                    <span className="font-medium opacity-80 text-[11px] sm:text-xs">
                        Encrypted Cloud Link
                    </span>
                </div>
                {fileData.isPasswordLocked && (
                    <span className="badge badge-warning badge-sm gap-1 text-[9px] sm:text-[10px] font-bold">
                        <Lock size={10} /> Password Protected
                    </span>
                )}
            </div>
        </div>
    );
};