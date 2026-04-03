"use client"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'

const DOMAIN_ICONS: Record<string, string> = {
  terminal:   "terminal",
  code:       "code",
  brain:      "smart_toy",
  smart_toy:  "smart_toy",
  workflow:   "account_tree",
  video:      "videocam",
  shield:     "shield",
  trophy:     "emoji_events",
  briefcase:  "work",
  binary:     "data_object",
  globe:      "public",
  wrench:     "build",
  rocket:     "rocket_launch",
  users:      "group",
  award:      "military_tech",
}

function getIcon(raw: string): string {
  if (!raw) return "star"
  const key = raw.toLowerCase().trim()
  return DOMAIN_ICONS[key] || key
}

export default function DomainHubPage() {
  const params    = useParams()
  const slug      = params.slug as string

  const [cohort, setCohort]         = useState<any>(null)
  const [bundles, setBundles]       = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [user, setUser]             = useState<any>(null)

  useEffect(() => {
    fetch(`/api/cohorts?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) return
        setCohort(data)
        setBundles(data.bundles || [])
      })
      .finally(() => setLoading(false))

    fetch("/api/user/auth/me")
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user) })
      .catch(() => {})
  }, [slug])

  useEffect(() => {
    if (!user || !cohort) return
    fetch("/api/user/subscriptions")
      .then(r => r.json())
      .then(data => {
        const subs = data?.subscriptions || []
        setIsFollowing(subs.some((s: any) => (s.cohort?.id || s.cohortId) === cohort.id))
      })
      .catch(() => {})
  }, [user, cohort])

  const handleFollow = async () => {
    if (!user) { window.location.href = `/signup?returnTo=/cohort/${slug}`; return }
    setFollowLoading(true)
    try {
      await fetch("/api/user/subscriptions", {
        method: isFollowing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cohortId: cohort.id }),
      })
      setIsFollowing(!isFollowing)
    } catch {}
    finally { setFollowLoading(false) }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" />
        <span className="font-label text-xs tracking-widest text-white/30 uppercase">Loading domain...</span>
      </div>
    )
  }

  if (!cohort) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="font-headline font-bold text-2xl mb-2">Domain not found.</p>
          <Link href="/domains" className="text-[#0085FF] text-sm hover:underline">← Back to domains</Link>
        </div>
      </div>
    )
  }

  const features   = Array.isArray(cohort.features) ? cohort.features : []
  const accent     = cohort.accentHex || "#0085FF"

  return (
    <div className="min-h-screen bg-black text-white font-body">
      <Navbar />

      {/* ═══ DOMAIN ACCENT BAR ═══ */}
      <div className="fixed top-0 left-0 right-0 z-40 h-0.5" style={{ background: accent }} />

      {/* ═══ HERO ═══ */}
      <section className="pt-32 pb-0 border-b border-white/10">
        <div className="max-w-[1100px] mx-auto px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link href="/domains" className="font-label text-xs tracking-[0.2em] text-white/30 uppercase hover:text-white/60 transition-colors">
              Domains
            </Link>
            <span className="text-white/20">/</span>
            <span className="font-label text-xs tracking-[0.2em] uppercase" style={{ color: accent }}>
              {cohort.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-16">
            {/* Left */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 animate-pulse" style={{ background: accent }} />
                <span className="font-label text-[10px] tracking-[0.3em] text-white/40 uppercase">
                  REvamp · {cohort.name} Domain
                </span>
              </div>

              <h1 className="font-headline font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] mb-6">
                {cohort.heroTitle}<br />
                <span style={{ color: accent }}>{cohort.heroHighlight}</span>
              </h1>

              <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-lg">
                {cohort.description || cohort.tagline}
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`flex items-center gap-2.5 px-6 py-3 font-headline font-bold text-sm tracking-wide uppercase transition-all disabled:opacity-50 border ${
                    isFollowing
                      ? "border-white/10 text-white/40 hover:border-red-500/30 hover:text-red-400"
                      : "border-white/20 text-white hover:border-white/60 hover:bg-white/5"
                  }`}
                >
                  {followLoading ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span
                      className="material-symbols-outlined text-base"
                      style={{ fontVariationSettings: isFollowing ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {isFollowing ? "notifications_active" : "add_alert"}
                    </span>
                  )}
                  {isFollowing ? "Following" : "Follow Domain"}
                </button>

                {isFollowing && (
                  <span
                    className="flex items-center gap-1.5 font-label text-[10px] tracking-widest uppercase"
                    style={{ color: accent }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Right: Features */}
            <div className="lg:col-span-6">
              <div className="h-full border-l border-white/10 pl-16 flex flex-col justify-center gap-0">
                {features.map((feature: any, i: number) => (
                  <div
                    key={i}
                    className="group flex items-start gap-5 py-7 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] -mx-4 px-4 transition-colors"
                  >
                    <div
                      className="flex-shrink-0 w-9 h-9 flex items-center justify-center border mt-0.5"
                      style={{ borderColor: `${accent}40`, background: `${accent}10` }}
                    >
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ color: accent, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                      >
                        {getIcon(feature.icon)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-base mb-1">{feature.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10 bg-[#0a0a0a]">
          <div className="max-w-[1100px] mx-auto px-8 grid grid-cols-3 divide-x divide-white/10">
            <div className="py-5 px-6 text-center">
              <div className="font-headline font-bold text-xl mb-0.5" style={{ color: accent }}>
                {bundles.length}
              </div>
              <div className="font-label text-[10px] tracking-[0.2em] text-white/30 uppercase">Workshops</div>
            </div>
            <div className="py-5 px-6 text-center">
              <div className="font-headline font-bold text-xl mb-0.5" style={{ color: accent }}>
                {features.length}
              </div>
              <div className="font-label text-[10px] tracking-[0.2em] text-white/30 uppercase">Key Skills</div>
            </div>
            <div className="py-5 px-6 text-center">
              <div className="font-headline font-bold text-xl mb-0.5" style={{ color: accent }}>Free</div>
              <div className="font-label text-[10px] tracking-[0.2em] text-white/30 uppercase">To Preview</div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-[1100px] mx-auto px-8 py-24 space-y-24">

        {/* ═══ WORKSHOPS ═══ */}
        <section>
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="w-10 h-1 mb-6" style={{ background: accent }} />
              <h2 className="font-headline font-bold text-3xl md:text-4xl tracking-tight">Premium Workshops</h2>
              <p className="text-white/40 mt-2">Immersive {cohort.name} cohorts designed to get you hired.</p>
            </div>
          </div>

          {bundles.length > 0 ? (
            <div className="space-y-0 border-t border-white/10">
              {bundles.map((bundle: any, i: number) => (
                <div
                  key={bundle.slug}
                  className="group relative border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  style={{ borderLeft: `3px solid ${accent}` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6 px-8 py-8">
                    {/* Index */}
                    <div className="flex-shrink-0 md:w-10 font-mono text-xs text-white/20 group-hover:text-white/40 transition-colors select-none">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Name + tagline */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-headline font-bold text-xl mb-1 group-hover:text-white transition-colors">
                        {bundle.name}
                      </h3>
                      {bundle.tagline && (
                        <p className="text-white/40 text-sm line-clamp-1">{bundle.tagline}</p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-3">
                        {bundle.startDate && (
                          <span className="flex items-center gap-1.5 font-label text-[10px] tracking-widest text-white/30 uppercase">
                            <span className="material-symbols-outlined text-xs">calendar_today</span>
                            {bundle.startDate}
                          </span>
                        )}
                        {bundle.duration && (
                          <span className="flex items-center gap-1.5 font-label text-[10px] tracking-widest text-white/30 uppercase">
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            {bundle.duration}
                          </span>
                        )}
                        {bundle.seatsLeft != null && (
                          <span className="flex items-center gap-1.5 font-label text-[10px] tracking-widest text-orange-400/70 uppercase">
                            <span className="material-symbols-outlined text-xs">group</span>
                            {bundle.seatsLeft} seats left
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                      {(bundle.eventPrice || bundle.originalPrice) && (
                        <div>
                          {bundle.originalPrice && (
                            <p className="text-white/30 text-xs line-through">₹{bundle.originalPrice}</p>
                          )}
                          {bundle.eventPrice && (
                            <p className="font-headline font-bold text-xl">₹{bundle.eventPrice}</p>
                          )}
                        </div>
                      )}
                      <Link
                        href={`/workshop/${slug}/${bundle.slug}`}
                        className="flex items-center gap-2 px-5 py-2.5 font-headline font-bold text-xs tracking-wider uppercase transition-all text-white border border-white/20 hover:bg-white/5 hover:border-white/40"
                      >
                        Details
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </div>

                  {/* Hover accent sweep */}
                  <div
                    className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: `linear-gradient(to right, ${accent}60, transparent)` }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-white/5">
              <span className="material-symbols-outlined text-4xl text-white/10 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
                construction
              </span>
              <p className="text-white/40 text-sm">New premium workshops launching soon.</p>
            </div>
          )}
        </section>

        {/* ═══ FREE EVENTS / CALENDAR ═══ */}
        <section>
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="w-10 h-1 bg-[#FFD700] mb-6" />
              <h2 className="font-headline font-bold text-3xl md:text-4xl tracking-tight">Free Sessions & Events</h2>
              <p className="text-white/40 mt-2">Join our upcoming masterclasses and meetups — no cost to attend.</p>
            </div>
            <span className="flex items-center gap-2 font-label text-[10px] tracking-widest text-green-400/70 uppercase">
              <span className="w-1.5 h-1.5 bg-green-500 animate-pulse" />
              Live Calendar
            </span>
          </div>

          <div className="border border-white/10 overflow-hidden">
            <iframe
              src="https://luma.com/embed/calendar/cal-BKEujmH3HGliopK/events"
              width="100%"
              height="480"
              style={{ border: "none" }}
              allowFullScreen={true}
              aria-hidden="false"
              tabIndex={0}
              className="bg-[#0a0a0a] block"
            />
          </div>
        </section>

      </main>

      {/* ═══ CTA ═══ */}
      <section className="py-24 px-8" style={{ background: accent }}>
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-headline font-bold text-4xl md:text-6xl tracking-tight text-white leading-[0.95] mb-6">
            Ready to commit?<br />
            <span className="text-black">Pick a workshop.</span>
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Start free. Preview any session. Commit when you&apos;re ready.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://discord.gg/68J8FHAMfh"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-10 py-4 font-headline font-bold text-sm hover:bg-[#111] transition-colors"
            >
              Join Discord →
            </a>
            <Link
              href="/domains"
              className="bg-white/10 text-white px-10 py-4 font-headline font-bold text-sm hover:bg-white/20 transition-colors border border-white/20"
            >
              All Domains
            </Link>
          </div>
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
