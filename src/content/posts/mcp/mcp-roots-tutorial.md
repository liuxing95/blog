---
title: 'MCP Roots 完全指南'
date: '2025-11-13'
excerpt: 'Model Context Protocol (MCP) Roots - 文件系统边界管理深度解析'
tags: ['AI', 'MCP']
series: 'AI学习'
---

# MCP Roots 完全指南

> Model Context Protocol (MCP) Roots - 文件系统边界管理深度解析

## 目录

- [概述](#概述)
- [核心概念](#核心概念)
- [协议规范](#协议规范)
- [工作流程](#工作流程)
- [实现示例](#实现示例)
- [最佳实践](#最佳实践)
- [安全指南](#安全指南)

---

## 概述

### 什么是 MCP Roots？

**Roots** 是 MCP 客户端向服务器暴露的文件系统边界，定义了服务器可以访问的目录和文件范围。这是一个**客户端提供的能力**，用于保护用户的文件系统安全。

### 为什么需要 Roots？

```
没有 Roots 的风险:
┌──────────────────────────────────────────────┐
│  Server 可以访问整个文件系统:                  │
│  /                                           │
│  ├── home/                                   │
│  │   ├── user/                               │
│  │   │   ├── documents/         ← 项目文件   │
│  │   │   ├── .ssh/              ← 危险！     │
│  │   │   ├── secrets.txt        ← 危险！     │
│  │   │   └── passwords.db       ← 危险！     │
│  │   └── other-user/            ← 危险！     │
│  ├── etc/                       ← 危险！     │
│  └── system/                    ← 危险！     │
└──────────────────────────────────────────────┘

使用 Roots 的安全方案:
┌──────────────────────────────────────────────┐
│  Client 定义允许的 Roots:                      │
│                                              │
│  Root 1: file:///home/user/project-a         │
│  Root 2: file:///home/user/project-b         │
│                                              │
│  Server 只能访问:                             │
│  ✅ /home/user/project-a/                    │
│  ✅ /home/user/project-b/                    │
│  ❌ /home/user/.ssh/                         │
│  ❌ /home/user/secrets.txt                   │
│  ❌ /etc/passwd                              │
└──────────────────────────────────────────────┘
```

### 核心价值

- 🛡️ **安全隔离**: 限制服务器只能访问允许的目录
- 🎯 **精确控制**: 用户明确授权哪些路径可被访问
- 🔄 **动态管理**: 支持运行时添加/移除 Roots
- 📢 **变化通知**: 当 Roots 变化时通知服务器

---

## 核心概念

### MCP 架构中的 Roots

```
┌────────────────────────────────────────────────────────┐
│                    MCP Client                           │
│  (Claude Desktop, VS Code, IDE)                        │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Roots Manager                          │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  Allowed Roots:                            │ │  │
│  │  │  • file:///home/user/project-a             │ │  │
│  │  │  • file:///home/user/project-b             │ │  │
│  │  │  • file:///workspace/shared                │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                  │  │
│  │  功能:                                            │  │
│  │  • 管理 Root 列表                                │  │
│  │  • 响应 roots/list 请求                         │  │
│  │  • 监控路径变化                                  │  │
│  │  • 发送变化通知                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│         ↕ JSON-RPC 2.0 (stdio/HTTP+SSE)                │
└────────────────────────────────────────────────────────┘
                        ↕
┌────────────────────────────────────────────────────────┐
│                    MCP Server                           │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           File Operations                        │  │
│  │                                                  │  │
│  │  1. 请求 Roots 列表                              │  │
│  │     roots/list →                                │  │
│  │     ← [root1, root2, ...]                       │  │
│  │                                                  │  │
│  │  2. 验证文件路径                                 │  │
│  │     ✅ /home/user/project-a/src/main.ts         │  │
│  │     ❌ /etc/passwd (超出范围)                    │  │
│  │                                                  │  │
│  │  3. 安全地执行文件操作                           │  │
│  │     读取、写入、列出目录等                        │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Root 的数据结构

```typescript
interface Root {
  uri: string;    // 必需：file:// URI
  name?: string;  // 可选：人类可读的名称
}

// 示例
{
  uri: "file:///home/user/projects/my-app",
  name: "My Application"
}
```

---

## 协议规范

### 1. 能力声明

客户端必须在初始化时声明 `roots` 能力：

```typescript
// Client 初始化
{
  "capabilities": {
    "roots": {
      "listChanged": true  // 是否支持变化通知
    }
  }
}
```

**参数说明：**

- `listChanged`: 布尔值，表示客户端是否会在 Roots 列表变化时发送通知

### 2. 列出 Roots (roots/list)

服务器通过发送 `roots/list` 请求获取允许的 Roots：

**请求格式：**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "roots/list"
}
```

**响应格式：**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "roots": [
      {
        "uri": "file:///home/user/projects/my-app",
        "name": "My Application"
      },
      {
        "uri": "file:///home/user/projects/shared-lib",
        "name": "Shared Library"
      },
      {
        "uri": "file:///workspace/docs",
        "name": "Documentation"
      }
    ]
  }
}
```

### 3. Roots 变化通知 (notifications/roots/list_changed)

当 Roots 列表发生变化时，客户端发送通知：

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/roots/list_changed"
}
```

**注意：**

- 通知不包含新的 Roots 列表
- 服务器收到通知后应重新请求 `roots/list`
- 只有声明了 `listChanged: true` 的客户端才会发送此通知

---

## 工作流程

### 完整的 Roots 工作流

```
┌─────────────────────────────────────────────────────────┐
│  阶段 1: 初始化和能力协商                                 │
└─────────────────────────────────────────────────────────┘

Client → Server: initialize request
{
  clientInfo: { name: "Claude Desktop" },
  capabilities: {
    roots: { listChanged: true }  ← 声明支持 Roots
  }
}

Server → Client: initialize response
{
  serverInfo: { name: "My MCP Server" },
  capabilities: {
    tools: {},
    resources: {}
  }
}

✅ 双方知道彼此的能力

┌─────────────────────────────────────────────────────────┐
│  阶段 2: 服务器请求 Roots                                 │
└─────────────────────────────────────────────────────────┘

Server → Client: roots/list request
{
  jsonrpc: "2.0",
  id: 1,
  method: "roots/list"
}

Client 内部处理:
┌──────────────────────────────────┐
│ 1. 收集当前打开的项目             │
│ 2. 检查用户权限设置               │
│ 3. 构建 Roots 列表                │
└──────────────────────────────────┘

Client → Server: roots/list response
{
  jsonrpc: "2.0",
  id: 1,
  result: {
    roots: [
      { uri: "file:///home/user/project-a", name: "Project A" },
      { uri: "file:///home/user/project-b", name: "Project B" }
    ]
  }
}

Server 缓存 Roots 信息:
┌──────────────────────────────────┐
│ cachedRoots = [                   │
│   "file:///home/user/project-a", │
│   "file:///home/user/project-b"  │
│ ]                                │
└──────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  阶段 3: 服务器使用 Roots 验证路径                        │
└─────────────────────────────────────────────────────────┘

Server 需要读取文件: /home/user/project-a/src/main.ts

验证流程:
┌──────────────────────────────────────────────────┐
│ 1. 规范化路径                                     │
│    /home/user/project-a/src/main.ts             │
│    ↓                                             │
│    file:///home/user/project-a/src/main.ts      │
│                                                  │
│ 2. 检查是否匹配任何 Root                          │
│    file:///home/user/project-a/src/main.ts      │
│    startsWith(file:///home/user/project-a) ?    │
│    ✅ YES                                        │
│                                                  │
│ 3. 允许访问                                      │
└──────────────────────────────────────────────────┘

Server 执行文件操作:
const content = await fs.readFile(
  "/home/user/project-a/src/main.ts"
);

另一个示例 - 拒绝访问:
Server 尝试访问: /etc/passwd

验证流程:
┌──────────────────────────────────────────────────┐
│ 1. 规范化路径                                     │
│    file:///etc/passwd                            │
│                                                  │
│ 2. 检查是否匹配任何 Root                          │
│    file:///etc/passwd                            │
│    startsWith(file:///home/user/project-a) ?    │
│    ❌ NO                                         │
│    startsWith(file:///home/user/project-b) ?    │
│    ❌ NO                                         │
│                                                  │
│ 3. 拒绝访问                                      │
└──────────────────────────────────────────────────┘

❌ Error: Access denied - path outside allowed roots

┌─────────────────────────────────────────────────────────┐
│  阶段 4: 动态更新 Roots                                   │
└─────────────────────────────────────────────────────────┘

User 操作: 打开新项目 "project-c"

Client 内部更新:
┌──────────────────────────────────┐
│ roots.push({                     │
│   uri: "file:///home/user/       │
│         project-c",              │
│   name: "Project C"              │
│ })                               │
└──────────────────────────────────┘

Client → Server: 发送变化通知
{
  jsonrpc: "2.0",
  method: "notifications/roots/list_changed"
}

Server 收到通知:
┌──────────────────────────────────┐
│ 1. 清除缓存的 Roots               │
│ 2. 重新请求 roots/list            │
└──────────────────────────────────┘

Server → Client: roots/list
Client → Server: 返回更新后的列表 (包含 project-c)

Server 更新缓存:
┌──────────────────────────────────┐
│ cachedRoots = [                   │
│   "file:///home/user/project-a", │
│   "file:///home/user/project-b", │
│   "file:///home/user/project-c"  │ ← 新增
│ ]                                │
└──────────────────────────────────┘

✅ Server 现在可以访问 project-c
```

### 典型使用场景

#### 场景 1: IDE/编辑器集成

```
用户打开 VS Code，有 3 个工作区文件夹:

VS Code 工作区:
├── /home/user/frontend (React 项目)
├── /home/user/backend (Node.js API)
└── /home/user/shared (共享库)

MCP Client (VS Code 扩展) 暴露这些为 Roots:

roots: [
  {
    uri: "file:///home/user/frontend",
    name: "Frontend (React)"
  },
  {
    uri: "file:///home/user/backend",
    name: "Backend (Node.js)"
  },
  {
    uri: "file:///home/user/shared",
    name: "Shared Libraries"
  }
]

MCP Server 可以:
✅ 读取 /home/user/frontend/src/App.tsx
✅ 修改 /home/user/backend/api/routes.js
✅ 列出 /home/user/shared/utils/
❌ 访问 /home/user/documents/
❌ 访问 /home/user/.ssh/
```

#### 场景 2: 版本控制集成

```
用户克隆了多个 Git 仓库:

Git 仓库:
├── /repositories/project-main
├── /repositories/project-docs
└── /repositories/project-tools

MCP Server 实现 Git 操作工具，需要访问这些仓库:

Client 暴露 Roots:
roots: [
  {
    uri: "file:///repositories/project-main",
    name: "Main Repository"
  },
  {
    uri: "file:///repositories/project-docs",
    name: "Documentation"
  },
  {
    uri: "file:///repositories/project-tools",
    name: "Build Tools"
  }
]

Server Tool: git_status
✅ 可以读取 .git/ 目录
✅ 可以执行 git 命令
❌ 不能访问其他目录
```

#### 场景 3: 临时项目访问

```
用户想临时授权 Server 访问一个目录:

初始状态:
roots: [
  { uri: "file:///home/user/work/project-a" }
]

用户操作: "让 AI 访问我的临时脚本目录"

Client 动态添加 Root:
roots.push({
  uri: "file:///home/user/temp-scripts",
  name: "Temporary Scripts"
})

发送通知 → Server 重新获取 Roots

现在 Server 可以:
✅ 访问 /home/user/temp-scripts/
✅ 仍然可以访问 project-a

稍后用户移除临时访问:
roots = roots.filter(r => r.uri !== "file:///home/user/temp-scripts")

发送通知 → Server 更新

现在 Server:
❌ 不能再访问 temp-scripts/
✅ 仍然可以访问 project-a
```

---

## 实现示例

### TypeScript Client 实现

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { RootsListRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import * as path from 'path';
import * as fs from 'fs/promises';

interface Root {
  uri: string;
  name?: string;
}

class RootsManager {
  private client: Client;
  private allowedRoots: Root[];
  private watchers: Map<string, fs.FSWatcher> = new Map();

  constructor(client: Client) {
    this.client = client;
    this.allowedRoots = [];
    this.setupHandlers();
  }

  private setupHandlers() {
    // 处理 roots/list 请求
    this.client.setRequestHandler(RootsListRequestSchema, async () => {
      console.log('[Roots] Server requested roots list');
      return {
        roots: this.allowedRoots,
      };
    });
  }

  // ========== Root 管理 ==========

  async addRoot(dirPath: string, name?: string): Promise<void> {
    // 1. 验证路径存在
    try {
      const stats = await fs.stat(dirPath);
      if (!stats.isDirectory()) {
        throw new Error(`${dirPath} is not a directory`);
      }
    } catch (error) {
      throw new Error(`Invalid path: ${dirPath}`);
    }

    // 2. 规范化路径
    const normalized = path.resolve(dirPath);
    const uri = `file://${normalized}`;

    // 3. 检查是否已存在
    if (this.allowedRoots.some((r) => r.uri === uri)) {
      console.log(`[Roots] Root already exists: ${uri}`);
      return;
    }

    // 4. 添加 Root
    this.allowedRoots.push({
      uri,
      name: name || path.basename(normalized),
    });

    console.log(`[Roots] Added root: ${uri}`);

    // 5. 监控目录变化（可选）
    this.watchRoot(normalized);

    // 6. 通知 Server
    await this.notifyRootsChanged();
  }

  async removeRoot(uri: string): Promise<void> {
    const index = this.allowedRoots.findIndex((r) => r.uri === uri);

    if (index === -1) {
      console.log(`[Roots] Root not found: ${uri}`);
      return;
    }

    // 移除 Root
    this.allowedRoots.splice(index, 1);

    console.log(`[Roots] Removed root: ${uri}`);

    // 停止监控
    const dirPath = uri.replace('file://', '');
    this.unwatchRoot(dirPath);

    // 通知 Server
    await this.notifyRootsChanged();
  }

  getRoots(): Root[] {
    return [...this.allowedRoots];
  }

  hasRoot(uri: string): boolean {
    return this.allowedRoots.some((r) => r.uri === uri);
  }

  // ========== 路径验证 ==========

  isPathAllowed(filePath: string): boolean {
    const normalized = path.resolve(filePath);
    const fileUri = `file://${normalized}`;

    return this.allowedRoots.some((root) => fileUri.startsWith(root.uri));
  }

  validatePath(filePath: string): { valid: boolean; error?: string } {
    // 1. 规范化路径
    const normalized = path.resolve(filePath);
    const fileUri = `file://${normalized}`;

    // 2. 检查危险模式
    const dangerous = ['../..', '~', '/etc/', '/sys/', '/proc/'];
    for (const pattern of dangerous) {
      if (normalized.includes(pattern)) {
        return {
          valid: false,
          error: `Path contains dangerous pattern: ${pattern}`,
        };
      }
    }

    // 3. 检查是否在允许的 Roots 内
    const matchedRoot = this.allowedRoots.find((root) => fileUri.startsWith(root.uri));

    if (!matchedRoot) {
      return {
        valid: false,
        error: `Path outside allowed roots.\nAllowed:\n${this.allowedRoots
          .map((r) => `  - ${r.name}: ${r.uri}`)
          .join('\n')}`,
      };
    }

    return { valid: true };
  }

  // ========== 目录监控 ==========

  private watchRoot(dirPath: string): void {
    if (this.watchers.has(dirPath)) {
      return; // 已经在监控
    }

    try {
      const watcher = fs.watch(dirPath, { recursive: false }, (eventType, filename) => {
        console.log(`[Roots] Directory change detected: ${eventType} - ${filename}`);
        // 可以在这里实现更精细的逻辑
      });

      this.watchers.set(dirPath, watcher as any);
      console.log(`[Roots] Watching directory: ${dirPath}`);
    } catch (error) {
      console.error(`[Roots] Failed to watch directory: ${error}`);
    }
  }

  private unwatchRoot(dirPath: string): void {
    const watcher = this.watchers.get(dirPath);
    if (watcher) {
      watcher.close();
      this.watchers.delete(dirPath);
      console.log(`[Roots] Stopped watching: ${dirPath}`);
    }
  }

  // ========== 通知 ==========

  private async notifyRootsChanged(): Promise<void> {
    try {
      await this.client.notification({
        method: 'notifications/roots/list_changed',
      });
      console.log('[Roots] Sent list_changed notification');
    } catch (error) {
      console.error('[Roots] Failed to send notification:', error);
    }
  }

  // ========== 清理 ==========

  cleanup(): void {
    // 停止所有监控
    for (const [dirPath, watcher] of this.watchers.entries()) {
      watcher.close();
      console.log(`[Roots] Stopped watching: ${dirPath}`);
    }
    this.watchers.clear();
  }
}

// ========== 使用示例 ==========

async function exampleUsage() {
  const client = new Client(
    {
      name: 'my-client',
      version: '1.0.0',
    },
    {
      capabilities: {
        roots: {
          listChanged: true,
        },
      },
    },
  );

  const rootsManager = new RootsManager(client);

  // 添加 Roots
  await rootsManager.addRoot('/home/user/projects/app-a', 'Application A');
  await rootsManager.addRoot('/home/user/projects/app-b', 'Application B');

  // 验证路径
  const validation1 = rootsManager.validatePath('/home/user/projects/app-a/src/main.ts');
  console.log('Validation 1:', validation1); // { valid: true }

  const validation2 = rootsManager.validatePath('/etc/passwd');
  console.log('Validation 2:', validation2); // { valid: false, error: "..." }

  // 移除 Root
  await rootsManager.removeRoot('file:///home/user/projects/app-b');

  // 清理
  rootsManager.cleanup();
}
```

### TypeScript Server 实现

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';

interface Root {
  uri: string;
  name?: string;
}

class RootsAwareServer {
  private server: Server;
  private cachedRoots: Root[] = [];
  private lastRootsUpdate: number = 0;
  private readonly CACHE_TTL = 30000; // 30 seconds

  constructor() {
    this.server = new Server(
      {
        name: 'roots-aware-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // 监听 Roots 变化通知
    this.server.setNotificationHandler('notifications/roots/list_changed', async () => {
      console.log('[Server] Roots changed notification received');
      this.cachedRoots = [];
      this.lastRootsUpdate = 0;
      await this.refreshRoots();
    });

    // 定义 Tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'read_file',
            description: 'Read a file (within allowed roots)',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to the file',
                },
              },
              required: ['path'],
            },
          },
          {
            name: 'write_file',
            description: 'Write to a file (within allowed roots)',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to the file',
                },
                content: {
                  type: 'string',
                  description: 'Content to write',
                },
              },
              required: ['path', 'content'],
            },
          },
          {
            name: 'list_directory',
            description: 'List directory contents (within allowed roots)',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to the directory',
                },
              },
              required: ['path'],
            },
          },
        ],
      };
    });

    // 处理 Tool 调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'read_file':
          return await this.handleReadFile(args.path as string);

        case 'write_file':
          return await this.handleWriteFile(args.path as string, args.content as string);

        case 'list_directory':
          return await this.handleListDirectory(args.path as string);

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  // ========== Roots 管理 ==========

  private async getRoots(forceRefresh = false): Promise<Root[]> {
    const now = Date.now();

    // 使用缓存
    if (
      !forceRefresh &&
      this.cachedRoots.length > 0 &&
      now - this.lastRootsUpdate < this.CACHE_TTL
    ) {
      return this.cachedRoots;
    }

    return await this.refreshRoots();
  }

  private async refreshRoots(): Promise<Root[]> {
    try {
      console.log('[Server] Fetching roots from client...');

      const response = await this.server.request({ method: 'roots/list' }, { timeout: 5000 });

      this.cachedRoots = (response as any).roots || [];
      this.lastRootsUpdate = Date.now();

      console.log(`[Server] Got ${this.cachedRoots.length} roots`);

      return this.cachedRoots;
    } catch (error) {
      console.error('[Server] Failed to fetch roots:', error);
      return [];
    }
  }

  private async validatePath(filePath: string): Promise<{
    valid: boolean;
    error?: string;
    roots?: Root[];
  }> {
    // 1. 获取 Roots
    const roots = await this.getRoots();

    if (roots.length === 0) {
      return {
        valid: false,
        error: 'No roots available. Client may not support roots capability.',
      };
    }

    // 2. 规范化路径
    const normalized = path.resolve(filePath);
    const fileUri = `file://${normalized}`;

    // 3. 检查危险模式
    const dangerous = ['..', '~', '/etc/', '/sys/', '/proc/'];
    for (const pattern of dangerous) {
      if (normalized.includes(pattern)) {
        return {
          valid: false,
          error: `Path contains dangerous pattern: ${pattern}`,
        };
      }
    }

    // 4. 检查是否在允许的 Roots 内
    const matchedRoot = roots.find((root) => fileUri.startsWith(root.uri));

    if (!matchedRoot) {
      return {
        valid: false,
        error: `Access denied: Path outside allowed roots.\n\nRequested: ${normalized}\n\nAllowed roots:\n${roots
          .map((r) => `  - ${r.name || 'Unnamed'}: ${r.uri}`)
          .join('\n')}`,
        roots,
      };
    }

    return { valid: true, roots };
  }

  // ========== Tool 实现 ==========

  private async handleReadFile(filePath: string) {
    console.log(`[Server] read_file: ${filePath}`);

    // 1. 验证路径
    const validation = await this.validatePath(filePath);
    if (!validation.valid) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error: ${validation.error}`,
          },
        ],
        isError: true,
      };
    }

    // 2. 读取文件
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return {
        content: [
          {
            type: 'text',
            text: content,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error reading file: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleWriteFile(filePath: string, content: string) {
    console.log(`[Server] write_file: ${filePath}`);

    // 1. 验证路径
    const validation = await this.validatePath(filePath);
    if (!validation.valid) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error: ${validation.error}`,
          },
        ],
        isError: true,
      };
    }

    // 2. 写入文件
    try {
      await fs.writeFile(filePath, content, 'utf-8');
      return {
        content: [
          {
            type: 'text',
            text: `✅ File written successfully: ${filePath}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error writing file: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleListDirectory(dirPath: string) {
    console.log(`[Server] list_directory: ${dirPath}`);

    // 1. 验证路径
    const validation = await this.validatePath(dirPath);
    if (!validation.valid) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error: ${validation.error}`,
          },
        ],
        isError: true,
      };
    }

    // 2. 列出目录
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      const formatted = entries
        .map((entry) => {
          const type = entry.isDirectory() ? '📁' : '📄';
          return `${type} ${entry.name}`;
        })
        .join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `Directory: ${dirPath}\n\n${formatted}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error listing directory: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
}

// ========== 使用示例 ==========

async function main() {
  const server = new RootsAwareServer();
  console.log('[Server] Roots-aware server started');
}
```

### Python Client 实现

```python
from mcp import ClientSession
from mcp.types import Root
import os
from pathlib import Path
from typing import List, Optional, Dict
import asyncio

class RootsManager:
    def __init__(self, session: ClientSession):
        self.session = session
        self.allowed_roots: List[Root] = []

    async def handle_roots_list(self) -> Dict:
        """处理 roots/list 请求"""
        print("[Roots] Server requested roots list")
        return {
            "roots": [
                {"uri": root.uri, "name": root.name}
                for root in self.allowed_roots
            ]
        }

    # ========== Root 管理 ==========

    async def add_root(self, dir_path: str, name: Optional[str] = None) -> None:
        """添加一个 Root"""
        # 1. 验证路径
        path = Path(dir_path).resolve()
        if not path.exists():
            raise ValueError(f"Path does not exist: {dir_path}")
        if not path.is_dir():
            raise ValueError(f"Path is not a directory: {dir_path}")

        # 2. 构建 URI
        uri = f"file://{path}"

        # 3. 检查是否已存在
        if any(r.uri == uri for r in self.allowed_roots):
            print(f"[Roots] Root already exists: {uri}")
            return

        # 4. 添加 Root
        root = Root(
            uri=uri,
            name=name or path.name
        )
        self.allowed_roots.append(root)

        print(f"[Roots] Added root: {uri}")

        # 5. 通知 Server
        await self.notify_roots_changed()

    async def remove_root(self, uri: str) -> None:
        """移除一个 Root"""
        original_length = len(self.allowed_roots)
        self.allowed_roots = [r for r in self.allowed_roots if r.uri != uri]

        if len(self.allowed_roots) < original_length:
            print(f"[Roots] Removed root: {uri}")
            await self.notify_roots_changed()
        else:
            print(f"[Roots] Root not found: {uri}")

    def get_roots(self) -> List[Root]:
        """获取所有 Roots"""
        return self.allowed_roots.copy()

    # ========== 路径验证 ==========

    def is_path_allowed(self, file_path: str) -> bool:
        """检查路径是否在允许的 Roots 内"""
        path = Path(file_path).resolve()
        file_uri = f"file://{path}"

        return any(
            file_uri.startswith(root.uri)
            for root in self.allowed_roots
        )

    def validate_path(self, file_path: str) -> Dict:
        """验证路径，返回详细结果"""
        # 1. 规范化路径
        path = Path(file_path).resolve()
        file_uri = f"file://{path}"

        # 2. 检查危险模式
        dangerous_patterns = ["../..", "~", "/etc/", "/sys/", "/proc/"]
        for pattern in dangerous_patterns:
            if pattern in str(path):
                return {
                    "valid": False,
                    "error": f"Path contains dangerous pattern: {pattern}"
                }

        # 3. 检查是否在允许的 Roots 内
        matched_root = None
        for root in self.allowed_roots:
            if file_uri.startswith(root.uri):
                matched_root = root
                break

        if not matched_root:
            allowed_list = "\n".join(
                f"  - {r.name}: {r.uri}"
                for r in self.allowed_roots
            )
            return {
                "valid": False,
                "error": f"Path outside allowed roots.\n\nAllowed:\n{allowed_list}"
            }

        return {"valid": True}

    # ========== 通知 ==========

    async def notify_roots_changed(self) -> None:
        """发送 Roots 变化通知"""
        try:
            await self.session.send_notification(
                "notifications/roots/list_changed"
            )
            print("[Roots] Sent list_changed notification")
        except Exception as e:
            print(f"[Roots] Failed to send notification: {e}")

# ========== 使用示例 ==========

async def example_usage():
    # 假设已经有一个 session
    # session = ClientSession(...)

    # roots_manager = RootsManager(session)

    # 添加 Roots
    # await roots_manager.add_root("/home/user/projects/app-a", "Application A")
    # await roots_manager.add_root("/home/user/projects/app-b", "Application B")

    # 验证路径
    # validation = roots_manager.validate_path("/home/user/projects/app-a/main.py")
    # print(validation)  # {"valid": True}

    pass
```

---

## 最佳实践

### 1. 路径验证

```typescript
// ✅ 完善的路径验证
class SecurePathValidator {
  private roots: Root[];

  validate(requestedPath: string): ValidationResult {
    // 1. 规范化路径
    const normalized = path.resolve(requestedPath);

    // 2. 检查路径存在
    if (!fs.existsSync(normalized)) {
      return {
        valid: false,
        error: 'Path does not exist',
      };
    }

    // 3. 检查危险模式
    const dangerous = ['..', '~', '/etc/', '/sys/', '/proc/', '/root/', 'C:\\Windows\\'];

    for (const pattern of dangerous) {
      if (normalized.includes(pattern)) {
        return {
          valid: false,
          error: `Dangerous pattern detected: ${pattern}`,
        };
      }
    }

    // 4. 检查符号链接
    try {
      const stats = fs.lstatSync(normalized);
      if (stats.isSymbolicLink()) {
        const realPath = fs.realpathSync(normalized);
        // 递归验证真实路径
        return this.validate(realPath);
      }
    } catch (error) {
      return {
        valid: false,
        error: 'Failed to resolve symbolic link',
      };
    }

    // 5. 检查 Roots
    const fileUri = `file://${normalized}`;
    const matchedRoot = this.roots.find((root) => fileUri.startsWith(root.uri));

    if (!matchedRoot) {
      return {
        valid: false,
        error: 'Path outside allowed roots',
      };
    }

    return { valid: true };
  }
}

