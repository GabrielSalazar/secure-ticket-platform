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

        // Validate required fields
        if (!price || !eventId) {
            return NextResponse.json(
                { error: 'Missing required fields: price, eventId' },
                { status: 400 }
            )
        }

        // Ensure user exists in database
        let dbUser = await prisma.user.findUnique({
            where: { id: authUser.id },
        })

        if (!dbUser) {
            // Create user if doesn't exist
            dbUser = await prisma.user.create({
                data: {
                    id: authUser.id,
                    email: authUser.email!,
                    name: authUser.user_metadata?.name || null,
                    password: '',
                    role: 'BUYER',
                },
            })
        }

        const ticket = await prisma.ticket.create({
            data: {
                price: parseFloat(price),
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

        return NextResponse.json(ticket, { status: 201 })
    } catch (error) {
        console.error('Error creating ticket:', error)
        return NextResponse.json(
            { error: 'Failed to create ticket' },
            { status: 500 }
        )
    }
}
