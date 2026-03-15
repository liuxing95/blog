---
title: 'Chapter 8: Memory Management'
date: '2026-03-15'
excerpt: 'Memory is a critical component of agentic systems, enabling them to retain information across interactions and learn from past experiences. 融合社区洞察与最新研究进展，涵盖 Mem0、Letta、A-MEM 等前沿框架与实践。'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 8: Memory Management

# 第八章：内存管理

## Memory Management Pattern Overview

## 内存管理模式概述

Memory is a critical component of agentic systems, enabling them to retain information across interactions and learn from past experiences.

内存是智能体系统的关键组件，使它们能够保留跨交互的信息并从过去的经验中学习。

Without memory, each interaction would be isolated, and the agent would have no awareness of previous conversations, user preferences, or past actions.

没有内存，每次交互都是孤立的，智能体将无法了解之前的对话、用户偏好或过去的操作。

Effective memory management is essential for creating agents that can maintain context, build relationships with users, and improve over time.

有效的内存管理对于创建能够保持上下文，与用户建立关系并随着时间改进的智能体至关重要。

### Types of Memory

### 内存的类型

**Short-Term Memory**: Also known as working memory, this stores information from the current conversation or task.

**短期内存**: 也称为工作内存，存储当前对话或任务的信息。

This is typically implemented as the context window of the LLM, which has a limited capacity.

这通常实现为LLM的上下文窗口，其容量有限。

**Long-Term Memory**: This stores information that persists across sessions, such as user preferences, past interactions, and learned knowledge.

**长期内存**: 这存储跨会话持久化的信息，如用户偏好、过去的交互和学习到的知识。

This is typically stored in external databases or knowledge bases.

这通常存储在外部数据库或知识库中。

**Episodic Memory**: This stores specific episodes or events, allowing the agent to recall particular interactions or experiences.

**情景内存**: 这存储特定的事件或情景，允许智能体回忆特定的交互或体验。

**Semantic Memory**: This stores general knowledge and facts, separate from specific experiences.

**语义内存**: 这存储一般知识和事实，与特定经验分开。

### Memory Management Strategies

### 内存管理策略

**Summarization**: Compressing past interactions into a concise summary that can fit within the context window.

**总结**: 将过去的交互压缩成简洁的总结，可以放入上下文窗口。

**Retrieval**: Efficiently retrieving relevant memories based on the current context.

**检索**: 基于当前上下文有效地检索相关记忆。

**Prioritization**: Determining which memories are most important to retain and which can be forgotten.

**优先化**: 确定哪些记忆最重要需要保留，哪些可以遗忘。

**Storage Management**: Deciding where and how to store different types of memory.

**存储管理**: 决定不同类型的内存存储在哪里以及如何存储。

### Hands-On Code Example

## 实践代码示例

### 1. Short-Term Memory (短期内存)

以下代码实现了短期内存管理，使用对话历史来维护上下文：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ConversationChain } from 'langchain/chains';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Short-term memory using conversation history
class ShortTermMemory {
  constructor(llm, maxTokens = 2000) {
    this.llm = llm;
    this.maxTokens = maxTokens;
    this.messages = [];
  }

  addMessage(role, content) {
    this.messages.push({ role, content });
    this.trimHistory();
  }

  trimHistory() {
    // Simple implementation - keep last 10 messages
    if (this.messages.length > 10) {
      this.messages = this.messages.slice(-10);
    }
  }

  getContext() {
    return this.messages.map((m) => `${m.role}: ${m.content}`).join('\n');
  }

  async chat(input) {
    this.addMessage('user', input);

    const prompt = ChatPromptTemplate.fromTemplate(
      `Current conversation:
{messages}

User: {input}

AI:`,
    );

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());
    const response = await chain.invoke({
      messages: this.getContext(),
      input: input,
    });

    this.addMessage('assistant', response);
    return response;
  }
}

// Usage
const memory = new ShortTermMemory(llm);

console.log(await memory.chat('My name is John.'));
console.log(await memory.chat("What's my name?"));
console.log(await memory.chat('What was the last thing I told you?'));
```

### 2. Long-Term Memory (长期内存)

以下代码实现了长期内存管理，使用外部存储来持久化信息：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Simulated external storage (in production, use a real database)
const memoryStore = new Map();

// Long-term memory with embeddings (simplified)
class LongTermMemory {
  constructor(llm) {
    this.llm = llm;
    this.store = memoryStore;
  }

  // Store a memory with metadata
  async store(key, content, metadata = {}) {
    const memory = {
      content,
      metadata,
      timestamp: Date.now(),
    };
    this.store.set(key, memory);
    console.log(`Stored memory: ${key}`);
    return memory;
  }

  // Retrieve memories by key
  retrieve(key) {
    return this.store.get(key) || null;
  }

  // Retrieve all memories
  getAll() {
    return Array.from(this.store.values());
  }

  // Search memories (simplified - in production use vector similarity)
  async search(query) {
    const memories = this.getAll();
    // Simple keyword matching
    return memories.filter((m) => m.content.toLowerCase().includes(query.toLowerCase()));
  }

  // Learn from interaction
  async learn(key, content, metadata) {
    return this.store(key, content, metadata);
  }

  // Forget/clear memories
  forget(key) {
    this.store.delete(key);
    console.log(`Deleted memory: ${key}`);
  }
}

// Semantic memory for facts
class SemanticMemory {
  constructor() {
    this.facts = new Map();
  }

  addFact(subject, predicate, object) {
    this.facts.set(`${subject}::${predicate}`, object);
    console.log(`Added fact: ${subject} ${predicate} ${object}`);
  }

  getFact(subject, predicate) {
    return this.facts.get(`${subject}::${predicate}`);
  }

  query(subject) {
    const facts = {};
    for (const [key, value] of this.facts.entries()) {
      if (key.startsWith(`${subject}::`)) {
        const predicate = key.split('::')[1];
        facts[predicate] = value;
      }
    }
    return facts;
  }
}

// Usage
const longTermMemory = new LongTermMemory(llm);
const semanticMemory = new SemanticMemory();

// Store user preferences
await longTermMemory.learn('user:john:prefers', 'Prefers email over phone calls', {
  category: 'communication',
});
await longTermMemory.learn('user:john:interests', 'Interested in AI and machine learning', {
  category: 'interests',
});

// Add semantic facts
semanticMemory.addFact('John', 'lives in', 'New York');
semanticMemory.addFact('John', 'works as', 'Software Engineer');
semanticMemory.addFact('AI', 'stands for', 'Artificial Intelligence');

// Retrieve
console.log(longTermMemory.retrieve('user:john:prefers'));
console.log(semanticMemory.query('John'));
```

### 3. Memory with Summarization (带总结的内存)

以下代码实现了带自动总结的内存管理策略：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0.7 });

// Memory with automatic summarization
class SummarizingMemory {
  constructor(llm, maxMessages = 10) {
    this.llm = llm;
    this.maxMessages = maxMessages;
    this.messages = [];
    this.summary = "";
  }

  async addMessage(role, content) {
    this.messages.push({ role, content });

    // If we exceed max messages, summarize older ones
    if (this.messages.length > this.maxMessages) {
      await this.summarize();
    }
  }

  async summarize() {
    if (this.messages.length < 5) return;

    const messagesToSummarize = this.messages.slice(0, -5);
    const keepMessages = this.messages.slice(-5);

    const summarizePrompt = ChatPromptTemplate.fromTemplate(
      `Summarize the following conversation concisely, preserving key information:

{messages}`
    );

    const chain = summarizePrompt.pipe(this.llm).pipe(new StringOutputParser());
    this.summary = await chain.invoke({
      messages: messagesToSummarize.map(m => `${m.role}: ${m.content}`).join('\n')
    });

    this.messages = keepMessages;
    console.log("Memory summarized:", this.summary.substring(0, 100) + "...");
  }

  getContext() {
    let context = "";
    if (this.summary) {
      context += `Previous conversation summary: ${this.summary}\n\n`;
    }
    context += "Recent messages:\n" + this.messages.map(m => `${m.role}: ${m.content}`).join('\n');
    return context;
  }

  async chat(input) {
    await this.addMessage('user', input);

    const prompt = ChatPromptTemplate.fromTemplate(
      `{context}

User: {input}

AI:`
    );

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());
    const response = await chain.invoke({
      context: this.getContext(),
      input: input
    });

    await this.addMessage('assistant', response);
    return response;
  }
}

// Usage
const memory = new SummarizingMemory(llm);

// Simulate a long conversation
await memory.chat("I bought a new car last week.");
await memory.chat("It's a red Tesla Model 3.");
await memory.chat("I use it for my daily commute to work.");
await memory.chat("The commute is about 30 miles each way.");
await memory.chat("I charge it at home overnight.");
await memory.chat("My previous car was a Honda Accord.");
await memory.chat("I sold it to my neighbor.");
await memory.chat("I prefer the Tesla because of lower maintenance.");
await memory.chat("What's your opinion on electric vehicles?");
await memory.chat("Should I get a home charger installed?");

