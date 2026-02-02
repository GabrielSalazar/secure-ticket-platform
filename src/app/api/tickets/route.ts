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

        // Verify user exists in database (should already exist from auth)
        const dbUser = await prisma.user.findUnique({
            where: { id: authUser.id },
        })

        if (!dbUser) {
            console.error('User not found in database:', authUser.id)
            return NextResponse.json(
                { error: 'User not found. Please logout and login again.' },
                { status: 400 }
            )
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
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            meta: error.meta,
        })

        // Provide more specific error messages
        if (error.code === 'P2003') {
            const field = error.meta?.field_name || 'unknown'
            console.error('Foreign key constraint failed on:', field)
            return NextResponse.json(
                { error: `Invalid ${field.includes('event') ? 'event' : 'user'} ID` },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: `Failed to create ticket: ${error.message || 'Unknown error'}` },
            { status: 500 }
        )
    }
}
