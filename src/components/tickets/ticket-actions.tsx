'use client'

import { useState } from 'react'
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit, Trash, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface TicketActionsProps {
    ticketId: string
    currentPrice: number
    currentSection?: string
    currentRow?: string
    currentSeat?: string
}

export function TicketActions({
    ticketId,
    currentPrice,
    currentSection,
    currentRow,
    currentSeat,
}: TicketActionsProps) {
    const router = useRouter()
    const { toast } = useToast()

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [price, setPrice] = useState(currentPrice.toString())
    const [section, setSection] = useState(currentSection || '')
    const [row, setRow] = useState(currentRow || '')
    const [seat, setSeat] = useState(currentSeat || '')

    const handleEdit = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price: parseFloat(price),
                    section: section || null,
                    row: row || null,
                    seat: seat || null,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Erro ao atualizar ingresso')
            }

            toast({
                title: 'Ingresso atualizado!',
                description: 'As alterações foram salvas com sucesso.',
            })

            setIsEditOpen(false)
            router.refresh()
        } catch (error) {
            toast({
                title: 'Erro ao atualizar',
                description: error instanceof Error ? error.message : 'Tente novamente',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Erro ao excluir ingresso')
            }

            toast({
                title: 'Ingresso excluído!',
                description: 'O ingresso foi removido da plataforma.',
            })

            setIsDeleteOpen(false)
            router.refresh()
        } catch (error) {
            toast({
                title: 'Erro ao excluir',
                description: error instanceof Error ? error.message : 'Tente novamente',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => setIsEditOpen(true)}
                >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setIsDeleteOpen(true)}
                >
                    <Trash className="h-3 w-3" />
                </Button>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Ingresso</DialogTitle>
                        <DialogDescription>
                            Atualize as informações do seu ingresso à venda.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Preço (R$) *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="section">Setor / Seção</Label>
                            <Input
                                id="section"
                                value={section}
                                onChange={(e) => setSection(e.target.value)}
                                disabled={isLoading}
                                placeholder="Ex: Pista Premium, VIP"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="row">Fila</Label>
                                <Input
                                    id="row"
                                    value={row}
                                    onChange={(e) => setRow(e.target.value)}
                                    disabled={isLoading}
                                    placeholder="Ex: A, 10"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="seat">Assento</Label>
                                <Input
                                    id="seat"
                                    value={seat}
                                    onChange={(e) => setSeat(e.target.value)}
                                    disabled={isLoading}
                                    placeholder="Ex: 15, 22"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditOpen(false)}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleEdit} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                'Salvar Alterações'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O ingresso será permanentemente removido da plataforma.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                            disabled={isLoading}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Excluindo...
                                </>
                            ) : (
                                'Excluir Ingresso'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
