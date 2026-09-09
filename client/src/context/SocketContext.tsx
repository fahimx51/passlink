'use client';

import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    joinRoom: (roomId: string) => void;
    sendOffer: (roomId: string, offer: RTCSessionDescriptionInit) => void;
    sendAnswer: (roomId: string, answer: RTCSessionDescriptionInit) => void;
    sendIceCandidate: (roomId: string, candidate: RTCIceCandidate) => void;
    leaveRoom: (roomId: string) => void;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket] = useState<Socket>(() =>
        io(SOCKET_SERVER_URL, {
            autoConnect: true,
            transports: ['websocket', 'polling'],
        })
    );

    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        const handleConnect = () => {
            console.log('[Socket] Connected to server:', socket.id);
            setIsConnected(true);
        };

        const handleDisconnect = (reason: string) => {
            console.log('[Socket] Disconnected:', reason);
            setIsConnected(false);
        };

        const handleConnectError = (error: Error) => {
            console.error('[Socket] Connection error:', error);
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleConnectError);

        if (socket.disconnected) {
            socket.connect();
        }

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('connect_error', handleConnectError);
            socket.disconnect();
        };
    }, [socket]);

    const joinRoom = (roomId: string) => {
        if (socket && socket.connected) {
            socket.emit('join-room', { roomId });
        }
    };

    const sendOffer = (roomId: string, offer: RTCSessionDescriptionInit) => {
        if (socket && socket.connected) {
            socket.emit('offer', { roomId, offer });
        }
    };

    const sendAnswer = (roomId: string, answer: RTCSessionDescriptionInit) => {
        if (socket && socket.connected) {
            socket.emit('answer', { roomId, answer });
        }
    };

    const sendIceCandidate = (roomId: string, candidate: RTCIceCandidate) => {
        if (socket && socket.connected) {
            socket.emit('ice-candidate', { roomId, candidate });
        }
    };

    const leaveRoom = (roomId: string) => {
        if (socket && socket.connected) {
            socket.emit('leave-room', { roomId });
        }
    };

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                joinRoom,
                sendOffer,
                sendAnswer,
                sendIceCandidate,
                leaveRoom,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};