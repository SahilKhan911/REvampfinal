"use client"
import FlowingMenu from "./FlowingMenu"

const DOMAIN_ITEMS = [
  {
    link: "/cohort/opensource",
    text: "Open Source",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop&auto=format",
    marqueeBgColor: "#0085FF",
    marqueeTextColor: "#fff",
  },
  {
    link: "/cohort/webdev",
    text: "Web Development",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop&auto=format",
    marqueeBgColor: "#8FDAFF",
    marqueeTextColor: "#000",
  },
  {
    link: "/cohort/aiml",
    text: "AI / ML",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format",
    marqueeBgColor: "#FF6B6B",
    marqueeTextColor: "#fff",
  },
  {
    link: "/cohort/cp",
    text: "Competitive Programming",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop&auto=format",
    marqueeBgColor: "#BAFF1A",
    marqueeTextColor: "#000",
  },
  {
    link: "/cohort/cybersec",
    text: "Cyber Security",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop&auto=format",
    marqueeBgColor: "#FF1AFF",
    marqueeTextColor: "#fff",
  },
  {
    link: "/cohort/launchpad",
    text: "College Starter",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop&auto=format",
    marqueeBgColor: "#FFD700",
    marqueeTextColor: "#000",
  },
]

export default function DomainsFlowingMenu() {
  return (
    <FlowingMenu
      items={DOMAIN_ITEMS as any}
      speed={12}
      textColor="#ffffff"
      bgColor="#000000"
      borderColor="rgba(255,255,255,0.08)"
    />
  )
}
