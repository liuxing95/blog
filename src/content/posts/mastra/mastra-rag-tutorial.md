---
title: 'Mastra.ai RAG'
date: '2025-11-13'
excerpt: 'Mastra.ai RAG 完整实现教程'
tags: ['Agent', 'Mastra']
series: 'Agent'
---

# Mastra.ai RAG 完整实现教程

## 📋 目录

1. [RAG 概述](#rag-概述)
2. [核心概念](#核心概念)
3. [架构设计](#架构设计)
4. [环境准备](#环境准备)
5. [文档处理与分块](#文档处理与分块)
6. [向量生成流程](#向量生成流程)
7. [向量存储](#向量存储)
8. [向量检索](#向量检索)
9. [完整 RAG 流程](#完整-rag-流程)
10. [高级功能](#高级功能)
11. [底层实现解析](#底层实现解析)
12. [架构图与流程图](#架构图与流程图)
13. [最佳实践](#最佳实践)

---

## RAG 概述

### 什么是 RAG?

**RAG (Retrieval-Augmented Generation)** 是一种增强 LLM 输出质量的技术,通过从自有数据源检索相关上下文,使 AI 回答更准确、更贴近实际信息。

### Mastra.ai 的 RAG 能力

Mastra.ai 提供了完整的 RAG 工具链:

- ✅ **文档处理** - 支持 Text、HTML、Markdown、JSON、LaTeX
- ✅ **智能分块** - 递归分块、滑动窗口、语义分块
- ✅ **向量生成** - 集成多种 Embedding 模型
- ✅ **多种向量数据库** - PgVector、Pinecone、Qdrant、Chroma 等
- ✅ **高级检索** - 语义搜索、元数据过滤、重排序
- ✅ **Graph RAG** - 基于知识图谱的检索

---

## 核心概念

### RAG 工作流程

```
┌──────────────┐
│   文档输入    │
└──────┬───────┘
       ↓
┌──────────────┐
│  文档分块     │ ← MDocument.chunk()
└──────┬───────┘
       ↓
┌──────────────┐
│  生成向量     │ ← embedMany()
└──────┬───────┘
       ↓
┌──────────────┐
│  存储向量     │ ← VectorStore.upsert()
└──────┬───────┘
       ↓
┌──────────────┐
│  用户查询     │
└──────┬───────┘
       ↓
┌──────────────┐
│  查询向量化   │ ← embed(query)
└──────┬───────┘
       ↓
┌──────────────┐
│  相似度搜索   │ ← VectorStore.query()
└──────┬───────┘
       ↓
┌──────────────┐
│  检索上下文   │
└──────┬───────┘
       ↓
┌──────────────┐
│  LLM 生成答案 │ ← Agent.generate()
└──────────────┘
```

### 核心组件

| 组件                      | 作用             | 包                                  |
| ------------------------- | ---------------- | ----------------------------------- |
| **MDocument**             | 文档处理和分块   | `@mastra/rag`                       |
| **embedMany**             | 批量生成向量     | `ai` (Vercel AI SDK)                |
| **VectorStore**           | 向量存储和检索   | `@mastra/pg`, `@mastra/pinecone` 等 |
| **createVectorQueryTool** | 创建向量查询工具 | `@mastra/rag`                       |
| **Agent**                 | LLM Agent        | `@mastra/core/agent`                |
| **GraphRAG**              | 图检索增强       | `@mastra/rag`                       |

---

## 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                       应用层                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Mastra Agent                           │    │
│  │  • instructions                                     │    │
│  │  • model (gpt-4o-mini)                             │    │
│  │  • tools (vectorQueryTool)                         │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                     RAG 处理层                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Document Processing                         │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │   │
│  │  │  MDocument │→ │   Chunk    │→ │  Metadata  │     │   │
│  │  │  (Text/    │  │ (Recursive)│  │ Extraction │     │   │
│  │  │  HTML/MD)  │  └────────────┘  └────────────┘     │   │
│  │  └────────────┘                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Embedding Generation                        │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │   │
│  │  │  embedMany │→ │  OpenAI    │→ │  Vectors   │     │   │
│  │  │  (AI SDK)  │  │ Embedding  │  │ (1536-dim) │     │   │
│  │  └────────────┘  │   Model    │  └────────────┘     │   │
│  │                  └────────────┘                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Vector Storage & Retrieval                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │   │
│  │  │   Upsert   │  │  Cosine    │  │  Rerank    │     │   │
│  │  │  Vectors   │→ │ Similarity │→ │  Results   │     │   │
│  │  └────────────┘  │   Search   │  └────────────┘     │   │
│  │                  └────────────┘                      │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   向量数据库层                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ PgVector │  │ Pinecone │  │  Qdrant  │  │  Chroma  │   │
│  │(Postgres)│  │ (Managed)│  │ (OSS/SaaS)│  │  (OSS)   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Astra   │  │  LibSQL  │  │ Upstash  │  │ MongoDB  │   │
│  │(Cassandra)│  │ (SQLite) │  │  Redis   │  │  Atlas   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 类图

```
┌─────────────────────────────────────┐
│          MDocument                  │
├─────────────────────────────────────┤
│ - content: string                   │
│ - type: 'text' | 'html' | ...      │
│ - metadata: Record<string, any>     │
├─────────────────────────────────────┤
│ + fromText(text): MDocument         │
│ + fromHTML(html): MDocument         │
│ + fromMarkdown(md): MDocument       │
│ + chunk(options): Promise<Chunk[]>  │
│ + extractMetadata(): Promise<void>  │
│ + getDocs(): DocumentChunk[]        │
│ + getText(): string[]               │
│ + getMetadata(): Record[]           │
└─────────────────────────────────────┘
           ↓ uses
┌─────────────────────────────────────┐
│      ChunkingStrategy               │
├─────────────────────────────────────┤
│ + recursive                         │
│ + sliding                           │
│ + markdown                          │
│ + semantic                          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       VectorStore (Interface)       │
├─────────────────────────────────────┤
│ + createIndex(options)              │
│ + upsert(vectors, metadata)         │
│ + query(vector, options)            │
│ + delete(ids)                       │
│ + listIndexes()                     │
└─────────────────────────────────────┘
           ↑ implements
    ┌──────┴──────┐
    │             │
┌───┴───────┐ ┌──┴──────────┐
│ PgVector  │ │ Pinecone    │
│           │ │ Vector      │
└───────────┘ └─────────────┘

┌─────────────────────────────────────┐
│        GraphRAG                     │
├─────────────────────────────────────┤
│ - dimension: number                 │
│ - threshold: number                 │
│ - graph: Map<Node, Edge[]>          │
├─────────────────────────────────────┤
│ + createGraph(chunks, embeddings)   │
│ + query(options): QueryResult[]     │
│ - randomWalk(node, steps)           │
│ - calculateSimilarity(a, b)         │
└─────────────────────────────────────┘
```

---

## 环境准备

### 1. 安装依赖

```bash
# 创建项目
npm create mastra@latest my-rag-app
cd my-rag-app

# 安装 RAG 相关包
npm install @mastra/rag @mastra/pg
# 或者使用其他向量数据库
# npm install @mastra/pinecone
# npm install @mastra/qdrant

# 安装 AI SDK
npm install ai @ai-sdk/openai

# 安装 PostgreSQL 驱动 (如果使用 PgVector)
npm install pg
```

### 2. 配置环境变量

```bash
# .env
# OpenAI API Key (用于 Embedding 和 LLM)
OPENAI_API_KEY=sk-xxx

# PostgreSQL (如果使用 PgVector)
POSTGRES_CONNECTION_STRING=postgresql://user:password@localhost:5432/dbname

# 或者 Pinecone (如果使用 Pinecone)
PINECONE_API_KEY=xxx
PINECONE_ENVIRONMENT=xxx
```

### 3. 设置 PostgreSQL + pgvector

```sql
-- 连接到 PostgreSQL
psql -U postgres

-- 创建数据库
CREATE DATABASE rag_demo;

-- 连接到数据库
\c rag_demo;

-- 启用 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- PgVector 类会自动创建表,但你也可以手动创建
CREATE TABLE IF NOT EXISTS embeddings (
  id TEXT PRIMARY KEY,
  embedding VECTOR(1536),
  metadata JSONB
);

-- 创建索引以加速查询
CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

### 4. 项目结构

```
my-rag-app/
├── src/
│   ├── mastra/
│   │   ├── agents/
│   │   │   └── rag-agent.ts
│   │   ├── tools/
│   │   │   └── vector-query-tool.ts
│   │   └── index.ts
│   ├── rag/
│   │   ├── document-processor.ts
│   │   ├── embedding-generator.ts
│   │   ├── vector-store.ts
│   │   └── retriever.ts
│   └── index.ts
├── .env
├── package.json
└── tsconfig.json
```

---

## 文档处理与分块

### MDocument 类详解

`MDocument` 是 Mastra 的核心文档处理类,支持多种文档格式。

#### 创建文档

```typescript
// src/rag/document-processor.ts
import { MDocument } from '@mastra/rag';

/**
 * 从不同来源创建文档
 */
export class DocumentProcessor {
  /**
   * 从纯文本创建
   */
  static fromText(text: string, metadata?: Record<string, any>): MDocument {
    return MDocument.fromText(text, metadata);
  }

  /**
   * 从 HTML 创建
   */
  static fromHTML(html: string, metadata?: Record<string, any>): MDocument {
    return MDocument.fromHTML(html, metadata);
  }

  /**
   * 从 Markdown 创建
   */
  static fromMarkdown(markdown: string, metadata?: Record<string, any>): MDocument {
    return MDocument.fromMarkdown(markdown, metadata);
  }

  /**
   * 从 JSON 创建
   */
  static fromJSON(json: string, metadata?: Record<string, any>): MDocument {
    return MDocument.fromJSON(json, metadata);
  }
}
```

#### 分块策略

Mastra 提供多种分块策略:

| 策略          | 描述                      | 适用场景           |
| ------------- | ------------------------- | ------------------ |
| **recursive** | 递归分割,按分隔符层次分割 | 通用文本           |
| **sliding**   | 滑动窗口,保持上下文连贯性 | 需要上下文的长文本 |
| **markdown**  | 按 Markdown 标题结构分割  | 技术文档、博客     |
| **semantic**  | 基于语义相似度分割        | 需要语义完整性     |

#### 分块实现

```typescript
// src/rag/document-processor.ts (续)
export interface ChunkOptions {
  strategy: 'recursive' | 'sliding' | 'markdown' | 'semantic';
  size: number; // 块大小(字符数)
  overlap: number; // 重叠字符数
  separator?: string; // 分隔符
}

export interface DocumentChunk {
  text: string;
  metadata: Record<string, any>;
}

export class DocumentProcessor {
  /**
   * 递归分块
   */
  static async chunkRecursive(doc: MDocument, options: ChunkOptions): Promise<DocumentChunk[]> {
    const chunks = await doc.chunk({
      strategy: 'recursive',
      size: options.size,
      overlap: options.overlap,
      separator: options.separator || '\n\n',
    });

    return chunks;
  }

  /**
   * Markdown 分块(按标题层级)
   */
  static async chunkMarkdown(
    doc: MDocument,
    headers: [string, string][] = [
      ['#', 'title'],
      ['##', 'section'],
      ['###', 'subsection'],
    ],
  ): Promise<DocumentChunk[]> {
    const chunks = await doc.chunk({
      strategy: 'markdown',
      headers,
      size: 512,
      overlap: 50,
    });

    return chunks;
  }

  /**
   * 带元数据提取的分块
   */
  static async chunkWithMetadata(doc: MDocument, options: ChunkOptions): Promise<DocumentChunk[]> {
    const chunks = await doc.chunk({
      ...options,
      extract: {
        summary: true, // 提取摘要
        keywords: true, // 提取关键词
      },
    });

    return chunks;
  }
}

// 使用示例
const doc = MDocument.fromText(`
  Mastra is a TypeScript framework for building AI agents.
  It supports RAG, workflows, and integrations.
  
  Key Features:
  - Multi-model support (OpenAI, Anthropic, etc.)
  - Built-in RAG capabilities
  - Graph-based workflows
`);

const chunks = await DocumentProcessor.chunkRecursive(doc, {
  strategy: 'recursive',
  size: 512,
  overlap: 50,
  separator: '\n\n',
});

console.log(`Created ${chunks.length} chunks`);
```

---

## 向量生成流程

### Embedding 模型

Mastra 使用 Vercel AI SDK 的 `embedMany` 函数生成向量,支持多种模型:

| 提供商    | 模型                   | 维度 | 价格            |
| --------- | ---------------------- | ---- | --------------- |
| OpenAI    | text-embedding-3-small | 1536 | $0.02/1M tokens |
| OpenAI    | text-embedding-3-large | 3072 | $0.13/1M tokens |
| Cohere    | embed-english-v3.0     | 1024 | $0.10/1M tokens |
| Voyage AI | voyage-2               | 1024 | $0.12/1M tokens |

### 生成向量实现

```typescript
// src/rag/embedding-generator.ts
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { cohere } from '@ai-sdk/cohere';

export interface EmbeddingOptions {
  provider: 'openai' | 'cohere';
  model?: string;
  maxRetries?: number;
}

export class EmbeddingGenerator {
  /**
   * 批量生成向量
   */
  static async generateEmbeddings(
    texts: string[],
    options: EmbeddingOptions = { provider: 'openai' },
  ): Promise<number[][]> {
    const provider = options.provider === 'cohere' ? cohere : openai;
    const model =
      options.model ||
      (options.provider === 'cohere' ? 'embed-english-v3.0' : 'text-embedding-3-small');

    try {
      const { embeddings } = await embedMany({
        values: texts,
        model: provider.embedding(model),
        maxRetries: options.maxRetries || 3,
      });

      console.log(`✅ Generated ${embeddings.length} embeddings`);
      return embeddings;
    } catch (error) {
      console.error('❌ Failed to generate embeddings:', error);
      throw error;
    }
  }

  /**
   * 生成单个向量
   */
  static async generateSingleEmbedding(
    text: string,
    options: EmbeddingOptions = { provider: 'openai' },
  ): Promise<number[]> {
    const embeddings = await this.generateEmbeddings([text], options);
    return embeddings[0];
  }

  /**
   * 批处理大量文本(分批处理)
   */
  static async generateEmbeddingsBatch(
    texts: string[],
    batchSize: number = 100,
    options: EmbeddingOptions = { provider: 'openai' },
  ): Promise<number[][]> {
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1}/${Math.ceil(texts.length / batchSize)}`);

      const embeddings = await this.generateEmbeddings(batch, options);
      allEmbeddings.push(...embeddings);

      // 避免速率限制
      if (i + batchSize < texts.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return allEmbeddings;
  }
}

// 使用示例
const chunks = [
  { text: 'Mastra is a TypeScript framework...' },
  { text: 'It supports RAG and workflows...' },
];

const embeddings = await EmbeddingGenerator.generateEmbeddings(
  chunks.map((c) => c.text),
  { provider: 'openai', model: 'text-embedding-3-small' },
);

console.log(`Embedding dimension: ${embeddings[0].length}`); // 1536
```

### 向量生成流程图

```
┌─────────────────────────────────────────┐
│        Input: Text Chunks               │
│  ["chunk1", "chunk2", "chunk3", ...]    │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Preprocessing (Optional)           │
│  • Clean text (remove special chars)    │
│  • Normalize whitespace                 │
│  • Truncate to max length               │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         Batch Processing                │
│  Split into batches (e.g., 100 texts)   │
└──────────────────┬──────────────────────┘
                   ↓
          ┌────────┴────────┐
          │  For each batch  │
          └────────┬─────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Call Embedding API                 │
│  • embedMany({ values, model })         │
│  • Provider: OpenAI/Cohere/etc          │
│  • Model: text-embedding-3-small        │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│       API Processing                    │
│  • Tokenize text                        │
│  • Pass through transformer model       │
│  • Extract embeddings from last layer   │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│     Return Embeddings                   │
│  {                                      │
│    embeddings: number[][],              │
│    usage: { tokens: 1234 }              │
│  }                                      │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│    Post-processing (Optional)           │
│  • Normalize vectors (L2 norm)          │
│  • Dimension reduction (PCA/UMAP)       │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│     Output: Vector Embeddings           │
│  [                                      │
│    [0.12, 0.45, ..., 0.89],  // 1536-d  │
│    [0.34, 0.67, ..., 0.23],             │
│    ...                                  │
│  ]                                      │
└─────────────────────────────────────────┘
```

---

## 向量存储

### 支持的向量数据库

| 数据库       | 包                 | 类型            | 特点               |
| ------------ | ------------------ | --------------- | ------------------ |
| **PgVector** | `@mastra/pg`       | PostgreSQL 扩展 | 易于集成现有 PG    |
| **Pinecone** | `@mastra/pinecone` | 托管服务        | 高性能、易扩展     |
| **Qdrant**   | `@mastra/qdrant`   | 开源/托管       | 高级过滤、混合搜索 |
| **Chroma**   | `@mastra/chroma`   | 开源            | 易于本地部署       |
| **Astra**    | `@mastra/astra`    | Cassandra       | 分布式、高可用     |
| **LibSQL**   | `@mastra/libsql`   | SQLite 扩展     | 轻量级、本地       |
| **Upstash**  | `@mastra/upstash`  | Redis 向量      | Serverless         |

### PgVector 实现

```typescript
// src/rag/vector-store.ts
import { PgVector } from '@mastra/pg';
import { DocumentChunk } from './document-processor';

export interface UpsertOptions {
  indexName: string;
  vectors: number[][];
  metadata: Record<string, any>[];
}

export interface QueryOptions {
  indexName: string;
  vector: number[];
  topK: number;
  filter?: Record<string, any>;
  includeMetadata?: boolean;
}

export interface QueryResult {
  id: string;
  score: number;
  metadata: Record<string, any>;
  vector?: number[];
}

export class VectorStore {
  private pgVector: PgVector;

  constructor(connectionString: string) {
    this.pgVector = new PgVector({
      connectionString,
    });
  }

  /**
   * 创建索引
   */
  async createIndex(indexName: string, dimension: number = 1536): Promise<void> {
    await this.pgVector.createIndex({
      indexName,
      dimension,
    });

    console.log(`✅ Created index: ${indexName} (${dimension}-d)`);
  }

  /**
   * 插入或更新向量
   */
  async upsert(options: UpsertOptions): Promise<void> {
    const { indexName, vectors, metadata } = options;

    if (vectors.length !== metadata.length) {
      throw new Error('Vectors and metadata must have same length');
    }

    await this.pgVector.upsert({
      indexName,
      vectors,
      metadata,
    });

    console.log(`✅ Upserted ${vectors.length} vectors to ${indexName}`);
  }

  /**
   * 查询相似向量
   */
  async query(options: QueryOptions): Promise<QueryResult[]> {
    const { indexName, vector, topK, filter, includeMetadata = true } = options;

    const results = await this.pgVector.query({
      indexName,
      queryVector: vector,
      topK,
      filter,
      includeMetadata,
    });

    return results.map((result) => ({
      id: result.id,
      score: result.score,
      metadata: result.metadata,
      vector: result.vector,
    }));
  }

  /**
   * 删除向量
   */
  async delete(indexName: string, ids: string[]): Promise<void> {
    await this.pgVector.delete({
      indexName,
      ids,
    });

    console.log(`✅ Deleted ${ids.length} vectors from ${indexName}`);
  }

  /**
   * 列出所有索引
   */
  async listIndexes(): Promise<string[]> {
    const indexes = await this.pgVector.listIndexes();
    return indexes;
  }
}

// 使用示例
const vectorStore = new VectorStore(process.env.POSTGRES_CONNECTION_STRING!);

// 创建索引
await vectorStore.createIndex('my_docs', 1536);

// 插入向量
await vectorStore.upsert({
  indexName: 'my_docs',
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({
    text: chunk.text,
    source: 'documentation',
    createdAt: new Date().toISOString(),
  })),
});
```

### Pinecone 实现

```typescript
// src/rag/vector-store-pinecone.ts
import { PineconeVector } from '@mastra/pinecone';

export class PineconeVectorStore {
  private pinecone: PineconeVector;

  constructor(apiKey: string) {
    this.pinecone = new PineconeVector({
      apiKey,
    });
  }

  async createIndex(indexName: string, dimension: number = 1536): Promise<void> {
    await this.pinecone.createIndex({
      indexName,
      dimension,
      metric: 'cosine', // 或 'euclidean', 'dotproduct'
    });

    console.log(`✅ Created Pinecone index: ${indexName}`);
  }

  async upsert(
    indexName: string,
    vectors: number[][],
    metadata: Record<string, any>[],
  ): Promise<void> {
    await this.pinecone.upsert({
      indexName,
      vectors,
      metadata,
      namespace: 'default', // 可选命名空间
    });

    console.log(`✅ Upserted ${vectors.length} vectors to Pinecone`);
  }

  async query(
    indexName: string,
    vector: number[],
    topK: number,
    filter?: Record<string, any>,
  ): Promise<QueryResult[]> {
    const results = await this.pinecone.query({
      indexName,
      queryVector: vector,
      topK,
      filter,
      includeMetadata: true,
      namespace: 'default',
    });

    return results;
  }
}
```

### 向量存储流程

```
┌─────────────────────────────────────────┐
│   Input: Embeddings + Metadata         │
│  embeddings: [[0.1, 0.2, ...], ...]     │
│  metadata: [{text: "...", ...}, ...]    │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Validate Input                     │
│  • Check dimension consistency          │
│  • Verify embeddings.length == meta.len │
│  • Validate metadata schema             │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Generate IDs (if not provided)     │
│  • UUID or hash-based IDs               │
│  • Ensure uniqueness                    │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Prepare Batch Insert               │
│  • Chunk into batches (e.g., 100)       │
│  • Format for database                  │
└──────────────────┬──────────────────────┘
                   ↓
          ┌────────┴────────┐
          │  Database Type?  │
          └────────┬─────────┘
                   │
      ┌────────────┴────────────┐
      ↓                         ↓
┌──────────────┐          ┌──────────────┐
│   PgVector   │          │   Pinecone   │
└──────┬───────┘          └──────┬───────┘
       ↓                         ↓
┌──────────────┐          ┌──────────────┐
│ INSERT INTO  │          │  HTTP POST   │
│ embeddings   │          │  /vectors/   │
│ VALUES(...)  │          │  upsert      │
└──────┬───────┘          └──────┬───────┘
       │                         │
       └──────────┬──────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Create/Update Index                │
│  • IVFFlat (PgVector)                   │
│  • HNSW (Pinecone)                      │
│  • Optimize for similarity search       │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Verify Storage                     │
│  • Count records                        │
│  • Check index statistics               │
│  • Return success status                │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│   Output: Storage Confirmation          │
│  ✅ Stored N vectors in index           │
└─────────────────────────────────────────┘
```

---

## 向量检索

### 检索策略

Mastra 支持多种检索策略:

1. **语义搜索** - 基于余弦相似度
2. **元数据过滤** - 按属性筛选
3. **混合搜索** - 结合向量和关键词
4. **重排序** - 使用 Reranking 模型优化结果

### 基础检索实现

```typescript
// src/rag/retriever.ts
import { VectorStore, QueryResult } from './vector-store';
import { EmbeddingGenerator } from './embedding-generator';

export interface RetrievalOptions {
  indexName: string;
  query: string;
  topK: number;
  filter?: Record<string, any>;
  rerank?: boolean;
}

export interface RetrievedContext {
  text: string;
  score: number;
  metadata: Record<string, any>;
}

export class Retriever {
  constructor(private vectorStore: VectorStore, private embeddingGenerator: EmbeddingGenerator) {}

  /**
   * 检索相关上下文
   */
  async retrieve(options: RetrievalOptions): Promise<RetrievedContext[]> {
    const { indexName, query, topK, filter } = options;

    // 1. 将查询转换为向量
    console.log('🔍 Generating query embedding...');
    const queryEmbedding = await this.embeddingGenerator.generateSingleEmbedding(query, {
      provider: 'openai',
    });

    // 2. 查询向量数据库
    console.log('📊 Querying vector store...');
    const results = await this.vectorStore.query({
      indexName,
      vector: queryEmbedding,
      topK,
      filter,
      includeMetadata: true,
    });

    // 3. 格式化结果
    const contexts: RetrievedContext[] = results.map((result) => ({
      text: result.metadata.text,
      score: result.score,
      metadata: result.metadata,
    }));

    // 4. 可选:重排序
    if (options.rerank) {
      return await this.rerank(query, contexts);
    }

    return contexts;
  }

  /**
   * 重排序结果
   */
  private async rerank(query: string, contexts: RetrievedContext[]): Promise<RetrievedContext[]> {
    // TODO: 实现重排序逻辑(使用 Cohere Rerank API 等)
    return contexts;
  }
}
```

### 元数据过滤

```typescript
// src/rag/retriever.ts (续)
export class Retriever {
  /**
   * 带元数据过滤的检索
   */
  async retrieveWithFilter(
    query: string,
    filter: Record<string, any>,
    topK: number = 5,
  ): Promise<RetrievedContext[]> {
    // MongoDB 风格的过滤语法
    const results = await this.retrieve({
      indexName: 'my_docs',
      query,
      topK,
      filter: {
        // 等值匹配
        source: 'documentation',

        // 范围查询
        createdAt: {
          $gte: '2024-01-01',
          $lt: '2025-01-01',
        },

        // 数组包含
        tags: { $in: ['typescript', 'rag'] },

        // 逻辑运算
        $and: [{ category: 'tutorial' }, { difficulty: { $lte: 3 } }],
      },
    });

    return results;
  }
}

// 使用示例
const retriever = new Retriever(vectorStore, EmbeddingGenerator);

// 基础检索
const contexts = await retriever.retrieve({
  indexName: 'my_docs',
  query: 'How to use RAG in Mastra?',
  topK: 5,
});

// 带过滤的检索
const filteredContexts = await retriever.retrieveWithFilter(
  'How to use RAG in Mastra?',
  {
    source: 'documentation',
    tags: { $in: ['rag', 'typescript'] },
  },
  5,
);
```

### 向量检索流程

```
┌─────────────────────────────────────────┐
│        Input: User Query                │
│  "How does RAG work in Mastra?"         │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Query Preprocessing                │
│  • Clean and normalize text             │
│  • Extract keywords (optional)          │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Generate Query Embedding           │
│  queryVector = embed(query)             │
│  → [0.23, 0.45, ..., 0.89] (1536-d)     │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Apply Metadata Filters (Optional)  │
│  filter = {                             │
│    source: "docs",                      │
│    createdAt: { $gte: "2024-01-01" }    │
│  }                                      │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Vector Similarity Search           │
│  ┌──────────────────────────────────┐   │
│  │  Calculate Cosine Similarity     │   │
│  │  cosine(queryVector, docVector)  │   │
│  │                                  │   │
│  │  similarity = dot(A,B)/(||A||*||B||) │
│  └──────────────────────────────────┘   │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Rank by Similarity Score           │
│  • Sort results by score (desc)         │
│  • Select top K results                 │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Post-processing (Optional)         │
│  ┌──────────────────────────────────┐   │
│  │  Reranking (Cohere/etc)          │   │
│  │  • Cross-encoder scoring         │   │
│  │  • Re-sort by rerank scores      │   │
│  └──────────────────────────────────┘   │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│      Format Retrieved Contexts          │
│  [                                      │
│    {                                    │
│      text: "Mastra RAG allows...",      │
│      score: 0.89,                       │
│      metadata: {...}                    │
│    },                                   │
│    ...                                  │
│  ]                                      │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│   Output: Top K Relevant Contexts       │
│  Ready to pass to LLM for generation    │
└─────────────────────────────────────────┘
```

---

## 完整 RAG 流程

### 创建 RAG Agent

```typescript
// src/mastra/agents/rag-agent.ts
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { createVectorQueryTool } from '@mastra/rag';
import { PgVector } from '@mastra/pg';
import { Mastra } from '@mastra/core';

// 1. 创建向量查询工具
const vectorQueryTool = createVectorQueryTool({
  vectorStoreName: 'pgVector',
  indexName: 'embeddings',
  model: openai.embedding('text-embedding-3-small'),
  topK: 5,
});

// 2. 创建 RAG Agent
export const ragAgent = new Agent({
  name: 'RAG Assistant',
  instructions: `You are a helpful assistant that answers questions based on the provided context.

Rules:
1. ONLY use information from the context provided by the vector query tool
2. If the context doesn't contain enough information, say so explicitly
3. Keep answers concise and relevant
4. Cite specific parts of the context when possible
5. If asked about something not in the context, politely decline`,

  model: openai('gpt-4o-mini'),

  tools: {
    vectorQueryTool,
  },
});

// 3. 配置 Mastra
const pgVector = new PgVector({
  connectionString: process.env.POSTGRES_CONNECTION_STRING!,
});

export const mastra = new Mastra({
  agents: { ragAgent },
  vectors: { pgVector },
});
```

### 文档摄入流程

```typescript
// src/rag/ingestion.ts
import { MDocument } from '@mastra/rag';
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { VectorStore } from './vector-store';

export async function ingestDocument(content: string, metadata: Record<string, any>) {
  console.log('📄 Starting document ingestion...');

  // 1. 创建文档
  const doc = MDocument.fromText(content, metadata);

  // 2. 分块
  console.log('✂️ Chunking document...');
  const chunks = await doc.chunk({
    strategy: 'recursive',
    size: 512,
    overlap: 50,
    separator: '\n\n',
  });
  console.log(`   Created ${chunks.length} chunks`);

  // 3. 生成向量
  console.log('🧮 Generating embeddings...');
  const { embeddings } = await embedMany({
    values: chunks.map((chunk) => chunk.text),
    model: openai.embedding('text-embedding-3-small'),
  });
  console.log(`   Generated ${embeddings.length} embeddings`);

  // 4. 存储到向量数据库
  console.log('💾 Storing in vector database...');
  const vectorStore = new VectorStore(process.env.POSTGRES_CONNECTION_STRING!);

  await vectorStore.upsert({
    indexName: 'embeddings',
    vectors: embeddings,
    metadata: chunks.map((chunk, i) => ({
      text: chunk.text,
      ...metadata,
      chunkIndex: i,
      createdAt: new Date().toISOString(),
    })),
  });

  console.log('✅ Document ingestion complete!');
}

// 使用示例
await ingestDocument(
  `
  Mastra is a TypeScript framework for building AI agents.
  It provides built-in support for RAG (Retrieval-Augmented Generation).
  
  Key Features:
  - Document processing and chunking
  - Vector embeddings and storage
  - Multiple vector database support
  - Semantic search and retrieval
  `,
  {
    source: 'documentation',
    category: 'overview',
    tags: ['rag', 'typescript', 'ai'],
  },
);
```

### 查询流程

```typescript
// src/index.ts
import { mastra } from './mastra/agents/rag-agent';

async function queryRAG(question: string) {
  console.log(`\n💬 Question: ${question}\n`);

  // 获取 RAG Agent
  const agent = mastra.getAgent('ragAgent');

  // 生成响应(Agent 会自动调用 vectorQueryTool)
  const response = await agent.generate(question);

  console.log(`🤖 Answer: ${response.text}\n`);

  return response.text;
}

// 使用示例
await queryRAG('What is Mastra?');
await queryRAG('How does RAG work in Mastra?');
await queryRAG('What vector databases are supported?');
```

### 完整 RAG 流程图

```
┌─────────────────────────────────────────────────────────────┐
│                    离线阶段(文档摄入)                          │
└─────────────────────────────────────────────────────────────┘

     ┌──────────────┐
     │ 原始文档      │
     │ (Text/PDF/   │
     │  HTML/MD)    │
     └──────┬───────┘
            ↓
     ┌──────────────┐
     │ 文档解析      │
     │ MDocument    │
     └──────┬───────┘
            ↓
     ┌──────────────┐
     │ 分块处理      │
     │ .chunk()     │
     │ • strategy   │
     │ • size: 512  │
     │ • overlap: 50│
     └──────┬───────┘
            ↓
     ┌──────────────┐
     │ 元数据提取    │
     │ • keywords   │
     │ • summary    │
     └──────┬───────┘
            ↓
     ┌──────────────┐
     │ 生成向量      │
     │ embedMany()  │
     │ → 1536-d     │
     └──────┬───────┘
            ↓
     ┌──────────────┐
     │ 存储向量      │
     │ VectorDB     │
     │ .upsert()    │
     └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    在线阶段(查询响应)                          │
└─────────────────────────────────────────────────────────────┘

     ┌──────────────┐
     │  用户问题     │
     │ "What is...?" │
     └──────┬───────┘
            ↓
     ┌──────────────┐
     │  Agent 接收   │
     │  ragAgent    │
     └──────┬───────┘
            ↓
     ┌──────────────┐
     │  调用工具     │
     │vectorQueryTool│
     └──────┬───────┘
            ↓
     ┌──────────────┐
     │ 问题向量化    │
     │ embed(query) │
     └──────┬───────┘
            ↓
     ┌──────────────┐
     │ 向量搜索      │
     │ VectorDB     │
     │ .query()     │
     └──────┬───────┘
            ↓
     ┌──────────────┐
     │ 检索 Top K    │
     │ contexts     │
     └──────┬───────┘
            ↓
     ┌──────────────┐
     │ 构建提示词    │
     │ System +     │
     │ Context +    │
     │ Question     │
     └──────┬───────┘
            ↓
     ┌──────────────┐
     │  LLM 生成    │
     │ gpt-4o-mini  │
     └──────┬───────┘
            ↓
     ┌──────────────┐
     │  返回答案     │
     │ "Mastra is..." │
     └──────────────┘
```

---

## 高级功能

### 1. Graph RAG

Graph RAG 通过构建知识图谱增强检索效果。

```typescript
// src/rag/graph-rag.ts
import { GraphRAG, createGraphRAGTool } from '@mastra/rag';
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';

export class GraphRAGSystem {
  private graphRAG: GraphRAG;

  constructor() {
    this.graphRAG = new GraphRAG({
      dimension: 1536,
      threshold: 0.7, // 相似度阈值
    });
  }

  /**
   * 创建知识图谱
   */
  async createGraph(chunks: any[], embeddings: number[][]): Promise<void> {
    // 构建图谱
    this.graphRAG.createGraph(chunks, embeddings);

    console.log('✅ Knowledge graph created');
  }

  /**
   * 查询图谱
   */
  async query(queryEmbedding: number[], topK: number = 10): Promise<any[]> {
    const results = await this.graphRAG.query({
      query: queryEmbedding,
      topK,
      randomWalkSteps: 100, // 随机游走步数
      restartProb: 0.15, // 重启概率
    });

    return results;
  }
}

// 使用 GraphRAG Tool
const graphRagTool = createGraphRAGTool({
  vectorStoreName: 'pgVector',
  indexName: 'embeddings',
  model: openai.embedding('text-embedding-3-small'),
  graphOptions: {
    dimension: 1536,
    threshold: 0.7,
  },
});
```

### 2. 混合搜索

结合向量搜索和关键词搜索。

```typescript
// src/rag/hybrid-search.ts
import { PineconeVector } from '@mastra/pinecone';

export class HybridSearch {
  private pinecone: PineconeVector;

  constructor(apiKey: string) {
    this.pinecone = new PineconeVector({ apiKey });
  }

  /**
   * 混合搜索(Dense + Sparse)
   */
  async hybridQuery(
    indexName: string,
    denseVector: number[],
    keywords: string[],
    topK: number = 5,
  ) {
    // 构建稀疏向量(关键词权重)
    const sparseVector = this.buildSparseVector(keywords);

    const results = await this.pinecone.query({
      indexName,
      queryVector: denseVector,
      sparseVector,
      topK,
    });

    return results;
  }

  private buildSparseVector(keywords: string[]): {
    indices: number[];
    values: number[];
  } {
    // 简化实现:使用关键词索引和 TF-IDF 权重
    const indices = keywords.map((_, i) => i);
    const values = keywords.map(() => 1.0);

    return { indices, values };
  }
}
```

### 3. 重排序(Reranking)

使用 Cohere Rerank 优化结果。

```typescript
// src/rag/reranker.ts
import { rerank } from '@mastra/rag';

export async function rerankResults(
  query: string,
  contexts: Array<{ text: string; score: number }>,
): Promise<Array<{ text: string; score: number }>> {
  // 使用 Cohere Rerank
  const reranked = await rerank({
    query,
    documents: contexts.map((c) => c.text),
    model: 'rerank-english-v2.0',
    topN: 5,
  });

  return reranked.map((doc: any, i: number) => ({
    text: doc.document,
    score: doc.relevanceScore,
  }));
}
```

---

## 底层实现解析

### MDocument 内部实现

```typescript
// 简化的 MDocument 实现原理
class MDocument {
  constructor(
    private content: string,
    private type: DocumentType,
    private metadata: Record<string, any>,
  ) {}

  async chunk(options: ChunkOptions): Promise<Chunk[]> {
    // 根据策略选择分块方法
    switch (options.strategy) {
      case 'recursive':
        return this.recursiveChunk(options);
      case 'sliding':
        return this.slidingWindowChunk(options);
      case 'markdown':
        return this.markdownChunk(options);
      default:
        throw new Error(`Unknown strategy: ${options.strategy}`);
    }
  }

  private recursiveChunk(options: ChunkOptions): Chunk[] {
    const { size, overlap, separator } = options;
    const chunks: Chunk[] = [];

    // 1. 按分隔符分割
    const sections = this.content.split(separator);

    let currentChunk = '';

    for (const section of sections) {
      // 2. 如果当前块 + 新段落超过大小限制
      if (currentChunk.length + section.length > size) {
        if (currentChunk) {
          chunks.push({
            text: currentChunk,
            metadata: this.metadata,
          });
        }

        // 3. 处理重叠
        currentChunk = this.getOverlap(currentChunk, overlap) + section;
      } else {
        currentChunk += (currentChunk ? separator : '') + section;
      }
    }

    if (currentChunk) {
      chunks.push({ text: currentChunk, metadata: this.metadata });
    }

    return chunks;
  }

  private getOverlap(text: string, overlapSize: number): string {
    return text.slice(-overlapSize);
  }
}
```

### 向量相似度计算

```typescript
// 余弦相似度计算
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have same dimension');
  }

  // 点积
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  // 归一化
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

// 欧几里得距离
function euclideanDistance(vecA: number[], vecB: number[]): number {
  let sum = 0;
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}
```

### PgVector SQL 查询

```sql
-- PgVector 查询示例

-- 1. 创建表和索引
CREATE TABLE embeddings (
  id TEXT PRIMARY KEY,
  embedding VECTOR(1536),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. 创建向量索引(IVFFlat)
CREATE INDEX ON embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 3. 插入向量
INSERT INTO embeddings (id, embedding, metadata)
VALUES (
  'doc-1',
  '[0.1, 0.2, 0.3, ...]',
  '{"text": "...", "source": "docs"}'
);

-- 4. 相似度查询(余弦相似度)
SELECT
  id,
  metadata,
  1 - (embedding <=> '[0.1, 0.2, ...]') AS similarity
FROM embeddings
WHERE metadata->>'source' = 'docs'  -- 元数据过滤
ORDER BY embedding <=> '[0.1, 0.2, ...]'
LIMIT 5;

-- 5. 其他距离度量
-- 欧几里得距离: <->
-- 内积: <#>
-- 余弦距离: <=>
```

---

## 架构图与流程图

### RAG 系统组件交互图

```
┌─────────────────────────────────────────────────────────────┐
│                      User Application                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Web UI   │  │  CLI Tool  │  │   API      │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        └─────────────────┼──────────────┘                   │
└──────────────────────────┼──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Mastra Framework                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Mastra Instance                     │    │
│  │  • agents: { ragAgent }                             │    │
│  │  • vectors: { pgVector }                            │    │
│  │  • tools: { vectorQueryTool }                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ↓                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   RAG Agent                          │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │    │
│  │  │Instructions│  │   Model    │  │   Tools    │    │    │
│  │  │  (System)  │  │ (GPT-4o)   │  │ (Vector)   │    │    │
│  │  └────────────┘  └────────────┘  └────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   RAG Processing Pipeline                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  1. Document Processing (@mastra/rag)                │   │
│  │     ┌─────────┐    ┌─────────┐    ┌─────────┐       │   │
│  │     │MDocument│ → │ .chunk()│ → │Metadata │       │   │
│  │     └─────────┘    └─────────┘    └─────────┘       │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  2. Embedding Generation (ai package)                │   │
│  │     ┌─────────┐    ┌─────────┐    ┌─────────┐       │   │
│  │     │embedMany│ → │ OpenAI  │ → │ Vectors │       │   │
│  │     └─────────┘    │Embedding│    │(1536-d) │       │   │
│  │                    └─────────┘    └─────────┘       │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  3. Vector Storage & Retrieval                       │   │
│  │     ┌─────────┐    ┌─────────┐    ┌─────────┐       │   │
│  │     │ .upsert │ → │ .query()│ → │ Top K   │       │   │
│  │     └─────────┘    │Cosine   │    │Results  │       │   │
│  │                    └─────────┘    └─────────┘       │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Vector Database Layer                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │PostgreSQL│  │ Pinecone │  │  Qdrant  │  │  Chroma  │   │
│  │+pgvector │  │          │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  • HNSW/IVFFlat indexing                                    │
│  • Cosine/Euclidean/Dot-product similarity                  │
│  • Metadata filtering (MongoDB query syntax)                │
│  • Horizontal scaling support                               │
└─────────────────────────────────────────────────────────────┘
```

### 数据流序列图

```
User → Mastra → Agent → VectorTool → VectorDB → LLM → Response

┌──────┐  ┌────────┐  ┌───────┐  ┌──────────┐  ┌────────┐  ┌─────┐
│ User │  │ Mastra │  │ Agent │  │VectorTool│  │VectorDB│  │ LLM │
└───┬──┘  └───┬────┘  └───┬───┘  └────┬─────┘  └───┬────┘  └──┬──┘
    │         │           │           │            │          │
    │ query   │           │           │            │          │
    ├────────>│           │           │            │          │
    │         │           │           │            │          │
    │         │ .generate()│          │            │          │
    │         ├──────────>│           │            │          │
    │         │           │           │            │          │
    │         │           │ identify  │            │          │
    │         │           │ tool need │            │          │
    │         │           ├───────────┤            │          │
    │         │           │           │            │          │
    │         │           │ call tool │            │          │
    │         │           ├──────────>│            │          │
    │         │           │           │            │          │
    │         │           │           │ embed(q)   │          │
    │         │           │           ├───────────>│          │
    │         │           │           │            │          │
    │         │           │           │  .query()  │          │
    │         │           │           ├───────────>│          │
    │         │           │           │            │          │
    │         │           │           │ compute    │          │
    │         │           │           │ similarity │          │
    │         │           │           │<───────────┤          │
    │         │           │           │            │          │
    │         │           │           │ Top K docs │          │
    │         │           │           │<───────────┤          │
    │         │           │           │            │          │
    │         │           │  contexts │            │          │
    │         │           │<──────────┤            │          │
    │         │           │           │            │          │
    │         │           │   build   │            │          │
    │         │           │   prompt  │            │          │
    │         │           ├───────────┤            │          │
    │         │           │           │            │          │
    │         │           │  call LLM │            │          │
    │         │           ├───────────────────────────────────>│
    │         │           │           │            │          │
    │         │           │           │            │ generate │
    │         │           │           │            │ response │
    │         │           │           │            │<─────────┤
    │         │           │           │            │          │
    │         │           │  response │            │          │
    │         │           │<───────────────────────────────────┤
    │         │           │           │            │          │
    │         │  response │           │            │          │
    │         │<──────────┤           │            │          │
    │         │           │           │            │          │
    │ answer  │           │           │            │          │
    │<────────┤           │           │            │          │
    │         │           │           │            │          │
```

---

## 最佳实践

### 1. 分块优化

```typescript
// 根据文档类型选择策略
const chunkStrategies = {
  technical_docs: {
    strategy: 'markdown',
    size: 512,
    overlap: 50,
  },
  articles: {
    strategy: 'recursive',
    size: 768,
    overlap: 100,
  },
  conversations: {
    strategy: 'sliding',
    size: 256,
    overlap: 50,
  },
};
```

### 2. Embedding 优化

```typescript
// 使用合适的模型
const embeddingModels = {
  high_quality: 'text-embedding-3-large', // 3072-d, 更准确
  balanced: 'text-embedding-3-small', // 1536-d, 性价比高
  multilingual: 'multilingual-e5-large', // 多语言支持
};
```

### 3. 检索优化

```typescript
// 多阶段检索
async function optimizedRetrieval(query: string) {
  // Stage 1: 粗召回(Top 20)
  const candidates = await retriever.retrieve({
    query,
    topK: 20,
  });

  // Stage 2: 重排序(Top 5)
  const reranked = await rerank(query, candidates);

  return reranked.slice(0, 5);
}
```

### 4. 缓存策略

```typescript
import { LRUCache } from 'lru-cache';

const embeddingCache = new LRUCache<string, number[]>({
  max: 1000,
  ttl: 1000 * 60 * 60, // 1 hour
});

async function getCachedEmbedding(text: string): Promise<number[]> {
  const cached = embeddingCache.get(text);
  if (cached) return cached;

  const embedding = await generateEmbedding(text);
  embeddingCache.set(text, embedding);

  return embedding;
}
```

### 5. 错误处理

```typescript
async function robustQuery(query: string, maxRetries: number = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await retriever.retrieve({ query, topK: 5 });
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // 指数退避
      await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
}
```

---

## 总结

### 关键要点

1. **文档处理** - 使用 `MDocument` 进行分块和元数据提取
2. **向量生成** - 使用 `embedMany` 批量生成高质量向量
3. **向量存储** - 选择合适的向量数据库(PgVector/Pinecone/Qdrant)
4. **语义检索** - 余弦相似度搜索 + 元数据过滤
5. **Agent 集成** - 使用 `createVectorQueryTool` 创建工具

### 完整项目 Checklist

- ✅ 安装 `@mastra/rag`、`@mastra/pg`、`ai`
- ✅ 配置向量数据库(PostgreSQL + pgvector)
- ✅ 实现文档摄入流程
- ✅ 创建 RAG Agent
- ✅ 测试检索质量
- ✅ 优化分块和检索策略
- ✅ 添加监控和日志

### 运行示例

```bash
# 安装依赖
npm install

# 设置数据库
psql -U postgres < setup.sql

# 摄入文档
npm run ingest

# 启动 RAG 服务
npm run dev

# 测试查询
npm run query "What is Mastra?"
```

---

**文档版本**: 1.0  
**最后更新**: 2025-11-13  
**作者**: Claude (基于 Mastra.ai 官方文档整理)

**参考资源**:

- [Mastra RAG 文档](https://mastra.ai/docs/rag/overview)
- [Mastra GitHub](https://github.com/mastra-ai/mastra)
- [示例代码](https://mastra.ai/examples/rag)
