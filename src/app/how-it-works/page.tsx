
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, CreditCard, Lock, Search, ShieldCheck, Ticket, Users, Upload, UserCheck, Smile } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-20 text-center bg-muted/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                    <div className="container px-4 md:px-6 space-y-4 relative z-10">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Segurança em Primeiro Lugar
                        </div>
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                            Como funciona a SecureTicket
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Eliminamos os golpes e o cambismo abusivo. Uma plataforma onde fãs protegem fãs.
                        </p>
                    </div>
                </section>

                {/* Central Flowchart */}
                <section className="py-24 container px-4 md:px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4">
                            Passo a Passo
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
                            O Ciclo de Segurança
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Nosso sistema de Escrow (Garantia) assegura que o vendedor só recebe quando você entra no evento.
                        </p>
                    </div>

                    <div className="relative max-w-5xl mx-auto">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 -translate-y-1/2 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                            {[
                                {
                                    icon: Ticket,
                                    step: "1",
                                    title: "Anúncio",
                                    desc: "Vendedor anuncia ingresso verificado."
                                },
                                {
                                    icon: Search,
                                    step: "2",
                                    title: "Compra",
                                    desc: "Comprador paga e o valor fica retido."
                                },
                                {
                                    icon: Lock,
                                    step: "3",
                                    title: "Proteção",
                                    desc: "Dinheiro guardado no cofre (Escrow)."
                                },
                                {
                                    icon: Users,
                                    step: "4",
                                    title: "Evento",
                                    desc: "O comprador vai ao show tranquilo."
                                },
                                {
                                    icon: CheckCircle2,
                                    step: "5",
                                    title: "Liberação",
                                    desc: "Vendedor recebe o pagamento após o show."
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center group">
                                    <div className="h-16 w-16 rounded-full bg-background border-4 border-primary/20 group-hover:border-primary transition-all duration-300 flex items-center justify-center mb-6 relative shadow-lg group-hover:shadow-primary/20">
                                        <item.icon className="h-7 w-7 text-foreground group-hover:text-primary transition-colors" />
                                        <div className="absolute -top-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                    <p className="text-sm text-center text-muted-foreground px-2">
                                        {item.desc}
                                    </p>

                                    {/* Mobile connector */}
                                    {i !== 4 && (
                                        <div className="md:hidden h-8 w-0.5 bg-border my-4" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="h-px bg-border/50 container" />

                {/* Buying Process (Detailed) */}
                <section className="py-20 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-3 mb-6">
                                <Search className="h-10 w-10 text-primary" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                                    Para Compradores
                                </span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Garanta seu lugar no show sem medo de golpes. O processo é simples e 100% seguro.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: Search,
                                    title: "1. Encontre",
                                    description: "Busque pelo show ou festival que você quer ir. Listamos apenas eventos verificados."
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "2. Pague",
                                    description: "Seu dinheiro fica protegido conosco (Escrow) e só é repassado ao vendedor após o evento."
                                },
                                {
                                    icon: Ticket,
                                    title: "3. Receba",
                                    description: "O download do ingresso é liberado imediatamente após a confirmação da compra."
                                },
                                {
                                    icon: Smile,
                                    title: "4. Curta",
                                    description: "Vá ao evento tranquilo. Se tiver qualquer problema, devolvemos 100% do seu dinheiro."
                                }
                            ].map((step, i) => (
                                <Card key={i} className="border-border/50 bg-background hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <CardContent className="flex flex-col items-center text-center p-6 space-y-4 pt-8">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <step.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="font-bold text-lg">{step.title}</h3>
                                        <p className="text-sm text-muted-foreground">{step.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="flex justify-center mt-12">
                            <Button size="lg" className="h-12 px-8 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-full bg-gradient-to-r from-primary to-purple-600 hover:scale-105" asChild>
                                <Link href="/events">Buscar Ingressos</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-border/50 container" />

                {/* Selling Process (Detailed) */}
                <section className="py-20 container px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-3 mb-6">
                            <Ticket className="h-10 w-10 text-blue-500" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
                                Para Vendedores
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Venda seu ingresso extra de forma ética, rápida e recupere seu dinheiro.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                icon: Upload,
                                title: "1. Upload do PDF",
                                description: "Envie o arquivo original. Nosso sistema verifica a autenticidade automaticamente."
                            },
                            {
                                icon: CreditCard,
                                title: "2. Preço Justo",
                                description: "Defina o valor dentro do limite (Cap) para garantir uma venda ética."
                            },
                            {
                                icon: UserCheck,
                                title: "3. Receba Rápido",
                                description: "O valor é liberado para sua conta logo após a realização do evento."
                            }
                        ].map((step, i) => (
                            <Card key={i} className="border-border/50 bg-secondary/20 hover:bg-secondary/30 transition-all border-blue-500/10 hover:border-blue-500/30 hover:shadow-lg hover:-translate-y-1">
                                <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
                                    <div className="h-14 w-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <step.icon className="h-7 w-7 text-blue-500" />
                                    </div>
                                    <h3 className="font-bold text-lg">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        <Button size="lg" className="h-12 px-8 text-lg font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 text-white border-0" asChild>
                            <Link href="/sell">Vender Ingresso</Link>
                        </Button>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 text-center container px-4">
                    <div className="bg-primary text-primary-foreground rounded-2xl p-12 relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-3xl font-bold">Pronto para a próxima experiência?</h2>
                            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
                                Junte-se a milhares de fãs que compram e vendem com segurança total.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button size="lg" variant="secondary" className="h-12 px-8 text-lg font-bold shadow-xl hover:scale-105 transition-all" asChild>
                                    <Link href="/register">Criar Conta Grátis</Link>
                                </Button>
                            </div>
                        </div>
                        {/* Abstract shapes */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
