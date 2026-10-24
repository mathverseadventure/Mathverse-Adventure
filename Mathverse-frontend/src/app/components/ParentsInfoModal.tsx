import { motion } from 'motion/react';
import {
  X,
  Users,
  Printer,
  Calendar,
  Clock,
  Target,
  Award,
  BookOpen,
  Lightbulb,
  Heart,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Minus,
  Divide,
  Zap,
  Calculator,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useUser } from '../utils/userContext';

interface ParentsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ParentsInfoModal({ isOpen, onClose }: ParentsInfoModalProps) {
  const { user, userProgress } = useUser();

  if (!isOpen || !user) return null;

  const categories = [
    {
      id: 'suma',
      name: 'Suma',
      icon: Plus,
      color: 'text-emerald-600 bg-emerald-100',
      advice: 'Refuerce sumas mentales sumando el valor de artículos en las compras del supermercado o contando colecciones en casa.',
    },
    {
      id: 'resta',
      name: 'Resta',
      icon: Minus,
      color: 'text-blue-600 bg-blue-100',
      advice: 'Practique cálculo de vueltos y diferencias cotidianas (por ejemplo: "¿Cuántos kilómetros nos faltan para llegar?").',
    },
    {
      id: 'multiplicacion',
      name: 'Multiplicación',
      icon: X,
      color: 'text-purple-600 bg-purple-100',
      advice: 'Juegue a buscar patrones en filas y columnas (por ejemplo en bandejas de huevos o ventanas de edificios). Repase tablas con rimas.',
    },
    {
      id: 'division',
      name: 'División',
      icon: Divide,
      color: 'text-orange-600 bg-orange-100',
      advice: 'Promueva situaciones de repartición justa de meriendas, cartas de juego o piezas entre los miembros de la familia.',
    },
    {
      id: 'potencias',
      name: 'Potencias',
      icon: Zap,
      color: 'text-amber-600 bg-amber-100',
      advice: 'Muestre el crecimiento exponencial visual doblando una hoja de papel a la mitad repetidamente (2, 4, 8, 16 partes).',
    },
    {
      id: 'radicacion',
      name: 'Radicación',
      icon: Calculator,
      color: 'text-cyan-600 bg-cyan-100',
      advice: 'Asocie la raíz cuadrada con el lado de un piso cuadrado formado con fichas o baldosas (si tiene 9 fichas, el lado mide 3).',
    },
    {
      id: 'polinomios',
      name: 'Polinomios',
      icon: Layers,
      color: 'text-pink-600 bg-pink-100',
      advice: 'Explique las expresiones como recetas culinarias: se deben seguir operaciones paso a paso respetando la jerarquía.',
    },
  ];

  const TOTAL_LEVELS_PER_CAT = 5;
  const TOTAL_COURSE_LEVELS = categories.length * TOTAL_LEVELS_PER_CAT; // 35 lecciones

  // Desglose de métricas por categoría
  const moduleBreakdown = categories.map((cat) => {
    const catProgress = userProgress[cat.id] || {};
    const lessons = Object.values(catProgress);
    const completedCount = lessons.filter((l) => l.completed).length;

    // Progreso estricto de 0% a 100%
    const progressPercent = Math.min(
      100,
      Math.max(0, Math.round((completedCount / TOTAL_LEVELS_PER_CAT) * 100))
    );

    const attemptedLessons = lessons.filter((l) => (l.attempts || 0) > 0);
    const accuracy =
      attemptedLessons.length > 0
        ? Math.min(
            100,
            Math.max(
              0,
              Math.round(
                attemptedLessons.reduce(
                  (sum, l) =>
                    sum + (l.accuracy ?? (l.stars >= 2 ? 80 : l.stars >= 1 ? 70 : 50)),
                  0
                ) / attemptedLessons.length
              )
            )
          )
        : 0;

    let statusLabel = 'No iniciado';
    let statusClass = 'bg-gray-100 text-gray-700';

    if (progressPercent === 100) {
      statusLabel = 'Módulo Dominado';
      statusClass = 'bg-emerald-100 text-emerald-800 font-black';
    } else if (progressPercent >= 40) {
      statusLabel = 'Buen Avance';
      statusClass = 'bg-blue-100 text-blue-800 font-bold';
    } else if (progressPercent > 0) {
      statusLabel = 'En Desarrollo Inicial';
      statusClass = 'bg-amber-100 text-amber-800 font-bold';
    }

    return {
      ...cat,
      completedCount,
      totalLevels: TOTAL_LEVELS_PER_CAT,
      progressPercent,
      accuracy,
      statusLabel,
      statusClass,
    };
  });

