import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  Copy,
  LogOut,
  Store,
  Tags,
  Image as ImageIcon,
  Images,
  Newspaper,
  Grid3x3,
  ArrowRight,
} from "lucide-react";

type StatKey =
  | "stores"
  | "categories"
  | "banners"
  | "gallery_images"
  | "news"
  | "brand_matrix";

interface StatConfig {
  key: StatKey;
  table: "stores" | "categories" | "banners" | "gallery_images" | "news" | "brand_matrix";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  secondaryFilter?: { column: string; value: boolean; secondaryLabel: string };
}

const statConfigs: StatConfig[] = [
  {
    key: "stores",
    table: "stores",
    label: "门店数量",
    icon: Store,
    href: "/admin/stores",
    secondaryFilter: { column: "is_active", value: true, secondaryLabel: "显示中" },
  },
  {
    key: "categories",
    table: "categories",
    label: "商品类目",
    icon: Tags,
    href: "/admin/categories",
    secondaryFilter: { column: "is_active", value: true, secondaryLabel: "显示中" },
  },
  {
    key: "banners",
    table: "banners",
    label: "Banner 横幅",
    icon: ImageIcon,
    href: "/admin/banners",
    secondaryFilter: { column: "is_active", value: true, secondaryLabel: "显示中" },
  },
  {
    key: "gallery_images",
    table: "gallery_images",
    label: "画廊图片",
    icon: Images,
    href: "/admin/gallery",
  },
  {
    key: "news",
    table: "news",
    label: "新闻动态",
    icon: Newspaper,
    href: "/admin/news",
    secondaryFilter: { column: "is_published", value: true, secondaryLabel: "已发布" },
  },
  {
    key: "brand_matrix",
    table: "brand_matrix",
    label: "品牌矩阵",
    icon: Grid3x3,
    href: "/admin/brand-matrix",
    secondaryFilter: { column: "is_launched", value: true, secondaryLabel: "已开业" },
  },
];

interface StatValue {
  total: number | null;
  secondary: number | null;
}

const formatDateTime = (iso?: string | null) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const AdminOverview = () => {
  const { session, signOut } = useAuth();
  const [stats, setStats] = useState<Record<StatKey, StatValue>>(() => {
    const init = {} as Record<StatKey, StatValue>;
    statConfigs.forEach((c) => {
      init[c.key] = { total: null, secondary: null };
    });
    return init;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const results = await Promise.all(
        statConfigs.map(async (c) => {
          const totalRes = await supabase
            .from(c.table)
            .select("*", { count: "exact", head: true });
          let secondary: number | null = null;
          if (c.secondaryFilter) {
            const secRes = await supabase
              .from(c.table)
              .select("*", { count: "exact", head: true })
              .eq(c.secondaryFilter.column, c.secondaryFilter.value);
            secondary = secRes.count ?? 0;
          }
          return { key: c.key, total: totalRes.count ?? 0, secondary };
        }),
      );
      if (cancelled) return;
      setStats((prev) => {
        const next = { ...prev };
        results.forEach((r) => {
          next[r.key] = { total: r.total, secondary: r.secondary };
        });
        return next;
      });
      setLoading(false);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const userId = session?.user?.id ?? "";
  const email = session?.user?.email ?? "—";
  const lastSignIn = formatDateTime(session?.user?.last_sign_in_at);

  const copyUserId = async () => {
    if (!userId) return;
    try {
      await navigator.clipboard.writeText(userId);
      toast({ title: "已复制 User ID" });
    } catch {
      toast({ title: "复制失败", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* 登录状态卡 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg truncate">{email}</CardTitle>
                <Badge className="bg-green-600 hover:bg-green-600 text-white gap-1">
                  <CheckCircle2 className="w-3 h-3" />admin
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">已登录 · 管理员权限正常</p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut} className="gap-1 shrink-0">
              <LogOut className="w-4 h-4" />退出登录
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs mb-1">最近登录</p>
            <p className="font-medium">{lastSignIn}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-1">User ID</p>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono truncate flex-1 min-w-0">
                {userId}
              </code>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={copyUserId}>
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据统计 */}
      <div>
        <h2 className="font-display font-semibold text-base mb-3">数据概览</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statConfigs.map((c) => {
            const value = stats[c.key];
            const Icon = c.icon;
            return (
              <Card key={c.key} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{c.label}</span>
                    </div>
                    <Link
                      to={c.href}
                      className="text-xs text-primary hover:underline inline-flex items-center gap-0.5"
                    >
                      管理 <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-9 w-20" />
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-display font-bold">
                        {value.total ?? 0}
                      </span>
                      {c.secondaryFilter && (
                        <span className="text-xs text-muted-foreground">
                          / {value.secondary ?? 0} {c.secondaryFilter.secondaryLabel}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
