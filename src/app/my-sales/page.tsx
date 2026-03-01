import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TicketActions } from "@/components/tickets/ticket-actions";
import { getSoldTickets } from "@/data/tickets";
import { createClient } from "@/lib/supabase/server";
import { Calendar, DollarSign, MapPin, Ticket as TicketIcon, Wallet } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ManagementFilters } from "@/components/shared/management-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { prisma } from "@/lib/db";
import { PayoutModal } from "@/components/payouts/payout-modal";
import { PayoutHistory } from "@/components/payouts/payout-history";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getBalanceAndPayouts(userId: string) {
    // Calculate total sales (COMPLETED transactions)
    const salesAggregation = await prisma.transaction.aggregate({
        where: {
            sellerId: userId,
            status: 'COMPLETED',
        },
        _sum: { amount: true },
    })
    const totalSales = salesAggregation._sum.amount || 0

    // Calculate total payouts request
    const payoutAggregation = await prisma.payout.aggregate({
        where: {
            userId: userId,
            status: { in: ['PENDING', 'PROCESSING', 'PAID'] }
        },
        _sum: { amount: true },
    })
    const totalPayouts = payoutAggregation._sum.amount || 0
    const availableBalance = totalSales - totalPayouts

    // Get payouts history
    const payouts = await prisma.payout.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
    })

    return { availableBalance, payouts }
}

export default async function MySalesPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const filters = {
        search: typeof params.search === 'string' ? params.search : undefined,
        status: typeof params.status === 'string' ? params.status : undefined,
    };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const tickets = await getSoldTickets(user.id, filters);
    const { availableBalance, payouts } = await getBalanceAndPayouts(user.id);

    const statusOptions = [
        { label: 'À Venda', value: 'AVAILABLE' },
        { label: 'Vendido', value: 'SOLD' },
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-10 px-4 md:px-6">
                <div className="flex flex-col gap-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Minhas Vendas</h1>
                            <p className="text-muted-foreground">
                                Gerencie seus ingressos, vendas e recebimentos.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/sell">Vender Novo Ingresso</Link>
                        </Button>
                    </div>

                    {/* Balance & Actions Section */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-6">
                            {/* Filters */}
                            <ManagementFilters
                                showStatusFilter
                                statusOptions={statusOptions}
                            />

                            {/* Tickets List */}
                            {tickets.length === 0 ? (
                                <EmptyState
                                    icon={TicketIcon}
                                    title={Object.values(filters).some(Boolean) ? "Nenhum resultado encontrado" : "Nenhum ingresso cadastrado"}
                                    description={Object.values(filters).some(Boolean)
                                        ? "Tente ajustar seus filtros para encontrar o que procura."
                                        : "Você ainda não colocou ingressos à venda."}
                                    action={!Object.values(filters).some(Boolean) ? (
                                        <Button asChild>
                                            <Link href="/sell">Vender Ingresso</Link>
                                        </Button>
                                    ) : undefined}
                                />
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
                                                            Pagamento Confirmado
                                                        </div>
                                                    ) : (
                                                        <TicketActions
                                                            ticketId={ticket.id}
                                                            currentPrice={ticket.price}
                                                            currentSection={ticket.section || undefined}
                                                            currentRow={ticket.row || undefined}
                                                            currentSeat={ticket.seat || undefined}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar: Wallet & Payouts */}
                        <div className="space-y-6">
                            <div className="rounded-xl border bg-card p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <Wallet className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold text-lg">Carteira</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Saldo Disponível</p>
                                        <h2 className="text-3xl font-bold text-green-600">
                                            R$ {availableBalance.toFixed(2)}
                                        </h2>
                                    </div>
                                    <PayoutModal availableBalance={availableBalance} />
                                    <p className="text-xs text-muted-foreground">
                                        Vendas confirmadas são liberadas para saque imediatamente.
                                    </p>
                                </div>
                            </div>

                            <PayoutHistory payouts={payouts} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
