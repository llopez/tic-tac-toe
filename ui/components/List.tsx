import { Row, Col, Badge, Button } from 'react-bootstrap'
import { Title } from './Navigation'
import Link from 'next/link'
import { E_Game_State } from '@/types'
import { I_Game } from '@/types'

interface ListProps {
  items: I_Game[]
}

interface ItemProps {
  data: I_Game
}

const Item = (props: ItemProps) => {
  const { data } = props
  const { id, state, player1, player2, betAmount } = data

  return (
    <Row className="border-bottom">
      <Col md={1} className="py-3">{id}</Col>
      <Col md={2} className="py-3"><Badge className="text-uppercase">{E_Game_State[state]}</Badge></Col>
      <Col md={1} className="py-3">{betAmount.toString()}</Col>
      <Col md={3} className="py-3">
        <Title address={player1} />
      </Col>
      <Col md={3} className="py-3"><Title address={player2} /></Col>
      <Col md={2} className="py-3">
        <Link href={`/games/${id}`} className="btn">Join / Watch</Link>
      </Col>
    </Row>
  )
}

const List = (props: ListProps) => {
  const { items } = props

  return (
    <Row className="mx-2 mt-4">
      <Col>
        <Row>
          <Col>
            <Row className="border-bottom">
              <Col md={1} className="py-1 fw-light">Id</Col>
              <Col md={2} className="py-1 fw-light">State</Col>
              <Col md={1} className="py-1 fw-light">Bet</Col>
              <Col md={3} className="py-1 fw-light">Player 1</Col>
              <Col md={3} className="py-1 fw-light">Player 2</Col>
              <Col md={2} className="py-1"></Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            {
              items.map(item => <Item key={item.id} data={item} />)
            }
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default List