// ❌ 不安全的验证
function unsafeValidation(path: string, roots: Root[]): boolean {
  // 危险！没有规范化路径
  return roots.some((r) => path.startsWith(r.uri));
}
```

### 2. 缓存管理

```typescript
// ✅ 智能缓存
class RootsCacheManager {
  private cache: { roots: Root[]; timestamp: number } | null = null;
  private readonly TTL = 30000; // 30 seconds

  async getRoots(): Promise<Root[]> {
    const now = Date.now();

    // 检查缓存
    if (this.cache && now - this.cache.timestamp < this.TTL) {
      console.log('[Cache] Using cached roots');
      return this.cache.roots;
    }

    // 获取新数据
    console.log('[Cache] Fetching fresh roots');
    const roots = await this.fetchRoots();

    // 更新缓存
    this.cache = {
      roots,
      timestamp: now,
    };

    return roots;
  }

  invalidate(): void {
    console.log('[Cache] Invalidating cache');
    this.cache = null;
  }

  private async fetchRoots(): Promise<Root[]> {
    const response = await sendRequest({ method: 'roots/list' });
    return response.roots;
  }
}

// ❌ 没有缓存
async function inefficientApproach() {
  // 危险！每次都请求
  for (let i = 0; i < 100; i++) {
    const roots = await sendRequest({ method: 'roots/list' });
    // 使用 roots...
  }
}
```

### 3. 错误处理

```typescript
// ✅ 清晰的错误消息
class UserFriendlyErrors {
  formatAccessDeniedError(path: string, roots: Root[]): string {
    return `❌ Access Denied

Requested path: ${path}

This path is outside the allowed directories.

Allowed directories:
${roots.map((r, i) => `  ${i + 1}. ${r.name || 'Unnamed'}\n     ${r.uri}`).join('\n')}

To access this path:
1. Open the directory in your editor/IDE
2. Or ask to add it to allowed roots`;
  }

