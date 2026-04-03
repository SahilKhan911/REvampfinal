"use client"

import { useEffect, useState } from "react"
import {
  Check,
  Clock,
  Loader2,
  ChevronLeft,
  X,
} from "lucide-react"
import Link from "next/link"

export default function PayoutsPage() {
  const [redemptions, setRedemptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchRedemptions = () => {
    fetch("/api/admin/redemptions")
      .then((res) => res.json())
      .then((data) => setRedemptions(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRedemptions()
  }, [])

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to mark this request as ${status}?`)) return
    setProcessing(id)
    try {
      const res = await fetch("/api/admin/redemptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error("Update failed")
      fetchRedemptions()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setProcessing(null)
    }
  }

  if (loading) return null

  const pendingCount = redemptions.filter((r: any) => r.status === "INITIATED" || r.status === "PROCESSING").length

  return (
    <div className="min-h-screen bg-black text-white p-8 hover:!bg-black focus:!bg-black active:!bg-black">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="inline-flex items-center text-gray-500 hover:text-white transition-all text-sm mb-4">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Referral Payouts</h1>
            <p className="text-gray-500 text-sm">Process referral earning withdrawals</p>
          </div>
          {pendingCount > 0 && (
            <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <span className="text-yellow-500 text-sm font-bold">{pendingCount} pending request{pendingCount > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto border border-white/5 bg-gray-950 rounded-2xl">
        <table className="w-full text-left">
          <thead className="border-b border-white/10">
            <tr className="text-xs uppercase font-bold text-gray-400">
              <th className="p-4">User</th>
              <th className="p-4">Amount</th>
              <th className="p-4">UPI ID</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {redemptions.map((r: any) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all">
                <td className="p-4">
                  <div className="font-bold">{r.user?.name || "Unknown User"}</div>
                  <div className="text-xs text-gray-500">{r.user?.email}</div>
                  <div className="text-xs text-gray-500">{r.user?.phone}</div>
                </td>
                <td className="p-4 font-bold text-yellow-400">₹{r.amount}</td>
                <td className="p-4">
                  <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded">{r.upiId}</span>
                </td>
                <td className="p-4">
                  <span className={`flex items-center w-fit px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    r.status === 'PAID' ? 'bg-green-500/20 text-green-400' :
                    r.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                    r.status === 'INITIATED' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {r.status === 'PAID' ? <Check className="w-3 h-3 mr-1" /> :
                     r.status === 'REJECTED' ? <X className="w-3 h-3 mr-1" /> :
                     <Clock className="w-3 h-3 mr-1" />}
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                  <div className="text-[10px] text-gray-600">{new Date(r.createdAt).toLocaleTimeString()}</div>
                </td>
                <td className="p-4 flex gap-2">
                  {r.status === "INITIATED" && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, "PROCESSING")}
                      disabled={processing === r.id}
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-lg transition-all flex items-center"
                    >
                      Process
                    </button>
                  )}
                  {(r.status === "INITIATED" || r.status === "PROCESSING") && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(r.id, "PAID")}
                        disabled={processing === r.id}
                        className="px-3 py-1.5 bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-500/30 text-xs font-bold rounded-lg transition-all flex items-center"
                      >
                         {processing === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Mark Paid"}
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(r.id, "REJECTED")}
                        disabled={processing === r.id}
                        className="p-1.5 bg-red-600/10 hover:bg-red-600/30 text-red-400 rounded-lg transition-all"
                        title="Reject"
                      >
                       <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {redemptions.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-500 text-sm">No redemption requests found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
