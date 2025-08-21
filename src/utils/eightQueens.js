// 8 Queens Algorithm - JavaScript implementation
// Based on the Python version in the project

export class EightQueens {
  constructor() {
    this.board = this.makeBoard();
    this.queensLocations = [];
  }

  // Create an 8x8 chess board
  makeBoard() {
    return Array(8).fill().map(() => Array(8).fill(0));
  }

  // Reset the board
  resetBoard() {
    this.board = this.makeBoard();
    this.queensLocations = [];
  }

  // Randomly place 8 queens on the board
  placeQueens() {
    this.resetBoard();
    const locations = [];
    let i = 0;

    while (i < 8) {
      let indexX = Math.floor(Math.random() * 8);
      let indexY = Math.floor(Math.random() * 8);

      // Find an empty spot
      while (this.board[indexX][indexY] === 1) {
        indexX = Math.floor(Math.random() * 8);
        indexY = Math.floor(Math.random() * 8);
      }

      this.board[indexX][indexY] = 1; // Place queen (represented by 1)
      locations.push({ x: indexX, y: indexY });
      i++;
    }

    this.queensLocations = locations;
    return locations;
  }

  // Calculate the number of attacking queen pairs
  calculateAttackingQueens() {
    let attackingPairs = 0;

    for (let i = 0; i < this.queensLocations.length; i++) {
      for (let j = i + 1; j < this.queensLocations.length; j++) {
        const queen1 = this.queensLocations[i];
        const queen2 = this.queensLocations[j];

        // Check if queens attack each other
        if (this.areQueensAttacking(queen1, queen2)) {
          attackingPairs++;
        }
      }
    }

    return attackingPairs;
  }

  // Check if two queens are attacking each other
  areQueensAttacking(queen1, queen2) {
    // Same row
    if (queen1.x === queen2.x) return true;
    
    // Same column
    if (queen1.y === queen2.y) return true;
    
    // Same diagonal
    if (Math.abs(queen1.x - queen2.x) === Math.abs(queen1.y - queen2.y)) return true;
    
    return false;
  }

  // Get the current board state
  getBoardState() {
    return this.board.map(row => [...row]); // Return a copy
  }

  // Get queens locations
  getQueensLocations() {
    return [...this.queensLocations]; // Return a copy
  }

  // Check if the puzzle is solved (no attacking queens)
  isSolved() {
    return this.calculateAttackingQueens() === 0;
  }

  // Generate a random solution attempt
  generateRandomSolution() {
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      this.placeQueens();
      if (this.isSolved()) {
        return {
          success: true,
          attempts: attempts + 1,
          board: this.getBoardState(),
          locations: this.getQueensLocations()
        };
      }
      attempts++;
    }

    return {
      success: false,
      attempts: maxAttempts,
      board: this.getBoardState(),
      locations: this.getQueensLocations(),
      attackingQueens: this.calculateAttackingQueens()
    };
  }

  // Hill climbing algorithm to solve 8 queens
  solveWithHillClimbing() {
    this.placeQueens();
    let currentAttacks = this.calculateAttackingQueens();
    let iterations = 0;
    const maxIterations = 1000;

    while (currentAttacks > 0 && iterations < maxIterations) {
      let bestMove = null;
      let bestAttacks = currentAttacks;

      // Try moving each queen to a better position
      for (let queenIndex = 0; queenIndex < this.queensLocations.length; queenIndex++) {
        const originalPos = this.queensLocations[queenIndex];
        
        // Try all positions in the same column
        for (let newRow = 0; newRow < 8; newRow++) {
          if (newRow === originalPos.x) continue;

          // Temporarily move queen
          this.board[originalPos.x][originalPos.y] = 0;
          this.board[newRow][originalPos.y] = 1;
          this.queensLocations[queenIndex] = { x: newRow, y: originalPos.y };

          const attacks = this.calculateAttackingQueens();
          
          if (attacks < bestAttacks) {
            bestAttacks = attacks;
            bestMove = { queenIndex, newPos: { x: newRow, y: originalPos.y } };
          }

          // Restore original position
          this.board[newRow][originalPos.y] = 0;
          this.board[originalPos.x][originalPos.y] = 1;
          this.queensLocations[queenIndex] = originalPos;
        }
      }

      if (bestMove) {
        // Apply the best move
        const oldPos = this.queensLocations[bestMove.queenIndex];
        this.board[oldPos.x][oldPos.y] = 0;
        this.board[bestMove.newPos.x][bestMove.newPos.y] = 1;
        this.queensLocations[bestMove.queenIndex] = bestMove.newPos;
        currentAttacks = bestAttacks;
      } else {
        // No improvement found, restart with random placement
        this.placeQueens();
        currentAttacks = this.calculateAttackingQueens();
      }

      iterations++;
    }

    return {
      success: currentAttacks === 0,
      iterations,
      board: this.getBoardState(),
      locations: this.getQueensLocations(),
      attackingQueens: currentAttacks
    };
  }
}