import { useEffect, useState } from "react"
import { Address, useContractRead, useAccount, useProvider } from "wagmi"
import { prepareWriteContract, writeContract } from "@wagmi/core"
import TicABI from '@/abis/Tic.json'
import VaultABI from '@/abis/Vault.json'
import { BigNumber, ethers } from "ethers"
import { Button, Card, Form, InputGroup } from "react-bootstrap"

interface DepositBoxProps {
  balance: number
}

const TIC_ADDRESS = process.env.NEXT_PUBLIC_TIC_ADDRESS as Address

const DepositBox = (props: DepositBoxProps) => {
  const { balance } = props

  const { address } = useAccount()
  const provider = useProvider()
  const [amount, setAmount] = useState(0)
  const [allowance, setAllowance] = useState<number>(0)

  useEffect(() => {
    const contract = new ethers.Contract(TIC_ADDRESS, TicABI.abi, provider)

    contract.on('Approval', async (owner: Address, spender: Address, _amount: BigNumber) => {
      const amount = ethers.utils.formatEther(_amount)

      console.log('Approval', owner, spender, amount);

      setAllowance(parseFloat(amount))
    })

    return () => { contract.removeAllListeners() }

  }, [provider])

  useContractRead({
    abi: TicABI.abi,
    functionName: 'allowance',
    address: process.env.NEXT_PUBLIC_TIC_ADDRESS as Address,
    args: [address, process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address],
    onSuccess(data: BigNumber) {
      setAllowance(parseFloat(ethers.utils.formatEther(data)))
    },
  })

  const handleDeposit = async () => {
    const config = await prepareWriteContract({
      address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address,
      abi: VaultABI.abi,
      functionName: 'deposit',
      args: [ethers.utils.parseEther(amount.toString())],

    })
    const { hash } = await writeContract(config)
    console.log("Deposit: ", hash, amount)
  }

  const handleApprove = async () => {
    const config = await prepareWriteContract({
      address: process.env.NEXT_PUBLIC_TIC_ADDRESS as Address,
      abi: TicABI.abi,
      functionName: 'approve',
      args: [process.env.NEXT_PUBLIC_VAULT_ADDRESS, ethers.utils.parseEther(amount.toString())],

    })

    const { hash } = await writeContract(config)

    console.log("Approve: ", hash, amount)
  }

  const handleSetMaxAmount = () => {
    setAmount(balance)
  }

  return (
    <Card>
      <Card.Header as="h5">DEPOSIT</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Amount</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                step="0.1"
                min="0"
                max={balance}
                placeholder="Enter amount to deposit"
                value={amount}
                onChange={(e) => { if (e.target.value) setAmount(parseFloat(e.target.value)) }}
              />
              <Button onClick={handleSetMaxAmount}>max</Button>
            </InputGroup>
          </Form.Group>
          {
            allowance >= amount && <Button variant="primary" onClick={handleDeposit}>
              Deposit
            </Button>
          }
          {
            allowance < amount && <Button variant="success" onClick={handleApprove}>
              Approve
            </Button>
          }
        </Form>
      </Card.Body>
    </Card>
  )
}

export default DepositBox