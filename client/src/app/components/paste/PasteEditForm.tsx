'use client';

import React from 'react';
import { ShieldAlert, Save } from 'lucide-react';

interface PasteEditFormProps {
    editTitle: string;
    setEditTitle: (val: string) => void;
    editSlug: string;
    setEditSlug: (val: string) => void;
    editMaxViews: number | '';
    setEditMaxViews: (val: number | '') => void;
    editPassword: string;
    setEditPassword: (val: string) => void;
    editContent: string;
    setEditContent: (val: string) => void;
    errorMsg: string;
    isLoading: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function PasteEditForm({
    editTitle,
    setEditTitle,
    editSlug,
    setEditSlug,
    editMaxViews,
    setEditMaxViews,
    editPassword,
    setEditPassword,
    editContent,
    setEditContent,
    errorMsg,
    isLoading,
    onSubmit,
}: PasteEditFormProps) {
    return (
        <form onSubmit={onSubmit} className="mt-4 pt-6 border-t border-base-200 space-y-4">
            {errorMsg && (
                <div className="p-3 bg-error/10 text-error text-xs rounded-xl flex items-center gap-2">
                    <ShieldAlert size={16} />
                    <span>{errorMsg}</span>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-base-content/70">Title</label>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="input input-bordered w-full rounded-xl text-sm"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-base-content/70">Slug</label>
                    <input
                        type="text"
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        className="input input-bordered w-full rounded-xl text-sm font-mono"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-base-content/70">Max Views (optional)</label>
                    <input
                        type="number"
                        value={editMaxViews}
                        onChange={(e) => setEditMaxViews(e.target.value ? Number(e.target.value) : '')}
                        className="input input-bordered w-full rounded-xl text-sm"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-base-content/70">New Password (leave blank to keep current)</label>
                    <input
                        type="password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input input-bordered w-full rounded-xl text-sm"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-base-content/70">Content</label>
                <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={8}
                    className="textarea textarea-bordered w-full rounded-xl font-mono text-sm leading-relaxed"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary rounded-xl gap-2 font-semibold shadow-md"
            >
                {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <Save size={16} />}
                Save Changes
            </button>
        </form>
    );
}