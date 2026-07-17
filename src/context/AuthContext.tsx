import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { isAuthenticated, login as authLogin, logout as authLogout } from '@/cms/auth';

interface AuthContextValue {
  authenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());

  const login = useCallback((username: string, password: string) => {
    const ok = authLogin(username, password);
    setAuthenticated(ok);
    return ok;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ authenticated, login, logout }),
    [authenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
