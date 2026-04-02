"use client"
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="min-h-screen bg-black text-white font-body flex flex-col">

      {/* ═══ NAV ═══ */}
      <nav className="sticky top-0 z-50 bg-black flex justify-between items-center w-full px-6 py-4">
        <Link href="/" className="inline-block relative">
          <img
            src="https://ik.imagekit.io/cotszrkgk/Screenshot_2025-06-25_at_9.10.56_PM-removebg-preview.png?updatedAt=1756648034230"
            alt="REvamp"
            className="h-16 md:h-20 w-auto"
          />
        </Link>
        <Link href="/" className="font-label font-bold uppercase tracking-tighter text-white/40 hover:bg-[#0085FF] hover:text-white transition-none px-4 py-1 text-sm">
          BACK TO HOME
        </Link>
      </nav>

      {/* ═══ MAIN CANVAS ═══ */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-20 brutalist-grid">

        {/* Status Icon */}
        <div className="mb-12 flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#FFD700]/20 blur-3xl group-hover:bg-[#FFD700]/30 transition-all" />
            <span className="material-symbols-outlined text-[120px] text-[#FFD700] pulse-slow relative z-10 block">hourglass_empty</span>
          </div>
        </div>

        {/* Typography Header */}
        <div className="text-center max-w-6xl mb-20">
          <h1 className="font-headline font-black text-6xl md:text-[8rem] leading-[0.85] tracking-tighter uppercase mb-8 text-glow-gold">
            PAYMENT UNDER<br />VERIFICATION
          </h1>
          <p className="font-body text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            We&apos;ve received your payment details. Our team will verify your transaction shortly.
          </p>
        </div>

        {/* Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">

          {/* STATUS CARD */}
          <div className="bg-[#0e0e0e] p-12 flex flex-col items-center text-center group hover:bg-[#1f1f1f] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 bg-[#FFD700] pulse-slow" />
              <span className="font-headline font-bold tracking-widest text-[#FFD700] text-sm uppercase">PENDING VERIFICATION</span>
            </div>
            <h3 className="font-headline font-bold text-3xl text-white uppercase mb-4 tracking-tight">TRANSACTION STATUS</h3>
            <p className="text-white/60 text-lg leading-snug">
              We&apos;re verifying your transaction. You will receive an email within <span className="text-white font-bold">24 HOURS</span>.
            </p>
          </div>

          {/* WHAT'S NEXT CARD */}
          <div className="bg-[#0e0e0e] p-12 flex flex-col items-center text-center group hover:bg-[#1f1f1f] transition-colors duration-300">
            <span className="material-symbols-outlined text-[#0085FF] text-5xl mb-6 block">mail</span>
            <h3 className="font-headline font-bold text-3xl text-white uppercase mb-4 tracking-tight">CHECK YOUR EMAIL</h3>
            <p className="text-white/60 text-lg leading-snug">
              Check your email for <span className="text-white font-bold">workshop access details</span>, a <span className="text-white font-bold">WhatsApp group invite</span>, and your <span className="text-white font-bold">unique referral code</span>.
            </p>
          </div>

        </div>

        {/* Back Link */}
        <div className="mt-24">
          <Link href="/" className="group flex items-center gap-4 text-white/40 hover:text-[#0085FF] transition-all duration-300 font-headline font-bold text-lg uppercase tracking-widest">
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-2">arrow_back</span>
            ← BACK TO HOME
          </Link>
        </div>
      </main>

      {/* Visual Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent" />

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#0e0e0e] flex flex-col md:flex-row justify-between items-center w-full px-8 py-12">
        <div className="text-white mb-4 md:mb-0 text-lg tracking-tighter font-black font-headline">
          REVAMP SYSTEM
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <span className="text-white/30 font-label text-xs uppercase tracking-widest">© 2026 REVAMP SYSTEM. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-2 text-[#FFD700] font-label text-xs uppercase tracking-widest font-bold">
            <span className="w-2 h-2 bg-[#FFD700] animate-pulse" />
            SYSTEM STATUS: OPERATIONAL
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
