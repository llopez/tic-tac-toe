import { useEffect, useState } from "react"
import {
  useAccount,
  usePrepareContractWrite,
  useContractEvent, useContractWrite, useContractRead,
  readContracts,
  Address
} from "wagmi"

import TicTacToe from '../../../artifacts/contracts/TicTacToe.sol/TicTacToe.json'
import { BigNumber, ethers } from "ethers"

import { Alert, Table } from "react-bootstrap"
import List from "@/components/List"

export interface RawGame {
  id: BigNumber
  player1: Address
  player2: Address
  state: number
}

export enum GameState {
  WaitingForPlayer = 0,
  Player1Turn = 1,
  Player2Turn = 2,
  Player1Won = 3,
  Player2Won = 4,
  Draw = 5,
}

export interface Game {
  id: number
  player1: Address
  player2: Address
  state: GameState
}

const GamesPage = () => {
  const { isConnected } = useAccount()
  const [_isConnected, _setIsConnected] = useState(false)

  const [games, setGames] = useState<Game[]>([])

  const { data: gameCount } = useContractRead({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: [{
      "inputs": [],
      "name": "gameCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },],
    functionName: 'gameCount',
  })

  useEffect(() => { console.log('gameCount', gameCount?.toNumber()) }, [gameCount])


  const { config } = usePrepareContractWrite({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    functionName: 'createGame',
    abi: TicTacToe.abi,
    args: []
  })

  useEffect(() => {
    (async () => {
      const count = Array(gameCount?.toNumber()).keys()

      const res = await readContracts({
        contracts: Array.from(count).map((i) => ({
          address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          abi: TicTacToe.abi,
          functionName: 'games',
          args: [i]
        }))
      }) as RawGame[]

      if (res[0] === null) { return }

      setGames(res.map(({ id, player1, player2, state }) => ({ id: id.toNumber(), player1, player2, state })))

    })()


  }, [gameCount])

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
          "name": "player1",
          "type": "address"
        }
      ],
      "name": "GameCreated",
      "type": "event"
    }],
    eventName: 'GameCreated',
    listener: (id: BigNumber, player1: Address): void => {
      setGames((games) => [
        ...games.filter((g) => g.id !== id.toNumber()),
        { id: id.toNumber(), player1, player2: ethers.constants.AddressZero, state: 0 }
      ])

      console.log('GameCreated', id.toNumber(), player1);
    }
  })

  const { write } = useContractWrite(config)


  useEffect(() => {
    if (isConnected)
      _setIsConnected(true)
    else
      _setIsConnected(false)
  }, [
    isConnected
  ])

  const handleCreateGame = () => {
    console.log('handleCreateGame')
    write?.()
  }

  if (!_isConnected) {
    return <Alert variant="info">
      Connect your wallet to play!
    </Alert>
  }

  return <div>
    <h1>Games</h1>

    <div>
      <button onClick={handleCreateGame}>New Game!</button>
    </div>

    <List items={games} />
  </div>
}

export default GamesPage