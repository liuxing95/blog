# 部署指南

本文档介绍如何将博客部署到 Vercel 以及配置 GitHub Actions CI/CD 流程。

## 快速部署到 Vercel

### 方式一：通过 Vercel Dashboard

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. Vercel 会自动检测为 Next.js 项目并使用默认配置
5. 点击 "Deploy" 开始部署

### 方式二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 在项目根目录运行
vercel

# 生产环境部署
vercel --prod
```

## GitHub Actions CI/CD 配置

### 1. 设置 GitHub Secrets

在你的 GitHub 仓库中，进入 `Settings > Secrets and variables > Actions`，添加以下 secrets：

- `VERCEL_TOKEN`: 在 [Vercel Dashboard](https://vercel.com/account/tokens) 创建
- `VERCEL_ORG_ID`: 在项目的 `.vercel/project.json` 文件中找到
- `VERCEL_PROJECT_ID`: 在项目的 `.vercel/project.json` 文件中找到

### 2. 获取 Vercel Token

1. 访问 [Vercel Tokens 页面](https://vercel.com/account/tokens)
2. 点击 "Create Token"
3. 选择合适的 scope（建议选择具体项目）
4. 复制生成的 token 并添加到 GitHub Secrets

### 3. 获取 Project 信息

在本地运行一次 `vercel` 命令后，会生成 `.vercel/project.json` 文件：

```bash
vercel link
```

文件内容类似：
```json
{
  "projectId": "prj_xxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxx"
}
```

将这些值添加到 GitHub Secrets 中。

## 工作流说明

### CI/CD 触发条件

- **推送到 main 分支**: 触发完整的 CI/CD 流程，包括代码检查、构建和生产环境部署
- **推送到 develop 分支**: 只进行代码检查和构建
- **Pull Request**: 进行代码检查、构建并创建预览部署

### 工作流步骤

1. **代码质量检查**
   - TypeScript 类型检查
   - ESLint 代码规范检查
   - 项目构建测试

2. **自动部署**
   - main 分支推送 → 生产环境部署
   - Pull Request → 预览环境部署

3. **预览链接**
   - PR 会自动评论预览链接
   - 方便团队协作和代码审查

## 环境变量配置

### 本地开发

1. 复制 `.env.example` 为 `.env.local`
2. 填入实际的环境变量值

### Vercel 环境变量

在 Vercel Dashboard 的项目设置中配置：

1. 进入项目的 Settings
2. 找到 Environment Variables
3. 添加必要的环境变量

常用环境变量：
- `NEXT_PUBLIC_SITE_URL`: 网站 URL
- `NEXT_PUBLIC_SITE_NAME`: 网站名称
- `NODE_ENV`: 运行环境

## 自定义域名

1. 在 Vercel Dashboard 进入项目
2. 转到 Settings > Domains
3. 添加你的自定义域名
4. 根据提示配置 DNS 记录

### DNS 配置示例

对于域名 `your-domain.com`：

```
Type    Name    Value
A       @       76.76.19.61
CNAME   www     cname.vercel-dns.com
```

## 性能优化

### 构建优化

项目已配置：
- Next.js Turbopack (开发和构建)
- 自动代码分割
- 静态资源优化
- Mermaid 图表懒加载

### Vercel 优化

- 启用了边缘函数
- 配置了合适的缓存头
- 添加了安全头
- 选择了亚洲地区节点 (hkg1, sin1)

## 监控和分析

- Vercel Analytics: 自动启用
- 构建日志: 在 Vercel Dashboard 查看
- GitHub Actions 日志: 在 Actions 选项卡查看

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 TypeScript 错误
   - 确认所有依赖都已正确安装
   - 查看构建日志中的具体错误

2. **部署失败**
   - 检查 Vercel token 是否有效
   - 确认项目 ID 和组织 ID 正确
   - 查看 GitHub Actions 日志

3. **环境变量问题**
   - 确认在 Vercel 中配置了必要的环境变量
   - 注意 `NEXT_PUBLIC_` 前缀的变量会暴露到客户端

### 调试命令

```bash
# 本地构建测试
npm run build

# 类型检查
npm run type-check

# 代码规范检查
npm run lint

# 本地启动生产版本
npm run start
```

## 后续步骤

- [ ] 配置自定义域名
- [ ] 设置 Google Analytics
- [ ] 添加 RSS 订阅功能
- [ ] 配置评论系统
- [ ] 添加搜索功能