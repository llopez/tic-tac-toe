import Board from "@/components/Board"
import { useRouter } from "next/router"
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractEvent,
  useAccount,
} from "wagmi"
import { readContract, readContracts, writeContract, prepareWriteContract, Address } from "@wagmi/core"
import TicTacToe from '@/abis/TicTacToe.json'
import { Button, Card, Badge } from "react-bootstrap"
import { BigNumber, ethers } from "ethers"
import { useContext, useEffect, useState } from "react"
import { Title } from "@/components/Navigation"
import { CaretLeft, Trophy } from "react-bootstrap-icons"
import { E_Game_State, E_Transaction_Action, I_Game, I_Game_Response } from "@/types"
import { Context } from "@/components/StateProvider"
import { E_NotificationActionType } from "@/reducers/notifications"
import { E_TransactionActionType } from "@/reducers/transaction"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

const GamePage = () => {
  const router = useRouter()
  const [game, setGame] = useState<I_Game | null>(null)
  const [board, setBoard] = useState<string[]>([])
  const { address } = useAccount()
  const { id } = router.query
  const [, dispatch] = useContext(Context)

  useEffect(() => {
    console.log("id", id)
    if (id) {
      (async () => {
        await fetchGame(id as string)
        await fetchBoard(id as string)
      })()
    }
  }, [id])

  useContractEvent({
    address: CONTRACT_ADDRESS,
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

      const notificationId = 'PlayerJoined'
        .concat('-')
        .concat(id.toString())
        .concat('-')
        .concat(guest)

      dispatch({
        type: E_NotificationActionType.AddNotification,
        payload: {
          title: 'Player Joined',
          body: `${guest} has joined the game`,
          id: notificationId
        }
      })

      console.log('PlayerJoined', id.toNumber(), guest);
    }
  })

  useContractEvent({
    address: CONTRACT_ADDRESS,
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
      console.log('MoveMade', gameId.toNumber(), player, position);

      setBoard((prev) => {
        const newBoard = [...prev]
        newBoard[position] = player
        return newBoard
      })

      await fetchGame(id as string)

      const notificationId = 'MoveMade'
        .concat('-')
        .concat(gameId.toString())
        .concat('-')
        .concat(player)
        .concat('-')
        .concat(position.toString())

      dispatch({
        type: E_NotificationActionType.AddNotification, payload: {
          title: 'Move Made',
          body: `${player} has made a move`,
          id: notificationId
        }
      })
    }
  })

  const { config: joinGameConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    functionName: 'joinGame',
    abi: TicTacToe.abi,
    args: [id],
    enabled: game?.state === E_Game_State.WaitingForPlayer
  })

  const { write: joinGameWrite, data: joinGameData } = useContractWrite(joinGameConfig)

  useEffect(() => {
    if (joinGameData) {
      dispatch({
        type: E_TransactionActionType.AddTransaction,
        payload: {
          hash: joinGameData.hash,
          action: E_Transaction_Action.JoinGame
        }
      })
    }
  }, [joinGameData, dispatch])

  const makeMove = async (position: number): Promise<void> => {
    const config = await prepareWriteContract({
      address: CONTRACT_ADDRESS,
      abi: TicTacToe.abi,
      functionName: 'makeMove',
      args: [id, position]
    })

    const { hash } = await writeContract(config)

    dispatch({
      type: E_TransactionActionType.AddTransaction,
      payload: {
        hash,
        action: E_Transaction_Action.MakeMove
      }
    })
  }

  const fetchGame = async (gameId: string) => {
    const data = await readContract({
      address: CONTRACT_ADDRESS,
      abi: TicTacToe.abi,
      functionName: 'games',
      args: [gameId]
    }) as I_Game_Response

    setGame({
      ...data,
      id: data.id.toNumber(),
    })
  }

  const fetchBoard = async (gameId: string) => {
    console.log('fetchBoard', gameId)
    const count = Array(9).keys()

    const data = await readContracts({
      contracts: Array.from(count).map(position => ({
        address: CONTRACT_ADDRESS,
        abi: TicTacToe.abi,
        functionName: 'boards',
        args: [gameId, position]
      })),
    }) as string[]

    setBoard(data)

    console.log(data)
  }

  const handleJoinGame = () => {
    joinGameWrite?.()
  }

  const isYourTurn = () => {
    if (game === null) { return false }
    if (game.state === E_Game_State.Player1Turn && address === game.player1) { return true }
    if (game.state === E_Game_State.Player2Turn && address === game.player2) { return true }

    return false
  }

  const notYourTurn = !isYourTurn()

  const handleBoardChange = async (position: number): Promise<void> => {
    if (board[position] !== ethers.constants.AddressZero) {
      console.log("Cell already taken")
      return
    }
    if (notYourTurn) {
      console.log("Not your turn")
      return
    }

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
            {E_Game_State[game.state]}
          </Badge>
        </Card.Subtitle>
        <Card.Text>
          <Title address={game.player1} />
          {game.state === E_Game_State.Player1Turn && <CaretLeft size={24} />}
          {game.state === E_Game_State.Player1Won && <Trophy size={24} />}
        </Card.Text>
        <Card.Text>
          <Title address={game.player2} />
          {game.state === E_Game_State.Player2Turn && <CaretLeft size={24} />}
          {game.state === E_Game_State.Player2Won && <Trophy size={24} />}
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