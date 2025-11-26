-- Add new columns to lots table for logistics
ALTER TABLE public.lots
ADD COLUMN IF NOT EXISTS warehouse_id UUID REFERENCES public.addresses(id),
ADD COLUMN IF NOT EXISTS delivery_method TEXT;

-- Add comments
COMMENT ON COLUMN public.lots.warehouse_id IS 'Reference to the warehouse address where the item is located';
COMMENT ON COLUMN public.lots.delivery_method IS 'Delivery method: "Pickup", "Delivery", or "Negotiable"';

-- Create index for warehouse_id for better performance
CREATE INDEX IF NOT EXISTS idx_lots_warehouse_id ON public.lots(warehouse_id);
