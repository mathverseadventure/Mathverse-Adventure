import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Trophy,
  ArrowLeft,
  Sparkles,
  Coins,
  Lightbulb,
  Pencil,
  RotateCcw,
  PartyPopper,
  CheckCircle2,
  XCircle,
  Timer,
  FastForward,
} from 'lucide-react';
import dragonCharacter from "@/assets/images/draco.png";
import { useUser } from '../utils/userContext';
import { DrawingBoard } from './DrawingBoard';
import { PASSING_THRESHOLD, calculateStars } from '../utils/progressionService';
import { DracoAvatar } from './DracoAvatar';

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
  const { user, updateHearts, updateProgress, updateMetaPoints } = useUser();
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [metaPoints, setMetaPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [errors, setErrors] = useState(0);
  const [hearts, setHearts] = useState(user?.hearts ?? 20);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dragonMessage, setDragonMessage] = useState('¡Vamos! ¡Tú puedes!');
  const [attemptHistory, setAttemptHistory] = useState<AttemptRecord[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showTiredDraco, setShowTiredDraco] = useState(false);
  const [showDrawingBoard, setShowDrawingBoard] = useState(false);
  const [feedbackSecondsLeft, setFeedbackSecondsLeft] = useState<number>(5);

  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingAdvanceSnapshotRef = useRef<{ history: AttemptRecord[]; wasCorrect: boolean } | null>(null);

  const MAX_QUESTIONS = 10;
  const MAX_ERRORS = 5;

  const clearFeedbackTimers = () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearFeedbackTimers();
    };
  }, []);

  const getDifficultyMultiplier = (level: number): number => {
    return 1 + (level - 1) * 0.5;
  };

  const generateProblem = (): MathProblem => {
    let num1: number, num2: number, correctAnswer: number, question: string, explanation: string;
    const level = Math.max(1, lessonLevel);
    const difficultyMultiplier = getDifficultyMultiplier(level);

    switch (category) {
      case 'suma': {
        // Hundreds/thousands scaled by level (three-digit+)
        const minBase = 100 * level;
        const maxBase = 999 * level;
        num1 = Math.floor(Math.random() * (maxBase - minBase + 1)) + minBase;
        num2 = Math.floor(Math.random() * (maxBase - minBase + 1)) + minBase;
        correctAnswer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        explanation = `Para sumar ${num1} + ${num2}, suma por columnas (unidades, decenas, centenas...). El resultado es ${correctAnswer}.`;
        break;
      }
      case 'resta': {
        // Large numbers with borrowing
        const minBase = 200 * level;
        const maxBase = 999 * level;
        num1 = Math.floor(Math.random() * (maxBase - minBase + 1)) + minBase;
        // Prefer subtrahend that forces borrowing in at least one place
        num2 = Math.floor(Math.random() * (num1 - 50)) + 50;
        const ones1 = num1 % 10;
        const ones2 = num2 % 10;
        if (ones2 <= ones1 && ones1 < 9) {
          num2 = num2 - ones2 + ((ones1 + 1 + Math.floor(Math.random() * (9 - ones1))) % 10);
          if (num2 >= num1) num2 = Math.max(10, num1 - 17);
        }
        if (num2 > num1) [num1, num2] = [num2, num1];
        correctAnswer = num1 - num2;
        question = `${num1} - ${num2} = ?`;
        explanation = `Para restar ${num1} - ${num2}, resta por columnas prestando cuando haga falta. El resultado es ${correctAnswer}.`;
        break;
      }
      case 'multiplicacion': {
        // 2-digit × 1-digit early; 2-digit × 2-digit at higher levels
        if (level <= 2) {
          num1 = Math.floor(Math.random() * 90) + 10;
          num2 = Math.floor(Math.random() * 8) + 2;
        } else if (level <= 4) {
          num1 = Math.floor(Math.random() * 90) + 10;
          num2 = Math.floor(Math.random() * 12) + 3;
        } else {
          num1 = Math.floor(Math.random() * 80) + 12;
          num2 = Math.floor(Math.random() * 80) + 12;
        }
        correctAnswer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        explanation = `${num1} × ${num2} = ${correctAnswer}. Puedes descomponer ${num1} y multiplicar cada parte por ${num2}, luego sumar.`;
        break;
      }
      case 'division': {
        // Exact divisions with larger dividends
        num2 = Math.floor(Math.random() * (8 + level * 2)) + 2;
        correctAnswer = Math.floor(Math.random() * (20 + level * 15)) + 8;
        num1 = num2 * correctAnswer;
        question = `${num1} ÷ ${num2} = ?`;
        explanation = `${num1} ÷ ${num2} = ${correctAnswer} porque ${num2} × ${correctAnswer} = ${num1}.`;
        break;
      }
      case 'potencias': {
        // Squares/cubes appropriate for 5th grade
        if (level <= 2 || Math.random() < 0.65) {
          num1 = Math.floor(Math.random() * 12) + 2;
          num2 = 2;
        } else {
          num1 = Math.floor(Math.random() * 6) + 2;
          num2 = 3;
        }
        correctAnswer = Math.pow(num1, num2);
        question = `${num1}^${num2} = ?`;
        explanation = `${num1}^${num2} significa multiplicar ${num1} por sí mismo ${num2} veces: ${Array(num2).fill(num1).join(' × ')} = ${correctAnswer}.`;
        break;
      }
      case 'radicacion': {
        // Perfect squares up to 400+
        const maxRoot = Math.min(25, 12 + level * 2);
        correctAnswer = Math.floor(Math.random() * (maxRoot - 5)) + 6;
        num1 = correctAnswer * correctAnswer;
        question = `√${num1} = ?`;
        explanation = `√${num1} = ${correctAnswer} porque ${correctAnswer} × ${correctAnswer} = ${num1}.`;
        break;
      }
      case 'polinomios': {
        // Evaluate 3x+5 style, or combine like terms with numeric answer
        if (Math.random() < 0.5) {
          const coef = Math.floor(Math.random() * (4 + level)) + 2;
          const constant = Math.floor(Math.random() * 20) + 1;
          const xVal = Math.floor(Math.random() * (8 + level)) + 1;
          correctAnswer = coef * xVal + constant;
          question = `Si x = ${xVal}, ¿cuánto vale ${coef}x + ${constant}?`;
          explanation = `Sustituye x: ${coef}(${xVal}) + ${constant} = ${coef * xVal} + ${constant} = ${correctAnswer}.`;
        } else {
          const a = Math.floor(Math.random() * (6 + level)) + 1;
          const b = Math.floor(Math.random() * (6 + level)) + 1;
          const c = Math.floor(Math.random() * 10) + 1;
          const d = Math.floor(Math.random() * 10) + 1;
          correctAnswer = a + b;
          question = `¿Cuál es el coeficiente de x en (${a}x + ${c}) + (${b}x + ${d})?`;
          explanation = `Suma términos semejantes: ${a}x + ${b}x = ${correctAnswer}x. El coeficiente de x es ${correctAnswer}.`;
        }
        break;
      }
      default:
        num1 = Math.floor(Math.random() * (100 * difficultyMultiplier)) + 100;
        num2 = Math.floor(Math.random() * (100 * difficultyMultiplier)) + 100;
        correctAnswer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        explanation = `${num1} + ${num2} = ${correctAnswer}`;
    }

    const options = [correctAnswer];
    const spread = Math.max(15, Math.abs(Math.round(correctAnswer * 0.08)), 10 * difficultyMultiplier);
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * spread * 2) - spread;
      const option = Math.max(0, Math.round(correctAnswer + (offset === 0 ? spread : offset)));
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

  const advanceToNext = (historySnapshot: AttemptRecord[], wasCorrect: boolean) => {
    clearFeedbackTimers();
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowConfetti(false);
    setFeedbackSecondsLeft(5);
    pendingAdvanceSnapshotRef.current = null;

    const nuevasPreguntas = historySnapshot.length;
    const nuevosErrores = historySnapshot.filter((a) => !a.isCorrect).length;
    const nuevosCorazones = hearts - (!wasCorrect ? 1 : 0);

    if (nuevosCorazones <= 0) {
      updateHearts(0);
      setShowTiredDraco(true);
      return;
    }

    if (
      nuevasPreguntas >= MAX_QUESTIONS ||
      nuevosErrores >= MAX_ERRORS
    ) {
      finishPractice(historySnapshot);
    } else {
      setCurrentProblem(generateProblem());
      setDragonMessage("¡Vamos! ¡Tú puedes!");
    }
  };

  const handleAnswer = async (answer: number) => {
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

    const nextAttemptHistory = [...attemptHistory, attempt];
    setAttemptHistory(nextAttemptHistory);

    if (correct) {
      const earnedPoints = 10 + streak * 2;

      // Actualización inmediata del estado local (0 ms de bloqueo)
      setMetaPoints((prev) => prev + earnedPoints);
      setStreak((prev) => prev + 1);
      setShowConfetti(true);

      // Sincronización en segundo plano sin await (fire-and-forget)
      updateMetaPoints(earnedPoints).catch((error) => {
        console.warn("[Performance] Error al guardar META Points en segundo plano:", error);
      });

      const messages = [
        "¡Excelente!",
        "¡Perfecto!",
        "¡Increíble!",
        "¡Genial!",
        "¡Fantástico!",
      ];

      setDragonMessage(
        messages[Math.floor(Math.random() * messages.length)]
      );
    } else {
      setStreak(0);
      setErrors(errors + 1);
      setHearts(hearts - 1);
      setDragonMessage("¡Intenta de nuevo!");
    }

    setQuestionsAnswered((prev) => prev + 1);

    // TEMPORIZADOR DE RETROALIMENTACIÓN DE 5 SEGUNDOS (5000 ms)
    // Mantiene la pregunta y el feedback visible en pantalla exactamente 5 segundos
    // con cuenta regresiva visual antes de avanzar automáticamente.
    const FEEDBACK_DURATION_MS = 5000;
    clearFeedbackTimers();
    setFeedbackSecondsLeft(5);
    pendingAdvanceSnapshotRef.current = { history: nextAttemptHistory, wasCorrect: correct };

    countdownIntervalRef.current = setInterval(() => {
      setFeedbackSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    transitionTimerRef.current = setTimeout(() => {
      advanceToNext(nextAttemptHistory, correct);
    }, FEEDBACK_DURATION_MS);
  };

  const finishPractice = (finalAttempts: AttemptRecord[] = attemptHistory) => {
    const correctAnswers = finalAttempts.filter((a) => a.isCorrect).length;
    const totalQuestions = finalAttempts.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const stars = calculateStars(accuracy);

    updateHearts(hearts);

    updateProgress(
      category,
      lessonId,
      stars,
      finalAttempts.filter((a) => !a.isCorrect).length,
      accuracy
    );

    setShowResults(true);
  };

  const resetPractice = () => {
    clearFeedbackTimers();
    setFeedbackSecondsLeft(5);
    pendingAdvanceSnapshotRef.current = null;
    setSelectedAnswer(null);
    setIsCorrect(null);
    setMetaPoints(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setErrors(0);
    setShowConfetti(false);
    setAttemptHistory([]);
    setShowResults(false);
    setShowTiredDraco(false);
    setCurrentProblem(generateProblem());
    setDragonMessage("¡Vamos! ¡Tú puedes!");
  };

  const handleBack = () => {
    clearFeedbackTimers();
    onBack();
  };

  if (!currentProblem || !user) return null;

  if (showTiredDraco) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 flex items-center justify-center"
          >
            <DracoAvatar
              className="w-full h-full object-contain filter drop-shadow-md"
              alt="Draco"
            />
          </motion.div>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
            Estoy cansado, necesito recuperar mi energía, mañana seguiremos en la aventura, tú también descansa.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBack}
            className="w-full py-4 min-h-[44px] rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black text-lg shadow-lg"
          >
            Volver
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = attemptHistory.filter(a => a.isCorrect).length;
    const incorrectAttempts = attemptHistory.filter(a => !a.isCorrect);
    const totalAttempts = attemptHistory.length;
    const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
    const passed = accuracy >= PASSING_THRESHOLD;
    const stars = calculateStars(accuracy);

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
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-32 h-32 mx-auto mb-4 flex items-center justify-center"
              >
                <DracoAvatar
                  className="w-full h-full object-contain filter drop-shadow-lg"
                  alt="Draco"
                  showGlow={true}
                />
              </motion.div>
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
                {correctAnswers} de {totalAttempts} correctas ({accuracy}%)
              </p>
            </div>

            {/* Banner de Estado de Aprobación según Regla del 70% */}
            {passed ? (
              <div className="bg-gradient-to-r from-emerald-100 to-green-100 p-5 rounded-2xl mb-6 text-center border-2 border-emerald-400 shadow-sm">
                <p className="text-2xl font-black text-emerald-800 mb-1 flex items-center justify-center gap-2">
                  <span>¡Nivel Aprobado con Éxito!</span>
                  <PartyPopper className="w-7 h-7 text-emerald-600 inline-block" />
                </p>
                <p className="text-base font-bold text-emerald-700">
                  ¡Has alcanzado el {accuracy}% de aciertos (mínimo requerido 70%)! El siguiente nivel ha quedado desbloqueado.
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-amber-50 to-red-50 p-5 rounded-2xl mb-6 text-center border-2 border-red-300 shadow-sm">
                <p className="text-2xl font-black text-red-700 mb-1">
                  Nivel no alcanzado ({accuracy}%)
                </p>
                <p className="text-base font-bold text-gray-700">
                  Para desbloquear el siguiente nivel necesitas al menos un <strong>70% de aciertos</strong>.
                  <br />
                  ¡No te preocupes! Puedes reintentar este nivel para conseguirlo.
                </p>
              </div>
            )}

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
                            <p className="text-sm font-bold text-green-800 flex items-center gap-1">
                              <Lightbulb className="w-4 h-4 text-yellow-500" />
                              Explicación:
                            </p>
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
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetPractice}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-5 h-5" /> Reintentar Nivel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBack}
                className="flex-1 py-4 min-h-[44px] rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-black text-lg shadow-lg flex items-center justify-center"
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

      {/* Header Responsive */}
      <div className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 min-h-[44px] rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-gray-700 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            <span className="font-bold text-sm sm:text-base">Volver</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowDrawingBoard((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 min-h-[44px] rounded-xl transition-all cursor-pointer ${
                showDrawingBoard
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800'
              }`}
            >
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-black text-xs sm:text-sm">Pizarra</span>
            </button>

            <div className="flex items-center gap-1.5 bg-yellow-100 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-yellow-300">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              <span className="font-black text-xs sm:text-sm text-yellow-700">{metaPoints}</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-orange-100 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-orange-300">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              <span className="font-black text-xs sm:text-sm text-orange-700">{streak}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-red-100 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-red-300">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500" />
              <span className="font-black text-xs sm:text-sm text-red-700">{hearts}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-3">
          <div className="h-2.5 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(questionsAnswered / MAX_QUESTIONS) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-1">
            <span>Pregunta {questionsAnswered + 1} de {MAX_QUESTIONS}</span>
            <span className="text-red-600 font-bold">Errores: {errors}/{MAX_ERRORS}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Dragon Section - Escala para no desplazar las preguntas en celular */}
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
              className="mb-3 sm:mb-6 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 mx-auto flex items-center justify-center"
            >
              <DracoAvatar 
                className="w-full h-full object-contain filter drop-shadow-xl" 
                alt="Draco"
                showGlow={isCorrect === true}
              />
            </motion.div>

            <motion.div
              key={dragonMessage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3.5 shadow-lg inline-block border-2 border-indigo-100"
            >
              <p className="text-lg sm:text-2xl font-black text-gray-800">{dragonMessage}</p>
            </motion.div>
          </div>

          {/* Problem Section */}
          <div>
            <motion.div
              key={currentProblem.question}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`cuadro-pregunta rounded-3xl shadow-2xl p-5 sm:p-8 mb-4 transition-all duration-300 ${
                isCorrect === null
                  ? 'bg-white border-2 border-indigo-100'
                  : isCorrect
                  ? 'correcto bg-emerald-500 border-4 border-emerald-600 text-white ring-4 ring-emerald-300/50 shadow-emerald-200'
                  : 'incorrecto bg-red-500 border-4 border-red-600 text-white ring-4 ring-red-300/50 shadow-red-200'
              }`}
            >
              <div className="text-center mb-6 sm:mb-8">
                <h2
                  className={`text-3xl sm:text-4xl md:text-5xl font-black mb-2 transition-colors duration-200 ${
                    isCorrect === null ? 'text-gray-800' : 'text-white drop-shadow'
                  }`}
                >
                  {currentProblem.question}
                </h2>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {currentProblem.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    whileHover={{ scale: selectedAnswer === null ? 1.03 : 1 }}
                    whileTap={{ scale: selectedAnswer === null ? 0.96 : 1 }}
                    className={`
                      min-h-[56px] py-4 sm:py-6 px-4 sm:px-6 rounded-2xl text-2xl sm:text-3xl font-black transition-all cursor-pointer flex items-center justify-center
                      ${selectedAnswer === null
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:shadow-xl active:scale-95'
                        : selectedAnswer === option
                          ? isCorrect
                            ? 'bg-emerald-600 text-white scale-102 shadow-2xl ring-4 ring-white'
                            : 'bg-red-600 text-white scale-102 shadow-2xl ring-4 ring-white'
                          : option === currentProblem.correctAnswer
                            ? 'bg-emerald-500 text-white ring-4 ring-yellow-300'
                            : 'bg-gray-200 text-gray-400 opacity-60'
                      }
                    `}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* FEEDBACK TEMPORIZADO DE 5 SEGUNDOS (5000 ms) */}
            <AnimatePresence>
              {selectedAnswer !== null && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className={`p-4 sm:p-5 rounded-3xl border-4 shadow-xl transition-all ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-emerald-100'
                      : 'bg-red-50 border-red-400 text-red-950 shadow-red-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                    <div className="flex items-center gap-2.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-base sm:text-lg font-black">
                          {isCorrect
                            ? `¡Correcto! +${10 + (streak - 1) * 2} MetaPoints`
                            : '¡Respuesta incorrecta!'}
                        </p>
                        {!isCorrect && (
                          <p className="text-xs sm:text-sm font-extrabold text-red-700">
                            Respuesta correcta: <span className="underline">{currentProblem.correctAnswer}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Cuenta regresiva de 5 segundos + botón de avance voluntario */}
                    <div className="flex items-center gap-2 ml-auto">
                      <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-black border border-gray-200 shadow-sm text-gray-800">
                        <Timer className="w-4 h-4 text-indigo-600 animate-spin" style={{ animationDuration: '3s' }} />
                        <span>Siguiente en {feedbackSecondsLeft}s</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (pendingAdvanceSnapshotRef.current) {
                            advanceToNext(
                              pendingAdvanceSnapshotRef.current.history,
                              pendingAdvanceSnapshotRef.current.wasCorrect
                            );
                          }
                        }}
                        className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black px-3 py-1.5 rounded-full shadow transition-all active:scale-95 cursor-pointer min-h-[36px]"
                        title="Avanzar de inmediato sin esperar los 5 segundos"
                      >
                        <span>Avanzar</span>
                        <FastForward className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Barra animada de 5 segundos: drena suavemente del 100% al 0% */}
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden my-2 shadow-inner">
                    <motion.div
                      key={currentProblem.question}
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                      className={`h-full ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}
                    />
                  </div>

                  {/* Explicación didáctica */}
                  <div className="mt-2 text-xs sm:text-sm bg-white/90 p-3 rounded-2xl border border-gray-200">
                    <p className="flex items-center gap-1.5 font-black text-gray-800 mb-0.5">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span>Explicación didáctica:</span>
                    </p>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      {currentProblem.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {showDrawingBoard && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl p-4">
            <DrawingBoard height={280} />
          </div>
        )}
      </div>
    </div>
  );
}
