"use client"

import { useEffect } from "react"
import { API_BASE_URL, WS_URL } from "@/lib/config"

/**
 * Componente que inicializa la configuración en window para debugging
 * Se ejecuta solo en el cliente
 */
export function ConfigInit() {
  useEffect(() => {
    // Asegurar que se ejecute solo en el cliente
    if (typeof window !== "undefined") {
      const envApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      const envWsUrl = process.env.NEXT_PUBLIC_WS_URL

      const config = {
        API_BASE_URL,
        WS_URL,
        // Variables de entorno originales (pueden ser undefined si no están configuradas)
        NEXT_PUBLIC_API_BASE_URL: envApiUrl,
        NEXT_PUBLIC_WS_URL: envWsUrl,
        // Información de debugging
        isConfigured: !!envApiUrl,
        usingDefault: !envApiUrl,
        // Mensaje de ayuda
        help: envApiUrl
          ? "Variables configuradas correctamente"
          : "⚠️ Variables no configuradas. Ve a Vercel → Settings → Environment Variables y agrega NEXT_PUBLIC_API_BASE_URL",
      }

      // Asignar al objeto window
      ;(window as any).__APP_CONFIG__ = config

      // Log siempre (también en producción para debugging)
      console.log("🔧 Config inicializada en window.__APP_CONFIG__:", config)
    }
  }, [])

  return null
}

