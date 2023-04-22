import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../components/Layout'
import { WagmiConfig, configureChains, createClient, Chain } from "wagmi";
import { StateProvider } from '@/components/StateProvider';
import { publicProvider } from 'wagmi/providers/public'
import { goerli, hardhat } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

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

export default function App({ Component, pageProps }: AppProps) {
  return <StateProvider>
    <WagmiConfig client={client}>
      <Layout><Component {...pageProps} /></Layout>
    </WagmiConfig>
  </StateProvider>
}
