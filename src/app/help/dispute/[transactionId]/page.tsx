"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DisputePage({ params }: { params: { transactionId: string } }) {
    const [reason, setReason] = useState("INVALID_TICKET")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/disputes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transactionId: params.transactionId,
                    reason,
                    description,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Erro ao criar disputa")
            }

            toast({
                title: "Disputa aberta com sucesso",
                description: "Analisaremos seu caso e entraremos em contato.",
            })

            router.push("/my-tickets")
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: error.message,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Contestar Pedido</CardTitle>
                        <CardDescription>
                            Conte-nos o que houve com o pedido #{params.transactionId.slice(-6)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <Label>Motivo</Label>
                                <RadioGroup value={reason} onValueChange={setReason} className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="INVALID_TICKET" id="r1" />
                                        <Label htmlFor="r1">Ingresso Inválido / Não Funcionou</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="EVENT_CANCELLED" id="r2" />
                                        <Label htmlFor="r2">Evento Cancelado</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="OTHER" id="r3" />
                                        <Label htmlFor="r3">Outro Problema</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desc">Descrição Detalhada</Label>
                                <Textarea
                                    id="desc"
                                    placeholder="Explique o que aconteceu..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
                                    Voltar
                                </Button>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Enviar Contestação
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
