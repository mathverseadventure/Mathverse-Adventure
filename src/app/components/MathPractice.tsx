import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Heart, Trophy, ArrowLeft, Sparkles } from 'lucide-react';
import dragonCharacter from '../../assets/draco.png';

interface MathProblem {
  question: string;
  correctAnswer: number;
  options: number[];
}

interface MathPracticeProps {
  category: string;
  onBack: () => void;
  onPointsEarned: (points: number) => void;
}

export function MathPractice({ category, onBack, onPointsEarned }: MathPracticeProps) {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dragonMessage, setDragonMessage] = useState('¡Vamos! ¡Tú puedes!');

  const generateProblem = (): MathProblem => {
    let num1: number, num2: number, correctAnswer: number, question: string;
    
    switch (category) {
      case 'suma':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        correctAnswer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        break;
      case 'resta':
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * 20) + 1;
        correctAnswer = num1 - num2;
        question = `${num1} - ${num2} = ?`;
        break;
      case 'multiplicacion':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        correctAnswer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        break;
      case 'division':
        num2 = Math.floor(Math.random() * 10) + 1;
        correctAnswer = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * correctAnswer;
        question = `${num1} ÷ ${num2} = ?`;
        break;
      case 'potencias':
        num1 = Math.floor(Math.random() * 5) + 2;
        num2 = Math.floor(Math.random() * 3) + 2;
        correctAnswer = Math.pow(num1, num2);
        question = `${num1}${num2} = ?`;
        break;
      case 'radicacion':
        correctAnswer = Math.floor(Math.random() * 10) + 1;
        num1 = correctAnswer * correctAnswer;
        question = `√${num1} = ?`;
        break;
      case 'polinomios':
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        correctAnswer = 2 * num1 + num2;
        question = `2(${num1}) + ${num2} = ?`;
        break;
      default:
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        correctAnswer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
    }

    // Generate options
    const options = [correctAnswer];
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * 20) - 10;
      const option = correctAnswer + offset;
      if (option > 0 && !options.includes(option)) {
        options.push(option);
      }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    return { question, correctAnswer, options };
  };

  useEffect(() => {
    setCurrentProblem(generateProblem());
  }, [category]);

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentProblem?.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      const earnedPoints = 10 + streak * 5;
      setScore(score + earnedPoints);
      setStreak(streak + 1);
      setShowConfetti(true);
      onPointsEarned(earnedPoints);
      
      const messages = [
        '¡Excelente!',
        '¡Perfecto!',
        '¡Increíble!',
        '¡Genial!',
        '¡Fantástico!'
      ];
      setDragonMessage(messages[Math.floor(Math.random() * messages.length)]);
    } else {
      setStreak(0);
      setDragonMessage('¡Intenta de nuevo!');
    }

    setQuestionsAnswered(questionsAnswered + 1);

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowConfetti(false);
      setCurrentProblem(generateProblem());
      setDragonMessage('¡Vamos! ¡Tú puedes!');
    }, 2000);
  };

  if (!currentProblem) return null;

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
            ))}
          </div>
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
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-yellow-700">{score}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-orange-700">{streak} racha</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(questionsAnswered % 10) * 10}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1 text-center">
            Pregunta {questionsAnswered % 10 + 1} de 10
          </p>
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
                      ? `¡Correcto! +${10 + (streak - 1) * 5} puntos` 
                      : `La respuesta correcta es ${currentProblem.correctAnswer}`
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
