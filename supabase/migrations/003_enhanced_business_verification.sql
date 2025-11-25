-- Enhanced Business Verification Schema
-- Adds comprehensive business verification fields for Lebanese/MENA businesses

-- Add business verification fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS account_type text DEFAULT 'individual' CHECK (account_type IN ('individual', 'business')),

-- Individual fields
ADD COLUMN IF NOT EXISTS national_id text,
ADD COLUMN IF NOT EXISTS national_id_document_url text,

-- Business identity
ADD COLUMN IF NOT EXISTS legal_entity_name text,
ADD COLUMN IF NOT EXISTS trade_name text,
ADD COLUMN IF NOT EXISTS legal_form text CHECK (legal_form IN ('sole_proprietorship', 'sarl', 'sal', 'other')),

-- Business registration
ADD COLUMN IF NOT EXISTS commercial_register_number text,
ADD COLUMN IF NOT EXISTS ministry_of_finance_tax_id text,
ADD COLUMN IF NOT EXISTS vat_registration_number text,
ADD COLUMN IF NOT EXISTS is_vat_registered boolean DEFAULT false,

-- Business documents
ADD COLUMN IF NOT EXISTS commercial_register_document_url text,
ADD COLUMN IF NOT EXISTS mof_certificate_url text,
ADD COLUMN IF NOT EXISTS vat_certificate_url text,

-- Business contact
ADD COLUMN IF NOT EXISTS registered_business_address text,
ADD COLUMN IF NOT EXISTS official_email text,
ADD COLUMN IF NOT EXISTS support_phone text,

-- Verification status
ADD COLUMN IF NOT EXISTS business_verification_status text DEFAULT 'pending' CHECK (business_verification_status IN ('pending', 'under_review', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS verification_notes text,
ADD COLUMN IF NOT EXISTS verified_at timestamptz;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(business_verification_status);
CREATE INDEX IF NOT EXISTS idx_users_commercial_register ON users(commercial_register_number) WHERE commercial_register_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_tax_id ON users(ministry_of_finance_tax_id) WHERE ministry_of_finance_tax_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN users.account_type IS 'Whether user is selling as individual or registered business';
COMMENT ON COLUMN users.legal_entity_name IS 'Legal entity name as registered in Commercial Register';
COMMENT ON COLUMN users.trade_name IS 'Trade name or brand name shown to customers';
COMMENT ON COLUMN users.commercial_register_number IS 'Lebanese Commercial Register number (رقم السجل التجاري)';
COMMENT ON COLUMN users.ministry_of_finance_tax_id IS 'Ministry of Finance Tax ID / TIN (رقم المكلف)';
