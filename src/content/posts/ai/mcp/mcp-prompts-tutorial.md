---
title: 'MCP Prompts 完全指南'
date: '2025-11-13'
excerpt: 'Model Context Protocol (MCP) Prompts 功能详解 - 从基础到与 Tools 结合实战'
tags: ['AI', 'MCP']
series: 'AI学习'
---

# MCP Prompts 完全指南

> Model Context Protocol (MCP) Prompts 功能详解 - 从基础到与 Tools 结合实战

## 目录

- [概述](#概述)
- [核心概念](#核心概念)
- [架构设计](#架构设计)
- [Prompts 规范详解](#prompts-规范详解)
- [与 Tools 结合使用](#与-tools-结合使用)
- [完整实现示例](#完整实现示例)
- [最佳实践](#最佳实践)

---

## 概述

### 什么是 MCP Prompts？

MCP Prompts 是 Model Context Protocol 提供的一种标准化方式，允许 **服务器向客户端暴露 Prompt 模板**。Prompts 使服务器能够为与语言模型交互提供结构化的消息和指令。

### 核心特性

- 🎯 **用户控制**：Prompts 设计为用户主动选择和触发，而非模型自动调用
- 🔄 **可定制化**：支持参数化模板，可根据上下文动态生成内容
- 🌐 **多模态支持**：支持文本、图像、音频和嵌入式资源
- 🔗 **资源引用**：可以直接在消息中引用服务器端的资源

### MCP 三大核心功能对比

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP Server Features                       │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Prompts       │   Resources     │        Tools            │
│  (用户控制)      │  (应用控制)      │      (模型控制)          │
├─────────────────┼─────────────────┼─────────────────────────┤
│ • 用户主动触发   │ • 静态/动态内容  │ • 模型自动调用           │
│ • Prompt 模板   │ • 只读数据源     │ • 可执行操作             │
│ • 工作流入口     │ • 上下文提供     │ • 可修改状态             │
│ • Slash 命令    │ • RAG 数据      │ • API 调用               │
└─────────────────┴─────────────────┴─────────────────────────┘
```

---

## 核心概念

### 用户交互模型

Prompts 遵循**用户控制**的设计理念：

```
用户操作流程:
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ 用户发现  │ -> │ 用户选择  │ -> │ 提供参数  │ -> │ 执行工作流 │
│ Prompts  │    │ Prompt   │    │ (可选)    │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     ↓               ↓               ↓               ↓
   列表显示      点击/命令      填写表单        LLM 处理

典型触发方式:
• Slash 命令: /code-review
• UI 按钮: [Review Code]
• 下拉菜单: Select Prompt -> Code Review
• 快捷键: Cmd+K -> Code Review
```

### Prompts vs Tools 的区别

| 特性         | Prompts                                          | Tools                                |
| ------------ | ------------------------------------------------ | ------------------------------------ |
| **控制方**   | 👤 用户主动选择                                  | 🤖 LLM 自动决策                      |
| **触发时机** | 用户明确选择时                                   | LLM 判断需要时                       |
| **用途**     | 提供指令和上下文                                 | 执行具体操作                         |
| **返回内容** | 结构化消息                                       | 执行结果                             |
| **状态改变** | 不修改状态                                       | 可能修改状态                         |
| **典型场景** | 代码审查提示词<br/>报告生成模板<br/>工作流启动器 | 数据库查询<br/>文件操作<br/>API 调用 |

---

## 架构设计

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         Host Application                      │
│                    (Claude Desktop, VS Code, etc.)            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                      MCP Client                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │   Prompts    │  │  Resources   │  │    Tools     │ │  │
│  │  │   Manager    │  │   Manager    │  │   Manager    │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  │         ↕               ↕                   ↕          │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │         JSON-RPC 2.0 Communication               │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ (stdio/HTTP+SSE)
┌─────────────────────────────────────────────────────────────┐
│                         MCP Server                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                 Capabilities Declaration                │  │
│  │  prompts: { listChanged: true }                        │  │
│  │  tools: {}                                             │  │
│  │  resources: {}                                         │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                   Request Handlers                      │  │
│  │  • prompts/list    -> 返回可用 Prompts                  │  │
│  │  • prompts/get     -> 获取特定 Prompt 内容              │  │
│  │  • tools/list      -> 返回可用 Tools                    │  │
│  │  • tools/call      -> 执行 Tool                        │  │
│  │  • resources/list  -> 返回可用 Resources                │  │
│  │  • resources/read  -> 读取 Resource 内容               │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                       │  │
│  │  • Prompt Templates                                    │  │
│  │  • Tool Implementations                                │  │
│  │  • Resource Providers                                  │  │
│  │  • External API Integrations                           │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Prompt 工作流程图

```
用户触发 Prompt 完整流程:

┌────────┐
│  用户   │
└───┬────┘
    │ 1. 选择 Prompt (例如: /code-review)
    ↓
┌────────────────────┐
│   MCP Client       │
│  (Claude Desktop)  │
└────────┬───────────┘
         │ 2. prompts/list (可选，发现 Prompts)
         ↓
┌─────────────────────────────────────────────┐
│            MCP Server                        │
│  返回: [                                     │
│    {                                        │
│      name: "code_review",                  │
│      description: "Code review prompt",    │
│      arguments: [{ name: "code", ... }]    │
│    }                                        │
│  ]                                          │
└────────┬────────────────────────────────────┘
         │ 3. 返回可用 Prompts
         ↓
┌────────────────────┐
│   MCP Client       │
│  显示 Prompts 列表  │
└────────┬───────────┘
         │ 4. prompts/get
         │    { name: "code_review",
         │      arguments: { code: "def hello()..." } }
         ↓
┌─────────────────────────────────────────────┐
│            MCP Server                        │
│  • 处理参数                                   │
│  • 填充模板                                   │
│  • 可能调用 Tools 获取上下文                   │
│  • 可能读取 Resources                         │
│  返回: {                                     │
│    messages: [                              │
│      {                                      │
│        role: "user",                        │
│        content: {                           │
│          type: "text",                      │
│          text: "Please review this code..." │
│        }                                    │
│      }                                      │
│    ]                                        │
│  }                                          │
└────────┬────────────────────────────────────┘
         │ 5. 返回结构化消息
         ↓
┌────────────────────┐
│   MCP Client       │
│  • 将消息发送给 LLM │
│  • 展示结果给用户    │
└────────────────────┘
```

---

## Prompts 规范详解

### 能力声明

服务器必须在初始化时声明 `prompts` 能力：

```typescript
// Server 初始化
const server = new Server(
  {
    name: 'example-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      prompts: {
        listChanged: true, // 支持列表变化通知
      },
      tools: {}, // 同时支持 Tools
      resources: {}, // 同时支持 Resources
    },
  },
);
```

### 协议消息

#### 1. 列出 Prompts (`prompts/list`)

**请求示例：**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "prompts/list",
  "params": {
    "cursor": "optional-cursor-value" // 支持分页
  }
}
```

**响应示例：**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "prompts": [
      {
        "name": "code_review",
        "title": "Request Code Review",
        "description": "Asks the LLM to analyze code quality and suggest improvements",
        "arguments": [
          {
            "name": "code",
            "description": "The code to review",
            "required": true
          },
          {
            "name": "language",
            "description": "Programming language",
            "required": false
          }
        ]
      },
      {
        "name": "bug_report",
        "title": "Generate Bug Report",
        "description": "Creates a structured bug report template",
        "arguments": [
          {
            "name": "error_message",
            "description": "The error message",
            "required": true
          },
          {
            "name": "steps",
            "description": "Steps to reproduce",
            "required": false
          }
        ]
      }
    ],
    "nextCursor": "next-page-cursor"
  }
}
```

#### 2. 获取 Prompt (`prompts/get`)

**请求示例：**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "prompts/get",
  "params": {
    "name": "code_review",
    "arguments": {
      "code": "def hello():\n    print('world')",
      "language": "python"
    }
  }
}
```

**响应示例：**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "description": "Code review prompt",
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Please review this Python code:\n\ndef hello():\n    print('world')\n\nProvide feedback on:\n1. Code quality\n2. Best practices\n3. Potential improvements"
        }
      }
    ]
  }
}
```

#### 3. 列表变化通知

当 Prompts 列表发生变化时，服务器发送通知：

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/prompts/list_changed"
}
```

