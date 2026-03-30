import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import BannerManager from "@/components/admin/BannerManager";
import CategoryManager from "@/components/admin/CategoryManager";
import NewsManager from "@/components/admin/NewsManager";
import StoreManager from "@/components/admin/StoreManager";
import AdminLogin from "@/pages/AdminLogin";

const AdminDashboard = () => {
  const { session, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!session) return <AdminLogin />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium">无管理员权限</p>
          <p className="text-sm text-muted-foreground">当前账号不是管理员</p>
          <Button variant="outline" onClick={signOut}>退出登录</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-display font-bold text-lg">BOOMER OFF 管理后台</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-1">
            <LogOut className="w-4 h-4" />退出
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <BannerManager />
        <CategoryManager />
        <NewsManager />
        <StoreManager />
      </main>
    </div>
  );
};

export default AdminDashboard;
