DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "rental_listings"
    GROUP BY "project_code", "unit_code"
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Cannot add rental listing unique constraint: duplicate project_code + unit_code rows exist';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "rental_listings_project_unit_unique"
  ON "rental_listings" ("project_code", "unit_code");
