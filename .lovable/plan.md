

## 后台改造：侧边栏 + 分页面 + 首页概览

把现在堆在 `/admin` 一个长页面里的 11 个 Manager 拆成「侧边栏导航 + 各自独立路由」，并新增一个「概览首页」让你一眼确认登录状态、权限和数据规模。

### 一、整体结构

```text
/admin                       → AdminLayout（侧边栏 + 顶部条 + 子路由出口）
  ├─ /admin                  → Overview（首页概览，默认页）
  ├─ /admin/banners          → BannerManager
  ├─ /admin/achievements     → AchievementManager
  ├─ /admin/experiences      → ExperienceManager
  ├─ /admin/categories       → CategoryManager
  ├─ /admin/audiences        → AudienceManager
  ├─ /admin/press            → PressManager
  ├─ /admin/gallery          → GalleryManager
  ├─ /admin/news             → NewsManager
  ├─ /admin/stores           → StoreManager
  ├─ /admin/brand-matrix     → BrandMatrixManager
  └─ /admin/partnership      → PartnershipManager
```

权限拦截统一放在 `AdminLayout`：未登录 → `<AdminLogin/>`；登录但非 admin → 「无管理员权限」页；通过后渲染 `<Outlet/>`。

### 二、首页快速概览（Overview）

顶部一张「登录状态卡」+ 下方一组「数据统计卡」。

**登录状态卡**（一眼确认权限正常）：
- 头像/邮箱：当前 `session.user.email`
- 角色徽章：绿色 `admin` 标签 + 「权限正常」文案
- 登录时间：`session.user.last_sign_in_at` 格式化
- User ID（可复制，便于排查）
- 「退出登录」按钮

**数据统计卡**（grid 布局，每张卡可点击跳到对应管理页）：
| 卡片 | 来源表 | 显示 |
|---|---|---|
| 门店数量 | `stores` | 总数 / 显示中数量 |
| 商品类目 | `categories` | 总数 / 显示中数量 |
| Banner | `banners` | 总数 / 显示中数量 |
| 画廊图片 | `gallery_images` | 总数 |
| 新闻动态 | `news` | 总数 / 已发布 |
| 品牌矩阵 | `brand_matrix` | 总数 / 已开业 |

每张卡右上角一个「→ 管理」链接，点击跳转对应页面。统计用 `supabase.from(x).select('*', { count: 'exact', head: true })` 拉数量，不取行数据，性能 OK。

### 三、侧边栏（基于 shadcn `sidebar`）

使用 `Sidebar collapsible="icon"` —— 桌面可折叠成窄条，移动端走 sheet 抽屉。

分组：
- **概览**：仪表盘
- **首页内容**：Banner、品牌成就、品牌体验、商品类目、目标人群、媒体口碑、画廊
- **运营**：新闻动态、门店信息
- **品牌矩阵**：店型矩阵、招商加盟

每项用 `NavLink` + `activeClassName="bg-muted text-primary font-medium"` 高亮当前页。顶部条始终显示 `SidebarTrigger`（折叠按钮）+ 当前页标题 + 「退出」按钮。

### 四、文件改动

**新增**
- `src/pages/admin/AdminLayout.tsx` —— 权限拦截 + Sidebar + Header + Outlet
- `src/pages/admin/AdminOverview.tsx` —— 概览首页
- `src/components/admin/AdminSidebar.tsx` —— 侧边栏导航

**改动**
- `src/App.tsx` —— 把 `/admin` 改成嵌套路由（父 `AdminLayout` + 子路由），删除原来的 `/admin` → `AdminDashboard` 单一路由
- `src/pages/AdminDashboard.tsx` —— 删除（或保留作历史，不再被路由）
- 现有 11 个 Manager 组件**保持不变**，只是被各自的页面文件包一层：
  - `src/pages/admin/BannersPage.tsx` 等 11 个薄壳页面，每个就是 `<BannerManager />` + 一个 H1 标题

**不动**
- `useAuth.tsx`、所有 Manager 内部逻辑、Supabase schema

### 技术细节

- **路由嵌套**：用 `react-router-dom` 的 `<Route path="/admin" element={<AdminLayout/>}>` + 多个 `<Route index/>` 与 `<Route path="banners"/>` 子路由 + `<Outlet/>`。
- **侧边栏布局**：`<SidebarProvider>` 包裹 `<div className="min-h-screen flex w-full">`，左 `<AdminSidebar/>`，右 `<div className="flex-1">` 含 header + main。
- **统计查询**：在 `AdminOverview` 用 `useEffect` 并行发起 6 个 `count` 查询，loading 时显示 `<Skeleton/>`。
- **移动端**：sidebar 自动走 sheet 模式（shadcn 内置），无需额外处理。
- **登录页处理**：`AdminLayout` 检测未登录直接渲染 `<AdminLogin/>`（保留现有所有错误提示与 phase 逻辑）。

完成后你访问 `/admin` 会先看到概览页，确认登录邮箱 + admin 徽章 + 数据统计；点侧边栏任一项进入对应单独编辑页面，长页面滚动地狱解决。

