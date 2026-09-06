'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowRight,
    FileUp,
    Lock,
    ShieldCheck,
    Share2,
    CheckCircle2,
    Laptop,
    Smartphone,
    FileCheck,
    Rocket
} from "lucide-react";

export default function Hero() {
    const [activeTab, setActiveTab] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTab((prev) => (prev + 1) % 3);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            id: "paste",
            tabLabel: "Paste & Code",
            badge: "Instant",
            badgeClass: "badge-primary",
            preview: (
                <div className="font-mono text-xs text-base-content space-y-2 overflow-x-auto h-full flex flex-col justify-center px-1">
                    <div className="text-success font-semibold">{"// Paste snippet"}</div>
                    <div><span className="text-primary font-bold">const</span> passlink = <span className="text-secondary font-bold">new</span> PassLink();</div>
                    <div>await passlink.<span className="text-warning font-bold">share</span>(&#123; mode: <span className="text-accent">&apos;paste&apos;</span> &#125;);</div>
                </div>
            ),
            checklist: [
                { icon: ShieldCheck, text: "Password-protected pastes" },
                { icon: CheckCircle2, text: "Syntax highlighting & custom expiry" }
            ]
        },
        {
            id: "files",
            tabLabel: "Files",
            badge: "Cloud Storage",
            badgeClass: "badge-secondary",
            preview: (
                <div className="flex flex-col items-center justify-center text-center space-y-1.5 h-full">
                    <div className="p-2.5 text-secondary">
                        <FileUp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-base-content">project-archive.zip</span>
                    <span className="text-[11px] text-base-content/70">24.5 MB • Auto-deletes in 24h</span>
                </div>
            ),
            checklist: [
                { icon: ShieldCheck, text: "Temporary encrypted file hosting" },
                { icon: CheckCircle2, text: "Automatic expiration cleanup" }
            ]
        },
        {
            id: "p2p",
            tabLabel: "P2P",
            badge: "Direct WebRTC",
            badgeClass: "badge-accent",
            preview: (
                <div className="space-y-2 h-full flex flex-col justify-center px-1">
                    <div className="flex items-center justify-between text-[11px] text-base-content/80 font-medium px-1">
                        <span className="flex items-center gap-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-accent" />
                            video_demo.mp4
                        </span>
                        <span className="text-accent font-mono font-semibold">18.4 MB / 25 MB</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-2.5 bg-transparent">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 text-primary">
                                <Laptop className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-[11px] font-bold text-base-content leading-none">You</p>
                                <p className="text-[9px] text-base-content/60 mt-0.5">Sender</p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center gap-1 px-2">
                            <div className="w-full flex items-center justify-center gap-1 overflow-hidden py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                                <div className="w-full h-0.5 bg-accent/30 relative overflow-hidden rounded-full">
                                    <div className="absolute inset-0 bg-accent w-1/2 animate-pulse" />
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-accent shrink-0" />
                            </div>
                            <span className="text-[9px] font-mono text-accent font-medium">Encrypted Direct</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="text-right">
                                <p className="text-[11px] font-bold text-base-content leading-none">Receiver</p>
                                <p className="text-[9px] text-success font-medium mt-0.5">Receiving...</p>
                            </div>
                            <div className="p-1.5 text-accent">
                                <Smartphone className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <progress className="progress progress-accent w-full h-1.5" value="74" max="100"></progress>
                </div>
            ),
            checklist: [
                { icon: Lock, text: "Direct browser-to-browser encryption" },
                { icon: CheckCircle2, text: "No server file size limits" }
            ]
        }
    ];

    const current = features[activeTab];

    return (
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 select-none bg-slate-50/50 dark:bg-transparent">
            {/* Background Glowing Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-primary/15 dark:bg-primary/10 blur-[140px] rounded-full pointer-events-none -z-10" />
            <div className="absolute top-1/4 right-8 w-[350px] h-[350px] bg-secondary/10 dark:bg-secondary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left Column: Heading & CTAs */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium border border-primary/20 backdrop-blur-md cursor-default pointer-events-none select-none">
                            <Rocket className="w-4 h-4" />
                            <span>Fast, Encrypted & Peer-to-Peer Sharing</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-base-content leading-[1.15]">
                            Share code, text & files with <span className="text-primary">zero friction</span>.
                        </h1>

                        <p className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto lg:mx-0 font-normal">
                            PassLink offers instant pastebin creation, temporary file hosting, and real-time WebRTC peer-to-peer file transfers directly from your browser.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                            <Link
                                href="#create-paste"
                                className="btn btn-primary btn-md sm:btn-lg rounded-full w-full sm:w-auto gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 outline-none focus:outline-none focus:ring-0"
                            >
                                Create a Paste
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/p2p"
                                className="btn btn-outline border-slate-300 dark:border-base-100/30 hover:bg-slate-100 dark:hover:bg-base-200/50 text-base-content btn-md sm:btn-lg rounded-full w-full sm:w-auto gap-2 transition-all duration-200 outline-none focus:outline-none focus:ring-0"
                            >
                                <Share2 className="w-5 h-5 text-primary" />
                                P2P File Transfer
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-base-300/40 text-center lg:text-left">
                            <div>
                                <div className="text-2xl font-bold text-primary">Instant</div>
                                <div className="text-xs text-base-content/60">No login needed</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-primary">E2E</div>
                                <div className="text-xs text-base-content/60">Encrypted P2P links</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-primary">Auto-expire</div>
                                <div className="text-xs text-base-content/60">Custom expiration</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Main Preview Card Container */}
                    <div className="lg:col-span-5 relative">

                        {/* Dual-Beam Animated Border Mask Container */}
                        <div
                            className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden border border-slate-300/25 dark:border-white/3"
                            style={{
                                padding: '1.5px',
                                WebkitMaskImage: 'linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)',
                                WebkitMaskClip: 'content-box, border-box',
                                WebkitMaskComposite: 'xor',
                                maskImage: 'linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)',
                                maskClip: 'content-box, border-box',
                                maskComposite: 'exclude',
                            }}
                        >
                            {/* 2 Animated Beams (0deg and 180deg) */}
                            <div
                                className="absolute -inset-[150%] animate-[spin_6s_linear_infinite]"
                                style={{
                                    background: 'conic-gradient(from 0deg, transparent 0deg, transparent 130deg, var(--fallback-p, var(--p, #3b82f6)) 160deg, var(--fallback-a, var(--a, #06b6d4)) 180deg, transparent 180deg, transparent 310deg, var(--fallback-p, var(--p, #3b82f6)) 340deg, var(--fallback-a, var(--a, #06b6d4)) 360deg)',
                                }}
                            />
                        </div>

                        {/* Card Container */}
                        <div className="card relative overflow-hidden bg-transparent rounded-2xl">

                            {/* Background Atmosphere Flavor Glow */}
                            <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--p)/0.06,transparent_60%)] animate-pulse" />

                            <div className="card-body p-6 space-y-4">

                                <div className="flex items-center justify-between pb-3 border-b border-slate-900/10 dark:border-white/10">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3 h-3 rounded-full bg-error/80 inline-block" />
                                        <span className="w-3 h-3 rounded-full bg-warning/80 inline-block" />
                                        <span className="w-3 h-3 rounded-full bg-success/80 inline-block" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`badge badge-sm font-medium ${current.badgeClass}`}>
                                            {current.badge}
                                        </span>
                                        <span className="text-xs font-mono text-base-content/60">passlink.app</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 bg-transparent border border-slate-900/10 dark:border-white/10 p-1 rounded-xl text-center gap-1">
                                    {features.map((feat, idx) => (
                                        <button
                                            key={feat.id}
                                            type="button"
                                            onClick={() => setActiveTab(idx)}
                                            className={`py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 outline-none focus:outline-none focus:ring-0 active:outline-none border-0 ${
                                                activeTab === idx
                                                    ? "bg-transparent text-primary font-bold"
                                                    : "bg-transparent text-base-content/60 hover:text-base-content"
                                            }`}
                                        >
                                            {feat.tabLabel}
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-transparent border border-slate-900/10 dark:border-white/10 rounded-xl p-2 grid grid-cols-1 grid-rows-1 h-[120px] overflow-hidden outline-none relative">
                                    {/* Preview Box Inner Ambient Glow */}
                                    <div className="absolute inset-0 bg-primary/5 pointer-events-none rounded-xl" />
                                    
                                    {features.map((feat, idx) => (
                                        <div
                                            key={feat.id}
                                            className={`col-start-1 row-start-1 h-full w-full transform-gpu transition-all duration-300 ease-in-out ${
                                                activeTab === idx
                                                    ? "opacity-100 translate-x-0 z-10 pointer-events-auto"
                                                    : idx < activeTab
                                                        ? "opacity-0 -translate-x-3 z-0 pointer-events-none"
                                                        : "opacity-0 translate-x-3 z-0 pointer-events-none"
                                            }`}
                                        >
                                            {feat.preview}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 grid-rows-1 min-h-[52px] pt-2 border-t border-slate-900/10 dark:border-white/10 overflow-hidden">
                                    {features.map((feat, idx) => (
                                        <div
                                            key={feat.id}
                                            className={`col-start-1 row-start-1 space-y-2 transform-gpu transition-all duration-300 ease-in-out ${
                                                activeTab === idx
                                                    ? "opacity-100 translate-y-0 z-10 pointer-events-auto"
                                                    : "opacity-0 translate-y-1 z-0 pointer-events-none"
                                            }`}
                                        >
                                            {feat.checklist.map((item, cIdx) => {
                                                const IconComponent = item.icon;
                                                return (
                                                    <div key={cIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-base-content/80">
                                                        <IconComponent className="w-4 h-4 text-primary shrink-0" />
                                                        <span>{item.text}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-center gap-1.5 pt-1">
                                    {features.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setActiveTab(idx)}
                                            aria-label={`Switch to slide ${idx + 1}`}
                                            className={`h-1.5 rounded-full transition-all duration-300 outline-none focus:outline-none focus:ring-0 border-0 ${
                                                activeTab === idx ? 'w-6 bg-primary' : 'w-1.5 bg-slate-300 dark:bg-base-300 hover:bg-slate-400 dark:hover:bg-base-100'
                                            }`}
                                        />
                                    ))}
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}