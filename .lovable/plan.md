
## GitHub Actions 连续失败修复方案

### 结论
从你给的截图看，失败已经连续出现在很多次彼此无关的提交上，所以问题基本不是某一版页面代码，而是部署链路本身有固定错误。当前最可疑的是 `.github/workflows/deploy.yml` 里的这几处：

1. **把服务器用户写死成了 `ubuntu:ubuntu`**
   - 现在 workflow 登录用的是 `SERVER_USER`
   - 但准备目录时却执行：`sudo chown -R ubuntu:ubuntu /tmp/deploy`
   - 只要你的真实服务器用户不是 `ubuntu`，这里就会稳定失败

2. **依赖 `sudo` 的远程命令很可能不能无密码执行**
   - 现在远程步骤里有 `sudo mkdir`、`sudo rm`、`sudo cp`、`sudo chown`
   - GitHub Actions 通过 SSH 连上去后，不会自动帮你输入 sudo 密码
   - 如果服务器没有给该用户配置 `NOPASSWD`，这些步骤会全部报错

3. **现在日志不够清楚，Summary 页面看不出是哪个步骤挂掉**
   - 你截图里看到的 Node.js 20 deprecation 只是 warning，不是失败原因
   - 真正失败点大概率在 SSH / SCP / sudo 阶段

### 要实施的修复

#### 1) 重写 deploy workflow，先把“固定会踩雷”的地方去掉
把当前部署阶段改成“用户可写目录 + 明确日志 + 可选端口”的方式：

- 增加 `SERVER_PORT`
- 去掉写死的 `ubuntu:ubuntu`
- 先上传到用户自己的临时目录
- 只在最后一步做必要的发布动作
- 每一步都输出明确检查信息，方便下次直接定位

建议改动方向：

```yaml
- name: Prepare remote directory
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    password: ${{ secrets.SERVER_PASS }}
    port: ${{ secrets.SERVER_PORT || 22 }}
    script: |
      whoami
      pwd
      mkdir -p ~/deploy/boomeroff
      rm -rf ~/deploy/boomeroff/*
      test -w ~/deploy/boomeroff

- name: Upload dist
  uses: appleboy/scp-action@master
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    password: ${{ secrets.SERVER_PASS }}
    port: ${{ secrets.SERVER_PORT || 22 }}
    source: "dist/*"
    target: "~/deploy/boomeroff"

- name: Publish files
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    password: ${{ secrets.SERVER_PASS }}
    port: ${{ secrets.SERVER_PORT || 22 }}
    script: |
      df -h
      ls -la ~/deploy/boomeroff
      sudo -n true
      sudo rm -rf /var/www/boomeroff/*
      sudo cp -a ~/deploy/boomeroff/. /var/www/boomeroff/
      sudo chown -R www-data:www-data /var/www/boomeroff/
```

#### 2) 处理 sudo 风险
这里分两种情况：

**方案 A：服务器支持无密码 sudo**
- 保留最后一步 `sudo cp` / `sudo chown`
- 但先加 `sudo -n true`
- 如果失败，日志会直接明确告诉你是 sudo 权限问题

**方案 B：服务器不支持无密码 sudo**
- 不再让 GitHub Actions 直接改 `/var/www/boomeroff`
- 改成上传到部署用户自己的目录
- 服务器上单独配置一次权限或发布脚本，让网站目录对部署用户可写
- 这是更稳的长期方案

#### 3) 把“硬编码用户”改掉
当前这句必须改：
```yaml
sudo chown -R ubuntu:ubuntu /tmp/deploy
```

应改为以下两种之一：

- 直接删掉，不做这步
- 或改成基于登录用户的目录，不再碰 `/tmp/deploy`
- 如果必须保留所有权调整，也不能写死 ubuntu

#### 4) 给 workflow 加诊断信息
为了避免下次只看到一个红叉，看不到根因，会补这些检查：

- `whoami`
- `pwd`
- `ls -la`
- `df -h`
- `test -w <deploy-dir>`
- `sudo -n true`

这样下次一眼就知道是：
- SSH 连不上
- 端口不对
- 密码不对
- 目录没权限
- sudo 不可用
- 磁盘满了

### 需要同步核对的 GitHub Secrets
会检查这些 secrets 是否齐全且匹配服务器真实情况：

- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_PASS`
- `SERVER_PORT`（如果不是 22，必须补）

### 代码层面的判断
目前从项目文件看，前端路由和构建配置没有明显能解释“所有提交都持续失败”的共性问题；这更像是 CI/CD 配置问题，而不是最近品牌矩阵、详情页、后台按钮这些功能本身的问题。

### 顺手补的一个发布后问题
你的项目现在用了 `react-router-dom` 的 `BrowserRouter`，并且新增了：
- `/brand-matrix/:slug`
- `/admin/*`

如果你是自建服务器部署，不是平台托管，那么发布成功后还需要补 **SPA 路由回退**，否则用户刷新详情页会 404。

需要在服务器 Web 配置里做：
- 所有非静态资源请求回退到 `index.html`

例如 Nginx 思路：
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### 完成后的验证标准
修复后一次正常部署应当表现为：

1. `Install dependencies` 成功
2. `Build project` 成功
3. `Prepare remote directory` 成功
4. `Upload dist` 成功
5. `Publish files` 成功
6. 网站首页和 `/brand-matrix/...` 刷新可正常打开

### 本次会改的文件
- `.github/workflows/deploy.yml`

### 本次不动的内容
- 前端业务页面
- 品牌矩阵数据结构
- 后台功能逻辑

### 技术细节
- 根因优先级最高的是：`ubuntu` 写死 + `sudo` 非交互失败
- Node 20 annotation 只是 GitHub 的提示，不是导致红叉的原因
- 若你后续愿意，我会把 workflow 改成“更稳的发布版”，优先支持：
  - 自定义端口
  - 用户目录中转
  - 明确日志
  - SPA 刷新兼容
