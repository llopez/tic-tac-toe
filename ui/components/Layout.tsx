import React, { useEffect, useState } from "react"
import { Container, Alert, Row, Col } from "react-bootstrap"
import { Chain, useNetwork, useAccount } from "wagmi";
import { goerli, hardhat } from 'wagmi/chains'
import Navigation from "./Navigation";
import Notifications from "./Notifications";
import Transaction from "./Transaction";

// const environmentChains: { [key: string]: Chain[] } = {
//   development: [goerli, hardhat],
//   production: [goerli]
// }

// export const availableChains = environmentChains[process.env.NODE_ENV]

const Layout = (props: React.PropsWithChildren) => {
  const { children } = props
  // const { isConnected } = useAccount()
  // const [_isConnected, _setIsConnected] = useState(false)
  // const { chain } = useNetwork()
  // const [networkSupported, setNetworkSupported] = useState(false)

  // useEffect(() => {
  //   if (isConnected)
  //     _setIsConnected(true)
  //   else
  //     _setIsConnected(false)
  // }, [
  //   isConnected
  // ])

  // useEffect(() => {
  //   const isSupportedNetwork = chain && availableChains.map(c => c.id).includes(chain.id)

  //   setNetworkSupported(!!isSupportedNetwork)
  // }, [chain])

  // return <Container fluid>
  //   <Navigation />
  //   <Notifications />
  //   <Transaction />
  //   <Container className="mt-2">
  //     {/* {!_isConnected && <Alert variant="info">
  //       Connect your wallet to play!
  //     </Alert>}
  //     {_isConnected && !networkSupported && <Alert variant="info">
  //       Network not supported, please change to goerli
  //     </Alert>}
  //     {_isConnected && networkSupported && children} */}
  //     {children}
  //   </Container>
  // </Container>

  return <Container fluid style={{ background: "rgb(241, 241, 243)" }} className="vh-100 p-0">
    <Navigation />
    <Notifications />
    <Transaction />
    <Row style={{ minHeight: '100px' }} className="p-0 m-0">
      <Col xs={1} sm={1} md={2} className="m-0 p-0 d-flex flex-column" >
        <Col md={12} className="m-0 p-0" style={{ height: 50, background: "#2B2D3C" }}>
        </Col>
        <Col md={12} className="m-0 p-0" style={{ height: '100%', background: "rgb(241, 241, 243)" }}>
        </Col>
      </Col>
      <Col xs={10} sm={10} md={8} className="p-0" style={{ background: "#2B2D3C" }}>
        <Col md={12} className="rounded-top bg-white p-2" style={{ background: "#2B2D3C" }}>

        </Col>
        <Col md={12} className="rounded-bottom bg-white h-100 p-2" >
          {children}
        </Col>
      </Col>
      <Col xs={1} sm={1} md={2} className="m-0 p-0 d-flex flex-column">
        <Col md={12} className="m-0 p-0" style={{ height: 50, background: "#2B2D3C" }}>
        </Col>
        <Col md={12} className="m-0 p-0" style={{ height: '100%', background: "rgb(241, 241, 243)" }}>
        </Col>
      </Col>
    </Row>
    <Row style={{ height: '50px', background: "rgb(241, 241, 243)" }} className="p-0 m-0">
      <Col></Col>
    </Row>
  </Container >
}

export default Layout