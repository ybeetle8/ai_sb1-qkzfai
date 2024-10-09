import React, { memo } from 'react';
import Cell from './Cell';

interface BoardProps {
  board: number[][];
  onCellClick: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = memo(({ board, onCellClick }) => {
  return (
    <div className="grid grid-cols-8 gap-1 bg-green-700 p-1 rounded-lg shadow-lg">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
});

Board.displayName = 'Board';

export default Board;