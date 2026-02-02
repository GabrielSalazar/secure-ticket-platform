import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EventCard } from "@/components/events/event-card"
import { MOCK_EVENTS } from "@/data/events"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"

export default function EventsPage() {
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {MOCK_EVENTS.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
