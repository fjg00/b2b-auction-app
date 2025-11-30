-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    data jsonb,
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Function to create notification on auction win
CREATE OR REPLACE FUNCTION notify_auction_winner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    lot_title text;
BEGIN
    -- Get lot title
    SELECT title INTO lot_title FROM lots WHERE id = NEW.lot_id;

    -- Insert notification for the buyer
    INSERT INTO notifications (user_id, title, body, data)
    VALUES (
        NEW.buyer_id,
        'You Won!',
        'Congratulations! You won the auction for ' || lot_title || '. Tap to complete payment.',
        jsonb_build_object('type', 'auction_won', 'transactionId', NEW.id, 'lotId', NEW.lot_id)
    );

    RETURN NEW;
END;
$$;

-- Trigger on transaction creation
DROP TRIGGER IF EXISTS on_transaction_created ON transactions;
CREATE TRIGGER on_transaction_created
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION notify_auction_winner();
