import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            )
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                pixKey: true,
                role: true,
                createdAt: true,
            }
        })

        return NextResponse.json(dbUser)
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar perfil' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { name, phone, pixKey } = body

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name,
                phone,
                pixKey,
            },
        })

        return NextResponse.json({
            success: true,
            user: updatedUser,
            message: 'Perfil atualizado com sucesso'
        })
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json(
            { error: 'Erro ao atualizar perfil' },
            { status: 500 }
        )
    }
}
