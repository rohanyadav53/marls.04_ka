import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, setCsrfToken, setUnauthenticatedHandler, type AdminUser, type Session } from "./api";

type AuthValue = {
  user: AdminUser | null;
  features: Session["features"];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthValue | null>(null);

const DEFAULT_FEATURES: Session["features"] = { xlsx_export: false, captcha: false };

/**
 * Session state for the portal.
 *
 * The browser is never the authority here — it asks /api/me.php who it is on
 * every load, and the PHP endpoints re-check the session on every request
 * regardless of what this component believes. Route guarding below is purely
 * so the UI shows the right screen.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [features, setFeatures] = useState<Session["features"]>(DEFAULT_FEATURES);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const session = await api.session();
      setCsrfToken(session.csrf_token);
      setUser(session.authenticated ? session.user : null);
      setFeatures(session.features ?? DEFAULT_FEATURES);
    } catch {
      // An unreachable API is indistinguishable from being signed out, and
      // treating it as signed out is the safe direction to fail.
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Any 401 from anywhere in the app drops us back to the sign-in screen.
  useEffect(() => {
    setUnauthenticatedHandler(() => setUser(null));
    return () => setUnauthenticatedHandler(null);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await api.login(email, password);
    setCsrfToken(result.csrf_token);
    setUser(result.user);
    // Pick up feature flags (and a rotated token) for the new session.
    void api.session().then((session) => {
      setCsrfToken(session.csrf_token);
      setFeatures(session.features ?? DEFAULT_FEATURES);
    });
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setCsrfToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ user, features, loading, signIn, signOut }),
    [user, features, loading, signIn, signOut],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
