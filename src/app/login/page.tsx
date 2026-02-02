import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import Link from "next/link"
import { ArrowLeft, Github, Mail } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border border-border shadow-lg">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h1>
                        <p className="text-sm text-muted-foreground">
                            Entre para acessar seus ingressos e vendas
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="nome@exemplo.com" type="email" required />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Senha</Label>
                                    <Link href="#" className="text-xs text-primary hover:underline">
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <Input id="password" type="password" required />
                            </div>
                            <Button className="w-full" type="submit">
                                Entrar
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Ou continue com
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="w-full">
                                <Github className="mr-2 h-4 w-4" /> Github
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Mail className="mr-2 h-4 w-4" /> Google
                            </Button>
                        </div>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                        Não tem uma conta?{" "}
                        <Link href="/register" className="font-medium text-primary hover:underline">
                            Crie agora
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
