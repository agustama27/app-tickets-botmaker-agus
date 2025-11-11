"use client"

import { useQuery } from "@tanstack/react-query"
import { ticketsApi } from "@/lib/api"

export const useMessages = (ticketId: string) => {
  return useQuery({
    queryKey: ["messages", ticketId],
    queryFn: () => ticketsApi.getMessages(ticketId),
    enabled: !!ticketId,
  })
}

