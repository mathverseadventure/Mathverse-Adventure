import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { actualizarMetaPoints } from "../../services/estudianteService";
import { obtenerProgreso, actualizarProgreso } from "../../services/progresoService";

export interface User {
  id: string;
  name: string;
  email: string;
  type: "student" | "teacher";
  school: string;
  apellido?: string;
  curso?: string;
  metaPoints: number;
  hearts: number;
  lastLoginDate: string;
  streakDays: number;
  dracoOutfits: string[];
  equippedOutfit: string;
  classCode?: string;
}

export interface LessonProgress {
  completed: boolean;
  stars: number;
  attempts: number;
  errors: number;
  lastAttempt: string;
  accuracy?: number;
}

export interface UserProgress {
  [categoryId: string]: {
    [lessonId: number]: LessonProgress;
  };
}

export interface ThemeUnlocks {
  [categoryId: string]: number;
}

interface UserContextType {
  user: User | null;
  userProgress: UserProgress;
  themeUnlocks: ThemeUnlocks;
  setLoggedStudent: (estudiante: any) => Promise<void>;
  setLoggedTeacher: (docente: any) => void;
  login: (
    email: string,
    password: string,
    type: "student" | "teacher"
  ) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    type: "student" | "teacher",
    school: string,
    apellido?: string,
    curso?: string
  ) => Promise<boolean>;
  logout: () => void;
  updateMetaPoints: (points: number) => Promise<void>;
  updateHearts: (hearts: number) => void;
  updateStreak: () => void;
  updateProgress: (
    categoryId: string,
    lessonId: number,
    stars: number,
    errors: number,
    accuracy?: number
  ) => void;
  saveDiagnosticResult: (
    percentage: number,
    score: number,
    total: number,
    perTheme: ThemeUnlocks
  ) => void;
  purchaseOutfit: (outfitId: string, cost: number) => boolean;
  equipOutfit: (outfitId: string) => void;
  joinClass: (classCode: string) => boolean;
}

