'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PurchaseButtonProps {
    ticketId: string
    sellerId: string
    price: number
    section?: string
    row?: string
    seat?: string
    eventTitle: string
    sellerName?: string
}

export function PurchaseButton({
    ticketId,
    sellerId,
    price,
    section,
    row,
    seat,
    eventTitle,
    sellerName,
}: PurchaseButtonProps) {
    const router = useRouter()
    const supabase = createClient()
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isPurchasing, setIsPurchasing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setCurrentUserId(user?.id || null)
        })
    }, [])

    const isOwnTicket = currentUserId === sellerId

    const handlePurchase = async () => {
        setIsPurchasing(true)
        setError(null)

        try {
            const response = await fetch('/api/tickets/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ticketId }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao processar compra')
            }

            // Redirect to purchase confirmation page
            router.push(`/purchase/${data.transaction.id}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao processar compra')
            setIsPurchasing(false)
        }
    }

    const ticketDetails = [
        section && `Setor: ${section}`,
        row && `Fila: ${row}`,
        seat && `Assento: ${seat}`,
    ].filter(Boolean).join(' • ')

    return (
        <>
            <Button
                onClick={() => setIsDialogOpen(true)}
                disabled={isOwnTicket}
                title={isOwnTicket ? 'Você não pode comprar seu próprio ingresso' : ''}
            >
                {isOwnTicket ? 'Seu Ingresso' : 'Comprar'}
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirmar Compra</DialogTitle>
                        <DialogDescription>
                            Revise os detalhes do ingresso antes de confirmar.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <h4 className="font-semibold">{eventTitle}</h4>
                            {ticketDetails && (
                                <p className="text-sm text-muted-foreground">
                                    {ticketDetails}
                                </p>
                            )}
                            {sellerName && (
                                <p className="text-sm text-muted-foreground">
                                    Vendedor: {sellerName}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                            <span className="font-semibold">Total:</span>
                            <span className="text-2xl font-bold">
                                R$ {price.toFixed(2)}
                            </span>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isPurchasing}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handlePurchase}
                            disabled={isPurchasing}
                        >
                            {isPurchasing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                'Confirmar Compra'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
