"use client";

import Footer from '@/app/components/common/Footer';
import Navbar from '@/app/components/common/Navbar';
import { PasteSkeleton } from '@/app/components/paste/PasteSkeleton';
import { PasteView } from '@/app/components/paste/PasteView';
import React, { use, useEffect, useState } from 'react';

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

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function Page({ params }: PageProps) {
    const { slug } = use(params);

    const [initialData, setInitialData] = useState<PasteData | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPaste() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/pastes/get-paste/${slug}`, {
                    cache: 'no-store',
                    credentials: 'include',
                });

                const contentType = res.headers.get('content-type');
                let result = null;
                if (contentType && contentType.includes('application/json')) {
                    result = await res.json();
                }

                if (!res.ok) {
                    setErrorMsg(result?.message || 'Paste not found or expired.');
                } else if (result?.isPasswordRequired) {
                    setIsLocked(true);
                    setInitialData(result.data);
                } else {
                    setInitialData(result?.data);
                }
            } catch (err) {
                setErrorMsg('Failed to connect to the backend server.');
            } finally {
                setLoading(false);
            }
        }

        fetchPaste();
    }, [slug]);

    if (loading) {
        return (
            <PasteSkeleton />
        );
    }

    if (errorMsg) {
        return (
            <div className="min-h-screen bg-base-100 flex flex-col">
                <Navbar />
                <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-16 text-center space-y-4">
                    <h1 className="text-3xl font-bold text-error">Paste Unavailable</h1>
                    <p className="text-base-content/70">{errorMsg}</p>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
                <PasteView
                    slug={slug}
                    initialData={initialData}
                    initialIsLocked={isLocked}
                />
            </main>
            <Footer />
        </div>
    );
}