import { useState } from 'react';

// Types
interface MatrixCell {
  value: number;
  row: number;
  col: number;
  object: string;
}

// Categories data
const CATEGORIES = {
  CITIES: [
    'Tokyo', 'New York', 'London', 'Paris', 'Sydney', 'Mumbai', 'Cairo', 'Rio de Janeiro',
    'Moscow', 'Toronto', 'Singapore', 'Berlin', 'Madrid', 'Rome', 'Amsterdam', 'Vienna'
  ],
  TRANSPORT: [
    'Car', 'Boat', 'Train', 'Plane', 'Bicycle', 'Bus', 'Motorcycle', 'Helicopter',
    'Subway', 'Tram', 'Truck', 'Van', 'Ship', 'Jet', 'Rocket', 'Skateboard'
  ],
  OBJECTS: [
    'Spoon', 'Book', 'Chair', 'Lamp', 'Phone', 'Keys', 'Watch', 'Glasses',
    'Wallet', 'Pen', 'Cup', 'Hat', 'Shoes', 'Bag', 'Mirror', 'Clock'
  ]
};

// Matrix generation functions
function generateForcingMatrix(target: number, objects: string[]): MatrixCell[][] {
  // Generate 8 seed numbers (4 for rows, 4 for columns) that sum to target
  const totalSeeds = 8;
  const baseValue = Math.floor(target / totalSeeds);
  
  // Create balanced seed distribution with organic jitter
  const rowSeeds: number[] = [];
  const colSeeds: number[] = [];
  
  // Generate row seeds with 100% variance
  for (let i = 0; i < 4; i++) {
    const variance = Math.floor(Math.random() * (baseValue * 0.8)) - Math.floor(baseValue * 0.4);
    rowSeeds.push(baseValue + variance);
  }
  
  // Generate column seeds with 100% variance
  for (let i = 0; i < 4; i++) {
    const variance = Math.floor(Math.random() * (baseValue * 0.8)) - Math.floor(baseValue * 0.4);
    colSeeds.push(baseValue + variance);
  }
  
  // Adjust seeds to ensure they sum to target
  const currentSum = rowSeeds.reduce((a, b) => a + b, 0) + colSeeds.reduce((a, b) => a + b, 0);
  const adjustment = target - currentSum;
  
  if (adjustment !== 0) {
    // Distribute adjustment across seeds
    const seedsToAdjust = Math.abs(adjustment);
    const direction = adjustment > 0 ? 1 : -1;
    
    for (let i = 0; i < seedsToAdjust; i++) {
      const seedIndex = i % 8;
      if (seedIndex < 4) {
        rowSeeds[seedIndex] += direction;
      } else {
        colSeeds[seedIndex - 4] += direction;
      }
    }
  }
  
  // Assign objects to cells (row-major order)
  const matrix: MatrixCell[][] = [];
  let objIdx = 0;
  for (let row = 0; row < 4; row++) {
    matrix[row] = [];
    for (let col = 0; col < 4; col++) {
      matrix[row][col] = {
        value: rowSeeds[row] + colSeeds[col],
        row,
        col,
        object: objects[objIdx++]
      };
    }
  }
  
  return matrix;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function App() {
  const [targetNumber, setTargetNumber] = useState<number>(100);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof CATEGORIES>('CITIES');
  const [matrix, setMatrix] = useState<MatrixCell[][]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [modalCell, setModalCell] = useState<{row: number, col: number} | null>(null);

  const handleGenerate = () => {
    setIsLoading(true);
    setError('');
    setModalCell(null);
    try {
      if (targetNumber < 1 || targetNumber > 9999999) {
        throw new Error('Target number must be between 1 and 9,999,999');
      }
      // Shuffle objects and generate matrix
      const objects = shuffleArray(CATEGORIES[selectedCategory]);
      const newMatrix = generateForcingMatrix(targetNumber, objects);
      setMatrix(newMatrix);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMatrix = (matrix: MatrixCell[][], target: number): boolean => {
    for (let row1 = 0; row1 < 4; row1++) {
      for (let row2 = 0; row2 < 4; row2++) {
        for (let row3 = 0; row3 < 4; row3++) {
          for (let row4 = 0; row4 < 4; row4++) {
            const sum = matrix[row1][0].value + matrix[row2][1].value + 
                       matrix[row3][2].value + matrix[row4][3].value;
            if (sum !== target) {
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  // Modal logic
  let modalContent = null;
  if (modalCell && matrix.length > 0) {
    const { row, col } = modalCell;
    const cell = matrix[row][col];
    // Get all other numbers/objects in the same row and column (excluding self)
    const rowCells = matrix[row].filter((_, i) => i !== col);
    const colCells = matrix.map((r, i) => i !== row ? r[col] : null).filter(Boolean) as MatrixCell[];
    const otherNumbers = [...rowCells, ...colCells].map(c => c.value);
    const otherObjects = [...rowCells, ...colCells].map(c => c.object);
    modalContent = (
      <div className="modal-backdrop" onClick={() => setModalCell(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-title">
            <span className="modal-number">{cell.value}</span>
            <span className="modal-object">{cell.object}</span>
          </div>
          <div className="modal-section">
            <div className="modal-numbers">{otherNumbers.join(', ')}</div>
          </div>
          <div className="modal-section">
            <div className="modal-objects">{otherObjects.join(', ')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Elimination Game</h1>
      </div>

      <div className="input-section">
        <div className="input-group">
          <label htmlFor="target">Target Number:</label>
          <input
            id="target"
            type="number"
            min="1"
            max="9999999"
            value={targetNumber}
            onChange={(e) => setTargetNumber(Number(e.target.value))}
            placeholder="Enter target number (1-9999999)"
          />
        </div>

        <div className="input-group category-group">
          <label>Category:</label>
          <div className="category-buttons">
            <button
              className={`category-btn ${selectedCategory === 'CITIES' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('CITIES')}
            >
              CITIES
            </button>
            <button
              className={`category-btn ${selectedCategory === 'TRANSPORT' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('TRANSPORT')}
            >
              TRANSPORT
            </button>
            <button
              className={`category-btn ${selectedCategory === 'OBJECTS' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('OBJECTS')}
            >
              OBJECTS
            </button>
          </div>
        </div>

        <button 
          className="generate-btn" 
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'GENERATE'}
        </button>

        {error && <div className="error">{error}</div>}
      </div>

      {matrix.length > 0 && (
        <div className="matrix-section">
          <div className="matrix-grid">
            {matrix.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="matrix-card matrix-card-modal"
                  onClick={() => setModalCell({ row: rowIndex, col: colIndex })}
                  tabIndex={0}
                  role="button"
                  aria-pressed={modalCell?.row === rowIndex && modalCell?.col === colIndex}
                >
                  <div className="matrix-card-number">{cell.value}</div>
                  <div className="matrix-card-object">{cell.object}</div>
                </div>
              ))
            )}
          </div>
          {verifyMatrix(matrix, targetNumber) && (
            <p style={{ textAlign: 'center', marginTop: '15px', color: '#28a745', fontWeight: '600' }}>
              ✓ Matrix verified: All combinations sum to {targetNumber}
            </p>
          )}
        </div>
      )}

      {modalContent}

      {isLoading && (
        <div className="loading">
          Generating your forcing matrix...
        </div>
      )}
    </div>
  );
}

export default App; 