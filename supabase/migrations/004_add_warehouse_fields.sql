-- Add new columns to addresses table for warehouse logistics
ALTER TABLE public.addresses
ADD COLUMN IF NOT EXISTS site_contact_name TEXT,
ADD COLUMN IF NOT EXISTS pickup_windows TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.addresses.site_contact_name IS 'Name of the contact person at this location';
COMMENT ON COLUMN public.addresses.pickup_windows IS 'Available days and times for pickup (e.g., "Mon-Fri 9am-5pm")';
