-- Function to check if the auction is still active before accepting a bid
CREATE OR REPLACE FUNCTION check_bid_timing()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    lot_end_time timestamptz;
BEGIN
    -- Get the end_time of the lot
    SELECT end_time INTO lot_end_time
    FROM lots
    WHERE id = NEW.lot_id;

    -- Check if the auction has ended
    IF NOW() > lot_end_time THEN
        RAISE EXCEPTION 'Auction has ended. No new bids allowed.';
    END IF;

    RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS before_bid_insert ON bids;
CREATE TRIGGER before_bid_insert
BEFORE INSERT ON bids
FOR EACH ROW
EXECUTE FUNCTION check_bid_timing();
