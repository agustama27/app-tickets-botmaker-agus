"use client"

import type { Message } from "@/types"
import { MessageBubble } from "./message-bubble"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef } from "react"

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (messages.length === 0) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">No hay mensajes aún</div>
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
