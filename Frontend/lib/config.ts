/**
 * Configuración global de la aplicación
 * Centraliza todas las URLs y configuraciones del backend
 */

/**
 * URL base del backend API
 * Se obtiene de la variable de entorno NEXT_PUBLIC_API_BASE_URL
 * Por defecto: http://localhost:8080 (puerto del backend)
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

/**
 * URL del servidor WebSocket
 * Se obtiene de la variable de entorno NEXT_PUBLIC_WS_URL
 * Por defecto: http://localhost:8080 (mismo que API_BASE_URL)
 */
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || API_BASE_URL

/**
 * Configuración del backend
 */
export const backendConfig = {
  apiBaseUrl: API_BASE_URL,
  wsUrl: WS_URL,
} as const

/**
 * Nota: La exposición de configuración en window.__APP_CONFIG__ 
 * se hace en components/config-init.tsx usando useEffect
 * para asegurar que se ejecute solo en el cliente
 */

