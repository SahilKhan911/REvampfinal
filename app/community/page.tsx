"use client"
import Navbar from "../components/Navbar"
import FlowingMenu from "../components/FlowingMenu"
import { InfiniteMovingCards } from "../components/InfiniteMovingCards"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black text-white font-body">
      <Navbar />

      {/* ═══ VIDEO HERO ═══ */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.35) saturate(1.2)' }}
        >
          <source src="/community-hero.mov" type="video/mp4" />
        </video>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-[900px]">
          <p className="font-label text-xs tracking-[0.3em] text-[#0085FF] uppercase mb-6">
            The Engine of REvamp
          </p>
          <h1 className="font-headline font-bold text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[0.92] mb-6">
            Cut the noise.<br />
            <span className="text-[#0085FF]">Join the signal.</span>
          </h1>
          <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
            No payment. No commitment. Just the right people, late-night sessions, resource drops, and the energy to ship.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://discord.gg/68J8FHAMfh"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0085FF] text-white px-10 py-4 rounded-full font-headline font-bold text-sm hover:bg-[#0070dd] transition-all duration-300 hover:scale-105"
            >
              Join Now →
            </a>
            <a
              href="/signup"
              className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-full font-headline font-bold text-sm hover:bg-white/20 transition-all duration-300 border border-white/15"
            >
              Create Account
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none opacity-40">
          <span className="font-label text-[10px] tracking-[0.25em] uppercase">Scroll</span>
          <span className="block w-px h-6 bg-white/50 animate-pulse" />
        </div>
      </section>

      {/* ═══ SOCIAL CHANNELS ═══ */}
      <section className="py-20 px-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-1 bg-[#0085FF]" />
            <p className="font-label text-xs tracking-[0.3em] text-[#0085FF] uppercase">Where We Operate</p>
          </div>
          <h2 className="font-headline font-bold text-3xl md:text-4xl tracking-tight mb-12">
            Three channels. <span className="text-white/30">Zero spam.</span>
          </h2>
          <div className="h-[420px] rounded-2xl overflow-hidden border border-white/10">
            <FlowingMenu
              items={[
                {
                  link: 'https://discord.gg/68J8FHAMfh',
                  text: 'Discord',
                  image: 'https://picsum.photos/seed/discord/600/400',
                  marqueeBgColor: '#5865F2',
                  marqueeTextColor: '#fff',
                },
                {
                  link: 'https://www.linkedin.com/company/letsrevamp/posts/?feedView=all',
                  text: 'LinkedIn',
                  image: 'https://picsum.photos/seed/linkedin/600/400',
                  marqueeBgColor: '#0A66C2',
                  marqueeTextColor: '#fff',
                },
                {
                  link: 'https://instagram.com/letsrevamp.here',
                  text: 'Instagram',
                  image: 'https://picsum.photos/seed/instagram/600/400',
                  marqueeBgColor: '#E1306C',
                  marqueeTextColor: '#fff',
                },
              ] as any}
              speed={12}
              textColor="#ffffff"
              bgColor="#000000"
              borderColor="rgba(255,255,255,0.08)"
            />
          </div>
        </div>
      </section>

      {/* ═══ STUDENT VOICES ═══ */}
      <section className="py-24 px-8 bg-[#0a0a0a]">
        <div className="max-w-[1100px] mx-auto mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-1 bg-[#FFD700]" />
            <p className="font-label text-xs tracking-[0.3em] text-[#FFD700] uppercase">What They Say</p>
          </div>
          <h2 className="font-headline font-bold text-3xl md:text-4xl tracking-tight">
            Student Voices
          </h2>
        </div>
        <InfiniteMovingCards
          items={[
            {
              quote: '"Revamp stopped me from quitting CS. The energy at the meetups is purely academic but aggressive."',
              name: 'Aryan Sharma',
              title: 'DTU · CP 101 Attendee',
            },
            {
              quote: '"Finally found a community in India that focuses on building projects instead of just buying certificates."',
              name: 'Mehak Jain',
              title: 'VIT · Web Dev Ritual',
            },
            {
              quote: '"The energy at the OpenSource event was insane. 600+ people and everyone was genuinely learning."',
              name: 'Rahul Verma',
              title: 'NSUT · OpenSource 101',
            },
            {
              quote: '"The Discord server alone is worth it. Got my first open source PR merged within a week of joining."',
              name: 'Priya Kapoor',
              title: 'IIIT-D · Open Source Track',
            },
            {
              quote: '"I went from zero CTF experience to placing top 10 in my first competition. The cybersec mentors are elite."',
              name: 'Karan Singh',
              title: 'DTU · CyberSec 101',
            },
            {
              quote: '"The Launchpad program helped me ship my first SaaS in 6 weeks. No hand-holding, just pure execution."',
              name: 'Ananya Gupta',
              title: 'NSUT · Launchpad Cohort',
            },
            {
              quote: '"Joined during my first year and already have two side projects live. The accountability culture here is unmatched."',
              name: 'Rohan Mehta',
              title: 'Manipal · Web Dev Ritual',
            },
            {
              quote: '"The ML workshops are incredibly hands-on. We shipped a real model in the first session, not just theory."',
              name: 'Nisha Agarwal',
              title: 'IIT-D · ML Ritual',
            },
            {
              quote: '"REvamp taught me that building in public beats studying in private. My GitHub went from empty to 20+ repos."',
              name: 'Ayush Tiwari',
              title: 'BITS Pilani · Launchpad Cohort',
            },
          ]}
        />
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
