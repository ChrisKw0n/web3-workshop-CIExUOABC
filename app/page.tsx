"use client"

import { useState } from "react"
import { ConnectButton } from "@/components/connect-button"
import { ProposalList } from "@/components/proposal-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [network, setNetwork] = useState("sepolia")
  const [walletAddress, setWalletAddress] = useState("")
  const isCorrectNetwork = network === "sepolia"

  const handleAddressChanged = (address: string) => {
    setWalletAddress(address)
    setIsConnected(!!address)
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-center text-primary">CIE DAO Governance</h1>
        <p className="text-muted-foreground mt-2">Club of Innovative Engineers</p>
      </header>

      <div className="flex justify-end mb-6">
        <ConnectButton
          isConnected={isConnected}
          setIsConnected={setIsConnected}
          network={network}
          setNetwork={setNetwork}
          onAddressChanged={handleAddressChanged}
        />
      </div>

      {isConnected && !isCorrectNetwork && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wrong Network</AlertTitle>
          <AlertDescription>Please switch to Sepolia testnet to interact with this DAO.</AlertDescription>
        </Alert>
      )}

      {!isConnected ? (
        <div className="text-center py-12 bg-secondary rounded-lg border border-primary/20">
          <h2 className="text-xl font-medium mb-4">Connect your wallet to get started</h2>
          <p className="text-muted-foreground mb-6">
            You need to connect your Ethereum wallet to view and vote on proposals.
          </p>
          <ConnectButton
            isConnected={isConnected}
            setIsConnected={setIsConnected}
            network={network}
            setNetwork={setNetwork}
            onAddressChanged={handleAddressChanged}
          />
        </div>
      ) : (
        <ProposalList walletAddress={walletAddress} />
      )}
    </main>
  )
}