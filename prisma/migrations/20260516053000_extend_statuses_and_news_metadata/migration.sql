ALTER TYPE "AppointmentStatus" ADD VALUE IF NOT EXISTS 'cancelled';

ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'advised';
ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'completed';
ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'cancelled';

ALTER TABLE "news_posts"
  ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "seo_title" TEXT,
  ADD COLUMN IF NOT EXISTS "seo_description" TEXT,
  ADD COLUMN IF NOT EXISTS "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE INDEX IF NOT EXISTS "news_posts_public_sort_idx"
  ON "news_posts" ("published", "featured", "published_at", "created_at");
