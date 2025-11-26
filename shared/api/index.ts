import { Lot, Bid, SellerProfile } from '../types';
import { supabase } from '../../mobile-app/src/lib/supabase';

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
    try {
        // Fetch user profile
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (userError || !user) {
            console.error('Error fetching seller profile:', userError);
            return undefined;
        }

        // Fetch active lots for this seller
        const { data: lots, error: lotsError } = await supabase
            .from('lots')
            .select('*, seller:users!seller_id(full_name, city), warehouse:addresses!warehouse_id(city)')
            .eq('seller_id', id)
            .eq('status', 'ACTIVE')
            .order('created_at', { ascending: false });

        if (lotsError) {
            console.error('Error fetching seller lots:', lotsError);
        }

        // Map lots to UI format (reusing logic from fetchAuctionsFromSupabase would be better, but inline for now)
        const activeLots = lots?.map((lot: any) => ({
            id: lot.id,
            title: lot.title,
            image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1200&auto=format&fit=crop'],
            location: lot.warehouse?.city || lot.seller?.city || 'Beirut, Lebanon',
            expiryDate: new Date(new Date(lot.end_time).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            condition: 'Overstock' as any, // TODO: Map actual condition from DB
            currentBid: lot.start_price, // Simplified for profile view
            minBidIncrement: lot.min_bid_increment,
            buyNowPrice: lot.buy_now_price,
            endTime: new Date(lot.end_time),
            status: lot.status.toLowerCase(),
            bidsCount: 0,
            watchCount: 0,
            description: lot.description,
            seller: {
                name: user.full_name || 'Unknown Seller',
                rating: 5.0,
                location: user.city || 'Beirut, Lebanon',
            },
            seller_id: lot.seller_id,
            details: {
                quantity: '1 Unit',
                weight: 'N/A',
                packaging: 'Box',
                storage: 'Ambient',
                deliveryMethod: lot.delivery_method,
            },
            bids: []
        })) || [];

        // Fetch seller addresses for pickup locations
        const { data: addresses } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', id)
            .in('type', ['pickup', 'both']);

        const pickupLocations = addresses?.map((addr: any) => ({
            address: `${addr.street}, ${addr.city}`,
            notes: addr.pickup_windows || addr.notes || ''
        })) || [];

        return {
            name: user.full_name || 'Unknown Seller',
            rating: 5.0, // Placeholder until we have ratings table
            location: user.city || 'Beirut, Lebanon',
            type: user.business_type || "Seller",
            joinedDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            isVerified: user.is_verified || false,
            kpis: [
                { label: "Total Listings", value: String(activeLots.length) },
                { label: "Sell-Through Rate", value: "N/A", subtext: "New Seller" },
                { label: "Avg. Discount", value: "N/A", subtext: "vs Retail Price" },
                { label: "Time to Sell", value: "N/A", subtext: "Avg. duration" }
            ],
            activeLots: activeLots,
            reviews: [], // Placeholder until reviews table exists
            pickupLocations: pickupLocations
        };
    } catch (error) {
        console.error('Unexpected error fetching seller profile:', error);
        return undefined;
    }
};

export const createLot = async (lotData: any): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, message: 'Lot created successfully! (Prototype)' };
};
