import type { Metadata } from "next"
import { Suspense } from "react"
import { cookies } from "next/headers"
import ReferralTracker from "@/components/ReferralTracker"
import ReferralBanner from "./components/ReferralBanner"
import { getCohortConfig, DEFAULT_COHORT } from "@/lib/cohorts"
import "./globals.css"

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies()
  const cohortSlug = cookieStore.get("cohort_slug")?.value || DEFAULT_COHORT
  const cohort = getCohortConfig(cohortSlug)

  return {
    title: `REVAMP | ${cohort.name}`,
    description: cohort.description,
    openGraph: {
      title: `REVAMP | ${cohort.name}`,
      description: cohort.description,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const cohortSlug = cookieStore.get("cohort_slug")?.value || DEFAULT_COHORT
  const cohort = getCohortConfig(cohortSlug)

  return (
    <html lang="en" className="dark">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `:root { --accent: ${cohort.accentColor}; --accent-hex: ${cohort.accentHex}; }`
        }} />
        {/* Fonts — loaded here to avoid CSS @import ordering issues */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-black text-white antialiased selection:bg-[#0085FF]/30 selection:text-white overflow-x-hidden">
        <ReferralBanner />
        <Suspense fallback={null}>
          <ReferralTracker />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
