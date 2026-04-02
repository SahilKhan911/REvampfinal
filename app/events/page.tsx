import Link from "next/link"
import Navbar from "../components/Navbar"

const UPCOMING_EVENTS = [
  {
    slug: "opensource",
    title: "REvamp : Open Source 101",
    subtitle: "Read. Fork. Commit.",
    date: "TUE, 24 JUNE",
    time: "7:00 PM – 8:30 PM IST",
    platform: "Zoom",
    registered: "428+",
    status: "open" as const,
    tags: ["GSoC", "Hacktoberfest", "PR Workflow"],
    accent: "#0085FF",
    icon: "terminal",
  },
  {
    slug: "launchpad",
    title: "College Starter Pack",
    subtitle: "Everything your seniors should've told you.",
    date: "FRI, 27 JUNE",
    time: "6:00 PM – 7:30 PM IST",
    platform: "Zoom",
    registered: "345+",
    status: "open" as const,
    tags: ["First Year", "Career Clarity", "Projects"],
    accent: "#FFD700",
    icon: "rocket_launch",
  },
  {
    slug: "webdev",
    title: "Full-Stack in 7 Days",
    subtitle: "Deploy on day one. Ship by day seven.",
    date: "SAT, 28 JUNE",
    time: "6:00 PM – 8:00 PM IST",
    platform: "Zoom",
    registered: "312+",
    status: "open" as const,
    tags: ["Next.js", "Supabase", "Vercel"],
    accent: "#8FDAFF",
    icon: "code",
  },
  {
    slug: "cp",
    title: "CP Bootcamp: Zero to Specialist",
    subtitle: "Daily contests. No breaks. No excuses.",
    date: "MON, 30 JUNE",
    time: "9:00 PM – 10:30 PM IST",
    platform: "Zoom",
    registered: "189+",
    status: "open" as const,
    tags: ["Codeforces", "DP", "Graphs"],
    accent: "#BAFF1A",
    icon: "trophy",
  },
  {
    slug: "cybersec",
    title: "Cyber Security 101",
    subtitle: "Break things. Legally.",
    date: "WED, 2 JULY",
    time: "8:00 PM – 9:30 PM IST",
    platform: "Zoom",
    registered: "178+",
    status: "open" as const,
    tags: ["CTF", "Web Exploits", "Bug Bounty"],
    accent: "#FF1AFF",
    icon: "shield",
  },
  {
    slug: "aiml",
    title: "AI/ML: Agents, Not Notebooks",
    subtitle: "Build. Fine-tune. Deploy.",
    date: "THU, 3 JULY",
    time: "7:00 PM – 8:30 PM IST",
    platform: "Zoom",
    registered: "256+",
    status: "open" as const,
    tags: ["LLMs", "RAG", "Fine-tuning"],
    accent: "#FF6B6B",
    icon: "smart_toy",
  },
]

