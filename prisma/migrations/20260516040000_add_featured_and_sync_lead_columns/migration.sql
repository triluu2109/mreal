ALTER TABLE "rental_listings"
  ADD COLUMN IF NOT EXISTS "is_featured" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "sale_listings"
  ADD COLUMN IF NOT EXISTS "is_featured" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "rental_listings_public_sort_idx"
  ON "rental_listings" ("is_visible", "is_featured", "rent_price", "created_at");

CREATE INDEX IF NOT EXISTS "sale_listings_public_sort_idx"
  ON "sale_listings" ("is_visible", "is_featured", "selling_price", "created_at");

ALTER TABLE "chatbot_leads"
  ADD COLUMN IF NOT EXISTS "full_name" TEXT,
  ADD COLUMN IF NOT EXISTS "needed_time" TEXT,
  ADD COLUMN IF NOT EXISTS "purpose" TEXT,
  ADD COLUMN IF NOT EXISTS "appointment_time" TEXT,
  ADD COLUMN IF NOT EXISTS "contact_method" TEXT;

ALTER TABLE "appointments"
  ADD COLUMN IF NOT EXISTS "appointment_time" TEXT,
  ADD COLUMN IF NOT EXISTS "contact_method" TEXT,
  ADD COLUMN IF NOT EXISTS "source" TEXT;
