'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/common/Navbar';
import { useSocket } from '@/hooks/useSocket';
import { Plus, ArrowRight, ShieldCheck, KeyRound, Zap, Rocket, Loader2 } from 'lucide-react';

export default function P2PPage() {
    const [roomCode, setRoomCode] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();
    const { isConnected } = useSocket();

    const handleCreateRoom = () => {
        setIsCreating(true);
        const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        router.push(`/p2p/${generatedCode}`);
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
        setRoomCode(value);
    };

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomCode.length === 6) {
            router.push(`/p2p/${roomCode}`);
        }
    };

    return (
        <div className="min-h-screen bg-base-100 text-base-content flex flex-col justify-between selection:bg-primary selection:text-primary-content relative overflow-hidden transition-colors duration-300">
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Vibrant Background Orbs for Glass Blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] bg-gradient-to-tr from-primary/35 via-indigo-500/25 to-purple-500/35 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none -z-10 animate-pulse" />
                <div className="absolute top-1/4 left-1/3 w-[240px] h-[240px] bg-amber-400/25 dark:bg-indigo-500/25 rounded-full blur-[90px] pointer-events-none -z-10" />

                {/* Responsive Animated Background Rocket */}
                <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                    <style jsx>{`
                        @keyframes rocketFlightPath {
                            0% {
                                transform: translate(-10vw, 85vh) rotate(45deg);
                                opacity: 0;
                            }
                            15% {
                                opacity: 0.9;
                            }
                            85% {
                                opacity: 0.9;
                            }
                            100% {
                                transform: translate(105vw, -15vh) rotate(45deg);
                                opacity: 0;
                            }
                        }
                        .animate-bg-rocket {
                            animation: rocketFlightPath 10s infinite cubic-bezier(0.4, 0, 0.2, 1);
                        }
                    `}</style>

                    <div className="absolute animate-bg-rocket flex items-center gap-2 text-primary/80 dark:text-primary/90">
                        <div className="w-20 h-1 sm:w-32 sm:h-1.5 md:w-40 md:h-2 bg-gradient-to-l from-primary via-indigo-500/60 to-transparent rounded-full blur-[1px] -mr-3" />
                        <Rocket className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
                    </div>
                </div>

                <div className="max-w-md w-full space-y-6 sm:space-y-8 relative">

                    {/* Header Section */}
                    <div className="text-center space-y-2 sm:space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold uppercase tracking-wider border border-primary/20 backdrop-blur-md shadow-xs">
                            <Zap className="w-3.5 h-3.5 animate-bounce" />
                            <span>Direct Browser-To-Browser</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-base-content tracking-tight leading-tight">
                            P2P File Transfer
                        </h1>
                        <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed max-w-sm mx-auto">
                            Create a room or enter a code to start sending and receiving files instantly.
                        </p>
                    </div>

                    {/* Glass Blur Card Box */}
                    <div className="p-6 sm:p-8 rounded-3xl border border-white/70 dark:border-white/15 bg-white/10 dark:bg-slate-900/10 backdrop-blur-xl space-y-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] transition-all duration-300">

                        {/* Option 1: Create Room Button */}
                        <div className="space-y-2">
                            <label className="text-[11px] sm:text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                                Start a New Session
                            </label>
                            <button
                                onClick={handleCreateRoom}
                                disabled={isCreating}
                                className="btn btn-primary w-full text-primary-content font-bold h-12 sm:h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70"
                            >
                                {isCreating ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Plus className="w-5 h-5" />
                                )}
                                <span className="text-sm sm:text-base">
                                    {isCreating ? 'Creating Room...' : 'Create Room'}
                                </span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-base-content/10" />
                            </div>
                            <span className="relative px-3 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md text-[10px] sm:text-xs text-base-content/60 uppercase tracking-widest font-mono font-semibold rounded-full border border-base-content/10">
                                OR
                            </span>
                        </div>

                        {/* Option 2: Join Room Form */}
                        <form onSubmit={handleJoinRoom} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[11px] sm:text-xs font-semibold text-base-content/60 uppercase tracking-wider flex items-center justify-between">
                                    <span>Enter Room Code</span>
                                    <span className="font-mono text-[10px] text-base-content/40">{roomCode.length}/6</span>
                                </label>

                                <div className="relative">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="E.G. X89Z2A"
                                        value={roomCode}
                                        onChange={handleCodeChange}
                                        className="input border-white/50 dark:border-white/10 w-full h-12 sm:h-14 text-center font-mono text-lg sm:text-xl font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase focus:border-primary bg-white/30 dark:bg-base-100/30 backdrop-blur-md text-base-content placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:text-base-content/40 rounded-xl"
                                    />
                                    <KeyRound className="w-5 h-5 absolute left-4 top-3.5 sm:top-4 text-base-content/40 pointer-events-none" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                suppressHydrationWarning
                                disabled={roomCode.length !== 6}
                                className="btn btn-outline border-slate-300/60 dark:border-white/10 hover:border-primary text-base-content w-full h-11 sm:h-12 rounded-xl font-bold flex items-center justify-center gap-2 disabled:bg-base-200/30 dark:disabled:bg-white/[0.02] disabled:text-base-content/30 disabled:border-transparent transition-all"
                            >
                                <span className="text-sm sm:text-base">Join Room</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>

                    </div>

                    {/* Bottom Security Note & Socket Connection Badge */}
                    <div className="flex flex-col items-center gap-2 text-xs text-base-content/60">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-success" />
                            <span>100% Encrypted & Anonymous Transfer</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-warning'}`} />
                            <span>{isConnected ? 'Signaling Server Ready' : 'Connecting Server...'}</span>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}