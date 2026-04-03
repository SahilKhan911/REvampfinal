
import Navbar from "../components/Navbar"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black text-white font-body">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="pt-32 pb-20 px-8 border-b border-white/10">
        <div className="max-w-[1100px] mx-auto">
          <p className="font-label text-xs tracking-[0.3em] text-[#0085FF] uppercase mb-6">The Engine of REvamp</p>
          <h1 className="font-headline font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-8">
            Join the<br />
            community <span className="text-[#0085FF]">first.</span>
          </h1>
          <p className="text-white/40 text-xl max-w-2xl leading-relaxed">
            No payment. No commitment. Just the right energy. Our community is where the real learning happens — late-night sessions, resource drops, and people who push you to ship.
          </p>
        </div>
      </section>

      {/* ═══ SOCIAL CHANNELS ═══ */}
      <section className="py-24 px-8 border-b border-white/10">
        <div className="max-w-[1100px] mx-auto">
          <div className="w-10 h-1 bg-[#0085FF] mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">

            {/* Discord */}
            <div className="bg-black p-10 group hover:bg-[#0a0a0a] transition-colors flex flex-col">
              <div className="mb-8">
                <svg className="w-8 h-8 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <h3 className="font-headline font-bold text-2xl mb-3">Discord</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 flex-1">
                Late night voice chats, resource sharing, and peer-to-peer coding help. Our primary operations hub.
              </p>
              <a
                href="https://discord.gg/68J8FHAMfh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-headline font-bold text-sm text-[#5865F2] hover:underline"
              >
                Join Operations →
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-black p-10 group hover:bg-[#0a0a0a] transition-colors flex flex-col border-l border-white/10">
              <div className="mb-8">
                <svg className="w-8 h-8 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.653a11.823 11.823 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h3 className="font-headline font-bold text-2xl mb-3">WhatsApp</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 flex-1">
                Instant alerts for local meetups, high-priority session updates, and real-time community pulses.
              </p>
              <a
                href="https://chat.whatsapp.com/revamp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-headline font-bold text-sm text-[#25D366] hover:underline"
              >
                Join Updates →
              </a>
            </div>

            {/* Instagram */}
            <div className="bg-black p-10 group hover:bg-[#0a0a0a] transition-colors flex flex-col border-l border-white/10">
              <div className="mb-8">
                <svg className="w-8 h-8 text-[#E1306C]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </div>
              <h3 className="font-headline font-bold text-2xl mb-3">Instagram</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 flex-1">
                Visual documentation of our builds, student highlights, and a look into the REvamp aesthetic.
              </p>
              <a
                href="https://instagram.com/letsrevamp.here"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-headline font-bold text-sm text-[#E1306C] hover:underline"
              >
                Follow Log →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STUDENT VOICES ═══ */}
      <section className="py-24 px-8 bg-[#0a0a0a] border-b border-white/10">
        <div className="max-w-[1100px] mx-auto">
          <div className="w-10 h-1 bg-[#FFD700] mb-6" />
          <h2 className="font-headline font-bold text-3xl tracking-tight mb-16">Student Voices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="p-8 bg-black border border-white/5">
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                &ldquo;Revamp stopped me from quitting CS. The energy at the meetups is purely academic but aggressive.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-[#0085FF]" />
                <div>
                  <p className="font-headline font-bold text-sm">Aryan Sharma</p>
                  <p className="font-label text-xs text-white/30">DTU · CP 101 Attendee</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-black border border-white/5">
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                &ldquo;Finally found a community in India that focuses on building projects instead of just buying certificates.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-[#0085FF]" />
                <div>
                  <p className="font-headline font-bold text-sm">Mehak Jain</p>
                  <p className="font-label text-xs text-white/30">VIT · Web Dev Ritual</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-black border border-white/5">
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                &ldquo;The energy at the OpenSource event was insane. 600+ people and everyone was genuinely learning.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-[#0085FF]" />
                <div>
                  <p className="font-headline font-bold text-sm">Rahul Verma</p>
                  <p className="font-label text-xs text-white/30">NSUT · OpenSource 101</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-32 px-8 bg-[#0085FF]">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-headline font-bold text-5xl md:text-7xl tracking-tight text-white leading-[0.95] mb-6">
            Stop learning alone.<br />
            <span className="text-black">Start shipping.</span>
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Join the community for free. No payment. No commitment. Just people who want to build.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/signup" className="bg-black text-white px-10 py-4 font-headline font-bold text-sm hover:bg-[#111] transition-colors">
              Join the Fleet →
            </a>
            <a href="https://discord.gg/68J8FHAMfh" target="_blank" rel="noopener noreferrer" className="bg-white/10 text-white px-10 py-4 font-headline font-bold text-sm hover:bg-white/20 transition-colors border border-white/20">
              Open Discord
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
