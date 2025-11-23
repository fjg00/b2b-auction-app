import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Package, AlertTriangle, Truck, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Countdown } from '@/components/ui/Countdown';
import { BiddingWidget } from '@/components/lots/BiddingWidget';
import styles from './lot-details.module.css';

// Mock Data for a single lot
const MOCK_LOT_DETAIL = {
    id: '13452',
    title: 'Mixed Dairy Products - 48 Units',
    description: 'A pallet of mixed dairy products including yogurt, cheese, and milk. All items are near expiry but stored in optimal conditions. Perfect for immediate retail or food service use.',
    images: [
        'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1200&auto=format&fit=crop',
    ],
    seller: {
        name: 'Metro Foods Distribution',
        rating: 4.8,
        location: 'New York, NY',
    },
    details: {
        quantity: '48 Units',
        weight: '120 kg',
        packaging: 'Pallet',
        storage: 'Chilled (0-4°C)',
    },
    expiryDate: '2025-12-01',
    condition: 'Near Expiry' as const,
    currentBid: 120,
    minBidIncrement: 10,
    buyNowPrice: 450,
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
    bids: [
        { bidder: 'User***45', amount: 120, time: '10 mins ago' },
        { bidder: 'User***89', amount: 110, time: '25 mins ago' },
        { bidder: 'User***12', amount: 100, time: '1 hour ago' },
    ]
};

export default function LotDetailsPage({ params }: { params: { id: string } }) {
    // In a real app, we would fetch data based on params.id
    const lot = MOCK_LOT_DETAIL;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Link href="/buyer" className={styles.backLink}>
                    <ArrowLeft size={16} /> Back to Search
                </Link>

                <div className={styles.grid}>
                    {/* Left Column: Images & Info */}
                    <div className={styles.mainContent}>
                        <div className={styles.imageGallery}>
                            <div className={styles.mainImageWrapper}>
                                <Image
                                    src={lot.images[0]}
                                    alt={lot.title}
                                    fill
                                    className={styles.mainImage}
                                    style={{ objectFit: 'cover' }}
                                />
                                <div className={styles.lotIdBadge}>Lot #{lot.id}</div>
                            </div>
                        </div>

                        <div className={styles.infoSection}>
                            <div className={styles.header}>
                                <h1 className={styles.title}>{lot.title}</h1>
                                <div className={styles.badges}>
                                    <Badge variant="warning">{lot.condition}</Badge>
                                    <Badge variant="info">{lot.details.storage}</Badge>
                                </div>
                            </div>

                            <div className={styles.metaGrid}>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Seller</span>
                                    <span className={styles.metaValue}>
                                        <Link href="/profile/seller/1" className={styles.sellerLink} style={{ textDecoration: 'underline', color: 'inherit' }}>
                                            {lot.seller.name}
                                        </Link>
                                    </span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Location</span>
                                    <span className={styles.metaValue}>
                                        <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />
                                        {lot.seller.location}
                                    </span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Expiry</span>
                                    <span className={styles.metaValue}>
                                        <Clock size={14} style={{ display: 'inline', marginRight: 4 }} />
                                        {lot.expiryDate}
                                    </span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Quantity</span>
                                    <span className={styles.metaValue}>
                                        <Package size={14} style={{ display: 'inline', marginRight: 4 }} />
                                        {lot.details.quantity}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.description}>
                                <h3>Description</h3>
                                <p>{lot.description}</p>
                            </div>

                            <div className={styles.logistics}>
                                <h3><Truck size={18} style={{ marginRight: 8 }} /> Logistics & Pickup</h3>
                                <p>Buyer is responsible for pickup. Loading dock available. Pickup hours: Mon-Fri 8am-4pm.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bidding & Actions */}
                    <div className={styles.sidebar}>
                        <div className={styles.timerCard}>
                            <span className={styles.timerLabel}>Auction Ends In:</span>
                            <Countdown targetDate={lot.endTime} className={styles.timerValue} />
                        </div>

                        <BiddingWidget
                            currentBid={lot.currentBid}
                            minBidIncrement={lot.minBidIncrement}
                            endTime={lot.endTime}
                        />

                        <div className={styles.bidHistory}>
                            <h3>Bid History ({lot.bids.length})</h3>
                            <ul className={styles.bidList}>
                                {lot.bids.map((bid, index) => (
                                    <li key={index} className={styles.bidItem}>
                                        <span className={styles.bidder}>{bid.bidder}</span>
                                        <span className={styles.bidAmount}>${bid.amount}</span>
                                        <span className={styles.bidTime}>{bid.time}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
