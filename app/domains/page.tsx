"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"

interface CohortData {
  id: string
  slug: string
  name: string
  emoji: string
  accentHex: string
  tagline: string
  description: string
  bundles?: { id: string; name: string; slug: string }[]
}

const DOMAIN_ICONS: Record<string, string> = {
  opensource:  "terminal",
  webdev:      "code",
  aiml:        "smart_toy",
  cp:          "trophy",
  cybersec:    "shield",
  launchpad:   "rocket_launch",
}

export default function DomainsPage() {
  const [cohorts, setCohorts]           = useState<CohortData[]>([])
  const [user, setUser]                 = useState<any>(null)
  const [subscribedIds, setSubscribedIds] = useState<string[]>([])
  const [followLoading, setFollowLoading] = useState<string | null>(null)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/cohorts").then(r => r.json()).catch(() => []),
      fetch("/api/user/auth/me").then(r => r.json()).catch(() => ({})),
      fetch("/api/user/subscriptions").then(r => r.json()).catch(() => ({ subscriptions: [] })),
    ]).then(([cohortsData, userData, subsData]) => {
      setCohorts(Array.isArray(cohortsData) ? cohortsData : [])
      if (userData?.user) setUser(userData.user)
      setSubscribedIds(
        (subsData?.subscriptions || [])
          .map((s: any) => s.cohort?.id || s.cohortId)
          .filter(Boolean)
      )
    }).finally(() => setLoading(false))
  }, [])

  const handleFollow = async (cohortId: string) => {
    if (!user) { window.location.href = `/signup?returnTo=/domains`; return }
    setFollowLoading(cohortId)
    const isFollowing = subscribedIds.includes(cohortId)
    try {
      await fetch("/api/user/subscriptions", {
        method: isFollowing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cohortId }),
      })
      setSubscribedIds(prev =>
        isFollowing ? prev.filter(id => id !== cohortId) : [...prev, cohortId]
      )
    } catch {}
    finally { setFollowLoading(null) }
  }

  return (
    <div className="min-h-screen bg-black text-white font-body">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="pt-32 pb-16 px-8 border-b border-white/10">
        <div className="max-w-[1100px] mx-auto">
          <p className="font-label text-xs tracking-[0.3em] text-[#0085FF] uppercase mb-6">Pick Your Domain</p>
          <h1 className="font-headline font-bold text-5xl md:text-7xl tracking-tight leading-[0.95] mb-6">
            6 domains.<br />
            <span className="text-[#0085FF]">0 hand-holding.</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
            Each domain is a focused war room with its own mentors, curriculum, and community.
            Follow domains to get notified when new workshops drop.
          </p>
          {user && subscribedIds.length > 0 && (
            <p className="text-[#0085FF]/60 text-sm mt-5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>interests</span>
              You follow {subscribedIds.length} of {cohorts.length} domains
            </p>
          )}
        </div>
      </section>

      {/* ═══ DOMAIN LIST ═══ */}
      <section className="px-8 py-0">
        <div className="max-w-[1100px] mx-auto">

          {loading ? (
            <div className="flex items-center justify-center py-32 gap-3">
              <div className="w-6 h-6 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" />
              <span className="font-label text-xs tracking-widest text-white/30 uppercase">Initializing domains...</span>
            </div>
          ) : (
            <div>
              {cohorts.map((domain, i) => {
                const isFollowing = subscribedIds.includes(domain.id)
                const isLoading   = followLoading === domain.id
                const index       = String(i + 1).padStart(2, "0")
                const icon        = DOMAIN_ICONS[domain.slug] || "circle"
                const workshopCount = (domain.bundles || []).length

                return (
                  <div
                    key={domain.id}
                    className="group relative border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-300"
                    style={{ borderLeft: `3px solid ${domain.accentHex}` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6 px-8 py-10">

                      {/* Left: Index + Icon */}
                      <div className="flex items-center gap-5 md:w-[100px] flex-shrink-0">
                        <span className="font-mono text-xs text-white/20 group-hover:text-white/40 transition-colors select-none">
                          {index}
                        </span>
                        <span
                          className="material-symbols-outlined text-2xl transition-transform duration-300 group-hover:scale-110"
                          style={{ color: domain.accentHex, fontVariationSettings: "'FILL' 1" }}
                        >
                          {icon}
                        </span>
                      </div>

                      {/* Middle: Name + Tagline */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="font-headline font-bold text-2xl md:text-3xl tracking-tight group-hover:text-white transition-colors">
                            {domain.name}
                          </h2>
                          {isFollowing && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold font-label tracking-widest uppercase border"
                              style={{ color: domain.accentHex, borderColor: `${domain.accentHex}40` }}
                            >
                              <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: domain.accentHex }} />
                              Following
                            </span>
                          )}
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed max-w-xl">
                          {domain.tagline}
                        </p>
                      </div>

                      {/* Right meta */}
                      <div className="flex flex-col md:items-end gap-4 flex-shrink-0">
                        {/* Workshop count */}
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {Array.from({ length: Math.min(workshopCount, 5) }).map((_, j) => (
                              <span
                                key={j}
                                className="w-1.5 h-6 transition-all duration-300"
                                style={{
                                  background: domain.accentHex,
                                  opacity: 0.3 + (j / Math.max(workshopCount - 1, 1)) * 0.7,
                                }}
                              />
                            ))}
                          </div>
                          <span className="font-label text-[10px] tracking-widest text-white/30 uppercase">
                            {workshopCount} workshop{workshopCount !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleFollow(domain.id)}
                            disabled={isLoading}
                            className={`px-4 py-2 font-headline font-bold text-xs tracking-wider uppercase transition-all disabled:opacity-50 border ${
                              isFollowing
                                ? "text-white/40 border-white/10 hover:text-red-400 hover:border-red-500/30 bg-transparent"
                                : "text-white border-white/20 hover:border-white/60 bg-transparent hover:bg-white/5"
                            }`}
                          >
                            {isLoading ? (
                              <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : isFollowing ? "Unfollow" : "+ Follow"}
                          </button>

                          <Link
                            href={`/cohort/${domain.slug}`}
                            className="flex items-center gap-2 px-4 py-2 font-headline font-bold text-xs tracking-wider uppercase transition-all text-white border"
                            style={{ borderColor: `${domain.accentHex}60`, color: domain.accentHex }}
                            onMouseEnter={e => {
                              const el = e.currentTarget as HTMLElement
                              el.style.background = `${domain.accentHex}15`
                            }}
                            onMouseLeave={e => {
                              const el = e.currentTarget as HTMLElement
                              el.style.background = "transparent"
                            }}
                          >
                            Explore
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Hover accent glow line */}
                    <div
                      className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                      style={{ background: `linear-gradient(to right, ${domain.accentHex}60, transparent)` }}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      {!loading && cohorts.length > 0 && (
        <section className="border-t border-white/10 mt-0">
          <div className="max-w-[1100px] mx-auto px-8 py-8 grid grid-cols-3 divide-x divide-white/10">
            <div className="px-8 text-center">
              <div className="font-headline font-bold text-3xl text-[#0085FF] mb-1">{cohorts.length}</div>
              <div className="font-label text-[10px] tracking-[0.2em] text-white/30 uppercase">Active Domains</div>
            </div>
            <div className="px-8 text-center">
              <div className="font-headline font-bold text-3xl text-[#0085FF] mb-1">
                {cohorts.reduce((sum, c) => sum + (c.bundles?.length || 0), 0)}
              </div>
              <div className="font-label text-[10px] tracking-[0.2em] text-white/30 uppercase">Total Workshops</div>
            </div>
            <div className="px-8 text-center">
              <div className="font-headline font-bold text-3xl text-[#0085FF] mb-1">Free</div>
              <div className="font-label text-[10px] tracking-[0.2em] text-white/30 uppercase">To Preview</div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section className="py-24 px-8 bg-[#0085FF]">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-headline font-bold text-4xl md:text-6xl tracking-tight text-white leading-[0.95] mb-6">
            Can&apos;t decide? <span className="text-black">Start for free.</span>
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Every domain has a free preview event. Join the community, attend a session, then commit.
          </p>
          <a
            href="/community"
            className="inline-block bg-black text-white px-10 py-4 font-headline font-bold text-sm hover:bg-[#111] transition-colors"
          >
            Join Community →
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/10 bg-black">
        <div className="max-w-[1100px] mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20 tracking-wider uppercase">© 2026 REVAMP. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-xs text-white/30 hover:text-white transition-colors" href="#">Terms</a>
            <a className="text-xs text-white/30 hover:text-white transition-colors" href="#">Privacy</a>
            <a className="text-xs text-white/30 hover:text-white transition-colors" href="mailto:letsrevamp.here@gmail.com">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
