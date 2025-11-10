import type { Ticket } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Clock, User } from "lucide-react"
import { getUserById } from "@/lib/mock-data"

interface TicketInfoProps {
  ticket: Ticket
}

const formatDate = (date: Date) => {
  return format(date, "PPp", { locale: es })
}

export function TicketInfo({ ticket }: TicketInfoProps) {
  const assignedUser = ticket.assignedToId ? getUserById(ticket.assignedToId) : null
  const createdByUser = getUserById(ticket.userId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Ticket</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Creado</span>
            </div>
            <p className="text-sm font-medium">{formatDate(ticket.createdAt)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Actualizado</span>
            </div>
            <p className="text-sm font-medium">{formatDate(ticket.updatedAt)}</p>
          </div>

          {ticket.resolvedAt && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Resuelto</span>
              </div>
              <p className="text-sm font-medium">{formatDate(ticket.resolvedAt)}</p>
            </div>
          )}

          {ticket.closedAt && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Cerrado</span>
              </div>
              <p className="text-sm font-medium">{formatDate(ticket.closedAt)}</p>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Creado por</span>
            </div>
            <p className="text-sm font-medium">{createdByUser?.name || "Usuario desconocido"}</p>
          </div>

          {assignedUser && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Asignado a</span>
              </div>
              <p className="text-sm font-medium">{assignedUser.name}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
