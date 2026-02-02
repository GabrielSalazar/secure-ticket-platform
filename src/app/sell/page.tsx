import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react"

export default function SellPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-8 px-4 md:px-6 max-w-3xl mx-auto">
                <div className="space-y-6">
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className="text-3xl font-bold tracking-tight">Vender Ingressos</h1>
                        <p className="text-muted-foreground">Converta seu ingresso não utilizado em dinheiro com segurança.</p>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm space-y-8">
                        {/* Step 1: Event Details */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                                Detalhes do Evento
                            </h2>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="event">Qual é o evento?</Label>
                                    {/* In a real app, this would be an async select or combobox */}
                                    <Input id="event" placeholder="Buscar evento (ex: Coldplay, Lollapalooza...)" />
                                    <p className="text-xs text-muted-foreground">Se não encontrar, você poderá criar um novo evento.</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-border/50" />

                        {/* Step 2: Upload */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                                Upload do Ingresso
                            </h2>
                            <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-muted/20">
                                <div className="h-12 w-12 rounded-full bg-background border flex items-center justify-center mb-4 text-muted-foreground">
                                    <Upload className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold mb-1">Arraste seu PDF aqui</h3>
                                <p className="text-sm text-muted-foreground mb-4">ou clique para selecionar do computador</p>
                                <Button variant="outline" size="sm">Selecionar Arquivo</Button>
                                <p className="text-xs text-muted-foreground mt-4 max-w-xs">
                                    Aceitamos apenas arquivos .pdf originais. Prints ou fotos não são aceitos por segurança.
                                </p>
                            </div>
                        </div>

                        <div className="h-px bg-border/50" />

                        {/* Step 3: Pricing */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                                Preço e Detalhes
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="original-price">Preço Original (R$)</Label>
                                    <Input id="original-price" type="number" placeholder="0,00" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="selling-price">Preço de Venda (R$)</Label>
                                    <Input id="selling-price" type="number" placeholder="0,00" />
                                    <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Preço dentro do limite justo
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="type">Tipo de Ingresso</Label>
                                    <Select>
                                        <SelectTrigger id="type">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="inteira">Inteira</SelectItem>
                                            <SelectItem value="meia">Meia-Entrada</SelectItem>
                                            <SelectItem value="vip">VIP / Camarote</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="seat">Assento / Setor (Opcional)</Label>
                                    <Input id="seat" placeholder="Ex: Pista Premium, Cadeira Inferior 22..." />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Descrição Adicional (Opcional)</Label>
                                    <Textarea id="description" placeholder="Informações extras para o comprador..." />
                                </div>
                            </div>

                            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 flex gap-3 text-sm text-amber-500">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p>
                                    Lembre-se: O valor da venda só será liberado após a confirmação de que o ingresso funcionou no evento. Isso garante segurança para todos.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button size="lg" className="w-full md:w-auto">
                                Publicar Ingresso
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
