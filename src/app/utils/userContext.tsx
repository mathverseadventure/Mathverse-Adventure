import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  type: "student" | "teacher";
  school: string;
  metaPoints: number;
  hearts: number;
  lastLoginDate: string;
  streakDays: number;
  dracoOutfits: string[];
  equippedOutfit: string;
  classCode?: string;
}

interface UserProgress {
  [categoryId: string]: {
    [lessonId: number]: {
      completed: boolean;
      stars: number;
      attempts: number;
      errors: number;
      lastAttempt: string;
    };
  };
}

interface UserContextType {
  user: User | null;
  userProgress: UserProgress;

  // Nuevo: guardar estudiante que viene desde Laravel
  setLoggedStudent: (estudiante: any) => void;

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
    school: string
  ) => Promise<boolean>;

  logout: () => void;

  updateMetaPoints: (points: number) => void;
  updateHearts: (hearts: number) => void;
  updateStreak: () => void;
  updateProgress: (
    categoryId: string,
    lessonId: number,
    stars: number,
    errors: number
  ) => void;

  purchaseOutfit: (outfitId: string, cost: number) => boolean;
  equipOutfit: (outfitId: string) => void;
  joinClass: (classCode: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({});

  useEffect(() => {
    const savedUser = localStorage.getItem("mathverse_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      const progress = JSON.parse(
        localStorage.getItem(`mathverse_progress_${parsedUser.id}`) || "{}"
      );

      setUserProgress(progress);
    }
  }, []);

  // LOGIN DOCENTE (localStorage)
  const login = async (
    email: string,
    password: string,
    type: "student" | "teacher"
  ): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("mathverse_users") || "[]");

    const foundUser = users.find(
      (u: any) =>
        u.email === email &&
        u.password === password &&
        u.type === type
    );

    if (!foundUser) return false;

    const today = new Date().toDateString();

    foundUser.lastLoginDate = today;

    setUser(foundUser);
    localStorage.setItem("mathverse_user", JSON.stringify(foundUser));

    const progress = JSON.parse(
      localStorage.getItem(`mathverse_progress_${foundUser.id}`) || "{}"
    );

    setUserProgress(progress);

    return true;
  };

  // NUEVO: guardar estudiante de Laravel
  const setLoggedStudent = (estudiante: any) => {
    const studentUser: User = {
      id: estudiante.id.toString(),
      name: `${estudiante.nombre} ${estudiante.apellido}`,
      email: estudiante.correo,
      type: "student",
      school: "IED Divino Salvador",
      metaPoints: 0,
      hearts: 20,
      lastLoginDate: new Date().toDateString(),
      streakDays: 1,
      dracoOutfits: ["default"],
      equippedOutfit: "default",
    };

    setUser(studentUser);

    localStorage.setItem("mathverse_user", JSON.stringify(studentUser));
    localStorage.setItem("estudiante", JSON.stringify(estudiante));

    const progress = JSON.parse(
      localStorage.getItem(`mathverse_progress_${studentUser.id}`) || "{}"
    );

    setUserProgress(progress);
  };

  // REGISTRO DOCENTE
  const register = async (
    name: string,
    email: string,
    password: string,
    type: "student" | "teacher",
    school: string
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
      metaPoints: 0,
      hearts: 20,
      lastLoginDate: new Date().toDateString(),
      streakDays: 1,
      dracoOutfits: ["default"],
      equippedOutfit: "default",
      classCode: undefined,
    };

    users.push(newUser);

    localStorage.setItem("mathverse_users", JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;

    setUser(userWithoutPassword);

    localStorage.setItem(
      "mathverse_user",
      JSON.stringify(userWithoutPassword)
    );

    return true;
  };

  const logout = () => {
    setUser(null);
    setUserProgress({});

    localStorage.removeItem("mathverse_user");
    localStorage.removeItem("estudiante");
  };

  const updateMetaPoints = (points: number) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      metaPoints: user.metaPoints + points,
    };

    setUser(updatedUser);

    localStorage.setItem("mathverse_user", JSON.stringify(updatedUser));
  };

  const updateHearts = (hearts: number) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      hearts: Math.max(0, Math.min(20, hearts)),
    };

    setUser(updatedUser);

    localStorage.setItem("mathverse_user", JSON.stringify(updatedUser));
  };

  const updateStreak = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      streakDays: user.streakDays + 1,
      lastLoginDate: new Date().toDateString(),
    };

    setUser(updatedUser);

    localStorage.setItem("mathverse_user", JSON.stringify(updatedUser));
  };

  const updateProgress = (
    categoryId: string,
    lessonId: number,
    stars: number,
    errors: number
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
      };

    newProgress[categoryId][lessonId] = {
      completed: stars > 0,
      stars: Math.max(existingLesson.stars, stars),
      attempts: existingLesson.attempts + 1,
      errors: existingLesson.errors + errors,
      lastAttempt: new Date().toISOString(),
    };

    setUserProgress(newProgress);

    localStorage.setItem(
      `mathverse_progress_${user.id}`,
      JSON.stringify(newProgress)
    );
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

    const updatedUser = {
      ...user,
      equippedOutfit: outfitId,
    };

    setUser(updatedUser);

    localStorage.setItem("mathverse_user", JSON.stringify(updatedUser));
  };

  const joinClass = (classCode: string) => {
    if (!user || user.type !== "student") return false;

    const updatedUser = {
      ...user,
      classCode,
    };

    setUser(updatedUser);

    localStorage.setItem("mathverse_user", JSON.stringify(updatedUser));

    return true;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userProgress,
        setLoggedStudent,
        login,
        register,
        logout,
        updateMetaPoints,
        updateHearts,
        updateStreak,
        updateProgress,
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