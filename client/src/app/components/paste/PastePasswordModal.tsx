'use client';

import React from 'react';
import { LockKeyhole, ShieldAlert, KeyRound } from 'lucide-react';

interface PastePasswordModalProps {
    title?: string;
    password: string;
    setPassword: (val: string) => void;
    errorMsg: string;
    isLoading: boolean;
    onUnlock: (e: React.FormEvent) => void;
}

export function PastePasswordModal({
    title,
    password,
    setPassword,
    errorMsg,
    isLoading,
    onUnlock,
}: PastePasswordModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-base-100 rounded-[2rem] p-8 shadow-2xl border border-base-200 space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-gradient-to-br from-primary to-primary/60 text-primary-content rounded-2xl shadow-lg shadow-primary/20">
                        <LockKeyhole size={32} />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-base-content">Protected Paste</h2>
                        <p className="text-sm text-base-content/60">
                            {title ? (
                                <span>
                                    Enter password to view <strong className="text-base-content font-semibold">{title}</strong>
                                </span>
                            ) : (
                                'This paste requires a password to view its contents.'
                            )}
                        </p>
                    </div>
                </div>

                {errorMsg && (
                    <div className="p-4 bg-error/10 border border-error/20 text-error text-sm rounded-xl flex items-center gap-3">
                        <ShieldAlert size={18} className="shrink-0" />
                        <span className="font-medium">{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={onUnlock} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-base-content/80 flex items-center gap-2 px-1">
                            <KeyRound size={16} /> Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input input-bordered w-full rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            autoFocus
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
                    >
                        {isLoading ? <span className="loading loading-spinner loading-md"></span> : 'Unlock Paste'}
                    </button>
                </form>
            </div>
        </div>
    );
}