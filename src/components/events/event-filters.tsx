'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SlidersHorizontal } from 'lucide-react'

interface EventFiltersProps {
    onApplyFilters: (filters: FilterValues) => void
    currentFilters: FilterValues
}

export interface FilterValues {
    dateFrom: string
    dateTo: string
    minPrice: string
    maxPrice: string
}

export function EventFilters({ onApplyFilters, currentFilters }: EventFiltersProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState<FilterValues>(currentFilters)

    const handleApply = () => {
        onApplyFilters(filters)
        setIsOpen(false)
    }

    const handleClear = () => {
        const emptyFilters: FilterValues = {
            dateFrom: '',
            dateTo: '',
            minPrice: '',
            maxPrice: '',
        }
        setFilters(emptyFilters)
        onApplyFilters(emptyFilters)
        setIsOpen(false)
    }

    const hasActiveFilters = Object.values(currentFilters).some(v => v !== '')

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className={hasActiveFilters ? 'border-primary' : ''}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Filtrar Eventos</DialogTitle>
                    <DialogDescription>
                        Refine sua busca usando os filtros abaixo.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Período do Evento</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label htmlFor="dateFrom" className="text-xs text-muted-foreground">
                                    De
                                </Label>
                                <Input
                                    id="dateFrom"
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="dateTo" className="text-xs text-muted-foreground">
                                    Até
                                </Label>
                                <Input
                                    id="dateTo"
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Faixa de Preço (R$)</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                                    Mínimo
                                </Label>
                                <Input
                                    id="minPrice"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    step="10"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                                    Máximo
                                </Label>
                                <Input
                                    id="maxPrice"
                                    type="number"
                                    placeholder="1000"
                                    min="0"
                                    step="10"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto">
                        Limpar Filtros
                    </Button>
                    <Button onClick={handleApply} className="w-full sm:w-auto">
                        Aplicar Filtros
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
