import { useEffect, useState } from "react"
import { Address, useContractRead, useAccount } from "wagmi"
import { prepareWriteContract, writeContract } from "@wagmi/core"

import VaultABI from '@/abis/Vault.json'
import { BigNumber, ethers } from "ethers"

const WithdrawBox = () => {
  const { address } = useAccount()
  const [amount, setAmount] = useState(0)

  const { data: availableBalance }: { data: BigNumber | undefined } = useContractRead({
    abi: VaultABI.abi,
    functionName: 'getAvailableBalance',
    address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address,
    args: [address]
  })

  const handleWithdraw = async () => {
    const config = await prepareWriteContract({
      address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address,
      abi: VaultABI.abi,
      functionName: 'withdraw',
      args: [ethers.utils.parseEther(amount.toString())]
    })

    const { hash } = await writeContract(config)

    console.log("handleWithdraw: ", hash, amount)

  }

  const amountInWei = ethers.utils.parseEther(amount.toString())

  return (
    <div>
      <h1>Withdraw</h1>
      <p>Available Balance: {ethers.utils.formatEther(availableBalance)}</p>
      <p>Amount: {amount}</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
      />


      <button onClick={handleWithdraw}>Withdraw</button>


    </div>
  )
}

export default WithdrawBox