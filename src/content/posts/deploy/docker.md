---
title: "Docker 与 Docker Compose 完整教程：从基础到 Next.js 应用部署"
excerpt: "全面介绍 Docker 容器化技术，包括核心概念、常用命令、Dockerfile 编写、多阶段构建、Docker Compose 编排，以及 Next.js 应用的生产环境部署实践"
date: "2025-11-26"
category: "deploy"
tags: ["Docker", "Docker Compose"]
---

# Docker 与 Docker Compose 完整教程：从基础到 Next.js 应用部署

Docker 已经成为现代应用开发和部署的标准工具。本教程将从 Docker 基础概念开始，逐步深入到 Next.js 应用的容器化部署实践。

## 目录

1. [Docker 核心概念](#docker-核心概念)
2. [Docker 基础命令](#docker-基础命令)
3. [编写 Dockerfile](#编写-dockerfile)
4. [多阶段构建](#多阶段构建)
5. [Docker Compose 编排](#docker-compose-编排)
6. [Next.js 应用容器化](#nextjs-应用容器化)
7. [生产环境最佳实践](#生产环境最佳实践)
8. [常见问题与排查](#常见问题与排查)

---

## Docker 核心概念

### 什么是 Docker？

Docker 是一个开源的容器化平台，允许开发者将应用及其依赖打包到轻量级、可移植的容器中。

### 核心组件

```mermaid
graph TD
    A[Docker Client] -->|发送命令| B[Docker Daemon]
    B -->|管理| C[Container 容器]
    B -->|构建/拉取| D[Image 镜像]
    B -->|推送/拉取| E[Registry 仓库]
    D -->|实例化| C

    style A fill:#e1f5ff
    style B fill:#b3e5fc
    style C fill:#81d4fa
    style D fill:#4fc3f7
    style E fill:#29b6f6
```

#### 1. **Container (容器)**

容器是镜像的运行实例，包含应用运行所需的一切：

- 代码
- 运行时环境
- 系统工具
- 系统库
- 配置文件

**特点：**
- 轻量级 - 共享主机操作系统内核
- 隔离性 - 每个容器独立运行
- 可移植性 - 一次构建，到处运行

#### 2. **Image (镜像)**

镜像是创建容器的只读模板，包含多层文件系统：

```
Ubuntu 基础层
│
├─ Node.js 层
│  │
│  ├─ 应用依赖层
│  │  │
│  │  └─ 应用代码层
```

**镜像特点：**
- 分层存储 - 每层可以被复用
- 不可变性 - 镜像一旦创建不可修改
- 版本控制 - 通过 tag 管理不同版本

#### 3. **Registry (仓库)**

仓库用于存储和分发镜像：

- **Docker Hub** - 官方公共仓库
- **私有仓库** - 企业内部使用
- **云服务商** - AWS ECR、GCP GCR、Azure ACR

#### 4. **Dockerfile**

文本文件，包含构建镜像的指令：

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

---

## Docker 基础命令

### 镜像管理

```bash
# 搜索镜像
docker search nginx

# 拉取镜像
docker pull nginx:latest
docker pull node:20-alpine

# 列出本地镜像
docker images
docker image ls

# 查看镜像详细信息
docker inspect nginx:latest

# 删除镜像
docker rmi nginx:latest
docker image rm nginx:latest

# 清理未使用的镜像
docker image prune -a

# 构建镜像
docker build -t my-app:1.0 .
docker build -t my-app:latest --no-cache .

# 标记镜像
docker tag my-app:1.0 username/my-app:1.0

# 推送镜像到仓库
docker push username/my-app:1.0
```

### 容器管理

```bash
# 运行容器
docker run nginx
docker run -d nginx                    # 后台运行
docker run -d -p 8080:80 nginx        # 端口映射
docker run -d --name my-nginx nginx   # 指定名称
docker run -d -v /data:/data nginx    # 挂载数据卷

# 列出容器
docker ps              # 运行中的容器
docker ps -a           # 所有容器
docker ps -q           # 只显示容器 ID

# 查看容器日志
docker logs my-nginx
docker logs -f my-nginx          # 实时跟踪
docker logs --tail 100 my-nginx  # 最后 100 行

# 进入容器
docker exec -it my-nginx bash
docker exec -it my-nginx sh

# 停止容器
docker stop my-nginx
docker stop $(docker ps -q)  # 停止所有运行的容器

# 启动容器
docker start my-nginx

# 重启容器
docker restart my-nginx

# 删除容器
docker rm my-nginx
docker rm -f my-nginx        # 强制删除
docker rm $(docker ps -aq)   # 删除所有容器

# 查看容器资源使用
docker stats
docker stats my-nginx

# 查看容器详细信息
docker inspect my-nginx
```

### 网络管理

```bash
# 列出网络
docker network ls

# 创建网络
docker network create my-network

# 查看网络详情
docker network inspect my-network

# 连接容器到网络
docker network connect my-network my-nginx

# 断开网络连接
docker network disconnect my-network my-nginx

# 删除网络
docker network rm my-network
```

### 数据卷管理

```bash
# 列出数据卷
docker volume ls

# 创建数据卷
docker volume create my-data

# 查看数据卷详情
docker volume inspect my-data

# 删除数据卷
docker volume rm my-data

# 清理未使用的数据卷
docker volume prune
```

### 系统管理

```bash
# 查看 Docker 信息
docker info

# 查看 Docker 版本
docker version

# 清理系统
docker system prune              # 清理未使用的资源
docker system prune -a           # 清理所有未使用的资源
docker system prune --volumes    # 包括数据卷

# 查看磁盘使用情况
docker system df
```

---

## 编写 Dockerfile

### Dockerfile 基础指令

```dockerfile
# FROM - 指定基础镜像
FROM node:20-alpine

# LABEL - 添加元数据
LABEL maintainer="your-email@example.com"
LABEL version="1.0"
LABEL description="My Next.js Application"

# WORKDIR - 设置工作目录
WORKDIR /app

# COPY - 复制文件
COPY package*.json ./
COPY . .

# ADD - 复制并解压(支持 URL 和自动解压)
ADD https://example.com/file.tar.gz /tmp/
ADD archive.tar.gz /app/

# RUN - 执行命令(构建时)
RUN npm install
RUN npm run build

# ENV - 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# ARG - 构建参数
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine

# EXPOSE - 声明端口
EXPOSE 3000

# VOLUME - 声明数据卷
VOLUME ["/data"]

# USER - 指定运行用户
USER node

# CMD - 容器启动命令(可被覆盖)
CMD ["npm", "start"]

# ENTRYPOINT - 容器入口点(不可轻易覆盖)
ENTRYPOINT ["npm"]
CMD ["start"]  # 作为 ENTRYPOINT 的默认参数
```

### 简单示例

```dockerfile
# 基础 Node.js 应用
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]
```

### .dockerignore 文件

类似 `.gitignore`，用于排除不需要复制到镜像的文件：

```dockerignore
# 依赖目录
node_modules
npm-debug.log
yarn-error.log
.pnpm-debug.log

# Next.js
.next/
out/
build/
dist/

# 开发文件
.git
.gitignore
.env*.local
*.md
.vscode
.idea

# 测试文件
coverage/
.nyc_output/
*.test.js
*.spec.js

# 系统文件
.DS_Store
Thumbs.db

# CI/CD
.github/
.gitlab-ci.yml
```

---

## 多阶段构建

多阶段构建允许在一个 Dockerfile 中使用多个 FROM 指令，减小最终镜像大小。

### 基本概念

```mermaid
graph LR
    A[Stage 1: Build] -->|复制构建产物| B[Stage 2: Production]
    A -->|丢弃构建工具| C[减小镜像体积]

    style A fill:#e1f5ff
    style B fill:#81d4fa
    style C fill:#4fc3f7
```

### 简单示例

```dockerfile
# 阶段 1: 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 阶段 2: 生产阶段
FROM node:20-alpine AS production

WORKDIR /app

# 只复制必要的文件
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --only=production

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Next.js 多阶段构建

```dockerfile
# 阶段 1: 依赖安装
FROM node:20-alpine AS deps

WORKDIR /app

# 复制依赖文件
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# 根据包管理器安装依赖
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 阶段 2: 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED=1

# 构建应用
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 阶段 3: 生产运行
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 多阶段构建优势

1. **减小镜像体积** - 只包含运行时必需的文件
2. **提高安全性** - 不包含构建工具和源代码
3. **缓存优化** - 依赖层可以被缓存复用
4. **清晰分离** - 构建环境和运行环境分离

### 镜像大小对比

```bash
# 单阶段构建
node:20-alpine + 源代码 + node_modules + 构建工具
≈ 1.2 GB

# 多阶段构建
node:20-alpine + 构建产物 + 生产依赖
≈ 200 MB
```

---

## Docker Compose 编排

Docker Compose 是用于定义和运行多容器 Docker 应用的工具。

### 基本概念

```mermaid
graph TD
    A[docker-compose.yml] -->|定义| B[Service: Web]
    A -->|定义| C[Service: Database]
    A -->|定义| D[Service: Redis]
    B -->|依赖| C
    B -->|依赖| D
    B -->|连接| E[Network: app-network]
    C -->|连接| E
    D -->|连接| E
    C -->|挂载| F[Volume: db-data]

    style A fill:#e1f5ff
    style B fill:#b3e5fc
    style C fill:#81d4fa
    style D fill:#4fc3f7
```

### 基础示例

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Web 服务
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
      - redis

  # 数据库服务
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: mydb
    volumes:
      - db-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis 缓存
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  db-data:
```

### Next.js 完整示例

```yaml
version: '3.8'

services:
  # Next.js 应用
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NODE_VERSION=20
    container_name: nextjs-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-network
    volumes:
      - ./logs:/app/logs

  # PostgreSQL 数据库
  postgres:
    image: postgres:16-alpine
    container_name: postgres-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis 缓存
  redis:
    image: redis:7-alpine
    container_name: redis-cache
    restart: unless-stopped
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

  # Nginx 反向代理(可选)
  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - nextjs
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
```

### Docker Compose 命令

```bash
# 启动所有服务
docker-compose up
docker-compose up -d                    # 后台运行

# 启动特定服务
docker-compose up nextjs postgres

# 构建镜像
docker-compose build
docker-compose build --no-cache        # 不使用缓存

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs
docker-compose logs -f nextjs          # 实时跟踪特定服务
docker-compose logs --tail=100         # 最后 100 行

# 停止服务
docker-compose stop
docker-compose stop nextjs             # 停止特定服务

# 停止并删除容器
docker-compose down
docker-compose down -v                 # 同时删除数据卷
docker-compose down --rmi all         # 同时删除镜像

# 重启服务
docker-compose restart
docker-compose restart nextjs

# 执行命令
docker-compose exec nextjs sh
docker-compose exec postgres psql -U postgres

# 查看配置
docker-compose config

# 拉取镜像
docker-compose pull

# 扩展服务
docker-compose up --scale nextjs=3
```

### 环境变量管理

```yaml
# docker-compose.yml
services:
  nextjs:
    env_file:
      - .env
      - .env.production
    environment:
      - NODE_ENV=production
      - PORT=3000
```

```.env
# .env 文件
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_API_URL=https://api.example.com
SECRET_KEY=your-secret-key
```

---

## Next.js 应用容器化

### 配置 Next.js

首先，需要在 `next.config.js` 中启用 standalone 输出模式：

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 standalone 输出
  output: 'standalone',

  // 其他配置
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

### 完整 Dockerfile

```dockerfile
# 依赖安装阶段
FROM node:20-alpine AS deps

# 检查 libc 兼容性
RUN apk add --no-cache libc6-compat

WORKDIR /app

# 复制依赖文件
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# 根据锁文件安装依赖
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 禁用遥测
ENV NEXT_TELEMETRY_DISABLED=1

# 构建参数
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# 构建应用
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 生产运行阶段
FROM node:20-alpine AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要文件
COPY --from=builder /app/public ./public

# 复制 standalone 输出
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["node", "server.js"]
```

### 构建和运行

```bash
# 构建镜像
docker build -t nextjs-app .

# 使用构建参数
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  -t nextjs-app:1.0 .

# 运行容器
docker run -d \
  --name nextjs \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  nextjs-app:1.0

# 查看日志
docker logs -f nextjs

# 停止容器
docker stop nextjs
```

### 使用 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres-data:
```

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

## 生产环境最佳实践

### 1. 镜像优化

#### 使用 Alpine 镜像

```dockerfile
# 推荐: 使用 Alpine 版本(体积更小)
FROM node:20-alpine

# 避免: 使用完整版本
FROM node:20
```

#### 多阶段构建

```dockerfile
# 只复制必要的构建产物
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
```

#### 合并 RUN 指令

```dockerfile
# 推荐: 合并命令减少层数
RUN apk add --no-cache libc6-compat && \
    npm ci --only=production && \
    npm cache clean --force

# 避免: 多个 RUN 指令
RUN apk add --no-cache libc6-compat
RUN npm ci --only=production
RUN npm cache clean --force
```

### 2. 安全实践

#### 使用非 root 用户

```dockerfile
# 创建专用用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 切换用户
USER nextjs

# 确保文件权限正确
COPY --chown=nextjs:nodejs /app/.next ./
```

#### 扫描漏洞

```bash
# 使用 Docker Scout 扫描
docker scout cves nextjs-app:latest

# 使用 Trivy 扫描
trivy image nextjs-app:latest
```

#### 最小化攻击面

```dockerfile
# 只安装生产依赖
RUN npm ci --only=production

# 移除不必要的文件
RUN rm -rf /tmp/* /var/cache/apk/*
```

### 3. 健康检查

```dockerfile
# 添加健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

```yaml
# docker-compose.yml 中的健康检查
services:
  nextjs:
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 4. 资源限制

```yaml
services:
  nextjs:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    restart: unless-stopped
```

### 5. 日志管理

```yaml
services:
  nextjs:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

```bash
# 查看日志
docker-compose logs -f --tail=100 nextjs

# 清理日志
docker-compose down && docker-compose up -d
```

### 6. 环境变量安全

```yaml
# 使用 secrets(Docker Swarm)
secrets:
  db_password:
    external: true

services:
  nextjs:
    secrets:
      - db_password
```

```bash
# 从文件加载敏感信息
echo "my-secret-password" | docker secret create db_password -
```

### 7. 网络安全

```yaml
networks:
  # 前端网络
  frontend:
    driver: bridge

  # 后端网络(隔离数据库)
  backend:
    driver: bridge
    internal: true  # 禁止外部访问

services:
  nextjs:
    networks:
      - frontend
      - backend

  postgres:
    networks:
      - backend  # 只在后端网络
```

### 8. 备份策略

```bash
# 备份数据卷
docker run --rm \
  -v postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup-$(date +%Y%m%d).tar.gz /data

# 恢复数据卷
docker run --rm \
  -v postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/postgres-backup-20250126.tar.gz -C /
```

---

## 常见问题与排查

### 1. 构建问题

#### 问题：构建很慢

```dockerfile
# 解决方案: 优化层缓存

# 推荐: 先复制依赖文件
COPY package*.json ./
RUN npm ci

# 再复制源代码
COPY . .
RUN npm run build

# 避免: 一次性复制所有文件
COPY . .
RUN npm ci && npm run build
```

#### 问题：node_modules 太大

```dockerignore
# 确保 .dockerignore 排除 node_modules
node_modules
.next
.git
```

### 2. 运行问题

#### 问题：容器启动后立即退出

```bash
# 查看日志
docker logs nextjs

# 常见原因:
# 1. CMD 命令错误
# 2. 端口冲突
# 3. 环境变量缺失
```

#### 问题：无法访问服务

```bash
# 检查端口映射
docker ps

# 检查容器内部
docker exec -it nextjs sh
curl http://localhost:3000

# 检查防火墙
sudo ufw status
```

### 3. 网络问题

#### 问题：容器间无法通信

```yaml
# 确保在同一网络
services:
  nextjs:
    networks:
      - app-network
  postgres:
    networks:
      - app-network

networks:
  app-network:
```

```bash
# 检查网络连接
docker-compose exec nextjs ping postgres
```

### 4. 性能问题

#### 问题：Mac/Windows 上文件 I/O 慢

```yaml
# 使用命名卷而不是绑定挂载
volumes:
  - node_modules:/app/node_modules

# 而不是
volumes:
  - ./node_modules:/app/node_modules
```

#### 问题：内存不足

```bash
# 增加 Docker 内存限制
# Docker Desktop -> Settings -> Resources -> Memory

# 或在 docker-compose.yml 中限制
deploy:
  resources:
    limits:
      memory: 2G
```

### 5. 调试技巧

```bash
# 进入运行中的容器
docker exec -it nextjs sh

# 检查环境变量
docker exec nextjs env

# 检查进程
docker exec nextjs ps aux

# 检查文件
docker exec nextjs ls -la /app

# 复制文件出来检查
docker cp nextjs:/app/.next ./debug-next

# 查看容器详细信息
docker inspect nextjs

# 查看资源使用
docker stats nextjs
```

### 6. 清理和维护

```bash
# 清理未使用的资源
docker system prune -a

# 清理特定类型
docker image prune      # 清理镜像
docker container prune  # 清理容器
docker volume prune     # 清理数据卷
docker network prune    # 清理网络

# 查看磁盘使用
docker system df

# 查看详细信息
docker system df -v
```

---

## 总结

### Docker 核心要点

1. **容器化优势**
   - 环境一致性
   - 快速部署
   - 资源隔离
   - 易于扩展

2. **最佳实践**
   - 使用多阶段构建
   - 优化镜像层缓存
   - 使用非 root 用户
   - 实施健康检查

3. **Next.js 特殊配置**
   - 启用 `output: 'standalone'`
   - 正确复制 `.next/standalone` 和 `.next/static`
   - 配置环境变量
   - 使用适当的基础镜像

### 生产部署检查清单

- [ ] 启用多阶段构建
- [ ] 使用 Alpine 基础镜像
- [ ] 配置 .dockerignore
- [ ] 使用非 root 用户运行
- [ ] 实施健康检查
- [ ] 设置资源限制
- [ ] 配置日志轮转
- [ ] 实施安全扫描
- [ ] 配置备份策略
- [ ] 设置监控告警

### 参考资源

- [Docker 官方文档](https://docs.docker.com/)
- [Next.js 部署文档](https://nextjs.org/docs/app/getting-started/deploying)
- [Docker Hub](https://hub.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Next.js with Docker 示例](https://github.com/vercel/next.js/tree/canary/examples/with-docker)

通过本教程，你应该能够：
- 理解 Docker 核心概念和工作原理
- 编写优化的 Dockerfile 和 Docker Compose 配置
- 将 Next.js 应用容器化并部署到生产环境
- 排查常见的 Docker 问题
- 遵循生产环境最佳实践

Docker 和容器化技术是现代应用部署的基础设施，掌握这些技能将极大提升你的开发和运维能力。
