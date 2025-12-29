import React, { createContext, useState, useContext, useEffect } from 'react';
// Vi importerer typen separat med 'import type'
import type { ReactNode } from 'react';

// Datatype for vores bruger (fra backendens /login response)
interface User {
  tenant_id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tjek localStorage ved opstart (så vi husker login efter refresh)
  useEffect(() => {
    const storedUser = localStorage.getItem('returnwiz_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('returnwiz_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('returnwiz_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth skal bruges inden i en AuthProvider');
  return context;
};