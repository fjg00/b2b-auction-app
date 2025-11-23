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
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <Info className="text-gray-400 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-medium text-gray-900">Waiting for Payment</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Waiting for the buyer to complete payment. You don’t need to do anything yet.
                            </p>
                        </div>
                    </div>
                );
            case 'PAYMENT_UNDER_REVIEW':
                return (
                    <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-medium text-amber-900">Payment Under Review</h4>
                            <p className="text-sm text-amber-700 mt-1">
                                Buyer payment is being verified by the platform. Please do not release goods yet.
                            </p>
                        </div>
                    </div>
                );
            case 'READY_FOR_RELEASE':
                return (
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                            <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-medium text-green-900">Payment Verified</h4>
                                <p className="text-sm text-green-700 mt-1">
                                    Payment has been secured. Please confirm the goods are available and ready for pickup/shipping.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onConfirmReady}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                            >
                                Confirm Goods Ready
                            </button>
                            <button
                                onClick={onReportIssue}
                                className="px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
                            >
                                Report Issue
                            </button>
                        </div>
                    </div>
                );
            case 'HANDED_OVER':
            case 'COMPLETED':
                return (
                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <Package className="text-blue-600 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-medium text-blue-900">Goods Handed Over</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Goods were marked as handed over. Payout will be processed shortly.
                            </p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Fulfillment Status</h3>
            {renderContent()}
        </div>
    );
};
