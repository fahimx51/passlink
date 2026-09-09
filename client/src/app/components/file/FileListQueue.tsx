"use client";

import React from "react";
import { FolderArchive, FileArchive, File, X } from "lucide-react";

interface FileListQueueProps {
    files: File[];
    totalSelectedSize: number;
    maxSize: number;
    sizePercentage: number;
    onRemoveFile: (index: number) => void;
}

export function FileListQueue({
    files,
    totalSelectedSize,
    maxSize,
    sizePercentage,
    onRemoveFile,
}: FileListQueueProps) {
    if (files.length === 0) return null;

    return (
        <div className="bg-base-200/40 border border-base-300/60 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold px-1">
                <span className="flex items-center gap-1.5 text-base-content/80">
                    <FolderArchive size={15} className="text-primary" />
                    Queued Archives ({files.length})
                </span>
                <span className="text-base-content/60 font-mono">
                    {(totalSelectedSize / (1024 * 1024)).toFixed(2)} / {(maxSize / (1024 * 1024)).toFixed(2)} MB
                </span>
            </div>

            <div className="w-full bg-base-300/60 h-1.5 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${sizePercentage > 90 ? "bg-error" : "bg-primary"
                        }`}
                    style={{ width: `${sizePercentage}%` }}
                />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                {files.map((file, idx) => (
                    <div
                        key={`${file.name}-${idx}`}
                        className="flex items-center justify-between text-xs bg-base-100/80 border border-base-200/60 p-2.5 rounded-xl shadow-sm hover:border-base-300 transition"
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-1.5 bg-base-200 text-base-content/70 rounded-lg shrink-0">
                                {file.name.endsWith(".zip") ? <FileArchive size={14} /> : <File size={14} />}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate font-medium text-base-content/90">{file.name}</p>
                                <p className="text-[10px] text-base-content/50 font-mono">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFile(idx);
                            }}
                            className="p-1 text-base-content/40 hover:text-error hover:bg-error/10 rounded-lg transition"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}