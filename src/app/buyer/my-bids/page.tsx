'use client';

import React, { useState } from 'react';
import { LotCard } from '@/components/lots/LotCard';
import { Badge } from '@/components/ui/Badge';
import styles from './my-bids.module.css';

// Mock Data
const WATCHED_LOTS = [
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

const MY_BIDS = [
    {
        lotId: '13452',
        title: 'Mixed Dairy Products - 48 Units',
        myBid: 120,
        currentBid: 120,
        status: 'Winning',
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 2),
    },
    {
        lotId: '13453',
        title: 'Organic Pasta Sauce - 20 Cases',
        myBid: 300,
        currentBid: 350,
        status: 'Outbid',
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
    {
        lotId: '13400',
        title: 'Canned Soup - 50 Cases',
        myBid: 200,
        currentBid: 200,
        status: 'Won',
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // Ended yesterday
    },
];

import { useSearchParams } from 'next/navigation';

export default function MyBidsPage() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') === 'watchlist' ? 'watchlist' : 'bids';
    const [activeTab, setActiveTab] = useState<'watchlist' | 'bids'>(initialTab);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>My Activity</h1>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'bids' ? styles.active : ''}`}
                        onClick={() => setActiveTab('bids')}
                    >
                        My Bids
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'watchlist' ? styles.active : ''}`}
                        onClick={() => setActiveTab('watchlist')}
                    >
                        Watchlist
                    </button>
                </div>

                <div className={styles.content}>
                    {activeTab === 'bids' && (
                        <div className={styles.bidsList}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Lot</th>
                                        <th>My Max Bid</th>
                                        <th>Current Price</th>
                                        <th>Status</th>
                                        <th>Time Left</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MY_BIDS.map((bid) => (
                                        <tr key={bid.lotId}>
                                            <td>
                                                <div className={styles.lotInfo}>
                                                    <span className={styles.lotId}>#{bid.lotId}</span>
                                                    <span className={styles.lotTitle}>{bid.title}</span>
                                                </div>
                                            </td>
                                            <td className={styles.price}>${bid.myBid}</td>
                                            <td className={styles.price}>${bid.currentBid}</td>
                                            <td>
                                                <Badge
                                                    variant={
                                                        bid.status === 'Winning' ? 'success' :
                                                            bid.status === 'Outbid' ? 'danger' :
                                                                bid.status === 'Won' ? 'info' : 'default'
                                                    }
                                                    size="sm"
                                                >
                                                    {bid.status}
                                                </Badge>
                                            </td>
                                            <td>
                                                {bid.status === 'Won' ? 'Ended' : '02h 15m'}
                                            </td>
                                            <td>
                                                {bid.status === 'Outbid' && (
                                                    <button className={styles.actionBtn}>Bid Again</button>
                                                )}
                                                {bid.status === 'Won' && (
                                                    <button className={styles.actionBtn}>Pay Now</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'watchlist' && (
                        <div className={styles.grid}>
                            {WATCHED_LOTS.map((lot) => (
                                <LotCard key={lot.id} {...lot} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
