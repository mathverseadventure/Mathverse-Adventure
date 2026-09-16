import { motion } from 'motion/react';
import { X, TrendingUp, Calendar, Target, Award, BarChart3, Lightbulb, Check } from 'lucide-react';
import { useUser } from '../utils/userContext';

interface StatsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Stats({ isOpen, onClose }: StatsProps) {
  const { user, userProgress } = useUser();

  if (!isOpen || !user) return null;

  const categories = ['suma', 'resta', 'multiplicacion', 'division', 'potencias', 'radicacion', 'polinomios'];
  const categoryNames: Record<string, string> = {
    suma: 'Suma',
    resta: 'Resta',
    multiplicacion: 'Multiplicación',
    division: 'División',
    potencias: 'Potencias',
    radicacion: 'Radicación',
    polinomios: 'Polinomios',
  };

  const stats = categories.map(cat => {
    const categoryProgress = userProgress[cat] || {};
    const lessons = Object.values(categoryProgress);
    const completed = lessons.filter(l => l.completed).length;
    const totalAttempts = lessons.reduce((sum, l) => sum + l.attempts, 0);
    const totalErrors = lessons.reduce((sum, l) => sum + l.errors, 0);
    const accuracy = totalAttempts > 0 ? ((totalAttempts - totalErrors) / totalAttempts) * 100 : 0;

    return {
      category: cat,
      name: categoryNames[cat],
      completed,
      accuracy: Math.round(accuracy),
      totalAttempts,
    };
  });

  const totalCompleted = stats.reduce((sum, s) => sum + s.completed, 0);
  const avgAccuracy = Math.round(stats.reduce((sum, s) => sum + s.accuracy, 0) / stats.length) || 0;

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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Estadísticas</h2>
              <p className="text-white/90 font-semibold">Panel de progreso de {user.name}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl border-2 border-blue-300">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-black text-gray-800">Lecciones</h3>
              </div>
              <p className="text-4xl font-black text-blue-600">{totalCompleted}</p>
              <p className="text-sm font-semibold text-gray-600">Completadas</p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl border-2 border-purple-300">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-8 h-8 text-purple-600" />
                <h3 className="text-lg font-black text-gray-800">Precisión</h3>
              </div>
              <p className="text-4xl font-black text-purple-600">{avgAccuracy}%</p>
              <p className="text-sm font-semibold text-gray-600">Promedio</p>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-2xl border-2 border-orange-300">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-8 h-8 text-orange-600" />
                <h3 className="text-lg font-black text-gray-800">Racha</h3>
              </div>
              <p className="text-4xl font-black text-orange-600">{user.streakDays}</p>
              <p className="text-sm font-semibold text-gray-600">Días consecutivos</p>
            </div>
          </div>

          {/* Category Progress */}
          <div>
            <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Progreso por Categoría
            </h3>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 p-4 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-800">{stat.name}</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-gray-600">
                        {stat.completed} lecciones
                      </span>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        stat.accuracy >= 80 
                          ? 'bg-green-200 text-green-800'
                          : stat.accuracy >= 60
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {stat.accuracy}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.accuracy}%` }}
                      transition={{ duration: 0.8, delay: index * 0.05 }}
                      className={`h-full rounded-full ${
                        stat.accuracy >= 80
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : stat.accuracy >= 60
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                          : 'bg-gradient-to-r from-red-400 to-pink-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Info for Parents */}
          <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-300">
            <h3 className="text-xl font-black text-blue-800 mb-3 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Información para Padres
            </h3>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Total de MetaPoints: <strong className="text-blue-600">{user.metaPoints}</strong></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Días de práctica consecutivos: <strong className="text-blue-600">{user.streakDays}</strong></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Corazones disponibles: <strong className="text-blue-600">{user.hearts}/5</strong></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Precisión promedio: <strong className="text-blue-600">{avgAccuracy}%</strong></li>
              <li className="text-sm text-gray-600 mt-4 pt-4 border-t border-blue-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                Los corazones limitan el tiempo de práctica para evitar el exceso de uso de pantallas.
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
