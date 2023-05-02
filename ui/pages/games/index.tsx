import { useContext, useEffect, useState } from "react"
import {
  useContractRead,
  readContracts,
  Address,
  useProvider,
} from "wagmi"
import TicTacToe from '@/abis/TicTacToe.json'
import { BigNumber, ethers } from "ethers"
import List from "@/components/List"
import { E_Game_State, I_Game, I_Game_Response } from "@/types"
import { Context } from "@/components/StateProvider"
import { E_GameActionType } from "@/reducers/games"
import { E_NotificationActionType } from "@/reducers/notifications"
import { Button, Col, Form, Row } from "react-bootstrap"
import NewGame from "@/components/NewGame"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

enum Filter {
  ALL = 'ALL',
  WAITING = 'WAITING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

const GamesPage = () => {
  const [{ games }, dispatch] = useContext(Context)
  const [filteredGames, setFilteredGames] = useState<I_Game[]>([])
  const [paginatedGames, setPaginatedGames] = useState<I_Game[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [totalFilteredItems, setTotalFilteredItems] = useState<number>(0)
  const [filter, setFilter] = useState<Filter>(Filter.ALL)
  const [addressFilter, setAddressFilter] = useState<string>('')
  const provider = useProvider()

  const perPage = 5

  const totalPages = Math.ceil(totalFilteredItems / perPage)

  useEffect(() => {
    setFilteredGames(games)
  }, [games])

  useEffect(() => {
    setPaginatedGames(filteredGames.slice(0, perPage))
    setPage(1)
  }, [filteredGames])

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


  useContractRead({
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
    onSuccess: (gameCount: BigNumber) => {
      setTotalItems(gameCount.toNumber())
      setTotalFilteredItems(gameCount.toNumber())
    }
  })

  useEffect(() => {
    (async () => {
      const count = Array(totalItems).keys()

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
  }, [totalItems, dispatch])

  const handleFilterWaiting = () => {
    const result = games.filter((game) => game.state === E_Game_State.WaitingForPlayer)
    setTotalFilteredItems(result.length)
    setFilteredGames(result)
    setFilter(Filter.WAITING)
    setAddressFilter('')
  }

  const handleFilterFinished = () => {
    const result = games.filter((game) => [E_Game_State.Player1Won, E_Game_State.Player2Won, E_Game_State.Draw].includes(game.state))
    setTotalFilteredItems(result.length)
    setFilteredGames(result)
    setFilter(Filter.FINISHED)
    setAddressFilter('')
  }

  const handleFilterPlaying = () => {
    const result = games.filter((game) => [E_Game_State.Player1Turn, E_Game_State.Player2Turn].includes(game.state))
    setTotalFilteredItems(result.length)
    setFilteredGames(result)
    setFilter(Filter.PLAYING)
    setAddressFilter('')
  }

  const handleResetFilter = () => {
    setTotalFilteredItems(games.length)
    setFilteredGames(games)
    setFilter(Filter.ALL)
    setAddressFilter('')
  }

  const handleFilterAddress = () => {
    if (addressFilter === '') {
      setTotalFilteredItems(games.length)
      setFilteredGames(games)
      setFilter(Filter.ALL)
      return
    }
    const result = games.filter((game) => game.player1 === addressFilter || game.player2 === addressFilter)
    setTotalFilteredItems(result.length)
    setFilteredGames(result)
    setFilter(Filter.ALL)
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    const end = nextPage * perPage
    setPaginatedGames((p) => filteredGames.slice(0, end))
    setPage(nextPage)
  }

  return <Row className="justify-content-between">
    <Col md={2}>
      <NewGame />
    </Col>
    <Col md={6} className="text-end">
      <Button variant='' active={filter === Filter.ALL} onClick={handleResetFilter}>ALL</Button>
      <Button variant='' active={filter === Filter.WAITING} onClick={handleFilterWaiting} className="ms-1">Waiting</Button>
      <Button variant='' active={filter === Filter.FINISHED} onClick={handleFilterFinished} className="ms-1">Finished</Button>
      <Button variant='' active={filter === Filter.PLAYING} onClick={handleFilterPlaying} className="ms-1">Playing</Button>
    </Col>
    <Col md={4}>
      <Form.Control
        type="text"
        placeholder="type address"
        aria-label="Input group example"
        aria-describedby="btnGroupAddon"
        onChange={(e) => setAddressFilter(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && handleFilterAddress()}
        value={addressFilter}
      />
    </Col>
    <Col md={12}>
      <List items={paginatedGames} />
    </Col>
    <Col md={12} className="justify-content-center d-flex mt-4">
      {totalPages > page && <Button onClick={handleLoadMore}>Load more</Button>}
    </Col>
  </Row>
}

export default GamesPage