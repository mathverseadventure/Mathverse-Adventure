import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Heart, Plus, Minus, X, Divide, Zap, Calculator, Coins, Menu, Gamepad2 } from 'lucide-react';
import logo from "../assets/logo_mathverse.png";
import dragonCharacter from "../assets/draco.png";
import { useUser } from './utils/userContext';
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

export function StudentApp() {
  const { user, userProgress } = useUser();
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
  const [showClassManagement, setShowClassManagement] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPuzzleGame, setShowPuzzleGame] = useState(false);

  useEffect(() => {
    // Check if diagnostic test has been completed
    if (user) {
      const diagnostic = localStorage.getItem(`mathverse_diagnostic_${user.id}`);
      if (!diagnostic) {
        setShowDiagnostic(true);
      } else {
        const diagData = JSON.parse(diagnostic);
        setDiagnosticLevel(diagData.level);
      }
    }
  }, [user]);

  const handleDiagnosticComplete = (level: number) => {
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

  const isLessonUnlocked = (lessonLevel: number) => {
    return lessonLevel <= diagnosticLevel;
  };

  const getLessonData = (categoryId: string, lessonId: number) => {
    return userProgress[categoryId]?.[lessonId] || { completed: false, stars: 0 };
  };

  const handleLessonClick = (category: string, lesson: { id: number; title: string; level: number }) => {
    if (!isLessonUnlocked(lesson.level)) return;
    
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
                MATHVERSE ADVENTURE
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
              <span className="font-bold text-lg text-yellow-700">{user.metaPoints}</span>
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
              className="absolute top-full right-4 mt-2 bg-white rounded-2xl shadow-2xl border-4 border-indigo-300 p-4 min-w-[200px] z-50"
            >
              <button
                onClick={() => { setShowProfile(true); setShowMenu(false); }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 font-bold text-gray-800 transition-colors"
              >
                👤 Mi Perfil
              </button>
              <button
                onClick={() => { setShowStats(true); setShowMenu(false); }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 font-bold text-gray-800 transition-colors"
              >
                📊 Estadísticas
              </button>
              <button
                onClick={() => { setShowBadges(true); setShowMenu(false); }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 font-bold text-gray-800 transition-colors"
              >
                🏆 Logros
              </button>
              <button
                onClick={() => { setShowClassManagement(true); setShowMenu(false); }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 font-bold text-gray-800 transition-colors"
              >
                👥 Ranking
              </button>
              <button
                onClick={() => { setShowShop(true); setShowMenu(false); }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 font-bold text-gray-800 transition-colors"
              >
                🛍️ Tienda
              </button>
              <button
                onClick={() => { setShowPuzzleGame(true); setShowMenu(false); }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 font-bold text-gray-800 transition-colors"
              >
                🎲 Juego de rompecabezas
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
                <motion.img
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  src={dragonCharacter}
                  alt="Draco"
                  className="w-56 h-56 md:w-72 md:h-72 mx-auto mb-6"
                />
                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">
                  ¡Hola, {user.name}! 🎉
                </h1>
                <p className="text-2xl md:text-3xl text-white font-bold drop-shadow-lg">
                  ¡Elige tu aventura matemática!
                </p>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                      className="bg-white rounded-3xl shadow-2xl border-b-8 border-indigo-400 p-8 text-center transform transition-all hover:shadow-3xl"
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
                          const isUnlocked = isLessonUnlocked(lesson.level);
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
                                    <span className="text-6xl">🔒</span>
                                  ) : lessonData.completed ? (
                                    <span className="text-6xl">⭐</span>
                                  ) : (
                                    <span className="text-6xl">🚀</span>
                                  )}
                                </div>

                                {/* Lesson Title */}
                                <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                  <div className="bg-white px-6 py-3 rounded-2xl shadow-xl border-b-4 border-indigo-300">
                                    <p className="font-black text-lg text-gray-800">{lesson.title}</p>
                                    <p className="text-sm text-gray-600 font-bold">Nivel {lesson.level}</p>
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

      {/* Floating Draco Chatbot */}
      {!isPracticing && (
        <motion.button
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-8 right-8 w-28 h-28 bg-gradient-to-br from-red-400 to-orange-500 rounded-full shadow-2xl border-4 border-white z-40 flex items-center justify-center"
        >
          <img src={dragonCharacter} alt="Draco" className="w-20 h-20" />
        </motion.button>
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