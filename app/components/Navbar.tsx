"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import StaggeredMenu from "./StaggeredMenu"

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
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    fetch("/api/user/auth/me")
      .then(res => res.json())
      .then(data => { if (data.user) setUser(data.user) })
      .catch(() => {})
  }, [])

  const handleLogout = () => {
    document.cookie = "user_token=; path=/; max-age=0"
    setUser(null)
    router.push("/")
  }

  // Dynamic menu items
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    ...NAV_LINKS.map(link => ({
      label: link.label,
      ariaLabel: `Go to ${link.label}`,
      link: link.href
    })),
    ...(user ? [
      { label: 'Dashboard', ariaLabel: 'Go to Dashboard', link: '/dashboard' },
      { label: 'Log Out', ariaLabel: 'Log out of your account', onClick: handleLogout },
    ] : [
      { label: 'Sign Up', ariaLabel: 'Sign up for an account', link: '/signup' },
      { label: 'Log In', ariaLabel: 'Log into your account', link: '/login' },
    ])
  ]

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com/revamp' },
    { label: 'Instagram', link: 'https://instagram.com/revamp' },
    { label: 'LinkedIn', link: 'https://linkedin.com/company/revamp' }
  ]

  const menuProps = {
    position: "right",
    items: menuItems,
    socialItems,
    displaySocials: true,
    displayItemNumbering: true,
    menuButtonColor: "#fff",
    openMenuButtonColor: "#1B1E2B",
    changeMenuColorOnOpen: true,
    colors: ['#1B1E2B', '#0085FF'],
    logoUrl: "https://ik.imagekit.io/cotszrkgk/Screenshot_2025-06-25_at_9.10.56_PM-removebg-preview.png?updatedAt=1756648034230",
    accentColor: "#0085FF",
    isFixed: true,
  }
  return <StaggeredMenu {...(menuProps as any)} />
}
