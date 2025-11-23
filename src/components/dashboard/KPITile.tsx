import React from 'react';
import styles from './KPITile.module.css';

interface KPITileProps {
    title: string;
    value: string | number;
    trend?: string;
    trendDirection?: 'up' | 'down';
    icon: React.ReactNode;
}

export const KPITile: React.FC<KPITileProps> = ({
    title,
    value,
    trend,
    trendDirection = 'up',
    icon
}) => {
    return (
        <div className={styles.tile}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                <div className={styles.iconWrapper}>
                    {icon}
                </div>
            </div>
            <div className={styles.content}>
                <span className={styles.value}>{value}</span>
                {trend && (
                    <span className={`${styles.trend} ${styles[trendDirection]}`}>
                        {trendDirection === 'up' ? '↑' : '↓'} {trend}
                    </span>
                )}
            </div>
        </div>
    );
};