// The system should have summarized earlier messages
console.log("\n--- Final Response ---`);
```

### 4. Episodic Memory (情景记忆)

以下代码实现了情景记忆模式，存储和检索特定交互经历：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Episodic memory for storing specific interactions
class EpisodicMemory {
  constructor(llm) {
    this.llm = llm;
    this.episodes = [];
  }

  // Store a new episode
  async storeEpisode(title, events, outcome, metadata = {}) {
    const episode = {
      id: Date.now(),
      title,
      events,
      outcome,
      metadata,
      timestamp: new Date().toISOString(),
    };

    // Generate a summary for quick retrieval
    const summaryPrompt = ChatPromptTemplate.fromTemplate(
      `Create a brief one-sentence summary of this episode:

Title: {title}
Events: {events}
Outcome: {outcome}`,
    );

    const chain = summaryPrompt.pipe(this.llm).pipe(new StringOutputParser());
    episode.summary = await chain.invoke({ title, events, outcome });

    this.episodes.push(episode);
    console.log(`Stored episode: ${episode.summary}`);
    return episode;
  }

  // Retrieve episode by ID
  getEpisode(id) {
    return this.episodes.find((e) => e.id === id);
  }

  // Get recent episodes
  getRecentEpisodes(count = 5) {
    return this.episodes.slice(-count).reverse();
  }

  // Find episodes by similarity (simplified)
  async findEpisodes(query) {
    const relevant = [];
    for (const episode of this.episodes) {
      // Simple relevance check
      const text = `${episode.title} ${episode.events} ${episode.outcome}`.toLowerCase();
      if (text.includes(query.toLowerCase())) {
        relevant.push(episode);
      }
    }
    return relevant;
  }

  // Learn from past episodes
  async learnFromPast(query) {
    const relevant = await this.findEpisodes(query);

    if (relevant.length === 0) return 'No relevant past experiences found.';

    const learnPrompt = ChatPromptTemplate.fromTemplate(
      `Based on these past experiences:

{experiences}

What lessons can be learned to apply to a new similar situation?`,
    );

    const chain = learnPrompt.pipe(this.llm).pipe(new StringOutputParser());
    return chain.invoke({
      experiences: relevant.map((e) => `Episode: ${e.summary}\nOutcome: ${e.outcome}`).join('\n\n'),
    });
  }
}

// Usage
const episodicMemory = new EpisodicMemory(llm);

// Store some trading episodes
await episodicMemory.storeEpisode(
  'First stock purchase',
  'Researched AAPL, read analyst reports, decided to buy',
  'Bought 10 shares at $150, now worth $180',
  { type: 'trading', stock: 'AAPL' },
);

await episodicMemory.storeEpisode(
  'Crypto investment',
  'Saw trending topic about Bitcoin, bought immediately',
  'Lost 20% due to market correction',
  { type: 'trading', asset: 'Bitcoin' },
);

await episodicMemory.storeEpisode(
  'Dividend investing',
  'Researched dividend stocks, picked stable companies',
  'Portfolio generates passive income quarterly',
  { type: 'investing', strategy: 'dividend' },
);

// Query past experiences
console.log('\n--- Learning from past ---');
const lessons = await episodicMemory.learnFromPast('stock trading');
console.log(lessons);
```

### 5. Priority-Based Memory (基于优先级的内存)

以下代码实现了基于优先级的内存管理，根据重要性决定保留或遗忘哪些记忆：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Memory item with priority
class MemoryItem {
  constructor(content, priority = 5, metadata = {}) {
    this.id = Date.now() + Math.random();
    this.content = content;
    this.priority = priority; // 0-10 scale
    this.metadata = metadata;
    this.accessCount = 0;
    this.lastAccessed = Date.now();
    this.createdAt = Date.now();
  }

  access() {
    this.accessCount++;
    this.lastAccessed = Date.now();
  }

  // Calculate importance score based on multiple factors
  getImportanceScore() {
    const recencyScore = Math.max(0, 10 - (Date.now() - this.lastAccessed) / (1000 * 60 * 60)); // Decay over hours
    const usageScore = Math.min(5, this.accessCount);
    return this.priority * 0.5 + recencyScore * 0.3 + usageScore * 0.2;
  }
}

// Priority-based memory manager
class PriorityMemory {
  constructor(llm, maxSize = 100) {
    this.llm = llm;
    this.maxSize = maxSize;
    this.memories = [];
  }

  // Add a new memory with auto-calculated priority
  async addMemory(content, metadata = {}) {
    // Use LLM to assess importance
    const priorityPrompt = ChatPromptTemplate.fromTemplate(
      `Rate the importance of this memory from 0-10:
Memory: {content}

Metadata: {metadata}

Respond with only a number:`,
    );

    const chain = priorityPrompt.pipe(this.llm).pipe(new StringOutputParser());
    const priority =
      parseInt(await chain.invoke({ content, metadata: JSON.stringify(metadata) })) || 5;

    const memory = new MemoryItem(content, Math.min(10, Math.max(0, priority)), metadata);
    this.memories.push(memory);

    // Evict lowest priority memories if over capacity
    if (this.memories.length > this.maxSize) {
      this.evictLowPriority();
    }

    console.log(`Added memory with priority ${priority}: ${content.substring(0, 50)}...`);
    return memory;
  }

  // Remove lowest priority memories
  evictLowPriority() {
    // Sort by importance score and remove bottom 10%
    this.memories.sort((a, b) => b.getImportanceScore() - a.getImportanceScore());
    const toRemove = Math.floor(this.maxSize * 0.1);
    const removed = this.memories.splice(0, toRemove);
    console.log(`Evicted ${removed.length} low-priority memories`);
  }

  // Retrieve most important memories for current context
  async retrieveForContext(context, limit = 5) {
    // Calculate relevance to current context
    const contextLower = context.toLowerCase();

    const scoredMemories = this.memories.map((memory) => {
      memory.access();
      const relevanceScore = memory.content.toLowerCase().includes(contextLower) ? 5 : 0;
      const importanceScore = memory.getImportanceScore();
      return {
        memory,
        totalScore: importanceScore * 0.6 + relevanceScore * 0.4,
      };
    });

    // Sort by total score
    scoredMemories.sort((a, b) => b.totalScore - a.totalScore);

    return scoredMemories.slice(0, limit).map((s) => s.memory);
  }

  // Get all memories sorted by importance
  getTopMemories(limit = 10) {
    return [...this.memories]
      .sort((a, b) => b.getImportanceScore() - a.getImportanceScore())
      .slice(0, limit);
  }
}

// Usage
const priorityMemory = new PriorityMemory(llm);

// Add memories with different priorities
await priorityMemory.addMemory('User prefers morning meetings', { category: 'preference' });
await priorityMemory.addMemory('User is allergic to nuts', { category: 'health', critical: true });
await priorityMemory.addMemory("User's birthday is December 25th", {
  category: 'personal',
  important: true,
});
await priorityMemory.addMemory('User likes coffee with milk', { category: 'preference' });
await priorityMemory.addMemory('User works as a software engineer', { category: 'work' });

// Simulate context - user is planning a meeting
const relevantMemories = await priorityMemory.retrieveForContext('meeting schedule');
console.log('\n--- Relevant memories for meeting context ---');
relevantMemories.forEach((m) => console.log(`- ${m.content}`));

// Get top priority memories
console.log('\n--- Top priority memories ---');
const topMemories = priorityMemory.getTopMemories(3);
topMemories.forEach((m) =>
  console.log(`- ${m.content} (score: ${m.getImportanceScore().toFixed(2)})`),
);
```

### 6. Vector-Based Memory Retrieval (基于向量的记忆检索)

以下代码实现了基于向量相似度的记忆检索系统：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Simple embedding simulation (in production, use actual embeddings like OpenAIEmbeddings)
function simpleEmbedding(text) {
  // Create a simple hash-based pseudo-embedding
  const hash = text.split('').reduce((acc, char) => {
    return (acc << 5) - acc + char.charCodeAt(0);
  }, 0);

  // Convert to fixed-size vector
  const vector = [];
  let seed = Math.abs(hash);
  for (let i = 0; i < 64; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    vector.push((seed % 1000) / 1000);
  }
  return vector;
}

// Cosine similarity between two vectors
function cosineSimilarity(vec1, vec2) {
  const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  return dotProduct / (mag1 * mag2);
}

// Vector-based memory with semantic search
class VectorMemory {
  constructor(llm) {
    this.llm = llm;
    this.memories = [];
  }

  // Store memory with embedding
  async store(key, content, metadata = {}) {
    const embedding = simpleEmbedding(content);

    const memory = {
      key,
      content,
      metadata,
      embedding,
      timestamp: Date.now(),
    };

    this.memories.push(memory);
    console.log(`Stored memory: ${key} (embedding created)`);
    return memory;
  }

  // Semantic search using vector similarity
  async semanticSearch(query, topK = 3) {
    // Generate embedding for query
    const queryEmbedding = simpleEmbedding(query);

    // Calculate similarity scores
    const results = this.memories.map((memory) => ({
      memory,
      similarity: cosineSimilarity(queryEmbedding, memory.embedding),
    }));

    // Sort by similarity and return top K
    results.sort((a, b) => b.similarity - a.similarity);

    const topResults = results.slice(0, topK);
    console.log(`\nSemantic search for "${query}":`);
    topResults.forEach((r) => {
      console.log(`  - ${r.memory.key} (similarity: ${r.similarity.toFixed(4)})`);
      console.log(`    ${r.memory.content}`);
    });

    return topResults.map((r) => ({
      key: r.memory.key,
      content: r.memory.content,
      metadata: r.memory.metadata,
      similarity: r.similarity,
    }));
  }

  // Hybrid search: keyword + semantic
  async hybridSearch(query, topK = 3) {
    const queryLower = query.toLowerCase();

    // Score based on keyword matches
    const keywordScores = this.memories.map((memory) => {
      const contentLower = memory.content.toLowerCase();
      const keyLower = memory.key.toLowerCase();

      let score = 0;
      const queryWords = queryLower.split(' ');

      for (const word of queryWords) {
        if (contentLower.includes(word)) score += 1;
        if (keyLower.includes(word)) score += 2;
      }

      return { memory, keywordScore: score };
    });

    // Get semantic results
    const semanticResults = await this.semanticSearch(query, this.memories.length);

    // Combine scores (weighted)
    const combinedResults = this.memories.map((memory) => {
      const keywordResult = keywordScores.find((k) => k.memory.key === memory.key);
      const semanticResult = semanticResults.find((s) => s.key === memory.key);

      const combinedScore =
        (keywordResult ? keywordResult.keywordScore * 0.4 : 0) +
        (semanticResult ? semanticResult.similarity * 0.6 : 0);

      return { memory, combinedScore };
    });

    // Sort by combined score
    combinedResults.sort((a, b) => b.combinedScore - a.combinedScore);

    return combinedResults.slice(0, topK).map((r) => ({
      key: r.memory.key,
      content: r.memory.content,
      score: r.combinedScore,
    }));
  }
}

// Usage
const vectorMemory = new VectorMemory(llm);

// Store various memories
await vectorMemory.store('project_deadline', 'The Q4 project deadline is December 15th', {
  type: 'work',
});
await vectorMemory.store('meeting_notes', 'Team meeting every Tuesday at 2pm', {
  type: 'schedule',
});
await vectorMemory.store('client_preferences', 'Client prefers email communication over phone', {
  type: 'preference',
});
await vectorMemory.store('budget_info', 'Marketing budget for 2024 is $50,000', {
  type: 'finance',
});
await vectorMemory.store('tech_stack', 'Team uses React and Node.js for development', {
  type: 'technical',
});

// Semantic search
await vectorMemory.semanticSearch('team schedule meeting time');

// Hybrid search
console.log('\n--- Hybrid Search ---');
const hybridResults = await vectorMemory.hybridSearch('when is the team meeting');
console.log(hybridResults);
```

### 7. Complete Integrated Memory System (完整的集成内存系统)

以下代码实现了一个完整的集成内存系统，结合了短期、长期、情景和语义记忆：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Integrated Memory System combining all memory types
class IntegratedMemorySystem {
  constructor(llm) {
    this.llm = llm;

    // Short-term memory (conversation history)
    this.shortTerm = {
      messages: [],
      maxLength: 10,
      add(role, content) {
        this.messages.push({ role, content, timestamp: Date.now() });
        if (this.messages.length > this.maxLength) {
          this.messages = this.messages.slice(-this.maxLength);
        }
      },
      getHistory() {
        return this.messages.map((m) => `${m.role}: ${m.content}`).join('\n');
      },
      clear() {
        this.messages = [];
      },
    };

    // Long-term memory (persistent storage)
    this.longTerm = new Map();

    // Semantic memory (facts and knowledge)
    this.semantic = new Map();

    // Episodic memory (experiences)
    this.episodes = [];
  }

  // --- Short-Term Memory Operations ---

  addToShortTerm(role, content) {
    this.shortTerm.add(role, content);
  }

  getShortTermContext() {
    return this.shortTerm.getHistory();
  }

  // --- Long-Term Memory Operations ---

  async storeLongTerm(key, content, category = 'general') {
    const memory = {
      content,
      category,
      timestamp: Date.now(),
      accessCount: 0,
    };
    this.longTerm.set(key, memory);
    console.log(`Stored to long-term: ${key}`);
    return memory;
  }

  retrieveLongTerm(key) {
    const memory = this.longTerm.get(key);
    if (memory) {
      memory.accessCount++;
    }
    return memory;
  }

  searchLongTerm(query) {
    const results = [];
    for (const [key, memory] of this.longTerm.entries()) {
      if (memory.content.toLowerCase().includes(query.toLowerCase())) {
        results.push({ key, ...memory });
      }
    }
    return results;
  }

  // --- Semantic Memory Operations ---

  addSemanticFact(subject, predicate, object) {
    const key = `${subject}::${predicate}`;
    this.semantic.set(key, object);
    console.log(`Added semantic fact: ${subject} ${predicate} ${object}`);
  }

  getSemanticFact(subject, predicate) {
    return this.semantic.get(`${subject}::${predicate}`);
  }

  querySemanticSubject(subject) {
    const facts = {};
    for (const [key, value] of this.semantic.entries()) {
      if (key.startsWith(`${subject}::`)) {
        const predicate = key.split('::')[1];
        facts[predicate] = value;
      }
    }
    return facts;
  }

  // --- Episodic Memory Operations ---

  async storeEpisode(title, events, outcome) {
    const episode = {
      id: Date.now(),
      title,
      events,
      outcome,
      timestamp: new Date().toISOString(),
    };

    // Generate summary
    const prompt = ChatPromptTemplate.fromTemplate(
      `Summarize this episode in one sentence: {title} - {events}`,
    );
    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());
    episode.summary = await chain.invoke({ title, events });

    this.episodes.push(episode);
    return episode;
  }

  getRecentEpisodes(count = 5) {
    return this.episodes.slice(-count).reverse();
  }

  // --- Unified Retrieval ---

  async retrieveRelevant(query, options = {}) {
    const {
      includeShortTerm = true,
      includeLongTerm = true,
      includeSemantic = true,
      includeEpisodes = true,
      maxResults = 5,
    } = options;

    const results = [];

    // Short-term
    if (includeShortTerm) {
      const history = this.shortTerm.getHistory();
      if (history.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'short-term', source: 'current conversation', relevance: 1.0 });
      }
    }

    // Long-term
    if (includeLongTerm) {
      const ltResults = this.searchLongTerm(query);
      results.push(...ltResults.map((r) => ({ type: 'long-term', ...r, relevance: 0.8 })));
    }

    // Semantic
    if (includeSemantic) {
      const queryLower = query.toLowerCase();
      const queryWords = queryLower.split(' ');

      for (const [key, value] of this.semantic.entries()) {
        const [subject, predicate] = key.split('::');
        for (const word of queryWords) {
          if (subject.toLowerCase().includes(word) || value.toLowerCase().includes(word)) {
            results.push({ type: 'semantic', subject, predicate, object: value, relevance: 0.9 });
            break;
          }
        }
      }
    }

    // Episodes
    if (includeEpisodes) {
      const queryLower = query.toLowerCase();
      for (const episode of this.episodes) {
        const text = `${episode.title} ${episode.events} ${episode.outcome}`.toLowerCase();
        if (text.includes(queryLower)) {
          results.push({ type: 'episode', ...episode, relevance: 0.7 });
        }
      }
    }

    // Sort by relevance and limit
    results.sort((a, b) => b.relevance - a.relevance);
    return results.slice(0, maxResults);
  }

  // --- Chat with Full Memory ---

  async chat(input) {
    this.addToShortTerm('user', input);

    // Retrieve relevant memories
    const relevantMemories = await this.retrieveRelevant(input);

    // Build context
    let context = '';
    if (relevantMemories.length > 0) {
      context += 'Relevant memories:\n';
      relevantMemories.forEach((m, i) => {
        if (m.type === 'long-term') context += `${i + 1}. [Long-term] ${m.content}\n`;
        if (m.type === 'semantic')
          context += `${i + 1}. [Fact] ${m.subject} ${m.predicate} ${m.object}\n`;
        if (m.type === 'episode') context += `${i + 1}. [Episode] ${m.summary}\n`;
      });
      context += '\n';
    }

    context += 'Current conversation:\n' + this.getShortTermContext();

    // Generate response
    const prompt = ChatPromptTemplate.fromTemplate(
      `{context}

User: {input}

Assistant:`,
    );

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());
    const response = await chain.invoke({ context, input });

    this.addToShortTerm('assistant', response);
    return { response, memories: relevantMemories };
  }
}

