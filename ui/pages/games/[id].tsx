import Board from "@/components/Board"
import { useRouter } from "next/router"
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractEvent,
} from "wagmi"
import { readContract, readContracts, writeContract, prepareWriteContract, Address } from "@wagmi/core"
import TicTacToe from '../../../artifacts/contracts/TicTacToe.sol/TicTacToe.json'
import { Button, Card, Badge } from "react-bootstrap"
import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { Game, GameState, RawGame } from "."
import { Title } from "@/components/Navigation"
import { CaretLeft, Trophy } from "react-bootstrap-icons"

const GamePage = () => {
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [board, setBoard] = useState<string[]>([])
  const { id } = router.query

  const { config } = usePrepareContractWrite({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    functionName: 'joinGame',
    abi: TicTacToe.abi,
    args: [id]
  })

  const { write } = useContractWrite(config)

  const makeMove = async (position: number): Promise<void> => {
    const config = await prepareWriteContract({
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      abi: TicTacToe.abi,
      functionName: 'makeMove',
      args: [id, position]
    })

    await writeContract(config)
  }

  const fetchGame = async (gameId: string) => {
    const data = await readContract({
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      abi: TicTacToe.abi,
      functionName: 'games',
      args: [gameId]
    }) as RawGame

    setGame({
      ...data,
      id: data.id.toNumber(),
    })
  }

  const fetchBoard = async (gameId: string) => {
    const count = Array(9).keys()

    const data = await readContracts({
      contracts: Array.from(count).map(position => ({
        address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        abi: TicTacToe.abi,
        functionName: 'boards',
        args: [gameId, position]
      })),
    }) as string[]

    setBoard(data)

    console.log(data)
  }

  useContractEvent({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: [{
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "player",
          "type": "address"
        }
      ],
      "name": "PlayerJoined",
      "type": "event"
    },],
    eventName: 'PlayerJoined',
    listener: async (id: BigNumber, guest: string): Promise<void> => {
      await fetchGame(id.toString())

      console.log('PlayerJoined', id.toNumber(), guest);
    }
  })

  useContractEvent({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: [{
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "position",
          "type": "uint8"
        }
      ],
      "name": "MoveMade",
      "type": "event"
    }],
    eventName: 'MoveMade',
    listener: async (gameId: BigNumber, player: Address, position: number): Promise<void> => {
      await fetchBoard(id as string)
      await fetchGame(id as string)
      console.log('MoveMade', gameId.toNumber(), player, position);
    }
  })

  const handleJoinGame = () => {
    write?.()
  }

  useEffect(() => {
    console.log("id", id)
    if (id) {
      fetchGame(id as string)
      fetchBoard(id as string)
    }
  }, [id])

  const handleBoardChange = async (position: number): Promise<void> => {
    await makeMove(position)
    console.log('handleBoardChange', position)
  }

  if (game === null) {
    return <div>Loading...</div>
  }

  return <div>
    {
      game.state === 0 && <Button onClick={handleJoinGame}>Join Game</Button>
    }
    <Card className="mt-1 me-1">
      <Card.Body>
        <Card.Title>Game {id}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          <Badge bg="primary">
            {GameState[game.state]}
          </Badge>
        </Card.Subtitle>
        <Card.Text>
          <Title address={game.player1} />
          {game.state === GameState.Player1Turn && <CaretLeft size={24} />}
          {game.state === GameState.Player1Won && <Trophy size={24} />}
        </Card.Text>
        <Card.Text>
          <Title address={game.player2} />
          {game.state === GameState.Player2Turn && <CaretLeft size={24} />}
          {game.state === GameState.Player2Won && <Trophy size={24} />}
        </Card.Text>
        <Card.Body>
          <Board
            data={board}
            onSelected={handleBoardChange}
            player1={game.player1}
            player2={game.player2}
          />
        </Card.Body>
      </Card.Body>
    </Card>
  </div>
}

export default GamePage