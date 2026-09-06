'use client';

import React from 'react';
import { MousePointerClick, ShieldCheck, Share2 } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            icon: MousePointerClick,
            title: "Choose & Input",
            description: "Select paste, temporary file upload, or direct P2P transfer. Paste your text or drag and drop your file."
        },
        {
            number: "02",
            icon: ShieldCheck,
            title: "Configure Security",
            description: "Set an optional passphrase, toggle custom auto-expiration timers, or generate end-to-end encryption keys."
        },
        {
            number: "03",
            icon: Share2,
            title: "Instant Sharing",
            description: "Copy your secure link or invite your peer to a WebRTC session for zero-server direct transfers."
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-base-100 border-t border-slate-200 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/20">
                        Simple Process
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
                        How PassLink works in <span className="text-primary">3 simple steps</span>
                    </h2>
                    <p className="text-base sm:text-lg text-base-content/70">
                        Start sharing secure code and files in seconds without creating an account.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={index}
                                className="relative p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-base-200/50 hover:border-primary/40 dark:hover:border-primary/40 transition-colors duration-200 group flex flex-col justify-between space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors duration-200">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-3xl font-extrabold text-slate-600 dark:text-white/80 font-mono">
                                            {step.number}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-base-content">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-base-content/70 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}