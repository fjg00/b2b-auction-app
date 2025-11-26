// File: mobile-app/src/services/auctionService.ts

import { supabase } from '../lib/supabase';
import { Lot } from '@shared/types';

export const fetchAuctionsFromSupabase = async (): Promise<Lot[]> => {
    try {
        const { data: lots, error } = await supabase
            .from('lots')
            .select('*, seller:users!seller_id(full_name, city), warehouse:addresses!warehouse_id(city)')
            .eq('status', 'ACTIVE')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching lots from Supabase:', error);
            throw error;
        }

        if (!lots) return [];

        // Fetch all bids to calculate current bid for each lot
        const { data: allBids } = await supabase
            .from('bids')
            .select('lot_id, amount');

        // Create a map of lot_id -> max bid
        const maxBidsMap = new Map<string, number>();
        allBids?.forEach((bid: any) => {
            const currentMax = maxBidsMap.get(bid.lot_id) || 0;
            maxBidsMap.set(bid.lot_id, Math.max(currentMax, bid.amount));
        });

        // Map database snake_case to UI camelCase
        return lots.map((lot: any) => ({
            id: lot.id,
            title: lot.title,
            image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1200&auto=format&fit=crop'],
            location: lot.warehouse?.city || lot.seller?.city || 'Beirut, Lebanon',
            expiryDate: new Date(new Date(lot.end_time).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            condition: 'Overstock',
            currentBid: maxBidsMap.get(lot.id) || lot.start_price,
            minBidIncrement: lot.min_bid_increment,
            buyNowPrice: lot.buy_now_price,
            endTime: new Date(lot.end_time),
            status: lot.status.toLowerCase(),
            bidsCount: 0,
            watchCount: 0,
            description: lot.description,
            seller: {
                name: lot.seller?.full_name || 'Unknown Seller',
                rating: 5.0,
                location: lot.seller?.city || 'Beirut, Lebanon',
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

        // Group bids by lot_id to find max bid for each lot
        const lotBidsMap = new Map<string, number>();
        bids.forEach((bid: any) => {
            const lotId = bid.lot?.id;
            if (lotId) {
                const currentMax = lotBidsMap.get(lotId) || 0;
                lotBidsMap.set(lotId, Math.max(currentMax, bid.amount));
            }
        });

        // Map the joined data to our Lot interface
        const lots = bids.map((bid: any) => {
            const lot = bid.lot;
            if (!lot) return null;

            // Get the max bid for this lot
            const maxBid = lotBidsMap.get(lot.id) || lot.start_price;

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
                bidsCount: 0,
                watchCount: 0,
                description: lot.description,
                seller: { name: 'Unknown', rating: 5, location: 'Beirut' },
                seller_id: lot.seller_id,
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
            seller_id: lot.seller_id,
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
            .select('*, seller:users!seller_id(full_name, city), warehouse:addresses!warehouse_id(city)')
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
            location: lot.warehouse?.city || lot.seller?.city || 'Beirut, Lebanon',
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
            seller: {
                name: lot.seller?.full_name || 'Unknown Seller',
                rating: 5.0,
                location: lot.seller?.city || 'Beirut, Lebanon',
            },
            seller_id: lot.seller_id,
            details: {
                quantity: '1 Unit',
                weight: 'N/A',
                packaging: 'Box',
                storage: 'Ambient',
                deliveryMethod: lot.delivery_method,
            },
            bids: formattedBids
        };
    } catch (error) {
        console.error('Error fetching lot details:', error);
        return undefined;
    }
};

export const placeBid = async (lotId: string, amount: number, userId: string): Promise<{ success: boolean; message: string }> => {
    try {
        // 1. Check if user is trying to bid on their own lot
        const { data: lot, error: lotError } = await supabase
            .from('lots')
            .select('seller_id, start_price, min_bid_increment')
            .eq('id', lotId)
            .single();

        if (lotError || !lot) {
            return { success: false, message: 'Lot not found' };
        }

        // Prevent sellers from bidding on their own lots
        if (lot.seller_id === userId) {
            return { success: false, message: 'You cannot bid on your own lot' };
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

export const createLot = async (formData: any, userId: string): Promise<{ success: boolean; message: string }> => {
    try {
        const { error } = await supabase
            .from('lots')
            .insert([
                {
                    seller_id: userId,
                    title: formData.title,
                    description: formData.description || '',
                    start_price: parseFloat(formData.startBid),
                    min_bid_increment: 10, // Default
                    buy_now_price: formData.buyNow ? parseFloat(formData.buyNow) : null,
                    status: 'ACTIVE',
                    start_time: new Date().toISOString(),
                    end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
                    warehouse_id: formData.warehouseId,
                    delivery_method: formData.deliveryMethod,
                }
            ]);

        if (error) {
            console.error('Error creating lot:', error);
            return { success: false, message: 'Failed to create lot. Please try again.' };
        }

        return { success: true, message: 'Lot created successfully!' };
    } catch (error) {
        console.error('Unexpected error creating lot:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
};
