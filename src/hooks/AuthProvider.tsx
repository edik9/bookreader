import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../lib/firebase/firebase";
import { AuthContext } from "../context/AuthContextInstance";
import type { AuthContextType, User } from "../types/AuthContextTypes";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Проверка гостевого режима при загрузке
  useEffect(() => {
    const guestStatus = localStorage.getItem("isGuest") === "true";
    setIsGuest(guestStatus);
  }, []);

  // Отслеживание состояния аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsGuest(false);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const enableGuestMode = () => {
    localStorage.setItem("isGuest", "true");
    setIsGuest(true);
  };

  const disableGuestMode = () => {
    localStorage.removeItem("isGuest");
    setIsGuest(false);
  };

  const value: AuthContextType = {
    user,
    loading,
    isGuest,
    loginWithEmail,
    logout,
    enableGuestMode,
    disableGuestMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