const PAST_EVENTS = [
  {
    title: "Discord Study Jam #1",
    date: "15 MAR 2025",
    attended: "619",
    highlight: "Record-breaking single-room call",
  },
  {
    title: "REvamp Launch Event",
    date: "8 FEB 2025",
    attended: "234",
    highlight: "The one that started it all",
  },
  {
    title: "Hackathon Prep Night",
    date: "22 JAN 2025",
    attended: "156",
    highlight: "Formed 12 teams for ETH India",
  },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-body">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="pt-32 pb-20 px-8 border-b border-white/10">
        <div className="max-w-[1100px] mx-auto">
          <p className="font-label text-xs tracking-[0.3em] text-[#0085FF] uppercase mb-6">What&apos;s Happening</p>
          <h1 className="font-headline font-bold text-5xl md:text-7xl tracking-tight leading-[0.95] mb-8">
            Events &<br />
            <span className="text-[#0085FF]">Sessions.</span>
          </h1>
          <p className="text-white/40 text-xl max-w-2xl leading-relaxed">
            Live workshops, bootcamps, and sessions — all on Zoom. Free to preview, affordable to commit. Every event is a door into a new domain.
          </p>
        </div>
      </section>

      {/* ═══ LUMA CALENDAR ═══ */}
      <section className="py-20 px-8 border-b border-white/10">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 bg-[#0085FF] animate-pulse" />
                <h2 className="font-headline font-bold text-2xl tracking-tight">Community Calendar</h2>
              </div>
              <p className="text-white/40">Sync with our schedule and RSVP for all community drops directly on Luma.</p>
            </div>
          </div>

          <div className="w-full bg-black border border-white/10 p-2 rounded-xl">
            <iframe
              src="https://luma.com/embed/calendar/cal-BKEujmH3HGliopK/events"
              width="100%"
              height="600"
              frameBorder="0"
              style={{ border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", background: "transparent" }}
              allowFullScreen={true}
              aria-hidden="false"
              tabIndex={0}
              className="w-full bg-[#0a0a0a]"
            ></iframe>
          </div>
        </div>
      </section>

      {/* ═══ UPCOMING ═══ */}
      <section className="py-20 px-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <span className="w-2 h-2 bg-green-500 animate-pulse" />
            <h2 className="font-headline font-bold text-2xl tracking-tight">Upcoming Events</h2>
          </div>

          <div className="space-y-4">
            {UPCOMING_EVENTS.map((event, i) => (
              <Link
                key={i}
                href={`/cohort/${event.slug}`}
                className="block group border border-white/10 hover:border-white/20 bg-[#0a0a0a] hover:bg-[#111] transition-all"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                  {/* Date block */}
                  <div className="md:w-[120px] flex-shrink-0">
                    <div className="inline-flex flex-col items-center p-3 border border-white/10 bg-black text-center min-w-[80px]">
                      <span className="font-label text-[10px] tracking-wider text-[#0085FF] uppercase">{event.date.split(",")[0]}</span>
                      <span className="font-headline font-bold text-2xl leading-tight">{event.date.split(" ").pop()}</span>
                      <span className="font-label text-[10px] tracking-wider text-white/30 uppercase">{event.date.split(" ").slice(1, -1).join(" ")}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-xl" style={{ color: event.accent, fontVariationSettings: "'FILL' 1" }}>{event.icon}</span>
                      <h3 className="font-headline font-bold text-xl group-hover:text-[#0085FF] transition-colors">{event.title}</h3>
                    </div>
                    <p className="text-white/40 text-sm mb-4">{event.subtitle}</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, j) => (
                        <span key={j} className="text-[10px] font-label tracking-wider text-white/25 border border-white/10 px-2 py-0.5">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right meta */}
                  <div className="md:w-[180px] flex-shrink-0 flex flex-col items-start md:items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-white/30">videocam</span>
                      <span className="text-sm text-white/50">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-white/30">group</span>
                      <span className="text-sm text-white/50">{event.registered} registered</span>
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold">
                      <span className="w-1.5 h-1.5 bg-green-500" />
                      <span className="text-green-400 uppercase tracking-wider">Registration Open</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PAST EVENTS ═══ */}
      <section className="py-20 px-8 bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-headline font-bold text-2xl tracking-tight mb-12">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PAST_EVENTS.map((event, i) => (
              <div key={i} className="p-6 border border-white/5 bg-black">
                <p className="font-label text-[10px] tracking-wider text-white/30 uppercase mb-3">{event.date}</p>
                <h3 className="font-headline font-bold text-lg mb-2">{event.title}</h3>
                <p className="text-white/40 text-sm mb-4">{event.highlight}</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#0085FF]">group</span>
                  <span className="font-headline font-bold text-sm text-[#0085FF]">{event.attended}</span>
                  <span className="text-xs text-white/30">attended</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 px-8 bg-[#0085FF]">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-headline font-bold text-4xl md:text-6xl tracking-tight text-white leading-[0.95] mb-6">
            Never miss a session.
          </h2>
          <p className="text-white/80 text-lg mb-10">Join the community to get first access to every event we run.</p>
          <a href="/community" className="inline-block bg-black text-white px-10 py-4 font-headline font-bold text-sm hover:bg-[#111] transition-colors">
            Join Community →
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/10 bg-black">
        <div className="max-w-[1100px] mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20 tracking-wider uppercase">© 2026 REVAMP. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-xs text-white/30 hover:text-white transition-colors" href="#">Terms</a>
            <a className="text-xs text-white/30 hover:text-white transition-colors" href="#">Privacy</a>
            <a className="text-xs text-white/30 hover:text-white transition-colors" href="mailto:letsrevamp.here@gmail.com">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
