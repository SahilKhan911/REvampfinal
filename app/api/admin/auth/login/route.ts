import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { env } from "@/lib/env"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
    }

    if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: "admin", email: env.ADMIN_EMAIL, role: "admin" },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    const response = NextResponse.json({ success: true })

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
