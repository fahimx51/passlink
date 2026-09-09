'use client';

import { use } from 'react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

import { P2PHeader } from '@/app/components/p2p/P2PHeader';
import { IncomingFileCard } from '@/app/components/p2p/IncomingFileCard';
import { TransferProgressCard } from '@/app/components/p2p/TransferProgressCard';
import { ConnectionStatus } from '@/app/components/p2p/ConnectionStatus';
import { FileDropZone } from '@/app/components/p2p/FileDropZone';

interface RoomPageProps {
    params: Promise<{ roomId: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
    const { roomId } = use(params);

    const {
        peerConnected,
        pendingIncoming,
        transferProgress,
        statusMessage,
        sendFileRequest,
        acceptFileRequest,
        rejectFileRequest,
    } = useWebRTC(roomId);

    const isTransferring = transferProgress !== null;

    return (
        <div className="min-h-screen bg-base-100 text-base-content flex flex-col justify-between transition-colors duration-300">
            {/* Header Component */}
            <P2PHeader roomId={roomId} peerConnected={peerConnected} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-md sm:max-w-lg mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="w-full space-y-8"
                >
                    <ConnectionStatus
                        peerConnected={peerConnected}
                        isTransferring={isTransferring}
                        statusMessage={statusMessage}
                    />

                    <FileDropZone
                        peerConnected={peerConnected}
                        isTransferring={isTransferring}
                        onFileSelected={sendFileRequest}
                    />

                    <IncomingFileCard
                        pendingIncoming={pendingIncoming}
                        onAccept={acceptFileRequest}
                        onReject={rejectFileRequest}
                    />

                    <TransferProgressCard transferProgress={transferProgress} />
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-xs text-base-content/50 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>
                    Peer-to-peer connection — encrypted in transit, nothing stored on our servers.
                </span>
            </footer>
        </div>
    );
}