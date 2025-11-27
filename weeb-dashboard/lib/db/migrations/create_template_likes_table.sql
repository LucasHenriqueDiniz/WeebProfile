-- Migration: Create template_likes table
-- Users can like/unlike templates

CREATE TABLE IF NOT EXISTS template_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, template_id) -- One like per user per template
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_template_likes_user_id ON template_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_template_likes_template_id ON template_likes(template_id);

-- RLS (Row Level Security)
ALTER TABLE template_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all likes
CREATE POLICY "Users can view all likes"
  ON template_likes FOR SELECT
  USING (true);

-- Policy: Users can insert their own likes
CREATE POLICY "Users can insert own likes"
  ON template_likes FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can delete their own likes
CREATE POLICY "Users can delete own likes"
  ON template_likes FOR DELETE
  USING (auth.uid()::text = user_id);




