"use client"

import { useEffect } from "react"
import { connectSocket, disconnectSocket } from "@/lib/socket"
import { useQueryClient } from "@tanstack/react-query"
import type { Ticket, Message } from "@/types"
import { toast } from "@/hooks/use-toast"

export const useRealtimeUpdates = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = connectSocket()

    socket.on("connect", () => {
      console.log("[v0] WebSocket connected")
    })

    socket.on("disconnect", () => {
      console.log("[v0] WebSocket disconnected")
    })

    socket.on("TICKET_CREATED", (ticket: Ticket) => {
      console.log("[v0] TICKET_CREATED event received:", ticket)
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
      toast({
        title: "New Ticket",
        description: `Ticket #${ticket.id} created`,
      })
    })

    socket.on("TICKET_UPDATED", (ticket: Ticket) => {
      console.log("[v0] TICKET_UPDATED event received:", ticket)
      queryClient.setQueryData(["tickets", ticket.id], ticket)
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
    })

    socket.on("MESSAGE_NEW", (payload: { ticketId: string; message: Message }) => {
      console.log("[v0] MESSAGE_NEW event received:", payload)
      queryClient.invalidateQueries({ queryKey: ["tickets", payload.ticketId, "messages"] })
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
    })

    return () => {
      disconnectSocket()
    }
  }, [queryClient])
}
