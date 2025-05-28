
import React from 'react';
import { Question } from '../../data/questions';

interface FillBlankQuestionProps {
  question: Question;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isAnswered: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const FillBlankQuestion: React.FC<FillBlankQuestionProps> = ({
  question,
  userAnswer,
  setUserAnswer,
  isAnswered,
  onKeyPress
}) => {
  const parts = question.question.split('_________');

  return (
    <div className="space-y-6" onKeyDown={onKeyPress}>
      <div className="text-lg leading-relaxed">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => !isAnswered && setUserAnswer(e.target.value)}
                disabled={isAnswered}
                className={`inline-block mx-2 px-3 py-1 border-2 rounded-lg min-w-32 text-center font-semibold ${
                  isAnswered
                    ? userAnswer.toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim()
                      ? 'border-green-500 bg-green-100 text-green-800'
                      : 'border-red-500 bg-red-100 text-red-800'
                    : 'border-blue-400 focus:border-blue-600 focus:outline-none'
                }`}
                placeholder="Escriu aquí..."
                autoFocus
              />
            )}
          </span>
        ))}
      </div>
      
      <div className="text-sm text-gray-600">
        <p>💡 Consell: Escriu la paraula que millor completi la frase.</p>
      </div>
    </div>
  );
};

export default FillBlankQuestion;
