---
title: 'Chapter 14: Knowledge Retrieval (RAG)'
date: '2025-12-25'
excerpt: 'Retrieval-Augmented Generation (RAG) combines the power of LLMs with external knowledge bases.'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 14: Knowledge Retrieval (RAG)

# 第十四章：知识检索(RAG)

## RAG Pattern Overview

## RAG模式概述

Retrieval-Augmented Generation (RAG) combines the power of LLMs with external knowledge bases.

检索增强生成(RAG)将LLM的力量与外部知识库结合起来。

This pattern enables agents to access and use up-to-date or domain-specific information beyond their training data.

这种模式使智能体能够访问和使用训练数据之外的最新或领域特定信息。

### How RAG Works

### RAG如何工作

**Retrieval**: When a query is received, relevant documents are retrieved from a knowledge base.

**检索**: 当收到查询时，从知识库检索相关文档。

**Augmentation**: The retrieved information is incorporated into the prompt context.

**增强**: 检索到的信息被纳入提示上下文。

**Generation**: The LLM generates a response using both its internal knowledge and the retrieved information.

**生成**: LLM使用其内部知识和检索到的信息生成响应。

### Benefits of RAG

### RAG的好处

**Accuracy**: Reduces hallucinations by grounding responses in verified information.

**准确性**: 通过将响应基于经过验证的信息来减少幻觉。

**Freshness**: Enables access to current information without retraining.

**新鲜度**: 可以在无需重新训练的情况下访问当前信息。

**Customization**: Allows agents to access organization-specific knowledge.

**定制**: 允许智能体访问组织特定的知识。

**Transparency**: Sources can be cited for verification.

**透明性**: 可以引用来源进行验证。

### RAG Implementation Components

### RAG实现组件

**Vector Database**: Stores document embeddings for efficient similarity search.

**向量数据库**: 存储文档嵌入以进行高效相似性搜索。

**Embeddings Model**: Converts text to vector representations.

**嵌入模型**: 将文本转换为向量表示。

**Retrieval System**: Finds relevant documents based on query similarity.

**检索系统**: 基于查询相似性找到相关文档。

**Integration Layer**: Combines retrieved information with prompts.

**集成层**: 将检索到的信息与提示结合。

---

## Practical Applications & Use Cases

## 实际应用和用例

### Customer Support

### 客户支持

Agents can access company knowledge bases to provide accurate, contextually relevant answers to customer queries.

智能体可以访问公司知识库，为客户提供准确、相关的答案。

### Research and Analysis

### 研究和分析

Agents can retrieve and synthesize information from large document collections for research purposes.

智能体可以从大量文档集合中检索和综合信息，用于研究目的。

### Financial Services

### 金融服务

Agents can access up-to-date market data, regulatory documents, and investment research to provide informed recommendations.

智能体可以访问最新的市场数据、监管提供明智文件和投资研究，以的建议。

### Healthcare

### 医疗保健

Agents can retrieve medical literature, drug interactions, and clinical guidelines to support healthcare decisions.

智能体可以检索医学文献、药物相互作用和临床指南，以支持医疗决策。

---

## Hands-On Code Examples

## 实践代码示例

The following code examples demonstrate how to implement RAG patterns in JavaScript using LangChain:

以下代码示例展示如何使用 LangChain 在 JavaScript 中实现RAG模式：

### 1. Basic RAG Implementation

### 1. 基础RAG实现

This example shows how to implement a basic RAG system:

此示例展示如何实现基础RAG系统：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// --- Configuration ---
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

// --- Simple Document Store (In-Memory) ---
class SimpleDocumentStore {
  constructor() {
    this.documents = [];
  }

  // Add document to store
  addDocument(doc) {
    this.documents.push({
      id: `doc_${this.documents.length + 1}`,
      content: doc.content,
      metadata: doc.metadata || {},
      embedding: this.simpleEmbed(doc.content), // Simplified embedding
    });
    console.log(`[Store] Added document: ${doc.metadata?.title || 'Untitled'}`);
  }

  // Simple embedding simulation (use proper embeddings in production)
  simpleEmbed(text) {
    // Simulate embeddings as hash-like values
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  // Search by similarity (simplified)
  search(query, topK = 3) {
    const queryEmbedding = this.simpleEmbed(query);

    // Calculate similarity scores
    const results = this.documents.map((doc) => {
      const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding);
      return { ...doc, similarity };
    });

    // Sort by similarity and return top K
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, topK);
  }

  // Simplified cosine similarity
  cosineSimilarity(a, b) {
    // In production, use proper vector similarity
    // This is a simplified version for demonstration
    return a === b ? 1 : 0.5 + Math.random() * 0.3;
  }
}

// --- Basic RAG System ---
class BasicRAG {
  constructor(llm, documentStore) {
    this.llm = llm;
    this.documentStore = documentStore;
  }

  // Retrieve relevant documents
  retrieve(query, topK = 3) {
    return this.documentStore.search(query, topK);
  }

  // Augment prompt with retrieved context
  augmentPrompt(query, retrievedDocs) {
    const context = retrievedDocs
      .map((doc, i) => `[${i + 1}] ${doc.content}`)
      .join('\n\n');

    return `
Context Information:
${context}

User Question: ${query}

Based on the context above, please answer the question.`;
  }

