"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { DollarSign, Ticket, Activity, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const verifyAdminAndFetchData = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push("/login")
                return
            }

            try {
                // Check role
                const userRes = await fetch(`/api/users/${user.id}`)
                if (userRes.ok) {
                    const userData = await userRes.json()
                    if (userData.role !== 'ADMIN') {
                        router.push("/dashboard")
                        return
                    }
                    setIsAdmin(true)
                }

                // Fetch analytics
                const analyticsRes = await fetch('/api/admin/analytics')
                if (analyticsRes.ok) {
                    const analyticsData = await analyticsRes.json()
                    setData(analyticsData)
                }
            } catch (error) {
                console.error("Error loading analytics:", error)
            } finally {
                setLoading(false)
            }
        }

        verifyAdminAndFetchData()
    }, [router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!isAdmin || !data) {
        return null // Will redirect
    }

    const { summary, chartData, topEvents } = data

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Header />
            <main className="flex-1 container py-8 px-4 md:px-6">
                <div className="flex flex-col gap-8">

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Analytics Avançado</h1>
                        <p className="text-muted-foreground">
                            Visão geral do desempenho da plataforma e métricas de vendas.
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {(summary.revenue / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Faturamento bruto transacionado</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ingressos Vendidos</CardTitle>
                                <Ticket className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.soldTickets}</div>
                                <p className="text-xs text-muted-foreground mt-1">Total de conversões</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Estoque Disponível</CardTitle>
                                <Activity className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.availableTickets}</div>
                                <p className="text-xs text-muted-foreground mt-1">Ingressos aguardando venda</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Taxa de Venda</CardTitle>
                                <TrendingUp className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {summary.soldTickets + summary.availableTickets > 0
                                        ? Math.round((summary.soldTickets / (summary.soldTickets + summary.availableTickets)) * 100)
                                        : 0}%
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Vendidos vs Disponíveis</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                        {/* Revenue Chart */}
                        <Card className="lg:col-span-4">
                            <CardHeader>
                                <CardTitle>Faturamento (Últimos 7 dias)</CardTitle>
                                <CardDescription>Receita em R$ gerada por vendas diárias.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-0 h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.2} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `R$${value / 100}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            formatter={(value: number) => [(value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'Faturamento']}
                                        />
                                        <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Top Events List */}
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Eventos em Alta</CardTitle>
                                <CardDescription>Os 5 eventos com mais ingressos vendidos.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {topEvents.length === 0 ? (
                                        <p className="text-sm text-center text-muted-foreground py-10">
                                            Nenhuma venda registrada ainda.
                                        </p>
                                    ) : (
                                        topEvents.map((event: any, index: number) => (
                                            <div key={event.id} className="flex items-center">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mr-4">
                                                    {index + 1}
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                    <p className="text-sm font-medium leading-none line-clamp-1">
                                                        {event.title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {event.soldCount} ingressos vendidos
                                                    </p>
                                                </div>
                                                <div className="font-medium text-emerald-500">
                                                    Alta
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    )
}
