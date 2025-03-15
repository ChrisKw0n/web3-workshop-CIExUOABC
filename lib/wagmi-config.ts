"use client"

import { createConfig, configureChains } from "wagmi"
import { goerli, mainnet } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import { InjectedConnector, WalletConnectConnector } from "wagmi"

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains([mainnet, goerli], [publicProvider()])

// Set up wagmi config
export const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

export { chains }

