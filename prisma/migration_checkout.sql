-- ============================================
-- Checkout Flow Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add productName column to Order (stores domain + plan as human-readable text)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Order' AND column_name = 'productName'
  ) THEN
    ALTER TABLE "Order" ADD COLUMN "productName" TEXT;
  END IF;
END $$;

-- 2. Drop the foreign key constraint on bundleId so we can store any string
DO $$
DECLARE
  fk_name TEXT;
BEGIN
  SELECT constraint_name INTO fk_name
  FROM information_schema.table_constraints
  WHERE table_name = 'Order'
    AND constraint_type = 'FOREIGN KEY'
    AND constraint_name LIKE '%bundleId%';

  IF fk_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE "Order" DROP CONSTRAINT %I', fk_name);
  END IF;
END $$;

-- 3. Make bundleId nullable (for orders that don't have a proper bundle)
ALTER TABLE "Order" ALTER COLUMN "bundleId" DROP NOT NULL;

-- 4. Backfill productName for existing orders using Bundle name
UPDATE "Order" o
SET "productName" = b."name"
FROM "Bundle" b
WHERE o."bundleId" = b."id"
  AND o."productName" IS NULL;

SELECT 'Checkout migration complete!' AS status;
