import { motion } from 'motion/react';
import {
  X,
  Trophy,
  Crown,
  Zap,
  Star,
  Target,
  Flame,
  Award,
  CheckCircle,
  BookOpen,
  GraduationCap,
  Map,
  Dumbbell,
  Coins,
  Gem,
  Smile,
  Briefcase,
  Sparkles,
  Plus,
  Minus,
  X as Multiply,
  Divide,
  Shirt,
  Users,
  HandHelping,
  Sunrise,
  Moon,
  Swords,
  type LucideIcon,
} from 'lucide-react';
import { useUser } from '../utils/userContext';

interface BadgesSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  requirement: string;
  metaPointsReward: number;
  category: 'lessons' | 'streak' | 'points' | 'mastery' | 'special';
  unlocked?: boolean;
}

const allBadges: Badge[] = [
  // Lessons Badges
  { id: 'first_lesson', name: 'Primer Paso', description: 'Completa tu primera lección', icon: Target, iconColor: 'text-blue-500', requirement: '1 lección', metaPointsReward: 50, category: 'lessons' },
  { id: 'five_lessons', name: 'Aprendiz', description: 'Completa 5 lecciones', icon: BookOpen, iconColor: 'text-indigo-500', requirement: '5 lecciones', metaPointsReward: 100, category: 'lessons' },
  { id: 'ten_lessons', name: 'Estudiante Dedicado', description: 'Completa 10 lecciones', icon: GraduationCap, iconColor: 'text-purple-500', requirement: '10 lecciones', metaPointsReward: 200, category: 'lessons' },
  { id: 'twenty_lessons', name: 'Explorador Matemático', description: 'Completa 20 lecciones', icon: Map, iconColor: 'text-teal-500', requirement: '20 lecciones', metaPointsReward: 400, category: 'lessons' },
  { id: 'all_lessons', name: 'Maestro Completo', description: 'Completa todas las lecciones', icon: Crown, iconColor: 'text-yellow-500', requirement: '35 lecciones', metaPointsReward: 1000, category: 'lessons' },

  // Streak Badges
  { id: 'streak_3', name: 'Constante', description: 'Mantén una racha de 3 días', icon: Flame, iconColor: 'text-orange-500', requirement: '3 días', metaPointsReward: 75, category: 'streak' },
  { id: 'streak_7', name: 'Semana Perfecta', description: 'Mantén una racha de 7 días', icon: Star, iconColor: 'text-yellow-500', requirement: '7 días', metaPointsReward: 150, category: 'streak' },
  { id: 'streak_15', name: 'Incansable', description: 'Mantén una racha de 15 días', icon: Dumbbell, iconColor: 'text-red-500', requirement: '15 días', metaPointsReward: 300, category: 'streak' },
  { id: 'streak_30', name: 'Leyenda del Fuego', description: 'Mantén una racha de 30 días', icon: Sparkles, iconColor: 'text-orange-600', requirement: '30 días', metaPointsReward: 500, category: 'streak' },
  { id: 'streak_100', name: 'Fenómeno Imparable', description: 'Mantén una racha de 100 días', icon: Trophy, iconColor: 'text-amber-500', requirement: '100 días', metaPointsReward: 2000, category: 'streak' },

  // Points Badges
  { id: 'points_100', name: 'Coleccionista', description: 'Acumula 100 MetaPoints', icon: Coins, iconColor: 'text-yellow-600', requirement: '100 MP', metaPointsReward: 50, category: 'points' },
  { id: 'points_500', name: 'Acumulador', description: 'Acumula 500 MetaPoints', icon: Gem, iconColor: 'text-cyan-500', requirement: '500 MP', metaPointsReward: 100, category: 'points' },
  { id: 'points_1000', name: 'Millonario Junior', description: 'Acumula 1000 MetaPoints', icon: Smile, iconColor: 'text-green-500', requirement: '1000 MP', metaPointsReward: 250, category: 'points' },
  { id: 'points_5000', name: 'Magnate Matemático', description: 'Acumula 5000 MetaPoints', icon: Briefcase, iconColor: 'text-slate-600', requirement: '5000 MP', metaPointsReward: 500, category: 'points' },

  // Mastery Badges
  { id: 'perfect_lesson', name: 'Perfeccionista', description: 'Completa una lección sin errores', icon: Sparkles, iconColor: 'text-pink-500', requirement: '0 errores', metaPointsReward: 100, category: 'mastery' },
  { id: 'perfect_category', name: 'Maestro de Categoría', description: 'Completa todas las lecciones de una categoría con 3 estrellas', icon: Star, iconColor: 'text-yellow-500', requirement: 'Categoría perfecta', metaPointsReward: 300, category: 'mastery' },
  { id: 'speed_demon', name: 'Rayo Matemático', description: 'Responde 10 preguntas correctas en menos de 1 minuto', icon: Zap, iconColor: 'text-purple-500', requirement: '10 preguntas rápidas', metaPointsReward: 200, category: 'mastery' },
  { id: 'combo_master', name: 'Combo Maestro', description: 'Responde 15 preguntas correctas seguidas', icon: Target, iconColor: 'text-red-500', requirement: '15 combo', metaPointsReward: 350, category: 'mastery' },

  // Special Badges
  { id: 'suma_king', name: 'Rey de la Suma', description: 'Domina todas las lecciones de suma', icon: Plus, iconColor: 'text-green-500', requirement: 'Suma completa', metaPointsReward: 250, category: 'special' },
  { id: 'resta_king', name: 'Rey de la Resta', description: 'Domina todas las lecciones de resta', icon: Minus, iconColor: 'text-blue-500', requirement: 'Resta completa', metaPointsReward: 250, category: 'special' },
  { id: 'multi_king', name: 'Rey de la Multiplicación', description: 'Domina todas las lecciones de multiplicación', icon: Multiply, iconColor: 'text-orange-500', requirement: 'Multiplicación completa', metaPointsReward: 250, category: 'special' },
  { id: 'division_king', name: 'Rey de la División', description: 'Domina todas las lecciones de división', icon: Divide, iconColor: 'text-pink-500', requirement: 'División completa', metaPointsReward: 250, category: 'special' },
  { id: 'math_king', name: 'REY DE LAS MATEMÁTICAS', description: '¡Has dominado TODAS las operaciones!', icon: Crown, iconColor: 'text-yellow-500', requirement: 'Todo completo', metaPointsReward: 2000, category: 'special' },
  { id: 'draco_friend', name: 'Amigo de Draco', description: 'Usa el chat con Draco 10 veces', icon: Flame, iconColor: 'text-red-500', requirement: '10 conversaciones', metaPointsReward: 150, category: 'special' },
  { id: 'shopping_expert', name: 'Fashionista Matemático', description: 'Desbloquea 5 outfits para Draco', icon: Shirt, iconColor: 'text-violet-500', requirement: '5 outfits', metaPointsReward: 200, category: 'special' },
  { id: 'social_butterfly', name: 'Mariposa Social', description: 'Únete a una clase', icon: Users, iconColor: 'text-sky-500', requirement: 'Unirse a clase', metaPointsReward: 100, category: 'special' },
  { id: 'top_student', name: 'Estudiante Estrella', description: 'Llega al Top 3 de tu clase', icon: Star, iconColor: 'text-amber-500', requirement: 'Top 3', metaPointsReward: 300, category: 'special' },
  { id: 'helper', name: 'Ayudante', description: 'Ayuda a otro estudiante', icon: HandHelping, iconColor: 'text-emerald-500', requirement: 'Ayudar', metaPointsReward: 150, category: 'special' },
  { id: 'early_bird', name: 'Madrugador', description: 'Practica antes de las 8 AM', icon: Sunrise, iconColor: 'text-orange-400', requirement: 'Práctica temprana', metaPointsReward: 100, category: 'special' },
  { id: 'night_owl', name: 'Búho Nocturno', description: 'Practica después de las 8 PM', icon: Moon, iconColor: 'text-indigo-600', requirement: 'Práctica nocturna', metaPointsReward: 100, category: 'special' },
  { id: 'weekend_warrior', name: 'Guerrero de Fin de Semana', description: 'Practica en sábado y domingo', icon: Swords, iconColor: 'text-slate-700', requirement: 'Fin de semana', metaPointsReward: 150, category: 'special' },
];

