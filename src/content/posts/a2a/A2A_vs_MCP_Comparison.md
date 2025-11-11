---
title: 'A2A vs MCP：深度对比分析'
date: '2025-11-05'
excerpt: '详细对比 Agent2Agent (A2A) Protocol 和 Model Context Protocol (MCP) 的设计理念、技术架构、使用场景'
tags: ['AI', 'A2A']
series: 'AI学习'
---

# A2A vs MCP：深度对比分析

> 详细对比 Agent2Agent (A2A) Protocol 和 Model Context Protocol (MCP) 的设计理念、技术架构、使用场景

## 目录

- [1. 快速对比](#1-快速对比)
- [2. 设计理念差异](#2-设计理念差异)
- [3. 架构对比](#3-架构对比)
- [4. 协议细节对比](#4-协议细节对比)
- [5. 使用场景分析](#5-使用场景分析)
- [6. 实际案例对比](#6-实际案例对比)
- [7. 生态系统对比](#7-生态系统对比)
- [8. 选择指南](#8-选择指南)

---

## 1. 快速对比

### 1.1 一句话总结

```mermaid
graph LR
    MCP["MCP<br/>🔧 AI 系统的 USB 接口<br/>连接 Agent 和工具"]
    A2A["A2A<br/>🌐 AI 系统的互联网<br/>连接 Agent 和 Agent"]

    style MCP fill:#e8f5e9
    style A2A fill:#e3f2fd
```

| 维度         | MCP                 | A2A              |
| ------------ | ------------------- | ---------------- |
| **比喻**     | USB-C 接口          | 互联网协议       |
| **连接对象** | Agent ↔ Tool        | Agent ↔ Agent    |
| **发起者**   | Anthropic (2024-11) | Google (2025-04) |
| **治理**     | Anthropic 维护      | Linux Foundation |
| **核心价值** | 标准化工具访问      | Agent 互操作     |

### 1.2 可视化对比

```mermaid
graph TB
    subgraph "MCP 模型"
        M_Agent["🤖 AI Agent/LLM"]
        M_Host["🖥️ Host (Claude, Cursor)"]
        M_Client["📱 MCP Client"]
        M_Server["🔧 MCP Server"]
        M_Tools["🔨 Tools & Resources"]

        M_Agent --> M_Host
        M_Host --> M_Client
        M_Client -->|stdio/HTTP| M_Server
        M_Server --> M_Tools

        M_Note["特点:<br/>· 结构化调用<br/>· 确定性输出<br/>· 无状态<br/>· 即时响应"]
    end

    subgraph "A2A 模型"
        A_User["👤 用户"]
        A_Client["🤖 Client Agent"]
        A_Server["🤖 Remote Agent"]
        A_Backend["🧠 Agent Logic + Tools"]

        A_User --> A_Client
        A_Client -->|HTTP + JSON-RPC| A_Server
        A_Server --> A_Backend

        A_Note["特点:<br/>· 任务导向<br/>· 异步协作<br/>· 有状态<br/>· 长时间运行"]
    end

    style M_Agent fill:#e8f5e9
    style A_Client fill:#e3f2fd
    style M_Server fill:#e8f5e9
    style A_Server fill:#e3f2fd
```

---

## 2. 设计理念差异

### 2.1 核心问题定位

#### MCP 解决的问题

```mermaid
graph TB
    Problem["❌ 问题:<br/>每个 AI 应用需要<br/>为每个工具写定制集成"]

    Before["M 个 AI 应用<br/>×<br/>N 个工具<br/>=<br/>M×N 个集成"]

    After["M 个 MCP Client<br/>+<br/>N 个 MCP Server<br/>=<br/>M+N 个实现"]

    Problem --> Before
    Before -->|MCP 解决| After

    style Problem fill:#ffebee
    style Before fill:#fff4e1
    style After fill:#e8f5e9
```

**MCP 的核心目标**：

- 标准化 AI 系统访问外部数据和工具的方式
- 让任何 LLM 都能使用任何工具
- 类似于 OpenAPI 对 REST API 的标准化

#### A2A 解决的问题

```mermaid
graph TB
    Problem2["❌ 问题:<br/>不同框架的 Agent<br/>无法相互通信"]

    Before2["LangGraph Agent<br/>⊗<br/>CrewAI Agent<br/>⊗<br/>Custom Agent"]

    After2["所有 Agent<br/>通过 A2A<br/>互联互通"]

    Problem2 --> Before2
    Before2 -->|A2A 解决| After2

    style Problem2 fill:#ffebee
    style Before2 fill:#fff4e1
    style After2 fill:#e8f5e9
```

**A2A 的核心目标**：

- 实现跨平台的 Agent 互操作
- 让不同公司、不同框架的 Agent 协作
- 类似于 HTTP 对互联网的标准化

### 2.2 设计哲学对比

```mermaid
mindmap
  root((设计哲学))
    MCP
      简单性
        最小化协议
        易于实现
        快速集成
      确定性
        明确的输入输出
        可预测的行为
        即时响应
      工具导向
        函数式调用
        结构化数据
        无副作用
    A2A
      灵活性
        支持复杂交互
        动态协商
        多种模式
      自主性
        Agent 自主决策
        不暴露内部
        黑盒协作
      任务导向
        异步执行
        状态管理
        长期协作
```

---

## 3. 架构对比

### 3.1 组件对比

| 组件         | MCP                       | A2A               |
| ------------ | ------------------------- | ----------------- |
| **Client**   | 存在于 Host 内，管理连接  | 独立的 Agent 应用 |
| **Server**   | 提供 Tools/Resources      | 完整的 Agent 系统 |
| **能力描述** | Server Capabilities       | Agent Card        |
| **能力单元** | Tools, Resources, Prompts | Skills            |
| **工作单元** | 工具调用                  | Task              |
| **通信单元** | Request/Response          | Message           |
| **输出单元** | Tool Result               | Artifact          |

### 3.2 通信模式对比

```mermaid
sequenceDiagram
    participant C1 as Client
    participant S1 as Server

    Note over C1,S1: MCP 通信模式

    C1->>S1: tools/list
    S1-->>C1: [tools...]

    C1->>S1: tools/call {name, args}
    S1-->>C1: {content: [...]}

    Note over C1,S1: 同步、无状态、即时

    rect rgb(230, 240, 255)
    Note over C1,S1: A2A 通信模式

    C1->>S1: tasks/send {message, skillId}
    S1-->>C1: {task: {id, status: "submitted"}}

    S1--)C1: SSE: {status: "working"}
    S1--)C1: SSE: {status: "working", progress}
    S1--)C1: SSE: {status: "completed", artifacts}

    Note over C1,S1: 异步、有状态、长时间
    end
```

### 3.3 传输层对比

```mermaid
graph TB
    subgraph "MCP 传输层"
        M1["stdio<br/>(本地进程)"]
        M2["Streamable HTTP<br/>(远程服务)"]
        M3["JSON-RPC 2.0"]

        M1 --> M3
        M2 --> M3

        M_Note["特点:<br/>· 两种传输方式<br/>· 可选 SSE<br/>· 会话管理简单"]
    end

    subgraph "A2A 传输层"
        A1["HTTP(S) only<br/>(必须远程)"]
        A2["JSON-RPC 2.0"]
        A3["SSE<br/>(核心功能)"]

        A1 --> A2
        A1 --> A3

        A_Note["特点:<br/>· 仅 HTTP 传输<br/>· SSE 是核心<br/>· 强大的会话管理"]
    end

    style M1 fill:#e8f5e9
    style A1 fill:#e3f2fd
```

---

## 4. 协议细节对比

### 4.1 能力声明对比

#### MCP: Server Capabilities

```typescript
// MCP Server 能力声明
interface ServerCapabilities {
  tools?: {
    listChanged?: boolean;
  };
  resources?: {
    subscribe?: boolean;
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
  logging?: {};
}

// 工具定义
interface Tool {
  name: string;
  description: string;
  inputSchema: JSONSchema;
}
```

#### A2A: Agent Card + Skills

```typescript
// A2A Agent Card
interface AgentCard {
  name: string;
  description: string;
  version: string;
  url: string;
  auth: AuthScheme;
  capabilities: {
    streaming?: boolean;
    pushNotifications?: boolean;
  };
  skills: AgentSkill[];
  defaultInputModes: string[];
  defaultOutputModes: string[];
}

// 技能定义
interface AgentSkill {
  id: string;
  name: string;
  description: string;
  tags?: string[];
  examples?: string[];
  inputModes?: string[];
  outputModes?: string[];
}
```

**关键区别**：

- MCP：工具声明简单，输入输出通过 JSON Schema 定义
- A2A：技能声明丰富，支持多种数据模式，包含示例

### 4.2 工作流对比

#### MCP: 简单调用

```mermaid
sequenceDiagram
    Client->>Server: tools/call<br/>{name: "get_weather", args: {city: "Tokyo"}}
    Server-->>Client: {content: [{text: "Tokyo: Sunny, 25°C"}]}

    Note over Client,Server: 一次请求-响应，完成
```

#### A2A: 任务生命周期

```mermaid
sequenceDiagram
    Client->>Server: tasks/send<br/>{taskId: "t1", message: "Analyze data"}
    Server-->>Client: {task: {id: "t1", status: "submitted"}}

    Server--)Client: SSE: {status: "working"}
    Server--)Client: SSE: {status: "input-required"}

    Client->>Server: tasks/send<br/>{taskId: "t1", message: "Here's more data"}

    Server--)Client: SSE: {status: "working"}
    Server--)Client: SSE: {status: "completed", artifacts: [...]}

    Note over Client,Server: 多轮交互，支持中断和恢复
```

### 4.3 数据格式对比

#### MCP: 简单结构

```json
// MCP 工具调用请求
{
  "method": "tools/call",
  "params": {
    "name": "query_database",
    "arguments": {
      "query": "SELECT * FROM users"
    }
  }
}

// MCP 工具调用响应
{
  "content": [
    {
      "type": "text",
      "text": "Query returned 10 rows"
    }
  ]
}
```

#### A2A: 复杂结构

```json
// A2A 任务请求
{
  "jsonrpc": "2.0",
  "method": "tasks/send",
  "params": {
    "task": {
      "id": "task-123",
      "message": {
        "role": "user",
        "parts": [
          {
            "type": "text",
            "text": "Analyze this dataset"
          },
          {
            "type": "file",
            "uri": "https://example.com/data.csv"
          }
        ]
      },
      "skillId": "data_analysis"
    }
  },
  "id": "req-001"
}

// A2A 任务响应
{
  "jsonrpc": "2.0",
  "result": {
    "id": "task-123",
    "status": "completed",
    "messages": [...],
    "artifacts": [
      {
        "type": "text",
        "text": "Analysis complete"
      },
      {
        "type": "data",
        "data": {"mean": 42, "std": 10}
      },
      {
        "type": "image",
        "uri": "https://example.com/chart.png"
      }
    ]
  },
  "id": "req-001"
}
```

---

## 5. 使用场景分析

### 5.1 MCP 最佳场景

```mermaid
flowchart TD
    MCP_Start{需要什么?} --> M1[访问文件系统]
    MCP_Start --> M2[查询数据库]
    MCP_Start --> M3[调用 REST API]
    MCP_Start --> M4[执行系统命令]
    MCP_Start --> M5[读取配置文件]

    M1 --> MCP_Good[✅ 使用 MCP]
    M2 --> MCP_Good
    M3 --> MCP_Good
    M4 --> MCP_Good
    M5 --> MCP_Good

    MCP_Good --> Features["特征:<br/>· 确定性操作<br/>· 结构化输入<br/>· 即时结果<br/>· 无需推理"]

    style MCP_Good fill:#e8f5e9
```

**典型 MCP 用例**：

1. **文件操作**：读取、写入、搜索文件
2. **数据库查询**：执行 SQL、读取记录
3. **API 调用**：调用外部 REST API
4. **系统工具**：Git 操作、Shell 命令
5. **搜索引擎**：Google Search、Web Scraping

### 5.2 A2A 最佳场景

```mermaid
flowchart TD
    A2A_Start{需要什么?} --> A1[多步骤推理]
    A2A_Start --> A2[Agent 协作]
    A2A_Start --> A3[长时间任务]
    A2A_Start --> A4[动态决策]
    A2A_Start --> A5[专业领域处理]

    A1 --> A2A_Good[✅ 使用 A2A]
    A2 --> A2A_Good
    A3 --> A2A_Good
    A4 --> A2A_Good
    A5 --> A2A_Good

    A2A_Good --> Features["特征:<br/>· 需要推理<br/>· 多轮交互<br/>· 异步执行<br/>· 状态管理"]

    style A2A_Good fill:#e3f2fd
```

**典型 A2A 用例**：

1. **研究分析**：多源信息综合分析
2. **创意生成**：多 Agent 协作创作
3. **复杂规划**：旅行规划、项目管理
4. **专业咨询**：法律、医疗、金融建议
5. **工作流自动化**：跨系统的复杂流程

### 5.3 场景决策树

```mermaid
flowchart TD
    Start{你的需求} --> Q1{交互对象}

    Q1 -->|工具/API| Q2{操作性质}
    Q1 -->|另一个 Agent| Q3{任务复杂度}

    Q2 -->|读取数据| MCP1[MCP Resources]
    Q2 -->|执行操作| MCP2[MCP Tools]
    Q2 -->|提供模板| MCP3[MCP Prompts]

    Q3 -->|简单请求| Q4{响应时间}
    Q3 -->|复杂协作| A2A1[A2A 多步骤]

    Q4 -->|即时| Q5{需要推理?}
    Q4 -->|异步| A2A2[A2A 异步任务]

    Q5 -->|否| MCP4[也可用 MCP]
    Q5 -->|是| A2A3[A2A 单次任务]

    style MCP1 fill:#e8f5e9
    style MCP2 fill:#e8f5e9
    style MCP3 fill:#e8f5e9
    style MCP4 fill:#e8f5e9
    style A2A1 fill:#e3f2fd
    style A2A2 fill:#e3f2fd
    style A2A3 fill:#e3f2fd
```

---

## 6. 实际案例对比

### 6.1 案例 1：获取天气信息

#### 使用 MCP

```python
# MCP 方式：直接工具调用
from mcp import Client

client = Client()

# 列出工具
tools = await client.list_tools()
# Output: [Tool(name="get_weather", ...)]

# 调用工具
result = await client.call_tool(
    name="get_weather",
    arguments={"city": "Tokyo"}
)

print(result.content[0].text)
# Output: "Tokyo: Sunny, 25°C"
```

**特点**：

- ✅ 简单直接
- ✅ 即时响应
- ✅ 适合确定性查询

#### 使用 A2A

```python
# A2A 方式：任务委托
from google_a2a import A2AClient

client = A2AClient()

# 发现 Agent
agent = await client.discover("https://weather-agent.com")

# 发送任务
task = await client.send_task(
    agent_url="https://weather-agent.com",
    skill_id="weather_forecast",
    message="What's the weather in Tokyo?"
)

print(task.artifacts[0].text)
# Output: "Based on current data, Tokyo is experiencing sunny conditions with a temperature of 25°C..."
```

**特点**：

- ✅ 可以包含推理和解释
- ✅ 支持更复杂的查询
- ⚠️ 对于简单查询可能过度

### 6.2 案例 2：市场研究报告

#### 使用 MCP（不适合）

```python
# ❌ MCP 不适合复杂多步骤任务
client = Client()

# 需要手动编排每一步
news = await client.call_tool("web_search", {"query": "AI market"})
analysis = await client.call_tool("analyze_text", {"text": news})
summary = await client.call_tool("summarize", {"data": analysis})

# 复杂、需要手动协调
```

#### 使用 A2A（推荐）

```python
# ✅ A2A 适合复杂任务委托
a2a_client = A2AClient()

# 委托给专门的研究 Agent
async for update in a2a_client.send_task_streaming(
    agent_url="https://research-agent.com",
    skill_id="market_research",
    message="Prepare a comprehensive AI market report"
):
    if update.status == "working":
        print(f"Progress: {update.message}")
    elif update.status == "input-required":
        # Agent 需要更多信息
        additional_data = get_user_input(update.message)
        await a2a_client.send_task(
            task_id=update.id,
            message=additional_data
        )
    elif update.status == "completed":
        print("Report ready!")
        save_report(update.artifacts)
```

**特点**：

- ✅ Agent 自主完成复杂流程
- ✅ 支持多轮交互
- ✅ 实时进度反馈

### 6.3 案例 3：客服系统

#### 混合使用 MCP + A2A

```python
# 客服主 Agent (使用两者)
class CustomerServiceAgent:
    def __init__(self):
        self.mcp_client = MCPClient()
        self.a2a_client = A2AClient()

    async def handle_customer_query(self, query: str):
        # 1. 使用 MCP 查询客户信息（快速、确定）
        customer = await self.mcp_client.call_tool(
            name="get_customer_profile",
            arguments={"query": query}
        )

        # 2. 判断是否需要专业 Agent
        if self._needs_specialist(query):
            # 使用 A2A 委托给专家 Agent（复杂、推理）
            result = await self.a2a_client.send_task(
                agent_url="https://specialist-agent.com",
                skill_id="technical_support",
                message={
                    "query": query,
                    "customer": customer
                }
            )
        else:
            # 简单问题，使用 MCP 工具直接回答
            result = await self.mcp_client.call_tool(
                name="knowledge_base_search",
                arguments={"query": query}
            )

        return result
```

**架构图**：

```mermaid
graph TB
    User["👤 客户"] --> CSAgent["🤖 客服 Agent"]

    CSAgent -->|MCP| Tools["🔧 工具层<br/>· 客户数据库<br/>· 订单系统<br/>· 知识库"]

    CSAgent -->|A2A| Tech["🤖 技术支持 Agent"]
    CSAgent -->|A2A| Sales["🤖 销售 Agent"]
    CSAgent -->|A2A| Billing["🤖 账单 Agent"]

    Tech -->|MCP| TechTools["技术工具"]
    Sales -->|MCP| SalesTools["销售工具"]
    Billing -->|MCP| BillingTools["账单工具"]

    style CSAgent fill:#ffe1f5
    style Tools fill:#e8f5e9
    style Tech fill:#e3f2fd
    style Sales fill:#e3f2fd
    style Billing fill:#e3f2fd
```

---

## 7. 生态系统对比

### 7.1 支持厂商

| MCP               | A2A            |
| ----------------- | -------------- |
| Anthropic（主导） | Google（发起） |
| OpenAI            | AWS            |
| Zed               | Microsoft      |
| Replit            | Salesforce     |
| Codeium           | SAP            |
| Sourcegraph       | ServiceNow     |
| Block             | Cisco          |
| Apollo            | 100+ 公司      |

### 7.2 框架支持

#### MCP 集成

```mermaid
graph LR
    MCP["MCP<br/>Protocol"]

    MCP --> Claude["Claude Desktop"]
    MCP --> Cursor["Cursor IDE"]
    MCP --> Zed["Zed Editor"]
    MCP --> Custom["Custom Apps"]

    style MCP fill:#e8f5e9
```

#### A2A 集成

```mermaid
graph LR
    A2A["A2A<br/>Protocol"]

    A2A --> LG["LangGraph"]
    A2A --> Crew["CrewAI"]
    A2A --> SK["Semantic Kernel"]
    A2A --> ADK["Google ADK"]
    A2A --> Custom["Custom Agents"]

    style A2A fill:#e3f2fd
```

### 7.3 社区活跃度

| 指标              | MCP                               | A2A                     |
| ----------------- | --------------------------------- | ----------------------- |
| **GitHub Stars**  | ~8k                               | ~2k                     |
| **发布时间**      | 2024-11                           | 2025-04                 |
| **成熟度**        | 较成熟                            | 快速发展                |
| **SDK 数量**      | 5+ (TS, Python, Kotlin, Java, C#) | 2+ (Python, TypeScript) |
| **预构建 Server** | 50+                               | 10+                     |
| **文档质量**      | ⭐⭐⭐⭐⭐                        | ⭐⭐⭐⭐                |

---

## 8. 选择指南

### 8.1 决策矩阵

```mermaid
flowchart TD
    Start{开始评估} --> Q1{主要目标?}

    Q1 -->|访问工具/数据| MCP_Path[倾向 MCP]
    Q1 -->|Agent 协作| A2A_Path[倾向 A2A]
    Q1 -->|两者都需要| Both_Path[同时使用]

    MCP_Path --> M1{操作类型?}
    M1 -->|读取数据| M2[MCP Resources]
    M1 -->|执行操作| M3[MCP Tools]
    M1 -->|模板提示| M4[MCP Prompts]

    A2A_Path --> A1{任务特性?}
    A1 -->|需要推理| A2[使用 A2A]
    A1 -->|长时间运行| A3[使用 A2A]
    A1 -->|多轮交互| A4[使用 A2A]

    Both_Path --> Strategy["架构策略:<br/>· Agent 用 MCP 访问本地工具<br/>· Agent 用 A2A 与远程 Agent 协作"]

    style MCP_Path fill:#e8f5e9
    style A2A_Path fill:#e3f2fd
    style Both_Path fill:#fff9e1
```

### 8.2 选择清单

#### 选择 MCP 的理由

- ✅ 需要访问结构化的工具和数据源
- ✅ 操作是确定性的、可预测的
- ✅ 需要即时响应
- ✅ 工具是本地的或简单的 API
- ✅ 不需要复杂的推理或决策
- ✅ 希望使用 Claude Desktop、Cursor 等现有 Host

#### 选择 A2A 的理由

- ✅ 需要与其他 Agent 协作
- ✅ 任务需要复杂推理或决策
- ✅ 任务可能需要很长时间完成
- ✅ 需要多轮对话式交互
- ✅ Agent 来自不同的团队或供应商
- ✅ 需要支持动态能力发现

#### 同时使用的场景

- ✅ 构建复杂的 Agent 系统
- ✅ Agent 既需要工具也需要协作
- ✅ 企业级多层架构
- ✅ 混合本地和远程资源

### 8.3 推荐架构模式

```mermaid
graph TB
    subgraph "推荐架构: MCP + A2A"
        User["👤 用户"]
        MainAgent["🤖 主 Agent<br/>(Orchestrator)"]

        User --> MainAgent

        subgraph "MCP 层：工具访问"
            MCP1["📁 Files"]
            MCP2["💾 Database"]
            MCP3["🔍 Search"]
            MCP4["📧 Email"]
        end

        subgraph "A2A 层：Agent 协作"
            A2A1["🤖 Research Agent"]
            A2A2["🤖 Analysis Agent"]
            A2A3["🤖 Writing Agent"]
        end

        MainAgent -->|MCP| MCP1
        MainAgent -->|MCP| MCP2
        MainAgent -->|MCP| MCP3
        MainAgent -->|MCP| MCP4

        MainAgent -->|A2A| A2A1
        MainAgent -->|A2A| A2A2
        MainAgent -->|A2A| A2A3

        A2A1 -->|MCP| Tools1["专业工具"]
        A2A2 -->|MCP| Tools2["分析工具"]
        A2A3 -->|MCP| Tools3["写作工具"]
    end

    style User fill:#fff4e1
    style MainAgent fill:#ffe1f5
    style MCP1 fill:#e8f5e9
    style A2A1 fill:#e3f2fd
```

---

## 总结

### 核心差异

| 维度       | MCP           | A2A           | 关系     |
| ---------- | ------------- | ------------- | -------- |
| **定位**   | Agent ↔ Tool  | Agent ↔ Agent | 互补     |
| **目标**   | 工具标准化    | Agent 互操作  | 不同层次 |
| **复杂度** | 简单          | 复杂          | 分别适用 |
| **用途**   | 数据/工具访问 | Agent 协作    | 各有所长 |

### 官方建议

> **Use MCP for tools, use A2A for agents.**  
> 使用 MCP 连接工具，使用 A2A 连接 Agent。

### 未来展望

```mermaid
timeline
    title MCP 和 A2A 的未来
    2024-11 : MCP 发布
            : Anthropic 主导
    2025-04 : A2A 发布
            : Google 主导
    2025-06 : A2A 捐赠给 Linux Foundation
            : 社区治理开始
    未来 : 两者共存互补
         : 形成完整 Agent 生态
         : 可能出现统一标准
```

**预测**：

1. MCP 和 A2A 将长期共存
2. 大多数企业应用会同时使用两者
3. 可能出现更高级的统一协议
4. Agent 生态系统将更加成熟

### 最终建议

1. **学习两者**：作为开发者，应该同时掌握 MCP 和 A2A
2. **选择合适的**：根据具体场景选择最合适的协议
3. **混合使用**：在复杂系统中灵活组合两者
4. **关注发展**：两个协议都在快速演进，保持关注

---

**参考资源**

- 📘 [MCP 官方文档](https://modelcontextprotocol.io)
- 📘 [A2A 官方文档](https://a2a-protocol.org)
- 🐙 [MCP GitHub](https://github.com/modelcontextprotocol)
- 🐙 [A2A GitHub](https://github.com/a2aproject/A2A)
- 🌐 [Linux Foundation A2A Project](https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents)

**本文档最后更新：2025-11**
