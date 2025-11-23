import React from 'react';
import { MapPin, Truck, Package, ShieldCheck } from 'lucide-react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { KPIStrip } from '@/components/profile/KPIStrip';
import { TrustBadge, BadgeType } from '@/components/profile/TrustBadge';
import { ReviewSection } from '@/components/profile/ReviewSection';
import { LotCard } from '@/components/lots/LotCard';
import styles from './seller-profile.module.css';

// Mock Data
const SELLER_DATA = {
    name: "Fresh Foods Distributors",
    type: "Wholesale Distributor",
    location: "Bronx, NY",
    joinedDate: "March 2023",
    isVerified: true,
    kpis: [
        { label: "Total Listings", value: "1,240" },
        { label: "Sell-Through Rate", value: "94%", subtext: "Top 5% of sellers" },
        { label: "Avg. Discount", value: "65%", subtext: "vs Retail Price" },
        { label: "Time to Sell", value: "2 Days", subtext: "Avg. duration" }
    ],
    badges: ['top-rated', 'fast-loader', 'eco-saver'] as BadgeType[],
    pickupLocations: [
        { address: "123 Warehouse Dr, Bronx, NY 10474", notes: "Loading dock available, Forklift on site" },
        { address: "456 Distribution Way, Newark, NJ 07114", notes: "Ramp access only" }
    ],
    reviews: [
        { id: '1', author: "City Market", rating: 5, date: "2 days ago", comment: "Great quality produce, exactly as described.", tags: ["Accurate description", "Fresh"] },
        { id: '2', author: "Corner Bodega", rating: 4, date: "1 week ago", comment: "Pickup was easy, but one box was slightly damaged.", tags: ["Easy pickup"] }
    ],
    activeLots: [
        {
            id: '13452',
            title: 'Mixed Dairy Products - 48 Units',
            image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop',
            location: 'Bronx, NY',
            expiryDate: '2025-12-01',
            condition: 'Near Expiry' as const,
            currentBid: 120,
            buyNowPrice: 450,
            endTime: new Date(Date.now() + 1000 * 60 * 60 * 2),
            bidsCount: 5,
            watchCount: 12,
        },
        {
            id: '13455',
            title: 'Gluten Free Snacks - 100 Boxes',
            image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=800&auto=format&fit=crop',
            location: 'Bronx, NY',
            expiryDate: '2026-03-10',
            condition: 'Overstock' as const,
            currentBid: 500,
            endTime: new Date(Date.now() + 1000 * 60 * 60 * 5),
            bidsCount: 15,
            watchCount: 45,
        }
    ]
};

export default function SellerProfilePage() {
    return (
        <div className={styles.container}>
            <ProfileHeader
                name={SELLER_DATA.name}
                type={SELLER_DATA.type}
                location={SELLER_DATA.location}
                joinedDate={SELLER_DATA.joinedDate}
                isVerified={SELLER_DATA.isVerified}
            />

            <div className={styles.grid}>
                <div className={styles.mainContent}>
                    <KPIStrip items={SELLER_DATA.kpis} />

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Active Auctions</h2>
                        <div className={styles.lotsGrid}>
                            {SELLER_DATA.activeLots.map(lot => (
                                <LotCard key={lot.id} {...lot} />
                            ))}
                        </div>
                    </section>

                    <ReviewSection
                        rating={4.8}
                        count={124}
                        reviews={SELLER_DATA.reviews}
                    />
                </div>

                <aside className={styles.sidebar}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Trust Badges</h3>
                        <div className={styles.badgesGrid}>
                            {SELLER_DATA.badges.map(badge => (
                                <TrustBadge key={badge} type={badge} />
                            ))}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Business Documents</h3>
                        <ul className={styles.docList} style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={16} className={styles.icon} />
                                <span>Business License</span>
                            </li>
                            <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={16} className={styles.icon} />
                                <span>Tax ID Verified</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={16} className={styles.icon} />
                                <span>Liability Insurance</span>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Contact Information</h3>
                        <div className={styles.contactInfo}>
                            <p style={{ marginBottom: '8px' }}><strong>Phone:</strong> (555) 123-4567</p>
                            <p style={{ marginBottom: '8px' }}><strong>Email:</strong> contact@freshfoods.com</p>
                            <p><strong>Website:</strong> www.freshfoods.com</p>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Pickup Locations</h3>
                        <div className={styles.locationList}>
                            {SELLER_DATA.pickupLocations.map((loc, i) => (
                                <div key={i} className={styles.locationItem}>
                                    <div className={styles.locationHeader}>
                                        <MapPin size={16} className={styles.icon} />
                                        <span className={styles.address}>{loc.address}</span>
                                    </div>
                                    <p className={styles.notes}>{loc.notes}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
