"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/domains", label: "Domains" },
  { href: "/events", label: "Events" },
  { href: "/community", label: "Community" },
]

interface AuthUser {
  id: string
  name: string
  email: string
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/user/auth/me")
      .then(res => res.json())
      .then(data => { if (data.user) setUser(data.user) })
      .catch(() => {})
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleLogout = () => {
    document.cookie = "user_token=; path=/; max-age=0"
    setUser(null)
    setDropdownOpen(false)
    router.push("/")
  }

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : ""

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center px-8 py-5">
        <Link href="/" className="flex items-center">
          <img
            src="https://ik.imagekit.io/cotszrkgk/Screenshot_2025-06-25_at_9.10.56_PM-removebg-preview.png?updatedAt=1756648034230"
            alt="REvamp"
            className="h-20 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-headline text-sm transition-colors ${
                pathname === link.href
                  ? "text-white font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            /* ═══ LOGGED IN: Avatar Dropdown ═══ */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0085FF] to-[#00c6ff] flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-[#0085FF]/20 group-hover:shadow-[#0085FF]/40 transition-shadow">
                  {initials}
                </div>
                <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">
                  {user.name.split(" ")[0]}
                </span>
                <span className={`material-symbols-outlined text-white/40 text-sm transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#141414] border border-white/10 rounded-xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User info header */}
                  <div className="px-4 py-4 border-b border-white/5 bg-white/[0.02]">
                    <p className="text-white font-bold text-sm truncate">{user.name}</p>
                    <p className="text-white/40 text-xs truncate mt-0.5">{user.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    {[
                      { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
                      { href: "/dashboard?tab=workshops", icon: "school", label: "My Workshops" },
                      { href: "/dashboard?tab=orders", icon: "receipt_long", label: "My Orders" },
                      { href: "/dashboard?tab=referrals", icon: "group_add", label: "Referrals" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-white/5 py-2">
                    <Link
                      href="/dashboard?tab=settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">settings</span>
                      <span className="text-sm">Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      <span className="text-sm">Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ═══ LOGGED OUT: Sign Up CTA ═══ */
            <Link
              href="/signup"
              className="bg-[#0085FF] text-white text-sm font-bold px-6 py-2.5 hover:bg-[#0070DD] transition-colors rounded-lg"
            >
              Sign Up
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white/60" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-t border-white/5 px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-lg font-headline ${pathname === link.href ? "text-white font-bold" : "text-white/60"}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0085FF] to-[#00c6ff] flex items-center justify-center text-white text-sm font-bold">{initials}</div>
                  <div>
                    <p className="text-white font-bold text-sm">{user.name}</p>
                    <p className="text-white/40 text-xs">{user.email}</p>
                  </div>
                </div>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-white/60 hover:text-white text-sm py-2">Dashboard</Link>
                <Link href="/dashboard?tab=workshops" onClick={() => setMobileOpen(false)} className="block text-white/60 hover:text-white text-sm py-2">My Workshops</Link>
                <button onClick={handleLogout} className="block text-red-400/80 hover:text-red-400 text-sm py-2">Log Out</button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="block w-full bg-[#0085FF] text-white text-center py-3 font-bold rounded-lg">Sign Up</Link>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center text-white/50 py-2 text-sm">Already have an account? Log in</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
