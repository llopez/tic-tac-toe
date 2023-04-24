import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button, Image } from 'react-bootstrap';
import { useAccount, useConnect, useDisconnect, useBalance, Address, useContractRead } from "wagmi";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { useState, useEffect } from 'react';
import { truncateEthAddress } from '@/lib/utils';
import { NetworkSelector } from './NetwokSelector';
import Tic from '@/abis/Tic.json'
import { BigNumber, ethers } from 'ethers';

interface TitleProps {
  address: Address
}

export const Title = (props: TitleProps) => {
  const { address } = props

  return (
    <>
      <Image src={`https://effigy.im/a/${address}.png`} alt="avatar" rounded style={{ width: 24 }} />
      <span className='p-2'>{address && truncateEthAddress(address)}</span>
    </>
  )
}

interface AccountSelectorProps {
  address: Address
  balance: any
  tokens: BigNumber | undefined
  onDisconnect: () => void
}

const AccountSelector = (props: AccountSelectorProps) => {
  const { address, balance, tokens, onDisconnect } = props
  const [show, setShow] = useState(false)

  const handleOpen = () => {
    setShow(true)
  }

  const handleClose = () => {
    setShow(false)
  }

  return (
    <div className="nav-item dropdown" style={{ color: 'white' }}>
      <a id="basic-nav-dropdown" aria-expanded="false" role="button" className="dropdown-toggle nav-link text-light" href="#" onClick={handleOpen}>
        <Title address={address} />
      </a>
      <div aria-labelledby="basic-nav-dropdown" data-bs-popper="static" className={`${show ? 'show' : ''} dropdown-menu dropdown-menu-end`} onMouseLeave={handleClose}>
        <a data-rr-ui-dropdown-item="" className="dropdown-item disabled" role="button" href="#">{balance?.formatted} {balance?.symbol}</a>
        <a data-rr-ui-dropdown-item="" className="dropdown-item disabled" role="button" href="#">
          {tokens ? ethers.utils.formatEther(tokens) : '0'} TIC
        </a>
        <hr className="dropdown-divider" role="separator" />
        <a data-rr-ui-dropdown-item="" className="dropdown-item" role="button" href="#" onClick={onDisconnect}>
          Disconnect
        </a>
      </div>
    </div>
  )
}

const Navigation = () => {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const [_isConnected, _setIsConnected] = useState(false)
  const { connect } = useConnect({ connector: new MetaMaskConnector() })
  const { disconnect } = useDisconnect()

  const { data: ticBalance }: { data: BigNumber | undefined } = useContractRead({
    address: process.env.NEXT_PUBLIC_TIC_ADDRESS as Address,
    abi: Tic.abi,
    functionName: 'balanceOf',
    args: [address],
  })

  useEffect(() => {
    if (isConnected)
      _setIsConnected(true)
    else
      _setIsConnected(false)
  }, [
    isConnected
  ])

  return (
    <Navbar style={{ background: "#2B2D3C", minHeight: '10%' }} >
      <Container fluid >
        <Navbar.Brand href="/" className="text-light">
          <Image src="https://cdn-icons-png.flaticon.com/512/566/566294.png" alt="tic" rounded style={{ width: 40 }} />
          <span className="ms-2">Tik Tak ToE</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
          <Nav >
            <Nav.Link href="/games" className="text-light">Games</Nav.Link>
            <Nav.Link href="/vault" className="text-light">Vault</Nav.Link>
            {
              !_isConnected && <Button size="sm" variant='success' className="ms-2" onClick={() => { connect() }}>Connect Wallet</Button>
            }
            {_isConnected && <NetworkSelector />}
            {
              _isConnected && address && <AccountSelector address={address} balance={balance} tokens={ticBalance} onDisconnect={() => { disconnect() }} />
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;