### 内容类型

Prompts 支持多种内容类型：

#### 1. 文本内容 (Text Content)

```json
{
  "type": "text",
  "text": "The text content of the message",
  "annotations": {
    "audience": ["user"],
    "priority": 0.8
  }
}
```

#### 2. 图像内容 (Image Content)

```json
{
  "type": "image",
  "data": "base64-encoded-image-data",
  "mimeType": "image/png",
  "annotations": {
    "audience": ["assistant"]
  }
}
```

#### 3. 音频内容 (Audio Content)

```json
{
  "type": "audio",
  "data": "base64-encoded-audio-data",
  "mimeType": "audio/wav"
}
```

#### 4. 嵌入式资源 (Embedded Resources)

```json
{
  "type": "resource",
  "resource": {
    "uri": "resource://example",
    "mimeType": "text/plain",
    "text": "Resource content"
  }
}
```

或二进制资源：

```json
{
  "type": "resource",
  "resource": {
    "uri": "resource://image",
    "mimeType": "image/png",
    "blob": "base64-encoded-binary-data"
  }
}
```

---

## 与 Tools 结合使用

### 集成架构

Prompts 和 Tools 可以协同工作，创建强大的工作流：

```
工作流示例: 代码审查流程

┌─────────────────────────────────────────────────────────────┐
│  1. 用户触发 Prompt                                           │
│     /code-review                                             │
└────────────┬────────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Prompt 处理阶段 (Server)                                  │
│     ┌───────────────────────────────────────────────┐       │
│     │ • 调用 Tool: get_git_diff                      │       │
│     │   获取代码变更                                  │       │
│     ├───────────────────────────────────────────────┤       │
│     │ • 调用 Tool: fetch_code_standards              │       │
│     │   获取代码规范                                  │       │
│     ├───────────────────────────────────────────────┤       │
│     │ • 读取 Resource: team_guidelines               │       │
│     │   获取团队指南                                  │       │
│     ├───────────────────────────────────────────────┤       │
│     │ • 组合所有信息到 Prompt 模板                    │       │
│     └───────────────────────────────────────────────┘       │
└────────────┬────────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────────┐
│  3. 返回结构化消息给 LLM                                      │
│     {                                                        │
│       messages: [                                           │
│         {                                                   │
│           role: "user",                                     │
│           content: {                                        │
│             type: "text",                                   │
│             text: "Review this code change:\n" +            │
│                   "[git diff]\n" +                          │
│                   "Against standards:\n" +                  │
│                   "[code standards]\n" +                    │
│                   "Team guidelines:\n" +                    │
│                   "[guidelines]"                            │
│           }                                                 │
│         }                                                   │
│       ]                                                     │
│     }                                                       │
└────────────┬────────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────────┐
│  4. LLM 处理并生成审查结果                                     │
└────────────┬────────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────────┐
│  5. (可选) LLM 决定调用 Tool                                  │
│     Tool: create_github_issue                               │
│     如果发现严重问题，自动创建 Issue                           │
└─────────────────────────────────────────────────────────────┘
```

