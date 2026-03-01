import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/db"
import { QRCodeSVG } from "qrcode.react"
import { Calendar, MapPin, Download, ArrowLeft, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

interface PageProps {
    params: Promise<{ id: string }>
}

async function getTicketDetails(ticketId: string, userId: string) {
    // Busca o ticket verificando se a transação atrelada a ele pertence ao comprador atual
    // e se o status da transação é COMPLETED.
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: {
            event: true,
            transaction: {
                include: {
                    buyer: true
                }
            }
        }
    })

    if (!ticket) return null

    // Validação de segurança: apenas o comprador pode ver seu próprio QR Code
    if (ticket.status !== 'SOLD' || !ticket.transaction || ticket.transaction.buyerId !== userId) {
        return null
    }

    // Apenas transações confirmadas dão acesso ao ingresso
    if (ticket.transaction.status !== 'COMPLETED') {
        return null
    }

    return ticket
}

export default async function ViewTicketPage({ params }: PageProps) {
    const { id } = await params

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const ticket = await getTicketDetails(id, user.id)

    if (!ticket) {
        notFound()
    }

    const eventDate = new Date(ticket.event.date)
    const formattedDate = eventDate.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    })
    const formattedTime = eventDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })

    // Montando os dados para validar no portão de entrada do evento (exemplo simples)
    const qrCodeData = JSON.stringify({
        ticketId: ticket.id,
        eventId: ticket.eventId,
        buyerId: ticket.transaction?.buyerId,
        hash: ticket.id.substring(0, 10).toUpperCase() // Identificador visual
    })

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Header />
            <main className="flex-1 container py-6 md:py-10 px-4 flex flex-col items-center justify-center">

                <div className="w-full max-w-md mb-6 flex justify-between items-center">
                    <Button variant="ghost" className="gap-2 text-muted-foreground" asChild>
                        <Link href="/my-tickets">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                        </Link>
                    </Button>
                    <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                        <ShieldCheck className="h-4 w-4" />
                        Autêntico
                    </div>
                </div>

                {/* Efeito visual de ticket/bilhete com cantos recortados e linha pontilhada */}
                <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative text-card-foreground">

                    {/* Header do Ingresso (Capa do Evento ou Gradiente) */}
                    <div className="h-32 bg-linear-to-r from-primary/80 to-primary relative p-6 flex items-end">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <h1 className="text-white text-2xl font-bold relative z-10 drop-shadow-md truncate">
                            {ticket.event.title}
                        </h1>
                    </div>

                    {/* Detalhes do Evento */}
                    <div className="p-6 pb-2 space-y-4">
                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold">{formattedDate}</p>
                                    <p className="text-muted-foreground">Abertura: {formattedTime}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold">{ticket.event.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Linha separadora tracejada/recorte estilo bilhete */}
                    <div className="relative flex items-center py-4">
                        <div className="h-6 w-6 rounded-full bg-muted/60 absolute -left-3 border-r border-border shadow-inner"></div>
                        <div className="flex-1 border-t-2 border-dashed border-border mx-3"></div>
                        <div className="h-6 w-6 rounded-full bg-muted/60 absolute -right-3 border-l border-border shadow-inner"></div>
                    </div>

                    {/* Assento & Setor */}
                    <div className="px-6 grid grid-cols-3 gap-2 text-center pb-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Setor</span>
                            <span className="font-bold text-lg">{ticket.section || 'Único'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Fila</span>
                            <span className="font-bold text-lg">{ticket.row || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Assento</span>
                            <span className="font-bold text-lg">{ticket.seat || '-'}</span>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="p-8 pt-4 flex flex-col items-center justify-center bg-card rounded-b-2xl">
                        <div className="p-4 bg-white rounded-xl shadow-xs border border-border">
                            <QRCodeSVG
                                value={qrCodeData}
                                size={200}
                                level={"Q"} // Quality level for error correction
                                includeMargin={false}
                            />
                        </div>
                        <p className="mt-4 text-sm font-mono text-muted-foreground text-center">
                            #{ticket.id.substring(0, 8).toUpperCase()}-{ticket.eventId.substring(0, 4).toUpperCase()}
                        </p>
                        <p className="mt-2 text-xs text-center text-muted-foreground max-w-[250px]">
                            Apresente esta tela visível e com brilho alto na catraca.
                        </p>
                    </div>

                </div>

                {/* Botões de Ação Extras */}
                <div className="w-full max-w-md mt-6 flex justify-center">
                    <Button variant="outline" className="w-full gap-2 rounded-xl" onClick={() => window.print()}>
                        <Download className="h-4 w-4" />
                        Salvar em PDF
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    )
}
