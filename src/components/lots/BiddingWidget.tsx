'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import styles from './BiddingWidget.module.css';

interface BiddingWidgetProps {
    currentBid: number;
    minBidIncrement: number;
    endTime: Date;
}

export const BiddingWidget: React.FC<BiddingWidgetProps> = ({
    currentBid,
    minBidIncrement,
    endTime,
}) => {
    const [displayBid, setDisplayBid] = useState<number>(currentBid);
    const [bidAmount, setBidAmount] = useState<number>(currentBid + minBidIncrement);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleBid = () => {
        if (bidAmount < displayBid + minBidIncrement) {
            setMessage('Bid must be higher than current bid + increment');
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setDisplayBid(bidAmount); // Update displayed bid
            setBidAmount(bidAmount + minBidIncrement); // Reset input to next increment
            setMessage('Bid placed successfully!');
        }, 1000);
    };

    return (
        <div className={styles.widget}>
            <div className={styles.header}>
                <span className={styles.label}>Current Bid</span>
                <span className={styles.price}>${displayBid.toLocaleString()}</span>
            </div>

            <div className={styles.inputGroup}>
                <span className={styles.currency}>$</span>
                <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className={styles.input}
                    min={displayBid + minBidIncrement}
                />
            </div>

            <div className={styles.helperText}>
                Minimum bid: ${(displayBid + minBidIncrement).toLocaleString()}
            </div>

            <Button
                fullWidth
                onClick={handleBid}
                disabled={isSubmitting}
                className={styles.bidButton}
            >
                {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
            </Button>

            {message && (
                <div className={styles.message} style={{ color: message.includes('success') ? 'var(--color-success)' : 'var(--color-error)' }}>
                    {message}
                </div>
            )}
        </div>
    );
};
