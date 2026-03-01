import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    action?: ReactNode
    className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-16 px-4 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/25 text-center transition-all hover:bg-muted/50", className)}>
            <div className="bg-primary/5 p-5 rounded-full mb-5 ring-8 ring-primary/5">
                <Icon className="h-10 w-10 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm">
                {description}
            </p>
            {action && (
                <div className="flex justify-center">
                    {action}
                </div>
            )}
        </div>
    )
}
