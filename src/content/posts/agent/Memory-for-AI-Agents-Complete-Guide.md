---
title: 'Memory for AI Agents 完整教程'
date: '2025-11-17'
excerpt: '基于 Memori、Mem0 和现代 AI Agent 架构的全面指南'
tags: ['Agent', 'Memory']
series: 'Agent'
---
# Memory for AI Agents 完整教程

> 基于 Memori、Mem0 和现代 AI Agent 架构的全面指南

## 目录

1. [什么是 AI Agent Memory](#什么是-ai-agent-memory)
2. [为什么 Memory 对 AI Agents 至关重要](#为什么-memory-对-ai-agents-至关重要)
3. [Memory 类型详解](#memory-类型详解)
4. [Memory 架构设计](#memory-架构设计)
5. [实现方案](#实现方案)
6. [最佳实践](#最佳实践)
7. [生产环境考虑](#生产环境考虑)

---

## 什么是 AI Agent Memory

### 定义

在 AI Agent 的语境中，**Memory（记忆）**是指 Agent 跨时间、任务和多次用户交互保留和调用相关信息的能力。它使得 Agent 能够记住过去发生的事情，并利用这些信息来改进未来的行为。

### Memory vs Context Window

许多人误认为大型上下文窗口（Context Window）可以替代记忆系统，但这种方法存在以下局限：

| 特性 | Context Window | Memory System |
|------|----------------|---------------|
| **持久性** | 会话结束即消失 | 跨会话持久化 |
| **成本** | 更多 tokens = 更高成本 | 优化的存储和检索 |
| **延迟** | 随上下文增长而增加 | 稳定的检索时间 |
| **优先级** | 无法区分重要性 | 智能排序和过滤 |
| **学习能力** | 无法从历史中学习 | 持续改进和适应 |

### Memory vs RAG

虽然 RAG（Retrieval-Augmented Generation）和 Memory 系统都涉及信息检索，但它们解决不同的问题：

**RAG（检索增强生成）：**
- 在推理时引入外部知识
- 用于从文档中获取事实
- 本质上是无状态的
- 不知道之前的交互

**Memory System（记忆系统）：**
- 提供连续性
- 捕获用户偏好、历史查询、决策和失败经验
- 在未来交互中可用
- 理解用户身份和历史

---

## 为什么 Memory 对 AI Agents 至关重要

### 从无状态到有状态的转变

**无状态 Agent（Without Memory）：**
```
用户: 我喜欢吃素食，不吃奶制品
Agent: 好的，明白了
---
[下一次会话]
---
用户: 推荐一些食谱
Agent: 试试奶油意大利面怎么样？
用户: 😤 我刚告诉过你我不吃奶制品！
```

**有状态 Agent（With Memory）：**
```
用户: 我喜欢吃素食，不吃奶制品
Agent: 好的，我记住了
---
[下一次会话]
---
用户: 推荐一些食谱
Agent: 基于你的素食和无奶制品偏好，试试腰果酱意大利面？
```

### Memory 带来的核心价值

1. **个性化体验**
   - 记住用户偏好和习惯
   - 适应个人需求
   - 提供量身定制的建议

2. **持续学习**
   - 从过去的成功和失败中学习
   - 随时间改进决策
   - 累积领域知识

3. **效率提升**
   - 减少重复性问题
   - 加快响应时间
   - 降低 token 成本

4. **上下文连贯性**
   - 在会话间保持连续性
   - 理解长期目标
   - 跟踪项目进展

---

## Memory 类型详解

现代 AI Agent 通常实现多种记忆类型，类似于人类认知系统：

### 1. 短期记忆（Short-Term Memory / Working Memory）

**定义：** 当前会话中的临时信息存储

**特点：**
- 存储在上下文窗口中
- 会话结束后清除
- 用于维持对话连贯性
- 容量有限

**实现方式：**
```typescript
interface ShortTermMemory {
  conversationHistory: Message[];
  currentContext: {
    topic: string;
    entities: string[];
    lastUpdate: Date;
  };
}

class WorkingMemory {
  private messages: Message[] = [];
  private maxMessages: number = 10;

  addMessage(message: Message): void {
    this.messages.push(message);
    
    // 保持滚动窗口
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }
  }

  getContext(): Message[] {
    return this.messages;
  }

  clear(): void {
    this.messages = [];
  }
}
```

**使用场景：**
- 对话上下文维护
- 多轮对话理解
- 临时任务跟踪

---

### 2. 语义记忆（Semantic Memory）

**定义：** 存储事实性知识和一般信息

**特点：**
- 持久化存储
- 与特定事件无关
- 包含概念、事实、规则
- 支持快速检索

**数据结构示例：**
```typescript
interface SemanticMemory {
  facts: Fact[];
  concepts: Concept[];
  rules: Rule[];
  relationships: Relationship[];
}

interface Fact {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
  timestamp: Date;
  source?: string;
}

// 示例：存储用户偏好
const userPreferences: Fact[] = [
  {
    id: "fact_001",
    subject: "user_alice",
    predicate: "prefers",
    object: "vegetarian_diet",
    confidence: 0.95,
    timestamp: new Date(),
    source: "conversation"
  },
  {
    id: "fact_002",
    subject: "user_alice",
    predicate: "allergic_to",
    object: "dairy",
    confidence: 1.0,
    timestamp: new Date(),
    source: "conversation"
  }
];
```

**实现：使用向量数据库**
```typescript
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

class SemanticMemoryStore {
  private pinecone: Pinecone;
  private openai: OpenAI;
  private indexName: string;

  constructor(apiKey: string, indexName: string) {
    this.pinecone = new Pinecone({ apiKey });
    this.openai = new OpenAI();
    this.indexName = indexName;
  }

  async storeFact(fact: string, metadata: Record<string, any>): Promise<void> {
    // 生成向量嵌入
    const embedding = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: fact,
    });

    const index = this.pinecone.Index(this.indexName);
    
    // 存储到向量数据库
    await index.upsert([{
      id: metadata.id || `fact_${Date.now()}`,
      values: embedding.data[0].embedding,
      metadata: {
        text: fact,
        ...metadata,
        timestamp: new Date().toISOString()
      }
    }]);
  }

  async retrieveRelevantFacts(query: string, topK: number = 5): Promise<any[]> {
    // 生成查询向量
    const queryEmbedding = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const index = this.pinecone.Index(this.indexName);
    
    // 语义搜索
    const results = await index.query({
      vector: queryEmbedding.data[0].embedding,
      topK,
      includeMetadata: true
    });

    return results.matches || [];
  }
}
```

**使用场景：**
- 用户偏好存储
- 领域知识库
- 产品信息检索
- 规则和策略

---

### 3. 情节记忆（Episodic Memory）

**定义：** 记录特定的过往经历和事件

**特点：**
- 时间和上下文相关
- 包含完整的事件序列
- 支持案例推理
- 可用于学习模式

**数据结构：**
```typescript
interface Episode {
  id: string;
  timestamp: Date;
  sessionId: string;
  context: {
    location?: string;
    participants: string[];
    topic: string;
  };
  events: Event[];
  outcome: {
    success: boolean;
    feedback?: string;
    metrics?: Record<string, number>;
  };
  tags: string[];
}

interface Event {
  type: 'user_message' | 'agent_action' | 'tool_call' | 'error';
  timestamp: Date;
  content: string;
  metadata?: Record<string, any>;
}

// 示例：记录支持对话
const customerSupportEpisode: Episode = {
  id: "episode_cs_001",
  timestamp: new Date("2025-01-15T10:30:00Z"),
  sessionId: "session_abc123",
  context: {
    participants: ["user_alice", "agent_support"],
    topic: "payment_issue"
  },
  events: [
    {
      type: "user_message",
      timestamp: new Date("2025-01-15T10:30:00Z"),
      content: "My payment failed but money was deducted"
    },
    {
      type: "agent_action",
      timestamp: new Date("2025-01-15T10:30:15Z"),
      content: "Checking transaction history"
    },
    {
      type: "tool_call",
      timestamp: new Date("2025-01-15T10:30:20Z"),
      content: "query_payment_database",
      metadata: { transactionId: "txn_xyz789" }
    }
  ],
  outcome: {
    success: true,
    feedback: "Issue resolved within 5 minutes",
    metrics: { resolutionTime: 300, satisfactionScore: 5 }
  },
  tags: ["payment", "refund", "resolved"]
};
```

**实现：时间序列存储**
```typescript
import { MongoClient, Db } from 'mongodb';

class EpisodicMemoryStore {
  private db: Db;
  private collection: string = 'episodes';

  constructor(mongoUrl: string, dbName: string) {
    const client = new MongoClient(mongoUrl);
    this.db = client.db(dbName);
  }

  async storeEpisode(episode: Episode): Promise<void> {
    await this.db.collection(this.collection).insertOne({
      ...episode,
      _createdAt: new Date()
    });
  }

  async retrieveSimilarEpisodes(
    query: {
      topic?: string;
      tags?: string[];
      participantId?: string;
      timeRange?: { start: Date; end: Date };
    },
    limit: number = 10
  ): Promise<Episode[]> {
    const filter: any = {};

    if (query.topic) {
      filter['context.topic'] = query.topic;
    }

    if (query.tags && query.tags.length > 0) {
      filter.tags = { $in: query.tags };
    }

    if (query.participantId) {
      filter['context.participants'] = query.participantId;
    }

    if (query.timeRange) {
      filter.timestamp = {
        $gte: query.timeRange.start,
        $lte: query.timeRange.end
      };
    }

    const episodes = await this.db
      .collection(this.collection)
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    return episodes as unknown as Episode[];
  }

  async getEpisodesByOutcome(
    successOnly: boolean = true,
    limit: number = 10
  ): Promise<Episode[]> {
    const episodes = await this.db
      .collection(this.collection)
      .find({ 'outcome.success': successOnly })
      .sort({ 'outcome.metrics.satisfactionScore': -1 })
      .limit(limit)
      .toArray();

    return episodes as unknown as Episode[];
  }
}
```

**使用场景：**
- 案例推理
- 从失败中学习
- 个性化支持
- 追踪用户旅程

---

### 4. 过程记忆（Procedural Memory）

**定义：** 编码学习技能和行动序列

**特点：**
- 存储"如何做"的知识
- 自动化执行
- 基于模式和规则
- 支持技能迁移

**数据结构：**
```typescript
interface Procedure {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: ProcedureStep[];
  preconditions: Condition[];
  postconditions: Condition[];
  successRate: number;
  lastUsed: Date;
  usageCount: number;
}

interface ProcedureStep {
  order: number;
  action: string;
  parameters?: Record<string, any>;
  expectedDuration?: number;
  fallbackSteps?: ProcedureStep[];
}

interface Condition {
  type: 'requirement' | 'expected_result';
  description: string;
  validator?: (context: any) => boolean;
}

// 示例：API 认证流程
const apiAuthProcedure: Procedure = {
  id: "proc_auth_001",
  name: "API Authentication Flow",
  description: "Standard OAuth 2.0 authentication procedure",
  category: "security",
  steps: [
    {
      order: 1,
      action: "redirect_to_oauth_provider",
      parameters: {
        clientId: "${CLIENT_ID}",
        redirectUri: "${REDIRECT_URI}",
        scope: "read write"
      }
    },
    {
      order: 2,
      action: "receive_authorization_code",
      expectedDuration: 30000 // 30 seconds
    },
    {
      order: 3,
      action: "exchange_code_for_token",
      parameters: {
        tokenEndpoint: "${TOKEN_ENDPOINT}"
      },
      fallbackSteps: [
        {
          order: 1,
          action: "retry_with_exponential_backoff"
        }
      ]
    }
  ],
  preconditions: [
    {
      type: 'requirement',
      description: "Valid client credentials must be configured"
    }
  ],
  postconditions: [
    {
      type: 'expected_result',
      description: "Access token and refresh token obtained"
    }
  ],
  successRate: 0.98,
  lastUsed: new Date(),
  usageCount: 1523
};
```

**实现：规则引擎**
```typescript
class ProceduralMemoryEngine {
  private procedures: Map<string, Procedure> = new Map();

  registerProcedure(procedure: Procedure): void {
    this.procedures.set(procedure.id, procedure);
  }

  async executeProcedure(
    procedureId: string,
    context: Record<string, any>
  ): Promise<ExecutionResult> {
    const procedure = this.procedures.get(procedureId);
    if (!procedure) {
      throw new Error(`Procedure ${procedureId} not found`);
    }

    // 验证前置条件
    const preconditionsValid = this.validateConditions(
      procedure.preconditions,
      context
    );
    
    if (!preconditionsValid) {
      return {
        success: false,
        error: "Preconditions not met"
      };
    }

    // 执行步骤
    const results: StepResult[] = [];
    for (const step of procedure.steps) {
      try {
        const stepResult = await this.executeStep(step, context);
        results.push(stepResult);
        
        if (!stepResult.success && step.fallbackSteps) {
          // 执行备用步骤
          for (const fallbackStep of step.fallbackSteps) {
            const fallbackResult = await this.executeStep(fallbackStep, context);
            if (fallbackResult.success) {
              results.push(fallbackResult);
              break;
            }
          }
        }
      } catch (error) {
        return {
          success: false,
          error: `Step ${step.order} failed: ${error}`,
          results
        };
      }
    }

    // 更新使用统计
    procedure.lastUsed = new Date();
    procedure.usageCount++;

    return {
      success: true,
      results
    };
  }

  private validateConditions(
    conditions: Condition[],
    context: Record<string, any>
  ): boolean {
    return conditions.every(condition => {
      if (condition.validator) {
        return condition.validator(context);
      }
      return true;
    });
  }

  private async executeStep(
    step: ProcedureStep,
    context: Record<string, any>
  ): Promise<StepResult> {
    // 实现具体的步骤执行逻辑
    // 这里简化为模拟执行
    console.log(`Executing: ${step.action}`);
    
    return {
      success: true,
      step: step.order,
      duration: step.expectedDuration || 0
    };
  }
}

interface ExecutionResult {
  success: boolean;
  error?: string;
  results?: StepResult[];
}

interface StepResult {
  success: boolean;
  step: number;
  duration: number;
  output?: any;
}
```

**使用场景：**
- 标准操作流程（SOP）
- 工作流自动化
- 技能学习和迁移
- 错误处理模式

---

## Memory 架构设计

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                       AI Agent Application                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ LLM API Calls
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Memory Interceptor Layer                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  1. Pre-processing: Inject Context                   │   │
│  │  2. LLM Call: Forward to Provider                    │   │
│  │  3. Post-processing: Extract & Store                 │   │
│  └──────────────────────────────────────────────────────┘   │
└───────┬─────────────────────────────────────────┬───────────┘
        │                                         │
        ▼ Get Context                             ▼ Store Memories
┌───────────────────────────────┐   ┌─────────────────────────┐
│     Memory Retrieval System    │   │   Memory Storage Layer  │
│  ┌─────────────────────────┐  │   │  ┌──────────────────┐  │
│  │ • Semantic Search       │  │   │  │ Short-term       │  │
│  │ • Temporal Filtering    │  │   │  │ • Redis/Memory   │  │
│  │ • Relevance Ranking     │  │   │  └──────────────────┘  │
│  │ • Context Assembly      │  │   │  ┌──────────────────┐  │
│  └─────────────────────────┘  │   │  │ Semantic         │  │
└───────────────────────────────┘   │  │ • Vector DB      │  │
                                    │  └──────────────────┘  │
┌───────────────────────────────┐   │  ┌──────────────────┐  │
│  Conscious Analysis Agent      │   │  │ Episodic         │  │
│  ┌─────────────────────────┐  │   │  │ • TimeSeries DB  │  │
│  │ • Pattern Detection     │  │   │  └──────────────────┘  │
│  │ • Memory Consolidation  │  │   │  ┌──────────────────┐  │
│  │ • Promotion/Demotion    │  │   │  │ Procedural       │  │
│  │ • Conflict Resolution   │  │   │  │ • Document Store │  │
│  └─────────────────────────┘  │   │  └──────────────────┘  │
└───────────────────────────────┘   └─────────────────────────┘
```

### Memori 工作流程

基于 Memori 开源项目的实现方式：

```typescript
/**
 * Memori 核心架构实现
 */

import { OpenAI } from 'openai';
import { EventEmitter } from 'events';

interface MemoriConfig {
  namespace: string;
  databaseUrl: string;
  openaiApiKey: string;
  autoIngest?: boolean;
  consciousIngest?: boolean;
}

class MemoriCore extends EventEmitter {
  private config: MemoriConfig;
  private openaiClient: OpenAI;
  private enabled: boolean = false;
  
  constructor(config: MemoriConfig) {
    super();
    this.config = config;
    this.openaiClient = new OpenAI({ apiKey: config.openaiApiKey });
  }

  /**
   * 启用 Memori 拦截器
   */
  enable(): void {
    if (this.enabled) return;
    
    // 拦截 OpenAI 调用
    this.interceptOpenAICalls();
    this.enabled = true;
    
    if (this.config.consciousIngest) {
      this.startConsciousAnalysis();
    }
  }

  /**
   * 拦截 LLM 调用的核心逻辑
   */
  private interceptOpenAICalls(): void {
    const originalCreate = this.openaiClient.chat.completions.create.bind(
      this.openaiClient.chat.completions
    );

    this.openaiClient.chat.completions.create = async (params: any) => {
      // Step 1: 检索相关记忆
      const relevantMemories = await this.retrieveContext(params.messages);

      // Step 2: 注入记忆到 prompt
      const enhancedMessages = this.injectMemories(
        params.messages,
        relevantMemories
      );

      // Step 3: 调用 LLM
      const response = await originalCreate({
        ...params,
        messages: enhancedMessages
      });

      // Step 4: 提取并存储新记忆
      if (this.config.autoIngest) {
        await this.extractAndStore(params.messages, response);
      }

      return response;
    };
  }

  /**
   * 检索相关上下文
   */
  private async retrieveContext(messages: any[]): Promise<Memory[]> {
    const lastUserMessage = messages
      .filter(m => m.role === 'user')
      .pop();

    if (!lastUserMessage) return [];

    // 从向量数据库中检索
    const query = lastUserMessage.content;
    const memories = await this.searchMemories({
      query,
      namespace: this.config.namespace,
      limit: 5
    });

    return memories;
  }

  /**
   * 注入记忆到消息
   */
  private injectMemories(messages: any[], memories: Memory[]): any[] {
    if (memories.length === 0) return messages;

    const memoryContext = this.formatMemoriesAsContext(memories);
    
    // 在系统消息之后插入记忆上下文
    const systemMessageIndex = messages.findIndex(m => m.role === 'system');
    
    if (systemMessageIndex >= 0) {
      return [
        messages[systemMessageIndex],
        {
          role: 'system',
          content: memoryContext
        },
        ...messages.slice(systemMessageIndex + 1)
      ];
    }

    return [
      {
        role: 'system',
        content: memoryContext
      },
      ...messages
    ];
  }

  /**
   * 格式化记忆为上下文
   */
  private formatMemoriesAsContext(memories: Memory[]): string {
    const context = memories.map(m => {
      return `[Memory from ${m.timestamp.toISOString()}]
Category: ${m.category}
Content: ${m.content}
Relevance: ${m.relevanceScore.toFixed(2)}
---`;
    }).join('\n');

    return `Relevant memories from past interactions:

${context}

Use these memories to provide personalized and contextually relevant responses.`;
  }

  /**
   * 提取并存储记忆
   */
  private async extractAndStore(messages: any[], response: any): Promise<void> {
    const conversation = {
      messages,
      response: response.choices[0].message
    };

    // 使用 LLM 提取重要信息
    const extraction = await this.openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Extract important facts, preferences, and information from this conversation.
Format your response as JSON:
{
  "facts": ["fact1", "fact2"],
  "preferences": ["pref1", "pref2"],
  "actionItems": ["action1", "action2"]
}`
        },
        {
          role: "user",
          content: JSON.stringify(conversation)
        }
      ],
      response_format: { type: "json_object" }
    });

    const extractedData = JSON.parse(
      extraction.choices[0].message.content || '{}'
    );

    // 存储到数据库
    await this.storeMemories(extractedData);
  }

  /**
   * 意识分析：后台处理记忆
   */
  private startConsciousAnalysis(): void {
    // 每小时运行一次
    setInterval(async () => {
      await this.analyzeAndConsolidate();
    }, 3600000);
  }

  /**
   * 分析并整合记忆
   */
  private async analyzeAndConsolidate(): Promise<void> {
    // 获取最近的记忆
    const recentMemories = await this.getRecentMemories(100);

    // 检测模式
    const patterns = await this.detectPatterns(recentMemories);

    // 提升重要记忆
    for (const pattern of patterns) {
      if (pattern.importance > 0.8) {
        await this.promoteMemory(pattern);
      }
    }

    // 解决冲突
    await this.resolveConflicts(recentMemories);
  }

  // 辅助方法
  private async searchMemories(params: any): Promise<Memory[]> {
    // 实现向量搜索
    return [];
  }

  private async storeMemories(data: any): Promise<void> {
    // 实现存储逻辑
  }

  private async getRecentMemories(limit: number): Promise<Memory[]> {
    return [];
  }

  private async detectPatterns(memories: Memory[]): Promise<Pattern[]> {
    return [];
  }

  private async promoteMemory(pattern: Pattern): Promise<void> {
    // 实现记忆提升
  }

  private async resolveConflicts(memories: Memory[]): Promise<void> {
    // 实现冲突解决
  }
}

interface Memory {
  id: string;
  content: string;
  category: 'fact' | 'preference' | 'rule' | 'summary';
  timestamp: Date;
  relevanceScore: number;
  namespace: string;
}

interface Pattern {
  type: string;
  memories: string[];
  importance: number;
}

// 使用示例
const memori = new MemoriCore({
  namespace: 'user_alice',
  databaseUrl: 'postgresql://localhost/memori',
  openaiApiKey: process.env.OPENAI_API_KEY!,
  autoIngest: true,
  consciousIngest: true
});

memori.enable();

// 之后的所有 OpenAI 调用都会自动带上记忆
const openai = new OpenAI();
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "user", content: "What's my favorite food?" }
  ]
});
```

---

### Mem0 架构实现

Mem0 提供了更高级的记忆管理功能：

```typescript
/**
 * Mem0 风格的记忆系统实现
 */

interface Mem0Config {
  llmProvider: 'openai' | 'anthropic';
  apiKey: string;
  vectorDb: {
    type: 'pinecone' | 'qdrant' | 'weaviate';
    url: string;
    apiKey: string;
  };
  graphDb?: {
    type: 'neo4j';
    url: string;
    username: string;
    password: string;
  };
}

class Mem0Memory {
  private config: Mem0Config;
  private vectorStore: VectorStore;
  private graphStore?: GraphStore;

  constructor(config: Mem0Config) {
    this.config = config;
    this.vectorStore = new VectorStore(config.vectorDb);
    
    if (config.graphDb) {
      this.graphStore = new GraphStore(config.graphDb);
    }
  }

  /**
   * 添加记忆
   */
  async add(
    message: string,
    userId: string,
    metadata?: Record<string, any>
  ): Promise<MemoryAddResult> {
    // Phase 1: Extraction - 从消息中提取记忆
    const extractedMemories = await this.extractMemories(message);

    // Phase 2: Deduplication - 去重
    const newMemories = await this.deduplicateMemories(
      extractedMemories,
      userId
    );

    // Phase 3: Update - 更新现有记忆或创建新记忆
    const results: StoredMemory[] = [];
    for (const memory of newMemories) {
      const stored = await this.storeMemory(memory, userId, metadata);
      results.push(stored);
    }

    // Phase 4: Graph Relationships (如果启用)
    if (this.graphStore) {
      await this.updateGraphRelationships(results, userId);
    }

    return {
      memoriesAdded: results.length,
      memories: results
    };
  }

  /**
   * 搜索记忆
   */
  async search(
    query: string,
    userId: string,
    options: SearchOptions = {}
  ): Promise<SearchResult> {
    const {
      limit = 5,
      filters = {},
      threshold = 0.7
    } = options;

    // 生成查询向量
    const queryVector = await this.generateEmbedding(query);

    // 向量搜索
    const vectorResults = await this.vectorStore.search({
      vector: queryVector,
      filter: { userId, ...filters },
      limit: limit * 2, // 获取更多候选
      threshold
    });

    // 如果启用图数据库，结合图搜索
    let graphResults: any[] = [];
    if (this.graphStore) {
      graphResults = await this.graphStore.findRelated(
        query,
        userId,
        limit
      );
    }

    // 混合排序
    const rankedResults = this.hybridRanking(
      vectorResults,
      graphResults,
      query
    );

    return {
      results: rankedResults.slice(0, limit),
      total: rankedResults.length
    };
  }

  /**
   * 更新记忆
   */
  async update(
    memoryId: string,
    updates: Partial<Memory>
  ): Promise<void> {
    // 获取现有记忆
    const existing = await this.vectorStore.get(memoryId);
    if (!existing) {
      throw new Error(`Memory ${memoryId} not found`);
    }

    // 合并更新
    const updated = { ...existing, ...updates };

    // 重新生成向量（如果内容变化）
    if (updates.content) {
      updated.vector = await this.generateEmbedding(updates.content);
    }

    // 存储
    await this.vectorStore.update(memoryId, updated);

    // 更新图关系
    if (this.graphStore && updates.content) {
      await this.graphStore.updateNode(memoryId, updated);
    }
  }

  /**
   * 删除记忆
   */
  async delete(memoryId: string): Promise<void> {
    await this.vectorStore.delete(memoryId);
    
    if (this.graphStore) {
      await this.graphStore.deleteNode(memoryId);
    }
  }

  /**
   * 获取用户的所有记忆
   */
  async getAll(
    userId: string,
    options: GetAllOptions = {}
  ): Promise<Memory[]> {
    const {
      category,
      startDate,
      endDate,
      limit = 100
    } = options;

    const filters: any = { userId };
    
    if (category) filters.category = category;
    if (startDate) filters.timestamp = { $gte: startDate };
    if (endDate) filters.timestamp = { ...filters.timestamp, $lte: endDate };

    return await this.vectorStore.getAll(filters, limit);
  }

  /**
   * 记忆统计
   */
  async getStats(userId: string): Promise<MemoryStats> {
    const allMemories = await this.getAll(userId, { limit: 10000 });

    const stats: MemoryStats = {
      total: allMemories.length,
      byCategory: {},
      byMonth: {},
      avgConfidence: 0,
      oldestMemory: null,
      newestMemory: null
    };

    let totalConfidence = 0;

    for (const memory of allMemories) {
      // 按类别统计
      stats.byCategory[memory.category] = 
        (stats.byCategory[memory.category] || 0) + 1;

      // 按月份统计
      const month = memory.timestamp.toISOString().substring(0, 7);
      stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;

      // 累加置信度
      totalConfidence += memory.confidence || 0;

      // 更新最老和最新记忆
      if (!stats.oldestMemory || memory.timestamp < stats.oldestMemory) {
        stats.oldestMemory = memory.timestamp;
      }
      if (!stats.newestMemory || memory.timestamp > stats.newestMemory) {
        stats.newestMemory = memory.timestamp;
      }
    }

    stats.avgConfidence = totalConfidence / allMemories.length;

    return stats;
  }

  /**
   * 从消息中提取记忆
   */
  private async extractMemories(message: string): Promise<ExtractedMemory[]> {
    const prompt = `Analyze the following message and extract important information that should be remembered.
Categorize each piece of information as: fact, preference, rule, or summary.

Message: "${message}"

Respond in JSON format:
{
  "memories": [
    {
      "content": "extracted information",
      "category": "fact|preference|rule|summary",
      "confidence": 0.0-1.0
    }
  ]
}`;

    const response = await this.callLLM(prompt);
    const parsed = JSON.parse(response);

    return parsed.memories || [];
  }

  /**
   * 去重记忆
   */
  private async deduplicateMemories(
    memories: ExtractedMemory[],
    userId: string
  ): Promise<ExtractedMemory[]> {
    const unique: ExtractedMemory[] = [];

    for (const memory of memories) {
      // 搜索相似的现有记忆
      const similar = await this.search(memory.content, userId, {
        limit: 1,
        threshold: 0.9
      });

      if (similar.results.length === 0) {
        // 没有相似记忆，保留
        unique.push(memory);
      } else {
        // 有相似记忆，判断是否需要更新
        const existing = similar.results[0];
        if (memory.confidence > existing.confidence) {
          // 新记忆更可信，标记为更新
          await this.update(existing.id, {
            content: memory.content,
            confidence: memory.confidence
          });
        }
      }
    }

    return unique;
  }

  /**
   * 存储记忆
   */
  private async storeMemory(
    memory: ExtractedMemory,
    userId: string,
    metadata?: Record<string, any>
  ): Promise<StoredMemory> {
    const vector = await this.generateEmbedding(memory.content);

    const stored: StoredMemory = {
      id: this.generateId(),
      userId,
      content: memory.content,
      category: memory.category,
      confidence: memory.confidence,
      timestamp: new Date(),
      vector,
      metadata: metadata || {}
    };

    await this.vectorStore.insert(stored);

    return stored;
  }

  /**
   * 更新图关系
   */
  private async updateGraphRelationships(
    memories: StoredMemory[],
    userId: string
  ): Promise<void> {
    if (!this.graphStore) return;

    for (const memory of memories) {
      // 提取实体
      const entities = await this.extractEntities(memory.content);

      // 创建节点
      await this.graphStore.createNode({
        id: memory.id,
        label: 'Memory',
        properties: {
          content: memory.content,
          category: memory.category,
          timestamp: memory.timestamp
        }
      });

      // 创建关系
      for (const entity of entities) {
        await this.graphStore.createRelationship({
          from: memory.id,
          to: entity.id,
          type: entity.relationship,
          properties: {
            confidence: entity.confidence
          }
        });
      }
    }
  }

  /**
   * 混合排序（向量 + 图）
   */
  private hybridRanking(
    vectorResults: any[],
    graphResults: any[],
    query: string
  ): any[] {
    // 创建结果映射
    const resultMap = new Map<string, RankedResult>();

    // 处理向量搜索结果
    vectorResults.forEach((result, index) => {
      resultMap.set(result.id, {
        ...result,
        vectorScore: 1 - (index / vectorResults.length),
        graphScore: 0
      });
    });

    // 处理图搜索结果
    graphResults.forEach((result, index) => {
      const existing = resultMap.get(result.id);
      const graphScore = 1 - (index / graphResults.length);
      
      if (existing) {
        existing.graphScore = graphScore;
      } else {
        resultMap.set(result.id, {
          ...result,
          vectorScore: 0,
          graphScore
        });
      }
    });

    // 计算综合得分并排序
    return Array.from(resultMap.values())
      .map(result => ({
        ...result,
        finalScore: (result.vectorScore * 0.7) + (result.graphScore * 0.3)
      }))
      .sort((a, b) => b.finalScore - a.finalScore);
  }

  // 辅助方法
  private async generateEmbedding(text: string): Promise<number[]> {
    // 调用嵌入模型
    return [];
  }

  private async callLLM(prompt: string): Promise<string> {
    // 调用 LLM
    return "{}";
  }

  private async extractEntities(text: string): Promise<Entity[]> {
    // 提取命名实体
    return [];
  }

  private generateId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 类型定义
interface MemoryAddResult {
  memoriesAdded: number;
  memories: StoredMemory[];
}

interface SearchOptions {
  limit?: number;
  filters?: Record<string, any>;
  threshold?: number;
}

interface SearchResult {
  results: any[];
  total: number;
}

interface GetAllOptions {
  category?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

interface MemoryStats {
  total: number;
  byCategory: Record<string, number>;
  byMonth: Record<string, number>;
  avgConfidence: number;
  oldestMemory: Date | null;
  newestMemory: Date | null;
}

interface ExtractedMemory {
  content: string;
  category: 'fact' | 'preference' | 'rule' | 'summary';
  confidence: number;
}

interface StoredMemory extends ExtractedMemory {
  id: string;
  userId: string;
  timestamp: Date;
  vector: number[];
  metadata: Record<string, any>;
}

interface Entity {
  id: string;
  relationship: string;
  confidence: number;
}

interface RankedResult {
  id: string;
  vectorScore: number;
  graphScore: number;
  finalScore?: number;
}

// 使用示例
const memory = new Mem0Memory({
  llmProvider: 'openai',
  apiKey: process.env.OPENAI_API_KEY!,
  vectorDb: {
    type: 'pinecone',
    url: process.env.PINECONE_URL!,
    apiKey: process.env.PINECONE_API_KEY!
  }
});

// 添加记忆
await memory.add(
  "I'm allergic to peanuts and prefer vegetarian food",
  "user_alice"
);

// 搜索记忆
const results = await memory.search(
  "What are my food preferences?",
  "user_alice"
);

console.log(results);
```

---

## 实现方案

### 方案 1: 基础实现（适合小型项目）

使用简单的数据结构和本地存储：

```typescript
/**
 * 轻量级记忆系统
 */

class SimpleMemorySystem {
  private shortTermMemory: Message[] = [];
  private semanticMemory: Map<string, string> = new Map();
  private episodicMemory: Episode[] = [];
  
  private maxShortTermSize = 10;

  /**
   * 添加消息到短期记忆
   */
  addToShortTerm(message: Message): void {
    this.shortTermMemory.push(message);
    
    if (this.shortTermMemory.length > this.maxShortTermSize) {
      // 移除最旧的消息
      const removed = this.shortTermMemory.shift();
      
      // 提取重要信息到长期记忆
      if (removed) {
        this.consolidateToLongTerm(removed);
      }
    }
  }

  /**
   * 整合到长期记忆
   */
  private consolidateToLongTerm(message: Message): void {
    // 简单的关键词提取
    const keywords = this.extractKeywords(message.content);
    
    for (const keyword of keywords) {
      this.semanticMemory.set(keyword, message.content);
    }
  }

  /**
   * 提取关键词
   */
  private extractKeywords(text: string): string[] {
    // 简化版：分词并过滤停用词
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were'
    ]);
    
    return text
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3 && !stopWords.has(word));
  }

  /**
   * 检索相关记忆
   */
  retrieve(query: string): string[] {
    const keywords = this.extractKeywords(query);
    const results: string[] = [];
    
    for (const keyword of keywords) {
      const memory = this.semanticMemory.get(keyword);
      if (memory && !results.includes(memory)) {
        results.push(memory);
      }
    }
    
    return results;
  }

  /**
   * 获取短期记忆上下文
   */
  getContext(): Message[] {
    return [...this.shortTermMemory];
  }
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// 使用示例
const memorySystem = new SimpleMemorySystem();

memorySystem.addToShortTerm({
  role: 'user',
  content: 'I love playing tennis on weekends',
  timestamp: new Date()
});

memorySystem.addToShortTerm({
  role: 'assistant',
  content: 'That\'s great! Tennis is a wonderful sport.',
  timestamp: new Date()
});

// 检索相关记忆
const relevant = memorySystem.retrieve('sports activities');
console.log(relevant);
```

---

### 方案 2: 生产级实现（推荐）

使用 Mem0 或 Memori 库：

```typescript
/**
 * 使用 Mem0 的完整实现
 */

import { Memory } from 'mem0ai';
import { OpenAI } from 'openai';

class ProductionAgent {
  private memory: Memory;
  private openai: OpenAI;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
    
    // 初始化 Mem0
    this.memory = new Memory({
      apiKey: process.env.MEM0_API_KEY
    });
    
    // 初始化 OpenAI
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * 处理用户消息
   */
  async chat(userMessage: string): Promise<string> {
    // 1. 搜索相关记忆
    const relevantMemories = await this.memory.search({
      query: userMessage,
      user_id: this.userId,
      limit: 5
    });

    // 2. 构建带记忆的 prompt
    const systemPrompt = this.buildSystemPrompt(relevantMemories);

    // 3. 调用 LLM
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    const assistantMessage = response.choices[0].message.content || '';

    // 4. 存储新记忆
    await this.memory.add({
      messages: [
        { role: "user", content: userMessage },
        { role: "assistant", content: assistantMessage }
      ],
      user_id: this.userId
    });

    return assistantMessage;
  }

  /**
   * 构建系统 prompt
   */
  private buildSystemPrompt(memories: any): string {
    if (memories.results.length === 0) {
      return "You are a helpful AI assistant.";
    }

    const memoryContext = memories.results
      .map((m: any) => `- ${m.memory}`)
      .join('\n');

    return `You are a helpful AI assistant with access to past interactions.

Here's what you remember about this user:
${memoryContext}

Use this information to provide personalized and contextually relevant responses.`;
  }

  /**
   * 获取用户记忆统计
   */
  async getMemoryStats(): Promise<any> {
    const allMemories = await this.memory.getAll({
      user_id: this.userId
    });

    return {
      totalMemories: allMemories.results.length,
      memories: allMemories.results
    };
  }
}

// 使用示例
const agent = new ProductionAgent('user_alice');

// 第一次对话
const response1 = await agent.chat("I'm vegetarian and allergic to nuts");
console.log(response1);

// 后续对话 - Agent 会记住偏好
const response2 = await agent.chat("Recommend some recipes for dinner");
console.log(response2); // 会推荐素食且不含坚果的食谱

// 查看记忆统计
const stats = await agent.getMemoryStats();
console.log(stats);
```

---

## 最佳实践

### 1. 记忆分类策略

```typescript
/**
 * 智能记忆分类器
 */

class MemoryClassifier {
  async classify(content: string): Promise<MemoryCategory> {
    const prompt = `Analyze the following text and determine what type of information it contains.

Text: "${content}"

Categories:
- fact: Objective, verifiable information
- preference: User likes, dislikes, or choices
- rule: Instructions or constraints
- summary: Condensed information from longer interactions

Respond with just the category name.`;

    // 调用 LLM 分类
    const category = await this.callLLM(prompt);
    
    return category.toLowerCase() as MemoryCategory;
  }

  private async callLLM(prompt: string): Promise<string> {
    // 实现 LLM 调用
    return 'fact';
  }
}

type MemoryCategory = 'fact' | 'preference' | 'rule' | 'summary';
```

### 2. 记忆衰减机制

实现类似人类记忆的遗忘曲线：

```typescript
/**
 * 记忆衰减管理
 */

interface MemoryWithDecay extends StoredMemory {
  accessCount: number;
  lastAccessed: Date;
  importance: number;
}

class MemoryDecayManager {
  /**
   * 计算记忆的当前强度
   */
  calculateStrength(memory: MemoryWithDecay): number {
    const daysSinceCreation = this.getDaysSince(memory.timestamp);
    const daysSinceAccess = this.getDaysSince(memory.lastAccessed);
    
    // 基础衰减：随时间减弱
    const timeDecay = Math.exp(-daysSinceCreation / 30);
    
    // 访问加权：经常访问的记忆更持久
    const accessBoost = Math.log(memory.accessCount + 1) / 10;
    
    // 重要性加权
    const importanceBoost = memory.importance;
    
    // 最近访问加成
    const recencyBoost = Math.exp(-daysSinceAccess / 7);
    
    return (timeDecay + accessBoost + importanceBoost) * recencyBoost;
  }

  /**
   * 判断是否应该删除记忆
   */
  shouldDelete(memory: MemoryWithDecay): boolean {
    const strength = this.calculateStrength(memory);
    const threshold = 0.1; // 低于此阈值则删除
    
    return strength < threshold && memory.accessCount < 2;
  }

  /**
   * 更新记忆访问信息
   */
  updateAccess(memory: MemoryWithDecay): MemoryWithDecay {
    return {
      ...memory,
      accessCount: memory.accessCount + 1,
      lastAccessed: new Date()
    };
  }

  private getDaysSince(date: Date): number {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return diffMs / (1000 * 60 * 60 * 24);
  }

  /**
   * 定期清理过期记忆
   */
  async cleanupExpiredMemories(
    memoryStore: any,
    userId: string
  ): Promise<number> {
    const allMemories = await memoryStore.getAll(userId);
    let deletedCount = 0;

    for (const memory of allMemories) {
      if (this.shouldDelete(memory)) {
        await memoryStore.delete(memory.id);
        deletedCount++;
      }
    }

    return deletedCount;
  }
}
```

### 3. 冲突解决

当新旧记忆冲突时的处理策略：

```typescript
/**
 * 记忆冲突解决器
 */

class MemoryConflictResolver {
  /**
   * 检测冲突
   */
  async detectConflicts(
    newMemory: Memory,
    existingMemories: Memory[]
  ): Promise<ConflictReport[]> {
    const conflicts: ConflictReport[] = [];

    for (const existing of existingMemories) {
      const similarity = await this.calculateSimilarity(
        newMemory.content,
        existing.content
      );

      if (similarity > 0.8) {
        const isContradictory = await this.isContradictory(
          newMemory.content,
          existing.content
        );

        if (isContradictory) {
          conflicts.push({
            newMemory,
            existingMemory: existing,
            similarity,
            resolutionStrategy: this.determineStrategy(newMemory, existing)
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * 解决冲突
   */
  async resolveConflict(conflict: ConflictReport): Promise<ResolutionResult> {
    const { newMemory, existingMemory, resolutionStrategy } = conflict;

    switch (resolutionStrategy) {
      case 'replace':
        // 新记忆更可信，替换旧记忆
        return {
          action: 'replace',
          memoryToKeep: newMemory,
          memoryToDelete: existingMemory
        };

      case 'merge':
        // 合并两个记忆
        const merged = await this.mergeMemories(newMemory, existingMemory);
        return {
          action: 'merge',
          mergedMemory: merged,
          memoriesToDelete: [newMemory, existingMemory]
        };

      case 'keep_both':
        // 保留两个记忆，标记为冲突
        return {
          action: 'keep_both',
          memories: [
            { ...newMemory, conflictsWith: existingMemory.id },
            { ...existingMemory, conflictsWith: newMemory.id }
          ]
        };

      case 'prefer_existing':
        // 保留旧记忆，丢弃新记忆
        return {
          action: 'keep_existing',
          memoryToKeep: existingMemory,
          memoryToDelete: newMemory
        };

      default:
        throw new Error(`Unknown resolution strategy: ${resolutionStrategy}`);
    }
  }

  /**
   * 判断策略
   */
  private determineStrategy(
    newMemory: Memory,
    existingMemory: Memory
  ): ResolutionStrategy {
    // 基于置信度
    if (newMemory.confidence > existingMemory.confidence + 0.2) {
      return 'replace';
    }

    // 基于时间（更近的记忆可能更准确）
    const timeDiff = newMemory.timestamp.getTime() - 
                     existingMemory.timestamp.getTime();
    if (timeDiff > 30 * 24 * 60 * 60 * 1000) { // 30天
      return 'replace';
    }

    // 如果差异不大，合并
    if (Math.abs(newMemory.confidence - existingMemory.confidence) < 0.1) {
      return 'merge';
    }

    return 'keep_both';
  }

  /**
   * 合并记忆
   */
  private async mergeMemories(
    memory1: Memory,
    memory2: Memory
  ): Promise<Memory> {
    const prompt = `Merge these two related pieces of information into a single, coherent statement:

1. ${memory1.content} (confidence: ${memory1.confidence})
2. ${memory2.content} (confidence: ${memory2.confidence})

Return just the merged statement.`;

    const mergedContent = await this.callLLM(prompt);

    return {
      id: this.generateId(),
      content: mergedContent,
      category: memory1.category,
      confidence: (memory1.confidence + memory2.confidence) / 2,
      timestamp: new Date(),
      userId: memory1.userId,
      vector: await this.generateEmbedding(mergedContent),
      metadata: {
        mergedFrom: [memory1.id, memory2.id]
      }
    };
  }

  private async calculateSimilarity(text1: string, text2: string): Promise<number> {
    // 计算余弦相似度
    return 0.5;
  }

  private async isContradictory(text1: string, text2: string): Promise<boolean> {
    // 使用 LLM 判断是否矛盾
    return false;
  }

  private async callLLM(prompt: string): Promise<string> {
    return "";
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    return [];
  }

  private generateId(): string {
    return `mem_${Date.now()}`;
  }
}

interface ConflictReport {
  newMemory: Memory;
  existingMemory: Memory;
  similarity: number;
  resolutionStrategy: ResolutionStrategy;
}

type ResolutionStrategy = 'replace' | 'merge' | 'keep_both' | 'prefer_existing';

interface ResolutionResult {
  action: string;
  memoryToKeep?: Memory;
  memoryToDelete?: Memory;
  mergedMemory?: Memory;
  memoriesToDelete?: Memory[];
  memories?: Memory[];
}
```

### 4. 隐私和安全

```typescript
/**
 * 记忆隐私管理
 */

class MemoryPrivacyManager {
  private sensitivePatterns: RegExp[] = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b\d{16}\b/, // Credit card
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/ // Phone number
  ];

  /**
   * 检测敏感信息
   */
  detectSensitiveInfo(content: string): SensitiveDetection {
    const detected: string[] = [];

    for (const pattern of this.sensitivePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        detected.push(...matches);
      }
    }

    return {
      hasSensitiveInfo: detected.length > 0,
      detectedItems: detected,
      redactedContent: this.redact(content)
    };
  }

  /**
   * 脱敏处理
   */
  private redact(content: string): string {
    let redacted = content;

    for (const pattern of this.sensitivePatterns) {
      redacted = redacted.replace(pattern, '[REDACTED]');
    }

    return redacted;
  }

  /**
   * 加密敏感记忆
   */
  async encryptMemory(memory: Memory, encryptionKey: string): Promise<EncryptedMemory> {
    // 使用 AES 加密
    const crypto = await import('crypto');
    const algorithm = 'aes-256-gcm';
    const key = crypto.createHash('sha256').update(encryptionKey).digest();
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(memory), 'utf8'),
      cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      metadata: {
        memoryId: memory.id,
        timestamp: memory.timestamp
      }
    };
  }

  /**
   * 解密记忆
   */
  async decryptMemory(
    encrypted: EncryptedMemory,
    encryptionKey: string
  ): Promise<Memory> {
    const crypto = await import('crypto');
    const algorithm = 'aes-256-gcm';
    const key = crypto.createHash('sha256').update(encryptionKey).digest();
    
    const decipher = crypto.createDecipheriv(
      algorithm,
      key,
      Buffer.from(encrypted.iv, 'base64')
    );
    
    decipher.setAuthTag(Buffer.from(encrypted.authTag, 'base64'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted.encryptedData, 'base64')),
      decipher.final()
    ]);

    return JSON.parse(decrypted.toString('utf8'));
  }

  /**
   * 实施数据保留政策
   */
  async enforceRetentionPolicy(
    memories: Memory[],
    retentionDays: number
  ): Promise<string[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const expiredMemoryIds = memories
      .filter(m => m.timestamp < cutoffDate)
      .map(m => m.id);

    return expiredMemoryIds;
  }
}

interface SensitiveDetection {
  hasSensitiveInfo: boolean;
  detectedItems: string[];
  redactedContent: string;
}

interface EncryptedMemory {
  encryptedData: string;
  iv: string;
  authTag: string;
  metadata: {
    memoryId: string;
    timestamp: Date;
  };
}
```

---

## 生产环境考虑

### 1. 性能优化

```typescript
/**
 * 记忆系统性能优化
 */

class OptimizedMemorySystem {
  private cache: Map<string, CacheEntry> = new Map();
  private cacheMaxSize = 1000;
  private cacheTTL = 3600000; // 1小时

  /**
   * 带缓存的记忆检索
   */
  async retrieveWithCache(
    query: string,
    userId: string
  ): Promise<Memory[]> {
    const cacheKey = `${userId}:${query}`;
    
    // 检查缓存
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    // 缓存未命中，从数据库检索
    const memories = await this.retrieveFromDB(query, userId);

    // 更新缓存
    this.updateCache(cacheKey, memories);

    return memories;
  }

  /**
   * 批量操作
   */
  async batchStore(memories: Memory[]): Promise<void> {
    // 分批处理，避免单次操作过大
    const batchSize = 100;
    
    for (let i = 0; i < memories.length; i += batchSize) {
      const batch = memories.slice(i, i + batchSize);
      await this.storeBatch(batch);
    }
  }

  /**
   * 异步后台处理
   */
  async processInBackground(task: BackgroundTask): Promise<void> {
    // 使用消息队列
    await this.enqueueTask(task);
  }

  private updateCache(key: string, data: Memory[]): void {
    // 实现 LRU 缓存
    if (this.cache.size >= this.cacheMaxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private async retrieveFromDB(query: string, userId: string): Promise<Memory[]> {
    return [];
  }

  private async storeBatch(memories: Memory[]): Promise<void> {
    // 实现批量存储
  }

  private async enqueueTask(task: BackgroundTask): Promise<void> {
    // 实现任务队列
  }
}

interface CacheEntry {
  data: Memory[];
  timestamp: number;
}

interface BackgroundTask {
  type: string;
  payload: any;
}
```

### 2. 监控和可观测性

```typescript
/**
 * 记忆系统监控
 */

class MemoryMonitoring {
  private metrics: MetricsCollector;

  async trackOperation(
    operationType: string,
    operation: () => Promise<any>
  ): Promise<any> {
    const startTime = Date.now();
    
    try {
      const result = await operation();
      
      // 记录成功指标
      this.metrics.recordSuccess(operationType, Date.now() - startTime);
      
      return result;
    } catch (error) {
      // 记录失败指标
      this.metrics.recordFailure(operationType, error);
      throw error;
    }
  }

  /**
   * 获取系统健康状态
   */
  async getHealthStatus(): Promise<HealthStatus> {
    return {
      status: 'healthy',
      metrics: {
        totalMemories: await this.getTotalMemories(),
        avgRetrievalTime: this.metrics.getAverage('retrieval'),
        cacheHitRate: this.metrics.getCacheHitRate(),
        errorRate: this.metrics.getErrorRate()
      },
      lastCheck: new Date()
    };
  }

  private async getTotalMemories(): Promise<number> {
    return 0;
  }
}

interface MetricsCollector {
  recordSuccess(operation: string, duration: number): void;
  recordFailure(operation: string, error: any): void;
  getAverage(operation: string): number;
  getCacheHitRate(): number;
  getErrorRate(): number;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  metrics: {
    totalMemories: number;
    avgRetrievalTime: number;
    cacheHitRate: number;
    errorRate: number;
  };
  lastCheck: Date;
}
```

### 3. 可扩展性设计

```typescript
/**
 * 分片策略
 */

class ShardedMemorySystem {
  private shards: MemoryStore[] = [];
  private numShards: number;

  constructor(numShards: number = 10) {
    this.numShards = numShards;
    
    // 初始化分片
    for (let i = 0; i < numShards; i++) {
      this.shards.push(new MemoryStore(`shard_${i}`));
    }
  }

  /**
   * 根据用户 ID 选择分片
   */
  private selectShard(userId: string): MemoryStore {
    const hash = this.hashUserId(userId);
    const shardIndex = hash % this.numShards;
    return this.shards[shardIndex];
  }

  /**
   * 存储记忆
   */
  async store(memory: Memory): Promise<void> {
    const shard = this.selectShard(memory.userId);
    await shard.store(memory);
  }

  /**
   * 检索记忆
   */
  async retrieve(userId: string, query: string): Promise<Memory[]> {
    const shard = this.selectShard(userId);
    return await shard.search(query);
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}

class MemoryStore {
  constructor(private shardId: string) {}

  async store(memory: Memory): Promise<void> {
    // 实现存储逻辑
  }

  async search(query: string): Promise<Memory[]> {
    // 实现搜索逻辑
    return [];
  }
}
```

---

## 总结

Memory 是 AI Agents 从简单工具进化为智能协作伙伴的关键技术。通过实现多种类型的记忆系统（短期、语义、情节、过程），我们可以构建真正具有连续性、个性化和学习能力的 AI Agent。

### 核心要点

1. **Memory ≠ Context Window**：记忆提供跨会话的持久化和智能检索
2. **多层次设计**：结合不同类型的记忆以满足不同需求
3. **智能管理**：实现衰减、冲突解决和隐私保护
4. **性能优化**：使用缓存、批处理和分片提高效率
5. **可观测性**：监控系统健康和性能指标

### 技术选型建议

| 项目规模 | 推荐方案 | 技术栈 |
|---------|---------|--------|
| 小型/原型 | 简单实现 | 本地存储 + Map |
| 中型 | Mem0 开源 | Mem0 + PostgreSQL + Pinecone |
| 大型/企业 | Memori 或 Mem0 托管 | 完整栈 + 图数据库 |

### 下一步

- 探索多模态记忆（图像、音频）
- 研究联邦学习在记忆共享中的应用
- 实现更复杂的记忆整合和推理机制

通过本教程，你应该已经掌握了构建生产级 AI Agent Memory 系统的核心知识和实践技能。

---

**参考资源：**
- [Memori GitHub](https://github.com/GibsonAI/Memori)
- [Mem0 官方文档](https://mem0.ai)
- [Mem0 研究论文](https://arxiv.org/abs/2504.19413)
- [CoALA: Cognitive Architectures for Language Agents](https://arxiv.org/abs/2309.02427)
