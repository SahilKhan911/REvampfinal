import { cookies } from "next/headers"
import { COHORTS } from "@/lib/cohorts"

const LIVE_FEED = [
  { label: "Live Now", msg: "Aryan just joined CP 101 🎉", sub: "IIT Bombay Cluster" },
  { label: "Success", msg: "Mehak opened her first PR 🔓", sub: "Open Source Domain" },
  { label: "Collaboration", msg: "3 new teams formed for Hackathon 🚀", sub: "Web-3 Sprint" },
  { label: "Live Now", msg: "Rohit deployed to AWS ☁️", sub: "DevOps Mastery" },
  { label: "Milestone", msg: "2,000 members milestone hit 🏆", sub: "Community Stats" },
  { label: "Success", msg: "Priya cracked her first CTF flag 🛡️", sub: "Cyber Security" },
  { label: "Live Now", msg: "AI Agents workshop starting in 10m 🤖", sub: "AI/ML Domain" },
  { label: "Collaboration", msg: "5 students matched for hackathon team 💻", sub: "College Starter" },
]

const EVENTS = [
  { emoji: "🔓", name: "OpenSource 101", guests: "619 Guests", link: "https://lu.ma/q9kmb7cn" },
  { emoji: "⚔️", name: "CP 101", guests: "490 Guests", link: "https://lu.ma/i6nk5ke6" },
  { emoji: "🔓", name: "OpenSource 101", guests: "428 Guests", link: "https://lu.ma/fiw45uel" },
  { emoji: "🎓", name: "NST Insider", guests: "Invite Only", link: "https://lu.ma/c4sj5n9u" },
]

const TESTIMONIALS = [
  { q: "Joining REvamp was the first time I felt like I was actually part of the global tech industry while still in college.", name: "Siddharth Kumar", role: "SDE @ Google", initials: "SK" },
  { q: "The intensity is unmatched. 600+ people coding in one Discord room at 3 AM is a different kind of energy.", name: "Ananya Pandey", role: "GSoC '24 Contributor", initials: "AP" },
  { q: "Forget certificates. REvamp gave me actual proof of work and the right network to land a high-paying internship.", name: "Rohan Joshi", role: "Founding Engineer", initials: "RJ" },
]

