import React, { useEffect, useState } from "react"
import { Container, Alert } from "react-bootstrap"
import { WagmiConfig, configureChains, createClient, Chain, useNetwork } from "wagmi";
import { goerli, hardhat } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import Navigation from "./Navigation";
import Notifications from "./Notifications";
import { StateProvider } from "./StateProvider";
import Transaction from "./Transaction";

const environmentChains: { [key: string]: Chain[] } = {
  development: [goerli, hardhat],
  production: [goerli]
}

export const availableChains = environmentChains[process.env.NODE_ENV]

const { provider, webSocketProvider, chains } = configureChains(
  availableChains,
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
  const { chain } = useNetwork()
  const [networkSupported, setNetworkSupported] = useState(false)

  useEffect(() => {
    const isSupportedNetwork = chain && availableChains.map(c => c.id).includes(chain.id)

    setNetworkSupported(!!isSupportedNetwork)
  }, [chain])

  return <Container fluid>
    <StateProvider>
      <WagmiConfig client={client}>
        <Navigation />
        <Notifications />
        <Transaction />
        <Container className="mt-2">
          {!networkSupported && <Alert variant="info">
            Network not supported, please change to goerli
          </Alert>}
          {networkSupported && children}
        </Container>
      </WagmiConfig>
    </StateProvider>
  </Container>
}

export default Layout