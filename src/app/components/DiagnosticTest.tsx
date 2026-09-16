import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy, ArrowRight, CheckCircle, Pencil } from "lucide-react";

import dragonCharacter from "../../assets/draco.png";
import { useUser, ThemeUnlocks } from "../utils/userContext";
import { DrawingBoard } from "./DrawingBoard";

interface DiagnosticTestProps {
  onComplete: (level: number, unlocks: ThemeUnlocks) => void;
}

interface Question {
  question: string;
  options: number[];
  correctAnswer: number;
  category: string;
  difficulty: number;
}

const THEMES = [
  "suma",
  "resta",
  "multiplicacion",
  "division",
  "potencias",
  "radicacion",
  "polinomios",
] as const;

export function DiagnosticTest({ onComplete }: DiagnosticTestProps) {
  const { user, saveDiagnosticResult } = useUser();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [themeStats, setThemeStats] = useState<Record<string, { correct: number; total: number }>>({});
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [finalCorrect, setFinalCorrect] = useState(0);
  const [finalThemeStats, setFinalThemeStats] = useState<Record<string, { correct: number; total: number }>>({});

  useEffect(() => {
    generateDiagnosticQuestions();
  }, []);

  const generateDiagnosticQuestions = () => {
    const diagnosticQuestions: Question[] = [
      {
        question: "Calcula: 2.847 + 1.659 = ?",
        options: [4406, 4506, 4306, 4496],
        correctAnswer: 4506,
        category: "suma",
        difficulty: 3,
      },
      {
        question: "Una escuela tiene 1.245 estudiantes y llegan 378 nuevos. ¿Cuántos hay en total?",
        options: [1623, 1513, 1633, 1523],
        correctAnswer: 1623,
        category: "suma",
        difficulty: 3,
      },
      {
        question: "Calcula: 5.003 − 2.786 = ?",
        options: [2217, 2317, 2117, 2227],
        correctAnswer: 2217,
        category: "resta",
        difficulty: 3,
      },
      {
        question: "Un depósito tenía 4.500 litros y se usaron 1.875. ¿Cuántos litros quedan?",
        options: [2625, 2725, 2525, 2635],
        correctAnswer: 2625,
        category: "resta",
        difficulty: 3,
      },
      {
        question: "¿Cuánto es 47 × 36?",
        options: [1692, 1592, 1792, 1682],
        correctAnswer: 1692,
        category: "multiplicacion",
        difficulty: 4,
      },
      {
        question: "Hay 28 filas con 15 asientos. ¿Cuántos asientos hay?",
        options: [420, 400, 430, 415],
        correctAnswer: 420,
        category: "multiplicacion",
        difficulty: 3,
      },
      {
        question: "¿Cuánto es 1.728 ÷ 36?",
        options: [48, 46, 52, 42],
        correctAnswer: 48,
        category: "division",
        difficulty: 4,
      },
      {
        question: "Se reparte 960 hojas en 24 paquetes iguales. ¿Cuántas hojas por paquete?",
        options: [40, 35, 45, 30],
        correctAnswer: 40,
        category: "division",
        difficulty: 3,
      },
      {
        question: "¿Cuánto es 8² + 5³?",
        options: [189, 169, 199, 179],
        correctAnswer: 189,
        category: "potencias",
        difficulty: 4,
      },
      {
        question: "Calcula 10³ − 6².",
        options: [964, 940, 1000, 936],
        correctAnswer: 964,
        category: "potencias",
        difficulty: 4,
      },
      {
        question: "¿Cuál es √196?",
        options: [14, 12, 16, 13],
        correctAnswer: 14,
        category: "radicacion",
        difficulty: 3,
      },
      {
        question: "Si √x = 15, ¿cuánto vale x?",
        options: [225, 215, 30, 150],
        correctAnswer: 225,
        category: "radicacion",
        difficulty: 3,
      },
      {
        question: "Simplifica: (3x + 5) + (2x − 1)",
        options: [5, 4, 6, 7],
        correctAnswer: 5,
        category: "polinomios",
        difficulty: 3,
      },
      {
        question: "Si 4a + 7 = 31, ¿cuánto vale a?",
        options: [6, 5, 7, 8],
        correctAnswer: 6,
        category: "polinomios",
        difficulty: 4,
      },
    ];

    // Nota: para polinomios usamos el coeficiente resultante 5x+4 -> pedimos coeficiente de x = 5
    diagnosticQuestions[12] = {
      question: "En (3x + 5) + (2x − 1), ¿cuál es el coeficiente de x?",
      options: [5, 4, 6, 3],
      correctAnswer: 5,
      category: "polinomios",
      difficulty: 3,
    };

    setQuestions(diagnosticQuestions);

    const initial: Record<string, { correct: number; total: number }> = {};
    THEMES.forEach((t) => {
      initial[t] = { correct: 0, total: 0 };
    });
    diagnosticQuestions.forEach((q) => {
      if (!initial[q.category]) initial[q.category] = { correct: 0, total: 0 };
      initial[q.category].total += 1;
    });
    setThemeStats(initial);
  };

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);

    const q = questions[currentQuestion];
    const isCorrect = answer === q.correctAnswer;
    const nextCorrect = correctAnswers + (isCorrect ? 1 : 0);

    const nextThemeStats = { ...themeStats };
    const theme = nextThemeStats[q.category] || { correct: 0, total: 0 };
    nextThemeStats[q.category] = {
      ...theme,
      correct: theme.correct + (isCorrect ? 1 : 0),
    };

    setThemeStats(nextThemeStats);
    setCorrectAnswers(nextCorrect);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setFinalCorrect(nextCorrect);
      setFinalThemeStats(nextThemeStats);
      setShowResult(true);
    }
  };

  const buildUnlocks = (
    score: number,
    stats: Record<string, { correct: number; total: number }>
  ): ThemeUnlocks => {
    const percentage = (score / questions.length) * 100;
    const globalLevels = Math.max(1, Math.ceil((percentage / 100) * 5));
    const unlocks: ThemeUnlocks = {};

    THEMES.forEach((theme) => {
      const themeData = stats[theme];
      if (themeData && themeData.total > 0) {
        const themePct = (themeData.correct / themeData.total) * 100;
        const blended = (themePct + percentage) / 2;
        unlocks[theme] = Math.max(1, Math.min(5, Math.ceil((blended / 100) * 5)));
      } else {
        unlocks[theme] = globalLevels;
      }
    });

    return unlocks;
  };

  const handleComplete = () => {
    const percentage = Math.round((finalCorrect / questions.length) * 100);
    const unlocks = buildUnlocks(finalCorrect, finalThemeStats);
    const level = Math.max(1, Math.ceil((percentage / 100) * 5));

    if (user) {
      saveDiagnosticResult(percentage, finalCorrect, questions.length, unlocks);
    }

    localStorage.setItem("diagnostico_completado", "true");
    onComplete(level, unlocks);
  };

  if (questions.length === 0) return null;

  if (showResult) {
    const percentage = Math.round((finalCorrect / questions.length) * 100);
    const unlocks = buildUnlocks(finalCorrect, finalThemeStats);

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center"
        >
          <img src={dragonCharacter} alt="Draco" className="w-28 h-28 mx-auto mb-4" />
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h2 className="text-3xl font-black text-gray-800 mb-2">¡Prueba completada!</h2>
          <p className="text-xl font-bold text-indigo-600 mb-4">{percentage}% de aciertos</p>
          <p className="text-gray-600 font-semibold mb-4">
            Se desbloquean niveles por tema según tu resultado (ejemplo: 50% ≈ mitad de niveles).
          </p>
          <div className="grid grid-cols-2 gap-2 text-left mb-6">
            {Object.entries(unlocks).map(([theme, lvl]) => (
              <div key={theme} className="bg-indigo-50 rounded-xl px-3 py-2 text-sm font-bold text-indigo-800">
                {theme}: hasta nivel {lvl}
              </div>
            ))}
          </div>
          <button
            onClick={handleComplete}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-lg flex items-center justify-center gap-2"
          >
            Continuar aventura <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-300 z-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={dragonCharacter} alt="Draco" className="w-16 h-16" />
            <div>
              <h1 className="text-2xl font-black text-white drop-shadow">Prueba diagnóstica</h1>
              <p className="text-white/90 font-bold">
                Pregunta {currentQuestion + 1} de {questions.length}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowBoard((v) => !v)}
            className="bg-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow"
          >
            <Pencil className="w-4 h-4" /> Tablero
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-4">
          <p className="text-xl font-black text-gray-800 mb-6">{q.question}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleAnswer(opt)}
                className={`py-4 px-4 rounded-2xl font-black text-lg border-b-4 transition ${
                  selectedAnswer === opt
                    ? "bg-indigo-500 text-white border-indigo-700"
                    : "bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {selectedAnswer !== null && (
            <div className="mt-4 flex items-center gap-2 text-green-700 font-bold">
              <CheckCircle className="w-5 h-5" /> Respuesta registrada
            </div>
          )}
        </div>

        {showBoard && <DrawingBoard height={280} />}
      </div>
    </div>
  );
}
