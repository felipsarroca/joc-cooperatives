import React from 'react';
import { useGame } from '../hooks/useGame';
import GameHeader from '../components/GameHeader';
import QuestionCard from '../components/QuestionCard';
import GameComplete from '../components/GameComplete';
import { Play, BookOpen, Users, Target } from 'lucide-react';

const Index = () => {
  const {
    gameState,
    shuffledQuestions,
    questionResults,
    getCurrentQuestion,
    submitAnswer,
    nextQuestion,
    resetQuestion,
    showHint,
    resetGame
  } = useGame();

  const [gameStarted, setGameStarted] = React.useState(false);

  const startGame = () => {
    setGameStarted(true);
    resetGame();
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="question-card text-center animate-bounce-in">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                ESCA - Avaluació Gamificada
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Avalua els teus coneixements sobre Economia Social i Solidària
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-blue-800 mb-2">SA1: Economia Social</h3>
                <p className="text-sm text-blue-700">
                  Valors, principis i diferències amb empreses capitalistes
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-2">SA2: Cooperatives</h3>
                <p className="text-sm text-green-700">
                  Creació, estructura i funcionament de cooperatives escolars
                </p>
              </div>
              
              <div className="bg-yellow-50 rounded-xl p-6">
                <Target className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <h3 className="font-semibold text-yellow-800 mb-2">SA4: Gestió d'Equips</h3>
                <p className="text-sm text-yellow-700">
                  Lideratge, cohesió i cura dels equips de treball
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-800 mb-4">Característiques del joc:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 25 preguntes de diferents tipus (test, vertader/fals, relacionar, completar, ordenar)</li>
                <li>• 30 minuts de temps límit</li>
                <li>• Sistema de pistes si necessites ajuda</li>
                <li>• Puntuació basada en encerts i velocitat</li>
                <li>• Feedback immediat amb explicacions</li>
                <li>• No pots avançar fins encertar cada pregunta</li>
              </ul>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              Començar el Joc
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="container mx-auto py-8">
          <GameComplete
            gameState={gameState}
            questionResults={questionResults}
            totalQuestions={shuffledQuestions.length}
            onRestart={() => {
              resetGame();
              setGameStarted(true);
            }}
          />
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Carregant preguntes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <GameHeader
          gameState={gameState}
          totalQuestions={shuffledQuestions.length}
        />
        
        <QuestionCard
          question={currentQuestion}
          onSubmitAnswer={submitAnswer}
          onNextQuestion={nextQuestion}
          onResetQuestion={resetQuestion}
          onShowHint={showHint}
          showHints={gameState.showHints}
          hintIndex={gameState.hintIndex}
          canProceed={gameState.currentQuestionIndex < shuffledQuestions.length - 1}
        />
      </div>
    </div>
  );
};

export default Index;
