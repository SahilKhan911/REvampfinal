-- ============================================
-- Multi-Cohort Platform Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create Cohort table
CREATE TABLE IF NOT EXISTS "Cohort" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Cohort_slug_key" ON "Cohort"("slug");

-- 2. Add cohortSlug column to Bundle (with default for existing rows)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Bundle' AND column_name = 'cohortSlug'
  ) THEN
    ALTER TABLE "Bundle" ADD COLUMN "cohortSlug" TEXT NOT NULL DEFAULT 'opensource';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "Bundle_cohortSlug_idx" ON "Bundle"("cohortSlug");

-- 3. Seed the 5 cohorts
INSERT INTO "Cohort" ("id", "slug", "name", "isActive") VALUES
  (gen_random_uuid()::text, 'opensource', 'Open Source', true),
  (gen_random_uuid()::text, 'webdev', 'Web Development', true),
  (gen_random_uuid()::text, 'aiml', 'AI & ML', true),
  (gen_random_uuid()::text, 'launchpad', 'Launchpad', true),
  (gen_random_uuid()::text, 'cp', 'Competitive Programming', true)
ON CONFLICT ("slug") DO NOTHING;

-- 4. Tag existing bundles as 'opensource'
UPDATE "Bundle" SET "cohortSlug" = 'opensource' WHERE "cohortSlug" IS NULL OR "cohortSlug" = '';

-- 5. Add foreign key (optional, for referential integrity)
-- ALTER TABLE "Bundle" ADD CONSTRAINT "Bundle_cohortSlug_fkey"
--   FOREIGN KEY ("cohortSlug") REFERENCES "Cohort"("slug") ON DELETE SET DEFAULT ON UPDATE CASCADE;

SELECT 'Migration complete!' AS status;