  // Generate response with RAG
  async query(userQuery) {
    // Step 1: Retrieve relevant documents
    console.log('[RAG] Retrieving relevant documents...');
    const retrievedDocs = this.retrieve(userQuery);

    console.log('[RAG] Retrieved documents:');
    retrievedDocs.forEach((doc, i) => {
      console.log(`  ${i + 1}. ${doc.metadata?.title || 'Untitled'} (similarity: ${doc.similarity?.toFixed(3)})`);
    });

    // Step 2: Augment prompt
    const augmentedPrompt = this.augmentPrompt(userQuery, retrievedDocs);

    // Step 3: Generate response
    console.log('[RAG] Generating response...');
    const prompt = ChatPromptTemplate.fromTemplate(augmentedPrompt);
    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());

    const response = await chain.invoke({});

    return {
      answer: response,
      sources: retrievedDocs.map((doc) => ({
        title: doc.metadata?.title,
        content: doc.content.substring(0, 100) + '...',
        similarity: doc.similarity,
      })),
    };
  }
}

// --- Example Usage ---
async function runBasicRAG() {
  // Initialize
  const documentStore = new SimpleDocumentStore();
  const rag = new BasicRAG(llm, documentStore);

  console.log('=== Basic RAG Demo ===\n');

  // Add sample documents
  documentStore.addDocument({
    content: 'Python is a high-level programming language known for its simplicity and readability. It supports multiple programming paradigms and has extensive libraries.',
    metadata: { title: 'Python Programming', category: 'technology' },
  });

  documentStore.addDocument({
    content: 'JavaScript is a programming language primarily used for web development. It runs in browsers and can also be used server-side with Node.js.',
    metadata: { title: 'JavaScript Programming', category: 'technology' },
  });

  documentStore.addDocument({
    content: 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience. Deep learning uses neural networks with multiple layers.',
    metadata: { title: 'Machine Learning', category: 'AI' },
  });

  documentStore.addDocument({
    content: 'Investments in stocks represent ownership in a company. Stock prices fluctuate based on company performance and market conditions. Diversification reduces risk.',
    metadata: { title: 'Stock Investment Basics', category: 'finance' },
  });

  // Query the RAG system
  console.log('\n--- Query 1: About Python ---');
  const response1 = await rag.query('What is Python used for?');
  console.log('\nAnswer:', response1.answer);
  console.log('Sources:', response1.sources.map(s => s.title).join(', '));

  console.log('\n--- Query 2: About Investing ---');
  const response2 = await rag.query('How do I reduce investment risk?');
  console.log('\nAnswer:', response2.answer);
  console.log('Sources:', response2.sources.map(s => s.title).join(', '));
}

runBasicRAG();
```

### 2. Vector Store with Embeddings

### 2. 向量存储与嵌入

This example demonstrates using a vector store for semantic search:

此示例展示如何使用向量存储进行语义搜索：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// --- Configuration ---
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

// --- Vector Store Interface ---
class VectorStore {
  constructor(dimension = 1536) {
    this.vectors = new Map();
    this.dimension = dimension;
  }

  // Add vector with metadata
  addVector(id, vector, metadata) {
    this.vectors.set(id, { vector, metadata });
  }

  // Search by similarity
  search(queryVector, topK = 5) {
    const results = [];

    for (const [id, data] of this.vectors.entries()) {
      const similarity = this.cosineSimilarity(queryVector, data.vector);
      results.push({ id, ...data.metadata, similarity });
    }

    // Sort by similarity
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, topK);
  }

  // Cosine similarity
  cosineSimilarity(a, b) {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Get all vectors
  getAll() {
    return Array.from(this.vectors.entries()).map(([id, data]) => ({
      id,
      ...data.metadata,
    }));
  }
}

// --- Document Chunking ---
class DocumentChunker {
  static chunkBySize(text, chunkSize = 500, overlap = 50) {
    const chunks = [];
    const words = text.split(' ');

    let currentChunk = [];
    let currentSize = 0;

    for (const word of words) {
      currentSize += word.length + 1;

      if (currentSize > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
        // Keep overlap
        currentChunk = currentChunk.slice(-Math.floor(overlap / 5));
        currentSize = 0;
      }

      currentChunk.push(word);
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
    }

    return chunks;
  }

  static chunkBySentences(text, sentencesPerChunk = 3) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const chunks = [];

    for (let i = 0; i < sentences.length; i += sentencesPerChunk) {
      const chunk = sentences.slice(i, i + sentencesPerChunk).join('. ');
      if (chunk.trim()) {
        chunks.push(chunk);
      }
    }

    return chunks;
  }
}

// --- Semantic RAG System ---
class SemanticRAG {
  constructor(llm) {
    this.llm = llm;
    this.vectorStore = new VectorStore();
    this.documents = new Map();
  }

  // Generate embedding (simulated)
  async generateEmbedding(text) {
    // In production, use actual embedding model like text-embedding-ada-002
    // This simulates embeddings based on text content
    const hash = this.simpleHash(text);
    const vector = [];

    for (let i = 0; i < 1536; i++) {
      // Generate pseudo-random but deterministic vector
      vector.push(Math.sin(hash * (i + 1)) * 0.5 + 0.5);
    }

    return vector;
  }

  simpleHash(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Index document
  async indexDocument(doc) {
    const docId = `doc_${Date.now()}`;

    // Chunk document
    const chunks = DocumentChunker.chunkBySize(doc.content, 300, 30);

    console.log(`[Indexing] "${doc.metadata.title}" -> ${chunks.length} chunks`);

    // Add chunks to vector store
    for (let i = 0; i < chunks.length; i++) {
      const chunkId = `${docId}_chunk_${i}`;
      const embedding = await this.generateEmbedding(chunks[i]);

      this.vectorStore.addVector(chunkId, embedding, {
        chunkId,
        docId,
        content: chunks[i],
        title: doc.metadata.title,
        category: doc.metadata.category,
        chunkIndex: i,
      });

      this.documents.set(chunkId, {
        docId,
        content: chunks[i],
        metadata: doc.metadata,
      });
    }

    return { docId, chunks: chunks.length };
  }

  // Semantic search
  async semanticSearch(query, topK = 3) {
    const queryEmbedding = await this.generateEmbedding(query);
    const results = this.vectorStore.search(queryEmbedding, topK);

    return results;
  }

  // Generate answer
  async query(userQuery) {
    // Semantic search
    const results = await this.semanticSearch(userQuery);

    // Build context
    const context = results
      .map((r, i) => `[Source ${i + 1}]: ${r.content}`)
      .join('\n\n');

    const prompt = ChatPromptTemplate.fromTemplate(
      `You are a helpful assistant. Use the following context to answer the user's question.

