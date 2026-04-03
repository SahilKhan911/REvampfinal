const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const cohortSlug = "aiml"

  // Create or Update Cohort
  const cohort = await prisma.cohort.upsert({
    where: { slug: cohortSlug },
    update: {
      name: "AI & ML",
      tagline: "Agentic AI & Vibe Coding with REvampCurve | 1 Month Weekend Program | Build Real-World AI Products with LangChain, LangGraph, n8n & Kaggle Integration",
      heroTitle: "Agentic AI &",
      heroHighlight: "Vibe Coding",
      description: "Join our one-month cohort to master Vibe Coding, LangChain, n8n automation, and Agentic AI. Live weekend sessions with lifetime access.",
      features: [
        { title: "Vibe Coding Weekends", description: "Live sessions every Saturday & Sunday. Code together, build AI products in real-time, and get instant feedback from instructors.", icon: "weekend" },
        { title: "10+ AI Projects", description: "Build AI Interviewer, Personal Learning Assistant, Code Reviewer, Email Auto-Responder, Lead Bot, SEO Optimizer, Trend Detector & more.", icon: "tactic" },
        { title: "Full Tech Stack", description: "Master React, Next.js, Node.js, FastAPI, Supabase, Appwrite, PocketBase, LangChain, LangGraph, Vector DB, and n8n automation.", icon: "code" },
        { title: "Agentic AI Mastery", description: "Go beyond basic AI. Build goal-driven agents that plan, use tools, and solve complex tasks autonomously with LangGraph architecture.", icon: "robot" }
      ]
    },
    create: {
      slug: cohortSlug,
      name: "AI & ML",
      tagline: "Agentic AI & Vibe Coding with REvampCurve | 1 Month Weekend Program | Build Real-World AI Products with LangChain, LangGraph, n8n & Kaggle Integration",
      heroTitle: "Agentic AI &",
      heroHighlight: "Vibe Coding",
      emoji: "🤖",
      accentHex: "#FF6B6B",
      description: "Join our one-month cohort to master Vibe Coding, LangChain, n8n automation, and Agentic AI. Live weekend sessions with lifetime access.",
      features: [
        { title: "Vibe Coding Weekends", description: "Live sessions every Saturday & Sunday. Code together, build AI products in real-time, and get instant feedback from instructors.", icon: "weekend" },
        { title: "10+ AI Projects", description: "Build AI Interviewer, Personal Learning Assistant, Code Reviewer, Email Auto-Responder, Lead Bot, SEO Optimizer, Trend Detector & more.", icon: "tactic" },
        { title: "Full Tech Stack", description: "Master React, Next.js, Node.js, FastAPI, Supabase, Appwrite, PocketBase, LangChain, LangGraph, Vector DB, and n8n automation.", icon: "code" },
        { title: "Agentic AI Mastery", description: "Go beyond basic AI. Build goal-driven agents that plan, use tools, and solve complex tasks autonomously with LangGraph architecture.", icon: "robot" }
      ]
    }
  })

  const curriculum = [
    { title: "Week 1: Development & GenAI Basics", details: "Master Vibe Coding workflow, Frontend-Backend integration with React/Next.js, Auth & database (Supabase/Appwrite). Build: AI Chat App with Authentication." },
    { title: "Week 2: LangChain & AI Systems", details: "Deep dive into LangChain, Vector embeddings, LangGraph workflows. Build: AI Personal Learning Assistant, AI Interviewer System, AI Code Reviewer, AI Resume & Job Matching System." },
    { title: "Week 3: Automation with n8n", details: "Master n8n workflow automation, webhooks & APIs, LLM-powered automation. Build: AI Email Auto-Responder, AI Lead Qualification Bot, AI Social Media Content Generator." },
    { title: "Week 4: Agentic AI & Capstone", details: "Agentic AI architecture, goal-driven agents, tool usage & planning. Build: AI SEO Optimizer Agent, AI Trend Detector Agent, AI Landing Page Analyzer (Capstone on Kaggle)." }
  ]

  // Upsert Basic Bundle
  await prisma.bundle.upsert({
    where: { slug: "aiml-basic" },
    update: {
      name: "Basic",
      tagline: "Essential AI Development Skills",
      originalPrice: 1000,
      eventPrice: 799,
      isDiscounted: true,
      features: ["Vibe Coding 101 - Master modern development workflow", "Gen AI in Web Apps - Build intelligent applications", "3 Industry-Accepted Projects for your portfolio", "React, Next.js, and FastAPI fundamentals", "Lifetime access to recordings and materials", "WhatsApp community group access"],
      curriculum: curriculum,
      isActive: true
    },
    create: {
      slug: "aiml-basic",
      cohortSlug: cohortSlug,
      name: "Basic",
      tagline: "Essential AI Development Skills",
      originalPrice: 1000,
      eventPrice: 799,
      isDiscounted: true,
      features: ["Vibe Coding 101 - Master modern development workflow", "Gen AI in Web Apps - Build intelligent applications", "3 Industry-Accepted Projects for your portfolio", "React, Next.js, and FastAPI fundamentals", "Lifetime access to recordings and materials", "WhatsApp community group access"],
      curriculum: curriculum,
      isActive: true,
      status: "PUBLISHED"
    }
  })

  // Upsert Premium Bundle
  await prisma.bundle.upsert({
    where: { slug: "aiml-premium" },
    update: {
      name: "Premium",
      tagline: "Full-Stack AI Mastery",
      originalPrice: 1500,
      eventPrice: 1199,
      isDiscounted: true,
      isPrimary: true,
      features: ["Build 5 Full-Stack AI Projects from scratch", "LangChain mastery - Chains, tools & memory", "LangGraph - Complex AI workflows & agents", "Agentic AI - Goal-driven autonomous agents", "Vector embeddings & RAG architecture", "Lifetime access to recordings and materials", "VPS setup guidance included", "WhatsApp community group access"],
      curriculum: curriculum,
      isActive: true
    },
    create: {
      slug: "aiml-premium",
      cohortSlug: cohortSlug,
      name: "Premium",
      tagline: "Full-Stack AI Mastery",
      originalPrice: 1500,
      eventPrice: 1199,
      isDiscounted: true,
      isPrimary: true,
      features: ["Build 5 Full-Stack AI Projects from scratch", "LangChain mastery - Chains, tools & memory", "LangGraph - Complex AI workflows & agents", "Agentic AI - Goal-driven autonomous agents", "Vector embeddings & RAG architecture", "Lifetime access to recordings and materials", "VPS setup guidance included", "WhatsApp community group access"],
      curriculum: curriculum,
      isActive: true,
      status: "PUBLISHED"
    }
  })

  // Upsert Plus Bundle
  await prisma.bundle.upsert({
    where: { slug: "aiml-plus" },
    update: {
      name: "Plus",
      tagline: "Everything Included",
      originalPrice: 1800,
      eventPrice: 1499,
      isDiscounted: true,
      features: ["8 live Vibe Coding sessions (every Sat & Sun)", "Build 10+ AI projects: GenAI, n8n automation, Agentic AI", "Full stack: React, Next.js, FastAPI, Supabase", "LangChain, LangGraph, Vector DB, n8n mastery", "Kaggle Notebook + GitHub portfolio capstone project", "Lifetime access to recordings and materials", "VPS setup for n8n automation included", "WhatsApp community group access"],
      curriculum: curriculum,
      isActive: true
    },
    create: {
      slug: "aiml-plus",
      cohortSlug: cohortSlug,
      name: "Plus",
      tagline: "Everything Included",
      originalPrice: 1800,
      eventPrice: 1499,
      isDiscounted: true,
      features: ["8 live Vibe Coding sessions (every Sat & Sun)", "Build 10+ AI projects: GenAI, n8n automation, Agentic AI", "Full stack: React, Next.js, FastAPI, Supabase", "LangChain, LangGraph, Vector DB, n8n mastery", "Kaggle Notebook + GitHub portfolio capstone project", "Lifetime access to recordings and materials", "VPS setup for n8n automation included", "WhatsApp community group access"],
      curriculum: curriculum,
      isActive: true,
      status: "PUBLISHED"
    }
  })

  console.log("Successfully seeded AI/ML Cohort and Bundles with AIconic data!")
}

main()
  .catch((e) => {
    console.error("Error seeding Database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
