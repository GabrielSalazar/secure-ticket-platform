"use client"

export const dynamic = 'force-dynamic'

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ticket, DollarSign, Calendar, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { EmptyState } from "@/components/shared/empty-state"

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [mySales, setMySales] = useState<any[]>([])
    const [myPurchases, setMyPurchases] = useState<any[]>([])
    const { toast } = useToast()

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Check authentication
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) {
                router.push("/login?redirect=/dashboard")
            } else {
                setUser(user)

                // Fetch user's tickets for sale
                try {
                    const ticketsResponse = await fetch(`/api/tickets?sellerId=${user.id}`)
                    if (ticketsResponse.ok) {
                        const ticketsData = await ticketsResponse.json()
                        setMySales(ticketsData)
                    }
                } catch (err) {
                    console.error('Error fetching tickets:', err)
                }

                // Fetch user's purchases
                try {
                    const purchasesResponse = await fetch(`/api/transactions?buyerId=${user.id}`)
                    if (purchasesResponse.ok) {
                        const purchasesData = await purchasesResponse.json()
                        setMyPurchases(purchasesData)
                    }
                } catch (err) {
                    console.error('Error fetching purchases:', err)
                }

                setLoading(false)
            }
        })
    }, [router, supabase.auth])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Carregando...</p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const availableTickets = mySales.filter(t => t.status === 'AVAILABLE').length
    const soldTickets = mySales.filter(t => t.status === 'SOLD').length
    const potentialRevenue = mySales.filter(t => t.status === 'AVAILABLE').reduce((sum, ticket) => sum + ticket.price, 0)
    const earnedRevenue = mySales.filter(t => t.status === 'SOLD').reduce((sum, ticket) => sum + ticket.price, 0)

    const purchasedTickets = myPurchases.length
    const totalSpent = myPurchases.reduce((sum, transaction) => sum + (transaction.amount || transaction.price || 0), 0)

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-8 px-4 md:px-6">
                <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-muted-foreground">Bem-vindo de volta, {user?.email?.split('@')[0]}!</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild variant="outline">
                                <Link href="/events">Explorar Eventos</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/sell">Vender Ingresso</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Minhas Vendas</h2>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Ingressos à Venda</CardTitle>
                                    <Ticket className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{availableTickets}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {availableTickets === 0 ? "Nenhum ingresso publicado" : "Disponíveis para compra"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Receita Potencial</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">R$ {potentialRevenue.toFixed(2)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Em ingressos publicados
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Vendas Concluídas</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{soldTickets}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {soldTickets === 0 ? 'Nenhuma venda ainda' : `R$ ${earnedRevenue.toFixed(2)} recebidos`}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Purchase Stats */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Minhas Compras</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Ingressos Comprados</CardTitle>
                                    <Ticket className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{purchasedTickets}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {purchasedTickets === 0 ? "Nenhum ingresso comprado" : "Total de ingressos"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">R$ {totalSpent.toFixed(2)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Em compras de ingressos
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* My Tickets for Sale */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Meus Ingressos à Venda</h2>
                            <Button asChild>
                                <Link href="/sell">Vender Novo Ingresso</Link>
                            </Button>
                        </div>

                        {mySales.length === 0 ? (
                            <EmptyState
                                icon={Ticket}
                                title="Nenhum ingresso publicado"
                                description="Comece a vender seus ingressos não utilizados agora para faturar com eles!"
                                action={
                                    <Button asChild>
                                        <Link href="/sell">Publicar Primeiro Ingresso</Link>
                                    </Button>
                                }
                            />
                        ) : (
                            <div className="grid gap-4">
                                {mySales.map((ticket) => (
                                    <Card key={ticket.id}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-lg">{ticket.event?.title}</h3>
                                                        <Badge variant={ticket.status === 'AVAILABLE' ? 'default' : 'secondary'}>
                                                            {ticket.status === 'AVAILABLE' ? 'Disponível' : ticket.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(ticket.event?.date).toLocaleDateString('pt-BR')}
                                                        </div>
                                                        {ticket.section && (
                                                            <span>Setor: {ticket.section}</span>
                                                        )}
                                                        {ticket.row && ticket.seat && (
                                                            <span>Fila {ticket.row}, Assento {ticket.seat}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold">R$ {ticket.price.toFixed(2)}</div>
                                                    <Button variant="outline" size="sm" className="mt-2" asChild>
                                                        <Link href={`/events/${ticket.eventId}`}>Ver Evento</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* My Purchased Tickets */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Meus Ingressos Comprados</h2>
                            <Button variant="outline" asChild>
                                <Link href="/events">Buscar Ingressos</Link>
                            </Button>
                        </div>

                        {myPurchases.length === 0 ? (
                            <EmptyState
                                icon={Ticket}
                                title="Nenhum ingresso comprado"
                                description="Navegue pela nossa vitrine de eventos e compre ingressos com total segurança!"
                                action={
                                    <Button asChild>
                                        <Link href="/events">Explorar Eventos</Link>
                                    </Button>
                                }
                            />
                        ) : (
                            <div className="grid gap-4">
                                {myPurchases.map((transaction) => (
                                    <Card key={transaction.id}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-lg">{transaction.ticket?.event?.title}</h3>
                                                        <Badge variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                                            {transaction.status === 'PENDING' ? 'Pendente' : transaction.status === 'COMPLETED' ? 'Confirmado' : transaction.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(transaction.ticket?.event?.date).toLocaleDateString('pt-BR')}
                                                        </div>
                                                        {transaction.ticket?.section && (
                                                            <span>Setor: {transaction.ticket.section}</span>
                                                        )}
                                                        {transaction.ticket?.row && transaction.ticket?.seat && (
                                                            <span>Fila {transaction.ticket.row}, Assento {transaction.ticket.seat}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Comprado em {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold">R$ {transaction.amount.toFixed(2)}</div>
                                                    <Button variant="outline" size="sm" className="mt-2" asChild>
                                                        <Link href={`/events/${transaction.ticket?.eventId}`}>Ver Evento</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
