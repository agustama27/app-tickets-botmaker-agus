"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"
import { mockUsers } from "@/lib/mock-data"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true })

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Find user by email
        const user = mockUsers.find((u) => u.email === email)

        if (!user) {
          set({ isLoading: false })
          throw new Error("Usuario no encontrado")
        }

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
