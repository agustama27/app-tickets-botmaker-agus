"use client"

import { useState, useEffect, useCallback } from "react"
import type { Ticket, TicketStatus, TicketPriority } from "@/types"
import { mockTickets } from "@/lib/mock-data"

let globalTickets = [...mockTickets]

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>(globalTickets)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Simulate initial load
    setIsLoading(true)
    setTimeout(() => {
      setTickets(globalTickets)
      setIsLoading(false)
    }, 300)
  }, [])

  const updateTicket = useCallback(async (id: string, updates: Partial<Ticket>) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    globalTickets = globalTickets.map((ticket) =>
      ticket.id === id ? { ...ticket, ...updates, updatedAt: new Date() } : ticket,
    )
    setTickets(globalTickets)
  }, [])

  return {
    tickets,
    isLoading,
    updateTicket,
  }
}

export function useTicket(id: string) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      const found = globalTickets.find((t) => t.id === id)
      setTicket(found || null)
      setIsLoading(false)
    }, 300)
  }, [id])

  const updateStatus = useCallback(
    async (status: TicketStatus) => {
      if (!ticket) return

      await new Promise((resolve) => setTimeout(resolve, 300))

      const updates: Partial<Ticket> = {
        status,
        updatedAt: new Date(),
      }

      if (status === "resolved" && !ticket.resolvedAt) {
        updates.resolvedAt = new Date()
      }
      if (status === "closed" && !ticket.closedAt) {
        updates.closedAt = new Date()
      }

      globalTickets = globalTickets.map((t) => (t.id === id ? { ...t, ...updates } : t))
      setTicket({ ...ticket, ...updates })
    },
    [ticket, id],
  )

  const updatePriority = useCallback(
    async (priority: TicketPriority) => {
      if (!ticket) return

      await new Promise((resolve) => setTimeout(resolve, 300))

      const updates = { priority, updatedAt: new Date() }
      globalTickets = globalTickets.map((t) => (t.id === id ? { ...t, ...updates } : t))
      setTicket({ ...ticket, ...updates })
    },
    [ticket, id],
  )

  const assignTo = useCallback(
    async (userId: string | null) => {
      if (!ticket) return

      await new Promise((resolve) => setTimeout(resolve, 300))

      const updates = { assignedToId: userId, updatedAt: new Date() }
      globalTickets = globalTickets.map((t) => (t.id === id ? { ...t, ...updates } : t))
      setTicket({ ...ticket, ...updates })
    },
    [ticket, id],
  )

  return {
    ticket,
    isLoading,
    updateStatus,
    updatePriority,
    assignTo,
  }
}
