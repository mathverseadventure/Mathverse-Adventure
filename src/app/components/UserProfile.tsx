import { motion } from 'motion/react';
import { X, User, School, Mail, LogOut, Coins, Flame, Heart, Trophy, GraduationCap } from 'lucide-react';
import { useUser } from '../utils/userContext';
import dragonCharacter from '../../assets/draco.png';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, logout, userProgress } = useUser();

  if (!isOpen || !user) return null;

  const completedLessons = Object.values(userProgress).reduce((acc, category) => {
    return acc + Object.values(category).filter(lesson => lesson.completed).length;
  }, 0);

  const totalStars = Object.values(userProgress).reduce((acc, category) => {
    return acc + Object.values(category).reduce((sum, lesson) => sum + lesson.stars, 0);
  }, 0);

  const handleLogout = () => {
    logout();
    onClose();
  };

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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-purple-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">{user.name}</h2>
              <p className="text-white/90 font-semibold capitalize flex items-center gap-2">
                {user.type === 'student' ? (
                  <>
                    <GraduationCap className="w-5 h-5" />
                    Estudiante
                  </>
                ) : (
                  <>
                    <School className="w-5 h-5" />
                    Docente
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
              <Mail className="w-6 h-6 text-gray-600" />
              <div>
                <p className="text-sm font-semibold text-gray-600">Correo</p>
                <p className="font-bold text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
              <School className="w-6 h-6 text-gray-600" />
              <div>
                <p className="text-sm font-semibold text-gray-600">Institución</p>
                <p className="font-bold text-gray-800">{user.school}</p>
              </div>
            </div>

            {user.classCode && (
              <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl border-2 border-blue-300">
                <Trophy className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-600">Código de Clase</p>
                  <p className="font-black text-blue-800 text-xl">{user.classCode}</p>
                </div>
              </div>
            )}
          </div>

          {/* Draco Outfit */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl border-2 border-purple-300">
            <h3 className="text-xl font-black text-gray-800 mb-4">Mi Draco</h3>
            <div className="flex items-center gap-4">
              <img src={dragonCharacter} alt="Draco" className="w-24 h-24" />
              <div>
                <p className="text-sm font-semibold text-gray-600">Outfit Actual</p>
                <p className="text-xl font-black text-purple-600">{user.equippedOutfit}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {user.dracoOutfits.length} outfits desbloqueados
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-300 text-center">
              <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-3xl font-black text-yellow-700">{user.metaPoints}</p>
              <p className="text-sm font-semibold text-gray-600">MetaPoints</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-300 text-center">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-3xl font-black text-orange-700">{user.streakDays}</p>
              <p className="text-sm font-semibold text-gray-600">Días de Racha</p>
            </div>

            <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-300 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-3xl font-black text-red-700">{user.hearts}</p>
              <p className="text-sm font-semibold text-gray-600">Corazones</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-300 text-center">
              <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-black text-blue-700">{completedLessons}</p>
              <p className="text-sm font-semibold text-gray-600">Lecciones</p>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-black flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