  formatDangerousPathError(path: string, pattern: string): string {
    return `❌ Security Error

Path contains dangerous pattern: ${pattern}

Requested: ${path}

This type of path is not allowed for security reasons.`;
  }
}

// ❌ 模糊的错误
function badError() {
  throw new Error('Access denied'); // 用户不知道为什么
}
```

### 4. 性能优化

```typescript
// ✅ 批量验证
class BatchValidator {
  async validatePaths(paths: string[]): Promise<Map<string, boolean>> {
    const roots = await this.getRoots(); // 只获取一次
    const results = new Map<string, boolean>();

    for (const path of paths) {
      const normalized = path.resolve(path);
      const fileUri = `file://${normalized}`;
      const valid = roots.some((root) => fileUri.startsWith(root.uri));
      results.set(path, valid);
    }

    return results;
  }
}

// ❌ 每次都获取 Roots
async function inefficientValidation(paths: string[]) {
  for (const path of paths) {
    const roots = await getRoots(); // 重复请求！
    validate(path, roots);
  }
}
```

---

## 安全指南

### 1. 防止路径遍历攻击

```typescript
class PathTraversalProtection {
  private readonly BLOCKED_PATTERNS = [
    /\.\./g, // 父目录引用
    /~/, // Home 目录
    /^\/etc\//i, // Linux 系统目录
    /^\/sys\//i,
    /^\/proc\//i,
    /^\/root\//i,
    /^C:\\Windows\\/i, // Windows 系统目录
    /^C:\\Program Files\\/i,
  ];

