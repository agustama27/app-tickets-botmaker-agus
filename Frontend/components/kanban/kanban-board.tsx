"use client"

import { useState, useMemo } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Ticket, TicketStatus } from "@/types"
import { KanbanColumn } from "./kanban-column"
import { TicketCard } from "./ticket-card"
import { useTickets } from "@/hooks/use-mock-tickets"
import { toast } from "@/hooks/use-toast"

interface KanbanBoardProps {
  tickets: Ticket[]
}

const COLUMNS: { id: TicketStatus; label: string }[] = [
  { id: "open", label: "Abierto" },
  { id: "pending", label: "Pendiente" },
  { id: "in-progress", label: "En Progreso" },
  { id: "on-hold", label: "En Espera" },
  { id: "resolved", label: "Resuelto" },
  { id: "closed", label: "Cerrado" },
]

export function KanbanBoard({ tickets }: KanbanBoardProps) {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
  const { updateTicket } = useTickets()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const ticketsByStatus = useMemo(() => {
    const groups: Record<TicketStatus, Ticket[]> = {
      open: [],
      pending: [],
      "in-progress": [],
      "on-hold": [],
      resolved: [],
      closed: [],
    }

    tickets.forEach((ticket) => {
      groups[ticket.status].push(ticket)
    })

    return groups
  }, [tickets])

  const handleDragStart = (event: DragStartEvent) => {
    const ticket = tickets.find((t) => t.id === event.active.id)
    setActiveTicket(ticket || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTicket(null)

    if (!over) return

    const ticketId = active.id as string
    const newStatus = over.id as TicketStatus

    const ticket = tickets.find((t) => t.id === ticketId)
    if (!ticket || ticket.status === newStatus) return

    const previousStatus = ticket.status
    try {
      await updateTicket(ticketId, { status: newStatus })
      toast({
        title: "Ticket actualizado",
        description: "Estado cambiado exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error al actualizar ticket",
        description: "No se pudo cambiar el estado del ticket",
        variant: "destructive",
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => (
          <SortableContext
            key={column.id}
            id={column.id}
            items={ticketsByStatus[column.id].map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <KanbanColumn
              id={column.id}
              label={column.label}
              tickets={ticketsByStatus[column.id]}
              count={ticketsByStatus[column.id].length}
            />
          </SortableContext>
        ))}
      </div>

      <DragOverlay>
        {activeTicket ? (
          <div className="rotate-3 opacity-80">
            <TicketCard ticket={activeTicket} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
