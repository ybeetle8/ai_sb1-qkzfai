// Initialize the game board
export const initializeBoard = (): number[][] => {
  const board = Array(8).fill(null).map(() => Array(8).fill(0));
  board[3][3] = board[4][4] = 2; // White
  board[3][4] = board[4][3] = 1; // Black
  return board;
};

// Check if a move is valid
export const isValidMove = (board: number[][], row: number, col: number, player: number): boolean => {
  if (board[row][col] !== 0) return false;

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (const [dx, dy] of directions) {
    let x = row + dx;
    let y = col + dy;
    let foundOpponent = false;

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (board[x][y] === 0) break;
      if (board[x][y] === player) {
        if (foundOpponent) return true;
        break;
      }
      foundOpponent = true;
      x += dx;
      y += dy;
    }
  }

  return false;
};

// Make a move on the board
export const makeMove = (board: number[][], row: number, col: number, player: number): number[][] | null => {
  if (!isValidMove(board, row, col, player)) return null;

  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = player;

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (const [dx, dy] of directions) {
    let x = row + dx;
    let y = col + dy;
    const toFlip: [number, number][] = [];

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (newBoard[x][y] === 0) break;
      if (newBoard[x][y] === player) {
        for (const [fx, fy] of toFlip) {
          newBoard[fx][fy] = player;
        }
        break;
      }
      toFlip.push([x, y]);
      x += dx;
      y += dy;
    }
  }

  return newBoard;
};

// Count the number of discs for each player
export const countDiscs = (board: number[][]): { black: number; white: number } => {
  let black = 0;
  let white = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === 1) black++;
      if (cell === 2) white++;
    }
  }
  return { black, white };
};

// Find the best move for the AI
export const findBestMove = (board: number[][], player: number): [number, number] => {
  let bestScore = -1;
  let bestMove: [number, number] = [-1, -1];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (isValidMove(board, row, col, player)) {
        const newBoard = makeMove(board, row, col, player);
        if (newBoard) {
          const score = countFlippedDiscs(board, newBoard);
          if (score > bestScore) {
            bestScore = score;
            bestMove = [row, col];
          }
        }
      }
    }
  }

  console.log(`Best move found: row ${bestMove[0]}, col ${bestMove[1]} with score ${bestScore}`);
  return bestMove;
};

// Count the number of flipped discs
const countFlippedDiscs = (oldBoard: number[][], newBoard: number[][]): number => {
  let count = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (oldBoard[row][col] !== newBoard[row][col]) {
        count++;
      }
    }
  }
  return count;
};

// Check if the game is over
export const checkGameOver = (board: number[][]): boolean => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (isValidMove(board, row, col, 1) || isValidMove(board, row, col, 2)) {
        return false;
      }
    }
  }
  return true;
};