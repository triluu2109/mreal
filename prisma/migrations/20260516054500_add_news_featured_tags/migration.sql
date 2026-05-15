ALTER TABLE "news_posts"
  ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "news_posts"
SET "featured" = COALESCE("featured", false),
    "tags" = COALESCE("tags", ARRAY[]::TEXT[]);

ALTER TABLE "news_posts"
  ALTER COLUMN "featured" SET DEFAULT false,
  ALTER COLUMN "featured" SET NOT NULL,
  ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[],
  ALTER COLUMN "tags" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "news_posts_featured_published_idx"
  ON "news_posts" ("featured", "published", "published_at");
