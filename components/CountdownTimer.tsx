"use client"

import { useEffect, useState } from "react"
import { Clock, Flame } from "lucide-react"

const DEADLINE = new Date("2026-02-23T12:00:00+05:30").getTime()

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

function getTimeLeft(): TimeLeft {
    const now = Date.now()
    const diff = Math.max(0, DEADLINE - now)

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    }
}

function TimeBox({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gray-900 border border-blue-500/30 rounded-xl shadow-lg shadow-blue-500/5">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white tabular-nums">
                    {String(value).padStart(2, "0")}
                </span>
                <div className="absolute inset-0 rounded-xl bg-blue-500/5" />
            </div>
            <span className="mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-500">
                {label}
            </span>
        </div>
    )
}

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft())
    const [expired, setExpired] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            const tl = getTimeLeft()
            setTimeLeft(tl)
            if (tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
                setExpired(true)
                clearInterval(timer)
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    if (expired) {
        return (
            <div className="text-center py-8">
                <p className="text-xl font-bold text-red-400">🔥 The 50% OFF sale has ended!</p>
            </div>
        )
    }

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Glow background */}
            <div className="absolute inset-0 -m-4 rounded-3xl bg-blue-500/5 blur-2xl" />

            <div className="relative flex flex-col items-center p-8 border border-blue-500/20 rounded-2xl bg-gray-950/80 backdrop-blur-sm">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-1.5 mb-5 space-x-2 text-xs font-bold uppercase tracking-wider border rounded-full bg-blue-600/10 border-blue-500/30 text-blue-400">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Limited Time Offer</span>
                </div>

                {/* Title */}
                <h2 className="mb-2 text-xl sm:text-2xl font-extrabold tracking-tight text-white text-center">
                    50% OFF ends at <span className="text-blue-400">12 PM, 23rd Feb</span>
                </h2>
                <p className="mb-6 text-sm text-gray-400 text-center">
                    Grab your spot before the price doubles!
                </p>

                {/* Timer */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <TimeBox value={timeLeft.days} label="Days" />
                    <span className="text-2xl font-bold text-blue-500/50 mt-[-20px]">:</span>
                    <TimeBox value={timeLeft.hours} label="Hours" />
                    <span className="text-2xl font-bold text-blue-500/50 mt-[-20px]">:</span>
                    <TimeBox value={timeLeft.minutes} label="Mins" />
                    <span className="text-2xl font-bold text-blue-500/50 mt-[-20px]">:</span>
                    <TimeBox value={timeLeft.seconds} label="Secs" />
                </div>
            </div>
        </div>
    )
}
