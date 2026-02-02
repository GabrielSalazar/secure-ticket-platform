"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Copy, Facebook, Instagram, Share2, Twitter } from "lucide-react"
import { useState } from "react"

interface ShareEventProps {
    eventName: string
    eventUrl?: string // Optional, defaults to current window location
}

// Custom icons for brands not in Lucide (or specific styling)
function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0 .5-.5l1.4-1.4a.5.5 0 0 0 0-.7l-.7-.7a.5.5 0 0 0-.7 0l-1.4 1.4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5l1.4 1.4a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5l1.4-1.4a.5.5 0 0 0 0-.7l-.7-.7a.5.5 0 0 0-.7 0L14 10a.5.5 0 0 0-.5.5v1" />
            {/* Simplified path for visual similarity or replace with proper svg path if needed for precise brand icon */}
            <path d="M17.5 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z" style={{ opacity: 0 }} />
            {/* Actual WhatsApp Path usually more complex, using simple circle-ish for now or just generic phone */}
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.03 12.03 0 0 0 2.81.57A2 2 0 0 1 22 16.92z" />
        </svg>
    )
}

export function ShareEvent({ eventName }: ShareEventProps) {
    const [copied, setCopied] = useState(false)

    // Safe access to window in client component
    const url = typeof window !== "undefined" ? window.location.href : ""

    const handleCopy = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleWebShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `SecureTicket - ${eventName}`,
                    text: `Confira este evento na SecureTicket: ${eventName}`,
                    url: url,
                })
            } catch (error) {
                console.log("Error sharing:", error)
            }
        }
    }

    // Social Links
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Olha esse evento na SecureTicket: ${eventName} ${url}`)}`
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Olha esse evento na SecureTicket: ${eventName}`)}`

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                    <Share2 className="h-4 w-4" /> Compartilhar Evento
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Compartilhar Evento</DialogTitle>
                    <DialogDescription>
                        Envie este evento para seus amigos nas redes sociais.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <Button variant="outline" className="flex flex-col h-24 gap-2 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/30" asChild>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon className="h-8 w-8 text-green-500" />
                            <span>WhatsApp</span>
                        </a>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-24 gap-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30" asChild>
                        <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-8 w-8 text-blue-600" />
                            <span>Facebook</span>
                        </a>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-24 gap-2 hover:bg-sky-50 hover:text-sky-500 dark:hover:bg-sky-950/30" asChild>
                        <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-8 w-8 text-sky-500" />
                            <span>Twitter / X</span>
                        </a>
                    </Button>

                    {/* Instagram Handling - Usually Mobile Only via Web Share or Manual Copy */}
                    <Button variant="outline" className="flex flex-col h-24 gap-2 hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/30" onClick={handleWebShare}>
                        <Instagram className="h-8 w-8 text-pink-600" />
                        <span>Instagram / Outros</span>
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={url}
                            readOnly
                        />
                    </div>
                    <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
                        {copied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                        <span className="sr-only">Copiar</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
