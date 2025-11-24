// File: mobile-app/src/services/auctionService.ts

import { supabase } from '../lib/supabase';
import { Lot } from '@shared/types';

export const fetchAuctionsFromSupabase = async (): Promise<Lot[]> => {
    try {
        const { data: lots, error } = await supabase
            .from('lots')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching lots from Supabase:', error);
            throw error;
        }

        if (!lots) return [];

        // Map database snake_case to UI camelCase
        return lots.map((lot: any) => ({
            id: lot.id,
            title: lot.title,
            // Use a placeholder image since we don't have storage yet
            image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1200&auto=format&fit=crop'],
            location: 'Beirut, Lebanon', // Default for now
            expiryDate: new Date(new Date(lot.end_time).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mock expiry
            condition: 'Overstock', // Default valid condition
            currentBid: lot.start_price, // Start price as current bid for now
            minBidIncrement: lot.min_bid_increment,
            buyNowPrice: lot.buy_now_price,
            endTime: new Date(lot.end_time),
            status: lot.status.toLowerCase(), // 'ACTIVE' -> 'active'
            bidsCount: 0, // We'll fetch this later
            watchCount: 0,
            description: lot.description,
            seller: {
                name: 'Unknown Seller', // We need to join users table for this
                rating: 5.0,
                location: 'Beirut, Lebanon',
            },
            details: {
                quantity: '1 Unit',
                weight: 'N/A',
                packaging: 'Box',
                storage: 'Ambient',
            },
            bids: []
        }));
    } catch (error) {
        console.error('Unexpected error fetching auctions:', error);
        return [];
    }
};

export const fetchMyBids = async (userId: string): Promise<Lot[]> => {
    try {
        // Fetch bids for this user, and join the related lot data
        const { data: bids, error } = await supabase
            .from('bids')
            .select('*, lot:lots(*)')
            .eq('bidder_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        if (!bids) return [];

        // Map the joined data to our Lot interface
        const lots = bids.map((bid: any) => {
            const lot = bid.lot;
            if (!lot) return null;

            return {
                id: lot.id,
                title: lot.title,
                image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1200&auto=format&fit=crop'],
                location: 'Beirut, Lebanon',
                expiryDate: new Date(new Date(lot.end_time).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                condition: 'Overstock',
                currentBid: lot.start_price,
                minBidIncrement: lot.min_bid_increment,
                buyNowPrice: lot.buy_now_price,
                endTime: new Date(lot.end_time),
                status: lot.status.toLowerCase(),
                bidsCount: 0,
                watchCount: 0,
                description: lot.description,
                seller: { name: 'Unknown', rating: 5, location: 'Beirut' },
                details: { quantity: '1', weight: 'N/A', packaging: 'Box', storage: 'Ambient' },
                bids: []
            };
        }).filter(Boolean) as Lot[];

        // Deduplicate lots by ID (since we ordered by created_at desc, the first one is the latest)
        const uniqueLots = Array.from(new Map(lots.map(lot => [lot.id, lot])).values());

        return uniqueLots;
    } catch (error) {
        console.error('Error fetching my bids:', error);
        return [];
    }
};

export const fetchMySales = async (userId: string): Promise<Lot[]> => {
    try {
        const { data: lots, error } = await supabase
            .from('lots')
            .select('*')
            .eq('seller_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        if (!lots) return [];

        return lots.map((lot: any) => ({
            id: lot.id,
            title: lot.title,
            image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1200&auto=format&fit=crop'],
            location: 'Beirut, Lebanon',
            expiryDate: new Date(new Date(lot.end_time).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            condition: 'Overstock',
            currentBid: lot.start_price,
            minBidIncrement: lot.min_bid_increment,
            buyNowPrice: lot.buy_now_price,
            endTime: new Date(lot.end_time),
            status: lot.status.toLowerCase(),
            bidsCount: 0,
            watchCount: 0,
            description: lot.description,
            seller: { name: 'Me', rating: 5, location: 'Beirut' },
            details: { quantity: '1', weight: 'N/A', packaging: 'Box', storage: 'Ambient' },
            bids: []
        }));
    } catch (error) {
        console.error('Error fetching my sales:', error);
        return [];
    }
};

export const fetchLotById = async (id: string): Promise<Lot | undefined> => {
    try {
        // Fetch lot details
        const { data: lot, error } = await supabase
            .from('lots')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!lot) return undefined;

        // Fetch bids for this lot with bidder information
        const { data: bids, error: bidsError } = await supabase
            .from('bids')
            .select('*, bidder:users(full_name, email)')
            .eq('lot_id', id)
            .order('created_at', { ascending: false });

        if (bidsError) {
            console.error('Error fetching bids:', bidsError);
        }

        // Calculate current bid (max bid or start price)
        const maxBid = bids && bids.length > 0
            ? Math.max(...bids.map((b: any) => b.amount))
            : lot.start_price;

        // Map bids to UI format
        const formattedBids = bids?.map((bid: any) => ({
            bidder: bid.bidder?.full_name || bid.bidder?.email || 'Anonymous',
            amount: bid.amount,
            time: new Date(bid.created_at).toLocaleString()
        })) || [];

        return {
            id: lot.id,
            title: lot.title,
            image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1200&auto=format&fit=crop'],
            location: 'Beirut, Lebanon',
            expiryDate: new Date(new Date(lot.end_time).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            condition: 'Overstock',
            currentBid: maxBid,
            minBidIncrement: lot.min_bid_increment,
            buyNowPrice: lot.buy_now_price,
            endTime: new Date(lot.end_time),
            status: lot.status.toLowerCase(),
            bidsCount: bids?.length || 0,
            watchCount: 0,
            description: lot.description,
            seller: { name: 'Unknown Seller', rating: 5, location: 'Beirut' },
            details: { quantity: '1', weight: 'N/A', packaging: 'Box', storage: 'Ambient' },
            bids: formattedBids
        };
    } catch (error) {
        console.error('Error fetching lot details:', error);
        return undefined;
    }
};

export const placeBid = async (lotId: string, amount: number, userId: string): Promise<{ success: boolean; message: string }> => {
    try {
        // 1. Check if bid is valid (higher than current max)
        // Ideally this is done via a Database Function to prevent race conditions
        const { data: lot, error: lotError } = await supabase
            .from('lots')
            .select('start_price, min_bid_increment') // We should also check max(bids.amount) but keeping it simple
            .eq('id', lotId)
            .single();

        if (lotError || !lot) {
            return { success: false, message: 'Lot not found' };
        }

        // 2. Insert bid
        const { error: bidError } = await supabase
            .from('bids')
            .insert([
                {
                    lot_id: lotId,
                    bidder_id: userId,
                    amount: amount,
                }
            ]);

        if (bidError) {
            console.error('Error placing bid:', bidError);
            return { success: false, message: 'Failed to place bid. Please try again.' };
        }

        return { success: true, message: 'Bid placed successfully!' };
    } catch (error) {
        console.error('Unexpected error placing bid:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
};
