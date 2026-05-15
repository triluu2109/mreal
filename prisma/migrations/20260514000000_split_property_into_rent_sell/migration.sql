CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE IF EXISTS "rent" RENAME TO "rent_legacy";
ALTER TABLE IF EXISTS "sell" RENAME TO "sell_legacy";
ALTER TABLE IF EXISTS "properties" RENAME TO "properties_legacy";

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

DO $$
BEGIN
  IF to_regclass('public.rent_legacy') IS NOT NULL THEN
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
    FROM "rent_legacy"
    WHERE "unit_code" IS NOT NULL
      AND "area_sqm" IS NOT NULL
      AND "bedrooms" IS NOT NULL
      AND "bathrooms" IS NOT NULL
      AND COALESCE("rent_price_million"::DECIMAL, replace(NULLIF(regexp_replace(COALESCE("rent_price_text", ''), '[^0-9.,]', '', 'g'), ''), ',', '.')::DECIMAL) IS NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.sell_legacy') IS NOT NULL THEN
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
    FROM "sell_legacy"
    WHERE "unit_code" IS NOT NULL
      AND "area_sqm" IS NOT NULL
      AND "bedrooms" IS NOT NULL
      AND "bathrooms" IS NOT NULL
      AND "sale_price_text" IS NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.properties_legacy') IS NOT NULL THEN
    INSERT INTO "rent" (
      "id", "project_code", "unit_code", "area_sqm", "bedrooms", "bathrooms",
      "furnishing", "price", "note", "image_urls", "is_visible", "created_at", "updated_at"
    )
    SELECT
      COALESCE("id", gen_random_uuid()),
      'Q7RVS',
      "slug",
      replace(NULLIF(regexp_replace(COALESCE("area", ''), '[^0-9.,]', '', 'g'), ''), ',', '.')::DECIMAL,
      "beds",
      "baths",
      "furnished",
      COALESCE("price_num"::DECIMAL, replace(NULLIF(regexp_replace(COALESCE("price", ''), '[^0-9.,]', '', 'g'), ''), ',', '.')::DECIMAL),
      "description",
      COALESCE("images", ARRAY[]::TEXT[]),
      true,
      COALESCE("created_at", now()),
      COALESCE("updated_at", now())
    FROM "properties_legacy"
    WHERE "transaction_type" = 'RENT'
      AND NULLIF(regexp_replace(COALESCE("area", ''), '[^0-9.,]', '', 'g'), '') IS NOT NULL
      AND "beds" IS NOT NULL
      AND "baths" IS NOT NULL
      AND COALESCE("price_num"::DECIMAL, replace(NULLIF(regexp_replace(COALESCE("price", ''), '[^0-9.,]', '', 'g'), ''), ',', '.')::DECIMAL) IS NOT NULL;

    INSERT INTO "sell" (
      "id", "project_code", "unit_code", "area_sqm", "bedrooms", "bathrooms",
      "furnishing", "selling_price", "note", "image_urls", "is_visible", "created_at", "updated_at"
    )
    SELECT
      COALESCE("id", gen_random_uuid()),
      'Q7RVS',
      "slug",
      replace(NULLIF(regexp_replace(COALESCE("area", ''), '[^0-9.,]', '', 'g'), ''), ',', '.')::DECIMAL,
      "beds",
      "baths",
      "furnished",
      "price",
      "description",
      COALESCE("images", ARRAY[]::TEXT[]),
      true,
      COALESCE("created_at", now()),
      COALESCE("updated_at", now())
    FROM "properties_legacy"
    WHERE "transaction_type" = 'SALE'
      AND NULLIF(regexp_replace(COALESCE("area", ''), '[^0-9.,]', '', 'g'), '') IS NOT NULL
      AND "beds" IS NOT NULL
      AND "baths" IS NOT NULL
      AND "price" IS NOT NULL;
  END IF;
END $$;

CREATE INDEX "rent_project_code_idx" ON "rent"("project_code");
CREATE INDEX "rent_unit_code_idx" ON "rent"("unit_code");
CREATE INDEX "rent_created_at_idx" ON "rent"("created_at");
CREATE INDEX "rent_price_idx" ON "rent"("price");

CREATE INDEX "sell_project_code_idx" ON "sell"("project_code");
CREATE INDEX "sell_unit_code_idx" ON "sell"("unit_code");
CREATE INDEX "sell_created_at_idx" ON "sell"("created_at");

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rent_set_updated_at
BEFORE UPDATE ON "rent"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER sell_set_updated_at
BEFORE UPDATE ON "sell"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
