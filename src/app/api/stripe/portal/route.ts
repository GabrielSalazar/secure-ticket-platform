import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/payment/stripe-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const stripe = getStripe();
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/profile`;

        // 1. Get or create Stripe Customer ID for this user
        // Ideally this is stored in your DB. For now we will search or create.
        // In a real app, you should store stripeCustomerId in the User model.

        // Fetch user from DB to get stripeCustomerId
        // We will implement this properly by fetching from Prisma 
        // assuming the field we added 'stripeCustomerId' is populated.
        // If not, we create one.

        // For this implementation, let's assume we might need to create one if not exists
        // Since we didn't implement the logic to save it during checkout yet, 
        // we might not have it.

        // Let's create a portal session. 
        // If we don't have a customer ID, we can't create a portal session.
        // We need to ensure we have a customer ID.

        // Simplified flow:
        // 1. Check if user has stripeCustomerId in DB (we added this field)
        // 2. If yes, use it.
        // 3. If no, create a customer in Stripe and save to DB.

        const { prisma } = await import('@/lib/db');
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { stripeCustomerId: true, email: true, name: true }
        });

        let customerId = dbUser?.stripeCustomerId;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email!,
                name: dbUser?.name || undefined,
                metadata: {
                    userId: user.id
                }
            });
            customerId = customer.id;

            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: customerId }
            });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Error creating portal session:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
