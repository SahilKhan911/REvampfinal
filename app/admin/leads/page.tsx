"use client"

import { useEffect, useState } from "react"
import {
  ChevronLeft,
  Mail,
  Phone,
  MessageCircle,
  Download,
  Filter,
} from "lucide-react"
import Link from "next/link"

const STEP_FILTERS = [
  { value: "", label: "All Leads" },
  { value: "DETAILS", label: "📋 Dropped at Details" },
  { value: "PAYMENT", label: "💳 Reached Payment" },
]

const COHORT_FILTERS = [
  { value: "", label: "All Cohorts" },
  { value: "opensource", label: "🔓 Open Source" },
  { value: "webdev", label: "🌐 Web Dev" },
  { value: "aiml", label: "🤖 AI & ML" },
  { value: "launchpad", label: "🚀 Launchpad" },
  { value: "cp", label: "⚔️ CP" },
  { value: "cybersec", label: "🛡️ CyberSec" },
]

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stepFilter, setStepFilter] = useState("")
  const [cohortFilter, setCohortFilter] = useState("")

  const fetchLeads = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (stepFilter) params.set("step", stepFilter)
    if (cohortFilter) params.set("cohort", cohortFilter)

    fetch(`/api/admin/leads?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setLeads(Array.isArray(data) ? data : []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchLeads()
  }, [stepFilter, cohortFilter])

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Step", "Bundle", "Date"]
    const rows = leads.map((l) => [
      l.name || "",
      l.email,
      l.phone || "",
      l.stepReached,
      l.bundle?.name || "—",
      new Date(l.createdAt).toLocaleDateString(),
    ])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const detailsCount = leads.filter((l) => l.stepReached === "DETAILS").length
  const paymentCount = leads.filter((l) => l.stepReached === "PAYMENT").length

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="mb-8">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center text-gray-500 hover:text-white transition-all text-sm mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lead Tracker</h1>
            <p className="text-gray-500 text-sm">
              Abandoned carts & checkout drop-offs
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-gray-950 border border-white/5 rounded-2xl">
          <p className="text-sm text-gray-400 font-medium">Total Leads</p>
          <h3 className="text-3xl font-bold mt-1">{leads.length}</h3>
        </div>
        <div className="p-5 bg-gray-950 border border-white/5 rounded-2xl">
          <p className="text-sm text-yellow-500 font-medium">
            📋 Dropped at Details
          </p>
          <h3 className="text-3xl font-bold mt-1">{detailsCount}</h3>
        </div>
        <div className="p-5 bg-gray-950 border border-white/5 rounded-2xl">
          <p className="text-sm text-blue-400 font-medium">
            💳 Reached Payment
          </p>
          <h3 className="text-3xl font-bold mt-1">{paymentCount}</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">
            Step:
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STEP_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStepFilter(f.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                stepFilter === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="h-6 w-px bg-white/10 hidden md:block" />
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {COHORT_FILTERS.map((c) => (
            <button
              key={c.value}
              onClick={() => setCohortFilter(c.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                cohortFilter === c.value
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/5 bg-gray-950 rounded-2xl">
          <table className="w-full text-left">
            <thead className="border-b border-white/10">
              <tr className="text-xs uppercase font-bold text-gray-400">
                <th className="p-4">Contact</th>
                <th className="p-4">Step Reached</th>
                <th className="p-4">Bundle</th>
                <th className="p-4">Date</th>
                <th className="p-4">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No leads found matching your filters.
                  </td>
                </tr>
              ) : (
                leads.map((lead: any) => (
                  <tr
                    key={lead.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-all"
                  >
                    <td className="p-4">
                      <div className="font-bold">
                        {lead.name || "Unknown"}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1 gap-1">
                        <Mail className="w-3 h-3" /> {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="flex items-center text-xs text-gray-500 gap-1">
                          <Phone className="w-3 h-3" /> {lead.phone}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {lead.stepReached === "DETAILS" ? (
                        <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-xs font-bold uppercase">
                          📋 Details
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-bold uppercase">
                          💳 Payment
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {lead.bundle ? (
                        <div>
                          <span className="px-2 py-1 bg-white/5 rounded text-xs font-medium">
                            {lead.bundle.name}
                          </span>
                          {lead.bundle.cohortSlug && (
                            <span className="ml-2 text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                              {lead.bundle.cohortSlug}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {lead.phone && (
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Hey ${lead.name || "there"}! 👋 I noticed you were checking out ${lead.bundle?.name || "our workshops"} on REvamp. Need any help with registration?`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-all"
                            title="Send WhatsApp follow-up"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}?subject=Still interested in ${lead.bundle?.name || "REvamp workshops"}?`}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all"
                            title="Send email follow-up"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
