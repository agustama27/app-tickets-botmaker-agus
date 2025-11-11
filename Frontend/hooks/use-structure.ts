"use client"

import { useQuery } from "@tanstack/react-query"
import { structureApi } from "@/lib/api"

export const useAreas = () => {
  return useQuery({
    queryKey: ["areas"],
    queryFn: () => structureApi.getAreas(),
  })
}

export const useTeams = (areaId?: string) => {
  return useQuery({
    queryKey: ["teams", areaId],
    queryFn: () => structureApi.getTeams(areaId),
  })
}

