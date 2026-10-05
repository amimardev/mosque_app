import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUserFn, loginFn, logoutFn } from '../server/functions/auth';
import { logoutOneSignalUser } from '../lib/onesignal';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'parent';
  avatar?: string;
  teacherProfile?: any;
  parentProfile?: any;
  children?: any[];
}

interface AuthContextType {
  user: UserProfile | null;
  role: 'admin' | 'teacher' | 'parent' | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const result = await getCurrentUserFn();
      setUser(result.user);
    } catch (error) {
      console.warn('Unable to load the current user', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await loginFn({ data: { email, password } });
      setUser(result.user);
      return result.success && !!result.user;
    } catch (error) {
      console.error('Login request failed', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutOneSignalUser();
      await logoutFn();
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role: user ? user.role : null, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
