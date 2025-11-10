import { useDroppable } from "@dnd-kit/core"
import type { Ticket, Status } from "@/types"
import { TicketCard } from "./ticket-card"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  id: Status
  label: string
  tickets: Ticket[]
  count: number
}

export function KanbanColumn({ id, label, tickets, count }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex min-w-80 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm">{label}</h3>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs text-muted-foreground">
          {count}
        </span>
      </div>
      <Card
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-2 rounded-lg border-2 border-dashed bg-muted/20 p-2 transition-colors",
          isOver && "border-primary bg-primary/5",
        )}
      >
        {tickets.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">No tickets</div>
        ) : (
          tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
        )}
      </Card>
    </div>
  )
}
