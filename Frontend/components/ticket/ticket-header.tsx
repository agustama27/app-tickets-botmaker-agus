"use client"

import type { Ticket, TicketStatus, TicketPriority } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { canAssignTickets } from "@/lib/rbac"
import { useAuth } from "@/hooks/use-auth"
import { useUpdateTicket } from "@/hooks/use-tickets"
import { useAreas, useTeams } from "@/hooks/use-structure"
import { toast } from "@/hooks/use-toast"

interface TicketHeaderProps {
  ticket: Ticket
}

const STATUSES: TicketStatus[] = ["open", "pending", "in-progress", "on-hold", "resolved", "closed"]
const PRIORITIES: TicketPriority[] = ["low", "medium", "high", "urgent"]

const getStatusLabel = (status: TicketStatus) => {
  const labels: Record<TicketStatus, string> = {
    open: "Abierto",
    pending: "Pendiente",
    "in-progress": "En Progreso",
    "on-hold": "En Espera",
    resolved: "Resuelto",
    closed: "Cerrado",
  }
  return labels[status]
}

const getPriorityLabel = (priority: TicketPriority) => {
  const labels: Record<TicketPriority, string> = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
    urgent: "Urgente",
  }
  return labels[priority]
}

const getPriorityColor = (priority: TicketPriority) => {
  const colors: Record<TicketPriority, "default" | "secondary" | "destructive" | "outline"> = {
    low: "secondary",
    medium: "default",
    high: "outline",
    urgent: "destructive",
  }
  return colors[priority]
}

export function TicketHeader({ ticket }: TicketHeaderProps) {
  const { user } = useAuth()
  const updateTicketMutation = useUpdateTicket()
  const { data: areas = [] } = useAreas()
  const { data: teams = [] } = useTeams()
  const canAssign = canAssignTickets(user)

  // Find area and team from the data
  const area = ticket.areaId ? areas.find((a) => a.id === ticket.areaId) : null
  const team = ticket.teamId ? teams.find((t) => t.id === ticket.teamId) : null
  // Note: assignedUser info should come from ticket or separate query if needed

  const handleStatusChange = async (value: string) => {
    try {
      await updateTicketMutation.mutateAsync({ id: ticket.id, updates: { status: value as TicketStatus } })
      toast({ title: "Estado actualizado" })
    } catch (error) {
      toast({ title: "Error al actualizar estado", variant: "destructive" })
    }
  }

  const handlePriorityChange = async (value: string) => {
    try {
      await updateTicketMutation.mutateAsync({ id: ticket.id, updates: { priority: value as TicketPriority } })
      toast({ title: "Prioridad actualizada" })
    } catch (error) {
      toast({ title: "Error al actualizar prioridad", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{ticket.subject}</h1>
          <p className="text-sm text-muted-foreground">Ticket #{ticket.id}</p>
        </div>
        <Badge variant={getPriorityColor(ticket.priority)}>{getPriorityLabel(ticket.priority)}</Badge>
      </div>

      <p className="text-sm text-muted-foreground">{ticket.description}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Estado</label>
          <Select value={ticket.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {getStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Prioridad</label>
          <Select value={ticket.priority} onValueChange={handlePriorityChange} disabled={!canAssign}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {getPriorityLabel(priority)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {ticket.assignedToId && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Asignado a</label>
            <div className="flex h-10 items-center rounded-md border bg-background px-3 text-sm">
              {ticket.assignedToId} {/* TODO: Fetch user name if needed */}
            </div>
          </div>
        )}
      </div>

      {(area || team) && (
        <div className="flex gap-2">
          {area && <Badge variant="outline">Área: {area.name}</Badge>}
          {team && <Badge variant="outline">Equipo: {team.name}</Badge>}
        </div>
      )}
    </div>
  )
}
