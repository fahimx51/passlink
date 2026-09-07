'use client';

import React from 'react';
import { FileText, Clock, Eye, Pencil, X } from 'lucide-react';

interface PasteHeaderProps {
    title: string;
    createdAt?: string;
    maxViews?: number | null;
    viewsCount?: number;
    isEditing: boolean;
    onToggleEdit: () => void;
}

export function PasteHeader({
    title,
    createdAt,
    maxViews,
    viewsCount,
    isEditing,
    onToggleEdit,
}: PasteHeaderProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4 w-full min-w-0">
                {/* Icon - Scales down slightly on small mobile screens */}
                <div className="p-2.5 sm:p-3 bg-primary/10 text-primary rounded-xl sm:rounded-2xl shrink-0 mt-0.5 sm:mt-1">
                    <FileText className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>

                <div className="space-y-2 sm:space-y-3 w-full min-w-0">
                    {/* Responsive Title: Smaller on mobile, larger on tablet/desktop */}
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-base-content break-words leading-tight">
                        {title}
                    </h1>

                    {/* Metadata Badges: Responsive text size and padding */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-base-content/70 font-medium">
                        {createdAt && (
                            <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-base-200/70 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border border-base-300/50">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-base-content/50" />
                                <span>{formatDate(createdAt)}</span>
                            </span>
                        )}
                        {maxViews && (
                            <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-base-200/70 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border border-base-300/50">
                                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-base-content/50" />
                                <span>
                                    Views: <strong className="text-base-content">{viewsCount ?? 1}</strong> / {maxViews}
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Responsive Edit Button: Fits nicely on right or stacks on tiny displays */}
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