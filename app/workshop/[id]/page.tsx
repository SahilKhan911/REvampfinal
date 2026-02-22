"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
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

const WORKSHOP_DATA: Record<string, any> = {
    "gsoc-intensive": {
        name: "GSOC INTENSIVE",
        tagline: "Your complete roadmap to getting selected in Google Summer of Code",
        originalPrice: 1999,
        eventPrice: 999,
        isDiscounted: true,
        duration: "4 Weeks",
        startDate: "March 1, 2026",
        schedule: "Weekends — Sat & Sun, 7 PM - 9 PM IST",
        maxSeats: 50,
        seatsLeft: 18,
        highlights: [
            "Live mentoring from past GSoC contributors",
            "End-to-end proposal writing workshop",
            "Real org codebase walkthrough",
            "Mock proposal review sessions",
        ],
        curriculum: [
            {
                week: "Week 1",
                title: "Understanding GSoC",
                topics: [
                    "How GSoC works — timeline, eligibility, stipends",
                    "How orgs select students — what they actually look for",
                    "Exploring past selected proposals",
                    "Setting up your development environment",
                ],
            },
            {
                week: "Week 2",
                title: "Finding Your Organization",
                topics: [
                    "Navigating the GSoC org list strategically",
                    "Evaluating org activity, mentors, and project ideas",
                    "Making your first meaningful contribution",
                    "Engaging with the community (IRC, Slack, mailing lists)",
                ],
            },
            {
                week: "Week 3",
                title: "Proposal Masterclass",
                topics: [
                    "Anatomy of a winning proposal",
                    "Writing a clear project plan & timeline",
                    "Demonstrating technical competence",
                    "1-on-1 proposal review with mentors",
                ],
            },
            {
                week: "Week 4",
                title: "Final Push & Submission",
                topics: [
                    "Polishing and iterating on your proposal",
                    "Getting feedback from org mentors before deadline",
                    "Submission checklist and common mistakes",
                    "Post-submission: what to expect next",
                ],
            },
        ],
        outcomes: [
            "A submission-ready GSoC proposal",
            "Contributions to a real open source organization",
            "Deep understanding of open source workflows",
            "Network with past GSoC students and mentors",
        ],
    },
    "opensource-starter": {
        name: "OPENSOURCE STARTER",
        tagline: "Go from zero to your first open source contribution in 2 weeks",
        originalPrice: 1499,
        eventPrice: 699,
        isDiscounted: true,
        duration: "2 Weeks",
        startDate: "March 1, 2026",
        schedule: "Weekends — Sat & Sun, 5 PM - 7 PM IST",
        maxSeats: 80,
        seatsLeft: 34,
        highlights: [
            "Beginner-friendly — no prior experience needed",
            "Hands-on Git & GitHub workflow training",
            "Make your first real PR to a popular project",
            "Discord community for ongoing support",
        ],
        curriculum: [
            {
                week: "Week 1",
                title: "Git, GitHub & Open Source 101",
                topics: [
                    "Installing & configuring Git from scratch",
                    "Understanding repositories, branches, commits",
                    "Forking, cloning, and creating pull requests",
                    "How open source projects are structured",
                ],
            },
            {
                week: "Week 2",
                title: "Your First Contribution",
                topics: [
                    "Finding beginner-friendly issues (good-first-issue)",
                    "Reading codebases and understanding project context",
                    "Writing clean commits and descriptive PRs",
                    "Responding to code review feedback",
                ],
            },
        ],
        outcomes: [
            "Solid Git & GitHub skills",
            "At least one merged PR on a real project",
            "Understanding of open source etiquette",
            "Access to an active developer community",
        ],
    },
    "opensource-specific": {
        name: "OPENSOURCE SPECIFIC",
        tagline: "Deep-dive into a specific organization and become a core contributor",
        originalPrice: 1500,
        eventPrice: 1500,
        isDiscounted: false,
        duration: "3 Weeks",
        startDate: "March 8, 2026",
        schedule: "Flexible — Self-paced with weekly live Q&A",
        maxSeats: 30,
        seatsLeft: 12,
        highlights: [
            "Choose your target organization",
            "Personalized mentoring for your tech stack",
            "Advanced debugging & code review techniques",
            "Direct communication strategies with maintainers",
        ],
        curriculum: [
            {
                week: "Week 1",
                title: "Deep Dive into Your Org",
                topics: [
                    "Understanding the org's codebase architecture",
                    "Setting up the development environment",
                    "Reading docs, tests, and issue trackers",
                    "Identifying impactful areas to contribute",
                ],
            },
            {
                week: "Week 2",
                title: "Advanced Contribution Skills",
                topics: [
                    "Writing production-quality code patches",
                    "Navigating CI/CD pipelines and test suites",
                    "Advanced Git: rebasing, cherry-picking, bisecting",
                    "Communicating effectively with maintainers",
                ],
            },
            {
                week: "Week 3",
                title: "Becoming a Regular Contributor",
                topics: [
                    "Taking ownership of issues and features",
                    "Reviewing other contributors' PRs",
                    "Building your reputation in the community",
                    "Pathways to becoming a maintainer",
                ],
            },
        ],
        outcomes: [
            "Multiple contributions to your chosen organization",
            "Mastery of the org's specific toolkit and workflow",
            "Direct relationship with org maintainers",
            "Portfolio-worthy open source track record",
        ],
    },
}

