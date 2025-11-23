'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './ReviewForm.module.css';

interface ReviewFormProps {
    targetName: string;
    targetRole: 'buyer' | 'seller';
    onSubmit: (data: ReviewData) => void;
    onCancel: () => void;
}

export interface ReviewData {
    rating: number;
    comment: string;
    tags: string[];
    recommend: boolean | null;
}

const SELLER_TAGS = [
    "Accurate description",
    "Condition mismatch",
    "Pickup delay",
    "Easy communication",
    "Helpful staff",
    "Clean facility"
];

const BUYER_TAGS = [
    "On-time payment",
    "On-time pickup",
    "No-show",
    "Easy communication",
    "Respectful",
    "Late payment"
];

export const ReviewForm: React.FC<ReviewFormProps> = ({
    targetName,
    targetRole,
    onSubmit,
    onCancel
}) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [recommend, setRecommend] = useState<boolean | null>(null);

    const availableTags = targetRole === 'seller' ? SELLER_TAGS : BUYER_TAGS;

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            rating,
            comment,
            tags: selectedTags,
            recommend
        });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.title}>Rate your experience with {targetName}</h2>

            <div className={styles.section}>
                <label className={styles.label}>Overall Rating</label>
                <div className={styles.stars} onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={styles.starBtn}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                        >
                            <Star
                                size={32}
                                fill={(hoverRating || rating) >= star ? "var(--color-secondary)" : "none"}
                                stroke={(hoverRating || rating) >= star ? "var(--color-secondary)" : "var(--color-text-muted)"}
                                className={styles.starIcon}
                            />
                        </button>
                    ))}
                </div>
                <div className={styles.ratingText}>
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                </div>
            </div>

            <div className={styles.section}>
                <label className={styles.label}>What went well? (Select all that apply)</label>
                <div className={styles.tags}>
                    {availableTags.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            className={`${styles.tag} ${selectedTags.includes(tag) ? styles.activeTag : ''}`}
                            onClick={() => toggleTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <label className={styles.label}>Would you recommend this {targetRole}?</label>
                <div className={styles.recommendGroup}>
                    <button
                        type="button"
                        className={`${styles.recommendBtn} ${recommend === true ? styles.activeRecommend : ''}`}
                        onClick={() => setRecommend(true)}
                    >
                        <ThumbsUp size={20} /> Yes
                    </button>
                    <button
                        type="button"
                        className={`${styles.recommendBtn} ${recommend === false ? styles.activeRecommend : ''}`}
                        onClick={() => setRecommend(false)}
                    >
                        <ThumbsDown size={20} /> No
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <label className={styles.label}>Additional Comments</label>
                <textarea
                    className={styles.textarea}
                    rows={4}
                    placeholder="Share details about your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            <div className={styles.actions}>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={rating === 0}>Submit Review</Button>
            </div>
        </form>
    );
};
