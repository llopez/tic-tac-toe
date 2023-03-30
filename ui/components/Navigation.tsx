import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button, Image } from 'react-bootstrap';

import { useAccount, useConnect, useDisconnect, useBalance, Address } from "wagmi";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { useState, useEffect } from 'react';
import { truncateEthAddress } from '@/lib/utils';
import { NetworkSelector } from './NetwokSelector';

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

const Navigation = () => {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const [_isConnected, _setIsConnected] = useState(false)
  const { connect } = useConnect({ connector: new MetaMaskConnector() })
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (isConnected)
      _setIsConnected(true)
    else
      _setIsConnected(false)
  }, [
    isConnected
  ])

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Tic - Tac - Toe</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
          <Nav>
            <Nav.Link href="/games">Games</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>

            {
              !_isConnected && <Button onClick={() => connect()} size="sm" variant='success'>Connect Wallet</Button>
            }
            {_isConnected && <NetworkSelector />}
            {
              _isConnected && <NavDropdown title={address && <Title address={address} />} id="basic-nav-dropdown" align="end">
                <NavDropdown.Item disabled>{balance?.formatted} {balance?.symbol}</NavDropdown.Item>
                <NavDropdown.Item disabled>10 TIC</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => { disconnect() }}>
                  Disconnect
                </NavDropdown.Item>
              </NavDropdown>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;