import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Plus, Zap, TrendingUp, AlertCircle, FileText, Trophy, LogOut, Search } from 'lucide-react';
import { useUser } from '../utils/userContext';
import dragonCharacter from 'figma:asset/a7a237254f335b0739e1c16c0d3ef0796ab00ae9.png';

interface Student {
  id: string;
  name: string;
  email: string;
  metaPoints: number;
  hearts: number;
  streakDays: number;
  classCode: string;
}

interface MetaEvent {
  id: string;
  title: string;
  type: 'kahoot' | 'exam' | 'practice';
  category: string;
  questions: any[];
  active: boolean;
  createdAt: string;
}

export function TeacherDashboard() {
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState<'classes' | 'students' | 'metaevents' | 'analytics'>('classes');
  const [myClass, setMyClass] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [metaEvents, setMetaEvents] = useState<MetaEvent[]>([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [className, setClassName] = useState('');

  useEffect(() => {
    if (user && user.type === 'teacher') {
      loadTeacherData();
    }
  }, [user]);

  const loadTeacherData = () => {
    const classes = JSON.parse(localStorage.getItem('mathverse_classes') || '[]');
    const teacherClass = classes.find((c: any) => c.teacherId === user?.id);
    
    if (teacherClass) {
      setMyClass(teacherClass);
      
      // Load students
      const users = JSON.parse(localStorage.getItem('mathverse_users') || '[]');
      const classStudents = users.filter((u: any) => u.classCode === teacherClass.code && u.type === 'student');
      setStudents(classStudents);
    }

    // Load meta events
    const events = JSON.parse(localStorage.getItem(`mathverse_events_${user?.id}`) || '[]');
    setMetaEvents(events);
  };

  const createClass = () => {
    if (!className.trim() || !user) return;

    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newClass = {
      code: classCode,
      name: className,
      teacherId: user.id,
      teacherName: user.name,
      createdAt: new Date().toISOString(),
    };

    const classes = JSON.parse(localStorage.getItem('mathverse_classes') || '[]');
    classes.push(newClass);
    localStorage.setItem('mathverse_classes', JSON.stringify(classes));

    setMyClass(newClass);
    setClassName('');
  };

  const getStudentProgress = (studentId: string) => {
    const progress = JSON.parse(localStorage.getItem(`mathverse_progress_${studentId}`) || '{}');
    const categories = Object.keys(progress);
    
    let totalCompleted = 0;
    let totalErrors = 0;
    let weakCategories: string[] = [];

    categories.forEach(cat => {
      const lessons = Object.values(progress[cat]);
      const completed = lessons.filter((l: any) => l.completed).length;
      const errors = lessons.reduce((sum: number, l: any) => sum + (l.errors || 0), 0);
      
      totalCompleted += completed;
      totalErrors += errors;

      if (errors > 5) {
        weakCategories.push(cat);
      }
    });

    return {
      totalCompleted,
      totalErrors,
      weakCategories,
      progress
    };
  };

  const generateFeedback = (student: Student) => {
    const studentProgress = getStudentProgress(student.id);
    
    let feedback = `📊 Reporte de ${student.name}\n\n`;
    feedback += `✅ Lecciones completadas: ${studentProgress.totalCompleted}\n`;
    feedback += `💰 MetaPoints: ${student.metaPoints}\n`;
    feedback += `🔥 Racha: ${student.streakDays} días\n\n`;
    
    if (studentProgress.weakCategories.length > 0) {
      feedback += `⚠️ Áreas que necesitan refuerzo:\n`;
      studentProgress.weakCategories.forEach(cat => {
        feedback += `  • ${cat}\n`;
      });
      feedback += `\n`;
    }
    
    feedback += `💡 Recomendaciones:\n`;
    if (studentProgress.totalErrors > 10) {
      feedback += `  • Revisar conceptos básicos\n`;
      feedback += `  • Practicar más ejercicios de repaso\n`;
    }
    if (student.streakDays < 3) {
      feedback += `  • Motivar la práctica diaria\n`;
    }
    if (student.metaPoints < 100) {
      feedback += `  • Incentivar a completar más lecciones\n`;
    }

    alert(feedback);
  };

  const createMetaEvent = (type: 'kahoot' | 'exam' | 'practice') => {
    const newEvent: MetaEvent = {
      id: Date.now().toString(),
      title: type === 'kahoot' ? 'MetaKahoot Matemático' : type === 'exam' ? 'Examen Diagnóstico' : 'Práctica Guiada',
      type,
      category: 'suma',
      questions: [],
      active: true,
      createdAt: new Date().toISOString(),
    };

    const events = [...metaEvents, newEvent];
    setMetaEvents(events);
    localStorage.setItem(`mathverse_events_${user?.id}`, JSON.stringify(events));
    setShowCreateEvent(false);
  };

  if (!user || user.type !== 'teacher') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
      {/* Header */}
      <header className="bg-white border-b-4 border-indigo-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={dragonCharacter} alt="Draco" className="w-16 h-16" />
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Panel del Docente
              </h1>
              <p className="text-gray-600 font-semibold">Bienvenido, {user.name}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500 text-white font-bold"
          >
            <LogOut className="w-5 h-5" />
            Salir
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {[
            { id: 'classes', label: 'Mi Clase', icon: Users },
            { id: 'students', label: 'Estudiantes', icon: TrendingUp },
            { id: 'metaevents', label: 'MetaEventos', icon: Zap },
            { id: 'analytics', label: 'Análisis', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/50 text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {activeTab === 'classes' && (
            <div>
              <h2 className="text-3xl font-black text-gray-800 mb-6">Gestión de Clase</h2>
              
              {!myClass ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">No tienes una clase creada</h3>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Nombre de la clase"
                    className="w-full max-w-md px-4 py-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none font-semibold mb-4"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={createClass}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-lg"
                  >
                    <Plus className="w-6 h-6 inline mr-2" />
                    Crear Clase
                  </motion.button>
                </div>
              ) : (
                <div>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl mb-6">
                    <h3 className="text-2xl font-black text-gray-800 mb-2">{myClass.name}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-gray-600">Código de Clase:</span>
                      <span className="text-3xl font-black text-purple-600 tracking-wider">{myClass.code}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{students.length} estudiantes inscritos</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-300">
                      <Users className="w-8 h-8 text-blue-600 mb-2" />
                      <p className="text-3xl font-black text-blue-600">{students.length}</p>
                      <p className="text-sm font-semibold text-gray-600">Estudiantes</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-300">
                      <Trophy className="w-8 h-8 text-green-600 mb-2" />
                      <p className="text-3xl font-black text-green-600">
                        {students.reduce((sum, s) => sum + s.metaPoints, 0)}
                      </p>
                      <p className="text-sm font-semibold text-gray-600">MetaPoints Totales</p>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-300">
                      <Zap className="w-8 h-8 text-orange-600 mb-2" />
                      <p className="text-3xl font-black text-orange-600">{metaEvents.length}</p>
                      <p className="text-sm font-semibold text-gray-600">MetaEventos Activos</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <h2 className="text-3xl font-black text-gray-800 mb-6">Estudiantes</h2>
              
              {students.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 font-semibold">No hay estudiantes inscritos aún</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {students.map((student) => {
                    const progress = getStudentProgress(student.id);
                    
                    return (
                      <motion.div
                        key={student.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-black text-gray-800">{student.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{student.email}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-gray-600 font-semibold">Lecciones</p>
                                <p className="text-2xl font-black text-purple-600">{progress.totalCompleted}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 font-semibold">MetaPoints</p>
                                <p className="text-2xl font-black text-yellow-600">{student.metaPoints}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 font-semibold">Racha</p>
                                <p className="text-2xl font-black text-orange-600">{student.streakDays}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 font-semibold">Errores</p>
                                <p className="text-2xl font-black text-red-600">{progress.totalErrors}</p>
                              </div>
                            </div>

                            {progress.weakCategories.length > 0 && (
                              <div className="mt-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-500" />
                                <span className="text-sm font-semibold text-orange-600">
                                  Necesita refuerzo en: {progress.weakCategories.join(', ')}
                                </span>
                              </div>
                            )}
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => generateFeedback(student)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm"
                          >
                            Ver Retroalimentación
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'metaevents' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-gray-800">MetaEventos</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateEvent(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Crear MetaEvento
                </motion.button>
              </div>

              {showCreateEvent && (
                <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-300 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tipo de MetaEvento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => createMetaEvent('kahoot')}
                      className="p-6 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                    >
                      <Zap className="w-12 h-12 mx-auto mb-3" />
                      <h4 className="text-lg font-black">MetaKahoot</h4>
                      <p className="text-sm mt-2">Competencia en tiempo real</p>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => createMetaEvent('exam')}
                      className="p-6 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 text-white"
                    >
                      <FileText className="w-12 h-12 mx-auto mb-3" />
                      <h4 className="text-lg font-black">Examen</h4>
                      <p className="text-sm mt-2">Evaluación de desempeño</p>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => createMetaEvent('practice')}
                      className="p-6 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-white"
                    >
                      <TrendingUp className="w-12 h-12 mx-auto mb-3" />
                      <h4 className="text-lg font-black">Práctica</h4>
                      <p className="text-sm mt-2">Repaso de temas</p>
                    </motion.button>
                  </div>
                </div>
              )}

              {metaEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 font-semibold">No hay MetaEventos creados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {metaEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-black text-gray-800">{event.title}</h3>
                          <p className="text-sm text-gray-600">Tipo: {event.type}</p>
                          <p className="text-sm text-gray-600">Categoría: {event.category}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                          event.active ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {event.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-3xl font-black text-gray-800 mb-6">Análisis General</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-300">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Rendimiento General</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Promedio MetaPoints</p>
                      <p className="text-3xl font-black text-blue-600">
                        {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.metaPoints, 0) / students.length) : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Promedio Racha</p>
                      <p className="text-3xl font-black text-orange-600">
                        {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.streakDays, 0) / students.length) : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Estudiantes Activos</p>
                      <p className="text-3xl font-black text-green-600">
                        {students.filter(s => s.streakDays > 0).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Necesitan Apoyo</p>
                      <p className="text-3xl font-black text-red-600">
                        {students.filter(s => getStudentProgress(s.id).weakCategories.length > 0).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-300">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Recomendaciones</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <span className="text-gray-700 font-semibold">
                        Crear MetaEventos tipo Kahoot para aumentar la participación
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">📚</span>
                      <span className="text-gray-700 font-semibold">
                        Revisar estudiantes con más de 10 errores para brindar apoyo personalizado
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">🎯</span>
                      <span className="text-gray-700 font-semibold">
                        Motivar a estudiantes con racha baja a mantener práctica diaria
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
