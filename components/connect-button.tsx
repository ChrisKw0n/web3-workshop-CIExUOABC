"use client"

import { useState, useEffect } from "react"
import { BrowserProvider } from "ethers";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2, LogOut, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConnectButtonProps {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
  network: string
  setNetwork: (network: string) => void
  onAddressChanged: (address: string) => void
}

export function ConnectButton({
  isConnected,
  setIsConnected,
  network,
  setNetwork,
  onAddressChanged,
}: ConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const { toast } = useToast()

  const getCurrentWalletAddress = async (): Promise<string | null> => {
    if (!(window as any).ethereum) return null;
    
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const accounts = await provider.listAccounts();
      return accounts.length > 0 ? accounts[0].address : null;
    } catch (error) {
      console.warn("Error getting current wallet address:", error);
      return null;
    }
  }

  // Connect to the MetaMask wallet
  const handleConnect = async () => {
    try {
      setIsLoading(true)

      // Check if MetaMask is installed
      if (!(window as any).ethereum) {
        toast({
          title: "No MetaMask install",
        })
        setIsLoading(false)
        return
      }

      // Create Ethers.js provider
      const provider = new BrowserProvider((window as any).ethereum);
      
      // Request user authorization to connect wallet
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const address = signer.address;
      
      // Check network
      const network = await provider.getNetwork()
      const chainId = Number(network.chainId)

      const networkName = network.name;
      setNetwork(networkName)

      console.log("Connected address:", address)
      setWalletAddress(address)
      setIsConnected(true)
      onAddressChanged(address)
      
      setIsLoading(false);

      toast({
        title: "Connected",
        description: `Connected to wallet: ${shortenAddress(address)}`,
      })
      
      try {
        if ((window as any).ethereum && typeof (window as any).ethereum.on === 'function') {
          (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length > 0) {
              setWalletAddress(accounts[0])
              onAddressChanged(accounts[0])
            }
          });
          
          (window as any).ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } else {
          console.warn("Ethereum provider does not support events");
        }
      } catch (eventError) {
        console.warn("Error setting up event listeners:", eventError);
      }
      
    } catch (error) {
      console.warn("Failed to connect wallet:", error)
      setIsLoading(false)
    }
  }

  // Disconnect wallet
  const handleDisconnect = () => {
    // Remove event listeners
    try {
      if ((window as any).ethereum && typeof (window as any).ethereum.removeListener === 'function') {
        try {
          (window as any).ethereum.removeListener('accountsChanged', () => {});
          (window as any).ethereum.removeListener('chainChanged', () => {});
        } catch (err) {
          console.warn("Error removing event listeners:", err);
        }
      }
    } catch (error) {
      console.warn("Could not remove ethereum event listeners:", error);
    }
    
    setIsConnected(false)
    setWalletAddress("")
    onAddressChanged("")
    
  }

  useEffect(() => {
    const checkConnection = async () => {
      if (isConnected) {
        const address = await getCurrentWalletAddress();
        if (address) {
          setWalletAddress(address);
        }
      }
    };
    
    checkConnection();
  }, [isConnected]);

  // If already connected, display wallet address and disconnect option
  if (isConnected && walletAddress) {
    return (
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 border-primary/30">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {shortenAddress(walletAddress)}
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
      </div>
    )
  }

  // When not connected, display connect button
  return (
    <Button onClick={handleConnect} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect MetaMask"
      )}
    </Button>
  )
}

// Function to shorten address (e.g., 0x1234...abcd)
function shortenAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`
}