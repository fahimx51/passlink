import React from 'react';
import { UploadCloud, Shield, Zap } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { CreateFileForm } from '../components/file/CreateFileForm';

export default function FileUploadPage() {
    return (
        <>
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
                {/* Page Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
                        Upload & Share File
                    </h1>
                    <p className="text-base-content/70 max-w-lg mx-auto text-sm sm:text-base">
                        Upload zip archives up to 20MB directly to secure cloud storage with optional link expiry and protection.
                    </p>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-base-200/50 border border-base-300/40 rounded-2xl flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Direct Streaming</h2>
                            <p className="text-xs text-base-content/60">Fast signed PUT binary upload</p>
                        </div>
                    </div>

                    <div className="p-4 bg-base-200/50 border border-base-300/40 rounded-2xl flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Protected Storage</h2>
                            <p className="text-xs text-base-content/60">Bcrypt password lock option</p>
                        </div>
                    </div>

                    <div className="p-4 bg-base-200/50 border border-base-300/40 rounded-2xl flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                            <UploadCloud size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Self Expiry</h2>
                            <p className="text-xs text-base-content/60">Auto-destructs after TTL</p>
                        </div>
                    </div>
                </div>

                {/* Form Component Container */}
                <div className="bg-base-100 border border-base-200/80 rounded-3xl p-6 sm:p-8 shadow-xl">
                    <CreateFileForm />
                </div>
            </div>

            <Footer />
        </>
    );
}