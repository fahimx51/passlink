'use client';

import { motion } from 'framer-motion';

interface ConnectionStatusProps {
    peerConnected: boolean;
    isTransferring: boolean;
    statusMessage: string;
}

export function ConnectionStatus({
    peerConnected,
    isTransferring,
    statusMessage,
}: ConnectionStatusProps) {
    return (
        <div className="space-y-2">
            <div className="relative flex items-center justify-between h-12">
                {/* Local Node */}
                <div className="flex flex-col items-center gap-1.5 z-10 bg-base-100 pr-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] text-base-content/60">You</span>
                </div>

                {/* Animated Connection Tunnel */}
                <div className="absolute left-9 right-9 top-[5px] h-px bg-base-content/15 overflow-hidden">
                    {!peerConnected && (
                        <motion.div
                            className="h-full w-1/4 bg-amber-400"
                            animate={{ x: ['-100%', '500%'] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                        />
                    )}
                    {peerConnected && (
                        <div className="h-full w-full bg-emerald-500/50" />
                    )}
                    {isTransferring && (
                        <motion.div
                            className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-emerald-500"
                            style={{ boxShadow: '0 0 6px rgba(16,185,129,0.8)' }}
                            animate={{ left: ['0%', '100%'] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                    )}
                </div>

                {/* Peer Node */}
                <div className="flex flex-col items-center gap-1.5 z-10 bg-base-100 pl-2">
                    <span
                        className={`h-2.5 w-2.5 rounded-full ${peerConnected ? 'bg-emerald-500' : 'bg-base-content/20'
                            }`}
                    />
                    <span className="text-[11px] text-base-content/60">Peer</span>
                </div>
            </div>

            <p className="text-center text-xs text-base-content/50">{statusMessage}</p>
        </div>
    );
}