import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const eventId = searchParams.get('eventId')

        const where = eventId
            ? {
                eventId,
                status: 'AVAILABLE' as const,
            }
            : {
                status: 'AVAILABLE' as const,
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

        return NextResponse.json(tickets)
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
        const body = await request.json()
        const { price, section, row, seat, eventId, sellerId } = body

        // Validate required fields
        if (!price || !eventId || !sellerId) {
            return NextResponse.json(
                { error: 'Missing required fields: price, eventId, sellerId' },
                { status: 400 }
            )
        }

        const ticket = await prisma.ticket.create({
            data: {
                price: parseFloat(price),
                section: section || null,
                row: row || null,
                seat: seat || null,
                eventId,
                sellerId,
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
