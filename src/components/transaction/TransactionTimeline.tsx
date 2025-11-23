import React from 'react';
import { Check, CreditCard, Truck, Package } from 'lucide-react';

interface TransactionTimelineProps {
    currentStep: 'auction_ended' | 'payment' | 'pickup' | 'completed';
}

export const TransactionTimeline = ({ currentStep }: TransactionTimelineProps) => {
    const stepOrder = ['auction_ended', 'payment', 'pickup', 'completed'];
    const currentIndex = stepOrder.indexOf(currentStep);

    const steps = [
        { id: 'auction_ended', label: 'Auction Ended', icon: Package },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        { id: 'pickup', label: 'Pickup', icon: Truck },
        { id: 'completed', label: 'Completed', icon: Check },
    ];

    // Primary green color from the app
    const primaryGreen = '#16a34a';

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm py-12 px-16">
            {/* Progress Bar Container */}
            <div className="max-w-4xl mx-auto">
                <div className="relative">
                    {/* Background Line (Full Width - Grey) */}
                    <div
                        className="absolute left-0 right-0 rounded-full"
                        style={{
                            top: '30px',
                            height: '8px',
                            backgroundColor: '#e5e7eb'
                        }}
                    />

                    {/* Progress Line (Green - Shows Progress) */}
                    <div
                        className="absolute rounded-full transition-all duration-700 ease-in-out"
                        style={{
                            top: '30px',
                            left: '0',
                            height: '8px',
                            backgroundColor: primaryGreen,
                            width: `${(currentIndex / (steps.length - 1)) * 100}%`
                        }}
                    />

                    {/* Step Checkpoints */}
                    <div className="relative flex justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isCompleted = index < currentIndex;
                            const isCurrent = index === currentIndex;
                            const isPending = index > currentIndex;

                            return (
                                <div key={step.id} className="flex flex-col items-center">
                                    {/* Circle Checkpoint */}
                                    <div
                                        className="rounded-full flex items-center justify-center mb-4 transition-all duration-300 relative z-10"
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            backgroundColor: (isCompleted || isCurrent) ? primaryGreen : '#ffffff',
                                            border: isPending ? '4px solid #d1d5db' : 'none',
                                            boxShadow: (isCompleted || isCurrent) ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                                        }}
                                    >
                                        {isCompleted ? (
                                            <Check size={32} style={{ color: '#ffffff' }} strokeWidth={3} />
                                        ) : (
                                            <Icon
                                                size={28}
                                                style={{ color: isCurrent ? '#ffffff' : '#9ca3af' }}
                                            />
                                        )}
                                    </div>

                                    {/* Label */}
                                    <div
                                        className="text-center font-semibold text-sm whitespace-nowrap"
                                        style={{
                                            color: isCurrent ? primaryGreen : (isCompleted ? '#111827' : '#9ca3af')
                                        }}
                                    >
                                        {step.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
