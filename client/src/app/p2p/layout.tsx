'use client';

import React from 'react';
import { SocketProvider } from '@/context/SocketContext';

export default function P2PLayout({ children }: { children: React.ReactNode }) {
    return (
        <SocketProvider>
            {children}
        </SocketProvider>
    );
}