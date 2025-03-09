"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader2, LogOut, ChevronDown } from "lucide-react"

interface ConnectButtonProps {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
  network: string
  setNetwork: (network: string) => void
}

export function ConnectButton({ isConnected, setIsConnected, network, setNetwork }: ConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const displayAddress = "0x1234...5678"

  const handleConnect = (walletType: string) => {
    setIsLoading(true)
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true)
      setIsLoading(false)
    }, 1000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
  }

  const switchNetwork = (newNetwork: string) => {
    setNetwork(newNetwork)
  }

  if (isConnected) {
    return (
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 border-primary/30">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {displayAddress}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer" onClick={handleDisconnect}>
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-primary/30">
              {network === "mainnet" ? "Mainnet" : "Goerli"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => switchNetwork("mainnet")}>Mainnet</DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchNetwork("goerli")}>Goerli Testnet</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting
            </>
          ) : (
            "Connect Wallet"
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => handleConnect("metamask")}>
          MetaMask
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => handleConnect("walletconnect")}>
          WalletConnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

