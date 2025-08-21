import React, { useState, useEffect } from 'react';
import ChessBoard from './components/ChessBoard';
import { EightQueens } from './utils/eightQueens';
import './8screen.css';

const bgImage = '/bg.png';
const logoImage = '/heading.png';
const taskTitleImage = '/logo2.png';
const walletImage = '/pg.png';

export default function Task1() {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [gameInstance, setGameInstance] = useState(new EightQueens());
  const [board, setBoard] = useState([]);
  const [queensLocations, setQueensLocations] = useState([]);
  const [attackingQueens, setAttackingQueens] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [algorithmInfo, setAlgorithmInfo] = useState(null);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    // Initialize the game
    initializeGame();
  }, []);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const initializeGame = () => {
    const newGame = new EightQueens();
    newGame.placeQueens();
    
    setGameInstance(newGame);
    setBoard(newGame.getBoardState());
    setQueensLocations(newGame.getQueensLocations());
    setAttackingQueens(newGame.calculateAttackingQueens());
    setAlgorithmInfo(null);
  };

  const handleRandomPlacement = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      gameInstance.placeQueens();
      setBoard(gameInstance.getBoardState());
      setQueensLocations(gameInstance.getQueensLocations());
      setAttackingQueens(gameInstance.calculateAttackingQueens());
      setAlgorithmInfo(null);
      setIsLoading(false);
    }, 100);
  };

  const handleSolveRandom = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const result = gameInstance.generateRandomSolution();
      setBoard(result.board);
      setQueensLocations(result.locations);
      setAttackingQueens(result.attackingQueens || 0);
      setAlgorithmInfo({
        method: 'Random Generation',
        success: result.success,
        attempts: result.attempts,
        description: result.success 
          ? `Found solution in ${result.attempts} attempts using random placement.`
          : `Could not find solution after ${result.attempts} attempts. Current conflicts: ${result.attackingQueens}`
      });
      setIsLoading(false);
    }, 100);
  };

  const handleSolveHillClimbing = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const result = gameInstance.solveWithHillClimbing();
      setBoard(result.board);
      setQueensLocations(result.locations);
      setAttackingQueens(result.attackingQueens);
      setAlgorithmInfo({
        method: 'Hill Climbing',
        success: result.success,
        iterations: result.iterations,
        description: result.success 
          ? `Solved in ${result.iterations} iterations using hill climbing algorithm.`
          : `Could not solve after ${result.iterations} iterations. Remaining conflicts: ${result.attackingQueens}`
      });
      setIsLoading(false);
    }, 100);
  };

  return (
    <div className="task1-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="top-bar">
        <img src={logoImage} alt="Campus Quest 4.0" className="logo" />
        <img src={taskTitleImage} alt="Task 1" className="task-title-image" />
        <div className="top-right-container">
          <div className="timer-wrapper">
            <div className="timer">
              TIME : <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="wallet-wrapper">
            <img src={walletImage} alt="Wallet" className="wallet-image" />
          </div>
        </div>
      </div>

      {/* Chess Board Display */}
      <ChessBoard 
        board={board}
        queensLocations={queensLocations}
        attackingQueens={attackingQueens}
      />

      {/* Game Controls */}
      <div className="game-controls">
        <button 
          className="control-button" 
          onClick={handleRandomPlacement}
          disabled={isLoading}
        >
          {isLoading ? 'Placing...' : 'Random Placement'}
        </button>
        <button 
          className="control-button" 
          onClick={handleSolveRandom}
          disabled={isLoading}
        >
          {isLoading ? 'Solving...' : 'Solve (Random)'}
        </button>
        <button 
          className="control-button" 
          onClick={handleSolveHillClimbing}
          disabled={isLoading}
        >
          {isLoading ? 'Solving...' : 'Solve (Hill Climbing)'}
        </button>
        <button 
          className="control-button" 
          onClick={initializeGame}
          disabled={isLoading}
        >
          Reset Game
        </button>
      </div>

      {/* Algorithm Information */}
      {algorithmInfo && (
        <div className="algorithm-info">
          <h3>{algorithmInfo.method} Results</h3>
          <p>{algorithmInfo.description}</p>
          {algorithmInfo.attempts && (
            <p>Attempts: {algorithmInfo.attempts}</p>
          )}
          {algorithmInfo.iterations && (
            <p>Iterations: {algorithmInfo.iterations}</p>
          )}
        </div>
      )}

      <button className="start-button">SKIP</button>
    </div>
  );
}