import Board from "@/components/Board"
import { useRouter } from "next/router"
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractEvent,
} from "wagmi"
import { readContract } from "@wagmi/core"
import TicTacToe from '../../../artifacts/contracts/TicTacToe.sol/TicTacToe.json'
import { Button } from "react-bootstrap"
import { BigNumber, ethers } from "ethers"
import { useEffect, useState } from "react"
import { Game, RawGame } from "."

const Game = () => {
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const { id } = router.query

  const { config } = usePrepareContractWrite({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    functionName: 'joinGame',
    abi: TicTacToe.abi,
    args: [id]
  })

  const { write } = useContractWrite(config)

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

  const handleJoinGame = () => {
    write?.()
  }

  useEffect(() => {
    if (id) {
      fetchGame(id as string)
    }
  }, [id])

  const handleBoardChange = (position: number) => {
    console.log('handleBoardChange', position)
  }

  return <div>
    <h1>Game {id}</h1>

    <p>Player 1: {game?.player1}</p>
    <p>Player 2: {game?.player2 === ethers.constants.AddressZero ? 'waiting' : game?.player2}</p>
    <p>State: {game?.state}</p>

    {
      game?.state === 0 && <Button onClick={handleJoinGame}>Join Game</Button>
    }

    <div>
      <Board data={new Array(9).fill(null)} onSelected={handleBoardChange} />
    </div>
  </div>
}

export default Game