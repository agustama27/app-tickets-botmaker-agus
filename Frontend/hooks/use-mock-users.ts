"use client"

import { useState, useEffect } from "react"
import type { User } from "@/types"
import { mockUsers } from "@/lib/mock-data"

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setUsers(mockUsers)
      setIsLoading(false)
    }, 300)
  }, [])

  return {
    users,
    isLoading,
  }
}