// Usage
const memorySystem = new IntegratedMemorySystem(llm);

// Populate different memory types
memorySystem.addToShortTerm('user', "I'm looking for information about our project.");
memorySystem.addToShortTerm(
  'assistant',
  "I'd be happy to help! What specific information do you need?",
);

// Long-term memory
await memorySystem.storeLongTerm(
  'project_alpha',
  'Project Alpha is a machine learning initiative',
  'project',
);
await memorySystem.storeLongTerm('budget_2024', '2024 budget is $100,000', 'finance');

// Semantic memory
memorySystem.addSemanticFact('Project Alpha', 'lead by', 'John Smith');
memorySystem.addSemanticFact('Project Alpha', 'deadline', 'March 2024');

// Episodic memory
await memorySystem.storeEpisode(
  'Client meeting',
  'Discussed project timeline and budget constraints',
  'Agreed to 3-month extension',
);

// Chat with full memory context
console.log('\n--- Chat with Integrated Memory ---');
const result = await memorySystem.chat('Tell me about Project Alpha');
console.log('Response:', result.response);
console.log('\nRetrieved memories:', result.memories);
```

### 8. User Profile Memory (用户画像内存)

以下代码实现了用户画像内存管理，用于存储和检索用户偏好、特征和行为模式：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// User profile memory for personalized interactions
class UserProfileMemory {
  constructor(llm) {
    this.llm = llm;
    this.profiles = new Map();
  }

  // Create or update user profile
  async updateProfile(userId, interactionData) {
    let profile = this.profiles.get(userId) || {
      userId,
      preferences: {},
      traits: {},
      history: [],
      statistics: {
        totalInteractions: 0,
        topics: new Map(),
        sentiment: { positive: 0, neutral: 0, negative: 0 },
      },
    };

    // Analyze interaction to extract preferences and traits
    const analysisPrompt = ChatPromptTemplate.fromTemplate(
      `Analyze this user interaction and extract:
1. Preferences (communication style, interests, etc.)
2. Traits (patience level, detail level, etc.)

Interaction: {interaction}