### 协同工作模式

#### 模式 1: Prompt 使用 Tool 收集上下文

**场景**：生成项目报告

```typescript
// Prompt 处理器
async function getProjectReportPrompt(args: { projectId: string }) {
  // 1. 调用 Tool 获取项目数据
  const projectData = await callTool('get_project_data', {
    id: args.projectId,
  });

  // 2. 调用 Tool 获取团队成员
  const teamMembers = await callTool('get_team_members', {
    projectId: args.projectId,
  });

  // 3. 读取 Resource 获取报告模板
  const template = await readResource('resource://templates/report');

  // 4. 组合成 Prompt
  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Generate a project report using this data:

Project Info:
${JSON.stringify(projectData, null, 2)}

Team Members:
${JSON.stringify(teamMembers, null, 2)}

Follow this template structure:
${template}

Please create a comprehensive report covering:
1. Project overview
2. Team composition
3. Current status
4. Key metrics
5. Recommendations`,
        },
      },
    ],
  };
}
```

#### 模式 2: Prompt 触发 -> LLM 调用 Tool

**场景**：交互式问题诊断

```typescript
// 1. 定义诊断 Prompt
const diagnosticPrompt = {
  name: 'diagnose_issue',
  description: 'Interactive issue diagnosis workflow',
  arguments: [{ name: 'symptom', description: 'Issue symptom', required: true }],
};

