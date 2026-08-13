import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Customer = { id: number; name: string; email: string };

type AuthContextValue = {
  customer: Customer | null;
  token: string | null;
  login: (token: string, customer: Customer) => void;
  logout: () => void;
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY    = "obeliskrx-auth-token";
const CUSTOMER_KEY = "obeliskrx-customer";
const API = import.meta.env.VITE_API_URL ?? "http://localhost/obeliskrx/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY),
  );
  const [customer, setCustomer] = useState<Customer | null>(() => {
    try {
      const c = localStorage.getItem(CUSTOMER_KEY);
      return c ? (JSON.parse(c) as Customer) : null;
    } catch {
      return null;
    }
  });
  // Synchronous init - always ready on first render
  const authReady = true;

  const login = useCallback((t: string, c: Customer) => {
    setToken(t);
    setCustomer(c);
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(c));
  }, []);

  const logout = useCallback(async () => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) {
      try {
        await fetch(`${API}/auth/logout.php`, {
          method: "POST",
          headers: { Authorization: `Bearer ${t}` },
        });
      } catch {}
    }
    setToken(null);
    setCustomer(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ customer, token, login, logout, isLoggedIn: !!token }),
    [customer, token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { API as AUTH_API };
