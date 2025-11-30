// File: mobile-app/src/services/auctionService.ts

import { supabase } from '../lib/supabase';
import { Lot } from '@shared/types';

export const fetchAuctionsFromSupabase = async (userId?: string): Promise<Lot[]> => {
    try {
        let query = supabase
            .from('lots')
            .select('*, seller:users!seller_id(full_name, city), warehouse:addresses!warehouse_id(city)')
            .eq('status', 'ACTIVE')
            .gt('end_time', new Date().toISOString())
            .order('created_at', { ascending: false });

        if (userId) {
            query = query.neq('seller_id', userId);
        }

        const { data: lots, error } = await query;

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
        // 1. Fetch all bids for this user
        const { data: bids, error } = await supabase
            .from('bids')
            .select('*, lot:lots(*)')
            .eq('bidder_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        if (!bids) return [];

        // 2. Fetch user's transactions to identify purchased items
        const { data: transactions } = await supabase
            .from('transactions')
            .select('lot_id')
            .eq('buyer_id', userId);

        const purchasedLotIds = new Set(transactions?.map((t: any) => t.lot_id));

        // 3. Group bids by lot_id to find max bid for each lot
        const lotBidsMap = new Map<string, number>();
        bids.forEach((bid: any) => {
            const lotId = bid.lot?.id;
            if (lotId) {
                const currentMax = lotBidsMap.get(lotId) || 0;
                lotBidsMap.set(lotId, Math.max(currentMax, bid.amount));
            }
        });

        // 4. Map and Filter
        const now = new Date();
        const lots = bids.map((bid: any) => {
            const lot = bid.lot;

            // Filter out invalid lots
            if (!lot) return null;

            // Filter out purchased items (they belong in "Purchased Items" tab)
            if (purchasedLotIds.has(lot.id)) return null;

            // Filter out expired lots (auctions that ended)
            // Note: If the user WON it, it should have a transaction. 
            // If they didn't win, it's a "lost" auction and should disappear from "Active Bids".
            const endTime = new Date(lot.end_time);
            if (endTime < now) return null;

            // Get the max bid for this lot
            const maxBid = lotBidsMap.get(lot.id) || lot.start_price;

            return {
                id: lot.id,
                title: lot.title,
                image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1200&auto=format&fit=crop'],
                location: 'Beirut, Lebanon',
                expiryDate: new Date(endTime.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                condition: 'Overstock',
                currentBid: maxBid,
                minBidIncrement: lot.min_bid_increment,
                buyNowPrice: lot.buy_now_price,
                endTime: endTime,
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

        // Deduplicate lots by ID
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

        const lotIds = lots.map((l: any) => l.id);

        // Fetch bids for these lots
        const { data: allBids } = await supabase
            .from('bids')
            .select('lot_id, amount, bidder_id')
            .in('lot_id', lotIds);

        const bidsMap = new Map<string, { maxBid: number, count: number, highestBidderId?: string }>();
        allBids?.forEach((bid: any) => {
            const current = bidsMap.get(bid.lot_id) || { maxBid: 0, count: 0 };

            // Update max bid and highest bidder
            if (bid.amount > current.maxBid) {
                bidsMap.set(bid.lot_id, {
                    maxBid: bid.amount,
                    count: current.count + 1,
                    highestBidderId: bid.bidder_id
                });
            } else {
                bidsMap.set(bid.lot_id, {
                    ...current,
                    count: current.count + 1
                });
            }
        });

        // Fetch transactions to verify sold status and get transaction status
        const { data: transactions } = await supabase
            .from('transactions')
            .select('id, lot_id, status')
            .in('lot_id', lotIds);

        const transactionsMap = new Map<string, { id: string, status: string }>();
        transactions?.forEach((t: any) => {
            transactionsMap.set(t.lot_id, { id: t.id, status: t.status });
        });

        const now = new Date();

        return lots.map((lot: any) => {
            const bidInfo = bidsMap.get(lot.id) || { maxBid: 0, count: 0 };
            const transaction = transactionsMap.get(lot.id);

            // Determine if sold:
            // 1. Has a transaction OR
            // 2. Explicitly marked as won OR
            // 3. Expired AND has at least one bid
            const isExpired = new Date(lot.end_time) < now;
            const hasBids = bidInfo.count > 0;
            const isSold = !!transaction || lot.status === 'won' || lot.status === 'WON' || (isExpired && hasBids);

            return {
                id: lot.id,
                title: lot.title,
                image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop',
                images: ['https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1200&auto=format&fit=crop'],
                location: 'Beirut, Lebanon',
                expiryDate: new Date(new Date(lot.end_time).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                condition: 'Overstock',
                currentBid: bidInfo.maxBid || lot.start_price,
                minBidIncrement: lot.min_bid_increment,
                buyNowPrice: lot.buy_now_price,
                endTime: new Date(lot.end_time),
                status: isSold ? 'won' : lot.status.toLowerCase(),
                transactionStatus: transaction?.status as any,
                transactionId: transaction?.id,
                bidsCount: bidInfo.count,
                watchCount: 0,
                description: lot.description,
                seller: { name: 'Me', rating: 5, location: 'Beirut' },
                seller_id: lot.seller_id,
                details: { quantity: '1', weight: 'N/A', packaging: 'Box', storage: 'Ambient' },
                bids: [],
                highestBidderId: bidInfo.highestBidderId,
                created_at: lot.created_at
            };
        });
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

// --- Transaction Services ---

import { Transaction } from '@shared/types';

export const createTransaction = async (lotId: string, buyerId: string, amount: number): Promise<{ success: boolean; transactionId?: string; message: string }> => {
    try {
        // 1. Get seller ID from lot
        const { data: lot, error: lotError } = await supabase
            .from('lots')
            .select('seller_id')
            .eq('id', lotId)
            .single();

        if (lotError || !lot) {
            return { success: false, message: 'Lot not found' };
        }

        // 2. Create transaction
        const { data: transaction, error: txError } = await supabase
            .from('transactions')
            .insert([
                {
                    lot_id: lotId,
                    buyer_id: buyerId,
                    seller_id: lot.seller_id,
                    amount: amount,
                    status: 'pending_payment'
                }
            ])
            .select()
            .single();

        if (txError) {
            console.error('Error creating transaction:', txError);
            return { success: false, message: 'Failed to create transaction.' };
        }

        // 3. Mark lot as 'won' (or 'sold' if we want to distinguish)
        // For now, let's keep it simple and just create the transaction. 
        // Ideally we should also update lot status to prevent double buying.
        await supabase.from('lots').update({ status: 'won' }).eq('id', lotId);

        return { success: true, transactionId: transaction.id, message: 'Transaction created!' };
    } catch (error) {
        console.error('Unexpected error creating transaction:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
};

export const getTransaction = async (id: string): Promise<Transaction | undefined> => {
    try {
        const { data: tx, error } = await supabase
            .from('transactions')
            .select(`
                *,
                lot:lots(*),
                buyer:users!buyer_id(full_name, email),
                seller:users!seller_id(full_name, email)
            `)
            .eq('id', id)
            .single();

        if (error || !tx) {
            console.error('Error fetching transaction:', error);
            return undefined;
        }

        // Map to UI Transaction type
        return {
            id: tx.id,
            lotId: tx.lot_id,
            buyerId: tx.buyer_id,
            sellerId: tx.seller_id,
            amount: tx.amount,
            currency: tx.currency,
            status: tx.status,
            proofOfPaymentUrl: tx.proof_of_payment_url,
            createdAt: tx.created_at,
            updatedAt: tx.updated_at,
            lot: {
                id: tx.lot.id,
                title: tx.lot.title,
                image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop', // Placeholder
                location: 'Beirut', // Placeholder
                expiryDate: tx.lot.end_time,
                condition: 'Overstock', // Placeholder
                currentBid: tx.amount,
                endTime: new Date(tx.lot.end_time),
                status: 'won',
                seller_id: tx.seller_id
            },
            buyer: {
                name: tx.buyer?.full_name || 'Unknown Buyer',
                email: tx.buyer?.email || ''
            },
            seller: {
                name: tx.seller?.full_name || 'Unknown Seller',
                email: tx.seller?.email || ''
            }
        };
    } catch (error) {
        console.error('Unexpected error fetching transaction:', error);
        return undefined;
    }
};

export const updateTransactionStatus = async (id: string, status: string, proofUrl?: string): Promise<{ success: boolean; message: string }> => {
    try {
        const updates: any = { status };
        if (proofUrl) {
            updates.proof_of_payment_url = proofUrl;
        }

        const { error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating transaction:', error);
            return { success: false, message: 'Failed to update transaction.' };
        }

        return { success: true, message: 'Transaction updated successfully!' };
    } catch (error) {
        console.error('Unexpected error updating transaction:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
};

export const fetchMyTransactions = async (userId: string): Promise<Transaction[]> => {
    try {
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select(`
                *,
                lot:lots(*),
                buyer:users!buyer_id(full_name, email),
                seller:users!seller_id(full_name, email)
            `)
            .eq('buyer_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching my transactions:', error);
            return [];
        }

        if (!transactions) return [];

        // Deduplicate by lot_id, keeping the most recent one
        const uniqueTransactionsMap = new Map();
        transactions.forEach((tx: any) => {
            if (!uniqueTransactionsMap.has(tx.lot_id)) {
                uniqueTransactionsMap.set(tx.lot_id, tx);
            }
        });

        const uniqueTransactions = Array.from(uniqueTransactionsMap.values());

        return uniqueTransactions.map((tx: any) => ({
            id: tx.id,
            lotId: tx.lot_id,
            buyerId: tx.buyer_id,
            sellerId: tx.seller_id,
            amount: tx.amount,
            currency: tx.currency,
            status: tx.status,
            proofOfPaymentUrl: tx.proof_of_payment_url,
            createdAt: tx.created_at,
            updatedAt: tx.updated_at,
            lot: {
                id: tx.lot.id,
                title: tx.lot.title,
                image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=800&auto=format&fit=crop',
                location: 'Beirut',
                expiryDate: tx.lot.end_time,
                condition: 'Overstock',
                currentBid: tx.amount,
                endTime: new Date(tx.lot.end_time),
                status: 'won',
                seller_id: tx.seller_id
            },
            buyer: {
                name: tx.buyer?.full_name || 'Unknown Buyer',
                email: tx.buyer?.email || ''
            },
            seller: {
                name: tx.seller?.full_name || 'Unknown Seller',
                email: tx.seller?.email || ''
            }
        }));
    } catch (error) {
        console.error('Unexpected error fetching my transactions:', error);
        return [];
    }
};

export const getTransactionByLotId = async (lotId: string, userId: string): Promise<Transaction | undefined> => {
    try {
        const { data: tx, error } = await supabase
            .from('transactions')
            .select('id')
            .eq('lot_id', lotId)
            .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('Error checking transaction existence:', error);
            return undefined;
        }

        if (!tx) return undefined;

        // If found, fetch full details using existing function
        return getTransaction(tx.id);
    } catch (error) {
        console.error('Unexpected error checking transaction existence:', error);
        return undefined;
    }
};

export const relistLot = async (lotId: string) => {
    try {
        const now = new Date();
        const endTime = new Date();
        endTime.setDate(now.getDate() + 7); // Relist for 7 days

        const { data, error } = await supabase
            .from('lots')
            .update({
                status: 'active',
                start_time: now.toISOString(),
                end_time: endTime.toISOString(),
                created_at: now.toISOString() // Optional: reset created_at to show as new
            })
            .eq('id', lotId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error relisting lot:', error);
        throw error;
    }
};
