import { E_Game_State, I_Game } from "@/types"
import { Card, Badge } from "react-bootstrap"
import { Title } from "./Navigation"

interface ListProps {
  items: I_Game[]
}

interface ItemProps {
  item: I_Game
}

const Item = (props: ItemProps) => {
  const { item } = props
  const { id, state } = item

  return <Card className="mt-1 me-1 col-md-3">
    <Card.Body>
      <Card.Title>Game {id}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">
        <Badge bg="primary">
          {E_Game_State[state]}
        </Badge>
      </Card.Subtitle>
      <Card.Text><Title address={item.player1} /></Card.Text>
      <Card.Text><Title address={item.player2} /></Card.Text>
      <Card.Link href={`/games/${id}`}>Go to game</Card.Link>
    </Card.Body>
  </Card>
}

const List = (props: ListProps) => {
  const { items } = props

  return (
    <div className="d-flex flex-wrap justify-content-center">
      {
        items.map((item) => <Item key={item.id} item={item} />)
      }
    </div>
  )
}

export default List