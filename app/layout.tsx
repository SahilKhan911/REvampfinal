import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { cookies } from "next/headers"
import ReferralTracker from "@/components/ReferralTracker"
import { getCohortConfig, DEFAULT_COHORT } from "@/lib/cohorts"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies()
  const cohortSlug = cookieStore.get("cohort_slug")?.value || DEFAULT_COHORT
  const cohort = getCohortConfig(cohortSlug)

  return {
    title: `Revamp | ${cohort.name} Workshops`,
    description: cohort.description,
    openGraph: {
      title: `Revamp | ${cohort.name} Workshops`,
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
    <html lang="en" className="dark" style={{
      "--accent": cohort.accentColor,
      "--accent-hex": cohort.accentHex,
    } as React.CSSProperties}>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Suspense fallback={null}>
          <ReferralTracker />
          {children}
        </Suspense>
      </body>
    </html>
  )
}
