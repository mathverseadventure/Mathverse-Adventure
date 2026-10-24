import { useEffect } from "react";
import { useUser } from "./utils/userContext";
import { initDemoData } from "./utils/initDemoData";

import { Login } from "./components/Login";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { StudentApp } from "./StudentApp";

export default function MainApp() {
  const { user, setLoggedStudent } = useUser();

  useEffect(() => {
    initDemoData();

    // Si existe un estudiante de Laravel guardado, cargarlo al contexto.
    const estudianteGuardado = localStorage.getItem("estudiante");

    if (estudianteGuardado && !user) {
      const estudiante = JSON.parse(estudianteGuardado);
      setLoggedStudent(estudiante);
    }
  }, [user, setLoggedStudent]);

  // Si no hay usuario en memoria, verificar si hay sesión persistida para evitar parpadeos
  if (!user) {
    const hasCachedSession = Boolean(
      localStorage.getItem("estudiante") || localStorage.getItem("mathverse_user")
    );

    if (hasCachedSession) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-400 flex flex-col items-center justify-center p-4">
          <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-2xl font-black text-white drop-shadow">Iniciando MathVerse Adventure...</p>
        </div>
      );
    }

    return <Login />;
  }

  // Si es docente.
  if (user.type === "teacher") {
    return <TeacherDashboard />;
  }

  // Si es estudiante.
  return <StudentApp />;
}