import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, getCheckoutSession } from '@/lib/payment/stripe-service'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
    try {
        const body = await request.text()
        const signature = request.headers.get('stripe-signature')

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing stripe-signature header' },
                { status: 400 }
            )
        }

        // Verify webhook signature
        const event = verifyWebhookSignature(body, signature)

        if (!event) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            )
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const transactionId = session.metadata?.transactionId

                if (!transactionId) {
                    console.error('No transactionId in session metadata')
                    return NextResponse.json({ received: true })
                }

                // Update transaction and ticket in a database transaction
                await prisma.$transaction(async (tx) => {
                    // Get the transaction
                    const transaction = await tx.transaction.findUnique({
                        where: { id: transactionId },
                        include: { ticket: true },
                    })

                    if (!transaction) {
                        console.error(`Transaction ${transactionId} not found`)
                        return
                    }

                    // Update transaction status to COMPLETED
                    await tx.transaction.update({
                        where: { id: transactionId },
                        data: {
                            status: 'COMPLETED',
                            updatedAt: new Date(),
                        },
                    })

                    // Update ticket status to SOLD
                    await tx.ticket.update({
                        where: { id: transaction.ticketId },
                        data: {
                            status: 'SOLD',
                            updatedAt: new Date(),
                        },
                    })
                })

                console.log(`Payment completed for transaction ${transactionId}`)
                break
            }

            case 'checkout.session.expired': {
                const session = event.data.object as Stripe.Checkout.Session
                const transactionId = session.metadata?.transactionId

                if (!transactionId) {
                    console.error('No transactionId in session metadata')
                    return NextResponse.json({ received: true })
                }

                // Update transaction status to FAILED
                await prisma.transaction.update({
                    where: { id: transactionId },
                    data: {
                        status: 'FAILED',
                        updatedAt: new Date(),
                    },
                })

                console.log(`Payment session expired for transaction ${transactionId}`)
                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Error processing webhook:', error)
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        )
    }
}
