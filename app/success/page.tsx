"use client"

import { Clock, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PendingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-black">
      <div className="w-full max-w-md">
        {/* Animated pending icon */}
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-yellow-500/10 rounded-full">
          <Clock className="w-12 h-12 text-yellow-500 animate-pulse" />
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          Payment Under Verification
        </h1>
        <p className="max-w-sm mx-auto mb-8 text-gray-400 text-lg">
          We've received your payment details. Our team will verify your transaction shortly.
        </p>

        {/* Status card */}
        <div className="p-6 mb-8 border rounded-2xl border-white/5 bg-gray-950 text-left">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-yellow-500 uppercase tracking-wider">Pending Verification</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            You'll receive an email notification once your payment is verified and your enrollment is confirmed.
            This usually takes less than <strong className="text-white">24 hours</strong>.
          </p>
        </div>

        {/* What's next */}
        <div className="p-6 mb-8 border rounded-2xl border-white/5 bg-gray-950 text-left">
          <div className="flex items-center space-x-2 mb-3">
            <Mail className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Check Your Email</h3>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            We've sent a confirmation of your submission to your email.
            Once verified, you'll get your <strong className="text-white">workshop access</strong>,
            <strong className="text-white"> WhatsApp group invite</strong>, and your
            <strong className="text-white"> unique referral code</strong>.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
