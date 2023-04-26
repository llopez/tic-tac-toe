import { useContext, useState } from "react"
import { Address } from "wagmi"
import { prepareWriteContract, writeContract } from "@wagmi/core"
import VaultABI from '@/abis/Vault.json'
import { ethers } from "ethers"
import { Button, Card, Form, InputGroup } from "react-bootstrap"
import { E_Transaction_Action } from "@/types"
import { E_TransactionActionType } from "@/reducers/transaction"
import { Context } from "./StateProvider"

interface WithdrawBoxProps {
  available: number
}

const WithdrawBox = (props: WithdrawBoxProps) => {
  const { available } = props
  const [amount, setAmount] = useState<string>('')
  const [, dispatch] = useContext(Context)

  const defaultAmount = amount.length > 0 ? parseFloat(amount) : 0

  const handleWithdraw = async () => {
    const config = await prepareWriteContract({
      address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address,
      abi: VaultABI.abi,
      functionName: 'withdraw',
      args: [ethers.utils.parseEther(defaultAmount.toString())]
    })

    const { hash } = await writeContract(config)

    dispatch({
      type: E_TransactionActionType.AddTransaction,
      payload: {
        hash,
        action: E_Transaction_Action.Withdraw
      }
    })

    setAmount('')

    console.log("handleWithdraw: ", hash, amount)
  }

  const handleSetMaxAmount = () => {
    setAmount(available.toString())
  }

  return (
    <Card>
      <Card.Header as="h5">WITHDRAW</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Amount</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter amount to withdraw"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button onClick={handleSetMaxAmount}>max</Button>
            </InputGroup>
          </Form.Group>
          <Button variant="primary" onClick={handleWithdraw} disabled={defaultAmount > available || amount === ''}>
            Withdraw
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default WithdrawBox