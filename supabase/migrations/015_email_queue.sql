-- Create email queue table
CREATE TABLE IF NOT EXISTS email_queue (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    to_email text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    status text CHECK (status in ('pending', 'processing', 'sent', 'failed')) DEFAULT 'pending',
    attempts integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS: Only admins/system should read/write this, but for now we allow authenticated users to insert (e.g. requesting a receipt)
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert email requests"
    ON email_queue FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to queue email on auction win
CREATE OR REPLACE FUNCTION queue_auction_win_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    buyer_email text;
    lot_title text;
    seller_name text;
BEGIN
    -- Get buyer email
    SELECT email INTO buyer_email FROM users WHERE id = NEW.buyer_id;
    -- Get lot title
    SELECT title INTO lot_title FROM lots WHERE id = NEW.lot_id;
    -- Get seller name
    SELECT COALESCE(trade_name, company_name, full_name, 'Seller') INTO seller_name FROM users WHERE id = NEW.seller_id;

    -- Insert into email queue
    INSERT INTO email_queue (user_id, to_email, subject, body)
    VALUES (
        NEW.buyer_id,
        buyer_email,
        'You Won: ' || lot_title,
        'Congratulations! You have won the auction for ' || lot_title || ' from ' || seller_name || '. Please log in to the app to complete the payment.'
    );

    RETURN NEW;
END;
$$;

-- Trigger on transaction creation (can be combined with notification trigger or separate)
DROP TRIGGER IF EXISTS on_transaction_created_email ON transactions;
CREATE TRIGGER on_transaction_created_email
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION queue_auction_win_email();
