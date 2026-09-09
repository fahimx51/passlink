"use client";

import React from "react";
import { KeyRound, AlertCircle, Download, Lock } from "lucide-react";
import { FileModal } from "./FileModal";

interface FileDownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    downloadPassword: string;
    setDownloadPassword: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    downloading: boolean;
    modalError: string;
}

export const FileDownloadModal: React.FC<FileDownloadModalProps> = ({
    isOpen,
    onClose,
    downloadPassword,
    setDownloadPassword,
    onSubmit,
    downloading,
    modalError,
}) => {
    return (
        <FileModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-warning/15 text-warning flex items-center justify-center shrink-0 border border-warning/20">
                        <KeyRound size={17} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-base-content tracking-tight">
                            Password Required
                        </h3>
                        <p className="text-[11px] font-normal text-base-content/60">
                            Protected Download
                        </p>
                    </div>
                </div>
            }
        >
            <form onSubmit={onSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-base-content/80 flex items-center justify-between">
                        <span>Access Password</span>
                        <span className="text-[10px] text-base-content/50 font-mono flex items-center gap-1">
                            <Lock size={10} /> Encrypted
                        </span>
                    </label>

                    <div className="relative">
                        <input
                            type="password"
                            required
                            autoFocus
                            placeholder="Enter password to unlock"
                            value={downloadPassword}
                            onChange={(e) => setDownloadPassword(e.target.value)}
                            className="input input-sm sm:input-md w-full bg-base-200/60 border-base-content/10 rounded-xl text-xs sm:text-sm text-base-content placeholder:text-base-content/40 focus:bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                    </div>
                </div>

                {modalError && (
                    <div className="alert alert-error bg-error/10 border-error/20 text-error text-xs rounded-xl py-2.5 px-3 flex items-start gap-2 shadow-sm">
                        <AlertCircle size={15} className="shrink-0 mt-0.5" />
                        <span className="leading-snug">{modalError}</span>
                    </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-base-content/5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-ghost btn-xs sm:btn-sm text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-xl text-xs font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={downloading}
                        className="btn btn-primary btn-xs sm:btn-sm text-primary-content rounded-xl text-xs px-4 font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all duration-150 flex items-center gap-1.5"
                    >
                        {downloading ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                <span>Unlocking...</span>
                            </>
                        ) : (
                            <>
                                <Download size={14} />
                                Unlock & Download
                            </>
                        )}
                    </button>
                </div>
            </form>
        </FileModal>
    );
};