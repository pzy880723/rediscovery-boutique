import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface SignInResult {
  error: string | null;
  session: Session | null;
  isAdmin?: boolean;
}

interface AuthContextType {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  verifyAdmin: (userId: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  const checkAdmin = useCallback(async (userId: string) => {
    const { data, error } = await supabase.rpc("has_role", {
      _role: "admin",
      _user_id: userId,
    });

    if (error) {
      console.error("Failed to check admin role", error);
      return false;
    }

    return Boolean(data);
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });

    void supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady) return;

    if (!session?.user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    void checkAdmin(session.user.id)
      .then((hasAdminRole) => {
        setIsAdmin(hasAdminRole);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authReady, session, checkAdmin]);

  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { error: error.message, session: null };
      }

      if (!data.session?.user) {
        return { error: null, session: null };
      }

      const hasAdminRole = await checkAdmin(data.session.user.id);
      setSession(data.session);
      setIsAdmin(hasAdminRole);
      setAuthReady(true);
      setLoading(false);

      return { error: null, session: data.session, isAdmin: hasAdminRole };
    } catch (err) {
      setLoading(false);
      return {
        error: err instanceof Error ? err.message : "登录失败，请稍后重试",
        session: null,
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setLoading(false);
    setAuthReady(true);
  };

  return (
    <AuthContext.Provider value={{ session, isAdmin, loading, signIn, verifyAdmin: checkAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
