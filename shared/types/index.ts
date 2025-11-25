export type AuctionStatus = 'LIVE' | 'UPCOMING' | 'ENDED' | 'won';

export type Condition =
    | 'Near Expiry'
    | 'Overstock'
    | 'Returned'
    | 'Damaged Packaging'
    | 'Short-Dated';

export interface Bid {
    bidder: string;
    amount: number;
    time: string; // relative time string for now, e.g. "10 mins ago"
}

export interface Seller {
    name: string;
    rating: number;
    location: string;
}

export interface LotDetails {
    quantity: string;
    weight: string;
    packaging: string;
    storage: string;
}

export interface Lot {
    id: string;
    title: string;
    image: string; // Main image URL
    images?: string[]; // Array of image URLs for details
    location: string;
    expiryDate: string;
    condition: Condition;
    currentBid: number;
    minBidIncrement?: number;
    buyNowPrice?: number;
    endTime: Date;
    bidsCount?: number;
    watchCount?: number;
    description?: string;
    seller?: Seller;
    seller_id?: string; // ID of the seller user
    details?: LotDetails;
    bids?: Bid[];
    status?: AuctionStatus; // Derived or explicit
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
}

export interface KPI {
    label: string;
    value: string;
    subtext?: string;
}

export interface SellerProfile extends Seller {
    type: string;
    joinedDate: string;
    isVerified: boolean;
    kpis: KPI[];
    activeLots: Lot[];
    reviews: Review[];
    pickupLocations: { address: string; notes: string }[];
}
