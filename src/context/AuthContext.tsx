import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set up global Axios request interceptor for iframe compatibility and fallback token header
axios.interceptors.request.use(config => {
  const localSessionId = localStorage.getItem('madrasa_session_id');
  if (localSessionId) {
    config.headers['X-Session-ID'] = localSessionId;
    config.headers['Authorization'] = `Bearer ${localSessionId}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

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
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Not authenticated');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      setIsLoading(true);
      const res = await axios.post('/api/auth/login', {
        email,
        password: password || 'password123'
      });
      if (res.data && res.data.success && res.data.user) {
        if (res.data.sessionId) {
          localStorage.setItem('madrasa_session_id', res.data.sessionId);
        }
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login request failed', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await axios.post('/api/auth/logout');
      localStorage.removeItem('madrasa_session_id');
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user ? user.role : null,
      isLoading,
      login,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
