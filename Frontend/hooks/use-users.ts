"use client"

import { useQuery } from "@tanstack/react-query"
import { usersApi } from "@/lib/api"

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getSelf(),
  })
}