Respond in JSON format:
{
  "preferences": {"key": "value"},
  "traits": {"key": "value"}
}`,
    );

    try {
      const chain = analysisPrompt.pipe(this.llm).pipe(new StringOutputParser());
      const analysis = JSON.parse(await chain.invoke({ interaction: interactionData }));

      // Merge preferences
      profile.preferences = { ...profile.preferences, ...analysis.preferences };
      profile.traits = { ...profile.traits, ...analysis.traits };
    } catch (e) {
      console.log('Analysis parse error, using basic extraction');
    }

    // Update statistics
    profile.statistics.totalInteractions++;
    profile.history.push({
      timestamp: Date.now(),
      data: interactionData,
    });

    // Keep only last 100 interactions
    if (profile.history.length > 100) {
      profile.history = profile.history.slice(-100);
    }

    this.profiles.set(userId, profile);
    console.log(`Updated profile for user ${userId}`);
    return profile;
  }

  // Get user profile
  getProfile(userId) {
    return this.profiles.get(userId) || null;
  }

  // Get preference
  getPreference(userId, key) {
    const profile = this.profiles.get(userId);
    return profile ? profile.preferences[key] : null;
  }

  // Get trait
  getTrait(userId, key) {
    const profile = this.profiles.get(userId);
    return profile ? profile.traits[key] : null;
  }

  // Generate personalized response style based on profile
  getResponseStyle(userId) {
    const profile = this.profiles.get(userId);
    if (!profile) return {};

    const style = {
      formality: profile.preferences.formality || 'neutral',
      detailLevel: profile.preferences.detailLevel || 'medium',
      communicationStyle: profile.preferences.communicationStyle || 'friendly',
    };

    return style;
  }

  // Generate summary of user
  async generateProfileSummary(userId) {
    const profile = this.profiles.get(userId);
    if (!profile) return 'No profile found for this user.';

    const summaryPrompt = ChatPromptTemplate.fromTemplate(
      `Create a brief summary of this user profile:

Preferences: {preferences}
Traits: {traits}
Total Interactions: {totalInteractions}

User Summary:`,
    );

    const chain = summaryPrompt.pipe(this.llm).pipe(new StringOutputParser());
    return chain.invoke({
      preferences: JSON.stringify(profile.preferences),
      traits: JSON.stringify(profile.traits),
      totalInteractions: profile.statistics.totalInteractions,
    });
  }
}

// Usage
const userProfile = new UserProfileMemory(llm);

// Simulate user interactions and build profile
await userProfile.updateProfile('user_123', 'I prefer concise responses, just give me the facts');
await userProfile.updateProfile(
  'user_123',
  'Can you explain this in more detail? I like thorough explanations',
);
await userProfile.updateProfile('user_123', 'Please format your answers with bullet points');

// Get user profile
const profile = userProfile.getProfile('user_123');
console.log('\n--- User Profile ---');
console.log('Preferences:', profile.preferences);
console.log('Traits:', profile.traits);
console.log('Total Interactions:', profile.statistics.totalInteractions);

// Get response style
const responseStyle = userProfile.getResponseStyle('user_123');
console.log('\n--- Response Style ---');
console.log(responseStyle);

// Generate summary
const summary = await userProfile.generateProfileSummary('user_123');
console.log('\n--- Profile Summary ---');
console.log(summary);
```

## Practical Applications & Use Cases

## 实际应用和用例

### 投资智能体

在设计一个投资智能体时，内存管理至关重要。它不仅需要处理当前的实时市场数据，还需要牢记用户的长期投资目标和过往的交易教训。

根据系统架构原则，投资智能体的内存设计可以明确划分为**短期记忆（Short-Term Memory）**和**长期记忆（Long-Term Memory）**，具体设计如下：

### 1. 短期记忆（工作记忆 / 上下文内存）

短期记忆存在于大语言模型（LLM）的**上下文窗口（Context Window）**中，它的生命周期通常等于一次会话（Session），用于处理当前的投资分析或交易任务。

对于投资智能体，短期记忆的设计重点在于**维护当前交易的上下文和状态**：

- **交互与工具输出流：** 存储用户刚刚提出的请求（如“帮我分析微软”）、智能体调用 API 获取的实时股票报价、以及刚刚抓取的突发新闻片段。
- **临时状态管理（State Management）：** 利用框架（如 ADK 的 `session.state`）存储当前处理流程中的关键变量。例如，当用户准备下单时，状态字典中会临时记录 `{"pending_trade": {"ticker": "MSFT", "action": "buy", "shares": 100}, "risk_check_passed": True}`。一旦交易完成或会话结束，这些临时状态就会被清理或归档。
- **反思与中间推理：** 存储智能体在得出最终投资建议前的“思考过程”（如：“基本面数据看起来不错，但刚刚获取的情绪分析显示市场存在恐慌，我建议暂缓买入”）。
- **上下文修剪策略：** 财务报告（如 10-K 文件）通常非常长。为了避免撑爆有限的上下文窗口，智能体需要采用摘要技术，只提取并保留长财报中最核心的财务指标在短期记忆中。

### 2. 长期记忆（持久知识与经验）

长期记忆是跨会话、跨任务持久存在的，通常存储在**向量数据库（Vector Databases）**或传统数据库中，通过语义检索或 SQL 查询来访问。

借鉴 LangGraph 对长期记忆的细分，投资智能体的长期记忆应设计为以下三个维度：

- **语义记忆 (Semantic Memory - 事实与偏好)：**
  - **用户画像库：** 记住特定用户的绝对事实，如“风险承受能力低”、“偏好 ESG（环保）概念股”、“目标年化收益率 8%”等。
  - **市场基础知识：** 存储不需要频繁更新的金融概念或宏观经济事实。
- **情节记忆 (Episodic Memory - 经验与历史)：**
  - **交易日志与复盘：** 记录过去的重大交易事件及结果（例如：“2024 年 1 月在财报发布前买入了某科技股，结果大跌导致亏损”）。智能体在未来面对类似市场行情时，可以检索这些“情节”，作为反思和调整当前策略的依据。
- **程序记忆 (Procedural Memory - 规则与合规)：**
  - **风控护栏（Guardrails）：** 牢记不可违背的核心操作指令或机构合规要求。例如：“单一股票仓位绝不能超过总资产的 5%”、“当回撤达到 10% 时必须自动触发平仓指令并升级给人类顾问”。

### 3. 长短期记忆的协同机制 (RAG 与检索)

在实际操作中，投资智能体会通过 **RAG（检索增强生成）** 技术将两者结合。
当用户询问“我现在的持仓是否需要应对中东局势做出调整？”时：

1.  智能体首先从**长期记忆**（数据库）中检索出用户的“当前持仓明细”和“风险偏好”（语义记忆）。
2.  利用外部工具检索关于中东局势的最新研报，如果涉及复杂的供应链影响，可能会动用 **GraphRAG（图 RAG）** 来分析公司与地缘政治实体之间的关系。
3.  将这些历史偏好、持仓数据和最新研报提取成“块（Chunks）”，注入到当前的**短期记忆（上下文窗口）**中。
4.  智能体在短期记忆的"工作台"上综合所有信息，生成个性化且有数据支撑的调仓建议。

### 投资智能体代码示例

以下代码示例展示了投资智能体的完整内存管理体系：

#### 1. 短期记忆 - 交易上下文管理

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// 投资智能体短期记忆 - 交易上下文管理
class TradingShortTermMemory {
  constructor(llm, maxTokens = 4000) {
    this.llm = llm;
    this.maxTokens = maxTokens;
    this.messages = [];
    this.state = {
      pending_trade: null, // 待执行交易
      risk_check_passed: null, // 风控检查结果
      current_analysis: null, // 当前分析标的
      news_context: [], // 新闻上下文
    };
  }

  // 添加用户请求
  addUserRequest(request) {
    this.messages.push({
      role: 'user',
      content: request,
      timestamp: Date.now(),
      type: 'request',
    });
    this._updateCurrentAnalysis(request);
  }

  // 添加工具输出（股票报价、新闻等）
  addToolOutput(toolName, output) {
    this.messages.push({
      role: 'system',
      content: `[${toolName}]: ${JSON.stringify(output)}`,
      timestamp: Date.now(),
      type: 'tool_output',
    });

    // 根据工具类型更新状态
    if (toolName === 'stock_quote') {
      this.state.current_analysis = output.symbol;
    }
    if (toolName === 'news') {
      this.state.news_context.push(...output.articles.slice(0, 3));
    }
  }

  // 添加中间推理过程
  addReasoning(reasoning) {
    this.messages.push({
      role: 'system',
      content: `[思考]: ${reasoning}`,
      timestamp: Date.now(),
      type: 'reasoning',
    });
  }

  // 设置待执行交易状态
  setPendingTrade(trade) {
    this.state.pending_trade = trade;
    console.log(`设置待执行交易: ${trade.action} ${trade.shares}股 ${trade.ticker}`);
  }

  // 设置风控检查结果
  setRiskCheck(passed, reason = '') {
    this.state.risk_check_passed = passed;
    console.log(`风控检查: ${passed ? '通过' : '拒绝'} - ${reason}`);
  }

  // 从请求中提取当前分析标的
  _updateCurrentAnalysis(request) {
    const tickerMatch = request.match(/\b[A-Z]{1,5}\b/);
    if (tickerMatch && !['USD', 'CEO', 'ETF', 'API'].includes(tickerMatch[0])) {
      this.state.current_analysis = tickerMatch[0];
    }
  }

  // 修剪过长的上下文（财务报告摘要策略）
  async trimContext() {
    if (this.messages.length < 8) return;

    // 对旧消息进行摘要
    const oldMessages = this.messages.slice(0, -4);
    const recentMessages = this.messages.slice(-4);

    const summaryPrompt = ChatPromptTemplate.fromTemplate(
      `将以下投资分析对话摘要为关键信息保留:
{messages}

保留: 用户意图、已分析标的、关键结论、待处理事项`,
    );

    const chain = summaryPrompt.pipe(this.llm).pipe(new StringOutputParser());
    const summary = await chain.invoke({
      messages: oldMessages.map((m) => m.content).join('\n\n'),
    });

    this.messages = [
      { role: 'system', content: `[摘要]: ${summary}`, timestamp: Date.now(), type: 'summary' },
      ...recentMessages,
    ];
    console.log('上下文已修剪');
  }

