-- Fix: RLS auth_rls_initplan on all tables
--
-- auth.uid() was called directly in USING/WITH CHECK clauses, causing
-- Postgres to re-evaluate the function for every row scanned instead of
-- once per query. Wrapping in (SELECT auth.uid()) forces a single
-- evaluation per statement, which is significantly faster at scale.
--
-- Tables fixed: profiles, plugin_secrets, svgs, templates, template_likes

-- ── profiles ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can read their own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can read their own profile"
  ON public.profiles FOR SELECT
  USING ((SELECT auth.uid())::text = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING     ((SELECT auth.uid())::text = user_id)
  WITH CHECK ((SELECT auth.uid())::text = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = user_id);

-- ── plugin_secrets ───────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can update their own plugin_secrets" ON public.plugin_secrets;
DROP POLICY IF EXISTS "Users can insert their own plugin_secrets" ON public.plugin_secrets;
DROP POLICY IF EXISTS "Users can delete their own plugin_secrets" ON public.plugin_secrets;
-- Legacy name from older migration (safe to drop if it exists)
DROP POLICY IF EXISTS "Users can update their own essential_configs" ON public.plugin_secrets;
DROP POLICY IF EXISTS "Users can insert their own essential_configs" ON public.plugin_secrets;
DROP POLICY IF EXISTS "Users can delete their own essential_configs" ON public.plugin_secrets;

CREATE POLICY "Users can update their own plugin_secrets"
  ON public.plugin_secrets FOR UPDATE
  USING     ((SELECT auth.uid())::text = user_id)
  WITH CHECK ((SELECT auth.uid())::text = user_id);

CREATE POLICY "Users can insert their own plugin_secrets"
  ON public.plugin_secrets FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = user_id);

CREATE POLICY "Users can delete their own plugin_secrets"
  ON public.plugin_secrets FOR DELETE
  USING ((SELECT auth.uid())::text = user_id);

-- ── svgs ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own SVGs"   ON public.svgs;
DROP POLICY IF EXISTS "Users can insert own SVGs" ON public.svgs;
DROP POLICY IF EXISTS "Users can update own SVGs" ON public.svgs;
DROP POLICY IF EXISTS "Users can delete own SVGs" ON public.svgs;

CREATE POLICY "Users can view own SVGs"
  ON public.svgs FOR SELECT
  USING ((SELECT auth.uid())::text = user_id);

CREATE POLICY "Users can insert own SVGs"
  ON public.svgs FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = user_id);

CREATE POLICY "Users can update own SVGs"
  ON public.svgs FOR UPDATE
  USING     ((SELECT auth.uid())::text = user_id)
  WITH CHECK ((SELECT auth.uid())::text = user_id);

CREATE POLICY "Users can delete own SVGs"
  ON public.svgs FOR DELETE
  USING ((SELECT auth.uid())::text = user_id);

-- ── templates ────────────────────────────────────────────────────────────
-- Drop both possible names (migration name vs live DB name)
DROP POLICY IF EXISTS "Users can view own templates"                        ON public.templates;
DROP POLICY IF EXISTS "Public can view public templates, users view own"    ON public.templates;
DROP POLICY IF EXISTS "Users can insert own templates"                      ON public.templates;
DROP POLICY IF EXISTS "Users can update own templates"                      ON public.templates;
DROP POLICY IF EXISTS "Users can delete own templates"                      ON public.templates;

CREATE POLICY "Public can view public templates, users view own"
  ON public.templates FOR SELECT
  USING (is_public = true OR (SELECT auth.uid())::text = user_id);

CREATE POLICY "Users can insert own templates"
  ON public.templates FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = user_id);

CREATE POLICY "Users can update own templates"
  ON public.templates FOR UPDATE
  USING     ((SELECT auth.uid())::text = user_id)
  WITH CHECK ((SELECT auth.uid())::text = user_id);

CREATE POLICY "Users can delete own templates"
  ON public.templates FOR DELETE
  USING ((SELECT auth.uid())::text = user_id);

-- ── template_likes ───────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can insert own likes" ON public.template_likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON public.template_likes;

CREATE POLICY "Users can insert own likes"
  ON public.template_likes FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = user_id);

CREATE POLICY "Users can delete own likes"
  ON public.template_likes FOR DELETE
  USING ((SELECT auth.uid())::text = user_id);
