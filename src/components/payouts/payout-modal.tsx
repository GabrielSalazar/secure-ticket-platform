'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, DollarSign } from 'lucide-react'

interface PayoutModalProps {
    availableBalance: number
}

export function PayoutModal({ availableBalance }: PayoutModalProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [pixKey, setPixKey] = useState('')
    const { toast } = useToast()
    const router = useRouter()

    const handleRequestPayout = async () => {
        if (!pixKey) {
            toast({
                title: 'Chave PIX obrigatória',
                description: 'Por favor, informe uma chave PIX para receber o valor.',
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/payouts/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pixKey }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao solicitar saque')
            }

            toast({
                title: 'Saque solicitado!',
                description: 'O valor será transferido para sua chave PIX em breve.',
            })

            setOpen(false)
            setPixKey('')
            router.refresh()
        } catch (error) {
            toast({
                title: 'Erro ao solicitar',
                description: error instanceof Error ? error.message : 'Tente novamente',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Auto-fill PIX key from profile when modal opens
    useEffect(() => {
        if (open) {
            fetch('/api/users/profile')
                .then(res => res.json())
                .then(data => {
                    if (data && data.pixKey) {
                        setPixKey(data.pixKey)
                    }
                })
                .catch(err => console.error('Error fetching profile:', err))
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={availableBalance <= 0} className="w-full sm:w-auto">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Solicitar Saque
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Solicitar Saque</DialogTitle>
                    <DialogDescription>
                        Transfira saldo disponível para sua conta via PIX.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg border">
                        <span className="text-sm font-medium">Saldo Disponível</span>
                        <span className="text-2xl font-bold text-green-600">
                            R$ {availableBalance.toFixed(2)}
                        </span>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="pixKey">Chave PIX</Label>
                        <Input
                            id="pixKey"
                            placeholder="CPF, Email, Telefone ou Chave Aleatória"
                            value={pixKey}
                            onChange={(e) => setPixKey(e.target.value)}
                            disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                            O valor total disponível será transferido para esta chave.
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleRequestPayout} disabled={isLoading || availableBalance <= 0}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Solicitando...
                            </>
                        ) : (
                            'Confirmar Saque'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
