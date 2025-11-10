"use client"

import { useAuth } from "@/hooks/use-mock-auth"
import { useAreas, useTeams } from "@/hooks/use-mock-structure"
import { canAccessAdminStructure } from "@/lib/rbac"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminStructurePage() {
  const { user } = useAuth()

  const { areas, isLoading: areasLoading } = useAreas()
  const { teams, isLoading: teamsLoading } = useTeams()

  if (!canAccessAdminStructure(user)) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            No tienes permiso para acceder a esta página. Se requiere rol de Admin o Manager.
          </AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/">Volver al Dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estructura Organizacional</h1>
        <p className="text-muted-foreground">Ver áreas y equipos de tu organización</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Áreas</CardTitle>
            <CardDescription>Todas las áreas organizacionales</CardDescription>
          </CardHeader>
          <CardContent>
            {areasLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : areas.length === 0 ? (
              <p className="text-sm text-muted-foreground">No se encontraron áreas</p>
            ) : (
              <div className="space-y-2">
                {areas.map((area) => (
                  <div key={area.id} className="rounded-lg border p-3">
                    <p className="font-medium">{area.name}</p>
                    <p className="text-sm text-muted-foreground">{area.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipos</CardTitle>
            <CardDescription>Todos los equipos organizacionales</CardDescription>
          </CardHeader>
          <CardContent>
            {teamsLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : teams.length === 0 ? (
              <p className="text-sm text-muted-foreground">No se encontraron equipos</p>
            ) : (
              <div className="space-y-2">
                {teams.map((team) => (
                  <div key={team.id} className="rounded-lg border p-3">
                    <p className="font-medium">{team.name}</p>
                    <p className="text-sm text-muted-foreground">Área: {team.areaId}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
