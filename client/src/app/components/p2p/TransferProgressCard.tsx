'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface TransferProgressCardProps {
    transferProgress: number | null;
}

export function TransferProgressCard({ transferProgress }: TransferProgressCardProps) {
    const isTransferring = transferProgress !== null;

    return (
        <AnimatePresence>
            {isTransferring && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                >
                    <div className="rounded-lg border border-base-content/15 p-4 space-y-3">
                        <div className="flex justify-between items-baseline text-sm">
                            <span className="font-semibold text-base-content/80">
                                Transferring file
                            </span>
                            <span className="font-mono font-bold text-base">
                                {transferProgress}%
                            </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-base-content/10 overflow-hidden">
                            <motion.div
                                className="h-full bg-emerald-500"
                                initial={{ width: '0%' }}
                                animate={{ width: `${transferProgress}%` }}
                                transition={{ ease: 'easeOut', duration: 0.3 }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}