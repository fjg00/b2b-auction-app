import React from 'react';
import { Check, CreditCard, Truck } from 'lucide-react';

interface TransactionStepProgressProps {
    currentStep: 'auction_ended' | 'payment' | 'pickup' | 'completed';
}

export const TransactionStepProgress = ({ currentStep }: TransactionStepProgressProps) => {
    const stepOrder = ['auction_ended', 'payment', 'pickup', 'completed'];
    const currentIndex = stepOrder.indexOf(currentStep);

    const steps = [
        { id: 'auction_ended', label: 'Auction Ended' },
        { id: 'payment', label: 'Payment' },
        { id: 'pickup', label: 'Pickup' },
        { id: 'completed', label: 'Completed' },
    ];

    // Colors - EXACT as specified
    const primaryGreen = '#16a34a'; // Same as Pay Now button
    const lineGrey = '#E0E0E0';
    const iconGrey = '#9E9E9E';
    const labelGrey = '#757575';

    return (
        <div style={{
            width: '100%',
            marginTop: '16px',
            marginBottom: '24px',
            paddingLeft: '40px',
            paddingRight: '40px'
        }}>
            <div style={{ width: '100%', position: 'relative' }}>
                {/* Horizontal Line - 6px thickness for prominence */}
                <div style={{
                    position: 'relative',
                    height: '6px',
                    borderRadius: '3px',
                    background: `linear-gradient(to right, ${primaryGreen} 0%, ${primaryGreen} 33.33%, ${lineGrey} 33.33%, ${lineGrey} 100%)`,
                    marginBottom: '12px'
                }}>
                    {/* Step Circles */}
                    <div style={{
                        position: 'absolute',
                        top: '-17px', // Center 40px circle on 6px line
                        left: '0',
                        right: '0',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        {steps.map((step, index) => {
                            const isCompleted = index < currentIndex;
                            const isCurrent = index === currentIndex;
                            const isPending = index > currentIndex;

                            // Determine circle style
                            let circleStyle: React.CSSProperties = {
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            };

                            if (isCompleted || isCurrent) {
                                circleStyle.backgroundColor = primaryGreen;
                            } else {
                                circleStyle.backgroundColor = 'white';
                                circleStyle.border = `4px solid ${lineGrey}`;
                            }

                            return (
                                <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {/* Circle */}
                                    <div style={circleStyle}>
                                        {/* Icon */}
                                        {index === 0 && (
                                            <Check size={18} style={{ color: 'white' }} strokeWidth={3} />
                                        )}
                                        {index === 1 && isCurrent && (
                                            <CreditCard size={16} style={{ color: 'white' }} strokeWidth={2.5} />
                                        )}
                                        {index === 2 && (
                                            <Truck size={16} style={{ color: isPending ? iconGrey : 'white' }} strokeWidth={2.5} />
                                        )}
                                        {index === 3 && (
                                            <Check size={18} style={{ color: isPending ? iconGrey : 'white' }} strokeWidth={2.5} />
                                        )}
                                    </div>

                                    {/* Label */}
                                    <div style={{
                                        marginTop: '10px',
                                        fontSize: '15px',
                                        color: isCurrent ? primaryGreen : labelGrey,
                                        fontWeight: 500,
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap'
                                    }}>
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
