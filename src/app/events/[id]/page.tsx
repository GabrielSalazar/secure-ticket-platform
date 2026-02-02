import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MOCK_EVENTS } from "@/data/events"
import { Calendar, MapPin, Share2, ShieldCheck, AlertCircle } from "lucide-react"
import { ShareEvent } from "@/components/events/share-event"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EventPage({ params }: PageProps) {
    const { id } = await params
    const event = MOCK_EVENTS.find((e) => e.id === id)

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

    // Mock Tickets
    const tickets = [
        { id: "t1", type: "Pista Premium", price: 250, seller: "João S.", verified: true },
        { id: "t2", type: "Pista Premium", price: 270, seller: "Maria O.", verified: true },
        { id: "t3", type: "Cadeira Inferior", price: 180, seller: "Pedro A.", verified: true },
        { id: "t4", type: "Camarote", price: 450, seller: "Lucas M.", verified: true },
    ]

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Event Header */}
                <div className="relative h-[300px] md:h-[400px] bg-muted overflow-hidden">
                    {/* Placeholder for Image */}
                    <div className="absolute inset-0 bg-secondary flex items-center justify-center text-4xl text-muted-foreground font-bold opacity-20">
                        {event.title}
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-background via-input/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 container">
                        <Badge className="mb-4">{event.category}</Badge>
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

                        <div className="space-y-4">
                            {tickets.map((ticket) => (
                                <Card key={ticket.id} className="group hover:border-primary/50 transition-colors">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg">{ticket.type}</h3>
                                                {ticket.verified && (
                                                    <Badge variant="outline" className="text-emerald-500 border-emerald-500/50 bg-emerald-500/10 gap-1">
                                                        <ShieldCheck className="h-3 w-3" /> Verificado
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">Vendedor: {ticket.seller}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-xl font-bold">R$ {ticket.price}</div>
                                                <div className="text-xs text-muted-foreground">Original: R$ {ticket.price}</div>
                                            </div>
                                            <Button>Comprar</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
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
