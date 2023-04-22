import Board from "@/components/Board"
import { useRouter } from "next/router"
import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useProvider,
} from "wagmi"
import { readContract, readContracts, writeContract, prepareWriteContract, Address } from "@wagmi/core"
import TicTacToe from '@/abis/TicTacToe.json'
import { Button, Badge, Row, Col, Image } from "react-bootstrap"
import { BigNumber, ethers } from "ethers"
import { useContext, useEffect, useState } from "react"
import { E_Game_State, E_Transaction_Action, I_Game, I_Game_Response } from "@/types"
import { Context } from "@/components/StateProvider"
import { E_NotificationActionType } from "@/reducers/notifications"
import { E_TransactionActionType } from "@/reducers/transaction"
import { truncateEthAddress } from "@/lib/utils"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

const GamePage = () => {
  const router = useRouter()
  const [game, setGame] = useState<I_Game | null>(null)
  const [board, setBoard] = useState<string[]>([])
  const { address } = useAccount()
  const provider = useProvider()
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


  useEffect(() => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, TicTacToe.abi, provider)

    contract.on('PlayerJoined', async (gameId: BigNumber, player: Address) => {
      console.log('Contract PlayerJoined', gameId.toNumber(), player);

      await fetchGame(gameId.toString())

      const notificationId = 'PlayerJoined'
        .concat('-')
        .concat(gameId.toString())
        .concat('-')
        .concat(player)

      dispatch({
        type: E_NotificationActionType.AddNotification, payload: {
          title: 'Player Joined',
          body: `${player} has joined the game`,
          id: notificationId
        }
      })
    })

    contract.on('MoveMade', async (gameId: BigNumber, player: Address, position: number) => {
      console.log('Contract MoveMade', gameId.toNumber(), player, position);

      await fetchGame(gameId.toString())

      setBoard((prev) => {
        const newBoard = [...prev]
        newBoard[position] = player
        return newBoard
      })

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
    })

    contract.on('GameWon', async (gameId: BigNumber, winner: Address) => {
      console.log('Contract GameWon', gameId.toNumber(), winner);

      const notificationId = 'GameWon'
        .concat('-')
        .concat(gameId.toString())

      dispatch({
        type: E_NotificationActionType.AddNotification, payload: {
          title: 'Game Finished',
          body: `${winner} has won the game`,
          id: notificationId
        }
      })
    })

    contract.on('GameDraw', async (gameId: BigNumber) => {
      console.log('Contract GameDraw', gameId.toNumber());

      const notificationId = 'GameDraw'
        .concat('-')
        .concat(gameId.toString())

      dispatch({
        type: E_NotificationActionType.AddNotification, payload: {
          title: 'Game Draw',
          body: `Game ${gameId.toString()} has ended in a draw`,
          id: notificationId
        }
      })
    })

    return () => {
      contract.removeAllListeners()
    }
  }, [provider, dispatch])

  const { config: joinGameConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    functionName: 'joinGame',
    abi: TicTacToe.abi,
    args: [id],
    // enabled: game?.state === E_Game_State.WaitingForPlayer
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
    console.log('handleJoinGame')
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

  const isPlayer1Turn = game.state === E_Game_State.Player1Turn
  const isPlayer2Turn = !isPlayer1Turn

  return <Row className="justify-content-center m-0 p-0">
    <Col md={4} className="d-flex justify-content-end align-items-center border border-end-0 rounded-start">
      <span className={`p-2 fs-4 ${isPlayer1Turn && 'text-decoration-underline'}`}>{game.player1 && truncateEthAddress(game.player1)}</span>
      <Image src={`https://effigy.im/a/${game.player1}.png`} alt="avatar" rounded style={{ width: 40 }} />
    </Col>
    <Col md={4} className='text-center text-uppercase border-top border-bottom'>
      <Col md={12}>
        <Badge bg="primary">
          {E_Game_State[game.state]}
        </Badge>
      </Col>
      <Col md={12}>{ethers.utils.formatEther(game.betAmount)} TIC</Col>
    </Col>
    <Col md={4} className="d-flex justify-content-start align-items-center border border-start-0 rounded-end">
      {game.state !== E_Game_State.WaitingForPlayer && <Image src={`https://effigy.im/a/${game.player2}.png`} alt="avatar" rounded style={{ width: 40 }} />}
      {game.state !== E_Game_State.WaitingForPlayer && <span className={`p-2 fs-4 ${isPlayer2Turn && 'text-decoration-underline'}`}>{game.player2 && truncateEthAddress(game.player2)}</span>}
      {game.state === E_Game_State.WaitingForPlayer && <Button variant="dark" onClick={handleJoinGame}>Join</Button>}
    </Col>
    <Col md={12} className="mt-4 justify-content-center d-flex">
      <Board
        data={board}
        onSelected={handleBoardChange}
        player1={game.player1}
        player2={game.player2}
      />
    </Col>
  </Row>

}

export default GamePage