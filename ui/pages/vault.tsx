import { Address, useAccount, useContractRead } from "wagmi";
import VaultABI from '@/abis/Vault.json';
import { BigNumber, ethers } from "ethers";
import DepositBox from "@/components/DepositBox";
import WithdrawBox from "@/components/WithdrawBox";
import { useState } from "react";
import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import TicABI from '@/abis/Tic.json'

interface ItemProps {
  title: string
  value: number
  style?: any
}

const Item = (props: ItemProps) => <Card style={props.style}>
  <Card.Body>
    <Card.Title>{props.title}</Card.Title>
    <Card.Text>{props.value} TIC</Card.Text>
  </Card.Body>
</Card>

const Vault = () => {
  const { address } = useAccount()
  const [balance, setBalance] = useState<number>(0)
  const [deposited, setDeposited] = useState<number>(0)
  const [locked, setLocked] = useState<number>(0)
  const [available, setAvailable] = useState<number>(0)

  useContractRead({
    address: process.env.NEXT_PUBLIC_TIC_ADDRESS as Address,
    abi: TicABI.abi,
    functionName: 'balanceOf',
    args: [address],
    onSuccess(data: BigNumber) {
      setBalance(parseFloat(ethers.utils.formatEther(data)))
    }
  })

  useContractRead({
    address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address,
    abi: VaultABI.abi,
    functionName: 'balanceOf',
    args: [address],
    onSuccess(data: BigNumber) {
      setDeposited(parseFloat(ethers.utils.formatEther(data)))
    }
  })

  useContractRead({
    address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address,
    abi: VaultABI.abi,
    functionName: 'lockedBalanceOf',
    args: [address],
    onSuccess(data: BigNumber) {
      setLocked(parseFloat(ethers.utils.formatEther(data)))
    }
  })

  useContractRead({
    address: process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address,
    abi: VaultABI.abi,
    functionName: 'getAvailableBalance',
    args: [address],
    onSuccess(data: BigNumber) {
      setAvailable(parseFloat(ethers.utils.formatEther(data)))
    }
  })

  const total = balance + deposited

  return (
    <Container>
      <Row>
        <Col >
          <Item title="Wallet" value={balance} style={{ background: '#0dcaf0', color: 'white' }} />
        </Col>
        <Col >
          <Item title="Deposited" value={deposited} style={{ background: '#ffc107', color: 'white' }} />
        </Col>
        <Col>
          <Item title="Locked" value={locked} style={{ background: '#dc3545', color: 'white' }} />
        </Col>
        <Col>
          <Item title="Available" value={available} style={{ background: '#198754', color: 'white' }} />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h5>Wallet / Deposited</h5>
          <ProgressBar>
            <ProgressBar variant="info" now={balance * 100 / total} key={1} title="Wallet" />
            <ProgressBar variant="warning" now={deposited * 100 / total} key={2} title="Deposited" />
          </ProgressBar>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h5>Available / Locked</h5>
          <ProgressBar>
            <ProgressBar variant="success" now={available * 100 / deposited} key={1} title="Available" />
            <ProgressBar variant="danger" now={locked * 100 / deposited} key={2} title="Locked" />
          </ProgressBar>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <DepositBox balance={balance} />
        </Col>
        <Col>
          <WithdrawBox available={available} />
        </Col>
      </Row>
    </Container>
  )
}

export default Vault