'use client';

import React from 'react';
import Link from 'next/link';
import { Share2, Shield, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-base-100 border-t border-slate-200 dark:border-white/10 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-200 dark:border-white/10">

                    {/* Brand Info */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <Share2 className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-extrabold text-base-content tracking-tight">
                                PassLink
                            </span>
                        </div>
                        <p className="text-sm text-base-content/70 max-w-sm leading-relaxed">
                            Fast, encrypted, and frictionless code, text, and file sharing platform. Powered by WebRTC direct transfers and auto-expiring pastes.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-success font-medium">
                            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                            <span>All systems operational</span>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {/* Features */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-base-content uppercase tracking-wider">Features</p>
                            <ul className="space-y-2 text-sm text-base-content/70">
                                <li>
                                    <Link href="#create-paste" className="hover:text-primary transition-colors">
                                        Pastebin
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#create-paste" className="hover:text-primary transition-colors">
                                        File Hosting
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/p2p" className="hover:text-primary transition-colors">
                                        P2P WebRTC
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Security */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-base-content uppercase tracking-wider">Security</p>
                            <ul className="space-y-2 text-sm text-base-content/70">
                                <li className="flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-primary" />
                                    <span>E2E Encryption</span>
                                </li>
                                <li>
                                    <span>Zero Storage P2P</span>
                                </li>
                                <li>
                                    <span>Auto Expiration</span>
                                </li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div className="space-y-3 col-span-2 sm:col-span-1">
                            <p className="text-xs font-bold text-base-content uppercase tracking-wider">Project</p>
                            <ul className="space-y-2 text-sm text-base-content/70">
                                <li>
                                    <a
                                        href="https://github.com/fahimx51/passlink"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                                    >
                                        {/* Inline GitHub Icon */}
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                        <span>GitHub</span>
                                        <ExternalLink className="w-3 h-3 opacity-60" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/60">
                    <p>© {new Date().getFullYear()} PassLink. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <span>Built with</span>
                        <Heart className="w-3.5 h-3.5 text-error fill-error" />
                        <span>using Next.js & Tailwind CSS</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}