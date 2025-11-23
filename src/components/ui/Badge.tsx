import React from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    className
}) => {
    return (
        <span className={clsx(styles.badge, styles[variant], styles[size], className)}>
            {children}
        </span>
    );
};
