'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Clock, Eye, Pencil, X } from 'lucide-react';

interface PasteHeaderProps {
    title: string;
    expiresAt?: string;
    maxViews?: number | null;
    viewsCount?: number;
    isEditing: boolean;
    onToggleEdit: () => void;
}

export function PasteHeader({
    title,
    expiresAt,
    maxViews,
    viewsCount,
    isEditing,
    onToggleEdit,
}: PasteHeaderProps) {
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        if (!expiresAt) return;

        const calculateTimeLeft = () => {
            const diff = new Date(expiresAt).getTime() - new Date().getTime();

            if (diff <= 0) {
                setTimeLeft('Expired');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h left`);
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m left`);
            } else if (minutes > 0) {
                setTimeLeft(`${minutes}m ${seconds}s left`);
            } else {
                setTimeLeft(`${seconds}s left`);
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    return (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4 w-full min-w-0">
                <div className="p-2.5 sm:p-3 bg-primary/10 text-primary rounded-xl sm:rounded-2xl shrink-0 mt-0.5 sm:mt-1">
                    <FileText className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>

                <div className="space-y-2 sm:space-y-3 w-full min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-base-content break-words leading-tight">
                        {title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-base-content/70 font-medium">
                        {/* Countdown Badge */}
                        {expiresAt && (
                            <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-base-200/70 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border border-base-300/50">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-base-content/50" />
                                <span>{timeLeft || 'Calculating...'}</span>
                            </span>
                        )}

                        {/* Always visible Views Badge */}
                        <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-base-200/70 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border border-base-300/50">
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-base-content/50" />
                            <span>
                                Views: <strong className="text-base-content">{viewsCount ?? 0}</strong>
                                {maxViews ? ` / ${maxViews}` : ''}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end sm:justify-start shrink-0">
                <button
                    onClick={onToggleEdit}
                    className={`btn ${isEditing ? 'btn-ghost text-error' : 'btn-outline border-base-300'} btn-xs sm:btn-sm rounded-lg sm:rounded-xl gap-1.5 sm:gap-2 font-medium`}
                >
                    {isEditing ? <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    <span>{isEditing ? 'Cancel' : 'Edit Paste'}</span>
                </button>
            </div>
        </div>
    );
}