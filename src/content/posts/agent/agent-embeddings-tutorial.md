---
title: 'Embeddings'
date: '2025-11-11'
excerpt: 'Agent 开发中的 Embeddings 完整指南'
tags: ['Agent', 'Embeddings']
series: 'Agent'
---

# Agent 开发中的 Embeddings 完整指南

## 目录

1. [Embeddings 基础概念](#embeddings-基础概念)
2. [向量数据库架构](#向量数据库架构)
3. [不同 Embeddings 模型对比](#不同-embeddings-模型对比)
4. [构建向量数据流程](#构建向量数据流程)
5. [向量搜索实现](#向量搜索实现)
6. [实践案例](#实践案例)
7. [性能优化](#性能优化)

---

## Embeddings 基础概念

### 什么是 Embeddings？

Embeddings 是将文本、图像等非结构化数据转换为高维向量的技术。在 Agent 开发中，Embeddings 主要用于：

- **语义检索**：根据语义相似度而非关键词匹配
- **知识库构建**：将文档转换为可检索的向量
- **上下文增强**：为 LLM 提供相关背景信息
- **记忆系统**：存储和检索对话历史

### 核心原理

```
文本数据 → Embedding 模型 → 向量表示 → 向量数据库 → 相似度检索
```

---

## 向量数据库架构

### 整体架构图

```mermaid
graph TB
    A[原始数据源] -->|文档/文本| B[数据预处理]
    B -->|分块| C[Chunk 管理器]
    C -->|文本块| D[Embedding 模型]
    D -->|向量| E[向量数据库]

    F[用户查询] -->|问题| D
    D -->|查询向量| G[相似度计算]
    E -->|候选向量| G
    G -->|Top-K 结果| H[重排序]
    H -->|最终结果| I[Agent/LLM]

    style D fill:#f9f,stroke:#333,stroke-width:2px
    style E fill:#bbf,stroke:#333,stroke-width:2px
    style G fill:#bfb,stroke:#333,stroke-width:2px
```

### 关键组件

| 组件               | 功能                   | 常用技术                           |
| ------------------ | ---------------------- | ---------------------------------- |
| **数据预处理**     | 清洗、分块、元数据提取 | LangChain, LlamaIndex              |
| **Embedding 模型** | 文本向量化             | OpenAI, Cohere, BGE, GTE           |
| **向量数据库**     | 存储和检索向量         | Pinecone, Chroma, Weaviate, Qdrant |
| **相似度计算**     | 计算向量距离           | Cosine, Euclidean, Dot Product     |

---

## 不同 Embeddings 模型对比

### 主流模型对比表

| 模型                               | 维度 | 多语言 | 最大长度    | 适用场景       | 调用方式 |
| ---------------------------------- | ---- | ------ | ----------- | -------------- | -------- |
| **OpenAI text-embedding-3-small**  | 1536 | ✅     | 8191 tokens | 通用、成本敏感 | API      |
| **OpenAI text-embedding-3-large**  | 3072 | ✅     | 8191 tokens | 高精度需求     | API      |
| **Cohere embed-multilingual-v3.0** | 1024 | ✅     | 512 tokens  | 多语言、分类   | API      |
| **BAAI/bge-large-zh-v1.5**         | 1024 | 🇨🇳     | 512 tokens  | 中文优化       | 本地部署 |
| **BAAI/bge-m3**                    | 1024 | ✅     | 8192 tokens | 多语言、长文本 | 本地部署 |
| **Alibaba GTE-large-zh**           | 1024 | 🇨🇳     | 512 tokens  | 中文检索       | 本地部署 |

### 模型选择流程图

```mermaid
graph TD
    A[开始选择] --> B{是否需要多语言?}
    B -->|是| C{预算如何?}
    B -->|否| D{主要语言?}

    C -->|充足| E[OpenAI text-embedding-3-large]
    C -->|有限| F[BGE-M3 本地部署]

    D -->|中文| G{是否有 GPU?}
    D -->|英文| H[OpenAI text-embedding-3-small]

    G -->|是| I[GTE-large-zh / BGE-large-zh]
    G -->|否| J[OpenAI API]

    style E fill:#90EE90
    style F fill:#87CEEB
    style I fill:#FFB6C1
    style H fill:#90EE90
```

---

## 构建向量数据流程

### 完整流程图

```mermaid
sequenceDiagram
    participant D as 数据源
    participant P as 预处理器
    participant C as 分块器
    participant E as Embedding 模型
    participant V as 向量数据库

    D->>P: 原始文档
    P->>P: 清洗、格式化
    P->>C: 处理后文本
    C->>C: 分块 (Chunk)
    C->>E: 文本块数组

    loop 每个文本块
        E->>E: 生成向量
        E->>V: 存储向量 + 元数据
    end

    V-->>D: 构建完成
```

### 代码示例：数据处理与向量化

```typescript
import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddings } from '@langchain/openai';

// 1. 文档分块策略
interface ChunkConfig {
  chunkSize: number;
  chunkOverlap: number;
  separators: string[];
}

function chunkDocument(text: string, config: ChunkConfig): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + config.chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += config.chunkSize - config.chunkOverlap;
  }

  return chunks;
}

// 2. 向量化与存储
async function buildVectorStore(
  documents: Array<{
    content: string;
    metadata: Record<string, any>;
  }>,
) {
  const client = new ChromaClient();
  const collection = await client.createCollection({
    name: 'knowledge_base',
    metadata: { 'hnsw:space': 'cosine' },
  });

  const embeddings = new OpenAIEmbeddings({
    modelName: 'text-embedding-3-small',
  });

  for (const doc of documents) {
    // 分块
    const chunks = chunkDocument(doc.content, {
      chunkSize: 512,
      chunkOverlap: 50,
      separators: ['\n\n', '\n', '。', '！', '？'],
    });

    // 批量向量化
    const vectors = await embeddings.embedDocuments(chunks);

    // 存储到向量数据库
    await collection.add({
      ids: chunks.map((_, i) => `${doc.metadata.id}_${i}`),
      embeddings: vectors,
      documents: chunks,
      metadatas: chunks.map(() => doc.metadata),
    });
  }
}
```

### 分块策略对比

```mermaid
graph LR
    A[文档] --> B[固定长度分块]
    A --> C[语义分块]
    A --> D[结构化分块]

    B --> B1[简单快速<br/>可能割裂语义]
    C --> C1[保持语义完整<br/>计算成本高]
    D --> D1[按章节/段落<br/>适合结构化文档]

    style B1 fill:#FFE4B5
    style C1 fill:#98FB98
    style D1 fill:#87CEEB
```

---

## 向量搜索实现

### 搜索流程架构

```mermaid
graph TB
    A[用户查询] --> B[查询预处理]
    B --> C[生成查询向量]
    C --> D{选择检索策略}

    D -->|基础| E[余弦相似度检索]
    D -->|高级| F[混合检索]
    D -->|精准| G[多阶段检索]

    E --> H[Top-K 结果]
    F --> I[BM25 + 向量]
    G --> J[粗排 → 精排]

    H --> K[结果后处理]
    I --> K
    J --> K

    K --> L[返回最终结果]

    style C fill:#FFB6C1
    style F fill:#90EE90
    style G fill:#87CEEB
```

### 代码示例：多种检索策略

```typescript
// 1. 基础向量检索
async function basicVectorSearch(query: string, topK: number = 5) {
  const collection = await client.getCollection({ name: 'knowledge_base' });
  const queryVector = await embeddings.embedQuery(query);

  const results = await collection.query({
    queryEmbeddings: [queryVector],
    nResults: topK,
  });

  return results;
}

// 2. 混合检索 (向量 + 关键词)
async function hybridSearch(query: string, topK: number = 5) {
  // 向量检索
  const vectorResults = await basicVectorSearch(query, topK * 2);

  // BM25 关键词检索 (简化示例)
  const keywordResults = await keywordSearch(query, topK * 2);

  // 融合排序 (RRF - Reciprocal Rank Fusion)
  const merged = mergeResults(vectorResults, keywordResults, topK);

  return merged;
}

// 3. 带过滤的检索
async function filteredSearch(query: string, filters: Record<string, any>, topK: number = 5) {
  const queryVector = await embeddings.embedQuery(query);

  const results = await collection.query({
    queryEmbeddings: [queryVector],
    nResults: topK,
    where: filters, // 例如: { category: "technical", date: { $gte: "2024-01-01" } }
  });

  return results;
}
```

### 相似度计算方法

| 方法           | 公式                        | 取值范围 | 适用场景               |
| -------------- | --------------------------- | -------- | ---------------------- |
| **余弦相似度** | cos(θ) = A·B / (\|A\|\|B\|) | [-1, 1]  | 通用、不受向量长度影响 |
| **欧氏距离**   | √Σ(ai - bi)²                | [0, ∞)   | 关注绝对差异           |
| **点积**       | Σ(ai × bi)                  | (-∞, ∞)  | 归一化向量时等同余弦   |

---

## 实践案例

### 案例：构建智能文档问答系统

```typescript
class DocumentQASystem {
  private vectorStore: ChromaClient;
  private embeddings: OpenAIEmbeddings;
  private llm: ChatOpenAI;

  async initialize() {
    // 1. 加载文档
    const docs = await this.loadDocuments('./knowledge_base');

    // 2. 构建向量库
    await this.buildVectorStore(docs);

    console.log('✅ 向量库构建完成');
  }

  async query(question: string): Promise<string> {
    // 1. 检索相关文档
    const relevantDocs = await this.hybridSearch(question, 3);

    // 2. 构建上下文
    const context = relevantDocs.map((doc) => doc.content).join('\n\n');

    // 3. 生成回答
    const prompt = `基于以下上下文回答问题：
    
上下文：
${context}

问题：${question}

回答：`;

    const response = await this.llm.invoke(prompt);
    return response.content;
  }
}
```

### RAG 工作流程

```mermaid
sequenceDiagram
    participant U as 用户
    participant A as Agent
    participant V as 向量数据库
    participant L as LLM

    U->>A: 提出问题
    A->>A: 分析查询意图
    A->>V: 向量检索
    V-->>A: 返回相关文档
    A->>A: 重排序 & 过滤
    A->>L: 问题 + 上下文
    L-->>A: 生成回答
    A->>A: 后处理 & 引用
    A-->>U: 返回答案
```

---

## 性能优化

### 优化策略图

```mermaid
mindmap
  root((性能优化))
    索引优化
      HNSW 索引
      IVF 索引
      量化压缩
    检索优化
      批量查询
      缓存热点
      预过滤
    存储优化
      向量压缩
      分片存储
      冷热分离
    成本优化
      本地部署
      维度降低
      批量处理
```

### 关键优化技术

#### 1. 向量维度优化

```typescript
// OpenAI 支持维度裁剪
const embeddings = new OpenAIEmbeddings({
  modelName: 'text-embedding-3-large',
  dimensions: 1024, // 原始 3072 → 裁剪至 1024
});
```

#### 2. 批量处理

```typescript
// 批量向量化提升吞吐量
async function batchEmbedding(texts: string[], batchSize: number = 100) {
  const results = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const vectors = await embeddings.embedDocuments(batch);
    results.push(...vectors);
  }

  return results;
}
```

#### 3. 缓存策略

```typescript
class CachedEmbeddings {
  private cache = new Map<string, number[]>();

  async embed(text: string): Promise<number[]> {
    const cacheKey = hashString(text);

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const vector = await this.embeddings.embedQuery(text);
    this.cache.set(cacheKey, vector);
    return vector;
  }
}
```

### 性能基准参考

| 操作           | QPS     | 延迟 (P95) | 优化建议 |
| -------------- | ------- | ---------- | -------- |
| **单次向量化** | 100-500 | 50-200ms   | 批量处理 |
| **向量检索**   | 1000+   | 10-50ms    | 索引优化 |
| **混合检索**   | 200-500 | 50-150ms   | 并行执行 |

---

## 最佳实践总结

### ✅ 推荐做法

1. **分块策略**：512-1024 tokens，重叠 10-20%
2. **元数据设计**：包含来源、时间、分类等可过滤字段
3. **多阶段检索**：粗排（Top-100）→ 精排（Top-5）
4. **监控指标**：检索延迟、召回率、相关性评分

### ❌ 常见陷阱

1. 分块过大导致语义分散
2. 忽略元数据过滤造成性能浪费
3. 单一检索策略召回率低
4. 未设置缓存导致重复计算

### 🔧 调试技巧

```typescript
// 评估检索质量
async function evaluateRetrieval(query: string, expectedDocs: string[]) {
  const results = await vectorSearch(query, 10);
  const resultIds = results.map((r) => r.id);

  // 计算召回率
  const recall = expectedDocs.filter((id) => resultIds.includes(id)).length / expectedDocs.length;

  console.log(`召回率: ${(recall * 100).toFixed(2)}%`);

  // 检查排序质量
  const mrr = calculateMRR(resultIds, expectedDocs);
  console.log(`MRR: ${mrr.toFixed(3)}`);
}
```

---

## 参考资源

- **OpenAI Embeddings Guide**: https://platform.openai.com/docs/guides/embeddings
- **Chroma Documentation**: https://docs.trychroma.com/
- **LangChain Vector Stores**: https://js.langchain.com/docs/modules/data_connection/vectorstores/
- **MTEB Leaderboard**: https://huggingface.co/spaces/mteb/leaderboard

---

## 总结

Embeddings 是构建智能 Agent 的核心技术。选择合适的模型、设计合理的分块策略、实现高效的检索机制，能够显著提升 Agent 的知识理解和问答能力。

**关键要点**：

- 根据业务需求选择 Embedding 模型
- 实现多阶段检索提升准确率
- 利用元数据过滤优化性能
- 持续监控和优化检索质量
