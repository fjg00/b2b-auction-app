-- Revert the policy allowing sellers to create transactions
-- We now rely on the backend cron job (process_expired_auctions) to create them.
DROP POLICY IF EXISTS "Sellers can create transactions" ON transactions;
