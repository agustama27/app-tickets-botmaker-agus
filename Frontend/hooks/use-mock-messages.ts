"use client"

import { useState, useEffect, useCallback } from "react"
import type { Message } from "@/types"
import { mockMessages } from "@/lib/mock-data"

const globalMessages = { ...mockMessages }

export function useMessages(ticketId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setMessages(globalMessages[ticketId] || [])
      setIsLoading(false)
    }, 300)
  }, [ticketId])

  const sendMessage = useCallback(
    async (content: string, userId: string, isInternal = false) => {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const newMessage: Message = {
        id: `m${Date.now()}`,
        ticketId,
        userId,
        content,
        isInternal,
        createdAt: new Date(),
      }

      if (!globalMessages[ticketId]) {
        globalMessages[ticketId] = []
      }

      globalMessages[ticketId].push(newMessage)
      setMessages([...globalMessages[ticketId]])

      return newMessage
    },
    [ticketId],
  )

  return {
    messages,
    isLoading,
    sendMessage,
  }
}
