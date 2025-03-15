"use client"

import type React from "react"

import { WagmiConfig } from "wagmi"
import { config } from "@/lib/wagmi-config"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </WagmiConfig>
  )
}

