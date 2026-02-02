import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface EventCardProps {
    event: any
}

export function EventCard({ event }: EventCardProps) {
    const date = new Date(event.date).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
        // year: "numeric",
    })

    const time = new Date(event.date).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    })

    return (
        <Card className="group overflow-hidden border-border transition-all hover:border-primary/50 hover:shadow-md">
            <div className="aspect-[16/9] w-full bg-muted relative overflow-hidden">
                {/* Placeholder for Image */}
                <div className="absolute inset-0 flex items-center justify-center bg-secondary text-muted-foreground group-hover:scale-105 transition-transform duration-300">
                    {event.title}
                </div>
            </div>
            <CardContent className="p-4">
                <div className="space-y-3">
                    <div className="space-y-1">
                        <h3 className="font-semibold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                            {event.title}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{date} • {time}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">A partir de</span>
                    <span className="font-bold text-lg">
                        {!event.minPrice || event.minPrice === 0 ? "Grátis" : `R$ ${event.minPrice.toFixed(2)}`}
                    </span>
                </div>
                <Button size="sm" asChild>
                    <Link href={`/events/${event.id}`}>
                        Comprar
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