  isPathSafe(userInput: string): boolean {
    // 检查所有危险模式
    for (const pattern of this.BLOCKED_PATTERNS) {
      if (pattern.test(userInput)) {
        console.warn(`[Security] Blocked dangerous pattern: ${pattern}`);
        return false;
      }
    }

    return true;
  }

  sanitizePath(userInput: string): string {
    // 移除多余的斜杠
    let sanitized = userInput.replace(/\/+/g, '/');

    // 移除末尾斜杠
    sanitized = sanitized.replace(/\/$/, '');

    // 规范化
    return path.resolve(sanitized);
  }
}
```

### 2. 符号链接处理

```typescript
class SymlinkHandler {
  async validateSymlink(symlinkPath: string, roots: Root[]): Promise<boolean> {
    try {
      const stats = await fs.lstat(symlinkPath);

      if (!stats.isSymbolicLink()) {
        return true; // 不是符号链接，继续正常验证
      }

      // 解析符号链接的真实路径
      const realPath = await fs.realpath(symlinkPath);

      console.log(`[Symlink] ${symlinkPath} -> ${realPath}`);

      // 验证真实路径是否在 Roots 内
      const realUri = `file://${realPath}`;
      const allowed = roots.some((root) => realUri.startsWith(root.uri));

      if (!allowed) {
        console.warn(`[Security] Symlink points outside allowed roots: ${realPath}`);
      }

      return allowed;
    } catch (error) {
      console.error(`[Symlink] Error resolving: ${error}`);
      return false;
    }
  }
}
```

### 3. 审计日志

```typescript
class RootsAuditLogger {
  log(event: {
    action: string;
    path: string;
    allowed: boolean;
    root?: string;
    error?: string;
  }): void {
    const entry = {
      timestamp: new Date().toISOString(),
      type: 'roots_access',
      ...event,
    };

    console.log('[AUDIT]', JSON.stringify(entry));

    // 在生产环境中，应该写入持久化存储
    // await db.auditLogs.insert(entry);
  }

