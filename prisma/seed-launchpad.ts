import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_SESSIONS = [
  { week: 1, day: 1, title: "Welcome & The REvamp World", subtitle: "Orientation", topics: ["Intro to Launchpad — what these 4 weeks are", "Tour of the REvamp ecosystem: Launchpad → AIconic", "What REcoins are and how students earn them", "Community setup: join Discord, set nickname, intro", "Icebreaker: 'If you could automate one thing...'"], homework: "Watch 3Blue1Brown's 'But what is a neural network?' — just to plant a seed. No need to understand it yet." },
  { week: 1, day: 2, title: "Mapping the CSE Universe", subtitle: "Orientation", topics: ["The 4 domains: Web Dev, AI/ML, Cybersecurity, Open Source", "Career paths: where each domain leads in 4 years", "Busting myths: 'AI will replace programmers' etc.", "Real people in each domain — 2–3 examples per track", "Open Q&A — no stupid questions rule enforced hard"], homework: "Google one person working in the domain that interests you. Drop their name + one thing they built in Discord." },
  { week: 1, day: 3, title: "How the Internet Works", subtitle: "Orientation", topics: ["What happens when you type google.com and hit enter", "Clients, servers, requests, responses — in plain English", "HTTP vs HTTPS, DNS, IP addresses", "Live demo: DevTools → Network tab on any live website", "Analogy: the internet as a postal system"], homework: "Open DevTools on any site you use daily. Screenshot the most interesting network request you find. Share it." },
  { week: 1, day: 4, title: "How Computers Think", subtitle: "Orientation", topics: ["Binary — why computers speak 0s and 1s", "What an algorithm is: the cooking recipe analogy", "What data is: everything is just structured information", "What a program really is: instructions + data + execution", "Group exercise: write plain-English steps to sort 5 numbers"], homework: "Write a plain-English algorithm for any one task from your daily routine. Minimum 10 steps." },
  { week: 1, day: 5, title: "Tools Setup + Open AMA", subtitle: "Orientation", topics: ["Create a GitHub account — walk through live together", "Install VS Code and configure basic extensions", "Join the REvamp Discord properly — explore all channels", "Open AMA: anything about CSE, career, college", "Preview of Week 2"], homework: "Customize your GitHub profile — bio, photo, pinned repo. First impressions matter." },
  { week: 2, day: 1, title: "Terminal + Git + GitHub", subtitle: "Foundations", topics: ["What the terminal is and why developers live in it", "Core commands: cd, ls, mkdir, touch, mv, rm — live demo", "What version control is: the 'save game' analogy", "Git workflow: init → add → commit → push", "GitHub as a portfolio — it is their public CV"], homework: "Add day1-reflection.md to your repo — 5 sentences about what surprised you today." },
  { week: 2, day: 2, title: "Python: The Universal Language", subtitle: "Foundations", topics: ["Why Python: AI, scripting, automation, data, prototyping", "Variables, data types — integers, strings, lists, dicts", "Conditionals: if/elif/else · Loops: for and while · Functions", "Live exercise: function that prints 'Welcome to Launchpad!'", "Reading Python errors — normalize breaking things"], homework: "Write a Python script that asks for name and age, then prints the year they were born. Push it." },
  { week: 2, day: 3, title: "Web Basics: HTML + CSS", subtitle: "Foundations", topics: ["What HTML is: the skeleton · What CSS is: the styling layer", "Tags: h1–h6, p, a, img, div, ul/li", "Basic CSS: colors, fonts, margins, padding, flexbox", "Live build: personal page → push to GitHub Pages", "The moment: 'Your page is now live on the internet'"], homework: "Customize your page — different colors, a photo, a 'What I want to build' section." },
  { week: 2, day: 4, title: "JavaScript + APIs", subtitle: "Foundations", topics: ["What JS does that HTML/CSS can't: interactivity and logic", "Variables, functions, DOM manipulation", "What an API is: the restaurant menu analogy", "Live demo: fetch a public API and display result on the page", "Add a working interactive button to personal page"], homework: "Add one working JS feature to your personal page. Anything counts. Push it." },
  { week: 2, day: 5, title: "Mini-Project Day", subtitle: "Foundations", topics: ["Option A: Quiz app — HTML/CSS/JS, 5 questions, shows score", "Option B: Python scraper — requests + BeautifulSoup", "Option C: Python to-do CLI — add, view, delete tasks", "No hand-holding on syntax — Google, Discord, figure it out", "Everyone shares GitHub link in Discord for peer reactions"], homework: "Write week2-reflection.md — what you built, what broke, what you'd do differently." },
  { week: 3, day: 1, title: "Web Dev Day", subtitle: "Deep Dive", topics: ["What a real web dev does day-to-day — the actual work", "Frontend vs backend vs fullstack — clear definitions", "Frameworks intro: why React exists, what Node.js does", "Live build challenge: recreate a UI screenshot in 45 mins", "roadmap.sh walkthrough"], homework: "Find a site you love the design of. Inspect it in DevTools. What CSS tricks can you spot?" },
  { week: 3, day: 2, title: "AI/ML Day", subtitle: "Deep Dive", topics: ["Demystifying AI: pattern matching at scale, not magic", "What training data is and why it matters more than the model", "Types of ML: classification, regression, clustering", "Live demo 1: pre-trained image classifier in Google Colab", "Live demo 2: prompt engineering — 5 prompts, compare outputs"], homework: "Use any AI tool to solve one problem you actually have. Write 5 sentences on what worked and what didn't." },
  { week: 3, day: 3, title: "Cybersecurity Day", subtitle: "Deep Dive", topics: ["What cybersecurity actually is: offense, defense, ethical grey", "Types of roles: ethical hacker, analyst, bug bounty, cryptographer", "Core concepts: authentication, encryption, vulnerabilities", "What a CTF is — the sport of hacking", "Live CTF on PicoCTF: find flag, decode Base64, SQL injection"], homework: "Create a TryHackMe account. Complete the first room. Screenshot your completion badge." },
  { week: 3, day: 4, title: "Open Source Day", subtitle: "Deep Dive", topics: ["What open source means — the philosophy, not just the license", "Why OSS contributions are the fastest path to credibility", "Tour of a real GitHub repo: issues, PRs, README, CONTRIBUTING.md", "How to find beginner-friendly issues: 'good first issue' label", "Live exercise: fork, make one small change, open a real PR"], homework: "Find one open source project you actually use. Read its CONTRIBUTING.md." },
  { week: 3, day: 5, title: "Reflection + LinkedIn + Hackathon Prep", subtitle: "Deep Dive", topics: ["30-min solo journaling: 'Which day made you lean forward? Why?'", "LinkedIn profile build live: headline, about, education, skills", "What to post as a beginner: build-in-public, project updates", "GitHub READMEs, Twitter/X for devs, Instagram for founders", "Hackathon rules + team formation, REcoins walkthrough"], homework: "DM your teammates. Agree on a domain. Post team name in Discord. LinkedIn post if you haven't yet." },
  { week: 4, day: 1, title: "Problem Statements Drop + Team Kick-off", subtitle: "Hackathon", topics: ["9 AM: problem statements released across all channels", "Teams read, discuss, pick their problem (9–10 AM)", "Ideation with a mentor — scope to something shippable in 3 days", "Set up repo, write README with plan, push — public commitment"], homework: "Deliverable: GitHub repo with README explaining what you're building and how." },
  { week: 4, day: 2, title: "Build Day 1 — Full Build Day", subtitle: "Hackathon", topics: ["No sessions, no lectures — just build", "Mentors available async on Discord in #hackathon-help", "Optional 30-min office hour at 3 PM for stuck teams", "Commit at least once every 2 hours — shows progress"], homework: "End of day: one-liner update in #build-log." },
  { week: 4, day: 3, title: "Build Day 2 + Mid-Check", subtitle: "Hackathon", topics: ["Morning: continue building — core features only", "12 PM mandatory mid-check in #build-log: working / broken / cut", "Afternoon: extended 1-hour office hours — priority for stuck teams", "By end of today: core functionality complete — Day 4 is polish only"], homework: "By end of today: core functionality complete." },
  { week: 4, day: 4, title: "Final Polish + Demo Prep", subtitle: "Hackathon", topics: ["No new features — fix, clean, document", "Every team needs: deployed URL, screen recording, or documented local run", "Prepare 5-minute pitch: problem → demo → what's next", "Submit GitHub + demo link by 6 PM — hard deadline, no exceptions"], homework: "Submit GitHub + demo link by 6 PM." },
  { week: 4, day: 5, title: "Demo Day — The Main Event", subtitle: "Hackathon", topics: ["10 AM: all teams join the call", "5 mins per team, hard cut, 2 judge questions after each", "15-min judge deliberation after all demos", "REcoins announced live — certs emailed within 24 hours", "Discord stays open — the community doesn't end here"], homework: "Post on LinkedIn about what you built. Tag #REvampLaunchpad." },
]

async function main() {
  console.log('Seeding LaunchpadSessions...')
  let created = 0
  let skipped = 0

  for (const s of DEFAULT_SESSIONS) {
    const existing = await prisma.launchpadSession.findUnique({
      where: { week_day: { week: s.week, day: s.day } },
    })
    if (existing) {
      console.log(`  SKIP W${s.week}D${s.day}: ${s.title}`)
      skipped++
      continue
    }
    await prisma.launchpadSession.create({
      data: {
        week: s.week,
        day: s.day,
        title: s.title,
        subtitle: s.subtitle,
        topics: s.topics,
        homework: s.homework,
      },
    })
    console.log(`  CREATE W${s.week}D${s.day}: ${s.title}`)
    created++
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
