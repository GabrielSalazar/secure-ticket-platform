import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncEvents } from "@/lib/events/sync-service";

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

        // In a real application, we would check for an 'ADMIN' role here.
        // For this prototype, any authenticated user can trigger a sync.

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
