'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { PastePasswordModal } from './PastePasswordModal';
import { PasteHeader } from './PasteHeader';
import { PasteEditForm } from './PasteEditForm';
import { PasteCodeViewer } from './PasteCodeViewer';

interface PasteData {
    title: string;
    content?: string;
    slug?: string;
    createdAt?: string;
    expiresAt?: string;
    maxViews?: number | null;
    viewsCount?: number;
    isPasswordLocked?: boolean;
}

interface PasteViewProps {
    slug: string;
    initialData?: PasteData | null;
    initialIsLocked?: boolean;
}

interface UpdatePayload {
    title: string;
    content: string;
    newSlug: string;
    maxViews: number | null;
    currentPassword?: string;
    password?: string;
}

export function PasteView({ slug, initialData, initialIsLocked = false }: PasteViewProps) {
    const router = useRouter();
    const [paste, setPaste] = useState<PasteData | null>(initialData || null);
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [isLocked, setIsLocked] = useState(initialIsLocked);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Edit states
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(initialData?.title || '');
    const [editContent, setEditContent] = useState(initialData?.content || '');
    const [editSlug, setEditSlug] = useState(slug);
    const [editMaxViews, setEditMaxViews] = useState<number | ''>(initialData?.maxViews || '');
    const [editPassword, setEditPassword] = useState('');

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/pastes/protected-paste/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            },);

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result?.message || 'Incorrect password.');
            }

            setPaste(result.data);
            setEditTitle(result.data.title);
            setEditContent(result.data.content);
            setEditSlug(result.data.slug || slug);
            setEditMaxViews(result.data.maxViews || '');
            setCurrentPassword(password); // Automatically save the password entered during unlock
            setIsLocked(false);
        } catch (err) {
            const error = err as Error;
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const payload: UpdatePayload = {
                title: editTitle,
                content: editContent,
                newSlug: editSlug,
                maxViews: editMaxViews !== '' ? Number(editMaxViews) : null,
            };

            // Silently include currentPassword if the paste was protected
            if (currentPassword) {
                payload.currentPassword = currentPassword;
            }

            // Include new password if user wants to change/set it
            if (editPassword) {
                payload.password = editPassword;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/pastes/update-paste/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result?.message || 'Failed to update paste.');
            }

            setPaste(result.data);
            setIsEditing(false);

            // Update currentPassword state if password was updated
            if (editPassword) {
                setCurrentPassword(editPassword);
                setEditPassword('');
            }

            if (editSlug !== slug) {
                router.push(`/paste/${editSlug}`);
            }
        } catch (err) {
            const error = err as Error;
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full mx-auto space-y-8 animate-in fade-in duration-500">
            {isLocked && (
                <PastePasswordModal
                    title={paste?.title}
                    password={password}
                    setPassword={setPassword}
                    errorMsg={errorMsg}
                    isLoading={isLoading}
                    onUnlock={handleUnlock}
                />
            )}

            {!isLocked && paste && (
                <div className="space-y-6">
                    <div className="bg-base-100 border border-base-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-5">
                        <PasteHeader
                            title={paste.title}
                            createdAt={paste.createdAt}
                            maxViews={paste.maxViews}
                            viewsCount={paste.viewsCount}
                            isEditing={isEditing}
                            onToggleEdit={() => setIsEditing(!isEditing)}
                        />

                        {isEditing && (
                            <PasteEditForm
                                editTitle={editTitle}
                                setEditTitle={setEditTitle}
                                editSlug={editSlug}
                                setEditSlug={setEditSlug}
                                editMaxViews={editMaxViews}
                                setEditMaxViews={setEditMaxViews}
                                editPassword={editPassword}
                                setEditPassword={setEditPassword}
                                editContent={editContent}
                                setEditContent={setEditContent}
                                errorMsg={errorMsg}
                                isLoading={isLoading}
                                onSubmit={handleUpdate}
                            />
                        )}
                    </div>

                    {!isEditing && <PasteCodeViewer content={paste.content} />}
                </div>
            )}
        </div>
    );
}