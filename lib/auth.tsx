"use client";

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { apiUrl } from '@/lib/api';

// Helper functions for cookie management
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

type User = {
  id: number;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('eunoia_token');
    const storedUser = localStorage.getItem('eunoia_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('eunoia_token', newToken);
    localStorage.setItem('eunoia_user', JSON.stringify(newUser));
    setCookie('eunoia_token', newToken);
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint if token exists
      if (token) {
        await fetch(`${apiUrl('/auth/logout')}?token=${encodeURIComponent(token)}`, {
          method: 'POST',
        }).catch(() => {
          // Ignore errors - we'll still clear local state
        });
      }
    } finally {
      // Always clear local state and redirect
      setToken(null);
      setUser(null);
      localStorage.removeItem('eunoia_token');
      localStorage.removeItem('eunoia_user');
      removeCookie('eunoia_token');
      router.push('/login');
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
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