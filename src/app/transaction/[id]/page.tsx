'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './transaction.module.css';
import { TransactionHeader } from '@/components/transaction/TransactionHeader';
import { TransactionStepProgress } from '@/components/transaction/TransactionStepProgress';
import { PaymentBlock } from '@/components/transaction/PaymentBlock';
import { LogisticsBlock } from '@/components/transaction/LogisticsBlock';
import { ChatPanel } from '@/components/transaction/ChatPanel';
import { DisputeBlock } from '@/components/transaction/DisputeBlock';
import { ActivityLog } from '@/components/transaction/ActivityLog';
import { Gavel, CreditCard, Truck, CheckCircle, MessageSquare } from 'lucide-react';

// Mock Data
const MOCK_DATA = {
    lotId: '12345',
    title: 'Mixed Beverages (48 units)',
    buyerName: 'Retail King LLC',
    sellerName: 'Global Distributors Inc.',
    endDate: 'Nov 20, 2025, 10:00 AM',
    amount: 1250.00,
    status: 'awaiting_payment' as const,
    timeline: [
        { id: '1', label: 'Auction Ended', date: 'Nov 20, 10:00 AM', status: 'completed' as const, icon: Gavel },
        { id: '2', label: 'Payment', status: 'current' as const, icon: CreditCard },
        { id: '3', label: 'Pickup', status: 'pending' as const, icon: Truck },
        { id: '4', label: 'Completed', status: 'pending' as const, icon: CheckCircle },
    ],
    logs: [
        { id: '1', text: 'Auction ended – you won the lot for $1,250.00', date: 'Nov 20, 2025, 10:00 AM' },
        { id: '2', text: 'Seller congratulated you', date: 'Nov 20, 2025, 10:30 AM' },
    ]
};

export default function TransactionPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams();
    const role = (searchParams.get('role') as 'buyer' | 'seller') || 'buyer';
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.mainContent}>
                    <TransactionHeader
                        lotId={MOCK_DATA.lotId}
                        title={MOCK_DATA.title}
                        buyer={MOCK_DATA.buyerName}
                        seller={MOCK_DATA.sellerName}
                        endDate={MOCK_DATA.endDate}
                        amount={MOCK_DATA.amount}
                        status={MOCK_DATA.status}
                        paymentDueDate="Nov 22, 2025"
                    />

                    <TransactionStepProgress currentStep="payment" />

                    <PaymentBlock
                        role={role}
                        status={MOCK_DATA.status}
                        amount={MOCK_DATA.amount}
                        winningBid={1250}
                        platformFees={0}
                        taxes={0}
                    />

                    <LogisticsBlock
                        role={role}
                        status="pending"
                        method="pickup"
                        address="123 Warehouse Blvd, Logistics City, NY 10001"
                    />

                    <ActivityLog logs={MOCK_DATA.logs} />
                </div>
            </div>

            {/* Floating Chat Button */}
            <button
                className={styles.floatingChatBtn}
                onClick={() => setIsChatOpen(true)}
            >
                <MessageSquare size={24} />
                <span className={styles.label}>Messages</span>
                <span className={styles.sublabel}>Chat with {role === 'buyer' ? 'Seller' : 'Buyer'}</span>
            </button>

            {/* Chat Drawer Overlay */}
            <div
                className={`${styles.chatOverlay} ${isChatOpen ? styles.open : ''}`}
                onClick={() => setIsChatOpen(false)}
            />

            {/* Chat Drawer */}
            <div className={`${styles.chatDrawer} ${isChatOpen ? styles.open : ''}`}>
                <ChatPanel role={role} onClose={() => setIsChatOpen(false)} />
            </div>
        </>
    );
}
