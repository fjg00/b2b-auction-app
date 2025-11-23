import React from 'react';

interface TransactionHeaderProps {
    lotId: string;
    title: string;
    buyer: string;
    seller: string;
    endDate: string;
    amount: number;
    status: 'awaiting_payment' | 'paid' | 'scheduled' | 'completed';
    paymentDueDate?: string;
}

export const TransactionHeader = ({
    lotId,
    title,
    buyer,
    seller,
    endDate,
    amount,
    status,
    paymentDueDate,
}: TransactionHeaderProps) => {
    const statusConfig = {
        awaiting_payment: { label: 'Awaiting Payment', color: 'bg-amber-100 text-amber-800 border-amber-200' },
        paid: { label: 'Payment Received', color: 'bg-blue-100 text-blue-800 border-blue-200' },
        scheduled: { label: 'Pickup Scheduled', color: 'bg-purple-100 text-purple-800 border-purple-200' },
        completed: { label: 'Completed', color: 'bg-green-100 text-green-800 border-green-200' },
    };

    const currentStatus = statusConfig[status];

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10">
            <div className="flex justify-between items-start gap-12">
                {/* Left Side - Transaction Info */}
                <div className="flex-1">
                    {/* Top Label */}
                    <div className="text-sm font-semibold text-gray-500 mb-3 tracking-wide uppercase">
                        Transaction – LOT #{lotId}
                    </div>

                    {/* Main Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        {title}
                    </h1>

                    {/* Meta Lines - Three Separate Lines */}
                    <div className="space-y-2.5 text-base">
                        <div className="flex items-center gap-2.5 text-gray-700">
                            <span className="font-medium text-gray-500">Buyer</span>
                            <span className="text-gray-400">·</span>
                            <span className="font-medium text-gray-900">{buyer}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-gray-700">
                            <span className="font-medium text-gray-500">Seller</span>
                            <span className="text-gray-400">·</span>
                            <span className="font-medium text-gray-900">{seller}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-gray-700">
                            <span className="font-medium text-gray-500">Ended</span>
                            <span className="text-gray-400">·</span>
                            <span className="font-medium text-gray-900">{endDate}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Status Block (Visually Grouped) */}
                <div className="flex flex-col items-end gap-3 bg-gray-50 border border-gray-200 rounded-lg p-6 min-w-[240px]">
                    {/* Amount */}
                    <div className="text-4xl font-bold text-gray-900">
                        ${amount.toLocaleString()}
                    </div>

                    {/* Status Pill */}
                    <div className={`px-5 py-2 rounded-full text-sm font-semibold border ${currentStatus.color}`}>
                        {currentStatus.label}
                    </div>

                    {/* Payment Due Date */}
                    {paymentDueDate && status === 'awaiting_payment' && (
                        <div className="text-sm text-gray-500 text-right">
                            Payment due by {paymentDueDate}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
