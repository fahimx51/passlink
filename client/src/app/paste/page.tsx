import React from 'react';
import { Code, Shield, Zap } from 'lucide-react';
import { CreatePasteForm } from '../components/paste/CreatePasteForm';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';


export default function PastePage() {
    return (
        <>
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
                {/* Page Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
                        Create New Paste
                    </h1>
                    <p className="text-base-content/70 max-w-lg mx-auto text-sm sm:text-base">
                        Share text or snippets securely with optional custom URL, expiration, and password protection.
                    </p>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-base-200/50 border border-base-300/40 rounded-2xl flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Fast Sharing</h2>
                            <p className="text-xs text-base-content/60">Generate shareable link instantly</p>
                        </div>
                    </div>

                    <div className="p-4 bg-base-200/50 border border-base-300/40 rounded-2xl flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Protected Access</h2>
                            <p className="text-xs text-base-content/60">Password & view limits</p>
                        </div>
                    </div>

                    <div className="p-4 bg-base-200/50 border border-base-300/40 rounded-2xl flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                            <Code size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Auto Expiration</h2>
                            <p className="text-xs text-base-content/60">Self-deleting background queue</p>
                        </div>
                    </div>
                </div>

                {/* Form Component Container (Client Component) */}
                <div className="bg-base-100 border border-base-200/80 rounded-3xl p-6 sm:p-8 shadow-xl">
                    <CreatePasteForm />
                </div>
            </div>

            <Footer />
        </>
    );
}