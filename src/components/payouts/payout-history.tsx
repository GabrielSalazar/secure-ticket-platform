'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Payout {
    id: string
    amount: number
    status: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REJECTED'
    pixKey: string
    createdAt: string | Date
}

interface PayoutHistoryProps {
    payouts: Payout[]
}

export function PayoutHistory({ payouts }: PayoutHistoryProps) {
    if (payouts.length === 0) {
        return null
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Pago</Badge>
            case 'PENDING':
                return <Badge variant="secondary">Pendente</Badge>
            case 'PROCESSING':
                return <Badge variant="outline" className="text-blue-600 border-blue-200">Processando</Badge>
            case 'FAILED':
            case 'REJECTED':
                return <Badge variant="destructive">Falhou</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Histórico de Saques</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {payouts.map((payout) => (
                        <div key={payout.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                            <div>
                                <div className="font-medium">Saque via PIX</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    Chave: {payout.pixKey}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {formatDistanceToNow(new Date(payout.createdAt), { addSuffix: true, locale: ptBR })}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold">- R$ {payout.amount.toFixed(2)}</div>
                                <div className="mt-1">{getStatusBadge(payout.status)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
