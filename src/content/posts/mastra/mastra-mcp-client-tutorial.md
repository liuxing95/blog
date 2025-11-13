---
title: 'Mastra.ai MCP Agent'
date: '2025-11-13'
excerpt: 'Mastra.ai Agent 实现 MCP Client 完整教程'
tags: ['Agent', 'Mastra']
series: 'Agent'
---

# Mastra.ai Agent 实现 MCP Client 完整教程

## 📋 目录

1. [概述](#概述)
2. [核心概念](#核心概念)
3. [架构设计](#架构设计)
4. [环境准备](#环境准备)
5. [基础实现](#基础实现)
6. [高级功能](#高级功能)
7. [MCP 服务器管理](#mcp-服务器管理)
8. [实战案例](#实战案例)
9. [流程图](#流程图)
10. [最佳实践](#最佳实践)

---

## 概述

本教程将教你如何在 Mastra.ai 框架中实现一个功能完整的 MCP Client,使你的 Agent 能够:

- ✅ 连接多个 MCP 服务器(类似 Claude Code CLI / Codex)
- ✅ 动态管理和查看挂载的 MCP 服务器
- ✅ 发送请求到 MCP 服务器并处理响应
- ✅ 支持 stdio 和 HTTP(SSE) 两种传输协议
- ✅ 实时监控 MCP 服务器状态
- ✅ 处理工具调用、资源访问和提示模板

### 什么是 MCP?

Model Context Protocol (MCP) 是由 Anthropic 提出的标准协议,用于 AI Agent 与外部工具和服务的通信。它类似于 "AI 工具的 USB-C 接口"。

### Mastra.ai 的 MCP 支持

Mastra.ai 通过 `@mastra/mcp` 包提供了完整的 MCP 支持:

- **MCPClient** - 连接到外部 MCP 服务器,获取其工具
- **MCPServer** - 将 Mastra 工具暴露为 MCP 服务器

---

## 核心概念

### MCP 传输方式

| 传输方式                     | 适用场景                | 示例                          |
| ---------------------------- | ----------------------- | ----------------------------- |
| **Stdio**                    | 本地进程(npx, CLI 工具) | `npx wikipedia-mcp`           |
| **SSE** (Server-Sent Events) | 远程 HTTP 服务器(旧版)  | `https://mcp.run/profile-url` |
| **Streamable HTTP**          | 远程 HTTP 服务器(新版)  | `https://api.example.com/mcp` |

### MCPClient 核心方法

```typescript
class MCPClient {
  // 连接管理
  connect(): Promise<void>
  disconnect(): Promise<void>

  // 工具获取
  getTools(): Promise<Record<string, Tool>>        // 静态获取,用于 Agent 定义
  getToolsets(): Promise<Record<string, Toolset>>  // 动态获取,用于运行时

  // 资源管理
  resources.list(): Promise<Record<string, Resource[]>>
  resources.read(serverName: string, uri: string): Promise<ResourceContent>

  // 提示模板
  prompts.list(): Promise<Record<string, Prompt[]>>
  prompts.get(serverName: string, name: string): Promise<PromptData>

  // 服务器管理(自定义扩展)
  getServerNames(): string[]
  getServerStatus(serverName: string): ServerStatus
}
```

---

## 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    Mastra Agent                          │
│  ┌──────────────────────────────────────────────┐       │
│  │         Agent with MCPClient                 │       │
│  │  • instructions                              │       │
│  │  • model (OpenAI/Anthropic/etc)              │       │
│  │  • tools (from MCP servers)                  │       │
│  └──────────────────────────────────────────────┘       │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                 MCPClient (管理层)                       │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │  Server Registry                           │         │
│  │  • wikipedia → StdioTransport              │         │
│  │  • weather → StreamableHTTPTransport       │         │
│  │  • github → SSETransport(fallback)         │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │  Tool Aggregator                           │         │
│  │  • Namespace tools by server               │         │
│  │  • wikipedia_search                        │         │
│  │  • weather_get_forecast                    │         │
│  │  • github_create_issue                     │         │
│  └────────────────────────────────────────────┘         │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              MCP Server Connections                      │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Server 1   │  │   Server 2   │  │   Server 3   │  │
│  │  (Stdio)     │  │   (HTTP)     │  │   (SSE)      │  │
│  │              │  │              │  │              │  │
│  │  ┌────────┐  │  │  ┌────────┐  │  │  ┌────────┐  │  │
│  │  │ Tools  │  │  │  │ Tools  │  │  │  │ Tools  │  │  │
│  │  └────────┘  │  │  └────────┘  │  │  └────────┘  │  │
│  │  ┌────────┐  │  │  ┌────────┐  │  │  ┌────────┐  │  │
│  │  │Resource│  │  │  │Resource│  │  │  │Resource│  │  │
│  │  └────────┘  │  │  └────────┘  │  │  └────────┘  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 类图

```
┌─────────────────────────────────────┐
│         MCPClientManager            │
├─────────────────────────────────────┤
│ - mcpClient: MCPClient              │
│ - serverConfigs: ServerConfig[]     │
│ - connectedServers: Set<string>     │
├─────────────────────────────────────┤
│ + initialize()                      │
│ + listServers()                     │
│ + getServerStatus(name)             │
│ + addServer(config)                 │
│ + removeServer(name)                │
│ + notifyServer(name, request)       │
│ + receiveResponse(name)             │
└─────────────────────────────────────┘
           ↓ uses
┌─────────────────────────────────────┐
│          MCPClient                  │
│      (@mastra/mcp)                  │
├─────────────────────────────────────┤
│ - servers: Map<string, Server>      │
│ - timeout: number                   │
├─────────────────────────────────────┤
│ + connect()                         │
│ + disconnect()                      │
│ + getTools()                        │
│ + getToolsets()                     │
│ + resources.*                       │
│ + prompts.*                         │
└─────────────────────────────────────┘
           ↓ manages
┌─────────────────────────────────────┐
│         ServerConnection            │
├─────────────────────────────────────┤
│ - name: string                      │
│ - transport: Transport              │
│ - status: ConnectionStatus          │
│ - tools: Tool[]                     │
├─────────────────────────────────────┤
│ + send(request)                     │
│ + receive()                         │
│ + getStatus()                       │
└─────────────────────────────────────┘
```

---

## 环境准备

### 1. 安装依赖

```bash
# 创建新项目
mkdir mastra-mcp-agent
cd mastra-mcp-agent
npm init -y

# 安装 Mastra 核心包
npm install @mastra/core @mastra/mcp

# 安装 AI SDK
npm install @ai-sdk/openai
# 或者使用 Anthropic
# npm install @ai-sdk/anthropic

# 安装 TypeScript
npm install -D typescript @types/node tsx

# 初始化 TypeScript
npx tsc --init
```

### 2. 配置环境变量

```bash
# .env
OPENAI_API_KEY=sk-xxx
# 如果使用远程 MCP 服务器
SMITHERY_API_KEY=xxx
MCP_RUN_SSE_URL=https://mcp.run/sse/xxx
```

### 3. 项目结构

```
mastra-mcp-agent/
├── src/
│   ├── mcp/
│   │   ├── client.ts           # MCPClient 配置
│   │   ├── manager.ts          # MCP 管理器
│   │   └── types.ts            # 类型定义
│   ├── agents/
│   │   └── mcp-agent.ts        # Agent 定义
│   ├── tools/
│   │   └── custom-tools.ts     # 自定义工具
│   └── index.ts                # 入口文件
├── .env
├── package.json
└── tsconfig.json
```

---

## 基础实现

### 第一步:创建 MCPClient 配置

```typescript
// src/mcp/client.ts
import { MCPClient } from '@mastra/mcp';

export interface ServerConfig {
  name: string;
  type: 'stdio' | 'http' | 'sse';
  config: {
    command?: string;
    args?: string[];
    env?: Record<string, string>;
    url?: URL;
    requestInit?: RequestInit;
  };
  timeout?: number;
  enabled?: boolean;
}

/**
 * 创建 MCPClient 实例
 */
export function createMCPClient(configs: ServerConfig[]) {
  // 过滤启用的服务器
  const enabledServers = configs.filter((c) => c.enabled !== false);

  // 构建服务器配置
  const servers: Record<string, any> = {};

  for (const config of enabledServers) {
    if (config.type === 'stdio') {
      servers[config.name] = {
        command: config.config.command!,
        args: config.config.args || [],
        env: config.config.env,
        timeout: config.timeout,
        // 可选:添加日志处理器
        log: (logMessage: any) => {
          console.log(`[${config.name}][${logMessage.level}] ${logMessage.message}`);
        },
      };
    } else {
      servers[config.name] = {
        url: config.config.url!,
        requestInit: config.config.requestInit,
        timeout: config.timeout,
        log: (logMessage: any) => {
          console.log(`[${config.name}][${logMessage.level}] ${logMessage.message}`);
        },
      };
    }
  }

  return new MCPClient({
    id: 'main-mcp-client',
    servers,
    timeout: 60000, // 全局超时 60 秒
  });
}

/**
 * 预定义的服务器配置
 */
export const defaultServerConfigs: ServerConfig[] = [
  {
    name: 'wikipedia',
    type: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-wikipedia'],
    },
    enabled: true,
  },
  {
    name: 'filesystem',
    type: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', process.cwd()],
    },
    enabled: true,
  },
  {
    name: 'weather',
    type: 'http',
    config: {
      url: new URL(
        `https://server.smithery.ai/@smithery-ai/national-weather-service/mcp?api_key=${process.env.SMITHERY_API_KEY}`,
      ),
    },
    enabled: !!process.env.SMITHERY_API_KEY,
  },
  {
    name: 'github',
    type: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
      },
    },
    enabled: !!process.env.GITHUB_TOKEN,
  },
];
```

### 第二步:实现 MCP 管理器

```typescript
// src/mcp/manager.ts
import { MCPClient } from '@mastra/mcp';
import { ServerConfig } from './client';

export interface ServerStatus {
  name: string;
  connected: boolean;
  toolCount: number;
  resourceCount: number;
  lastError?: string;
  metadata?: {
    transport: 'stdio' | 'http' | 'sse';
    uptime?: number;
  };
}

export class MCPClientManager {
  private mcpClient: MCPClient;
  private serverConfigs: Map<string, ServerConfig>;
  private connectionStatus: Map<string, boolean>;
  private serverTools: Map<string, any[]>;
  private serverResources: Map<string, any[]>;

  constructor(configs: ServerConfig[]) {
    this.serverConfigs = new Map(configs.map((c) => [c.name, c]));
    this.connectionStatus = new Map();
    this.serverTools = new Map();
    this.serverResources = new Map();

    // 构建服务器配置对象
    const servers: Record<string, any> = {};
    for (const config of configs.filter((c) => c.enabled !== false)) {
      servers[config.name] = this.buildServerConfig(config);
    }

    this.mcpClient = new MCPClient({
      id: 'managed-mcp-client',
      servers,
      timeout: 60000,
    });
  }

  /**
   * 构建单个服务器配置
   */
  private buildServerConfig(config: ServerConfig) {
    const baseConfig: any = {
      timeout: config.timeout || 60000,
      log: (logMessage: any) => {
        console.log(`[${config.name}][${logMessage.level}] ${logMessage.message}`);
      },
    };

    if (config.type === 'stdio') {
      return {
        ...baseConfig,
        command: config.config.command!,
        args: config.config.args || [],
        env: config.config.env,
      };
    } else {
      return {
        ...baseConfig,
        url: config.config.url!,
        requestInit: config.config.requestInit,
      };
    }
  }

  /**
   * 初始化:连接所有服务器并加载工具
   */
  async initialize(): Promise<void> {
    console.log('🚀 Initializing MCP Client Manager...');

    try {
      // 注意:MCPClient 在调用 getTools() 时会自动连接
      // 所以我们直接获取工具即可
      const allTools = await this.mcpClient.getTools();

      // 按服务器分组工具
      for (const [toolName, tool] of Object.entries(allTools)) {
        const serverName = toolName.split('_')[0]; // 假设格式为 serverName_toolName

        if (!this.serverTools.has(serverName)) {
          this.serverTools.set(serverName, []);
        }
        this.serverTools.get(serverName)!.push({ name: toolName, tool });
        this.connectionStatus.set(serverName, true);
      }

      // 加载资源
      try {
        const allResources = await this.mcpClient.resources.list();
        for (const [serverName, resources] of Object.entries(allResources)) {
          this.serverResources.set(serverName, resources);
        }
      } catch (error) {
        console.warn('⚠️ Some servers do not support resources:', error);
      }

      console.log('✅ MCP Client Manager initialized successfully');
      this.printServerSummary();
    } catch (error) {
      console.error('❌ Failed to initialize MCP Client Manager:', error);
      throw error;
    }
  }

  /**
   * 获取所有已连接的服务器名称
   */
  getConnectedServers(): string[] {
    return Array.from(this.connectionStatus.entries())
      .filter(([_, connected]) => connected)
      .map(([name]) => name);
  }

  /**
   * 获取服务器状态
   */
  getServerStatus(serverName: string): ServerStatus | null {
    const config = this.serverConfigs.get(serverName);
    if (!config) {
      return null;
    }

    const connected = this.connectionStatus.get(serverName) || false;
    const tools = this.serverTools.get(serverName) || [];
    const resources = this.serverResources.get(serverName) || [];

    return {
      name: serverName,
      connected,
      toolCount: tools.length,
      resourceCount: resources.length,
      metadata: {
        transport: config.type,
      },
    };
  }

  /**
   * 列出所有服务器及其状态
   */
  listServers(): ServerStatus[] {
    return Array.from(this.serverConfigs.keys())
      .map((name) => this.getServerStatus(name))
      .filter((status): status is ServerStatus => status !== null);
  }

  /**
   * 获取所有工具(用于 Agent)
   */
  async getTools() {
    return await this.mcpClient.getTools();
  }

  /**
   * 获取工具集(用于动态使用)
   */
  async getToolsets() {
    return await this.mcpClient.getToolsets();
  }

  /**
   * 通知特定服务器(发送请求)
   * 注意:MCP 协议中工具调用是通过 AI SDK 自动处理的
   * 这个方法主要用于直接调用资源或提示模板
   */
  async notifyServer(
    serverName: string,
    request: {
      type: 'resource' | 'prompt';
      data: any;
    },
  ): Promise<any> {
    if (request.type === 'resource') {
      return await this.mcpClient.resources.read(serverName, request.data.uri);
    } else if (request.type === 'prompt') {
      return await this.mcpClient.prompts.get({
        serverName,
        name: request.data.name,
        args: request.data.args,
      });
    }

    throw new Error(`Unknown request type: ${request.type}`);
  }

  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    console.log('🔌 Disconnecting from all MCP servers...');
    await this.mcpClient.disconnect();
    this.connectionStatus.clear();
    this.serverTools.clear();
    this.serverResources.clear();
    console.log('✅ Disconnected successfully');
  }

  /**
   * 打印服务器摘要
   */
  private printServerSummary(): void {
    console.log('\n📊 MCP Servers Summary:');
    console.log('━'.repeat(60));

    for (const status of this.listServers()) {
      const icon = status.connected ? '✅' : '❌';
      console.log(`${icon} ${status.name}`);
      console.log(`   Transport: ${status.metadata?.transport}`);
      console.log(`   Tools: ${status.toolCount}`);
      console.log(`   Resources: ${status.resourceCount}`);
      console.log('');
    }

    console.log('━'.repeat(60));
  }
}
```

### 第三步:创建集成 MCP 的 Agent

```typescript
// src/agents/mcp-agent.ts
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { MCPClientManager } from '../mcp/manager';
import { defaultServerConfigs } from '../mcp/client';

export class MCPAgent {
  private manager: MCPClientManager;
  private agent: Agent | null = null;

  constructor() {
    this.manager = new MCPClientManager(defaultServerConfigs);
  }

  /**
   * 初始化 Agent
   */
  async initialize(): Promise<void> {
    console.log('🤖 Initializing MCP Agent...');

    // 初始化 MCP 管理器
    await this.manager.initialize();

    // 获取所有工具
    const tools = await this.manager.getTools();

    // 创建 Agent
    this.agent = new Agent({
      name: 'MCP-Powered Assistant',
      instructions: `You are a helpful AI assistant with access to multiple external tools via MCP.

Available capabilities:
- Wikipedia search and information retrieval
- File system operations (read/write files in current directory)
- Weather information (if configured)
- GitHub operations (if configured)

When using tools:
1. Always explain what tool you're going to use and why
2. Parse the tool results carefully
3. Present information in a clear, user-friendly format
4. If a tool call fails, explain the issue and try an alternative approach`,
      model: openai('gpt-4o-mini'),
      tools, // 传入所有 MCP 工具
    });

    console.log('✅ MCP Agent initialized successfully\n');
  }

  /**
   * 生成响应
   */
  async generate(prompt: string): Promise<string> {
    if (!this.agent) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }

    console.log(`\n💬 User: ${prompt}\n`);

    const response = await this.agent.generate(prompt);

    console.log(`🤖 Agent: ${response.text}\n`);

    return response.text;
  }

  /**
   * 流式响应
   */
  async stream(prompt: string): Promise<void> {
    if (!this.agent) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }

    console.log(`\n💬 User: ${prompt}\n`);
    console.log('🤖 Agent: ');

    const stream = await this.agent.stream(prompt);

    for await (const chunk of stream.textStream) {
      process.stdout.write(chunk);
    }

    console.log('\n');
  }

  /**
   * 列出所有 MCP 服务器
   */
  listServers(): void {
    const servers = this.manager.listServers();

    console.log('\n🔌 Connected MCP Servers:');
    console.log('━'.repeat(60));

    for (const server of servers) {
      const status = server.connected ? '🟢 Online' : '🔴 Offline';
      console.log(`\n${server.name} - ${status}`);
      console.log(`  Transport: ${server.metadata?.transport}`);
      console.log(`  Tools: ${server.toolCount}`);
      console.log(`  Resources: ${server.resourceCount}`);
    }

    console.log('\n' + '━'.repeat(60) + '\n');
  }

  /**
   * 获取服务器状态
   */
  getServerStatus(serverName: string): void {
    const status = this.manager.getServerStatus(serverName);

    if (!status) {
      console.log(`❌ Server "${serverName}" not found`);
      return;
    }

    console.log(`\n📊 Server Status: ${serverName}`);
    console.log('━'.repeat(60));
    console.log(`Status: ${status.connected ? '🟢 Connected' : '🔴 Disconnected'}`);
    console.log(`Transport: ${status.metadata?.transport}`);
    console.log(`Tools: ${status.toolCount}`);
    console.log(`Resources: ${status.resourceCount}`);

    if (status.lastError) {
      console.log(`Last Error: ${status.lastError}`);
    }

    console.log('━'.repeat(60) + '\n');
  }

  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    await this.manager.disconnect();
  }
}
```

### 第四步:创建主入口

```typescript
// src/index.ts
import { MCPAgent } from './agents/mcp-agent';
import * as readline from 'readline';

