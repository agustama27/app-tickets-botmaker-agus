import type { Message } from "@/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
// Note: User info should come from message or separate query
import { Badge } from "@/components/ui/badge"

interface MessageBubbleProps {
  message: Message
}

const formatDate = (date: Date) => {
  return format(date, "p", { locale: es })
}

export function MessageBubble({ message }: MessageBubbleProps) {
  // TODO: Get user role from message or separate query
  // For now, assume messages from backend include user info
  const isAgent = message.userRole === "agent" || message.userRole === "admin" || false

  return (
    <div className={cn("flex flex-col", isAgent ? "items-start" : "items-end")}>
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2 space-y-1",
          isAgent ? "bg-muted" : "bg-primary text-primary-foreground",
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <p className={cn("text-xs font-medium", isAgent ? "text-foreground" : "text-primary-foreground")}>
            {message.userName || message.userId || "Usuario"}
          </p>
          {message.isInternal && (
            <Badge variant="secondary" className="text-xs py-0 h-4">
              Interno
            </Badge>
          )}
        </div>
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
        <p className={cn("text-xs", isAgent ? "text-muted-foreground" : "text-primary-foreground/70")}>
          {formatDate(message.createdAt)}
        </p>
      </div>
    </div>
  )
}