  // 获取当前上下文
  getContext() {
    let context = '交易状态:\n';
    context += `- 当前分析标的: ${this.state.current_analysis || '无'}\n`;
    context += `- 待执行交易: ${JSON.stringify(this.state.pending_trade || '无')}\n`;
    context += `- 风控检查: ${this.state.risk_check_passed === null ? '未检查' : this.state.risk_check_passed ? '通过' : '拒绝'}\n`;
    context += '\n对话历史:\n';
    context += this.messages.map((m) => `${m.role}: ${m.content}`).join('\n');
    return context;
  }

  // 清空状态（交易完成后）
  clearState() {
    this.state = {
      pending_trade: null,
      risk_check_passed: null,
      current_analysis: null,
      news_context: [],
    };
    console.log('交易状态已清空');
  }
}

// 使用示例
const tradingMemory = new TradingShortTermMemory(llm);

// 模拟交易流程
tradingMemory.addUserRequest('帮我分析一下MSFT的买入时机');
tradingMemory.addToolOutput('stock_quote', { symbol: 'MSFT', price: 378.5, change: '+1.2%' });
tradingMemory.addToolOutput('news', {
  articles: [{ title: 'MSFT发布财报', sentiment: 'positive' }],
});
tradingMemory.addReasoning('基本面数据良好，但市场存在恐慌情绪，建议暂缓买入');
tradingMemory.setPendingTrade({ ticker: 'MSFT', action: 'buy', shares: 100, price: 378.5 });
tradingMemory.setRiskCheck(true);

console.log('\n--- 当前上下文 ---');
console.log(tradingMemory.getContext());
```

#### 2. 语义记忆 - 用户画像与偏好

```javascript
import { ChatOpenAI } from '@langchain/openai';

// 投资智能体语义记忆 - 用户画像与偏好
class InvestmentSemanticMemory {
  constructor(llm) {
    this.llm = llm;
    // 用户画像库
    this.userProfiles = new Map();
    // 市场基础知识库
    this.marketKnowledge = new Map();
  }

  // 存储用户画像
  async storeUserProfile(userId, profile) {
    const defaultProfile = {
      riskTolerance: 'moderate', // 风险承受能力: conservative/moderate/aggressive
      esgPreference: false, // ESG偏好
      targetReturn: 0.08, // 目标年化收益率 8%
      preferredSectors: [], // 偏好行业
      investmentHorizon: 'medium', // 投资期限: short/medium/long
      maxPositionSize: 0.05, // 单只股票最大仓位 5%
      maxDrawdown: 0.1, // 最大回撤容忍度 10%
      communicationStyle: 'balanced', // 沟通风格
    };

    const fullProfile = { ...defaultProfile, ...profile, userId, updatedAt: Date.now() };
    this.userProfiles.set(userId, fullProfile);
    console.log(`已更新用户画像: ${userId}`, fullProfile);
    return fullProfile;
  }

  // 获取用户画像
  getUserProfile(userId) {
    return this.userProfiles.get(userId) || null;
  }

  // 提取并更新用户偏好（从对话中）
  async extractPreference(userId, conversation) {
    const lowerConv = conversation.toLowerCase();
    const preferences = {};

    if (lowerConv.includes('保守') || lowerConv.includes('低风险')) {
      preferences.riskTolerance = 'conservative';
    } else if (lowerConv.includes('激进') || lowerConv.includes('高风险')) {
      preferences.riskTolerance = 'aggressive';
    }

    if (lowerConv.includes('esg') || lowerConv.includes('环保') || lowerConv.includes('可持续')) {
      preferences.esgPreference = true;
    }

    if (preferences.riskTolerance || preferences.esgPreference) {
      const current = this.userProfiles.get(userId) || {};
      await this.storeUserProfile(userId, { ...current, ...preferences });
    }
  }

  // 存储市场基础知识
  storeMarketKnowledge(key, knowledge) {
    this.marketKnowledge.set(key, {
      content: knowledge,
      timestamp: Date.now(),
    });
    console.log(`已存储市场知识: ${key}`);
  }

  // 检索市场知识
  retrieveMarketKnowledge(query) {
    const results = [];
    for (const [key, value] of this.marketKnowledge.entries()) {
      if (value.content.toLowerCase().includes(query.toLowerCase())) {
        results.push({ key, ...value });
      }
    }
    return results;
  }

  // 获取用户风险参数
  getRiskParameters(userId) {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      return { maxPositionSize: 0.05, maxDrawdown: 0.1 }; // 默认值
    }
    return {
      maxPositionSize: profile.maxPositionSize,
      maxDrawdown: profile.maxDrawdown,
      riskTolerance: profile.riskTolerance,
    };
  }

  // 生成用户画像摘要
  generateProfileSummary(userId) {
    const profile = this.userProfiles.get(userId);
    if (!profile) return '暂无用户画像';

    return `
用户画像摘要:
- 风险承受能力: ${profile.riskTolerance}
- ESG偏好: ${profile.esgPreference ? '是' : '否'}
- 目标年化收益率: ${(profile.targetReturn * 100).toFixed(0)}%
- 投资期限: ${profile.investmentHorizon}
- 单只股票最大仓位: ${(profile.maxPositionSize * 100).toFixed(0)}%
- 最大回撤容忍: ${(profile.maxDrawdown * 100).toFixed(0)}%
`.trim();
  }
}

// 使用示例
const semanticMemory = new InvestmentSemanticMemory(llm);

// 存储用户画像
await semanticMemory.storeUserProfile('user001', {
  riskTolerance: 'conservative',
  esgPreference: true,
  targetReturn: 0.08,
  investmentHorizon: 'long',
  preferredSectors: ['科技', '新能源'],
});

// 提取用户偏好
await semanticMemory.extractPreference(
  'user001',
  '我比较保守，不想承担太大风险，最好投一些ESG相关的公司',
);

// 获取风险参数
const riskParams = semanticMemory.getRiskParameters('user001');
console.log('\n--- 风险参数 ---');
console.log(riskParams);

// 生成画像摘要
console.log('\n--- 用户画像摘要 ---');
console.log(semanticMemory.generateProfileSummary('user001'));

// 存储市场知识
semanticMemory.storeMarketKnowledge('peg_ratio', 'PEG = 市盈率 / 每股收益增长率，<1表示被低估');
semanticMemory.storeMarketKnowledge('年化收益率', '年化收益率 = (1 + 日收益率)^252 - 1');
```

#### 3. 情节记忆 - 交易历史与复盘

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// 投资智能体情节记忆 - 交易历史与复盘
class TradingEpisodicMemory {
  constructor(llm) {
    this.llm = llm;
    this.trades = [];
    this.reviews = [];
  }

  // 记录交易事件
  async recordTrade(trade) {
    const episode = {
      id: `trade_${Date.now()}`,
      type: 'trade',
      ticker: trade.ticker,
      action: trade.action, // buy/sell
      shares: trade.shares,
      price: trade.price,
      reason: trade.reason, // 买入/卖出理由
      marketCondition: trade.marketCondition, // 市场状况
      timestamp: new Date().toISOString(),
      outcome: null, // 待后续更新
      pnl: null, // 盈亏
    };

    // 生成事件摘要
    const summary = `${trade.action === 'buy' ? '买入' : '卖出'} ${trade.shares}股 ${trade.ticker} @ $${trade.price}`;
    episode.summary = summary;

    this.trades.push(episode);
    console.log(`已记录交易: ${summary}`);
    return episode;
  }

  // 更新交易结果（平仓时）
  async updateTradeOutcome(tradeId, outcome, pnl) {
    const trade = this.trades.find((t) => t.id === tradeId);
    if (trade) {
      trade.outcome = outcome; // profit/loss/breakeven
      trade.pnl = pnl;
      trade.closedAt = new Date().toISOString();

      // 生成复盘记录
      await this.generateReview(trade);
      console.log(`交易复盘: ${tradeId}, 盈亏: $${pnl}`);
    }
  }

  // 生成交易复盘
  async generateReview(trade) {
    const reviewPrompt = `基于以下交易记录生成复盘要点:
交易: ${trade.summary}
理由: ${trade.reason}
市场状况: ${trade.marketCondition}
盈亏: $${trade.pnl}
结果: ${trade.outcome}

请分析:
1. 决策是否正确
2. 哪些因素导致了结果
3. 未来类似情况的建议`;

    const chain = ChatPromptTemplate.fromTemplate(reviewPrompt)
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    const analysis = await chain.invoke({});

    this.reviews.push({
      tradeId: trade.id,
      analysis,
      timestamp: new Date().toISOString(),
    });

    return analysis;
  }

  // 检索相似交易历史
  async findSimilarTrades(query) {
    const queryLower = query.toLowerCase();
    const relevant = [];

    for (const trade of this.trades) {
      const text =
        `${trade.ticker} ${trade.reason} ${trade.marketCondition} ${trade.action}`.toLowerCase();
      const queryWords = queryLower.split(' ').filter((w) => w.length > 2);
      const matchCount = queryWords.filter((w) => text.includes(w)).length;
      if (matchCount > 0) {
        relevant.push({ trade, relevance: matchCount });
      }
    }

    relevant.sort((a, b) => b.relevance - a.relevance);
    return relevant.slice(0, 5).map((r) => r.trade);
  }

  // 从历史中学习
  async learnFromHistory(query) {
    const similarTrades = await this.findSimilarTrades(query);

    if (similarTrades.length === 0) return '未找到相关历史交易';

    const learnPrompt = `基于以下历史交易经验，总结投资教训:
