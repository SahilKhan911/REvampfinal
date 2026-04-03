"use client"

import { useEffect, useState } from "react"

export default function ReferralBanner() {
  const [referrerName, setReferrerName] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Read the non-httpOnly ref_display cookie
    const match = document.cookie.match(/ref_display=([^;]+)/)
    const code = match?.[1]
    if (!code) return

    // Check if already dismissed this session
    if (sessionStorage.getItem("ref_banner_dismissed") === "1") {
      setDismissed(true)
      return
    }

    // Validate the code and get referrer name
    fetch(`/api/referral/validate?code=${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.valid && d.name) {
          setReferrerName(d.name.split(" ")[0]) // First name only
        }
      })
      .catch(() => {})
  }, [])

  if (!referrerName || dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem("ref_banner_dismissed", "1")
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-2.5 px-4 flex items-center justify-center gap-3 text-sm font-bold shadow-lg shadow-[#FFD700]/20 animate-fade-in-up">
      <span className="text-base">🎁</span>
      <span className="font-headline tracking-tight">
        Referred by <span className="underline underline-offset-2">{referrerName}</span> — they&apos;ll earn a reward when you join!
      </span>
      <button
        onClick={handleDismiss}
        className="ml-4 w-6 h-6 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors text-black/60 hover:text-black text-xs"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}
