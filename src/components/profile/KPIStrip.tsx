import React from 'react';
import styles from './KPIStrip.module.css';

interface KPIItem {
    label: string;
    value: string;
    subtext?: string;
}

interface KPIStripProps {
    items: KPIItem[];
}

export const KPIStrip: React.FC<KPIStripProps> = ({ items }) => {
    return (
        <div className={styles.strip}>
            {items.map((item, index) => (
                <div key={index} className={styles.item}>
                    <div className={styles.value}>{item.value}</div>
                    <div className={styles.label}>{item.label}</div>
                    {item.subtext && <div className={styles.subtext}>{item.subtext}</div>}
                </div>
            ))}
        </div>
    );
};
