"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useLogin } from "@/hooks/use-login"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const loginMutation = useLogin()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await loginMutation.mutateAsync({ email, password })
      toast({
        title: "Inicio de sesión exitoso",
        description: "¡Bienvenido de nuevo!",
      })
      // Small delay to ensure session is set before redirecting
      await new Promise((resolve) => setTimeout(resolve, 100))
      router.push("/")
      router.refresh() // Force refresh to update the layout
    } catch (error: any) {
      console.error("Error de login:", error)
      
      let errorMessage = "Credenciales incorrectas"
      
      if (error?.response) {
        // Error del servidor
        const status = error.response.status
        const data = error.response.data
        
        if (status === 401) {
          errorMessage = data?.message || "Email o contraseña incorrectos"
        } else if (status === 404) {
          errorMessage = "Usuario no encontrado. Verifica que el usuario exista en la base de datos."
        } else if (status === 500) {
          errorMessage = "Error del servidor. Verifica que el backend esté funcionando correctamente."
        } else {
          errorMessage = data?.message || `Error ${status}: ${error.message}`
        }
      } else if (error?.code === "ERR_NETWORK") {
        errorMessage = "No se pudo conectar al servidor. Verifica que el backend esté corriendo."
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Error al iniciar sesión",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              IT
            </div>
            <span className="text-2xl font-bold">IT Support Tickets</span>
          </div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loginMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loginMutation.isPending}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
