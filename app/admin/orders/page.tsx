"use client"

import { useEffect, useState } from "react"
import {
  Check,
  Clock,
  Loader2,
  ChevronLeft,
  Image as ImageIcon,
  X,
  Eye,
} from "lucide-react"
import Link from "next/link"

const COHORT_OPTIONS = [
  { slug: "", label: "All" },
  { slug: "opensource", label: "🔓 OSS" },
  { slug: "webdev", label: "🌐 Web" },
  { slug: "aiml", label: "🤖 AI" },
  { slug: "launchpad", label: "🚀 Launch" },
  { slug: "cp", label: "⚔️ CP" },
  { slug: "cybersec", label: "🛡️ Cyber" },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [cohortFilter, setCohortFilter] = useState("")
  const [proofModal, setProofModal] = useState<string | null>(null)

  const fetchOrders = (cohort?: string) => {
    const url = cohort ? `/api/admin/orders?cohort=${cohort}` : "/api/admin/orders"
    fetch(url)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders(cohortFilter)
  }, [cohortFilter])

  const handleApprove = async (orderId: string) => {
    if (!confirm("Are you sure you want to approve this payment?")) return
    setProcessing(orderId)
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action: "approve" }),
      })
      if (!res.ok) throw new Error("Approval failed")
      fetchOrders(cohortFilter)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setProcessing(null)
    }
  }

  if (loading) return null

  const pendingCount = orders.filter((o: any) => o.status === "pending").length

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Payment Proof Modal */}
      {proofModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setProofModal(null)}>
          <div className="relative max-w-2xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setProofModal(null)}
              className="absolute -top-3 -right-3 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={proofModal}
              alt="Payment proof"
              className="max-h-[85vh] w-auto rounded-2xl border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      )}

      <div className="mb-8">
        <Link href="/admin/dashboard" className="inline-flex items-center text-gray-500 hover:text-white transition-all text-sm mb-4">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders Management</h1>
            <p className="text-gray-500 text-sm">Approve manual payments and track sales</p>
          </div>
          {pendingCount > 0 && (
            <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <span className="text-yellow-500 text-sm font-bold">{pendingCount} pending approval{pendingCount > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cohort Filter */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
        {COHORT_OPTIONS.map((c) => (
          <button
            key={c.slug}
            onClick={() => { setCohortFilter(c.slug); setLoading(true) }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
              cohortFilter === c.slug
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border border-white/5 bg-gray-950 rounded-2xl">
        <table className="w-full text-left">
          <thead className="border-b border-white/10">
            <tr className="text-xs uppercase font-bold text-gray-400">
              <th className="p-4">User</th>
              <th className="p-4">Bundle</th>
              <th className="p-4">Cohort</th>
              <th className="p-4">Method</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Proof</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map((order: any) => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all">
                <td className="p-4">
                  <div className="font-bold">{order.user?.name}</div>
                  <div className="text-xs text-gray-500">{order.user?.email}</div>
                  <div className="text-xs text-gray-500">{order.user?.phone}</div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-white/5 rounded text-xs font-medium">
                    {order.bundle?.name || order.productName || "—"}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                    {order.bundle?.cohortSlug || "—"}
                  </span>
                </td>
                <td className="p-4 capitalize">{order.paymentMethod}</td>
                <td className="p-4 font-bold text-blue-400">₹{order.amount}</td>
                <td className="p-4">
                  {order.paymentProofUrl ? (
                    <button
                      onClick={() => setProofModal(order.paymentProofUrl)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-all text-xs font-bold"
                    >
                      <Eye className="w-3 h-3" />
                      View Proof
                    </button>
                  ) : order.razorpayPaymentId ? (
                    <span className="text-xs text-gray-500 font-mono">{order.razorpayPaymentId.slice(0, 12)}…</span>
                  ) : (
                    <span className="text-xs text-gray-600">No proof</span>
                  )}
                </td>
                <td className="p-4">
                  {order.status === "paid" ? (
                    <span className="flex items-center text-green-500 text-xs font-bold uppercase">
                      <Check className="w-4 h-4 mr-1" /> Paid
                    </span>
                  ) : (
                    <span className="flex items-center text-yellow-500 text-xs font-bold uppercase">
                      <Clock className="w-4 h-4 mr-1" /> {order.status}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {order.status === "pending" && (order.paymentMethod === "qr" || order.paymentMethod === "upi") && (
                    <button
                      onClick={() => handleApprove(order.id)}
                      disabled={processing === order.id}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-all flex items-center"
                    >
                      {processing === order.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                      Approve
                    </button>
                  )}
                  {order.paymentMethod === "razorpay" && (
                    <span className="text-gray-600 text-xs">Auto-verified</span>
                  )}
                  {order.status === "paid" && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
