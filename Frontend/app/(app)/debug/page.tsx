"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { API_BASE_URL, WS_URL } from "@/lib/config"
import { axiosInstance } from "@/lib/axios"

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState<"idle" | "checking" | "success" | "error">("idle")
  const [apiError, setApiError] = useState<string | null>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [wsStatus, setWsStatus] = useState<"idle" | "checking" | "success" | "error">("idle")
  const [wsError, setWsError] = useState<string | null>(null)

  const checkAPI = async () => {
    setApiStatus("checking")
    setApiError(null)
    setApiResponse(null)

    try {
      // Intentar con /auth/session (puede dar 401, pero eso significa que el servidor responde)
      const response = await axiosInstance.get("/auth/session").catch((err) => {
        // Si es 401, el servidor está respondiendo (solo no autenticado)
        if (err.response?.status === 401) {
          return { status: 401, data: { message: "Servidor responde (no autenticado)" } }
        }
        throw err
      })

      setApiStatus("success")
      setApiResponse(response.data || { status: response.status })
    } catch (error: any) {
      setApiStatus("error")
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error desconocido al conectar con el backend"
      setApiError(errorMessage)

      // Detalles adicionales del error
      if (error.code === "ERR_NETWORK") {
        setApiError("Error de red: No se pudo conectar. Verifica la URL del backend.")
      } else if (error.response?.status) {
        setApiError(`Error ${error.response.status}: ${errorMessage}`)
      }
    }
  }

  const checkWebSocket = async () => {
    setWsStatus("checking")
    setWsError(null)

    try {
      // Importar dinámicamente para evitar errores en SSR
      const { getSocket } = await import("@/lib/socket")
      const socket = getSocket()

      const timeout = setTimeout(() => {
        setWsStatus("error")
        setWsError("Timeout: No se pudo conectar en 5 segundos")
        socket.disconnect()
      }, 5000)

      socket.on("connect", () => {
        clearTimeout(timeout)
        setWsStatus("success")
        socket.disconnect()
      })

      socket.on("connect_error", (error) => {
        clearTimeout(timeout)
        setWsStatus("error")
        setWsError(error.message || "Error al conectar WebSocket")
      })

      socket.connect()
    } catch (error: any) {
      setWsStatus("error")
      setWsError(error.message || "Error desconocido al conectar WebSocket")
    }
  }

  const checkAll = () => {
    checkAPI()
    checkWebSocket()
  }

  useEffect(() => {
    // Auto-check al cargar la página
    checkAll()
  }, [])

  const isRailway = API_BASE_URL?.includes("railway") || API_BASE_URL?.includes("railway.app")
  const isConfigured = !!process.env.NEXT_PUBLIC_API_BASE_URL

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">🔍 Diagnóstico de Conexión Backend</h1>
        <p className="text-muted-foreground">
          Verifica si tu frontend (Vercel) está correctamente conectado a tu backend (Railway)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Configuración */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Configuración</CardTitle>
            <CardDescription>Variables de entorno y URLs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">API Base URL:</p>
              <code className="text-xs bg-muted p-2 rounded block break-all font-mono">
                {API_BASE_URL || "❌ No configurada"}
              </code>
              {isRailway && (
                <Badge variant="outline" className="mt-1">
                  ✅ Detectado Railway
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">WebSocket URL:</p>
              <code className="text-xs bg-muted p-2 rounded block break-all font-mono">
                {WS_URL || "❌ No configurada"}
              </code>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Variable configurada:</p>
              <Badge variant={isConfigured ? "default" : "destructive"}>
                {isConfigured ? "✅ Sí" : "❌ No"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Estado API */}
        <Card>
          <CardHeader>
            <CardTitle>🌐 Estado API HTTP</CardTitle>
            <CardDescription>Conexión REST con el backend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Estado:</span>
              {apiStatus === "idle" && <Badge variant="outline">Esperando...</Badge>}
              {apiStatus === "checking" && <Badge variant="outline">🔄 Verificando...</Badge>}
              {apiStatus === "success" && <Badge className="bg-green-500">✅ Conectado</Badge>}
              {apiStatus === "error" && <Badge variant="destructive">❌ Error</Badge>}
            </div>
            {apiError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm">
                <p className="font-medium text-destructive mb-1">Error:</p>
                <p className="text-destructive/90">{apiError}</p>
              </div>
            )}
            {apiResponse && (
              <div className="p-3 bg-muted rounded text-xs">
                <p className="font-medium mb-1">Respuesta:</p>
                <pre className="whitespace-pre-wrap font-mono">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}
            <Button onClick={checkAPI} variant="outline" size="sm" className="w-full">
              Probar Conexión API
            </Button>
          </CardContent>
        </Card>

        {/* Estado WebSocket */}
        <Card>
          <CardHeader>
            <CardTitle>🔌 Estado WebSocket</CardTitle>
            <CardDescription>Conexión en tiempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Estado:</span>
              {wsStatus === "idle" && <Badge variant="outline">Esperando...</Badge>}
              {wsStatus === "checking" && <Badge variant="outline">🔄 Verificando...</Badge>}
              {wsStatus === "success" && <Badge className="bg-green-500">✅ Conectado</Badge>}
              {wsStatus === "error" && <Badge variant="destructive">❌ Error</Badge>}
            </div>
            {wsError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm">
                <p className="font-medium text-destructive mb-1">Error:</p>
                <p className="text-destructive/90">{wsError}</p>
              </div>
            )}
            <Button onClick={checkWebSocket} variant="outline" size="sm" className="w-full">
              Probar WebSocket
            </Button>
          </CardContent>
        </Card>

        {/* Instrucciones */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Instrucciones</CardTitle>
            <CardDescription>Qué hacer si hay problemas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Verifica variables en Vercel: Settings → Environment Variables</li>
              <li>Asegúrate de que la URL de Railway sea correcta</li>
              <li>Haz un nuevo deploy después de cambiar variables</li>
              <li>Verifica que el servicio en Railway esté Running</li>
              <li>Revisa la consola del navegador para más detalles</li>
            </ul>
            <Button onClick={checkAll} className="w-full mt-4">
              🔄 Verificar Todo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Información Técnica */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Información Técnica</CardTitle>
          <CardDescription>Datos para debugging</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs font-mono">
            <div className="grid grid-cols-[200px_1fr] gap-2">
              <span className="text-muted-foreground">NEXT_PUBLIC_API_BASE_URL:</span>
              <code className="bg-muted p-1 rounded break-all">
                {process.env.NEXT_PUBLIC_API_BASE_URL || "undefined"}
              </code>
            </div>
            <div className="grid grid-cols-[200px_1fr] gap-2">
              <span className="text-muted-foreground">NEXT_PUBLIC_WS_URL:</span>
              <code className="bg-muted p-1 rounded break-all">
                {process.env.NEXT_PUBLIC_WS_URL || "undefined"}
              </code>
            </div>
            <div className="grid grid-cols-[200px_1fr] gap-2">
              <span className="text-muted-foreground">Window Origin:</span>
              <code className="bg-muted p-1 rounded break-all">
                {typeof window !== "undefined" ? window.location.origin : "N/A"}
              </code>
            </div>
            <div className="grid grid-cols-[200px_1fr] gap-2">
              <span className="text-muted-foreground">API_BASE_URL (runtime):</span>
              <code className="bg-muted p-1 rounded break-all">{API_BASE_URL}</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      {!isConfigured && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="text-yellow-700 dark:text-yellow-300">
              ⚠️ Variables no configuradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              No se detectaron las variables de entorno. Ve a Vercel → Settings → Environment
              Variables y agrega <code>NEXT_PUBLIC_API_BASE_URL</code> con la URL de tu backend en
              Railway.
            </p>
          </CardContent>
        </Card>
      )}

      {isConfigured && !isRailway && (
        <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300">ℹ️ Nota</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              La URL configurada no parece ser de Railway. Si tu backend está en Railway, verifica
              que la URL sea correcta.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

