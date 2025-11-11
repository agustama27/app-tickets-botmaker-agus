"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ticketsApi } from "@/lib/api"
import type { Ticket, TicketFilters } from "@/types"

export const useTickets = (filters: TicketFilters = {}) => {
  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: () => ticketsApi.getTickets(filters),
  })
}

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => ticketsApi.getTicket(id),
    enabled: !!id,
  })
}

export const useUpdateTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Ticket> }) =>
      ticketsApi.updateTicket(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] })
    },
  })
}

export const useReplyToTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, text, attachments }: { ticketId: string; text: string; attachments?: string[] }) =>
      ticketsApi.replyToTicket(ticketId, text, attachments),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.ticketId] })
      queryClient.invalidateQueries({ queryKey: ["messages", variables.ticketId] })
    },
  })
}

