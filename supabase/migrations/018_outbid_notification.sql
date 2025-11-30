-- Function to notify when outbid
CREATE OR REPLACE FUNCTION notify_outbid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    previous_bidder_id uuid;
    lot_title text;
BEGIN
    -- Find the previous highest bidder for this lot
    -- We look for the most recent bid on this lot that is NOT the new bid
    SELECT bidder_id INTO previous_bidder_id
    FROM bids
    WHERE lot_id = NEW.lot_id
    AND id != NEW.id
    ORDER BY amount DESC
    LIMIT 1;

    -- If there was a previous bidder and it's not the same person as the new bidder
    IF previous_bidder_id IS NOT NULL AND previous_bidder_id != NEW.bidder_id THEN
        -- Get lot title
        SELECT title INTO lot_title FROM lots WHERE id = NEW.lot_id;

        -- Insert notification
        INSERT INTO notifications (user_id, title, body, data)
        VALUES (
            previous_bidder_id,
            'You have been outbid!',
            'Someone placed a higher bid on ' || lot_title || '. Bid again now!',
            jsonb_build_object('type', 'outbid', 'lotId', NEW.lot_id)
        );
    END IF;

    RETURN NEW;
END;
$$;

-- Trigger on bids table
DROP TRIGGER IF EXISTS on_new_bid_outbid ON bids;
CREATE TRIGGER on_new_bid_outbid
AFTER INSERT ON bids
FOR EACH ROW
EXECUTE FUNCTION notify_outbid();
