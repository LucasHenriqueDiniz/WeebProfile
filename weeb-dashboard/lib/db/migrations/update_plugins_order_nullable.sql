-- Migration: Update plugins_order to allow NULL and set default to NULL
-- NULL means use alphabetical order of enabled plugins

-- Update svgs table
ALTER TABLE svgs 
  ALTER COLUMN plugins_order DROP DEFAULT,
  ALTER COLUMN plugins_order DROP NOT NULL;

-- Update existing empty strings to NULL
UPDATE svgs 
SET plugins_order = NULL 
WHERE plugins_order = '' OR plugins_order IS NULL;

-- Update templates table
ALTER TABLE templates 
  ALTER COLUMN plugins_order DROP DEFAULT,
  ALTER COLUMN plugins_order DROP NOT NULL;

-- Update existing empty strings to NULL
UPDATE templates 
SET plugins_order = NULL 
WHERE plugins_order = '' OR plugins_order IS NULL;

