'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface FileMetaData {
    name: string;
    size: number;
    type: string;
}

// Control message protocol types
type ControlMessage =
    | { type: 'FILE_OFFER'; name: string; size: number; typeStr: string }
    | { type: 'FILE_RESPONSE'; accepted: boolean }
    | { type: 'CANCEL_TRANSFER' };

const STUN_SERVERS: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

const CHUNK_SIZE = 16384; // 16KB per chunk

export function useWebRTC(roomId: string) {
    const { socket, isConnected, joinRoom, sendOffer, sendAnswer, sendIceCandidate, leaveRoom } = useSocket();

    const [peerConnected, setPeerConnected] = useState(false);
    const [pendingIncoming, setPendingIncoming] = useState<FileMetaData | null>(null);
    const [transferProgress, setTransferProgress] = useState<number | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('Connecting to signaling server...');

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);

    // Sender state
    const selectedFileRef = useRef<File | null>(null);

    // Receiver state
    const incomingMetaDataRef = useRef<FileMetaData | null>(null);
    const receivedChunksRef = useRef<ArrayBuffer[]>([]);
    const receivedSizeRef = useRef<number>(0);

    // --- Helper Functions ---
    const resetTransferState = useCallback(() => {
        receivedChunksRef.current = [];
        receivedSizeRef.current = 0;
        incomingMetaDataRef.current = null;
        setPendingIncoming(null);
        setTimeout(() => setTransferProgress(null), 2000);
    }, []);

    // --- File Transfer Handlers ---
    const startSendingFile = useCallback(async () => {
        const file = selectedFileRef.current;
        const channel = dataChannelRef.current;
        if (!file || !channel) return;

        const arrayBuffer = await file.arrayBuffer();
        let offset = 0;

        channel.bufferedAmountLowThreshold = CHUNK_SIZE * 2;

        const sendChunks = () => {
            while (offset < arrayBuffer.byteLength) {
                if (channel.bufferedAmount > CHUNK_SIZE * 8) {
                    channel.onbufferedamountlow = () => {
                        channel.onbufferedamountlow = null;
                        sendChunks();
                    };
                    return;
                }

                const chunk = arrayBuffer.slice(offset, offset + CHUNK_SIZE);
                channel.send(chunk);
                offset += chunk.byteLength;

                const progress = Math.round((offset / arrayBuffer.byteLength) * 100);
                setTransferProgress(progress);
            }

            setStatusMessage('File sent successfully!');
            setTimeout(() => setTransferProgress(null), 2000);
            selectedFileRef.current = null;
        };

        sendChunks();
    }, []);

    const handleIncomingChunk = useCallback((chunk: ArrayBuffer) => {
        const meta = incomingMetaDataRef.current;
        if (!meta) return;

        receivedChunksRef.current.push(chunk);
        receivedSizeRef.current += chunk.byteLength;

        const progress = Math.round((receivedSizeRef.current / meta.size) * 100);
        setTransferProgress(progress);

        if (receivedSizeRef.current >= meta.size) {
            const blob = new Blob(receivedChunksRef.current, { type: meta.type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = meta.name;
            a.click();
            URL.revokeObjectURL(url);

            setStatusMessage(`Downloaded ${meta.name}`);
            resetTransferState();
        }
    }, [resetTransferState]);

    const handleControlMessage = useCallback((message: ControlMessage) => {
        switch (message.type) {
            case 'FILE_OFFER':
                incomingMetaDataRef.current = {
                    name: message.name,
                    size: message.size,
                    type: message.typeStr,
                };
                setPendingIncoming(incomingMetaDataRef.current);
                setStatusMessage(`Incoming file request: ${message.name}`);
                break;

            case 'FILE_RESPONSE':
                if (message.accepted) {
                    setStatusMessage('Receiver accepted. Sending file...');
                    startSendingFile();
                } else {
                    setStatusMessage('Receiver rejected the transfer.');
                    selectedFileRef.current = null;
                }
                break;

            case 'CANCEL_TRANSFER':
                resetTransferState();
                setStatusMessage('Transfer cancelled by peer.');
                break;
        }
    }, [startSendingFile, resetTransferState]);

    // --- DataChannel Setup ---
    const setupDataChannel = useCallback((channel: RTCDataChannel) => {
        dataChannelRef.current = channel;
        channel.binaryType = 'arraybuffer';

        channel.onopen = () => {
            console.log('[WebRTC] DataChannel Open');
            setPeerConnected(true);
            setStatusMessage('Peer connected. Ready to share files.');
        };

        channel.onclose = () => {
            console.log('[WebRTC] DataChannel Closed');
            setPeerConnected(false);
            setStatusMessage('Peer disconnected.');
        };

        channel.onmessage = (event) => {
            if (typeof event.data === 'string') {
                try {
                    const message: ControlMessage = JSON.parse(event.data);
                    handleControlMessage(message);
                } catch (err) {
                    console.error('[WebRTC] Error parsing JSON message:', err);
                }
            } else if (event.data instanceof ArrayBuffer) {
                handleIncomingChunk(event.data);
            }
        };
    }, [handleControlMessage, handleIncomingChunk]);

    // --- WebRTC Initialization ---
    const sendIceCandidateCallback = sendIceCandidate;

    const createPeerConnection = useCallback(() => {
        if (peerConnectionRef.current) return peerConnectionRef.current;

        const pc = new RTCPeerConnection(STUN_SERVERS);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendIceCandidateCallback(roomId, event.candidate);
            }
        };

        pc.onconnectionstatechange = () => {
            console.log('[WebRTC] Connection State:', pc.connectionState);
            if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                setPeerConnected(false);
                setStatusMessage('Peer connection lost.');
            }
        };

        peerConnectionRef.current = pc;
        return pc;
    }, [roomId, sendIceCandidateCallback]);

    useEffect(() => {
        if (!socket || !isConnected) return;

        joinRoom(roomId);

        socket.on('user-joined', async () => {
            console.log('[Socket] User joined, initializing offer...');
            setStatusMessage('Peer joined. Connecting WebRTC...');
            const pc = createPeerConnection();

            const channel = pc.createDataChannel('fileTransfer');
            setupDataChannel(channel);

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            sendOffer(roomId, offer);
        });

        socket.on('offer', async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
            console.log('[Socket] Received WebRTC offer');
            setStatusMessage('Received connection request...');
            const pc = createPeerConnection();

            pc.ondatachannel = (event) => {
                setupDataChannel(event.channel);
            };

            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendAnswer(roomId, answer);
        });

        socket.on('answer', async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
            console.log('[Socket] Received WebRTC answer');
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        socket.on('ice-candidate', async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        socket.on('user-left', () => {
            setPeerConnected(false);
            setStatusMessage('Peer left the room.');
            resetTransferState();
        });

        socket.on('room-full', ({ message }: { message: string }) => {
            alert(message);
        });

        return () => {
            socket.off('user-joined');
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
            socket.off('user-left');
            socket.off('room-full');
            leaveRoom(roomId);

            dataChannelRef.current?.close();
            peerConnectionRef.current?.close();
            peerConnectionRef.current = null;
        };
    }, [
        socket,
        isConnected,
        roomId,
        joinRoom,
        leaveRoom,
        sendOffer,
        sendAnswer,
        setupDataChannel,
        createPeerConnection,
        resetTransferState,
    ]);

    // Derived status message for waiting state
    const currentStatusMessage = (!peerConnected && isConnected && statusMessage === 'Connecting to signaling server...')
        ? 'Waiting for peer to join...'
        : statusMessage;

    // --- User Triggered Actions ---
    const sendFileRequest = (file: File) => {
        if (!dataChannelRef.current || dataChannelRef.current.readyState !== 'open') return;

        selectedFileRef.current = file;
        const meta: FileMetaData = {
            name: file.name,
            size: file.size,
            type: file.type || 'application/octet-stream',
        };

        const message: ControlMessage = {
            type: 'FILE_OFFER',
            name: meta.name,
            size: meta.size,
            typeStr: meta.type,
        };

        dataChannelRef.current.send(JSON.stringify(message));
        setStatusMessage(`Waiting for peer to accept ${file.name}...`);
    };

    const acceptFileRequest = () => {
        if (!dataChannelRef.current) return;

        receivedChunksRef.current = [];
        receivedSizeRef.current = 0;

        const message: ControlMessage = {
            type: 'FILE_RESPONSE',
            accepted: true,
        };

        dataChannelRef.current.send(JSON.stringify(message));
        setPendingIncoming(null);
        setStatusMessage('Downloading file...');
    };

    const rejectFileRequest = () => {
        if (!dataChannelRef.current) return;

        const message: ControlMessage = {
            type: 'FILE_RESPONSE',
            accepted: false,
        };

        dataChannelRef.current.send(JSON.stringify(message));
        setPendingIncoming(null);
        incomingMetaDataRef.current = null;
        setStatusMessage('Transfer rejected.');
    };

    return {
        peerConnected,
        pendingIncoming,
        transferProgress,
        statusMessage: currentStatusMessage,
        sendFileRequest,
        acceptFileRequest,
        rejectFileRequest,
    };
}