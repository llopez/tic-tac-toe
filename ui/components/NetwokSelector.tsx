import React from "react"
import { NavDropdown } from "react-bootstrap"
import { useNetwork, useSwitchNetwork, Chain } from "wagmi"
import { goerli, hardhat } from 'wagmi/chains'

const environmentChains: { [key: string]: Chain[] } = {
  development: [goerli, hardhat],
  production: [goerli]
}

export const availableChains = environmentChains[process.env.NODE_ENV]

interface Item {
  data: Chain
  onSelect: (id: number) => void
}

const Item = (props: React.PropsWithChildren<Item>) => {
  const { data, onSelect } = props

  const { name, id } = data

  const handleSelect = (): void => {
    onSelect(id)
  }

  return (
    <NavDropdown.Item onClick={handleSelect}>{name}</NavDropdown.Item>
  )
}

export const NetworkSelector = () => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  const handleChange = (id: number) => {
    switchNetwork?.(id)
  }

  return (
    <NavDropdown title={chain?.name} id="basic-nav-dropdown" align='end'>
      {availableChains.map(c => <Item key={c.id} data={c} onSelect={handleChange}>{c.name}</Item>)}
    </NavDropdown>
  )
}

