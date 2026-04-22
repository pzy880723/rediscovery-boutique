import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface SignInResult {
  error: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
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

  const checkAdmin = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("Failed to check admin role", error);
      setIsAdmin(false);
      return false;
    }

    const hasAdminRole = !!data;
    setIsAdmin(hasAdminRole);
    return hasAdminRole;
  }, []);

  const syncAuthState = useCallback(
    (nextSession: Session | null) => {
      setSession(nextSession);

      if (!nextSession?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      void checkAdmin(nextSession.user.id).finally(() => {
        setLoading(false);
      });
    },
    [checkAdmin]
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      syncAuthState(nextSession);
    });

    void supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      syncAuthState(initialSession);
    });

    return () => subscription.unsubscribe();
  }, [syncAuthState]);

  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { error: error.message, isAdmin: false };
      }

      if (!data.session?.user) {
        return { error: "未能建立登录会话，请稍后重试。", isAdmin: false };
      }

      setSession(data.session);
      const hasAdminRole = await checkAdmin(data.session.user.id);
      setLoading(false);

      return { error: null, isAdmin: hasAdminRole };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "登录失败，请稍后重试",
        isAdmin: false,
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
