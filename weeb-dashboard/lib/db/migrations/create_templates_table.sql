-- Migration: Create templates table
-- Templates are saved SVG configurations that can be reused

CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  svg_id UUID, -- Reference to the SVG this template is based on (optional)
  style TEXT NOT NULL DEFAULT 'default',
  size TEXT NOT NULL DEFAULT 'half',
  theme TEXT DEFAULT 'default',
  hide_terminal_emojis BOOLEAN DEFAULT false NOT NULL,
  hide_terminal_header BOOLEAN DEFAULT false NOT NULL,
  custom_css TEXT,
  plugins_order TEXT DEFAULT '',
  plugins_config JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN DEFAULT false NOT NULL, -- Whether template is publicly available
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_svg_id ON templates(svg_id);
CREATE INDEX IF NOT EXISTS idx_templates_public ON templates(is_public);

-- RLS (Row Level Security)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own templates and public templates
CREATE POLICY "Users can view own templates"
  ON templates FOR SELECT
  USING (auth.uid()::text = user_id OR is_public = true);

-- Policy: Users can insert their own templates
CREATE POLICY "Users can insert own templates"
  ON templates FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can update their own templates
CREATE POLICY "Users can update own templates"
  ON templates FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Policy: Users can delete their own templates
CREATE POLICY "Users can delete own templates"
  ON templates FOR DELETE
  USING (auth.uid()::text = user_id);




