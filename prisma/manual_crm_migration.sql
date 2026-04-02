-- =========================================================================
-- SAFE MIGRATION SCRIPT FOR SUPABASE DB CRM & CHECKOUT REFACTOR
-- Run this in your Supabase Dashboard -> SQL Editor!
-- =========================================================================

-- 1. Updates to "User" table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'USER';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bio" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "utmSource" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "utmCampaign" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tags" JSONB;

-- 2. Updates to "Cohort" table
ALTER TABLE "Cohort" ADD COLUMN IF NOT EXISTS "lumaCalendarUrl" TEXT;
ALTER TABLE "Cohort" ADD COLUMN IF NOT EXISTS "discordLink" TEXT;
ALTER TABLE "Cohort" ADD COLUMN IF NOT EXISTS "whatsappLink" TEXT;
ALTER TABLE "Cohort" ADD COLUMN IF NOT EXISTS "bannerUrl" TEXT;
ALTER TABLE "Cohort" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE "Cohort" ADD COLUMN IF NOT EXISTS "faqs" JSONB;
ALTER TABLE "Cohort" ADD COLUMN IF NOT EXISTS "testimonials" JSONB;

-- 3. Updates to "Bundle" table
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'DRAFT';
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "isPrimary" BOOLEAN DEFAULT false;
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "instructorName" TEXT;
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "instructorRole" TEXT;
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "instructorAvatarUrl" TEXT;
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "demoVideoUrl" TEXT;
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "certificateIncluded" BOOLEAN DEFAULT true;
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "features" JSONB;
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "highlights" JSONB;
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "curriculum" JSONB;
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "outcomes" JSONB;
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "prerequisites" JSONB;
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "maxSeats" INTEGER;
ALTER TABLE "Bundle" ADD COLUMN IF NOT EXISTS "seatsLeft" INTEGER;

-- 4. Updates to "Order" table
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentProofUrl" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "adminNotes" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "verifiedByAdminId" TEXT;


-- 5. Create new tables
CREATE TABLE IF NOT EXISTS "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "bundleId" TEXT,
    "stepReached" TEXT NOT NULL DEFAULT 'DETAILS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "AdminNote" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminNote_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AdminNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AdminNote_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "CommunicationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "errorDetail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunicationLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ReferralPayout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "transactionRef" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralPayout_pkey" PRIMARY KEY ("id")
);

-- CREATE INDEXES IF NOT EXIST
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'Lead_email_idx') THEN
    CREATE INDEX "Lead_email_idx" ON "Lead"("email");
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'CommunicationLog_userId_idx') THEN
    CREATE INDEX "CommunicationLog_userId_idx" ON "CommunicationLog"("userId");
  END IF;
END $$;
