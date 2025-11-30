-- Allow sellers to create transactions (needed for "Sold" items flow)
CREATE POLICY "Sellers can create transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = seller_id);
