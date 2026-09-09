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
        <section className="py-12 sm:py-16 lg:py-24 bg-base-100 border-t border-slate-200 dark:border-white/10 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center space-y-2 sm:space-y-4 max-w-2xl mx-auto mb-10 sm:mb-14 lg:mb-16">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold uppercase tracking-wider border border-primary/20">
                        Simple Process
                    </div>
                    <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-base-content tracking-tight leading-tight">
                        How PassLink works in <span className="text-primary">3 simple steps</span>
                    </h2>
                    <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-base-content/70 leading-relaxed">
                        Start sharing secure code and files in seconds without creating an account.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={index}
                                className="relative p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-base-200/50 hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-200 group flex flex-col justify-between space-y-4 sm:space-y-6 shadow-sm hover:shadow-md"
                            >
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center justify-between">
                                        {/* Dynamic Icon Container */}
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors duration-200">
                                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 transition-transform duration-200 group-hover:scale-110" />
                                        </div>
                                        {/* Step Number */}
                                        <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-600 dark:text-white/80 font-mono tracking-tight">
                                            {step.number}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-base-content tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm lg:text-base text-base-content/70 leading-relaxed">
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