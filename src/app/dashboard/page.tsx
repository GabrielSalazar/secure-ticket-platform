"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ticket, DollarSign, Calendar, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [myTickets, setMyTickets] = useState<any[]>([])
    const [mySales, setMySales] = useState<any[]>([])
    const [myPurchases, setMyPurchases] = useState<any[]>([])

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
    const totalSales = mySales.filter(t => t.status === 'AVAILABLE').reduce((sum, ticket) => sum + ticket.price, 0)
    const totalRevenue = mySales.filter(t => t.status === 'SOLD').reduce((sum, ticket) => sum + ticket.price, 0)

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-8 px-4 md:px-6">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">Bem-vindo de volta, {user?.email?.split('@')[0]}!</p>
                    </div>

                    {/* Stats Cards */}
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
                                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">R$ {totalSales.toFixed(2)}</div>
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
                                    {soldTickets === 0 ? 'Nenhuma venda ainda' : `R$ ${totalRevenue.toFixed(2)} em vendas`}
                                </p>
                            </CardContent>
                        </Card>
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
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="font-semibold mb-2">Nenhum ingresso publicado</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Comece a vender seus ingressos não utilizados agora!
                                    </p>
                                    <Button asChild>
                                        <Link href="/sell">Publicar Primeiro Ingresso</Link>
                                    </Button>
                                </CardContent>
                            </Card>
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
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="font-semibold mb-2">Nenhum ingresso comprado</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Navegue pelos eventos e compre seus ingressos com segurança!
                                    </p>
                                    <Button asChild>
                                        <Link href="/events">Explorar Eventos</Link>
                                    </Button>
                                </CardContent>
                            </Card>
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
