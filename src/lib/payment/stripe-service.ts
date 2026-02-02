import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
    if (!stripeInstance) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
        }

        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2026-01-28.clover' as any,
            typescript: true,
        })
    }
    return stripeInstance
}

export interface CreateCheckoutSessionParams {
    transactionId: string
    amount: number
    eventTitle: string
    ticketDetails: string
    buyerEmail: string
    successUrl: string
    cancelUrl: string
}

export interface PaymentResult {
    success: boolean
    sessionId?: string
    sessionUrl?: string
    error?: string
}

/**
 * Create a Stripe Checkout Session for ticket purchase
 */
export async function createCheckoutSession(
    params: CreateCheckoutSessionParams
): Promise<PaymentResult> {
    const stripe = getStripe()
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: params.eventTitle,
                            description: params.ticketDetails,
                        },
                        unit_amount: Math.round(params.amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            customer_email: params.buyerEmail,
            metadata: {
                transactionId: params.transactionId,
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
        })

        return {
            success: true,
            sessionId: session.id,
            sessionUrl: session.url || undefined,
        }
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create checkout session',
        }
    }
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
    payload: string | Buffer,
    signature: string
): Stripe.Event | null {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
        console.error('STRIPE_WEBHOOK_SECRET is not defined')
        return null
    }

    try {
        const stripe = getStripe()
        return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (error) {
        console.error('Error verifying webhook signature:', error)
        return null
    }
}

/**
 * Retrieve a checkout session by ID
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
    const stripe = getStripe()
    try {
        return await stripe.checkout.sessions.retrieve(sessionId)
    } catch (error) {
        console.error('Error retrieving checkout session:', error)
        return null
    }
}

export { getStripe }
