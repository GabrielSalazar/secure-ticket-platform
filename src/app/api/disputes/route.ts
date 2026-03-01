import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { transactionId, reason, description } = body

        if (!transactionId || !reason || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Verify transaction exists, belongs to user, and is completed
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
        })

        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
        }

        if (transaction.buyerId !== user.id) { // NOTE: Assuming Supabase ID matches DB ID, otherwise verify via email like auth middleware
            // For better robustness given previous issues, we should resolve the DB user first
        }

        // Resolve DB User
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } }) ?
            await prisma.user.findUnique({ where: { id: user.id } }) :
            await prisma.user.findUnique({ where: { email: user.email! } })

        if (!dbUser || transaction.buyerId !== dbUser.id) {
            return NextResponse.json({ error: "Unauthorized access to this transaction" }, { status: 403 })
        }

        if (transaction.status !== 'COMPLETED') {
            return NextResponse.json({ error: "Only completed transactions can be disputed" }, { status: 400 })
        }

        // Check if dispute already exists
        const existingDispute = await prisma.dispute.findUnique({
            where: { transactionId }
        })

        if (existingDispute) {
            return NextResponse.json({ error: "A dispute already exists for this transaction" }, { status: 409 })
        }

        // Create Dispute
        const dispute = await prisma.dispute.create({
            data: {
                reason,
                description,
                transactionId,
                openerId: dbUser.id,
                status: 'OPEN'
            },
        })

        return NextResponse.json({ success: true, dispute })
    } catch (error) {
        console.error("Error creating dispute:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
