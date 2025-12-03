/*
  # Create conversations table for LLM Council

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key) - Unique identifier for each conversation
      - `created_at` (timestamptz) - When the conversation was created
      - `messages` (jsonb) - Array of message objects containing role, content, and stage data
      - `updated_at` (timestamptz) - When the conversation was last updated
  
  2. Security
    - Enable RLS on `conversations` table
    - Add policy for public read access (since this is a demo app without auth)
    - Add policy for public insert/update access
  
  3. Notes
    - Messages are stored as JSONB to maintain flexibility with the existing data structure
    - Each message can contain: {role, content, stage1, stage2, stage3}
    - Using public policies since the app doesn't have authentication yet
*/

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  messages jsonb DEFAULT '[]'::jsonb
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS conversations_created_at_idx ON conversations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Public access policies (since no auth is implemented)
CREATE POLICY "Allow public read access"
  ON conversations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON conversations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON conversations FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON conversations FOR DELETE
  TO anon
  USING (true);