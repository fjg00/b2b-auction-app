'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Upload, CheckCircle, Building, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './verification.module.css';

export default function VerificationPage() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setStep(3); // Success state
        }, 1500);
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Business Verification</h1>
                    <p className={styles.subtitle}>Verify your business to start bidding and selling.</p>
                </div>

                <div className={styles.progress}>
                    <div className={`${styles.step} ${step >= 1 ? styles.activeStep : ''}`}>
                        <div className={styles.stepIcon}>1</div>
                        <span>Business Details</span>
                    </div>
                    <div className={styles.line}></div>
                    <div className={`${styles.step} ${step >= 2 ? styles.activeStep : ''}`}>
                        <div className={styles.stepIcon}>2</div>
                        <span>Documents</span>
                    </div>
                    <div className={styles.line}></div>
                    <div className={`${styles.step} ${step >= 3 ? styles.activeStep : ''}`}>
                        <div className={styles.stepIcon}>3</div>
                        <span>Review</span>
                    </div>
                </div>

                <div className={styles.card}>
                    {step === 1 && (
                        <div className={styles.formStep}>
                            <h2 className={styles.stepTitle}><Building size={20} /> Business Information</h2>
                            <div className={styles.grid}>
                                <div className={styles.field}>
                                    <label className={styles.label}>Business Name</label>
                                    <input type="text" className={styles.input} placeholder="e.g., Fresh Market LLC" />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Business Type</label>
                                    <select className={styles.select}>
                                        <option>Retailer / Grocery Shop</option>
                                        <option>Restaurant / Café</option>
                                        <option>Wholesaler / Distributor</option>
                                        <option>Manufacturer</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Tax ID / EIN</label>
                                    <input type="text" className={styles.input} placeholder="XX-XXXXXXX" />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Phone Number</label>
                                    <input type="tel" className={styles.input} placeholder="+1 (555) 000-0000" />
                                </div>
                                <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                    <label className={styles.label}>Business Address</label>
                                    <input type="text" className={styles.input} placeholder="Street Address, City, State, Zip" />
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <Button onClick={handleNext} size="lg">Continue <ArrowRight size={18} style={{ marginLeft: 8 }} /></Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className={styles.formStep}>
                            <h2 className={styles.stepTitle}><FileText size={20} /> Upload Documents</h2>
                            <p className={styles.stepDesc}>Please upload a copy of your business license or tax registration certificate.</p>

                            <div className={styles.uploadArea}>
                                <Upload size={40} className={styles.uploadIcon} />
                                <p className={styles.uploadText}>Click to upload or drag and drop</p>
                                <p className={styles.uploadHint}>PDF, JPG, or PNG (Max 5MB)</p>
                            </div>

                            <div className={styles.actions}>
                                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
                                    {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className={styles.successStep}>
                            <div className={styles.successIcon}>
                                <CheckCircle size={64} />
                            </div>
                            <h2 className={styles.successTitle}>Verification Pending</h2>
                            <p className={styles.successText}>
                                Thank you for submitting your documents. Our team will review your application within 24 hours.
                                You will receive an email once your account is approved.
                            </p>
                            <Link href="/">
                                <Button size="lg">Return to Home</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
