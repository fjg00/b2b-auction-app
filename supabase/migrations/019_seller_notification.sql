-- Function to notify seller on sale
CREATE OR REPLACE FUNCTION notify_seller_on_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    lot_title text;
    buyer_name text;
BEGIN
    -- Get lot title
    SELECT title INTO lot_title FROM lots WHERE id = NEW.lot_id;
    -- Get buyer name
    SELECT COALESCE(trade_name, company_name, full_name, 'A buyer') INTO buyer_name FROM users WHERE id = NEW.buyer_id;

    -- Insert notification for the seller
    INSERT INTO notifications (user_id, title, body, data)
    VALUES (
        NEW.seller_id,
        'Item Sold!',
        'Your item ' || lot_title || ' has been sold to ' || buyer_name || '.',
        jsonb_build_object('type', 'item_sold', 'transactionId', NEW.id, 'lotId', NEW.lot_id)
    );

    RETURN NEW;
END;
$$;

-- Trigger on transaction creation (separate from buyer notification for clarity)
DROP TRIGGER IF EXISTS on_transaction_created_seller ON transactions;
CREATE TRIGGER on_transaction_created_seller
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION notify_seller_on_sale();
