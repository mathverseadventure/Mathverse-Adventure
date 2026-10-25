import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  ArrowRight,
  CheckCircle,
  XCircle,
  Pencil,
  Sparkles,
  Award,
  Timer,
  FastForward,
} from "lucide-react";

import dragonCharacter from "@/assets/images/draco.png";
import { useUser, ThemeUnlocks } from "../utils/userContext";
import { DrawingBoard } from "./DrawingBoard";
import { validateAnswer, PASSING_THRESHOLD, shuffleArray } from "../utils/progressionService";
import { DracoAvatar } from "./DracoAvatar";

interface DiagnosticTestProps {
  onComplete: (level: number, unlocks: ThemeUnlocks) => void;
}

interface DiagnosticQuestion {
  id: number;
  question: string;
  options: number[];
  correctAnswer: number;
  category: "suma" | "resta" | "multiplicacion" | "division" | "potencias" | "radicacion" | "polinomios";
  categoryLabel: string;
  type: "operacion" | "problema";
  typeLabel: string;
  explanation: string;
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
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [themeStats, setThemeStats] = useState<Record<string, { correct: number; total: number }>>({});
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [finalCorrect, setFinalCorrect] = useState(0);
  const [finalThemeStats, setFinalThemeStats] = useState<Record<string, { correct: number; total: number }>>({});
  const [feedbackSecondsLeft, setFeedbackSecondsLeft] = useState<number>(5);

  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSnapshotRef = useRef<{ nextCorrect: number; nextStats: Record<string, { correct: number; total: number }> } | null>(null);

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

  useEffect(() => {
    generateDiagnosticQuestions();
  }, []);

