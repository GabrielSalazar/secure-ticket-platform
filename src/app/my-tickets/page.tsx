
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { getPurchasedTickets } from "@/data/tickets";
import { createClient } from "@/lib/supabase/server";
import { Calendar, MapPin, Ticket as TicketIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ManagementFilters } from "@/components/shared/management-filters";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MyTicketsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const filters = {
        search: typeof params.search === 'string' ? params.search : undefined,
        dateFrom: typeof params.dateFrom === 'string' ? params.dateFrom : undefined,
        dateTo: typeof params.dateTo === 'string' ? params.dateTo : undefined,
    };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const tickets = await getPurchasedTickets(user.id, filters);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-10 px-4 md:px-6">
                <div className="flex flex-col gap-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Meus Ingressos</h1>
                        <p className="text-muted-foreground">
                            Gerencie seus ingressos comprados e acesse os eventos.
                        </p>
                    </div>

                    <ManagementFilters />

                    {tickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/25">
                            <TicketIcon className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold">
                                {Object.values(filters).some(Boolean) ? "Nenhum resultado encontrado" : "Nenhum ingresso encontrado"}
                            </h3>
                            <p className="text-muted-foreground mb-6 text-center max-w-md">
                                {Object.values(filters).some(Boolean)
                                    ? "Tente ajustar seus filtros para encontrar o que procura."
                                    : "Você ainda não comprou nenhum ingresso. Explore os eventos disponíveis e garanta seu lugar!"}
                            </p>
                            {!Object.values(filters).some(Boolean) && (
                                <Button asChild>
                                    <Link href="/events">Explorar Eventos</Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:border-primary/50 flex flex-col">
                                    <div className="aspect-[2/1] w-full bg-muted relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center bg-secondary text-muted-foreground px-4 text-center text-sm">
                                            {ticket.event.title}
                                        </div>
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/10">
                                            {ticket.status === "SOLD" ? "Válido" : ticket.status}
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1 gap-4">
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                                {ticket.event.title}
                                            </h3>
                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(ticket.event.date).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <MapPin className="h-4 w-4" />
                                                <span className="line-clamp-1">{ticket.event.location}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/50">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">Setor</span>
                                                <span className="font-medium text-sm">{ticket.section || "-"}</span>
                                            </div>
                                            <div className="flex flex-col border-l border-border/50 pl-4">
                                                <span className="text-xs text-muted-foreground">Fila</span>
                                                <span className="font-medium text-sm">{ticket.row || "-"}</span>
                                            </div>
                                            <div className="flex flex-col border-l border-border/50 pl-4">
                                                <span className="text-xs text-muted-foreground">Assento</span>
                                                <span className="font-medium text-sm">{ticket.seat || "-"}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-2">
                                            <Button className="w-full" variant="outline">
                                                <TicketIcon className="mr-2 h-4 w-4" />
                                                Ver Ingresso (QR)
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
