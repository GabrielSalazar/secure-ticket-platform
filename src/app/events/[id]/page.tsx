import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, ShieldCheck, AlertCircle } from "lucide-react"
import { ShareEvent } from "@/components/events/share-event"
import { PurchaseButton } from "@/components/events/purchase-button"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ id: string }>
}

async function getEvent(id: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/events/${id}`, {
            cache: 'no-store',
        })

        if (!res.ok) {
            return null
        }

        return res.json()
    } catch (error) {
        console.error('Error fetching event:', error)
        return null
    }
}

export default async function EventPage({ params }: PageProps) {
    const { id } = await params
    const event = await getEvent(id)

    if (!event) {
        notFound()
    }

    const date = new Date(event.date).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })

    const time = new Date(event.date).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    })

    const tickets = event.tickets || []

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Event Header */}
                <div className="relative h-[300px] md:h-[400px] bg-muted overflow-hidden">
                    {event.imageUrl ? (
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-secondary flex items-center justify-center text-4xl text-muted-foreground font-bold opacity-20">
                            {event.title}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-background via-input/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 container">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 shadow-sm">{event.title}</h1>
                        <div className="flex flex-col md:flex-row gap-4 text-white/90 font-medium">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                <span>{date} às {time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container py-8 px-4 md:px-6 grid md:grid-cols-3 gap-8">
                    {/* Ticket List */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Ingressos Disponíveis</h2>
                            <span className="text-muted-foreground text-sm">{tickets.length} opções</span>
                        </div>

                        {tickets.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <p className="text-muted-foreground">Nenhum ingresso disponível no momento.</p>
                                    <Button variant="secondary" className="mt-4" asChild>
                                        <Link href="/sell">Seja o primeiro a vender</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {tickets.map((ticket: any) => (
                                    <Card key={ticket.id} className="group hover:border-primary/50 transition-colors">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg">
                                                        {ticket.section || 'Ingresso Geral'}
                                                        {ticket.row && ticket.seat && ` - Fila ${ticket.row}, Assento ${ticket.seat}`}
                                                    </h3>
                                                    <Badge variant="outline" className="text-emerald-500 border-emerald-500/50 bg-emerald-500/10 gap-1">
                                                        <ShieldCheck className="h-3 w-3" /> Verificado
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Vendedor: {ticket.seller?.name || 'Anônimo'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-xl font-bold">R$ {ticket.price.toFixed(2)}</div>
                                                </div>
                                                <PurchaseButton
                                                    ticketId={ticket.id}
                                                    price={ticket.price}
                                                    section={ticket.section}
                                                    row={ticket.row}
                                                    seat={ticket.seat}
                                                    eventTitle={event.title}
                                                    sellerName={ticket.seller?.name}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar info */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-semibold text-lg">Informações Seguras</h3>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li className="flex gap-2">
                                        <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                                        <span>Ingressos verificados manualmente ou via integração</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span>O vendedor só recebe após o evento</span>
                                    </li>
                                </ul>
                                <div className="pt-2">
                                    <ShareEvent eventName={event.title} />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-primary/5 rounded-xl p-6 text-center space-y-4 border border-primary/20">
                            <h3 className="font-semibold">Tem ingresso sobrando?</h3>
                            <p className="text-sm text-muted-foreground">
                                Venda para quem realmente é fã. Sem ágio abusivo, com segurança total.
                            </p>
                            <Button variant="secondary" className="w-full" asChild>
                                <Link href="/sell">Vender meu ingresso</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
