"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { RefreshCcw, Database, CheckCircle2, AlertCircle, Server } from "lucide-react"

export default function IntegrationsPage() {
    const [syncing, setSyncing] = useState(false)
    const [results, setResults] = useState<any>(null)
    const { toast } = useToast()

    const handleSync = async () => {
        setSyncing(true)
        setResults(null)

        try {
            const response = await fetch('/api/admin/events/sync', {
                method: 'POST',
                // Sincronização de múltiplas cidades pode demorar, removemos o timeout padrão do fetch se possível
            })
            const data = await response.json()

            if (response.ok) {
                setResults(data)
                toast({
                    title: "Sincronização concluída",
                    description: "Eventos importados e consolidados com sucesso.",
                })
            } else {
                throw new Error(data.error || "Erro ao sincronizar")
            }
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Falha na sincronização",
                description: err.message,
            })
        } finally {
            setSyncing(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Header />
            <main className="flex-1 container py-8 px-4 md:px-6 max-w-5xl">
                <div className="flex flex-col gap-8">

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Central de Integrações</h1>
                        <p className="text-muted-foreground">
                            Gerencie as conexões com APIs externas para importação automática de eventos.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">

                        {/* Ticketmaster Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Server className="h-5 w-5" />
                                        Ticketmaster API
                                    </CardTitle>
                                    <CardDescription>
                                        Importa grandes shows, eventos esportivos e espetáculos teatrais.
                                    </CardDescription>
                                </div>
                                <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Ativo
                                </Badge>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="text-sm space-y-2 text-muted-foreground/80">
                                    <p>• Suporte a categorias: Música, Esportes, Teatro</p>
                                    <p>• Mapeamento de assentos: Não mapeado</p>
                                    <p>• Cidades base: SP, RJ, BH, CWB, BSB</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Eventbrite Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Database className="h-5 w-5" />
                                        Eventbrite API
                                    </CardTitle>
                                    <CardDescription>
                                        Importa festas, palestras, cursos e eventos independentes.
                                    </CardDescription>
                                </div>
                                <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Ativo
                                </Badge>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="text-sm space-y-2 text-muted-foreground/80">
                                    <p>• Suporte a categorias: Corporativos, Festivais, Diversos</p>
                                    <p>• Mapeamento de assentos: N/A</p>
                                    <p>• Cidades base: Raio populacional do BR</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sync Action Area */}
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle>Sincronização Manual</CardTitle>
                            <CardDescription>
                                O acionamento manual buscará os eventos mais recentes nas 5 principais capitais do Brasil e atualizará a base de dados em tempo real. Esta operação pode demorar até 15 segundos.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex flex-col items-start gap-4">
                            <Button size="lg" onClick={handleSync} disabled={syncing} className="w-full sm:w-auto">
                                <RefreshCcw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                                {syncing ? 'Varrendo APIs Externas...' : 'Iniciar Sincronização Agora'}
                            </Button>

                            {/* Results Display */}
                            {results && results.stats && (
                                <div className="w-full mt-4 p-4 rounded-lg bg-background border grid gap-4 grid-cols-2 lg:grid-cols-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Ciclos (Cidades)</p>
                                        <p className="text-2xl font-bold">{results.stats.citiesProcessed}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Ticketmaster Adds</p>
                                        <p className="text-2xl font-bold text-emerald-600">+{results.stats.ticketmaster.imported}</p>
                                        {results.stats.ticketmaster.errors > 0 && <p className="text-xs text-red-500">{results.stats.ticketmaster.errors} falhas</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Eventbrite Adds</p>
                                        <p className="text-2xl font-bold text-blue-600">+{results.stats.eventbrite.imported}</p>
                                        {results.stats.eventbrite.errors > 0 && <p className="text-xs text-red-500">{results.stats.eventbrite.errors} falhas</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Status Geral</p>
                                        <Badge variant="outline" className="text-emerald-500 border-emerald-200 bg-emerald-50 mt-1">Concluído</Badge>
                                    </div>
                                </div>
                            )}
                        </CardFooter>
                    </Card>

                </div>
            </main>
            <Footer />
        </div>
    )
}
