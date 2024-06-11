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
        // Select a random word from the list
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


  const handleChange = (row, col, value) => {
    const newGrid = [...grid];
    newGrid[row][col] = value.toUpperCase();
    setGrid(newGrid);
    if (value && col < 4) {
      inputRefs.current[row][col + 1].focus();
    }
  };

  const handleKeyDown = (row, col, e) => {
    if (e.key === 'Backspace' && !grid[row][col] && col > 0) {
      const newGrid = [...grid];
      newGrid[row][col - 1] = '';
      setGrid(newGrid);
      inputRefs.current[row][col - 1].focus();
    }
  };
  

  const handleSubmit = (e) => {
    //let flag=false;
    e.preventDefault();
    const input = grid[currentRow].join('');
    if (input === word) {
        const newColors = [...colors];
        newColors[currentRow] = newColors[currentRow].map(() => 'green');
        setColors(newColors);
        setMessage('You won');
        return;
    }
    const newColors = [...colors];
    for (let i = 0; i < 5; i++) {
      if (word.includes(grid[currentRow][i])) {
        if (word[i] === grid[currentRow][i]) {
          newColors[currentRow][i] = 'green';
        } else {
          newColors[currentRow][i] = 'yellow';
        }
      } else {
        newColors[currentRow][i] = 'darkgrey';
      }
    }
    setColors(newColors);
    const newAttempts = attempts - 1;
    setAttempts(newAttempts);
    if (newAttempts === 0) {
        setMessage(`You lost! The word was ${word}`);
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
        <p>{word}</p>
      <h1>Wordle</h1>
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
      <div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Wordle;
