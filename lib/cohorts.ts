export interface CohortConfig {
  slug: string
  name: string
  tagline: string
  heroTitle: string
  heroHighlight: string
  description: string
  accentColor: string      // HSL main color
  accentHex: string        // Hex for CSS variables
  logoUrl?: string
  emoji: string
  features: {
    title: string
    description: string
    icon: string // lucide icon name
  }[]
  bundles: {
    id: string
    name: string
    originalPrice: number
    eventPrice: number
    isDiscounted: boolean
    features: string[]
    isPrimary: boolean
  }[]
  workshopDetails: Record<string, {
    name: string
    tagline: string
    originalPrice: number
    eventPrice: number
    isDiscounted: boolean
    duration: string
    startDate: string
    schedule: string
    maxSeats: number
    seatsLeft: number
    highlights: string[]
    curriculum: { week: string; title: string; topics: string[] }[]
    outcomes: string[]
  }>
}

export const COHORTS: Record<string, CohortConfig> = {
  opensource: {
    slug: "opensource",
    name: "Open Source",
    tagline: "Production-ready workshops to help you contribute to the world's most impactful software.",
    heroTitle: "Master",
    heroHighlight: "Open Source.",
    description: "Level up your open source journey with Revamp. GSoC prep, first contributions, and advanced open source skills.",
    accentColor: "217 91% 60%",
    accentHex: "#3b82f6",
    emoji: "🔓",
    logoUrl: "https://ik.imagekit.io/cotszrkgk/Screenshot_2025-06-25_at_9.10.56_PM-removebg-preview.png?updatedAt=1756648034230",
    features: [
      { title: "Secure Infrastructure", description: "Enterprise-grade security for 100k users. Payments powered by Razorpay.", icon: "shield" },
      { title: "Referral Network", description: "Boost your impact. Join our referral program and lead the open source movement.", icon: "users" },
      { title: "Proven Curriculum", description: "Battle-tested workshops designed for real-world contributions and GSoC success.", icon: "award" },
    ],
    bundles: [
      {
        id: "gsoc-intensive",
        name: "GSOC INTENSIVE",
        originalPrice: 1999,
        eventPrice: 999,
        isDiscounted: true,
        features: ["Deep dive into GSoC proposals", "Organization selection strategy", "1-on-1 proposal review", "Project contribution guide"],
        isPrimary: true,
      },
      {
        id: "opensource-starter",
        name: "OPENSOURCE STARTER",
        originalPrice: 1499,
        eventPrice: 699,
        isDiscounted: true,
        features: ["Git & GitHub fundamentals", "First contribution walkthrough", "Finding beginner-friendly issues", "Discord community access"],
        isPrimary: false,
      },
      {
        id: "opensource-specific",
        name: "OPENSOURCE SPECIFIC",
        originalPrice: 1500,
        eventPrice: 1500,
        isDiscounted: false,
        features: ["Custom organization training", "Specific toolkit mastery", "Advanced debugging sessions", "Maintainer communication tips"],
        isPrimary: false,
      },
    ],
    workshopDetails: {
      "gsoc-intensive": {
        name: "GSOC INTENSIVE",
        tagline: "Your complete roadmap to getting selected in Google Summer of Code",
        originalPrice: 1999,
        eventPrice: 999,
        isDiscounted: true,
        duration: "4 Weeks",
        startDate: "March 1, 2026",
        schedule: "Weekends — Sat & Sun, 7 PM - 9 PM IST",
        maxSeats: 50,
        seatsLeft: 18,
        highlights: [
          "Live mentoring from past GSoC contributors",
          "End-to-end proposal writing workshop",
          "Real org codebase walkthrough",
          "Mock proposal review sessions",
        ],
        curriculum: [
          { week: "Week 1", title: "Understanding GSoC", topics: ["How GSoC works — timeline, eligibility, stipends", "How orgs select students — what they actually look for", "Exploring past selected proposals", "Setting up your development environment"] },
          { week: "Week 2", title: "Finding Your Organization", topics: ["Navigating the GSoC org list strategically", "Evaluating org activity, mentors, and project ideas", "Making your first meaningful contribution", "Engaging with the community (IRC, Slack, mailing lists)"] },
          { week: "Week 3", title: "Proposal Masterclass", topics: ["Anatomy of a winning proposal", "Writing a clear project plan & timeline", "Demonstrating technical competence", "1-on-1 proposal review with mentors"] },
          { week: "Week 4", title: "Final Push & Submission", topics: ["Polishing and iterating on your proposal", "Getting feedback from org mentors before deadline", "Submission checklist and common mistakes", "Post-submission: what to expect next"] },
        ],
        outcomes: [
          "A submission-ready GSoC proposal",
          "Contributions to a real open source organization",
          "Deep understanding of open source workflows",
          "Network with past GSoC students and mentors",
        ],
      },
      "opensource-starter": {
        name: "OPENSOURCE STARTER",
        tagline: "Go from zero to your first open source contribution in 2 weeks",
        originalPrice: 1499,
        eventPrice: 699,
        isDiscounted: true,
        duration: "2 Weeks",
        startDate: "March 1, 2026",
        schedule: "Weekends — Sat & Sun, 5 PM - 7 PM IST",
        maxSeats: 80,
        seatsLeft: 34,
        highlights: [
          "Beginner-friendly — no prior experience needed",
          "Hands-on Git & GitHub workflow training",
          "Make your first real PR to a popular project",
          "Discord community for ongoing support",
        ],
        curriculum: [
          { week: "Week 1", title: "Git, GitHub & Open Source 101", topics: ["Installing & configuring Git from scratch", "Understanding repositories, branches, commits", "Forking, cloning, and creating pull requests", "How open source projects are structured"] },
          { week: "Week 2", title: "Your First Contribution", topics: ["Finding beginner-friendly issues (good-first-issue)", "Reading codebases and understanding project context", "Writing clean commits and descriptive PRs", "Responding to code review feedback"] },
        ],
        outcomes: [
          "Solid Git & GitHub skills",
          "At least one merged PR on a real project",
          "Understanding of open source etiquette",
          "Access to an active developer community",
        ],
      },
      "opensource-specific": {
        name: "OPENSOURCE SPECIFIC",
        tagline: "Deep-dive into a specific organization and become a core contributor",
        originalPrice: 1500,
        eventPrice: 1500,
        isDiscounted: false,
        duration: "3 Weeks",
        startDate: "March 8, 2026",
        schedule: "Flexible — Self-paced with weekly live Q&A",
        maxSeats: 30,
        seatsLeft: 12,
        highlights: [
          "Choose your target organization",
          "Personalized mentoring for your tech stack",
          "Advanced debugging & code review techniques",
          "Direct communication strategies with maintainers",
        ],
        curriculum: [
          { week: "Week 1", title: "Deep Dive into Your Org", topics: ["Understanding the org's codebase architecture", "Setting up the development environment", "Reading docs, tests, and issue trackers", "Identifying impactful areas to contribute"] },
          { week: "Week 2", title: "Advanced Contribution Skills", topics: ["Writing production-quality code patches", "Navigating CI/CD pipelines and test suites", "Advanced Git: rebasing, cherry-picking, bisecting", "Communicating effectively with maintainers"] },
          { week: "Week 3", title: "Becoming a Regular Contributor", topics: ["Taking ownership of issues and features", "Reviewing other contributors' PRs", "Building your reputation in the community", "Pathways to becoming a maintainer"] },
        ],
        outcomes: [
          "Multiple contributions to your chosen organization",
          "Mastery of the org's specific toolkit and workflow",
          "Direct relationship with org maintainers",
          "Portfolio-worthy open source track record",
        ],
      },
    },
  },

  webdev: {
    slug: "webdev",
    name: "Web Development",
    tagline: "Build production-ready web apps from scratch. HTML, CSS, JS, React — the full stack.",
    heroTitle: "Build The",
    heroHighlight: "Modern Web.",
    description: "Master web development from fundamentals to full-stack. Build real projects, deploy live sites, and launch your dev career.",
    accentColor: "263 70% 58%",
    accentHex: "#8b5cf6",
    emoji: "🌐",
    features: [
      { title: "Project-Based Learning", description: "Build 5+ real projects — a portfolio, a dashboard, an API integration — not toy apps.", icon: "code" },
      { title: "Live Portfolio", description: "Deploy your personal site to GitHub Pages. Walk out with a live URL and real projects.", icon: "globe" },
      { title: "Industry Tools", description: "Learn the tools real devs use: VS Code, Git, Chrome DevTools, npm, and Vercel.", icon: "wrench" },
    ],
    bundles: [
      {
        id: "fullstack-foundations",
        name: "FULLSTACK FOUNDATIONS",
        originalPrice: 1999,
        eventPrice: 999,
        isDiscounted: true,
        features: ["HTML/CSS/JS deep dive", "React fundamentals", "API integration projects", "Live portfolio deployment"],
        isPrimary: true,
      },
      {
        id: "frontend-mastery",
        name: "FRONTEND MASTERY",
        originalPrice: 1499,
        eventPrice: 699,
        isDiscounted: true,
        features: ["Advanced CSS & animations", "Responsive design patterns", "Component architecture", "Performance optimization"],
        isPrimary: false,
      },
      {
        id: "portfolio-bootcamp",
        name: "PORTFOLIO BOOTCAMP",
        originalPrice: 999,
        eventPrice: 499,
        isDiscounted: true,
        features: ["Personal site from scratch", "GitHub Pages deployment", "SEO & accessibility basics", "Portfolio review session"],
        isPrimary: false,
      },
    ],
    workshopDetails: {
      "fullstack-foundations": {
        name: "FULLSTACK FOUNDATIONS",
        tagline: "Go from zero to building real web applications in 4 weeks",
        originalPrice: 1999,
        eventPrice: 999,
        isDiscounted: true,
        duration: "4 Weeks",
        startDate: "April 5, 2026",
        schedule: "Weekends — Sat & Sun, 6 PM - 8 PM IST",
        maxSeats: 60,
        seatsLeft: 25,
        highlights: ["Build 4 real projects from scratch", "Master HTML, CSS, JavaScript, and React", "Deploy projects live on the internet", "Code review sessions with mentors"],
        curriculum: [
          { week: "Week 1", title: "Web Fundamentals", topics: ["HTML5 semantic structure", "CSS3 layouts: Flexbox & Grid", "Responsive design principles", "Building your first webpage"] },
          { week: "Week 2", title: "JavaScript Deep Dive", topics: ["Variables, functions, and DOM manipulation", "Event handling and form validation", "Fetch API and working with JSON", "Building an interactive web app"] },
          { week: "Week 3", title: "React Essentials", topics: ["Components, props, and state", "Hooks: useState, useEffect", "Routing with React Router", "Building a dashboard UI"] },
          { week: "Week 4", title: "Full Stack & Deploy", topics: ["API integration patterns", "Authentication basics", "Deploying to Vercel/Netlify", "Portfolio showcase & review"] },
        ],
        outcomes: ["4 deployed web projects", "Strong HTML/CSS/JS + React skills", "A live personal portfolio", "Job-ready frontend foundation"],
      },
      "frontend-mastery": {
        name: "FRONTEND MASTERY",
        tagline: "Level up your frontend skills with advanced CSS, animations, and architecture",
        originalPrice: 1499,
        eventPrice: 699,
        isDiscounted: true,
        duration: "2 Weeks",
        startDate: "April 5, 2026",
        schedule: "Weekends — Sat & Sun, 4 PM - 6 PM IST",
        maxSeats: 40,
        seatsLeft: 20,
        highlights: ["Master advanced CSS techniques", "Build smooth animations & transitions", "Learn component design patterns", "Performance auditing workshop"],
        curriculum: [
          { week: "Week 1", title: "Advanced CSS & Design", topics: ["CSS custom properties & theming", "Advanced Grid & Flexbox layouts", "Keyframe animations & transitions", "Building a design system"] },
          { week: "Week 2", title: "Architecture & Performance", topics: ["Component patterns & best practices", "Lazy loading & code splitting", "Lighthouse performance audits", "Accessibility deep dive"] },
        ],
        outcomes: ["Advanced CSS skills", "Portfolio-quality animated components", "Understanding of web performance", "Accessibility-first development mindset"],
      },
      "portfolio-bootcamp": {
        name: "PORTFOLIO BOOTCAMP",
        tagline: "Build and deploy a stunning personal portfolio in one intensive weekend",
        originalPrice: 999,
        eventPrice: 499,
        isDiscounted: true,
        duration: "1 Week",
        startDate: "April 12, 2026",
        schedule: "Saturday, 10 AM - 6 PM IST (Full Day)",
        maxSeats: 80,
        seatsLeft: 45,
        highlights: ["One-day intensive workshop", "Template to customize", "Live deployment on GitHub Pages", "Peer review feedback session"],
        curriculum: [
          { week: "Day 1", title: "Build & Deploy", topics: ["Designing your portfolio layout", "Coding section by section", "Adding projects & GitHub links", "Custom domain setup & deployment"] },
        ],
        outcomes: ["A live portfolio website", "GitHub Pages deployment skills", "Professional online presence", "SEO-optimized personal site"],
      },
    },
  },

  aiml: {
    slug: "aiml",
    name: "AI & ML",
    tagline: "Master Vibe Coding, LangChain, n8n automation, and build real AI-powered apps.",
    heroTitle: "Master",
    heroHighlight: "Agentic AI.",
    description: "Build AI agents, automate workflows, and learn LangChain in this hands-on cohort. Ship 10+ AI projects.",
    accentColor: "160 84% 39%",
    accentHex: "#10b981",
    emoji: "🤖",
    features: [
      { title: "10+ AI Projects", description: "Build chatbots, agents, automations, and AI tools you can actually use and showcase.", icon: "brain" },
      { title: "No-Code + Code", description: "Learn both n8n automation and LangChain/Python — pick your path or master both.", icon: "workflow" },
      { title: "Live Weekend Sessions", description: "Live coding sessions every weekend with Q&A, code reviews, and project showcases.", icon: "video" },
    ],
    bundles: [
      {
        id: "agentic-ai-builder",
        name: "AGENTIC AI BUILDER",
        originalPrice: 2499,
        eventPrice: 1299,
        isDiscounted: true,
        features: ["LangChain & LangGraph deep dive", "Build 5 AI agents", "RAG & vector databases", "Final capstone project"],
        isPrimary: true,
      },
      {
        id: "vibe-coding-starter",
        name: "VIBE CODING STARTER",
        originalPrice: 1499,
        eventPrice: 699,
        isDiscounted: true,
        features: ["AI-assisted coding basics", "Prompt engineering workshop", "Build with ChatGPT API", "Ship your first AI app"],
        isPrimary: false,
      },
      {
        id: "n8n-automation",
        name: "N8N AUTOMATION",
        originalPrice: 1299,
        eventPrice: 599,
        isDiscounted: true,
        features: ["No-code workflow builder", "API integrations mastery", "Business automation flows", "Custom webhook triggers"],
        isPrimary: false,
      },
    ],
    workshopDetails: {
      "agentic-ai-builder": {
        name: "AGENTIC AI BUILDER",
        tagline: "Build production-ready AI agents with LangChain, RAG, and modern AI tools",
        originalPrice: 2499,
        eventPrice: 1299,
        isDiscounted: true,
        duration: "4 Weeks",
        startDate: "April 5, 2026",
        schedule: "Weekends — Sat & Sun, 7 PM - 9 PM IST",
        maxSeats: 40,
        seatsLeft: 15,
        highlights: ["Hands-on LangChain & LangGraph", "Build 5 real AI agents", "RAG with vector databases", "Production deployment patterns"],
        curriculum: [
          { week: "Week 1", title: "AI Foundations", topics: ["LLM APIs: OpenAI, Groq, Anthropic", "Prompt engineering fundamentals", "LangChain basics: chains & prompts", "Building your first chatbot"] },
          { week: "Week 2", title: "Agents & Tools", topics: ["LangChain agents architecture", "Custom tool creation", "Web scraping agent", "Multi-tool orchestration"] },
          { week: "Week 3", title: "RAG & Knowledge", topics: ["Vector databases: Pinecone, Chroma", "Document loading & chunking", "Building a RAG pipeline", "Conversational retrieval agent"] },
          { week: "Week 4", title: "Production & Capstone", topics: ["LangGraph state machines", "Error handling & fallbacks", "Deployment with FastAPI", "Capstone project showcase"] },
        ],
        outcomes: ["5 deployed AI agents", "LangChain & LangGraph mastery", "RAG implementation skills", "Production-ready AI portfolio"],
      },
      "vibe-coding-starter": {
        name: "VIBE CODING STARTER",
        tagline: "Learn to build with AI — prompt engineering, ChatGPT API, and AI-assisted coding",
        originalPrice: 1499,
        eventPrice: 699,
        isDiscounted: true,
        duration: "2 Weeks",
        startDate: "April 5, 2026",
        schedule: "Weekends — Sat & Sun, 5 PM - 7 PM IST",
        maxSeats: 60,
        seatsLeft: 30,
        highlights: ["AI-powered development", "Prompt engineering deep dive", "Build with ChatGPT API", "Ship a real AI app"],
        curriculum: [
          { week: "Week 1", title: "AI-Assisted Development", topics: ["Setting up AI coding tools", "Prompt engineering for code", "ChatGPT API basics", "Building with AI autocomplete"] },
          { week: "Week 2", title: "Build & Ship", topics: ["API integration patterns", "Building a chat interface", "Adding AI to existing apps", "Deploying your AI app"] },
        ],
        outcomes: ["AI-assisted coding skills", "Prompt engineering mastery", "A deployed AI-powered app", "Understanding of LLM capabilities"],
      },
      "n8n-automation": {
        name: "N8N AUTOMATION",
        tagline: "Automate everything — build workflows, integrate APIs, and scale operations",
        originalPrice: 1299,
        eventPrice: 599,
        isDiscounted: true,
        duration: "2 Weeks",
        startDate: "April 12, 2026",
        schedule: "Weekends — Sat, 4 PM - 7 PM IST",
        maxSeats: 50,
        seatsLeft: 22,
        highlights: ["No-code workflow builder", "20+ integration templates", "Custom webhook triggers", "Real business automations"],
        curriculum: [
          { week: "Week 1", title: "n8n Fundamentals", topics: ["Setting up n8n (local & cloud)", "Building your first workflow", "Working with APIs & webhooks", "Data transformation nodes"] },
          { week: "Week 2", title: "Advanced Automations", topics: ["Multi-step business flows", "Error handling & retries", "Scheduling & triggers", "Building a complete automation suite"] },
        ],
        outcomes: ["10+ automation workflows", "API integration mastery", "Business process automation", "n8n deployment skills"],
      },
    },
  },

  launchpad: {
    slug: "launchpad",
    name: "College Starter",
    tagline: "You just got into B.Tech. You have 4 months before Day 1. This is how you use them.",
    heroTitle: "Start College",
    heroHighlight: "Ahead.",
    description: "The 4-week pre-college program that gives B.Tech freshers a headstart — real skills, real friends, real projects before Day 1.",
    accentColor: "38 92% 50%",
    accentHex: "#f59e0b",
    emoji: "🚀",
    features: [
      { title: "Find Your People", description: "Speed-friending, team builds, and a cohort network that lasts all 4 years of college. Go to hackathons together.", icon: "users" },
      { title: "Technical Headstart", description: "Terminal, Git, Python, HTML/CSS — the 20% of skills that unlock 80% of college CS. Arrive knowing more than most seniors.", icon: "code" },
      { title: "Ship Something Real", description: "A 48-hour mini hackathon in Week 3. Build with your team, demo on stage, and deploy your first real project.", icon: "rocket" },
    ],
    bundles: [
      {
        id: "college-starter",
        name: "COLLEGE STARTER",
        originalPrice: 1999,
        eventPrice: 999,
        isDiscounted: true,
        features: ["4-week live cohort program", "Terminal, Git, Python & Web basics", "Team hackathon + Demo Day", "Lifetime alumni network access"],
        isPrimary: true,
      },
      {
        id: "tech-foundations",
        name: "TECH FOUNDATIONS",
        originalPrice: 1499,
        eventPrice: 699,
        isDiscounted: true,
        features: ["Terminal & Linux mastery", "Git & GitHub portfolio", "Python scripting crash course", "Async self-paced modules"],
        isPrimary: false,
      },
      {
        id: "hackathon-prep",
        name: "HACKATHON PREP",
        originalPrice: 999,
        eventPrice: 499,
        isDiscounted: true,
        features: ["Team formation & ideation", "48-hour mini hackathon", "Demo Day presentation coaching", "Project deployment support"],
        isPrimary: false,
      },
    ],
    workshopDetails: {
      "college-starter": {
        name: "COLLEGE STARTER",
        tagline: "4 weeks. Real skills. Real friends. Walk into college like you belong.",
        originalPrice: 1999,
        eventPrice: 999,
        isDiscounted: true,
        duration: "4 Weeks",
        startDate: "May 10, 2026",
        schedule: "2-3 sessions/week — 7 PM - 9 PM IST",
        maxSeats: 50,
        seatsLeft: 22,
        highlights: [
          "Speed-friending + cohort bonding from Day 1",
          "Terminal, Git, Python & Web — hands-on, not theory",
          "48-hour team hackathon in Week 3",
          "Demo Day in front of alumni & founders",
        ],
        curriculum: [
          { week: "Week 1", title: "Orientation & Foundations", topics: ["Speed-friending: find your people in structured breakout rooms", "Terminal & Linux: ls, cd, mkdir, chmod — feel at home in the command line", "How the internet works: DNS, HTTP, APIs — demystified with live demos", "Deliverable: async intro video + team interest profile"] },
          { week: "Week 2", title: "Builder Skills Sprint", topics: ["Git & GitHub: clone, commit, push, PR — open your first pull request", "Python fundamentals: variables, loops, functions, file handling", "HTML/CSS crash course: build a personal portfolio page", "Deliverable: GitHub repo with your first project + live portfolio on GitHub Pages"] },
          { week: "Week 3", title: "Team Hackathon", topics: ["Team formation from Week 1 interest profiles (3-4 per team)", "48-hour async hackathon: 'Build something that solves a student problem'", "Midpoint check-in session: unblock teams, scope advice", "Deliverable: working demo + 3-minute Loom walkthrough"] },
          { week: "Week 4", title: "Demo Day & Network", topics: ["Mini Demo Day: 5 min per team, full cohort + invited guests", "Crowd favourite voting + prizes", "College-wise breakout rooms: meet students going to YOUR college", "Deliverable: project on GitHub with README, demo video on LinkedIn"] },
        ],
        outcomes: [
          "A GitHub profile with real projects",
          "A team of peers for hackathons & startups",
          "Terminal, Git, Python & web basics mastered",
          "Confidence of having shipped before Day 1",
        ],
      },
      "tech-foundations": {
        name: "TECH FOUNDATIONS",
        tagline: "Learn the technical skills that separate 'just enrolled' from 'already building'",
        originalPrice: 1499,
        eventPrice: 699,
        isDiscounted: true,
        duration: "2 Weeks",
        startDate: "May 10, 2026",
        schedule: "Self-paced + 2 live sessions/week",
        maxSeats: 80,
        seatsLeft: 40,
        highlights: [
          "Base path (complete beginner) + fast track (some experience)",
          "Each topic ends with a hands-on deliverable you can't fake",
          "Peer support in Discord channels",
          "Challenge cards: 3 difficulty levels per module",
        ],
        curriculum: [
          { week: "Week 1", title: "Terminal, Linux & Networking", topics: ["Navigating directories, file operations, grep, chmod", "Bash scripting: automate file renaming, log parsing", "How the internet works: DNS → IP → TCP → HTTP → HTML", "Deliverable: use curl to hit a real API and print results in terminal"] },
          { week: "Week 2", title: "Git, Python & Web Basics", topics: ["Git: init, clone, add, commit, push, branching, pull requests", "Python: variables, loops, functions, requests library, file I/O", "HTML/CSS: build and deploy a portfolio to GitHub Pages", "Deliverable: 3+ commit GitHub repo with proper README"] },
        ],
        outcomes: [
          "Command line confidence",
          "Git & GitHub portfolio",
          "Python scripting ability",
          "A deployed personal website",
        ],
      },
      "hackathon-prep": {
        name: "HACKATHON PREP",
        tagline: "Form a team, build a project, demo on stage — your first hackathon experience",
        originalPrice: 999,
        eventPrice: 499,
        isDiscounted: true,
        duration: "2 Weeks",
        startDate: "May 24, 2026",
        schedule: "1 live session/week + 48-hour hackathon",
        maxSeats: 60,
        seatsLeft: 30,
        highlights: [
          "Team formation based on interests & skills",
          "Ideation workshop: scope for 48 hours, not 48 days",
          "48-hour async hackathon with mentor check-ins",
          "Demo Day presentation + crowd voting",
        ],
        curriculum: [
          { week: "Week 1", title: "Ideation & Team Build", topics: ["Finding problems worth solving as a student", "Scoping an MVP for 48 hours", "Team roles: who codes, who designs, who presents", "Hackathon toolkit: GitHub, Vercel, Figma, Loom"] },
          { week: "Week 2", title: "Build & Demo", topics: ["48-hour hackathon: async building with midpoint check-in", "README writing & project documentation", "3-minute demo presentation coaching", "Demo Day + crowd favourite voting"] },
        ],
        outcomes: [
          "A shipped project with a demo video",
          "Hackathon experience before your first college hackathon",
          "Presentation & pitching skills",
          "A team you can go to real hackathons with",
        ],
      },
    },
  },

  cp: {
    slug: "cp",
    name: "Competitive Programming",
    tagline: "Crack DSA, ace coding interviews, and dominate competitive programming contests.",
    heroTitle: "Dominate",
    heroHighlight: "Competitions.",
    description: "Master algorithms, data structures, and competitive programming. Prepare for coding contests and tech interviews.",
    accentColor: "0 84% 60%",
    accentHex: "#ef4444",
    emoji: "⚔️",
    features: [
      { title: "Contest Ready", description: "Practice with real contest problems from Codeforces, LeetCode, and CodeChef.", icon: "trophy" },
      { title: "DSA Mastery", description: "Master arrays, trees, graphs, DP, and more with structured problem sets.", icon: "binary" },
      { title: "Interview Prep", description: "FAANG-style mock interviews and coding challenges to ace your placements.", icon: "briefcase" },
    ],
    bundles: [
      {
        id: "algorithm-mastery",
        name: "ALGORITHM MASTERY",
        originalPrice: 1999,
        eventPrice: 999,
        isDiscounted: true,
        features: ["50+ curated problems", "Graph & tree algorithms", "Dynamic programming deep dive", "Live contest participation"],
        isPrimary: true,
      },
      {
        id: "contest-prep",
        name: "CONTEST PREP",
        originalPrice: 1499,
        eventPrice: 699,
        isDiscounted: true,
        features: ["Speed coding techniques", "Problem pattern recognition", "Mock contests every week", "Rating improvement strategy"],
        isPrimary: false,
      },
      {
        id: "dsa-bootcamp",
        name: "DSA BOOTCAMP",
        originalPrice: 1299,
        eventPrice: 599,
        isDiscounted: true,
        features: ["Arrays, strings, & sorting", "Linked lists & stacks", "Trees & heaps basics", "Introduction to graphs"],
        isPrimary: false,
      },
    ],
    workshopDetails: {
      "algorithm-mastery": {
        name: "ALGORITHM MASTERY",
        tagline: "Master advanced algorithms and data structures for contests and interviews",
        originalPrice: 1999,
        eventPrice: 999,
        isDiscounted: true,
        duration: "4 Weeks",
        startDate: "April 5, 2026",
        schedule: "Weekends — Sat & Sun, 8 PM - 10 PM IST",
        maxSeats: 50,
        seatsLeft: 20,
        highlights: ["50+ hand-picked problems", "Advanced algorithms explained simply", "Weekly live contests", "Personalized problem recommendations"],
        curriculum: [
          { week: "Week 1", title: "Foundations & Sorting", topics: ["Time & space complexity mastery", "Binary search variations", "Two-pointer & sliding window", "Sorting algorithms deep dive"] },
          { week: "Week 2", title: "Trees & Graphs", topics: ["Binary trees & BSTs", "BFS & DFS traversals", "Shortest path algorithms", "Graph coloring & topological sort"] },
          { week: "Week 3", title: "Dynamic Programming", topics: ["DP mindset & state transition", "1D & 2D DP problems", "DP on trees", "Bitmask DP & optimizations"] },
          { week: "Week 4", title: "Advanced Techniques", topics: ["Segment trees & BIT", "String algorithms (KMP, Z-function)", "Number theory for CP", "Mock contest + strategy session"] },
        ],
        outcomes: ["50+ problems solved", "Advanced algorithm skills", "Contest-ready techniques", "Interview preparation edge"],
      },
      "contest-prep": {
        name: "CONTEST PREP",
        tagline: "Level up your Codeforces/LeetCode rating and dominate online contests",
        originalPrice: 1499,
        eventPrice: 699,
        isDiscounted: true,
        duration: "3 Weeks",
        startDate: "April 5, 2026",
        schedule: "Weekends — Sat, 7 PM - 10 PM IST",
        maxSeats: 40,
        seatsLeft: 15,
        highlights: ["Pattern-based problem solving", "Speed coding drills", "Mock contests with ranking", "Rating growth strategy"],
        curriculum: [
          { week: "Week 1", title: "Pattern Recognition", topics: ["Identifying problem types fast", "Common contest patterns", "Implementation speed techniques", "Mock contest #1"] },
          { week: "Week 2", title: "Advanced Patterns", topics: ["Greedy + DP hybrid problems", "Graph contest problems", "Math & number theory for contests", "Mock contest #2"] },
          { week: "Week 3", title: "Contest Strategy", topics: ["Time management during contests", "Penalty minimization", "Debug strategies under pressure", "Final mock contest + review"] },
        ],
        outcomes: ["Improved contest rating", "Faster problem solving", "Pattern recognition skills", "Contest strategy mastery"],
      },
      "dsa-bootcamp": {
        name: "DSA BOOTCAMP",
        tagline: "Build a solid foundation in data structures and algorithms from scratch",
        originalPrice: 1299,
        eventPrice: 599,
        isDiscounted: true,
        duration: "2 Weeks",
        startDate: "April 12, 2026",
        schedule: "Weekends — Sat & Sun, 5 PM - 7 PM IST",
        maxSeats: 80,
        seatsLeft: 40,
        highlights: ["Zero to confident in DSA", "30+ practice problems", "Peer programming sessions", "Interview question patterns"],
        curriculum: [
          { week: "Week 1", title: "Linear Data Structures", topics: ["Arrays, strings, & operations", "Stacks & queues", "Linked lists", "Hash maps & sets"] },
          { week: "Week 2", title: "Non-Linear Structures", topics: ["Binary trees basics", "Heaps & priority queues", "Graph representation", "Intro to recursion & backtracking"] },
        ],
        outcomes: ["Solid DSA fundamentals", "30+ problems solved", "Interview readiness basics", "Confidence in coding challenges"],
      },
    },
  },

  cybersec: {
    slug: "cybersec",
    name: "Cyber Security",
    tagline: "Defend the grid. Ethical hacking, CTFs, and real-world security — the hacker mindset, the right way.",
    heroTitle: "Defend The",
    heroHighlight: "Grid.",
    description: "Learn ethical hacking, network defense, and web app security. Compete in CTFs, find vulnerabilities, and build a security portfolio.",
    accentColor: "192 91% 42%",
    accentHex: "#06b6d4",
    emoji: "🛡️",
    features: [
      { title: "Hands-On Hacking", description: "Practice on real vulnerable machines. Kali Linux, Burp Suite, Metasploit — the real tools, learned properly.", icon: "shield" },
      { title: "CTF Competitions", description: "Compete in Capture The Flag challenges every week. Web exploitation, cryptography, forensics, and reverse engineering.", icon: "trophy" },
      { title: "Career-Ready Skills", description: "SOC analyst, penetration tester, or bug bounty hunter — build the portfolio and certs that actually get you hired.", icon: "briefcase" },
    ],
    bundles: [
      {
        id: "ethical-hacking",
        name: "ETHICAL HACKING",
        originalPrice: 1999,
        eventPrice: 999,
        isDiscounted: true,
        features: ["Kali Linux & Metasploit deep dive", "Web app penetration testing", "Network reconnaissance & scanning", "Real-world vulnerability assessment"],
        isPrimary: true,
      },
      {
        id: "network-defense",
        name: "NETWORK DEFENSE",
        originalPrice: 1499,
        eventPrice: 699,
        isDiscounted: true,
        features: ["Firewalls & IDS/IPS setup", "Log analysis & SIEM basics", "Incident response playbook", "Security hardening techniques"],
        isPrimary: false,
      },
      {
        id: "ctf-bootcamp",
        name: "CTF BOOTCAMP",
        originalPrice: 999,
        eventPrice: 499,
        isDiscounted: true,
        features: ["Web exploitation challenges", "Cryptography & steganography", "Binary exploitation basics", "Weekly CTF competitions"],
        isPrimary: false,
      },
    ],
    workshopDetails: {
      "hackfest": {
        name: "HACKFEST",
        tagline: "The Ultimate 30-Day Cybersecurity Bootcamp. Go from beginner to discovering real vulnerabilities.",
        originalPrice: 2499,
        eventPrice: 999,
        isDiscounted: true,
        duration: "30 Days",
        startDate: "July 15, 2025",
        schedule: "Weekends — Sat & Sun, 7 PM - 9 PM IST",
        maxSeats: 150,
        seatsLeft: 42,
        highlights: [
          "Hands-on hacking labs with real targets",
          "Kali Linux mastery from scratch",
          "Web app pentesting with Burp Suite",
          "Live Bug Bounty hunting sessions",
        ],
        curriculum: [
          { week: "Week 1", title: "The Hacker Foundation", topics: ["Linux for Hackers: Bash scripting & file systems", "Networking 101: TCP/IP, DNS, HTTP/S", "Setting up your impenetrable lab environment", "Intro to OSINT (Open Source Intelligence)"] },
          { week: "Week 2", title: "Web Application Pentesting", topics: ["OWASP Top 10 Deep Dive", "Interception & manipulation with Burp Suite", "SQL Injection, XSS, & Command Injection", "Authentication bypass & logic flaws"] },
          { week: "Week 3", title: "Network & Systems Exploitation", topics: ["Active recon with Nmap & Rustscan", "Exploitation frameworks: Metasploit fundamentals", "Privilege Escalation on Linux/Windows", "Password cracking & hash collision"] },
          { week: "Week 4", title: "Bug Bounty & Career Paths", topics: ["How to find standard vs non-standard bugs", "Writing professional vulnerability reports", "Reporting to HackerOne & Bugcrowd", "Career path: SOC, Pentesting, or Freelancing"] },
        ],
        outcomes: [
          "Find your first valid vulnerability",
          "Command line and Kali Linux fluency",
          "Working knowledge of Burp Suite Professional",
          "A clear roadmap to getting hired in security",
        ],
      },
      "network-defense": {
        name: "NETWORK DEFENSE",
        tagline: "Learn to protect what others try to break — defensive security from day one",
        originalPrice: 1499,
        eventPrice: 699,
        isDiscounted: true,
        duration: "2 Weeks",
        startDate: "April 5, 2026",
        schedule: "Weekends — Sat & Sun, 5 PM - 7 PM IST",
        maxSeats: 50,
        seatsLeft: 25,
        highlights: [
          "Build & configure firewalls",
          "Log analysis & threat detection",
          "Incident response simulation",
          "Security hardening checklist",
        ],
        curriculum: [
          { week: "Week 1", title: "Defense Fundamentals", topics: ["Network security architecture", "Firewall configuration & management", "Intrusion detection systems", "Log analysis with grep & regex"] },
          { week: "Week 2", title: "Incident Response", topics: ["SIEM basics with open-source tools", "Threat hunting methodology", "Incident response playbook creation", "Security hardening for Linux & Windows"] },
        ],
        outcomes: [
          "Network defense architecture skills",
          "IDS/IPS configuration ability",
          "Incident response readiness",
          "Security hardening expertise",
        ],
      },
      "ctf-bootcamp": {
        name: "CTF BOOTCAMP",
        tagline: "Capture flags, solve puzzles, break codes — competitive security at its finest",
        originalPrice: 999,
        eventPrice: 499,
        isDiscounted: true,
        duration: "2 Weeks",
        startDate: "April 12, 2026",
        schedule: "Weekends — Sat, 6 PM - 9 PM IST",
        maxSeats: 60,
        seatsLeft: 30,
        highlights: [
          "CTF challenge walkthroughs",
          "Web exploitation techniques",
          "Cryptography fundamentals",
          "Weekly live CTF competitions",
        ],
        curriculum: [
          { week: "Week 1", title: "CTF Foundations", topics: ["CTF formats & platforms (picoCTF, HackTheBox)", "Web exploitation basics", "Cryptography: classical & modern", "Steganography & forensics intro"] },
          { week: "Week 2", title: "Advanced CTF", topics: ["Binary exploitation basics", "Reverse engineering with Ghidra", "Live CTF competition (team-based)", "Writeup creation & knowledge sharing"] },
        ],
        outcomes: [
          "CTF competition confidence",
          "Web exploitation skills",
          "Cryptography & forensics basics",
          "HackTheBox / picoCTF profiles",
        ],
      },
    },
  },
}

// Map subdomains to cohort slugs
export const SUBDOMAIN_MAP: Record<string, string> = {
  opensource: "opensource",
  webdev: "webdev",
  aiml: "aiml",
  aiconic: "aiml",     // aiconic.letsrevamp.in also maps to aiml
  launchpad: "launchpad",
  cp: "cp",
  cybersec: "cybersec",
  security: "cybersec", // security.letsrevamp.in also maps to cybersec
}

export const DEFAULT_COHORT = "opensource"

export function getCohortFromHostname(hostname: string): string {
  // Extract subdomain: "webdev.letsrevamp.in" => "webdev"
  const parts = hostname.split(".")
  if (parts.length >= 3) {
    const subdomain = parts[0].toLowerCase()
    return SUBDOMAIN_MAP[subdomain] || DEFAULT_COHORT
  }
  return DEFAULT_COHORT
}

export function getCohortConfig(slug: string): CohortConfig {
  return COHORTS[slug] || COHORTS[DEFAULT_COHORT]
}

export function getAllCohortSlugs(): string[] {
  return Object.keys(COHORTS)
}