async function main() {
  // 创建并初始化 Agent
  const agent = new MCPAgent();
  await agent.initialize();

  // 显示已连接的服务器
  agent.listServers();

  // 创建交互式命令行
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('🎯 MCP Agent Ready! Type your question or command:');
  console.log('   - Type your question to chat');
  console.log('   - /servers - List all MCP servers');
  console.log('   - /status <name> - Get server status');
  console.log('   - /exit - Quit\n');

  const ask = () => {
    rl.question('You: ', async (input) => {
      const trimmed = input.trim();

      if (!trimmed) {
        ask();
        return;
      }

      // 处理命令
      if (trimmed === '/exit') {
        console.log('\n👋 Goodbye!');
        await agent.disconnect();
        rl.close();
        process.exit(0);
      }

      if (trimmed === '/servers') {
        agent.listServers();
        ask();
        return;
      }

      if (trimmed.startsWith('/status ')) {
        const serverName = trimmed.substring(8);
        agent.getServerStatus(serverName);
        ask();
        return;
      }

      // 处理用户问题
      try {
        await agent.stream(trimmed);
      } catch (error) {
        console.error('❌ Error:', error);
      }

      ask();
    });
  };

  ask();
}

// 运行
main().catch(console.error);
```

---

## 高级功能

### 动态工具集(Multi-tenant 支持)

```typescript
// src/agents/dynamic-mcp-agent.ts
import { Agent } from '@mastra/core/agent';
import { MCPClient } from '@mastra/mcp';
import { openai } from '@ai-sdk/openai';

