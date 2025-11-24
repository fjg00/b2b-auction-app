// File: src/app/api/dev/test-lots/route.ts

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/serverClient';
import { LotWithSellerAndMaxBid } from '../../../../../shared/types/database';

export async function GET() {
    try {
        // Fetch lots with seller info
        const { data: lots, error } = await supabaseServer
            .from('lots')
            .select(`
        *,
        seller:users!seller_id (full_name)
      `);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!lots) {
            return NextResponse.json([]);
        }

        // Fetch max bids for each lot
        // Note: In a real app, we might use a view or a more complex query for this
        const lotsWithMaxBid: LotWithSellerAndMaxBid[] = await Promise.all(lots.map(async (lot: any) => {
            const { data: maxBidData } = await supabaseServer
                .from('bids')
                .select('amount')
                .eq('lot_id', lot.id)
                .order('amount', { ascending: false })
                .limit(1)
                .single();

            return {
                ...lot,
                seller_name: lot.seller?.full_name || 'Unknown',
                max_bid: maxBidData?.amount || null
            };
        }));

        return NextResponse.json(lotsWithMaxBid);

    } catch (err: any) {
        console.error('Server error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
