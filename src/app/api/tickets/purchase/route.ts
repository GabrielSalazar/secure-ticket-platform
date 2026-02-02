import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { PrismaClient } from '@prisma/client'

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
        const { ticketId } = body

        if (!ticketId) {
            return NextResponse.json(
                { error: 'ID do ingresso é obrigatório' },
                { status: 400 }
            )
        }

        // Get ticket details
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            include: {
                event: true,
                seller: true,
            },
        })

        if (!ticket) {
            return NextResponse.json(
                { error: 'Ingresso não encontrado' },
                { status: 404 }
            )
        }

        // Validate ticket is available
        if (ticket.status !== 'AVAILABLE') {
            return NextResponse.json(
                { error: 'Ingresso não está disponível para compra' },
                { status: 400 }
            )
        }

        // Validate user is not buying their own ticket
        if (ticket.sellerId === user.id) {
            return NextResponse.json(
                { error: 'Você não pode comprar seu próprio ingresso' },
                { status: 400 }
            )
        }

        // Create transaction and update ticket in a transaction
        const transaction = await prisma.$transaction(async (tx) => {
            // Update ticket status
            await tx.ticket.update({
                where: { id: ticketId },
                data: { status: 'SOLD' },
            })

            // Create transaction record
            const newTransaction = await tx.transaction.create({
                data: {
                    amount: ticket.price,
                    status: 'PENDING',
                    ticketId: ticket.id,
                    buyerId: user.id,
                    sellerId: ticket.sellerId,
                },
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

            return newTransaction
        })

        return NextResponse.json({
            success: true,
            transaction,
            message: 'Ingresso comprado com sucesso!',
        })
    } catch (error) {
        console.error('Error purchasing ticket:', error)
        return NextResponse.json(
            { error: 'Erro ao processar compra' },
            { status: 500 }
        )
    }
}