const DEFAULT_UNLOCKS: ThemeUnlocks = {
  suma: 1,
  resta: 1,
  multiplicacion: 1,
  division: 1,
  potencias: 1,
  radicacion: 1,
  polinomios: 1,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

function todayKey() {
  return new Date().toDateString();
}

async function persistProgreso(
  estudianteId: number,
  payload: Record<string, unknown>
) {
  try {
    await actualizarProgreso(estudianteId, payload);
  } catch (error) {
    console.error("Error al guardar progreso:", error);
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [themeUnlocks, setThemeUnlocks] = useState<ThemeUnlocks>(DEFAULT_UNLOCKS);

  useEffect(() => {
    const savedUser = localStorage.getItem("mathverse_user");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      const progress = JSON.parse(
        localStorage.getItem(`mathverse_progress_${parsedUser.id}`) || "{}"
      );
      setUserProgress(progress);

      const unlocks = JSON.parse(
        localStorage.getItem(`mathverse_unlocks_${parsedUser.id}`) ||
          JSON.stringify(DEFAULT_UNLOCKS)
      );
      setThemeUnlocks(unlocks);
    }
  }, []);

  const syncHeartsDaily = (hearts: number, lastDate?: string | null) => {
    if (lastDate !== todayKey()) {
      return { hearts: 20, date: todayKey() };
    }
    return { hearts: Math.max(0, Math.min(20, hearts)), date: todayKey() };
  };

  const setLoggedStudent = async (estudiante: any) => {
    let hearts = 20;
    let progress: UserProgress = {};
    let unlocks: ThemeUnlocks = { ...DEFAULT_UNLOCKS };
    let vidasFecha = todayKey();

    try {
      const progreso = await obtenerProgreso(estudiante.id);
      const synced = syncHeartsDaily(
        progreso.vidas ?? 20,
        progreso.vidas_fecha
      );
      hearts = synced.hearts;
      vidasFecha = synced.date;
      progress = progreso.detalle_niveles || {};
      unlocks = progreso.desbloqueos || unlocks;

      if (progreso.diagnostico) {
        localStorage.setItem(
          `mathverse_diagnostic_${estudiante.id}`,
          JSON.stringify(progreso.diagnostico)
        );
      }

      if (synced.hearts !== progreso.vidas || progreso.vidas_fecha !== vidasFecha) {
        await persistProgreso(estudiante.id, {
          vidas: hearts,
          vidas_fecha: vidasFecha,
          monedas: estudiante.meta_points ?? 0,
        });
      }
    } catch {
      const localProgress = JSON.parse(
        localStorage.getItem(`mathverse_progress_${estudiante.id}`) || "{}"
      );
      progress = localProgress;
      const localUnlocks = JSON.parse(
        localStorage.getItem(`mathverse_unlocks_${estudiante.id}`) ||
          JSON.stringify(DEFAULT_UNLOCKS)
      );
      unlocks = localUnlocks;
    }

    const studentUser: User = {
      id: estudiante.id.toString(),
      name: `${estudiante.nombre} ${estudiante.apellido}`,
      email: estudiante.correo,
      type: "student",
      school: "IED Divino Salvador",
      metaPoints: Number(estudiante.meta_points ?? 0),
      hearts,
      lastLoginDate: todayKey(),
      streakDays: 1,
      dracoOutfits: ["default"],
      equippedOutfit: "default",
      classCode: undefined,
    };

    setUser(studentUser);
    setUserProgress(progress);
    setThemeUnlocks(unlocks);

    localStorage.setItem("mathverse_user", JSON.stringify(studentUser));
    localStorage.setItem("estudiante", JSON.stringify(estudiante));
    localStorage.setItem(
      `mathverse_progress_${studentUser.id}`,
      JSON.stringify(progress)
    );
    localStorage.setItem(
      `mathverse_unlocks_${studentUser.id}`,
      JSON.stringify(unlocks)
    );
  };

  const setLoggedTeacher = (docente: any) => {
    const teacherUser: User = {
      id: docente.id?.toString() || Date.now().toString(),
      name: `${docente.nombre} ${docente.apellido}`,
      email: docente.correo,
      type: "teacher",
      school: docente.colegio || "",
      apellido: docente.apellido,
      curso: docente.curso,
      metaPoints: 0,
      hearts: 20,
      lastLoginDate: todayKey(),
      streakDays: 1,
      dracoOutfits: ["default"],
      equippedOutfit: "default",
    };

    setUser(teacherUser);
    localStorage.setItem("mathverse_user", JSON.stringify(teacherUser));
    localStorage.setItem("docente", JSON.stringify(docente));
  };

  const login = async (
    email: string,
    password: string,
    type: "student" | "teacher"
  ): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("mathverse_users") || "[]");

    const foundUser = users.find(
      (u: any) =>
        u.email === email && u.password === password && u.type === type
    );

    if (!foundUser) return false;

    const updatedUser = {
      ...foundUser,
      lastLoginDate: todayKey(),
    };

    setUser(updatedUser);
    localStorage.setItem("mathverse_user", JSON.stringify(updatedUser));

    const progress = JSON.parse(
      localStorage.getItem(`mathverse_progress_${updatedUser.id}`) || "{}"
    );
    setUserProgress(progress);

    return true;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    type: "student" | "teacher",
    school: string,
    apellido?: string,
    curso?: string
  ): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("mathverse_users") || "[]");

    if (users.some((u: any) => u.email === email)) {
      return false;
    }

    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name,
      email,
      password,
      type,
      school,
      apellido,
      curso,
      metaPoints: 0,
      hearts: 20,
      lastLoginDate: todayKey(),
      streakDays: 1,
      dracoOutfits: ["default"],
      equippedOutfit: "default",
      classCode: undefined,
    };

    users.push(newUser);
    localStorage.setItem("mathverse_users", JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("mathverse_user", JSON.stringify(userWithoutPassword));

    return true;
  };

  const logout = () => {
    setUser(null);
    setUserProgress({});
    setThemeUnlocks(DEFAULT_UNLOCKS);
    localStorage.removeItem("mathverse_user");
    localStorage.removeItem("estudiante");
    localStorage.removeItem("docente");
  };

  const updateMetaPoints = async (points: number) => {
    if (!user) return;

    const newTotal = user.metaPoints + points;
    const updatedUser = { ...user, metaPoints: newTotal };
    setUser(updatedUser);
    localStorage.setItem("mathverse_user", JSON.stringify(updatedUser));

    const estudianteGuardado = localStorage.getItem("estudiante");
    if (estudianteGuardado && user.type === "student") {
      const estudiante = JSON.parse(estudianteGuardado);
      try {
        const respuesta = await actualizarMetaPoints(estudiante.id, points);
        estudiante.meta_points = respuesta.meta_points;
        localStorage.setItem("estudiante", JSON.stringify(estudiante));

        const syncedUser = { ...updatedUser, metaPoints: respuesta.meta_points };
        setUser(syncedUser);
        localStorage.setItem("mathverse_user", JSON.stringify(syncedUser));

        await persistProgreso(estudiante.id, {
          monedas: respuesta.meta_points,
        });
      } catch (error) {
        console.error("Error al actualizar metapoints:", error);
      }
    }
  };

  const updateHearts = (hearts: number) => {
    if (!user) return;

    const clamped = Math.max(0, Math.min(20, hearts));
    const updatedUser = { ...user, hearts: clamped };
    setUser(updatedUser);
    localStorage.setItem("mathverse_user", JSON.stringify(updatedUser));

    const estudianteGuardado = localStorage.getItem("estudiante");
    if (estudianteGuardado && user.type === "student") {
      const estudiante = JSON.parse(estudianteGuardado);
      persistProgreso(estudiante.id, {
        vidas: clamped,
        vidas_fecha: todayKey(),
      });
    }
  };

  const updateStreak = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      streakDays: user.streakDays + 1,
      lastLoginDate: todayKey(),
    };

    setUser(updatedUser);
    localStorage.setItem("mathverse_user", JSON.stringify(updatedUser));
  };

  const updateProgress = (
    categoryId: string,
    lessonId: number,
    stars: number,
    errors: number,
    accuracy?: number
  ) => {
    if (!user) return;

    const newProgress = { ...userProgress };

    if (!newProgress[categoryId]) {
      newProgress[categoryId] = {};
    }

    const existingLesson =
      newProgress[categoryId][lessonId] || {
        attempts: 0,
        errors: 0,
        stars: 0,
        completed: false,
        lastAttempt: "",
        accuracy: 0,
      };

    const passed = (accuracy ?? (stars >= 2 ? 80 : stars * 50)) >= 80;

    newProgress[categoryId][lessonId] = {
      completed: passed || existingLesson.completed,
      stars: Math.max(existingLesson.stars, stars),
      attempts: existingLesson.attempts + 1,
      errors: existingLesson.errors + errors,
      lastAttempt: new Date().toISOString(),
      accuracy: Math.max(existingLesson.accuracy || 0, accuracy ?? 0),
    };

    setUserProgress(newProgress);
    localStorage.setItem(
      `mathverse_progress_${user.id}`,
      JSON.stringify(newProgress)
    );

    const estudianteGuardado = localStorage.getItem("estudiante");
    if (estudianteGuardado && user.type === "student") {
      const estudiante = JSON.parse(estudianteGuardado);
      persistProgreso(estudiante.id, {
        detalle_niveles: newProgress,
        monedas: user.metaPoints,
        vidas: user.hearts,
        vidas_fecha: todayKey(),
      });
    }
  };

  const saveDiagnosticResult = (
    percentage: number,
    score: number,
    total: number,
    perTheme: ThemeUnlocks
  ) => {
    if (!user) return;

    const unlockedLevels = Math.max(1, Math.ceil((percentage / 100) * 5));
    const unlocks: ThemeUnlocks = { ...DEFAULT_UNLOCKS };

    Object.keys(DEFAULT_UNLOCKS).forEach((theme) => {
      unlocks[theme] = perTheme[theme] ?? unlockedLevels;
    });

    setThemeUnlocks(unlocks);
    localStorage.setItem(
      `mathverse_unlocks_${user.id}`,
      JSON.stringify(unlocks)
    );

    const diagnostic = {
      completed: true,
      level: unlockedLevels,
      score,
      total,
      percentage,
      unlocks,
      date: new Date().toISOString(),
    };

    localStorage.setItem(
      `mathverse_diagnostic_${user.id}`,
      JSON.stringify(diagnostic)
    );

    const estudianteGuardado = localStorage.getItem("estudiante");
    if (estudianteGuardado && user.type === "student") {
      const estudiante = JSON.parse(estudianteGuardado);
      persistProgreso(estudiante.id, {
        diagnostico: diagnostic,
        desbloqueos: unlocks,
        porcentaje_avance: percentage,
      });
    }
  };

  const purchaseOutfit = (outfitId: string, cost: number) => {
    if (!user || user.metaPoints < cost) return false;

    const updatedUser = {
      ...user,
      metaPoints: user.metaPoints - cost,
      dracoOutfits: [...user.dracoOutfits, outfitId],
    };

    setUser(updatedUser);
    localStorage.setItem("mathverse_user", JSON.stringify(updatedUser));
    return true;
  };

  const equipOutfit = (outfitId: string) => {
    if (!user || !user.dracoOutfits.includes(outfitId)) return;

    const updatedUser = { ...user, equippedOutfit: outfitId };
    setUser(updatedUser);
    localStorage.setItem("mathverse_user", JSON.stringify(updatedUser));
  };

  const joinClass = (classCode: string) => {
    if (!user || user.type !== "student") return false;

    const updatedUser = { ...user, classCode };
    setUser(updatedUser);
    localStorage.setItem("mathverse_user", JSON.stringify(updatedUser));
    return true;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userProgress,
        themeUnlocks,
        setLoggedStudent,
        setLoggedTeacher,
        login,
        register,
        logout,
        updateMetaPoints,
        updateHearts,
        updateStreak,
        updateProgress,
        saveDiagnosticResult,
        purchaseOutfit,
        equipOutfit,
        joinClass,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider");
  }

  return context;
}
