import { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_MODE } from '../firebase/config';
import { demoUsers } from '../data/demoData';

const AuthContext = createContext(null);

const LS_USER = 'classgap_current_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_USER);
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {
      console.warn('Failed to restore session', e);
    }
    setLoading(false);
  }, []);

  const persistUser = (u) => {
    setUser(u);
    if (u) localStorage.setItem(LS_USER, JSON.stringify(u));
    else localStorage.removeItem(LS_USER);
  };

  const login = async (email, password, role) => {
    // Demo mode login
    if (DEMO_MODE) {
      const found = demoUsers.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase().trim() &&
          u.password === password &&
          u.role === role
      );
      if (!found) {
        throw new Error(
          `Invalid credentials for ${role}. Try the demo credentials shown below.`
        );
      }
      const { password: _pw, ...safeUser } = found;
      persistUser(safeUser);
      return safeUser;
    }
    // Firebase mode would go here in future
    throw new Error('Firebase auth not configured. Enable demo mode in .env');
  };

  const registerStudent = async (formData) => {
    if (DEMO_MODE) {
      // Check duplicates
      const exists = demoUsers.some(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase()
      );
      if (exists) throw new Error('An account with this email already exists.');
      const newUser = {
        uid: `stu_${Date.now()}`,
        role: 'student',
        password: formData.password,
        avatar: formData.name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
        createdAt: new Date().toISOString(),
        ...formData,
      };
      demoUsers.push(newUser);
      const { password: _pw, ...safeUser } = newUser;
      persistUser(safeUser);
      return safeUser;
    }
    throw new Error('Registration not available in this mode.');
  };

  const logout = async () => {
    persistUser(null);
  };

  // Update the active session user (used when Profile is edited)
  const updateSessionUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    persistUser(newUser);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    registerStudent,
    updateSessionUser, // Added here
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isStaff: user?.role === 'staff',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}