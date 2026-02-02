'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Save, User, CreditCard } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const profileSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
    phone: z.string().optional(),
    pixKey: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    })

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await fetch('/api/users/profile')
                const data = await response.json()

                if (data) {
                    setValue('name', data.name || '')
                    setValue('phone', data.phone || '')
                    setValue('pixKey', data.pixKey || '')
                }
            } catch (error) {
                console.error('Failed to load profile:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadProfile()
    }, [setValue])

    async function onSubmit(data: ProfileFormValues) {
        setIsSaving(true)
        try {
            const response = await fetch('/api/users/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error('Falha ao atualizar')

            toast({
                title: 'Perfil atualizado',
                description: 'Suas informações foram salvas com sucesso.',
            })
        } catch (error) {
            toast({
                title: 'Erro',
                description: 'Não foi possível salvar as alterações.',
                variant: 'destructive',
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleManageCards = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/stripe/portal', {
                method: 'POST',
            })
            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                throw new Error('Falha ao redirecionar')
            }
        } catch (error) {
            console.error(error)
            toast({
                title: 'Erro',
                description: 'Não foi possível acessar o portal de cartões.',
                variant: 'destructive',
            })
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container max-w-2xl py-10">
            <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle>Dados Pessoais</CardTitle>
                        </div>
                        <CardDescription>
                            Informações básicas da sua conta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone / WhatsApp</Label>
                            <Input id="phone" placeholder="(11) 99999-9999" {...register('phone')} />
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <CardTitle>Dados de Pagamento & Recebimento</CardTitle>
                        </div>
                        <CardDescription>
                            Configure como você paga e recebe por suas vendas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="pixKey">Chave PIX Padrão (Para Recebimentos)</Label>
                            <Input
                                id="pixKey"
                                placeholder="CPF, Email ou Chave Aleatória"
                                {...register('pixKey')}
                            />
                            <p className="text-xs text-muted-foreground">
                                Esta chave será preenchida automaticamente quando você solicitar um saque.
                            </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label>Cartões Salvos</Label>
                            <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Gerenciado com segurança pelo Stripe
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    onClick={handleManageCards}
                                    disabled={isLoading}
                                >
                                    Gerenciar Cartões
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Você poderá salvar cartões durante sua próxima compra.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Salvar Alterações
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
