"use client"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import Navbar from "../components/Navbar"
import InfiniteMenu from "../components/InfiniteMenu"

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
  opensource: "terminal",
  webdev:     "code",
  aiml:       "smart_toy",
  cp:         "trophy",
  cybersec:   "shield",
  launchpad:  "rocket_launch",
}

const DOMAIN_IMAGES: Record<string, string> = {
  opensource: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&h=900&fit=crop&auto=format",
  webdev:     "https://images.unsplash.com/photo-1547658719-da2b51169166?w=900&h=900&fit=crop&auto=format",
  aiml:       "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&h=900&fit=crop&auto=format",
  cp:         "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=900&h=900&fit=crop&auto=format",
  cybersec:   "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&h=900&fit=crop&auto=format",
  launchpad:  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900&h=900&fit=crop&auto=format",
}

export default function DomainsPage() {
  const [cohorts, setCohorts]           = useState<CohortData[]>([])
  const [loading, setLoading]           = useState(true)
  const [activeIndex, setActiveIndex]   = useState<number>(0)
  const menuRef = useRef<any>(null)

  useEffect(() => {
    fetch("/api/cohorts").then(r => r.json()).catch(() => [])
      .then(data => setCohorts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const menuItems = useMemo(() =>
    cohorts.map(domain => ({
      image: DOMAIN_IMAGES[domain.slug] || `https://picsum.photos/seed/${domain.slug}/900/900`,
      link: `/cohort/${domain.slug}`,
      title: domain.name,
      description: domain.tagline
    })),
    [cohorts]
  )

  const handleActiveChange = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-body">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <div className="relative" style={{ height: '100vh' }}>

        {/* Sphere — full viewport */}
        <div className="absolute inset-0 bg-black">
          {loading ? (
            <div className="flex items-center justify-center h-full gap-3">
              <div className="w-6 h-6 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" />
              <span className="font-label text-xs tracking-widest text-white/30 uppercase">Loading domains…</span>
            </div>
          ) : (
            <InfiniteMenu
              ref={menuRef}
              {...{ items: menuItems, onActiveItemChange: handleActiveChange } as any}
            />
          )}
        </div>

        {/* Soft radial gradient — darkens top-left only so the sphere is visible */}
        <div
          className="absolute inset-0 pointer-events-none z-[6]"
          style={{
            background: 'radial-gradient(ellipse 65% 55% at 0% 0%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 45%, transparent 75%)',
          }}
        />
        {/* Bottom fade into stats section */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-[6]" />

        {/* Hero text — top-left, compact, does not obscure sphere center */}
        <div className="absolute top-0 left-0 z-10 pointer-events-none pt-28 px-10 max-w-[420px]">
          <p className="font-label text-xs tracking-[0.3em] text-[#0085FF] uppercase mb-4">
            Pick Your Domain
          </p>
          <h1 className="font-headline font-bold text-4xl md:text-5xl lg:text-[3.5rem] tracking-tight leading-[0.93] mb-5">
            6 domains.<br />
            <span className="text-[#0085FF]">0 hand-holding.</span>
          </h1>
          <p className="text-white/35 text-sm leading-relaxed max-w-[300px]">
            Each domain is a focused war room — its own mentors, curriculum, and community.
          </p>
        </div>

        {/* Left sidebar — domain nav */}
        {!loading && cohorts.length > 0 && (
          <nav className="absolute left-6 bottom-24 z-20 hidden md:flex flex-col gap-1">
            {cohorts.map((domain, i) => {
              const isActive = i === activeIndex
              return (
                <button
                  key={domain.id}
                  onClick={() => menuRef.current?.snapToItem(i)}
                  className="group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer border-none text-left"
                  style={{ background: isActive ? 'rgba(0,133,255,0.12)' : 'transparent' }}
                >
                  <span
                    className="block w-[3px] rounded-full transition-all duration-300"
                    style={{
                      height: isActive ? '22px' : '10px',
                      background: isActive ? '#0085FF' : 'rgba(255,255,255,0.15)',
                    }}
                  />
                  <span
                    className="font-headline font-bold text-xs tracking-wider uppercase transition-all duration-300"
                    style={{
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.25)',
                      textShadow: isActive ? '0 0 20px rgba(0,133,255,0.4)' : 'none',
                    }}
                  >
                    {domain.name}
                  </span>
                  <span
                    className="material-symbols-outlined text-sm transition-all duration-200"
                    style={{
                      color: '#0085FF',
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateX(0)' : 'translateX(-6px)',
                    }}
                  >
                    arrow_forward
                  </span>
                </button>
              )
            })}
          </nav>
        )}

        {/* Right sidebar — active domain info */}
        {!loading && cohorts.length > 0 && cohorts[activeIndex] && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-end gap-5 max-w-[210px]">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: `${cohorts[activeIndex].accentHex}20`, border: `1px solid ${cohorts[activeIndex].accentHex}40` }}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ color: cohorts[activeIndex].accentHex, fontVariationSettings: "'FILL' 1" }}
              >
                {DOMAIN_ICONS[cohorts[activeIndex].slug] || 'circle'}
              </span>
            </div>
            <p className="text-right text-xs leading-relaxed transition-all duration-500 text-white/40">
              {cohorts[activeIndex].tagline}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl" style={{ color: cohorts[activeIndex].accentHex }}>
                {cohorts[activeIndex].bundles?.length || 0}
              </span>
              <span className="font-label text-[10px] tracking-[0.15em] text-white/30 uppercase">workshops</span>
            </div>
            <a
              href={`/cohort/${cohorts[activeIndex].slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-headline font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105"
              style={{
                color: cohorts[activeIndex].accentHex,
                border: `1px solid ${cohorts[activeIndex].accentHex}40`,
                background: `${cohorts[activeIndex].accentHex}10`,
              }}
            >
              Explore
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        )}
      </div>

      {/* ═══ STATS ═══ */}
      {!loading && cohorts.length > 0 && (
        <div className="relative z-20 bg-black">
          <div className="max-w-[1100px] mx-auto px-8 py-16 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="font-headline font-bold text-4xl text-[#0085FF] mb-2">{cohorts.length}</div>
              <div className="font-label text-[10px] tracking-[0.2em] text-white/30 uppercase">Active Domains</div>
            </div>
            <div className="text-center">
              <div className="font-headline font-bold text-4xl text-[#0085FF] mb-2">
                {cohorts.reduce((sum, c) => sum + (c.bundles?.length || 0), 0)}
              </div>
              <div className="font-label text-[10px] tracking-[0.2em] text-white/30 uppercase">Total Workshops</div>
            </div>
            <div className="text-center">
              <div className="font-headline font-bold text-4xl text-[#0085FF] mb-2">Free</div>
              <div className="font-label text-[10px] tracking-[0.2em] text-white/30 uppercase">To Preview</div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CTA ═══ */}
      <div className="relative z-20">
        <section className="py-28 px-8" style={{ background: 'linear-gradient(180deg, #000 0%, #0055aa 40%, #0085FF 100%)' }}>
          <div className="max-w-[900px] mx-auto text-center">
            <h2 className="font-headline font-bold text-4xl md:text-6xl tracking-tight text-white leading-[0.95] mb-6">
              Can&apos;t decide? <span className="text-black/80">Start for free.</span>
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-lg mx-auto">
              Every domain has a free preview event. Join the community, attend a session, then commit.
            </p>
            <a
              href="/community"
              className="inline-block bg-black text-white px-10 py-4 rounded-full font-headline font-bold text-sm hover:bg-white hover:text-black transition-all duration-300"
            >
              Join Community →
            </a>
          </div>
        </section>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-black">
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
