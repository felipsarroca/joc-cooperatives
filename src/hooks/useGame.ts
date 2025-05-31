import { useState, useEffect, useCallback } from 'react';
import { Question, questions } from '../data/questions';
import { GameState, QuestionResult } from '../types/game';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    timeElapsed: 0,
    totalTime: 30 * 60, // 30 minutes
    mistakes: 0,
    isComplete: false,
    showHints: false,
    hintIndex: 0,
    userAnswers: new Array(questions.length).fill(null)
  });

  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Shuffle questions on game start
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    // Also shuffle options for each question
    const shuffledWithOptions = shuffled.map(question => {
      if (question.options && question.type !== 'order') {
        return {
          ...question,
          options: [...question.options].sort(() => Math.random() - 0.5)
        };
      }
      return question;
    });
    setShuffledQuestions(shuffledWithOptions);
    setQuestionStartTime(Date.now());
  }, []);

  // Timer - now counting upwards
  useEffect(() => {
    if (gameState.timeElapsed < gameState.totalTime && !gameState.isComplete) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeElapsed >= gameState.totalTime) {
      setGameState(prev => ({ ...prev, isComplete: true }));
    }
  }, [gameState.timeElapsed, gameState.isComplete, gameState.totalTime]);

  const getCurrentQuestion = () => shuffledQuestions[gameState.currentQuestionIndex];

  const submitAnswer = useCallback((answer: string) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return false;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    let isCorrect = false;

    // Check if answer is correct based on question type
    switch (currentQuestion.type) {
      case 'multiple':
      case 'trueFalse':
      case 'fillBlank':
        isCorrect = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toString().toLowerCase().trim();
        break;
      case 'order':
        // For ordering questions, check if the submitted order matches
        const correctOrder = currentQuestion.correctAnswer as string[];
        const userOrder = answer.split(',');
        isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
        break;
      case 'match':
        // For matching questions, the answer should be a JSON string of the matches
        try {
          const userMatches = JSON.parse(answer);
          const correctMatches = currentQuestion.correctAnswer;
          
          // Log for debugging
          console.log('User matches:', userMatches);
          console.log('Correct matches:', correctMatches);
          
          // Check if all keys and values match exactly
          const userKeys = Object.keys(userMatches).sort();
          const correctKeys = Object.keys(correctMatches).sort();
          
          if (userKeys.length !== correctKeys.length) {
            isCorrect = false;
            break;
          }
          
          // Check each key-value pair
          isCorrect = userKeys.every(key => {
            const userValue = userMatches[key];
            const correctValue = correctMatches[key];
            return userValue === correctValue;
          });
          
          console.log('Match validation result:', isCorrect);
        } catch (error) {
          console.error('Error parsing user matches:', error);
          isCorrect = false;
        }
        break;
    }

    // Calculate points with increased penalty for errors
    let points = 0;
    if (isCorrect) {
      // Base points reduced by hints used and time spent
      points = Math.max(100 - (gameState.hintIndex * 25) - (timeSpent * 2), 10);
    } else {
      // Penalty for wrong answers: -50 points
      points = -50;
    }

    // Update game state
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      mistakes: isCorrect ? prev.mistakes : prev.mistakes + 1,
      userAnswers: prev.userAnswers.map((ans, idx) => 
        idx === prev.currentQuestionIndex ? answer : ans
      )
    }));

    // Record result only if correct (for tracking purposes)
    if (isCorrect) {
      setQuestionResults(prev => [...prev, {
        questionId: currentQuestion.id,
        correct: isCorrect,
        timeSpent,
        hintsUsed: gameState.hintIndex
      }]);
    }

    return isCorrect;
  }, [gameState.currentQuestionIndex, gameState.hintIndex, questionStartTime, shuffledQuestions]);

  const nextQuestion = useCallback(() => {
    const isLastQuestion = gameState.currentQuestionIndex >= shuffledQuestions.length - 1;
    
    if (isLastQuestion) {
      // Mark game as complete when finishing the last question
      setGameState(prev => ({ ...prev, isComplete: true }));
    } else {
      // Move to next question
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showHints: false,
        hintIndex: 0
      }));
      setQuestionStartTime(Date.now());
    }
  }, [gameState.currentQuestionIndex, shuffledQuestions.length]);

  const completeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isComplete: true }));
  }, []);

  const resetQuestion = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showHints: false,
      hintIndex: 0
    }));
    setQuestionStartTime(Date.now());
  }, []);

  const showHint = useCallback(() => {
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion && gameState.hintIndex < currentQuestion.hints.length) {
      setGameState(prev => ({
        ...prev,
        showHints: true,
        hintIndex: prev.hintIndex + 1
      }));
    }
  }, [gameState.hintIndex, shuffledQuestions, gameState.currentQuestionIndex]);

  const resetGame = useCallback(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    const shuffledWithOptions = shuffled.map(question => {
      if (question.options && question.type !== 'order') {
        return {
          ...question,
          options: [...question.options].sort(() => Math.random() - 0.5)
        };
      }
      return question;
    });
    setShuffledQuestions(shuffledWithOptions);
    setGameState({
      currentQuestionIndex: 0,
      score: 0,
      timeElapsed: 0,
      totalTime: 30 * 60,
      mistakes: 0,
      isComplete: false,
      showHints: false,
      hintIndex: 0,
      userAnswers: new Array(questions.length).fill(null)
    });
    setQuestionResults([]);
    setQuestionStartTime(Date.now());
  }, []);

  return {
    gameState,
    shuffledQuestions,
    questionResults,
    getCurrentQuestion,
    submitAnswer,
    nextQuestion,
    resetQuestion,
    showHint,
    resetGame,
    completeGame
  };
};
