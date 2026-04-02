"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"

interface CohortData {
  id: string; slug: string; name: string; emoji: string; accentHex: string; description: string;
  bundles?: any[];
}

export default function DomainsPage() {
  const [cohorts, setCohorts] = useState<CohortData[]>([])
  const [user, setUser] = useState<any>(null)
  const [subscribedIds, setSubscribedIds] = useState<string[]>([])
  const [followLoading, setFollowLoading] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/cohorts").then(r => r.json()).catch(() => []),
      fetch("/api/user/auth/me").then(r => r.json()).catch(() => ({})),
      fetch("/api/user/subscriptions").then(r => r.json()).catch(() => ({ subscriptions: [] })),
    ]).then(([cohortsData, userData, subsData]) => {
      setCohorts(Array.isArray(cohortsData) ? cohortsData : [])
      if (userData?.user) setUser(userData.user)
      setSubscribedIds((subsData?.subscriptions || []).map((s: any) => s.cohort?.id || s.cohortId).filter(Boolean))
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

  const followed = cohorts.filter(c => subscribedIds.includes(c.id))
  const rest = cohorts.filter(c => !subscribedIds.includes(c.id))

  return (
    <div className="min-h-screen bg-black text-white font-body">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="pt-32 pb-16 px-8 border-b border-white/5">
        <div className="max-w-[1100px] mx-auto">
          <p className="font-label text-xs tracking-[0.3em] text-[#0085FF] uppercase mb-6">Domains</p>
          <h1 className="font-headline font-bold text-5xl md:text-7xl tracking-tight leading-[0.95] mb-6">
            6 domains.<br />
            <span className="text-[#0085FF]">0 hand-holding.</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
            Each domain is a focused war room with its own mentors, curriculum, and community. Follow domains to get notified when new workshops drop.
          </p>
          {user && subscribedIds.length > 0 && (
            <p className="text-[#0085FF]/60 text-sm mt-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>interests</span>
              You follow {subscribedIds.length} of {cohorts.length} domains
            </p>
          )}
        </div>
      </section>

      {/* ═══ FOLLOWED DOMAINS ═══ */}
      {followed.length > 0 && (
        <section className="py-12 px-8 border-b border-white/5 bg-[#0085FF]/[0.02]">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0085FF]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span> Following
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {followed.map((d) => (
                <DomainCard key={d.id} domain={d} isFollowing={true} isLoading={followLoading === d.id} onFollow={() => handleFollow(d.id)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ALL DOMAINS ═══ */}
      <section className="py-16 px-8">
        <div className="max-w-[1100px] mx-auto">
          {followed.length > 0 && (
            <h2 className="font-headline font-bold text-xl mb-6 text-white/50">All Domains</h2>
          )}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(followed.length > 0 ? rest : cohorts).map((d) => (
                <DomainCard
                  key={d.id}
                  domain={d}
                  isFollowing={subscribedIds.includes(d.id)}
                  isLoading={followLoading === d.id}
                  onFollow={() => handleFollow(d.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="py-24 px-8 bg-[#0085FF]">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-headline font-bold text-4xl md:text-6xl tracking-tight text-white leading-[0.95] mb-6">
            Can&apos;t decide? <span className="text-black">Start for free.</span>
          </h2>
          <p className="text-white/80 text-lg mb-10">Every domain has a free preview event. Join the community, attend a session, then commit.</p>
          <a href="/community" className="inline-block bg-black text-white px-10 py-4 font-headline font-bold text-sm hover:bg-[#111] transition-colors rounded-lg">
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

function DomainCard({ domain, isFollowing, isLoading, onFollow }: {
  domain: CohortData; isFollowing: boolean; isLoading: boolean; onFollow: () => void
}) {
  return (
    <div
      className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-white/15 transition-all flex flex-col group"
      style={{ borderTopColor: domain.accentHex || '#333', borderTopWidth: 3 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{domain.emoji}</span>
        <h3 className="font-headline font-bold text-lg group-hover:text-[#0085FF] transition-colors">{domain.name}</h3>
      </div>
      <p className="text-white/40 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">{domain.description}</p>
      <div className="flex items-center justify-between text-xs text-white/20 mb-5">
        <span>{(domain.bundles || []).length} workshops</span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={`/cohort/${domain.slug}`}
          className="flex-1 bg-white/5 text-center py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          Explore →
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); onFollow() }}
          disabled={isLoading}
          className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 ${
            isFollowing
              ? "bg-white/5 text-white/50 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
              : "bg-[#0085FF] text-white hover:bg-[#0070DD] shadow-lg shadow-[#0085FF]/20"
          }`}
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isFollowing ? "Following ✓" : "Follow"}
        </button>
      </div>
    </div>
  )
}
