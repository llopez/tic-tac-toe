import Board from "@/components/Board"
import { useRouter } from "next/router"

const Game = () => {
  const router = useRouter()
  const { id } = router.query

  return <div>
    <h1>Game {id}</h1>

    <div>
      <Board />
    </div>
  </div>
}

export default Game