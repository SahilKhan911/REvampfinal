"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import NewsCarousel from "@/app/components/NewsCarousel"

type Tab = "home" | "learning" | "orders" | "referrals" | "domains" | "achievements" | "resources" | "connections" | "settings"

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "learning", label: "My Learning", icon: "school" },
  { id: "connections", label: "Connections", icon: "people" },
  { id: "orders", label: "Orders", icon: "receipt_long" },
  { id: "referrals", label: "Referrals", icon: "group_add" },
  { id: "domains", label: "Domains", icon: "interests" },
  { id: "achievements", label: "Achievements", icon: "emoji_events" },
  { id: "resources", label: "Resources", icon: "library_books" },
  { id: "settings", label: "Settings", icon: "settings" },
]

// Map old tab names for backward compat
const TAB_ALIASES: Record<string, Tab> = { overview: "home", workshops: "learning" }

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawTab = searchParams.get("tab") || "home"
  const tabParam: Tab = (TAB_ALIASES[rawTab] || rawTab) as Tab

  const [data, setData] = useState<any>(null)
  const [allCohorts, setAllCohorts] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>(tabParam)
  const [copied, setCopied] = useState(false)
  const [followLoading, setFollowLoading] = useState<string | null>(null)
  const [resourceFilter, setResourceFilter] = useState<string>("ALL")

  // Collaboration state
  const [expandedWorkshop, setExpandedWorkshop] = useState<string | null>(null)
  const [workshopPeers, setWorkshopPeers] = useState<Record<string, any[]>>({})
  const [workshopDiscussions, setWorkshopDiscussions] = useState<Record<string, any[]>>({})
  const [discussionInput, setDiscussionInput] = useState<Record<string, string>>({})
  const [postingDiscussion, setPostingDiscussion] = useState(false)
  const [connectingTo, setConnectingTo] = useState<string | null>(null)
  const [workshopSubTab, setWorkshopSubTab] = useState<"peers" | "discussion">("peers")
  const [connections, setConnections] = useState<any>({ accepted: [], pendingIncoming: [], pendingOutgoing: [] })
  const [connectionsLoading, setConnectionsLoading] = useState(false)
  const [connectionActionLoading, setConnectionActionLoading] = useState<string | null>(null)

  // Settings state
  const [settingsForm, setSettingsForm] = useState<any>({})
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMsg, setSettingsMsg] = useState("")
  const [skillInput, setSkillInput] = useState("")

  useEffect(() => {
    Promise.all([
      fetch("/api/user/dashboard").then(r => r.json()),
      fetch("/api/cohorts").then(r => r.json()).catch(() => []),
      fetch("/api/announcements").then(r => r.json()).catch(() => []),
      fetch("/api/leaderboard").then(r => r.json()).catch(() => []),
      fetch("/api/resources").then(r => r.json()).catch(() => []),
    ]).then(([dashData, cohortsData, annData, lbData, resData]) => {
      if (dashData.error) { router.push("/login"); return }
      setData(dashData)
      setAllCohorts(Array.isArray(cohortsData) ? cohortsData : [])
      setAnnouncements(Array.isArray(annData) ? annData : [])
      setLeaderboard(Array.isArray(lbData) ? lbData : [])
      setResources(Array.isArray(resData) ? resData : [])
      setSettingsForm({
        name: dashData.user.name || "",
        phone: dashData.user.phone || "",
        password: "",
        college: dashData.user.college || "",
        graduationYear: dashData.user.graduationYear || "",
        githubUrl: dashData.user.githubUrl || "",
        linkedinUrl: dashData.user.linkedinUrl || "",
        twitterUrl: dashData.user.twitterUrl || "",
        skills: Array.isArray(dashData.user.skills) ? dashData.user.skills : [],
      })
    }).catch(() => router.push("/login")).finally(() => setLoading(false))
  }, [router])

  useEffect(() => { setActiveTab(tabParam) }, [tabParam])

  const switchTab = useCallback((tab: Tab) => {
    setActiveTab(tab)
    router.push(`/dashboard?tab=${tab}`, { scroll: false })
  }, [router])

  const copyLink = () => {
    if (!data) return
    navigator.clipboard.writeText(`https://letsrevamp.in?ref=${data.user.referralCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = () => {
    document.cookie = "user_token=; path=/; max-age=0"
    router.push("/")
  }

  const handleSubscribe = useCallback(async (cohortId: string) => {
    setFollowLoading(cohortId)
    try {
      await fetch("/api/user/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cohortId }),
      })
      const res = await fetch("/api/user/dashboard").then(r => r.json())
      if (!res.error) setData(res)
    } catch (e) { console.error("Subscribe error:", e) }
    finally { setFollowLoading(null) }
  }, [])

  const handleUnsubscribe = useCallback(async (cohortId: string) => {
    setFollowLoading(cohortId)
    try {
      await fetch("/api/user/subscriptions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cohortId }),
      })
      const res = await fetch("/api/user/dashboard").then(r => r.json())
      if (!res.error) setData(res)
    } catch (e) { console.error("Unsubscribe error:", e) }
    finally { setFollowLoading(null) }
  }, [])

  // Collaboration handlers
  const loadPeersAndDiscussions = useCallback(async (bundleId: string) => {
    if (expandedWorkshop === bundleId) { setExpandedWorkshop(null); return }
    setExpandedWorkshop(bundleId)
    setWorkshopSubTab("peers")
    const [peersRes, discRes] = await Promise.all([
      fetch(`/api/workshop/peers?bundleId=${bundleId}`).then(r => r.json()).catch(() => ({ peers: [] })),
      fetch(`/api/discussions?bundleId=${bundleId}`).then(r => r.json()).catch(() => []),
    ])
    setWorkshopPeers(prev => ({ ...prev, [bundleId]: peersRes.peers || [] }))
    setWorkshopDiscussions(prev => ({ ...prev, [bundleId]: Array.isArray(discRes) ? discRes : [] }))
  }, [expandedWorkshop])

  const handleConnect = useCallback(async (toUserId: string) => {
    setConnectingTo(toUserId)
    try {
      await fetch("/api/connections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toUserId }) })
      // Refresh peers for current workshop
      if (expandedWorkshop) {
        const peersRes = await fetch(`/api/workshop/peers?bundleId=${expandedWorkshop}`).then(r => r.json()).catch(() => ({ peers: [] }))
        setWorkshopPeers(prev => ({ ...prev, [expandedWorkshop!]: peersRes.peers || [] }))
      }
    } catch {}
    finally { setConnectingTo(null) }
  }, [expandedWorkshop])

  const handlePostDiscussion = useCallback(async (bundleId: string) => {
    const content = discussionInput[bundleId]?.trim()
    if (!content) return
    setPostingDiscussion(true)
    try {
      const res = await fetch("/api/discussions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bundleId, content }) }).then(r => r.json())
      if (res.id) {
        setWorkshopDiscussions(prev => ({ ...prev, [bundleId]: [res, ...(prev[bundleId] || [])] }))
        setDiscussionInput(prev => ({ ...prev, [bundleId]: "" }))
      }
    } catch {}
    finally { setPostingDiscussion(false) }
  }, [discussionInput])

  const handleReportPost = useCallback(async (postId: string, bundleId: string) => {
    await fetch("/api/discussions", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postId }) })
    setWorkshopDiscussions(prev => ({ ...prev, [bundleId]: (prev[bundleId] || []).filter((p: any) => p.id !== postId) }))
  }, [])

  const loadConnections = useCallback(async () => {
    setConnectionsLoading(true)
    const res = await fetch("/api/connections").then(r => r.json()).catch(() => ({ accepted: [], pendingIncoming: [], pendingOutgoing: [] }))
    setConnections(res)
    setConnectionsLoading(false)
  }, [])

  const handleConnectionAction = useCallback(async (connectionId: string, action: "ACCEPTED" | "DECLINED") => {
    setConnectionActionLoading(connectionId)
    try {
      await fetch("/api/connections", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ connectionId, action }) })
      loadConnections()
    } catch {}
    finally { setConnectionActionLoading(null) }
  }, [loadConnections])

  // Load connections when tab switches
  useEffect(() => { if (activeTab === "connections") loadConnections() }, [activeTab, loadConnections])

  const handleAddSkill = () => {
    const s = skillInput.trim()
    if (s && !settingsForm.skills.includes(s)) {
      setSettingsForm({ ...settingsForm, skills: [...settingsForm.skills, s] })
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSettingsForm({ ...settingsForm, skills: settingsForm.skills.filter((s: string) => s !== skill) })
  }

  const handleSettingsSave = async () => {
    setSettingsSaving(true); setSettingsMsg("")
    try {
      const payload: any = { ...settingsForm }
      if (payload.graduationYear) payload.graduationYear = parseInt(payload.graduationYear)
      if (!payload.password) delete payload.password
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(r => r.json())
      if (res.error) setSettingsMsg(res.error)
      else {
        setSettingsMsg("Profile updated successfully!")
        const fresh = await fetch("/api/user/dashboard").then(r => r.json())
        if (!fresh.error) setData(fresh)
      }
    } catch { setSettingsMsg("Something went wrong.") }
    finally { setSettingsSaving(false) }
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-8 h-8 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const { user, orders, enrollments, subscriptions, referredUsers, totalEarnings, achievements } = data
  const isRealCode = Boolean(user.referralCode && !user.referralCode.startsWith("tmp_"))
  const pendingOrders = (orders || []).filter((o: any) => o.status === "pending").length
  const subscribedIds = (subscriptions || []).map((s: any) => s.cohort?.id).filter(Boolean)
  const initials = user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
  const unlockedSlugs = new Set((achievements?.unlocked || []).map((a: any) => a.slug))
  const xpProgress = user.nextLevelXp > 0 ? Math.min(100, Math.round((user.xp / user.nextLevelXp) * 100)) : 100

  const filteredResources = resourceFilter === "ALL"
    ? resources
    : resources.filter((r: any) => r.type === resourceFilter)

  return (
    <div className="min-h-screen bg-[#060606] text-white font-body flex flex-col">

      {/* ═══ HEADER ═══ */}
      <header className="flex justify-between items-center w-full px-6 py-3 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center">
            <img src="https://ik.imagekit.io/cotszrkgk/Screenshot_2025-06-25_at_9.10.56_PM-removebg-preview.png?updatedAt=1756648034230" alt="REvamp" className="h-9 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#0085FF]/10 border border-[#0085FF]/20 rounded-full">
            <span className="material-symbols-outlined text-[#0085FF] text-xs">dashboard</span>
            <span className="text-[#0085FF] text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hidden md:flex items-center gap-1.5 text-white/30 hover:text-white text-xs transition-colors">
            <span className="material-symbols-outlined text-sm">explore</span> Browse
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0085FF] to-[#00c6ff] flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-[#0085FF]/20">{initials}</div>
            <div className="hidden sm:block">
              <p className="font-bold text-xs text-white/80 leading-none">{user.name.split(" ")[0]}</p>
              <p className="text-[10px] text-white/30 mt-0.5">Lv.{user.level} {user.levelName}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="material-symbols-outlined text-white/30 hover:text-red-400 transition-colors text-lg" title="Log out">logout</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ═══ SIDEBAR ═══ */}
        <aside className="hidden md:flex flex-col w-52 bg-[#0a0a0a] border-r border-white/5 py-5 shrink-0 overflow-y-auto">
          <nav className="flex flex-col gap-0.5 px-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all text-[13px] font-medium ${
                  activeTab === tab.id
                    ? "bg-[#0085FF]/10 text-[#0085FF]"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                }`}
              >
                <span className="material-symbols-outlined text-base" style={activeTab === tab.id ? { fontVariationSettings: "'FILL' 1" } : {}}>{tab.icon}</span>
                {tab.label}
                {tab.id === "orders" && pendingOrders > 0 && (
                  <span className="ml-auto bg-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">{pendingOrders}</span>
                )}
                {tab.id === "achievements" && (
                  <span className="ml-auto text-[10px] text-white/20">{achievements?.unlocked?.length || 0}/{achievements?.all?.length || 0}</span>
                )}
              </button>
            ))}
          </nav>
          {/* XP mini bar in sidebar */}
          <div className="mt-auto px-4 pb-4 pt-6 border-t border-white/5 mt-6">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Level {user.level}</span>
              <span className="text-[10px] text-white/20">{user.xp}/{user.nextLevelXp} XP</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#0085FF] to-[#00c6ff] rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
            </div>
            <p className="text-[10px] text-white/20 mt-1">{user.levelName}</p>
          </div>
        </aside>

        {/* ═══ MAIN CONTENT ═══ */}
        <main className="flex-1 overflow-y-auto pb-32 md:pb-10">

          {/* ─── HOME TAB ─── */}
          {activeTab === "home" && (
            <div className="animate-in fade-in duration-300">
              {/* News Carousel */}
              <div className="px-6 md:px-8 pt-6">
                <NewsCarousel items={announcements} />
              </div>

              <div className="px-6 md:px-8 py-6 space-y-8 max-w-6xl">
                {/* Welcome */}
                <div>
                  <h1 className="font-headline font-black text-3xl md:text-4xl tracking-tight">Welcome back, {user.name.split(" ")[0]}.</h1>
                  <p className="text-white/40 text-sm mt-1">Your command center. Level {user.level} {user.levelName} · {user.xp} XP</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Level", value: user.level, sub: user.levelName, icon: "star", color: "#0085FF", onClick: () => switchTab("achievements") },
                    { label: "Badges", value: achievements?.unlocked?.length || 0, sub: `of ${achievements?.all?.length || 0}`, icon: "emoji_events", color: "#FFD700", onClick: () => switchTab("achievements") },
                    { label: "Enrolled", value: (enrollments || []).length, sub: "workshops", icon: "school", color: "#8b5cf6", onClick: () => switchTab("learning") },
                    { label: "Referrals", value: user.totalReferrals, sub: `₹${totalEarnings} earned`, icon: "group_add", color: "#4ade80", onClick: () => switchTab("referrals") },
                  ].map((stat, i) => (
                    <button key={i} onClick={stat.onClick} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all text-left group">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                        <span className="material-symbols-outlined text-base transition-transform group-hover:scale-110" style={{ color: stat.color }}>{stat.icon}</span>
                      </div>
                      <div className="font-headline font-black text-2xl">{stat.value}</div>
                      <p className="text-white/20 text-[11px] mt-0.5">{stat.sub}</p>
                    </button>
                  ))}
                </div>

                {/* Following domains */}
                {(subscriptions || []).length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="font-headline font-bold text-base flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0085FF] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>interests</span> Your Domains
                      </h2>
                      <button onClick={() => switchTab("domains")} className="text-[#0085FF] text-xs hover:underline">Manage →</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(subscriptions || []).slice(0, 4).map((sub: any) => {
                        const cohort = sub.cohort
                        const latestBundle = allCohorts.find((c: any) => c.id === cohort?.id)?.bundles?.[0]
                        return (
                          <Link key={sub.id} href={`/cohort/${cohort?.slug}`} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all group" style={{ borderLeftColor: cohort?.accentHex || '#0085FF', borderLeftWidth: 3 }}>
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-lg">{cohort?.emoji}</span>
                                  <h3 className="font-headline font-bold text-sm group-hover:text-[#0085FF] transition-colors">{cohort?.name}</h3>
                                </div>
                                {latestBundle && (
                                  <p className="text-white/40 text-xs">Latest: {latestBundle.name}</p>
                                )}
                                <p className="text-white/20 text-[10px] mt-1">{allCohorts.find((c: any) => c.id === cohort?.id)?.bundles?.length || 0} workshops</p>
                              </div>
                              <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold">Following</span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Active enrollments */}
                {(enrollments || []).length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="font-headline font-bold text-base flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#8b5cf6] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>school</span> Active Workshops
                      </h2>
                      <button onClick={() => switchTab("learning")} className="text-[#0085FF] text-xs hover:underline">View All →</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(enrollments || []).slice(0, 2).map((en: any) => (
                        <div key={en.id} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all group">
                          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{en.bundle?.cohort?.emoji} {en.bundle?.cohort?.name}</p>
                          <h3 className="font-headline font-bold text-sm group-hover:text-[#0085FF] transition-colors">{en.bundle?.name}</h3>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-white/30 text-xs">{en.bundle?.duration}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${en.status === "ACTIVE" ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30"}`}>{en.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick actions + leaderboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quick actions */}
                  <div className="space-y-3">
                    <h2 className="font-headline font-bold text-base flex items-center gap-2">
                      <span className="material-symbols-outlined text-white/40 text-lg">bolt</span> Quick Actions
                    </h2>
                    <Link href="/domains" className="flex items-center gap-3 p-4 bg-[#0e0e0e] border border-white/5 rounded-xl hover:border-[#0085FF]/30 transition-all group">
                      <div className="w-10 h-10 bg-[#0085FF]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[#0085FF] text-lg">explore</span>
                      </div>
                      <div><h3 className="font-bold text-xs">Browse Workshops</h3><p className="text-white/30 text-[10px]">Explore all domains</p></div>
                    </Link>
                    {isRealCode && (
                      <button onClick={copyLink} className="flex items-center gap-3 p-4 bg-[#0e0e0e] border border-white/5 rounded-xl hover:border-[#FFD700]/30 transition-all group w-full text-left">
                        <div className="w-10 h-10 bg-[#FFD700]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-[#FFD700] text-lg">share</span>
                        </div>
                        <div><h3 className="font-bold text-xs">{copied ? "Copied! ✓" : "Share Referral Link"}</h3><p className="text-white/30 text-[10px]">Earn ₹100-200 per referral</p></div>
                      </button>
                    )}
                    <button onClick={() => switchTab("resources")} className="flex items-center gap-3 p-4 bg-[#0e0e0e] border border-white/5 rounded-xl hover:border-purple-500/30 transition-all group w-full text-left">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-purple-400 text-lg">library_books</span>
                      </div>
                      <div><h3 className="font-bold text-xs">Free Resources</h3><p className="text-white/30 text-[10px]">Cheatsheets, roadmaps, templates</p></div>
                    </button>
                  </div>

                  {/* Leaderboard */}
                  <div>
                    <h2 className="font-headline font-bold text-base flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-[#FFD700] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>leaderboard</span> Top Referrers
                    </h2>
                    <div className="bg-[#0e0e0e] border border-white/5 rounded-xl overflow-hidden">
                      {leaderboard.length === 0 ? (
                        <div className="p-6 text-center text-white/20 text-xs">No referrals yet. Be the first!</div>
                      ) : (
                        leaderboard.slice(0, 5).map((l: any, i: number) => {
                          const medals = ["🥇", "🥈", "🥉"]
                          return (
                            <div key={i} className={`flex items-center justify-between px-4 py-3 border-b border-white/[0.03] last:border-0 ${l.name?.includes(user.name.split(" ")[0]) ? "bg-[#0085FF]/5" : ""}`}>
                              <div className="flex items-center gap-3">
                                <span className="text-sm w-6 text-center">{medals[i] || `${i + 1}.`}</span>
                                <span className="text-sm font-medium">{l.name}</span>
                              </div>
                              <span className="text-white/40 text-xs font-mono">{l.referrals} refs</span>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ─── MY LEARNING TAB ─── */}
          {activeTab === "learning" && (
            <div className="max-w-4xl px-6 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
              <h1 className="font-headline font-black text-3xl tracking-tight">My Learning</h1>
              <p className="text-white/40 text-sm -mt-3">Click a workshop to see peers & discussions.</p>
              {(enrollments || []).length === 0 ? (
                <div className="text-center py-20 bg-[#0e0e0e] border border-white/5 rounded-xl">
                  <span className="material-symbols-outlined text-5xl text-white/10 mb-3 block">school</span>
                  <h2 className="font-headline font-bold text-lg text-white/50 mb-1">No enrollments yet</h2>
                  <p className="text-white/25 text-sm mb-5">Enroll in a workshop to start your journey.</p>
                  <Link href="/domains" className="inline-block bg-[#0085FF] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#0070DD]">Browse Workshops →</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {(enrollments || []).map((en: any) => {
                    const isExpanded = expandedWorkshop === en.bundle?.id
                    const peers = workshopPeers[en.bundle?.id] || []
                    const discussions = workshopDiscussions[en.bundle?.id] || []
                    return (
                      <div key={en.id} className={`bg-[#0e0e0e] border rounded-xl transition-all ${isExpanded ? "border-[#0085FF]/30" : "border-white/5 hover:border-white/10"}`}>
                        {/* Workshop header — clickable */}
                        <button onClick={() => loadPeersAndDiscussions(en.bundle?.id)} className="w-full p-5 text-left">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1"><span>{en.bundle?.cohort?.emoji}</span><span className="text-[10px] text-white/30 uppercase tracking-wider">{en.bundle?.cohort?.name}</span></div>
                              <h3 className="font-headline font-bold text-lg">{en.bundle?.name}</h3>
                              <p className="text-white/30 text-xs mt-1">{en.bundle?.duration} · Enrolled {new Date(en.enrolledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${en.status === "ACTIVE" ? "bg-green-500/10 text-green-400 border border-green-500/20" : en.status === "COMPLETED" ? "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>{en.status}</span>
                              <span className={`material-symbols-outlined text-white/20 text-sm transition-transform ${isExpanded ? "rotate-180" : ""}`}>expand_more</span>
                            </div>
                          </div>
                        </button>

                        {/* Expanded: Peers + Discussion */}
                        {isExpanded && (
                          <div className="border-t border-white/5 p-5">
                            {/* Sub-tabs */}
                            <div className="flex gap-3 mb-5">
                              <button onClick={() => setWorkshopSubTab("peers")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${workshopSubTab === "peers" ? "bg-[#0085FF] text-white" : "bg-white/5 text-white/40 hover:text-white/60"}`}>
                                <span className="material-symbols-outlined text-sm">people</span> Peers ({peers.length})
                              </button>
                              <button onClick={() => setWorkshopSubTab("discussion")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${workshopSubTab === "discussion" ? "bg-[#0085FF] text-white" : "bg-white/5 text-white/40 hover:text-white/60"}`}>
                                <span className="material-symbols-outlined text-sm">forum</span> Discussion ({discussions.length})
                              </button>
                            </div>

                            {/* ── PEERS VIEW ── */}
                            {workshopSubTab === "peers" && (
                              <div>
                                {peers.length === 0 ? (
                                  <p className="text-white/20 text-sm text-center py-8">No other peers enrolled yet. Share the workshop!</p>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {peers.map((peer: any) => (
                                      <div key={peer.id} className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                          {peer.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-bold text-sm truncate">{peer.name}</p>
                                          <p className="text-white/25 text-[10px]">{peer.college || "Student"} · Lv.{peer.level || 1}</p>
                                          {peer.githubUrl && (
                                            <a href={peer.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[#0085FF] text-[10px] hover:underline">GitHub →</a>
                                          )}
                                        </div>
                                        {peer.connectionStatus === "ACCEPTED" ? (
                                          <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-full font-bold">Connected</span>
                                        ) : peer.connectionStatus === "PENDING" ? (
                                          <span className="text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded-full font-bold">Pending</span>
                                        ) : (
                                          <button
                                            onClick={() => handleConnect(peer.id)}
                                            disabled={connectingTo === peer.id}
                                            className="bg-[#0085FF] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#0070DD] transition-all disabled:opacity-50"
                                          >
                                            {connectingTo === peer.id ? "..." : "Connect"}
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* ── DISCUSSION VIEW ── */}
                            {workshopSubTab === "discussion" && (
                              <div>
                                {/* Post input */}
                                <div className="flex gap-2 mb-4">
                                  <input
                                    type="text"
                                    value={discussionInput[en.bundle?.id] || ""}
                                    onChange={e => setDiscussionInput(prev => ({ ...prev, [en.bundle?.id]: e.target.value }))}
                                    onKeyDown={e => e.key === "Enter" && handlePostDiscussion(en.bundle?.id)}
                                    placeholder="Share something with your peers..."
                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#0085FF] transition-colors"
                                  />
                                  <button
                                    onClick={() => handlePostDiscussion(en.bundle?.id)}
                                    disabled={postingDiscussion || !discussionInput[en.bundle?.id]?.trim()}
                                    className="bg-[#0085FF] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-[#0070DD] transition-all disabled:opacity-30"
                                  >
                                    Post
                                  </button>
                                </div>

                                {discussions.length === 0 ? (
                                  <p className="text-white/20 text-sm text-center py-8">No posts yet. Start the conversation!</p>
                                ) : (
                                  <div className="space-y-3">
                                    {discussions.map((post: any) => (
                                      <div key={post.id} className="bg-black/30 border border-white/5 rounded-xl p-4">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                          <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0085FF] to-purple-500 flex items-center justify-center text-white text-[9px] font-bold">
                                              {post.user?.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                              <span className="font-bold text-xs">{post.user?.name}</span>
                                              <span className="text-white/15 text-[10px] ml-2">{post.user?.college || ""}</span>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-white/15 text-[10px]">{new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                                            <button onClick={() => handleReportPost(post.id, en.bundle?.id)} className="text-white/10 hover:text-red-400 transition-colors" title="Report">
                                              <span className="material-symbols-outlined text-xs">flag</span>
                                            </button>
                                          </div>
                                        </div>
                                        <p className="text-white/70 text-sm leading-relaxed">{post.content}</p>
                                        {/* Replies */}
                                        {post.replies && post.replies.length > 0 && (
                                          <div className="mt-3 pl-4 border-l border-white/5 space-y-2">
                                            {post.replies.map((reply: any) => (
                                              <div key={reply.id} className="flex items-start gap-2">
                                                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white text-[7px] font-bold shrink-0 mt-0.5">
                                                  {reply.user?.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                  <span className="font-bold text-[10px]">{reply.user?.name}</span>
                                                  <p className="text-white/50 text-xs">{reply.content}</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── CONNECTIONS TAB ─── */}
          {activeTab === "connections" && (
            <div className="max-w-4xl px-6 md:px-8 py-6 space-y-8 animate-in fade-in duration-300">
              <div>
                <h1 className="font-headline font-black text-3xl tracking-tight mb-1">Connections</h1>
                <p className="text-white/40 text-sm">People you've connected with through workshops.</p>
              </div>

              {connectionsLoading ? (
                <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <>
                  {/* Pending incoming */}
                  {connections.pendingIncoming?.length > 0 && (
                    <div>
                      <h2 className="font-headline font-bold text-sm mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-500 text-base">notification_important</span>
                        Pending Requests ({connections.pendingIncoming.length})
                      </h2>
                      <div className="space-y-2">
                        {connections.pendingIncoming.map((conn: any) => (
                          <div key={conn.id} className="bg-[#0e0e0e] border border-yellow-500/15 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                              {conn.peer?.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-sm">{conn.peer?.name}</p>
                              <p className="text-white/25 text-[10px]">{conn.peer?.college || "Student"} · Lv.{conn.peer?.level || 1}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleConnectionAction(conn.id, "ACCEPTED")}
                                disabled={connectionActionLoading === conn.id}
                                className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleConnectionAction(conn.id, "DECLINED")}
                                disabled={connectionActionLoading === conn.id}
                                className="bg-white/5 text-white/40 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-50"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pending outgoing */}
                  {connections.pendingOutgoing?.length > 0 && (
                    <div>
                      <h2 className="font-headline font-bold text-sm mb-3 text-white/40">Sent ({connections.pendingOutgoing.length})</h2>
                      <div className="space-y-2">
                        {connections.pendingOutgoing.map((conn: any) => (
                          <div key={conn.id} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-4 flex items-center gap-4 opacity-60">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white text-xs font-bold">
                              {conn.peer?.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-sm">{conn.peer?.name}</p>
                              <p className="text-white/25 text-[10px]">{conn.peer?.college || "Student"}</p>
                            </div>
                            <span className="text-[10px] text-yellow-500/60 font-bold">Pending</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accepted connections */}
                  <div>
                    <h2 className="font-headline font-bold text-sm mb-3">Your Network ({connections.accepted?.length || 0})</h2>
                    {(!connections.accepted || connections.accepted.length === 0) ? (
                      <div className="text-center py-16 bg-[#0e0e0e] border border-white/5 rounded-xl">
                        <span className="material-symbols-outlined text-5xl text-white/10 mb-3 block">people</span>
                        <h3 className="font-headline font-bold text-lg text-white/50 mb-1">No connections yet</h3>
                        <p className="text-white/25 text-sm mb-5">Enroll in a workshop and connect with peers.</p>
                        <button onClick={() => switchTab("learning")} className="inline-block bg-[#0085FF] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#0070DD]">Go to My Learning →</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {connections.accepted.map((conn: any) => (
                          <div key={conn.id} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-4 flex items-center gap-3 hover:border-white/10 transition-all">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0085FF] to-[#00c6ff] flex items-center justify-center text-white text-xs font-bold">
                              {conn.peer?.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate">{conn.peer?.name}</p>
                              <p className="text-white/25 text-[10px]">{conn.peer?.college || "Student"} · Lv.{conn.peer?.level || 1}</p>
                            </div>
                            {conn.peer?.githubUrl && (
                              <a href={conn.peer.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-white/5 text-white/40 px-2.5 py-1 rounded-lg hover:text-white hover:bg-white/10 transition-all">GitHub →</a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ─── ORDERS TAB ─── */}
          {activeTab === "orders" && (
            <div className="max-w-4xl px-6 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
              <h1 className="font-headline font-black text-3xl tracking-tight">Orders</h1>
              {(orders || []).length === 0 ? (
                <div className="text-center py-20 bg-[#0e0e0e] border border-white/5 rounded-xl">
                  <span className="material-symbols-outlined text-5xl text-white/10 mb-3 block">receipt_long</span>
                  <h2 className="font-headline font-bold text-lg text-white/50 mb-1">No orders yet</h2>
                  <p className="text-white/25 text-sm mb-5">Your purchase history will appear here.</p>
                  <Link href="/domains" className="inline-block bg-[#0085FF] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#0070DD]">Browse Workshops →</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {(orders || []).map((order: any) => (
                    <div key={order.id} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h3 className="font-headline font-bold">{order.bundle?.name || order.productName || "Workshop"}</h3>
                          <p className="text-white/25 text-xs mt-1">{order.bundle?.cohort?.emoji} {order.bundle?.cohort?.name} · {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-headline font-bold text-lg">₹{order.amount}</span>
                          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            order.status === "paid" ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : order.status === "pending" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>{order.status === "paid" ? "Confirmed" : order.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── REFERRALS TAB ─── */}
          {activeTab === "referrals" && (
            <div className="max-w-4xl px-6 md:px-8 py-6 space-y-8 animate-in fade-in duration-300">
              <h1 className="font-headline font-black text-3xl tracking-tight">Referrals</h1>
              {isRealCode && (
                <div className="bg-gradient-to-br from-[#0e0e0e] to-[#1a1500]/30 border border-[#FFD700]/15 rounded-2xl p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-[#FFD700] text-[10px] font-bold uppercase tracking-widest mb-4">Your Referral Link</p>
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                      <div className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-[#0085FF] text-sm truncate">letsrevamp.in?ref={user.referralCode}</div>
                      <button onClick={copyLink} className="bg-[#0085FF] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#0070DD] transition-all shrink-0">{copied ? "Copied! ✓" : "Copy Link"}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/30 rounded-lg p-4 text-center"><div className="font-headline font-black text-2xl text-[#FFD700]">₹{totalEarnings}</div><p className="text-white/30 text-xs mt-0.5">Total Earned</p></div>
                      <div className="bg-black/30 rounded-lg p-4 text-center"><div className="font-headline font-black text-2xl">{user.totalReferrals}</div><p className="text-white/30 text-xs mt-0.5">People Referred</p></div>
                    </div>
                  </div>
                </div>
              )}
              {(referredUsers || []).length > 0 && (
                <div>
                  <h2 className="font-headline font-bold text-sm mb-3">Referred Users</h2>
                  <div className="space-y-2">
                    {(referredUsers || []).map((u: any) => (
                      <div key={u.id} className="flex justify-between items-center bg-[#0e0e0e] border border-white/5 rounded-xl p-4">
                        <div><p className="font-bold text-sm">{u.name || "Anonymous"}</p><p className="text-white/25 text-xs">{u.email}</p></div>
                        <p className="text-white/25 text-xs">{new Date(u.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── DOMAINS TAB (GRID) ─── */}
          {activeTab === "domains" && (
            <div className="max-w-5xl px-6 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
              <div>
                <h1 className="font-headline font-black text-3xl tracking-tight mb-1">Domains</h1>
                <p className="text-white/40 text-sm">Follow domains to get notified when new workshops drop.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCohorts.map((cohort: any) => {
                  const isFollowing = subscribedIds.includes(cohort.id)
                  const isLoading = followLoading === cohort.id
                  return (
                    <div key={cohort.id} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all flex flex-col" style={{ borderTopColor: cohort.accentHex || '#333', borderTopWidth: 2 }}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{cohort.emoji}</span>
                        <h3 className="font-headline font-bold">{cohort.name}</h3>
                      </div>
                      <p className="text-white/35 text-xs line-clamp-2 mb-3 flex-1">{cohort.description}</p>
                      <p className="text-white/15 text-[10px] mb-4">{(cohort.bundles || []).length} workshops</p>
                      <div className="flex items-center gap-2">
                        <Link href={`/cohort/${cohort.slug}`} className="text-[#0085FF] text-xs hover:underline flex-1">Visit →</Link>
                        <button
                          onClick={() => isFollowing ? handleUnsubscribe(cohort.id) : handleSubscribe(cohort.id)}
                          disabled={isLoading}
                          className={`px-4 py-2 rounded-lg font-bold text-xs transition-all disabled:opacity-50 ${
                            isFollowing
                              ? "bg-white/5 text-white/50 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                              : "bg-[#0085FF] text-white hover:bg-[#0070DD] shadow-lg shadow-[#0085FF]/20"
                          }`}
                        >
                          {isLoading ? (
                            <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                          ) : isFollowing ? "Following ✓" : "Follow"}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ─── ACHIEVEMENTS TAB ─── */}
          {activeTab === "achievements" && (
            <div className="max-w-4xl px-6 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
              <div>
                <h1 className="font-headline font-black text-3xl tracking-tight mb-1">Achievements</h1>
                <p className="text-white/40 text-sm">Earn badges and XP by engaging with the platform.</p>
              </div>

              {/* XP card */}
              <div className="bg-gradient-to-br from-[#0e0e0e] to-[#001a3a]/30 border border-[#0085FF]/15 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0085FF] to-[#00c6ff] flex items-center justify-center text-2xl font-bold shadow-xl shadow-[#0085FF]/20">{user.level}</div>
                  <div>
                    <h2 className="font-headline font-bold text-xl">{user.levelName}</h2>
                    <p className="text-white/40 text-xs">{user.xp} / {user.nextLevelXp} XP to next level</p>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0085FF] to-[#00c6ff] rounded-full transition-all duration-700" style={{ width: `${xpProgress}%` }} />
                </div>
              </div>

              {/* Badges grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(achievements?.all || []).map((ach: any) => {
                  const isUnlocked = unlockedSlugs.has(ach.slug)
                  const unlockData = (achievements?.unlocked || []).find((a: any) => a.slug === ach.slug)
                  return (
                    <div key={ach.id} className={`rounded-xl p-5 transition-all ${
                      isUnlocked
                        ? "bg-[#0e0e0e] border border-white/10"
                        : "bg-[#0e0e0e]/50 border border-dashed border-white/5"
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-3xl ${isUnlocked ? "" : "opacity-20 grayscale"}`}>{ach.emoji}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isUnlocked ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-white/5 text-white/20"
                        }`}>{isUnlocked ? "Unlocked" : `${ach.xpReward} XP`}</span>
                      </div>
                      <h3 className={`font-headline font-bold text-sm ${isUnlocked ? "" : "text-white/30"}`}>{ach.name}</h3>
                      <p className={`text-xs mt-1 ${isUnlocked ? "text-white/40" : "text-white/15"}`}>{ach.description}</p>
                      {isUnlocked && unlockData?.unlockedAt && (
                        <p className="text-green-400/40 text-[10px] mt-2">Earned {new Date(unlockData.unlockedAt).toLocaleDateString("en-IN")}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ─── RESOURCES TAB ─── */}
          {activeTab === "resources" && (
            <div className="max-w-5xl px-6 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
              <div>
                <h1 className="font-headline font-black text-3xl tracking-tight mb-1">Resources</h1>
                <p className="text-white/40 text-sm">Free cheatsheets, roadmaps, and templates to level up.</p>
              </div>

              {/* Filter bar */}
              <div className="flex gap-2 flex-wrap">
                {["ALL", "CHEATSHEET", "ROADMAP", "TEMPLATE", "RECORDING", "LINK"].map(type => (
                  <button key={type} onClick={() => setResourceFilter(type)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    resourceFilter === type ? "bg-[#0085FF] text-white" : "bg-white/5 text-white/40 hover:text-white/60"
                  }`}>{type === "ALL" ? "All" : type.charAt(0) + type.slice(1).toLowerCase() + "s"}</button>
                ))}
              </div>

              {filteredResources.length === 0 ? (
                <div className="text-center py-16 text-white/20">
                  <span className="material-symbols-outlined text-5xl mb-3 block">library_books</span>
                  <p className="text-sm">No resources available yet. Check back soon!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResources.map((res: any) => {
                    const typeIcons: Record<string, string> = { CHEATSHEET: "description", ROADMAP: "map", TEMPLATE: "draft", RECORDING: "play_circle", LINK: "link" }
                    const typeColors: Record<string, string> = { CHEATSHEET: "#0085FF", ROADMAP: "#4ade80", TEMPLATE: "#FFD700", RECORDING: "#8b5cf6", LINK: "#06b6d4" }
                    return (
                      <a key={res.id} href={res.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-[#0e0e0e] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all group">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: (typeColors[res.type] || "#555") + "15" }}>
                            <span className="material-symbols-outlined text-lg" style={{ color: typeColors[res.type] }}>{typeIcons[res.type] || "description"}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm group-hover:text-[#0085FF] transition-colors line-clamp-1">{res.title}</h3>
                            <p className="text-white/30 text-xs mt-0.5 line-clamp-1">{res.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-[10px] text-white/20 uppercase tracking-wider">{res.type}</span>
                          <span className="text-[10px] text-white/20">{res.downloadCount || 0} downloads</span>
                        </div>
                        {res.isPremium && (
                          <div className="mt-2 text-[10px] text-[#FFD700]/60 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">lock</span> Premium
                          </div>
                        )}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── SETTINGS TAB ─── */}
          {activeTab === "settings" && (
            <div className="max-w-xl px-6 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
              <h1 className="font-headline font-black text-3xl tracking-tight">Settings</h1>

              <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6 space-y-5">
                <div className="flex items-center gap-4 pb-5 border-b border-white/5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0085FF] to-[#00c6ff] flex items-center justify-center text-white text-lg font-bold">{initials}</div>
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-white/30 text-xs">{user.email}</p>
                    <p className="text-white/15 text-[10px] mt-0.5">Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
                  </div>
                </div>

                {settingsMsg && (
                  <div className={`p-3 rounded-lg text-xs ${settingsMsg.includes("success") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{settingsMsg}</div>
                )}

                {/* Basic */}
                <div className="space-y-4">
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Basic Info</p>
                  <div>
                    <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">Full Name</label>
                    <input type="text" value={settingsForm.name} onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#0085FF] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">Phone</label>
                    <input type="tel" value={settingsForm.phone} onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#0085FF] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">College</label>
                    <input type="text" value={settingsForm.college} onChange={e => setSettingsForm({ ...settingsForm, college: e.target.value })} placeholder="e.g. IIT Delhi" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/15 outline-none focus:border-[#0085FF] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">Graduation Year</label>
                    <input type="number" value={settingsForm.graduationYear} onChange={e => setSettingsForm({ ...settingsForm, graduationYear: e.target.value })} placeholder="2027" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/15 outline-none focus:border-[#0085FF] transition-colors" />
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {(settingsForm.skills || []).map((skill: string) => (
                      <span key={skill} className="flex items-center gap-1 bg-[#0085FF]/10 text-[#0085FF] text-xs font-medium px-3 py-1 rounded-full border border-[#0085FF]/20">
                        {skill}
                        <button onClick={() => handleRemoveSkill(skill)} className="text-[#0085FF]/50 hover:text-red-400 transition-colors ml-1">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddSkill())} placeholder="Add skill (e.g. React)" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/15 outline-none focus:border-[#0085FF] transition-colors" />
                    <button onClick={handleAddSkill} className="bg-white/5 text-white/50 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-all">Add</button>
                  </div>
                </div>

                {/* Socials */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Social Links</p>
                  <div>
                    <label className="block text-white/30 text-[10px] uppercase tracking-wider mb-1">GitHub URL</label>
                    <input type="url" value={settingsForm.githubUrl} onChange={e => setSettingsForm({ ...settingsForm, githubUrl: e.target.value })} placeholder="https://github.com/username" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/15 outline-none focus:border-[#0085FF] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-white/30 text-[10px] uppercase tracking-wider mb-1">LinkedIn URL</label>
                    <input type="url" value={settingsForm.linkedinUrl} onChange={e => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/username" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/15 outline-none focus:border-[#0085FF] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-white/30 text-[10px] uppercase tracking-wider mb-1">Twitter / X URL</label>
                    <input type="url" value={settingsForm.twitterUrl} onChange={e => setSettingsForm({ ...settingsForm, twitterUrl: e.target.value })} placeholder="https://x.com/username" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/15 outline-none focus:border-[#0085FF] transition-colors" />
                  </div>
                </div>

                {/* Password */}
                <div className="pt-4 border-t border-white/5">
                  <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">New Password <span className="text-white/15 normal-case">(leave blank to keep current)</span></label>
                  <input type="password" value={settingsForm.password} onChange={e => setSettingsForm({ ...settingsForm, password: e.target.value })} placeholder="••••••••" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/15 outline-none focus:border-[#0085FF] transition-colors" />
                </div>

                <button onClick={handleSettingsSave} disabled={settingsSaving} className="w-full bg-[#0085FF] text-white rounded-lg py-3 font-bold text-sm uppercase tracking-wider hover:bg-[#0070DD] transition-all disabled:opacity-50 shadow-lg mt-4">
                  {settingsSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-5">
                <h3 className="font-bold text-xs text-white/40 mb-3">Account Info</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-white/25">Email</span><span className="text-white/60">{user.email}</span></div>
                  <div className="flex justify-between"><span className="text-white/25">Referral Code</span><span className="text-white/60 font-mono">{user.referralCode}</span></div>
                  <div className="flex justify-between"><span className="text-white/25">User ID</span><span className="text-white/20 font-mono text-[10px]">{user.id.slice(0, 12)}…</span></div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ═══ MOBILE TAB BAR ═══ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 flex justify-around py-1.5 px-1 z-50">
        {TABS.slice(0, 5).map((tab) => (
          <button key={tab.id} onClick={() => switchTab(tab.id)} className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all ${activeTab === tab.id ? "text-[#0085FF]" : "text-white/25"}`}>
            <span className="material-symbols-outlined text-base" style={activeTab === tab.id ? { fontVariationSettings: "'FILL' 1" } : {}}>{tab.icon}</span>
            <span className="text-[8px] font-bold uppercase tracking-wider">{tab.label.split(" ").pop()}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function UserDashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-black"><div className="w-8 h-8 border-2 border-[#0085FF] border-t-transparent rounded-full animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  )
}
