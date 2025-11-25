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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Payout Summary</h3>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-600">
                    <span>Winning Bid</span>
                    <span className="font-medium text-slate-900">{currency} {formatMoney(winningBid)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                    <span>Buyer Premium <span className="text-xs text-slate-400">(paid by buyer)</span></span>
                    <span className="font-medium">{currency} {formatMoney(buyerPremium)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                    <span>Platform Fee (Seller)</span>
                    <span className="font-medium text-red-600">-{currency} {formatMoney(platformFee)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                    <span>VAT / Taxes Withheld</span>
                    <span className="font-medium text-red-600">-{currency} {formatMoney(vat)}</span>
                </div>
            </div>

            <div className="my-4 border-t border-slate-100" />

            <div className="flex justify-between items-center">
                <span className="font-medium text-slate-900">Net Payout to You</span>
                <span className="text-base font-semibold text-emerald-600">{currency} {formatMoney(netPayout)}</span>
            </div>
        </div>
    );
};