// 2. Prompt 返回消息，指导 LLM 使用 Tools
async function getDiagnosticPrompt(args: { symptom: string }) {
  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `User reported: ${args.symptom}

Please diagnose this issue by:
1. Use 'check_system_logs' tool to examine recent logs
2. Use 'check_service_health' tool to verify service status
3. Use 'query_metrics' tool to analyze performance metrics
4. Based on findings, suggest solutions
5. If needed, use 'create_ticket' tool to escalate

Start the diagnosis now.`,
        },
      },
    ],
  };
}

// 3. 定义 LLM 可用的 Tools
const diagnosticTools = [
  {
    name: 'check_system_logs',
    inputSchema: {
      type: 'object',
      properties: {
        timeRange: { type: 'string' },
        level: { type: 'string', enum: ['error', 'warn', 'info'] },
      },
    },
  },
  {
    name: 'check_service_health',
    inputSchema: {
      type: 'object',
      properties: {
        serviceName: { type: 'string' },
      },
    },
  },
  {
    name: 'query_metrics',
    inputSchema: {
      type: 'object',
      properties: {
        metricName: { type: 'string' },
        duration: { type: 'string' },
      },
    },
  },
  {
    name: 'create_ticket',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
      },
    },
  },
];
```

#### 模式 3: 复杂工作流编排

**场景**：自动化部署检查清单

```
部署前检查工作流:

User: /pre-deployment-check --env=production

  ↓ (Prompt: pre_deployment_check)

Server 处理 Prompt:
  1. 读取 Resource: deployment_checklist
  2. 生成结构化指令给 LLM

  ↓

LLM 收到 Prompt，开始执行检查:
  ├─→ Tool: run_unit_tests
  │   └─→ Result: ✅ All tests passed
  │
  ├─→ Tool: check_dependencies
  │   └─→ Result: ⚠️  2 outdated packages
  │
  ├─→ Tool: security_scan
  │   └─→ Result: ✅ No vulnerabilities
  │
  ├─→ Tool: check_database_migrations
  │   └─→ Result: ✅ All migrations applied
  │
  └─→ Tool: verify_config
      └─→ Result: ✅ Config valid

  ↓

LLM 汇总结果:
  ├─→ 如果所有检查通过:
  │   └─→ Tool: approve_deployment
  │
  └─→ 如果有问题:
      ├─→ Tool: create_blocking_issue
      └─→ Tool: notify_team
```

---

## 完整实现示例

### TypeScript 完整示例

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// ========== 数据存储 ==========

const codeReviewGuidelines = `
# Code Review Guidelines

## Quality Checklist
- [ ] Code follows style guide
- [ ] Functions are well-named and documented
- [ ] No code duplication
- [ ] Error handling is appropriate
- [ ] Tests are included

## Security Checklist
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] SQL injection prevented
- [ ] XSS vulnerabilities addressed
`;

const bugReportTemplate = `
# Bug Report

## Description
[Describe the bug]

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- OS: 
- Browser: 
- Version: 

