import { useContext, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { Address, useAccount, useContractRead } from "wagmi"
import TicTacToe from '@/abis/TicTacToe.json'
import { BigNumber, ethers } from "ethers"
import { prepareWriteContract, writeContract } from "@wagmi/core"
import { Context } from "./StateProvider"
import { E_TransactionActionType } from "@/reducers/transaction"
import { E_Transaction_Action } from "@/types"
import VaultABI from "@/abis/Vault.json"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address
const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address

const NewGame = () => {
  const { address } = useAccount()
  const [show, setShow] = useState(false)
  const [amount, setAmount] = useState(0)
  const [available, setAvailable] = useState(0)
  const [, dispatch] = useContext(Context)

  useContractRead({
    address: VAULT_ADDRESS,
    abi: VaultABI.abi,
    functionName: 'getAvailableBalance',
    args: [address],
    onSuccess(data: BigNumber) {
      setAvailable(parseFloat(ethers.utils.formatEther(data)))
    }
  })

  const handleCreateGame = async () => {
    const config = await prepareWriteContract({
      address: CONTRACT_ADDRESS,
      abi: TicTacToe.abi,
      functionName: 'createGame',
      args: [ethers.utils.parseEther(amount.toString())]
    })

    const { hash } = await writeContract(config)

    dispatch({
      type: E_TransactionActionType.AddTransaction,
      payload: {
        hash,
        action: E_Transaction_Action.CreateGame,
      }
    })
    setShow(false)
  }

  return (
    <>
      <Modal
        show={show}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => { setShow(false) }}
      >
        <Modal.Header closeButton>
          <Modal.Title>New Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Bet Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                min="0"
                max={available}
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleCreateGame} disabled={amount > available || amount <= 0}>
              Create
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Button variant='dark' onClick={() => { setShow(true) }}>New Game</Button>
    </>
  )

}

export default NewGame