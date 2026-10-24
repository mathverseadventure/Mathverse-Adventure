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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-300 to-pink-400">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b-4 border-indigo-400 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              setSelectedCategory(null);
              setIsPracticing(false);
              setSelectedLesson(null);
            }}
          >
            <img src={logo} alt="Mathverse Adventure" className="w-20 h-20 md:w-24 md:h-24" />
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 leading-tight">
                Mathverse Adventure
              </h1>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-orange-100 px-3 py-2 rounded-xl border-b-4 border-orange-400"
            >
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span className="font-bold text-lg text-orange-600">{user.streakDays}</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowShop(true)}
              className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-xl border-b-4 border-yellow-400 cursor-pointer"
            >
              <Coins className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-lg text-yellow-700">
                {user.metaPoints ?? 0}
              </span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded-xl border-b-4 border-red-400"
            >
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span className="font-bold text-lg text-red-600">{user.hearts}</span>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5 text-white" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenu(!showMenu)}
              className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <Menu className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full right-4 mt-3 bg-white rounded-3xl shadow-2xl border-4 border-indigo-300 p-3 min-w-[300px] sm:min-w-[340px] z-50 space-y-1"
            >
              <button
                onClick={() => { setShowProfile(true); setShowMenu(false); }}
                className="w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl hover:bg-indigo-50 font-bold text-lg text-gray-800 transition-colors"
              >
                <User className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                Mi Perfil
              </button>
              <button
                onClick={() => { setShowStats(true); setShowMenu(false); }}
                className="w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl hover:bg-indigo-50 font-bold text-lg text-gray-800 transition-colors"
              >
                <BarChart3 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                Estadísticas
              </button>
              <button
                onClick={() => { setShowParentsInfo(true); setShowMenu(false); }}
                className="w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl hover:bg-emerald-50 font-bold text-lg text-gray-800 transition-colors"
              >
                <Users className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                Información para Padres
              </button>
              <button
                onClick={() => { setShowBadges(true); setShowMenu(false); }}
                className="w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl hover:bg-indigo-50 font-bold text-lg text-gray-800 transition-colors"
              >
                <Award className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                Logros
              </button>
              <button
                onClick={() => { setShowClassManagement(true); setShowMenu(false); }}
                className="w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl hover:bg-indigo-50 font-bold text-lg text-gray-800 transition-colors"
              >
                <Trophy className="w-6 h-6 text-orange-500 flex-shrink-0" />
                Ranking
              </button>
              <button
                onClick={() => { setShowShop(true); setShowMenu(false); }}
                className="w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl hover:bg-indigo-50 font-bold text-lg text-gray-800 transition-colors"
              >
                <ShoppingBag className="w-6 h-6 text-pink-500 flex-shrink-0" />
                Tienda
              </button>
              <button
                onClick={() => { setShowPuzzleGame(true); setShowMenu(false); }}
                className="w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl hover:bg-indigo-50 font-bold text-lg text-gray-800 transition-colors"
              >
                <Puzzle className="w-6 h-6 text-purple-500 flex-shrink-0" />
                Juego de rompecabezas
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
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
              {/* Welcome */}
              <div className="text-center mb-12">
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-56 h-56 md:w-72 md:h-72 mx-auto mb-6 flex items-center justify-center"
                >
                  <DracoAvatar
                    outfitId={user.equippedOutfit}
                    className="w-full h-full object-contain filter drop-shadow-2xl"
                    showGlow={true}
                    alt="Draco"
                  />
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">
                  ¡Hola, {user.name}! 
                </h1>
                <p className="text-2xl md:text-3xl text-white font-bold drop-shadow-lg">
                  ¡Elige tu aventura matemática!
                </p>
              </div>

              {/* Categories Grid - centrado con flexbox para que la última fila no quede pegada a la izquierda */}
              <div className="flex flex-wrap justify-center gap-8 max-w-[1200px] mx-auto">
                {categories.map((category, index) => {
                  const Icon = category.icon;

                  return (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className="bg-white rounded-3xl shadow-2xl border-b-8 border-indigo-400 p-8 text-center transform transition-all hover:shadow-3xl w-64"
                    >
                      <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-xl`}>
                        <Icon className="w-14 h-14 text-white" />
                      </div>
                      <h3 className="text-3xl font-black text-gray-800 mb-2">{category.name}</h3>
                      <p className="text-lg font-bold text-gray-600">5 Lecciones</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* Adventure Map View */
            <motion.div key="lessons" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {(() => {
                const category = categories.find(c => c.id === selectedCategory)!;
                const Icon = category.icon;

                return (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(null)}
                      className="mb-8 bg-white px-8 py-4 rounded-2xl shadow-lg border-b-4 border-gray-300 font-black text-xl text-gray-700 hover:border-gray-400"
                    >
                      ← Volver al Mapa
                    </motion.button>

                    <div className={`bg-white rounded-3xl shadow-2xl border-b-8 border-indigo-400 p-8 mb-8`}>
                      <div className="flex items-center gap-6">
                        <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-xl`}>
                          <Icon className="w-16 h-16 text-white" />
                        </div>
                        <div>
                          <h1 className="text-5xl font-black text-gray-800">{category.name}</h1>
                          <p className="text-xl text-gray-600 font-bold mt-2">Aventura Matemática</p>
                        </div>
                      </div>
                    </div>

                    {/* Adventure Path */}
                    <div className="relative max-w-3xl mx-auto">
                      {/* Decorative Path */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                        <path
                          d="M 100 50 Q 300 100 500 150 T 900 250 T 500 350 T 900 450"
                          stroke="#E0E7FF"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray="20 10"
                        />
                      </svg>

                      <div className="space-y-16 relative" style={{ zIndex: 1 }}>
                        {category.lessons.map((lesson, index) => {
                          const lessonData = getLessonData(category.id, lesson.id);
                          const isUnlocked = isLessonUnlocked(category.id, lesson.level);
                          const alignment = index % 2 === 0 ? 'justify-start' : 'justify-end';

                          return (
                            <div key={lesson.id} className={`flex ${alignment}`}>
                              <motion.button
                                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ scale: isUnlocked ? 1.1 : 1, rotate: isUnlocked ? 5 : 0 }}
                                whileTap={{ scale: isUnlocked ? 0.9 : 1 }}
                                disabled={!isUnlocked}
                                onClick={() => isUnlocked && handleLessonClick(category.id, lesson)}
                                className="relative"
                              >
                                {/* Lesson Island */}
                                <div
                                  className={`w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-2xl border-b-8 ${
                                    !isUnlocked
                                      ? 'bg-gray-300 border-gray-500'
                                      : lessonData.completed
                                      ? `bg-gradient-to-br ${category.color} border-yellow-500`
                                      : `bg-gradient-to-br from-white to-gray-100 border-indigo-400`
                                  }`}
                                >
                                  {!isUnlocked ? (
                                    <Lock className="w-16 h-16 text-gray-600" />
                                  ) : lessonData.completed ? (
                                    <Star className="w-16 h-16 text-yellow-400 fill-yellow-400" />
                                  ) : (
                                    <Rocket className="w-16 h-16 text-indigo-500" />
                                  )}
                                </div>

                                {/* Lesson Title */}
                                <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center">
                                  <div className={`px-6 py-3 rounded-2xl shadow-xl border-b-4 ${
                                    !isUnlocked
                                      ? "bg-gray-100 border-gray-300"
                                      : lessonData.completed
                                      ? "bg-emerald-50 border-emerald-300"
                                      : "bg-white border-indigo-300"
                                  }`}>
                                    <p className="font-black text-lg text-gray-800">{lesson.title}</p>
                                    <div className="flex items-center justify-center gap-2 mt-0.5">
                                      <span className="text-xs text-gray-600 font-bold">Nivel {lesson.level}</span>
                                      {!isUnlocked ? (
                                        <span className="text-xs text-red-600 font-extrabold bg-red-100 px-2 py-0.5 rounded-full">
                                          Bloqueado (Requiere 70% en Nivel {lesson.level - 1})
                                        </span>
                                      ) : lessonData.completed ? (
                                        <span className="text-xs text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">
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

      {/* Barra de Acciones Flotantes: Acceso Directo al Puzzle y Chatbot de Draco con Alta Visibilidad y Relieve 3D */}
      {!isPracticing && (
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 flex flex-col items-end gap-4 z-40 pointer-events-auto">
          {/* Botón 1: Acceso Directo al Puzzle (Ultra visible, alto contraste, relieve 3D táctil) */}
          <motion.button
            whileHover={{ scale: 1.04, x: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowPuzzleGame(true)}
            className="w-56 sm:w-68 md:w-76 h-20 sm:h-24 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl border-4 border-white shadow-[0_8px_0_#3b0764,0_16px_25px_rgba(0,0,0,0.35)] active:translate-y-1.5 active:shadow-[0_2px_0_#3b0764] flex items-center px-4 sm:px-5 gap-3.5 text-white cursor-pointer group transition-all"
            title="Abrir Puzzle Matemático"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/20 border-2 border-white/40 backdrop-blur-sm flex items-center justify-center shadow-inner flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <Puzzle className="w-7 h-7 sm:w-10 sm:h-10 text-yellow-300 drop-shadow" />
            </div>
            <div className="flex flex-col text-left leading-tight overflow-hidden flex-1">
              <span className="text-[10px] sm:text-xs text-pink-200 font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Metajuego
              </span>
              <span className="text-base sm:text-2xl font-black tracking-wide drop-shadow text-white uppercase">
                Puzzle
              </span>
              <span className="text-[10px] sm:text-xs text-white/90 font-bold truncate">
                Desafío mental diario
              </span>
            </div>
          </motion.button>

          {/* Botón 2: Acceso Directo a Draco Chatbot (Mismo ancho, altura, relieve 3D y alineación) */}
          <motion.button
            whileHover={{ scale: 1.04, x: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowChatbot(true)}
            className="w-56 sm:w-68 md:w-76 h-20 sm:h-24 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-3xl border-4 border-white shadow-[0_8px_0_#7c2d12,0_16px_25px_rgba(0,0,0,0.35)] active:translate-y-1.5 active:shadow-[0_2px_0_#7c2d12] flex items-center px-4 sm:px-5 gap-3.5 text-white cursor-pointer group transition-all"
            title="Hablar con Draco Chatbot"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/20 border-2 border-white/40 backdrop-blur-sm flex items-center justify-center shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform p-1 relative">
              <DracoAvatar
                outfitId={user?.equippedOutfit}
                className="w-full h-full object-contain filter drop-shadow"
                alt="Draco Chat"
              />
              <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-orange-950 p-1 rounded-full shadow-md border-2 border-white">
                <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
            <div className="flex flex-col text-left leading-tight overflow-hidden flex-1">
              <span className="text-[10px] sm:text-xs text-yellow-200 font-black uppercase tracking-wider flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" /> Tutor IA
              </span>
              <span className="text-base sm:text-2xl font-black tracking-wide drop-shadow text-white uppercase flex items-center gap-1.5">
                Draco Chat
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
              </span>
              <span className="text-[10px] sm:text-xs text-white/90 font-bold truncate">
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