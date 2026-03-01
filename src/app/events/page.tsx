'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EventCard } from "@/components/events/event-card"
import { EventFilters, FilterValues } from "@/components/events/event-filters"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2, SlidersHorizontal, CalendarX } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('date')
    const [filters, setFilters] = useState<FilterValues>({
        dateFrom: '',
        dateTo: '',
        minPrice: '',
        maxPrice: '',
        category: 'ALL',
        city: '',
        verified: false,
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
            if (filters.category && filters.category !== 'ALL') params.append('category', filters.category)
            if (filters.city) params.append('city', filters.city)
            if (filters.verified) params.append('verified', 'true')
            if (sortBy) params.append('sortBy', sortBy)

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
    }, [searchQuery, filters, sortBy])

    const handleSearch = (value: string) => {
        setSearchQuery(value)
    }

    const handleApplyFilters = (newFilters: FilterValues) => {
        setFilters(newFilters)
    }

    const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
        if (key === 'category') return value !== 'ALL'
        if (key === 'verified') return value === true
        return value !== ''
    }).length

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
                        <div className="flex w-full md:w-auto gap-2 flex-wrap">
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
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Ordenar por" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date">Data mais próxima</SelectItem>
                                    <SelectItem value="price">Menor preço</SelectItem>
                                    <SelectItem value="availability">Mais disponíveis</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="relative">
                                <EventFilters
                                    onApplyFilters={handleApplyFilters}
                                    currentFilters={filters}
                                />
                                {activeFiltersCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                    >
                                        {activeFiltersCount}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground opacity-50" />
                        </div>
                    ) : events.length === 0 ? (
                        <EmptyState
                            icon={CalendarX}
                            title={searchQuery || Object.values(filters).some(v => v !== '') ? "Nenhum evento encontrado" : "Nenhum evento futuro"}
                            description={searchQuery || Object.values(filters).some(v => v !== '')
                                ? 'Tente buscar com termos diferentes ou remover alguns filtros.'
                                : 'No momento não temos eventos agendados. Volte mais tarde!'}
                        />
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
