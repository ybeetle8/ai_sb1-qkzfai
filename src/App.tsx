import React, { useState, useEffect, useCallback } from 'react';
import { Disc, RotateCcw } from 'lucide-react';
import Board from './components/Board';
import { initializeBoard, makeMove, checkGameOver, countDiscs, findBestMove, isValidMove } from './utils/gameLogic';

const App: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(() => initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [scores, setScores] = useState<{ black: number; white: number }>({ black: 2, white: 2 });

  const switchPlayer = useCallback(() => {
    setCurrentPlayer(prevPlayer => {
      const nextPlayer = prevPlayer === 1 ? 2 : 1;
      console.log(`Switching to player ${nextPlayer}`);
      return nextPlayer;
    });
  }, []);

  const handleMove = useCallback((row: number, col: number, player: number) => {
    const newBoard = makeMove(board, row, col, player);
    if (newBoard) {
      setBoard(newBoard);
      const { black, white } = countDiscs(newBoard);
      setScores({ black, white });
      switchPlayer();
    } else {
      console.log(`Invalid move for player ${player} at row ${row}, col ${col}`);
    }
  }, [board, switchPlayer]);

  useEffect(() => {
    if (checkGameOver(board)) {
      setGameOver(true);
      return;
    }

    if (currentPlayer === 2) {
      // AI's turn
      console.log("AI's turn");
      setTimeout(() => {
        const [row, col] = findBestMove(board, 2);
        console.log(`AI chose move: row ${row}, col ${col}`);
        if (row !== -1 && col !== -1) {
          handleMove(row, col, 2);
        } else {
          console.log("AI couldn't find a valid move, switching to player");
          switchPlayer();
        }
      }, 500);
    } else {
      // Check if human player has any valid moves
      let hasValidMove = false;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (isValidMove(board, r, c, 1)) {
            hasValidMove = true;
            break;
          }
        }
        if (hasValidMove) break;
      }
      if (!hasValidMove) {
        console.log("Human player has no valid moves, switching to AI");
        switchPlayer();
      }
    }
  }, [board, currentPlayer, handleMove, switchPlayer]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameOver || currentPlayer === 2) return;
    handleMove(row, col, 1);
  }, [gameOver, currentPlayer, handleMove]);

  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setCurrentPlayer(1);
    setGameOver(false);
    setScores({ black: 2, white: 2 });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">黑白棋 vs AI</h1>
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex items-center">
          <Disc className="w-6 h-6 text-black mr-2" />
          <span className="font-bold">{scores.black}</span>
        </div>
        <div className="flex items-center">
          <Disc className="w-6 h-6 text-white border border-black mr-2" />
          <span className="font-bold">{scores.white}</span>
        </div>
      </div>
      <div className="mb-4">
        {gameOver ? (
          <p className="text-xl font-bold">
            游戏结束！
            {scores.black > scores.white
              ? '你赢了！'
              : scores.white > scores.black
              ? 'AI赢了！'
              : '平局！'}
          </p>
        ) : (
          <p className="text-xl">
            当前回合：
            {currentPlayer === 1 ? (
              <>
                <Disc className="w-6 h-6 text-black inline-block ml-2" />
                <span className="ml-2">你的回合</span>
              </>
            ) : (
              <>
                <Disc className="w-6 h-6 text-white border border-black inline-block ml-2" />
                <span className="ml-2">AI思考中...</span>
              </>
            )}
          </p>
        )}
      </div>
      <Board board={board} onCellClick={handleCellClick} />
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
        onClick={resetGame}
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        重新开始
      </button>
    </div>
  );
};

export default App;