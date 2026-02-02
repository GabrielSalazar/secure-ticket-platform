import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, description, location, date, organizerId, imageUrl } = body

        // Validate required fields
        if (!title || !description || !location || !date || !organizerId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const event = await prisma.event.create({
            data: {
                title,
                description,
                location,
                date: new Date(date),
                imageUrl: imageUrl || null,
                organizerId,
            },
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        return NextResponse.json(event, { status: 201 })
    } catch (error) {
        console.error('Error creating event:', error)
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        )
    }
}
