import { PrismaClient } from '@prisma/client'
import { COHORTS } from '../lib/cohorts'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  for (const [cohortSlug, cohortData] of Object.entries(COHORTS)) {
    console.log(`Seeding cohort: ${cohortSlug}`)
    const cohort = await prisma.cohort.upsert({
      where: { slug: cohortSlug },
      update: {
        name: cohortData.name,
        tagline: cohortData.tagline,
        heroTitle: cohortData.heroTitle,
        heroHighlight: cohortData.heroHighlight,
        description: cohortData.description,
        accentColor: cohortData.accentColor,
        accentHex: cohortData.accentHex,
        logoUrl: cohortData.logoUrl || null,
        emoji: cohortData.emoji,
        features: cohortData.features as any,
      },
      create: {
        slug: cohortSlug,
        name: cohortData.name,
        tagline: cohortData.tagline,
        heroTitle: cohortData.heroTitle,
        heroHighlight: cohortData.heroHighlight,
        description: cohortData.description,
        accentColor: cohortData.accentColor,
        accentHex: cohortData.accentHex,
        logoUrl: cohortData.logoUrl || null,
        emoji: cohortData.emoji,
        features: cohortData.features as any,
      },
    })

    console.log(`  Created cohort: ${cohort.name} (${cohort.id})`)

    for (const bundleData of cohortData.bundles) {
      const details = cohortData.workshopDetails[bundleData.id]
      console.log(`  Seeding bundle: ${bundleData.id}`)

      await prisma.bundle.upsert({
        where: { slug: bundleData.id },
        update: {
          name: bundleData.name,
          tagline: details?.tagline || null,
          originalPrice: bundleData.originalPrice,
          eventPrice: bundleData.eventPrice,
          isDiscounted: bundleData.isDiscounted,
          isPrimary: bundleData.isPrimary,
          duration: details?.duration || null,
          startDate: details?.startDate || null,
          schedule: details?.schedule || null,
          maxSeats: details?.maxSeats || null,
          seatsLeft: details?.seatsLeft || null,
          features: bundleData.features as any,
          highlights: (details?.highlights || []) as any,
          curriculum: (details?.curriculum || []) as any,
          outcomes: (details?.outcomes || []) as any,
        },
        create: {
          slug: bundleData.id,
          cohortSlug: cohortSlug,
          name: bundleData.name,
          tagline: details?.tagline || null,
          originalPrice: bundleData.originalPrice,
          eventPrice: bundleData.eventPrice,
          isDiscounted: bundleData.isDiscounted,
          isPrimary: bundleData.isPrimary,
          duration: details?.duration || null,
          startDate: details?.startDate || null,
          schedule: details?.schedule || null,
          maxSeats: details?.maxSeats || null,
          seatsLeft: details?.seatsLeft || null,
          features: bundleData.features as any,
          highlights: (details?.highlights || []) as any,
          curriculum: (details?.curriculum || []) as any,
          outcomes: (details?.outcomes || []) as any,
        },
      })
    }
  }

  console.log('Seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
