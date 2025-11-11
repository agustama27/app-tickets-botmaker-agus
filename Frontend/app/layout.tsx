import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NODS – Tickets IT",
  description: "IT Support Ticket Management System",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const envApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const envWsUrl = process.env.NEXT_PUBLIC_WS_URL || ""
  const apiBaseUrl = envApiUrl || "http://localhost:8080"
  const wsUrl = envWsUrl || apiBaseUrl

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Script
          id="app-config-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const envApiUrl = '${envApiUrl}';
                  const envWsUrl = '${envWsUrl}';
                  const apiBaseUrl = envApiUrl || 'http://localhost:8080';
                  const wsUrl = envWsUrl || apiBaseUrl;
                  
                  window.__APP_CONFIG__ = {
                    API_BASE_URL: apiBaseUrl,
                    WS_URL: wsUrl,
                    NEXT_PUBLIC_API_BASE_URL: envApiUrl || undefined,
                    NEXT_PUBLIC_WS_URL: envWsUrl || undefined,
                    isConfigured: !!envApiUrl,
                    usingDefault: !envApiUrl,
                    help: envApiUrl
                      ? 'Variables configuradas correctamente'
                      : '⚠️ Variables no configuradas. Ve a Vercel → Settings → Environment Variables y agrega NEXT_PUBLIC_API_BASE_URL'
                  };
                  
                  console.log('🔧 Config inicializada en window.__APP_CONFIG__:', window.__APP_CONFIG__);
                } catch (e) {
                  console.error('Error inicializando config:', e);
                }
              })();
            `,
          }}
        />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
