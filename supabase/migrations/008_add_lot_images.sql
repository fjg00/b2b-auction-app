-- Add images column to lots table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lots' AND column_name = 'images') THEN
        ALTER TABLE lots ADD COLUMN images TEXT[] DEFAULT '{}';
    END IF;
END $$;
