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

        const payouts = await prisma.payout.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json({ payouts })
    } catch (error) {
        console.error('Error fetching payouts:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar saques' },
            { status: 500 }
        )
    }
}
