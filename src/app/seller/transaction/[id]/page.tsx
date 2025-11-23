'use client';

import React, { useState, use, Suspense } from 'react';
import { MessageSquare, FileText, Download } from 'lucide-react';
import { SellerTransactionHeader } from '@/components/seller-transaction/SellerTransactionHeader';
import { SellerTimeline } from '@/components/seller-transaction/SellerTimeline';
import { SellerPayoutSummary } from '@/components/seller-transaction/SellerPayoutSummary';
import { SellerFulfillmentCard } from '@/components/seller-transaction/SellerFulfillmentCard';
import { SellerLogisticsCard } from '@/components/seller-transaction/SellerLogisticsCard';
import { ChatPanel } from '@/components/transaction/ChatPanel';

// Mock Data
const MOCK_TRANSACTION = {
    transactionId: 'TX-12345',
    auctionId: '13452',
    itemTitle: 'Mixed Beverages',
    itemQuantity: 48,
    unitPrice: 26.04,
    buyerName: 'John Doe',
    buyerCompany: 'Retail King LLC',
    netPayout: 1456.88,
    payoutMethod: 'Bank Transfer',
    payoutDate: 'Nov 25, 2025',
    status: 'READY_FOR_RELEASE' as const,
    winningBid: 1250.00,
    buyerPremium: 62.50,
    platformFee: 0.00,
    vat: 144.38,
    currency: 'USD',
    timeline: [
        { id: '1', label: 'Auction closed', date: 'Nov 20, 10:00 AM', status: 'completed' as const },
        { id: '2', label: 'Buyer payment initiated', date: 'Nov 20, 11:30 AM', status: 'completed' as const },
        { id: '3', label: 'Payment verified', date: 'Nov 21, 09:00 AM', status: 'completed' as const },
        { id: '4', label: 'Seller confirm goods', status: 'current' as const },
        { id: '5', label: 'Goods handed over', status: 'pending' as const },
        { id: '6', label: 'Payout sent', status: 'pending' as const },
    ],
    logistics: {
        mode: 'pickup' as const,
        pickupLocation: '123 Warehouse Blvd, Logistics City, NY 10001',
        pickupWindow: 'Nov 22 - Nov 24, 9 AM - 5 PM',
    }
};

function SellerTransactionContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleConfirmReady = () => {
        alert('Goods confirmed ready! Notification sent to buyer.');
    };

    const handleReportIssue = () => {
        alert('Opening issue report dialog...');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <SellerTransactionHeader
                    {...MOCK_TRANSACTION}
                    transactionId={id} // Use ID from params
                />

                {/* Timeline */}
                <SellerTimeline events={MOCK_TRANSACTION.timeline} />

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Financials & Documents */}
                    <div className="space-y-8">
                        <SellerPayoutSummary
                            winningBid={MOCK_TRANSACTION.winningBid}
                            buyerPremium={MOCK_TRANSACTION.buyerPremium}
                            platformFee={MOCK_TRANSACTION.platformFee}
                            vat={MOCK_TRANSACTION.vat}
                            netPayout={MOCK_TRANSACTION.netPayout}
                            currency={MOCK_TRANSACTION.currency}
                        />

                        {/* Payout Details Card */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Method</span>
                                    <span className="font-medium text-gray-900">{MOCK_TRANSACTION.payoutMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Bank</span>
                                    <span className="font-medium text-gray-900">Bank Audi</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Account</span>
                                    <span className="font-medium text-gray-900">**** 1234</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Expected Date</span>
                                    <span className="font-medium text-gray-900">{MOCK_TRANSACTION.payoutDate}</span>
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                                Payouts are processed within 1 business day after goods are confirmed as released.
                            </div>
                        </div>

                        {/* Documents Card */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group">
                                    <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">Buyer Invoice</div>
                                        <div className="text-xs text-gray-500">PDF • 1.2 MB</div>
                                    </div>
                                    <Download size={16} className="text-gray-400" />
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">Seller Statement</div>
                                        <div className="text-xs text-gray-500">PDF • 850 KB</div>
                                    </div>
                                    <Download size={16} className="text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Fulfillment & Logistics */}
                    <div className="lg:col-span-2 space-y-8">
                        <SellerFulfillmentCard
                            status={MOCK_TRANSACTION.status}
                            onConfirmReady={handleConfirmReady}
                            onReportIssue={handleReportIssue}
                        />

                        <SellerLogisticsCard
                            mode={MOCK_TRANSACTION.logistics.mode}
                            pickupLocation={MOCK_TRANSACTION.logistics.pickupLocation}
                            pickupWindow={MOCK_TRANSACTION.logistics.pickupWindow}
                        />

                        {/* Support Section */}
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <span>Need help?</span>
                            <button className="text-blue-600 hover:underline font-medium">Contact platform support</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Chat Button */}
            <button
                className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 px-5 py-4 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                onClick={() => setIsChatOpen(true)}
            >
                <div className="relative">
                    <MessageSquare size={24} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-green-600"></span>
                </div>
                <span className="text-sm font-bold">Chat with Buyer</span>
            </button>

            {/* Chat Drawer Overlay */}
            {isChatOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
                    onClick={() => setIsChatOpen(false)}
                />
            )}

            {/* Chat Drawer */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <ChatPanel role="seller" onClose={() => setIsChatOpen(false)} />
            </div>
        </div>
    );
}

export default function SellerTransactionPage(props: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading transaction details...</div>}>
            <SellerTransactionContent {...props} />
        </Suspense>
    );
}