## Additional Context
[Any other relevant information]
`;

// ========== Server 初始化 ==========

const server = new Server(
  {
    name: 'code-assistant-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      prompts: {
        listChanged: true,
      },
      tools: {},
      resources: {},
    },
  },
);

// ========== Prompts 实现 ==========

// 1. 列出所有 Prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'code_review',
        title: 'Code Review Assistant',
        description: 'Comprehensive code review with best practices',
        arguments: [
          {
            name: 'code',
            description: 'Code to review',
            required: true,
          },
          {
            name: 'language',
            description: 'Programming language',
            required: false,
          },
          {
            name: 'context',
            description: 'Additional context',
            required: false,
          },
        ],
      },
      {
        name: 'bug_report',
        title: 'Bug Report Generator',
        description: 'Generate structured bug report',
        arguments: [
          {
            name: 'error_message',
            description: 'Error message or description',
            required: true,
          },
          {
            name: 'severity',
            description: 'Bug severity (low/medium/high/critical)',
            required: false,
          },
        ],
      },
      {
        name: 'architecture_review',
        title: 'Architecture Review',
        description: 'Review system architecture and design',
        arguments: [
          {
            name: 'component',
            description: 'Component or system to review',
            required: true,
          },
        ],
      },
    ],
  };
});

// 2. 获取特定 Prompt
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'code_review': {
      const code = args?.code as string;
      const language = (args?.language as string) || 'unknown';
      const context = (args?.context as string) || '';

      // 可以在这里调用 Tools 获取更多信息
      // 例如：获取相关的代码标准、团队规范等

      return {
        description: 'Code review prompt with guidelines',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please perform a comprehensive code review for this ${language} code.

${context ? `Context: ${context}\n` : ''}

Code to review:
\`\`\`${language}
${code}
\`\`\`

Review Guidelines:
${codeReviewGuidelines}

Please provide:
1. **Overall Assessment**: Brief summary of code quality
2. **Strengths**: What's done well
3. **Issues Found**: Categorized by severity
   - 🔴 Critical: Must fix
   - 🟡 Warning: Should fix
   - 🔵 Suggestion: Nice to have
4. **Security Concerns**: Any security vulnerabilities
5. **Performance Considerations**: Potential optimizations
6. **Recommendations**: Specific improvement suggestions with code examples`,
            },
          },
        ],
      };
    }

    case 'bug_report': {
      const errorMessage = args?.error_message as string;
      const severity = (args?.severity as string) || 'medium';

      return {
        description: 'Bug report generation prompt',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Generate a detailed bug report based on this error:

Error: ${errorMessage}
Severity: ${severity}

Please create a structured bug report including:

${bugReportTemplate}

Based on the error message, please:
1. Fill in as many details as possible
2. Suggest likely reproduction steps
3. Identify potential root causes
4. Recommend debugging approaches
5. Suggest potential fixes`,
            },
          },
        ],
      };
    }

    case 'architecture_review': {
      const component = args?.component as string;

      return {
        description: 'Architecture review prompt',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Review the architecture and design of: ${component}

Please analyze:

## Architecture Analysis
1. **Design Patterns**: Identify patterns used and their appropriateness
2. **Scalability**: Assess ability to handle growth
3. **Maintainability**: Evaluate code organization and clarity
4. **Testability**: Review test coverage and test design
5. **Security**: Identify potential security concerns
6. **Performance**: Analyze performance characteristics

## Specific Concerns
- Are there any architectural anti-patterns?
- Is the component loosely coupled?
- Does it follow SOLID principles?
- Are there any circular dependencies?

## Recommendations
Provide specific, actionable improvements with:
- Priority (High/Medium/Low)
- Estimated effort
- Expected impact
- Implementation suggestions`,
            },
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

// ========== Tools 实现 ==========

// 1. 列出所有 Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_code_metrics',
        description: 'Analyze code and return metrics (complexity, lines, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code to analyze',
            },
            language: {
              type: 'string',
              description: 'Programming language',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'fetch_team_standards',
        description: 'Fetch team coding standards and conventions',
        inputSchema: {
          type: 'object',
          properties: {
            team: {
              type: 'string',
              description: 'Team name',
            },
            category: {
              type: 'string',
              description: 'Standard category (style/security/testing)',
            },
          },
          required: ['team'],
        },
      },
      {
        name: 'create_issue',
        description: 'Create an issue in issue tracking system',
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Issue title',
            },
            description: {
              type: 'string',
              description: 'Issue description',
            },
            severity: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Issue severity',
            },
            labels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Issue labels',
            },
          },
          required: ['title', 'description'],
        },
      },
    ],
  };
});

