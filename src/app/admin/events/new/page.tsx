"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/events/image-upload"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AlertCircle, CalendarRange } from "lucide-react"

export default function CreateEventPage() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const router = useRouter()
    const { toast } = useToast()
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push("/login?redirect=/admin/events/new")
            } else {
                setUser(user)
            }
            setLoading(false)
        })
    }, [router, supabase.auth])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        if (!user) {
            toast({ title: "Erro", description: "Você precisa estar logado.", variant: "destructive" })
            setSubmitting(false)
            return
        }

        try {
            const dateTime = new Date(`${date}T${time}`).toISOString()

            const response = await fetch('/api/events/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    location,
                    date: dateTime,
                    organizerId: user.id,
                    imageUrl: imageUrl || undefined,
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Erro ao criar evento")
            }

            toast({
                title: "Evento criado com sucesso!",
                description: "O evento já está disponível na plataforma.",
            })

            // Redirecionar para o evento
            router.push(`/events/${data.id}`)
        } catch (error: any) {
            toast({
                title: "Erro ao criar evento",
                description: error.message,
                variant: "destructive"
            })
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-8 px-4 md:px-6 max-w-3xl mx-auto">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Criar Novo Evento</h1>
                        <p className="text-muted-foreground">Adicione um novo evento à plataforma para que os usuários possam vender ingressos para ele.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-8">

                        <div className="space-y-4">
                            <Label>Imagem de Capa do Evento</Label>
                            <ImageUpload
                                value={imageUrl}
                                onChange={setImageUrl}
                                onUploadError={(err) => toast({
                                    variant: "destructive",
                                    title: "Erro no upload",
                                    description: err.message
                                })}
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold border-b pb-2">Informações Básicas</h2>

                            <div className="space-y-2">
                                <Label htmlFor="title">Nome do Evento *</Label>
                                <Input
                                    id="title"
                                    placeholder="Ex: Lollapalooza 2026, Show do Coldplay"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Detalhes sobre o evento, atrações, etc."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    required
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold border-b pb-2">Local e Data</h2>

                            <div className="space-y-2">
                                <Label htmlFor="location">Local (Estádio, Casa de Shows, etc) *</Label>
                                <Input
                                    id="location"
                                    placeholder="Ex: Allianz Parque, São Paulo - SP"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Data *</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Horário *</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Criando Evento..." : "Criar Evento"}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}
