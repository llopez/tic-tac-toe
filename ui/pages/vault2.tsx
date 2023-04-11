import { Row, Col, Container, Card, ProgressBar, Button, Form, InputGroup } from "react-bootstrap"

interface ItemProps {
  title: string
  value: number
  style?: any
}

const Item = (props: ItemProps) => <Card style={props.style}>
  <Card.Body>
    <Card.Title>{props.title}</Card.Title>
    <Card.Text>{props.value} TIC</Card.Text>
  </Card.Body>
</Card>

const wallet = 10
const deposited = 5
const locked = 3
const available = deposited - locked
const total = wallet + deposited

const Page = () => {
  return (
    <Container>
      <Row>
        <Col >
          <Item title="Wallet" value={wallet} style={{ background: '#0dcaf0', color: 'white' }} />
        </Col>
        <Col >
          <Item title="Deposited" value={deposited} style={{ background: '#ffc107', color: 'white' }} />
        </Col>
        <Col>
          <Item title="Locked" value={locked} style={{ background: '#dc3545', color: 'white' }} />
        </Col>
        <Col>
          <Item title="Available" value={available} style={{ background: '#198754', color: 'white' }} />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h5>Wallet / Deposited</h5>
          <ProgressBar>
            <ProgressBar variant="info" now={wallet * 100 / total} key={1} title="Wallet" />
            <ProgressBar variant="warning" now={deposited * 100 / total} key={2} title="Deposited" />
          </ProgressBar>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h5>Available / Locked</h5>
          <ProgressBar>
            <ProgressBar variant="success" now={available * 100 / deposited} key={1} title="Available" />
            <ProgressBar variant="danger" now={locked * 100 / deposited} key={2} title="Locked" />
          </ProgressBar>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header as="h5">DEPOSIT</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Amount</Form.Label>

                  <InputGroup>
                    <Form.Control type="number" step="0.1" placeholder="Enter amount to deposit" />
                    <Button>max</Button>
                  </InputGroup>

                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Send
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header as="h5">WITHDRAW</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Amount</Form.Label>
                  <InputGroup>
                    <Form.Control type="number" step="0.1" placeholder="Enter amount to withdraw" />
                    <Button>max</Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Receive
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

  )
}

export default Page