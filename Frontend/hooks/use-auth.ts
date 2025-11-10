"use client"

import { useQuery } from "@tanstack/react-query"
import { authApi } from "@/lib/api"

export const useAuth = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: authApi.getSession,
    retry: false,
  })

  return {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.user,
    error,
  }
}
