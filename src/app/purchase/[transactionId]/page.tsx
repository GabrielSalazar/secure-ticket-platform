'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, AlertCircle, Calendar, MapPin, Ticket } from 'lucide-react'

interface Transaction {
    id: string
    amount: number
    status: string
    ticket: {
        section?: string
        row?: string
        seat?: string
        event: {
            title: string
            date: string
            location: string
        }
    }
    buyer: {
        name: string
        email: string
    }
}

export default function PurchaseConfirmationPage() {
    const params = useParams()
    const router = useRouter()
    const transactionId = params.transactionId as string

    const [transaction, setTransaction] = useState<Transaction | null>(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchTransaction() {
            try {
                const response = await fetch(`/api/transactions/${transactionId}`)
                if (!response.ok) {
                    throw new Error('Transação não encontrada')
                }
                const data = await response.json()
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

    const handlePayment = async () => {
        setProcessing(true)
        setError(null)

        try {
            const response = await fetch('/api/payment/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transactionId }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao processar pagamento')
            }

            // Redirect to Stripe Checkout
            if (data.sessionUrl) {
                window.location.href = data.sessionUrl
            } else {
                throw new Error('URL de pagamento não disponível')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao processar pagamento')
            setProcessing(false)
        }
    }

    const handleCancel = () => {
        router.back()
    }

    if (loading) {
        return (
            <div className="container max-w-2xl mx-auto py-12 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error && !transaction) {
        return (
            <div className="container max-w-2xl mx-auto py-12">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="mt-4">
                    <Button onClick={() => router.push('/events')} variant="outline">
                        Voltar para Eventos
                    </Button>
                </div>
            </div>
        )
    }

    if (!transaction) {
        return null
    }

    const ticketDetails = [
        transaction.ticket.section && `Setor: ${transaction.ticket.section}`,
        transaction.ticket.row && `Fila: ${transaction.ticket.row}`,
        transaction.ticket.seat && `Assento: ${transaction.ticket.seat}`,
    ].filter(Boolean).join(' • ')

    return (
        <div className="container max-w-2xl mx-auto py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Confirmar Pagamento</CardTitle>
                    <CardDescription>
                        Revise os detalhes da sua compra antes de prosseguir para o pagamento
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Event Details */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Ticket className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{transaction.ticket.event.title}</h3>
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

                    {/* Price Summary */}
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between text-lg font-semibold">
                            <span>Total a Pagar</span>
                            <span className="text-2xl">R$ {transaction.amount.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <Alert>
                        <CreditCard className="h-4 w-4" />
                        <AlertDescription>
                            Você será redirecionado para o Stripe para completar o pagamento de forma segura.
                        </AlertDescription>
                    </Alert>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>

                <CardFooter className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={processing}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handlePayment}
                        disabled={processing}
                        className="flex-1"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Prosseguir para Pagamento
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
