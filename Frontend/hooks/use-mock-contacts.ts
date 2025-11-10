"use client"

import { useState, useEffect } from "react"
import type { Contact } from "@/types"
import { mockContacts } from "@/lib/mock-data"

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setContacts(mockContacts)
      setIsLoading(false)
    }, 300)
  }, [])

  return {
    contacts,
    isLoading,
  }
}