// 2. 执行 Tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'get_code_metrics': {
      const code = args?.code as string;
      const language = args?.language as string;

      // 实际实现中会进行真实的代码分析
      const lines = code.split('\n').length;
      const complexity = Math.floor(Math.random() * 10) + 1; // 模拟

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                language: language || 'unknown',
                metrics: {
                  lines_of_code: lines,
                  cyclomatic_complexity: complexity,
                  maintainability_index: 85,
                  technical_debt_ratio: 2.5,
                },
                analysis: {
                  quality: complexity < 5 ? 'good' : 'needs improvement',
                  recommendations: [
                    complexity > 7 && 'Consider breaking down complex functions',
                    lines > 100 && 'Consider splitting into smaller modules',
                  ].filter(Boolean),
                },
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    case 'fetch_team_standards': {
      const team = args?.team as string;
      const category = (args?.category as string) || 'all';

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                team,
                category,
                standards: {
                  style: {
                    indentation: '2 spaces',
                    lineLength: 100,
                    naming: 'camelCase for variables, PascalCase for classes',
                  },
                  security: {
                    authentication: 'Use OAuth 2.0',
                    dataValidation: 'Validate all inputs',
                    encryption: 'TLS 1.3 minimum',
                  },
                  testing: {
                    coverage: '80% minimum',
                    framework: 'Jest for unit tests',
                    e2e: 'Playwright for E2E tests',
                  },
                },
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    case 'create_issue': {
      const title = args?.title as string;
      const description = args?.description as string;
      const severity = (args?.severity as string) || 'medium';
      const labels = (args?.labels as string[]) || [];

      // 实际实现中会调用 API 创建 issue
      const issueId = `ISSUE-${Math.floor(Math.random() * 10000)}`;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                issue: {
                  id: issueId,
                  title,
                  description,
                  severity,
                  labels,
                  url: `https://issues.example.com/${issueId}`,
                  created_at: new Date().toISOString(),
                },
                message: `Issue ${issueId} created successfully`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// ========== Resources 实现 ==========

// 1. 列出所有 Resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'resource://guidelines/code-review',
        name: 'Code Review Guidelines',
        description: 'Team code review guidelines and checklist',
        mimeType: 'text/markdown',
      },
      {
        uri: 'resource://templates/bug-report',
        name: 'Bug Report Template',
        description: 'Standard bug report template',
        mimeType: 'text/markdown',
      },
      {
        uri: 'resource://docs/architecture-principles',
        name: 'Architecture Principles',
        description: 'System architecture principles and patterns',
        mimeType: 'text/markdown',
      },
    ],
  };
});

// 2. 读取 Resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'resource://guidelines/code-review':
      return {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: codeReviewGuidelines,
          },
        ],
      };

    case 'resource://templates/bug-report':
      return {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: bugReportTemplate,
          },
        ],
      };

    case 'resource://docs/architecture-principles':
      return {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: `# Architecture Principles

## Core Principles
1. **Separation of Concerns**: Each component has a single responsibility
2. **Loose Coupling**: Components are independent and interchangeable
3. **High Cohesion**: Related functionality is grouped together
4. **DRY (Don't Repeat Yourself)**: Avoid code duplication
5. **SOLID Principles**: Follow object-oriented design principles

## Design Patterns
- **Microservices**: For scalable, distributed systems
- **Event-Driven**: For decoupled, asynchronous communication
- **CQRS**: For complex domain models
- **API Gateway**: For centralized API management

## Best Practices
- Use dependency injection
- Implement comprehensive logging
- Design for failure and resilience
- Document architectural decisions (ADRs)
- Regular architecture reviews`,
          },
        ],
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// ========== 启动服务器 ==========

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Code Assistant MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
```

---

## 最佳实践

### 1. Prompt 设计原则

#### ✅ 好的 Prompt 设计

```typescript
// 好的设计：清晰、结构化、可参数化
{
  name: "security_audit",
  description: "Perform comprehensive security audit",
  arguments: [
    {
      name: "scope",
      description: "Audit scope (code/infrastructure/full)",
      required: true
    },
    {
      name: "severity_threshold",
      description: "Minimum severity to report (low/medium/high/critical)",
      required: false
    }
  ]
}

// Prompt 内容结构清晰
messages: [{
  role: "user",
  content: {
    type: "text",
    text: `# Security Audit: ${scope}

## Audit Areas
1. Authentication & Authorization
2. Data Protection
3. Input Validation
4. Dependency Vulnerabilities
5. Configuration Security

## Severity Threshold: ${threshold}

Please analyze and report findings with:
- Severity level
- Description
- Location
- Remediation steps
- OWASP category (if applicable)`
  }
}]
```

#### ❌ 避免的设计

```typescript
// 不好的设计：模糊、缺乏结构
{
  name: "check",
  description: "Check stuff",
  arguments: [
    {
      name: "thing",
      required: true
    }
  ]
}

