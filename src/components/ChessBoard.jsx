import React from 'react';
import { Crown } from 'lucide-react';

const ChessBoard = ({ board = [], queensLocations = [], attackingQueens = 0 }) => {
  const renderSquare = (row, col) => {
    const isLight = (row + col) % 2 === 0;

    // Check safely if board[row][col] exists
    const hasQueen = board[row]?.[col] === 1;

    const isAttacking = queensLocations.some(
      (queen) => queen.x === row && queen.y === col && attackingQueens > 0
    );

    return (
      <div
        key={`${row}-${col}`}
        className={`
          chess-square
          ${isLight ? 'light-square' : 'dark-square'}
          ${hasQueen ? 'has-queen' : ''}
          ${isAttacking ? 'attacking-queen' : ''}
        `}
      >
        {hasQueen && (
          <Crown
            size={24}
            className={`queen-icon ${isAttacking ? 'attacking' : 'safe'}`}
          />
        )}
      </div>
    );
  };

  return (
    <div className="chess-board-container">
      <div className="chess-board">
        {Array.from({ length: 8 }, (_, row) =>
          Array.from({ length: 8 }, (_, col) => renderSquare(row, col))
        )}
      </div>
      <div className="board-info">
        <p className="attacking-count">
          Attacking Queen Pairs:{' '}
          <span className={attackingQueens === 0 ? 'solved' : 'unsolved'}>
            {attackingQueens}
          </span>
        </p>
        {attackingQueens === 0 && (
          <p className="success-message">🎉 Puzzle Solved!</p>
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
