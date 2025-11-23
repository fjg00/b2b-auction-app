import Link from 'next/link';
import { ShieldCheck, Clock, AlertCircle, Package } from 'lucide-react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { KPIStrip } from '@/components/profile/KPIStrip';
import { ReviewSection } from '@/components/profile/ReviewSection';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import styles from './buyer-profile.module.css';

// Mock Data
const BUYER_DATA = {
    name: "Metro City Market",
    type: "Retail Grocery",
    location: "Brooklyn, NY",
    joinedDate: "January 2024",
    isVerified: true,
    kpis: [
        { label: "Lots Won", value: "42" },
        { label: "Payment Rate", value: "100%", subtext: "Always on time" },
        { label: "Pickup Rate", value: "98%", subtext: "Within 24h" },
        { label: "Disputes", value: "Low", subtext: "0 in last 6 months" }
    ],
    history: [
        { id: '1', lotTitle: 'Mixed Dairy Products', seller: 'Fresh Foods Distributors', date: 'Oct 24, 2025', price: '$450', status: 'Completed' },
        { id: '2', lotTitle: 'Organic Pasta Sauce', seller: 'Italian Imports Co.', date: 'Oct 15, 2025', price: '$320', status: 'Completed' },
        { id: '3', lotTitle: 'Canned Vegetables Pallet', seller: 'Global Foods', date: 'Sep 30, 2025', price: '$850', status: 'Completed' },
        { id: '4', lotTitle: 'Energy Drinks - 50 Cases', seller: 'BevDistro', date: 'Sep 12, 2025', price: '$600', status: 'Completed' }
    ],
    reviews: [
        { id: '1', author: "Fresh Foods Distributors", rating: 5, date: "1 month ago", comment: "Excellent buyer. Paid immediately and picked up on time.", tags: ["On-time payment", "Fast pickup"] },
        { id: '2', author: "Italian Imports Co.", rating: 5, date: "1 month ago", comment: "Smooth transaction, no issues.", tags: ["Easy communication"] }
    ]
};

export default function BuyerProfilePage() {
    return (
        <div className={styles.container}>
            <ProfileHeader
                name={BUYER_DATA.name}
                type={BUYER_DATA.type}
                location={BUYER_DATA.location}
                joinedDate={BUYER_DATA.joinedDate}
                isVerified={BUYER_DATA.isVerified}
            />

            <div className={styles.grid}>
                <div className={styles.mainContent}>
                    <KPIStrip items={BUYER_DATA.kpis} />

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Purchase History</h2>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Lot</th>
                                        <th>Seller</th>
                                        <th>Date</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {BUYER_DATA.history.map(item => (
                                        <tr key={item.id}>
                                            <td className={styles.lotTitle}>{item.lotTitle}</td>
                                            <td>{item.seller}</td>
                                            <td className={styles.date}>{item.date}</td>
                                            <td className={styles.price}>{item.price}</td>
                                            <td><Badge variant="success" size="sm">{item.status}</Badge></td>
                                            <td>
                                                <Link href={`/lot/${item.id}/review`}>
                                                    <Button variant="ghost" size="sm">Leave Review</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <ReviewSection
                        rating={5.0}
                        count={18}
                        reviews={BUYER_DATA.reviews}
                    />
                </div>

                <aside className={styles.sidebar}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Reliability Status</h3>
                        <div className={styles.statusList}>
                            <div className={styles.statusItem}>
                                <ShieldCheck size={20} className={styles.iconSuccess} />
                                <div>
                                    <div className={styles.statusLabel}>Verified Business</div>
                                    <div className={styles.statusSub}>Identity confirmed</div>
                                </div>
                            </div>
                            <div className={styles.statusItem}>
                                <Clock size={20} className={styles.iconSuccess} />
                                <div>
                                    <div className={styles.statusLabel}>Fast Payer</div>
                                    <div className={styles.statusSub}>Avg. payment &lt; 2 hours</div>
                                </div>
                            </div>
                            <div className={styles.statusItem}>
                                <Package size={20} className={styles.iconSuccess} />
                                <div>
                                    <div className={styles.statusLabel}>Reliable Pickup</div>
                                    <div className={styles.statusSub}>98% on-time rate</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Business Documents</h3>
                        <ul className={styles.docList} style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={16} className={styles.iconSuccess} />
                                <span>Resale Certificate</span>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Contact Information</h3>
                        <div className={styles.contactInfo}>
                            <p style={{ marginBottom: '8px' }}><strong>Phone:</strong> (555) 987-6543</p>
                            <p style={{ marginBottom: '8px' }}><strong>Email:</strong> purchasing@metrocitymarket.com</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
