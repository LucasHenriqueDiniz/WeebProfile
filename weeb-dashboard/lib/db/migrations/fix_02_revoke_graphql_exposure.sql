-- Fix: remove plugin_secrets from GraphQL schema exposure
--
-- plugin_secrets contains sensitive API keys. It should never be
-- accessible via the public GraphQL/REST API, even if RLS blocks
-- individual rows. Revoking SELECT hides the table from schema introspection.
--
-- svg-generator accesses this table via service_role which bypasses RLS
-- entirely, so this change has no functional impact on generation.

REVOKE SELECT ON public.plugin_secrets FROM anon;
REVOKE SELECT ON public.plugin_secrets FROM authenticated;