export class DynamicMCPAgent {
  private baseAgent: Agent;

  constructor() {
    // 创建不带工具的基础 Agent
    this.baseAgent = new Agent({
      name: 'Dynamic MCP Agent',
      instructions: 'You are a helpful assistant.',
      model: openai('gpt-4o-mini'),
      // 不在这里设置 tools
    });
  }

  /**
   * 为特定用户处理请求
   */
  async handleUserRequest(
    userPrompt: string,
    userApiKey: string,
    userConfig: Record<string, any>,
  ): Promise<string> {
    // 为这个用户创建专属的 MCP Client
    const userMcp = new MCPClient({
      servers: {
        weather: {
          url: new URL('https://weather-api.example.com/mcp'),
          requestInit: {
            headers: {
              Authorization: `Bearer ${userApiKey}`,
              'X-User-Id': userConfig.userId,
            },
          },
        },
        userDocs: {
          command: 'npx',
          args: ['-y', 'user-docs-mcp'],
          env: {
            USER_ID: userConfig.userId,
            API_KEY: userApiKey,
          },
        },
      },
    });

    try {
      // 动态获取工具集
      const toolsets = await userMcp.getToolsets();

      // 使用工具集生成响应
      const response = await this.baseAgent.generate(userPrompt, {
        toolsets, // 动态传入工具
      });

      return response.text;
    } finally {
      // 清理连接
      await userMcp.disconnect();
    }
  }
}
```

### 监听资源更新

```typescript
// src/mcp/resource-monitor.ts
import { MCPClient } from '@mastra/mcp';

