import React from "react"
import { Container } from "react-bootstrap"

import { WagmiConfig, configureChains, createClient } from "wagmi";
import { mainnet, polygon, goerli, hardhat } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import Navigation from "./Navigation";

const { provider, webSocketProvider, chains } = configureChains(
  [mainnet, polygon, goerli, hardhat],
  [publicProvider()],
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({ chains })
  ]
})

const Layout = (props: React.PropsWithChildren) => {
  const { children } = props

  return <Container fluid>
    <WagmiConfig client={client}>
      <Navigation />
      <Container className="mt-2">
        {children}
      </Container>
    </WagmiConfig>
  </Container>
}

export default Layout