import React from 'react';
import Image from 'next/image';

interface TransactionHeaderProps {
    lotId: string;
    title: string;
    image: string;
    buyer: string;
    seller: string;
    endDate: string;
    amount: number;
    status: 'awaiting_payment' | 'payment_verification' | 'paid' | 'scheduled' | 'completed';
    paymentDueDate?: string;
}

export const TransactionHeader = ({
    lotId,
    title,
    image,
    buyer,
    seller,
    endDate,
    amount,
    status,
    paymentDueDate,
}: TransactionHeaderProps) => {
    const statusConfig = {
        awaiting_payment: { label: 'Awaiting Payment', color: 'bg-amber-100 text-amber-800 border-amber-200' },
        payment_verification: { label: 'Verifying Payment', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        paid: { label: 'Payment Received', color: 'bg-blue-100 text-blue-800 border-blue-200' },
        scheduled: { label: 'Pickup Scheduled', color: 'bg-purple-100 text-purple-800 border-purple-200' },
        completed: { label: 'Completed', color: 'bg-green-100 text-green-800 border-green-200' },
    };

    const currentStatus = statusConfig[status];

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Image */}
                <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col md:flex-row justify-between gap-8">
                    {/* Left Side - Transaction Info */}
                    <div className="flex-1">
                        {/* Top Label */}
                        <div className="text-sm font-semibold text-gray-500 mb-2 tracking-wide uppercase">
                            Transaction – LOT #{lotId}
                        </div>

                        {/* Main Title */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                            {title}
                        </h1>

                        {/* Meta Lines */}
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500 w-16">Buyer:</span>
                                <span className="font-medium text-gray-900">{buyer}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500 w-16">Seller:</span>
                                <span className="font-medium text-gray-900">{seller}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500 w-16">Ended:</span>
                                <span className="font-medium text-gray-900">{endDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Status Block */}
                    <div className="flex flex-col items-end gap-4 min-w-[240px]">
                        <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                            <div className="text-4xl font-bold text-gray-900">
                                ${amount.toLocaleString()}
                            </div>
                        </div>

                        {/* Status Pill */}
                        <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${currentStatus.color}`}>
                            {currentStatus.label}
                        </div>

                        {/* Payment Due Date */}
                        {paymentDueDate && status === 'awaiting_payment' && (
                            <div className="text-xs text-red-600 font-medium">
                                Due by {paymentDueDate}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
