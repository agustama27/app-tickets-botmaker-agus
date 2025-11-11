"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authApi } from "@/lib/api"

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: async () => {
      // Invalidate and refetch session query to get user data
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] })
      // Refetch to ensure we have the user data before redirecting
      await queryClient.refetchQueries({ queryKey: ["auth", "session"] })
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all queries and redirect
      queryClient.clear()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    },
  })
}

