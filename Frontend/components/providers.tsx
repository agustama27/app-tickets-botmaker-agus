"use client"

import type React from "react"

import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/query-client"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "next-themes"
import { ConfigInit } from "@/components/config-init"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ConfigInit />
        {children}
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
