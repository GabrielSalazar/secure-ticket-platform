import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const search = searchParams.get('search')
        const dateFrom = searchParams.get('dateFrom')
        const dateTo = searchParams.get('dateTo')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const sortBy = searchParams.get('sortBy') || 'date' // date, price, availability

        // Build where clause for filtering
        const where: any = {}

        // Search in title, description, and location
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
            ]
        }

        // Date range filter
        if (dateFrom || dateTo) {
            where.date = {}
            if (dateFrom) {
                where.date.gte = new Date(dateFrom)
            }
            if (dateTo) {
                where.date.lte = new Date(dateTo)
            }
        }

        const events = await prisma.event.findMany({
            where,
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
                _count: {
                    select: {
                        tickets: true,
                    },
                },
            },
            orderBy: {
                date: 'asc',
            },
        })

        // Calculate min price for each event and apply price filter
        let eventsWithMinPrice = events.map((event) => ({
            ...event,
            minPrice: event.tickets.length > 0
                ? Math.min(...event.tickets.map((t) => t.price))
                : null,
            availableTickets: event.tickets.length,
        }))

        // Filter by price range (client-side since it depends on ticket prices)
        if (minPrice || maxPrice) {
            eventsWithMinPrice = eventsWithMinPrice.filter((event) => {
                if (event.minPrice === null) return false
                if (minPrice && event.minPrice < parseFloat(minPrice)) return false
                if (maxPrice && event.minPrice > parseFloat(maxPrice)) return false
                return true
            })
        }

        // Sort events based on sortBy parameter
        if (sortBy === 'price') {
            eventsWithMinPrice.sort((a, b) => {
                const priceA = a.minPrice || Infinity
                const priceB = b.minPrice || Infinity
                return priceA - priceB
            })
        } else if (sortBy === 'availability') {
            eventsWithMinPrice.sort((a, b) => b.availableTickets - a.availableTickets)
        } else if (sortBy === 'date') {
            eventsWithMinPrice.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        }

        return NextResponse.json(eventsWithMinPrice)
    } catch (error) {
        console.error('Error fetching events:', error)
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        )
    }
}
