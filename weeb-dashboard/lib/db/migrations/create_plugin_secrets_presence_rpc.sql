-- Migration: Create RPC function for plugin secrets presence
-- 
-- This function returns only the presence (exists + updated_at) of secrets,
-- never the actual values, for security.
-- 
-- Usage:
--   SELECT * FROM get_plugin_secrets_presence('user-id-here');
-- 
-- Returns:
--   plugin | key | exists | updated_at

CREATE OR REPLACE FUNCTION get_plugin_secrets_presence(p_user_id TEXT)
RETURNS TABLE (
  plugin TEXT,
  key TEXT,
  exists BOOLEAN,
  updated_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ps.plugin,
    ps.key,
    TRUE as exists,
    ps.updated_at
  FROM plugin_secrets ps
  WHERE ps.user_id = p_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_plugin_secrets_presence(TEXT) TO authenticated;

-- Add comment
COMMENT ON FUNCTION get_plugin_secrets_presence IS 
  'Returns presence (exists + updated_at) of plugin secrets for a user. Never returns secret values.';

