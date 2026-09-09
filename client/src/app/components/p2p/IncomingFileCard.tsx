'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, XCircle } from 'lucide-react';

interface PendingIncomingFile {
    name: string;
    size: number;
}

interface IncomingFileCardProps {
    pendingIncoming: PendingIncomingFile | null;
    onAccept: () => void;
    onReject: () => void;
}

export function IncomingFileCard({
    pendingIncoming,
    onAccept,
    onReject,
}: IncomingFileCardProps) {
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <AnimatePresence>
            {pendingIncoming && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                >
                    <div className="rounded-lg border border-base-content/15 p-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-md border border-base-content/15 text-base-content/70 shrink-0">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-base-content/50">Incoming file</p>
                                <p className="font-semibold text-sm truncate">
                                    {pendingIncoming.name}
                                </p>
                                <p className="text-xs font-mono text-base-content/50">
                                    {formatFileSize(pendingIncoming.size)}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={onAccept}
                                className="btn btn-sm flex-1 gap-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 border-none text-white font-semibold"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Accept
                            </button>
                            <button
                                onClick={onReject}
                                className="btn btn-sm btn-ghost flex-1 gap-1.5 rounded-md border border-base-content/15 font-semibold"
                            >
                                <XCircle className="w-4 h-4" />
                                Decline
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}