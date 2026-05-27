-- Fix: immutable search_path for trigger function
--
-- Without SET search_path, a user with CREATE SCHEMA permission could
-- shadow public functions and escalate privileges via this trigger.

CREATE OR REPLACE FUNCTION public.update_profile_config_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
