"use client"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'

export default function DomainHubPage() {
  const params = useParams()
  const slug = params.slug as string

  const [cohort, setCohort] = useState<any>(null)
  const [bundles, setBundles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/cohorts?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) return
        setCohort(data)
        setBundles(data.bundles || [])
      })
      .finally(() => setLoading(false))

    // Check auth + subscription
    fetch("/api/user/auth/me").then(r => r.json()).then(d => { if (d.user) setUser(d.user) }).catch(() => {})
  }, [slug])

  useEffect(() => {
    if (!user || !cohort) return
    fetch("/api/user/subscriptions").then(r => r.json())
      .then(data => {
        const subs = data?.subscriptions || []
        setIsFollowing(subs.some((s: any) => (s.cohort?.id || s.cohortId) === cohort.id))
      }).catch(() => {})
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!cohort) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Domain not found.</div>
  }

  const features = Array.isArray(cohort.features) ? cohort.features : []

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-[#0085FF]/30">
      
      <Navbar />

      <main className="max-w-[1100px] mx-auto px-6 pt-32 pb-24">

        {/* ═══ HERO ═══ */}
        <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cohort.accentHex }}></span>
              <span className="text-xs uppercase tracking-widest font-bold text-white/70">REvamp {cohort.name} Domain</span>
            </div>
            
            <h1 className="font-headline font-bold text-5xl md:text-7xl tracking-tight mb-6">
              {cohort.heroTitle} <br />
              <span style={{ color: cohort.accentHex }}>{cohort.heroHighlight}</span>
            </h1>
            
            <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-6 max-w-xl">
              {cohort.description || cohort.tagline}
            </p>

            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 ${
                isFollowing
                  ? "bg-white/5 text-white/60 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                  : "bg-white/10 text-white border border-white/20 hover:bg-[#0085FF] hover:border-[#0085FF] shadow-lg"
              }`}
            >
              {followLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-base" style={isFollowing ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {isFollowing ? "notifications_active" : "notifications"}
                  </span>
                  {isFollowing ? "Following ✓" : "Follow Domain"}
                </>
              )}
            </button>
          </div>
          
          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature: any, i: number) => (
               <div key={i} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl flex flex-col items-start gap-4 hover:border-white/20 transition-colors">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                   <span className="material-symbols-outlined text-sm" style={{ color: cohort.accentHex }}>{feature.icon || "star"}</span>
                 </div>
                 <div>
                   <h3 className="font-headline font-bold text-lg mb-1">{feature.title}</h3>
                   <p className="text-sm text-white/50">{feature.description}</p>
                 </div>
               </div>
            ))}
          </div>
        </section>

        {/* ═══ FREE EVENTS ═══ */}
        <section className="mb-24">
          <div className="mb-8 flex items-baseline justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-headline font-bold text-3xl md:text-4xl">Free Sessions & Events</h2>
              <p className="text-white/50 mt-2">Join our upcoming masterclasses and meetups.</p>
            </div>
          </div>
          
          <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src="https://luma.com/embed/calendar/cal-BKEujmH3HGliopK/events"
              width="100%"
              height="450"
              frameBorder="0"
              allowFullScreen={true}
              aria-hidden="false"
              tabIndex={0}
              className="bg-transparent"
            ></iframe>
          </div>
        </section>

        {/* ═══ PREMIUM WORKSHOPS ═══ */}
        <section>
          <div className="mb-8 flex items-baseline justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-white">Premium Workshops</h2>
              <p className="text-white/50 mt-2">Immersive {cohort.name} cohorts designed to get you hired.</p>
            </div>
          </div>

          {bundles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bundles.map((bundle: any) => (
                <div key={bundle.slug} className="group flex flex-col bg-[#0a0a0a] border border-white/10 hover:border-white/30 transition-all rounded-2xl overflow-hidden relative">
                  
                  <div className="h-1 w-full absolute top-0 left-0" style={{ backgroundColor: cohort.accentHex }}></div>
                  
                  <div className="p-8 flex-grow">
                    <div className="flex justify-between items-start mb-6">
                      <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                        <span className="text-xs uppercase tracking-widest font-bold text-white/70">{bundle.duration}</span>
                      </div>
                      {bundle.isDiscounted && (
                         <div className="px-3 py-1 bg-[#0085FF]/20 border border-[#0085FF]/30 rounded-full">
                           <span className="text-[10px] uppercase tracking-widest font-bold text-[#0085FF]">Limited Spots</span>
                         </div>
                      )}
                    </div>
                    
                    <h3 className="font-headline font-bold text-2xl mb-2">{bundle.name}</h3>
                    <p className="text-white/60 mb-8 h-12 line-clamp-2">{bundle.tagline}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div>
                         <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Starts</p>
                         <p className="font-headline font-bold text-sm tracking-wide">{bundle.startDate}</p>
                       </div>
                       <div>
                         <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Seats Left</p>
                         <p className="font-headline font-bold text-sm tracking-wide text-orange-400">{bundle.seatsLeft} / {bundle.maxSeats}</p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between group-hover:bg-white/[0.04] transition-colors">
                    <div>
                      <span className="text-xs text-white/40 line-through mr-2">₹{bundle.originalPrice}</span>
                      <span className="font-headline font-bold text-xl tracking-wide">₹{bundle.eventPrice}</span>
                    </div>
                    <Link 
                      href={`/workshop/${slug}/${bundle.slug}`}
                      className="px-6 py-3 bg-white text-black font-headline font-bold text-sm tracking-wide hover:bg-gray-200 transition-colors rounded-lg flex items-center gap-2"
                    >
                      View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#0a0a0a] border border-white/5 rounded-2xl">
              <p className="text-white/50">New premium workshops for this domain are launching soon.</p>
            </div>
          )}
        </section>

      </main>

      <footer className="border-t border-white/10 bg-black">
        <div className="max-w-[1100px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/">
             <img src="https://ik.imagekit.io/cotszrkgk/Screenshot_2025-06-25_at_9.10.56_PM-removebg-preview.png?updatedAt=1756648034230" alt="REvamp Logo" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
          </Link>
          <div className="flex gap-6">
            <a className="text-xs text-white/30 hover:text-white transition-colors" href="#">Terms</a>
            <a className="text-xs text-white/30 hover:text-white transition-colors" href="#">Privacy</a>
            <a className="text-xs text-white/30 hover:text-white transition-colors" href="mailto:hello@letsrevamp.in">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
