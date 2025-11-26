-- Add 'handed_over' status to transaction_status enum
ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'handed_over';

-- Update comment to reflect new status
COMMENT ON COLUMN transactions.status IS 'Current state of the transaction: pending_payment -> payment_sent -> completed -> handed_over';
