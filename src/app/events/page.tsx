import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EventCard } from "@/components/events/event-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"

async function getEvents() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/events`, {
            cache: 'no-store', // Always fetch fresh data
        })

        if (!res.ok) {
            throw new Error('Failed to fetch events')
        }

        return res.json()
    } catch (error) {
        console.error('Error fetching events:', error)
        return []
    }
}

export default async function EventsPage() {
    const events = await getEvents()

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-8 px-4 md:px-6">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Próximos Eventos</h1>
                            <p className="text-muted-foreground">Encontre ingressos para os melhores shows e festivais.</p>
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar eventos, artistas ou locais..."
                                    className="pl-8"
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {events.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Nenhum evento disponível no momento.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {events.map((event: any) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
