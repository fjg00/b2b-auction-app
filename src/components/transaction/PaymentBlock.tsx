import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PaymentBlockProps {
    amount: number;
    winningBid: number;
    platformFees: number;
    taxes: number;
    status: 'awaiting_payment' | 'paid' | 'scheduled' | 'completed';
    role: 'buyer' | 'seller';
}

export const PaymentBlock = ({
    amount,
    winningBid,
    platformFees,
    taxes,
    status,
    role,
}: PaymentBlockProps) => {
    const isPaid = status !== 'awaiting_payment';

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm" style={{ padding: '20px 24px' }}>
            {/* Header */}
            <h2 className="text-2xl font-bold flex items-center mb-16" style={{ gap: '12px' }}>
                <CreditCard className="text-gray-500" size={28} />
                Payment &amp; Invoice
            </h2>

            {/* Breakdown - Compact spacing */}
            <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {/* Breakdown Items First */}
                    <div className="flex justify-between items-center">
                        <span className="text-base text-gray-600">Winning Bid</span>
                        <span className="text-base font-medium text-gray-900">${winningBid.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-base text-gray-600">Platform Fees</span>
                        <span className="text-base font-medium text-gray-900">${platformFees.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-base text-gray-600">Taxes</span>
                        <span className="text-base font-medium text-gray-900">${taxes.toFixed(2)}</span>
                    </div>
                </div>

                {/* Separator */}
                <div style={{ height: '1px', backgroundColor: '#e5e7eb', marginTop: '10px', marginBottom: '10px' }}></div>

                {/* Total to Pay - Last, Emphasized */}
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">Total to Pay</span>
                    <span className="text-2xl font-bold text-gray-900">${amount.toLocaleString()}</span>
                </div>
            </div>

            {/* Action Buttons - Compact and Centered */}
            {role === 'buyer' && !isPaid && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <button
                        style={{
                            width: '100%',
                            maxWidth: '320px',
                            height: '44px',
                            borderRadius: '9999px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 500,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                    >
                        Pay Now
                    </button>
                    <button
                        style={{
                            width: '100%',
                            maxWidth: '320px',
                            height: '44px',
                            borderRadius: '9999px',
                            backgroundColor: 'white',
                            color: '#16a34a',
                            fontSize: '16px',
                            fontWeight: 500,
                            border: '1px solid #16a34a',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        Upload Proof of Payment
                    </button>
                </div>
            )}

            {role === 'buyer' && isPaid && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center" style={{ marginTop: '12px' }}>
                    <p className="text-green-800 font-medium">Payment Received</p>
                </div>
            )}

            {/* Helper Text */}
            {role === 'buyer' && !isPaid && (
                <div className="text-sm text-gray-500" style={{ marginTop: '10px', textAlign: 'left' }}>
                    After payment is confirmed, pickup scheduling will be available.
                </div>
            )}
        </div>
    );
};
