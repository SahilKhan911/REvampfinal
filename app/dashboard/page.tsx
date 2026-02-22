"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    Package,
    DollarSign,
    Users,
    Copy,
    Clipboard,
    Clock,
    CheckCircle2,
    ArrowLeft,
    LogOut,
    TrendingUp,
    Share2,
} from "lucide-react"

interface DashboardData {
    user: {
        id: string
        name: string
        email: string
        phone: string
        referralCode: string
        referralEarnings: number
        totalReferrals: number
        createdAt: string
    }
    orders: any[]
    referredUsers: any[]
}

export default function UserDashboard() {
    const router = useRouter()
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        fetch("/api/user/dashboard")
            .then((r) => r.json())
            .then((d) => {
                if (d.error) {
                    router.push("/login")
                } else {
                    setData(d)
                }
            })
            .catch(() => router.push("/login"))
            .finally(() => setLoading(false))
    }, [router])

    const copyLink = () => {
        if (!data) return
        navigator.clipboard.writeText(
            `https://gsocii-livid.vercel.app?ref=${data.user.referralCode}`
        )
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleLogout = async () => {
        document.cookie = "user_token=; path=/; max-age=0"
        router.push("/login")
    }

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const isRealCode = !data.user.referralCode.startsWith("tmp_")

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-white/5 bg-gray-950/50">
                <div className="container max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Home
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-400">
                            {data.user.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-500 hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="container max-w-5xl mx-auto px-6 py-12">
                {/* Welcome */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome, {data.user.name.split(" ")[0]}! 👋
                    </h1>
                    <p className="text-gray-500">
                        Track your workshops, referrals, and earnings.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                    <div className="p-6 bg-gray-900 border border-white/5 rounded-2xl">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Package className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-sm text-gray-400 uppercase font-semibold tracking-wider">Orders</span>
                        </div>
                        <p className="text-3xl font-bold">{data.orders.length}</p>
                    </div>
                    <div className="p-6 bg-gray-900 border border-white/5 rounded-2xl">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <DollarSign className="w-5 h-5 text-green-400" />
                            </div>
                            <span className="text-sm text-gray-400 uppercase font-semibold tracking-wider">Earnings</span>
                        </div>
                        <p className="text-3xl font-bold text-green-400">₹{data.user.referralEarnings}</p>
                    </div>
                    <div className="p-6 bg-gray-900 border border-white/5 rounded-2xl">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="text-sm text-gray-400 uppercase font-semibold tracking-wider">Referrals</span>
                        </div>
                        <p className="text-3xl font-bold">{data.user.totalReferrals}</p>
                    </div>
                </div>

                {/* Referral Card */}
                {isRealCode && (
                    <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-950 border border-blue-500/20 rounded-2xl mb-12">
                        <div className="flex items-center space-x-2 mb-4">
                            <Share2 className="w-5 h-5 text-blue-400" />
                            <h2 className="text-lg font-bold">Your Referral Link</h2>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                            Earn <strong className="text-green-400">₹100–200</strong> for every person who registers using your link!
                        </p>
                        <div className="flex items-center space-x-3">
                            <div className="flex-1 p-3 bg-black border border-white/10 rounded-xl overflow-hidden">
                                <code className="text-sm text-blue-400 break-all">
                                    https://gsocii-livid.vercel.app?ref={data.user.referralCode}
                                </code>
                            </div>
                            <button
                                onClick={copyLink}
                                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shrink-0"
                            >
                                {copied ? <Clipboard className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                            Code: <strong className="text-gray-400">{data.user.referralCode}</strong>
                        </p>
                    </div>
                )}

                {/* Orders */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                        <TrendingUp className="w-5 h-5 text-blue-400 mr-3" />
                        Your Orders
                    </h2>
                    {data.orders.length === 0 ? (
                        <div className="p-8 text-center border border-white/5 bg-gray-950 rounded-2xl">
                            <p className="text-gray-500">No orders yet. Register for a workshop to get started!</p>
                            <Link href="/" className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors">
                                Browse Workshops
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.orders.map((order: any) => (
                                <div
                                    key={order.id}
                                    className="p-6 border border-white/5 bg-gray-950 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div>
                                        <h3 className="font-bold text-lg">{order.bundle?.name || order.bundleId}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-xl font-bold">₹{order.amount}</span>
                                        {order.status === "paid" ? (
                                            <span className="flex items-center px-3 py-1.5 bg-green-500/10 text-green-400 text-xs font-bold uppercase rounded-full">
                                                <CheckCircle2 className="w-4 h-4 mr-1" /> Confirmed
                                            </span>
                                        ) : (
                                            <span className="flex items-center px-3 py-1.5 bg-yellow-500/10 text-yellow-400 text-xs font-bold uppercase rounded-full">
                                                <Clock className="w-4 h-4 mr-1" /> Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Referred Users */}
                {data.referredUsers.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                            <Users className="w-5 h-5 text-purple-400 mr-3" />
                            People You Referred
                        </h2>
                        <div className="space-y-3">
                            {data.referredUsers.map((u: any) => (
                                <div
                                    key={u.id}
                                    className="p-4 border border-white/5 bg-gray-950 rounded-xl flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-semibold">{u.name}</p>
                                        <p className="text-xs text-gray-500">{u.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(u.createdAt).toLocaleDateString("en-IN")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
