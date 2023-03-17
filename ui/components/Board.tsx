import styles from '@/styles/board.module.css'
import { ethers } from 'ethers'

interface CellProps extends React.PropsWithChildren<{}> {
  onSelected: (position: number) => void
  position: number
}

const Cell = (props: CellProps) => {
  const { children, onSelected, position } = props

  const handleClick = () => {
    onSelected(position);
  }

  return <div
    className={`${styles.cell} border align-items-center justify-content-center d-flex`}
    onClick={handleClick}>
    {children}
  </div>
}

const Line = (props: React.PropsWithChildren) => {
  const { children } = props

  return <div className="d-flex">
    {children}
  </div>
}

interface BoardProps {
  data: string[],
  player1?: string,
  player2?: string,
  onSelected: (position: number) => void,
}

const Board = (props: BoardProps) => {
  const { data, onSelected, player1 } = props;

  const handleCellChange = (position: number) => {
    onSelected(position)
  }

  const symbol = (address: string) => {
    if (address === ethers.constants.AddressZero) {
      return null
    }

    if (address === player1)  {
      return 'X'
    }

    return 'O'
  }

  return <div className="d-flex align-items-center flex-column">
    <Line>
      {data.slice(0, 3).map((address, index) => <Cell key={index} position={index} onSelected={handleCellChange}>{symbol(address)}</Cell>)}
    </Line>

    <Line>
      {data.slice(3, 6).map((address, index) => <Cell key={index} position={index + 3} onSelected={handleCellChange}>{symbol(address)}</Cell>)}
    </Line>

    <Line>
      {data.slice(6, 9).map((address, index) => <Cell key={index} position={index + 6} onSelected={handleCellChange}>{symbol(address)}</Cell>)}
    </Line>
  </div>
}

export default Board