
import React from 'react';
import { Question } from '../../data/questions';
import { Check, X } from 'lucide-react';

interface TrueFalseQuestionProps {
  question: Question;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isAnswered: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
  question,
  userAnswer,
  setUserAnswer,
  isAnswered,
  onKeyPress
}) => {
  const options = ['Vertader', 'Fals'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" onKeyDown={onKeyPress}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => !isAnswered && setUserAnswer(option)}
          disabled={isAnswered}
          className={`option-button flex items-center justify-center gap-3 py-6 ${
            userAnswer === option
              ? isAnswered
                ? userAnswer === question.correctAnswer
                  ? 'option-correct'
                  : 'option-incorrect'
                : 'border-blue-500 bg-blue-50'
              : 'option-default'
          } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {option === 'Vertader' ? (
            <Check className="w-6 h-6" />
          ) : (
            <X className="w-6 h-6" />
          )}
          <span className="font-semibold text-lg">{option}</span>
        </button>
      ))}
    </div>
  );
};

export default TrueFalseQuestion;