// Prompt 内容不清晰
messages: [{
  role: "user",
  content: {
    type: "text",
    text: "Check this: " + thing
  }
}]
```

### 2. 与 Tools 结合的最佳实践

#### Pattern 1: Pre-fetch Context

```typescript
// Prompt 处理前收集所有需要的上下文
async function getEnhancedPrompt(args) {
  // 1. 并行获取所有相关信息
  const [codeStandards, teamGuidelines, recentIssues] = await Promise.all([
    callTool('fetch_code_standards', { team: args.team }),
    readResource('resource://guidelines/team'),
    callTool('get_recent_issues', { project: args.project }),
  ]);

  // 2. 组合成丰富的 Prompt
  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Context-aware code review...
        
Standards:
${codeStandards}

Guidelines:
${teamGuidelines}

Recent Issues to Watch:
${recentIssues.map((i) => `- ${i.title}`).join('\n')}

Now review this code: ${args.code}`,
        },
      },
    ],
  };
}
```

#### Pattern 2: Progressive Enhancement

```typescript
// 先返回基础 Prompt，让 LLM 决定是否需要更多信息
async function getProgressivePrompt(args) {
  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Review this code: ${args.code}

You have access to these tools if needed:
- fetch_similar_code: Find similar code patterns
- get_test_coverage: Check test coverage
- query_performance_metrics: Get performance data

Use tools only if they would help the review.`,
        },
      },
    ],
  };
}
```

### 3. 错误处理

```typescript
// 完善的错误处理
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // 1. 验证 Prompt 名称
    if (!VALID_PROMPTS.includes(name)) {
      throw new McpError(ErrorCode.InvalidParams, `Unknown prompt: ${name}`);
    }

    // 2. 验证必需参数
    const promptDef = PROMPT_DEFINITIONS[name];
    const missingArgs = promptDef.arguments
      .filter((arg) => arg.required && !args?.[arg.name])
      .map((arg) => arg.name);

    if (missingArgs.length > 0) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Missing required arguments: ${missingArgs.join(', ')}`,
      );
    }

    // 3. 处理 Prompt
    const result = await generatePrompt(name, args);

    return result;
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }

    // 4. 处理意外错误
    console.error('Error generating prompt:', error);
    throw new McpError(ErrorCode.InternalError, `Failed to generate prompt: ${error.message}`);
  }
});
```

### 4. 性能优化

```typescript
// 1. 缓存常用数据
const cache = new Map<string, { data: any; timestamp: number }>();

async function getCachedResource(uri: string, ttl: number = 300000) {
  const cached = cache.get(uri);

  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetchResource(uri);
  cache.set(uri, { data, timestamp: Date.now() });

  return data;
}

// 2. 批量操作
async function getPromptWithMultipleResources(args) {
  // 并行获取多个资源
  const resources = await Promise.all([
    getCachedResource('resource://standards'),
    getCachedResource('resource://guidelines'),
    getCachedResource('resource://templates'),
  ]);

  return buildPrompt(args, resources);
}

// 3. 流式响应（对于大型 Prompts）
async function* streamPromptContent(name: string, args: any) {
  yield { type: 'header', content: generateHeader(args) };
  yield { type: 'context', content: await fetchContext(args) };
  yield { type: 'instructions', content: generateInstructions(args) };
  yield { type: 'examples', content: await fetchExamples(args) };
}
```

### 5. 安全考虑

```typescript
// 1. 输入验证
function validatePromptArguments(args: any, schema: ArgumentSchema[]) {
  for (const argDef of schema) {
    const value = args[argDef.name];

    // 检查必需参数
    if (argDef.required && !value) {
      throw new Error(`Missing required argument: ${argDef.name}`);
    }

    // 验证字符串长度
    if (typeof value === 'string' && value.length > 10000) {
      throw new Error(`Argument ${argDef.name} exceeds maximum length`);
    }

    // 防止注入攻击
    if (typeof value === 'string') {
      // 移除潜在的危险字符
      args[argDef.name] = sanitizeInput(value);
    }
  }

  return args;
}

// 2. 资源访问控制
async function checkResourceAccess(uri: string, userId: string) {
  const resource = await getResource(uri);

  if (resource.private && !hasAccess(userId, resource)) {
    throw new Error('Access denied to resource');
  }

  return resource;
}

// 3. 限流
const rateLimiter = new RateLimiter({
  windowMs: 60000, // 1 分钟
  max: 100, // 最多 100 次请求
});

async function handlePromptRequest(request) {
  if (!rateLimiter.check(request.clientId)) {
    throw new Error('Rate limit exceeded');
  }

  // 处理请求...
}
```

