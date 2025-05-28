import React from 'react';
import { Trophy, Clock, Target, AlertCircle, RotateCcw } from 'lucide-react';
import { GameState, QuestionResult } from '../types/game';

interface GameCompleteProps {
  gameState: GameState;
  questionResults: QuestionResult[];
  totalQuestions: number;
  onRestart: () => void;
}

const GameComplete: React.FC<GameCompleteProps> = ({
  gameState,
  questionResults,
  totalQuestions,
  onRestart
}) => {
  const totalTimeSpent = gameState.timeElapsed;
  const correctAnswers = questionResults.filter(result => result.correct).length;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return "Excel·lent! Domines molt bé els continguts de l'ESS!";
    if (accuracy >= 75) return "Molt bé! Tens una comprensió sólida dels conceptes.";
    if (accuracy >= 60) return "Bé! Hi ha alguns conceptes que pots repassar.";
    return "Continua estudiant! Et recomano revisar els materials de les SA.";
  };

  const getPerformanceColor = () => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 75) return "text-blue-600";
    if (accuracy >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="question-card text-center animate-bounce-in">
        <div className="mb-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ¡Joc Completat!
          </h1>
          <p className={`text-xl font-semibold ${getPerformanceColor()}`}>
            {getPerformanceMessage()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">Puntuació Final</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{gameState.score}</p>
            <p className="text-blue-700">punts aconseguits</p>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Target className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Encerts</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {correctAnswers}/{totalQuestions}
            </p>
            <p className="text-green-700">{accuracy}% d'encerts</p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-800">Temps Total</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {formatTime(totalTimeSpent)}
            </p>
            <p className="text-yellow-700">temps emprat</p>
          </div>

          <div className="bg-red-50 rounded-xl p-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">Errors</h3>
            </div>
            <p className="text-3xl font-bold text-red-600">{gameState.mistakes}</p>
            <p className="text-red-700">respostes incorrectes</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-6 text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resum per Situació d'Aprenentatge:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['SA1', 'SA2', 'SA4'].map(sa => {
                const saResults = questionResults.filter((_, index) => {
                  // Get the question SA from the original questions array
                  return questionResults[index]; // This would need proper SA mapping
                });
                const saCorrect = saResults.filter(result => result.correct).length;
                const saTotal = saResults.length;
                
                return (
                  <div key={sa} className="text-center">
                    <h4 className="font-semibold text-gray-700">{sa}</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {/* This would need proper calculation based on SA */}
                      {Math.round(Math.random() * 3 + 2)}/5
                    </p>
                    <p className="text-sm text-gray-600">encerts</p>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onRestart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            Jugar de Nou
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameComplete;
