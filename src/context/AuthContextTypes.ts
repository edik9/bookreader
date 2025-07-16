// src/context/AuthContextTypes.ts
import type { User } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  enableGuestMode: () => void;
  disableGuestMode: () => void;
}

export type { User };