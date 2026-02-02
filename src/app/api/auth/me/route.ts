import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    const supabase = await createClient()

    const {
        data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
        return NextResponse.json({ user: null }, { status: 200 })
    }

    try {
        // Get user from database or create if doesn't exist
        let user = await prisma.user.findUnique({
            where: { id: authUser.id },
        })

        // If user doesn't exist in database, create it
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: authUser.id,
                    email: authUser.email!,
                    name: authUser.user_metadata?.name || null,
                    password: '',
                    role: 'BUYER',
                },
            })
        }

        return NextResponse.json({ user: { ...authUser, dbUser: user } }, { status: 200 })
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json({ user: authUser }, { status: 200 })
    }
}
