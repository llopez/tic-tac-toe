import { Address, useAccount, useContractRead } from "wagmi";

import VaultABI from '@/abis/Vault.json';
import { BigNumber, ethers } from "ethers";

const Vault = () => {

  const { address } = useAccount()

  const { data: totalBalance }: { data: BigNumber | undefined } = useContractRead({
    address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address,
    abi: VaultABI.abi,
    functionName: 'totalBalance',
  })

  const { data: myBalance }: { data: BigNumber | undefined } = useContractRead({
    address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address,
    abi: VaultABI.abi,
    functionName: 'balanceOf',
    args: [address]
  })

  const { data: lockedBalance }: { data: BigNumber | undefined } = useContractRead({
    address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address,
    abi: VaultABI.abi,
    functionName: 'lockedBalanceOf',
    args: [address]
  })

  const { data: availableBalance }: { data: BigNumber | undefined } = useContractRead({
    address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address,
    abi: VaultABI.abi,
    functionName: 'getAvailableBalance',
    args: [address]
  })

  return (
    <div className="container text-center">
      <div className="row justify-content-between">
        <div className="col col-md-6">
          <h1>Total</h1>
          <h2>{totalBalance ? ethers.utils.formatEther(totalBalance) : '0'} TIC</h2>
        </div>
        <div className="col col-md-6">
          <h1>Balance</h1>
          <h2>{myBalance ? ethers.utils.formatEther(myBalance) : '0'} TIC</h2>
        </div>
        <div className="col col-md-6">
          <h1>Locked</h1>
          <h2>{lockedBalance ? ethers.utils.formatEther(lockedBalance) : '0'} TIC</h2>
        </div>
        <div className="col col-md-6">
          <h1>Available</h1>
          <h2>{availableBalance ? ethers.utils.formatEther(availableBalance) : '0'} TIC</h2>
        </div>
      </div>
      <div className="row">
        <div className="col">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum veniam corrupti, saepe inventore hic obcaecati aut amet perferendis nemo quam blanditiis vero quod officia incidunt. Suscipit odit deserunt iure quam!
        </div>
      </div>
    </div>
  )

}

export default Vault