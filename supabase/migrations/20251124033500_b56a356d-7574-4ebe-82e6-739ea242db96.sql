-- Add images column to messages table to support image attachments
ALTER TABLE messages ADD COLUMN IF NOT EXISTS images TEXT[];