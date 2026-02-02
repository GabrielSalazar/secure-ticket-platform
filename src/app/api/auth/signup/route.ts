import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
    const { email, password, name, userId } = await request.json()

    let authUserId = userId

    // If no userId provided from client, try to sign up/in with Supabase
    if (!authUserId) {
        const supabase = await createClient()
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        if (!authData.user) {
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
        }
        authUserId = authData.user.id
    }

    try {
        // Check if user already exists in database
        const existingUser = await prisma.user.findUnique({
            where: { id: authUserId },
        })

        if (existingUser) {
            return NextResponse.json({ user: existingUser }, { status: 200 })
        }

        // Create user in our database
        const user = await prisma.user.create({
            data: {
                id: authUserId,
                email,
                name: name || null,
                password: '', // Password is managed by Supabase Auth
                role: 'BUYER', // Default role
            },
        })

        return NextResponse.json({ user }, { status: 201 })
    } catch (error) {
        console.error('Error creating user in database:', error)
        return NextResponse.json(
            { error: 'Failed to create user profile' },
            { status: 500 }
        )
    }
}
