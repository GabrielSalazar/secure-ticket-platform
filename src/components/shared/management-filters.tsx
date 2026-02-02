'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X, Calendar } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

interface ManagementFiltersProps {
    showStatusFilter?: boolean;
    statusOptions?: { label: string, value: string }[];
}

export function ManagementFilters({ showStatusFilter = false, statusOptions = [] }: ManagementFiltersProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [status, setStatus] = useState(searchParams.get('status') || 'ALL')
    const [dateFrom, setDateFrom] = useState(searchParams.get('dateFrom') || '')
    const [dateTo, setDateTo] = useState(searchParams.get('dateTo') || '')

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (search) params.set('search', search)
        else params.delete('search')

        if (status && status !== 'ALL') params.set('status', status)
        else params.delete('status')

        if (dateFrom) params.set('dateFrom', dateFrom)
        else params.delete('dateFrom')

        if (dateTo) params.set('dateTo', dateTo)
        else params.delete('dateTo')

        router.push(`${pathname}?${params.toString()}`)
    }

    const clearFilters = () => {
        setSearch('')
        setStatus('ALL')
        setDateFrom('')
        setDateTo('')
        router.push(pathname)
    }

    const activeFiltersCount = [
        search && 'search',
        status !== 'ALL' && 'status',
        dateFrom && 'dateFrom',
        dateTo && 'dateTo'
    ].filter(Boolean).length

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (searchParams.get('search') || '')) {
                applyFilters()
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome do evento..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    {showStatusFilter && (
                        <Select value={status} onValueChange={(val) => { setStatus(val); applyFilters(); }}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos os Status</SelectItem>
                                {statusOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="flex gap-2">
                                <Calendar className="h-4 w-4" />
                                <span className="hidden sm:inline">Data</span>
                                {(dateFrom || dateTo) && <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-5">!</Badge>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4" align="end">
                            <div className="space-y-4">
                                <h4 className="font-medium leading-none">Filtrar por data</h4>
                                <div className="grid gap-2">
                                    <div className="grid gap-1">
                                        <label className="text-xs text-muted-foreground">De</label>
                                        <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs text-muted-foreground">Até</label>
                                        <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => { setDateFrom(''); setDateTo(''); }}>Limpar</Button>
                                    <Button size="sm" onClick={applyFilters}>Aplicar</Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="icon" onClick={clearFilters} title="Limpar todos os filtros">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
