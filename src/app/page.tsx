import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ShieldCheck, Banknote, RefreshCcw, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 md:py-20 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          <div className="container relative z-10 flex flex-col items-center text-center gap-6 md:gap-8 px-6 md:px-8">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs md:text-sm font-medium text-primary backdrop-blur-xl">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              A Revolução na Revenda de Ingressos
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent max-w-4xl px-2">
              Compre e Venda Ingressos com <span className="text-primary">Segurança Total</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl px-4">
              A plataforma ética onde fãs trocam ingressos. Preço justo, verificação anti-fraude e garantia de que você vai entrar no evento.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full max-w-md sm:max-w-none justify-center px-4">
              <Button size="lg" className="rounded-full text-sm md:text-base h-11 md:h-12 px-6 md:px-8 w-full sm:w-auto" asChild>
                <Link href="/events">
                  Buscar Ingressos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-sm md:text-base h-11 md:h-12 px-6 md:px-8 w-full sm:w-auto" asChild>
                <Link href="/sell">
                  Vender Ingresso
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8 md:pt-10 text-center w-full px-4">
              {[
                { label: "Usuários Ativos", value: "50k+" },
                { label: "Ingressos Vendidos", value: "120k+" },
                { label: "Eventos", value: "2k+" },
                { label: "Fraudes", value: "0" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-xs md:text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container px-6 md:px-8 space-y-8 md:space-y-12">
            <div className="text-center space-y-3 md:space-y-4 max-w-2xl mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Por que usar a SecureTicket?</h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Resolvemos os maiores problemas da revenda de ingressos: preços abusivos, golpes e falta de garantia.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "Segurança Garantida",
                  description: "Todos os ingressos são verificados. O vendedor só recebe após o evento ocorrer ou a validação ser confirmada."
                },
                {
                  icon: Banknote,
                  title: "Preço Justo (Fair Price Cap)",
                  description: "Limitamos o ágio na revenda. Nada de pagar 3x o valor original. Uma plataforma feita de fãs para fãs."
                },
                {
                  icon: RefreshCcw,
                  title: "Reembolso Fácil",
                  description: "Se o evento for cancelado ou houver qualquer problema com o ingresso, seu dinheiro é devolvido integralmente."
                }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center text-center p-5 md:p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                    <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Events (Placeholder) */}
        <section className="py-12 md:py-20">
          <div className="container px-6 md:px-8 space-y-8 md:space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="space-y-1 md:space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Próximos Grandes Eventos</h2>
                <p className="text-sm md:text-base text-muted-foreground">Ingressos disputados disponíveis agora.</p>
              </div>
              <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                <Link href="/events" className="group">
                  Ver todos <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:border-primary/50">
                  <div className="aspect-[4/3] w-full bg-muted relative">
                    {/* Placeholder Logic for Image */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50">
                      <span className="text-sm">Imagem do Evento {i}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold leading-none group-hover:text-primary transition-colors">Festival de Verão 2026</h3>
                      <p className="text-sm text-muted-foreground">22 de Fev • Allianz Parque</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        12 ingressos
                      </div>
                      <span className="font-bold text-lg">R$ 250</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
