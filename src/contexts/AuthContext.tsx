import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { auth, onAuthStateChanged, type User } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up Auth state listener...');
    const unsub = onAuthStateChanged(auth, (u) => { 
      console.log('Auth state changed. User:', u ? u.uid : 'Logged out');
      setUser(u); 
      setLoading(false); 
    });
    return unsub;
  }, []);

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
