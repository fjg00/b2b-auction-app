import React from 'react';
import { ShieldCheck, Zap, ThumbsUp, Leaf } from 'lucide-react';
import styles from './TrustBadge.module.css';

export type BadgeType = 'top-rated' | 'fast-loader' | 'low-dispute' | 'eco-saver';

interface TrustBadgeProps {
    type: BadgeType;
}

const BADGE_CONFIG = {
    'top-rated': {
        icon: ThumbsUp,
        label: 'Top Rated',
        color: '#f59e0b', // Amber
        bg: '#fef3c7'
    },
    'fast-loader': {
        icon: Zap,
        label: 'Fast Loader',
        color: '#3b82f6', // Blue
        bg: '#dbeafe'
    },
    'low-dispute': {
        icon: ShieldCheck,
        label: 'Reliable',
        color: '#10b981', // Emerald
        bg: '#d1fae5'
    },
    'eco-saver': {
        icon: Leaf,
        label: 'Eco Saver',
        color: '#16a34a', // Green
        bg: '#dcfce7'
    }
};

export const TrustBadge: React.FC<TrustBadgeProps> = ({ type }) => {
    const config = BADGE_CONFIG[type];
    const Icon = config.icon;

    return (
        <div
            className={styles.badge}
            style={{
                backgroundColor: config.bg,
                color: config.color,
                borderColor: config.color
            }}
        >
            <Icon size={16} />
            <span className={styles.label}>{config.label}</span>
        </div>
    );
};
