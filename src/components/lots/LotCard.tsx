import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Eye, Gavel } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Countdown } from '../ui/Countdown';
import { Button } from '../ui/Button';
import styles from './LotCard.module.css';

interface LotCardProps {
    id: string;
    title: string;
    image: string;
    location: string;
    expiryDate: string; // e.g., "2023-12-01"
    condition: 'Near Expiry' | 'Overstock' | 'Returned';
    currentBid: number;
    buyNowPrice?: number;
    endTime: Date;
    bidsCount: number;
    watchCount: number;
}

export const LotCard: React.FC<LotCardProps> = ({
    id,
    title,
    image,
    location,
    expiryDate,
    condition,
    currentBid,
    buyNowPrice,
    endTime,
    bidsCount,
    watchCount
}) => {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <Image
                    src={image}
                    alt={title}
                    fill
                    className={styles.image}
                    style={{ objectFit: 'cover' }}
                />
                <div className={styles.overlay}>
                    <Badge variant="info" size="sm" className={styles.lotId}>Lot #{id}</Badge>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <Link href={`/lot/${id}`} className={styles.title}>{title}</Link>
                    <div className={styles.badges}>
                        <Badge variant={condition === 'Near Expiry' ? 'warning' : 'success'} size="sm">
                            {condition}
                        </Badge>
                    </div>
                </div>

                <div className={styles.details}>
                    <div className={styles.detailItem}>
                        <MapPin size={14} className={styles.icon} />
                        <span>{location}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <Clock size={14} className={styles.icon} />
                        <span>Exp: {expiryDate}</span>
                    </div>
                </div>

                <div className={styles.priceSection}>
                    <div className={styles.bidInfo}>
                        <span className={styles.label}>Current Bid</span>
                        <span className={styles.price}>${currentBid.toLocaleString()}</span>
                    </div>
                    {buyNowPrice && (
                        <div className={styles.buyNowInfo}>
                            <span className={styles.label}>Buy Now</span>
                            <span className={styles.buyNowPrice}>${buyNowPrice.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <div className={styles.timer}>
                        <span className={styles.timerLabel}>Time Left:</span>
                        <Countdown targetDate={endTime} className={styles.countdown} />
                    </div>
                    <div className={styles.stats}>
                        <span className={styles.stat} title="Bids">
                            <Gavel size={14} /> {bidsCount}
                        </span>
                        <span className={styles.stat} title="Watchers">
                            <Eye size={14} /> {watchCount}
                        </span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Link href={`/lot/${id}`} style={{ width: '100%' }}>
                        <Button variant="primary" size="sm" fullWidth>Bid Now</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
