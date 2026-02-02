'use client'

import { useState, useEffect } from 'react'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EventCard } from "@/components/events/event-card"
import { EventFilters, FilterValues } from "@/components/events/event-filters"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState<FilterValues>({
        dateFrom: '',
        dateTo: '',
        minPrice: '',
        maxPrice: '',
    })

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()

            if (searchQuery) params.append('search', searchQuery)
            if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
            if (filters.dateTo) params.append('dateTo', filters.dateTo)
            if (filters.minPrice) params.append('minPrice', filters.minPrice)
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)

            const queryString = params.toString()
            const url = `/api/events${queryString ? `?${queryString}` : ''}`

            const res = await fetch(url, {
                cache: 'no-store',
            })

            if (!res.ok) {
                throw new Error('Failed to fetch events')
            }

            const data = await res.json()
            setEvents(data)
        } catch (error) {
            console.error('Error fetching events:', error)
            setEvents([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [searchQuery, filters])

    const handleSearch = (value: string) => {
        setSearchQuery(value)
    }

    const handleApplyFilters = (newFilters: FilterValues) => {
        setFilters(newFilters)
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-8 px-4 md:px-6">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Próximos Eventos</h1>
                            <p className="text-muted-foreground">Encontre ingressos para os melhores shows e festivais.</p>
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar eventos, artistas ou locais..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            <EventFilters
                                onApplyFilters={handleApplyFilters}
                                currentFilters={filters}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                {searchQuery || Object.values(filters).some(v => v !== '')
                                    ? 'Nenhum evento encontrado com os filtros aplicados.'
                                    : 'Nenhum evento disponível no momento.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {events.map((event: any) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
