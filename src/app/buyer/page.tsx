import React from 'react';
import Link from 'next/link';
import { LotCard } from '@/components/lots/LotCard';
import { Button } from '@/components/ui/Button';
import styles from './buyer.module.css';
import { Filter, MapPin, Calendar } from 'lucide-react';

// Mock Data
const MOCK_LOTS = [
    {
        id: '13452',
        title: 'Mixed Dairy Products - 48 Units',
        image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop',
        location: 'New York, NY',
        expiryDate: '2025-12-01',
        condition: 'Near Expiry' as const,
        currentBid: 120,
        buyNowPrice: 450,
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
        bidsCount: 5,
        watchCount: 12,
    },
    {
        id: '13453',
        title: 'Organic Pasta Sauce - 20 Cases',
        image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=800&auto=format&fit=crop',
        location: 'Chicago, IL',
        expiryDate: '2026-01-15',
        condition: 'Overstock' as const,
        currentBid: 350,
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
        bidsCount: 2,
        watchCount: 8,
    },
    {
        id: '13454',
        title: 'Assorted Beverages - Pallet',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
        location: 'Los Angeles, CA',
        expiryDate: '2025-11-30',
        condition: 'Returned' as const,
        currentBid: 80,
        buyNowPrice: 200,
        endTime: new Date(Date.now() + 1000 * 60 * 45), // 45 mins from now
        bidsCount: 8,
        watchCount: 20,
    },
    {
        id: '13455',
        title: 'Gluten Free Snacks - 100 Boxes',
        image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=800&auto=format&fit=crop',
        location: 'Miami, FL',
        expiryDate: '2026-03-10',
        condition: 'Overstock' as const,
        currentBid: 500,
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 5), // 5 hours from now
        bidsCount: 15,
        watchCount: 45,
    },
];

export default function BuyerDashboard() {
    return (
        <div className={styles.dashboard}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <h1 className={styles.heroTitle}>Sourcing Inventory? <br />Save up to 80% on Wholesale Lots</h1>
                    <p className={styles.heroSubtitle}>Bid on near-expiry, overstock, and returned goods from top suppliers.</p>

                    <div className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <Filter size={16} />
                            <select className={styles.select}>
                                <option>All Categories</option>
                                <option>Food & Beverage</option>
                                <option>Personal Care</option>
                                <option>Household</option>
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <MapPin size={16} />
                            <select className={styles.select}>
                                <option>All Locations</option>
                                <option>New York</option>
                                <option>California</option>
                                <option>Texas</option>
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <Calendar size={16} />
                            <select className={styles.select}>
                                <option>Any Expiry</option>
                                <option>0-7 Days</option>
                                <option>8-30 Days</option>
                                <option>1-3 Months</option>
                            </select>
                        </div>
                        <Button>Search Lots</Button>
                    </div>
                </div>
            </section>

            {/* Ending Soon Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Ending Soon</h2>
                        <Link href="/buyer/search" className={styles.viewAll}>View All &rarr;</Link>
                    </div>

                    <div className={styles.grid}>
                        {MOCK_LOTS.map((lot) => (
                            <LotCard key={lot.id} {...lot} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Recommended Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Recommended For You</h2>
                        <Link href="/buyer/search" className={styles.viewAll}>View All &rarr;</Link>
                    </div>
                    <div className={styles.grid}>
                        {MOCK_LOTS.slice(0, 2).map((lot) => (
                            <LotCard key={`rec-${lot.id}`} {...lot} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

