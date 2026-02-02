import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
    const { email, password, name } = await request.json()

    const supabase = await createClient()

    // Sign up with Supabase Auth
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

    try {
        // Check if user already exists in database
        const existingUser = await prisma.user.findUnique({
            where: { id: authData.user.id },
        })

        if (existingUser) {
            return NextResponse.json({ user: existingUser }, { status: 200 })
        }

        // Create user in our database
        const user = await prisma.user.create({
            data: {
                id: authData.user.id,
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
