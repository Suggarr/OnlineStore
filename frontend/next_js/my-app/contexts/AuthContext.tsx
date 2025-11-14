// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserData, getCurrentUser, logoutUser } from '@/utils/auth';

interface AuthContextType {
  user: UserData | null;
  login: (user: UserData) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = (userData: UserData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error('Ошибка выхода:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}