${similarTrades
  .map(
    (t, i) => `
${i + 1}. ${t.summary}
   理由: ${t.reason}
   市场: ${t.marketCondition}
   结果: ${t.outcome}, 盈亏: $${t.pnl || 'N/A'}
`,
  )
  .join('\n')}

请总结3条最重要的经验教训`;

    const chain = ChatPromptTemplate.fromTemplate(learnPrompt)
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    return chain.invoke({});
  }

  // 获取近期交易统计
  getTradingStats(days = 30) {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const recentTrades = this.trades.filter((t) => new Date(t.timestamp).getTime() > cutoff);

    const closedTrades = recentTrades.filter((t) => t.outcome !== null);
    const wins = closedTrades.filter((t) => t.outcome === 'profit').length;
    const losses = closedTrades.filter((t) => t.outcome === 'loss').length;

    const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

    return {
      totalTrades: recentTrades.length,
      closedTrades: closedTrades.length,
      wins,
      losses,
      winRate:
        closedTrades.length > 0 ? ((wins / closedTrades.length) * 100).toFixed(1) + '%' : 'N/A',
      totalPnl: totalPnl.toFixed(2),
    };
  }

  getAllTrades() {
    return this.trades;
  }
}

// 使用示例
const episodicMemory = new TradingEpisodicMemory(llm);

// 记录交易
const trade1 = await episodicMemory.recordTrade({
  ticker: 'AAPL',
  action: 'buy',
  shares: 100,
  price: 185,
  reason: '财报前买入，认为服务收入将增长',
  marketCondition: '牛市，财报季',
});

const trade2 = await episodicMemory.recordTrade({
  ticker: 'NVDA',
  action: 'buy',
  shares: 50,
  price: 480,
  reason: 'AI概念火热，追高买入',
  marketCondition: 'AI热潮，市场贪婪',
});

// 模拟平仓更新结果
await episodicMemory.updateTradeOutcome(trade1.id, 'profit', 1500);
await episodicMemory.updateTradeOutcome(trade2.id, 'loss', -2400);

// 从历史学习
console.log('\n--- 历史学习 ---');
const lessons = await episodicMemory.learnFromHistory('科技股 财报 买入');
console.log(lessons);

// 获取统计
console.log('\n--- 交易统计 ---');
console.log(episodicMemory.getTradingStats());
```

#### 4. 程序记忆 - 风控护栏

```javascript
import { ChatOpenAI } from '@langchain/openai';

// 投资智能体程序记忆 - 风控护栏
class RiskProceduralMemory {
  constructor(llm) {
    this.llm = llm;
    // 核心风控规则
    this.guardrails = new Map();
    // 初始化默认规则
    this.initializeDefaultRules();
  }

  // 初始化默认风控规则
  initializeDefaultRules() {
    const defaultRules = [
      {
        id: 'max_position_size',
        name: '单一股票最大仓位',
        rule: '单一股票仓位绝不能超过总资产的5%',
        action: 'block',
        severity: 'critical',
        check: (context) => {
          const positionSize = context.proposedPosition / context.totalAssets;
          return {
            passed: positionSize <= 0.05,
            details: `拟建仓位: ${(positionSize * 100).toFixed(1)}%, 限制: 5%`,
          };
        },
      },
      {
        id: 'max_drawdown_stop_loss',
        name: '回撤止损线',
        rule: '当回撤达到10%时必须自动触发平仓指令',
        action: 'liquidate',
        severity: 'critical',
        check: (context) => {
          const drawdown = context.currentDrawdown || 0;
          return {
            passed: drawdown < 0.1,
            trigger: drawdown >= 0.1,
            details: `当前回撤: ${(drawdown * 100).toFixed(1)}%, 止损线: 10%`,
          };
        },
      },
      {
        id: 'min_cash_reserve',
        name: '最低现金储备',
        rule: '必须保留至少10%资金作为应急储备',
        action: 'warn',
        severity: 'high',
        check: (context) => {
          const cashRatio = context.cash / context.totalAssets;
          return {
            passed: cashRatio >= 0.1,
            details: `现金比例: ${(cashRatio * 100).toFixed(1)}%, 最低要求: 10%`,
          };
        },
      },
      {
        id: 'daily_trade_limit',
        name: '日内交易限制',
        rule: '单日交易次数不超过5次',
        action: 'block',
        severity: 'medium',
        check: (context) => {
          return {
            passed: context.dailyTradeCount < 5,
            details: `今日交易次数: ${context.dailyTradeCount}/5`,
          };
        },
      },
      {
        id: 'esg_compliance',
        name: 'ESG合规检查',
        rule: '若用户偏好ESG，需排除高污染行业',
        action: 'warn',
        severity: 'medium',
        check: (context) => {
          if (!context.userEsgPreference) return { passed: true };

          const forbiddenSectors = ['煤炭', '石油', '重污染'];
          const isForbidden = forbiddenSectors.some((s) => context.tickerSector?.includes(s));

          return {
            passed: !isForbidden,
            details: isForbidden ? `标的公司属于禁止投资的ESG高风险行业` : 'ESG合规',
          };
        },
      },
    ];

    defaultRules.forEach((rule) => this.guardrails.set(rule.id, rule));
    console.log(`已加载 ${defaultRules.length} 条风控规则`);
  }

  // 执行所有风控检查
  async checkAll(context) {
    const results = {
      passed: true,
      checks: [],
      blocked: false,
      actions: [],
    };

    for (const [id, rule] of this.guardrails) {
      const checkResult = rule.check(context);

      const checkRecord = {
        ruleId: id,
        ruleName: rule.name,
        passed: checkResult.passed,
        details: checkResult.details,
        severity: rule.severity,
      };

      results.checks.push(checkRecord);

      if (!checkResult.passed) {
        results.passed = false;

        if (rule.action === 'block') {
          results.blocked = true;
          results.actions.push({
            action: 'BLOCK',
            reason: checkResult.details,
            severity: rule.severity,
          });
        } else if (rule.action === 'liquidate') {
          results.actions.push({
            action: 'LIQUIDATE',
            reason: checkResult.details,
            severity: rule.severity,
          });
        } else if (rule.action === 'warn') {
          results.actions.push({
            action: 'WARN',
            reason: checkResult.details,
            severity: rule.severity,
          });
        }
      }
    }

    console.log('\n--- 风控检查结果 ---');
    results.checks.forEach((c) => {
      console.log(`[${c.passed ? '✓' : '✗'}] ${c.ruleName}: ${c.details}`);
    });

    return results;
  }

  // 快速预检查
  quickCheck(context) {
    const criticalRules = ['max_position_size', 'max_drawdown_stop_loss'];
    let canProceed = true;

    for (const id of criticalRules) {
      const rule = this.guardrails.get(id);
      const result = rule.check(context);

      if (!result.passed) {
        console.log(`快速检查拦截: ${rule.name} - ${result.details}`);
        canProceed = false;
        break;
      }
    }

    return canProceed;
  }

  // 添加自定义规则
  addCustomRule(rule) {
    this.guardrails.set(rule.id, rule);
    console.log(`已添加自定义规则: ${rule.name}`);
  }

  // 获取所有规则
  getAllRules() {
    return Array.from(this.guardrails.values()).map((r) => ({
      id: r.id,
      name: r.name,
      rule: r.rule,
      severity: r.severity,
    }));
  }

  // 生成风控报告
  generateRiskReport(checkResults) {
    const critical = checkResults.checks.filter((c) => c.severity === 'critical' && !c.passed);
    const high = checkResults.checks.filter((c) => c.severity === 'high' && !c.passed);
    const medium = checkResults.checks.filter((c) => c.severity === 'medium' && !c.passed);

    return `
风控检查报告:
================
检查结果: ${checkResults.passed ? '通过' : '未通过'}
${critical.length > 0 ? `\n严重风险 (${critical.length}项):` : ''}
${critical.map((c) => `  - ${c.ruleName}: ${c.details}`).join('\n')}

${high.length > 0 ? `\n高风险 (${high.length}项):` : ''}
${high.map((c) => `  - ${c.ruleName}: ${c.details}`).join('\n')}

${medium.length > 0 ? `\n中风险 (${medium.length}项):` : ''}
${medium.map((c) => `  - ${c.ruleName}: ${c.details}`).join('\n')}

建议操作: ${checkResults.actions.map((a) => a.action).join(', ') || '无'}
`.trim();
  }
}

// 使用示例
const riskMemory = new RiskProceduralMemory(llm);

// 模拟交易上下文
const tradeContext = {
  proposedPosition: 6000,
  totalAssets: 100000,
  currentDrawdown: 0.08,
  cash: 15000,
  dailyTradeCount: 3,
  userEsgPreference: true,
  tickerSector: '新能源',
};

// 执行风控检查
const checkResults = await riskMemory.checkAll(tradeContext);

// 快速预检查
console.log('\n--- 快速预检查 ---');
const quickPass = riskMemory.quickCheck({
  proposedPosition: 6000,
  totalAssets: 100000,
  currentDrawdown: 0.08,
});
console.log(`快速检查结果: ${quickPass ? '通过' : '拦截'}`);

// 生成报告
console.log('\n' + riskMemory.generateRiskReport(checkResults));

// 获取所有规则
console.log('\n--- 所有风控规则 ---');
console.log(riskMemory.getAllRules());
```

