"use client"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Navbar from "../../../components/Navbar"

export default function WorkshopPage() {
  const params     = useParams()
  const domainSlug = params.domainSlug as string
  const workshopId = params.workshopId as string

  const [bundle, setBundle] = useState<any>(null)
  const [cohort, setCohort]   = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/bundles?slug=${workshopId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) return
        setBundle(data)
        setCohort(data.cohort)
      })
      .finally(() => setLoading(false))
  }, [workshopId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" />
        <span className="font-label text-xs tracking-widest text-white/30 uppercase">Loading workshop...</span>
      </div>
    )
  }

  if (!bundle || !cohort) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <p className="font-headline font-bold text-2xl">Workshop not found.</p>
        <Link href={`/cohort/${domainSlug}`} className="text-[#0085FF] text-sm hover:underline">
          ← Return to domain
        </Link>
      </div>
    )
  }

  const highlights = Array.isArray(bundle.highlights)  ? bundle.highlights  : []
  const curriculum = Array.isArray(bundle.curriculum)   ? bundle.curriculum  : []
  const outcomes   = Array.isArray(bundle.outcomes)     ? bundle.outcomes    : []
  const features   = Array.isArray(bundle.features)     ? bundle.features    : []
  const accent     = cohort.accentHex || "#0085FF"

  const seatsPercent = bundle.maxSeats
    ? Math.round(((bundle.maxSeats - (bundle.seatsLeft || 0)) / bundle.maxSeats) * 100)
    : null

  return (
    <div className="min-h-screen bg-black text-white font-body">
      <Navbar />

      {/* Domain accent bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-0.5" style={{ background: accent }} />

      {/* ═══ HERO ═══ */}
      <section className="pt-32 pb-0 border-b border-white/10">
        <div className="max-w-[1100px] mx-auto px-8 pb-12">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link
              href={`/cohort/${domainSlug}`}
              className="flex items-center gap-1.5 font-label text-xs tracking-[0.2em] text-white/30 uppercase hover:text-white/60 transition-colors"
            >
              <span className="material-symbols-outlined text-xs">arrow_back</span>
              {cohort.name}
            </Link>
            <span className="text-white/20">/</span>
            <span className="font-label text-xs tracking-[0.2em] uppercase" style={{ color: accent }}>
              {bundle.name}
            </span>
          </div>

          {/* Duration tag */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 border font-label text-[10px] tracking-[0.25em] uppercase font-bold"
              style={{ borderColor: `${accent}40`, color: accent }}
            >
              <span className="w-1.5 h-1.5 animate-pulse" style={{ background: accent }} />
              {bundle.duration} Intensive
            </span>
            {bundle.isDiscounted && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-green-500/30 text-green-400 font-label text-[10px] tracking-[0.25em] uppercase font-bold">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>local_offer</span>
                Special Price
              </span>
            )}
          </div>

          <h1 className="font-headline font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] mb-6">
            {bundle.name}
          </h1>

          <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
            {bundle.tagline}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-8 py-6 border-t border-b border-white/10">
            {bundle.startDate && (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-white/30">calendar_today</span>
                <div>
                  <p className="font-label text-[10px] tracking-widest text-white/30 uppercase">Starts</p>
                  <p className="font-headline font-bold text-sm">{bundle.startDate}</p>
                </div>
              </div>
            )}
            {bundle.schedule && (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-white/30">schedule</span>
                <div>
                  <p className="font-label text-[10px] tracking-widest text-white/30 uppercase">Schedule</p>
                  <p className="font-headline font-bold text-sm">{bundle.schedule}</p>
                </div>
              </div>
            )}
            {bundle.certificateIncluded && (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-white/30" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                <div>
                  <p className="font-label text-[10px] tracking-widest text-white/30 uppercase">Certificate</p>
                  <p className="font-headline font-bold text-sm">Included</p>
                </div>
              </div>
            )}
            {bundle.seatsLeft != null && (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-orange-400/60" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <div>
                  <p className="font-label text-[10px] tracking-widest text-white/30 uppercase">Seats Left</p>
                  <p className="font-headline font-bold text-sm text-orange-400">{bundle.seatsLeft} / {bundle.maxSeats}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT + SIDEBAR ═══ */}
      <div className="max-w-[1100px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* ── Left: Content ── */}
          <div className="lg:col-span-7 space-y-20">

            {/* Highlights */}
            {highlights.length > 0 && (
              <section>
                <div className="w-10 h-1 mb-6" style={{ background: accent }} />
                <h2 className="font-headline font-bold text-2xl md:text-3xl tracking-tight mb-8">
                  What You&apos;ll Unlock
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10">
                  {highlights.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-5 bg-black hover:bg-[#0a0a0a] transition-colors">
                      <span
                        className="material-symbols-outlined text-base mt-0.5 flex-shrink-0"
                        style={{ color: accent, fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      <p className="text-white/70 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Curriculum */}
            {curriculum.length > 0 && (
              <section>
                <div className="w-10 h-1 mb-6" style={{ background: accent }} />
                <h2 className="font-headline font-bold text-2xl md:text-3xl tracking-tight mb-8">
                  Curriculum
                </h2>
                <div className="space-y-0 border-t border-white/10">
                  {curriculum.map((week: any, i: number) => (
                    <div
                      key={i}
                      className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      style={{ borderLeft: `3px solid ${accent}` }}
                    >
                      <div className="px-6 py-6">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase">
                            {week.week}
                          </span>
                          <h3 className="font-headline font-bold text-base">{week.title}</h3>
                        </div>
                        {week.topics && (
                          <ul className="space-y-2 pl-1">
                            {week.topics.map((topic: string, j: number) => (
                              <li key={j} className="flex items-start gap-3 text-sm text-white/50">
                                <span className="w-1 h-1 flex-shrink-0 mt-2" style={{ background: `${accent}60` }} />
                                {topic}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* sweep line */}
                      <div
                        className="h-px w-0 group-hover:w-full transition-all duration-500"
                        style={{ background: `linear-gradient(to right, ${accent}40, transparent)` }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Outcomes */}
            {outcomes.length > 0 && (
              <section>
                <div className="w-10 h-1 bg-[#FFD700] mb-6" />
                <h2 className="font-headline font-bold text-2xl md:text-3xl tracking-tight mb-8">
                  What You Walk Out With
                </h2>
                <div className="space-y-0 border-t border-white/10">
                  {outcomes.map((outcome: string, i: number) => (
                    <div key={i} className="flex items-center gap-5 py-5 border-b border-white/5">
                      <span className="font-mono text-xs text-white/20 w-6 flex-shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-headline font-bold text-base text-white/90">{outcome}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* ── Right: Sticky Pricing Card ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <div
                className="border border-white/10 bg-[#0a0a0a] overflow-hidden"
                style={{ borderTop: `3px solid ${accent}` }}
              >
                {/* Price header */}
                <div className="p-8 border-b border-white/10">
                  <p className="font-label text-[10px] tracking-[0.3em] text-white/30 uppercase mb-4">
                    {bundle.name}
                  </p>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="font-headline font-bold text-5xl tracking-tight">
                      ₹{bundle.eventPrice}
                    </span>
                    {bundle.isDiscounted && bundle.originalPrice && (
                      <span className="text-white/30 line-through text-xl font-headline">
                        ₹{bundle.originalPrice}
                      </span>
                    )}
                  </div>
                  {bundle.isDiscounted && bundle.originalPrice && (
                    <p className="text-green-400 text-sm font-bold">
                      Save ₹{bundle.originalPrice - bundle.eventPrice} — limited time
                    </p>
                  )}
                </div>

                {/* Seat meter */}
                {bundle.seatsLeft != null && (
                  <div className="px-8 py-5 border-b border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-label text-[10px] tracking-widest text-white/30 uppercase">Seats Filled</span>
                      <span className="font-headline font-bold text-sm text-orange-400">
                        {bundle.seatsLeft} remaining
                      </span>
                    </div>
                    <div className="h-1 bg-white/10 w-full">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${seatsPercent}%`,
                          background: seatsPercent && seatsPercent > 70 ? "#f97316" : accent,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Inclusions */}
                {features.length > 0 && (
                  <div className="px-8 py-6 border-b border-white/5 space-y-3">
                    {features.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <span
                          className="material-symbols-outlined text-sm flex-shrink-0"
                          style={{ color: accent, fontVariationSettings: "'FILL' 1" }}
                        >
                          check
                        </span>
                        <span className="text-sm text-white/60">{f}</span>
                      </div>
                    ))}
                    {bundle.certificateIncluded && (
                      <div className="flex items-center gap-3">
                        <span
                          className="material-symbols-outlined text-sm flex-shrink-0"
                          style={{ color: accent, fontVariationSettings: "'FILL' 1" }}
                        >
                          workspace_premium
                        </span>
                        <span className="text-sm text-white/60">Certificate of completion</span>
                      </div>
                    )}
                  </div>
                )}

                {/* CTA */}
                <div className="p-8">
                  <Link
                    href={`/checkout/${domainSlug}/${workshopId}`}
                    className="block w-full text-center py-4 font-headline font-bold text-sm tracking-widest uppercase transition-all hover:opacity-90 text-white"
                    style={{ background: accent }}
                  >
                    Secure Your Spot →
                  </Link>
                  <p className="text-center text-white/20 text-xs mt-4 font-label tracking-wider">
                    Powered by Razorpay · Secure checkout
                  </p>
                </div>
              </div>

              {/* Back link */}
              <Link
                href={`/cohort/${domainSlug}`}
                className="flex items-center gap-2 mt-6 text-white/30 hover:text-white/60 transition-colors font-label text-xs tracking-widest uppercase"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to {cohort.name}
              </Link>
            </div>
          </div>

        </div>
      </div>

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
