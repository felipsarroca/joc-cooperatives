
import React, { useState } from 'react';
import { Question } from '../../data/questions';
import { ArrowRight } from 'lucide-react';

interface MatchingQuestionProps {
  question: Question;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isAnswered: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  question,
  userAnswer,
  setUserAnswer,
  isAnswered,
  onKeyPress
}) => {
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string>('');

  const correctMatches = question.correctAnswer as { [key: string]: string };
  const leftOptions = question.options || [];
  const rightOptions = Object.values(correctMatches);

  const handleLeftClick = (option: string) => {
    if (isAnswered) return;
    setSelectedLeft(option);
  };

  const handleRightClick = (option: string) => {
    if (isAnswered || !selectedLeft) return;
    
    const newMatches = { ...matches, [selectedLeft]: option };
    setMatches(newMatches);
    setUserAnswer(JSON.stringify(newMatches));
    setSelectedLeft('');
  };

  const getMatchStatus = (leftOption: string, rightOption: string) => {
    if (!isAnswered) return '';
    
    const userMatches = matches;
    const isUserMatch = userMatches[leftOption] === rightOption;
    const isCorrectMatch = correctMatches[leftOption] === rightOption;
    
    if (isUserMatch && isCorrectMatch) return 'correct';
    if (isUserMatch && !isCorrectMatch) return 'incorrect';
    return '';
  };

  return (
    <div className="space-y-4" onKeyDown={onKeyPress}>
      <p className="text-gray-600 mb-4">
        Clica primer a un concepte de l'esquerra, després a la seva definició de la dreta.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Left column - Concepts */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 mb-3">Conceptes:</h4>
          {leftOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleLeftClick(option)}
              disabled={isAnswered}
              className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                selectedLeft === option
                  ? 'border-blue-500 bg-blue-50'
                  : matches[option]
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
              } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Arrow column */}
        <div className="hidden md:flex justify-center items-center">
          <ArrowRight className="w-8 h-8 text-gray-400" />
        </div>

        {/* Right column - Definitions */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700 mb-3">Definicions:</h4>
          {rightOptions.map((option, index) => {
            const matchedWith = Object.keys(matches).find(key => matches[key] === option);
            const status = matchedWith ? getMatchStatus(matchedWith, option) : '';
            
            return (
              <button
                key={index}
                onClick={() => handleRightClick(option)}
                disabled={isAnswered || !selectedLeft}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  status === 'correct'
                    ? 'border-green-500 bg-green-100'
                    : status === 'incorrect'
                      ? 'border-red-500 bg-red-100'
                      : matchedWith
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                } ${isAnswered || !selectedLeft ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {Object.keys(matches).length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-semibold mb-2">Les teves connexions:</h5>
          <div className="space-y-1">
            {Object.entries(matches).map(([concept, definition]) => (
              <div key={concept} className="flex items-center gap-2 text-sm">
                <span className="font-medium">{concept}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span>{definition}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingQuestion;
