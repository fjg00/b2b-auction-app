import React from 'react';

interface SellerPayoutSummaryProps {
    winningBid: number;
    buyerPremium: number;
    platformFee: number;
    vat: number;
    netPayout: number;
    currency: string;
}

export const SellerPayoutSummary = ({
    winningBid,
    buyerPremium,
    platformFee,
    vat,
    netPayout,
    currency,
}: SellerPayoutSummaryProps) => {
    const formatMoney = (amount: number) => amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Payout Summary</h3>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-600">
                    <span>Winning Bid</span>
                    <span className="font-medium text-gray-900">{currency} {formatMoney(winningBid)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                    <span>Buyer Premium <span className="text-xs text-gray-400">(paid by buyer)</span></span>
                    <span className="font-medium">{currency} {formatMoney(buyerPremium)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                    <span>Platform Fee (Seller)</span>
                    <span className="font-medium text-red-600">-{currency} {formatMoney(platformFee)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                    <span>VAT / Taxes Withheld</span>
                    <span className="font-medium text-red-600">-{currency} {formatMoney(vat)}</span>
                </div>
            </div>

            <div className="my-4 border-t border-gray-100" />

            <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Net Payout to You</span>
                <span className="text-xl font-bold text-green-700">{currency} {formatMoney(netPayout)}</span>
            </div>
        </div>
    );
};
