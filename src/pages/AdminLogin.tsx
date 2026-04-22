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
    return "网络连接失败，请检查网络后重试。";
  }
  if (m.includes("user not found")) {
    return "未找到该账号，请确认邮箱是否正确。";
  }
  return `登录失败：${msg}`;
};

const AdminLogin = () => {
  const { signIn, signOut, session, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [submitted, setSubmitted] = useState(false);

  // 已登录的管理员自动跳转到后台
  useEffect(() => {
    if (!authLoading && session && isAdmin) {
      setPhase("success");
      navigate("/admin", { replace: true });
    }
  }, [authLoading, session, isAdmin, navigate]);

  // 登录成功但角色不是管理员：明确提示，并清空密码
  useEffect(() => {
    if (submitted && !authLoading && session && !isAdmin && phase === "checking-role") {
      setError(
        "该账号已登录成功，但没有管理员权限。请联系系统管理员授予 admin 角色，或更换其他管理员账号登录。"
      );
      setPhase("idle");
      setPassword("");
      // 退出当前非管理员会话，避免侧栏被误判为已登录
      signOut();
    }
  }, [submitted, authLoading, session, isAdmin, phase, signOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitted(true);
    setPhase("authenticating");

    const { error: signInError } = await signIn(email.trim(), password);

    if (signInError) {
      setError(translateAuthError(signInError));
      setPhase("idle");
      setPassword(""); // 失败时只清密码，保留邮箱
      return;
    }

    // 登录成功后，等待 useAuth 校验 admin 角色
    setPhase("checking-role");
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

            {phase === "checking-role" && (
              <p className="text-xs text-muted-foreground text-center">
                正在校验账号是否具备管理员权限，请稍候…
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
