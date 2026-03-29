require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

const COHORTS = [
  { slug: 'opensource', name: 'Open Source' },
  { slug: 'webdev', name: 'Web Development' },
  { slug: 'aiml', name: 'AI & ML' },
  { slug: 'launchpad', name: 'Launchpad' },
  { slug: 'cp', name: 'Competitive Programming' },
]

const BUNDLES = [
  // Open Source
  { cohortSlug: 'opensource', name: 'GSOC INTENSIVE', originalPrice: 1999, eventPrice: 999, isDiscounted: true },
  { cohortSlug: 'opensource', name: 'OPENSOURCE STARTER', originalPrice: 1499, eventPrice: 699, isDiscounted: true },
  { cohortSlug: 'opensource', name: 'OPENSOURCE SPECIFIC', originalPrice: 1500, eventPrice: 1500, isDiscounted: false },
  // Web Dev
  { cohortSlug: 'webdev', name: 'FULLSTACK FOUNDATIONS', originalPrice: 1999, eventPrice: 999, isDiscounted: true },
  { cohortSlug: 'webdev', name: 'FRONTEND MASTERY', originalPrice: 1499, eventPrice: 699, isDiscounted: true },
  { cohortSlug: 'webdev', name: 'PORTFOLIO BOOTCAMP', originalPrice: 999, eventPrice: 499, isDiscounted: true },
  // AI/ML
  { cohortSlug: 'aiml', name: 'AGENTIC AI BUILDER', originalPrice: 2499, eventPrice: 1299, isDiscounted: true },
  { cohortSlug: 'aiml', name: 'VIBE CODING STARTER', originalPrice: 1499, eventPrice: 699, isDiscounted: true },
  { cohortSlug: 'aiml', name: 'N8N AUTOMATION', originalPrice: 1299, eventPrice: 599, isDiscounted: true },
  // Launchpad
  { cohortSlug: 'launchpad', name: 'STARTUP MVP', originalPrice: 1999, eventPrice: 999, isDiscounted: true },
  { cohortSlug: 'launchpad', name: 'PRODUCT DESIGN', originalPrice: 1499, eventPrice: 699, isDiscounted: true },
  { cohortSlug: 'launchpad', name: 'LAUNCH STRATEGY', originalPrice: 999, eventPrice: 499, isDiscounted: true },
  // Competitive Programming
  { cohortSlug: 'cp', name: 'ALGORITHM MASTERY', originalPrice: 1999, eventPrice: 999, isDiscounted: true },
  { cohortSlug: 'cp', name: 'CONTEST PREP', originalPrice: 1499, eventPrice: 699, isDiscounted: true },
  { cohortSlug: 'cp', name: 'DSA BOOTCAMP', originalPrice: 1299, eventPrice: 599, isDiscounted: true },
]

async function main() {
  console.log('Seeding database...')
  console.log('DATABASE_URL detected:', !!process.env.DATABASE_URL)

  // 1. Seed cohorts
  for (const cohort of COHORTS) {
    await prisma.cohort.upsert({
      where: { slug: cohort.slug },
      update: { name: cohort.name },
      create: cohort,
    })
    console.log(`  ✓ Cohort: ${cohort.name}`)
  }

  // 2. Seed bundles
  for (const b of BUNDLES) {
    // Check if bundle with same name + cohort exists
    const existing = await prisma.bundle.findFirst({
      where: { name: b.name, cohortSlug: b.cohortSlug },
    })

    if (existing) {
      await prisma.bundle.update({
        where: { id: existing.id },
        data: {
          originalPrice: b.originalPrice,
          eventPrice: b.eventPrice,
          isDiscounted: b.isDiscounted,
          isActive: true,
        },
      })
    } else {
      await prisma.bundle.create({ data: { ...b, isActive: true } })
    }
    console.log(`  ✓ Bundle: ${b.name} (${b.cohortSlug})`)
  }

  // 3. Create Admin User
  const adminEmail = 'letsrevamp.here@gmail.com'
  const hashedPassword = await bcrypt.hash('REvamp@GSOC69', 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hashedPassword },
    create: {
      name: 'Admin Revamp',
      email: adminEmail,
      phone: '0000000000',
      passwordHash: hashedPassword,
      referralCode: 'REVAMP-ROOT',
    },
  })

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
