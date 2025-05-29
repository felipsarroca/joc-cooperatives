
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
  // Split the question text at the blank placeholder
  const parts = question.question.split('_________');

  return (
    <div className="space-y-6" onKeyDown={onKeyPress}>
      <div className="text-lg leading-relaxed bg-blue-50 p-6 rounded-lg border border-blue-200">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="inline-block mx-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => !isAnswered && setUserAnswer(e.target.value)}
                  disabled={isAnswered}
                  className={`inline-block px-4 py-2 border-2 rounded-lg min-w-40 text-center font-semibold text-lg ${
                    isAnswered
                      ? userAnswer.toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim()
                        ? 'border-green-500 bg-green-100 text-green-800'
                        : 'border-red-500 bg-red-100 text-red-800'
                      : 'border-blue-500 bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300'
                  }`}
                  placeholder="Escriu aquí..."
                  autoFocus
                />
              </span>
            )}
          </span>
        ))}
      </div>
      
      <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
        <p>💡 Consell: Escriu la paraula que millor completi la frase.</p>
      </div>
    </div>
  );
};

export default FillBlankQuestion;
