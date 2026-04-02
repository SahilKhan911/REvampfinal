"use client"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Navbar from "../../../components/Navbar"

export default function WorkshopPage() {
  const params = useParams()
  const domainSlug = params.domainSlug as string
  const workshopId = params.workshopId as string

  const [bundle, setBundle] = useState<any>(null)
  const [cohort, setCohort] = useState<any>(null)
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!bundle || !cohort) {
    return (
       <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
          <h1 className="font-headline text-2xl font-bold mb-4">Workshop Not Found</h1>
          <Link href={`/cohort/${domainSlug}`} className="text-[#0085FF] underline">Return to Domain Hub</Link>
       </div>
    )
  }

  const highlights = Array.isArray(bundle.highlights) ? bundle.highlights : []
  const curriculum = Array.isArray(bundle.curriculum) ? bundle.curriculum : []
  const outcomes = Array.isArray(bundle.outcomes) ? bundle.outcomes : []

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-[#0085FF]/30 pb-32">
      <Navbar />

      <main className="max-w-[800px] mx-auto px-6 pt-32">
        
        {/* ═══ HERO ═══ */}
        <section className="mb-20">
          <Link href={`/cohort/${domainSlug}`} className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold tracking-wide uppercase mb-10">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to {cohort.name}
          </Link>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cohort.accentHex }}></span>
            <span className="text-xs uppercase tracking-widest font-bold text-white/70">{bundle.duration} Intensive</span>
          </div>

          <h1 className="font-headline font-bold text-4xl md:text-6xl tracking-tight mb-6 leading-tight">
            {bundle.name}
          </h1>
          
          <p className="text-white/70 text-lg md:text-2xl leading-relaxed mb-10 max-w-2xl font-light">
            {bundle.tagline}
          </p>

          <div className="flex flex-wrap gap-4 mb-12 border-y border-white/10 py-6">
             <div className="flex items-center gap-3 w-full sm:w-auto pr-8">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                   <span className="material-symbols-outlined text-[#0085FF]">calendar_month</span>
                </div>
                <div>
                   <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Starts</p>
                   <p className="font-headline font-bold">{bundle.startDate}</p>
                </div>
             </div>
             <div className="flex items-center gap-3 w-full sm:w-auto pr-8">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                   <span className="material-symbols-outlined text-[#0085FF]">schedule</span>
                </div>
                <div>
                   <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Schedule</p>
                   <p className="font-headline font-bold">{bundle.schedule}</p>
                </div>
             </div>
          </div>
        </section>


        {/* ═══ HIGHLIGHTS ═══ */}
        {highlights.length > 0 && (
          <section className="mb-20">
            <h2 className="font-headline font-bold text-2xl md:text-3xl tracking-tight mb-8">What You'll Unlock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((highlight: string, index: number) => (
                <div key={index} className="flex gap-4 p-5 bg-[#0a0a0a] border border-white/5 rounded-xl">
                   <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                   <p className="text-white/80">{highlight}</p>
                </div>
              ))}
            </div>
          </section>
        )}


        {/* ═══ CURRICULUM ═══ */}
        {curriculum.length > 0 && (
          <section className="mb-20">
            <h2 className="font-headline font-bold text-2xl md:text-3xl tracking-tight mb-8">Detailed Curriculum</h2>
            <div className="space-y-4">
              {curriculum.map((weekData: any, index: number) => (
                <div key={index} className="border border-white/10 rounded-2xl bg-[#0a0a0a] overflow-hidden">
                   <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                      <div className="inline-block px-2 py-1 bg-white/10 rounded text-[10px] uppercase tracking-widest font-bold mb-3">{weekData.week}</div>
                      <h3 className="font-headline font-bold text-xl">{weekData.title}</h3>
                   </div>
                   {weekData.topics && (
                     <div className="p-6">
                        <ul className="space-y-3">
                           {weekData.topics.map((topic: string, tIdx: number) => (
                              <li key={tIdx} className="flex items-start gap-3">
                                 <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0"></span>
                                 <span className="text-white/70">{topic}</span>
                              </li>
                           ))}
                        </ul>
                     </div>
                   )}
                </div>
              ))}
            </div>
          </section>
        )}


        {/* ═══ OUTCOMES ═══ */}
        {outcomes.length > 0 && (
          <section className="mb-20">
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#0a0a0a] to-black border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#0085FF]/10 blur-[100px] rounded-full pointer-events-none"></div>
               
               <h2 className="font-headline font-bold text-3xl tracking-tight mb-8 relative z-10">Outcomes</h2>
               <ul className="space-y-4 relative z-10">
                 {outcomes.map((outcome: string, index: number) => (
                   <li key={index} className="flex gap-4 items-center">
                      <span className="material-symbols-outlined text-[#0085FF] rotate-45">push_pin</span>
                      <span className="text-lg font-medium tracking-wide">{outcome}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </section>
        )}


        {/* ═══ REGISTRATION CTA ═══ */}
        <section id="register" className="pt-10 border-t border-white/10">
          <h2 className="font-headline font-bold text-3xl tracking-tight mb-8 text-center text-white/90">Secure Your Spot</h2>
          
          <div className="max-w-md mx-auto bg-[#0a0a0a] border-2 border-white/10 rounded-2xl p-8 relative shadow-2xl overflow-hidden">
            {bundle.isDiscounted && (
               <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-green-500/30">
                  Special Offer
               </div>
            )}
            
            <div className="mb-8">
               <h3 className="font-headline font-bold text-2xl mb-1 mt-4">{bundle.name}</h3>
               <p className="text-white/50 text-sm mb-6">Complete {bundle.duration?.toLowerCase()} access + all resources.</p>
               
               <div className="flex items-baseline gap-3 mb-2">
                 <span className="font-headline font-bold text-5xl tracking-tighter">₹{bundle.eventPrice}</span>
                 {bundle.isDiscounted && <span className="text-white/30 line-through text-xl">₹{bundle.originalPrice}</span>}
               </div>
               
               {bundle.seatsLeft && (
                 <div className="flex items-center gap-2 text-sm text-orange-400 mt-4">
                    <span className="material-symbols-outlined text-sm">local_fire_department</span>
                    <span className="font-medium">Selling fast: Only {bundle.seatsLeft} of {bundle.maxSeats} seats remaining!</span>
                 </div>
               )}
            </div>
            
            <Link 
              href={`/checkout/${domainSlug}/${workshopId}`}
              className="block w-full text-center py-4 bg-[#0085FF] hover:bg-[#0070DD] transition-colors text-white font-headline font-bold text-sm uppercase tracking-widest rounded-xl"
            >
              Checkout Now →
            </Link>
          </div>
        </section>

      </main>
    </div>
  )
}
