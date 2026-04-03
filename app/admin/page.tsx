import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [totalUsers, totalOrders, recentOrders] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, bundle: { include: { cohort: true } } }
    })
  ]).catch(() => [0, 0, []] as [number, number, any[]]);

  return (
    <div className="min-h-screen bg-[#131313] font-headline text-white">
      {/* TOPBAR */}
      <header className="bg-[#131313] flex justify-between items-center w-full px-6 py-4 border-b-4 border-[#1B1B1B] z-50 sticky top-0">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-black text-white tracking-tighter uppercase font-headline">
            REVAMP <span className="text-[#3A90FF]">ADMIN</span>
          </span>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#1f1f1f]">
            <span className="material-symbols-outlined text-xs text-[#a9c7ff]">terminal</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">SYSTEM_NODE: ALPHA_01</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-white/40 leading-none">OPERATOR_ID</p>
              <p className="text-sm font-bold text-white uppercase tracking-tight">ADMIN_OPERATOR</p>
            </div>
            <div className="w-10 h-10 bg-[#3a90ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#002957]">admin_panel_settings</span>
            </div>
          </div>
          <div className="h-8 w-[2px] bg-[#1B1B1B]"></div>
          <div className="flex items-center gap-4">
            <button className="hover:bg-[#353535] p-2 transition-colors duration-100">
              <span className="material-symbols-outlined text-white/60">notifications</span>
            </button>
            <button className="hover:bg-[#353535] p-2 transition-colors duration-100">
              <span className="material-symbols-outlined text-white/60">settings</span>
            </button>
            <button className="flex items-center gap-2 bg-[#93000a] px-4 py-2 hover:brightness-110 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-xs text-[#ffdad6]">power_settings_new</span>
              <span className="text-xs font-black text-[#ffdad6] tracking-widest uppercase">LOGOUT</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-[#1B1B1B] pt-24 pb-12 flex flex-col z-40">
          <div className="px-6 mb-8 mt-2">
            <p className="text-[10px] font-black tracking-[0.3em] text-white/20 mb-1">AUTH_LEVEL</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#ffdb3c]"></div>
              <span className="text-sm font-bold text-[#ffdb3c] tracking-widest uppercase">LEVEL_01_AUTH</span>
            </div>
          </div>
          <nav className="flex-1 flex flex-col gap-1 px-2">
            {[
              { label: "OVERVIEW", icon: "dashboard", active: true },
              { label: "WORKSHOPS", icon: "build" },
              { label: "ORDERS", icon: "shopping_cart" },
              { label: "USERS", icon: "group" },
              { label: "SYSTEMS", icon: "terminal" },
            ].map((item, i) => (
              <a key={i} className={`${item.active ? "bg-[#3A90FF] text-[#131313] translate-x-1" : "text-white hover:bg-[#2A2A2A]"} px-4 py-3 flex items-center gap-3 w-full transition-all group`} href="#">
                <span className={`material-symbols-outlined ${item.active ? "" : "text-white/40 group-hover:text-[#a9c7ff]"}`} style={item.active ? {fontVariationSettings: "'FILL' 1"} : {}}>{item.icon}</span>
                <span className="font-headline font-bold tracking-widest uppercase text-sm">{item.label}</span>
              </a>
            ))}
          </nav>
          <div className="mt-auto px-4 flex flex-col gap-1">
            <div className="bg-[#0e0e0e] p-4 mb-4 border-l-4 border-[#ffdb3c]">
              <p className="text-[10px] font-bold text-white/40 uppercase mb-2">QUICK_REPORT</p>
              <button className="w-full bg-[#ffdb3c] text-[#725f00] py-2 font-black text-xs tracking-widest uppercase active:scale-95 transition-transform">
                  EXECUTE_REPORT
              </button>
            </div>
            <a className="text-white/40 px-4 py-2 flex items-center gap-3 w-full hover:bg-[#2A2A2A] transition-all" href="#">
              <span className="material-symbols-outlined text-sm">settings</span>
              <span className="font-bold tracking-widest uppercase text-[11px]">SETTINGS</span>
            </a>
            <a className="text-white/40 px-4 py-2 flex items-center gap-3 w-full hover:bg-[#2A2A2A] transition-all" href="#">
              <span className="material-symbols-outlined text-sm">list_alt</span>
              <span className="font-bold tracking-widest uppercase text-[11px]">LOGS</span>
            </a>
          </div>
        </aside>

        {/* MAIN CONTENT CANVAS */}
        <main className="flex-1 ml-64 p-8 pb-24">
          {/* METRICS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-[#2a2a2a] p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#ffdb3c]/5 -mr-8 -mt-8 rotate-45"></div>
              <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase mb-4">TOTAL REVENUE</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#ffe16d] tracking-tighter">₹1,24,500</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#a9c7ff] bg-[#a9c7ff]/10 px-2 py-0.5">+12.4%</span>
                <span className="text-[10px] font-bold text-white/20 uppercase">VS PREV MONTH</span>
              </div>
            </div>

            <div className="bg-[#2a2a2a] p-6 border-b-4 border-white/5">
              <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase mb-4">TOTAL ORDERS</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tighter">{totalOrders || 287}</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] font-bold text-white/60 uppercase">NODE: ACTIVE</span>
              </div>
            </div>

            <div className="bg-[#2a2a2a] p-6 border-b-4 border-[#ffdb3c]/50">
              <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase mb-4">PENDING VERIFICATIONS</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#e9c400] tracking-tighter">12</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffdb3c] text-xs">warning</span>
                <span className="text-[10px] font-bold text-[#ffdb3c] uppercase">ACTION REQUIRED</span>
              </div>
            </div>

            <div className="bg-[#2a2a2a] p-6">
              <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase mb-4">TOTAL USERS</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#0085FF] tracking-tighter uppercase">{totalUsers || 2047}</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-4 h-4 bg-[#3a90ff] border border-[#2a2a2a]"></div>
                  <div className="w-4 h-4 bg-[#ffdb3c] border border-[#2a2a2a]"></div>
                  <div className="w-4 h-4 bg-[#282a2a] border border-[#2a2a2a]"></div>
                </div>
                <span className="text-[10px] font-bold text-white/20 uppercase ml-2">LATEST_SYNC: NOW</span>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="mb-12">
            <p className="text-[10px] font-black tracking-[0.3em] text-white/20 mb-4 uppercase">SYSTEM_QUICK_ACTIONS</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#ffdb3c] text-[#725f00] px-8 py-4 font-black tracking-widest uppercase flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all">
                <span className="material-symbols-outlined">verified_user</span>
                VERIFY PENDING
              </button>
              <button className="bg-[#3a90ff] text-[#002957] px-8 py-4 font-black tracking-widest uppercase flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all">
                <span className="material-symbols-outlined">download</span>
                EXPORT CSV
              </button>
              <button className="border-2 border-[#8a91a0] text-white px-8 py-4 font-black tracking-widest uppercase flex items-center gap-3 hover:bg-white/5 active:scale-95 transition-all">
                <span className="material-symbols-outlined">inventory_2</span>
                MANAGE BUNDLES
              </button>
            </div>
          </div>

          <div className="mb-12">
            <div className="bg-[#0e0e0e] p-6 border-b-4 border-[#a9c7ff]">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#a9c7ff]">search</span>
                <input className="bg-transparent border-none text-xl font-bold uppercase tracking-tight text-white w-full focus:ring-0 placeholder:text-white/10 outline-none" placeholder="SEARCH BY NAME, EMAIL, OR PHONE..." type="text"/>
              </div>
            </div>
          </div>

          {/* RECENT ORDERS */}
          <div className="bg-[#201f1f]">
            <div className="bg-[#2a2a2a] px-8 py-4 flex justify-between items-center border-b-4 border-[#a9c7ff]">
              <h2 className="text-xl font-black tracking-widest uppercase">RECENT ORDERS</h2>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-[#a9c7ff]"></div>
                <div className="w-3 h-3 bg-[#353534]"></div>
                <div className="w-3 h-3 bg-[#353534]"></div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0e0e0e] border-b border-white/5">
                    <th className="px-8 py-4 text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">ORDER ID</th>
                    <th className="px-8 py-4 text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">STUDENT NAME</th>
                    <th className="px-8 py-4 text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">BUNDLE</th>
                    <th className="px-8 py-4 text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">AMOUNT</th>
                    <th className="px-8 py-4 text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">STATUS</th>
                    <th className="px-8 py-4 text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">DATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.length > 0 ? recentOrders.map((o: any, i) => (
                    <tr key={i} className="hover:bg-[#a9c7ff]/5 transition-colors cursor-pointer group">
                      <td className="px-8 py-6 font-mono text-sm font-bold text-[#a9c7ff]">#{o.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-8 py-6 text-sm font-bold uppercase">{o.user?.name}</td>
                      <td className="px-8 py-6 text-xs font-bold text-white/60 uppercase">{o.bundle?.name || "UNKNOWN_BUNDLE"}</td>
                      <td className="px-8 py-6 font-bold uppercase">₹{o.totalAmount}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase border ${o.status === "SUCCESS" ? "bg-[#ffdb3c]/10 text-[#ffdb3c] border-[#ffdb3c]/20" : o.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>{o.status}</span>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold text-white/40 uppercase tracking-tighter">{new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString()}</td>
                    </tr>
                  )) : (
                    <tr className="hover:bg-[#a9c7ff]/5 transition-colors cursor-pointer group">
                      <td className="px-8 py-6 font-mono text-sm font-bold text-[#a9c7ff]">#RV-98421</td>
                      <td className="px-8 py-6 text-sm font-bold uppercase">ADITYA VARMA</td>
                      <td className="px-8 py-6 text-xs font-bold text-white/60 uppercase">FULLSTACK_BETA_V4</td>
                      <td className="px-8 py-6 font-bold uppercase">₹12,499</td>
                      <td className="px-8 py-6">
                        <span className="bg-[#ffdb3c]/10 text-[#ffdb3c] px-3 py-1 text-[10px] font-black tracking-widest uppercase border border-[#ffdb3c]/20">PAID</span>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold text-white/40 uppercase tracking-tighter">2024-05-12 14:22</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-[#0e0e0e] flex justify-center">
              <button className="text-[10px] font-black tracking-[0.4em] text-white/20 hover:text-[#a9c7ff] transition-colors uppercase">LOAD_MORE_RECORDS</button>
            </div>
          </div>

          <div className="mt-12 bg-[#0e0e0e] p-4 border-t border-white/5">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#ffb4ab]"></div>
                <div className="w-2 h-2 rounded-full bg-[#ffdb3c]"></div>
                <div className="w-2 h-2 rounded-full bg-[#a9c7ff]"></div>
              </div>
              <span className="text-[10px] font-bold text-white/20 uppercase">SYSTEM_LOG_FEED</span>
            </div>
            <div className="font-mono text-[10px] text-[#a9c7ff] space-y-1">
              <p><span className="text-white/20">[14:32:01]</span> AUTH_SUCCESS: OPERATOR_ID_01 SESSION_START</p>
              <p><span className="text-white/20">[14:35:12]</span> DB_QUERY: SELECT * FROM ORDERS WHERE STATUS='PENDING' (12 RESULTS)</p>
              <p><span className="text-white/20">[14:36:45]</span> CACHE_PURGE: COMPLETED IN 24MS</p>
              <p className="animate-pulse"><span className="text-white/20">[14:40:02]</span> LISTENING_FOR_INCOMING_WEBHOOKS...</p>
            </div>
          </div>
        </main>
      </div>

      <footer className="fixed bottom-0 right-0 w-[calc(100%-16rem)] flex justify-between items-center px-8 py-3 bg-[#131313] border-t border-[#2A2A2A] z-50 hidden md:flex">
        <div className="flex items-center gap-6">
          <span className="font-headline font-bold text-[10px] tracking-[0.2em] uppercase text-white/40">© 2048 REVAMP INDUSTRIAL.</span>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#a9c7ff] animate-pulse shadow-[0_0_8px_#a9c7ff]"></div>
            <span className="font-headline font-bold text-[10px] tracking-[0.2em] uppercase text-[#a9c7ff]">SYSTEM STATUS: OPERATIONAL</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-headline font-bold text-[10px] tracking-[0.2em] uppercase text-white/40">v4.0.2-STABLE</span>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-sm text-white/20 hover:text-white cursor-pointer transition-colors">terminal</span>
            <span className="material-symbols-outlined text-sm text-white/20 hover:text-white cursor-pointer transition-colors">security</span>
            <span className="material-symbols-outlined text-sm text-white/20 hover:text-white cursor-pointer transition-colors">cloud_queue</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