#### 5. RAG记忆协调系统

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// 投资智能体 RAG 记忆协调系统
class InvestmentAgentRAG {
  constructor(llm) {
    this.llm = llm;

    // 简化版本 - 使用 Map 模拟各类型记忆
    this.semanticMemory = {
      profiles: new Map(),
      getRiskParameters: () => ({ maxPositionSize: 0.05, maxDrawdown: 0.1 }),
      generateProfileSummary: () => '用户画像摘要',
    };

    this.episodicMemory = {
      trades: [],
      learnFromHistory: async () => '从历史交易中学到的教训...',
    };

    this.proceduralMemory = {
      checkAll: async () => ({ passed: true, checks: [], actions: [] }),
    };

    this.shortTermMemory = {
      state: {},
      messages: [],
    };
  }

  // 步骤1: 从长期记忆检索
  async retrieveLongTermMemory(userId, query) {
    console.log('\n[步骤1] 从长期记忆检索...');

    const results = {
      semantic: null,
      episodic: null,
    };

    const riskParams = this.semanticMemory.getRiskParameters();
    const profileSummary = this.semanticMemory.generateProfileSummary();

    results.semantic = { riskParameters: riskParams, profileSummary };
    console.log('  - 已检索用户画像和风险偏好');

    const lessons = await this.episodicMemory.learnFromHistory(query);
    results.episodic = lessons;
    console.log('  - 已检索历史交易经验');

    return results;
  }

  // 步骤2: 调用外部工具获取实时数据
  async retrieveExternalData() {
    console.log('\n[步骤2] 检索外部数据（模拟）...');

    const marketData = {
      positions: [
        { ticker: 'AAPL', shares: 100, currentValue: 18500 },
        { ticker: 'MSFT', shares: 50, currentValue: 18925 },
      ],
      totalValue: 100000,
      cash: 30000,
    };

    const newsData = {
      articles: [{ title: '中东局势升级', impact: 'negative', sectors: ['能源', '航空'] }],
    };

    console.log('  - 已获取持仓明细');
    console.log('  - 已获取相关新闻');

    return { marketData, newsData };
  }

  // 步骤3: 注入到短期记忆
  injectToShortTermMemory(longTermData, externalData) {
    console.log('\n[步骤3] 注入到短期记忆...');

    const userContext = `
用户画像:
${longTermData.semantic.profileSummary}
风险参数:
- 最大仓位: ${(longTermData.semantic.riskParameters.maxPositionSize * 100).toFixed(0)}%
- 最大回撤: ${(longTermData.semantic.riskParameters.maxDrawdown * 100).toFixed(0)}%
`.trim();

    const positionContext = `
当前持仓:
${externalData.marketData.positions.map((p) => `  - ${p.ticker}: ${p.shares}股, 当前价值 $${p.currentValue}`).join('\n')}
总资产: $${externalData.marketData.totalValue}
现金: $${externalData.marketData.cash}
`.trim();

    const newsContext = `
最新新闻:
${externalData.newsData.articles.map((a) => `  - ${a.title} (影响: ${a.impact})`).join('\n')}
`.trim();

    console.log('  - 用户画像已注入');
    console.log('  - 持仓数据已注入');
    console.log('  - 新闻资讯已注入');

    return { userContext, positionContext, newsContext };
  }

  // 步骤4: 执行风控检查
  async performRiskCheck(marketData) {
    console.log('\n[步骤4] 执行风控检查...');

    const riskContext = {
      proposedPosition: 5000,
      totalAssets: marketData.totalValue,
      currentDrawdown: 0.08,
      cash: marketData.cash,
      dailyTradeCount: 2,
    };

    const checkResults = await this.proceduralMemory.checkAll(riskContext);
    console.log(`  - 风控检查: ${checkResults.passed ? '通过' : '未通过'}`);

    return checkResults;
  }

  // 步骤5: 生成投资建议
  async generateRecommendation(query, context) {
    console.log('\n[步骤5] 生成投资建议...');

    const recommendationPrompt = `作为投资智能体，基于以下信息生成投资建议:

用户画像和风险偏好:
${context.longTerm.semantic.profileSummary}

当前持仓状况:
总资产: $${context.external.marketData.totalValue}
现金: $${context.external.marketData.cash}

最新市场新闻:
${context.external.newsData.articles.map((a) => a.title).join(', ')}

历史交易经验:
${context.longTerm.episodic}

用户问题: ${query}

请生成个性化的调仓建议，考虑用户的风险偏好和当前市场状况。`;

    const chain = ChatPromptTemplate.fromTemplate(recommendationPrompt)
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    const recommendation = await chain.invoke({});
    return recommendation;
  }

  // 完整 RAG 流程
  async processQuery(userId, query) {
    console.log(`\n========== 开始处理查询 ==========`);
    console.log(`用户: ${userId}, 问题: ${query}`);

    // 步骤1: 检索长期记忆
    const longTermData = await this.retrieveLongTermMemory(userId, query);

    // 步骤2: 获取外部数据
    const externalData = await this.retrieveExternalData();

    // 步骤3: 注入到短期记忆
    const injectedContext = this.injectToShortTermMemory(longTermData, externalData);

    // 步骤4: 风控检查
    const riskCheck = await this.performRiskCheck(externalData.marketData);

    // 构建完整上下文
    const fullContext = {
      longTerm: longTermData,
      external: externalData,
    };

    // 步骤5: 生成建议
    const recommendation = await this.generateRecommendation(query, fullContext);

    console.log('\n========== 处理完成 ==========\n');

    return { recommendation, riskCheck, context: injectedContext };
  }
}

// 使用示例
const ragSystem = new InvestmentAgentRAG(llm);

// 执行完整RAG流程
const result = await ragSystem.processQuery(
  'user001',
  '我现在的持仓是否需要应对中东局势做出调整？',
);

