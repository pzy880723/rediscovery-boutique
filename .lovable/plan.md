

## 排查 GitHub Actions Deploy 失败

### 当前已知信息
- workflow `deploy.yml` 配置正确（Node 20 + npm install + vite build + scp 部署）
- Annotations 里的 Node.js 20 deprecation 是 **warning**，不会导致失败
- `build-and-deploy` job 在 **38 秒**时挂掉，按耗时推断 **最可能是 `npm run build` 阶段的 TypeScript / Vite 编译报错**

### 我需要你做的（30 秒）

请点击截图里红色 ❌ **build-and-deploy** 那一栏（不是 Summary），展开里面具体的步骤列表，找到第一个红 ❌ 的步骤（大概率是 `Build project` 或 `Install dependencies`），把那一步**展开后最后 30-50 行的报错日志**发给我（截图或复制文本均可）。

重点找这两类关键词：
- `error TS` 开头 → TypeScript 类型错误
- `npm ERR!` / `ERESOLVE` → 依赖冲突
- `Cannot find module` → 引用了不存在的文件
- `dial tcp` / `ssh:` / `Permission denied` → 部署阶段 SSH 问题

### 收到日志后我会做的事

根据日志类型分别处理：

**情况 A：TypeScript 类型报错（最可能）**
- 检查 `BrandMatrixManager.tsx` / `BrandMatrixDetail.tsx` / `Index.tsx` 里对 `brand_matrix` 新字段（slug / cover_image_url / gallery_urls / long_description）和 `homepage_sections` 表的引用
- 确认 `src/integrations/supabase/types.ts` 已经包含新字段（迁移后该文件会自动重新生成，但偶尔会延迟）
- 用 `as unknown as Item[]` 这类断言绕过、或修正类型定义

**情况 B：依赖安装失败**
- 把 `npm install` 改成 `npm ci`（更严格，需要 lockfile 一致）
- 或检查 `package-lock.json` 是否漏提交

**情况 C：SSH / SCP 部署失败**
- 检查 GitHub Secrets（SERVER_HOST / SERVER_USER / SERVER_PASS）是否还有效
- 服务器是否可达、磁盘是否满

**情况 D：顺手优化（可选）**
- 把 `actions/checkout@v4` 和 `actions/setup-node@v4` 升级以消除 Node 20 deprecation warning
- `node-version: '20'` → `'22'`

### 验证方式

- 修复后我会本地等价跑 `npx tsc --noEmit` 和 `npm run build` 思路核对（我在沙盒里实际执行）
- 你重新 push 一次触发 workflow，正常应该 2-3 分钟内绿 ✅

把日志发我，马上定位。

