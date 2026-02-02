import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            )
        }

        // Calculate total sales (COMPLETED transactions)
        const salesAggregation = await prisma.transaction.aggregate({
            where: {
                sellerId: user.id,
                status: 'COMPLETED',
            },
            _sum: {
                amount: true,
            },
        })

        const totalSales = salesAggregation._sum.amount || 0

        // Calculate total payouts (requested/paid)
        const payoutAggregation = await prisma.payout.aggregate({
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

        const totalPayouts = payoutAggregation._sum.amount || 0
        const availableBalance = totalSales - totalPayouts

        return NextResponse.json({
            totalSales,
            totalPayouts,
            availableBalance,
            currency: 'BRL',
        })
    } catch (error) {
        console.error('Error calculating balance:', error)
        return NextResponse.json(
            { error: 'Erro ao calcular saldo' },
            { status: 500 }
        )
    }
}