export function BadgesSystem({ isOpen, onClose }: BadgesSystemProps) {
  const { user, userProgress, updateMetaPoints } = useUser();

  if (!isOpen || !user) return null;

  const checkBadgeUnlocked = (badge: Badge): boolean => {
    const unlockedBadges = JSON.parse(localStorage.getItem(`mathverse_badges_${user.id}`) || '[]');
    return unlockedBadges.includes(badge.id);
  };

  const calculateProgress = (badge: Badge): number => {
    const completedLessons = Object.values(userProgress).reduce((acc, category) => {
      return acc + Object.values(category).filter(l => l.completed).length;
    }, 0);

    switch (badge.id) {
      case 'first_lesson': return completedLessons >= 1 ? 100 : 0;
      case 'five_lessons': return Math.min((completedLessons / 5) * 100, 100);
      case 'ten_lessons': return Math.min((completedLessons / 10) * 100, 100);
      case 'twenty_lessons': return Math.min((completedLessons / 20) * 100, 100);
      case 'all_lessons': return Math.min((completedLessons / 35) * 100, 100);
      
      case 'streak_3': return Math.min((user.streakDays / 3) * 100, 100);
      case 'streak_7': return Math.min((user.streakDays / 7) * 100, 100);
      case 'streak_15': return Math.min((user.streakDays / 15) * 100, 100);
      case 'streak_30': return Math.min((user.streakDays / 30) * 100, 100);
      case 'streak_100': return Math.min((user.streakDays / 100) * 100, 100);
      
      case 'points_100': return Math.min((user.metaPoints / 100) * 100, 100);
      case 'points_500': return Math.min((user.metaPoints / 500) * 100, 100);
      case 'points_1000': return Math.min((user.metaPoints / 1000) * 100, 100);
      case 'points_5000': return Math.min((user.metaPoints / 5000) * 100, 100);
      
      case 'social_butterfly': return user.classCode ? 100 : 0;
      case 'shopping_expert': return Math.min((user.dracoOutfits.length / 5) * 100, 100);
      
      default: return 0;
    }
  };

  const claimBadge = (badge: Badge) => {
    const progress = calculateProgress(badge);
    if (progress === 100 && !checkBadgeUnlocked(badge)) {
      const unlockedBadges = JSON.parse(localStorage.getItem(`mathverse_badges_${user.id}`) || '[]');
      unlockedBadges.push(badge.id);
      localStorage.setItem(`mathverse_badges_${user.id}`, JSON.stringify(unlockedBadges));
      
      updateMetaPoints(badge.metaPointsReward);
      
      alert(`¡Felicidades! Has desbloqueado la insignia "${badge.name}" y ganado ${badge.metaPointsReward} MetaPoints!`);
      window.location.reload();
    }
  };

  const categorizedBadges = {
    lessons: allBadges.filter(b => b.category === 'lessons'),
    streak: allBadges.filter(b => b.category === 'streak'),
    points: allBadges.filter(b => b.category === 'points'),
    mastery: allBadges.filter(b => b.category === 'mastery'),
    special: allBadges.filter(b => b.category === 'special'),
  };

  const totalUnlocked = allBadges.filter(b => checkBadgeUnlocked(b)).length;

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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Logros e Insignias</h2>
              <p className="text-white/90 font-semibold">
                {totalUnlocked} de {allBadges.length} desbloqueadas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {Object.entries(categorizedBadges).map(([category, badges]) => (
            <div key={category} className="mb-8">
              <h3 className="text-2xl font-black text-gray-800 mb-4 capitalize flex items-center gap-2">
                {category === 'lessons' && <Star className="w-6 h-6 text-blue-500" />}
                {category === 'streak' && <Flame className="w-6 h-6 text-orange-500" />}
                {category === 'points' && <Target className="w-6 h-6 text-yellow-500" />}
                {category === 'mastery' && <Zap className="w-6 h-6 text-purple-500" />}
                {category === 'special' && <Crown className="w-6 h-6 text-pink-500" />}
                {category === 'lessons' ? 'Lecciones' :
                 category === 'streak' ? 'Rachas' :
                 category === 'points' ? 'MetaPoints' :
                 category === 'mastery' ? 'Maestría' :
                 'Especiales'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => {
                  const isUnlocked = checkBadgeUnlocked(badge);
                  const progress = calculateProgress(badge);
                  const canClaim = progress === 100 && !isUnlocked;
                  const BadgeIcon = badge.icon;

                  return (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-2xl border-4 transition-all ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-400'
                          : canClaim
                          ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-400 shadow-lg'
                          : 'bg-gray-100 border-gray-300 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-14 h-14 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center">
                          <BadgeIcon className={`w-8 h-8 ${badge.iconColor}`} />
                        </div>
                        {isUnlocked && (
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        )}
                      </div>

                      <h4 className="text-xl font-black text-gray-800 mb-2">{badge.name}</h4>
                      <p className="text-sm text-gray-600 font-semibold mb-3">{badge.description}</p>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-600 mb-1">
                          <span>{badge.requirement}</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={`h-full rounded-full ${
                              isUnlocked ? 'bg-yellow-500' : 
                              canClaim ? 'bg-green-500' : 'bg-purple-500'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-yellow-200 px-3 py-1 rounded-full">
                          <Award className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-black text-yellow-700">
                            +{badge.metaPointsReward} MP
                          </span>
                        </div>

                        {canClaim && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => claimBadge(badge)}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm"
                          >
                            ¡Reclamar!
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
