-- Harden admin profile RLS surface.
-- Server-side admin management uses Prisma/Supabase service credentials plus
-- application guards, so clients only need to read their own active profile.

DROP POLICY IF EXISTS "admin_profiles_master_all" ON "admin_profiles";
DROP POLICY IF EXISTS "admin_profiles_self_update_basic" ON "admin_profiles";

DROP FUNCTION IF EXISTS public.current_admin_permissions();
DROP FUNCTION IF EXISTS public.current_admin_role();

DROP POLICY IF EXISTS "admin_profiles_self_read" ON "admin_profiles";
CREATE POLICY "admin_profiles_self_read"
ON "admin_profiles"
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  AND is_active = true
  AND deleted_at IS NULL
);
