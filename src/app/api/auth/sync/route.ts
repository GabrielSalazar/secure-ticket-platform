import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (!authUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Upsert user in database
        const user = await prisma.user.upsert({
            where: { id: authUser.id },
            update: {
                name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            },
            create: {
                id: authUser.id,
                email: authUser.email!,
                name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
                password: '',
                role: 'BUYER',
            },
        })

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        })
    } catch (error: any) {
        console.error('Error syncing user:', error)

        // If unique constraint error on email, try to find by email
        if (error.code === 'P2002') {
            try {
                const supabase = await createClient()
                const { data: { user: authUser } } = await supabase.auth.getUser()

                if (authUser?.email) {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: authUser.email }
                    })

                    if (existingUser) {
                        return NextResponse.json({
                            success: true,
                            user: {
                                id: existingUser.id,
                                email: existingUser.email,
                                name: existingUser.name,
                            }
                        })
                    }
                }
            } catch (retryError) {
                console.error('Retry error:', retryError)
            }
        }

        return NextResponse.json(
            { error: 'Failed to sync user' },
            { status: 500 }
        )
    }
}
