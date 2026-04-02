import Navbar from "../components/Navbar"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-body">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="pt-32 pb-20 px-8 border-b border-white/10">
        <div className="max-w-[1100px] mx-auto">
          <p className="font-label text-xs tracking-[0.3em] text-[#0085FF] uppercase mb-6">Why We Exist</p>
          <h1 className="font-headline font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-8">
            College won&apos;t<br />
            prepare you.<br />
            <span className="text-[#0085FF]">We will.</span>
          </h1>
          <p className="text-white/40 text-xl max-w-2xl leading-relaxed">
            REvamp is India&apos;s most intense student-run tech collective. We exist because the gap between &ldquo;I know how to code&rdquo; and &ldquo;I can build things that matter&rdquo; is enormous — and nobody&apos;s bridging it.
          </p>
        </div>
      </section>

      {/* ═══ THE PROBLEM ═══ */}
      <section className="py-24 px-8 border-b border-white/10">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2">
            <div className="w-10 h-1 bg-[#FFD700] mb-6" />
            <h2 className="font-headline font-bold text-3xl tracking-tight">The Problem</h2>
          </div>
          <div className="lg:col-span-3 space-y-8">
            <p className="text-xl text-white/70 leading-relaxed">
              Every year, lakhs of B.Tech students graduate with a degree, zero real projects, and a resume full of &ldquo;proficient in C++.&rdquo; They spent 4 years attending lectures, watching tutorials, and collecting certificates — but never once shipped a product, contributed to open source, or sat in a room with people who push them to be better.
            </p>
            <p className="text-lg text-white/50 leading-relaxed">
              The students who break through aren&apos;t smarter. They&apos;re surrounded by better people. They found rooms where the standard is higher, the feedback is real, and nobody&apos;s waiting for a syllabus to tell them what to learn next.
            </p>
            <p className="text-lg text-white/50 leading-relaxed">
              That&apos;s what REvamp is. The room you&apos;ve been looking for.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ THE STORY ═══ */}
      <section className="py-24 px-8 border-b border-white/10">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2">
            <div className="w-10 h-1 bg-[#0085FF] mb-6" />
            <h2 className="font-headline font-bold text-3xl tracking-tight">How It Started</h2>
          </div>
          <div className="lg:col-span-3 space-y-8">
            <p className="text-xl text-white/70 leading-relaxed">
              REvamp started in a Discord server with 12 people. No funding, no advisors, no mastercclass to sell — just students who were tired of learning alone and decided to build together.
            </p>
            <p className="text-lg text-white/50 leading-relaxed">
              We ran free sessions. We paired people up for hackathons. We reviewed each other&apos;s code at 3 AM. And then something happened — people started getting internships. They started contributing to GSoC. They started building things that actually worked.
            </p>
            <p className="text-lg text-white/50 leading-relaxed">
              Word spread. 12 became 100, 100 became 619 in a single room, and now we&apos;re past 2,000 students across 6 domains. Not because we marketed harder. Because the results spoke.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ BY THE NUMBERS ═══ */}
      <section className="py-24 px-8 border-b border-white/10 bg-[#0a0a0a]">
        <div className="max-w-[1100px] mx-auto">
          <div className="w-10 h-1 bg-[#0085FF] mb-6" />
          <h2 className="font-headline font-bold text-3xl tracking-tight mb-16">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
            {[
              { num: "2,000+", label: "Students", detail: "Across 6 domains" },
              { num: "619", label: "In One Call", detail: "Discord world record attempt" },
              { num: "428", label: "First Event", detail: "Open Source 101 attendees" },
              { num: "50+", label: "Got Placed", detail: "Internships & FTEs" },
            ].map((s, i) => (
              <div key={i} className="bg-[#0a0a0a] p-8 text-center">
                <div className="font-headline font-bold text-4xl md:text-5xl text-[#0085FF] mb-2">{s.num}</div>
                <div className="font-headline font-bold text-sm text-white mb-1">{s.label}</div>
                <div className="font-label text-[10px] tracking-wider text-white/30 uppercase">{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT WE BELIEVE ═══ */}
      <section className="py-24 px-8 border-b border-white/10">
        <div className="max-w-[1100px] mx-auto">
          <div className="w-10 h-1 bg-[#FFD700] mb-6" />
          <h2 className="font-headline font-bold text-3xl tracking-tight mb-16">What We Believe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Shipping > Studying", desc: "Reading docs is not the same as deploying to prod. We measure progress in commits, not lecture notes." },
              { title: "The Room Is Everything", desc: "You will rise or fall to the level of the people around you. We curate the room so the floor keeps rising." },
              { title: "Zero Gatekeeping", desc: "No entrance exam. No minimum CGPA. If you show up and put in the work, the community has your back. Period." },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-[#0a0a0a] border border-white/5">
                <h3 className="font-headline font-bold text-xl mb-4">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TEAM ═══ */}
      <section className="py-24 px-8 border-b border-white/10">
        <div className="max-w-[1100px] mx-auto">
          <div className="w-10 h-1 bg-[#0085FF] mb-6" />
          <h2 className="font-headline font-bold text-3xl tracking-tight mb-16">The Founders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {[
              { 
                name: "Sahil Khan", 
                role: "Founder", 
                linkedin: "https://www.linkedin.com/in/sahil-khan-3b561b2a8/",
                image: "https://ik.imagekit.io/cotszrkgk/WhatsApp%20Image%202025-05-28%20at%202.17.58%20PM.jpeg?updatedAt=1750791517654"
              },
              { 
                name: "Chiranjeev Agarwal", 
                role: "Founder", 
                linkedin: "https://www.linkedin.com/in/chiranjeev-agarwal-4bb65631a/",
                image: "/images/chiranjeev.jpg" // Replaced with actual uploaded image
              },
            ].map((person, i) => (
              <a 
                key={i} 
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block bg-[#0a0a0a] border border-white/5 hover:border-[#0085FF]/40 transition-all duration-300 rounded-2xl overflow-hidden"
              >
                <div className="flex items-center gap-6 p-6">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-white/5 border border-white/10 group-hover:border-[#0085FF]/50 transition-colors overflow-hidden rounded-full shadow-xl">
                    {/* Object-cover object-top ensures the faces stay visible and beautifully cropped in the circle! */}
                    <img src={person.image} alt={person.name} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" />
                    
                    {/* LinkedIn Hover Overlay */}
                    <div className="absolute inset-0 bg-[#0085FF]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-headline font-bold text-2xl md:text-3xl mb-1 group-hover:text-[#0085FF] transition-colors">{person.name}</h3>
                    <p className="text-white/50 text-sm md:text-lg">{person.role}</p>
                    <p className="text-[#0085FF] text-[10px] md:text-xs font-label tracking-widest uppercase mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Connect on LinkedIn →
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-32 px-8 bg-[#0085FF]">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-headline font-bold text-5xl md:text-7xl tracking-tight text-white leading-[0.95] mb-6">
            Enough reading.<br />
            <span className="text-black">Start building.</span>
          </h2>
          <p className="text-white/80 text-lg mb-10">Join the community for free. Pick a domain when you&apos;re ready.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/domains" className="bg-black text-white px-10 py-4 font-headline font-bold text-sm hover:bg-[#111] transition-colors">
              Explore Domains →
            </a>
            <a href="/community" className="bg-white/10 text-white px-10 py-4 font-headline font-bold text-sm hover:bg-white/20 transition-colors border border-white/20">
              Join Community
            </a>
          </div>
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
