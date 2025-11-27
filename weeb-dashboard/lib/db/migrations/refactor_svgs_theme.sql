-- Migration: Refactor svgs table to use unified theme field
-- Replaces terminalTheme and defaultTheme with a single theme field

-- Step 1: Add new theme column
ALTER TABLE svgs ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'default';

-- Step 2: Migrate existing data
-- For terminal style: use terminal_theme value
UPDATE svgs 
SET theme = COALESCE(terminal_theme, 'default')
WHERE style = 'terminal' AND theme IS NULL;

-- For default style: use default_theme value
UPDATE svgs 
SET theme = COALESCE(default_theme, 'default')
WHERE style = 'default' AND theme IS NULL;

-- Step 3: Set NOT NULL constraint (after data migration)
ALTER TABLE svgs ALTER COLUMN theme SET NOT NULL;
ALTER TABLE svgs ALTER COLUMN theme SET DEFAULT 'default';

-- Step 4: Drop old columns (commented out for safety - uncomment after verifying migration)
-- ALTER TABLE svgs DROP COLUMN IF EXISTS terminal_theme;
-- ALTER TABLE svgs DROP COLUMN IF EXISTS default_theme;




