"use client"

import { ArrowRight, Check } from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Link from "next/link"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface BundleProps {
  id: string
  name: string
  originalPrice: number
  eventPrice: number
  isDiscounted: boolean
  features: string[]
  isPrimary?: boolean
}

export default function BundleCard({
  id,
  name,
  originalPrice,
  eventPrice,
  isDiscounted,
  features,
  isPrimary = false,
}: BundleProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col p-8 transition-all duration-300 border rounded-2xl group",
        isPrimary
          ? "bg-gray-900 accent-border accent-glow scale-105 z-10"
          : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
      )}
    >
      {isDiscounted && (
        <span className="absolute px-3 py-1 text-xs font-semibold text-white uppercase accent-badge rounded-full -top-3 left-8">
          LIMITED OFFER
        </span>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <div className="flex items-baseline mt-4 space-x-2">
          <span className="text-4xl font-extrabold tracking-tight text-white">
            ₹{eventPrice}
          </span>
          {isDiscounted && (
            <span className="text-xl text-gray-400 line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>
      </div>

      <ul className="flex-1 mb-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <Check className="w-5 h-5 mt-0.5 accent-text shrink-0" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/workshop/${id}`}
        className={cn(
          "flex items-center justify-center w-full px-6 py-4 text-sm font-bold transition-all rounded-xl",
          isPrimary
            ? "accent-bg accent-bg-hover text-white"
            : "bg-white/10 hover:bg-white/20 text-white"
        )}
      >
        View Details
        <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  )
}
