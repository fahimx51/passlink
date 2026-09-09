"use client";

import React from "react";
import Navbar from "@/app/components/common/Navbar";

export function FilePageSkeleton() {
    return (
        <div className="min-h-screen bg-base-300 text-base-content flex flex-col font-sans transition-colors duration-300">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-3 sm:p-6 md:p-10 relative overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-primary/10 blur-[120px] sm:blur-[160px] rounded-full pointer-events-none" />

                <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl bg-base-100/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-base-200 shadow-2xl overflow-hidden relative p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8 animate-pulse">

                    {/* Header Controls Skeleton */}
                    <div className="flex items-center justify-between pb-2 border-b border-base-200/60">
                        <div className="flex items-center gap-2">
                            <div className="skeleton w-16 h-4 rounded-lg bg-base-300"></div>
                            <div className="skeleton w-20 h-5 rounded-full bg-base-300"></div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="skeleton w-7 h-7 rounded-lg bg-base-300"></div>
                            <div className="skeleton w-7 h-7 rounded-lg bg-base-300"></div>
                        </div>
                    </div>

                    {/* File Header Details Skeleton */}
                    <div className="space-y-6 sm:space-y-8">
                        <div className="text-center space-y-3 sm:space-y-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto rounded-2xl sm:rounded-3xl bg-base-300 skeleton" />

                            <div className="space-y-2 max-w-sm sm:max-w-md mx-auto flex flex-col items-center">
                                <div className="skeleton h-6 sm:h-7 w-3/4 rounded-xl bg-base-300"></div>
                                <div className="skeleton h-3.5 w-1/3 rounded-lg bg-base-300"></div>
                            </div>
                        </div>

                        {/* FileStats Grid Skeleton */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-base-200/50 border border-base-200">
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className="space-y-1.5 p-2 text-center">
                                    <div className="skeleton h-3 w-12 mx-auto rounded bg-base-300"></div>
                                    <div className="skeleton h-4 w-16 mx-auto rounded bg-base-300"></div>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex items-center gap-2 sm:gap-3 pt-1">
                            <div className="skeleton flex-1 h-11 sm:h-12 rounded-xl bg-base-300"></div>
                            <div className="skeleton w-11 sm:w-12 h-11 sm:h-12 rounded-xl bg-base-300 shrink-0"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}