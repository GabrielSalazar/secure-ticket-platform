'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Loader2, AlertCircle, Calendar, MapPin, Ticket, Download } from 'lucide-react'
import Link from 'next/link'

interface Transaction {
    id: string
    amount: number
    status: string
    createdAt: string
    ticket: {
        id: string
        section?: string
        row?: string
        seat?: string
        event: {
            title: string
            date: string
            location: string
        }
    }
}

export default function PurchaseSuccessPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const transactionId = params.transactionId as string
    const sessionId = searchParams.get('session_id')

    const [transaction, setTransaction] = useState<Transaction | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchTransaction() {
            try {
                const response = await fetch(`/api/transactions/${transactionId}`)
                if (!response.ok) {
                    throw new Error('Transação não encontrada')
                }
                const data = await response.json()

                // Verify transaction is completed
                if (data.status !== 'COMPLETED') {
                    setError('Esta transação ainda não foi confirmada. Por favor, aguarde.')
                }

                setTransaction(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar transação')
            } finally {
                setLoading(false)
            }
        }

        if (transactionId) {
            fetchTransaction()
        }
    }, [transactionId])

    if (loading) {
        return (
            <div className="container max-w-2xl mx-auto py-12 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error || !transaction) {
        return (
            <div className="container max-w-2xl mx-auto py-12">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error || 'Transação não encontrada'}</AlertDescription>
                </Alert>
                <div className="mt-4">
                    <Button onClick={() => router.push('/events')} variant="outline">
                        Voltar para Eventos
                    </Button>
                </div>
            </div>
        )
    }

    const ticketDetails = [
        transaction.ticket.section && `Setor: ${transaction.ticket.section}`,
        transaction.ticket.row && `Fila: ${transaction.ticket.row}`,
        transaction.ticket.seat && `Assento: ${transaction.ticket.seat}`,
    ].filter(Boolean).join(' • ')

    return (
        <div className="container max-w-2xl mx-auto py-12">
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Compra Realizada com Sucesso!</CardTitle>
                    <CardDescription>
                        Seu ingresso foi adquirido e está disponível em "Meus Ingressos"
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Transaction Info */}
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">ID da Transação</span>
                            <span className="font-mono">{transaction.id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Data da Compra</span>
                            <span>
                                {new Date(transaction.createdAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                            <span>Total Pago</span>
                            <span>R$ {transaction.amount.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Ticket className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold">{transaction.ticket.event.title}</h3>
                                {ticketDetails && (
                                    <p className="text-sm text-muted-foreground mt-1">{ticketDetails}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Data do Evento</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(transaction.ticket.event.date).toLocaleDateString('pt-BR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Local</p>
                                <p className="text-sm text-muted-foreground">{transaction.ticket.event.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Um e-mail de confirmação foi enviado para você com todos os detalhes da compra.
                        </AlertDescription>
                    </Alert>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                    <Button asChild className="w-full">
                        <Link href="/my-tickets">
                            <Ticket className="mr-2 h-4 w-4" />
                            Ver Meus Ingressos
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/events">
                            Buscar Mais Eventos
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
