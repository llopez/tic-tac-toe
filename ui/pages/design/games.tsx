import { truncateEthAddress } from '@/lib/utils'
import { Container, Row, Col, Card, ListGroup, Image } from 'react-bootstrap'

const Item = (props) => <Card>
  <Row className="align-items-center">
    <Col>
      <Card.Body>
        <Card.Title>{props.data.title}</Card.Title>
        <Card.Subtitle>{props.data.status}</Card.Subtitle>
      </Card.Body>
      <ListGroup variant="flush" className="border-0">
        <ListGroup.Item className="border-0 pb-0">
          <Image src={`https://effigy.im/a/${props.data.player1}.png`} alt="avatar" rounded style={{ width: 24 }} />
          <span className="p-2">{truncateEthAddress(props.data.player1)}</span>
        </ListGroup.Item>
        <ListGroup.Item className="border-0 pb-0">
          <Image src={`https://effigy.im/a/${props.data.player2}.png`} alt="avatar" rounded style={{ width: 24 }} />
          <span className="p-2">{truncateEthAddress(props.data.player2)}</span>
        </ListGroup.Item>
        <ListGroup.Item className="border-0">{props.data.bidAmount} TIC</ListGroup.Item>
      </ListGroup>
      <Card.Body className="justify-content-center d-flex">
        <Card.Link href="#">Join</Card.Link>
        <Card.Link href="#">Watch</Card.Link>
      </Card.Body>
    </Col>
    <Col className="border-start">
      <Card.Body >
        <div className="d-flex flex-column fs-2">
          <div className="d-flex justify-content-center">
            <div className="px-1">O</div>
            <div className="px-1">X</div>
            <div className="px-1">O</div>
          </div>
          <div className="d-flex justify-content-center">
            <div className="px-1">O</div>
            <div className="px-1">X</div>
            <div className="px-1">O</div>
          </div>
          <div className="d-flex justify-content-center">
            <div className="px-1">O</div>
            <div className="px-1">X</div>
            <div className="px-1">O</div>
          </div>
        </div>
      </Card.Body>
    </Col>
  </Row>
</Card>

const games = [
  { title: "Game #1", player1: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", player2: "0x976AA98DC7E2f93DfB0B74B2AafCD2abb05E8F15", status: "Waiting", bidAmount: 10 },
  { title: "Game #2", player1: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", player2: "0x976AA98DC7E2f93DfB0B74B2AafCD2abb05E8F15", status: "Player1Turn", bidAmount: 10 },
  { title: "Game #3", player1: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", player2: "0x976AA98DC7E2f93DfB0B74B2AafCD2abb05E8F15", status: "Draw", bidAmount: 10 },
  { title: "Game #4", player1: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", player2: "0x976AA98DC7E2f93DfB0B74B2AafCD2abb05E8F15", status: "Player2Turn", bidAmount: 10 },
  { title: "Game #5", player1: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", player2: "0x976AA98DC7E2f93DfB0B74B2AafCD2abb05E8F15", status: "Player1Won", bidAmount: 10 },
  { title: "Game #6", player1: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", player2: "0x976AA98DC7E2f93DfB0B74B2AafCD2abb05E8F15", status: "Player2Won", bidAmount: 10 },
]

const Page = () => {
  return (
    <Container>
      <Row>
        {
          games.map((game, index) =>
            <Col key={index} md={4} className="mb-2">
              <Item data={game} />
            </Col>
          )
        }
      </Row>
    </Container>
  )
}

export default Page