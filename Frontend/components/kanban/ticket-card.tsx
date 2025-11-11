import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Ticket } from "@/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import Link from "next/link"
// Note: User info should come from ticket or separate query

interface TicketCardProps {
  ticket: Ticket
  isDragging?: boolean
}

const getPriorityStyles = (priority: string) => {
  const styles: Record<string, { border: string; badge: string; bg: string }> = {
    low: {
      border: "border-l-4 border-l-[#00D4FF]",
      badge: "bg-cyan-50 text-[#00D4FF] border-cyan-200 dark:bg-cyan-950/30 dark:border-cyan-800",
      bg: "hover:bg-gradient-to-r hover:from-cyan-50/30",
    },
    medium: {
      border: "border-l-4 border-l-[#1E66FF]",
      badge: "bg-blue-50 text-[#1E66FF] border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
      bg: "hover:bg-gradient-to-r hover:from-blue-50/30",
    },
    high: {
      border: "border-l-4 border-l-[#7A3EFF]",
      badge: "bg-purple-50 text-[#7A3EFF] border-purple-200 dark:bg-purple-950/30 dark:border-purple-800",
      bg: "hover:bg-gradient-to-r hover:from-purple-50/30",
    },
    urgent: {
      border: "border-l-4 border-l-gradient-to-r from-[#7A3EFF] via-[#1E66FF] to-[#00D4FF]",
      badge:
        "bg-gradient-to-r from-purple-50 to-cyan-50 text-[#7A3EFF] border-purple-200 dark:from-purple-950/30 dark:to-cyan-950/30 dark:border-purple-800",
      bg: "hover:bg-gradient-to-r hover:from-purple-50/20 hover:via-blue-50/20 hover:to-cyan-50/20",
    },
  }
  return styles[priority] || styles.medium
}

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
    urgent: "Urgente",
  }
  return labels[priority] || priority
}

export function TicketCard({ ticket, isDragging = false }: TicketCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: ticket.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const dragging = isDragging || isSortableDragging
  const priorityStyles = getPriorityStyles(ticket.priority)

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Link href={`/tickets/${ticket.id}`}>
        <Card
          className={cn(
            "cursor-grab active:cursor-grabbing transition-all duration-200",
            "hover:shadow-lg border-0",
            priorityStyles.border,
            priorityStyles.bg,
            dragging && "opacity-50 shadow-xl",
          )}
        >
          <CardHeader className="pb-2 pt-3 px-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm line-clamp-2" style={{ color: "#1E66FF" }}>
                  {ticket.subject}
                </p>
              </div>
              <Badge variant="outline" className={cn("shrink-0 text-xs font-medium border", priorityStyles.badge)}>
                {getPriorityLabel(ticket.priority)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-3 px-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5" style={{ color: "#6FA0FF" }}>
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDistanceToNow(ticket.updatedAt, { addSuffix: true, locale: es })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono" style={{ color: "#6FA0FF" }}>
                  #{ticket.id.slice(0, 6)}
                </span>
                {ticket.assignedToId && (
                  <Avatar className="h-6 w-6 border-2 border-background shadow-sm">
                    <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-[#7A3EFF] via-[#1E66FF] to-[#00D4FF] text-white">
                      {ticket.assignedToId.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