const BENTO_TILES = [
  { slug: "opensource", name: "Open Source", emoji: "🔓", large: true, num: "01",
    bullets: ["GSoC Prep & Guidance", "Major League Hacking Partner", "1k+ Collective Contributions"],
    icon: "terminal", hover: "hover:shadow-[inset_0_0_40px_rgba(245,158,11,0.05)]" },
  { slug: "webdev", name: "Web Dev", emoji: "🌐",
    bullets: ["Fullstack Next.js Mastery", "Web3 Integration"],
    hover: "hover:shadow-[inset_0_0_40px_rgba(143,213,255,0.05)]" },
  { slug: "aiml", name: "AI/ML", emoji: "🤖",
    bullets: ["LLM Orchestration", "Computer Vision Labs"],
    hover: "hover:shadow-[inset_0_0_40px_rgba(255,180,171,0.05)]" },
  { slug: "launchpad", name: "College Starter", emoji: "🚀", wide: true,
    desc: "First year in B.Tech? We show you the real game before the system breaks you.",
    hover: "hover:bg-[#353437]" },
  { slug: "cp", name: "CP", emoji: "⚔️",
    desc: "Competitive Programming. Logic building. Codeforces rituals.",
    hover: "hover:shadow-[inset_0_0_40px_rgba(186,255,26,0.05)]" },
  { slug: "cybersec", name: "Cyber Sec", emoji: "🛡️",
    desc: "Ethical hacking. CTF championships. Zero-day research.",
    hover: "hover:shadow-[inset_0_0_40px_rgba(255,26,255,0.05)]" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4] font-body selection:bg-amber-500 selection:text-amber-950">

      {/* ═══ TOP NAV ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-[#131315]/40 backdrop-blur-xl flex justify-between items-center px-12 py-6 max-w-[1440px] left-1/2 -translate-x-1/2">
        <div className="font-headline font-bold text-2xl tracking-tighter">REvamp</div>
        <div className="hidden md:flex items-center gap-12">
          <a className="font-headline tracking-tight text-sm uppercase text-amber-500 font-bold border-b border-amber-500" href="#paths">Sections</a>
          <a className="font-headline tracking-tight text-sm uppercase text-[#e5e1e4]/70 hover:text-[#e5e1e4] transition-colors" href="#community">Community</a>
          <a className="font-headline tracking-tight text-sm uppercase text-[#e5e1e4]/70 hover:text-[#e5e1e4] transition-colors" href="#events">Events</a>
        </div>
        <a href="#paths" className="bg-amber-500 text-[#613b00] px-6 py-2 font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all">
          Join Pro
        </a>
      </nav>

      {/* ═══ SECTION 1: SPLIT-SCREEN HERO ═══ */}
      <section className="min-h-screen flex flex-col md:flex-row overflow-hidden pt-24">
        {/* Left — headline */}
        <div className="w-full md:w-[60%] px-12 py-24 flex flex-col justify-center bg-[#0e0e10] relative">
          <div className="accent-notch mb-6" />
          <h1 className="font-headline font-black text-5xl md:text-8xl tracking-tighter leading-[0.9] max-w-2xl">
            You don&apos;t need a{" "}
            <span className="italic text-amber-500">roadmap</span>. You need the right{" "}
            <span className="text-[#ffc174] underline decoration-2 underline-offset-8">room.</span>
          </h1>
          <p className="mt-12 text-xl text-[#e5e1e4]/60 max-w-lg leading-relaxed">
            The elite collective for Indian B.Tech students. Crafting the next generation of engineers through high-status collaboration.
          </p>
          <div className="mt-16 flex flex-col sm:flex-row gap-6">
            <a href="#paths" className="bg-amber-500 text-[#613b00] px-10 py-5 font-bold uppercase tracking-widest hover:scale-105 transition-transform text-center">
              Enter the Vault
            </a>
            <a href="#story" className="border border-[#534434]/30 text-[#e5e1e4] px-10 py-5 font-bold uppercase tracking-widest hover:bg-[#2a2a2c] transition-colors text-center">
              Manifesto
            </a>
          </div>
        </div>

        {/* Right — live feed */}
        <div className="w-full md:w-[40%] bg-[#1c1b1d] border-l border-[#534434]/10 relative overflow-hidden h-[512px] md:h-auto">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#1c1b1d] via-transparent to-[#1c1b1d] pointer-events-none" />
          <div className="p-12 space-y-8 animate-scroll-up">
            {/* Render feed twice for seamless loop */}
            {[...LIVE_FEED, ...LIVE_FEED].map((item, i) => (
              <div key={i} className="p-6 bg-[#353437]/30 border border-[#534434]/10">
                <p className="text-xs font-label tracking-widest text-amber-500 mb-2 uppercase">{item.label}</p>
                <p className="font-headline font-bold text-lg">{item.msg}</p>
                <p className="text-xs text-[#e5e1e4]/40 mt-1 uppercase">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: STICKY COUNTER BAR ═══ */}
      <div className="sticky top-[80px] w-full z-40 py-4 bg-[#0e0e10] overflow-hidden whitespace-nowrap border-y border-[#534434]/5">
        <div className="flex items-center justify-center gap-8 md:gap-16 font-headline font-black italic text-xl md:text-4xl tracking-tighter text-amber-500 amber-glow uppercase px-4">
          <span>2,000+ Students</span>
          <span className="text-[#e5e1e4]/20">|</span>
          <span>619 In One Room</span>
          <span className="text-[#e5e1e4]/20 hidden md:inline">|</span>
          <span className="hidden md:inline">6 Domains</span>
          <span className="text-[#e5e1e4]/20 hidden md:inline">|</span>
          <span className="hidden md:inline">4+ Events</span>
        </div>
      </div>

      {/* ═══ SECTION 3: EDITORIAL STORY ═══ */}
      <section id="story" className="px-6 md:px-12 py-32 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row gap-24 items-start">
          {/* Left — pull quote (sticky) */}
          <div className="w-full md:w-[40%] md:sticky md:top-48">
            <div className="accent-notch mb-6" />
            <h2 className="font-headline font-black italic text-4xl md:text-7xl leading-tight">
              &ldquo;Most college students learn alone.&rdquo;
            </h2>
            <p className="mt-8 font-label text-xs tracking-[0.2em] text-[#e5e1e4]/40 uppercase">
              The Solo-Learning Trap / Episode 01
            </p>
          </div>

          {/* Right — narrative + image */}
          <div className="w-full md:w-[60%] space-y-16">
            <div className="relative group overflow-hidden">
              <img
                alt="REvamp community session"
                className="w-full h-[400px] md:h-[600px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                src="/images/social-proof.png"
              />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 bg-[#0e0e10]/80 backdrop-blur-md border-t border-r border-[#534434]/10">
                <span className="font-label text-xs uppercase tracking-widest text-amber-500">Documentation: REvamp Meetup</span>
              </div>
            </div>
            <div className="max-w-xl space-y-8">
              <p className="text-xl md:text-2xl leading-relaxed text-[#e5e1e4]/80">
                B.Tech is often a lonely grind through outdated syllabi. We&apos;ve built the antidote: A high-density room where the floor is always moving upwards.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-[#e5e1e4]/60">
                At REvamp, we prioritize peer-acceleration. From open-source contributions that actually matter to AI agents that you build in a weekend, we provide the infrastructure. No fluff. No generic roadmaps. Just execution.
              </p>
              <a className="inline-block font-headline font-bold text-amber-500 text-xl border-b-2 border-amber-500 pb-1 hover:text-[#ffc174] transition-colors" href="#paths">
                Read the Full Manifesto →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: HORIZONTAL SCROLL EVENTS ═══ */}
      <section id="events" className="py-32 bg-[#0e0e10] overflow-hidden">
        <div className="px-6 md:px-12 mb-16 flex justify-between items-end">
          <div>
            <div className="accent-notch mb-4" />
            <h3 className="font-headline font-black text-4xl md:text-5xl tracking-tighter uppercase">Past Events</h3>
          </div>
          <p className="font-label text-xs text-[#e5e1e4]/40 uppercase tracking-widest hidden md:block">Scroll to explore →</p>
        </div>
        <div className="flex overflow-x-auto gap-8 px-6 md:px-12 pb-12 snap-x hide-scrollbar">
          {EVENTS.map((e, i) => (
            <a
              key={i}
              href={e.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-none w-[280px] md:w-[320px] h-[500px] bg-[#1c1b1d] p-8 flex flex-col justify-between border border-[#534434]/10 snap-center hover:bg-[#2a2a2c] transition-colors group"
            >
              <div className="text-6xl group-hover:scale-110 transition-transform duration-500">{e.emoji}</div>
              <div>
                <h4 className="font-headline font-bold text-2xl md:text-3xl leading-none mb-4">{e.name}</h4>
                <p className="text-[#e5e1e4]/60 text-sm mb-6 uppercase tracking-tight">{e.guests} • Luma Event</p>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500 hover:text-[#ffc174] transition-colors">View on Luma</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 5: BENTO GRID ═══ */}
      <section id="paths" className="px-6 md:px-12 py-32 max-w-[1440px] mx-auto">
        <div className="mb-16">
          <h3 className="font-headline font-black text-4xl md:text-6xl tracking-tighter uppercase mb-4">What do you want to master?</h3>
          <p className="text-[#e5e1e4]/40 max-w-lg uppercase tracking-widest text-xs">Pick your domain. Own your future.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 md:h-[900px]">
          {BENTO_TILES.map((tile) => (
            <a
              key={tile.slug}
              href={`/?cohort=${tile.slug}#explore`}
              className={`
                bg-[#1c1b1d] p-8 md:p-12 border border-[#534434]/10 transition-all group relative overflow-hidden block
                ${tile.large ? "md:col-span-2 md:row-span-2" : ""}
                ${tile.wide ? "md:col-span-2" : ""}
                ${tile.hover}
              `}
            >
              {tile.large && (
                <>
                  <div className="relative z-10">
                    <span className="text-amber-500 font-black text-4xl md:text-6xl mb-6 md:mb-8 block">{tile.num}</span>
                    <h4 className="font-headline font-bold text-3xl md:text-5xl mb-6 md:mb-8 uppercase tracking-tighter">{tile.name}</h4>
                    <ul className="space-y-4 text-lg md:text-xl text-[#e5e1e4]/60">
                      {tile.bullets?.map((b, j) => (
                        <li key={j} className="flex items-center gap-3">
                          <div className="w-1 h-1 bg-amber-500 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-[200px] md:text-[240px]">terminal</span>
                  </div>
                </>
              )}
              {!tile.large && (
                <>
                  <h4 className="font-headline font-bold text-xl md:text-2xl mb-4 uppercase tracking-tighter">{tile.name}</h4>
                  {tile.bullets ? (
                    <ul className="space-y-2 text-sm text-[#e5e1e4]/60">
                      {tile.bullets.map((b, j) => <li key={j}>• {b}</li>)}
                    </ul>
                  ) : (
                    <p className="text-[#e5e1e4]/60 text-sm">{tile.desc}</p>
                  )}
                </>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 6: TESTIMONIAL MARQUEE ═══ */}
      <section className="py-24 bg-[#0e0e10] overflow-hidden border-y border-[#534434]/5">
        <div className="flex animate-marquee gap-8 items-center">
          {/* Render twice for seamless loop */}
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div key={i} className="flex-none w-[350px] md:w-[400px] bg-[#131315] p-8 border border-[#534434]/10">
              <p className="text-base md:text-lg italic text-[#e5e1e4]/80 leading-relaxed">&ldquo;{t.q}&rdquo;</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#353437] flex items-center justify-center font-bold text-xs">{t.initials}</div>
                <div>
                  <p className="font-bold text-sm uppercase">{t.name}</p>
                  <p className="text-xs text-[#e5e1e4]/40 uppercase">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 7: COMMUNITY ═══ */}
      <section id="community" className="py-32 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="mb-16">
          <div className="accent-notch mb-4" />
          <h3 className="font-headline font-black text-4xl md:text-5xl tracking-tighter uppercase mb-4">Join the community first.</h3>
          <p className="text-[#e5e1e4]/40 text-lg">No payment. No commitment. Just the right energy.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <a href="https://discord.gg/revamp" target="_blank" rel="noopener noreferrer"
            className="glass-panel p-10 border border-white/5 hover:border-indigo-500/30 transition-all group block">
            <div className="w-14 h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-8">
              <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </div>
            <h4 className="text-2xl font-bold font-headline mb-4">Discord</h4>
            <p className="text-[#d8c3ad] mb-8 font-light">Late night voice chats, resource sharing, and peer-to-peer coding help.</p>
            <span className="w-full py-4 bg-indigo-600 font-bold hover:bg-indigo-500 transition-colors block text-center">Join Discord</span>
          </a>
          <a href="https://chat.whatsapp.com/revamp" target="_blank" rel="noopener noreferrer"
            className="glass-panel p-10 border border-white/5 hover:border-green-500/30 transition-all group block">
            <div className="w-14 h-14 bg-green-600/20 rounded-xl flex items-center justify-center mb-8">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <h4 className="text-2xl font-bold font-headline mb-4">WhatsApp</h4>
            <p className="text-[#d8c3ad] mb-8 font-light">Instant updates for local meetups, session alerts, and community polls.</p>
            <span className="w-full py-4 bg-green-600 font-bold hover:bg-green-500 transition-colors block text-center">Join WhatsApp</span>
          </a>
          <a href="https://instagram.com/letsrevamp.here" target="_blank" rel="noopener noreferrer"
            className="glass-panel p-10 border border-white/5 hover:border-pink-500/30 transition-all group block">
            <div className="w-14 h-14 bg-pink-600/20 rounded-xl flex items-center justify-center mb-8">
              <svg className="w-8 h-8 text-pink-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </div>
            <h4 className="text-2xl font-bold font-headline mb-4">Instagram</h4>
            <p className="text-[#d8c3ad] mb-8 font-light">Visual recaps, student highlights, and behind-the-scenes of REvamp.</p>
            <span className="w-full py-4 bg-gradient-to-tr from-orange-500 to-pink-600 font-bold hover:opacity-90 transition-opacity block text-center">Follow Us</span>
          </a>
        </div>
      </section>

      {/* ═══ SECTION 8: FINAL CTA ═══ */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-amber-500 via-[#613b00] to-[#0e0e10] relative px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="text-center z-10 max-w-4xl">
          <h2 className="font-headline font-black text-5xl md:text-9xl tracking-tighter uppercase text-[#613b00] leading-none mb-12">
            The second best time is <span className="text-[#e5e1e4] underline">now.</span>
          </h2>
          <a href="#paths" className="inline-block bg-[#613b00] text-amber-500 px-12 md:px-24 py-6 md:py-10 font-black text-xl md:text-2xl uppercase tracking-[0.2em] hover:scale-110 transition-transform duration-500 shadow-2xl">
            Claim Your Seat
          </a>
          <p className="mt-12 font-label text-xs uppercase tracking-[0.5em] text-[#613b00]/60">Limited slots for the next batch</p>
        </div>
      </section>

      {/* ═══ FLOATING COMMUNITY DOCK ═══ */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 glass-panel rounded-full px-6 py-3 shadow-[0_0_32px_rgba(245,158,11,0.15)] border border-[#534434]/15">
        <a className="text-[#e5e1e4] p-3 hover:scale-125 transition-all duration-500" href="https://discord.gg/revamp" target="_blank" rel="noopener noreferrer" title="Discord">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
        </a>
        <a className="bg-amber-500 text-[#613b00] rounded-full p-3 scale-110 hover:scale-125 transition-all" href="https://chat.whatsapp.com/revamp" target="_blank" rel="noopener noreferrer" title="WhatsApp">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </a>
        <a className="text-[#e5e1e4] p-3 hover:scale-125 transition-all duration-500" href="https://instagram.com/letsrevamp.here" target="_blank" rel="noopener noreferrer" title="Instagram">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="w-full border-t border-[#353437]/20 bg-[#131315]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6 md:px-12 py-24 max-w-[1440px] mx-auto">
          <div>
            <div className="font-headline font-bold text-3xl md:text-4xl tracking-tighter mb-8">REVAMP.</div>
            <p className="text-xs tracking-[0.1em] uppercase text-[#e5e1e4]/50 leading-loose max-w-sm">
              A tech collective precision-engineered for the ambitious Indian student. Not a course, not a club. A movement.
            </p>
            <p className="mt-16 text-xs tracking-[0.1em] uppercase text-[#e5e1e4]/50">
              © 2026 REVAMP. COLLECTIVE PRECISION.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="font-bold text-amber-500 text-xs tracking-widest uppercase mb-6">Connect</p>
              <a className="block text-xs tracking-[0.1em] uppercase text-[#e5e1e4]/50 hover:text-[#e5e1e4] transition-colors" href="https://discord.gg/revamp" target="_blank" rel="noopener noreferrer">Discord</a>
              <a className="block text-xs tracking-[0.1em] uppercase text-[#e5e1e4]/50 hover:text-[#e5e1e4] transition-colors" href="https://instagram.com/letsrevamp.here" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a className="block text-xs tracking-[0.1em] uppercase text-[#e5e1e4]/50 hover:text-[#e5e1e4] transition-colors" href="https://chat.whatsapp.com/revamp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a className="block text-xs tracking-[0.1em] uppercase text-[#e5e1e4]/50 hover:text-[#e5e1e4] transition-colors" href="https://www.linkedin.com/company/letsrevamp" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
            <div className="space-y-4">
              <p className="font-bold text-amber-500 text-xs tracking-widest uppercase mb-6">Legal</p>
              <a className="block text-xs tracking-[0.1em] uppercase text-[#e5e1e4]/50 hover:text-[#e5e1e4] transition-colors" href="#">Terms</a>
              <a className="block text-xs tracking-[0.1em] uppercase text-[#e5e1e4]/50 hover:text-[#e5e1e4] transition-colors" href="#">Privacy</a>
              <a className="block text-xs tracking-[0.1em] uppercase text-[#e5e1e4]/50 hover:text-[#e5e1e4] transition-colors" href="mailto:letsrevamp.here@gmail.com">Email</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