  logAccess(path: string, allowed: boolean, matchedRoot?: Root): void {
    this.log({
      action: 'file_access',
      path,
      allowed,
      root: matchedRoot?.uri,
    });
  }

  logDenied(path: string, reason: string): void {
    this.log({
      action: 'access_denied',
      path,
      allowed: false,
      error: reason,
    });
  }
}
```

### 4. 权限检查

```typescript
class PermissionChecker {
  async checkFilePermissions(filePath: string): Promise<{
    readable: boolean;
    writable: boolean;
    executable: boolean;
  }> {
    try {
      // 检查读权限
      await fs.access(filePath, fs.constants.R_OK);
      const readable = true;

      // 检查写权限
      let writable = false;
      try {
        await fs.access(filePath, fs.constants.W_OK);
        writable = true;
      } catch {}

      // 检查执行权限
      let executable = false;
      try {
        await fs.access(filePath, fs.constants.X_OK);
        executable = true;
      } catch {}

      return { readable, writable, executable };
    } catch (error) {
      return { readable: false, writable: false, executable: false };
    }
  }

  async enforceReadOnly(filePath: string): Promise<void> {
    // 确保文件是只读的
    await fs.chmod(filePath, 0o444);
  }
}
```

---

## 总结

### Roots 的核心价值

1. **安全隔离**: 保护用户文件系统不被未授权访问
2. **明确边界**: 清晰定义服务器的操作范围
3. **用户控制**: 用户完全控制哪些目录可被访问
4. **动态管理**: 支持运行时添加/移除访问权限

### 关键要点

**✅ 始终做到：**

- 验证每个文件路径
- 规范化路径（使用 `path.resolve`）
- 检查危险模式（`..`, `/etc/`, 等）
- 处理符号链接
- 缓存 Roots 列表
- 记录审计日志

**❌ 绝对避免：**

- 跳过路径验证
- 假设 Roots 不变
- 使用宽松的验证
- 忽略符号链接
- 暴露敏感路径

### 使用场景

| 场景     | 描述               |
| -------- | ------------------ |
| IDE 集成 | 限制访问工作区目录 |
| 版本控制 | 只访问 Git 仓库    |
| 文档处理 | 限制在文档目录     |
| 构建工具 | 访问项目和输出目录 |
| 代码分析 | 扫描特定项目目录   |

### 下一步

- 🔧 实现自己的 Roots Manager
- 📚 阅读 [MCP Roots 规范](https://modelcontextprotocol.io/specification/2025-06-18/client/roots)
- 🎨 设计适合你应用的 Roots 策略
- 🔒 加强安全防护措施
- 🚀 在生产环境中测试和部署

---

## 参考资源

- [MCP Roots 规范](https://modelcontextprotocol.io/specification/2025-06-18/client/roots)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [Path Traversal 攻击防护](https://owasp.org/www-community/attacks/Path_Traversal)
- [文件系统安全最佳实践](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

---

**License**: MIT  
**Last Updated**: 2025-06-18  
**Protocol Version**: 2025-06-18
