
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSoldTickets } from "@/data/tickets";
import { createClient } from "@/lib/supabase/server";
import { Calendar, DollarSign, Edit, MapPin, Ticket as TicketIcon, Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MySalesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const tickets = await getSoldTickets(user.id);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-10 px-4 md:px-6">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Minhas Vendas</h1>
                            <p className="text-muted-foreground">
                                Acompanhe seus ingressos à venda e vendidos.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/sell">Vender Novo Ingresso</Link>
                        </Button>
                    </div>

                    {tickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/25">
                            <TicketIcon className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold">Nenhum ingresso cadastrado</h3>
                            <p className="text-muted-foreground mb-6 text-center max-w-md">
                                Você ainda não colocou ingressos à venda. Comece a lucrar com segurança agora mesmo!
                            </p>
                            <Button asChild>
                                <Link href="/sell">Vender Ingresso</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="group flex flex-col md:flex-row rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all">
                                    <div className="w-full md:w-48 bg-muted relative aspect-video md:aspect-auto flex items-center justify-center text-muted-foreground px-4 text-center text-sm">
                                        {ticket.event.title}
                                    </div>

                                    <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg">{ticket.event.title}</h3>
                                                <Badge variant={ticket.status === 'SOLD' ? 'secondary' : 'default'} className={
                                                    ticket.status === 'SOLD'
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100"
                                                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100"
                                                }>
                                                    {ticket.status === 'SOLD' ? 'Vendido' : 'À Venda'}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(ticket.event.date).toLocaleDateString('pt-BR')}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {ticket.event.location}
                                                </div>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium">Assento: </span>
                                                {ticket.section} • Fila {ticket.row} • {ticket.seat}
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col items-center md:items-end gap-6 md:gap-2 w-full md:w-auto justify-between md:justify-end">
                                            <div className="flex flex-col items-start md:items-end">
                                                <span className="text-xs text-muted-foreground">Valor</span>
                                                <span className="text-xl font-bold flex items-center gap-1">
                                                    R$ {ticket.price.toFixed(2)}
                                                </span>
                                            </div>

                                            {ticket.status === 'SOLD' ? (
                                                <div className="text-sm text-muted-foreground flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded">
                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                    Pagamento: Pendente liberação
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" className="h-8">
                                                        <Edit className="h-3 w-3 mr-1" />
                                                        Editar
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                                        <Trash className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}
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
