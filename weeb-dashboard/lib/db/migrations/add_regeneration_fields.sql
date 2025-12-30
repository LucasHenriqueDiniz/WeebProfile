-- Migration: Add regeneration fields to svgs table
-- Adds fields for automatic regeneration system with sleep-friendly architecture

-- Add new columns to svgs table
ALTER TABLE svgs
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS next_regeneration_at TIMESTAMP NULL,
  ADD COLUMN IF NOT EXISTS last_payload_hash TEXT NULL,
  ADD COLUMN IF NOT EXISTS fail_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_error TEXT NULL,
  ADD COLUMN IF NOT EXISTS is_paused BOOLEAN NOT NULL DEFAULT false;

-- Create partial indexes for efficient queries
-- Index for due SVGs (only indexes what matters)
CREATE INDEX IF NOT EXISTS idx_svgs_next_regeneration_due 
  ON svgs(next_regeneration_at) 
  WHERE next_regeneration_at IS NOT NULL AND is_paused = false;

-- Index for claim query optimization
CREATE INDEX IF NOT EXISTS idx_svgs_status_next_regeneration 
  ON svgs(status, next_regeneration_at) 
  WHERE status IN ('completed', 'error', 'pending') AND is_paused = false;

-- Backfill: Initialize next_regeneration_at for existing SVGs
UPDATE svgs
SET 
  next_regeneration_at = CASE
    WHEN last_generated_at IS NULL THEN now()
    ELSE last_generated_at + INTERVAL '24 hours'
  END,
  is_paused = false
WHERE next_regeneration_at IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN svgs.next_regeneration_at IS 'Timestamp for next automatic regeneration. NULL means never regenerate automatically.';
COMMENT ON COLUMN svgs.last_payload_hash IS 'SHA-256 hash of normalized payload. Used to skip regeneration if payload unchanged.';
COMMENT ON COLUMN svgs.fail_count IS 'Number of consecutive failures. Used for future backoff logic.';
COMMENT ON COLUMN svgs.last_error IS 'Last error message if generation failed.';
COMMENT ON COLUMN svgs.is_paused IS 'If true, SVG is paused and will be ignored by automatic regeneration.';

