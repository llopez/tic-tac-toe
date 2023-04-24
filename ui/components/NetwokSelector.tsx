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
  const [show, setShow] = React.useState(false)
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  const handleOpen = () => {
    setShow(true)
  }

  const handleClose = () => {
    setShow(false)
  }

  const handleChange = (id: number) => {
    switchNetwork?.(id)
  }

  return (
    <div className="nav-item dropdown">
      <a id="basic-nav-dropdown" aria-expanded="false" role="button" className="dropdown-toggle nav-link text-light" href="#" onClick={handleOpen}>
        {chain?.name}
      </a>
      <div aria-labelledby="basic-nav-dropdown" data-bs-popper="static" className={`${show ? 'show' : ''} dropdown-menu dropdown-menu-end`} onMouseLeave={handleClose}>
        {availableChains.map(c => <Item key={c.id} data={c} onSelect={handleChange}>{c.name}</Item>)}
      </div>
    </div>

  )
}

