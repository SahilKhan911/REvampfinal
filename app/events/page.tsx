import Navbar from "../components/Navbar"

const PAST_EVENT_EMBEDS = [
  "https://luma.com/embed/event/evt-B5HyhZbkQRFilMl/simple",
  "https://luma.com/embed/event/evt-YuF3kKCZTBzEX2L/simple",
  "https://luma.com/embed/event/evt-pJuM0RrHvK3x13C/simple",
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

      {/* ═══ PAST EVENTS ═══ */}
      <section className="py-20 px-8 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <span className="w-2 h-2 bg-white/20" />
            <h2 className="font-headline font-bold text-2xl tracking-tight">Past Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAST_EVENT_EMBEDS.map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-white/10">
                <iframe
                  src={src}
                  width="100%"
                  height="450"
                  frameBorder="0"
                  style={{ display: "block" }}
                  allow="fullscreen; payment"
                  aria-hidden="false"
                  tabIndex={0}
                />
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
