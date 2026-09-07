import Footer from '@/app/components/common/Footer';
import Navbar from '@/app/components/common/Navbar';
import { PasteView } from '@/app/components/paste/PasteView';
import React from 'react';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;

    let initialData = null;
    let isLocked = false;
    let errorMsg = '';

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/pastes/get-paste/${slug}`, {
            cache: 'no-store',
        });


        
        const contentType = res.headers.get('content-type');
        let result = null;
        if (contentType && contentType.includes('application/json')) {
            result = await res.json();
            console.log("res => ", result);
        }

        if (!res.ok) {
            errorMsg = result?.message || 'Paste not found or expired.';
        } else if (result?.isPasswordRequired) {
            // Paste is locked with a password
            isLocked = true;
            initialData = result.data; // Contains title and expiresAt
        } else {
            // Unlocked paste
            initialData = result?.data;
        }
    } catch (err) {
        errorMsg = 'Failed to connect to the backend server.';
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