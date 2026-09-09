'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { ThemeToggle } from '@/app/components/common/ThemeToggle';
import { Logo } from '@/app/components/common/Logo';

interface P2PHeaderProps {
    roomId: string;
    peerConnected: boolean;
}

export function P2PHeader({ roomId, peerConnected }: P2PHeaderProps) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const handleCopyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy room code:', err);
        }
    };

    return (
        <header className="w-full border-b border-base-content/10 bg-base-100 z-20 sticky top-0">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/p2p')}
                        className="btn btn-ghost btn-sm gap-1.5 rounded-md text-base-content/70 hover:text-base-content"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden xs:inline">Leave</span>
                    </button>
                    <div className="hidden sm:block">
                        <Logo />
                    </div>
                </div>

                {/* Link ID readout */}
                <button
                    onClick={handleCopyRoomId}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-md border border-base-content/15 hover:border-base-content/30 transition-colors"
                    title="Copy link ID"
                >
                    <span className="text-xs text-base-content/50 hidden sm:inline">
                        Room ID
                    </span>
                    <span className="font-mono font-semibold text-sm tracking-wide">
                        {roomId}
                    </span>
                    {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                        <Copy className="w-3.5 h-3.5 text-base-content/40 group-hover:text-base-content/70" />
                    )}
                </button>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-base-content/70">
                        <span
                            className={`h-2 w-2 rounded-full ${peerConnected
                                ? 'bg-emerald-500'
                                : 'bg-amber-400 animate-pulse'
                                }`}
                        />
                        {peerConnected ? 'Peer linked' : 'Searching for peer'}
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}