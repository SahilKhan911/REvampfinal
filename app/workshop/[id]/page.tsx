"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    CheckCircle2,
    Zap,
    BookOpen,
    Target,
    Award,
    Star,
    ChevronRight,
} from "lucide-react"
import CheckoutModal from "@/components/CheckoutModal"
import { getCohortConfig, DEFAULT_COHORT, COHORTS } from "@/lib/cohorts"

function getCohortSlugFromCookie(): string {
    if (typeof document === "undefined") return DEFAULT_COHORT
    const match = document.cookie.match(/cohort_slug=([^;]+)/)
    return match ? match[1] : DEFAULT_COHORT
}

export default function WorkshopDetailPage() {
    const params = useParams()
    const id = params.id as string
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [cohortSlug, setCohortSlug] = useState(DEFAULT_COHORT)

    useEffect(() => {
        setCohortSlug(getCohortSlugFromCookie())
    }, [])

    // Find the workshop across all cohorts
    let workshop: any = null
    let activeCohort = getCohortConfig(cohortSlug)

    // First check in the active cohort
    if (activeCohort.workshopDetails[id]) {
        workshop = activeCohort.workshopDetails[id]
    } else {
        // Search across all cohorts
        for (const [slug, config] of Object.entries(COHORTS)) {
            if (config.workshopDetails[id]) {
                workshop = config.workshopDetails[id]
                activeCohort = config
                break
            }
        }
    }

    if (!workshop) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Workshop Not Found</h1>
                    <Link href="/" className="accent-text hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="min-h-screen bg-black text-white">
                {/* Back nav */}
                <div className="container max-w-4xl mx-auto px-6 pt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-500 hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to All Workshops
                    </Link>
                </div>

                {/* Hero */}
                <header className="container max-w-4xl mx-auto px-6 pt-12 pb-8">
                    {workshop.isDiscounted && (
                        <div className="inline-flex items-center px-3 py-1 mb-6 text-xs font-bold uppercase tracking-wider rounded-full accent-bg-subtle accent-border-subtle border accent-text">
                            🔥 Limited Time Offer
                        </div>
                    )}
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        {workshop.name}
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl">{workshop.tagline}</p>

                    {/* Quick info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 bg-gray-900 border border-white/5 rounded-xl">
                            <Calendar className="w-5 h-5 accent-text mb-2" />
                            <p className="text-xs text-gray-500 uppercase font-semibold">Starts</p>
                            <p className="text-sm font-bold">{workshop.startDate}</p>
                        </div>
                        <div className="p-4 bg-gray-900 border border-white/5 rounded-xl">
                            <Clock className="w-5 h-5 accent-text mb-2" />
                            <p className="text-xs text-gray-500 uppercase font-semibold">Duration</p>
                            <p className="text-sm font-bold">{workshop.duration}</p>
                        </div>
                        <div className="p-4 bg-gray-900 border border-white/5 rounded-xl">
                            <Users className="w-5 h-5 accent-text mb-2" />
                            <p className="text-xs text-gray-500 uppercase font-semibold">Seats Left</p>
                            <p className="text-sm font-bold accent-text">{workshop.seatsLeft} / {workshop.maxSeats}</p>
                        </div>
                        <div className="p-4 bg-gray-900 border border-white/5 rounded-xl">
                            <Zap className="w-5 h-5 accent-text mb-2" />
                            <p className="text-xs text-gray-500 uppercase font-semibold">Schedule</p>
                            <p className="text-sm font-bold">{workshop.schedule}</p>
                        </div>
                    </div>

                    {/* Price + CTA */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-gray-900 border border-white/5 rounded-2xl">
                        <div className="flex-1">
                            <div className="flex items-baseline space-x-3">
                                <span className="text-4xl font-extrabold">₹{workshop.eventPrice}</span>
                                {workshop.isDiscounted && (
                                    <span className="text-xl text-gray-500 line-through">
                                        ₹{workshop.originalPrice}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">One-time payment • Lifetime access</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto px-8 py-4 accent-bg accent-bg-hover text-white font-bold rounded-xl transition-all text-lg flex items-center justify-center"
                        >
                            Register Now
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </header>

                {/* Highlights */}
                <section className="container max-w-4xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Star className="w-6 h-6 accent-text mr-3" />
                        Why This Workshop?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {workshop.highlights.map((highlight: string, i: number) => (
                            <div
                                key={i}
                                className="flex items-start space-x-3 p-4 bg-gray-900/50 border border-white/5 rounded-xl"
                            >
                                <CheckCircle2 className="w-5 h-5 accent-text shrink-0 mt-0.5" />
                                <span className="text-gray-300">{highlight}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Curriculum */}
                <section className="container max-w-4xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-bold mb-8 flex items-center">
                        <BookOpen className="w-6 h-6 accent-text mr-3" />
                        What You'll Learn
                    </h2>
                    <div className="space-y-6">
                        {workshop.curriculum.map((module: any, i: number) => (
                            <div
                                key={i}
                                className="p-6 bg-gray-900 border border-white/5 rounded-2xl"
                            >
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="px-3 py-1 accent-bg-subtle accent-text text-xs font-bold uppercase rounded-full">
                                        {module.week}
                                    </span>
                                    <h3 className="text-lg font-bold">{module.title}</h3>
                                </div>
                                <ul className="space-y-3">
                                    {module.topics.map((topic: string, j: number) => (
                                        <li key={j} className="flex items-start space-x-3">
                                            <div className="w-1.5 h-1.5 accent-dot rounded-full mt-2 shrink-0" />
                                            <span className="text-gray-400">{topic}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Outcomes */}
                <section className="container max-w-4xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Target className="w-6 h-6 accent-text mr-3" />
                        By The End, You'll Have
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {workshop.outcomes.map((outcome: string, i: number) => (
                            <div
                                key={i}
                                className="flex items-start space-x-3 p-4 bg-gray-900/50 border border-white/5 rounded-xl"
                            >
                                <Award className="w-5 h-5 accent-text shrink-0 mt-0.5" />
                                <span className="text-gray-300">{outcome}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="container max-w-4xl mx-auto px-6 py-16">
                    <div className="text-center p-10 bg-gradient-to-b from-gray-900 to-gray-950 border border-white/5 rounded-3xl">
                        <h2 className="text-3xl font-bold mb-3">Ready to Get Started?</h2>
                        <p className="text-gray-400 mb-8">
                            Secure your spot now. Limited seats available.
                        </p>
                        <div className="flex flex-col items-center gap-3">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-10 py-4 accent-bg accent-bg-hover text-white font-bold rounded-xl transition-all text-lg"
                            >
                                Register for ₹{workshop.eventPrice}
                            </button>
                            {workshop.isDiscounted && (
                                <p className="text-sm text-gray-500">
                                    <span className="accent-text font-semibold">Save ₹{workshop.originalPrice - workshop.eventPrice}</span> — limited time offer
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 border-t border-white/5 text-center text-gray-600 text-sm px-6">
                    <p>&copy; 2026 Revamp. All rights reserved.</p>
                </footer>
            </div>

            {isModalOpen && (
                <CheckoutModal
                    bundle={{ id, name: workshop.name, eventPrice: workshop.eventPrice }}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    )
}