Context:
{context}

Question: {question}

Answer:`,
    );

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());

    const answer = await chain.invoke({
      context,
      question: userQuery,
    });

    return {
      answer,
      sources: results.map(r => ({
        title: r.title,
        content: r.content.substring(0, 80) + '...',
        similarity: r.similarity.toFixed(3),
      })),
    };
  }
}

// --- Example Usage ---
async function runSemanticRAG() {
  const rag = new SemanticRAG(llm);

  console.log('=== Semantic RAG Demo ===\n');

  // Index sample documents
  const documents = [
    {
      content: 'Artificial intelligence is transforming industries across the globe. From healthcare to finance, AI applications are becoming more prevalent. Machine learning, a subset of AI, enables computers to learn from data without explicit programming.',
      metadata: { title: 'AI Revolution', category: 'technology' },
    },
    {
      content: 'The stock market provides opportunities for investors to buy shares of publicly traded companies. Successful investing requires understanding risk management, diversification, and fundamental analysis. Long-term investing typically outperforms short-term trading.',
      metadata: { title: 'Stock Market Investing', category: 'finance' },
    },
    {
      content: 'Climate change is one of the most pressing challenges facing humanity. Renewable energy sources like solar and wind power are crucial for reducing carbon emissions. Electric vehicles are becoming increasingly popular as alternatives to traditional gasoline cars.',
      metadata: { title: 'Climate Change Solutions', category: 'environment' },
    },
  ];

  for (const doc of documents) {
    await rag.indexDocument(doc);
  }

  // Query
  console.log('\n--- Query: AI applications ---');
  const result = await rag.query('What are the main applications of AI?');
  console.log('\nAnswer:', result.answer);
  console.log('\nSources:');
  result.sources.forEach(s => {
    console.log(`  - ${s.title} (${s.similarity})`);
  });
}

runSemanticRAG();
```

### 3. RAG with Re-ranking

### 3. 带重排序的RAG

This example shows how to implement RAG with re-ranking for better results:

此示例展示如何实现带重排序的RAG以获得更好的结果：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// --- Configuration ---
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

// --- Re-ranker Interface ---
class ReRanker {
  constructor(llm) {
    this.llm = llm;
  }

  // Re-rank documents based on relevance to query
  async rerank(query, documents, topK = 3) {
    const scoredDocs = [];

    for (const doc of documents) {
      const score = await this.calculateRelevanceScore(query, doc);
      scoredDocs.push({ ...doc, relevanceScore: score });
    }

    // Sort by relevance score
    scoredDocs.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return scoredDocs.slice(0, topK);
  }

  // Calculate relevance score using LLM
  async calculateRelevanceScore(query, doc) {
    const prompt = `Rate the relevance of this document to the query on a scale of 0-10.

Query: {query}

Document: {content}

Respond with just a number.`;

    const chain = ChatPromptTemplate.fromTemplate(prompt)
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    try {
      const response = await chain.invoke({ query, content: doc.content });
      const score = parseFloat(response.trim());
      return isNaN(score) ? 5 : score / 10; // Normalize to 0-1
    } catch {
      return doc.similarity || 0.5;
    }
  }
}

// --- Hybrid RAG System with Re-ranking ---
class HybridRAG {
  constructor(llm) {
    this.llm = llm;
    this.vectorStore = new SimpleDocumentStore(); // Using simple store for demo
    this.reranker = new ReRanker(llm);
  }

  // Initial retrieval (BM25-style keyword search)
  keywordSearch(query, topK = 10) {
    const queryTerms = query.toLowerCase().split(' ');

    const results = this.vectorStore.documents.map(doc => {
      let score = 0;
      const contentLower = doc.content.toLowerCase();

      // Count matching terms
      for (const term of queryTerms) {
        if (contentLower.includes(term)) {
          score += 1;
        }
      }

      return { ...doc, keywordScore: score / queryTerms.length };
    });

    // Filter and sort
    return results
      .filter(r => r.keywordScore > 0)
      .sort((a, b) => b.keywordScore - a.keywordScore)
      .slice(0, topK);
  }

  // Semantic search
  semanticSearch(query, topK = 10) {
    return this.vectorStore.search(query, topK);
  }

