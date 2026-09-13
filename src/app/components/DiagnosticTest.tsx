import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy, ArrowRight, CheckCircle } from "lucide-react";

import dragonCharacter from "../../assets/draco.png";
import { useUser } from "../utils/userContext";

interface DiagnosticTestProps {
  onComplete: (level: number) => void;
}

interface Question {
  question: string;
  options: number[];
  correctAnswer: number;
  category: string;
  difficulty: number;
}

export function DiagnosticTest({ onComplete }: DiagnosticTestProps) {
  const { user } = useUser();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    generateDiagnosticQuestions();
  }, []);

  const generateDiagnosticQuestions = () => {
    const diagnosticQuestions: Question[] = [
      {
        question:
          "¿Cuántas manzanas tienes si juntas 3 manzanas rojas y 2 manzanas verdes?",
        options: [4, 5, 6, 3],
        correctAnswer: 5,
        category: "suma",
        difficulty: 1,
      },
      {
        question:
          "Tienes 8 caramelos y le das 3 a tu amigo. ¿Cuántos te quedan?",
        options: [5, 6, 4, 11],
        correctAnswer: 5,
        category: "resta",
        difficulty: 1,
      },
      {
        question:
          "En una fiesta hay 15 niños y llegan 12 más. ¿Cuántos niños hay en total?",
        options: [27, 26, 28, 25],
        correctAnswer: 27,
        category: "suma",
        difficulty: 2,
      },
      {
        question:
          "Si tienes 4 cajas y cada caja tiene 5 galletas, ¿cuántas galletas tienes en total?",
        options: [20, 15, 25, 9],
        correctAnswer: 20,
        category: "multiplicacion",
        difficulty: 2,
      },
      {
        question:
          "Una tienda tenía 45 pelotas y vendió 28. ¿Cuántas pelotas quedaron?",
        options: [17, 18, 16, 73],
        correctAnswer: 17,
        category: "resta",
        difficulty: 3,
      },
      {
        question:
          "Un autobús tiene 8 filas con 6 asientos cada una. ¿Cuántos asientos hay en total?",
        options: [42, 48, 54, 14],
        correctAnswer: 48,
        category: "multiplicacion",
        difficulty: 3,
      },
      {
        question:
          "24 estudiantes se dividen en 4 equipos iguales. ¿Cuántos estudiantes hay en cada equipo?",
        options: [6, 5, 8, 96],
        correctAnswer: 6,
        category: "division",
        difficulty: 4,
      },
      {
        question:
          "María tiene 35 pesos y gasta 12 en un libro. Luego su mamá le da 20 más. ¿Cuánto tiene ahora?",
        options: [43, 47, 23, 67],
        correctAnswer: 43,
        category: "suma",
        difficulty: 4,
      },
      {
        question: "¿Cuánto es 3 × 3 × 3? (3 elevado al cubo)",
        options: [27, 9, 18, 81],
        correctAnswer: 27,
        category: "potencias",
        difficulty: 5,
      },
      {
        question:
          "Un granjero tiene 6 corrales con 8 conejos cada uno. Si regala 15 conejos, ¿cuántos le quedan?",
        options: [33, 48, 29, 63],
        correctAnswer: 33,
        category: "multiplicacion",
        difficulty: 5,
      },
    ];

    setQuestions(diagnosticQuestions);
  };

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);

    setTimeout(() => {
      if (answer === questions[currentQuestion].correctAnswer) {
        setCorrectAnswers((prev) => prev + 1);
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const calculateLevel = () => {
    const percentage = (correctAnswers / questions.length) * 100;

    if (percentage >= 90) return 5;
    if (percentage >= 70) return 4;
    if (percentage >= 50) return 3;
    if (percentage >= 30) return 2;
    return 1;
  };

  const handleComplete = () => {
    const level = calculateLevel();

    if (user) {
      localStorage.setItem(
        `mathverse_diagnostic_${user.id}`,
        JSON.stringify({
          completed: true,
          level,
          score: correctAnswers,
          total: questions.length,
          date: new Date().toISOString(),
        })
      );
    }

    localStorage.setItem("diagnostico_completado", "true");

    // Enviar el nivel a StudentApp
    onComplete(level);
  };

  if (questions.length === 0) return null;

  if (showResult) {
    const level = calculateLevel();
    const percentage = Math.round(
      (correctAnswers / questions.length) * 100
    );

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8"
        >
          <div className="text-center">
            <motion.img
              animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
              src={dragonCharacter}
              alt="Draco"
              className="w-48 h-48 mx-auto mb-6"
            />

            <h2 className="text-4xl font-black text-gray-800 mb-4">
              ¡Prueba Completada! 🎉
            </h2>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl mb-6">
              <p className="text-6xl font-black text-purple-600 mb-2">
                {percentage}%
              </p>

              <p className="text-xl font-bold text-gray-700">
                {correctAnswers} de {questions.length} respuestas correctas
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl mb-6 border-2 border-yellow-400">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Trophy className="w-12 h-12 text-yellow-600" />
                <h3 className="text-3xl font-black text-yellow-700">
                  Nivel {level}
                </h3>
              </div>

              <p className="text-lg font-bold text-gray-700">
                {level === 5 && "¡Eres un Maestro Matemático! 🌟"}
                {level === 4 && "¡Excelente desempeño! 🎯"}
                {level === 3 && "¡Buen trabajo! Sigamos practicando 💪"}
                {level === 2 && "Estás en el camino correcto 📚"}
                {level === 1 && "¡Empecemos desde lo básico! 🚀"}
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl mb-6 border-2 border-blue-300">
              <h3 className="text-xl font-black text-gray-800 mb-3">
                📚 Tu Ruta de Aprendizaje
              </h3>

              <p className="text-gray-700 font-semibold">
                Hemos desbloqueado las lecciones hasta el nivel {level}. ¡Completa
                cada nivel para desbloquear nuevos desafíos con Draco!
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleComplete}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-xl flex items-center justify-center gap-3"
            >
              ¡Comenzar Mi Aventura!
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 flex items-center justify-center p-4 z-50">
      <motion.div
        key={currentQuestion}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8"
      >
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-gray-800">
              Prueba Diagnóstica
            </h2>

            <span className="text-lg font-bold text-purple-600">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center">
            <motion.img
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              src={dragonCharacter}
              alt="Draco"
              className="w-48 h-48 mx-auto mb-4"
            />

            <div className="bg-purple-100 p-4 rounded-2xl border-2 border-purple-300">
              <p className="text-lg font-bold text-gray-800">
                ¡Piensa bien antes de responder! 🔥
              </p>
            </div>
          </div>

          <div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl mb-6 border-2 border-blue-300">
              <p className="text-2xl font-bold text-gray-800 leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{
                    scale: selectedAnswer === null ? 1.05 : 1,
                  }}
                  whileTap={{
                    scale: selectedAnswer === null ? 0.95 : 1,
                  }}
                  disabled={selectedAnswer !== null}
                  onClick={() =>
                    selectedAnswer === null && handleAnswer(option)
                  }
                  className={`py-6 px-4 rounded-2xl text-3xl font-black transition-all ${
                    selectedAnswer === null
                      ? "bg-gradient-to-br from-purple-400 to-pink-500 text-white"
                      : selectedAnswer === option
                      ? option === currentQ.correctAnswer
                        ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                        : "bg-gradient-to-br from-red-400 to-red-500 text-white"
                      : option === currentQ.correctAnswer
                      ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {option}

                  {selectedAnswer === option &&
                    option === currentQ.correctAnswer && (
                      <CheckCircle className="inline ml-2 w-6 h-6" />
                    )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}