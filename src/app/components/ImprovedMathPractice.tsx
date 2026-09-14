import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trophy, ArrowLeft, Sparkles, Coins, X } from 'lucide-react';
import dragonCharacter from "../../assets/draco.png";
import { useUser } from '../utils/userContext';

interface MathProblem {
  question: string;
  correctAnswer: number;
  options: number[];
  explanation: string;
}

interface AttemptRecord {
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

interface ImprovedMathPracticeProps {
  category: string;
  lessonId: number;
  lessonLevel: number;
  onBack: () => void;
}

export function ImprovedMathPractice({ category, lessonId, lessonLevel, onBack }: ImprovedMathPracticeProps) {
  const { user, updateMetaPoints, updateHearts, updateProgress } = useUser();
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [metaPoints, setMetaPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [errors, setErrors] = useState(0);
  const [hearts, setHearts] = useState(user?.hearts || 5);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dragonMessage, setDragonMessage] = useState('¡Vamos! ¡Tú puedes!');
  const [attemptHistory, setAttemptHistory] = useState<AttemptRecord[]>([]);
  const [showResults, setShowResults] = useState(false);

  const MAX_QUESTIONS = 10;
  const MAX_ERRORS = 5;

  const getDifficultyMultiplier = (level: number): number => {
    return 1 + (level - 1) * 0.5;
  };

  const generateProblem = (): MathProblem => {
    let num1: number, num2: number, correctAnswer: number, question: string, explanation: string;
    const difficultyMultiplier = getDifficultyMultiplier(lessonLevel);
    
    switch (category) {
      case 'suma':
        num1 = Math.floor(Math.random() * (50 * difficultyMultiplier)) + 1;
        num2 = Math.floor(Math.random() * (50 * difficultyMultiplier)) + 1;
        correctAnswer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        explanation = `Para sumar ${num1} + ${num2}, puedes contar hacia adelante ${num2} veces desde ${num1}, lo que da ${correctAnswer}.`;
        break;
      case 'resta':
        num1 = Math.floor(Math.random() * (50 * difficultyMultiplier)) + 20;
        num2 = Math.floor(Math.random() * (20 * difficultyMultiplier)) + 1;
        if (num2 > num1) [num1, num2] = [num2, num1];
        correctAnswer = num1 - num2;
        question = `${num1} - ${num2} = ?`;
        explanation = `Para restar ${num1} - ${num2}, quitas ${num2} de ${num1}, quedando ${correctAnswer}.`;
        break;
      case 'multiplicacion':
        num1 = Math.floor(Math.random() * (10 * Math.min(difficultyMultiplier, 2))) + 1;
        num2 = Math.floor(Math.random() * (10 * Math.min(difficultyMultiplier, 2))) + 1;
        correctAnswer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        explanation = `${num1} × ${num2} significa sumar ${num1} veces ${num2}: ${Array(num1).fill(num2).join(' + ')} = ${correctAnswer}.`;
        break;
      case 'division':
        num2 = Math.floor(Math.random() * (10 * Math.min(difficultyMultiplier, 2))) + 1;
        correctAnswer = Math.floor(Math.random() * (10 * Math.min(difficultyMultiplier, 2))) + 1;
        num1 = num2 * correctAnswer;
        question = `${num1} ÷ ${num2} = ?`;
        explanation = `${num1} ÷ ${num2} = ${correctAnswer} porque ${num2} × ${correctAnswer} = ${num1}.`;
        break;
      case 'potencias':
        num1 = Math.floor(Math.random() * (3 + lessonLevel)) + 2;
        num2 = Math.floor(Math.random() * (2 + Math.floor(lessonLevel / 2))) + 2;
        correctAnswer = Math.pow(num1, num2);
        question = `${num1}^${num2} = ?`;
        explanation = `${num1}^${num2} significa multiplicar ${num1} por sí mismo ${num2} veces: ${Array(num2).fill(num1).join(' × ')} = ${correctAnswer}.`;
        break;
      case 'radicacion':
        correctAnswer = Math.floor(Math.random() * (8 + lessonLevel)) + 2;
        num1 = correctAnswer * correctAnswer;
        question = `√${num1} = ?`;
        explanation = `√${num1} = ${correctAnswer} porque ${correctAnswer} × ${correctAnswer} = ${num1}.`;
        break;
      case 'polinomios':
        num1 = Math.floor(Math.random() * (5 * difficultyMultiplier)) + 1;
        num2 = Math.floor(Math.random() * (10 * difficultyMultiplier)) + 1;
        const coef = 2 + Math.floor(lessonLevel / 2);
        correctAnswer = coef * num1 + num2;
        question = `${coef}(${num1}) + ${num2} = ?`;
        explanation = `Primero multiplicamos: ${coef} × ${num1} = ${coef * num1}. Luego sumamos: ${coef * num1} + ${num2} = ${correctAnswer}.`;
        break;
      default:
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        correctAnswer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        explanation = `${num1} + ${num2} = ${correctAnswer}`;
    }

    const options = [correctAnswer];
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * (20 * difficultyMultiplier)) - 10 * difficultyMultiplier;
      const option = Math.max(0, Math.round(correctAnswer + offset));
      if (!options.includes(option)) {
        options.push(option);
      }
    }
    
