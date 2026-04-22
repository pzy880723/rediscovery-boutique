import { useAuth } from "@/hooks/useAuth";
import { Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminLogin from "@/pages/AdminLogin";

const titleMap: Record<string, string> = {
  "/admin": "仪表盘概览",
  "/admin/sections": "首页区块管理",
  "/admin/banners": "Banner 横幅",
  "/admin/achievements": "品牌成就",
  "/admin/experiences": "品牌体验",
  "/admin/categories": "商品类目",
  "/admin/audiences": "目标人群",
  "/admin/press": "媒体口碑",
  "/admin/gallery": "画廊图片",
  "/admin/news": "新闻动态",
  "/admin/stores": "门店信息",
  "/admin/brand-matrix": "店型矩阵",
  "/admin/partnership": "招商加盟",
};

const AdminLayout = () => {
  const { session, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();

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

  const pageTitle = titleMap[location.pathname] ?? "管理后台";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-background border-b sticky top-0 z-40">
            <div className="h-14 flex items-center justify-between px-4 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <SidebarTrigger />
                <h1 className="font-display font-semibold text-base truncate">{pageTitle}</h1>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-1 shrink-0">
                <LogOut className="w-4 h-4" />退出
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
