CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF to_regclass('public.rent') IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'rent' AND column_name = 'project_code'
    )
  THEN
    ALTER TABLE "rent" RENAME TO "rent_legacy_align";
    ALTER TABLE "rent_legacy_align" RENAME CONSTRAINT "rent_pkey" TO "rent_legacy_align_pkey";
  END IF;

  IF to_regclass('public.rent') IS NULL THEN
    CREATE TABLE "rent" (
      "id" UUID NOT NULL DEFAULT gen_random_uuid(),
      "project_code" VARCHAR NOT NULL,
      "unit_code" VARCHAR NOT NULL,
      "area_sqm" DECIMAL NOT NULL,
      "bedrooms" INTEGER NOT NULL,
      "bathrooms" INTEGER NOT NULL,
      "furnishing" TEXT,
      "view" TEXT,
      "price" DECIMAL NOT NULL,
      "availability" TEXT,
      "source_name" VARCHAR,
      "note" TEXT,
      "image_urls" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "is_visible" BOOLEAN DEFAULT true,
      "created_at" TIMESTAMP DEFAULT now(),
      "updated_at" TIMESTAMP DEFAULT now(),
      CONSTRAINT "rent_pkey" PRIMARY KEY ("id")
    );
  END IF;

  IF to_regclass('public.rent_legacy_align') IS NOT NULL THEN
    INSERT INTO "rent" (
      "id", "project_code", "unit_code", "area_sqm", "bedrooms", "bathrooms",
      "furnishing", "price", "availability", "source_name", "note", "image_urls",
      "is_visible", "created_at", "updated_at"
    )
    SELECT
      COALESCE("id", gen_random_uuid()),
      COALESCE(NULLIF("prefix", ''), 'Q7RVS'),
      "unit_code",
      "area_sqm"::DECIMAL,
      "bedrooms",
      "bathrooms",
      "furniture",
      COALESCE("rent_price_million"::DECIMAL, replace(NULLIF(regexp_replace(COALESCE("rent_price_text", ''), '[^0-9.,]', '', 'g'), ''), ',', '.')::DECIMAL),
      "availability_text",
      "source_name",
      NULLIF(concat_ws(' | ', "commission_note", "viewing_note", "caution_note", "internal_note"), ''),
      COALESCE("images", ARRAY[]::TEXT[]),
      true,
      COALESCE("created_at", now()),
      COALESCE("updated_at", now())
    FROM "rent_legacy_align"
    WHERE "unit_code" IS NOT NULL
      AND "area_sqm" IS NOT NULL
      AND "bedrooms" IS NOT NULL
      AND "bathrooms" IS NOT NULL
      AND COALESCE("rent_price_million"::DECIMAL, replace(NULLIF(regexp_replace(COALESCE("rent_price_text", ''), '[^0-9.,]', '', 'g'), ''), ',', '.')::DECIMAL) IS NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.sell') IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'sell' AND column_name = 'project_code'
    )
  THEN
    ALTER TABLE "sell" RENAME TO "sell_legacy_align";
    ALTER TABLE "sell_legacy_align" RENAME CONSTRAINT "sell_pkey" TO "sell_legacy_align_pkey";
  END IF;

  IF to_regclass('public.sell') IS NULL THEN
    CREATE TABLE "sell" (
      "id" UUID NOT NULL DEFAULT gen_random_uuid(),
      "project_code" VARCHAR NOT NULL,
      "unit_code" VARCHAR NOT NULL,
      "area_sqm" DECIMAL NOT NULL,
      "bedrooms" INTEGER NOT NULL,
      "bathrooms" INTEGER NOT NULL,
      "furnishing" TEXT,
      "view" TEXT,
      "contract_price" TEXT,
      "selling_price" TEXT NOT NULL,
      "availability" TEXT,
      "source_name" VARCHAR,
      "note" TEXT,
      "image_urls" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "is_visible" BOOLEAN DEFAULT true,
      "created_at" TIMESTAMP DEFAULT now(),
      "updated_at" TIMESTAMP DEFAULT now(),
      CONSTRAINT "sell_pkey" PRIMARY KEY ("id")
    );
  END IF;

  IF to_regclass('public.sell_legacy_align') IS NOT NULL THEN
    INSERT INTO "sell" (
      "id", "project_code", "unit_code", "area_sqm", "bedrooms", "bathrooms",
      "furnishing", "view", "contract_price", "selling_price", "source_name", "note",
      "image_urls", "is_visible", "created_at", "updated_at"
    )
    SELECT
      COALESCE("id", gen_random_uuid()),
      COALESCE(NULLIF("prefix", ''), 'Q7RVS'),
      "unit_code",
      "area_sqm"::DECIMAL,
      "bedrooms",
      "bathrooms",
      "furniture",
      "view_text",
      "contract_price_text",
      "sale_price_text",
      "source_name",
      NULLIF(concat_ws(' | ', "commission_note", "viewing_note", "caution_note", "internal_note"), ''),
      COALESCE("images", ARRAY[]::TEXT[]),
      true,
      COALESCE("created_at", now()),
      COALESCE("updated_at", now())
    FROM "sell_legacy_align"
    WHERE "unit_code" IS NOT NULL
      AND "area_sqm" IS NOT NULL
      AND "bedrooms" IS NOT NULL
      AND "bathrooms" IS NOT NULL
      AND "sale_price_text" IS NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "rent_project_code_idx" ON "rent"("project_code");
CREATE INDEX IF NOT EXISTS "rent_unit_code_idx" ON "rent"("unit_code");
CREATE INDEX IF NOT EXISTS "rent_created_at_idx" ON "rent"("created_at");
CREATE INDEX IF NOT EXISTS "rent_price_idx" ON "rent"("price");

CREATE INDEX IF NOT EXISTS "sell_project_code_idx" ON "sell"("project_code");
CREATE INDEX IF NOT EXISTS "sell_unit_code_idx" ON "sell"("unit_code");
CREATE INDEX IF NOT EXISTS "sell_created_at_idx" ON "sell"("created_at");

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rent_set_updated_at ON "rent";
CREATE TRIGGER rent_set_updated_at
BEFORE UPDATE ON "rent"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS sell_set_updated_at ON "sell";
CREATE TRIGGER sell_set_updated_at
BEFORE UPDATE ON "sell"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