### 6. 测试策略

```typescript
// 单元测试 Prompts
describe('Code Review Prompt', () => {
  it('should generate prompt with all required sections', async () => {
    const result = await getPrompt('code_review', {
      code: 'function test() {}',
      language: 'javascript',
    });

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].content.text).toContain('Review Guidelines');
    expect(result.messages[0].content.text).toContain('function test()');
  });

  it('should handle missing optional arguments', async () => {
    const result = await getPrompt('code_review', {
      code: 'function test() {}',
      // language 未提供
    });

    expect(result.messages[0].content.text).toContain('unknown');
  });

  it('should throw error for missing required arguments', async () => {
    await expect(getPrompt('code_review', {})).rejects.toThrow('Missing required argument: code');
  });
});

// 集成测试：Prompts + Tools
describe('Prompt Tool Integration', () => {
  it('should call tools when generating prompt', async () => {
    const mockTool = jest.fn().mockResolvedValue({ standards: '...' });

    const result = await getPromptWithContext(
      'code_review',
      {
        code: 'test',
        fetchStandards: true,
      },
      { callTool: mockTool },
    );

    expect(mockTool).toHaveBeenCalledWith('fetch_code_standards');
    expect(result.messages[0].content.text).toContain('standards');
  });
});
```

### 7. 文档和可发现性

```typescript
// 为每个 Prompt 提供完整的文档
const PROMPT_DOCS = {
  code_review: {
    name: 'code_review',
    title: 'Code Review Assistant',
    description: `
Performs comprehensive code review following team standards.

**Features:**
- Static analysis integration
- Team-specific guidelines
- Security vulnerability detection
- Performance recommendations

**When to use:**
- Before merging PRs
- During code walkthrough sessions
- For learning and improvement

**Example:**
\`\`\`
/code-review --code="..." --language="typescript" --context="API endpoint"
\`\`\`
    `,
    arguments: [
      /* ... */
    ],
    examples: [
      {
        description: 'Review TypeScript API code',
        arguments: {
          code: 'export async function handler(req, res) {...}',
          language: 'typescript',
          context: 'REST API endpoint handler',
        },
      },
    ],
    relatedTools: ['get_code_metrics', 'fetch_team_standards'],
    relatedResources: ['resource://guidelines/code-review'],
  },
};
```

---

## 总结

### MCP Prompts 的价值

1. **标准化工作流入口**：通过 Prompts 为用户提供一致的交互方式
2. **上下文丰富**：结合 Tools 和 Resources 提供完整的上下文
3. **用户控制**：保持用户对 AI 交互的完全控制权
4. **可组合性**：Prompts、Tools、Resources 三者协同工作

### 架构决策建议

| 场景                   | 推荐方案                              |
| ---------------------- | ------------------------------------- |
| 用户发起的工作流       | 使用 **Prompts**                      |
| 需要模型自主决策的操作 | 使用 **Tools**                        |
| 静态参考数据           | 使用 **Resources**                    |
| 复杂的多步骤流程       | **Prompts** 启动 → **Tools** 执行     |
| 需要收集上下文再执行   | **Tools** 获取数据 → **Prompts** 组装 |

### 下一步

- 🔧 实现自己的 MCP Server
- 📚 阅读 [MCP 官方文档](https://modelcontextprotocol.io)
- 🎨 设计适合你应用场景的 Prompts
- 🔗 探索 Prompts、Tools、Resources 的组合方式
- 🚀 在生产环境中部署和监控

---

## 参考资源

- [MCP 官方规范](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [MCP Server 示例](https://github.com/modelcontextprotocol/servers)
- [Claude MCP 文档](https://docs.claude.com/en/docs/mcp)

---

**License**: MIT  
**Last Updated**: 2025-06-18  
**Protocol Version**: 2025-06-18
