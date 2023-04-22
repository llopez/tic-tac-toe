import { useContext, useEffect } from "react"
import {
  usePrepareContractWrite,
  useContractWrite, useContractRead,
  readContracts,
  Address,
  useProvider,
} from "wagmi"

import TicTacToe from '@/abis/TicTacToe.json'
import { BigNumber, ethers } from "ethers"
import List from "@/components/List"
import { E_Game_State, E_Transaction_Action, I_Game_Response } from "@/types"
import { Context } from "@/components/StateProvider"
import { E_GameActionType } from "@/reducers/games"
import { E_NotificationActionType } from "@/reducers/notifications"
import { E_TransactionActionType } from "@/reducers/transaction"
import { Button, Col, Form, Row } from "react-bootstrap"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

const GamesPage = () => {
  const [{ games }, dispatch] = useContext(Context)
  const provider = useProvider()

  useEffect(() => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, TicTacToe.abi, provider)

    contract.on('GameCreated', async (gameId: BigNumber, player: Address, betAmount: BigNumber) => {
      console.log('Contract GameCreated', gameId.toNumber(), player);

      dispatch({
        type: E_GameActionType.AddGame,
        payload: {
          id: gameId.toNumber(),
          player1: player,
          player2: ethers.constants.AddressZero,
          state: E_Game_State.WaitingForPlayer,
          betAmount: parseFloat(ethers.utils.formatEther(betAmount))
        }
      })

      const notificationId = 'GameCreated'
        .concat('-')
        .concat(gameId.toString())

      dispatch({
        type: E_NotificationActionType.AddNotification, payload: {
          title: 'Game Created',
          body: `${player} has created a game with id ${gameId.toNumber()}`,
          id: notificationId
        }
      })
    })

    return () => {
      contract.removeAllListeners();
    }

  }, [provider, dispatch])


  const { data: gameCount } = useContractRead({
    address: CONTRACT_ADDRESS,
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
    address: CONTRACT_ADDRESS,
    functionName: 'createGame',
    abi: TicTacToe.abi,
    args: [ethers.utils.parseEther('1.5')]
  })

  useEffect(() => {
    (async () => {
      const count = Array(gameCount?.toNumber()).keys()

      const res = await readContracts({
        contracts: Array.from(count).map((i) => ({
          address: CONTRACT_ADDRESS,
          abi: TicTacToe.abi,
          functionName: 'games',
          args: [i]
        }))
      }) as I_Game_Response[]

      if (res[0] === null) { return }

      dispatch({
        type: E_GameActionType.LoadGames,
        payload: res.map(({ id, player1, player2, state, betAmount }) => ({ id: id.toNumber(), player1, player2, state, betAmount: parseFloat(ethers.utils.formatEther(betAmount)) }))
      })

    })()
  }, [gameCount, dispatch])

  const { write: createGameWrite, data: createGameData } = useContractWrite(config)

  useEffect(() => {
    if (createGameData) {
      dispatch({
        type: E_TransactionActionType.AddTransaction,
        payload: {
          hash: createGameData.hash,
          action: E_Transaction_Action.CreateGame,
        }
      })
    }
  }, [dispatch, createGameData])

  const handleCreateGame = () => {
    console.log('handleCreateGame')
    createGameWrite?.()
  }

  return <Row className="justify-content-between">
    <Col md={2}>
      <Button variant='dark' onClick={handleCreateGame}>New Game</Button>
    </Col>
    <Col md={6} className="text-end">
      <Button variant='dark'>Waiting</Button>
      <Button variant='default' className="mx-2">Finished</Button>
      <Button variant='default'>Playing</Button>
    </Col>
    <Col md={4}>
      <Form.Control
        type="text"
        placeholder="type address"
        aria-label="Input group example"
        aria-describedby="btnGroupAddon"
      />
    </Col>
    <Col md={12}>
      <List items={games} />
    </Col>
  </Row>
}

export default GamesPage