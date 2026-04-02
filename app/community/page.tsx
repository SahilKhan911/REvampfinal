
import Navbar from "../components/Navbar";

export default function CommunityPage() {
  return (
    <div className="bg-[#0a0a0a] text-white font-body min-h-screen selection:bg-primary/30 selection:text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />
      
      <Navbar />
      
      <main className="pt-32 pb-32 relative z-10">
        {/* Community Intro */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
              The Engine of REvamp
            </div>
            <h1 className="text-5xl md:text-8xl font-black font-headline tracking-tighter leading-[0.9] text-glow-blue uppercase italic">
              JOIN THE <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">COMMUNITY FIRST.</span>
            </h1>
            <p className="text-zinc-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              No payment. No commitment. Just the right energy.
            </p>
          </div>
        </section>

        {/* Social Connect Cards */}
        <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 mb-40">
          {/* Discord Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-indigo-600/10 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-zinc-900/50 backdrop-blur-3xl border border-white/5 p-12 rounded-[2rem] hover:border-indigo-500/30 transition-all flex flex-col h-full overflow-hidden">
              <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <h3 className="text-3xl font-black font-headline mb-4 uppercase tracking-tighter">Discord</h3>
              <p className="text-zinc-500 mb-10 font-light leading-relaxed text-sm flex-grow">
                Late night voice chats, resource sharing, and peer-to-peer coding help in our primary operations hub.
              </p>
              <a 
                href="https://discord.gg/68J8FHAMfh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all active:scale-95"
              >
                Join Operations
              </a>
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-emerald-600/10 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-zinc-900/50 backdrop-blur-3xl border border-white/5 p-12 rounded-[2rem] hover:border-emerald-500/30 transition-all flex flex-col h-full overflow-hidden">
              <div className="w-16 h-16 bg-emerald-600/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.653a11.823 11.823 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h3 className="text-3xl font-black font-headline mb-4 uppercase tracking-tighter">WhatsApp</h3>
              <p className="text-zinc-500 mb-10 font-light leading-relaxed text-sm flex-grow">
                Instant alerts for local meetups, high-priority session updates, and real-time community pulses.
              </p>
              <a 
                href="https://chat.whatsapp.com/revamp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-5 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-95"
              >
                Join Updates
              </a>
            </div>
          </div>

          {/* Instagram Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-pink-600/10 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-zinc-900/50 backdrop-blur-3xl border border-white/5 p-12 rounded-[2rem] hover:border-pink-500/30 transition-all flex flex-col h-full overflow-hidden">
              <div className="w-16 h-16 bg-pink-600/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </div>
              <h3 className="text-3xl font-black font-headline mb-4 uppercase tracking-tighter">Instagram</h3>
              <p className="text-zinc-500 mb-10 font-light leading-relaxed text-sm flex-grow">
                Visual documentation of our builds, student highlights, and a look into the local REvamp aesthetic.
              </p>
              <a 
                href="https://instagram.com/letsrevamp.here" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-5 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-black uppercase tracking-[0.2em] text-xs hover:opacity-90 hover:shadow-[0_0_30px_rgba(238,42,123,0.4)] transition-all active:scale-95"
              >
                Follow Log
              </a>
            </div>
          </div>
        </section>

        {/* Student Voices */}
        <section className="py-40 bg-[#0c0c0c] border-y border-white/5 relative">
          <div className="absolute top-0 left-0 w-full h-full brutalist-grid opacity-20" />
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="flex flex-col items-center mb-24 space-y-4">
              <span className="font-label text-primary text-[10px] uppercase tracking-[0.4em] font-black italic">The Feedback Loop</span>
              <h2 className="text-4xl md:text-6xl font-black font-headline uppercase italic tracking-tighter text-center">Student Voices</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-zinc-900/30 p-10 rounded-2xl border-l-[6px] border-primary flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-primary-container mb-10">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <blockquote className="text-zinc-300 text-xl font-light mb-12 italic leading-relaxed">
                    "Revamp stopped me from quitting CS. The energy at the meetups is purely academic but aggressive."
                  </blockquote>
                </div>
                <div className="pt-8 border-t border-white/5">
                  <p className="font-black font-headline uppercase tracking-tight text-white">Aryan Sharma</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">DTU • CP 101 Attendee</p>
                </div>
              </div>
              
              <div className="bg-zinc-900/30 p-10 rounded-2xl border-l-[6px] border-primary flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-primary-container mb-10">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <blockquote className="text-zinc-300 text-xl font-light mb-12 italic leading-relaxed">
                    "Finally found a community in India that focuses on building projects instead of just buying certificates."
                  </blockquote>
                </div>
                <div className="pt-8 border-t border-white/5">
                  <p className="font-black font-headline uppercase tracking-tight text-white">Mehak Jain</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">VIT • Web Dev Ritual</p>
                </div>
              </div>

              <div className="bg-zinc-900/30 p-10 rounded-2xl border-l-[6px] border-primary flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-primary-container mb-10">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <blockquote className="text-zinc-300 text-xl font-light mb-12 italic leading-relaxed">
                    "The energy at the OpenSource event was insane. 600+ people and everyone was genuinely learning."
                  </blockquote>
                </div>
                <div className="pt-8 border-t border-white/5">
                  <p className="font-black font-headline uppercase tracking-tight text-white">Rahul Verma</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">NSUT • OpenSource 101</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-48 px-6 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/10 blur-[100px] -z-10 rounded-full" />
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="space-y-4">
              <span className="font-label text-primary text-[10px] uppercase tracking-[0.5em] font-black italic">Final Mission</span>
              <h2 className="text-huge font-black font-headline uppercase italic leading-[0.8] tracking-tighter">
                STOP LEARNING ALONE.<br/>
                <span className="text-glow-blue border-b-[12px] border-primary/20 pb-2">START SHIPPING.</span>
              </h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
              <a 
                href="/signup" 
                className="group relative px-16 py-8 bg-white text-black font-black text-2xl font-headline uppercase italic tracking-tighter hover:bg-primary hover:text-white transition-all duration-300"
              >
                JOIN THE FLEET
                <div className="absolute -inset-1 bg-white/20 group-hover:bg-primary/50 blur opacity-0 group-hover:opacity-100 transition-all" />
              </a>
              <p className="text-zinc-500 font-label text-[10px] uppercase tracking-widest font-black italic md:w-32 text-center md:text-left leading-relaxed">
                SYSTEM AUTHENTICATION REQUIRED TO ACCESS CORE MODULES.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Simplified Footer */}
      <footer className="bg-black w-full py-20 border-t border-white/5 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-12 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-3xl font-black text-white font-headline uppercase italic tracking-tighter leading-none">RE/VAMP</div>
            <p className="text-zinc-600 text-[10px] font-label uppercase tracking-[0.3em] font-black">Building rooms, not roadmaps.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12 font-headline text-[10px] uppercase tracking-[0.2em] font-black">
            <a className="text-zinc-500 hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1" href="https://discord.gg/68J8FHAMfh">Discord</a>
            <a className="text-zinc-500 hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1" href="https://instagram.com/letsrevamp.here">Instagram</a>
            <a className="text-zinc-500 hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1" href="https://chat.whatsapp.com/revamp">WhatsApp</a>
            <a className="text-zinc-500 hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1" href="mailto:letsrevamp.here@gmail.com">Email</a>
          </div>
          <div className="text-right">
            <p className="text-zinc-600 text-[10px] font-label uppercase tracking-widest font-black italic">
              © 2026 REVAMP OPS.
            </p>
            <p className="text-zinc-800 text-[8px] font-mono mt-1">v4.0.0-PROD-STABLE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
