import React from 'react';
import { AlertTriangle, CheckCircle, Info, Package } from 'lucide-react';

interface SellerFulfillmentCardProps {
    status: 'AWAITING_BUYER_PAYMENT' | 'PAYMENT_UNDER_REVIEW' | 'READY_FOR_RELEASE' | 'HANDED_OVER' | 'COMPLETED' | 'CANCELLED';
    onConfirmReady: () => void;
    onReportIssue: () => void;
}

export const SellerFulfillmentCard = ({ status, onConfirmReady, onReportIssue }: SellerFulfillmentCardProps) => {
    const renderContent = () => {
        switch (status) {
            case 'AWAITING_BUYER_PAYMENT':
                return (
                    <div>
                        <div className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-medium mb-3">
                            Awaiting buyer payment
                        </div>
                        <p className="text-sm text-slate-600">
                            Waiting for the buyer to complete payment. You don’t need to do anything yet.
                        </p>
                    </div>
                );
            case 'PAYMENT_UNDER_REVIEW':
                return (
                    <div>
                        <div className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-xs font-medium mb-3">
                            Payment under review
                        </div>
                        <p className="text-sm text-slate-600">
                            Buyer payment is being verified by the platform. Please do not release goods yet.
                        </p>
                    </div>
                );
            case 'READY_FOR_RELEASE':
                return (
                    <div className="space-y-4">
                        <div>
                            <div className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-medium mb-3">
                                Payment Verified
                            </div>
                            <p className="text-sm text-slate-600">
                                Payment has been secured. Please confirm the goods are available and ready for pickup/shipping.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onConfirmReady}
                                className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Mark as ready for release
                            </button>
                            <button
                                onClick={onReportIssue}
                                className="px-4 py-2 text-slate-700 text-sm font-medium hover:bg-slate-50 rounded-lg border border-slate-300 transition-colors"
                            >
                                Report Issue
                            </button>
                        </div>
                    </div>
                );
            case 'HANDED_OVER':
            case 'COMPLETED':
                return (
                    <div>
                        <div className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-medium mb-3">
                            Goods Handed Over
                        </div>
                        <p className="text-sm text-slate-600">
                            Goods were marked as handed over. Payout will be processed shortly.
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Fulfillment Status</h3>
            {renderContent()}
        </div>
    );
};
