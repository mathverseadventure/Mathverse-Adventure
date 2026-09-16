import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Users, Plus, Trophy, Target, Copy, Medal } from 'lucide-react';
import { useUser } from '../utils/userContext';

interface ClassManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ClassData {
  code: string;
  name: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
}

interface StudentRanking {
  name: string;
  metaPoints: number;
  completedLessons: number;
}

export function ClassManagement({ isOpen, onClose }: ClassManagementProps) {
  const { user, joinClass } = useUser();
  const [className, setClassName] = useState('');
  const [classCodeInput, setClassCodeInput] = useState('');
  const [myClass, setMyClass] = useState<ClassData | null>(null);
  const [rankings, setRankings] = useState<StudentRanking[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      if (user.type === 'teacher') {
        // Load teacher's class
        const classes = JSON.parse(localStorage.getItem('mathverse_classes') || '[]');
        const teacherClass = classes.find((c: ClassData) => c.teacherId === user.id);
        if (teacherClass) {
          setMyClass(teacherClass);
          loadRankings(teacherClass.code);
        }
      } else if (user.classCode) {
        // Load student's class
        const classes = JSON.parse(localStorage.getItem('mathverse_classes') || '[]');
        const studentClass = classes.find((c: ClassData) => c.code === user.classCode);
        if (studentClass) {
          setMyClass(studentClass);
          loadRankings(studentClass.code);
        }
      }
    }
  }, [user]);

  const loadRankings = (classCode: string) => {
    const users = JSON.parse(localStorage.getItem('mathverse_users') || '[]');
    const classStudents = users.filter((u: any) => u.classCode === classCode && u.type === 'student');
    
    const rankingData: StudentRanking[] = classStudents.map((student: any) => {
      const progress = JSON.parse(localStorage.getItem(`mathverse_progress_${student.id}`) || '{}');
      const completedLessons = Object.values(progress).reduce((acc: number, category: any) => {
        return acc + Object.values(category).filter((lesson: any) => lesson.completed).length;
      }, 0);
      
      return {
        name: student.name,
        metaPoints: student.metaPoints || 0,
        completedLessons: completedLessons as number,
      };
    });

    rankingData.sort((a, b) => b.metaPoints - a.metaPoints);
    setRankings(rankingData);
  };

  const createClass = () => {
    if (!className.trim() || !user || user.type !== 'teacher') {
      setError('Por favor ingresa un nombre para la clase');
      return;
    }

    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newClass: ClassData = {
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
    setError('');
  };

  const handleJoinClass = () => {
    if (!classCodeInput.trim()) {
      setError('Por favor ingresa el código de la clase');
      return;
    }

    const success = joinClass(classCodeInput.toUpperCase());
    if (success) {
      const classes = JSON.parse(localStorage.getItem('mathverse_classes') || '[]');
      const joinedClass = classes.find((c: ClassData) => c.code === classCodeInput.toUpperCase());
      setMyClass(joinedClass);
      setClassCodeInput('');
      setError('');
      loadRankings(classCodeInput.toUpperCase());
    } else {
      setError('Código de clase inválido');
    }
  };

  const copyClassCode = () => {
    if (myClass) {
      navigator.clipboard.writeText(myClass.code);
      alert('¡Código copiado al portapapeles!');
    }
  };

  if (!isOpen || !user) return null;

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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">
                {user.type === 'teacher' ? 'Gestionar Clase' : 'Mi Clase'}
              </h2>
              <p className="text-white/90 font-semibold">
                {user.type === 'teacher' ? 'Crea y administra tu clase' : 'Únete y compite'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!myClass ? (
            /* Create or Join Class */
            <div>
              {user.type === 'teacher' ? (
                /* Teacher: Create Class */
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-300">
                  <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                    <Plus className="w-6 h-6" />
                    Crear Nueva Clase
                  </h3>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Nombre de la clase (ej: Matemáticas 5° A)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none font-semibold mb-4"
                  />
                  {error && (
                    <p className="text-red-600 text-sm font-semibold mb-4">{error}</p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createClass}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black"
                  >
                    Crear Clase
                  </motion.button>
                </div>
              ) : (
                /* Student: Join Class */
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-300">
                  <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Unirme a una Clase
                  </h3>
                  <input
                    type="text"
                    value={classCodeInput}
                    onChange={(e) => setClassCodeInput(e.target.value.toUpperCase())}
                    placeholder="Código de la clase"
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none font-black text-center text-2xl tracking-wider mb-4"
                  />
                  {error && (
                    <p className="text-red-600 text-sm font-semibold mb-4">{error}</p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleJoinClass}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black"
                  >
                    Unirme a la Clase
                  </motion.button>
                </div>
              )}
            </div>
          ) : (
            /* Show Class Info and Rankings */
            <div className="space-y-6">
              {/* Class Info */}
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-2xl border-2 border-indigo-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-gray-800">{myClass.name}</h3>
                    <p className="text-gray-600 font-semibold">
                      {user.type === 'teacher' ? 'Tu clase' : `Docente: ${myClass.teacherName}`}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyClassCode}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md"
                  >
                    <Copy className="w-5 h-5" />
                    <span className="font-black text-xl tracking-wider">{myClass.code}</span>
                  </motion.button>
                </div>
                <p className="text-sm text-gray-600 font-semibold">
                  {rankings.length} estudiante{rankings.length !== 1 ? 's' : ''} en la clase
                </p>
              </div>

              {/* Rankings */}
              <div>
                <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Ranking de la Clase
                </h3>

                {rankings.length === 0 ? (
                  <div className="bg-gray-50 p-8 rounded-2xl text-center">
                    <p className="text-gray-600 font-semibold">
                      Aún no hay estudiantes en esta clase
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rankings.map((student, index) => {
                      const isCurrentUser = student.name === user.name;
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center justify-between p-4 rounded-xl ${
                            isCurrentUser
                              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400'
                              : index < 3
                              ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200'
                              : 'bg-gray-50 border-2 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${
                              index < 3
                                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                                : 'bg-gray-300 text-gray-700'
                            }`}>
                              {index < 3 ? <Medal className="w-6 h-6 text-white" /> : index + 1}
                            </div>
                            <div className="flex-1">
                              <p className={`font-black text-lg ${isCurrentUser ? 'text-orange-700' : 'text-gray-800'}`}>
                                {student.name} {isCurrentUser && '(Tú)'}
                              </p>
                              <p className="text-sm font-semibold text-gray-600">
                                {student.completedLessons} lecciones completadas
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                            <Target className="w-5 h-5 text-purple-600" />
                            <span className="font-black text-purple-700">{student.metaPoints}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
