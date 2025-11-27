-- Function to process expired auctions
CREATE OR REPLACE FUNCTION process_expired_auctions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    lot_record RECORD;
    winning_bid RECORD;
BEGIN
    -- Loop through all active lots that have expired
    FOR lot_record IN
        SELECT * FROM lots
        WHERE status = 'active'
        AND end_time < NOW()
    LOOP
        -- Find the highest bid for this lot
        SELECT * INTO winning_bid
        FROM bids
        WHERE lot_id = lot_record.id
        ORDER BY amount DESC
        LIMIT 1;

        IF FOUND THEN
            -- Winner found: Create transaction
            INSERT INTO transactions (
                lot_id,
                buyer_id,
                seller_id,
                amount,
                currency,
                status
            ) VALUES (
                lot_record.id,
                winning_bid.bidder_id,
                lot_record.seller_id,
                winning_bid.amount, -- Sold at winning bid price
                'USD',
                'pending_payment'
            );

            -- Mark lot as sold
            UPDATE lots
            SET status = 'sold'
            WHERE id = lot_record.id;
        ELSE
            -- No bids: Mark lot as ended
            UPDATE lots
            SET status = 'ended'
            WHERE id = lot_record.id;
        END IF;
    END LOOP;
END;
$$;

-- Enable pg_cron extension to allow scheduling
create extension if not exists pg_cron;

-- Schedule the function to run every minute
-- This ensures that within 1 minute of expiration, the auction is processed
select cron.schedule(
  'process-expired-auctions', -- unique name for the job
  '* * * * *',                -- cron syntax for "every minute"
  $$ select process_expired_auctions() $$
);
