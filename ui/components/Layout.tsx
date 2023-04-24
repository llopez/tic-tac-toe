import Head from "next/head";
import React from "react"
import { Container, Row, Col } from "react-bootstrap"
import Navigation from "./Navigation";
import Notifications from "./Notifications";
import Transaction from "./Transaction";

const Layout = (props: React.PropsWithChildren) => {
  const { children } = props

  return <Container fluid style={{ background: "rgb(241, 241, 243)" }} className="vh-100 p-0">
    <Head>
      <title>Tik Tak ToE</title>
      <meta name="description" content="Tik Tak ToE Blockchain Game" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
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