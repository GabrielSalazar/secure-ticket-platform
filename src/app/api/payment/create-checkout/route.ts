import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { createCheckoutSession } from '@/lib/payment/stripe-service'

export async function POST(request: NextRequest) {
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

        // Get request body
        const body = await request.json()
        const { transactionId } = body

        if (!transactionId) {
            return NextResponse.json(
                { error: 'ID da transação é obrigatório' },
                { status: 400 }
            )
        }

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
                        email: true,
                        name: true,
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

        // Verify user is the buyer
        const isBuyer = transaction.buyerId === user.id || (transaction.buyer?.email && transaction.buyer.email === user.email)

        if (!isBuyer) {
            return NextResponse.json(
                { error: 'Você não tem permissão para acessar esta transação' },
                { status: 403 }
            )
        }

        // Verify transaction is still pending
        if (transaction.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Esta transação não está mais pendente' },
                { status: 400 }
            )
        }

        // Build ticket details
        const ticketDetails = [
            transaction.ticket.section && `Setor: ${transaction.ticket.section}`,
            transaction.ticket.row && `Fila: ${transaction.ticket.row}`,
            transaction.ticket.seat && `Assento: ${transaction.ticket.seat}`,
        ].filter(Boolean).join(' • ')

        // Get base URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        // Create Stripe checkout session
        const result = await createCheckoutSession({
            transactionId: transaction.id,
            amount: transaction.amount,
            eventTitle: transaction.ticket.event.title,
            ticketDetails: ticketDetails || 'Ingresso',
            buyerEmail: transaction.buyer.email,
            successUrl: `${baseUrl}/purchase/${transactionId}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${baseUrl}/purchase/${transactionId}`,
        })

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Erro ao criar sessão de pagamento' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            sessionId: result.sessionId,
            sessionUrl: result.sessionUrl,
        })
    } catch (error) {
        console.error('Error creating checkout session:', error)
        return NextResponse.json(
            { error: 'Erro ao processar pagamento' },
            { status: 500 }
        )
    }
}
