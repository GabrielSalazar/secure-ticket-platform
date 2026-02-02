"use client"

import { Header } from "@/components/layout/header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HelpPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Central de Ajuda</h1>

                <div className="max-w-2xl mx-auto space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Perguntas Frequentes</h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Como recebo meu ingresso?</AccordionTrigger>
                                <AccordionContent>
                                    Após a confirmação do pagamento, seu ingresso estará disponível na seção "Meus Ingressos".
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>O ingresso é seguro?</AccordionTrigger>
                                <AccordionContent>
                                    Sim! Verificamos todos os ingressos e o vendedor só recebe o dinheiro após a realização do evento.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Tive um problema com meu pedido. O que fazer?</AccordionTrigger>
                                <AccordionContent>
                                    Vá até "Meus Ingressos", encontre o pedido e clique em "Reportar Problema" para abrir uma contestação.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    <section className="bg-muted p-6 rounded-lg text-center">
                        <h2 className="text-lg font-semibold mb-2">Precisa de ajuda com uma compra?</h2>
                        <p className="text-muted-foreground mb-4">
                            Se você teve problemas com um ingresso comprado, inicie uma disputa através da sua lista de ingressos.
                        </p>
                        <Button asChild>
                            <Link href="/my-tickets">Ir para Meus Ingressos</Link>
                        </Button>
                    </section>
                </div>
            </main>
        </div>
    )
}
