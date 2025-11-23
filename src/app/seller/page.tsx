import React from 'react';
import Link from 'next/link';
import { Plus, Package, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { KPITile } from '@/components/dashboard/KPITile';
import { Badge } from '@/components/ui/Badge';
import styles from './seller.module.css';

export default function SellerDashboard() {
    return (
        <div className={styles.dashboard}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Seller Dashboard</h1>
                    <Link href="/seller/create">
                        <Button>
                            <Plus size={18} style={{ marginRight: 8 }} /> Create New Lot
                        </Button>
                    </Link>
                </div>

                {/* KPIs */}
                <div className={styles.kpiGrid}>
                    <KPITile
                        title="Active Auctions"
                        value="12"
                        icon={<Package size={20} />}
                    />
                    <KPITile
                        title="Total Revenue (Month)"
                        value="$45,250"
                        trend="12% vs last month"
                        icon={<DollarSign size={20} />}
                    />
                    <KPITile
                        title="Recovery Rate"
                        value="68%"
                        trend="5% improvement"
                        icon={<TrendingUp size={20} />}
                    />
                    <KPITile
                        title="Ending Today"
                        value="3"
                        icon={<AlertCircle size={20} />}
                    />
                </div>

                {/* Active Lots Table */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Active Listings</h2>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Lot ID</th>
                                    <th>Product</th>
                                    <th>Current Bid</th>
                                    <th>Bids</th>
                                    <th>Time Left</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>#13452</td>
                                    <td>
                                        <div className={styles.productCell}>
                                            <span className={styles.productName}>Mixed Dairy Products</span>
                                            <span className={styles.productMeta}>48 Units • Near Expiry</span>
                                        </div>
                                    </td>
                                    <td className={styles.price}>$120</td>
                                    <td>5</td>
                                    <td className={styles.urgent}>02h 15m</td>
                                    <td><Badge variant="success" size="sm">Live</Badge></td>
                                    <td><Button variant="ghost" size="sm">Manage</Button></td>
                                </tr>
                                <tr>
                                    <td>#13456</td>
                                    <td>
                                        <div className={styles.productCell}>
                                            <span className={styles.productName}>Frozen Vegetables</span>
                                            <span className={styles.productMeta}>2 Pallets • Overstock</span>
                                        </div>
                                    </td>
                                    <td className={styles.price}>$850</td>
                                    <td>12</td>
                                    <td>1d 04h</td>
                                    <td><Badge variant="success" size="sm">Live</Badge></td>
                                    <td><Button variant="ghost" size="sm">Manage</Button></td>
                                </tr>
                                <tr>
                                    <td>#13458</td>
                                    <td>
                                        <div className={styles.productCell}>
                                            <span className={styles.productName}>Canned Tomatoes</span>
                                            <span className={styles.productMeta}>100 Cases • Damaged Box</span>
                                        </div>
                                    </td>
                                    <td className={styles.price}>$320</td>
                                    <td>8</td>
                                    <td>3d 12h</td>
                                    <td><Badge variant="success" size="sm">Live</Badge></td>
                                    <td><Button variant="ghost" size="sm">Manage</Button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