  const totalCompletedLessons = moduleBreakdown.reduce(
    (sum, m) => sum + m.completedCount,
    0
  );
  const totalGlobalProgress = Math.min(
    100,
    Math.max(0, Math.round((totalCompletedLessons / TOTAL_COURSE_LEVELS) * 100))
  );

  const activeModules = moduleBreakdown.filter(
    (m) => m.completedCount > 0 || m.accuracy > 0
  );
  const globalAccuracy =
    activeModules.length > 0
      ? Math.round(
          activeModules.reduce((sum, m) => sum + m.accuracy, 0) /
            activeModules.length
        )
      : 0;

  // Estimación pedagógica del tiempo de práctica
  const estimatedHours = Math.max(
    0.5,
    Number((totalCompletedLessons * 0.25 + user.streakDays * 0.2).toFixed(1))
  );

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 z-50 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto border-4 border-indigo-200 print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none"
      >
        {/* Cabecera del Portal para Padres */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-6 sm:p-8 rounded-t-2xl text-white relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:bg-none print:text-black print:border-b-2 print:border-gray-800 print:p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-2 print:hidden">
              <Users className="w-9 h-9 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-indigo-100 print:text-gray-700">
                  Informe Académico para el Hogar
                </span>
                <span className="text-xs text-indigo-200 font-semibold print:text-gray-600">
                  {currentDate}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 drop-shadow print:text-black">
                Información para Padres y Tutores
              </h2>
              <p className="text-indigo-100 font-semibold text-xs sm:text-sm print:text-gray-700">
                Estudiante: <strong className="text-white print:text-black">{user.name}</strong> • Grado 5° Primaria
              </p>
            </div>
          </div>

          {/* Botones de Acción (Imprimir / Cerrar) */}
          <div className="flex items-center gap-2 print:hidden self-end sm:self-center">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
              title="Imprimir reporte en PDF o papel"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-11 h-11 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center text-white transition-colors"
              title="Cerrar panel"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenido Imprimible */}
        <div className="p-6 sm:p-8 space-y-8 bg-slate-50/50 print:bg-white print:p-4 print:space-y-6">
          {/* 1. Resumen General del Estudiante */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-600" />
              1. Resumen General del Aprendizaje
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border-2 border-indigo-100 shadow-sm print:border-gray-300">
                <span className="text-xs font-bold text-gray-500 uppercase">Avance Total</span>
                <p className="text-3xl font-black text-indigo-600 mt-1">{totalGlobalProgress}%</p>
                <p className="text-[11px] font-semibold text-gray-600 mt-0.5">
                  {totalCompletedLessons} de {TOTAL_COURSE_LEVELS} lecciones
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-blue-100 shadow-sm print:border-gray-300">
                <span className="text-xs font-bold text-gray-500 uppercase">Precisión Global</span>
                <p className="text-3xl font-black text-blue-600 mt-1">{globalAccuracy}%</p>
                <p className="text-[11px] font-semibold text-gray-600 mt-0.5">
                  Aciertos en problemas
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-amber-100 shadow-sm print:border-gray-300">
                <span className="text-xs font-bold text-gray-500 uppercase">Constancia</span>
                <p className="text-3xl font-black text-amber-600 mt-1">{user.streakDays} días</p>
                <p className="text-[11px] font-semibold text-gray-600 mt-0.5">
                  Racha activa de estudio
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-emerald-100 shadow-sm print:border-gray-300">
                <span className="text-xs font-bold text-gray-500 uppercase">Tiempo Estimado</span>
                <p className="text-3xl font-black text-emerald-600 mt-1">~{estimatedHours}h</p>
                <p className="text-[11px] font-semibold text-gray-600 mt-0.5">
                  Tiempo total dedicado
                </p>
              </div>
            </div>
          </div>

          {/* 2. Control de Bienestar y Salud Digital */}
          <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 p-6 rounded-3xl border-2 border-rose-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-lg font-black text-gray-800">
                    Bienestar Digital y Autorregulación
                  </h4>
                  <span className="text-xs font-black bg-rose-200 text-rose-800 px-3 py-1 rounded-full">
                    {user.hearts} / 20 Vidas Disponibles Hoy
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 mt-1 font-medium leading-relaxed">
                  MathVerse Adventure implementa un sistema diario de 20 vidas para prevenir la sobreexposición a pantallas. Cuando las vidas se agotan o el estudiante necesita descansar, el personaje Draco recomienda una pausa activa para retomar al día siguiente con energía renovada.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Desglose Detallado por Módulos Temáticos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl sm:text-2xl font-black text-gray-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                2. Desempeño por Asignatura y Consejos Específicos
              </h3>
              <span className="text-xs font-bold text-gray-500 uppercase">
                Requisito de Aprobación: 70%
              </span>
            </div>

            <div className="space-y-4">
              {moduleBreakdown.map((m) => {
                const IconComponent = m.icon;
                return (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl p-5 border-2 border-gray-200 shadow-sm hover:border-indigo-300 transition-colors print:border-gray-300"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center ${m.color}`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-gray-800">{m.name}</h4>
                          <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${m.statusClass}`}>
                            {m.statusLabel}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right leading-tight">
                          <span className="text-xs font-bold text-gray-500">
                            {m.completedCount} de {m.totalLevels} lecciones
                          </span>
                          <p className="text-base font-black text-gray-800">
                            {m.progressPercent}% completado
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progreso */}
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-3 border border-gray-200">
                      <div
                        style={{ width: `${m.progressPercent}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          m.progressPercent === 100
                            ? 'bg-emerald-500'
                            : m.progressPercent >= 50
                            ? 'bg-blue-500'
                            : m.progressPercent > 0
                            ? 'bg-amber-500'
                            : 'bg-transparent'
                        }`}
                      />
                    </div>

                    {/* Consejo Pedagógico para el Hogar */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2 text-xs text-gray-700">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-800">Sugerencia para el hogar: </strong>
                        <span>{m.advice}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Recomendaciones Pedagógicas Generales para el Hogar */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl border-2 border-indigo-200">
            <h3 className="text-lg font-black text-indigo-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              3. Consejos Clave para Apoyar a su Hijo/a en Matemáticas
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Celebre el proceso y el esfuerzo:</strong> Reconozca la perseverancia ante problemas difíciles. Los errores son oportunidades naturales para que el cerebro aprenda.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Sesiones breves pero constantes:</strong> Es más efectivo practicar 15 a 20 minutos 4 días por semana que realizar maratones extensas de fin de semana.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Haga preguntas abiertas:</strong> Ante una duda, pregunte: <em>"¿Qué pistas te da el problema?"</em> o <em>"¿Cómo te lo imaginas con un dibujo?"</em> en lugar de dar la solución de inmediato.
                </span>
              </li>
            </ul>
          </div>

          {/* Pie de Firma para Imprimir */}
          <div className="hidden print:block pt-12 mt-12 border-t-2 border-gray-400">
            <div className="grid grid-cols-2 gap-12 text-center text-xs">
              <div>
                <div className="border-b border-black w-48 mx-auto mb-2" />
                <p className="font-bold">Firma del Padre / Madre / Tutor</p>
                <p className="text-gray-600">Fecha de Revisión</p>
              </div>
              <div>
                <div className="border-b border-black w-48 mx-auto mb-2" />
                <p className="font-bold">MathVerse Adventure</p>
                <p className="text-gray-600">Plataforma de Aprendizaje Gamificado</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ParentsInfoModal;
