"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

interface Announcement {
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  ctaLabel?: string
  ctaLink?: string
  badge?: string
}

const BADGE_COLORS: Record<string, string> = {
  NEW: "bg-green-500 text-white",
  EVENT: "bg-purple-500 text-white",
  WORKSHOP: "bg-[#0085FF] text-white",
  ANNOUNCEMENT: "bg-[#FFD700] text-black",
}

export default function NewsCarousel({ items }: { items: Announcement[] }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setActive(prev => (prev + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setActive(prev => (prev - 1 + items.length) % items.length)
  }, [items.length])

  // Auto advance
  useEffect(() => {
    if (paused || items.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [paused, next, items.length])

  if (!items.length) return null

  const item = items[active]

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image with overlay */}
      <div className="relative h-48 md:h-56">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {item.badge && (
                <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-3 ${BADGE_COLORS[item.badge] || BADGE_COLORS.NEW}`}>
                  {item.badge}
                </span>
              )}
              <h3 className="font-headline font-bold text-xl md:text-2xl text-white mb-1 line-clamp-1">{item.title}</h3>
              {item.subtitle && (
                <p className="text-white/60 text-sm line-clamp-1">{item.subtitle}</p>
              )}
            </div>
            {item.ctaLink && (
              <Link
                href={item.ctaLink}
                className="shrink-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all border border-white/10"
              >
                {item.ctaLabel || "View →"}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </>
      )}

      {/* Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === active ? "bg-white w-4" : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
