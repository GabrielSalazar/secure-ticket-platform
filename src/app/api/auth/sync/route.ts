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

        console.log('Syncing user:', { id: authUser.id, email: authUser.email })

        // First, check if user exists by email (more reliable)
        let user = await prisma.user.findUnique({
            where: { email: authUser.email! }
        })

        if (user) {
            console.log('Found existing user by email:', user.id)
            // If the IDs don't match, we need to update the Supabase user ID in our database
            if (user.id !== authUser.id) {
                console.log('User ID mismatch - updating to Supabase ID')
                // Delete the old user and create new one with correct ID
                await prisma.user.delete({
                    where: { id: user.id }
                })

                user = await prisma.user.create({
                    data: {
                        id: authUser.id,
                        email: authUser.email!,
                        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
                        password: '',
                        role: 'BUYER',
                    }
                })
                console.log('Created new user with Supabase ID:', user.id)
            }
        } else {
            // User doesn't exist, create it
            console.log('Creating new user')
            user = await prisma.user.create({
                data: {
                    id: authUser.id,
                    email: authUser.email!,
                    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
                    password: '',
                    role: 'BUYER',
                }
            })
            console.log('User created:', user.id)
        }

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

        return NextResponse.json(
            { error: `Failed to sync user: ${error.message}` },
            { status: 500 }
        )
    }
}
