-- Function to notify on new message
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    recipient_id uuid;
    sender_name text;
    transaction_record RECORD;
BEGIN
    -- Get transaction details to identify the recipient
    SELECT * INTO transaction_record FROM transactions WHERE id = NEW.transaction_id;

    -- Determine recipient (if sender is buyer, recipient is seller, and vice versa)
    IF NEW.sender_id = transaction_record.buyer_id THEN
        recipient_id := transaction_record.seller_id;
    ELSE
        recipient_id := transaction_record.buyer_id;
    END IF;

    -- Get sender name
    SELECT COALESCE(trade_name, company_name, full_name, 'User') INTO sender_name FROM users WHERE id = NEW.sender_id;

    -- Insert notification
    INSERT INTO notifications (user_id, title, body, data)
    VALUES (
        recipient_id,
        'New Message',
        sender_name || ' sent you a message.',
        jsonb_build_object(
            'type', 'new_message',
            'transactionId', NEW.transaction_id,
            'senderId', NEW.sender_id
        )
    );

    RETURN NEW;
END;
$$;

-- Trigger on messages table
DROP TRIGGER IF EXISTS on_new_message ON messages;
CREATE TRIGGER on_new_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION notify_new_message();
