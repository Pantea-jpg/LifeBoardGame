import { useEffect, useState, useRef } from "react";
import "./LifeGameBoard.css";

const initializeGrid = (rows: number, columns: number) => {
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => (Math.random() > 0.5 ? 0 : 1)),
  );
  return grid;
};

interface LifeGameBoardProps {}

const LifeGameBoard = ({}: LifeGameBoardProps) => {
  const [rows, setRows] = useState(50);
  const [cols, setCols] = useState(50);
  const [showPlay, setShowPlay] = useState(true);
  const [grid, setGrid] = useState<number[][]>(initializeGrid(rows, cols));

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetGrid = () => {
    setGrid(initializeGrid(rows, cols));
  };

  const flipElement = (x: number, y: number) => {
    const newGrid = [...grid.map((row) => [...row])];
    newGrid[y][x] = newGrid[y][x] === 1 ? 0 : 1;
    setGrid(newGrid);
  };

  const step = () => {
    setGrid((currentGrid) => {
      // چرا با newGrid نمیشه
      const newGrid = [...currentGrid.map((r) => [...r])];
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < cols; column++) {
          let aliveCells = 0;

          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              if (x === 0 && y === 0) {
                continue;
              }
              const newRow = row + x;
              const newColumn = column + y;
              if (
                newRow < 0 ||
                newColumn < 0 ||
                newRow >= rows ||
                newColumn >= cols
              ) {
                continue;
              }
              if (currentGrid[newRow][newColumn] === 1) {
                aliveCells++;
              }
            }
          }

          if (currentGrid[row][column] === 1) {
            if (aliveCells < 2 || aliveCells > 3) {
              newGrid[row][column] = 0;
            } else if (aliveCells === 2 || aliveCells === 3) {
              newGrid[row][column] = 1;
            }
          } else {
            if (aliveCells === 3) {
              newGrid[row][column] = 1;
            }
          }
        }
      }
      return newGrid;
    });
  };

  const playBtn = () => {
    if (showPlay) {
      if (intervalRef.current !== null) {
        return;
      }
      setShowPlay(false);
      intervalRef.current = setInterval(step, 100);
    } else {
      setShowPlay(true);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stepBtn = () => {
    if (!showPlay) {
      return;
    }

    step();
  };

  return (
    <div className="game-container">
      <div className="game-card">
        <div className="game-header">
          <div>
            <h1>Conway's Game of Life</h1>
            <p>Cellular automaton simulator</p>
          </div>

          <div className={`status ${showPlay ? "paused" : "running"}`}>
            {showPlay ? "PAUSED" : "RUNNING"}
          </div>
        </div>

        <div className="controls">
          <div className="input-group">
            <label>ROWS</label>
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label>COLUMNS</label>
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value))}
            />
          </div>

          <button className="set-button" onClick={resetGrid}>
            Set Grid
          </button>

          <div className="spacer" />

          <button
            className="step-button"
            onClick={stepBtn}
            disabled={!showPlay}
          >
            Step
          </button>

          <button
            className={`play-button ${showPlay ? "play" : "stop"}`}
            onClick={playBtn}
          >
            {showPlay ? "▶ Play" : "■ Stop"}
          </button>
        </div>

        <div className="grid-container">
          <div className="grid">
            {grid.map((row, y) => (
              <div className="grid-row" key={y}>
                {row.map((col, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`cell ${col === 1 ? "alive" : "dead"}`}
                    onClick={() => flipElement(x, y)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="game-footer">
          <span>
            Grid: {rows} × {cols}
          </span>

          <span>Click cells to toggle</span>
        </div>
      </div>
    </div>
  );
};

export default LifeGameBoard;
