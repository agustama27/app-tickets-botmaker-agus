import type { User } from "@/types"

export const canAccessAdminUsers = (user: User | null): boolean => {
  return user?.role === "ADMIN"
}

export const canAccessAdminStructure = (user: User | null): boolean => {
  return user?.role === "ADMIN" || user?.role === "MANAGER"
}

export const canViewAllTickets = (user: User | null): boolean => {
  return user?.role === "ADMIN"
}

export const canAssignTickets = (user: User | null): boolean => {
  return user?.role === "ADMIN" || user?.role === "MANAGER"
}

export const getScopeFilter = (user: User | null, scope: "all" | "my-area" | "my-team" | "assigned-to-me") => {
  if (!user) return {}

  switch (scope) {
    case "assigned-to-me":
      return { assignedUserId: user.id }
    case "my-team":
      return user.teamId ? { teamId: user.teamId } : {}
    case "my-area":
      return user.areaId ? { areaId: user.areaId } : {}
    case "all":
    default:
      return user.role === "ADMIN" ? {} : user.areaId ? { areaId: user.areaId } : {}
  }
}
