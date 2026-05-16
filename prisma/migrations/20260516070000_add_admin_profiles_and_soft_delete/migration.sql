-- Admin roles and profiles for Supabase Auth-backed admin workspace.
DO $$ BEGIN
  CREATE TYPE "AdminRole" AS ENUM ('master', 'admin', 'telesale', 'staff');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "admin_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  "email" text NOT NULL UNIQUE,
  "full_name" text NOT NULL,
  "phone" text,
  "role" "AdminRole" NOT NULL DEFAULT 'staff',
  "permissions" text[] NOT NULL DEFAULT ARRAY[]::text[],
  "position" text,
  "specialty" text,
  "avatar_url" text,
  "initials" text,
  "display_order" integer NOT NULL DEFAULT 0,
  "is_active" boolean NOT NULL DEFAULT true,
  "deleted_at" timestamp without time zone,
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "admin_profiles_role_idx" ON "admin_profiles" ("role");
CREATE INDEX IF NOT EXISTS "admin_profiles_active_idx" ON "admin_profiles" ("is_active", "deleted_at");

ALTER TABLE "admin_profiles" ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_admin_role()
RETURNS "AdminRole"
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.admin_profiles
  WHERE user_id = auth.uid()
    AND is_active = true
    AND deleted_at IS NULL
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.current_admin_permissions()
RETURNS text[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT permissions
  FROM public.admin_profiles
  WHERE user_id = auth.uid()
    AND is_active = true
    AND deleted_at IS NULL
  LIMIT 1
$$;

DROP POLICY IF EXISTS "admin_profiles_master_all" ON "admin_profiles";
CREATE POLICY "admin_profiles_master_all"
ON "admin_profiles"
FOR ALL
TO authenticated
USING (public.current_admin_role() = 'master')
WITH CHECK (public.current_admin_role() = 'master');

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

DROP POLICY IF EXISTS "admin_profiles_self_update_basic" ON "admin_profiles";
CREATE POLICY "admin_profiles_self_update_basic"
ON "admin_profiles"
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  AND is_active = true
  AND deleted_at IS NULL
)
WITH CHECK (
  user_id = auth.uid()
  AND is_active = true
  AND deleted_at IS NULL
  AND role = public.current_admin_role()
  AND permissions = public.current_admin_permissions()
);

ALTER TABLE "staff" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp without time zone;
ALTER TABLE "staff" ADD COLUMN IF NOT EXISTS "is_active" boolean NOT NULL DEFAULT true;
ALTER TABLE "rental_listings" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp without time zone;
ALTER TABLE "sale_listings" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp without time zone;
ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp without time zone;
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp without time zone;
ALTER TABLE "chatbot_leads" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp without time zone;
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;