  const generateDiagnosticQuestions = () => {
    // 14 preguntas calibradas a nivel de entrada para 5to de primaria:
    // 2 preguntas por tema (1 cálculo directo básico + 1 problema contextualizado de texto/lógica)
    const diagnosticQuestions: DiagnosticQuestion[] = [
      // 1. SUMA
      {
        id: 1,
        question: "Calcula: 145 + 234 = ?",
        options: [379, 369, 389, 359],
        correctAnswer: 379,
        category: "suma",
        categoryLabel: "Suma",
        type: "operacion",
        typeLabel: "Operación Directa",
        explanation: "Sumamos unidades (5+4=9), decenas (4+3=7) y centenas (1+2=3): 379.",
      },
      {
        id: 2,
        question:
          "Lucas tiene 35 canicas rojas y su amigo le regala 24 canicas azules. ¿Cuántas canicas tiene en total?",
        options: [59, 49, 69, 58],
        correctAnswer: 59,
        category: "suma",
        categoryLabel: "Suma",
        type: "problema",
        typeLabel: "Problema de Razonamiento",
        explanation: "Sumamos las canicas que tenía y las que le regalaron: 35 + 24 = 59 canicas.",
      },

      // 2. RESTA
      {
        id: 3,
        question: "Calcula: 96 − 42 = ?",
        options: [54, 44, 64, 52],
        correctAnswer: 54,
        category: "resta",
        categoryLabel: "Resta",
        type: "operacion",
        typeLabel: "Operación Directa",
        explanation: "Restamos unidades (6-2=4) y decenas (9-4=5): 54.",
      },
      {
        id: 4,
        question:
          "En una canasta había 50 manzanas. Si se vendieron 18 manzanas en la mañana, ¿cuántas manzanas quedan?",
        options: [32, 42, 28, 38],
        correctAnswer: 32,
        category: "resta",
        categoryLabel: "Resta",
        type: "problema",
        typeLabel: "Problema de Razonamiento",
        explanation: "Restamos las vendidas del total: 50 − 18 = 32 manzanas quedan.",
      },

      // 3. MULTIPLICACIÓN
      {
        id: 5,
        question: "¿Cuánto es 7 × 8?",
        options: [56, 54, 48, 64],
        correctAnswer: 56,
        category: "multiplicacion",
        categoryLabel: "Multiplicación",
        type: "operacion",
        typeLabel: "Operación Directa",
        explanation: "7 multiplicado por 8 es igual a 56.",
      },
      {
        id: 6,
        question:
          "Una caja contiene 6 paquetes de galletas, y cada paquete tiene 5 galletas. ¿Cuántas galletas hay en total?",
        options: [30, 25, 35, 36],
        correctAnswer: 30,
        category: "multiplicacion",
        categoryLabel: "Multiplicación",
        type: "problema",
        typeLabel: "Problema de Razonamiento",
        explanation: "Multiplicamos la cantidad de paquetes por las galletas de cada uno: 6 × 5 = 30 galletas.",
      },

      // 4. DIVISIÓN
      {
        id: 7,
        question: "¿Cuánto es 48 ÷ 6?",
        options: [8, 7, 9, 6],
        correctAnswer: 8,
        category: "division",
        categoryLabel: "División",
        type: "operacion",
        typeLabel: "Operación Directa",
        explanation: "48 dividido en 6 partes iguales es 8, porque 6 × 8 = 48.",
      },
      {
        id: 8,
        question:
          "La profesora tiene 36 lápices y desea repartirlos por igual entre 4 estudiantes. ¿Cuántos lápices recibe cada uno?",
        options: [9, 8, 7, 6],
        correctAnswer: 9,
        category: "division",
        categoryLabel: "División",
        type: "problema",
        typeLabel: "Problema de Razonamiento",
        explanation: "Dividimos los lápices entre los 4 estudiantes: 36 ÷ 4 = 9 lápices por estudiante.",
      },

      // 5. POTENCIAS
      {
        id: 9,
        question: "¿Cuánto es 5² (5 elevado al cuadrado)?",
        options: [25, 10, 15, 20],
        correctAnswer: 25,
        category: "potencias",
        categoryLabel: "Potencias",
        type: "operacion",
        typeLabel: "Operación Directa",
        explanation: "5² significa multiplicar 5 por sí mismo: 5 × 5 = 25.",
      },
      {
        id: 10,
        question:
          "Un piso cuadrado tiene 4 baldosas de largo y 4 de ancho (4²). ¿Cuántas baldosas tiene en total?",
        options: [16, 8, 12, 20],
        correctAnswer: 16,
        category: "potencias",
        categoryLabel: "Potencias",
        type: "problema",
        typeLabel: "Problema de Razonamiento",
        explanation: "El total de baldosas es 4² = 4 × 4 = 16 baldosas.",
      },

      // 6. RADICACIÓN
      {
        id: 11,
        question: "¿Cuál es la raíz cuadrada de 36 (√36)?",
        options: [6, 5, 7, 8],
        correctAnswer: 6,
        category: "radicacion",
        categoryLabel: "Radicación",
        type: "operacion",
        typeLabel: "Operación Directa",
        explanation: "√36 = 6 porque 6 × 6 = 36.",
      },
      {
        id: 12,
        question:
          "Un jardín cuadrado tiene un área total de 49 metros cuadrados. ¿Cuánto mide cada uno de sus lados? (Calcula √49)",
        options: [7, 6, 8, 9],
        correctAnswer: 7,
        category: "radicacion",
        categoryLabel: "Radicación",
        type: "problema",
        typeLabel: "Problema de Razonamiento",
        explanation: "El lado de una superficie cuadrada de 49 m² es su raíz: √49 = 7 metros.",
      },

      // 7. POLINOMIOS
      {
        id: 13,
        question: "Si el valor de la variable x es 4, ¿cuánto resulta x + 8?",
        options: [12, 10, 14, 32],
        correctAnswer: 12,
        category: "polinomios",
        categoryLabel: "Polinomios",
        type: "operacion",
        typeLabel: "Operación Directa",
        explanation: "Sustituimos x por 4: 4 + 8 = 12.",
      },
      {
        id: 14,
        question:
          "Un número desconocido 'n' sumado con 7 es igual a 20 (n + 7 = 20). ¿Cuál es el valor del número n?",
        options: [13, 14, 12, 11],
        correctAnswer: 13,
        category: "polinomios",
        categoryLabel: "Polinomios",
        type: "problema",
        typeLabel: "Problema de Razonamiento",
        explanation: "Para hallar n restamos 20 − 7 = 13. Por lo tanto, n = 13.",
      },
    ];

    // =========================================================================
    // ALEATORIZACIÓN VISUAL DE OPCIONES (ALGORITMO FISHER-YATES):
    // Mezcla de manera uniforme las opciones para cada una de las preguntas,
    // garantizando que la respuesta correcta pueda aparecer en cualquiera de las 4
    // posiciones (arriba-izq, arriba-der, abajo-izq, abajo-der).
    // La propiedad 'correctAnswer' y la evaluación en handleAnswer permanecen inalteradas,
    // ya que la validación se hace por valor numérico real y no por posición en el array.
    // =========================================================================
    const randomizedQuestions: DiagnosticQuestion[] = diagnosticQuestions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));

    setQuestions(randomizedQuestions);

    const initial: Record<string, { correct: number; total: number }> = {};
    THEMES.forEach((t) => {
      initial[t] = { correct: 0, total: 0 };
    });
    randomizedQuestions.forEach((q) => {
      if (!initial[q.category]) initial[q.category] = { correct: 0, total: 0 };
      initial[q.category].total += 1;
    });
    setThemeStats(initial);
  };

  const handleAnswer = (answer: number) => {
    // Si ya respondió, evitar clics adicionales mientras se muestra el feedback
    if (selectedAnswer !== null) return;

    const q = questions[currentQuestion];
    const validation = validateAnswer(answer, q.correctAnswer);

    setSelectedAnswer(answer);
    setIsAnswerCorrect(validation.isCorrect);

    const nextCorrect = correctAnswers + (validation.isCorrect ? 1 : 0);
    const nextThemeStats = { ...themeStats };
    const theme = nextThemeStats[q.category] || { correct: 0, total: 0 };
    nextThemeStats[q.category] = {
      ...theme,
      correct: theme.correct + (validation.isCorrect ? 1 : 0),
    };

    setThemeStats(nextThemeStats);
    setCorrectAnswers(nextCorrect);

    // TEMPORIZADOR DE RETROALIMENTACIÓN DE 5 SEGUNDOS (5000 ms)
    // Permite al alumno observar el feedback verde/rojo y explicación durante 5 segundos
    const FEEDBACK_DURATION_MS = 5000;
    clearFeedbackTimers();
    setFeedbackSecondsLeft(5);
    pendingSnapshotRef.current = { nextCorrect, nextStats: nextThemeStats };

    countdownIntervalRef.current = setInterval(() => {
      setFeedbackSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    transitionTimerRef.current = setTimeout(() => {
      goToNextQuestion(nextCorrect, nextThemeStats);
    }, FEEDBACK_DURATION_MS);
  };

  const goToNextQuestion = (
    currentCorrectCount: number,
    currentThemeStats: Record<string, { correct: number; total: number }>
  ) => {
    clearFeedbackTimers();
    setFeedbackSecondsLeft(5);
    pendingSnapshotRef.current = null;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else {
      setFinalCorrect(currentCorrectCount);
      setFinalThemeStats(currentThemeStats);
      setShowResult(true);
    }
  };

  const buildUnlocks = (
    score: number,
    stats: Record<string, { correct: number; total: number }>
  ): ThemeUnlocks => {
    const unlocks: ThemeUnlocks = {};

    THEMES.forEach((theme) => {
      const themeData = stats[theme];
      if (themeData && themeData.total > 0) {
        const themePct = (themeData.correct / themeData.total) * 100;
        // Regla del 70%: si aprueba con 70% o más en el tema, desbloquea nivel 2
        if (themePct >= PASSING_THRESHOLD) {
          unlocks[theme] = 2;
        } else {
          unlocks[theme] = 1;
        }
      } else {
        unlocks[theme] = 1;
      }
    });

    return unlocks;
  };

  const handleComplete = () => {
    const totalCount = questions.length;
    const percentage = totalCount > 0 ? Math.round((finalCorrect / totalCount) * 100) : 0;
    const unlocks = buildUnlocks(finalCorrect, finalThemeStats);
    // Nivel global asignado a partir del umbral del 70%
    const level = percentage >= PASSING_THRESHOLD ? 2 : 1;

    if (user) {
      saveDiagnosticResult(percentage, finalCorrect, totalCount, unlocks);
    }

    localStorage.setItem("diagnostico_completado", "true");
    onComplete(level, unlocks);
  };

  if (questions.length === 0) return null;

  if (showResult) {
    const totalCount = questions.length;
    const percentage = Math.round((finalCorrect / totalCount) * 100);
    const unlocks = buildUnlocks(finalCorrect, finalThemeStats);

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-xl w-full text-center my-8"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-3 flex items-center justify-center">
            <DracoAvatar
              className="w-full h-full object-contain filter drop-shadow-lg"
              alt="Draco"
              showGlow={true}
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-10 h-10 text-yellow-500 fill-yellow-400" />
            <h2 className="text-3xl sm:text-4xl font-black text-gray-800">
              ¡Prueba Diagnóstica Lista!
            </h2>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-4 mb-4">
            <p className="text-3xl font-black text-indigo-700">
              {percentage}% de Aciertos
            </p>
            <p className="text-sm font-bold text-gray-600 mt-1">
              ({finalCorrect} de {totalCount} preguntas correctas)
            </p>
          </div>

          <p className="text-gray-700 font-semibold text-sm sm:text-base mb-4 leading-relaxed">
            Hemos evaluado tus conocimientos en los 7 temas matemáticos.
            <br />
            <span className="font-bold text-indigo-600">
              ¡Recuerda que con 70% o más de aciertos en cada nivel desbloqueas el siguiente!
            </span>
          </p>

          {/* Resumen por tema */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left mb-6 max-h-56 overflow-y-auto p-1">
            {THEMES.map((theme) => {
              const themeData = finalThemeStats[theme] || { correct: 0, total: 2 };
              const themePct = Math.round((themeData.correct / themeData.total) * 100);
              const unlockedLevel = unlocks[theme] || 1;
              const passed = themePct >= PASSING_THRESHOLD;

              return (
                <div
                  key={theme}
                  className={`rounded-xl p-3 border-2 transition ${
                    passed
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-indigo-50 border-indigo-200 text-indigo-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black capitalize">{theme}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80">
                      {themeData.correct}/{themeData.total} ({themePct}%)
                    </span>
                  </div>
                  <p className="text-xs font-semibold mt-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Nivel inicial:{" "}
                    <strong className="font-black">Nivel {unlockedLevel}</strong>
                  </p>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleComplete}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-black text-xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-6 h-6" /> ¡Comenzar mi Aventura! <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const progressPercent = Math.round(((currentQuestion + 1) / questions.length) * 100);

  // Determinación de clases de retroalimentación visual para el contenedor de la pregunta
  const feedbackClass =
    isAnswerCorrect === null
      ? "bg-white border-2 border-indigo-100"
      : isAnswerCorrect
      ? "correcto bg-emerald-500 border-4 border-emerald-600 text-white shadow-2xl ring-4 ring-emerald-300/50"
      : "incorrecto bg-red-500 border-4 border-red-600 text-white shadow-2xl ring-4 ring-red-300/50";

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-400 z-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4 py-6 sm:py-8">
        {/* Cabecera con Draco y Progreso */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0"
            >
              <DracoAvatar
                className="w-full h-full object-contain filter drop-shadow"
                alt="Draco"
              />
            </motion.div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white drop-shadow">
                Prueba Diagnóstica
              </h1>
              <p className="text-white/90 font-bold text-sm">
                Pregunta {currentQuestion + 1} de {questions.length} • {q.categoryLabel}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBoard((v) => !v)}
            className="bg-white/95 hover:bg-white text-indigo-900 px-3.5 sm:px-4 py-2 min-h-[44px] rounded-xl font-black flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
            title="Abrir Tablero para operaciones"
          >
            <Pencil className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-xs sm:text-sm">Tablero</span>
          </button>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-white/30 rounded-full h-3 mb-6 overflow-hidden">
          <motion.div
            className="bg-yellow-400 h-full rounded-full transition-all duration-300"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* CONTENEDOR / CUADRO DE LA PREGUNTA
            CRÍTICO: Cambia de color inmediatamente.
            VERDE (.correcto) si es acertada, ROJO (.incorrecto) si es fallida. */}
        <motion.div
          key={q.id}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`cuadro-pregunta rounded-3xl p-6 sm:p-8 mb-4 transition-all duration-300 ${feedbackClass}`}
        >
          {/* Etiquetas de Categoría y Tipo de Ejercicio */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                isAnswerCorrect === null
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-white/30 text-white"
              }`}
            >
              {q.categoryLabel}
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                isAnswerCorrect === null
                  ? "bg-purple-100 text-purple-800"
                  : "bg-white/20 text-white"
              }`}
            >
              {q.typeLabel}
            </span>
          </div>

          {/* Enunciado de la Pregunta */}
          <p
            className={`text-xl sm:text-2xl font-black mb-6 leading-relaxed ${
              isAnswerCorrect === null ? "text-gray-800" : "text-white"
            }`}
          >
            {q.question}
          </p>

          {/* Opciones de respuesta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {q.options.map((opt) => {
              const isSelected = selectedAnswer === opt;
              const isThisCorrect = opt === q.correctAnswer;

              let buttonStyles = "bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100";

              if (selectedAnswer !== null) {
                if (isSelected) {
                  buttonStyles = isThisCorrect
                    ? "bg-emerald-600 text-white border-emerald-800 scale-102 shadow-xl ring-4 ring-white"
                    : "bg-red-600 text-white border-red-800 scale-102 shadow-xl ring-4 ring-white";
                } else if (isThisCorrect) {
                  // Destacar la correcta si el usuario erró
                  buttonStyles = "bg-emerald-600/90 text-white border-emerald-800 ring-2 ring-white";
                } else {
                  buttonStyles = "opacity-50 bg-white/30 text-white border-transparent";
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswer(opt)}
                  className={`py-4 px-6 min-h-[52px] rounded-2xl font-black text-xl border-b-4 transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${buttonStyles}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* FEEDBACK TEMPORIZADO DE 5 SEGUNDOS (5000 ms) */}
          <AnimatePresence>
            {isAnswerCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 sm:p-5 rounded-2xl bg-white/20 text-white border-2 border-white/40 shadow-lg flex flex-col gap-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    {isAnswerCorrect ? (
                      <CheckCircle className="w-8 h-8 text-white fill-emerald-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-8 h-8 text-white fill-red-600 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-lg font-black text-white">
                        {isAnswerCorrect
                          ? "¡Correcto! ¡Excelente trabajo!"
                          : `¡Incorrecto! La respuesta correcta era: ${q.correctAnswer}`}
                      </p>
                      <p className="text-xs sm:text-sm text-white/95 font-medium mt-0.5">
                        {q.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Contador regresivo de 5 segundos + avance voluntario */}
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="inline-flex items-center gap-1.5 bg-black/20 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-black border border-white/30 shadow-inner">
                      <Timer className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} />
                      <span>Siguiente en {feedbackSecondsLeft}s</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (pendingSnapshotRef.current) {
                          goToNextQuestion(
                            pendingSnapshotRef.current.nextCorrect,
                            pendingSnapshotRef.current.nextStats
                          );
                        } else {
                          goToNextQuestion(correctAnswers, themeStats);
                        }
                      }}
                      className="bg-white text-indigo-900 px-3.5 py-1.5 rounded-full font-black text-xs sm:text-sm flex items-center gap-1 shadow hover:bg-white/90 active:scale-95 transition cursor-pointer min-h-[36px]"
                      title="Avanzar de inmediato"
                    >
                      <span>Avanzar</span>
                      <FastForward className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Barra de progreso visual que drena en 5 segundos */}
                <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    key={q.id}
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className={`h-full ${isAnswerCorrect ? "bg-emerald-400" : "bg-red-400"}`}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {showBoard && (
          <div className="mt-4">
            <DrawingBoard height={450} />
          </div>
        )}
      </div>
    </div>
  );
}
