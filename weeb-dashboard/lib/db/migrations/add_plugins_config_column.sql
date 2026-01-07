-- Migration: Add plugins_config column to svgs table if it doesn't exist
-- This column stores plugin configurations (non-sensitive) as JSONB

-- Add column to svgs table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'svgs' 
    AND column_name = 'plugins_config'
  ) THEN
    ALTER TABLE svgs 
    ADD COLUMN plugins_config JSONB NOT NULL DEFAULT '{}';
    
    -- Add comment
    COMMENT ON COLUMN svgs.plugins_config IS 'Plugin configurations (non-sensitive). Stores plugin-specific settings, terminal configs, etc.';
  END IF;
END $$;