  // Hybrid search (combine keyword and semantic)
  hybridSearch(query, topK = 10) {
    const keywordResults = this.keywordSearch(query, topK);
    const semanticResults = this.semanticSearch(query, topK);

    // Combine and deduplicate
    const combined = new Map();

    // Add keyword results with weight
    for (const doc of keywordResults) {
      combined.set(doc.id, {
        ...doc,
        finalScore: doc.keywordScore * 0.5 + (doc.similarity || 0) * 0.5,
      });
    }

    // Add semantic results with weight
    for (const doc of semanticResults) {
      if (combined.has(doc.id)) {
        combined.get(doc.id).finalScore =
          (combined.get(doc.id).finalScore + (doc.similarity || 0)) / 2;
      } else {
        combined.set(doc.id, {
          ...doc,
          finalScore: (doc.similarity || 0) * 0.5,
        });
      }
    }

    // Sort by combined score
    return Array.from(combined.values())
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, topK);
  }

  // Query with re-ranking
  async query(userQuery, useReranking = true, topK = 3) {
    // Step 1: Hybrid search
    console.log('[RAG] Performing hybrid search...');
    let retrievedDocs = this.hybridSearch(userQuery, 10);

    console.log(`[RAG] Retrieved ${retrievedDocs.length} documents`);

    // Step 2: Re-rank if enabled
    if (useReranking) {
      console.log('[RAG] Re-ranking results...');
      retrievedDocs = await this.reranker.rerank(userQuery, retrievedDocs, topK);
    } else {
      retrievedDocs = retrievedDocs.slice(0, topK);
    }

    // Step 3: Generate response
    const context = retrievedDocs
      .map((doc, i) => `[${i + 1}] ${doc.content}`)
      .join('\n\n');

    const prompt = ChatPromptTemplate.fromTemplate(
      `Based on the following context, answer the question concisely and accurately.

Context:
{context}

Question: {question}

Answer:`,
    );

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());
    const answer = await chain.invoke({ context, question: userQuery });

    return {
      answer,
      sources: retrievedDocs.map(r => ({
        title: r.metadata?.title,
        score: r.finalScore?.toFixed(3) || r.similarity?.toFixed(3),
      })),
    };
  }
}

// --- Simple Document Store for Hybrid RAG ---
class SimpleDocumentStore {
  constructor() {
    this.documents = [];
  }

  addDocument(doc) {
    this.documents.push({
      id: `doc_${this.documents.length + 1}`,
      content: doc.content,
      metadata: doc.metadata || {},
    });
  }

