"use client";

import React, { useState } from "react";
import { CheckCircle2, Copy, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";

interface UploadSuccessCardProps {
    shareUrl: string;
    onReset: () => void;
}

export function UploadSuccessCard({ shareUrl, onReset }: UploadSuccessCardProps) {
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="text-center py-8 px-4 space-y-6 max-w-lg mx-auto">
            <div className="relative inline-block">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent blur opacity-40 animate-pulse" />
                <div className="relative bg-base-100 p-4 rounded-full border border-base-200">
                    <CheckCircle2 size={48} className="text-primary" />
                </div>
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-base-content">
                    Your Link is Ready
                </h2>
                <p className="text-sm text-base-content/60">
                    Your files have been packaged and uploaded securely.
                </p>
            </div>

            <div className="bg-base-200/60 p-2 pl-4 rounded-2xl border border-base-300 flex items-center justify-between gap-2 shadow-inner">
                <span className="text-xs font-mono text-primary truncate">{shareUrl}</span>
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={handleCopy}
                        className="btn btn-primary btn-sm rounded-xl gap-1.5 font-medium"
                    >
                        {copied ? <ShieldCheck size={14} /> : <Copy size={14} />}
                        {copied ? "Copied" : "Copy"}
                    </button>

                    <a
                        href={shareUrl}
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm rounded-xl gap-1.5 font-medium"
                    >
                        <ExternalLink size={14} />
                        <span>Visit</span>
                    </a>
                </div>
            </div>

            <div className="pt-2">
                <button
                    onClick={onReset}
                    className="btn btn-ghost btn-sm text-xs gap-1 text-base-content/60 hover:text-base-content"
                >
                    <span>Upload another package</span>
                    <ArrowRight size={12} />
                </button>
            </div>
        </div>
    );
}