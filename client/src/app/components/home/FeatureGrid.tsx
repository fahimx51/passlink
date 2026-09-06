'use client';

import React from 'react';
import {
    ShieldCheck,
    Zap,
    Lock,
    Clock,
    FileCode2,
    Users
} from 'lucide-react';

export default function FeatureGrid() {
    const features = [
        {
            icon: Lock,
            title: "End-to-End Encryption",
            description: "Direct WebRTC browser transfers and protected pastes ensure your data remains completely private."
        },
        {
            icon: Zap,
            title: "Instant Sharing",
            description: "No sign-up or login required. Generate paste links or start file streams instantly with one click."
        },
        {
            icon: Clock,
            title: "Auto-Expiring Links",
            description: "Set custom timers for automatic deletion. Files and pastes disappear completely after expiration."
        },
        {
            icon: FileCode2,
            title: "Syntax Highlighting",
            description: "Built-in support for popular programming languages with dark mode code view and instant copy."
        },
        {
            icon: ShieldCheck,
            title: "Password Protection",
            description: "Secure confidential text and pastes with custom passwords before sending them across web channels."
        },
        {
            icon: Users,
            title: "Unlimited P2P Size",
            description: "Transfer large files directly from browser to browser without relying on cloud storage limits."
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-base-100 border-t border-slate-200 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center space-y-4 max-w-2xl mx-auto mb-12 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
                        Everything you need for <span className="text-primary">secure sharing</span>
                    </h2>
                    <p className="text-base sm:text-lg text-base-content/70">
                        Designed for speed, privacy, and ease of use. Transfer files and text without server logs or extra friction.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={index}
                                className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-base-200/50 hover:border-primary/40 dark:hover:border-primary/40 transition-colors duration-200 group space-y-3"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors duration-200">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-base-content">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-base-content/70 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}