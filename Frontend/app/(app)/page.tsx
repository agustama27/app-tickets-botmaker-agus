"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useTickets } from "@/hooks/use-tickets"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { FiltersBar } from "@/components/kanban/filters-bar"
import type { TicketFilters } from "@/types"
import { getScopeFilter } from "@/lib/rbac"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [filters, setFilters] = useState<TicketFilters>({ scope: "all" })

  const { data: ticketsData, isLoading } = useTickets(filters)
  const tickets = ticketsData?.tickets || []

  const filteredTickets = useMemo(() => {
    let result = [...tickets]

    // Apply scope filter
    const scopeFilters = getScopeFilter(user, filters.scope || "all")
    if (scopeFilters.assignedToId) {
      result = result.filter((t) => t.assignedToId === scopeFilters.assignedToId)
    }
    if (scopeFilters.userId) {
      result = result.filter((t) => t.userId === scopeFilters.userId)
    }

    // Apply priority filter
    if (filters.priority && filters.priority.length > 0) {
      result = result.filter((t) => filters.priority?.includes(t.priority))
    }

    // Apply area filter
    if (filters.areaId && filters.areaId.length > 0) {
      result = result.filter((t) => t.areaId && filters.areaId?.includes(t.areaId))
    }

    // Apply team filter
    if (filters.teamId && filters.teamId.length > 0) {
      result = result.filter((t) => t.teamId && filters.teamId?.includes(t.teamId))
    }

    // Apply assigned filter
    if (filters.assignedToId && filters.assignedToId.length > 0) {
      result = result.filter((t) => t.assignedToId && filters.assignedToId?.includes(t.assignedToId))
    }

    return result
  }, [tickets, filters, user])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tickets de Soporte</h1>
          <p className="text-muted-foreground">Gestiona y monitorea solicitudes de soporte IT</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Ticket
        </Button>
      </div>

      <FiltersBar filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <KanbanBoard tickets={filteredTickets} />
      )}
    </div>
  )
}
