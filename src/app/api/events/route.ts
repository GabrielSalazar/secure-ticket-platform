import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                tickets: {
                    where: {
                        status: 'AVAILABLE',
                    },
                    select: {
                        id: true,
                        price: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                date: 'asc',
            },
        })

        // Calculate min price for each event
        const eventsWithMinPrice = events.map((event) => ({
            ...event,
            minPrice: event.tickets.length > 0
                ? Math.min(...event.tickets.map((t) => t.price))
                : null,
            availableTickets: event.tickets.length,
        }))

        return NextResponse.json(eventsWithMinPrice)
    } catch (error) {
        console.error('Error fetching events:', error)
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        )
    }
}
