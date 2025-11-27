-- Function to handle new bids: Security Check + Soft Close
CREATE OR REPLACE FUNCTION handle_new_bid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    lot_record RECORD;
BEGIN
    -- Get lot details
    SELECT * INTO lot_record FROM lots WHERE id = NEW.lot_id;

    -- 1. Security Check: Prevent bids after end_time
    IF NOW() > lot_record.end_time THEN
        RAISE EXCEPTION 'Auction has ended. No new bids allowed.';
    END IF;

    -- 2. Soft Close Logic: Extend if within last 2 minutes
    -- If the bid is placed when there is less than 2 minutes remaining
    IF lot_record.end_time - NOW() < interval '2 minutes' THEN
        -- Extend the auction by 2 minutes
        UPDATE lots
        SET end_time = end_time + interval '2 minutes'
        WHERE id = NEW.lot_id;
    END IF;

    RETURN NEW;
END;
$$;

-- Re-create the trigger (replaces the one from 012 if it exists)
DROP TRIGGER IF EXISTS before_bid_insert ON bids;
CREATE TRIGGER before_bid_insert
BEFORE INSERT ON bids
FOR EACH ROW
EXECUTE FUNCTION handle_new_bid();
