import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        // Get authenticated user
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            )
        }

        const searchParams = request.nextUrl.searchParams
        const buyerId = searchParams.get('buyerId')
        const sellerId = searchParams.get('sellerId')

        // Build where clause
        const where: any = {}

        if (buyerId) {
            where.buyerId = buyerId
        }

        if (sellerId) {
            where.sellerId = sellerId
        }

        // If no filter specified, return user's transactions (both purchases and sales)
        if (!buyerId && !sellerId) {
            where.OR = [
                { buyerId: user.id },
                { sellerId: user.id }
            ]
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                ticket: {
                    include: {
                        event: true,
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(transactions)
    } catch (error) {
        console.error('Error fetching transactions:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar transações' },
            { status: 500 }
        )
    }
}
