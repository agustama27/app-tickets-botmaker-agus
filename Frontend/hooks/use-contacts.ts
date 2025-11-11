"use client"

import { useQuery } from "@tanstack/react-query"
import { contactsApi } from "@/lib/api"

export const useContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: () => contactsApi.getContacts(),
  })
}

