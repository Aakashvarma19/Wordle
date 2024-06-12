import React, { useState, useEffect, useRef } from 'react';
import './Wordle.css';

const Wordle = () => {
  const [words, setWords] = useState([]);
  const [word, setWord] = useState('');
  const [attempts, setAttempts] = useState(5);
  const [message, setMessage] = useState('');
  const [grid, setGrid] = useState(Array(5).fill('').map(() => Array(5).fill('')));
  const [colors, setColors] = useState(Array(5).fill('').map(() => Array(5).fill('')));
  const inputRefs = useRef(Array.from({ length: 5 }, () => Array(5).fill(null)));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);
  const [gameOver,setgameOver]=useState(false);
  const [lost,setLost]=useState(false);
  const [won,setWon]=useState(false);

  useEffect(() => {
    fetch('/words.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setWords(data);
        const randomWord = data[Math.floor(Math.random() * data.length)];
        setWord(randomWord.toUpperCase());
      })
      .catch(error => {
        console.error('Error fetching words:', error);
        setMessage('Failed to load words. Please try again later.');
      });
  }, []);


  useEffect(() => {
    if (inputRefs.current[0][0]) {
      inputRefs.current[0][0].focus();
    }
  }, []);

  useEffect(() => {
    if (errorMessage || lost || won) {
      const timer = setTimeout(() => {
        setErrorMessage(false);
        setLost(false);
        setWon(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage,lost,won]);


  const handleChange = (row, col, value) => {
    if(gameOver) return;
    const newGrid = [...grid];
    newGrid[row][col] = value.toUpperCase();
    setGrid(newGrid);
    if (value && col < 4) {
      inputRefs.current[row][col + 1].focus();
    }
  };

  const ErrorMessage = () => {
    return (
      <div className="error-message">
        Not enough letters!
      </div>
    );
  };

  const Message = ({msg}) => {
    return(
      <div className="error-message">
        {msg}
      </div>
    );
  };

  const handleKeyDown = (row, col, e) => {
    if(gameOver) return;
    if (e.key === 'Backspace' && !grid[row][col] && col > 0) {
      const newGrid = [...grid];
      newGrid[row][col - 1] = '';
      setGrid(newGrid);
      inputRefs.current[row][col - 1].focus();
  }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = grid[currentRow].join('');
    if(input.length!==5){
      setErrorMessage(true);
      return;
    }
    if (input === word) {
        const newColors = [...colors];
        newColors[currentRow] = newColors[currentRow].map(() => 'green');
        setColors(newColors);
        setMessage('Great!');
        setWon(true);
        setgameOver(true);
        return;
    }
    const letterCount = {};
    const matchedIndices=[];
    for (let letter of word) {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    }
    const newColors = [...colors];
    for (let i = 0; i < 5; i++) {
      if (grid[currentRow][i] === word[i]) {
        newColors[currentRow][i] = 'green';
        matchedIndices.push(i);
        letterCount[grid[currentRow][i]]--;
      }
    }
    
    for (let i = 0; i < 5; i++) {
      if (!matchedIndices.includes(i)) {
        const guessedLetter = grid[currentRow][i];
        if (word.includes(guessedLetter) && letterCount[guessedLetter] > 0) {
          newColors[currentRow][i] = 'yellow';
          letterCount[guessedLetter]--;
        } else {
          newColors[currentRow][i] = 'darkgrey';
        }
      }
    }
    setColors(newColors);
    const newAttempts = attempts - 1;
    setAttempts(newAttempts);
    if (newAttempts === 0) {
        setMessage(`${word}`);
        setLost(true);
        setgameOver(true);
        return;
    } 
      setCurrentRow(currentRow + 1);
      setCurrentCol(0);
      inputRefs.current[currentRow + 1][0].focus();
    
  };


  const handleReset = () => {
    setGrid(Array(5).fill('').map(() => Array(5).fill('')));
    setColors(Array(5).fill('').map(() => Array(5).fill('')));
    setMessage('');
    setgameOver(false);
    setAttempts(5);
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord.toUpperCase());
    if (inputRefs.current[0][0]) {
      inputRefs.current[0][0].focus();
    }
    setCurrentRow(0);
    setCurrentCol(0);
  };


  return (
    
    <div className="wordle">
      <h1>Wordle</h1>
      {(lost || won) && <Message msg={message} />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <form onSubmit={handleSubmit}>
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((cell, colIndex) => (
                <input
                  key={colIndex}
                  type="text"
                  value={cell}
                  maxLength={1}
                  onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(rowIndex, colIndex, e)}
                  className={`grid-cell ${colors[rowIndex][colIndex]}`}
                  ref={(el) => (inputRefs.current[rowIndex][colIndex] = el)}
                  readOnly={gameOver}
                  disabled={gameOver}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="buttons">
          <button type="submit">
            Submit
          </button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default Wordle;
