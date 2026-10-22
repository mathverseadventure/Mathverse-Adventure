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

  // Si no hay usuario, mostrar Login.
  if (!user) {
    return <Login />;
  }

  // Si es docente.
  if (user.type === "teacher") {
    return <TeacherDashboard />;
  }

  // Si es estudiante.
  return <StudentApp />;
}