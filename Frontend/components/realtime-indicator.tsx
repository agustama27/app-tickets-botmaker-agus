"use client"

import { useEffect, useState } from "react"
import { getSocket } from "@/lib/socket"
import { Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function RealtimeIndicator() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = getSocket()

    const handleConnect = () => setIsConnected(true)
    const handleDisconnect = () => setIsConnected(false)

    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)

    setIsConnected(socket.connected)

    return () => {
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
    }
  }, [])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium transition-colors",
              isConnected
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-red-500/10 text-red-600 dark:text-red-400",
            )}
          >
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span className="hidden sm:inline">{isConnected ? "Live" : "Offline"}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isConnected ? "Real-time updates active" : "Real-time updates disconnected"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