export class ResourceMonitor {
  private mcpClient: MCPClient;

  constructor(mcpClient: MCPClient) {
    this.mcpClient = mcpClient;
  }

  /**
   * 订阅资源更新
   */
  async subscribeToResource(serverName: string, uri: string): Promise<void> {
    // 订阅资源
    await this.mcpClient.resources.subscribe(serverName, uri);

    // 设置更新处理器
    await this.mcpClient.resources.onUpdated(serverName, async (params) => {
      console.log(`📢 Resource updated: ${params.uri}`);

      // 读取更新后的内容
      const content = await this.mcpClient.resources.read(serverName, params.uri);
      console.log('New content:', content.contents[0]);
    });

    console.log(`✅ Subscribed to ${uri} on ${serverName}`);
  }

  /**
   * 监听资源列表变化
   */
  async monitorResourceList(serverName: string): Promise<void> {
    await this.mcpClient.resources.onListChanged(serverName, async () => {
      console.log(`📢 Resource list changed on ${serverName}`);

      // 重新获取资源列表
      const resources = await this.mcpClient.resources.list();
      console.log(`New resources on ${serverName}:`, resources[serverName]);
    });

    console.log(`✅ Monitoring resource list on ${serverName}`);
  }
}
```

### 使用提示模板

```typescript
// src/mcp/prompt-manager.ts
import { MCPClient } from '@mastra/mcp';

