'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, User, Menu, Heart } from 'lucide-react';
import styles from './Header.module.css';
import { Button } from '../ui/Button';

export const Header = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoIcon}>📦</span>
                        <span className={styles.logoText}>ExpiryX</span>
                    </Link>
                </div>

                <div className={styles.center}>
                    <div className={styles.searchBar}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search lots, products, brands..."
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.right}>
                    <nav className={styles.nav}>
                        <Link href="/buyer" className={styles.navLink}>Buy</Link>
                        <Link href="/seller" className={styles.navLink}>Sell</Link>
                    </nav>

                    <div className={styles.actions}>
                        <Link href="/buyer/my-bids?tab=watchlist">
                            <button className={styles.iconButton} title="Watchlist">
                                <Heart size={20} />
                            </button>
                        </Link>
                        <div style={{ position: 'relative' }}>
                            <button
                                className={styles.iconButton}
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell size={20} />
                                {showNotifications && <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, backgroundColor: 'red', borderRadius: '50%' }} />}
                            </button>
                            {showNotifications && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '0.5rem',
                                    width: '20rem',
                                    backgroundColor: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    zIndex: 50,
                                    padding: '1rem'
                                }}>
                                    <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Notifications</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No new notifications</p>
                                </div>
                            )}
                        </div>
                        <Button variant="outline" size="sm" className={styles.loginBtn}>
                            <User size={16} style={{ marginRight: 8 }} />
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};
