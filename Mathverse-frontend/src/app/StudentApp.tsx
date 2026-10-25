import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Heart, Plus, Minus, X, Divide, Zap, Calculator, Coins, Menu, Gamepad2, Lock, Star, Rocket, LogOut, User, Users, BarChart3, Award, Trophy, ShoppingBag, Puzzle, Bot, MessageSquare, Sparkles } from 'lucide-react';
import logo from "@/assets/images/logo_mathverse.png";
import dragonCharacter from "@/assets/images/draco.png";
import { useUser, ThemeUnlocks } from './utils/userContext';
import { isLessonUnlocked as checkLessonUnlocked, PASSING_THRESHOLD } from './utils/progressionService';
import { DiagnosticTest } from './components/DiagnosticTest';
import { LessonIntro } from './components/LessonIntro';
import { ImprovedMathPractice } from './components/ImprovedMathPractice';
import { DracoChatbot } from './components/DracoChatbot';
import { DracoShop } from './components/DracoShop';
import { UserProfile } from './components/UserProfile';
import { Stats } from './components/Stats';
import { ClassManagement } from './components/ClassManagement';
import { BadgesSystem } from './components/BadgesSystem';
import { MathPuzzleGame } from './components/MathPuzzleGame';
import { DracoAvatar } from './components/DracoAvatar';
import { ParentsInfoModal } from './components/ParentsInfoModal';

