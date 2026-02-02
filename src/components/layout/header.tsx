import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Ticket, Search, User } from "lucide-react"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
            <div className="container flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Ticket className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">SecureTicket</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/events" className="text-muted-foreground transition-colors hover:text-foreground">
                        Eventos
                    </Link>
                    <Link href="/sell" className="text-muted-foreground transition-colors hover:text-foreground">
                        Vender Ingressos
                    </Link>
                    <Link href="/how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">
                        Como Funciona
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Buscar</span>
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-2" asChild>
                        <Link href="/login">
                            <User className="h-4 w-4" />
                            <span>Entrar</span>
                        </Link>
                    </Button>
                    <Button size="sm" className="hidden sm:flex" asChild>
                        <Link href="/register">
                            Criar Conta
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
