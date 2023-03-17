import { useContext, useEffect, useState } from "react"
import {
  useAccount,
  usePrepareContractWrite,
  useContractEvent, useContractWrite, useContractRead,
  readContracts,
  Address
} from "wagmi"

import TicTacToe from '../../../artifacts/contracts/TicTacToe.sol/TicTacToe.json'
import { BigNumber, ethers } from "ethers"
import { Alert } from "react-bootstrap"
import List from "@/components/List"
import { I_Game_Response } from "@/types"
import { Context } from "@/components/StateProvider"
import { E_GameActionType } from "@/reducers/games"
import { E_NotificationActionType } from "@/reducers/notifications"

const GamesPage = () => {
  const { isConnected } = useAccount()
  const [_isConnected, _setIsConnected] = useState(false)

  const [{ games }, dispatch] = useContext(Context)

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
      }) as I_Game_Response[]

      if (res[0] === null) { return }

      dispatch({
        type: E_GameActionType.LoadGames,
        payload: res.map(({ id, player1, player2, state }) => ({ id: id.toNumber(), player1, player2, state }))
      })

    })()
  }, [gameCount, dispatch])

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
      // this is because hardhat is not emitting events correctly
      if (games[id.toNumber()]) { return }

      dispatch({
        type: E_GameActionType.AddGame,
        payload: { id: id.toNumber(), player1, player2: ethers.constants.AddressZero, state: 0 }
      })

      dispatch({
        type: E_NotificationActionType.AddNotification,
        payload: { id: id.toNumber(), title: 'Game Created', body: `Game ${id.toNumber()} created by ${player1}` }
      })

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