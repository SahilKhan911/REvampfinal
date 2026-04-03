"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Script from "next/script"
import { Suspense } from "react"

/** Small inline indicator showing referral will be applied */
function ReferralInline() {
    const [referrerName, setReferrerName] = useState<string | null>(null)

    useEffect(() => {
        const match = document.cookie.match(/ref_display=([^;]+)/)
        const code = match?.[1]
        if (!code) return

        fetch(`/api/referral/validate?code=${encodeURIComponent(code)}`)
            .then((r) => r.json())
            .then((d) => {
                if (d.valid && d.name) setReferrerName(d.name.split(" ")[0])
            })
            .catch(() => {})
    }, [])

    if (!referrerName) return null

    return (
        <div className="flex items-center gap-2 p-3 mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
            <span>✅</span>
            <span>Referral by <strong>{referrerName}</strong> will be applied to your account</span>
        </div>
    )
}

declare global {
    interface Window {
        google: any
    }
}

const GOOGLE_CLIENT_ID = "786534621902-png3g8k7du9bthl9fsiglmdko8os0fug.apps.googleusercontent.com"

function SignupContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const returnTo = searchParams.get("returnTo")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" })

    const handleGoogleResponse = useCallback(async (response: any) => {
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/user/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: response.credential }),
            }).then((r) => r.json())
            if (res.error) {
                setError(res.error)
            } else {
                router.push(returnTo || "/dashboard")
            }
        } catch {
            setError("Google sign-in failed. Try again.")
        } finally {
            setLoading(false)
        }
    }, [router, returnTo])

    const onGoogleScriptLoad = useCallback(() => {
        if (window.google?.accounts?.id) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response: any) => handleGoogleResponse(response),
            })
            window.google.accounts.id.renderButton(
                document.getElementById("google-signup-btn"),
                { theme: "filled_black", size: "large", width: 400, text: "signup_with", shape: "rectangular" }
            )
        }
    }, [handleGoogleResponse])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/user/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            }).then((r) => r.json())
            if (res.error) {
                setError(res.error)
            } else {
                router.push(returnTo || "/dashboard")
            }
        } catch {
            setError("Something went wrong. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={onGoogleScriptLoad} />

            <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">

                {/* ═══ LEFT HALF: BRANDING ═══ */}
                <section className="relative w-full md:w-1/2 bg-black flex flex-col justify-between p-8 md:p-16 overflow-hidden min-h-[300px] md:min-h-screen">
                    <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

                    <div className="relative z-10">
                        <Link href="/" className="inline-block relative">
                            <img
                                src="https://ik.imagekit.io/cotszrkgk/Screenshot_2025-06-25_at_9.10.56_PM-removebg-preview.png?updatedAt=1756648034230"
                                alt="REvamp"
                                className="h-16 md:h-20 w-auto"
                            />
                        </Link>
                    </div>

                    <div className="relative z-10 mt-12 mb-12">
                        <h1 className="font-headline font-black text-[12vw] md:text-[7vw] leading-[0.85] text-white tracking-tighter uppercase">
                            JOIN<br />THE<br />COLLECTIVE.
                        </h1>
                        <p className="mt-6 font-headline font-bold text-[#0085FF] text-xl md:text-2xl tracking-widest uppercase text-glow-blue">
                            Your upgrade starts here.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="h-[2px] w-12 bg-[#0085FF]" />
                        <span className="font-label text-xs tracking-[0.3em] text-white/50 uppercase">CREATE ACCOUNT</span>
                    </div>

                    <div className="absolute -right-20 bottom-0 w-96 h-96 opacity-20 pointer-events-none">
                        <div className="w-full h-full bg-[#0085FF] blur-[120px]" />
                    </div>

                    <p className="absolute bottom-8 left-8 font-label text-[9px] tracking-[0.2em] text-white/30 uppercase z-10">©2026 REVAMP TECH COLLECTIVE. ALL RIGHTS RESERVED.</p>
                </section>

                {/* ═══ RIGHT HALF: SIGNUP FORM ═══ */}
                <section className="w-full md:w-1/2 bg-[#fff9ef] flex flex-col justify-center items-center p-8 md:p-20">
                    <div className="w-full max-w-md">

                        <Link href="/" className="inline-flex items-center gap-2 font-label font-bold text-[#353535] hover:text-[#0085FF] transition-colors mb-10 group">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            <span className="text-xs tracking-widest uppercase">Back to Home</span>
                        </Link>

                        <header className="mb-8">
                            <h2 className="font-headline font-black text-5xl text-[#131313] tracking-tighter uppercase mb-2">SIGN UP</h2>
                            <p className="font-body text-[#131313]/60 text-sm">Create your account to join workshops &amp; access your dashboard.</p>
                        </header>

                        {/* Inline referral indicator */}
                        <ReferralInline />

                        {error && (
                            <div className="p-3 mb-6 text-sm text-red-700 bg-red-100 border-2 border-red-300">
                                {error}
                            </div>
                        )}

                        {/* Google Sign-In */}
                        <div id="google-signup-btn" className="flex justify-center mb-4" />

                        {/* Divider */}
                        <div className="relative my-8 flex items-center">
                            <div className="flex-grow border-t border-[#131313]/10" />
                            <span className="mx-4 font-label text-[10px] text-[#131313]/40 tracking-[0.4em] uppercase">OR</span>
                            <div className="flex-grow border-t border-[#131313]/10" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group">
                                <label className="block font-label font-bold text-[10px] tracking-widest text-[#131313]/50 uppercase mb-2 group-focus-within:text-[#0085FF] transition-colors" htmlFor="name">FULL NAME</label>
                                <input
                                    required type="text" id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Aryan Sharma"
                                    className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-[#131313]/20 focus:border-[#0085FF] py-3 px-0 font-body text-[#131313] placeholder:text-[#131313]/20 transition-all duration-300 outline-none focus:shadow-[0_4px_10px_-2px_rgba(0,133,255,0.3)]"
                                />
                            </div>
                            <div className="group">
                                <label className="block font-label font-bold text-[10px] tracking-widest text-[#131313]/50 uppercase mb-2 group-focus-within:text-[#0085FF] transition-colors" htmlFor="signup-email">EMAIL ADDRESS</label>
                                <input
                                    required type="email" id="signup-email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="aryan@example.com"
                                    className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-[#131313]/20 focus:border-[#0085FF] py-3 px-0 font-body text-[#131313] placeholder:text-[#131313]/20 transition-all duration-300 outline-none focus:shadow-[0_4px_10px_-2px_rgba(0,133,255,0.3)]"
                                />
                            </div>
                            <div className="group">
                                <label className="block font-label font-bold text-[10px] tracking-widest text-[#131313]/50 uppercase mb-2 group-focus-within:text-[#0085FF] transition-colors" htmlFor="phone">PHONE NUMBER</label>
                                <input
                                    required type="tel" id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                    className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-[#131313]/20 focus:border-[#0085FF] py-3 px-0 font-body text-[#131313] placeholder:text-[#131313]/20 transition-all duration-300 outline-none focus:shadow-[0_4px_10px_-2px_rgba(0,133,255,0.3)]"
                                />
                            </div>
                            <div className="group">
                                <label className="block font-label font-bold text-[10px] tracking-widest text-[#131313]/50 uppercase mb-2 group-focus-within:text-[#0085FF] transition-colors" htmlFor="signup-password">SET PASSWORD</label>
                                <input
                                    required type="password" id="signup-password" minLength={6}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••••••"
                                    className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-[#131313]/20 focus:border-[#0085FF] py-3 px-0 font-body text-[#131313] placeholder:text-[#131313]/20 transition-all duration-300 outline-none focus:shadow-[0_4px_10px_-2px_rgba(0,133,255,0.3)]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#0085FF] text-white py-5 px-8 font-headline font-black text-sm tracking-[0.3em] uppercase hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#0085FF]/20 border-none disabled:opacity-50"
                            >
                                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="font-body text-xs text-[#131313]/60">
                                Already have an account?{" "}
                                <Link
                                    href={returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login"}
                                    className="font-bold text-[#0085FF] hover:underline underline-offset-4 decoration-2"
                                >
                                    Log in
                                </Link>
                            </p>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <div className="flex items-center gap-2 px-4 py-2 border border-[#FFD700]/20 bg-[#FFD700]/5">
                                <span className="material-symbols-outlined text-[#FFD700] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                <span className="font-label font-bold text-[9px] tracking-[0.2em] text-[#FFD700] uppercase">2,000+ Students Joined</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <SignupContent />
        </Suspense>
    )
}
