import Link from "next/link";
import { Link2, ShieldCheck } from "lucide-react";

interface LogoProps {
    showText?: boolean;
}

export function Logo({ showText = true }: LogoProps) {
    return (
        <Link href="/" className="flex items-center gap-2 group cursor-pointer select-none">
            {/* Icon Emblem */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-content shadow-md group-hover:scale-105 transition-transform duration-200">
                <Link2 className="w-5 h-5 -rotate-45" />
                <ShieldCheck className="w-3.5 h-3.5 absolute -bottom-0.5 -right-0.5 text-success fill-base-100" />
            </div>

            {/* Brand Text */}
            {showText && (
                <span className="text-xl font-bold tracking-tight text-base-content">
                    Pass<span className="text-primary">Link</span>
                </span>
            )}
        </Link>
    );
}