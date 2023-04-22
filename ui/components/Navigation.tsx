import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
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
              _isConnected && <NavDropdown title={address && <Title address={address} />} id="basic-nav-dropdown" align="end">
                <NavDropdown.Item disabled>{balance?.formatted} {balance?.symbol}</NavDropdown.Item>
                <NavDropdown.Item disabled>{ticBalance ? ethers.utils.formatEther(ticBalance) : '0'} TIC</NavDropdown.Item>
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