    options.sort(() => Math.random() - 0.5);

    return { question, correctAnswer, options, explanation };
  };

  useEffect(() => {
    setCurrentProblem(generateProblem());
  }, [category, lessonLevel]);

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null || !currentProblem) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentProblem.correctAnswer;
    setIsCorrect(correct);

    const attempt: AttemptRecord = {
      question: currentProblem.question,
      userAnswer: answer,
      correctAnswer: currentProblem.correctAnswer,
      isCorrect: correct,
      explanation: currentProblem.explanation,
    };

    setAttemptHistory([...attemptHistory, attempt]);

    if (correct) {
      const earnedPoints = 10 + streak * 2;

      // Monedas de esta partida
      setMetaPoints((prev) => prev + earnedPoints);

     // Monedas permanentes del estudiante (Dashboard)
      updateMetaPoints(earnedPoints);

      setStreak((prev) => prev + 1);
      setShowConfetti(true);
      
      const messages = [
        '¡Excelente! ',
        '¡Perfecto! ',
        '¡Increíble! ',
        '¡Genial! ',
        '¡Fantástico! '
      ];
      setDragonMessage(messages[Math.floor(Math.random() * messages.length)]);
    } else {
      setStreak(0);
      setErrors(errors + 1);
      setHearts(hearts - 1);
      setDragonMessage('¡Intenta de nuevo! ');
    }

    setQuestionsAnswered(questionsAnswered + 1);

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowConfetti(false);

      if (questionsAnswered + 1 >= MAX_QUESTIONS || errors + (!correct ? 1 : 0) >= MAX_ERRORS || hearts - (!correct ? 1 : 0) <= 0) {
        finishPractice();
      } else {
        setCurrentProblem(generateProblem());
        setDragonMessage('¡Vamos! ¡Tú puedes!');
      }
    }, 2000);
  };

  const finishPractice = () => {
    const correctAnswers = attemptHistory.filter(a => a.isCorrect).length + (isCorrect ? 1 : 0);
    const totalQuestions = questionsAnswered + 1;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    
    let stars = 0;
    if (accuracy >= 90) stars = 3;
    else if (accuracy >= 70) stars = 2;
    else if (accuracy >= 50) stars = 1;

    // Las monedas ya fueron guardadas en cada respuesta correcta.
    updateHearts(hearts);

    updateProgress(
      category,
      lessonId,
      stars,
      errors + (isCorrect === false ? 1 : 0)
    );
    
    setShowResults(true);
  };

  if (!currentProblem || !user) return null;

  if (showResults) {
    const correctAnswers = attemptHistory.filter(a => a.isCorrect).length;
    const incorrectAttempts = attemptHistory.filter(a => !a.isCorrect);
    const accuracy = (correctAnswers / attemptHistory.length) * 100;
    
    let stars = 0;
    if (accuracy >= 90) stars = 3;
    else if (accuracy >= 70) stars = 2;
    else if (accuracy >= 50) stars = 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.img
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                src={dragonCharacter}
                alt="Draco"
                className="w-32 h-32 mx-auto mb-4"
              />
              <h1 className="text-4xl font-black text-gray-800 mb-2">
                ¡Práctica Completada!
              </h1>
              <div className="flex items-center justify-center gap-2 mb-4">
                {[...Array(3)].map((_, i) => (
                  <Trophy
                    key={i}
                    className={`w-12 h-12 ${
                      i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {correctAnswers} de {attemptHistory.length} correctas ({Math.round(accuracy)}%)
              </p>
            </div>

            {/* MetaPoints Earned */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl mb-6 text-center border-2 border-yellow-400">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Coins className="w-8 h-8 text-yellow-600" />
                <span className="text-4xl font-black text-yellow-700">+{metaPoints}</span>
              </div>
              <p className="text-lg font-bold text-gray-700">MetaPoints Ganados</p>
            </div>

            {/* Incorrect Answers Review */}
            {incorrectAttempts.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
                   Retroalimentación - Repasemos tus errores
                </h2>
                <div className="space-y-4">
                  {incorrectAttempts.map((attempt, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-red-50 border-2 border-red-300 rounded-2xl p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-black flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-xl font-bold text-gray-800 mb-2">
                            {attempt.question}
                          </p>
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="bg-white p-3 rounded-xl">
                              <p className="text-sm font-semibold text-gray-600">Tu respuesta:</p>
                              <p className="text-2xl font-black text-red-600">{attempt.userAnswer}</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl">
                              <p className="text-sm font-semibold text-gray-600">Respuesta correcta:</p>
                              <p className="text-2xl font-black text-green-600">{attempt.correctAnswer}</p>
                            </div>
                          </div>
                          <div className="bg-green-100 p-3 rounded-xl border-2 border-green-300">
                            <p className="text-sm font-bold text-green-800">💡 Explicación:</p>
                            <p className="text-sm text-gray-700 font-semibold mt-1">{attempt.explanation}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Message */}
            {incorrectAttempts.length === 0 && (
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-2xl mb-6 text-center border-2 border-green-400">
                <p className="text-2xl font-black text-green-700">
                   ¡Perfecto! ¡No tuviste ningún error!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black text-lg"
              >
                Volver al Mapa
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: -20,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{ 
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 360,
                  opacity: 0
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2,
                  ease: 'linear'
                }}
                className="absolute"
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: ['#FF6B9D', '#FFC700', '#4CAF50', '#2196F3', '#9C27B0'][i % 5]
                  }}
                />
              </motion.div>
            ))}</div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Volver</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-xl">
              <Coins className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-700">{metaPoints}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-orange-700">{streak} racha</span>
            </div>

            <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-xl">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span className="font-bold text-red-700">{hearts}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(questionsAnswered / MAX_QUESTIONS) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Pregunta {questionsAnswered + 1} de {MAX_QUESTIONS}</span>
            <span className="text-red-600 font-bold">Errores: {errors}/{MAX_ERRORS}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Dragon Section */}
          <div className="text-center">
            <motion.div
              animate={{ 
                y: isCorrect === true ? [-10, 0, -10] : isCorrect === false ? [0, 5, 0] : [0, -10, 0],
                rotate: isCorrect === true ? [0, -5, 5, 0] : 0
              }}
              transition={{ 
                duration: isCorrect !== null ? 0.5 : 2,
                repeat: isCorrect !== null ? 0 : Infinity,
                ease: 'easeInOut'
              }}
              className="mb-6"
            >
              <img 
                src={dragonCharacter} 
                alt="Draco" 
                className="w-64 h-64 mx-auto"
              />
            </motion.div>

            <motion.div
              key={dragonMessage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl px-6 py-4 shadow-lg inline-block"
            >
              <p className="text-2xl font-bold text-gray-800">{dragonMessage}</p>
            </motion.div>
          </div>

          {/* Problem Section */}
          <div>
            <motion.div
              key={currentProblem.question}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl shadow-2xl p-8 mb-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-5xl font-bold text-gray-800 mb-2">
                  {currentProblem.question}
                </h2>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentProblem.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
                    whileTap={{ scale: selectedAnswer === null ? 0.95 : 1 }}
                    className={`
                      py-6 px-8 rounded-2xl text-3xl font-bold transition-all
                      ${selectedAnswer === null
                        ? 'bg-gradient-to-br from-purple-400 to-pink-500 text-white hover:shadow-xl'
                        : selectedAnswer === option
                          ? isCorrect
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white scale-105 shadow-xl'
                            : 'bg-gradient-to-br from-red-400 to-red-500 text-white'
                          : option === currentProblem.correctAnswer
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                      }
                    `}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Feedback */}
            <AnimatePresence>
              {selectedAnswer !== null && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className={`text-center p-4 rounded-2xl ${
                    isCorrect 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  <p className="text-xl font-bold">
                    {isCorrect 
                      ? `¡Correcto! +${10 + (streak - 1) * 2} MetaPoints` 
                      : `Incorrecto. La respuesta correcta es ${currentProblem.correctAnswer}`
                    }
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
