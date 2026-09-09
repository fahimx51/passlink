'use client';

import Link from "next/link";
import { Share2, Lock } from "lucide-react";

interface LogoProps {
    showText?: boolean;
    className?: string;
}

export function Logo({ showText = true, className = "" }: LogoProps) {
    return (
        <Link 
            href="/" 
            className={`inline-flex items-center gap-2.5 group cursor-pointer select-none ${className}`}
        >
            {/* Emblem Container */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-content shadow-sm shadow-primary/20 group-hover:shadow-md group-hover:shadow-primary/30 group-hover:scale-105 transition-all duration-200">
                {/* Primary Transfer Icon */}
                <Share2 className="w-4 h-4 text-primary-content transition-transform duration-200 group-hover:rotate-12" />
                
                {/* Security Badge */}
                <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-base-100 border border-base-200 shadow-sm">
                    <Lock className="w-2.5 h-2.5 text-success" />
                </div>
            </div>

            {/* Brand Typography */}
            {showText && (
                <div className="flex flex-col">
                    <span className="text-lg font-extrabold tracking-tight leading-none text-base-content group-hover:text-primary transition-colors duration-200">
                        Pass<span className="text-primary">Link</span>
                    </span>
                    <span className="text-[10px] font-medium tracking-wider uppercase text-base-content/50 leading-none mt-1">
                        P2P Transfer
                    </span>
                </div>
            )}
        </Link>
    );
}