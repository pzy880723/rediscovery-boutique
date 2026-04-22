import {
  LayoutDashboard,
  Image as ImageIcon,
  Trophy,
  Sparkles,
  Tags,
  Users,
  Newspaper,
  Images,
  FileText,
  Store,
  Grid3x3,
  Handshake,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const groups = [
  {
    label: "概览",
    items: [{ title: "仪表盘", url: "/admin", icon: LayoutDashboard, end: true }],
  },
  {
    label: "首页内容",
    items: [
      { title: "Banner 横幅", url: "/admin/banners", icon: ImageIcon },
      { title: "品牌成就", url: "/admin/achievements", icon: Trophy },
      { title: "品牌体验", url: "/admin/experiences", icon: Sparkles },
      { title: "商品类目", url: "/admin/categories", icon: Tags },
      { title: "目标人群", url: "/admin/audiences", icon: Users },
      { title: "媒体口碑", url: "/admin/press", icon: FileText },
      { title: "画廊图片", url: "/admin/gallery", icon: Images },
    ],
  },
  {
    label: "运营",
    items: [
      { title: "新闻动态", url: "/admin/news", icon: Newspaper },
      { title: "门店信息", url: "/admin/stores", icon: Store },
    ],
  },
  {
    label: "品牌矩阵",
    items: [
      { title: "店型矩阵", url: "/admin/brand-matrix", icon: Grid3x3 },
      { title: "招商加盟", url: "/admin/partnership", icon: Handshake },
    ],
  },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-3 border-b">
        {!collapsed ? (
          <div>
            <p className="font-display font-bold text-sm leading-tight">BOOMER OFF</p>
            <p className="text-xs text-muted-foreground">管理后台</p>
          </div>
        ) : (
          <div className="font-display font-bold text-sm text-center">BO</div>
        )}
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        end={item.end}
                        className="hover:bg-muted/50"
                        activeClassName="bg-muted text-primary font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
