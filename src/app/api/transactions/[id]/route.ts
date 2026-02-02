import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id: transactionId } = await params

        // Get transaction details
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
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
        })

        if (!transaction) {
            return NextResponse.json(
                { error: 'Transação não encontrada' },
                { status: 404 }
            )
        }

        // Verify user has access to this transaction
        const isBuyer = transaction.buyerId === user.id || (transaction.buyer?.email && transaction.buyer.email === user.email)
        const isSeller = transaction.sellerId === user.id || (transaction.seller?.email && transaction.seller.email === user.email)

        if (!isBuyer && !isSeller) {
            return NextResponse.json(
                { error: 'Você não tem permissão para acessar esta transação' },
                { status: 403 }
            )
        }

        return NextResponse.json(transaction)
    } catch (error) {
        console.error('Error fetching transaction:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar transação' },
            { status: 500 }
        )
    }
}
