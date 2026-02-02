import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const eventId = searchParams.get('eventId')
        const sellerId = searchParams.get('sellerId')

        let where: any = {}

        if (eventId) {
            where.eventId = eventId
        }

        if (sellerId) {
            where.sellerId = sellerId
        } else {
            // Only show available tickets if not filtering by seller
            where.status = 'AVAILABLE'
        }

        const tickets = await prisma.ticket.findMany({
            where,
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        date: true,
                        location: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                price: 'asc',
            },
        })

        // Add eventId to each ticket for easier access
        const ticketsWithEventId = tickets.map((ticket: any) => ({
            ...ticket,
            eventId: ticket.event?.id || ticket.eventId,
        }))

        return NextResponse.json(ticketsWithEventId)
    } catch (error) {
        console.error('Error fetching tickets:', error)
        return NextResponse.json(
            { error: 'Failed to fetch tickets' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (!authUser) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { price, section, row, seat, eventId } = body

        console.log('Creating ticket with data:', { price, section, row, seat, eventId, sellerId: authUser.id })

        // Validate required fields
        if (!price || !eventId) {
            return NextResponse.json(
                { error: 'Missing required fields: price, eventId' },
                { status: 400 }
            )
        }

        // Validate price is a positive number
        const parsedPrice = parseFloat(price)
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return NextResponse.json(
                { error: 'Price must be a positive number' },
                { status: 400 }
            )
        }

        // Verify event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        })

        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            )
        }

        // Verify user exists in database, create if not
        let dbUser = await prisma.user.findUnique({
            where: { id: authUser.id },
        })

        if (!dbUser) {
            console.log('User not found in database, creating...')

            // Try to find by email first
            const existingUser = await prisma.user.findUnique({
                where: { email: authUser.email! }
            })

            if (existingUser && existingUser.id !== authUser.id) {
                console.log('Found user by email with different ID, updating...')
                // Delete old user and create new one with correct ID
                await prisma.user.delete({
                    where: { id: existingUser.id }
                })
            }

            // Create user
            dbUser = await prisma.user.create({
                data: {
                    id: authUser.id,
                    email: authUser.email!,
                    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
                    password: '',
                    role: 'BUYER',
                }
            })
            console.log('User created successfully:', dbUser.id)
        }

        console.log('User verified in database:', dbUser.id)

        console.log('Creating ticket with:', {
            eventId,
            sellerId: authUser.id,
            price: parsedPrice,
        })

        const ticket = await prisma.ticket.create({
            data: {
                price: parsedPrice,
                section: section || null,
                row: row || null,
                seat: seat || null,
                eventId,
                sellerId: authUser.id,
                status: 'AVAILABLE',
            },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        date: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        console.log('Ticket created successfully:', ticket.id)
        return NextResponse.json(ticket, { status: 201 })
    } catch (error: any) {
        console.error('Error creating ticket:', error)
        console.error('Error stack:', error.stack)
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            meta: error.meta,
            name: error.name,
        })

        // Provide more specific error messages
        if (error.code === 'P2003') {
            const field = error.meta?.field_name || 'unknown'
            const target = error.meta?.target || []
            console.error('Foreign key constraint failed on:', field, 'target:', target)

            if (field.includes('event') || target.includes('eventId')) {
                return NextResponse.json(
                    { error: 'Evento não encontrado. Por favor, selecione um evento válido.' },
                    { status: 400 }
                )
            }

            if (field.includes('seller') || target.includes('sellerId')) {
                return NextResponse.json(
                    { error: 'Usuário não encontrado. Por favor, faça logout e login novamente.' },
                    { status: 400 }
                )
            }

            return NextResponse.json(
                { error: `Erro de validação: ${field}` },
                { status: 400 }
            )
        }

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Já existe um ingresso idêntico cadastrado.' },
                { status: 409 }
            )
        }

        // Return detailed error for debugging
        return NextResponse.json(
            {
                error: `Erro ao criar ingresso: ${error.message}`,
                details: process.env.NODE_ENV === 'development' ? {
                    code: error.code,
                    meta: error.meta,
                } : undefined
            },
            { status: 500 }
        )
    }
}
