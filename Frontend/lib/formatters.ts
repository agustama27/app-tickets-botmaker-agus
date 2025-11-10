import type { Priority, Status, TicketType } from "@/types"
import { formatDistanceToNow, format } from "date-fns"

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "MMM d, yyyy HH:mm")
}

export const formatRelativeTime = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case "CRITICAL":
      return "destructive"
    case "HIGH":
      return "default"
    case "MEDIUM":
      return "secondary"
    case "LOW":
      return "outline"
  }
}

export const getStatusLabel = (status: Status): string => {
  switch (status) {
    case "NEW":
      return "New"
    case "TRIAGED":
      return "Triaged"
    case "IN_PROGRESS":
      return "In Progress"
    case "WAITING_USER":
      return "Waiting User"
    case "RESOLVED":
      return "Resolved"
    case "CLOSED":
      return "Closed"
  }
}

export const getPriorityLabel = (priority: Priority): string => {
  return priority.charAt(0) + priority.slice(1).toLowerCase()
}

export const getTicketTypeLabel = (type?: TicketType): string => {
  if (!type) return "General"
  return type.charAt(0) + type.slice(1).toLowerCase().replace("_", " ")
}
