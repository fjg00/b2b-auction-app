-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Function to process expired auctions
CREATE OR REPLACE FUNCTION process_expired_auctions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    lot_record RECORD;
    highest_bid RECORD;
BEGIN
    -- Loop through all active lots that have expired
    FOR lot_record IN
        SELECT * FROM lots
        WHERE status = 'ACTIVE'
        AND end_time < now()
    LOOP
        -- Find the highest bid for this lot
        SELECT * INTO highest_bid
        FROM bids
        WHERE lot_id = lot_record.id
        ORDER BY amount DESC
        LIMIT 1;

        -- If there is a winning bid
        IF highest_bid IS NOT NULL THEN
            -- 1. Create the transaction
            INSERT INTO transactions (
                lot_id,
                buyer_id,
                seller_id,
                amount,
                status
            )
            VALUES (
                lot_record.id,
                highest_bid.bidder_id,
                lot_record.seller_id,
                highest_bid.amount,
                'pending_payment'
            )
            ON CONFLICT DO NOTHING; -- Prevent duplicates if run multiple times

            -- 2. Update lot status to 'won'
            UPDATE lots
            SET status = 'won'
            WHERE id = lot_record.id;
        ELSE
            -- No bids, mark as closed/expired (optional, but good for cleanup)
            UPDATE lots
            SET status = 'ENDED'
            WHERE id = lot_record.id;
        END IF;
    END LOOP;
END;
$$;

-- Schedule the job to run every minute
-- Note: You might need superuser permissions or specific grant to schedule cron jobs.
-- If this fails, you can run the function manually or via an external trigger.
SELECT cron.schedule(
    'process-auctions-every-minute',
    '* * * * *',
    'SELECT process_expired_auctions()'
);