export class PromptManager {
  private mcpClient: MCPClient;

  constructor(mcpClient: MCPClient) {
    this.mcpClient = mcpClient;
  }

  /**
   * 列出所有可用的提示模板
   */
  async listPrompts(): Promise<void> {
    const promptsByServer = await this.mcpClient.prompts.list();

    console.log('\n📝 Available Prompts:');
    console.log('━'.repeat(60));

    for (const [serverName, prompts] of Object.entries(promptsByServer)) {
      console.log(`\n${serverName}:`);
      for (const prompt of prompts) {
        console.log(`  - ${prompt.name}: ${prompt.description || 'No description'}`);
      }
    }

    console.log('\n' + '━'.repeat(60) + '\n');
  }

  /**
   * 使用提示模板
   */
  async usePrompt(
    serverName: string,
    promptName: string,
    args?: Record<string, any>,
  ): Promise<any> {
    const { prompt, messages } = await this.mcpClient.prompts.get({
      serverName,
      name: promptName,
      args,
    });

    console.log(`\n📝 Using prompt: ${prompt.name}`);
    console.log('Messages:');
    for (const message of messages) {
      console.log(`  ${message.role}: ${JSON.stringify(message.content)}`);
    }

    return { prompt, messages };
  }
}
```

---

## MCP 服务器管理

### CLI 工具实现

```typescript
// src/cli/mcp-manager-cli.ts
import { Command } from 'commander';
import { MCPClientManager } from '../mcp/manager';
import { ServerConfig } from '../mcp/client';
import * as fs from 'fs/promises';
import * as path from 'path';

const CONFIG_FILE = path.join(process.cwd(), '.mcp-servers.json');

export class MCPManagerCLI {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program.name('mcp-manager').description('MCP Server Manager CLI').version('1.0.0');

    // 列出服务器
    this.program
      .command('list')
      .description('List all MCP servers')
      .action(async () => {
        await this.listServers();
      });

    // 添加服务器
    this.program
      .command('add')
      .description('Add a new MCP server')
      .requiredOption('-n, --name <name>', 'Server name')
      .requiredOption('-t, --type <type>', 'Server type (stdio|http)')
      .option('-c, --command <command>', 'Command (for stdio)')
      .option('-a, --args <args...>', 'Arguments (for stdio)')
      .option('-u, --url <url>', 'URL (for http)')
      .action(async (options) => {
        await this.addServer(options);
      });

    // 移除服务器
    this.program
      .command('remove')
      .description('Remove an MCP server')
      .requiredOption('-n, --name <name>', 'Server name')
      .action(async (options) => {
        await this.removeServer(options.name);
      });

    // 测试服务器
    this.program
      .command('test')
      .description('Test MCP server connection')
      .requiredOption('-n, --name <name>', 'Server name')
      .action(async (options) => {
        await this.testServer(options.name);
      });

