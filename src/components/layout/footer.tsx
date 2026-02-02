import Link from "next/link"
import { Ticket } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full border-t border-border/40 bg-background">
            <div className="container flex flex-col gap-8 py-8 md:py-12 px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Ticket className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">SecureTicket</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            A plataforma mais segura para comprar e vender ingressos de terceiros.
                            Garantia de entrada ou seu dinheiro de volta.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
                        <div className="flex flex-col gap-2">
                            <h3 className="font-semibold">Plataforma</h3>
                            <Link href="/events" className="text-muted-foreground hover:text-foreground">Eventos</Link>
                            <Link href="/sell" className="text-muted-foreground hover:text-foreground">Vender</Link>
                            <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground">Como Funciona</Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="font-semibold">Suporte</h3>
                            <Link href="/help" className="text-muted-foreground hover:text-foreground">Central de Ajuda</Link>
                            <Link href="/safety" className="text-muted-foreground hover:text-foreground">Segurança</Link>
                            <Link href="/contact" className="text-muted-foreground hover:text-foreground">Fale Conosco</Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="font-semibold">Legal</h3>
                            <Link href="/terms" className="text-muted-foreground hover:text-foreground">Termos de Uso</Link>
                            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacidade</Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border/40 pt-8 text-xs text-muted-foreground">
                    <p>© 2026 SecureTicket. Todos os direitos reservados.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-foreground">Instagram</Link>
                        <Link href="#" className="hover:text-foreground">Twitter</Link>
                        <Link href="#" className="hover:text-foreground">LinkedIn</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
