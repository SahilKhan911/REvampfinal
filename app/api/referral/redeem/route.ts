import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('user_token')?.value
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        let decoded: any
        try {
            decoded = jwt.verify(token, env.JWT_SECRET)
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const body = await req.json()
        const amount = Number(body.amount)
        const upiId = body.upiId

        if (!amount || isNaN(amount) || amount < 100) {
            return NextResponse.json({ error: 'Minimum withdrawal amount is ₹100' }, { status: 400 })
        }
        if (!upiId || typeof upiId !== 'string' || !upiId.includes('@')) {
            return NextResponse.json({ error: 'Invalid UPI ID' }, { status: 400 })
        }

        // Atomic balance check + redemption creation to prevent race conditions
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const request = await (prisma.$transaction as any)(async (tx: any) => {
                const user = await tx.user.findUnique({ where: { id: decoded.userId } })
                if (!user) throw new Error('USER_NOT_FOUND')

                const payouts = await tx.referralPayout.findMany({ where: { userId: user.id } })
                const totalEarnings = payouts.reduce((sum: number, p: any) => sum + (p.amountPaid || 0), 0)

                const redemptions = await tx.redemptionRequest.findMany({
                    where: { userId: user.id, status: { not: 'REJECTED' } }
                })
                const totalRedeemed = redemptions.reduce((sum: number, r: { amount: number }) => sum + r.amount, 0)
                const availableBalance = totalEarnings - totalRedeemed

                if (amount > availableBalance) {
                    throw new Error(`INSUFFICIENT:${availableBalance}`)
                }

                return tx.redemptionRequest.create({
                    data: {
                        id: crypto.randomUUID(),
                        userId: user.id,
                        amount,
                        upiId,
                        status: 'INITIATED'
                    }
                })
            }, {
                isolationLevel: 'Serializable',
                timeout: 10000,
            })

            return NextResponse.json({ success: true, request })
        } catch (txError: any) {
            if (txError.message === 'USER_NOT_FOUND') {
                return NextResponse.json({ error: 'User not found' }, { status: 404 })
            }
            if (txError.message?.startsWith('INSUFFICIENT:')) {
                const available = txError.message.split(':')[1]
                return NextResponse.json({ error: `Insufficient balance. Available: ₹${available}` }, { status: 400 })
            }
            throw txError
        }
    } catch (error) {
        console.error('Redemption POST error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
