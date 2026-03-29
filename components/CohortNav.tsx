"use client"

import { useRouter } from "next/navigation"
import { COHORTS } from "@/lib/cohorts"

interface CohortNavProps {
  activeCohort: string
}

const COHORT_LIST = [
  { slug: "opensource", label: "Open Source", emoji: "🔓" },
  { slug: "webdev", label: "Web Dev", emoji: "🌐" },
  { slug: "aiml", label: "AI & ML", emoji: "🤖" },
  { slug: "launchpad", label: "College Starter", emoji: "🚀" },
  { slug: "cp", label: "CP", emoji: "⚔️" },
  { slug: "cybersec", label: "Cyber Security", emoji: "🛡️" },
]

export default function CohortNav({ activeCohort }: CohortNavProps) {
  const router = useRouter()

  const switchCohort = (slug: string) => {
    // Set cookie client-side for immediate effect
    document.cookie = `cohort_slug=${slug}; path=/; max-age=86400; SameSite=Lax`
    // Navigate with query param (middleware will also set the cookie)
    router.push(`/?cohort=${slug}`)
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="https://letsrevamp.in" className="text-lg font-black tracking-tighter hover:opacity-80 transition-opacity">
            RE<span className="accent-text">VAMP</span>
          </a>

          {/* Cohort Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
            {COHORT_LIST.map((c) => (
              <button
                key={c.slug}
                onClick={() => switchCohort(c.slug)}
                className={`
                  px-3 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap
                  ${activeCohort === c.slug
                    ? "accent-bg text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <span className="mr-1">{c.emoji}</span>
                {c.label}
              </button>
            ))}
          </div>

          {/* Auth Links */}
          <div className="hidden sm:flex items-center space-x-3">
            <a href="/login" className="text-xs text-gray-400 hover:text-white transition-colors font-medium">
              Login
            </a>
            <a href="/dashboard" className="text-xs accent-bg text-white px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity">
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
