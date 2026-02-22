"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { LogIn, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Script from "next/script"

declare global {
    interface Window {
        google: any
        handleGoogleResponse: (response: any) => void
    }
}

const GOOGLE_CLIENT_ID = "786534621902-png3g8k7du9bthl9fsiglmdko8os0fug.apps.googleusercontent.com"

export default function UserLoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({ email: "", password: "" })

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
                router.push("/dashboard")
            }
        } catch {
            setError("Google sign-in failed. Try again.")
        } finally {
            setLoading(false)
        }
    }, [router])

    const onGoogleScriptLoad = useCallback(() => {
        if (window.google?.accounts?.id) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response: any) => handleGoogleResponse(response),
            })
            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-btn"),
                {
                    theme: "filled_black",
                    size: "large",
                    width: 350,
                    text: "continue_with",
                    shape: "pill",
                }
            )
        }
    }, [handleGoogleResponse])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/user/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            }).then((r) => r.json())

            if (res.error) {
                setError(res.error)
            } else {
                router.push("/dashboard")
            }
        } catch {
            setError("Something went wrong. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={onGoogleScriptLoad}
            />

            <div className="flex items-center justify-center min-h-screen bg-black px-6">
                <div className="w-full max-w-md">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>

                    <div className="p-8 border border-white/10 rounded-2xl bg-gray-950 shadow-2xl">
                        <div className="flex items-center justify-center w-12 h-12 mb-6 bg-blue-600/10 rounded-xl mx-auto">
                            <LogIn className="w-6 h-6 text-blue-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
                        <p className="text-center text-gray-500 text-sm mb-8">
                            Log in to view your orders, referrals, and earnings.
                        </p>

                        {error && (
                            <div className="p-3 mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Google Sign-In */}
                        <div id="google-signin-btn" className="flex justify-center mb-6" />
                        <div className="flex items-center mb-6">
                            <div className="flex-1 border-t border-white/10" />
                            <span className="px-4 text-xs text-gray-500 uppercase">or</span>
                            <div className="flex-1 border-t border-white/10" />
                        </div>

                        {/* Email/Password Login */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">
                                    Email Address
                                </label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">
                                    Password
                                </label>
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Your password"
                                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all mt-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
                            </button>
                        </form>

                        <p className="text-center text-xs text-gray-600 mt-6">
                            Don't have an account?{" "}
                            <Link href="/" className="text-blue-400 hover:underline">
                                Register for a workshop
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
