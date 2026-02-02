"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            // Sign up with Supabase
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                    },
                },
            })

            if (signUpError) {
                setError(translateAuthError(signUpError.message))
                setLoading(false)
                return
            }

            if (data.user) {
                // Create user in our database via API
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        name,
                        password, // Send password as backup for API fallback logic
                        userId: data.user.id
                    }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    setError(errorData.error || 'Erro ao criar perfil')
                    setLoading(false)
                    return
                }

                // Redirect to login or home
                router.push("/login")
            }
        } catch (err) {
            setError("Ocorreu um erro ao criar a conta")
        } finally {
            setLoading(false)
        }
    }

    function translateAuthError(error: string) {
        if (error.includes("rate limit")) return "Muitas tentativas. Por favor, aguarde um momento."
        if (error.includes("already registered")) return "Este email já está cadastrado."
        if (error.includes("Password should be")) return "A senha deve ter pelo menos 6 caracteres."
        return "Ocorreu um erro ao criar a conta. Tente novamente."
    }


    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border border-border shadow-lg">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">Criar conta</h1>
                        <p className="text-sm text-muted-foreground">
                            Comece a comprar e vender ingressos com segurança
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-md">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome completo</Label>
                                <Input
                                    id="name"
                                    placeholder="João Silva"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="nome@exemplo.com"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Mínimo de 6 caracteres
                                </p>
                            </div>
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? "Criando conta..." : "Criar conta"}
                            </Button>
                        </form>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Faça login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
