
import Navbar from "../components/Navbar";

export default function ManifestoPage() {
  return (
    <div className="bg-[#0e0e0e] text-[#e5e2e1] font-headline min-h-screen selection:bg-[#a9c7ff] selection:text-[#0e0e0e]">
      <Navbar />
      
{/*  TopAppBar  */}
<nav className="flex justify-between items-center w-full px-6 py-8 max-w-full sticky top-0 z-50 bg-[#131313] tonal-shift bg-surface-container-low border-none">
<div className="text-4xl font-black tracking-tighter text-white uppercase font-['Space_Grotesk']">REVAMP.</div>
<div className="hidden md:flex items-center gap-12">
<a className="text-[#0085FF] border-b-4 border-[#0085FF] pb-1 font-['Space_Grotesk'] uppercase font-bold tracking-tighter" href="#">MANIFESTO</a>
<a className="text-white opacity-70 hover:opacity-100 transition-opacity font-['Space_Grotesk'] uppercase font-bold tracking-tighter" href="#">COLLECTIVE</a>
<a className="text-white opacity-70 hover:opacity-100 transition-opacity font-['Space_Grotesk'] uppercase font-bold tracking-tighter" href="#">TECHNE</a>
<a className="text-white opacity-70 hover:opacity-100 transition-opacity font-['Space_Grotesk'] uppercase font-bold tracking-tighter" href="#">LOG</a>
</div>
<div className="flex items-center gap-4">
<button className="p-2 hover:bg-[#FFD700] hover:text-black transition-all duration-0">
<span className="material-symbols-outlined" data-icon="menu">menu</span>
</button>
</div>
</nav>
<main className="w-full">
{/*  Hero Section: Two-column Editorial  */}
<section className="flex flex-col md:flex-row min-h-screen border-t border-outline-variant/20">
{/*  Left: Sticky Content  */}
<div className="md:w-[40%] md:sticky md:top-24 h-fit p-10 md:p-16 flex flex-col justify-start">
<div className="w-16 h-4 bg-primary-container mb-12"></div>
<h1 className="font-headline font-extrabold italic uppercase leading-[0.85] tracking-tighter text-[5rem] lg:text-[7rem] text-white">
                    MOST COLLEGE STUDENTS LEARN ALONE.
                </h1>
<div className="mt-8">
<span className="font-label text-white/40 tracking-[0.2em] text-sm uppercase">THE SOLO-LEARNING TRAP / EPISODE 01</span>
</div>
</div>
{/*  Right: Scrollable Content  */}
<div className="md:w-[60%] border-l border-outline-variant/20 p-6 md:p-16 space-y-24 bg-surface-container-low">
<div className="relative group">
<img alt="documentation" className="w-full h-[716px] object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-700" data-alt="high contrast black and white photo of focused university students collaborating over open laptops in a modern industrial workspace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY9FDDvCigFmZE1GLSSkp4v43JoFSRabl6XuvZmkxr3ENNsY7PEk8eIVMGWgcSO8rKodpSPMybBKklpDqVYQnU9kX7ykxZSalr2qYnW07cSv_FPi0LRjFnOegIlgpQQBjxpxhCa-dfR0FuQ3FbmizaTsAXzi_rqnzCQOgHETWOd59UnpAxEvUXLH8qHjuAvjlNNbaKtWzs5FHl8Ol1tpVR-qLJCB9ld9axPTNwkbLxinOYTvYYfJicLLvFXVpwfJLwp6uAJOUNNTs"/>
<div className="absolute top-8 left-8 bg-primary-container px-4 py-2 text-on-primary-container font-label font-bold uppercase tracking-widest text-xs">
                        DOCUMENTATION: REVAMP MEETUP
                    </div>
</div>
<div className="max-w-2xl space-y-12">
<p className="text-2xl md:text-3xl font-light text-white/80 leading-relaxed font-body">
                        The modern education system is optimized for individual assessment, not collective intelligence. We spend years solving problems in isolation, only to enter an industry that demands radical collaboration. 
                        <span className="text-secondary-container font-bold block mt-6 uppercase font-headline italic text-4xl leading-none">THE ARCHITECTURE OF LEARNING IS BROKEN.</span>
</p>
<p className="text-xl text-white/60 leading-relaxed font-body">
                        REVAMP is not a club. It is a technical infrastructure designed to facilitate the high-speed exchange of knowledge. We are building a neural network of developers who understand that the fastest way to master a stack is to teach it to the person sitting next to you. No gatekeeping. No competition. Just raw, unadulterated execution.
                    </p>
<div className="pt-8">
<button className="bg-primary-container text-on-primary-container px-12 py-6 font-headline font-bold uppercase text-2xl tracking-tighter hover:bg-secondary-container hover:text-black transition-all group relative overflow-hidden">
                            JOIN THE COLLECTIVE
                            <span className="ml-4 material-symbols-outlined align-middle" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
<div className="grid grid-cols-2 gap-8 py-12 border-t border-outline-variant/30">
<div>
<span className="font-label text-primary-container text-xs tracking-widest block mb-2">METRIC_01</span>
<div className="text-5xl font-headline font-black text-white">4.2K+</div>
<div className="text-sm text-white/40 uppercase">HOURS_CODE_COMMITTED</div>
</div>
<div>
<span className="font-label text-primary-container text-xs tracking-widest block mb-2">METRIC_02</span>
<div className="text-5xl font-headline font-black text-white">12</div>
<div className="text-sm text-white/40 uppercase">ACTIVE_NODES_REGIONALLY</div>
</div>
</div>
</div>
</section>
{/*  Events Section  */}
<section className="bg-background py-24 px-6 md:px-16 overflow-hidden">
<div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
<div className="w-full">
<div className="w-24 h-3 bg-primary-container mb-6"></div>
<h2 className="font-headline font-extrabold uppercase italic text-6xl md:text-[8rem] leading-[0.8] tracking-tighter text-white">
                        PAST EVENTS
                    </h2>
</div>
<div className="flex gap-4">
<button className="w-16 h-16 flex items-center justify-center border border-outline-variant/30 text-white hover:bg-white hover:text-black transition-all">
<span className="material-symbols-outlined" data-icon="west">west</span>
</button>
<button className="w-16 h-16 flex items-center justify-center border border-outline-variant/30 text-white hover:bg-white hover:text-black transition-all">
<span className="material-symbols-outlined" data-icon="east">east</span>
</button>
</div>
</div>
<div className="flex overflow-x-auto hide-scrollbar gap-8 pb-12 snap-x">
{/*  Card 1  */}
<div className="flex-shrink-0 w-[320px] h-[500px] bg-surface-container border border-outline-variant/10 p-8 flex flex-col justify-between snap-start group hover:bg-surface-container-high transition-colors">
<div>
<span className="text-4xl mb-6 block">🔓</span>
<h3 className="font-headline font-bold text-3xl uppercase leading-none mb-4 text-white">OpenSource 101</h3>
<p className="text-white/40 uppercase text-xs tracking-widest">Documentation &amp; PR Mastery</p>
</div>
<div className="space-y-6">
<div className="text-5xl font-headline font-black text-primary-container">619</div>
<p className="text-white/60 font-label text-sm uppercase">GUESTS_ATTENDED</p>
<a className="inline-flex items-center text-[#0085FF] font-bold uppercase tracking-tighter group-hover:gap-4 transition-all" href="#">
                            VIEW ARCHIVE <span className="material-symbols-outlined ml-2" data-icon="trending_flat">trending_flat</span>
</a>
</div>
</div>
{/*  Card 2  */}
<div className="flex-shrink-0 w-[320px] h-[500px] bg-surface-container border border-outline-variant/10 p-8 flex flex-col justify-between snap-start group hover:bg-surface-container-high transition-colors">
<div>
<span className="text-4xl mb-6 block">⚡</span>
<h3 className="font-headline font-bold text-3xl uppercase leading-none mb-4 text-white">CP 101</h3>
<p className="text-white/40 uppercase text-xs tracking-widest">Competitive Programming Sprint</p>
</div>
<div className="space-y-6">
<div className="text-5xl font-headline font-black text-primary-container">490</div>
<p className="text-white/60 font-label text-sm uppercase">GUESTS_ATTENDED</p>
<a className="inline-flex items-center text-[#0085FF] font-bold uppercase tracking-tighter group-hover:gap-4 transition-all" href="#">
                            VIEW ARCHIVE <span className="material-symbols-outlined ml-2" data-icon="trending_flat">trending_flat</span>
</a>
</div>
</div>
{/*  Card 3  */}
<div className="flex-shrink-0 w-[320px] h-[500px] bg-surface-container border border-outline-variant/10 p-8 flex flex-col justify-between snap-start group hover:bg-surface-container-high transition-colors">
<div>
<span className="text-4xl mb-6 block">🧱</span>
<h3 className="font-headline font-bold text-3xl uppercase leading-none mb-4 text-white">Web3 Builders</h3>
<p className="text-white/40 uppercase text-xs tracking-widest">Protocol Architecture Workshop</p>
</div>
<div className="space-y-6">
<div className="text-5xl font-headline font-black text-primary-container">255</div>
<p className="text-white/60 font-label text-sm uppercase">GUESTS_ATTENDED</p>
<a className="inline-flex items-center text-[#0085FF] font-bold uppercase tracking-tighter group-hover:gap-4 transition-all" href="#">
                            VIEW ARCHIVE <span className="material-symbols-outlined ml-2" data-icon="trending_flat">trending_flat</span>
</a>
</div>
</div>
{/*  Card 4  */}
<div className="flex-shrink-0 w-[320px] h-[500px] bg-surface-container border border-outline-variant/10 p-8 flex flex-col justify-between snap-start group hover:bg-surface-container-high transition-colors">
<div>
<span className="text-4xl mb-6 block">🧠</span>
<h3 className="font-headline font-bold text-3xl uppercase leading-none mb-4 text-white">ML Infra</h3>
<p className="text-white/40 uppercase text-xs tracking-widest">Scale Beyond Localhost</p>
</div>
<div className="space-y-6">
<div className="text-5xl font-headline font-black text-primary-container">312</div>
<p className="text-white/60 font-label text-sm uppercase">GUESTS_ATTENDED</p>
<a className="inline-flex items-center text-[#0085FF] font-bold uppercase tracking-tighter group-hover:gap-4 transition-all" href="#">
                            VIEW ARCHIVE <span className="material-symbols-outlined ml-2" data-icon="trending_flat">trending_flat</span>
</a>
</div>
</div>
</div>
</section>
{/*  Testimonial Marquee  */}
<section className="py-24 border-y border-outline-variant/20 overflow-hidden">
<div className="px-6 md:px-16 mb-12">
<span className="font-label text-secondary-container tracking-widest font-bold text-sm uppercase">COMMUNITY_PULSE</span>
</div>
<div className="marquee">
<div className="marquee-content">
{/*  Testimonial 1  */}
<div className="w-[450px] bg-transparent border-l-4 border-primary-container p-8">
<p className="text-2xl font-headline italic font-bold text-white mb-6">"Revamp stopped me from quitting CS. The energy at the meetups is purely academic but aggressive."</p>
<p className="font-bold text-white uppercase tracking-widest text-sm">— ARJUN MEHTA</p>
</div>
{/*  Testimonial 2  */}
<div className="w-[450px] bg-transparent border-l-4 border-primary-container p-8">
<p className="text-2xl font-headline italic font-bold text-white mb-6">"Most college clubs are about pizza and socializing. This is about building the future of the web."</p>
<p className="font-bold text-white uppercase tracking-widest text-sm">— SARAH CHEN</p>
</div>
{/*  Testimonial 3  */}
<div className="w-[450px] bg-transparent border-l-4 border-primary-container p-8">
<p className="text-2xl font-headline italic font-bold text-white mb-6">"We shipped a production app in 48 hours. No one slept. Everyone learned. It was glorious."</p>
<p className="font-bold text-white uppercase tracking-widest text-sm">— MARCUS VANE</p>
</div>
{/*  Repeat for smooth loop  */}
<div className="w-[450px] bg-transparent border-l-4 border-primary-container p-8">
<p className="text-2xl font-headline italic font-bold text-white mb-6">"Revamp stopped me from quitting CS. The energy at the meetups is purely academic but aggressive."</p>
<p className="font-bold text-white uppercase tracking-widest text-sm">— ARJUN MEHTA</p>
</div>
<div className="w-[450px] bg-transparent border-l-4 border-primary-container p-8">
<p className="text-2xl font-headline italic font-bold text-white mb-6">"Most college clubs are about pizza and socializing. This is about building the future of the web."</p>
<p className="font-bold text-white uppercase tracking-widest text-sm">— SARAH CHEN</p>
</div>
</div>
</div>
</section>
{/*  CTA / Manifesto Footer Block  */}
<section className="px-6 md:px-16 py-32 flex flex-col md:flex-row gap-16 items-center">
<div className="md:w-1/2">
<h2 className="font-headline font-black italic text-7xl md:text-[9rem] leading-[0.75] uppercase text-white">STAY HUNGRY.</h2>
<h2 className="font-headline font-black italic text-7xl md:text-[9rem] leading-[0.75] uppercase text-primary-container">STAY RAW.</h2>
</div>
<div className="md:w-1/2 space-y-8">
<p className="text-xl text-white/60 leading-relaxed max-w-lg">
                    We are accepting new nodes into the collective. If you possess a radical obsession with technology and a disdain for the status quo, you belong here.
                </p>
<div className="flex flex-col gap-4">
<input className="bg-surface-container-low border-none border-b-2 border-outline focus:border-primary-container focus:ring-0 text-white font-label uppercase tracking-widest py-6 px-4" placeholder="ENTER EMAIL ADDRESS" type="email"/>
<button className="w-full bg-white text-black py-6 font-headline font-bold text-xl uppercase tracking-tighter hover:bg-secondary-container transition-all">AUTHENTICATE_JOIN_REQUEST</button>
</div>
</div>
</section>
</main>
{/*  Footer  */}
<footer className="flex flex-col md:flex-row justify-between items-start md:items-center w-full px-6 py-12 gap-8 bg-[#131313] tonal-shift bg-surface-container-highest border-t-0 font-['Space_Grotesk'] uppercase tracking-[0.1em] text-xs">
<div className="space-y-4">
<div className="text-xl font-bold text-white">REVAMP COLLECTIVE.</div>
<p className="text-white opacity-40">©2024 REVAMP COLLECTIVE. ALL RIGHTS RESERVED.</p>
</div>
<div className="flex flex-wrap gap-8">
<a className="text-[#0085FF] font-bold hover:text-[#FFD700] transition-colors" href="#">SYSTEM STATUS: OPERATIONAL</a>
<a className="text-white hover:text-[#FFD700] transition-colors" href="#">REDACTED</a>
<a className="text-white hover:text-[#FFD700] transition-colors" href="#">ENCRYPTED_FEED</a>
</div>
<div className="flex gap-6">
<span className="material-symbols-outlined text-white/40 cursor-pointer hover:text-primary-container transition-colors" data-icon="rss_feed">rss_feed</span>
<span className="material-symbols-outlined text-white/40 cursor-pointer hover:text-primary-container transition-colors" data-icon="terminal">terminal</span>
<span className="material-symbols-outlined text-white/40 cursor-pointer hover:text-primary-container transition-colors" data-icon="code">code</span>
</div>
</footer>

    </div>
  );
}
