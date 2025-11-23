'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, DollarSign, Calendar, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './create-lot.module.css';

import { PRODUCT_CATEGORIES, CONDITION_CATEGORIES, SMART_TAGS } from '@/lib/constants';

export default function CreateLotPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Lot created successfully! (Prototype)');
            // In real app, redirect to dashboard
        }, 1500);
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Link href="/seller" className={styles.backLink}>
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>

                <div className={styles.header}>
                    <h1 className={styles.title}>Create New Lot</h1>
                    <p className={styles.subtitle}>List your excess inventory for auction.</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* Section 1: Basics */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Package size={20} /> Lot Details
                        </h2>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label className={styles.label}>Lot Title</label>
                                <input type="text" className={styles.input} placeholder="e.g., Mixed Dairy Products - 48 Units" required />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Category</label>
                                <select className={styles.select}>
                                    <option value="">Select Category</option>
                                    {PRODUCT_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Barcode / UPC (Optional)</label>
                                <input type="text" className={styles.input} placeholder="e.g., 123456789012" />
                            </div>
                            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                <label className={styles.label}>Description</label>
                                <textarea className={styles.textarea} rows={4} placeholder="Describe the items, brands, and condition details..." required />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Inventory */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Package size={20} /> Inventory & Condition
                        </h2>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label className={styles.label}>Quantity</label>
                                <input type="text" className={styles.input} placeholder="e.g., 100 Cases" required />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Condition / Deal Type</label>
                                <select className={styles.select}>
                                    <option value="">Select Condition</option>
                                    {CONDITION_CATEGORIES.map(cond => (
                                        <option key={cond} value={cond}>{cond}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Production Date (Optional)</label>
                                <input type="date" className={styles.input} />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Expiry Date (if applicable)</label>
                                <input type="date" className={styles.input} />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Location</label>
                                <input type="text" className={styles.input} placeholder="City, State" required />
                            </div>

                            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                <label className={styles.label}>Smart Tags</label>
                                <div className={styles.tagsContainer}>
                                    {SMART_TAGS.map(tag => (
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
                        </div>
                    </div>

                    {/* Section 3: Pricing */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <DollarSign size={20} /> Pricing & Auction
                        </h2>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label className={styles.label}>Starting Bid ($)</label>
                                <input type="number" className={styles.input} placeholder="0.00" min="0" required />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Buy Now Price ($) (Optional)</label>
                                <input type="number" className={styles.input} placeholder="0.00" min="0" />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Auction Duration</label>
                                <select className={styles.select}>
                                    <option>3 Days</option>
                                    <option>5 Days</option>
                                    <option>7 Days</option>
                                    <option>14 Days</option>
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Start Date</label>
                                <input type="datetime-local" className={styles.input} />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Photos */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <Upload size={20} /> Photos
                        </h2>
                        <div className={styles.uploadArea}>
                            <Upload size={32} className={styles.uploadIcon} />
                            <p className={styles.uploadText}>Drag & drop photos here or click to browse</p>
                            <p className={styles.uploadHint}>Upload at least 1 photo. Max 5 photos.</p>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button type="button" variant="outline" size="lg">Save Draft</Button>
                        <Button type="submit" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? 'Publishing...' : 'Publish Lot'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