    // 显示服务器详情
    this.program
      .command('info')
      .description('Show server details')
      .requiredOption('-n, --name <name>', 'Server name')
      .action(async (options) => {
        await this.showServerInfo(options.name);
      });
  }

  async run(args: string[]): Promise<void> {
    await this.program.parseAsync(args);
  }

  private async loadConfig(): Promise<ServerConfig[]> {
    try {
      const data = await fs.readFile(CONFIG_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async saveConfig(configs: ServerConfig[]): Promise<void> {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(configs, null, 2));
  }

  private async listServers(): Promise<void> {
    const configs = await this.loadConfig();

    if (configs.length === 0) {
      console.log('No MCP servers configured.');
      return;
    }

    console.log('\n📋 Configured MCP Servers:');
    console.log('━'.repeat(60));

    for (const config of configs) {
      const status = config.enabled !== false ? '✅' : '❌';
      console.log(`\n${status} ${config.name}`);
      console.log(`   Type: ${config.type}`);

      if (config.type === 'stdio') {
        console.log(`   Command: ${config.config.command} ${config.config.args?.join(' ') || ''}`);
      } else {
        console.log(`   URL: ${config.config.url}`);
      }
    }

    console.log('\n' + '━'.repeat(60) + '\n');
  }

  private async addServer(options: any): Promise<void> {
    const configs = await this.loadConfig();

    // 检查是否已存在
    if (configs.some((c) => c.name === options.name)) {
      console.error(`❌ Server "${options.name}" already exists`);
      return;
    }

    const config: ServerConfig = {
      name: options.name,
      type: options.type,
      config: {},
      enabled: true,
    };

    if (options.type === 'stdio') {
      if (!options.command) {
        console.error('❌ --command is required for stdio servers');
        return;
      }
      config.config.command = options.command;
      config.config.args = options.args || [];
    } else {
      if (!options.url) {
        console.error('❌ --url is required for http servers');
        return;
      }
      config.config.url = new URL(options.url);
    }

    configs.push(config);
    await this.saveConfig(configs);

    console.log(`✅ Server "${options.name}" added successfully`);
  }

  private async removeServer(name: string): Promise<void> {
    const configs = await this.loadConfig();
    const filtered = configs.filter((c) => c.name !== name);

    if (filtered.length === configs.length) {
      console.error(`❌ Server "${name}" not found`);
      return;
    }

    await this.saveConfig(filtered);
    console.log(`✅ Server "${name}" removed successfully`);
  }

  private async testServer(name: string): Promise<void> {
    const configs = await this.loadConfig();
    const config = configs.find((c) => c.name === name);

    if (!config) {
      console.error(`❌ Server "${name}" not found`);
      return;
    }

    console.log(`🧪 Testing server "${name}"...`);

    try {
      const manager = new MCPClientManager([config]);
      await manager.initialize();

      const status = manager.getServerStatus(name);

      if (status?.connected) {
        console.log(`✅ Server "${name}" is working correctly`);
        console.log(`   Tools: ${status.toolCount}`);
        console.log(`   Resources: ${status.resourceCount}`);
      } else {
        console.error(`❌ Server "${name}" failed to connect`);
      }

      await manager.disconnect();
    } catch (error) {
      console.error(`❌ Error testing server:`, error);
    }
  }

  private async showServerInfo(name: string): Promise<void> {
    const configs = await this.loadConfig();
    const config = configs.find((c) => c.name === name);

    if (!config) {
      console.error(`❌ Server "${name}" not found`);
      return;
    }

    console.log(`\n📊 Server Info: ${name}`);
    console.log('━'.repeat(60));
    console.log(`Type: ${config.type}`);
    console.log(`Enabled: ${config.enabled !== false ? 'Yes' : 'No'}`);

    if (config.type === 'stdio') {
      console.log(`Command: ${config.config.command}`);
      console.log(`Args: ${config.config.args?.join(' ') || 'None'}`);
      if (config.config.env) {
        console.log(`Env: ${Object.keys(config.config.env).join(', ')}`);
      }
    } else {
      console.log(`URL: ${config.config.url}`);
    }

    console.log('━'.repeat(60) + '\n');
  }
}

// 运行 CLI
if (require.main === module) {
  const cli = new MCPManagerCLI();
  cli.run(process.argv).catch(console.error);
}
```

---

## 实战案例

### 案例 1:多功能助手

```typescript
// examples/multi-tool-assistant.ts
import { MCPAgent } from '../src/agents/mcp-agent';

async function demo() {
  const agent = new MCPAgent();
  await agent.initialize();

  // 示例 1:Wikipedia 搜索
  await agent.generate('Tell me about the Model Context Protocol');

  // 示例 2:文件操作
  await agent.generate('Create a file called test.txt with "Hello MCP!"');

  // 示例 3:天气查询(如果配置了)
  await agent.generate('What is the weather like in San Francisco?');

  await agent.disconnect();
}

demo();
```

### 案例 2:自动化工作流

```typescript
// examples/workflow-automation.ts
import { MCPAgent } from '../src/agents/mcp-agent';

async function automatedWorkflow() {
  const agent = new MCPAgent();
  await agent.initialize();

  console.log('🚀 Starting automated workflow...\n');

  // Step 1: 研究主题
  console.log('📚 Step 1: Research');
  const research = await agent.generate(
    'Search Wikipedia for "TypeScript programming language" and give me a brief summary',
  );

  // Step 2: 保存到文件
  console.log('💾 Step 2: Save to file');
  await agent.generate(
    `Create a file called typescript-research.md with the following content:\n\n${research}`,
  );

  // Step 3: 验证
  console.log('✅ Step 3: Verify');
  await agent.generate('Read the file typescript-research.md and confirm it was saved correctly');

  console.log('\n✅ Workflow completed!');

  await agent.disconnect();
}

automatedWorkflow();
```

---

## 流程图

### MCP Client 初始化流程

```
┌─────────────────────────────────────────┐
│          Start Initialization           │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│     Load Server Configurations          │
│  • Read from config file                │
│  • Parse environment variables          │
│  • Validate configuration                │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│    Create MCPClient Instance            │
│  • Build server map                     │
│  • Set global timeout                   │
│  • Configure logging                    │
└──────────────────┬──────────────────────┘
                   ↓
          ┌────────┴────────┐
          │  For each server │
          └────────┬────────┘
                   ↓
     ┌─────────────────────────┐
     │  Determine Transport    │
     │  • Stdio (command+args) │
     │  • HTTP (url)           │
     └──────────┬──────────────┘
                ↓
        ┌───────┴────────┐
        │                │
    ┌───▼───┐      ┌─────▼─────┐
    │ Stdio │      │   HTTP    │
    └───┬───┘      └─────┬─────┘
        │                │
        ↓                ↓
  ┌──────────┐    ┌───────────┐
  │ Spawn    │    │  Try      │
  │ Process  │    │ Streamable│
  └────┬─────┘    │  HTTP     │
       │          └─────┬─────┘
       │                ↓
       │          ┌───────────┐
       │          │ Success?  │
       │          └─────┬─────┘
       │                │
       │         ┌──────┴──────┐
       │         ↓             ↓
       │      [Yes]         [No]
       │         │             ↓
       │         │      ┌──────────┐
       │         │      │ Fallback │
       │         │      │ to SSE   │
       │         │      └────┬─────┘
       │         │           │
       └─────────┴───────────┘
                 ↓
┌─────────────────────────────────────────┐
│      Connection Established             │
│  • Send initialize request              │
│  • Exchange capabilities                │
│  • Set up message handlers              │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│       Fetch Server Capabilities         │
│  • List tools                           │
│  • List resources                       │
│  • List prompts                         │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Transform to Mastra Format         │
│  • Namespace tools by server            │
│  • Register tool schemas                │
│  • Store server metadata                │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│        Initialization Complete          │
│  ✅ All servers connected               │
│  ✅ Tools available                     │
│  ✅ Ready to use                        │
└─────────────────────────────────────────┘
```

### 工具调用流程

```
┌─────────────────────────────────────────┐
│         User sends prompt               │
│  "Search Wikipedia for TypeScript"      │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│     Agent receives prompt               │
│  • Add to conversation history          │
│  • Pass to LLM with tool definitions    │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│        LLM generates response           │
│  Decision: Use tool or respond?         │
└──────────────────┬──────────────────────┘
                   ↓
          ┌────────┴────────┐
          │   Tool needed?   │
          └────────┬─────────┘
                   │
         ┌─────────┴─────────┐
         ↓                   ↓
      [Yes]                [No]
         │                   ↓
         ↓          ┌─────────────────┐
┌──────────────────┐│  Return text    │
│ Generate         ││  response       │
│ tool_call        │└─────────────────┘
│ {                │
│   name: "wiki...",
│   args: {...}    │
│ }                │
└────────┬─────────┘
         ↓
┌─────────────────────────────────────────┐
│     Mastra Agent Executor               │
│  • Identify tool by name                │
│  • Parse arguments                      │
│  • Extract server name from namespace   │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      MCPClient routes to server         │
│  Tool: "wikipedia_search"               │
│  → Server: "wikipedia"                  │
└──────────────────┬──────────────────────┘
                   ↓
          ┌────────┴────────┐
          │  Transport type? │
          └────────┬─────────┘
                   │
         ┌─────────┴─────────┐
         ↓                   ↓
    ┌─────────┐         ┌─────────┐
    │  Stdio  │         │  HTTP   │
    └────┬────┘         └────┬────┘
         │                   │
         ↓                   ↓
┌──────────────────┐  ┌──────────────────┐
│ Send via stdin   │  │ POST /mcp/tools  │
│ JSON-RPC request │  │ JSON-RPC request │
└────────┬─────────┘  └─────────┬────────┘
         │                      │
         ↓                      ↓
┌──────────────────┐  ┌──────────────────┐
│ Read from stdout │  │ Parse HTTP resp  │
│ Parse response   │  │ Extract result   │
└────────┬─────────┘  └─────────┬────────┘
         │                      │
         └──────────┬───────────┘
                    ↓
┌─────────────────────────────────────────┐
│        Tool Result Received             │
│  {                                      │
│    content: "TypeScript is...",         │
│    isError: false                       │
│  }                                      │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│    Transform to Message Format          │
│  • Add tool_result message              │
│  • Append to conversation               │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│       Send back to LLM                  │
│  • LLM processes tool result            │
│  • Generates final response             │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Return to User                     │
│  "TypeScript is a typed superset of     │
│   JavaScript that compiles to plain     │
│   JavaScript..."                        │
└─────────────────────────────────────────┘
```

### MCP 服务器通信协议

```
   Client (Mastra Agent)              Server (MCP Server)
         │                                   │
         │ 1. Initialize Connection          │
         ├──────────────────────────────────>│
         │   {                               │
         │     "jsonrpc": "2.0",             │
         │     "method": "initialize",       │
         │     "params": {                   │
         │       "protocolVersion": "...",   │
         │       "capabilities": {...}       │
         │     }                             │
         │   }                               │
         │                                   │
         │                  2. Initialize OK │
         │<──────────────────────────────────┤
         │   {                               │
         │     "result": {                   │
         │       "protocolVersion": "...",   │
         │       "capabilities": {...},      │
         │       "serverInfo": {...}         │
         │     }                             │
         │   }                               │
         │                                   │
         │ 3. List Tools                     │
         ├──────────────────────────────────>│
         │   {                               │
         │     "method": "tools/list"        │
         │   }                               │
         │                                   │
         │                     4. Tools List │
         │<──────────────────────────────────┤
         │   {                               │
         │     "result": {                   │
         │       "tools": [                  │
         │         {                         │
         │           "name": "search",       │
         │           "description": "...",   │
         │           "inputSchema": {...}    │
         │         }                         │
         │       ]                           │
         │     }                             │
         │   }                               │
         │                                   │
         │ 5. Call Tool                      │
         ├──────────────────────────────────>│
         │   {                               │
         │     "method": "tools/call",       │
         │     "params": {                   │
         │       "name": "search",           │
         │       "arguments": {              │
         │         "query": "TypeScript"     │
         │       }                           │
         │     }                             │
         │   }                               │
         │                                   │
         │                    6. Tool Result │
         │<──────────────────────────────────┤
         │   {                               │
         │     "result": {                   │
         │       "content": [                │
         │         {                         │
         │           "type": "text",         │
         │           "text": "Result..."     │
         │         }                         │
         │       ]                           │
         │     }                             │
         │   }                               │
         │                                   │
         │ 7. Disconnect                     │
         ├──────────────────────────────────>│
         │   (close connection)              │
         │                                   │
```

---

## 最佳实践

### 1. 错误处理

```typescript
class RobustMCPAgent {
  async safeToolCall(toolName: string, args: any): Promise<any> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.agent.generate(`Use ${toolName} with ${JSON.stringify(args)}`);
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${i + 1} failed:`, error);

        // 指数退避
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }

    throw new Error(`Failed after ${maxRetries} attempts: ${lastError?.message}`);
  }
}
```

### 2. 性能优化

```typescript
class OptimizedMCPClient {
  private toolCache = new Map<string, any>();
  private cacheExpiry = 5 * 60 * 1000; // 5 分钟

  async getToolsCached(): Promise<Record<string, any>> {
    const cacheKey = 'all-tools';
    const cached = this.toolCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.tools;
    }

    const tools = await this.mcpClient.getTools();
    this.toolCache.set(cacheKey, { tools, timestamp: Date.now() });

    return tools;
  }
}
```

### 3. 日志和监控

```typescript
class MonitoredMCPClient {
  private metrics = {
    toolCalls: new Map<string, number>(),
    errors: new Map<string, number>(),
    latencies: new Map<string, number[]>(),
  };

  async callToolWithMetrics(toolName: string, args: any): Promise<any> {
    const startTime = Date.now();

    try {
      const result = await this.callTool(toolName, args);

      // 记录成功调用
      this.metrics.toolCalls.set(toolName, (this.metrics.toolCalls.get(toolName) || 0) + 1);

      // 记录延迟
      const latency = Date.now() - startTime;
      if (!this.metrics.latencies.has(toolName)) {
        this.metrics.latencies.set(toolName, []);
      }
      this.metrics.latencies.get(toolName)!.push(latency);

      return result;
    } catch (error) {
      // 记录错误
      this.metrics.errors.set(toolName, (this.metrics.errors.get(toolName) || 0) + 1);

      throw error;
    }
  }

  getMetrics() {
    return {
      toolCalls: Object.fromEntries(this.metrics.toolCalls),
      errors: Object.fromEntries(this.metrics.errors),
      avgLatencies: Object.fromEntries(
        Array.from(this.metrics.latencies.entries()).map(([tool, latencies]) => [
          tool,
          latencies.reduce((a, b) => a + b, 0) / latencies.length,
        ]),
      ),
    };
  }
}
```

### 4. 安全性

```typescript
class SecureMCPClient {
  private allowedTools = new Set<string>([
    'wikipedia_search',
    'filesystem_read',
    // 白名单其他安全工具
  ]);

  async validateAndCallTool(toolName: string, args: any): Promise<any> {
    // 验证工具名称
    if (!this.allowedTools.has(toolName)) {
      throw new Error(`Tool ${toolName} is not allowed`);
    }

    // 验证参数
    this.validateArgs(toolName, args);

    // 限制速率
    await this.rateLimitCheck(toolName);

    // 执行调用
    return await this.callTool(toolName, args);
  }

  private validateArgs(toolName: string, args: any): void {
    // 根据工具类型验证参数
    if (toolName.startsWith('filesystem_')) {
      // 确保路径不包含 '..'
      if (args.path && args.path.includes('..')) {
        throw new Error('Path traversal detected');
      }
    }
  }

  private async rateLimitCheck(toolName: string): Promise<void> {
    // 实现速率限制逻辑
  }
}
```

### 5. 测试

```typescript
// tests/mcp-client.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MCPAgent } from '../src/agents/mcp-agent';

describe('MCP Agent', () => {
  let agent: MCPAgent;

  beforeAll(async () => {
    agent = new MCPAgent();
    await agent.initialize();
  });

  afterAll(async () => {
    await agent.disconnect();
  });

  it('should list connected servers', () => {
    const servers = agent.listServers();
    expect(servers.length).toBeGreaterThan(0);
  });

  it('should handle Wikipedia search', async () => {
    const response = await agent.generate('Search for "TypeScript" on Wikipedia');
    expect(response).toContain('TypeScript');
  });

  it('should handle file operations', async () => {
    await agent.generate('Create a test file with "Hello World"');
    const content = await agent.generate('Read the test file');
    expect(content).toContain('Hello World');
  });
});
```

---

## 总结

### 关键要点

1. **MCPClient 是核心** - 通过 `@mastra/mcp` 包管理所有 MCP 服务器连接
2. **两种工具获取方式**:
   - `getTools()` - 静态获取,用于 Agent 定义
   - `getToolsets()` - 动态获取,用于运行时(multi-tenant)
3. **支持多种传输** - Stdio、HTTP(Streamable)、SSE(legacy)
4. **工具命名空间** - 自动以服务器名作为前缀,避免冲突
5. **丰富的 API** - 工具、资源、提示模板、日志

### 完整项目 Checklist

- ✅ 安装 `@mastra/core` 和 `@mastra/mcp`
- ✅ 配置环境变量
- ✅ 创建 ServerConfig 配置
- ✅ 实现 MCPClientManager
- ✅ 创建集成 MCP 的 Agent
- ✅ 添加服务器管理命令
- ✅ 实现错误处理和重试
- ✅ 添加日志和监控
- ✅ 编写测试用例

### 运行项目

```bash
# 安装依赖
npm install

# 运行主程序
npm run dev

# 运行 CLI 工具
npm run mcp-manager list
npm run mcp-manager add -n weather -t http -u https://api.weather.com/mcp

# 运行测试
npm test
```

---

**文档版本**: 1.0  
**最后更新**: 2025-11-13  
**作者**: Claude (基于 Mastra.ai 官方文档整理)
