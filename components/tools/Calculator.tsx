
import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';

interface CalculatorProps {
  onClose: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(display === '0' ? num : display + num);
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const fullEq = equation + display;
      // eslint-disable-next-line no-eval
      const result = eval(fullEq.replace('x', '*'));
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const btns = [
    { label: 'C', type: 'fn', action: clear },
    { label: '(', type: 'fn', action: () => handleNumber('(') },
    { label: ')', type: 'fn', action: () => handleNumber(')') },
    { label: '/', type: 'op', action: () => handleOperator('/') },
    { label: '7', type: 'num', action: () => handleNumber('7') },
    { label: '8', type: 'num', action: () => handleNumber('8') },
    { label: '9', type: 'num', action: () => handleNumber('9') },
    { label: 'x', type: 'op', action: () => handleOperator('*') },
    { label: '4', type: 'num', action: () => handleNumber('4') },
    { label: '5', type: 'num', action: () => handleNumber('5') },
    { label: '6', type: 'num', action: () => handleNumber('6') },
    { label: '-', type: 'op', action: () => handleOperator('-') },
    { label: '1', type: 'num', action: () => handleNumber('1') },
    { label: '2', type: 'num', action: () => handleNumber('2') },
    { label: '3', type: 'num', action: () => handleNumber('3') },
    { label: '+', type: 'op', action: () => handleOperator('+') },
    { label: '0', type: 'num', action: () => handleNumber('0'), span: 2 },
    { label: '.', type: 'num', action: () => handleNumber('.') },
    { label: '=', type: 'eq', action: calculate },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center justify-between p-3 bg-slate-800">
          <h3 className="text-white font-medium text-sm">Calculator</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="bg-slate-800 rounded-xl p-4 mb-4 text-right h-20 flex flex-col justify-end">
            <div className="text-slate-400 text-xs h-4">{equation}</div>
            <div className="text-white text-3xl font-light overflow-x-auto scrollbar-hide">{display}</div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {btns.map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                className={`
                  h-12 rounded-lg font-medium transition-all active:scale-95
                  ${btn.span === 2 ? 'col-span-2' : ''}
                  ${btn.type === 'num' ? 'bg-slate-700 text-white hover:bg-slate-600' : ''}
                  ${btn.type === 'op' ? 'bg-primary-600 text-white hover:bg-primary-500' : ''}
                  ${btn.type === 'fn' ? 'bg-slate-600 text-slate-200 hover:bg-slate-500' : ''}
                  ${btn.type === 'eq' ? 'bg-emerald-500 text-white hover:bg-emerald-400' : ''}
                `}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
