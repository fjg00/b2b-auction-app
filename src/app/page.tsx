import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Store, ArrowRight } from 'lucide-react';
import styles from './page.module.css';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            <span className={styles.brand}>ExpiryX</span> Marketplace
          </h1>
          <p className={styles.subtitle}>
            The B2B auction platform for near-expiry, overstock, and returned inventory.
            Turn excess stock into cash or find unbeatable deals.
          </p>
        </div>

        <div className={styles.cards}>
          {/* Buyer Card */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <ShoppingBag size={48} className={styles.icon} />
            </div>
            <h2 className={styles.cardTitle}>I am a Buyer</h2>
            <p className={styles.cardText}>
              Source inventory for your business at a fraction of the cost.
              Bid on pallets, boxes, and mixed lots.
            </p>
            <ul className={styles.features}>
              <li>✓ Access to top suppliers</li>
              <li>✓ Up to 80% off wholesale</li>
              <li>✓ Transparent bidding</li>
            </ul>
            <Link href="/buyer" style={{ width: '100%' }}>
              <Button fullWidth size="lg">Start Buying <ArrowRight size={18} style={{ marginLeft: 8 }} /></Button>
            </Link>
          </div>

          {/* Seller Card */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <Store size={48} className={styles.icon} />
            </div>
            <h2 className={styles.cardTitle}>I am a Seller</h2>
            <p className={styles.cardText}>
              Recover value from excess inventory quickly.
              List lots in minutes and reach thousands of buyers.
            </p>
            <ul className={styles.features}>
              <li>✓ Fast liquidity</li>
              <li>✓ Dynamic pricing</li>
              <li>✓ Verified buyers</li>
            </ul>
            <Link href="/seller" style={{ width: '100%' }}>
              <Button variant="secondary" fullWidth size="lg">Start Selling <ArrowRight size={18} style={{ marginLeft: 8 }} /></Button>
            </Link>
          </div>
        </div>

        <div className={styles.quickAccess}>
          <h3 className={styles.quickAccessTitle}>Quick Access (Demo)</h3>
          <div className={styles.quickAccessLinks}>
            <Link href="/profile/seller/1" className={styles.link}>View Seller Profile</Link>
            <Link href="/profile/buyer/1" className={styles.link}>View Buyer Profile</Link>
          </div>
        </div>

        <div className={styles.footer}>
          <p>Already have an account? <a href="#" className={styles.link}>Log in</a></p>
        </div>
      </div>
    </main>
  );
}
