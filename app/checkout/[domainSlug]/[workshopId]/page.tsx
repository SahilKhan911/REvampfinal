"use client"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useRef, useEffect, Suspense } from "react"
import Navbar from "../../../components/Navbar"

const UPI_ID = "skhantis05@okhdfcbank"

function CheckoutContent() {
  const params = useParams()
  const router = useRouter()
  const domainSlug = params.domainSlug as string
  const workshopId = params.workshopId as string

  const [bundle, setBundle] = useState<any>(null)
  const [cohort, setCohort] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const [step, setStep] = useState<"pay" | "upload" | "done">("pay")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [transactionId, setTransactionId] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check auth + fetch bundle
  useEffect(() => {
    const checkAuth = fetch("/api/user/auth/me")
      .then(res => res.json())
      .then(data => {
        setUser(data.user)
        setAuthChecked(true)
      })
      .catch(() => setAuthChecked(true))

    const fetchBundle = fetch(`/api/bundles?slug=${workshopId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setBundle(data)
          setCohort(data.cohort)
        }
      })

    Promise.all([checkAuth, fetchBundle]).finally(() => setPageLoading(false))
  }, [workshopId])

  // Redirect to signup if not authenticated
  useEffect(() => {
    if (authChecked && !user && !pageLoading) {
      const returnUrl = `/checkout/${domainSlug}/${workshopId}`
      router.push(`/signup?returnTo=${encodeURIComponent(returnUrl)}`)
    }
  }, [authChecked, user, pageLoading, domainSlug, workshopId, router])

  if (pageLoading || !authChecked || !user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-sm font-medium">Loading checkout...</p>
      </div>
    )
  }

  if (!bundle || !cohort) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="font-headline font-bold text-3xl mb-4">Workshop Not Found</h1>
        <Link href={`/cohort/${domainSlug}`} className="text-[#0085FF] hover:underline">← Back to {domainSlug}</Link>
      </div>
    )
  }

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setScreenshotFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  // Free registration — just place order
  const handleFreeRegistration = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          domain: domainSlug,
          plan: workshopId,
          amount: 0,
        }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setStep("done")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Paid — send FormData with file
  const handlePaidSubmit = async () => {
    if (!transactionId && !screenshotFile) {
      setError("Please enter your UPI Transaction ID or upload a screenshot.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const fd = new FormData()
      fd.append('userId', user.id)
      fd.append('domain', domainSlug)
      fd.append('plan', workshopId)
      fd.append('amount', String(bundle.eventPrice))
      fd.append('step', 'PAYMENT')
      fd.append('transactionId', transactionId || '')
      if (screenshotFile) fd.append('paymentProof', screenshotFile)

      const res = await fetch("/api/checkout", {
        method: "POST",
        body: fd,
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setStep("done")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle free bundles
  if (bundle.eventPrice === 0) {
    return (
      <div className="min-h-screen bg-black text-white font-body selection:bg-[#0085FF]/30">
        <Navbar />
        <main className="max-w-[600px] mx-auto px-6 pt-28 pb-20">
          <div className="text-center">
            {step === "done" ? (
              <div className="animate-in zoom-in-95 duration-700 fade-in">
                <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(74,222,128,0.2)]">
                  <span className="material-symbols-outlined text-5xl text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h2 className="font-headline font-bold text-4xl md:text-5xl tracking-tight mb-4">You're In!</h2>
                <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md mx-auto">Welcome to {bundle.name}. You've been registered successfully.</p>
                <div className="space-y-4 max-w-sm mx-auto">
                  <Link href="/dashboard" className="block w-full bg-[#0085FF] rounded-xl text-white py-4 font-headline font-bold text-sm tracking-widest uppercase hover:bg-[#0070DD] transition-all">Go to Dashboard →</Link>
                  <Link href={`/cohort/${domainSlug}`} className="block w-full border border-white/10 rounded-xl text-white/60 py-4 font-headline font-bold text-sm tracking-widest uppercase hover:bg-white/5">Back to Hub</Link>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-[#0085FF]/10 border border-[#0085FF]/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <span className="material-symbols-outlined text-4xl text-[#0085FF]">celebration</span>
                </div>
                <h2 className="font-headline font-bold text-4xl tracking-tight mb-2">Free Registration</h2>
                <p className="text-white/60 text-lg mb-2">{bundle.name}</p>
                <p className="text-white/40 text-sm mb-8">Logged in as <span className="text-[#0085FF] font-medium">{user.email}</span></p>
                {error && <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-3 rounded-lg">{error}</p>}
                <button onClick={handleFreeRegistration} disabled={loading} className="w-full max-w-sm mx-auto bg-[#0085FF] rounded-xl text-white py-4 font-headline font-bold text-sm tracking-widest uppercase hover:bg-[#0070DD] transition-all disabled:opacity-50 shadow-lg">
                  {loading ? "Registering..." : "Confirm Free Registration →"}
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    )
  }

  const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=REvamp&am=${bundle.eventPrice}&cu=INR&tn=${encodeURIComponent(`${cohort.name} - ${bundle.name}`)}`

  const stepsArr = ["Pay", "Verify", "Done"]
  const currentStepIndex = step === "pay" ? 0 : step === "upload" ? 1 : 2

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-[#0085FF]/30">
      <Navbar />

      <main className="max-w-[700px] mx-auto px-6 pt-28 pb-20">

        {/* ═══ AUTH BADGE ═══ */}
        <div className="flex items-center justify-between mb-8 p-4 bg-[#0a0a0a] border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0085FF]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0085FF]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>
            <div>
              <p className="text-sm font-bold">{user.name}</p>
              <p className="text-xs text-white/40">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <span className="material-symbols-outlined text-green-400 text-xs">verified</span>
            <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Verified</span>
          </div>
        </div>

        {/* ═══ ORDER SUMMARY ═══ */}
        <div className="p-6 bg-[#0a0a0a] border border-white/10 mb-8 rounded-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0085FF]/5 blur-3xl rounded-full"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <p className="font-label text-[10px] tracking-wider text-[#0085FF] uppercase mb-2 bg-[#0085FF]/10 inline-block px-2 py-1 rounded">Purchasing</p>
              <h2 className="font-headline font-bold text-2xl mb-1">{bundle.name}</h2>
              <p className="text-white/50 text-sm">{cohort.name} • {bundle.duration}</p>
            </div>
            <div className="md:text-right border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
              <p className="font-headline font-bold text-4xl text-[#0085FF]">₹{bundle.eventPrice}</p>
              <p className="text-white/30 text-xs mt-1">One-time payment</p>
            </div>
          </div>
        </div>

        {/* ═══ STEP INDICATOR ═══ */}
        <div className="flex items-center gap-0 mb-10">
          {stepsArr.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i <= currentStepIndex
                  ? "bg-[#0085FF] text-white shadow-[0_0_15px_rgba(0,133,255,0.4)]"
                  : "bg-white/5 text-white/30 border border-white/10"
              }`}>
                {i < currentStepIndex ? "✓" : i + 1}
              </div>
              <span className={`ml-2 font-label text-[10px] tracking-wider uppercase hidden sm:inline-block ${
                i <= currentStepIndex ? "text-white" : "text-white/30"
              }`}>{s}</span>
              {i < stepsArr.length - 1 && <div className="flex-1 h-px bg-white/10 mx-4" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        {/* ═══ STEP 1: UPI PAYMENT ═══ */}
        {step === "pay" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div className="p-8 bg-[#0a0a0a] border border-white/10 rounded-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-[#0085FF]/5 to-transparent blur-2xl"></div>
              <div className="relative z-10">
                <p className="font-label text-xs tracking-wider text-white/40 uppercase mb-4">Pay using any UPI app</p>
                <div className="font-headline font-bold text-6xl text-[#0085FF] mb-8">₹{bundle.eventPrice}</div>
                <div className="bg-black/50 border border-white/5 rounded-xl p-4 mb-8 backdrop-blur-sm max-w-sm mx-auto">
                  <p className="font-label text-[10px] tracking-wider text-white/30 uppercase mb-2">UPI ID</p>
                  <div className="flex items-center justify-center gap-3">
                    <code className="font-mono text-xl text-[#FFD700] tracking-wide">{UPI_ID}</code>
                    <button onClick={() => navigator.clipboard.writeText(UPI_ID)} className="text-white/40 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all" title="Copy UPI ID">
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                  </div>
                </div>
                <a href={upiDeepLink} className="inline-block w-full bg-[#0085FF] rounded-xl text-white py-4 font-headline font-bold text-sm tracking-widest uppercase hover:bg-[#0070DD] shadow-[0_0_20px_rgba(0,133,255,0.3)] transition-all mb-4 group">
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">account_balance</span>
                    Open UPI App & Pay ₹{bundle.eventPrice}
                  </span>
                </a>
                <p className="text-white/30 text-xs">Seamless payment via GPay · PhonePe · Paytm</p>
              </div>
            </div>

            <div className="space-y-3 bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
              <h3 className="font-headline font-bold text-sm text-white/60 uppercase tracking-widest mb-4">How it works</h3>
              {[
                { step: "1", text: <>Open any UPI app and pay <span className="text-white font-bold">₹{bundle.eventPrice}</span> to <span className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded text-xs">{UPI_ID}</span></> },
                { step: "2", text: <>Take a screenshot of the <span className="text-green-400 font-bold">successful</span> payment confirmation</> },
                { step: "3", text: <>Upload the screenshot in the next step for <span className="text-white font-bold tracking-wide">instant verification</span></> },
              ].map(({ step: s, text }, i) => (
                <div key={i}>
                  <div className="flex items-start gap-4">
                    <span className="bg-[#0085FF]/20 text-[#0085FF] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{s}</span>
                    <p className="text-white/60 text-sm mt-0.5">{text}</p>
                  </div>
                  {i < 2 && <div className="pl-3 py-1 border-l-2 border-white/5 ml-3"></div>}
                </div>
              ))}
            </div>

            <button onClick={() => setStep("upload")} className="w-full bg-[#0085FF] text-white rounded-xl py-4 font-headline font-bold text-sm tracking-widest uppercase hover:bg-[#0070DD] transition-all group">
              I've Paid — Upload Proof →
            </button>
          </div>
        )}

        {/* ═══ STEP 2: UPLOAD SCREENSHOT ═══ */}
        {step === "upload" && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 fade-in">
            <div>
              <label className="block font-label text-[10px] tracking-wider text-white/40 uppercase mb-2 ml-1">UPI Transaction ID <span className="text-white/20 normal-case">(from confirmation screen)</span></label>
              <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="e.g. 425619283745" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl focus:border-[#0085FF] px-5 py-4 text-white placeholder:text-white/20 outline-none transition-all font-mono" />
            </div>

            <div>
              <label className="block font-label text-[10px] tracking-wider text-white/40 uppercase mb-2 ml-1">Payment Screenshot Proof</label>
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 hover:border-[#0085FF]/50 hover:bg-[#0085FF]/5 rounded-2xl p-10 text-center cursor-pointer transition-all bg-[#0a0a0a] group">
                {screenshotPreview ? (
                  <div className="space-y-4">
                    <img src={screenshotPreview} alt="Payment screenshot" className="max-h-64 mx-auto object-contain rounded-xl shadow-lg border border-white/10" />
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider">Click to replace image</p>
                  </div>
                ) : (
                  <div className="space-y-4 py-8">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined text-3xl text-white/30 group-hover:text-[#0085FF] transition-colors">cloud_upload</span>
                    </div>
                    <p className="text-white/60 font-medium">Click to upload payment screenshot</p>
                    <p className="text-white/20 text-xs uppercase tracking-wider">PNG, JPG, or WEBP formats</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleScreenshotUpload} className="hidden" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <button onClick={() => setStep("pay")} className="w-full sm:w-1/3 border border-white/10 text-white/50 rounded-xl py-4 font-headline font-bold text-xs uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all order-2 sm:order-1">Back</button>
               <button onClick={handlePaidSubmit} disabled={loading || (!transactionId && !screenshotFile)} className="w-full sm:w-2/3 bg-green-500 hover:bg-green-400 text-black rounded-xl py-4 font-headline font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                 {loading ? "Verifying..." : "Confirm & Submit →"}
               </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: DONE ═══ */}
        {step === "done" && (
          <div className="text-center py-16 animate-in zoom-in-95 duration-700 fade-in">
            <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(74,222,128,0.2)]">
              <span className="material-symbols-outlined text-5xl text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h2 className="font-headline font-bold text-4xl md:text-5xl tracking-tight mb-4">Payment Submitted!</h2>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-4 max-w-md mx-auto">We've received your payment proof for {bundle.name}. Your access will be activated within 2 hours after verification.</p>
            <p className="text-white/40 text-sm mb-12 bg-white/5 py-2 px-4 rounded-full inline-block">
              Receipt sent to <span className="text-[#0085FF] font-medium">{user.email}</span>
            </p>

            <div className="space-y-4 max-w-sm mx-auto">
              <Link href="/dashboard" className="block w-full bg-[#0085FF] rounded-xl text-white py-4 font-headline font-bold text-sm tracking-widest uppercase hover:bg-[#0070DD] transition-all shadow-lg">
                Go to Dashboard →
              </Link>
              <Link href={`/cohort/${domainSlug}`} className="block w-full border border-white/10 rounded-xl text-white/60 py-4 font-headline font-bold text-sm tracking-widest uppercase hover:bg-white/5 hover:text-white transition-all">
                Return to Hub
              </Link>
            </div>

            <div className="mt-16 p-6 bg-gradient-to-br from-[#0a0a0a] to-[#2a2000]/20 border border-[#FFD700]/20 rounded-2xl relative overflow-hidden backdrop-blur-md">
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-[#FFD700] opacity-5 rotate-12">volunteer_activism</span>
              <p className="font-headline font-bold text-lg text-[#FFD700] mb-2 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">payments</span> 
                Earn ₹100-200 per referral
              </p>
              <p className="text-white/50 text-sm max-w-xs mx-auto">Go to your dashboard to get your unique referral link.</p>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-white/5 bg-black py-8">
        <div className="max-w-[700px] mx-auto px-6 flex justify-between items-center text-white/30 text-xs uppercase tracking-widest font-bold">
          <p>© 2026 REvamp</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-green-500">lock</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-8 h-8 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
