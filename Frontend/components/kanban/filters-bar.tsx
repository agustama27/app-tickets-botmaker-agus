"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"
import type { TicketPriority, TicketFilters } from "@/types"
import { useAreas, useTeams } from "@/hooks/use-structure"

interface FiltersBarProps {
  filters: TicketFilters
  onFiltersChange: (filters: TicketFilters) => void
}

export function FiltersBar({ filters, onFiltersChange }: FiltersBarProps) {
  const [searchQuery, setSearchQuery] = useState(filters.q || "")

  const { areas } = useAreas()
  const { teams } = useTeams()

  // Filter teams by selected area
  const filteredTeams = filters.areaId?.[0] ? teams.filter((team) => team.areaId === filters.areaId?.[0]) : teams

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, q: searchQuery })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleReset = () => {
    setSearchQuery("")
    onFiltersChange({ scope: "all" })
  }

  const hasActiveFilters = !!(
    filters.q ||
    filters.status?.length ||
    filters.priority?.length ||
    filters.areaId?.length ||
    filters.teamId?.length ||
    (filters.scope && filters.scope !== "all")
  )

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">Filtros</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="ml-auto h-7 px-2">
            <X className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select
          value={filters.scope || "all"}
          onValueChange={(value) => onFiltersChange({ ...filters, scope: value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Alcance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Tickets</SelectItem>
            <SelectItem value="my-area">Mi Área</SelectItem>
            <SelectItem value="my-team">Mi Equipo</SelectItem>
            <SelectItem value="assigned-to-me">Asignados a Mí</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.areaId?.[0] || "all"}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, areaId: value === "all" ? undefined : [value], teamId: undefined })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Áreas</SelectItem>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priority?.[0] || "all"}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, priority: value === "all" ? undefined : [value as TicketPriority] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Prioridades</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Media</SelectItem>
            <SelectItem value="low">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
