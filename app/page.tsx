import BundleCard from "@/components/BundleCard"
import CountdownTimer from "@/components/CountdownTimer"
import { Shield, Users, Zap, Award } from "lucide-react"
import Image from "next/image"

const BUNDLES = [
  {
    id: "gsoc-intensive",
    name: "GSOC INTENSIVE",
    originalPrice: 1999,
    eventPrice: 999,
    isDiscounted: true,
    features: [
      "Deep dive into GSoC proposals",
      "Organization selection strategy",
      "1-on-1 proposal review",
      "Project contribution guide",
    ],
    isPrimary: true,
  },
  {
    id: "opensource-starter",
    name: "OPENSOURCE STARTER",
    originalPrice: 1499,
    eventPrice: 699,
    isDiscounted: true,
    features: [
      "Git & GitHub fundamentals",
      "First contribution walkthrough",
      "Finding beginner-friendly issues",
      "Discord community access",
    ],
    isPrimary: false,
  },
  {
    id: "opensource-specific",
    name: "OPENSOURCE SPECIFIC",
    originalPrice: 1500,
    eventPrice: 1500,
    isDiscounted: false,
    features: [
      "Custom organization training",
      "Specific toolkit mastery",
      "Advanced debugging sessions",
      "Maintainer communication tips",
    ],
    isPrimary: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black selection:bg-blue-500/30">
      {/* Hero Section */}
      <header className="relative flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden text-center px-6">
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.15),transparent_50%)]" />
        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-6">
            <img
              src="https://ik.imagekit.io/cotszrkgk/Screenshot_2025-06-25_at_9.10.56_PM-removebg-preview.png?updatedAt=1756648034230"
              alt="GSOC Logo"
              className="w-80 h-80 mx-auto object-contain"
            />
          </div>
          <div className="inline-flex items-center px-4 py-2 mb-8 space-x-2 text-sm font-medium border rounded-full bg-white/5 border-white/10 text-blue-400">
            <Zap className="w-4 h-4" />
            <span>Revamp Event Live</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter md:text-7xl lg:text-8xl">
            Master <span className="text-blue-500">Open Source.</span>
            <br />
            Secure Your Future.
          </h1>
          <p className="max-w-2xl mx-auto mt-8 text-lg text-gray-400 md:text-xl">
            Production-ready workshops to help you contribute to the world's most
            impactful software. Join 100k+ developers.
          </p>
        </div>
      </header>

      {/* Countdown Timer Section */}
      <section className="container max-w-6xl py-12 mx-auto px-6">
        <CountdownTimer />
      </section>

      {/* Pricing Section */}
      <section className="container max-w-6xl py-24 mx-auto px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {BUNDLES.map((bundle) => (
            <BundleCard key={bundle.id} {...bundle} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-white/5 bg-gray-950/20 px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600/10 rounded-xl">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Secure Infrastructure</h3>
              <p className="text-gray-400">
                Enterprise-grade security for 100k users. Payments powered by
                Razorpay.
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600/10 rounded-xl">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Referral Network</h3>
              <p className="text-gray-400">
                Boost your impact. Join our referral program and lead the open
                source movement.
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600/10 rounded-xl">
                <Award className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Proven Curriculum</h3>
              <p className="text-gray-400">
                Battle-tested workshops designed for real-world contributions and
                GSoC success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-400 mb-10">Have questions? Reach out to us anytime.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <a
              href="https://instagram.com/letsrevamp.here"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 border border-white/5 bg-gray-950 rounded-2xl hover:border-pink-500/30 transition-colors group"
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-pink-500/10 rounded-xl">
                <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </div>
              <p className="font-semibold text-white group-hover:text-pink-400 transition-colors">@letsrevamp.here</p>
              <p className="text-xs text-gray-500 mt-1">Instagram</p>
            </a>
            <a
              href="mailto:letsrevamp.here@gmail.com"
              className="p-6 border border-white/5 bg-gray-950 rounded-2xl hover:border-blue-500/30 transition-colors group"
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-500/10 rounded-xl">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">letsrevamp.here@gmail.com</p>
              <p className="text-xs text-gray-500 mt-1">Email</p>
            </a>
            <a
              href="tel:+917029920735"
              className="p-6 border border-white/5 bg-gray-950 rounded-2xl hover:border-green-500/30 transition-colors group"
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-500/10 rounded-xl">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <p className="font-semibold text-white group-hover:text-green-400 transition-colors">+91 7029920735</p>
              <p className="text-xs text-gray-500 mt-1">Phone</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm px-6">
        <p>&copy; 2026 Revamp. All rights reserved. opensource.letsrevamp.in</p>
      </footer>
    </div>
  )
}
