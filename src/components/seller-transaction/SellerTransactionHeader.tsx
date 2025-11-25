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
    onChatClick: () => void;
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
    onChatClick,
}: SellerTransactionHeaderProps) => {
    return (
        <>
            <div className="mb-4">
                <button className="text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Back to Transactions
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between gap-6 items-start mb-8">
                {/* Left Side - Transaction Info */}
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-slate-900 mb-1">Transaction Details (Seller)</h1>

                    <div className="text-sm text-slate-500 mb-2">
                        Transaction #{transactionId} <span className="mx-1">|</span> Auction ID: {auctionId}
                    </div>

                    <div className="text-lg font-medium text-slate-900 mb-1">
                        {itemTitle} <span className="text-slate-500 font-normal">({itemQuantity} units • ${unitPrice.toFixed(2)} / unit)</span>
                    </div>

                    <div className="text-sm text-slate-700">
                        <span className="font-medium text-slate-500">Buyer:</span> {buyerCompany} – {buyerName}
                    </div>
                </div>

                {/* Right Side - Payout Info & Actions */}
                <div className="flex flex-col items-end gap-4 min-w-[280px]">
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 w-full">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                            Net Payout to You
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                            ${netPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-slate-500">
                            Payout via {payoutMethod} on {payoutDate}
                        </div>
                    </div>

                    <button
                        onClick={onChatClick}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        Messages / Chat with buyer
                    </button>
                </div>
            </div>
        </>
    );
};
