'use client';

import React from 'react';
import Navbar from '../common/Navbar';

export function PasteSkeleton() {
    return (
        <div className="min-h-screen bg-base-100 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
                <div className="relative w-full space-y-8 animate-pulse">
                    <div className="space-y-6">
                        {/* Header Box Container */}
                        <div className="bg-base-100 border border-base-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-5">
                            {/* Matching PasteHeader Structure */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex items-start gap-3 sm:gap-4 w-full min-w-0">
                                    {/* Icon Box */}
                                    <div className="p-2.5 sm:p-3 bg-base-200 rounded-xl sm:rounded-2xl shrink-0 mt-0.5 sm:mt-1">
                                        <div className="w-5 h-5 sm:w-7 sm:h-7 bg-base-300 rounded-md" />
                                    </div>

                                    <div className="space-y-2 sm:space-y-3 w-full min-w-0">
                                        {/* Title Line */}
                                        <div className="h-7 sm:h-8 md:h-9 bg-base-200 rounded-xl w-3/4 max-w-xs sm:max-w-md" />

                                        {/* Metadata Badges */}
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            <div className="h-7 sm:h-8 w-32 sm:w-36 bg-base-200/70 border border-base-300/50 rounded-lg" />
                                            <div className="h-7 sm:h-8 w-28 sm:w-32 bg-base-200/70 border border-base-300/50 rounded-lg" />
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Button Placeholder */}
                                <div className="flex justify-end sm:justify-start shrink-0">
                                    <div className="h-7 sm:h-8 w-24 bg-base-200 border border-base-300 rounded-lg sm:rounded-xl" />
                                </div>
                            </div>
                        </div>

                        {/* Code Viewer Container */}
                        <div className="bg-base-100 border border-base-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm w-full min-w-0">
                            {/* Matching PasteCodeViewer Header */}
                            <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3.5 bg-base-200/50 border-b border-base-200 gap-2">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    {/* Window Control Dots */}
                                    <div className="flex gap-1.5 sm:gap-2 shrink-0">
                                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-base-300" />
                                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-base-300" />
                                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-base-300" />
                                    </div>

                                    {/* Language Tag */}
                                    <div className="h-3.5 w-16 bg-base-300/70 rounded ml-1 shrink-0" />
                                </div>

                                {/* Copy Button Placeholder */}
                                <div className="h-7 sm:h-8 w-24 bg-base-300/60 rounded-lg shrink-0" />
                            </div>

                            {/* Matching PasteCodeViewer Content Area */}
                            <div className="p-4 sm:p-6 md:p-8 bg-base-200/30 w-full min-w-0 space-y-3 font-mono">
                                <div className="h-4 bg-base-200 rounded-md w-11/12" />
                                <div className="h-4 bg-base-200 rounded-md w-3/4" />
                                <div className="h-4 bg-base-200 rounded-md w-4/5" />
                                <div className="h-4 bg-base-200 rounded-md w-2/3" />
                                <div className="h-4 bg-base-200 rounded-md w-1/2" />
                                <div className="h-4 bg-base-200 rounded-md w-5/6" />
                                <div className="h-4 bg-base-200 rounded-md w-2/5" />
                                <div className="h-4 bg-base-200 rounded-md w-3/5" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}