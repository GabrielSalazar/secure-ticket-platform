"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function SellPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState<any[]>([])
    const [selectedEventId, setSelectedEventId] = useState("")
    const [price, setPrice] = useState("")
    const [section, setSection] = useState("")
    const [row, setRow] = useState("")
    const [seat, setSeat] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [suggestedPrice, setSuggestedPrice] = useState<{ avg: number, min: number, count: number } | null>(null)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Check authentication
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push("/login?redirect=/sell")
            } else {
                setUser(user)
            }
        })

        // Fetch events
        fetch('/api/events')
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error('Error fetching events:', err))
            .finally(() => setLoading(false))
    }, [router, supabase.auth])

    useEffect(() => {
        if (!selectedEventId) {
            setSuggestedPrice(null)
            return
        }

        const fetchPriceInfo = async () => {
            try {
                const res = await fetch(`/api/tickets?eventId=${selectedEventId}`)
                const tickets = await res.json()

                if (tickets && tickets.length > 0) {
                    const prices = tickets.map((t: any) => t.price)
                    const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length
                    const min = Math.min(...prices)
                    setSuggestedPrice({ avg, min, count: tickets.length })
                } else {
                    setSuggestedPrice(null)
                }
            } catch (err) {
                console.error('Error fetching price info:', err)
            }
        }

        fetchPriceInfo()
    }, [selectedEventId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        if (!selectedEventId || !price) {
            setError("Por favor, selecione um evento e informe o preço")
            setSubmitting(false)
            return
        }

        try {
            // Create the ticket (endpoint will auto-sync user if needed)
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId: selectedEventId,
                    price: parseFloat(price),
                    section: section || null,
                    row: row || null,
                    seat: seat || null,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                console.error('Ticket creation failed:', errorData)
                setError(errorData.error || 'Erro ao criar ingresso')
                setSubmitting(false)
                return
            }

            const createdTicket = await response.json()

            setSuccess(true)
            // Reset form
            setSelectedEventId("")
            setPrice("")
            setSection("")
            setRow("")
            setSeat("")

            // Redirect to event page after 2 seconds
            setTimeout(() => {
                router.push(`/events/${createdTicket.eventId}`)
            }, 2000)
        } catch (err) {
            console.error('Error in handleSubmit:', err)
            setError(err instanceof Error ? err.message : "Ocorreu um erro ao publicar o ingresso")
        } finally {
            setSubmitting(false)
        }
    }

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

    if (success) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Ingresso Publicado!</h2>
                        <p className="text-muted-foreground mb-4">
                            Seu ingresso foi publicado com sucesso e já está disponível para compra.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Redirecionando para a página do evento...
                        </p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-8 px-4 md:px-6 max-w-3xl mx-auto">
                <div className="space-y-6">
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className="text-3xl font-bold tracking-tight">Vender Ingressos</h1>
                        <p className="text-muted-foreground">Converta seu ingresso não utilizado em dinheiro com segurança.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm space-y-8">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-md">
                                {error}
                            </div>
                        )}

                        {/* Step 1: Event Selection */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                                Selecione o Evento
                            </h2>
                            <div className="space-y-2">
                                <Label htmlFor="event">Qual é o evento?</Label>
                                <Select value={selectedEventId} onValueChange={setSelectedEventId} required>
                                    <SelectTrigger id="event">
                                        <SelectValue placeholder="Selecione um evento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {events.map((event) => (
                                            <SelectItem key={event.id} value={event.id}>
                                                {event.title} - {new Date(event.date).toLocaleDateString('pt-BR')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="h-px bg-border/50" />

                        {/* Step 2: Pricing */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                                Preço e Detalhes
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="selling-price">Preço de Venda (R$) *</Label>
                                        {suggestedPrice && (
                                            <div className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                                                <span>Média do mercado: <strong>R$ {suggestedPrice.avg.toFixed(2)}</strong></span>
                                                <span className="hidden md:inline">•</span>
                                                <span className="hidden md:inline">Mínimo: R$ {suggestedPrice.min.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <Input
                                        id="selling-price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0,00"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                        disabled={submitting}
                                    />
                                    {suggestedPrice && suggestedPrice.count > 0 && (
                                        <p className="text-[10px] text-muted-foreground">
                                            Baseado em {suggestedPrice.count} {suggestedPrice.count === 1 ? 'ingresso anunciado' : 'ingressos anunciados'} para este evento.
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="section">Setor / Seção</Label>
                                    <Input
                                        id="section"
                                        placeholder="Ex: Pista Premium, VIP"
                                        value={section}
                                        onChange={(e) => setSection(e.target.value)}
                                        disabled={submitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="row">Fila</Label>
                                    <Input
                                        id="row"
                                        placeholder="Ex: A, 10"
                                        value={row}
                                        onChange={(e) => setRow(e.target.value)}
                                        disabled={submitting}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="seat">Assento</Label>
                                    <Input
                                        id="seat"
                                        placeholder="Ex: 15, 22"
                                        value={seat}
                                        onChange={(e) => setSeat(e.target.value)}
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 flex gap-3 text-sm text-amber-500">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p>
                                    Lembre-se: O valor da venda só será liberado após a confirmação de que o ingresso funcionou no evento. Isso garante segurança para todos.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg" className="w-full md:w-auto" disabled={submitting}>
                                {submitting ? "Publicando..." : "Publicar Ingresso"}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}
