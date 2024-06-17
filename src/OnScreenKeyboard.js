import React from 'react';
import './OnScreenKeyboard.css';
import { FaBackspace } from 'react-icons/fa';

const OnScreenKeyboard = ({ onKeyClick, keyColors }) => {
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={`keyboard-key ${keyColors[key]}`}
              onClick={() => onKeyClick(key)}
            >
              {key}
            </button>
          ))}
          {rowIndex === 2 && (
            <>
              <button className="keyboard-key special-key" onClick={() => onKeyClick('Backspace')}><FaBackspace /></button>
              <button className="keyboard-key special-key" onClick={() => onKeyClick('Enter')}>ENTER</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default OnScreenKeyboard;
