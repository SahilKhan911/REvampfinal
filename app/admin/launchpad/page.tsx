"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

// ─── Default curriculum seeded from the program PDF ──────────────────────────
const DEFAULT_SESSIONS = [
  { week: 1, day: 1, title: "Welcome & The REvamp World", subtitle: "Orientation", topics: ["Intro to Launchpad — what these 4 weeks are", "Tour of the REvamp ecosystem: Launchpad → AIconic", "What REcoins are and how students earn them", "Community setup: join Discord, set nickname, intro", "Icebreaker: 'If you could automate one thing...'"], homework: "Watch 3Blue1Brown's 'But what is a neural network?' — just to plant a seed. No need to understand it yet." },
  { week: 1, day: 2, title: "Mapping the CSE Universe", subtitle: "Orientation", topics: ["The 4 domains: Web Dev, AI/ML, Cybersecurity, Open Source", "Career paths: where each domain leads in 4 years", "Busting myths: 'AI will replace programmers' etc.", "Real people in each domain — 2–3 examples per track", "Open Q&A — no stupid questions rule enforced hard"], homework: "Google one person working in the domain that interests you. Drop their name + one thing they built in Discord." },
  { week: 1, day: 3, title: "How the Internet Works", subtitle: "Orientation", topics: ["What happens when you type google.com and hit enter", "Clients, servers, requests, responses — in plain English", "HTTP vs HTTPS, DNS, IP addresses", "Live demo: DevTools → Network tab on any live website", "Analogy: the internet as a postal system"], homework: "Open DevTools on any site you use daily. Screenshot the most interesting network request you find. Share it." },
  { week: 1, day: 4, title: "How Computers Think", subtitle: "Orientation", topics: ["Binary — why computers speak 0s and 1s", "What an algorithm is: the cooking recipe analogy", "What data is: everything is just structured information", "What a program really is: instructions + data + execution", "Group exercise: write plain-English steps to sort 5 numbers"], homework: "Write a plain-English algorithm for any one task from your daily routine. Minimum 10 steps." },
  { week: 1, day: 5, title: "Tools Setup + Open AMA", subtitle: "Orientation", topics: ["Create a GitHub account — walk through live together", "Install VS Code and configure basic extensions", "Join the REvamp Discord properly — explore all channels", "Open AMA: anything about CSE, career, college", "Preview of Week 2"], homework: "Customize your GitHub profile — bio, photo, pinned repo. First impressions matter." },
  { week: 2, day: 1, title: "Terminal + Git + GitHub", subtitle: "Foundations", topics: ["What the terminal is and why developers live in it", "Core commands: cd, ls, mkdir, touch, mv, rm — live demo", "What version control is: the 'save game' analogy", "Git workflow: init → add → commit → push", "GitHub as a portfolio — it is their public CV"], homework: "Add day1-reflection.md to your repo — 5 sentences about what surprised you today." },
  { week: 2, day: 2, title: "Python: The Universal Language", subtitle: "Foundations", topics: ["Why Python: AI, scripting, automation, data, prototyping", "Variables, data types — integers, strings, lists, dicts", "Conditionals: if/elif/else · Loops: for and while · Functions", "Live exercise: function that prints 'Welcome to Launchpad!'", "Reading Python errors — normalize breaking things"], homework: "Write a Python script that asks for name and age, then prints the year they were born. Push it." },
  { week: 2, day: 3, title: "Web Basics: HTML + CSS", subtitle: "Foundations", topics: ["What HTML is: the skeleton · What CSS is: the styling layer", "Tags: h1–h6, p, a, img, div, ul/li", "Basic CSS: colors, fonts, margins, padding, flexbox", "Live build: personal page → push to GitHub Pages", "The moment: 'Your page is now live on the internet'"], homework: "Customize your page — different colors, a photo, a 'What I want to build' section." },
  { week: 2, day: 4, title: "JavaScript + APIs", subtitle: "Foundations", topics: ["What JS does that HTML/CSS can't: interactivity and logic", "Variables, functions, DOM manipulation", "What an API is: the restaurant menu analogy", "Live demo: fetch a public API and display result on the page", "Add a working interactive button to personal page"], homework: "Add one working JS feature to your personal page. Anything counts. Push it." },
  { week: 2, day: 5, title: "Mini-Project Day", subtitle: "Foundations", topics: ["Option A: Quiz app — HTML/CSS/JS, 5 questions, shows score", "Option B: Python scraper — requests + BeautifulSoup", "Option C: Python to-do CLI — add, view, delete tasks", "No hand-holding on syntax — Google, Discord, figure it out", "Everyone shares GitHub link in Discord for peer reactions"], homework: "Write week2-reflection.md — what you built, what broke, what you'd do differently." },
  { week: 3, day: 1, title: "Web Dev Day", subtitle: "Deep Dive", topics: ["What a real web dev does day-to-day — the actual work", "Frontend vs backend vs fullstack — clear definitions", "Frameworks intro: why React exists, what Node.js does", "Live build challenge: recreate a UI screenshot in 45 mins", "roadmap.sh walkthrough"], homework: "Find a site you love the design of. Inspect it in DevTools. What CSS tricks can you spot?" },
  { week: 3, day: 2, title: "AI/ML Day", subtitle: "Deep Dive", topics: ["Demystifying AI: pattern matching at scale, not magic", "What training data is and why it matters more than the model", "Types of ML: classification, regression, clustering", "Live demo 1: pre-trained image classifier in Google Colab", "Live demo 2: prompt engineering — 5 prompts, compare outputs"], homework: "Use any AI tool to solve one problem you actually have. Write 5 sentences on what worked and what didn't." },
  { week: 3, day: 3, title: "Cybersecurity Day", subtitle: "Deep Dive", topics: ["What cybersecurity actually is: offense, defense, ethical grey", "Types of roles: ethical hacker, analyst, bug bounty, cryptographer", "Core concepts: authentication, encryption, vulnerabilities", "What a CTF is — the sport of hacking", "Live CTF on PicoCTF: find flag, decode Base64, SQL injection"], homework: "Create a TryHackMe account. Complete the first room. Screenshot your completion badge." },
  { week: 3, day: 4, title: "Open Source Day", subtitle: "Deep Dive", topics: ["What open source means — the philosophy, not just the license", "Why OSS contributions are the fastest path to credibility", "Tour of a real GitHub repo: issues, PRs, README, CONTRIBUTING.md", "How to find beginner-friendly issues: 'good first issue' label", "Live exercise: fork, make one small change, open a real PR"], homework: "Find one open source project you actually use. Read its CONTRIBUTING.md." },
  { week: 3, day: 5, title: "Reflection + LinkedIn + Hackathon Prep", subtitle: "Deep Dive", topics: ["30-min solo journaling: 'Which day made you lean forward? Why?'", "LinkedIn profile build live: headline, about, education, skills", "What to post as a beginner: build-in-public, project updates", "GitHub READMEs, Twitter/X for devs, Instagram for founders", "Hackathon rules + team formation, REcoins walkthrough"], homework: "DM your teammates. Agree on a domain. Post team name in Discord. LinkedIn post if you haven't yet." },
  { week: 4, day: 1, title: "Problem Statements Drop + Team Kick-off", subtitle: "Hackathon", topics: ["9 AM: problem statements released across all channels", "Teams read, discuss, pick their problem (9–10 AM)", "Ideation with a mentor — scope to something shippable in 3 days", "Set up repo, write README with plan, push — public commitment"], homework: "Deliverable: GitHub repo with README explaining what you're building and how." },
  { week: 4, day: 2, title: "Build Day 1 — Full Build Day", subtitle: "Hackathon", topics: ["No sessions, no lectures — just build", "Mentors available async on Discord in #hackathon-help", "Optional 30-min office hour at 3 PM for stuck teams", "Commit at least once every 2 hours — shows progress"], homework: "End of day: one-liner update in #build-log." },
  { week: 4, day: 3, title: "Build Day 2 + Mid-Check", subtitle: "Hackathon", topics: ["Morning: continue building — core features only", "12 PM mandatory mid-check in #build-log: working / broken / cut", "Afternoon: extended 1-hour office hours — priority for stuck teams", "By end of today: core functionality complete — Day 4 is polish only"], homework: "By end of today: core functionality complete." },
  { week: 4, day: 4, title: "Final Polish + Demo Prep", subtitle: "Hackathon", topics: ["No new features — fix, clean, document", "Every team needs: deployed URL, screen recording, or documented local run", "Prepare 5-minute pitch: problem → demo → what's next", "Submit GitHub + demo link by 6 PM — hard deadline, no exceptions"], homework: "Submit GitHub + demo link by 6 PM." },
  { week: 4, day: 5, title: "Demo Day — The Main Event", subtitle: "Hackathon", topics: ["10 AM: all teams join the call", "5 mins per team, hard cut, 2 judge questions after each", "15-min judge deliberation after all demos", "REcoins announced live — certs emailed within 24 hours", "Discord stays open — the community doesn't end here"], homework: "Post on LinkedIn about what you built. Tag #REvampLaunchpad." },
]

