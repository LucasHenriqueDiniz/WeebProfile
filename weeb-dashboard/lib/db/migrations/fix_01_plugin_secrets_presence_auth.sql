-- Fix: add auth enforcement to get_plugin_secrets_presence
--
-- Before: any authenticated user could pass any p_user_id and read
-- another user's plugin names/keys/updated_at.
-- After: caller can only query their own user_id; anon access revoked.

CREATE OR REPLACE FUNCTION public.get_plugin_secrets_presence(p_user_id TEXT)
RETURNS TABLE (
  plugin TEXT,
  key TEXT,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (SELECT auth.uid())::text IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: cannot access secrets for another user';
  END IF;

  RETURN QUERY
  SELECT ps.plugin, ps.key, ps.updated_at
  FROM plugin_secrets ps
  WHERE ps.user_id = p_user_id;
END;
$$;

-- Revoke from anon and public; only authenticated users may call this
REVOKE EXECUTE ON FUNCTION public.get_plugin_secrets_presence(TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_plugin_secrets_presence(TEXT) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_plugin_secrets_presence(TEXT) TO authenticated;
