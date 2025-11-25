'use client';

import React, { useState, use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './transaction.module.css';
import { TransactionHeader } from '@/components/transaction/TransactionHeader';
import { TransactionStepProgress } from '@/components/transaction/TransactionStepProgress';
import { PaymentBlock } from '@/components/transaction/PaymentBlock';
import { LogisticsBlock } from '@/components/transaction/LogisticsBlock';
import { ChatPanel } from '@/components/transaction/ChatPanel';
import { ActivityLog } from '@/components/transaction/ActivityLog';
import { MessageSquare } from 'lucide-react';

// Seller Components
import { SellerTransactionHeader } from '@/components/seller-transaction/SellerTransactionHeader';
import { SellerTimeline } from '@/components/seller-transaction/SellerTimeline';
import { SellerPayoutSummary } from '@/components/seller-transaction/SellerPayoutSummary';
import { SellerFulfillmentCard } from '@/components/seller-transaction/SellerFulfillmentCard';
import { SellerLogisticsCard } from '@/components/seller-transaction/SellerLogisticsCard';

import { PaymentProofUpload } from '@/components/transaction/PaymentProofUpload';

// Mock Data
const MOCK_DATA = {
    lotId: '12345',
    title: 'Mixed Beverages (48 units)',
    image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop',
    buyerName: 'Retail King LLC',
    sellerName: 'Global Distributors Inc.',
    endDate: 'Nov 20, 2025, 10:00 AM',
    amount: 1250.00,
    status: 'awaiting_payment' as const,
    timeline: [
        { id: '1', label: 'Auction Ended', date: 'Nov 20, 10:00 AM', status: 'completed' as const },
        { id: '2', label: 'Payment', status: 'current' as const },
        { id: '3', label: 'Pickup', status: 'pending' as const },
        { id: '4', label: 'Completed', status: 'pending' as const },
    ],
    logs: [
        { id: '1', text: 'Auction ended – you won the lot for $1,250.00', date: 'Nov 20, 2025, 10:00 AM' },
        { id: '2', text: 'Seller congratulated you', date: 'Nov 20, 2025, 10:30 AM' },
    ],
    // Seller Specific Data
    seller: {
        transactionId: 'TX-12345',
        auctionId: '13452',
        itemTitle: 'Mixed Beverages',
        itemQuantity: 48,
        unitPrice: 26.04,
        buyerCompany: 'Retail King LLC',
        buyerName: 'John Doe',
        netPayout: 1456.88,
        payoutMethod: 'Bank Transfer',
        payoutDate: 'Nov 25, 2025',
        winningBid: 1250.00,
        buyerPremium: 62.50,
        platformFee: 0.00,
        vat: 144.38,
        currency: 'USD',
        timelineEvents: [
            { id: '1', label: 'Auction closed', date: 'Nov 20, 10:00 AM', status: 'completed' as const },
            { id: '2', label: 'Buyer payment initiated', date: 'Nov 20, 11:30 AM', status: 'completed' as const },
            { id: '3', label: 'Payment verified', date: 'Nov 21, 09:00 AM', status: 'completed' as const },
            { id: '4', label: 'Seller confirm goods', status: 'current' as const },
            { id: '5', label: 'Goods handed over', status: 'pending' as const },
            { id: '6', label: 'Payout sent', status: 'pending' as const },
        ]
    }
};

function TransactionContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const role = (searchParams.get('role') as 'buyer' | 'seller') || 'buyer';
    const [isChatOpen, setIsChatOpen] = useState(false);

    // State for payment workflow
    const [status, setStatus] = useState<'awaiting_payment' | 'payment_verification' | 'paid' | 'completed'>(MOCK_DATA.status);
    const [proofUrl, setProofUrl] = useState<string | null>(null);

    // Seller Status Mapping
    // Mapping internal status to Seller Component status
    const getSellerStatus = () => {
        switch (status) {
            case 'awaiting_payment': return 'AWAITING_BUYER_PAYMENT';
            case 'payment_verification': return 'PAYMENT_UNDER_REVIEW';
            case 'paid': return 'READY_FOR_RELEASE';
            case 'completed': return 'COMPLETED';
            default: return 'AWAITING_BUYER_PAYMENT';
        }
    };

    const handleUploadComplete = (url: string) => {
        setProofUrl(url);
        setStatus('payment_verification');
    };

    const handleConfirmPayment = () => {
        setStatus('paid');
    };

    // Platform Fee Configuration
    const PLATFORM_FEE_PERCENTAGE = 0.05; // 5%
    const winningBid = MOCK_DATA.amount;
    const platformFees = winningBid * PLATFORM_FEE_PERCENTAGE;
    const totalAmount = winningBid + platformFees;

    if (role === 'seller') {
        return (
            <div className="min-h-screen bg-slate-50 pb-24">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <SellerTransactionHeader
                        transactionId={MOCK_DATA.seller.transactionId}
                        auctionId={MOCK_DATA.seller.auctionId}
                        itemTitle={MOCK_DATA.seller.itemTitle}
                        itemQuantity={MOCK_DATA.seller.itemQuantity}
                        unitPrice={MOCK_DATA.seller.unitPrice}
                        buyerName={MOCK_DATA.seller.buyerName}
                        buyerCompany={MOCK_DATA.seller.buyerCompany}
                        netPayout={MOCK_DATA.seller.netPayout}
                        payoutMethod={MOCK_DATA.seller.payoutMethod}
                        payoutDate={MOCK_DATA.seller.payoutDate}
                        onChatClick={() => setIsChatOpen(true)}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <SellerTimeline events={MOCK_DATA.seller.timelineEvents} />

                            <SellerFulfillmentCard
                                status={getSellerStatus()}
                                onConfirmReady={() => setStatus('completed')} // Mock action
                                onReportIssue={() => alert('Report Issue Clicked')}
                            />
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <SellerPayoutSummary
                                winningBid={MOCK_DATA.seller.winningBid}
                                buyerPremium={MOCK_DATA.seller.buyerPremium}
                                platformFee={MOCK_DATA.seller.platformFee}
                                vat={MOCK_DATA.seller.vat}
                                netPayout={MOCK_DATA.seller.netPayout}
                                currency={MOCK_DATA.seller.currency}
                            />

                            <SellerLogisticsCard
                                mode="pickup"
                                pickupLocation="123 Warehouse Blvd, Logistics City, NY 10001"
                                pickupWindow="Nov 22 - Nov 24, 9 AM - 5 PM"
                            />
                        </div>
                    </div>
                </div>

                {/* Chat Drawer Overlay */}
                <div
                    className={`${styles.chatOverlay} ${isChatOpen ? styles.open : ''}`}
                    onClick={() => setIsChatOpen(false)}
                />

                {/* Chat Drawer */}
                <div className={`${styles.chatDrawer} ${isChatOpen ? styles.open : ''}`}>
                    <ChatPanel role={role} onClose={() => setIsChatOpen(false)} />
                </div>
            </div>
        );
    }

    // Buyer View (Existing)
    return (
        <>
            <div className={styles.container}>
                <div className={styles.mainContent}>
                    <TransactionHeader
                        lotId={MOCK_DATA.lotId}
                        title={MOCK_DATA.title}
                        image={MOCK_DATA.image}
                        buyer={MOCK_DATA.buyerName}
                        seller={MOCK_DATA.sellerName}
                        endDate={MOCK_DATA.endDate}
                        amount={totalAmount}
                        status={status}
                        paymentDueDate="Nov 22, 2025"
                    />

                    <TransactionStepProgress currentStep={status === 'paid' || status === 'completed' ? 'pickup' : 'payment'} />

                    <div className="space-y-6">
                        <PaymentBlock
                            role={role}
                            status={status}
                            amount={totalAmount}
                            winningBid={winningBid}
                            platformFees={platformFees}
                            taxes={0}
                        />

                        {/* Payment Workflow UI */}
                        {status === 'awaiting_payment' && role === 'buyer' && (
                            <PaymentProofUpload
                                transactionId={id}
                                onUploadComplete={handleUploadComplete}
                            />
                        )}

                        {status === 'payment_verification' && role === 'buyer' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Status:</strong> Waiting for seller to confirm payment receipt.
                                </p>
                            </div>
                        )}
                    </div>

                    <LogisticsBlock
                        role={role}
                        status={status === 'paid' || status === 'completed' ? 'pending' : 'locked'}
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
                <span className={styles.sublabel}>Chat with Seller</span>
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

export default function TransactionPage(props: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TransactionContent {...props} />
        </Suspense>
    );
}