console.log('--- 最终建议 ---');
console.log(result.recommendation);
console.log('\n--- 风控结果 ---');
console.log(`通过: ${result.riskCheck.passed}`);
```

## 社区热议与实践分享

## Community Discussions and Practical Insights

智能体内存管理是 2025-2026 年 AI 社区最热门的研究方向之一。以下是来自行业专家、开源社区和学术界的关键洞察与讨论。

### 行业领袖的声音

**Andrew Ng（吴恩达）** 在其 DeepLearning.AI 平台上推出了多门关于智能体内存的课程，并在 X（Twitter）上多次强调内存对智能体的核心价值。他指出：

> "Memory is the key thing coming soon... it will remember your preferences and give advice based on your tastes and past interactions."（内存是即将到来的关键能力……它将记住你的偏好，并根据你的品味和过往交互提供建议。）

吴恩达还评价了 MemGPT 的开创性研究："When I read the original MemGPT paper, I thought it was an innovative and important technique for handling memory for LLMs."（当我读到原始的 MemGPT 论文时，我认为这是处理 LLM 内存的创新且重要的技术。）他先后发布了 [LLMs as Operating Systems: Agent Memory](https://x.com/AndrewYNg/status/1854587401018261962) 和 [Long-Term Agentic Memory with LangGraph](https://x.com/AndrewYNg/status/1902395485601853941) 两门免费课程，推动了社区对内存管理的深入理解。

**Yohei Nakajima**（BabyAGI 创始人、Untapped Capital 合伙人）在 [X 上发表了一条引发广泛讨论的推文](https://x.com/yoheinakajima/status/1892257339400737087)：

> "'better memory' is the final unlock we need to get truly better agents, and 2025 is when we'll see more of this. We have strong reasoning, tools for tools, plenty of frameworks, but memory/context management needs work."（"更好的内存"是我们获得真正更好的智能体所需的最后一个解锁点，2025 年我们将看到更多进展。我们已经有了强大的推理能力、工具生态和框架，但内存/上下文管理仍需改进。）

他还特别提到了隐私控制、用户权限和自我改进等内存设计的关键维度。

**Harrison Chase**（LangChain CEO）在 ODSC AI West 2025 上提出了"Deep Agents"（深度智能体）的概念，并在 [Sequoia Capital 播客访谈](https://sequoiacap.com/podcast/training-data-harrison-chase/) 中阐述了上下文工程（Context Engineering）的理念。他认为：

> "When agents mess up, they mess up because they don't have the right context; when they succeed, they succeed because they have the right context."（当智能体出错时，是因为没有正确的上下文；当它们成功时，是因为拥有了正确的上下文。）

Chase 还将内存与文件系统类比，认为"智能体可以使用 Markdown 或 JSON 文件作为持久内存，自主决定如何组织自己的长期记忆"。

**Charles Packer 和 Sarah Wooders**（Letta/MemGPT 联合创始人）在 [DeepLearning.AI 课程](https://x.com/DeepLearningAI/status/1917602387381924173) 中教授了 MemGPT 的核心理念，即将 LLM 视为操作系统来管理内存。Packer 指出："The most powerful characteristics of a useful AI agent -- personalization, self-improvement, tool use, reasoning and planning -- are all fundamentally memory management problems."（有用的 AI 智能体最强大的特性——个性化、自我改进、工具使用、推理和规划——从根本上说都是内存管理问题。）

### 社区研究热点

**Rohan Paul** 在 X 上持续追踪内存管理的前沿研究，引发了大量技术讨论：

- 关于 [A-MEM（Agentic Memory）](https://x.com/rohanpaul_ai/status/1895950903515234930)：提出了无需依赖预定义操作的动态内存结构化系统，灵感来源于 Zettelkasten 笔记管理法。该研究来自 Rutgers University、Ant Group 和 Salesforce Research 的联合团队。
- 关于 [Google ReasoningBank](https://x.com/rohanpaul_ai/status/1976837155335897363)：帮助智能体从成功和失败中学习的记忆框架，在 WebArena、Mind2Web 等基准测试中显著提升了成功率。
- 关于 [MemR3](https://x.com/rohanpaul_ai/status/2006305580734947499)：将记忆检索变为迭代反思过程，类似于调试，每一轮搜索都由上一轮未找到的内容引导。在 LoCoMo 基准测试中提升了高达 7.29% 的准确率。
- 关于 [MemEvolve](https://x.com/rohanpaul_ai/status/2004411096837607474)：自动演化内存结构以适配不同任务类型，在无需人工设计的情况下将某些智能体框架的表现提升了高达 17.06%。

**Kalyan KS** 分享了关于 [mem-agent](https://x.com/kalyan_kpl/status/1976493478109450377) 的研究——一个使用强化学习（GSPO）训练的 4B 参数 LLM 智能体，通过 Python 工具和 Markdown 文件实现内存管理，并发布了 mem-agent-mcp（基于 Model Context Protocol 的内存服务器）。

**Aurimas Griciūnas** 在 [X 上发布了一篇系统性的图解说明](https://x.com/Aurimas_Gr/status/1904172795598176494)，解释了智能体内存的工作原理：所有从长期存储或本地内存中汇集的信息都构成了短期或工作内存，最终编译成提示词传递给 LLM，指导后续行动。

### 主流框架对比

2025 年社区围绕三大内存框架展开了广泛讨论：

| 框架 | 核心理念 | 特点 |
|------|----------|------|
| **Mem0** | 通用内存层 | 一行代码集成，支持 OpenAI/LangGraph/CrewAI；自动压缩对话历史；SOC 2 和 HIPAA 合规；2025 年 Q3 处理 1.86 亿次 API 调用 |
| **Letta (MemGPT)** | LLM 即操作系统 | 类 OS 的分层内存架构（核心内存类似 RAM，归档内存类似磁盘）；智能体自主管理内存；支持 Memory Blocks 可编辑记忆块 |
| **LangMem** | LangGraph 原生集成 | 通过显式工具调用提取信息；依托 LangGraph 的状态图管理；开发者完全掌控内存访问时机和方式 |

[DigitalOcean 的教程](https://www.digitalocean.com/community/tutorials/langgraph-mem0-integration-long-term-ai-memory) 和 [FutureSmart AI 的实践指南](https://blog.futuresmart.ai/ai-agents-memory-mem0-langgraph-agent-integration) 详细介绍了 Mem0 + LangGraph 的集成方案，显示该组合在准确率上提升 26%，响应速度提升 91%，Token 消耗减少 90%。

### ICLR 2026 MemAgents 研讨会

值得关注的是，[ICLR 2026 专门设立了 MemAgents 研讨会](https://openreview.net/forum?id=U51WxL382H)，聚焦 LLM 智能体的内存系统。研讨会的核心观点是：长寿命、安全且有用的智能体需要一个有原则的内存基础设施，支持实例的单次学习、上下文感知的检索，以及向可泛化知识的整合。

该研讨会催生了多篇重要论文：

- **A-MEM**（[arXiv 2502.12110](https://arxiv.org/abs/2502.12110)）：NeurIPS 2025 接收，灵感来自 Zettelkasten 方法的智能体记忆系统
- **Agentic Memory（AgeMem）**（[arXiv 2601.01885](https://arxiv.org/abs/2601.01885)）：统一长短期内存管理，将内存操作暴露为工具调用
- **MAGMA**：基于多图的智能体内存架构（2026 年 1 月）
- **EverMemOS**：面向结构化长期推理的自组织内存操作系统（2026 年 1 月）
- **MemRL**：通过情节记忆的运行时强化学习实现自我演化的智能体（2026 年 1 月）

### 社区共识与趋势

综合社区讨论，以下几个关键趋势已形成共识：

1. **内存是智能体的"护城河"**：传统 LLM 是无状态的，内存能力使智能体从"工具"转变为真正的"助手"。正如 RelationalAI 的 Nikolaos Vasiloglou 所说，真正改变游戏规则的将是"能够从过去的交互中学习和构建"的智能体内存系统。

2. **混合内存架构成为最佳实践**：融合情节记忆和语义记忆的混合系统已成为主流，结合认知科学中工作记忆（RAM）、短期记忆和长期记忆的分层模型。

3. **"上下文腐蚀"是核心挑战**：研究者发现简单地扩大上下文窗口会导致性能退化（被称为"context rot"），需要更智能的上下文管理策略。

4. **内存操作即工具调用**：越来越多的框架将存储、检索、更新、摘要和遗忘等内存操作暴露为 LLM 可以自主调用的工具，让智能体"学会管理自己的内存"。

5. **遗忘机制同样重要**：智能衰减和整合策略正在成为内存设计的关键组成部分，通过对记忆的相关性和使用频率评分来优化记忆池，避免"内存膨胀"和上下文退化。

---

## 参考资源

## Reference Resources

### 学术论文与研究

- [A-MEM: Agentic Memory for LLM Agents](https://arxiv.org/abs/2502.12110) - Rutgers University、Ant Group、Salesforce Research，灵感来自 Zettelkasten 笔记法的动态内存系统（NeurIPS 2025）
- [Agentic Memory (AgeMem): Learning Unified Long-Term and Short-Term Memory Management](https://arxiv.org/abs/2601.01885) - 统一长短期内存管理框架（2026 年 1 月）
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) - UC Berkeley，将 LLM 类比为操作系统的内存管理开创性论文
- [ICLR 2026 MemAgents Workshop](https://openreview.net/forum?id=U51WxL382H) - ICLR 2026 内存智能体专题研讨会
- [Memory in the Age of AI Agents: A Survey (Paper List)](https://github.com/Shichun-Liu/Agent-Memory-Paper-List) - 全面的智能体内存研究论文集
- [Awesome Memory for Agents](https://github.com/TsinghuaC3I/Awesome-Memory-for-Agents) - 清华大学维护的智能体内存论文合集

### 开源框架与工具

- [Mem0 - The Memory Layer for AI Apps](https://mem0.ai/) - 通用 AI 内存层，[GitHub 仓库](https://github.com/mem0ai/mem0)
- [Letta (MemGPT)](https://www.letta.com/) - 基于 OS 理念的智能体内存框架，[Agent Memory 博客](https://www.letta.com/blog/agent-memory)
- [LangGraph + Mem0 集成教程 (DigitalOcean)](https://www.digitalocean.com/community/tutorials/langgraph-mem0-integration-long-term-ai-memory)
- [LangGraph + Mem0 实践指南 (FutureSmart AI)](https://blog.futuresmart.ai/ai-agents-memory-mem0-langgraph-agent-integration)
- [LangGraph + Mem0 Production Agent (GitHub)](https://github.com/kisinad/langgraph-mem0-agent)

### 课程与教程

- [LLMs as Operating Systems: Agent Memory (DeepLearning.AI)](https://www.deeplearning.ai/short-courses/llms-as-operating-systems-agent-memory/) - 由 Letta 创始人 Charles Packer 和 Sarah Wooders 讲授
- [Long-Term Agentic Memory with LangGraph (DeepLearning.AI)](https://x.com/AndrewYNg/status/1902395485601853941) - 由 LangChain CEO Harrison Chase 讲授
- [Agentic AI Course (DeepLearning.AI)](https://www.deeplearning.ai/courses/agentic-ai/) - Andrew Ng 的智能体 AI 综合课程
- [Building AI Agents That Actually Remember (Medium)](https://medium.com/@nomannayeem/building-ai-agents-that-actually-remember-a-developers-guide-to-memory-management-in-2025-062fd0be80a1)

### 行业分析与深度文章

- [Memory for AI Agents: A New Paradigm of Context Engineering (The New Stack)](https://thenewstack.io/memory-for-ai-agents-a-new-paradigm-of-context-engineering/)
- [Short-Term vs Long-Term Agent Memory: A Deep Dive (SparkCo)](https://sparkco.ai/blog/short-term-vs-long-term-agent-memory-a-deep-dive)
- [Making Sense of Memory in AI Agents (Leonie Monigatti)](https://www.leoniemonigatti.com/blog/memory-in-ai-agents.html)
- [How Memory Transforms AI Agents (MarkTechPost)](https://www.marktechpost.com/2025/07/26/how-memory-transforms-ai-agents-insights-and-leading-solutions-in-2025/)
- [AI Memory Systems Benchmark: Mem0 vs OpenAI vs LangMem](https://guptadeepak.com/the-ai-memory-wars-why-one-system-crushed-the-competition-and-its-not-openai/)
- [The 6 Best AI Agent Memory Frameworks (2026)](https://machinelearningmastery.com/the-6-best-ai-agent-memory-frameworks-you-should-try-in-2026/)
- [Harrison Chase on Deep Agents (ODSC)](https://opendatascience.com/harrison-chase-on-deep-agents-the-next-evolution-in-autonomous-ai/)

### 社交媒体与社区讨论

- [Yohei Nakajima: "better memory is the final unlock" (X/Twitter)](https://x.com/yoheinakajima/status/1892257339400737087)
- [Andrew Ng: LLMs as Operating Systems (X/Twitter)](https://x.com/AndrewYNg/status/1854587401018261962)
- [Andrew Ng: Long-Term Agentic Memory (X/Twitter)](https://x.com/AndrewYNg/status/1902395485601853941)
- [Rohan Paul: A-MEM Discussion (X/Twitter)](https://x.com/rohanpaul_ai/status/1895950903515234930)
- [Rohan Paul: Google ReasoningBank (X/Twitter)](https://x.com/rohanpaul_ai/status/1976837155335897363)
- [Rohan Paul: MemR3 (X/Twitter)](https://x.com/rohanpaul_ai/status/2006305580734947499)
- [Marktechpost: A-MEM Announcement (X/Twitter)](https://x.com/Marktechpost/status/1896045837362602036)
- [Aurimas Griciūnas: AI Agent Memory Explained (X/Twitter)](https://x.com/Aurimas_Gr/status/1904172795598176494)
- [Kalyan KS: mem-agent with RL (X/Twitter)](https://x.com/kalyan_kpl/status/1976493478109450377)
