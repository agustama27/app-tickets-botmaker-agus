"use client"

import { useState, useEffect } from "react"
import type { Area, Team } from "@/types"
import { mockAreas, mockTeams } from "@/lib/mock-data"

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setAreas(mockAreas)
      setIsLoading(false)
    }, 300)
  }, [])

  return {
    areas,
    isLoading,
  }
}

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setTeams(mockTeams)
      setIsLoading(false)
    }, 300)
  }, [])

  return {
    teams,
    isLoading,
  }
}
