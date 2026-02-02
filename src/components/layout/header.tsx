"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Ticket, Search, User, LogOut, Menu, Ticket as TicketIcon, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { User as SupabaseUser } from "@supabase/supabase-js"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useRouter } from "next/navigation"

export function Header() {
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // Get initial user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
            <div className="container flex h-14 md:h-16 max-w-7xl items-center justify-between px-4 md:px-6 gap-2">
                <Link href="/" className="flex items-center gap-1.5 md:gap-2 shrink-0">
                    <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Ticket className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <span className="text-base md:text-lg font-bold tracking-tight">SecureTicket</span>
                </Link>
                <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">
                    <Link href="/events" className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap">
                        Eventos
                    </Link>
                    <Link href="/sell" className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap">
                        Vender Ingressos
                    </Link>
                    <Link href="/how-it-works" className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap">
                        Como Funciona
                    </Link>
                </nav>
                <div className="flex items-center gap-2 md:gap-4">
                    <Button variant="ghost" size="icon" className="hidden sm:flex shrink-0">
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Buscar</span>
                    </Button>

                    {loading ? (
                        <div className="h-8 md:h-9 w-16 md:w-20 animate-pulse bg-muted rounded" />
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="gap-1.5 md:gap-2 h-9">
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline text-sm truncate max-w-[100px]">{user.email?.split('@')[0]}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">Meu Perfil</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard">Dashboard</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/my-tickets">Meus Ingressos</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/my-sales">Minhas Vendas</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button size="sm" variant="ghost" className="gap-1.5 md:gap-2 h-9" asChild>
                                <Link href="/login">
                                    <User className="h-4 w-4" />
                                    <span className="text-sm">Entrar</span>
                                </Link>
                            </Button>
                            <Button size="sm" className="hidden sm:flex h-9 text-sm" asChild>
                                <Link href="/register">
                                    Criar Conta
                                </Link>
                            </Button>
                        </>
                    )}

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <nav className="flex flex-col gap-2">
                                    <Link href="/events" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors">
                                        <Ticket className="h-5 w-5" />
                                        Eventos
                                    </Link>
                                    <Link href="/sell" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors">
                                        <Ticket className="h-5 w-5 rotate-45" />
                                        Vender Ingressos
                                    </Link>
                                    <Link href="/how-it-works" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors">
                                        <Search className="h-5 w-5" />
                                        Como Funciona
                                    </Link>
                                    {user && (
                                        <>
                                            <div className="h-px bg-border my-2" />
                                            <Link href="/my-tickets" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors">
                                                <TicketIcon className="h-5 w-5" />
                                                Meus Ingressos
                                            </Link>
                                            <Link href="/my-sales" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors">
                                                <DollarSign className="h-5 w-5" />
                                                Minhas Vendas
                                            </Link>
                                        </>
                                    )}
                                </nav>
                                {!user && (
                                    <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                                        <Button className="w-full" asChild>
                                            <Link href="/login">Entrar</Link>
                                        </Button>
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href="/register">Criar Conta</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
