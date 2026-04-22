import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

type Phase = "idle" | "authenticating" | "checking-role" | "success";

const translateAuthError = (msg: string): string => {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid_credentials")) {
    return "邮箱或密码错误，请重新输入。";
  }
  if (m.includes("email not confirmed")) {
    return "该邮箱尚未确认，请先完成邮箱验证。";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "登录尝试过于频繁，请稍后再试。";
  }
  if (m.includes("network") || m.includes("failed to fetch")) {
    return "网络连接失败，无法获取登录 token，请检查网络后重试。";
  }
  if (m.includes("user not found")) {
    return "未找到该账号，请确认邮箱是否正确。";
  }
  return `登录失败：${msg}`;
};

const AdminLogin = () => {
  const { signIn, signOut, session, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (session && isAdmin) {
      setPhase("success");
      navigate("/admin", { replace: true });
    }
  }, [session, isAdmin, navigate]);

  useEffect(() => {
    if (phase !== "authenticating" && phase !== "checking-role") return;

    const timeoutId = window.setTimeout(() => {
      setError(
        phase === "authenticating"
          ? "登录请求超时，未能成功获取登录 token，请检查网络或稍后重试。"
          : "账号已验证，但管理员权限校验超时，请刷新页面后重试。"
      );
      setPhase("idle");
      setPassword("");
    }, 10000);

    return () => window.clearTimeout(timeoutId);
  }, [phase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPhase("authenticating");

    const result = await signIn(email.trim(), password);

    if (result.error) {
      setError(translateAuthError(result.error));
      setPhase("idle");
      setPassword("");
      return;
    }

    setPhase("checking-role");

    if (!result.isAdmin) {
      setError("该账号已通过身份验证，但未分配管理员权限，因此无法进入后台。请联系管理员授予 admin 角色。");
      setPhase("idle");
      setPassword("");
      void signOut();
      return;
    }

    setPhase("success");
    navigate("/admin", { replace: true });
  };

  const isBusy = phase === "authenticating" || phase === "checking-role" || phase === "success";

  const buttonLabel = (() => {
    switch (phase) {
      case "authenticating":
        return "正在验证账号...";
      case "checking-role":
        return "正在确认管理员权限...";
      case "success":
        return "登录成功，正在跳转...";
      default:
        return "登录";
    }
  })();

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">BOOMER OFF 管理后台</CardTitle>
          <p className="text-sm text-muted-foreground">请登录管理员账号</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱账号</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@boomeroff.com"
                disabled={isBusy}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isBusy}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isBusy}>
              {isBusy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {buttonLabel}
            </Button>

            {phase === "authenticating" && (
              <p className="text-xs text-muted-foreground text-center">
                正在请求登录凭证并验证账号，请稍候…
              </p>
            )}

            {phase === "checking-role" && (
              <p className="text-xs text-muted-foreground text-center">
                账号已验证，正在校验是否具备管理员权限，请稍候…
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
