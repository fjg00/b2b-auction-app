-- Create transactions table
CREATE TYPE transaction_status AS ENUM ('pending_payment', 'payment_sent', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id uuid NOT NULL REFERENCES lots(id),
  buyer_id uuid NOT NULL REFERENCES users(id),
  seller_id uuid NOT NULL REFERENCES users(id),
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  status transaction_status DEFAULT 'pending_payment',
  proof_of_payment_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_transactions_lot_id ON transactions(lot_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Add comments
COMMENT ON TABLE transactions IS 'Tracks the transaction lifecycle for won/purchased lots';
COMMENT ON COLUMN transactions.status IS 'Current state of the transaction: pending_payment -> payment_sent -> completed';

-- Trigger to update updated_at
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can view transactions where they are buyer or seller
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Buyers can insert transactions (e.g. via Buy Now)
CREATE POLICY "Buyers can create transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Buyers and Sellers can update their own transactions
CREATE POLICY "Users can update own transactions" ON transactions
    FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