export function StudentApp() {
  const { user, userProgress, themeUnlocks, logout } = useUser();
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [diagnosticLevel, setDiagnosticLevel] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<{ id: number; title: string; level: number } | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showParentsInfo, setShowParentsInfo] = useState(false);
  const [showClassManagement, setShowClassManagement] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPuzzleGame, setShowPuzzleGame] = useState(false);

  useEffect(() => {
    if (!user) return;
    const diagnostic = localStorage.getItem(`mathverse_diagnostic_${user.id}`);
    if (!diagnostic) {
      setShowDiagnostic(true);
    } else {
      const diagData = JSON.parse(diagnostic);
      setDiagnosticLevel(diagData.level || 1);
    }
  }, [user]);

  const handleDiagnosticComplete = (level: number, _unlocks: ThemeUnlocks) => {
    setDiagnosticLevel(level);
    setShowDiagnostic(false);
  };

  const categories = [
    {
      id: 'suma',
      name: 'Suma',
      icon: Plus,
      color: 'from-green-400 to-emerald-500',
      lessons: [
        { id: 1, title: 'Números 1-10', level: 1 },
        { id: 2, title: 'Suma hasta 20', level: 2 },
        { id: 3, title: 'Suma hasta 50', level: 3 },
        { id: 4, title: 'Suma hasta 100', level: 4 },
        { id: 5, title: 'Suma con centenas', level: 5 },
      ]
    },
    {
      id: 'resta',
      name: 'Resta',
      icon: Minus,
      color: 'from-blue-400 to-cyan-500',
      lessons: [
        { id: 1, title: 'Resta 1-10', level: 1 },
        { id: 2, title: 'Resta hasta 20', level: 2 },
        { id: 3, title: 'Resta hasta 50', level: 3 },
        { id: 4, title: 'Resta hasta 100', level: 4 },
        { id: 5, title: 'Resta prestando', level: 5 },
      ]
    },
    {
      id: 'multiplicacion',
      name: 'Multiplicación',
      icon: X,
      color: 'from-purple-400 to-pink-500',
      lessons: [
        { id: 1, title: 'Tablas del 1-5', level: 1 },
        { id: 2, title: 'Tablas del 6-10', level: 2 },
        { id: 3, title: 'Multiplicación x2 cifras', level: 3 },
        { id: 4, title: 'Multiplicación x3 cifras', level: 4 },
        { id: 5, title: 'Problemas mixtos', level: 5 },
      ]
    },
    {
      id: 'division',
      name: 'División',
      icon: Divide,
      color: 'from-orange-400 to-red-500',
      lessons: [
        { id: 1, title: 'División básica', level: 1 },
        { id: 2, title: 'División exacta', level: 2 },
        { id: 3, title: 'División con residuo', level: 3 },
        { id: 4, title: 'División de 2 cifras', level: 4 },
        { id: 5, title: 'División de 3 cifras', level: 5 },
      ]
    },
    {
      id: 'potencias',
      name: 'Potencias',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      lessons: [
        { id: 1, title: 'Potencias base 2', level: 1 },
        { id: 2, title: 'Potencias base 10', level: 2 },
        { id: 3, title: 'Cuadrados perfectos', level: 3 },
        { id: 4, title: 'Cubos', level: 4 },
        { id: 5, title: 'Propiedades', level: 5 },
      ]
    },
    {
      id: 'radicacion',
      name: 'Radicación',
      icon: Zap,
      color: 'from-pink-400 to-purple-500',
      lessons: [
        { id: 1, title: 'Raíz cuadrada básica', level: 1 },
        { id: 2, title: 'Raíces exactas', level: 2 },
        { id: 3, title: 'Raíz cúbica', level: 3 },
        { id: 4, title: 'Simplificación', level: 4 },
        { id: 5, title: 'Raíces mixtas', level: 5 },
      ]
    },
    {
      id: 'polinomios',
      name: 'Polinomios',
      icon: Calculator,
      color: 'from-teal-400 to-cyan-500',
      lessons: [
        { id: 1, title: 'Monomios', level: 1 },
        { id: 2, title: 'Suma de polinomios', level: 2 },
        { id: 3, title: 'Resta de polinomios', level: 3 },
        { id: 4, title: 'Multiplicación', level: 4 },
        { id: 5, title: 'Factorización', level: 5 },
      ]
    },
  ];

  const isLessonUnlocked = (categoryId: string, lessonLevel: number) => {
    return checkLessonUnlocked(categoryId, lessonLevel, themeUnlocks, userProgress);
  };

  const getLessonData = (categoryId: string, lessonId: number) => {
    return userProgress[categoryId]?.[lessonId] || { completed: false, stars: 0, accuracy: 0 };
  };

  const handleLessonClick = (category: string, lesson: { id: number; title: string; level: number }) => {
    if (!isLessonUnlocked(category, lesson.level)) return;
    
    setSelectedLesson(lesson);
    setSelectedCategory(category);
    setShowIntro(true);
  };

  if (!user) return null;

  if (showDiagnostic) {
    return <DiagnosticTest onComplete={handleDiagnosticComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-300 to-pink-400 overflow-x-hidden">
      {/* Header Responsive */}
      <header className="bg-white/95 backdrop-blur-md border-b-4 border-indigo-400 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 flex-shrink"
            onClick={() => {
              setSelectedCategory(null);
              setIsPracticing(false);
              setSelectedLesson(null);
            }}
          >
            <img src={logo} alt="Mathverse" className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 object-contain flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-4xl font-black tracking-tight leading-tight truncate">
                <span className="text-indigo-600">Mathverse</span>
                <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"> Adventure</span>
              </h1>
            </div>
          </motion.div>

          {/* Stats & Nav Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Racha */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 sm:gap-2 bg-orange-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border-b-2 sm:border-b-4 border-orange-400 min-h-[44px]"
              title="Días de racha consecutivos"
            >
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 fill-orange-500 flex-shrink-0" />
              <span className="font-black text-xs sm:text-base text-orange-600">{user.streakDays}</span>
            </motion.div>

            {/* MetaPoints */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowShop(true)}
              className="flex items-center gap-1 sm:gap-2 bg-yellow-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border-b-2 sm:border-b-4 border-yellow-400 cursor-pointer min-h-[44px]"
              title="MetaPoints disponibles (Clic para abrir tienda)"
            >
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0" />
              <span className="font-black text-xs sm:text-base text-yellow-700">
                {user.metaPoints ?? 0}
              </span>
            </motion.div>

            {/* Vidas / Hearts */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 sm:gap-2 bg-red-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border-b-2 sm:border-b-4 border-red-400 min-h-[44px]"
              title="Vidas restantes"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500 flex-shrink-0" />
              <span className="font-black text-xs sm:text-base text-red-600">{user.hearts}</span>
            </motion.div>

            {/* Botón Logout (44x44px táctil) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="w-10 h-10 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-md cursor-pointer flex-shrink-0"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.button>

            {/* Botón Menú Hamburguesa (44x44px táctil) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md cursor-pointer flex-shrink-0"
              title="Abrir menú de navegación"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Dropdown Menu Responsive */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full right-2 sm:right-4 mt-2 bg-white rounded-3xl shadow-2xl border-4 border-indigo-300 p-2 sm:p-3 w-[calc(100vw-1rem)] sm:w-80 max-w-[340px] max-h-[80vh] overflow-y-auto z-50 space-y-1"
            >
              <button
                onClick={() => { setShowProfile(true); setShowMenu(false); }}
                className="w-full flex items-center gap-3.5 text-left px-4 py-3 min-h-[48px] rounded-xl hover:bg-indigo-50 font-black text-base sm:text-lg text-gray-800 transition-colors cursor-pointer"
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 flex-shrink-0" />
                Mi Perfil
              </button>
              <button
                onClick={() => { setShowStats(true); setShowMenu(false); }}
                className="w-full flex items-center gap-3.5 text-left px-4 py-3 min-h-[48px] rounded-xl hover:bg-indigo-50 font-black text-base sm:text-lg text-gray-800 transition-colors cursor-pointer"
              >
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
                Estadísticas
              </button>
              <button
                onClick={() => { setShowParentsInfo(true); setShowMenu(false); }}
                className="w-full flex items-center gap-3.5 text-left px-4 py-3 min-h-[48px] rounded-xl hover:bg-emerald-50 font-black text-base sm:text-lg text-gray-800 transition-colors cursor-pointer"
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
                Información para Padres
              </button>
              <button
                onClick={() => { setShowBadges(true); setShowMenu(false); }}
                className="w-full flex items-center gap-3.5 text-left px-4 py-3 min-h-[48px] rounded-xl hover:bg-indigo-50 font-black text-base sm:text-lg text-gray-800 transition-colors cursor-pointer"
              >
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 flex-shrink-0" />
                Logros
              </button>
              <button
                onClick={() => { setShowClassManagement(true); setShowMenu(false); }}
                className="w-full flex items-center gap-3.5 text-left px-4 py-3 min-h-[48px] rounded-xl hover:bg-indigo-50 font-black text-base sm:text-lg text-gray-800 transition-colors cursor-pointer"
              >
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0" />
                Ranking
              </button>
              <button
                onClick={() => { setShowShop(true); setShowMenu(false); }}
                className="w-full flex items-center gap-3.5 text-left px-4 py-3 min-h-[48px] rounded-xl hover:bg-indigo-50 font-black text-base sm:text-lg text-gray-800 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 flex-shrink-0" />
                Tienda de Draco
              </button>
              <button
                onClick={() => { setShowPuzzleGame(true); setShowMenu(false); }}
                className="w-full flex items-center gap-3.5 text-left px-4 py-3 min-h-[48px] rounded-xl hover:bg-indigo-50 font-black text-base sm:text-lg text-gray-800 transition-colors cursor-pointer"
              >
                <Puzzle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 flex-shrink-0" />
                Puzzle Matemático
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content con espacio inferior para botones flotantes */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-36 sm:pb-32">
        <AnimatePresence mode="wait">
          {isPracticing && selectedLesson && selectedCategory ? (
            <ImprovedMathPractice
              key="practice"
              category={selectedCategory}
              lessonId={selectedLesson.id}
              lessonLevel={selectedLesson.level}
              onBack={() => {
                setIsPracticing(false);
                setSelectedLesson(null);
              }}
            />
          ) : !selectedCategory ? (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Welcome Responsive */}
              <div className="text-center mb-8 sm:mb-12">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 mx-auto mb-4 sm:mb-6 flex items-center justify-center"
                >
                  <DracoAvatar
                    outfitId={user.equippedOutfit}
                    className="w-full h-full object-contain filter drop-shadow-2xl"
                    showGlow={true}
                    alt="Draco"
                  />
                </motion.div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-2 sm:mb-4 drop-shadow-2xl">
                  ¡Hola, {user.name}! 
                </h1>
                <p className="text-lg sm:text-2xl md:text-3xl text-white font-bold drop-shadow-lg">
                  ¡Elige tu aventura matemática!
                </p>
              </div>

              {/* Categories Grid Responsive */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 max-w-[1200px] mx-auto">
                {categories.map((category, index) => {
                  const Icon = category.icon;

                  return (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ scale: 1.04, y: -6 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className="bg-white rounded-3xl shadow-xl border-b-6 sm:border-b-8 border-indigo-400 p-5 sm:p-8 text-center transform transition-all hover:shadow-2xl w-full max-w-[280px] sm:w-64 cursor-pointer min-h-[48px]"
                    >
                      <div className={`w-18 h-18 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mb-1 sm:mb-2">{category.name}</h3>
                      <p className="text-sm sm:text-lg font-bold text-gray-600">5 Lecciones</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* Adventure Map View Responsive */
            <motion.div key="lessons" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {(() => {
                const category = categories.find(c => c.id === selectedCategory)!;
                const Icon = category.icon;

                return (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedCategory(null)}
                      className="mb-4 sm:mb-8 bg-white px-5 sm:px-8 py-3 sm:py-4 min-h-[44px] rounded-2xl shadow-lg border-b-4 border-gray-300 font-black text-base sm:text-xl text-gray-700 hover:border-gray-400 cursor-pointer flex items-center gap-2"
                    >
                      <span>← Volver al Mapa</span>
                    </motion.button>

                    <div className="bg-white rounded-3xl shadow-2xl border-b-6 sm:border-b-8 border-indigo-400 p-5 sm:p-8 mb-6 sm:mb-8">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                        <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-xl flex-shrink-0`}>
                          <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                        </div>
                        <div>
                          <h1 className="text-3xl sm:text-5xl font-black text-gray-800">{category.name}</h1>
                          <p className="text-base sm:text-xl text-gray-600 font-bold mt-1">Aventura Matemática • 5 Niveles</p>
                        </div>
                      </div>
                    </div>

                    {/* Adventure Path */}
                    <div className="relative max-w-3xl mx-auto py-4">
                      {/* Decorative Path */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block" style={{ zIndex: 0 }}>
                        <path
                          d="M 100 50 Q 300 100 500 150 T 900 250 T 500 350 T 900 450"
                          stroke="#E0E7FF"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray="20 10"
                        />
                      </svg>

                      <div className="space-y-16 sm:space-y-20 relative" style={{ zIndex: 1 }}>
                        {category.lessons.map((lesson, index) => {
                          const lessonData = getLessonData(category.id, lesson.id);
                          const isUnlocked = isLessonUnlocked(category.id, lesson.level);
                          const alignment = index % 2 === 0 ? 'justify-center sm:justify-start' : 'justify-center sm:justify-end';

                          return (
                            <div key={lesson.id} className={`flex ${alignment}`}>
                              <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 }}
                                whileHover={{ scale: isUnlocked ? 1.08 : 1, rotate: isUnlocked ? 3 : 0 }}
                                whileTap={{ scale: isUnlocked ? 0.94 : 1 }}
                                disabled={!isUnlocked}
                                onClick={() => isUnlocked && handleLessonClick(category.id, lesson)}
                                className={`relative ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                              >
                                {/* Lesson Island */}
                                <div
                                  className={`w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center shadow-xl border-b-6 sm:border-b-8 transition-transform ${
                                    !isUnlocked
                                      ? 'bg-gray-300 border-gray-500 opacity-90'
                                      : lessonData.completed
                                      ? `bg-gradient-to-br ${category.color} border-yellow-500 ring-4 ring-yellow-200`
                                      : `bg-gradient-to-br from-white to-gray-100 border-indigo-400 ring-4 ring-indigo-200`
                                  }`}
                                >
                                  {!isUnlocked ? (
                                    <Lock className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-600" />
                                  ) : lessonData.completed ? (
                                    <Star className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-yellow-400 fill-yellow-400 drop-shadow" />
                                  ) : (
                                    <Rocket className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-indigo-500 drop-shadow" />
                                  )}
                                </div>

                                {/* Lesson Title Badge Responsive (no se desborda en móvil) */}
                                <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2 w-max max-w-[220px] sm:max-w-xs text-center pointer-events-none">
                                  <div className={`px-3 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-xl border-b-4 whitespace-normal sm:whitespace-nowrap ${
                                    !isUnlocked
                                      ? "bg-gray-100 border-gray-300"
                                      : lessonData.completed
                                      ? "bg-emerald-50 border-emerald-300"
                                      : "bg-white border-indigo-300"
                                  }`}>
                                    <p className="font-black text-xs sm:text-base text-gray-800 leading-tight">{lesson.title}</p>
                                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                                      <span className="text-[10px] sm:text-xs text-gray-600 font-bold">Nivel {lesson.level}</span>
                                      {!isUnlocked ? (
                                        <span className="text-[9px] sm:text-xs text-red-600 font-extrabold bg-red-100 px-2 py-0.5 rounded-full leading-tight">
                                          Bloqueado (70% en Nivel {lesson.level - 1})
                                        </span>
                                      ) : lessonData.completed ? (
                                        <span className="text-[9px] sm:text-xs text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">
                                          {lessonData.accuracy}% acierto
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </motion.button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Barra de Acciones Flotantes Responsive: Acceso Directo al Puzzle y Chatbot de Draco */}
      {!isPracticing && (
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 flex flex-col landscape:flex-row sm:landscape:flex-col items-end gap-2.5 sm:gap-4 z-40 pointer-events-auto">
          {/* Botón 1: Acceso Directo al Puzzle */}
          <motion.button
            whileHover={{ scale: 1.03, x: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowPuzzleGame(true)}
            className="w-44 sm:w-68 md:w-76 h-14 sm:h-20 md:h-24 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-white shadow-[0_4px_0_#3b0764,0_10px_20px_rgba(0,0,0,0.3)] sm:shadow-[0_8px_0_#3b0764,0_16px_25px_rgba(0,0,0,0.35)] active:translate-y-1 active:shadow-[0_2px_0_#3b0764] flex items-center px-3 sm:px-5 gap-2.5 sm:gap-3.5 text-white cursor-pointer group transition-all min-h-[48px]"
            title="Abrir Puzzle Matemático"
          >
            <div className="w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/20 border border-white/40 backdrop-blur-sm flex items-center justify-center shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
              <Puzzle className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 text-yellow-300 drop-shadow" />
            </div>
            <div className="flex flex-col text-left leading-tight overflow-hidden flex-1">
              <span className="text-[9px] sm:text-xs text-pink-200 font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-yellow-300" /> Metajuego
              </span>
              <span className="text-sm sm:text-xl md:text-2xl font-black tracking-wide drop-shadow text-white uppercase">
                Puzzle
              </span>
              <span className="hidden sm:block text-[10px] sm:text-xs text-white/90 font-bold truncate">
                Desafío mental diario
              </span>
            </div>
          </motion.button>

          {/* Botón 2: Acceso Directo a Draco Chatbot */}
          <motion.button
            whileHover={{ scale: 1.03, x: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowChatbot(true)}
            className="w-44 sm:w-68 md:w-76 h-14 sm:h-20 md:h-24 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-white shadow-[0_4px_0_#7c2d12,0_10px_20px_rgba(0,0,0,0.3)] sm:shadow-[0_8px_0_#7c2d12,0_16px_25px_rgba(0,0,0,0.35)] active:translate-y-1 active:shadow-[0_2px_0_#7c2d12] flex items-center px-3 sm:px-5 gap-2.5 sm:gap-3.5 text-white cursor-pointer group transition-all min-h-[48px]"
            title="Hablar con Draco Chatbot"
          >
            <div className="w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/20 border border-white/40 backdrop-blur-sm flex items-center justify-center shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform p-0.5 sm:p-1 relative">
              <DracoAvatar
                outfitId={user?.equippedOutfit}
                className="w-full h-full object-contain filter drop-shadow"
                alt="Draco Chat"
              />
              <div className="absolute -top-1 -right-1 bg-yellow-400 text-orange-950 p-0.5 sm:p-1 rounded-full shadow border sm:border-2 border-white">
                <Bot className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
            <div className="flex flex-col text-left leading-tight overflow-hidden flex-1">
              <span className="text-[9px] sm:text-xs text-yellow-200 font-black uppercase tracking-wider flex items-center gap-1">
                <Bot className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" /> Tutor IA
              </span>
              <span className="text-sm sm:text-xl md:text-2xl font-black tracking-wide drop-shadow text-white uppercase flex items-center gap-1">
                Draco Chat
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90" />
              </span>
              <span className="hidden sm:block text-[10px] sm:text-xs text-white/90 font-bold truncate">
                ¿Preguntas de clase?
              </span>
            </div>
          </motion.button>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showIntro && selectedLesson && selectedCategory && (
          <LessonIntro
            category={selectedCategory}
            lessonTitle={selectedLesson.title}
            onStart={() => {
              setShowIntro(false);
              setIsPracticing(true);
            }}
            onClose={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChatbot && <DracoChatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showShop && <DracoShop isOpen={showShop} onClose={() => setShowShop(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showProfile && <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showStats && <Stats isOpen={showStats} onClose={() => setShowStats(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showParentsInfo && <ParentsInfoModal isOpen={showParentsInfo} onClose={() => setShowParentsInfo(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showClassManagement && <ClassManagement isOpen={showClassManagement} onClose={() => setShowClassManagement(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showBadges && <BadgesSystem isOpen={showBadges} onClose={() => setShowBadges(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showPuzzleGame && <MathPuzzleGame isOpen={showPuzzleGame} onClose={() => setShowPuzzleGame(false)} />}
      </AnimatePresence>
    </div>
  );
}