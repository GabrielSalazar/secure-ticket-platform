import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { startOfDay, subDays, format } from 'date-fns'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify if user is ADMIN
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true }
        })

        if (!dbUser || dbUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // 1. Total Revenue (Completed transactions)
        const totalRevenue = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            },
            where: {
                status: 'COMPLETED'
            }
        })
        const revenue = totalRevenue._sum.amount || 0

        // 2. Total Tickets Sold vs Available
        const soldTicketsCount = await prisma.ticket.count({
            where: { status: 'SOLD' }
        })
        const availableTicketsCount = await prisma.ticket.count({
            where: { status: 'AVAILABLE' }
        })

        // 3. Sales over the last 7 days for the chart
        const today = startOfDay(new Date())
        const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i))

        const chartData = []
        for (const date of last7Days) {
            const nextDay = new Date(date)
            nextDay.setDate(date.getDate() + 1)

            const daySales = await prisma.transaction.aggregate({
                _sum: { amount: true },
                _count: { id: true },
                where: {
                    status: 'COMPLETED',
                    updatedAt: {
                        gte: date,
                        lt: nextDay
                    }
                }
            })

            chartData.push({
                date: format(date, 'dd/MM'),
                revenue: daySales._sum.amount || 0,
                tickets: daySales._count.id || 0
            })
        }

        // 4. Top Events (by sold tickets)
        const topEventsRaw = await prisma.ticket.groupBy({
            by: ['eventId'],
            _count: {
                id: true
            },
            where: {
                status: 'SOLD'
            },
            orderBy: {
                _count: { id: 'desc' }
            },
            take: 5
        })

        const topEventsIds = topEventsRaw.map(t => t.eventId)
        const eventsDetails = await prisma.event.findMany({
            where: { id: { in: topEventsIds } },
            select: { id: true, title: true }
        })

        const topEvents = topEventsRaw.map(raw => {
            const detail = eventsDetails.find(e => e.id === raw.eventId)
            return {
                id: raw.eventId,
                title: detail?.title || 'Unknown Event',
                soldCount: raw._count.id
            }
        })

        return NextResponse.json({
            summary: {
                revenue,
                soldTickets: soldTicketsCount,
                availableTickets: availableTicketsCount
            },
            chartData,
            topEvents
        })

    } catch (error) {
        console.error('Error fetching analytics data:', error)
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
