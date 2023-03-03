import styles from '@/styles/board.module.css'
import { useState } from 'react'

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

const Board = () => {
  const [board, setBoard] = useState(new Array(9).fill(null))
  const [player, setPlayer] = useState('X')

  const handleSelected = (position: number) => {
    if (board[position] !== null) { return }

    const newBoard = [...board]
    newBoard[position] = player
    setBoard(newBoard)
    setPlayer(player === 'X' ? 'O' : 'X');
  }

  return <div className="d-flex align-items-center flex-column">
    <Line>
      {board.slice(0, 3).map((cell, index) => <Cell key={index} position={index} onSelected={handleSelected}>{cell}</Cell>)}
    </Line>

    <Line>
      {board.slice(3, 6).map((cell, index) => <Cell key={index} position={index + 3} onSelected={handleSelected}>{cell}</Cell>)}
    </Line>

    <Line>
      {board.slice(6, 9).map((cell, index) => <Cell key={index} position={index + 6} onSelected={handleSelected}>{cell}</Cell>)}
    </Line>
  </div>
}

export default Board