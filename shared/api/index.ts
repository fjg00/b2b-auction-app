import { Lot, Bid, SellerProfile } from '../types';

// Mock Data from web app
const MOCK_LOTS: Lot[] = [
    {
        id: '13452',
        title: 'Mixed Dairy Products - 48 Units',
        image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1200&auto=format&fit=crop'],
        location: 'New York, NY',
        expiryDate: '2025-12-01',
        condition: 'Near Expiry',
        currentBid: 120,
        minBidIncrement: 10,
        buyNowPrice: 450,
        endTime: new Date(Date.now() - 1000 * 60 * 60), // Ended 1 hour ago
        status: 'won',
        bidsCount: 5,
        watchCount: 12,
        description: 'A pallet of mixed dairy products including yogurt, cheese, and milk. All items are near expiry but stored in optimal conditions. Perfect for immediate retail or food service use.',
        seller: {
            name: 'Metro Foods Distribution',
            rating: 4.8,
            location: 'New York, NY',
        },
        details: {
            quantity: '48 Units',
            weight: '120 kg',
            packaging: 'Pallet',
            storage: 'Chilled (0-4°C)',
        },
        bids: [
            { bidder: 'User***45', amount: 120, time: '10 mins ago' },
            { bidder: 'User***89', amount: 110, time: '25 mins ago' },
            { bidder: 'User***12', amount: 100, time: '1 hour ago' },
        ]
    },
    {
        id: '13453',
        title: 'Organic Pasta Sauce - 20 Cases',
        image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=800&auto=format&fit=crop',
        location: 'Chicago, IL',
        expiryDate: '2026-01-15',
        condition: 'Overstock',
        currentBid: 350,
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
        bidsCount: 2,
        watchCount: 8,
    },
    {
        id: '13454',
        title: 'Assorted Beverages - Pallet',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
        location: 'Los Angeles, CA',
        expiryDate: '2025-11-30',
        condition: 'Returned',
        currentBid: 80,
        buyNowPrice: 200,
        endTime: new Date(Date.now() + 1000 * 60 * 45), // 45 mins from now
        bidsCount: 8,
        watchCount: 20,
    },
    {
        id: '13455',
        title: 'Gluten Free Snacks - 100 Boxes',
        image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=800&auto=format&fit=crop',
        location: 'Miami, FL',
        expiryDate: '2026-03-10',
        condition: 'Overstock',
        currentBid: 500,
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 5), // 5 hours from now
        bidsCount: 15,
        watchCount: 45,
    },
    {
        id: '13456',
        title: 'Mixed Beverages (48 units)',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
        location: 'New York, NY',
        expiryDate: '2025-12-15',
        condition: 'Near Expiry',
        currentBid: 1250,
        status: 'won',
        endTime: new Date(Date.now() - 1000 * 60 * 60), // Ended 1 hour ago
        bidsCount: 12,
        watchCount: 8,
    },
];

export const fetchAuctions = async (): Promise<Lot[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_LOTS;
};

export const fetchAuctionDetails = async (id: string): Promise<Lot | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_LOTS.find(lot => lot.id === id);
};

export const placeBid = async (lotId: string, amount: number): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const lot = MOCK_LOTS.find(l => l.id === lotId);
    if (!lot) return { success: false, message: 'Lot not found' };

    if (amount <= lot.currentBid) {
        return { success: false, message: 'Bid must be higher than current bid' };
    }

    // In a real app, we'd update the backend. Here we just simulate success.
    // We can't easily mutate the const export in a way that persists across reloads,
    // but for a single session it might work if we weren't using Next.js server components on web.
    // For mobile (client-side), this mutation might persist in memory.
    lot.currentBid = amount;
    lot.bidsCount = (lot.bidsCount || 0) + 1;
    lot.bids = [
        { bidder: 'You', amount, time: 'Just now' },
        ...(lot.bids || [])
    ];

    return { success: true, message: 'Bid placed successfully!' };
};

export const fetchSellerProfile = async (id: string): Promise<SellerProfile | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        name: "Fresh Foods Distributors",
        rating: 4.8,
        location: "Bronx, NY",
        type: "Wholesale Distributor",
        joinedDate: "March 2023",
        isVerified: true,
        kpis: [
            { label: "Total Listings", value: "1,240" },
            { label: "Sell-Through Rate", value: "94%", subtext: "Top 5% of sellers" },
            { label: "Avg. Discount", value: "65%", subtext: "vs Retail Price" },
            { label: "Time to Sell", value: "2 Days", subtext: "Avg. duration" }
        ],
        activeLots: MOCK_LOTS.slice(0, 2),
        reviews: [
            { id: '1', author: "City Market", rating: 5, date: "2 days ago", comment: "Great quality produce, exactly as described." },
            { id: '2', author: "Corner Bodega", rating: 4, date: "1 week ago", comment: "Pickup was easy, but one box was slightly damaged." }
        ],
        pickupLocations: [
            { address: "123 Warehouse Dr, Bronx, NY 10474", notes: "Loading dock available" },
            { address: "456 Distribution Way, Newark, NJ 07114", notes: "Ramp access only" }
        ]
    };
};

export const createLot = async (lotData: any): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, message: 'Lot created successfully! (Prototype)' };
};
