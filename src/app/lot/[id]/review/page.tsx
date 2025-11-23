'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReviewForm, ReviewData } from '@/components/reviews/ReviewForm';
import styles from './review-page.module.css';

export default function ReviewPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);

    // Mock data - in reality would fetch based on params.id
    const lotTitle = "Mixed Dairy Products - 48 Units";
    const sellerName = "Fresh Foods Distributors";

    const handleSubmit = (data: ReviewData) => {
        console.log('Review submitted:', data);
        setSubmitted(true);

        // Simulate API call and redirect
        setTimeout(() => {
            router.push('/buyer'); // Redirect back to dashboard
        }, 2000);
    };

    const handleCancel = () => {
        router.back();
    };

    if (submitted) {
        return (
            <div className={styles.container}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>🎉</div>
                    <h1 className={styles.successTitle}>Review Submitted!</h1>
                    <p className={styles.successText}>Thank you for your feedback. Your review helps build trust in our marketplace.</p>
                    <p className={styles.redirectText}>Redirecting you back...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>Leave a Review</h1>
                <p className={styles.subtitle}>For lot: <strong>{lotTitle}</strong></p>
            </div>

            <ReviewForm
                targetName={sellerName}
                targetRole="seller" // or 'buyer' depending on who is viewing
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
}
