import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params
        const body = await request.json()
        const { price, section, row, seat } = body

        // Check if ticket exists and belongs to user
        const existingTicket = await prisma.ticket.findUnique({
            where: { id },
        })

        if (!existingTicket) {
            return NextResponse.json(
                { error: 'Ticket not found' },
                { status: 404 }
            )
        }

        if (existingTicket.sellerId !== user.id) {
            return NextResponse.json(
                { error: 'You can only edit your own tickets' },
                { status: 403 }
            )
        }

        if (existingTicket.status === 'SOLD') {
            return NextResponse.json(
                { error: 'Cannot edit a sold ticket' },
                { status: 400 }
            )
        }

        // Validate price if provided
        if (price !== undefined) {
            if (typeof price !== 'number' || price <= 0) {
                return NextResponse.json(
                    { error: 'Price must be a positive number' },
                    { status: 400 }
                )
            }
        }

        // Update ticket
        const updatedTicket = await prisma.ticket.update({
            where: { id },
            data: {
                ...(price !== undefined && { price }),
                ...(section !== undefined && { section }),
                ...(row !== undefined && { row }),
                ...(seat !== undefined && { seat }),
            },
            include: {
                event: true,
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        return NextResponse.json(updatedTicket)
    } catch (error) {
        console.error('Error updating ticket:', error)
        return NextResponse.json(
            { error: 'Failed to update ticket' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params

        // Check if ticket exists and belongs to user
        const existingTicket = await prisma.ticket.findUnique({
            where: { id },
        })

        if (!existingTicket) {
            return NextResponse.json(
                { error: 'Ticket not found' },
                { status: 404 }
            )
        }

        if (existingTicket.sellerId !== user.id) {
            return NextResponse.json(
                { error: 'You can only delete your own tickets' },
                { status: 403 }
            )
        }

        if (existingTicket.status === 'SOLD') {
            return NextResponse.json(
                { error: 'Cannot delete a sold ticket' },
                { status: 400 }
            )
        }

        // Delete ticket
        await prisma.ticket.delete({
            where: { id },
        })

        return NextResponse.json({ success: true, message: 'Ticket deleted successfully' })
    } catch (error) {
        console.error('Error deleting ticket:', error)
        return NextResponse.json(
            { error: 'Failed to delete ticket' },
            { status: 500 }
        )
    }
}