const WEEK_LABELS: Record<number, string> = { 1: "Orientation", 2: "Foundations", 3: "Deep Dive", 4: "Hackathon" }

type AdminTab = "sessions" | "students"

export default function LaunchpadAdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("sessions")

  // ── sessions state ────────────────────────────────────
  const [sessions, setSessions] = useState<any[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [editingSession, setEditingSession] = useState<any | null>(null)
  const [sessionForm, setSessionForm] = useState<any>({})
  const [sessionSaving, setSessionSaving] = useState(false)
  const [seedingAll, setSeedingAll] = useState(false)

  // ── attendance state ──────────────────────────────────
  const [attendanceSession, setAttendanceSession] = useState<any | null>(null)
  const [attendanceStudents, setAttendanceStudents] = useState<any[]>([])
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [attendanceSaving, setAttendanceSaving] = useState(false)
  const [attendanceLoading, setAttendanceLoading] = useState(false)

  // ── students state ────────────────────────────────────
  const [students, setStudents] = useState<any[]>([])
  const [allSessions, setAllSessions] = useState<any[]>([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)

  // ── fetch sessions ────────────────────────────────────
  const fetchSessions = async () => {
    setSessionsLoading(true)
    const data = await fetch("/api/admin/launchpad/sessions").then(r => r.json()).catch(() => [])
    setSessions(Array.isArray(data) ? data : [])
    setSessionsLoading(false)
  }

  const fetchStudents = async () => {
    setStudentsLoading(true)
    const data = await fetch("/api/admin/launchpad/students").then(r => r.json()).catch(() => ({ students: [], sessions: [] }))
    setStudents(data.students || [])
    setAllSessions(data.sessions || [])
    setStudentsLoading(false)
  }

  useEffect(() => { fetchSessions() }, [])
  useEffect(() => { if (activeTab === "students") fetchStudents() }, [activeTab])

  // ── seed default curriculum ───────────────────────────
  const handleSeedAll = async () => {
    if (!confirm(`This will create ${DEFAULT_SESSIONS.length} sessions from the program PDF. Sessions that already exist (same week+day) will be skipped. Continue?`)) return
    setSeedingAll(true)
    let created = 0
    for (const s of DEFAULT_SESSIONS) {
      const existing = sessions.find(x => x.week === s.week && x.day === s.day)
      if (!existing) {
        await fetch("/api/admin/launchpad/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(s),
        })
        created++
      }
    }
    setSeedingAll(false)
    alert(`Created ${created} sessions.`)
    fetchSessions()
  }

  // ── open session editor ───────────────────────────────
  const openEdit = (s: any) => {
    setEditingSession(s)
    setAttendanceSession(null)
    setSessionForm({
      title: s.title || "",
      subtitle: s.subtitle || "",
      topics: Array.isArray(s.topics) ? s.topics.join("\n") : "",
      homework: s.homework || "",
      sessionDate: s.sessionDate ? new Date(s.sessionDate).toISOString().slice(0, 16) : "",
      joinLink: s.joinLink || "",
      recordingUrl: s.recordingUrl || "",
      isVisible: s.isVisible !== false,
      isLive: s.isLive === true,
    })
  }

  const openNew = () => {
    const maxDay = sessions.reduce((m, s) => {
      const n = s.week * 10 + s.day; return n > m ? n : m
    }, 0)
    const nextWeek = maxDay ? Math.min(4, Math.floor(maxDay / 10) + (maxDay % 10 >= 5 ? 1 : 0)) : 1
    const nextDay = maxDay ? (maxDay % 10 >= 5 ? 1 : (maxDay % 10) + 1) : 1
    setEditingSession({ isNew: true })
    setAttendanceSession(null)
    setSessionForm({ week: nextWeek, day: nextDay, title: "", subtitle: "", topics: "", homework: "", sessionDate: "", joinLink: "", recordingUrl: "", isVisible: true, isLive: false })
  }

  const handleSaveSession = async () => {
    setSessionSaving(true)
    const payload = {
      ...(!editingSession.isNew && { id: editingSession.id }),
      week: Number(sessionForm.week),
      day: Number(sessionForm.day),
      title: sessionForm.title,
      subtitle: sessionForm.subtitle,
      topics: sessionForm.topics ? sessionForm.topics.split("\n").map((t: string) => t.trim()).filter(Boolean) : [],
      homework: sessionForm.homework,
      sessionDate: sessionForm.sessionDate || null,
      joinLink: sessionForm.joinLink,
      recordingUrl: sessionForm.recordingUrl,
      isVisible: sessionForm.isVisible,
      isLive: sessionForm.isLive,
    }
    const method = editingSession.isNew ? "POST" : "PATCH"
    await fetch("/api/admin/launchpad/sessions", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    setSessionSaving(false)
    setEditingSession(null)
    fetchSessions()
  }

  const handleDeleteSession = async (id: string) => {
    if (!confirm("Delete this session? Attendance records will also be removed.")) return
    await fetch("/api/admin/launchpad/sessions", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    setEditingSession(null)
    fetchSessions()
  }

  // ── open attendance panel ─────────────────────────────
  const openAttendance = async (session: any) => {
    setEditingSession(null)
    setAttendanceSession(session)
    setAttendanceLoading(true)

    const [studentsRes, attRes] = await Promise.all([
      fetch("/api/admin/launchpad/students").then(r => r.json()).catch(() => ({ students: [] })),
      fetch(`/api/admin/launchpad/attendance?sessionId=${session.id}`).then(r => r.json()).catch(() => ({ attendedUserIds: [] })),
    ])
    setAttendanceStudents(studentsRes.students || [])
    setCheckedIds(new Set(attRes.attendedUserIds || []))
    setAttendanceLoading(false)
  }

  const toggleAttendance = (userId: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev)
      next.has(userId) ? next.delete(userId) : next.add(userId)
      return next
    })
  }

  const saveAttendance = async () => {
    if (!attendanceSession) return
    setAttendanceSaving(true)
    await fetch("/api/admin/launchpad/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: attendanceSession.id, attendedUserIds: Array.from(checkedIds) }),
    })
    setAttendanceSaving(false)
    setAttendanceSession(null)
    if (activeTab === "students") fetchStudents()
  }

  // ── helpers ───────────────────────────────────────────
  const sessionsByWeek = [1, 2, 3, 4].map(w => ({ week: w, sessions: sessions.filter(s => s.week === w).sort((a, b) => a.day - b.day) }))
  const existingWDs = new Set(sessions.map(s => `${s.week}-${s.day}`))
  const missingSessions = DEFAULT_SESSIONS.filter(s => !existingWDs.has(`${s.week}-${s.day}`))

  const certColor = (c: string) => c === 'COMPLETION' ? 'text-green-400' : c === 'PARTICIPATION' ? 'text-yellow-400' : 'text-white/30'

  const inputCls = "w-full bg-[#0e0e0e] border border-[#2a2a2a] px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#3a90ff]/60 transition-colors font-mono"
  const labelCls = "block text-[9px] font-black text-white/30 uppercase tracking-[0.15em] mb-1.5"

  return (
    <div className="min-h-screen bg-[#131313] font-headline text-white">

      {/* TOPBAR */}
      <header className="bg-[#131313] flex justify-between items-center w-full px-6 py-4 border-b-4 border-[#1B1B1B] z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </Link>
          <span className="text-2xl font-black text-white tracking-tighter uppercase">
            REVAMP <span className="text-[#3A90FF]">ADMIN</span>
          </span>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#1f1f1f]">
            <span className="material-symbols-outlined text-xs text-[#a9c7ff]">rocket_launch</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">LAUNCHPAD_CONTROL</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors px-3 py-2">Orders</Link>
          <Link href="/admin/users" className="text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors px-3 py-2">Users</Link>
        </div>
      </header>

      <div className="flex">

        {/* SIDEBAR */}
        <aside className="fixed left-0 top-[69px] h-[calc(100vh-69px)] w-56 bg-[#1B1B1B] flex flex-col z-40 border-r border-[#252525]">
          <nav className="flex-1 flex flex-col gap-1 p-3 pt-6">
            {([
              { id: "sessions", label: "SESSIONS", icon: "calendar_month", sub: `${sessions.length}/20 created` },
              { id: "students", label: "STUDENTS", icon: "group", sub: `${students.length} enrolled` },
            ] as { id: AdminTab; label: string; icon: string; sub: string }[]).map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${activeTab === item.id ? "bg-[#3A90FF] text-[#131313]" : "text-white/50 hover:bg-[#2A2A2A] hover:text-white"} px-4 py-3 flex items-center gap-3 w-full transition-all text-left`}
              >
                <span className="material-symbols-outlined text-sm" style={activeTab === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                <div>
                  <p className="font-bold tracking-widest uppercase text-[11px]">{item.label}</p>
                  <p className={`text-[9px] mt-0.5 ${activeTab === item.id ? "text-[#131313]/60" : "text-white/25"}`}>{item.sub}</p>
                </div>
              </button>
            ))}
          </nav>

          {missingSessions.length > 0 && (
            <div className="p-3 border-t border-[#252525]">
              <div className="bg-[#0e0e0e] p-3 border-l-4 border-yellow-500">
                <p className="text-[9px] font-bold text-yellow-400/70 uppercase mb-1">{missingSessions.length} sessions missing</p>
                <button
                  onClick={handleSeedAll}
                  disabled={seedingAll}
                  className="w-full bg-yellow-500 text-[#131313] py-2 font-black text-[10px] tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {seedingAll ? "SEEDING..." : "SEED DEFAULT"}
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="flex-1 ml-56 p-8 min-h-[calc(100vh-69px)]">

          {/* ═══════════════════ SESSIONS TAB ═══ */}
          {activeTab === "sessions" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-black text-2xl uppercase tracking-tight">Session Management</h1>
                  <p className="text-white/30 text-xs mt-1">Create, edit, and control all 20 Launchpad sessions</p>
                </div>
                <button onClick={openNew} className="flex items-center gap-2 bg-[#3A90FF] text-white px-5 py-3 font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all">
                  <span className="material-symbols-outlined text-base">add</span>
                  NEW SESSION
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* Left: session grid */}
                <div className="space-y-6">
                  {sessionsLoading ? (
                    <div className="flex items-center gap-3 py-12 text-white/20">
                      <div className="w-5 h-5 border-2 border-[#3A90FF] border-t-transparent rounded-full animate-spin" />
                      Loading sessions...
                    </div>
                  ) : sessionsByWeek.map(({ week, sessions: wSessions }) => (
                    <div key={week}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-black text-[#3A90FF] uppercase tracking-[0.2em]">WEEK {week}</span>
                        <span className="text-white/20 text-[10px]">— {WEEK_LABELS[week]}</span>
                        <div className="flex-1 h-px bg-[#252525]" />
                        <span className="text-[9px] text-white/20">{wSessions.length}/5</span>
                      </div>
                      <div className="space-y-1.5">
                        {[1, 2, 3, 4, 5].map(day => {
                          const s = wSessions.find(x => x.day === day)
                          if (!s) return (
                            <div key={day} className="bg-[#1a1a1a] border border-dashed border-[#2a2a2a] px-4 py-3 flex items-center gap-3">
                              <span className="text-[9px] font-bold text-white/15 w-12">D{day}</span>
                              <span className="text-white/15 text-xs italic">Not created</span>
                              <button onClick={() => { setEditingSession({ isNew: true }); setAttendanceSession(null); setSessionForm({ week, day, title: "", subtitle: WEEK_LABELS[week], topics: "", homework: "", sessionDate: "", joinLink: "", recordingUrl: "", isVisible: true, isLive: false }) }} className="ml-auto text-[#3A90FF]/50 hover:text-[#3A90FF] transition-colors">
                                <span className="material-symbols-outlined text-sm">add_circle</span>
                              </button>
                            </div>
                          )
                          const isEditing = editingSession?.id === s.id
                          const isAttendance = attendanceSession?.id === s.id
                          return (
                            <div key={day} className={`border transition-all ${isEditing ? "border-[#3A90FF]/60 bg-[#3A90FF]/5" : isAttendance ? "border-green-500/60 bg-green-500/5" : "border-[#252525] bg-[#1a1a1a] hover:border-[#333]"}`}>
                              <div className="flex items-center gap-3 px-4 py-3">
                                <span className="text-[9px] font-black text-white/30 w-12 shrink-0">D{s.day}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold truncate">{s.title}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {s.sessionDate && <span className="text-[9px] text-white/30">{new Date(s.sessionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
                                    {s.isLive && <span className="text-[8px] font-black text-red-400 bg-red-400/10 px-1.5 py-0.5 animate-pulse">LIVE</span>}
                                    {s.joinLink && <span className="material-symbols-outlined text-[11px] text-green-400" title="Join link set">link</span>}
                                    {s.recordingUrl && <span className="material-symbols-outlined text-[11px] text-[#3A90FF]" title="Recording available">videocam</span>}
                                    {!s.isVisible && <span className="text-[8px] text-white/20 border border-white/10 px-1.5 py-0.5">HIDDEN</span>}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button onClick={() => openAttendance(s)} title="Mark Attendance" className="p-1.5 text-white/20 hover:text-green-400 transition-colors">
                                    <span className="material-symbols-outlined text-base">how_to_reg</span>
                                  </button>
                                  <button onClick={() => openEdit(s)} title="Edit Session" className="p-1.5 text-white/20 hover:text-[#3A90FF] transition-colors">
                                    <span className="material-symbols-outlined text-base">edit</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: edit panel or attendance panel */}
                <div className="xl:sticky xl:top-[85px] h-fit">

                  {/* Edit/New session form */}
                  {editingSession && (
                    <div className="bg-[#1a1a1a] border border-[#3A90FF]/40">
                      <div className="flex items-center justify-between px-5 py-3 border-b border-[#252525]">
                        <span className="text-sm font-black uppercase tracking-widest text-[#3A90FF]">
                          {editingSession.isNew ? "NEW SESSION" : `EDIT — W${editingSession.week}D${editingSession.day}`}
                        </span>
                        <button onClick={() => setEditingSession(null)} className="text-white/30 hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      </div>
                      <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Week</label>
                            <select value={sessionForm.week || 1} onChange={e => setSessionForm({ ...sessionForm, week: e.target.value })} className={inputCls}>
                              {[1,2,3,4].map(w => <option key={w} value={w}>Week {w} — {WEEK_LABELS[w]}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Day</label>
                            <select value={sessionForm.day || 1} onChange={e => setSessionForm({ ...sessionForm, day: e.target.value })} className={inputCls}>
                              {[1,2,3,4,5].map(d => <option key={d} value={d}>Day {d}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Title *</label>
                          <input value={sessionForm.title || ""} onChange={e => setSessionForm({ ...sessionForm, title: e.target.value })} placeholder="e.g. Terminal + Git + GitHub" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Subtitle</label>
                          <input value={sessionForm.subtitle || ""} onChange={e => setSessionForm({ ...sessionForm, subtitle: e.target.value })} placeholder="e.g. Foundations" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Topics (one per line)</label>
                          <textarea value={sessionForm.topics || ""} onChange={e => setSessionForm({ ...sessionForm, topics: e.target.value })} rows={5} placeholder={"What the terminal is\nCore commands: cd, ls, mkdir\nGit workflow"} className={inputCls + " resize-none"} />
                        </div>
                        <div>
                          <label className={labelCls}>Homework</label>
                          <textarea value={sessionForm.homework || ""} onChange={e => setSessionForm({ ...sessionForm, homework: e.target.value })} rows={2} placeholder="Push day1-reflection.md to your repo..." className={inputCls + " resize-none"} />
                        </div>
                        <div>
                          <label className={labelCls}>Session Date & Time</label>
                          <input type="datetime-local" value={sessionForm.sessionDate || ""} onChange={e => setSessionForm({ ...sessionForm, sessionDate: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Google Meet / Join Link</label>
                          <input type="url" value={sessionForm.joinLink || ""} onChange={e => setSessionForm({ ...sessionForm, joinLink: e.target.value })} placeholder="https://meet.google.com/xxx-xxxx-xxx" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Recording URL (post-session)</label>
                          <input type="url" value={sessionForm.recordingUrl || ""} onChange={e => setSessionForm({ ...sessionForm, recordingUrl: e.target.value })} placeholder="https://youtu.be/..." className={inputCls} />
                        </div>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={sessionForm.isVisible !== false} onChange={e => setSessionForm({ ...sessionForm, isVisible: e.target.checked })} className="accent-[#3A90FF]" />
                            <span className="text-xs text-white/60">Visible to students</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={sessionForm.isLive === true} onChange={e => setSessionForm({ ...sessionForm, isLive: e.target.checked })} className="accent-red-500" />
                            <span className="text-xs text-red-400">Mark as LIVE</span>
                          </label>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button onClick={handleSaveSession} disabled={sessionSaving || !sessionForm.title} className="flex-1 bg-[#3A90FF] text-white py-2.5 font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-40">
                            {sessionSaving ? "SAVING..." : "SAVE SESSION"}
                          </button>
                          {!editingSession.isNew && (
                            <button onClick={() => handleDeleteSession(editingSession.id)} className="bg-[#93000a] text-[#ffdad6] px-4 py-2.5 font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all">
                              DELETE
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Attendance panel */}
                  {attendanceSession && (
                    <div className="bg-[#1a1a1a] border border-green-500/40">
                      <div className="flex items-center justify-between px-5 py-3 border-b border-[#252525]">
                        <div>
                          <span className="text-sm font-black uppercase tracking-widest text-green-400">ATTENDANCE</span>
                          <p className="text-[10px] text-white/30 mt-0.5">W{attendanceSession.week}D{attendanceSession.day} — {attendanceSession.title}</p>
                        </div>
                        <button onClick={() => setAttendanceSession(null)} className="text-white/30 hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      </div>
                      {attendanceLoading ? (
                        <div className="flex items-center gap-3 p-6 text-white/20">
                          <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                          Loading students...
                        </div>
                      ) : attendanceStudents.length === 0 ? (
                        <div className="p-6 text-center text-white/20 text-xs">No enrolled students yet.</div>
                      ) : (
                        <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] text-white/30">{checkedIds.size} of {attendanceStudents.length} marked present</span>
                            <div className="flex gap-2">
                              <button onClick={() => setCheckedIds(new Set(attendanceStudents.map((s: any) => s.id)))} className="text-[9px] font-bold text-green-400 hover:underline">All</button>
                              <button onClick={() => setCheckedIds(new Set())} className="text-[9px] font-bold text-white/30 hover:underline">None</button>
                            </div>
                          </div>
                          {attendanceStudents.map((s: any) => (
                            <label key={s.id} className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border ${checkedIds.has(s.id) ? "bg-green-500/10 border-green-500/30" : "bg-[#111] border-[#2a2a2a] hover:border-[#333]"}`}>
                              <input type="checkbox" checked={checkedIds.has(s.id)} onChange={() => toggleAttendance(s.id)} className="accent-green-500" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold">{s.name}</p>
                                <p className="text-[10px] text-white/30 truncate">{s.email}</p>
                              </div>
                              {s.profile?.experienceLevel && (
                                <span className={`text-[8px] font-black px-2 py-0.5 border uppercase ${s.profile.experienceLevel === 'advanced' ? 'border-[#3A90FF]/30 text-[#3A90FF] bg-[#3A90FF]/5' : 'border-white/10 text-white/30'}`}>
                                  {s.profile.experienceLevel}
                                </span>
                              )}
                            </label>
                          ))}
                          <button onClick={saveAttendance} disabled={attendanceSaving} className="w-full bg-green-600 text-white py-3 font-black text-sm uppercase tracking-widest hover:bg-green-500 transition-colors disabled:opacity-50 mt-4">
                            {attendanceSaving ? "SAVING..." : "SAVE ATTENDANCE"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {!editingSession && !attendanceSession && (
                    <div className="bg-[#1a1a1a] border border-[#252525] p-8 text-center">
                      <span className="material-symbols-outlined text-3xl text-white/10 block mb-3">touch_app</span>
                      <p className="text-white/20 text-xs">Select a session to edit or mark attendance</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════ STUDENTS TAB ═══ */}
          {activeTab === "students" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-black text-2xl uppercase tracking-tight">Enrolled Students</h1>
                  <p className="text-white/30 text-xs mt-1">{students.length} students · {allSessions.length} sessions total</p>
                </div>
                <button onClick={fetchStudents} disabled={studentsLoading} className="flex items-center gap-2 bg-[#1f1f1f] border border-[#2a2a2a] text-white/50 px-4 py-2 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
                  <span className={`material-symbols-outlined text-sm ${studentsLoading ? "animate-spin" : ""}`}>refresh</span>
                  Refresh
                </button>
              </div>

              {studentsLoading ? (
                <div className="flex items-center gap-3 py-12 text-white/20">
                  <div className="w-5 h-5 border-2 border-[#3A90FF] border-t-transparent rounded-full animate-spin" />
                  Loading students...
                </div>
              ) : students.length === 0 ? (
                <div className="bg-[#1a1a1a] border border-[#252525] p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-white/10 block mb-3">group</span>
                  <p className="text-white/30 text-sm">No enrolled students yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Header row */}
                  <div className="hidden lg:grid grid-cols-[1fr_120px_100px_120px_100px] gap-4 px-5 py-2 text-[9px] font-black text-white/20 uppercase tracking-[0.15em]">
                    <span>Student</span>
                    <span>Experience</span>
                    <span>Attended</span>
                    <span>Certificate</span>
                    <span>Actions</span>
                  </div>

                  {students.map(s => {
                    const isExp = expandedStudent === s.id
                    const goals: string[] = Array.isArray(s.profile?.goals) ? s.profile.goals : []
                    return (
                      <div key={s.id} className="bg-[#1a1a1a] border border-[#252525] hover:border-[#333] transition-colors">
                        <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_120px_100px_120px_100px] gap-4 items-center px-5 py-4">
                          <div className="min-w-0">
                            <p className="font-bold text-sm">{s.name}</p>
                            <p className="text-white/30 text-[10px] truncate">{s.email}</p>
                          </div>
                          <div className="hidden lg:block">
                            {s.profile?.experienceLevel ? (
                              <span className={`text-[9px] font-black px-2 py-1 border uppercase ${s.profile.experienceLevel === 'advanced' ? 'border-[#3A90FF]/40 text-[#3A90FF] bg-[#3A90FF]/5' : 'border-white/10 text-white/40'}`}>
                                {s.profile.experienceLevel}
                              </span>
                            ) : <span className="text-white/20 text-[10px]">—</span>}
                          </div>
                          <div className="hidden lg:block">
                            <p className="font-mono text-sm font-bold">{s.attendedCount}<span className="text-white/20 text-xs">/{s.totalSessions}</span></p>
                            <p className="text-[9px] text-white/30">{s.attendancePct}%</p>
                          </div>
                          <div className="hidden lg:block">
                            <span className={`text-[9px] font-black uppercase ${certColor(s.certEligibility)}`}>
                              {s.certEligibility === 'COMPLETION' ? 'Completion' : s.certEligibility === 'PARTICIPATION' ? 'Participation' : 'Not eligible'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setExpandedStudent(isExp ? null : s.id)} className="text-white/30 hover:text-white transition-colors p-1">
                              <span className="material-symbols-outlined text-base">{isExp ? "expand_less" : "expand_more"}</span>
                            </button>
                          </div>
                        </div>

                        {isExp && (
                          <div className="border-t border-[#252525] px-5 py-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              <div>
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Experience</p>
                                <p className="text-white/70">{s.profile?.experienceLevel || "Not set"}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Attendance</p>
                                <p className="text-white/70">{s.attendedCount}/{s.totalSessions} sessions ({s.attendancePct}%)</p>
                                <div className="h-1 bg-[#2a2a2a] mt-2 w-48">
                                  <div className={`h-full transition-all ${s.attendancePct >= 80 ? 'bg-green-500' : s.attendancePct >= 50 ? 'bg-yellow-500' : 'bg-red-500/60'}`} style={{ width: `${s.attendancePct}%` }} />
                                </div>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Social</p>
                                <div className="flex gap-2">
                                  {s.githubUrl && <a href={s.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#3A90FF] hover:underline">GitHub ↗</a>}
                                  {s.linkedinUrl && <a href={s.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#3A90FF] hover:underline">LinkedIn ↗</a>}
                                  {!s.githubUrl && !s.linkedinUrl && <span className="text-white/20 text-[10px]">No social links</span>}
                                </div>
                              </div>
                            </div>

                            {s.profile?.motivation && (
                              <div>
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Why they joined</p>
                                <p className="text-white/50 text-xs italic">"{s.profile.motivation}"</p>
                              </div>
                            )}

                            {goals.length > 0 && (
                              <div>
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Goals</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {goals.map((g: string) => (
                                    <span key={g} className="text-[9px] font-bold border border-[#3A90FF]/30 text-[#3A90FF]/70 px-2 py-0.5 uppercase tracking-wider">{g.replace(/_/g, ' ')}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Attendance grid */}
                            <div>
                              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Session Attendance</p>
                              <div className="flex flex-wrap gap-1">
                                {allSessions.map((sess: any) => {
                                  const attended = s.attendedSessionIds?.includes(sess.id)
                                  return (
                                    <div key={sess.id} title={`W${sess.week}D${sess.day}: ${sess.title}`} className={`w-7 h-7 flex items-center justify-center text-[8px] font-black border transition-colors ${attended ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-[#111] border-[#2a2a2a] text-white/20'}`}>
                                      {sess.week}{sess.day}
                                    </div>
                                  )
                                })}
                              </div>
                              <p className="text-[9px] text-white/15 mt-1.5">Green = attended · Each cell = W#D#</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
