-- Add push_token column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_token text;

-- Index for faster lookups (optional but good practice)
CREATE INDEX IF NOT EXISTS idx_users_push_token ON users(push_token);

-- Comment
COMMENT ON COLUMN users.push_token IS 'Expo Push Token for mobile notifications';
