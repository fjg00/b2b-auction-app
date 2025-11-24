// File: shared/types/database.ts

export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';
export type LotStatus = 'DRAFT' | 'ACTIVE' | 'ENDED' | 'CANCELLED';

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    phone: string | null;
    created_at: string;
    updated_at: string;
}

export interface Lot {
    id: string;
    seller_id: string;
    title: string;
    description: string;
    start_price: number;
    buy_now_price: number | null;
    min_bid_increment: number;
    status: LotStatus;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
}

export interface Bid {
    id: string;
    lot_id: string;
    bidder_id: string;
    amount: number;
    created_at: string;
}

export interface LotWithSellerAndMaxBid extends Lot {
    seller_name: string;
    max_bid: number | null;
}
