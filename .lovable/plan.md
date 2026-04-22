

## 品牌矩阵详情页 + AI 门店图生成

为 7 个店型增加可点击的独立详情页，并用 AI 给 6 个未上线店型生成场景化门店概念图（标准店保留现有图）。

### 一、新增字段（数据库）

`brand_matrix` 表追加 3 个字段：
- `slug` text — URL 友好标识（vintage / home / hobby / collection / digital / nb / plus），唯一索引
- `cover_image_url` text — 详情页封面 / 列表卡片图
- `gallery_urls` jsonb 数组 — 详情页画廊 3-4 张图

迁移同时按 `store_type` 把 7 条现有记录回填 slug；标准店 `cover_image_url` 填现有 BOOMER OFF Vintage 中信泰富店实拍图（用现有 `gallery_images` 里第一张或既有 banner 图，由 AI 阶段从前端列表中确认后填入）；其余 6 条 cover/gallery 暂空，由下一步 AI 填充。

### 二、AI 生成门店图（6 个未上线店型）

用 **Lovable AI Gateway** 的 `google/gemini-3-pro-image-preview`（高质量）一次性生成所有图，写入 `images` storage bucket 的 `brand-matrix/<slug>/` 路径，再把 URL 回填到对应记录的 `cover_image_url` 与 `gallery_urls`。

每个店型生成 1 张主封面 + 3 张内景细节图（共 24 张）。提示词模板（中文 + 英文混合，强调日式中古杂货店氛围、米白底 + 红色品牌色 #E30613 点缀、暖色灯光、木质货架，与中信泰富首店视觉一致）：

| 店型 | 主图提示要点 |
|---|---|
| Home | 木质开放货架陈列日式瓷器、铁壶、丝巾、线香，暖黄灯，柔焦 |
| Hobby | 玩具卡牌墙、手办展柜、黑胶唱片墙，潮玩氛围 |
| Collection | 高端商场橱窗式陈列，玻璃柜中古名牌包、丝巾、腕表，金属质感 |
| Digital | 中古相机、随身听、CCD、手机墙，工业风货架 |
| NB | 30㎡ 社区小店，门口木质寄售架 + 长椅，社区温馨感 |
| Plus | 1000㎡ 仓库式特卖，整排满货架仓储吊灯，热闹密集 SKU |

执行方式：用沙盒里 ai-gateway skill 的 lovable_ai.py 脚本，生成 PNG 后用 Python 调 Supabase storage REST API 上传；URL 通过 SQL 迁移更新。**生成总耗时约 3-5 分钟**，期间会输出每张图的进度。

### 三、详情页路由与 UI

新增路由：
- `/brand-matrix/:slug` → `src/pages/BrandMatrixDetail.tsx`

页面结构：
```text
[Navbar]
[Hero] cover_image_url 全宽 → 半遮罩 → 标题 store_type / positioning / area / 营业状态徽章
[概述] description 加长版（用 AI 可同时生成更详细的 200-300 字介绍存到新字段 long_description）
[画廊] gallery_urls 网格 3 列（移动端 2 列），点击放大用 Dialog
[规格表] 面积 / 选址要求 / 商品品类 / 客群 — 静态结构 + 数据库字段
[CTA] 「咨询此店型」按钮 → 锚点跳到首页 #partnership 区块
[Footer]
```

视觉风格沿用现有：米白底 + 红 #E30613 + PingFang SC，模块标题居中（日文小字 uppercase + 中文 H2）。

### 四、首页 BrandMatrixSection 改造

每张矩阵卡片：
- 顶部加 cover_image_url 缩略图（`aspect-[4/3]`，`object-cover`）
- 整卡包一层 `<Link to={\`/brand-matrix/${item.slug}\`}>`
- 卡片右下角加「查看详情 →」

### 五、后台管理增强

`BrandMatrixManager.tsx` 编辑表单追加：
- slug 输入（唯一校验提示）
- cover_image_url —— 复用 `ImageUpload` 组件
- gallery_urls —— 多图上传（数组追加 / 删除）
- long_description —— Textarea，5 行

### 六、文件改动汇总

**新增**
- `supabase/migrations/<ts>_brand_matrix_detail.sql` — 加字段 + 回填 slug + 写入 AI 生成图 URL
- `src/pages/BrandMatrixDetail.tsx`
- 临时脚本 `/tmp/gen_brand_matrix_images.py`（执行后丢弃）

**改动**
- `src/App.tsx` — 加路由 `/brand-matrix/:slug`
- `src/components/BrandMatrixSection.tsx` — 卡片加图、加链接
- `src/components/admin/BrandMatrixManager.tsx` — 表单加 4 个字段

**不动**
- 现有 brand_matrix 7 条数据的核心字段（store_type / area / positioning / description / sort_order / is_launched）
- 标准店现有图片，仅在迁移里把已有图 URL 写进去

### 技术细节

- **slug 唯一性**：迁移内 `ALTER TABLE brand_matrix ADD COLUMN slug text UNIQUE`；详情页用 `.eq("slug", slug).maybeSingle()` 查询，404 时跳 `<NotFound/>`。
- **AI 调用**：用 ai-gateway skill 的批量模式（`--batch`）生成 7 组 prompt × 4 张 = 28 次调用，每次延迟 2s 避免 429；但生成图必须用 `--image` 单次模式，所以脚本里写 for 循环顺序调用，每张延迟 1s。
- **Storage 上传**：用 `LOVABLE_API_KEY` 调 `https://<project>.supabase.co/storage/v1/object/images/brand-matrix/<slug>/cover.png`，用 service_role key（脚本内通过 `SUPABASE_SERVICE_ROLE_KEY` env 读取）。
- **TypeScript types**：迁移后 `src/integrations/supabase/types.ts` 自动更新。
- **画廊 Dialog**：用现有 `@/components/ui/dialog`，无需新依赖。

