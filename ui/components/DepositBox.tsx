import { useEffect, useState } from "react"
import { Address, useContractRead, useAccount } from "wagmi"
import { prepareWriteContract, writeContract } from "@wagmi/core"

import TicABI from '@/abis/Tic.json'
import VaultABI from '@/abis/Vault.json'
import { BigNumber, ethers } from "ethers"

const DepositBox = () => {
  const { address } = useAccount()
  const [amount, setAmount] = useState(0)

  const { data: allowance }: { data: BigNumber | undefined } = useContractRead({
    abi: TicABI.abi,
    functionName: 'allowance',
    address: process.env.NEXT_PUBLIC_TIC_ADDRESS as Address,
    args: [address, process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address]
  })

  useEffect(() => { console.log("allowance", allowance?.toString()) }, [allowance])

  const handleDeposit = async () => {
    const config = await prepareWriteContract({
      address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address,
      abi: VaultABI.abi,
      functionName: 'deposit',
      args: [ethers.utils.parseEther(amount.toString())]
    })

    const { hash } = await writeContract(config)

    console.log("Deposit: ", hash, amount)

  }

  const handleApprove = async () => {
    const config = await prepareWriteContract({
      address: process.env.NEXT_PUBLIC_TIC_ADDRESS as Address,
      abi: TicABI.abi,
      functionName: 'approve',
      args: [process.env.NEXT_PUBLIC_VAULT_ADDRESS, ethers.utils.parseEther(amount.toString())]
    })

    const { hash } = await writeContract(config)

    console.log("Approve: ", hash, amount)
  }

  const amountInWei = ethers.utils.parseEther(amount.toString())

  return (
    <div>
      <h1>Deposit</h1>
      <p>Amount: {amount}</p>
      <input
        type="number"
        step="0.1"
        min="0"
        value={amount}
        onChange={(e) => { if (e.target.value) setAmount(parseFloat(e.target.value)) }}
      />

      {
        allowance?.gte(amountInWei) && <button onClick={handleDeposit}>Deposit</button>
      }

      {
        allowance?.lt(amountInWei) && <button onClick={handleApprove}>Approve</button>
      }
    </div>
  )
}

export default DepositBox