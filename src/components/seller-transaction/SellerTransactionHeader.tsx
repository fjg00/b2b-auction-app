import React from 'react';

interface SellerTransactionHeaderProps {
    transactionId: string;
    auctionId: string;
    itemTitle: string;
    itemQuantity: number;
    unitPrice: number;
    buyerName: string;
    buyerCompany: string;
    netPayout: number;
    payoutMethod: string;
    payoutDate: string;
    status: 'AWAITING_BUYER_PAYMENT' | 'PAYMENT_UNDER_REVIEW' | 'READY_FOR_RELEASE' | 'HANDED_OVER' | 'COMPLETED' | 'CANCELLED';
}

export const SellerTransactionHeader = ({
    transactionId,
    auctionId,
    itemTitle,
    itemQuantity,
    unitPrice,
    buyerName,
    buyerCompany,
    netPayout,
    payoutMethod,
    payoutDate,
    status,
}: SellerTransactionHeaderProps) => {
    const statusConfig = {
        AWAITING_BUYER_PAYMENT: { label: 'Awaiting buyer payment', color: 'bg-amber-100 text-amber-800 border-amber-200' },
        PAYMENT_UNDER_REVIEW: { label: 'Payment under review', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        READY_FOR_RELEASE: { label: 'Ready for release', color: 'bg-green-100 text-green-800 border-green-200' },
        HANDED_OVER: { label: 'Goods handed over', color: 'bg-blue-100 text-blue-800 border-blue-200' },
        COMPLETED: { label: 'Completed', color: 'bg-gray-100 text-gray-800 border-gray-200' },
        CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
    };

    const currentStatus = statusConfig[status];

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                {/* Left Side - Transaction Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Transaction Details (Seller)</h1>
                    </div>

                    <div className="space-y-3 pl-9">
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                            <span>Transaction #{transactionId}</span>
                            <span className="text-gray-300">|</span>
                            <span>Auction ID: {auctionId}</span>
                        </div>

                        <div className="text-lg font-medium text-gray-900">
                            {itemTitle} <span className="text-gray-500 font-normal">({itemQuantity} units • ${unitPrice.toFixed(2)} / unit)</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-medium text-gray-500">Buyer:</span>
                            <span className="font-medium">{buyerCompany}</span>
                            <span className="text-gray-400">–</span>
                            <span>{buyerName}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Payout Info */}
                <div className="flex flex-col items-end gap-3 bg-gray-50 border border-gray-200 rounded-lg p-6 min-w-[280px]">
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Net Payout to You
                    </div>
                    <div className="text-4xl font-bold text-green-700">
                        ${netPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                        Payout via {payoutMethod} on {payoutDate}
                    </div>
                </div>
            </div>

            {/* Status Pill - Centered below header content */}
            <div className="mt-8 flex justify-center">
                <div className={`px-6 py-2 rounded-full text-sm font-bold border ${currentStatus.color}`}>
                    {currentStatus.label}
                </div>
            </div>
        </div>
    );
};
