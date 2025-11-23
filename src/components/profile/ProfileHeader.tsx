import React from 'react';
import { MapPin, Calendar, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
    name: string;
    type: string;
    location: string;
    joinedDate: string;
    isVerified: boolean;
    logoUrl?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    name,
    type,
    location,
    joinedDate,
    isVerified,
    logoUrl
}) => {
    return (
        <div className={styles.header}>
            <div className={styles.logoContainer}>
                {logoUrl ? (
                    <img src={logoUrl} alt={name} className={styles.logo} />
                ) : (
                    <div className={styles.logoPlaceholder}>{name.charAt(0)}</div>
                )}
            </div>
            <div className={styles.info}>
                <div className={styles.nameRow}>
                    <h1 className={styles.name}>{name}</h1>
                    {isVerified && (
                        <Badge variant="success" size="sm" className={styles.verifiedBadge}>
                            <CheckCircle size={14} /> Verified
                        </Badge>
                    )}
                </div>
                <p className={styles.type}>{type}</p>
                <div className={styles.meta}>
                    <span className={styles.metaItem}>
                        <MapPin size={16} /> {location}
                    </span>
                    <span className={styles.metaItem}>
                        <Calendar size={16} /> Joined {joinedDate}
                    </span>
                </div>
            </div>
        </div>
    );
};
