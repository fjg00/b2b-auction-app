import React from 'react';
import { Header } from '@/components/layout/Header';

export default function LotLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: 'var(--color-bg)' }}>
                {children}
            </main>
        </>
    );
}
