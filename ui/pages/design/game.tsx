import { truncateEthAddress } from '@/lib/utils'
import { Container, Row, Col, Image } from 'react-bootstrap'
import { Address } from 'wagmi'

const game: { player1: Address } = {
  title: "Game #1", player1: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", player2: "0x976AA98DC7E2f93DfB0B74B2AafCD2abb05E8F15", status: "Waiting", bidAmount: 10
}

const Page = () => {
  return (
    <Container>
      <Row className="justify-content-center d-flex align-items-center">
        <Col className="justify-content-end d-flex" md={4}>
          <span className="p-2">{truncateEthAddress(game.player1)}</span>
          <Image src={`https://effigy.im/a/${game.player1}.png`} alt="avatar" rounded style={{ width: 40, height: 40 }} />
        </Col>
        <Col>
          <Row>
            <Col><h1 className="text-center">{game.title}</h1></Col>
          </Row>
          <Row>
            <Col>
              <h3 className="text-center">{game.status}</h3 >
            </Col>
            <Col>
              <h3 className="text-center">{game.bidAmount} TIC</h3 >
            </Col>
          </Row>
        </Col>
        <Col className="" md={4}>
          <Image src={`https://effigy.im/a/${game.player1}.png`} alt="avatar" rounded style={{ width: 40, height: 40 }} />
          <span className="p-2">{truncateEthAddress(game.player1)}</span>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col md={6} className="justify-content-center d-flex">
          <Row xs={3} md={3} style={{ height: 300 }}>
            <Col className="border fs-1 justify-content-center align-items-center d-flex">0</Col>
            <Col className="border fs-1 justify-content-center align-items-center d-flex">1</Col>
            <Col className="border fs-1 justify-content-center align-items-center d-flex">2</Col>
            <Col className="border fs-1 justify-content-center align-items-center d-flex">3</Col>
            <Col className="border fs-1 justify-content-center align-items-center d-flex">4</Col>
            <Col className="border fs-1 justify-content-center align-items-center d-flex">5</Col>
            <Col className="border fs-1 justify-content-center align-items-center d-flex">6</Col>
            <Col className="border fs-1 justify-content-center align-items-center d-flex">7</Col>
            <Col className="border fs-1 justify-content-center align-items-center d-flex">8</Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Page