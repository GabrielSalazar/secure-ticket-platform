import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ShieldCheck, Ticket, CreditCard, Upload, UserCheck, Smile } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-20 text-center bg-muted/30">
                    <div className="container px-4 md:px-6 space-y-4">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Como a SecureTicket funciona?</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Nossa missão é tornar a compra e venda de ingressos segura, justa e transparente para todos os fãs.
                        </p>
                    </div>
                </section>

                {/* Buying Process */}
                <section className="py-20 container px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Para Compradores</h2>
                        <p className="text-muted-foreground">Garanta seu lugar no show sem medo de golpes.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Search,
                                title: "1. Encontre o Evento",
                                description: "Busque pelo show ou festival que você quer ir. Listamos apenas eventos verificados."
                            },
                            {
                                icon: ShieldCheck,
                                title: "2. Compre com Segurança",
                                description: "Seu dinheiro fica protegido conosco (Escrow) e só é repassado ao vendedor após o evento."
                            },
                            {
                                icon: Ticket,
                                title: "3. Receba o Ingresso",
                                description: "O download do ingresso é liberado imediatamente após a confirmação da compra."
                            },
                            {
                                icon: Smile,
                                title: "4. Aproveite o Show",
                                description: "Vá ao evento tranquilo. Se tiver qualquer problema, devolvemos 100% do seu dinheiro."
                            }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center space-y-4">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <step.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="font-bold text-xl">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        <Button size="lg" asChild>
                            <Link href="/events">Buscar Ingressos</Link>
                        </Button>
                    </div>
                </section>

                <div className="h-px bg-border/50 container" />

                {/* Selling Process */}
                <section className="py-20 container px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Para Vendedores</h2>
                        <p className="text-muted-foreground">Venda seu ingresso extra de forma ética e recupere seu dinheiro.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                icon: Upload,
                                title: "1. Faça Upload do PDF",
                                description: "Envie o arquivo original do ingresso. Nosso sistema verifica a validade e autenticidade."
                            },
                            {
                                icon: CreditCard,
                                title: "2. Defina o Preço Justo",
                                description: "Estabeleça o valor dentro do limite de preço (Cap) para garantir uma venda ética."
                            },
                            {
                                icon: UserCheck,
                                title: "3. Receba o Pagamento",
                                description: "O valor é liberado para sua conta logo após a realização do evento sem contestações."
                            }
                        ].map((step, i) => (
                            <Card key={i} className="border-border/50 bg-card/50">
                                <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
                                    <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
                                        <step.icon className="h-7 w-7 text-foreground" />
                                    </div>
                                    <h3 className="font-bold text-lg">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/sell">Vender Ingresso</Link>
                        </Button>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {[
                                {
                                    q: "É seguro comprar aqui?",
                                    a: "Sim! Utilizamos tecnologia de ponta para verificar ingressos e retemos o pagamento até que o evento aconteça (Escrow)."
                                },
                                {
                                    q: "Posso cobrar quanto eu quiser?",
                                    a: "Não. Para manter a plataforma justa para fãs, limitamos o valor máximo de revenda (Fair Price Cap)."
                                },
                                {
                                    q: "E se o ingresso não funcionar?",
                                    a: "Nossa garantia cobre 100% do valor. Se houver problemas na entrada, agimos rapidamente para reembolsar você."
                                },
                                {
                                    q: "Quando recebo meu dinheiro como vendedor?",
                                    a: "O pagamento é processado após a data do evento, garantindo que o comprador conseguiu entrar sem problemas."
                                }
                            ].map((faq, i) => (
                                <div key={i} className="space-y-2">
                                    <h3 className="font-bold text-lg">{faq.q}</h3>
                                    <p className="text-muted-foreground">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