  search(query, topK = 5) {
    // Simplified semantic search
    return this.documents
      .map(doc => ({
        ...doc,
        similarity: Math.random() * 0.5 + 0.5, // Simulated
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
}

// --- Example Usage ---
async function runHybridRAG() {
  const rag = new HybridRAG(llm);

  console.log('=== Hybrid RAG with Re-ranking Demo ===\n');

  // Add documents
  const docs = [
    { content: 'Python is a versatile programming language used in web development, data science, and AI.', metadata: { title: 'Python' } },
    { content: 'JavaScript is primarily used for web development and runs in browsers.', metadata: { title: 'JavaScript' } },
    { content: 'Machine learning is a type of AI that enables computers to learn from data.', metadata: { title: 'ML' } },
    { content: 'Deep learning uses neural networks with multiple layers.', metadata: { title: 'Deep Learning' } },
    { content: 'Stock investing involves buying shares of companies for long-term wealth building.', metadata: { title: 'Investing' } },
  ];

  docs.forEach(doc => rag.vectorStore.addDocument(doc));

  // Query without re-ranking
  console.log('--- Without Re-ranking ---');
  const result1 = await rag.query('What is machine learning?', false);
  console.log('Answer:', result1.answer);

  // Query with re-ranking
  console.log('\n--- With Re-ranking ---');
  const result2 = await rag.query('What is machine learning?', true);
  console.log('Answer:', result2.answer);
  console.log('Sources:', result2.sources);
}

runHybridRAG();
```

### 4. Multi-source RAG

### 4. 多源RAG

This example demonstrates aggregating information from multiple sources:

此示例展示如何聚合多个来源的信息：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// --- Configuration ---
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

// --- Data Source Interface ---
class DataSource {
  constructor(name) {
    this.name = name;
  }

  async search(query) {
    throw new Error('Method not implemented');
  }
}

// --- Web Search Source ---
class WebSearchSource extends DataSource {
  constructor() {
    super('Web Search');
  }

  async search(query) {
    // Simulated web search results
    console.log(`[${this.name}] Searching for: ${query}`);

    return [
      {
        title: `Web Result: ${query} - Latest News`,
        content: `Recent information about ${query} from various online sources. This includes current trends and developments.`,
        source: 'web',
        url: 'https://example.com/1',
        timestamp: Date.now(),
      },
    ];
  }
}

// --- Database Source ---
class DatabaseSource extends DataSource {
  constructor() {
    super('Internal Database');
    this.data = [
      { title: 'Company Policy - AI Usage', content: 'Our company encourages responsible AI adoption while maintaining ethical standards.' },
      { title: 'Product Documentation', content: 'Our platform supports multiple AI models including GPT-4, Claude, and open-source alternatives.' },
      { title: 'User Guide - API Integration', content: 'To integrate with our API, obtain an API key and follow the documented endpoints.' },
    ];
  }

  async search(query) {
    console.log(`[${this.name}] Searching for: ${query}`);

    const results = this.data.filter(d =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.content.toLowerCase().includes(query.toLowerCase())
    );

    return results.map(r => ({
      ...r,
      source: 'database',
    }));
  }
}

// --- Document Repository Source ---
class DocumentRepoSource extends DataSource {
  constructor() {
    super('Document Repository');
    this.documents = [
      { title: 'Q4 Financial Report', content: 'Our Q4 revenue increased by 15% year-over-year, driven by strong product sales.' },
      { title: 'Research Paper - AI Ethics', content: 'This paper discusses the ethical implications of AI and proposes guidelines for responsible use.' },
      { title: 'Technical Specification', content: 'The system architecture follows microservices design with Kubernetes orchestration.' },
    ];
  }

  async search(query) {
    console.log(`[${this.name}] Searching for: ${query}`);

    return this.documents.map(d => ({
      ...d,
      source: 'documents',
    }));
  }
}

// --- Multi-source RAG System ---
class MultiSourceRAG {
  constructor(llm) {
    this.llm = llm;
    this.sources = [];
  }

  // Register data source
  addSource(source) {
    this.sources.push(source);
    console.log(`[MultiSource RAG] Added source: ${source.name}`);
  }

  // Search all sources
  async searchAll(query) {
    const results = [];

    for (const source of this.sources) {
      try {
        const sourceResults = await source.search(query);
        results.push(...sourceResults.map(r => ({
          ...r,
          sourceName: source.name,
        })));
      } catch (error) {
        console.error(`[${source.name}] Search error:`, error.message);
      }
    }

    return results;
  }

  // Aggregate and rank results
  aggregateResults(results) {
    // Group by source
    const bySource = {};
    for (const result of results) {
      if (!bySource[result.source]) {
        bySource[result.source] = [];
      }
      bySource[result.source].push(result);
    }

    // Score and rank
    return results.map((r, i) => ({
      ...r,
      rank: i + 1,
    }));
  }

  // Generate answer from multiple sources
  async query(userQuery) {
    console.log(`\n[MultiSource RAG] Query: ${userQuery}`);

    // Search all sources
    const results = await this.searchAll(userQuery);
    console.log(`[MultiSource RAG] Total results: ${results.length}`);

    // Aggregate
    const aggregated = this.aggregateResults(results);

    // Build context with source attribution
    const context = aggregated
      .map((r, i) => `[${i + 1}] [${r.sourceName}] ${r.content}`)
      .join('\n\n');

    // Generate response
    const prompt = ChatPromptTemplate.fromTemplate(
      `You are a research assistant. Synthesize information from multiple sources to answer the question.

Sources:
{context}

Question: {question}

Provide a comprehensive answer citing the sources:`,
    );

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());
    const answer = await chain.invoke({ context, question: userQuery });

    return {
      answer,
      sources: aggregated.map(r => ({
        title: r.title,
        source: r.sourceName,
      })),
    };
  }
}

// --- Example Usage ---
async function runMultiSourceRAG() {
  const rag = new MultiSourceRAG(llm);

  // Add multiple sources
  rag.addSource(new WebSearchSource());
  rag.addSource(new DatabaseSource());
  rag.addSource(new DocumentRepoSource());

  console.log('\n=== Multi-source RAG Demo ===\n');

  // Query
  const result = await rag.query('AI ethics');
  console.log('\nAnswer:', result.answer);
  console.log('\nSources:');
  result.sources.forEach(s => {
    console.log(`  - ${s.title} (${s.source})`);
  });
}

runMultiSourceRAG();
```

### 5. Agentic RAG with Tool Use

### 5. 智能体RAG与工具使用

This example shows an agent that can decide when to use RAG:

此示例展示一个能够决定何时使用RAG的智能体：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser, JsonOutputParser } from '@langchain/core/output_parsers';

// --- Configuration ---
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

// --- Tool Definitions ---
const tools = {
  rag: {
    name: 'knowledge_base',
    description: 'Search the company knowledge base for relevant information',
    parameters: {
      query: 'The search query',
    },
  },
  web: {
    name: 'web_search',
    description: 'Search the web for current information',
    parameters: {
      query: 'The search query',
    },
  },
  calculator: {
    name: 'calculator',
    description: 'Perform mathematical calculations',
    parameters: {
      expression: 'Mathematical expression to evaluate',
    },
  },
  none: {
    name: 'direct_answer',
    description: 'Answer directly from general knowledge',
    parameters: {},
  },
};

// --- RAG Knowledge Base ---
class KnowledgeBase {
  constructor() {
    this.documents = new Map();
    this.addDocument({
      id: 'policy_1',
      title: 'Vacation Policy',
      content: 'Employees are entitled to 20 days of paid vacation per year. Requests should be submitted at least 2 weeks in advance.',
    });
    this.addDocument({
      id: 'policy_2',
      title: 'Remote Work Policy',
      content: 'Employees may work remotely up to 3 days per week with manager approval. Core hours are 10am-3pm.',
    });
    this.addDocument({
      id: 'policy_3',
      title: 'Expense Reimbursement',
      content: 'Business expenses must be submitted within 30 days. Receipts are required for expenses over $50.',
    });
  }

  addDocument(doc) {
    this.documents.set(doc.id, doc);
  }

  search(query) {
    const queryLower = query.toLowerCase();
    const results = [];

    for (const [id, doc] of this.documents.entries()) {
      const contentLower = doc.content.toLowerCase();
      const titleLower = doc.title.toLowerCase();

      if (contentLower.includes(queryLower) || titleLower.includes(queryLower)) {
        results.push(doc);
      }
    }

    return results;
  }
}

// --- Agentic RAG System ---
class AgenticRAG {
  constructor(llm) {
    this.llm = llm;
    this.knowledgeBase = new KnowledgeBase();
  }

  // Decide which tool to use
  async decideTool(query) {
    const prompt = ChatPromptTemplate.fromTemplate(
      `Analyze the user query and decide which tool to use.

Available tools:
- knowledge_base: For company policies, procedures, internal information
- web_search: For current events, latest news, real-time information
- calculator: For mathematical calculations
- direct_answer: For general knowledge questions

User Query: {query}

Respond with JSON:
{"tool": "tool_name", "reason": "explanation"}`,
    );

    const chain = prompt
      .pipe(this.llm)
      .pipe(new JsonOutputParser());

    try {
      const result = await chain.invoke({ query });
      return result;
    } catch {
      return { tool: 'direct_answer', reason: 'Default to direct answer' };
    }
  }

  // Execute tool
  async executeTool(toolName, query) {
    switch (toolName) {
      case 'knowledge_base':
        const docs = this.knowledgeBase.search(query);
        return {
          results: docs,
          context: docs.map((d, i) => `[${i + 1}] ${d.title}: ${d.content}`).join('\n'),
        };

      case 'web_search':
        return {
          results: [{ title: 'Web Search Result', content: `Latest information about: ${query}` }],
          context: `Web search results for: ${query}`,
        };

      case 'calculator':
        // Simulate calculation
        return {
          results: [{ title: 'Calculation', content: 'Calculation result: 42' }],
          context: 'Simple calculation performed',
        };

      default:
        return { results: [], context: 'No additional context needed' };
    }
  }

  // Generate final answer
  async generateAnswer(query, toolDecision, toolResult) {
    const prompt = ChatPromptTemplate.fromTemplate(
      `Answer the user's question based on the retrieved information.

Question: {query}

Tool Used: {tool}
Reason: {toolReason}

Context:
{context}

Provide a clear and concise answer:`,
    );

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());

    return chain.invoke({
      query,
      tool: toolDecision.tool,
      toolReason: toolDecision.reason,
      context: toolResult.context || 'No additional context',
    });
  }

  // Full agentic workflow
  async query(userQuery) {
    console.log(`\n[Agentic RAG] Processing: ${userQuery}`);

    // Step 1: Decide tool
    const toolDecision = await this.decideTool(userQuery);
    console.log(`[Agentic RAG] Tool selected: ${toolDecision.tool}`);

    // Step 2: Execute tool
    const toolResult = await this.executeTool(toolDecision.tool, userQuery);
    console.log(`[Agentic RAG] Tool executed, got ${toolResult.results.length} results`);

    // Step 3: Generate answer
    const answer = await this.generateAnswer(userQuery, toolDecision, toolResult);

    return {
      answer,
      toolUsed: toolDecision.tool,
      reason: toolDecision.reason,
      sources: toolResult.results,
    };
  }
}

// --- Example Usage ---
async function runAgenticRAG() {
  const agenticRag = new AgenticRAG(llm);

  console.log('=== Agentic RAG Demo ===\n');

  // Test different types of queries
  const queries = [
    'How many vacation days do I have?',
    'What is 15 + 27?',
    'What is quantum computing?',
  ];

  for (const query of queries) {
    const result = await agenticRag.query(query);
    console.log('\n--- Result ---');
    console.log(`Query: ${query}`);
    console.log(`Tool: ${result.toolUsed}`);
    console.log(`Answer: ${result.answer}\n`);
  }
}

runAgenticRAG();
```

---

## 投资智能体

将RAG模式接入投资智能体，意味着要赋予它**实时检索市场信息、财报数据、研究报告**的能力，使其能够基于最新的外部知识做出投资决策，而不是仅依赖训练数据中的过时信息。

### 投资智能体

根据文档中关于RAG架构的最佳实践，接入该模式需要遵循以下核心设计：

#### 1. 投资知识库的构建 (Knowledge Base)

投资智能体需要一个专门的知识库来存储各类投资相关信息。

- **市场数据**：通过API实时获取的股票价格、成交量、技术指标等。
- **财务报表**：公司的季度报、年报关键数据（营收、利润、负债、现金流等）。
- **研究报告**：券商研报、行业分析、公司评级等信息。
- **风险规则**：止损纪律、仓位上限、禁投清单等风控规则。
- **历史交易**：智能体自身的交易历史和盈亏记录。

#### 2. 检索增强生成 (Retrieval-Augmented Generation)

当智能体需要做出投资决策时，RAG机制会被触发：

- **查询理解**：首先使用LLM理解用户的投资问题或当前市场状态。
- **向量化检索**：将查询转换为向量，在知识库中检索最相关的文档或数据。
- **上下文增强**：将检索到的信息作为上下文提供给主LLM。
- **生成决策**：基于检索到的实时信息生成投资建议或决策。

#### 3. 多源数据融合 (Multi-source Fusion)

投资智能体需要从多个异构数据源检索信息：

- **实时行情API**：获取最新股价和交易数据。
- **金融数据库**：获取财务报表、估值数据等结构化信息。
- **新闻API**：获取公司新闻、行业动态、宏观经济事件。
- **知识图谱**：获取公司关系、产业链上下游、竞争格局等图谱信息。

#### 4. 投资决策的透明性 (Transparency)

RAG架构使投资智能体的决策具有可解释性：

- **来源追溯**：每条投资建议都能追溯到具体的数据来源。
- **置信度评估**：基于检索到的信息质量和相关性，评估建议的置信度。
- **风险提示**：当检索到的信息存在矛盾或不足时，主动提示风险。

### 投资智能体代码示例

以下代码示例展示投资智能体的RAG系统实现：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser, JsonOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.3 });

// ============================================
// 1. 投资知识库 (Investment Knowledge Base)
// ============================================

// 投资文档类型
const DocType = {
  MARKET_DATA: 'market_data',       // 市场数据
  FINANCIAL_STATEMENT: 'financial',  // 财务报表
  RESEARCH_REPORT: 'research',      // 研究报告
  RISK_RULE: 'risk_rule',          // 风控规则
  TRADE_HISTORY: 'trade_history',   // 交易历史
};

// 投资知识库
class InvestmentKnowledgeBase {
  constructor() {
    this.documents = new Map();
    this.initializeDefaultData();
  }

  // 初始化默认数据
  initializeDefaultData() {
    // 风控规则
    this.addDocument({
      type: DocType.RISK_RULE,
      title: '最大回撤限制',
      content: '单只股票最大回撤达到15%时必须止损，全部持仓回撤达到10%时必须降低仓位至50%以下。',
      metadata: { rule: 'max_drawdown', threshold: 0.15 },
    });

    this.addDocument({
      type: DocType.RISK_RULE,
      title: '仓位限制',
      content: '单只股票持仓不超过总资产的20%，单一行业持仓不超过总资产的40%。',
      metadata: { rule: 'position_limit', max_single: 0.2, max_industry: 0.4 },
    });

    // 交易历史
    this.addDocument({
      type: DocType.TRADE_HISTORY,
      title: 'AAPL交易记录',
      content: '2024-01-15买入100股@150美元，2024-02-20卖出100股@165美元，盈利1500美元。',
      metadata: { ticker: 'AAPL', result: 'profit' },
    });

    // 财务数据
    this.addDocument({
      type: DocType.FINANCIAL_STATEMENT,
      title: 'AAPL 2024 Q1财报',
      content: '营收: 1196亿美元，同比增长6%。净利润: 339亿美元，同比增长16%。毛利率: 45%。',
      metadata: { ticker: 'AAPL', quarter: 'Q1_2024' },
    });

    // 研究报告
    this.addDocument({
      type: DocType.RESEARCH_REPORT,
      title: '科技股行业分析',
      content: 'AI领域持续增长，半导体需求强劲。推荐关注算力芯片、云服务提供商。',
      metadata: { sector: 'technology', sentiment: 'positive' },
    });
  }

  // 添加文档
  addDocument(doc) {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.documents.set(id, {
      id,
      ...doc,
      timestamp: Date.now(),
    });
  }

  // 检索文档
  search(query, filters = {}) {
    const queryLower = query.toLowerCase();
    const results = [];

    for (const [id, doc] of this.documents.entries()) {
      // 应用过滤器
      if (filters.type && doc.type !== filters.type) continue;
      if (filters.ticker && doc.metadata?.ticker !== filters.ticker) continue;

      // 计算相关性分数
      const contentLower = doc.content.toLowerCase();
      const titleLower = doc.title.toLowerCase();

      let score = 0;
      const queryTerms = queryLower.split(' ');

      for (const term of queryTerms) {
        if (titleLower.includes(term)) score += 2;
        if (contentLower.includes(term)) score += 1;
      }

      if (score > 0) {
        results.push({ ...doc, score });
      }
    }

    // 排序返回
    results.sort((a, b) => b.score - a.score);
    return results;
  }

  // 按类型检索
  searchByType(query, docType) {
    return this.search(query, { type: docType });
  }

  // 获取风控规则
  getRiskRules() {
    return this.searchByType('', DocType.RISK_RULE);
  }
}

// ============================================
// 2. 投资RAG系统 (Investment RAG System)
// ============================================

class InvestmentRAG {
  constructor(llm) {
    this.llm = llm;
    this.knowledgeBase = new InvestmentKnowledgeBase();
  }

  // 检索相关信息
  async retrieve(query, options = {}) {
    const { types = null, topK = 3 } = options;

    let results;

    if (types) {
      // 多类型检索
      results = [];
      for (const type of types) {
        const typeResults = this.knowledgeBase.searchByType(query, type);
        results.push(...typeResults);
      }
    } else {
      results = this.knowledgeBase.search(query);
    }

    return results.slice(0, topK);
  }

  // 构建上下文
  buildContext(documents) {
    const grouped = {};

    for (const doc of documents) {
      if (!grouped[doc.type]) {
        grouped[doc.type] = [];
      }
      grouped[doc.type].push(doc);
    }

    let context = '';

    for (const [type, docs] of Object.entries(grouped)) {
      context += `\n【${type.toUpperCase()}】\n`;
      for (const doc of docs) {
        context += `- ${doc.title}: ${doc.content}\n`;
      }
    }

    return context;
  }

  // 生成投资建议
  async generateAdvice(query, portfolioContext = {}) {
    // 检索相关文档
    const types = [
      DocType.RISK_RULE,
      DocType.FINANCIAL_STATEMENT,
      DocType.RESEARCH_REPORT,
      DocType.TRADE_HISTORY,
    ];

    const retrievedDocs = await this.retrieve(query, { types, topK: 5 });

    console.log(`[RAG] Retrieved ${retrievedDocs.length} documents`);

    // 构建上下文
    const context = this.buildContext(retrievedDocs);

    // 生成建议
    const prompt = ChatPromptTemplate.fromTemplate(
      `作为专业投资顾问，基于以下信息提供投资建议：

当前组合信息:
{portfolio}

知识库检索结果:
{context}

用户问题: {query}

请提供:
1. 分析要点
2. 具体建议
3. 风险提示

注意遵守风控规则。`,
    );

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());

    const advice = await chain.invoke({
      query,
      context,
      portfolio: JSON.stringify(portfolioContext),
    });

    return {
      advice,
      sources: retrievedDocs.map(d => ({
        title: d.title,
        type: d.type,
        relevance: d.score,
      })),
    };
  }

  // 验证是否符合风控规则
  async validateAgainstRules(action, position) {
    const rules = this.knowledgeBase.getRiskRules();
    const violations = [];

    for (const rule of rules) {
      if (rule.metadata?.rule === 'max_drawdown') {
        // 检查回撤
        if (position.currentDrawdown > rule.metadata.threshold) {
          violations.push({
            rule: rule.title,
            severity: 'critical',
            message: `当前回撤${(position.currentDrawdown * 100).toFixed(1)}%超过限制${(rule.metadata.threshold * 100).toFixed(0)}%`,
          });
        }
      }

      if (rule.metadata?.rule === 'position_limit') {
        // 检查仓位
        if (position.singlePosition > rule.metadata.max_single) {
          violations.push({
            rule: rule.title,
            severity: 'warning',
            message: `单只股票仓位${(position.singlePosition * 100).toFixed(1)}%超过建议上限${(rule.metadata.max_single * 100).toFixed(0)}%`,
          });
        }
      }
    }

    return {
      isValid: violations.filter(v => v.severity === 'critical').length === 0,
      violations,
    };
  }
}

// 使用示例
async function demoInvestmentRAG() {
  const rag = new InvestmentRAG(llm);

  console.log('=== 投资RAG系统演示 ===\n');

  // 示例投资查询
  const query = 'AAPL股票现在可以买入吗？';

  // 获取投资建议
  console.log(`查询: ${query}\n`);
  const result = await rag.generateAdvice(query, {
    totalValue: 100000,
    cashRatio: 0.3,
    positions: [{ ticker: 'AAPL', weight: 0.15, currentDrawdown: 0.08 }],
  });

  console.log('=== 投资建议 ===');
  console.log(result.advice);

  console.log('\n=== 参考来源 ===');
  result.sources.forEach(s => {
    console.log(`- ${s.title} (${s.type}, 相关度: ${s.relevance})`);
  });

  // 验证风控规则
  console.log('\n=== 风控验证 ===');
  const validation = await rag.validateAgainstRules('buy', {
    ticker: 'AAPL',
    singlePosition: 0.18,
    currentDrawdown: 0.08,
  });

  console.log(`是否通过: ${validation.isValid}`);
  if (validation.violations.length > 0) {
    console.log('违规项:');
    validation.violations.forEach(v => {
      console.log(`  [${v.severity}] ${v.rule}: ${v.message}`);
    });
  }
}

demoInvestmentRAG();
```

### 本章小结

本章深入探讨了RAG（检索增强生成）模式的核心概念和实现方式。RAG使智能体能够访问和使用训练数据之外的最新或领域特定信息。

### 关键要点回顾

**1. RAG基础 (RAG Basics)**
- RAG通过检索外部知识库来增强LLM的响应
- 三大组件：检索、增强、生成
- 优势：减少幻觉、提供最新信息，可追溯来源

**2. 向量存储 (Vector Stores)**
- 文档向量化用于语义搜索
- 相似度计算（余弦相似度等）
- 文档分块策略

**3. 混合检索 (Hybrid Search)**
- 结合关键词检索和语义检索
- 重排序提升结果质量
- 多源数据融合

**4. 智能体RAG (Agentic RAG)**
- 智能决定何时使用RAG
- 多工具协作
- 投资领域的应用

**5. 投资智能体RAG**
- 构建投资知识库：市场数据、财务报表、风控规则
- 多源数据检索与融合
- 投资决策透明性和可解释性

### RAG最佳实践

1. **文档预处理**：对长文档进行合理分块，保留关键信息
2. **向量化优化**：选择合适的嵌入模型，定期更新向量索引
3. **检索策略**：结合多种检索方法，使用重排序提升质量
4. **来源追溯**：记录检索来源，确保答案可验证
5. **风控集成**：将风控规则纳入RAG系统，确保合规

### RAG应用场景

| 场景 | 应用方式 |
|------|----------|

| 客户服务 | 检索产品文档和常见问题 |
| 研究分析 | 聚合多源学术文献和数据 |
| 投资决策 | 获取实时市场数据和研究报告 |
| 医疗辅助 | 检索医学文献和临床指南 |
| 法律合规 | 检索法规文档和判例 |

### 总结

RAG模式是构建高效智能体的关键技术，它弥合了LLM内部知识与外部实时信息之间的差距。通过本章介绍的模式和技术，开发者可以构建能够访问最新信息、提供准确答案、并具备可解释性的智能体系统。随着向量数据库和检索技术的不断发展，RAG将在更多领域发挥重要作用。

---

_本章代码示例均基于 LangChain JavaScript SDK 实现，可直接在实际项目中使用或根据具体需求进行修改。_

