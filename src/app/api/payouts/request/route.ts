import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { pixKey } = body

        if (!pixKey) {
            return NextResponse.json(
                { error: 'Chave PIX é obrigatória' },
                { status: 400 }
            )
        }

        // Calculate available balance
        // Sum of all COMPLETED sales
        const completedSales = await prisma.transaction.aggregate({
            where: {
                sellerId: user.id,
                status: 'COMPLETED',
            },
            _sum: {
                amount: true,
            },
        })

        const totalSales = completedSales._sum.amount || 0

        // Sum of all requested payouts (PENDING, PROCESSING, PAID)
        const requestedPayouts = await prisma.payout.aggregate({
            where: {
                userId: user.id,
                status: {
                    in: ['PENDING', 'PROCESSING', 'PAID']
                }
            },
            _sum: {
                amount: true,
            },
        })

        const totalPayouts = requestedPayouts._sum.amount || 0
        const availableBalance = totalSales - totalPayouts

        if (availableBalance <= 0) {
            return NextResponse.json(
                { error: 'Saldo insuficiente para saque' },
                { status: 400 }
            )
        }

        // Create payout request for full balance
        const payout = await prisma.payout.create({
            data: {
                userId: user.id,
                amount: availableBalance,
                pixKey: pixKey,
                status: 'PENDING',
            },
        })

        return NextResponse.json({
            success: true,
            payout,
            message: 'Solicitação de saque realizada com sucesso'
        })
    } catch (error) {
        console.error('Error requesting payout:', error)
        return NextResponse.json(
            { error: 'Erro ao solicitar saque' },
            { status: 500 }
        )
    }
}