export default function WorkshopDetailPage() {
    const params = useParams()
    const id = params.id as string
    const workshop = WORKSHOP_DATA[id]
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!workshop) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Workshop Not Found</h1>
                    <Link href="/" className="text-blue-400 hover:underline">
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
                        <div className="inline-flex items-center px-3 py-1 mb-6 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400">
                            🔥 50% OFF till 12 PM, 23rd Feb
                        </div>
                    )}
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        {workshop.name}
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl">{workshop.tagline}</p>

                    {/* Quick info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 bg-gray-900 border border-white/5 rounded-xl">
                            <Calendar className="w-5 h-5 text-blue-400 mb-2" />
                            <p className="text-xs text-gray-500 uppercase font-semibold">Starts</p>
                            <p className="text-sm font-bold">{workshop.startDate}</p>
                        </div>
                        <div className="p-4 bg-gray-900 border border-white/5 rounded-xl">
                            <Clock className="w-5 h-5 text-blue-400 mb-2" />
                            <p className="text-xs text-gray-500 uppercase font-semibold">Duration</p>
                            <p className="text-sm font-bold">{workshop.duration}</p>
                        </div>
                        <div className="p-4 bg-gray-900 border border-white/5 rounded-xl">
                            <Users className="w-5 h-5 text-blue-400 mb-2" />
                            <p className="text-xs text-gray-500 uppercase font-semibold">Seats Left</p>
                            <p className="text-sm font-bold text-blue-400">{workshop.seatsLeft} / {workshop.maxSeats}</p>
                        </div>
                        <div className="p-4 bg-gray-900 border border-white/5 rounded-xl">
                            <Zap className="w-5 h-5 text-blue-400 mb-2" />
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
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all text-lg flex items-center justify-center"
                        >
                            Register Now
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </header>

                {/* Highlights */}
                <section className="container max-w-4xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Star className="w-6 h-6 text-blue-400 mr-3" />
                        Why This Workshop?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {workshop.highlights.map((highlight: string, i: number) => (
                            <div
                                key={i}
                                className="flex items-start space-x-3 p-4 bg-gray-900/50 border border-white/5 rounded-xl"
                            >
                                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                <span className="text-gray-300">{highlight}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Curriculum */}
                <section className="container max-w-4xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-bold mb-8 flex items-center">
                        <BookOpen className="w-6 h-6 text-blue-400 mr-3" />
                        What You'll Learn
                    </h2>
                    <div className="space-y-6">
                        {workshop.curriculum.map((module: any, i: number) => (
                            <div
                                key={i}
                                className="p-6 bg-gray-900 border border-white/5 rounded-2xl"
                            >
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="px-3 py-1 bg-blue-600/10 text-blue-400 text-xs font-bold uppercase rounded-full">
                                        {module.week}
                                    </span>
                                    <h3 className="text-lg font-bold">{module.title}</h3>
                                </div>
                                <ul className="space-y-3">
                                    {module.topics.map((topic: string, j: number) => (
                                        <li key={j} className="flex items-start space-x-3">
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
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
                        <Target className="w-6 h-6 text-blue-400 mr-3" />
                        By The End, You'll Have
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {workshop.outcomes.map((outcome: string, i: number) => (
                            <div
                                key={i}
                                className="flex items-start space-x-3 p-4 bg-gray-900/50 border border-white/5 rounded-xl"
                            >
                                <Award className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
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
                                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all text-lg"
                            >
                                Register for ₹{workshop.eventPrice}
                            </button>
                            {workshop.isDiscounted && (
                                <p className="text-sm text-gray-500">
                                    <span className="text-blue-400 font-semibold">50% OFF</span> — offer ends 12 PM, 23rd Feb
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 border-t border-white/5 text-center text-gray-600 text-sm px-6">
                    <p>&copy; 2024 Revamp. All rights reserved.</p>
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
