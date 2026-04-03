"use client"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useRef, useEffect, Suspense } from "react"
import { QRCodeSVG } from "qrcode.react"
import Navbar from "../../../components/Navbar"

const UPI_ID = "skhantis05@okhdfcbank"

function CheckoutContent() {
  const params     = useParams()
  const router     = useRouter()
  const domainSlug = params.domainSlug as string
  const workshopId = params.workshopId as string

  const [bundle, setBundle]         = useState<any>(null)
  const [cohort, setCohort]         = useState<any>(null)
  const [user, setUser]             = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const [step, setStep]                       = useState<"pay" | "upload" | "done">("pay")
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState("")
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [screenshotFile, setScreenshotFile]   = useState<File | null>(null)
  const [transactionId, setTransactionId]     = useState("")
  const [copied, setCopied]                   = useState(false)
  const [useBalance, setUseBalance]           = useState(false)
  const [availableBalance, setAvailableBalance] = useState(0)

  const appliedBalance = useBalance ? Math.min(availableBalance, bundle?.eventPrice || 0) : 0
  const finalPrice     = Math.max(0, (bundle?.eventPrice || 0) - appliedBalance)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkAuth = fetch("/api/user/auth/me")
      .then(r => r.json())
      .then(d => { 
        setUser(d.user); 
        setAuthChecked(true)
        if (d.user) {
          fetch("/api/user/dashboard")
            .then(res => res.json())
            .then(dashData => setAvailableBalance(dashData.availableBalance || 0))
            .catch(() => {})
        }
      })
      .catch(() => setAuthChecked(true))

    const fetchBundle = fetch(`/api/bundles?slug=${workshopId}`)
      .then(r => r.json())
      .then(d => { if (!d.error) { setBundle(d); setCohort(d.cohort) } })

    Promise.all([checkAuth, fetchBundle]).finally(() => setPageLoading(false))
  }, [workshopId])

  useEffect(() => {
    if (authChecked && !user && !pageLoading) {
      router.push(`/signup?returnTo=${encodeURIComponent(`/checkout/${domainSlug}/${workshopId}`)}`)
    }
  }, [authChecked, user, pageLoading, domainSlug, workshopId, router])

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setScreenshotFile(file)
      const reader = new FileReader()
      reader.onload = ev => setScreenshotPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleFreeRegistration = async () => {
    setLoading(true); setError("")
    try {
      const res  = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, domain: domainSlug, plan: workshopId, amount: 0 }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setStep("done")
    } catch { setError("Something went wrong. Please try again.") }
    finally { setLoading(false) }
  }

  const handlePaidSubmit = async () => {
    if (finalPrice > 0 && !transactionId && !screenshotFile) {
      setError("Please enter your UPI Transaction ID or upload a screenshot.")
      return
    }
    setLoading(true); setError("")
    try {
      const fd = new FormData()
      fd.append("userId",        user.id)
      fd.append("domain",        domainSlug)
      fd.append("plan",          workshopId)
      fd.append("amount",        String(bundle.eventPrice))
      fd.append("appliedBalance", String(appliedBalance))
      fd.append("step",          "PAYMENT")
      fd.append("transactionId", transactionId || "")
      if (screenshotFile && finalPrice > 0) fd.append("paymentProof", screenshotFile)

      const res  = await fetch("/api/checkout", { method: "POST", body: fd })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setStep("done")
    } catch { setError("Something went wrong. Please try again.") }
    finally { setLoading(false) }
  }

  if (pageLoading || !authChecked || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" />
        <span className="font-label text-xs tracking-widest text-white/30 uppercase">Loading checkout...</span>
      </div>
    )
  }

  if (!bundle || !cohort) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <p className="font-headline font-bold text-2xl">Workshop not found.</p>
        <Link href={`/cohort/${domainSlug}`} className="text-[#0085FF] text-sm hover:underline">← Back to domain</Link>
      </div>
    )
  }

  const accent       = cohort.accentHex || "#0085FF"
  const upiDeepLink  = `upi://pay?pa=${UPI_ID}&pn=REvamp&am=${finalPrice}&cu=INR&tn=${encodeURIComponent(`${cohort.name} - ${bundle.name}`)}`
  const stepIndex    = step === "pay" ? 0 : step === "upload" ? 1 : 2
  const stepsArr     = ["Pay", "Verify", "Done"]

  /* ─────────────────────────────────── FREE ──────────────────────────────── */
  if (bundle.eventPrice === 0) {
    return (
      <div className="min-h-screen bg-black text-white font-body">
        <Navbar />
        <div className="fixed top-0 left-0 right-0 z-40 h-0.5" style={{ background: accent }} />
        <main className="max-w-[560px] mx-auto px-8 pt-32 pb-24 text-center">
          {step === "done" ? (
            <div>
              <div
                className="w-20 h-20 flex items-center justify-center mx-auto mb-8 border"
                style={{ borderColor: `${accent}40`, background: `${accent}10` }}
              >
                <span className="material-symbols-outlined text-4xl" style={{ color: accent, fontVariationSettings: "'FILL' 1" }}>check</span>
              </div>
              <h2 className="font-headline font-bold text-4xl tracking-tight mb-3">You&apos;re In.</h2>
              <p className="text-white/50 text-lg leading-relaxed mb-10">
                Welcome to <span className="text-white font-bold">{bundle.name}</span>. You&apos;ve been registered.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/dashboard" className="block w-full py-4 font-headline font-bold text-sm tracking-widest uppercase text-white transition-all hover:opacity-90" style={{ background: accent }}>
                  Go to Dashboard →
                </Link>
                <Link href={`/cohort/${domainSlug}`} className="block w-full border border-white/10 text-white/50 py-4 font-headline font-bold text-sm tracking-widest uppercase hover:bg-white/5 hover:text-white transition-all">
                  Back to {cohort.name}
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-10 h-1 mx-auto mb-8" style={{ background: accent }} />
              <h2 className="font-headline font-bold text-4xl tracking-tight mb-2">Free Registration</h2>
              <p className="text-white/40 text-sm mb-1">{bundle.name}</p>
              <p className="text-white/30 text-xs mb-10">
                Logged in as <span className="text-white/60">{user.email}</span>
              </p>
              {error && (
                <div className="p-4 mb-6 border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error}
                </div>
              )}
              <button
                onClick={handleFreeRegistration}
                disabled={loading}
                className="w-full py-4 font-headline font-bold text-sm tracking-widest uppercase text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: accent }}
              >
                {loading ? "Registering..." : "Confirm Free Registration →"}
              </button>
            </div>
          )}
        </main>
      </div>
    )
  }

  /* ─────────────────────────────────── PAID ──────────────────────────────── */
  return (
    <div className="min-h-screen bg-black text-white font-body">
      <Navbar />
      <div className="fixed top-0 left-0 right-0 z-40 h-0.5" style={{ background: accent }} />

      <main className="max-w-[640px] mx-auto px-8 pt-32 pb-24">

        {/* ── User badge ── */}
        <div className="flex items-center justify-between mb-8 border border-white/10 p-4 bg-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center text-xs font-bold"
              style={{ background: `${accent}20`, color: accent }}
            >
              {user.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold font-headline leading-none">{user.name}</p>
              <p className="text-xs text-white/30 mt-0.5">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 border border-green-500/20 px-3 py-1">
            <span className="w-1.5 h-1.5 bg-green-500" />
            <span className="text-[10px] text-green-400 font-label tracking-widest uppercase font-bold">Verified</span>
          </div>
        </div>

        {/* ── Order summary ── */}
        <div
          className="border border-white/10 bg-[#0a0a0a] mb-8 overflow-hidden"
          style={{ borderTop: `3px solid ${accent}` }}
        >
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="font-label text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: accent }}>Purchasing</p>
              <h2 className="font-headline font-bold text-xl leading-tight">{bundle.name}</h2>
              <p className="text-white/40 text-xs mt-1">{cohort.name} · {bundle.duration}</p>
            </div>
            <div className="text-right">
              <p className="font-headline font-bold text-4xl tracking-tight" style={{ color: accent }}>
                ₹{bundle.eventPrice}
              </p>
              {bundle.isDiscounted && bundle.originalPrice && (
                <p className="text-white/30 text-xs line-through mt-0.5">₹{bundle.originalPrice}</p>
              )}
              <p className="text-white/30 text-[10px] tracking-wider uppercase mt-1">One-time</p>
            </div>
          </div>

          {availableBalance > 0 && (
            <div className="border-t border-white/5 p-4 bg-white/[0.02] flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors" onClick={() => setUseBalance(!useBalance)}>
              <div>
                <p className="text-sm font-bold text-[#FFD700] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">stars</span>
                  Referral Balance
                </p>
                <p className="text-xs text-white/40 mt-1">₹{availableBalance} Available</p>
              </div>
              <div className="flex items-center gap-3">
                {useBalance && (
                  <span className="text-sm font-bold text-green-400">-₹{appliedBalance}</span>
                )}
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${useBalance ? 'bg-[#FFD700]' : 'bg-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-black transition-transform duration-300 ${useBalance ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          )}

          {useBalance && (
            <div className="p-6 border-t border-[#FFD700]/10 bg-[#FFD700]/5 flex justify-between items-center">
              <p className="text-sm font-bold text-white/60">Final Amount To Pay</p>
              <p className="text-xl font-bold text-white">₹{finalPrice}</p>
            </div>
          )}
        </div>

        {/* ── Step indicator ── */}
        <div className="flex items-center mb-10">
          {stepsArr.map((s, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 flex items-center justify-center text-xs font-bold font-mono transition-all"
                  style={
                    i < stepIndex
                      ? { background: accent, color: "#000" }
                      : i === stepIndex
                      ? { background: accent, color: "#000" }
                      : { background: "transparent", color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.1)" }
                  }
                >
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span className={`font-label text-[10px] tracking-widest uppercase hidden sm:block ${i <= stepIndex ? "text-white" : "text-white/25"}`}>
                  {s}
                </span>
              </div>
              {i < stepsArr.length - 1 && (
                <div className="flex-1 h-px mx-4" style={{ background: i < stepIndex ? accent : "rgba(255,255,255,0.08)" }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="p-4 mb-6 border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex items-center gap-3">
            <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
            {error}
          </div>
        )}

        {/* ══════════ STEP 1: PAY ══════════ */}
        {step === "pay" && (
          <div className="space-y-6">

            {finalPrice === 0 ? (
                 <div className="border border-white/10 bg-[#0a0a0a] p-8 text-center pt-12 pb-12">
                   <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                     <span className="material-symbols-outlined text-green-400 text-3xl">check_circle</span>
                   </div>
                   <h3 className="font-headline font-bold text-2xl text-white mb-2">Fully Covered</h3>
                   <p className="text-white/50 text-sm mb-8">Your referral balance covers the full cost of this workshop. No manual payment required.</p>
                   <button
                     onClick={handlePaidSubmit}
                     disabled={loading}
                     className="max-w-[300px] w-full mx-auto block py-4 font-headline font-bold text-sm tracking-widest uppercase text-black hover:opacity-90 transition-all disabled:opacity-50"
                     style={{ background: "#FFD700" }}
                   >
                     {loading ? "Confirming..." : "Confirm & Enroll Now →"}
                   </button>
                 </div>
            ) : (
                <>
                {/* UPI amount + ID */}
                <div className="border border-white/10 bg-[#0a0a0a]">
                  <div className="p-8 text-center border-b border-white/5">
                    <p className="font-label text-[10px] tracking-[0.3em] text-white/30 uppercase mb-4">Pay using any UPI app</p>
                    <p className="font-headline font-bold text-6xl tracking-tight mb-1" style={{ color: accent }}>
                      ₹{finalPrice}
                    </p>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center gap-4 py-8 border-b border-white/5">
                    <div className="p-4 bg-white">
                      <QRCodeSVG
                        value={upiDeepLink}
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="H"
                      />
                    </div>
                    <p className="font-label text-[10px] tracking-[0.3em] text-white/30 uppercase">
                      Scan with GPay · PhonePe · Paytm
                    </p>
                  </div>

                  <div className="p-6">
                    <p className="font-label text-[10px] tracking-[0.3em] text-white/30 uppercase mb-3">Or pay via UPI ID</p>
                    <div className="flex items-center justify-between border border-white/10 bg-black px-5 py-4">
                      <code className="font-mono text-lg tracking-wide" style={{ color: "#FFD700" }}>{UPI_ID}</code>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 font-label text-[10px] tracking-widest uppercase transition-all px-3 py-1.5 border"
                        style={copied
                          ? { borderColor: `${accent}50`, color: accent }
                          : { borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
                        }
                      >
                        <span className="material-symbols-outlined text-xs">{copied ? "check" : "content_copy"}</span>
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <a
                      href={upiDeepLink}
                      className="flex items-center justify-center gap-2.5 w-full py-4 font-headline font-bold text-sm tracking-widest uppercase text-white transition-all hover:opacity-90"
                      style={{ background: accent }}
                    >
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                      Open UPI App & Pay ₹{finalPrice}
                    </a>
                    <p className="text-center text-white/20 text-xs mt-3 font-label tracking-wider">
                      GPay · PhonePe · Paytm · any UPI app
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="border border-white/5 bg-[#0a0a0a]">
                  <div className="px-6 pt-5 pb-2 border-b border-white/5">
                    <p className="font-label text-[10px] tracking-[0.3em] text-white/30 uppercase">How it works</p>
                  </div>
                  <div className="divide-y divide-white/5">
                    {[
                      { n: "01", text: <>Pay <span className="text-white font-bold">₹{finalPrice}</span> to <span className="font-mono text-xs bg-white/10 px-1.5 py-0.5">{UPI_ID}</span> via any UPI app</> },
                      { n: "02", text: <>Take a screenshot of the <span className="text-green-400 font-bold">successful</span> payment confirmation</> },
                      { n: "03", text: <>Upload it in the next step for <span className="text-white font-bold">instant verification</span></> },
                    ].map(({ n, text }) => (
                      <div key={n} className="flex items-start gap-4 px-6 py-4">
                        <span className="font-mono text-xs text-white/20 mt-0.5 flex-shrink-0 w-6">{n}</span>
                        <p className="text-white/50 text-sm leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep("upload")}
                  className="w-full py-4 font-headline font-bold text-sm tracking-widest uppercase border border-white/20 text-white hover:bg-white/5 transition-all"
                >
                  I&apos;ve Paid — Upload Proof →
                </button>
                </>
            )}
          </div>
        )}

        {/* ══════════ STEP 2: UPLOAD ══════════ */}
        {step === "upload" && (
          <div className="space-y-6">

            {/* Transaction ID */}
            <div>
              <label className="block font-label text-[10px] tracking-[0.3em] text-white/30 uppercase mb-3">
                UPI Transaction ID <span className="text-white/20 normal-case tracking-normal">(from your UPI app confirmation)</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={e => setTransactionId(e.target.value)}
                placeholder="e.g. 425619283745"
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-white/40 px-5 py-4 text-white placeholder:text-white/20 outline-none transition-all font-mono text-sm"
              />
            </div>

            {/* Screenshot upload */}
            <div>
              <label className="block font-label text-[10px] tracking-[0.3em] text-white/30 uppercase mb-3">
                Payment Screenshot
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-white/25 bg-[#0a0a0a] hover:bg-white/[0.02] p-10 text-center cursor-pointer transition-all"
              >
                {screenshotPreview ? (
                  <div className="space-y-4">
                    <img
                      src={screenshotPreview}
                      alt="Payment screenshot"
                      className="max-h-56 mx-auto object-contain border border-white/10"
                    />
                    <p className="text-white/30 text-xs font-label tracking-widest uppercase">Click to replace</p>
                  </div>
                ) : (
                  <div className="space-y-3 py-4">
                    <span className="material-symbols-outlined text-4xl text-white/20 block">upload_file</span>
                    <p className="text-white/50 text-sm font-medium">Click to upload payment screenshot</p>
                    <p className="text-white/20 text-xs font-label tracking-wider uppercase">PNG · JPG · WEBP</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleScreenshotUpload} className="hidden" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep("pay")}
                className="px-6 py-4 border border-white/10 text-white/40 font-headline font-bold text-xs tracking-widest uppercase hover:text-white hover:bg-white/5 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handlePaidSubmit}
                disabled={loading || (!transactionId && !screenshotFile)}
                className="flex-1 py-4 font-headline font-bold text-sm tracking-widest uppercase text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                style={{ background: "#22c55e" }}
              >
                {loading ? "Verifying..." : "Confirm & Submit →"}
              </button>
            </div>
          </div>
        )}

        {/* ══════════ STEP 3: DONE ══════════ */}
        {step === "done" && (
          <div className="text-center py-8">
            <div
              className="w-20 h-20 flex items-center justify-center mx-auto mb-8 border"
              style={{ borderColor: `${accent}40`, background: `${accent}10` }}
            >
              <span
                className="material-symbols-outlined text-4xl"
                style={{ color: accent, fontVariationSettings: "'FILL' 1" }}
              >
                check
              </span>
            </div>

            <h2 className="font-headline font-bold text-4xl tracking-tight mb-3">Payment Submitted.</h2>
            <p className="text-white/50 text-lg leading-relaxed mb-2 max-w-sm mx-auto">
              We&apos;ve received your proof for <span className="text-white font-bold">{bundle.name}</span>.
              Access activates within 2 hours.
            </p>
            <p className="text-white/30 text-xs mb-12 font-label tracking-wider">
              Receipt → <span className="text-white/50">{user.email}</span>
            </p>

            <div className="flex flex-col gap-3 mb-12">
              <Link
                href="/dashboard"
                className="block w-full py-4 font-headline font-bold text-sm tracking-widest uppercase text-white transition-all hover:opacity-90"
                style={{ background: accent }}
              >
                Go to Dashboard →
              </Link>
              <Link
                href={`/cohort/${domainSlug}`}
                className="block w-full border border-white/10 text-white/40 py-4 font-headline font-bold text-sm tracking-widest uppercase hover:bg-white/5 hover:text-white transition-all"
              >
                Back to {cohort.name}
              </Link>
            </div>

            {/* Referral nudge */}
            <div className="border border-[#FFD700]/20 bg-[#0a0a0a] p-6">
              <div className="w-6 h-1 bg-[#FFD700] mx-auto mb-4" />
              <p className="font-headline font-bold text-base text-[#FFD700] mb-2">
                Earn ₹100–200 per referral
              </p>
              <p className="text-white/40 text-sm">
                Get your unique referral link from the dashboard.
              </p>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-white/10 bg-black">
        <div className="max-w-[640px] mx-auto px-8 py-8 flex justify-between items-center">
          <p className="text-xs text-white/20 tracking-wider uppercase">© 2026 REVAMP</p>
          <div className="flex items-center gap-2 text-xs text-white/30 tracking-wider uppercase">
            <span className="material-symbols-outlined text-sm text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            Secure Checkout
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-black gap-3">
        <div className="w-6 h-6 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" />
        <span className="font-label text-xs tracking-widest text-white/30 uppercase">Loading...</span>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
