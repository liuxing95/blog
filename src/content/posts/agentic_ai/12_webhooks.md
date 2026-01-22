---
title: 'Webhook 与 OpenAI Agents SDK 集成：构建外部触发的智能工作流'
date: '2026-01-22'
excerpt: '深入学习 n8n Webhook 节点、HTTP 请求响应处理、API 认证方法，以及如何集成 OpenAI Agents SDK 构建可外部触发的 AI Agent 工作流。'
tags: ['Agentic AI']
series: 'Agentic AI'
---

# Webhook 与 OpenAI Agents SDK 集成：构建外部触发的智能工作流

## 目录

1. [引言](#1-引言)
2. [n8n Webhook 基础](#2-n8n-webhook-基础)
3. [HTTP 请求与响应](#3-http-请求与响应)
4. [API 认证方法](#4-api-认证方法)
5. [OpenAI Agents SDK 集成](#5-openai-agents-sdk-集成)
6. [AI Agent 高级功能](#6-ai-agent-高级功能)
7. [外部触发的 Agent 工作流](#7-外部触发的-agent-工作流)
8. [测试与调试](#8-测试与调试)
9. [生产部署](#9-生产部署)
10. [最佳实践](#10-最佳实践)

---

## 1. 引言

### 1.1 学习目标

> **从静态工作流到动态 API 驱动的 AI Agent 系统**

本章核心：
- 理解 Webhook 如何让 n8n 工作流可被外部调用
- 掌握 HTTP 请求/响应的完整生命周期
- 实现安全的 API 认证机制
- 集成 OpenAI Agents SDK 构建生产级 Agent

### 1.2 为什么需要 Webhook

**没有 Webhook 的局限**：
- ❌ 工作流只能手动触发或定时执行
- ❌ 无法与外部系统集成
- ❌ 不能构建 API 服务
- ❌ 无法实现实时响应

**Webhook 的价值**：
- ✅ 将工作流转化为 API 端点
- ✅ 实时响应外部事件
- ✅ 与任何系统集成
- ✅ 构建可扩展的服务

### 1.3 应用场景

```mermaid
graph LR
    A[外部应用] -->|HTTP POST| B[n8n Webhook]
    B --> C[AI Agent]
    C --> D[处理逻辑]
    D --> E[返回响应]
    E -->|JSON| A
    
    F[聊天应用] -->|用户消息| B
    G[CRM 系统] -->|客户事件| B
    H[IoT 设备] -->|传感器数据| B
```

**典型场景**：
- 聊天机器人 API
- 客户服务自动化
- 数据处理管道
- 事件驱动的工作流
- 第三方系统集成

---

## 2. n8n Webhook 基础

### 2.1 Webhook 节点类型

n8n 提供两种 Webhook 节点：

| 节点类型 | 用途 | URL 特点 | 适用场景 |
|---------|------|---------|---------|
| **Webhook** | 生产环境 | 固定 URL | 生产 API、第三方集成 |
| **Webhook (Test)** | 开发测试 | 临时 URL | 本地开发、调试 |

### 2.2 创建基础 Webhook

#### 步骤 1: 添加 Webhook 节点

```typescript
// n8n 工作流配置
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "parameters": {
        "httpMethod": "POST",
        "path": "agent-chat",
        "responseMode": "responseNode",
        "options": {}
      }
    }
  ]
}
```

#### 步骤 2: 配置 Webhook 参数

```javascript
// Webhook 节点配置
const webhookConfig = {
  // HTTP 方法
  httpMethod: 'POST',  // GET, POST, PUT, DELETE, PATCH
  
  // URL 路径
  path: 'agent-chat',  // https://your-n8n.com/webhook/agent-chat
  
  // 响应模式
  responseMode: 'responseNode',  // 'onReceived', 'lastNode', 'responseNode'
  
  // 认证
  authentication: 'headerAuth',  // 'none', 'basicAuth', 'headerAuth'
  
  // 选项
  options: {
    rawBody: false,  // 是否接收原始 body
    allowedOrigins: '*',  // CORS 配置
    responseHeaders: {
      'Content-Type': 'application/json'
    }
  }
};
```

### 2.3 Webhook URL 结构

```bash
# 生产 URL
https://your-n8n-instance.com/webhook/your-path

# 测试 URL
https://your-n8n-instance.com/webhook-test/your-path

# 带参数的 URL
https://your-n8n-instance.com/webhook/agent-chat?userId=123&sessionId=abc
```

### 2.4 响应模式详解

```mermaid
graph TD
    A[Webhook 接收请求] --> B{响应模式}
    
    B -->|onReceived| C[立即返回 200 OK]
    C --> D[后台继续执行]
    
    B -->|lastNode| E[执行完所有节点]
    E --> F[返回最后节点输出]
    
    B -->|responseNode| G[执行到 Respond 节点]
    G --> H[返回自定义响应]
```

**模式对比**：

```typescript
// 1. onReceived - 立即响应
// 适用场景: 长时间处理，不需要等待结果
{
  responseMode: 'onReceived',
  // 客户端立即收到: { "message": "Workflow started" }
}

// 2. lastNode - 返回最后节点
// 适用场景: 简单工作流，返回处理结果
{
  responseMode: 'lastNode',
  // 客户端收到最后一个节点的输出
}

// 3. responseNode - 自定义响应
// 适用场景: 需要精确控制响应格式
{
  responseMode: 'responseNode',
  // 需要配合 "Respond to Webhook" 节点
}
```

### 2.5 接收数据

```javascript
// Webhook 接收到的数据结构
{
  "headers": {
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0",
    "authorization": "Bearer token123"
  },
  "params": {
    "userId": "123",
    "sessionId": "abc"
  },
  "query": {
    "filter": "active"
  },
  "body": {
    "message": "Hello, Agent!",
    "metadata": {
      "timestamp": "2026-01-22T15:00:00Z"
    }
  }
}
```

**访问数据**：

```javascript
// 在后续节点中访问 Webhook 数据
const message = $('Webhook').item.json.body.message;
const userId = $('Webhook').item.json.query.userId;
const authToken = $('Webhook').item.json.headers.authorization;
```

---

## 3. HTTP 请求与响应

### 3.1 HTTP 请求结构

```mermaid
graph TD
    A[HTTP 请求] --> B[请求行]
    A --> C[请求头]
    A --> D[请求体]
    
    B --> B1[方法: POST]
    B --> B2[路径: /webhook/agent-chat]
    B --> B3[协议: HTTP/1.1]
    
    C --> C1[Content-Type]
    C --> C2[Authorization]
    C --> C3[User-Agent]
    
    D --> D1[JSON 数据]
    D --> D2[表单数据]
    D --> D3[文件上传]
```

#### 完整请求示例

```http
POST /webhook/agent-chat HTTP/1.1
Host: your-n8n.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User-Agent: MyApp/1.0
Content-Length: 156

{
  "message": "What's the weather today?",
  "userId": "user_123",
  "sessionId": "session_abc",
  "metadata": {
    "source": "mobile_app",
    "version": "2.1.0"
  }
}
```

### 3.2 HTTP 响应结构

```typescript
interface HTTPResponse {
  // 状态码
  statusCode: number;
  
  // 响应头
  headers: {
    'Content-Type': string;
    'X-Request-Id': string;
    [key: string]: string;
  };
  
  // 响应体
  body: any;
}
```

#### 状态码详解

```typescript
// 成功响应
const successCodes = {
  200: 'OK - 请求成功',
  201: 'Created - 资源已创建',
  202: 'Accepted - 请求已接受，异步处理',
  204: 'No Content - 成功但无返回内容'
};

// 客户端错误
const clientErrors = {
  400: 'Bad Request - 请求格式错误',
  401: 'Unauthorized - 未认证',
  403: 'Forbidden - 无权限',
  404: 'Not Found - 资源不存在',
  422: 'Unprocessable Entity - 验证失败',
  429: 'Too Many Requests - 请求过多'
};

// 服务器错误
const serverErrors = {
  500: 'Internal Server Error - 服务器错误',
  502: 'Bad Gateway - 网关错误',
  503: 'Service Unavailable - 服务不可用',
  504: 'Gateway Timeout - 网关超时'
};
```

### 3.3 使用 Respond to Webhook 节点

```javascript
// Respond to Webhook 节点配置
{
  "name": "Respond to Webhook",
  "type": "n8n-nodes-base.respondToWebhook",
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ $json }}",
    "options": {
      "responseCode": 200,
      "responseHeaders": {
        "entries": [
          {
            "name": "X-Request-Id",
            "value": "={{ $('Webhook').item.json.headers['x-request-id'] }}"
          },
          {
            "name": "X-Processing-Time",
            "value": "={{ $now.diff($('Webhook').item.json.timestamp, 'milliseconds') }}ms"
          }
        ]
      }
    }
  }
}
```

**自定义响应示例**：

```javascript
// Function 节点 - 构建响应
const webhookData = $('Webhook').item.json;
const agentResponse = $('AI Agent').item.json.output;

return {
  json: {
    success: true,
    data: {
      message: agentResponse,
      sessionId: webhookData.body.sessionId,
      timestamp: new Date().toISOString()
    },
    metadata: {
      processingTime: Date.now() - webhookData.timestamp,
      model: 'gpt-4',
      tokensUsed: $('AI Agent').item.json.usage?.total_tokens
    }
  }
};
```

### 3.4 错误处理

```javascript
// Error Trigger 节点 - 捕获错误
{
  "name": "Error Handler",
  "type": "n8n-nodes-base.errorTrigger",
  "position": [500, 500]
}

// Function 节点 - 格式化错误响应
const error = $input.item.json.error;

return {
  json: {
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: error.details,
      timestamp: new Date().toISOString()
    }
  }
};

// Respond to Webhook - 返回错误
{
  "respondWith": "json",
  "responseBody": "={{ $json }}",
  "options": {
    "responseCode": 500
  }
}
```

---

## 4. API 认证方法

### 4.1 认证方式对比

| 方式 | 安全性 | 复杂度 | 适用场景 |
|------|--------|--------|---------|
| **无认证** | ❌ 低 | 简单 | 内部测试 |
| **API Key** | ⚠️ 中 | 简单 | 简单 API |
| **Basic Auth** | ⚠️ 中 | 简单 | 内部工具 |
| **Bearer Token** | ✅ 高 | 中等 | 生产 API |
| **JWT** | ✅ 高 | 复杂 | 企业级应用 |
| **OAuth 2.0** | ✅ 最高 | 复杂 | 第三方集成 |

### 4.2 Header Authentication

```javascript
// Webhook 节点配置
{
  "authentication": "headerAuth",
  "headerAuth": {
    "name": "X-API-Key",
    "value": "your-secret-api-key-here"
  }
}

// 客户端请求
const response = await fetch('https://your-n8n.com/webhook/agent-chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-secret-api-key-here'
  },
  body: JSON.stringify({
    message: 'Hello'
  })
});
```

### 4.3 Bearer Token 认证

```javascript
// Function 节点 - 验证 Bearer Token
const authHeader = $('Webhook').item.json.headers.authorization;

if (!authHeader || !authHeader.startsWith('Bearer ')) {
  throw new Error('Missing or invalid authorization header');
}

const token = authHeader.substring(7);

// 验证 token
const validTokens = [
  process.env.API_TOKEN_1,
  process.env.API_TOKEN_2
];

if (!validTokens.includes(token)) {
  throw new Error('Invalid token');
}

// Token 有效，继续处理
return $input.all();
```

**客户端使用**：

```typescript
const response = await fetch('https://your-n8n.com/webhook/agent-chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  body: JSON.stringify({ message: 'Hello' })
});
```

### 4.4 JWT 认证

```javascript
// Function 节点 - 验证 JWT
const jwt = require('jsonwebtoken');

const authHeader = $('Webhook').item.json.headers.authorization;
const token = authHeader?.substring(7);

if (!token) {
  throw new Error('No token provided');
}

try {
  // 验证并解码 JWT
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // 检查过期时间
  if (decoded.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }
  
  // 检查权限
  if (!decoded.permissions.includes('agent.chat')) {
    throw new Error('Insufficient permissions');
  }
  
  // 将用户信息附加到工作流
  return [{
    json: {
      ...($input.item.json),
      user: {
        id: decoded.userId,
        email: decoded.email,
        permissions: decoded.permissions
      }
    }
  }];
  
} catch (error) {
  throw new Error(`JWT validation failed: ${error.message}`);
}
```

**生成 JWT**：

```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  {
    userId: 'user_123',
    email: 'user@example.com',
    permissions: ['agent.chat', 'agent.read']
  },
  process.env.JWT_SECRET,
  {
    expiresIn: '24h',
    issuer: 'your-app',
    audience: 'n8n-api'
  }
);
```

### 4.5 签名验证

```javascript
// Function 节点 - HMAC 签名验证
const crypto = require('crypto');

const signature = $('Webhook').item.json.headers['x-signature'];
const timestamp = $('Webhook').item.json.headers['x-timestamp'];
const body = JSON.stringify($('Webhook').item.json.body);

// 检查时间戳（防止重放攻击）
const requestTime = parseInt(timestamp);
const currentTime = Date.now();
if (Math.abs(currentTime - requestTime) > 300000) {  // 5分钟
  throw new Error('Request timestamp too old');
}

// 计算签名
const payload = `${timestamp}.${body}`;
const expectedSignature = crypto
  .createHmac('sha256', process.env.WEBHOOK_SECRET)
  .update(payload)
  .digest('hex');

// 验证签名
if (signature !== expectedSignature) {
  throw new Error('Invalid signature');
}

return $input.all();
```

**客户端生成签名**：

```typescript
import crypto from 'crypto';

const timestamp = Date.now().toString();
const body = JSON.stringify({ message: 'Hello' });
const payload = `${timestamp}.${body}`;

const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(payload)
  .digest('hex');

const response = await fetch(webhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Timestamp': timestamp,
    'X-Signature': signature
  },
  body
});
```

---

## 5. OpenAI Agents SDK 集成

### 5.1 OpenAI Agents SDK 概述

OpenAI Agents SDK 提供了构建 AI Agent 的高级抽象：

```typescript
import { Agent, Tool } from '@openai/agents-sdk';

// 创建 Agent
const agent = new Agent({
  model: 'gpt-4-turbo-preview',
  name: 'Customer Support Agent',
  instructions: 'You are a helpful customer support agent.',
  tools: [searchTool, ticketTool]
});

// 运行 Agent
const response = await agent.run({
  message: 'I need help with my order',
  context: {
    userId: 'user_123',
    sessionId: 'session_abc'
  }
});
```

### 5.2 在 n8n 中集成 OpenAI SDK

#### 方法 1: HTTP Request 节点

```javascript
// HTTP Request 节点配置
{
  "name": "OpenAI Agent",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://api.openai.com/v1/chat/completions",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "openAiApi",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "model",
          "value": "gpt-4-turbo-preview"
        },
        {
          "name": "messages",
          "value": "={{ $json.messages }}"
        },
        {
          "name": "tools",
          "value": "={{ $json.tools }}"
        },
        {
          "name": "tool_choice",
          "value": "auto"
        }
      ]
    }
  }
}
```

#### 方法 2: Code 节点（推荐）

```javascript
// Code 节点 - 使用 OpenAI SDK
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const webhookData = $('Webhook').item.json.body;

// 定义工具
const tools = [
  {
    type: 'function',
    function: {
      name: 'search_knowledge_base',
      description: 'Search the knowledge base for relevant information',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'create_ticket',
      description: 'Create a support ticket',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] }
        },
        required: ['title', 'description']
      }
    }
  }
];

// 调用 OpenAI
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [
    {
      role: 'system',
      content: 'You are a helpful customer support agent. Use the available tools to assist users.'
    },
    {
      role: 'user',
      content: webhookData.message
    }
  ],
  tools: tools,
  tool_choice: 'auto'
});

const message = response.choices[0].message;

// 检查是否需要调用工具
if (message.tool_calls) {
  return {
    json: {
      requiresToolCall: true,
      toolCalls: message.tool_calls,
      message: message
    }
  };
}

// 直接返回响应
return {
  json: {
    requiresToolCall: false,
    response: message.content,
    usage: response.usage
  }
};
```

### 5.3 工具调用处理

```javascript
// Switch 节点 - 判断是否需要工具调用
{
  "name": "Check Tool Calls",
  "type": "n8n-nodes-base.switch",
  "parameters": {
    "rules": {
      "rules": [
        {
          "operation": "equal",
          "value1": "={{ $json.requiresToolCall }}",
          "value2": true,
          "output": 0
        }
      ]
    }
  }
}

// Function 节点 - 执行工具调用
const toolCalls = $('OpenAI Agent').item.json.toolCalls;
const results = [];

for (const toolCall of toolCalls) {
  const functionName = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments);
  
  let result;
  
  switch (functionName) {
    case 'search_knowledge_base':
      // 调用知识库搜索
      result = await searchKnowledgeBase(args.query);
      break;
      
    case 'create_ticket':
      // 创建工单
      result = await createTicket(args);
      break;
      
    default:
      result = { error: `Unknown function: ${functionName}` };
  }
  
  results.push({
    tool_call_id: toolCall.id,
    role: 'tool',
    name: functionName,
    content: JSON.stringify(result)
  });
}

return {
  json: {
    toolResults: results,
    originalMessage: $('OpenAI Agent').item.json.message
  }
};
```

### 5.4 完整 Agent 循环

```mermaid
sequenceDiagram
    participant User
    participant Webhook
    participant Agent
    participant Tools
    participant Response
    
    User->>Webhook: 发送消息
    Webhook->>Agent: 调用 OpenAI
    Agent->>Agent: 分析是否需要工具
    
    alt 需要工具
        Agent->>Tools: 调用工具
        Tools->>Agent: 返回结果
        Agent->>Agent: 基于工具结果生成回复
    end
    
    Agent->>Response: 最终回复
    Response->>User: 返回响应
```

---

## 6. AI Agent 高级功能

### 6.1 多轮对话管理

```javascript
// Function 节点 - 管理对话历史
const sessionId = $('Webhook').item.json.body.sessionId;
const userMessage = $('Webhook').item.json.body.message;

// 从数据库加载历史对话
const conversationHistory = await loadConversation(sessionId) || [];

// 添加用户消息
conversationHistory.push({
  role: 'user',
  content: userMessage,
  timestamp: new Date().toISOString()
});

// 限制历史长度（保留最近 10 轮）
const recentHistory = conversationHistory.slice(-20);  // 10轮 = 20条消息

// 构建 OpenAI 消息
const messages = [
  {
    role: 'system',
    content: 'You are a helpful assistant. Maintain context from previous messages.'
  },
  ...recentHistory.map(msg => ({
    role: msg.role,
    content: msg.content
  }))
];

return {
  json: {
    sessionId,
    messages,
    conversationHistory: recentHistory
  }
};
```

### 6.2 流式响应

```javascript
// Code 节点 - 实现流式响应
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const messages = $('Conversation Manager').item.json.messages;

// 创建流式请求
const stream = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: messages,
  stream: true
});

let fullResponse = '';
const chunks = [];

// 处理流式数据
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  if (content) {
    fullResponse += content;
    chunks.push({
      content,
      timestamp: Date.now()
    });
    
    // 可以在这里实时发送到客户端（通过 WebSocket 等）
  }
}

return {
  json: {
    response: fullResponse,
    chunks: chunks,
    totalChunks: chunks.length
  }
};
```

### 6.3 函数调用链

```javascript
// Code 节点 - 处理复杂的函数调用链
async function executeAgentLoop(initialMessage, maxIterations = 5) {
  let messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: initialMessage }
  ];
  
  let iteration = 0;
  
  while (iteration < maxIterations) {
    iteration++;
    
    // 调用 OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages,
      tools: tools,
      tool_choice: 'auto'
    });
    
    const message = response.choices[0].message;
    messages.push(message);
    
    // 如果没有工具调用，返回结果
    if (!message.tool_calls) {
      return {
        finalResponse: message.content,
        iterations: iteration,
        messages: messages
      };
    }
    
    // 执行所有工具调用
    for (const toolCall of message.tool_calls) {
      const result = await executeToolCall(toolCall);
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        name: toolCall.function.name,
        content: JSON.stringify(result)
      });
    }
  }
  
  return {
    finalResponse: 'Max iterations reached',
    iterations: iteration,
    messages: messages
  };
}

// 执行
const result = await executeAgentLoop(
  $('Webhook').item.json.body.message
);

return { json: result };
```

### 6.4 上下文增强

```javascript
// Function 节点 - 动态上下文增强
const userMessage = $('Webhook').item.json.body.message;
const userId = $('Webhook').item.json.body.userId;

// 1. 加载用户画像
const userProfile = await getUserProfile(userId);

// 2. 检索相关知识
const relevantDocs = await vectorSearch(userMessage);

// 3. 获取最近交互
const recentInteractions = await getRecentInteractions(userId, 5);

// 4. 构建增强的系统提示
const enhancedSystemPrompt = `
You are a personalized AI assistant.

User Profile:
- Name: ${userProfile.name}
- Preferences: ${JSON.stringify(userProfile.preferences)}
- History: ${userProfile.interactionCount} previous interactions

Relevant Knowledge:
${relevantDocs.map(doc => `- ${doc.content}`).join('\n')}

Recent Context:
${recentInteractions.map(i => `- ${i.summary}`).join('\n')}

Use this context to provide personalized and informed responses.
`;

return {
  json: {
    systemPrompt: enhancedSystemPrompt,
    userMessage: userMessage,
    context: {
      userProfile,
      relevantDocs,
      recentInteractions
    }
  }
};
```

---

## 7. 外部触发的 Agent 工作流

### 7.1 完整工作流架构

```mermaid
graph TD
    A[Webhook Trigger] --> B[Validate Request]
    B --> C[Load Context]
    C --> D[AI Agent]
    D --> E{Tool Calls?}
    
    E -->|Yes| F[Execute Tools]
    F --> G[Agent with Results]
    G --> E
    
    E -->|No| H[Save Conversation]
    H --> I[Format Response]
    I --> J[Respond to Webhook]
    
    K[Error Handler] -.-> L[Error Response]
    L -.-> J
```

### 7.2 实战示例：智能客服 API

```javascript
// 完整的 n8n 工作流配置
{
  "name": "Smart Customer Support API",
  "nodes": [
    // 1. Webhook 触发器
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "support-chat",
        "responseMode": "responseNode",
        "authentication": "headerAuth",
        "headerAuth": {
          "name": "Authorization",
          "value": "={{ $env.API_SECRET }}"
        }
      },
      "position": [250, 300]
    },
    
    // 2. 验证请求
    {
      "name": "Validate Request",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": `
          const body = $input.item.json.body;
          
          // 验证必需字段
          if (!body.message || !body.userId) {
            throw new Error('Missing required fields: message, userId');
          }
          
          // 验证消息长度
          if (body.message.length > 5000) {
            throw new Error('Message too long (max 5000 characters)');
          }
          
          return $input.all();
        `
      },
      "position": [450, 300]
    },
    
    // 3. 加载用户上下文
    {
      "name": "Load Context",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": `
          const userId = $input.item.json.body.userId;
          const sessionId = $input.item.json.body.sessionId || \`session_\${Date.now()}\`;
          
          // 加载对话历史
          const history = await loadConversationHistory(userId, sessionId);
          
          // 加载用户信息
          const userInfo = await getUserInfo(userId);
          
          return [{
            json: {
              ...$input.item.json,
              context: {
                userId,
                sessionId,
                history,
                userInfo
              }
            }
          }];
        `
      },
      "position": [650, 300]
    },
    
    // 4. AI Agent
    {
      "name": "AI Agent",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": `
          const OpenAI = require('openai');
          const openai = new OpenAI({ apiKey: $env.OPENAI_API_KEY });
          
          const data = $input.all()[0].json;
          const userMessage = data.body.message;
          const history = data.context.history || [];
          
          // 构建消息
          const messages = [
            {
              role: 'system',
              content: \`You are a customer support agent for our company.
              
User Information:
- User ID: \${data.context.userInfo.id}
- Name: \${data.context.userInfo.name}
- Tier: \${data.context.userInfo.tier}

Available actions:
- Search knowledge base
- Create support ticket
- Check order status
- Process refund

Be helpful, professional, and use the tools when needed.\`
            },
            ...history,
            { role: 'user', content: userMessage }
          ];
          
          // 定义工具
          const tools = [
            {
              type: 'function',
              function: {
                name: 'search_kb',
                description: 'Search knowledge base',
                parameters: {
                  type: 'object',
                  properties: {
                    query: { type: 'string' }
                  },
                  required: ['query']
                }
              }
            },
            {
              type: 'function',
              function: {
                name: 'create_ticket',
                description: 'Create support ticket',
                parameters: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'] }
                  },
                  required: ['title', 'description']
                }
              }
            }
          ];
          
          // 调用 OpenAI
          const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages,
            tools,
            tool_choice: 'auto'
          });
          
          return [{
            json: {
              ...data,
              agentResponse: response.choices[0].message,
              usage: response.usage
            }
          }];
        `
      },
      "position": [850, 300]
    },
    
    // 5. 处理工具调用
    {
      "name": "Handle Tool Calls",
      "type": "n8n-nodes-base.switch",
      "parameters": {
        "rules": {
          "rules": [
            {
              "operation": "isNotEmpty",
              "value1": "={{ $json.agentResponse.tool_calls }}"
            }
          ]
        }
      },
      "position": [1050, 300]
    },
    
    // 6. 执行工具
    {
      "name": "Execute Tools",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": `
          const toolCalls = $input.item.json.agentResponse.tool_calls;
          const results = [];
          
          for (const call of toolCalls) {
            const funcName = call.function.name;
            const args = JSON.parse(call.function.arguments);
            
            let result;
            if (funcName === 'search_kb') {
              result = await searchKnowledgeBase(args.query);
            } else if (funcName === 'create_ticket') {
              result = await createSupportTicket(args);
            }
            
            results.push({
              tool_call_id: call.id,
              role: 'tool',
              name: funcName,
              content: JSON.stringify(result)
            });
          }
          
          return [{ json: { ...$input.item.json, toolResults: results } }];
        `
      },
      "position": [1250, 200]
    },
    
    // 7. 保存对话
    {
      "name": "Save Conversation",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": `
          const data = $input.item.json;
          const response = data.agentResponse.content;
          
          await saveConversation({
            userId: data.context.userId,
            sessionId: data.context.sessionId,
            messages: [
              { role: 'user', content: data.body.message },
              { role: 'assistant', content: response }
            ]
          });
          
          return $input.all();
        `
      },
      "position": [1450, 300]
    },
    
    // 8. 格式化响应
    {
      "name": "Format Response",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": `
          const data = $input.item.json;
          
          return [{
            json: {
              success: true,
              data: {
                message: data.agentResponse.content,
                sessionId: data.context.sessionId,
                timestamp: new Date().toISOString()
              },
              metadata: {
                model: 'gpt-4-turbo-preview',
                tokensUsed: data.usage.total_tokens,
                processingTime: Date.now() - data.startTime
              }
            }
          }];
        `
      },
      "position": [1650, 300]
    },
    
    // 9. 返回响应
    {
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}"
      },
      "position": [1850, 300]
    },
    
    // 10. 错误处理
    {
      "name": "Error Handler",
      "type": "n8n-nodes-base.errorTrigger",
      "position": [1050, 500]
    },
    
    {
      "name": "Error Response",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": `
          const error = $input.item.json.error;
          
          return [{
            json: {
              success: false,
              error: {
                message: error.message,
                code: error.code || 'INTERNAL_ERROR',
                timestamp: new Date().toISOString()
              }
            }
          }];
        `
      },
      "position": [1250, 500]
    }
  ],
  "connections": {
    "Webhook": { "main": [[{ "node": "Validate Request" }]] },
    "Validate Request": { "main": [[{ "node": "Load Context" }]] },
    "Load Context": { "main": [[{ "node": "AI Agent" }]] },
    "AI Agent": { "main": [[{ "node": "Handle Tool Calls" }]] },
    "Handle Tool Calls": {
      "main": [
        [{ "node": "Execute Tools" }],
        [{ "node": "Save Conversation" }]
      ]
    },
    "Execute Tools": { "main": [[{ "node": "AI Agent" }]] },
    "Save Conversation": { "main": [[{ "node": "Format Response" }]] },
    "Format Response": { "main": [[{ "node": "Respond to Webhook" }]] },
    "Error Handler": { "main": [[{ "node": "Error Response" }]] },
    "Error Response": { "main": [[{ "node": "Respond to Webhook" }]] }
  }
}
```

### 7.3 客户端集成示例

```typescript
// TypeScript 客户端
class SupportChatClient {
  private apiUrl: string;
  private apiKey: string;
  
  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }
  
  async sendMessage(
    message: string,
    userId: string,
    sessionId?: string
  ): Promise<ChatResponse> {
    const response = await fetch(`${this.apiUrl}/webhook/support-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        message,
        userId,
        sessionId: sessionId || `session_${Date.now()}`
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }
    
    return await response.json();
  }
}

// 使用示例
const client = new SupportChatClient(
  'https://your-n8n.com',
  'your-api-key'
);

const response = await client.sendMessage(
  'I need help with my order',
  'user_123'
);

console.log(response.data.message);
```

---

## 8. 测试与调试

### 8.1 使用 cURL 测试

```bash
# 基础测试
curl -X POST https://your-n8n.com/webhook/support-chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "message": "Hello, I need help",
    "userId": "user_123"
  }'

# 带会话 ID
curl -X POST https://your-n8n.com/webhook/support-chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "message": "What was my previous question?",
    "userId": "user_123",
    "sessionId": "session_abc"
  }'

# 测试错误处理
curl -X POST https://your-n8n.com/webhook/support-chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wrong-key" \
  -d '{
    "message": "Test"
  }'
```

### 8.2 使用 Postman

```json
// Postman Collection
{
  "info": {
    "name": "n8n Support Chat API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Send Message",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{api_key}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"message\": \"{{message}}\",\n  \"userId\": \"{{userId}}\",\n  \"sessionId\": \"{{sessionId}}\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/webhook/support-chat",
          "host": ["{{base_url}}"],
          "path": ["webhook", "support-chat"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://your-n8n.com"
    },
    {
      "key": "api_key",
      "value": "your-api-key"
    },
    {
      "key": "userId",
      "value": "user_123"
    }
  ]
}
```

### 8.3 调试技巧

#### 1. 添加日志节点

```javascript
// Function 节点 - 详细日志
const data = $input.item.json;

console.log('=== Webhook Data ===');
console.log('Headers:', JSON.stringify(data.headers, null, 2));
console.log('Body:', JSON.stringify(data.body, null, 2));
console.log('Query:', JSON.stringify(data.query, null, 2));

return $input.all();
```

#### 2. 使用 Sticky Notes

在 n8n 工作流中添加注释：

```
📝 Note: This node validates the incoming request
- Checks for required fields
- Validates message length
- Returns 400 if validation fails
```

#### 3. 错误追踪

```javascript
// Function 节点 - 错误追踪
try {
  const result = await processRequest($input.item.json);
  return [{ json: result }];
} catch (error) {
  // 记录详细错误
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    input: $input.item.json,
    timestamp: new Date().toISOString()
  });
  
  // 发送到错误追踪服务（如 Sentry）
  await sendToSentry(error, {
    context: $input.item.json,
    workflow: $workflow.name
  });
  
  throw error;
}
```

### 8.4 性能监控

```javascript
// Function 节点 - 性能监控
const startTime = Date.now();

// 处理逻辑
const result = await processData($input.item.json);

const duration = Date.now() - startTime;

// 记录性能指标
await logMetrics({
  workflow: $workflow.name,
  node: $node.name,
  duration: duration,
  timestamp: new Date().toISOString()
});

// 如果处理时间过长，发送告警
if (duration > 5000) {
  await sendAlert({
    type: 'SLOW_EXECUTION',
    duration: duration,
    threshold: 5000
  });
}

return [{ json: { ...result, processingTime: duration } }];
```

---

## 9. 生产部署

### 9.1 环境变量管理

```bash
# .env 文件
OPENAI_API_KEY=sk-...
API_SECRET=your-webhook-secret
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
SENTRY_DSN=https://...

# 生产环境特定
NODE_ENV=production
LOG_LEVEL=info
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

### 9.2 速率限制

```javascript
// Function 节点 - Redis 速率限制
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

const userId = $('Webhook').item.json.body.userId;
const key = `rate_limit:${userId}`;
const limit = 100;  // 每分钟最多 100 次请求
const window = 60;  // 60 秒窗口

// 增加计数
const current = await redis.incr(key);

// 设置过期时间（首次请求）
if (current === 1) {
  await redis.expire(key, window);
}

// 检查是否超限
if (current > limit) {
  const ttl = await redis.ttl(key);
  throw new Error(`Rate limit exceeded. Try again in ${ttl} seconds.`);
}

// 添加速率限制信息到响应头
return [{
  json: {
    ...$input.item.json,
    rateLimitInfo: {
      limit: limit,
      remaining: limit - current,
      reset: Date.now() + (ttl * 1000)
    }
  }
}];
```

### 9.3 健康检查端点

```javascript
// Webhook 节点 - /health
{
  "path": "health",
  "httpMethod": "GET",
  "responseMode": "lastNode"
}

// Function 节点 - 健康检查
const checks = {
  database: await checkDatabase(),
  redis: await checkRedis(),
  openai: await checkOpenAI()
};

const allHealthy = Object.values(checks).every(c => c.status === 'ok');

return [{
  json: {
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: checks
  }
}];
```

### 9.4 监控和告警

```javascript
// Function 节点 - 发送指标到监控系统
const metrics = {
  workflow: $workflow.name,
  execution_time: Date.now() - $('Webhook').item.json.timestamp,
  tokens_used: $('AI Agent').item.json.usage?.total_tokens,
  success: true,
  timestamp: Date.now()
};

// 发送到 Prometheus/Grafana
await sendMetrics(metrics);

// 发送到 DataDog
await datadog.increment('n8n.workflow.execution', 1, {
  workflow: $workflow.name,
  status: 'success'
});

return $input.all();
```

---

## 10. 最佳实践

### 10.1 安全最佳实践

```typescript
// ✅ 好的做法
const securityChecklist = {
  authentication: {
    useStrongTokens: true,
    rotateKeysRegularly: true,
    useJWT: true,
    validateExpiry: true
  },
  
  validation: {
    validateAllInputs: true,
    sanitizeUserData: true,
    limitPayloadSize: true,
    checkContentType: true
  },
  
  rateLimit: {
    implementRateLimit: true,
    useRedis: true,
    perUserLimit: true,
    globalLimit: true
  },
  
  logging: {
    logAllRequests: true,
    maskSensitiveData: true,
    useStructuredLogs: true,
    sendToSIEM: true
  }
};

// ❌ 避免的做法
const antiPatterns = {
  noAuthentication: false,  // 永远不要没有认证
  hardcodedSecrets: false,  // 不要硬编码密钥
  noInputValidation: false,  // 必须验证输入
  exposeSensitiveData: false  // 不要暴露敏感信息
};
```

### 10.2 性能优化

```javascript
// 1. 使用缓存
const cache = new Map();

async function getCachedData(key) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetchData(key);
  cache.set(key, data);
  
  // 设置过期时间
  setTimeout(() => cache.delete(key), 300000);  // 5分钟
  
  return data;
}

// 2. 批量处理
async function batchProcess(items, batchSize = 10) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => processItem(item))
    );
    results.push(...batchResults);
  }
  
  return results;
}

// 3. 超时控制
async function withTimeout(promise, timeoutMs) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), timeoutMs)
  );
  
  return Promise.race([promise, timeout]);
}
```

### 10.3 错误处理模式

```javascript
// 统一错误处理
class APIError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

// 使用
try {
  if (!userId) {
    throw new APIError('User ID is required', 'MISSING_USER_ID', 400);
  }
  
  const result = await processRequest(userId);
  return result;
  
} catch (error) {
  if (error instanceof APIError) {
    // 已知错误
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message
      },
      statusCode: error.statusCode
    };
  }
  
  // 未知错误
  console.error('Unexpected error:', error);
  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    },
    statusCode: 500
  };
}
```

### 10.4 文档和版本控制

```typescript
// API 版本控制
const apiVersions = {
  v1: {
    path: '/webhook/v1/agent-chat',
    deprecated: false,
    features: ['basic_chat', 'tool_calling']
  },
  v2: {
    path: '/webhook/v2/agent-chat',
    deprecated: false,
    features: ['basic_chat', 'tool_calling', 'streaming', 'multi_modal']
  }
};

// OpenAPI 文档
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'AI Agent API',
    version: '2.0.0',
    description: 'Intelligent customer support agent API'
  },
  paths: {
    '/webhook/v2/agent-chat': {
      post: {
        summary: 'Send message to AI agent',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['message', 'userId'],
                properties: {
                  message: { type: 'string', maxLength: 5000 },
                  userId: { type: 'string' },
                  sessionId: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        message: { type: 'string' },
                        sessionId: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
```

---

## 总结

### 核心要点

1. **Webhook 基础**
   - 将 n8n 工作流转化为 API 端点
   - 支持多种 HTTP 方法和响应模式
   - 灵活的认证机制

2. **OpenAI 集成**
   - 使用 OpenAI Agents SDK 构建智能 Agent
   - 支持工具调用和多轮对话
   - 上下文管理和流式响应

3. **生产部署**
   - 完善的安全措施
   - 性能优化和监控
   - 错误处理和日志

4. **最佳实践**
   - 始终验证和清理输入
   - 实现速率限制
   - 完善的错误处理
   - 详细的日志和监控

### 技术栈总结

```typescript
const techStack = {
  platform: 'n8n',
  trigger: 'Webhook',
  ai: 'OpenAI Agents SDK',
  authentication: ['JWT', 'Bearer Token', 'API Key'],
  storage: ['PostgreSQL', 'Redis'],
  monitoring: ['Sentry', 'DataDog', 'Prometheus'],
  deployment: ['Docker', 'Kubernetes']
};
```

### 下一步

- 实现 WebSocket 支持实时通信
- 集成更多 AI 模型（Anthropic, Google）
- 构建 Agent 编排系统
- 探索多 Agent 协作

---

**学习资源**：

- [n8n 官方文档](https://docs.n8n.io)
- [OpenAI API 文档](https://platform.openai.com/docs)
- [Webhook 最佳实践](https://webhooks.fyi)
- [API 安全指南](https://owasp.org/www-project-api-security)
