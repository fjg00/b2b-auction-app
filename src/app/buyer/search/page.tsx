'use client';

import React from 'react';
import { LotCard } from '@/components/lots/LotCard';
import styles from './search.module.css';
import { Search, Filter } from 'lucide-react';

// Mock Data (Reusing and expanding)
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
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 2),
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
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
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
        endTime: new Date(Date.now() + 1000 * 60 * 45),
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
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 5),
        bidsCount: 15,
        watchCount: 45,
    },
    {
        id: '13456',
        title: 'Canned Vegetables - Mixed Pallet',
        image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=800&auto=format&fit=crop',
        location: 'Dallas, TX',
        expiryDate: '2025-12-20',
        condition: 'Near Expiry' as const,
        currentBid: 220,
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 48),
        bidsCount: 3,
        watchCount: 15,
    },
    {
        id: '13457',
        title: 'Energy Bars - 50 Boxes',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
        location: 'Seattle, WA',
        expiryDate: '2026-02-01',
        condition: 'Overstock' as const,
        currentBid: 180,
        buyNowPrice: 400,
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 3),
        bidsCount: 6,
        watchCount: 22,
    }
];

export default function SearchPage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Browse Lots</h1>

                    <div className={styles.controls}>
                        <div className={styles.searchGroup}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search by keyword, brand, or lot ID..."
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <select className={styles.select}>
                                <option>All Categories</option>
                                <option>Food & Beverage</option>
                                <option>Personal Care</option>
                            </select>
                            <select className={styles.select}>
                                <option>All Conditions</option>
                                <option>Near Expiry</option>
                                <option>Overstock</option>
                                <option>Returned</option>
                            </select>
                            <select className={styles.select}>
                                <option>Sort By: Ending Soon</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.grid}>
                    {MOCK_LOTS.map((lot) => (
                        <LotCard key={lot.id} {...lot} />
                    ))}
                </div>
            </div>
        </div>
    );
}
