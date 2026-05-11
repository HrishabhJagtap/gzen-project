import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, getToken, setToken } from "../api/client";

export type GzenUser = {
  id: string;
  name: string;
  email: string;
  streak: number;
  focus_score: number;
  points: number;
  level: number;
  xp: number;
  goals: string[];
  blocked_apps: string[];
};

type AuthState = {
  user: GzenUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GzenUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        setUser(null);
        return;
      }
      const me = await api.me();
      setUser(me);
    } catch {
      await setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const signIn = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    await setToken(res.access_token);
    setUser(res.user);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const res = await api.signup({ name, email, password });
    await setToken(res.access_token);
    setUser(res.user);
  };

  const signOut = async () => {
    try { await api.logout(); } catch {}
    await setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
