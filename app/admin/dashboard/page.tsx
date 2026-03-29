"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  CreditCard,
  IndianRupee,
  TrendingUp,
  Package,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

const COHORT_OPTIONS = [
  { slug: "", label: "All Cohorts" },
  { slug: "opensource", label: "🔓 Open Source" },
  { slug: "webdev", label: "🌐 Web Dev" },
  { slug: "aiml", label: "🤖 AI & ML" },
  { slug: "launchpad", label: "🚀 Launchpad" },
  { slug: "cp", label: "⚔️ CP" },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cohortFilter, setCohortFilter] = useState("")

  const fetchStats = (cohort: string) => {
    const url = cohort ? `/api/admin/stats?cohort=${cohort}` : "/api/admin/stats"
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized")
        return res.json()
      })
      .then((data) => setStats(data))
      .catch(() => window.location.href = "/admin/login")
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchStats(cohortFilter)
  }, [cohortFilter])

  if (loading) return null

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="p-6 border border-white/5 bg-gray-950 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-sm text-gray-400 font-medium">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <nav className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Revamp Admin</h1>
          <p className="text-gray-500 text-sm">Revenue & Management Overview</p>
        </div>
        <div className="flex space-x-4">
          <Link href="/admin/orders" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all">
            Manage Orders
          </Link>
          <Link href="/admin/users" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all">
            Users
          </Link>
          <button onClick={() => {
            document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
            window.location.href = "/admin/login"
          }} className="px-4 py-2 text-sm text-gray-400 hover:text-white">
            Logout
          </button>
        </div>
      </nav>

      {/* Cohort Filter */}
      <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
        {COHORT_OPTIONS.map((c) => (
          <button
            key={c.slug}
            onClick={() => { setCohortFilter(c.slug); setLoading(true) }}
            className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
              cohortFilter === c.slug
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.revenue || 0}`}
          icon={IndianRupee}
          color="bg-green-500/10 text-green-500"
        />
        <StatCard
          title="Total Sales"
          value={stats?.sales || 0}
          icon={CreditCard}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Total Users"
          value={stats?.users || 0}
          icon={Users}
          color="bg-purple-500/10 text-purple-500"
        />
        <StatCard
          title="Referral Conversions"
          value={stats?.referralSales || 0}
          icon={TrendingUp}
          color="bg-blue-500/10 text-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 border border-white/5 bg-gray-950 rounded-2xl">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Package className="w-5 h-5 mr-3 text-blue-400" />
            Sales by Bundle
          </h3>
          <div className="space-y-4">
            {stats?.bundleSales?.length > 0 ? (
              stats.bundleSales.map((b: any) => (
                <div key={b.bundleId} className="flex items-center justify-between p-4 bg-black border border-white/5 rounded-xl">
                  <div>
                    <span className="text-sm font-medium text-gray-300">{b.bundleName || b.bundleId}</span>
                    {b.cohortSlug && (
                      <span className="ml-2 text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{b.cohortSlug}</span>
                    )}
                  </div>
                  <span className="font-bold">{b._count.id} Sales</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No sales data yet</p>
            )}
          </div>
        </div>

        <div className="p-8 border border-white/5 bg-gray-950 rounded-2xl flex flex-col justify-center items-center text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Manage Orders?</h3>
          <p className="text-gray-400 text-sm mb-8 px-8">Review manual payments, track customer details, and verify transaction IDs.</p>
          <Link href="/admin/orders" className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
            Go to Orders
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}
