
import { useState, useEffect, useCallback } from 'react';
import { Question, questions } from '../data/questions';
import { GameState, QuestionResult } from '../types/game';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    timeRemaining: 0,
    totalTime: 0,
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
    setGameState(prev => ({
      ...prev,
      timeRemaining: 30 * 60, // 30 minutes
      totalTime: 30 * 60
    }));
    setQuestionStartTime(Date.now());
  }, []);

  // Timer
  useEffect(() => {
    if (gameState.timeRemaining > 0 && !gameState.isComplete) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeRemaining === 0) {
      setGameState(prev => ({ ...prev, isComplete: true }));
    }
  }, [gameState.timeRemaining, gameState.isComplete]);

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
          isCorrect = JSON.stringify(userMatches) === JSON.stringify(correctMatches);
        } catch {
          isCorrect = false;
        }
        break;
    }

    // Calculate points
    let points = 0;
    if (isCorrect) {
      points = Math.max(100 - (gameState.hintIndex * 20) - (timeSpent * 2), 10);
    }

    // Update game state
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      mistakes: isCorrect ? prev.mistakes : prev.mistakes + 1,
      showHints: false,
      hintIndex: 0,
      userAnswers: prev.userAnswers.map((ans, idx) => 
        idx === prev.currentQuestionIndex ? answer : ans
      )
    }));

    // Record result
    setQuestionResults(prev => [...prev, {
      questionId: currentQuestion.id,
      correct: isCorrect,
      timeSpent,
      hintsUsed: gameState.hintIndex
    }]);

    return isCorrect;
  }, [gameState.currentQuestionIndex, gameState.hintIndex, questionStartTime, shuffledQuestions]);

  const nextQuestion = useCallback(() => {
    if (gameState.currentQuestionIndex < shuffledQuestions.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showHints: false,
        hintIndex: 0
      }));
      setQuestionStartTime(Date.now());
    } else {
      setGameState(prev => ({ ...prev, isComplete: true }));
    }
  }, [gameState.currentQuestionIndex, shuffledQuestions.length]);

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
      timeRemaining: 30 * 60,
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
    showHint,
    resetGame
  };
};
