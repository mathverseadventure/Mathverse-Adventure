import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Trash2, Equal } from 'lucide-react';
import dragonCharacter from 'figma:asset/a7a237254f335b0739e1c16c0d3ef0796ab00ae9.png';
import { useUser } from '../utils/userContext';

interface MathPuzzleGameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Problem {
  left: string;
  right: string;
  leftValue: number;
  rightValue: number;
}

export function MathPuzzleGame({ isOpen, onClose }: MathPuzzleGameProps) {
  const { user, userProgress, updateMetaPoints } = useUser();
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [instruction, setInstruction] = useState<'mayor' | 'menor'>('mayor');
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [discardCount, setDiscardCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Get unlocked operations based on user progress
  const getUnlockedOperations = () => {
    const operations: string[] = [];
    if (userProgress.suma && Object.keys(userProgress.suma).length > 0) operations.push('+');
    if (userProgress.resta && Object.keys(userProgress.resta).length > 0) operations.push('-');
    if (userProgress.multiplicacion && Object.keys(userProgress.multiplicacion).length > 0) operations.push('×');
    if (userProgress.division && Object.keys(userProgress.division).length > 0) operations.push('÷');
    return operations.length > 0 ? operations : ['+'];
  };

  const generateNumber = (max: number = 20) => {
    return Math.floor(Math.random() * max) + 1;
  };

  const generateProblem = () => {
    const operations = getUnlockedOperations();
    const useOperation = Math.random() > 0.3; // 70% chance of using operations

    if (!useOperation || score < 3) {
      // Simple numbers
      const left = generateNumber(50);
      const right = generateNumber(50);
      return {
        left: left.toString(),
        right: right.toString(),
        leftValue: left,
        rightValue: right,
      };
    }

    // Generate operation-based problems
    const op1 = operations[Math.floor(Math.random() * operations.length)];
    const op2 = operations[Math.floor(Math.random() * operations.length)];

    let leftValue = 0;
    let rightValue = 0;
    let leftStr = '';
    let rightStr = '';

    // Left side
    const a = generateNumber(15);
    const b = generateNumber(15);
    
    switch (op1) {
      case '+':
        leftValue = a + b;
        leftStr = `${a} + ${b}`;
        break;
      case '-':
        leftValue = Math.max(a, b) - Math.min(a, b);
        leftStr = `${Math.max(a, b)} − ${Math.min(a, b)}`;
        break;
      case '×':
        const m1 = generateNumber(10);
        const m2 = generateNumber(10);
        leftValue = m1 * m2;
        leftStr = `${m1} × ${m2}`;
        break;
      case '÷':
        const div1 = generateNumber(10);
        const mult = generateNumber(10);
        leftValue = div1;
        leftStr = `${div1 * mult} ÷ ${mult}`;
        break;
    }

    // Right side
    const c = generateNumber(15);
    const d = generateNumber(15);

    switch (op2) {
      case '+':
        rightValue = c + d;
        rightStr = `${c} + ${d}`;
        break;
      case '-':
        rightValue = Math.max(c, d) - Math.min(c, d);
        rightStr = `${Math.max(c, d)} − ${Math.min(c, d)}`;
        break;
      case '×':
        const m3 = generateNumber(10);
        const m4 = generateNumber(10);
        rightValue = m3 * m4;
        rightStr = `${m3} × ${m4}`;
        break;
      case '÷':
        const div2 = generateNumber(10);
        const mult2 = generateNumber(10);
        rightValue = div2;
        rightStr = `${div2 * mult2} ÷ ${mult2}`;
        break;
    }

    return {
      left: leftStr,
      right: rightStr,
      leftValue,
      rightValue,
    };
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCorrectCount(0);
    setErrorCount(0);
    setDiscardCount(0);
    setTimeLeft(90);
    setFeedback(null);
    nextProblem();
  };

  const nextProblem = () => {
    const problem = generateProblem();
    setCurrentProblem(problem);
    setInstruction(Math.random() > 0.5 ? 'mayor' : 'menor');
    setFeedback(null);
  };

  const handleChoice = (side: 'left' | 'right') => {
    if (!currentProblem || feedback) return;

    const chosen = side === 'left' ? currentProblem.leftValue : currentProblem.rightValue;
    const other = side === 'left' ? currentProblem.rightValue : currentProblem.leftValue;

    let isCorrect = false;

    if (instruction === 'mayor') {
      isCorrect = chosen > other;
    } else {
      isCorrect = chosen < other;
    }

    if (isCorrect) {
      setFeedback('correct');
      setScore(score + 10);
      setCorrectCount(correctCount + 1);
    } else {
      setFeedback('wrong');
      setErrorCount(errorCount + 1);
    }

    setTimeout(() => {
      nextProblem();
    }, 1000);
  };

  const handleEqual = () => {
    if (!currentProblem || feedback) return;

    if (currentProblem.leftValue === currentProblem.rightValue) {
      setFeedback('correct');
      setScore(score + 15);
      setCorrectCount(correctCount + 1);
    } else {
      setFeedback('wrong');
      setErrorCount(errorCount + 1);
    }

    setTimeout(() => {
      nextProblem();
    }, 1000);
  };

  const handleDiscard = () => {
    if (discardCount >= 5 || !currentProblem) return;
    
    setDiscardCount(discardCount + 1);
    nextProblem();
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
      // Award MetaPoints
      const pointsEarned = Math.floor(score / 2);
      updateMetaPoints(pointsEarned);
    }
  }, [timeLeft, gameState]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
      >
        {gameState === 'intro' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                🎮 METAJUEGOS - Puzzle Matemático
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div className="text-center mb-8">
              <img src={dragonCharacter} alt="Draco" className="w-48 h-48 mx-auto mb-6" />
              <h3 className="text-3xl font-black text-gray-800 mb-4">¿Cómo se juega?</h3>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl mb-6 border-2 border-purple-300">
              <h4 className="text-xl font-black text-gray-800 mb-4">📋 Instrucciones</h4>
              <ul className="space-y-3 text-gray-700 font-semibold">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <span>Elige entre dos números o resultados matemáticos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <span>Sigue la instrucción superior (mayor o menor)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <span>Si ambos valores son iguales, presiona el botón "Igual"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">4️⃣</span>
                  <span>Puedes descartar hasta 5 veces si no puedes resolver</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">⏱️</span>
                  <span>Tienes 1 minuto y 30 segundos para obtener el mejor puntaje</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-2xl mb-6 border-2 border-blue-300">
              <h4 className="text-xl font-black text-gray-800 mb-3">🎯 Reglas de Color</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-red-500">Mayor</span>
                  <span className="text-gray-700 font-semibold">Cuando veas ROJO, elige el número MAYOR</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-blue-500">Menor</span>
                  <span className="text-gray-700 font-semibold">Cuando veas AZUL, elige el número MENOR</span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-2xl"
            >
              🚀 ¡Iniciar Juego!
            </motion.button>
          </div>
        )}

        {gameState === 'playing' && currentProblem && (
          <div className="p-8 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 px-4 py-2 rounded-xl border-2 border-blue-400">
                  <Clock className="w-5 h-5 text-blue-600 inline mr-2" />
                  <span className="font-black text-xl text-blue-600">{timeLeft}s</span>
                </div>
                <div className="bg-yellow-100 px-4 py-2 rounded-xl border-2 border-yellow-400">
                  <span className="font-black text-xl text-yellow-700">⭐ {score}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Instruction */}
            <div className="mb-8 text-center">
              <motion.h2
                key={instruction}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`text-6xl font-black ${
                  instruction === 'mayor' ? 'text-red-500' : 'text-blue-500'
                }`}
              >
                Elegir el número {instruction}
              </motion.h2>
            </div>

            {/* Problem */}
            <div className="flex-1 flex items-center justify-center gap-8 mb-8">
              <AnimatePresence mode="wait">
                <motion.button
                  key={`left-${currentProblem.left}`}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleChoice('left')}
                  disabled={feedback !== null}
                  className={`w-64 h-64 rounded-3xl shadow-2xl border-8 flex items-center justify-center transition-all ${
                    feedback === 'correct' && currentProblem.leftValue > currentProblem.rightValue && instruction === 'mayor' ||
                    feedback === 'correct' && currentProblem.leftValue < currentProblem.rightValue && instruction === 'menor'
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-600'
                      : feedback === 'wrong' && currentProblem.leftValue > currentProblem.rightValue && instruction === 'mayor' ||
                        feedback === 'wrong' && currentProblem.leftValue < currentProblem.rightValue && instruction === 'menor'
                      ? 'bg-gradient-to-br from-red-400 to-red-500 border-red-600'
                      : 'bg-gradient-to-br from-purple-400 to-pink-500 border-purple-600'
                  }`}
                >
                  <span className="text-6xl font-black text-white">{currentProblem.left}</span>
                </motion.button>

                <span className="text-6xl font-black text-gray-400">VS</span>

                <motion.button
                  key={`right-${currentProblem.right}`}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleChoice('right')}
                  disabled={feedback !== null}
                  className={`w-64 h-64 rounded-3xl shadow-2xl border-8 flex items-center justify-center transition-all ${
                    feedback === 'correct' && currentProblem.rightValue > currentProblem.leftValue && instruction === 'mayor' ||
                    feedback === 'correct' && currentProblem.rightValue < currentProblem.leftValue && instruction === 'menor'
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-600'
                      : feedback === 'wrong' && currentProblem.rightValue > currentProblem.leftValue && instruction === 'mayor' ||
                        feedback === 'wrong' && currentProblem.rightValue < currentProblem.leftValue && instruction === 'menor'
                      ? 'bg-gradient-to-br from-red-400 to-red-500 border-red-600'
                      : 'bg-gradient-to-br from-orange-400 to-red-500 border-orange-600'
                  }`}
                >
                  <span className="text-6xl font-black text-white">{currentProblem.right}</span>
                </motion.button>
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEqual}
                disabled={feedback !== null}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-xl disabled:opacity-50"
              >
                <Equal className="w-6 h-6 inline mr-2" />
                Igual
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDiscard}
                disabled={discardCount >= 5 || feedback !== null}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-gray-400 to-gray-600 text-white font-black text-xl disabled:opacity-30"
              >
                <Trash2 className="w-6 h-6 inline mr-2" />
                Descartar ({5 - discardCount})
              </motion.button>
            </div>

            {/* Discard Bar */}
            <div className="mt-6">
              <div className="flex gap-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-12 h-3 rounded-full ${
                      i < discardCount ? 'bg-red-400' : 'bg-green-400'
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-gray-600 font-semibold mt-2">
                Descartes usados: {discardCount}/5
              </p>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="p-8 text-center">
            <img src={dragonCharacter} alt="Draco" className="w-48 h-48 mx-auto mb-6" />
            
            <h2 className="text-5xl font-black text-gray-800 mb-6">¡Tiempo Terminado! 🎉</h2>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-3xl mb-8 border-4 border-purple-400">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-600 font-semibold mb-2">Puntaje Final</p>
                  <p className="text-6xl font-black text-purple-600">{score}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold mb-2">Correctas</p>
                  <p className="text-6xl font-black text-green-600">{correctCount}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold mb-2">Errores</p>
                  <p className="text-6xl font-black text-red-600">{errorCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-100 p-6 rounded-2xl mb-8 border-2 border-yellow-400">
              <p className="text-2xl font-black text-yellow-700">
                ¡Ganaste {Math.floor(score / 2)} MetaPoints! 💰
              </p>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl"
              >
                🔄 Volver a Jugar
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-gray-400 to-gray-600 text-white font-black text-xl"
              >
                🚪 Salir del Juego
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}