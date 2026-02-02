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

        // Verify user exists in database, create if not
        let dbUser = await prisma.user.findUnique({
            where: { id: user.id },
        })

        if (!dbUser) {
            console.log('User not found in database, attempting to create...')
            try {
                // Create user with Supabase ID
                dbUser = await prisma.user.create({
                    data: {
                        id: user.id,
                        email: user.email!,
                        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                        password: '', // Empty password since we use Supabase auth
                        role: 'BUYER',
                    }
                })
                console.log('User created successfully:', dbUser.id)
            } catch (createError: any) {
                // If user creation fails due to unique constraint (user already exists with this email)
                if (createError.code === 'P2002') {
                    console.log('User already exists, trying to find by email...')
                    // Try to find by email
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email! }
                    })

                    if (existingUser) {
                        console.log('Found existing user by email, using it')
                        dbUser = existingUser
                    } else {
                        throw new Error('Não foi possível criar ou encontrar usuário. Por favor, faça logout e login novamente.')
                    }
                } else {
                    throw createError
                }
            }
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

        // Check if there's already a transaction for this ticket
        const existingTransaction = await prisma.transaction.findUnique({
            where: { ticketId: ticket.id },
            include: {
                ticket: { include: { event: true } },
                buyer: { select: { id: true, name: true, email: true } },
                seller: { select: { id: true, name: true, email: true } },
            }
        })

        if (existingTransaction) {
            // If transaction is completed, ticket is sold
            if (existingTransaction.status === 'COMPLETED') {
                return NextResponse.json(
                    { error: 'Este ingresso já foi vendido' },
                    { status: 400 }
                )
            }

            // If pending/failed and belongs to same buyer, reuse it
            if (existingTransaction.buyerId === dbUser.id) {
                console.log('Found existing transaction for buyer, reusing:', existingTransaction.id)
                // Update transaction timestamp to keep it fresh
                const updatedTransaction = await prisma.transaction.update({
                    where: { id: existingTransaction.id },
                    data: { updatedAt: new Date() },
                    include: {
                        ticket: { include: { event: true } },
                        buyer: { select: { id: true, name: true, email: true } },
                        seller: { select: { id: true, name: true, email: true } },
                    }
                })

                return NextResponse.json({
                    success: true,
                    transaction: updatedTransaction,
                    message: 'Transação existente recuperada. Prossiga para o pagamento.',
                })
            }

            // If pending but expired (e.g. > 30 mins) we could allow overwrite, 
            // but for now let's say it's reserved
            if (existingTransaction.status === 'PENDING') {
                // Check if older than 30 mins
                const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000)
                if (existingTransaction.updatedAt < thirtyMinsAgo) {
                    console.log('Existing transaction expired, decreasing...')
                    // Delete expired transaction to allow new one
                    await prisma.transaction.delete({
                        where: { id: existingTransaction.id }
                    })
                    // Continue to create new...
                } else {
                    return NextResponse.json(
                        { error: 'Este ingresso está em processo de compra por outro usuário' },
                        { status: 409 }
                    )
                }
            }
        }

        // Create transaction (ticket stays AVAILABLE until payment is confirmed)
        const transaction = await prisma.transaction.create({
            data: {
                amount: ticket.price,
                status: 'PENDING',
                ticketId: ticket.id,
                buyerId: dbUser.id, // Use validated dbUser.id
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

        return NextResponse.json({
            success: true,
            transaction,
            message: 'Transação criada. Prossiga para o pagamento.',
        })
    } catch (error: any) {
        console.error('Error purchasing ticket:', error)
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            meta: error.meta,
        })

        return NextResponse.json(
            {
                error: error.message || 'Erro ao processar compra',
                details: process.env.NODE_ENV === 'development' ? error : undefined
            },
            { status: 500 }
        )
    }
}
