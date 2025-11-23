import React from 'react';
import { Star } from 'lucide-react';
import styles from './ReviewSection.module.css';

interface Review {
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
    tags: string[];
}

interface ReviewSectionProps {
    rating: number;
    count: number;
    reviews: Review[];
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ rating, count, reviews }) => {
    return (
        <div className={styles.section}>
            <h2 className={styles.title}>Reviews & Ratings</h2>

            <div className={styles.summary}>
                <div className={styles.ratingBig}>
                    <Star size={32} fill="var(--color-secondary)" stroke="var(--color-secondary)" />
                    <span className={styles.score}>{rating.toFixed(1)}</span>
                </div>
                <span className={styles.count}>Based on {count} reviews</span>
            </div>

            <div className={styles.list}>
                {reviews.map(review => (
                    <div key={review.id} className={styles.reviewCard}>
                        <div className={styles.reviewHeader}>
                            <span className={styles.author}>{review.author}</span>
                            <span className={styles.date}>{review.date}</span>
                        </div>
                        <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    fill={i < review.rating ? "var(--color-secondary)" : "none"}
                                    stroke={i < review.rating ? "var(--color-secondary)" : "var(--color-text-muted)"}
                                />
                            ))}
                        </div>
                        <p className={styles.comment}>{review.comment}</p>
                        <div className={styles.tags}>
                            {review.tags.map(tag => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
