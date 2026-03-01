import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncEvents } from "@/lib/events/sync-service";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            );
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true }
        });

        if (!dbUser || dbUser.role !== 'ADMIN') {
            return NextResponse.json(
                { error: "Acesso negado. Apenas administradores podem sincronizar eventos." },
                { status: 403 }
            );
        }

        const stats = await syncEvents();

        return NextResponse.json({
            success: true,
            message: "Sincronização concluída com sucesso",
            stats,
        });
    } catch (error: any) {
        console.error("Error in event sync API:", error);
        return NextResponse.json(
            { error: error.message || "Erro interno ao sincronizar eventos" },
            { status: 500 }
        );
    }
}
