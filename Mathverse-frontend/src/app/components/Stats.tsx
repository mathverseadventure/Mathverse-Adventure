import { motion } from 'motion/react';
import { X, TrendingUp, Calendar, Target, Award, BarChart3, CheckCircle2 } from 'lucide-react';
import { useUser } from '../utils/userContext';

interface StatsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Stats({ isOpen, onClose }: StatsProps) {
  const { user, userProgress } = useUser();

  if (!isOpen || !user) return null;

  const categories = [
    'suma',
    'resta',
    'multiplicacion',
    'division',
    'potencias',
    'radicacion',
    'polinomios',
  ];

  const categoryNames: Record<string, string> = {
    suma: 'Suma',
    resta: 'Resta',
    multiplicacion: 'Multiplicación',
    division: 'División',
    potencias: 'Potencias',
    radicacion: 'Radicación',
    polinomios: 'Polinomios',
  };

  // Cada materia cuenta con 5 niveles en MathVerse Adventure
  const TOTAL_LEVELS_PER_CATEGORY = 5;

  /**
   * Cálculo de progreso estricto del 0% al 100%:
   * - 0 lecciones aprobadas = 0%
   * - 1 lección aprobada = 20%
   * - 2 lecciones aprobadas = 40%
   * - 3 lecciones aprobadas = 60%
   * - 4 lecciones aprobadas = 80%
   * - 5 lecciones aprobadas = 100%
   * Garantiza que NUNCA aparezcan valores negativos.
   */
  const stats = categories.map((cat) => {
    const categoryProgress = userProgress[cat] || {};
    const lessons = Object.values(categoryProgress);

    // Solo se consideran aprobadas las lecciones que cumplieron con >= 70%
    const completed = lessons.filter((l) => l.completed).length;

    // Porcentaje de progreso de la materia (0% a 100%)
    const progressPercent = Math.min(
      100,
      Math.max(0, Math.round((completed / TOTAL_LEVELS_PER_CATEGORY) * 100))
    );

    // Precisión promedio en lecciones intentadas (0% a 100%, nunca negativa)
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

    return {
      category: cat,
      name: categoryNames[cat],
      completed,
      totalLevels: TOTAL_LEVELS_PER_CATEGORY,
      progressPercent,
      accuracy,
    };
  });

  const totalCompleted = stats.reduce((sum, s) => sum + s.completed, 0);
  const totalPossibleLessons = categories.length * TOTAL_LEVELS_PER_CATEGORY;
  const overallProgress = Math.min(
    100,
    Math.max(0, Math.round((totalCompleted / totalPossibleLessons) * 100))
  );

  const activeStats = stats.filter((s) => s.completed > 0 || s.accuracy > 0);
  const avgAccuracy =
    activeStats.length > 0
      ? Math.round(activeStats.reduce((sum, s) => sum + s.accuracy, 0) / activeStats.length)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-emerald-300"
      >
        {/* Cabecera del Panel */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 p-6 rounded-t-2xl relative text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            title="Cerrar panel"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
              <BarChart3 className="w-9 h-9 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black drop-shadow">Panel de Estadísticas</h2>
              <p className="text-emerald-100 font-bold text-sm">
                Seguimiento del progreso de {user.name}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Tarjetas Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border-2 border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-gray-800">Lecciones Aprobadas</h3>
              </div>
              <p className="text-4xl font-black text-blue-600">
                {totalCompleted} <span className="text-lg text-gray-400 font-bold">/ {totalPossibleLessons}</span>
              </p>
              <p className="text-xs font-bold text-blue-800 mt-1">
                {overallProgress}% del curso completado
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl border-2 border-purple-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-gray-800">Precisión Global</h3>
              </div>
              <p className="text-4xl font-black text-purple-600">{avgAccuracy}%</p>
              <p className="text-xs font-bold text-purple-800 mt-1">
                Aciertos en lecciones practicadas
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-3xl border-2 border-orange-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-gray-800">Racha de Práctica</h3>
              </div>
              <p className="text-4xl font-black text-orange-600">{user.streakDays}</p>
              <p className="text-xs font-bold text-orange-800 mt-1">Días consecutivos practicando</p>
            </div>
          </div>

          {/* Progreso por Materia (Del 0% al 100%) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                Progreso por Materia
              </h3>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Desbloqueo al 70% de aciertos
              </span>
            </div>

            <div className="space-y-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 p-5 rounded-2xl border-2 border-gray-200/80 hover:border-emerald-300 transition-colors shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-lg font-black text-gray-800">{stat.name}</h4>
                      {stat.progressPercent === 100 && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ¡Completado!
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-gray-600">
                        {stat.completed} de {stat.totalLevels} niveles
                      </span>
                      <span
                        className={`text-sm font-black px-3.5 py-1 rounded-full border shadow-sm ${
                          stat.progressPercent === 100
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : stat.progressPercent >= 60
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : stat.progressPercent > 0
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-gray-200 text-gray-600 border-gray-300'
                        }`}
                      >
                        {stat.progressPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progreso con inicio estricto en 0% */}
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden p-0.5 border border-gray-300">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progressPercent}%` }}
                      transition={{ duration: 0.8, delay: index * 0.05 }}
                      className={`h-full rounded-full transition-all ${
                        stat.progressPercent === 100
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                          : stat.progressPercent >= 60
                          ? 'bg-gradient-to-r from-teal-400 to-emerald-500'
                          : stat.progressPercent > 0
                          ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                          : 'bg-transparent'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Stats;
