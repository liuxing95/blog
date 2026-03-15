---
title: 'Chapter 15: Inter-Agent Communication (A2A)'
date: '2026-03-15'
excerpt: 'Agent-to-Agent (A2A) communication enables multiple agents to work together effectively. 融合社区洞察与行业实践，涵盖协议之争、企业落地案例、Linux Foundation治理演进与开发者社区反馈，深入解析A2A协议的生态发展与技术演进。'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 15: Inter-Agent Communication (A2A)

# 第十五章：智能体间通信(A2A)

## A2A Pattern Overview

## A2A模式概述

Agent-to-Agent (A2A) communication enables multiple agents to work together effectively.

智能体间通信(A2A)使多个智能体能够有效协同工作。

This pattern defines how agents share information, coordinate actions, and collaborate on complex tasks.

此模式定义智能体如何共享信息，协调行动并协作完成复杂任务。

### Communication Protocols

### 通信协议

**Message Format**: Standardized structure for agent messages.

**消息格式**: 智能体消息的标准化结构。

**Protocol Types**: Request-response, event-driven, or publish-subscribe models.

**协议类型**: 请求-响应、事件驱动或发布-订阅模型。

**State Sharing**: Mechanisms for agents to share context and state.

**状态共享**: 智能体共享上下文和状态的机制。

### Coordination Patterns

### 协调模式

**Task Delegation**: Assigning subtasks to appropriate agents.

**任务委派**: 将子任务分配给适当的智能体。

**Information Sharing**: Exchanging relevant data between agents.

**信息共享**: 在智能体之间交换相关数据。

**Result Aggregation**: Combining outputs from multiple agents.

**结果聚合**: 组合多个智能体的输出。

---

## Hands-On Code Examples

## 实践代码示例

以下代码实现了智能体间通信(A2A)的核心模式：

### 1. A2A Message Protocol (A2A消息协议)

以下代码实现了标准的A2A消息协议：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0.7 });

// A2A Message Types
const A2AMessageType = {
  REQUEST: 'request',
  RESPONSE: 'response',
  NOTIFICATION: 'notification',
  ERROR: 'error',
  HEARTBEAT: 'heartbeat'
};

// Message Priority
const MessagePriority = {
  LOW: 1,
  NORMAL: 5,
  HIGH: 10,
  CRITICAL: 20
};

// A2A Message Structure
class A2AMessage {
  constructor(id, type, sender, receiver, payload, options = {}) {
    this.id = id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.type = type;
    this.sender = sender;
    this.receiver = receiver;
    this.payload = payload;
    this.priority = options.priority || MessagePriority.NORMAL;
    this.correlationId = options.correlationId || null;
    this.replyTo = options.replyTo || null;
    this.timestamp = Date.now();
    this.ttl = options.ttl || 300000; // 5 minutes default
    this.metadata = options.metadata || {};
  }

  // Create request message
  static request(sender, receiver, payload, options = {}) {
    return new A2AMessage(
      null,
      A2AMessageType.REQUEST,
      sender,
      receiver,
      payload,
      options
    );
  }

  // Create response message
  static response(sender, receiver, payload, correlationId, options = {}) {
    return new A2AMessage(
      null,
      A2AMessageType.RESPONSE,
      sender,
      receiver,
      payload,
      { ...options, correlationId }
    );
  }

  // Create notification
  static notification(sender, receiver, payload, options = {}) {
    return new A2AMessage(
      null,
      A2AMessageType.NOTIFICATION,
      sender,
      receiver,
      payload,
      options
    );
  }

  // Create error message
  static error(sender, receiver, error, correlationId, options = {}) {
    return new A2AMessage(
      null,
      A2AMessageType.ERROR,
      sender,
      receiver,
      { error: error.message || error, code: error.code || 'UNKNOWN' },
      options
    );
  }

  // Check if message is expired
  isExpired() {
    return Date.now() - this.timestamp > this.ttl;
  }

  // Serialize to JSON
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      sender: this.sender,
      receiver: this.receiver,
      payload: this.payload,
      priority: this.priority,
      correlationId: this.correlationId,
      replyTo: this.replyTo,
      timestamp: this.timestamp,
      ttl: this.ttl,
      metadata: this.metadata
    };
  }

  // Deserialize from JSON
  static fromJSON(json) {
    return new A2AMessage(
      json.id,
      json.type,
      json.sender,
      json.receiver,
      json.payload,
      {
        priority: json.priority,
        correlationId: json.correlationId,
        replyTo: json.replyTo,
        ttl: json.ttl,
        metadata: json.metadata
      }
    );
  }
}

// A2A Agent Endpoint
class A2AEndpoint {
  constructor(agentId, agentName) {
    this.agentId = agentId;
    this.agentName = agentName;
    this.messageQueue = [];
    this.subscribers = new Map();
    this.handlers = new Map();
    this.connected = false;
  }

  // Register message handler
  on(messageType, handler) {
    this.handlers.set(messageType, handler);
  }

  // Subscribe to messages from specific agent
  subscribe(agentId, callback) {
    if (!this.subscribers.has(agentId)) {
      this.subscribers.set(agentId, []);
    }
    this.subscribers.get(agentId).push(callback);
  }

  // Send message to another agent
  async send(receiver, payload, options = {}) {
    const message = A2AMessage.request(this.agentId, receiver, payload, options);
    this.messageQueue.push(message);
    console.log(`[${this.agentName}] Sent ${message.type} to ${receiver}`);

    // Simulate async delivery
    return message;
  }

  // Handle incoming message
  async handleMessage(message) {
    console.log(`[${this.agentName}] Received ${message.type} from ${message.sender}`);

    // Check if expired
    if (message.isExpired()) {
      console.log(`[${this.agentName}] Message expired, ignoring`);
      return null;
    }

    // Find handler
    const handler = this.handlers.get(message.type);
    if (handler) {
      try {
        const result = await handler(message.payload, message);
        return result;
      } catch (error) {
        console.error(`[${this.agentName}] Handler error:`, error);
        return A2AMessage.error(this.agentId, message.sender, error, message.id);
      }
    }

    return null;
  }

  // Get message history
  getHistory(limit = 50) {
    return this.messageQueue.slice(-limit);
  }

  // Get connection status
  getStatus() {
    return {
      agentId: this.agentId,
      agentName: this.agentName,
      connected: this.connected,
      queuedMessages: this.messageQueue.length,
      handlers: Array.from(this.handlers.keys()),
      subscribers: Array.from(this.subscribers.keys())
    };
  }
}

// Usage
async function demoA2AProtocol() {
  // Create agent endpoints
  const agentA = new A2AEndpoint('agent-alpha', 'Alpha Agent');
  const agentB = new A2AEndpoint('agent-beta', 'Beta Agent');

  // Register handlers
  agentB.on(A2AMessageType.REQUEST, async (payload, message) => {
    console.log(`[Beta] Processing request: ${payload.task}`);

    // Simulate processing
    const result = { status: 'completed', output: `Processed: ${payload.task}` };

    // Send response
    return A2AMessage.response(
      agentB.agentId,
      message.sender,
      result,
      message.id
    );
  });

  // Subscribe to notifications
  agentA.subscribe(agentB.agentId, (notification) => {
    console.log(`[Alpha] Received notification: ${notification.event}`);
  });

  // Send request
  console.log('\n--- Sending Request ---');
  const request = await agentA.send(agentB.agentId, {
    task: 'analyze_data',
    data: { symbol: 'AAPL', period: '1Y' }
  }, { priority: MessagePriority.HIGH });

  // Handle the request at receiver
  const response = await agentB.handleMessage(request);

  if (response) {
    console.log('\n--- Response ---');
    console.log(response.toJSON());
  }

  // Show status
  console.log('\n--- Agent Status ---');
  console.log(agentA.getStatus());
}

demoA2AProtocol();
```

### 2. Task Delegation (任务委派)

以下代码实现了智能体之间的任务委派系统：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0.7 });

// Task Status
const TaskStatus = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// Task Priority
const TaskPriority = {
  LOW: 1,
  NORMAL: 5,
  HIGH: 10,
  URGENT: 20
};

// Task Definition
class Task {
  constructor(id, type, description, config = {}) {
    this.id = id || `task_${Date.now()}`;
    this.type = type;
    this.description = description;
    this.config = config;
    this.status = TaskStatus.PENDING;
    this.priority = config.priority || TaskPriority.NORMAL;
    this.assignee = null;
    this.requester = null;
    this.dependencies = config.dependencies || [];
    this.result = null;
    this.error = null;
    this.createdAt = Date.now();
    this.startedAt = null;
    this.completedAt = null;
    this.metadata = {};
  }

  assign(agentId) {
    this.assignee = agentId;
    this.status = TaskStatus.ASSIGNED;
  }

  start() {
    this.status = TaskStatus.IN_PROGRESS;
    this.startedAt = Date.now();
  }

  complete(result) {
    this.status = TaskStatus.COMPLETED;
    this.result = result;
    this.completedAt = Date.now();
  }

  fail(error) {
    this.status = TaskStatus.FAILED;
    this.error = error;
    this.completedAt = Date.now();
  }

  cancel() {
    this.status = TaskStatus.CANCELLED;
    this.completedAt = Date.now();
  }

  getDuration() {
    if (!this.startedAt || !this.completedAt) return null;
    return this.completedAt - this.startedAt;
  }
}

// Task Delegation Manager
class TaskDelegationManager {
  constructor(agentId) {
    this.agentId = agentId;
    this.tasks = new Map();
    this.agents = new Map(); // Available agents and their capabilities
    this.taskQueue = [];
  }

  // Register an agent with capabilities
  registerAgent(agentId, capabilities, load = 0) {
    this.agents.set(agentId, {
      id: agentId,
      capabilities,
      load,
      status: 'available',
      currentTasks: []
    });
    console.log(`[Delegation] Registered agent: ${agentId} with capabilities: ${capabilities.join(', ')}`);
  }

  // Create and delegate a task
  delegateTask(type, description, config = {}) {
    const task = new Task(null, type, description, config);
    task.requester = this.agentId;

    // Find best agent for the task
    const suitableAgents = this.findSuitableAgents(task);

    if (suitableAgents.length === 0) {
      console.log(`[Delegation] No suitable agent found for task: ${type}`);
      this.taskQueue.push(task);
      return { status: 'queued', taskId: task.id };
    }

    // Select agent (lowest load)
    const selectedAgent = suitableAgents.sort((a, b) => a.load - b.load)[0];

    // Assign task
    task.assign(selectedAgent.id);
    this.tasks.set(task.id, task);
    selectedAgent.currentTasks.push(task.id);
    selectedAgent.load++;

    console.log(`[Delegation] Delegated task ${task.id} to ${selectedAgent.id}`);
    return { status: 'assigned', taskId: task.id, assignee: selectedAgent.id };
  }

  // Find agents suitable for task
  findSuitableAgents(task) {
    return Array.from(this.agents.values())
      .filter(agent => {
        // Check capabilities
        if (task.config.requiredCapabilities) {
          return task.config.requiredCapabilities.every(cap =>
            agent.capabilities.includes(cap)
          );
        }
        return true;
      })
      .filter(agent => agent.status !== 'offline');
  }

  // Complete a task
  completeTask(taskId, result) {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.complete(result);

    // Update agent load
    const agent = this.agents.get(task.assignee);
    if (agent) {
      agent.load = Math.max(0, agent.load - 1);
      agent.currentTasks = agent.currentTasks.filter(id => id !== taskId);
    }

    // Check queued tasks
    this.processQueue();

    return task;
  }

  // Fail a task
  failTask(taskId, error) {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.fail(error);

    // Update agent load
    const agent = this.agents.get(task.assignee);
    if (agent) {
      agent.load = Math.max(0, agent.load - 1);
    }

    return task;
  }

  // Process queued tasks
  processQueue() {
    if (this.taskQueue.length === 0) return;

    const queued = [...this.taskQueue];
    this.taskQueue = [];

    for (const task of queued) {
      const result = this.delegateTask(task.type, task.description, task.config);
      if (result.status !== 'queued') {
        console.log(`[Delegation] Processed queued task: ${task.id}`);
      }
    }
  }

  // Get task status
  getTaskStatus(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) return null;

    return {
      id: task.id,
      type: task.type,
      status: task.status,
      assignee: task.assignee,
      duration: task.getDuration(),
      result: task.result
    };
  }

  // Get agent workload
  getAgentWorkload() {
    const workload = {};
    for (const [id, agent] of this.agents.entries()) {
      workload[id] = {
        load: agent.load,
        currentTasks: agent.currentTasks.length,
        status: agent.status
      };
    }
    return workload;
  }
}

// Usage
function demoTaskDelegation() {
  const coordinator = new TaskDelegationManager('coordinator');

  // Register specialized agents
  coordinator.registerAgent('researcher', ['research', 'analysis', 'information_gathering']);
  coordinator.registerAgent('writer', ['writing', 'summarization', 'editing']);
  coordinator.registerAgent('coder', ['coding', 'debugging', 'testing']);

  console.log('\n--- Delegating Tasks ---');

  // Delegate research task
  const result1 = coordinator.delegateTask(
    'research',
    'Research latest AI trends',
    { priority: TaskPriority.HIGH, requiredCapabilities: ['research'] }
  );
  console.log('Research task:', result1);

  // Delegate writing task
  const result2 = coordinator.delegateTask(
    'writing',
    'Write a blog post about AI',
    { priority: TaskPriority.NORMAL, requiredCapabilities: ['writing', 'summarization'] }
  );
  console.log('Writing task:', result2);

  // Delegate coding task
  const result3 = coordinator.delegateTask(
    'coding',
    'Implement a new feature',
    { priority: TaskPriority.URGENT, requiredCapabilities: ['coding'] }
  );
  console.log('Coding task:', result3);

  // Simulate task completion
  console.log('\n--- Completing Tasks ---');
  coordinator.completeTask(result1.taskId, { report: 'AI trends report ready' });
  coordinator.completeTask(result2.taskId, { article: 'Blog post published' });

  // Check workload
  console.log('\n--- Agent Workload ---');
  console.log(coordinator.getAgentWorkload());
}

demoTaskDelegation();
```

### 3. Result Aggregation (结果聚合)

以下代码实现了多智能体结果聚合系统：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0.7 });

// Aggregation Strategy
const AggregationStrategy = {
  FIRST: 'first',           // Return first successful result
  ALL: 'all',               // Aggregate all results
  BEST: 'best',             // Select best result based on score
  WEIGHTED: 'weighted',    // Weighted average
  CONSENSUS: 'consensus'    // Find consensus among results
};

// Result Item
class AgentResult {
  constructor(agentId, result, metadata = {}) {
    this.agentId = agentId;
    this.result = result;
    this.metadata = metadata;
    this.timestamp = Date.now();
    this.score = metadata.score || 0;
    this.error = metadata.error || null;
    this.success = !metadata.error;
  }
}

// Aggregation Engine
class ResultAggregator {
  constructor(strategy = AggregationStrategy.ALL) {
    this.strategy = strategy;
    this.results = [];
    this.listeners = [];
  }

  // Add result from an agent
  addResult(agentId, result, metadata = {}) {
    const agentResult = new AgentResult(agentId, result, metadata);
    this.results.push(agentResult);
    console.log(`[Aggregator] Received result from ${agentId}:`, result);

    // Notify listeners
    this.notifyListeners(agentResult);

    return agentResult;
  }

  // Add error from an agent
  addError(agentId, error) {
    return this.addResult(agentId, null, { error: error.message || error });
  }

  // Aggregate results based on strategy
  aggregate() {
    const successfulResults = this.results.filter(r => r.success);

    switch (this.strategy) {
      case AggregationStrategy.FIRST:
        return this.aggregateFirst(successfulResults);

      case AggregationStrategy.ALL:
        return this.aggregateAll(successfulResults);

      case AggregationStrategy.BEST:
        return this.aggregateBest(successfulResults);

      case AggregationStrategy.WEIGHTED:
        return this.aggregateWeighted(successfulResults);

      case AggregationStrategy.CONSENSUS:
        return this.aggregateConsensus(successfulResults);

      default:
        return this.aggregateAll(successfulResults);
    }
  }

  // Return first successful result
  aggregateFirst(results) {
    if (results.length === 0) return { error: 'No successful results' };
    return {
      strategy: 'first',
      result: results[0].result,
      agentId: results[0].agentId
    };
  }

  // Return all results
  aggregateAll(results) {
    return {
      strategy: 'all',
      count: results.length,
      results: results.map(r => ({
        agentId: r.agentId,
        result: r.result,
        score: r.score
      }))
    };
  }

  // Return best result by score
  aggregateBest(results) {
    if (results.length === 0) return { error: 'No successful results' };

    const best = results.reduce((a, b) => a.score > b.score ? a : b);
    return {
      strategy: 'best',
      result: best.result,
      agentId: best.agentId,
      score: best.score
    };
  }

  // Weighted average (for numeric results)
  aggregateWeighted(results) {
    if (results.length === 0) return { error: 'No successful results' };

    const weightedResults = results.filter(r => typeof r.result === 'number');
    if (weightedResults.length === 0) {
      return this.aggregateAll(results);
    }

    let totalWeight = 0;
    let weightedSum = 0;

    for (const r of weightedResults) {
      const weight = r.metadata.weight || 1;
      weightedSum += r.result * weight;
      totalWeight += weight;
    }

    return {
      strategy: 'weighted',
      result: totalWeight > 0 ? weightedSum / totalWeight : 0,
      totalWeight
    };
  }

  // Find consensus (using LLM)
  async aggregateConsensus(results) {
    if (results.length === 0) return { error: 'No results to aggregate' };
    if (results.length === 1) return { strategy: 'consensus', ...results[0] };

    // Use LLM to find consensus
    const prompt = ChatPromptTemplate.fromTemplate(
      `Analyze the following results from multiple agents and find the consensus or best answer:

Results:
{results}

Provide a consolidated answer and explain the reasoning:`
    );

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    try {
      const consolidated = await chain.invoke({
        results: results.map(r => `- ${r.agentId}: ${JSON.stringify(r.result)}`).join('\n')
      });

      return {
        strategy: 'consensus',
        result: consolidated,
        sourceCount: results.length
      };
    } catch (error) {
      // Fallback to simple voting
      return this.aggregateBest(results);
    }
  }

  // Subscribe to new results
  subscribe(callback) {
    this.listeners.push(callback);
  }

  // Notify listeners
  notifyListeners(result) {
    this.listeners.forEach(cb => cb(result));
  }

  // Get statistics
  getStats() {
    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);

    return {
      total: this.results.length,
      successful: successful.length,
      failed: failed.length,
      avgScore: successful.length > 0
        ? successful.reduce((sum, r) => sum + r.score, 0) / successful.length
        : 0
    };
  }

  // Clear results
  clear() {
    this.results = [];
  }
}

// Multi-Agent Query Executor
class MultiAgentExecutor {
  constructor() {
    this.agents = new Map();
    this.aggregator = new ResultAggregator(AggregationStrategy.ALL);
  }

  // Register an agent
  registerAgent(agentId, handler, capabilities = []) {
    this.agents.set(agentId, { handler, capabilities });
    console.log(`[Executor] Registered agent: ${agentId}`);
  }

  // Execute query across multiple agents
  async executeQuery(query, options = {}) {
    const {
      targetAgents = null, // null = all agents
      strategy = AggregationStrategy.ALL,
      timeout = 30000,
      minResults = 1
    } = options;

    // Set aggregation strategy
    this.aggregator.strategy = strategy;
    this.aggregator.clear();

    // Determine which agents to query
    const agentsToQuery = targetAgents
      ? Array.from(this.agents.entries()).filter(([id]) => targetAgents.includes(id))
      : Array.from(this.agents.entries());

    console.log(`[Executor] Querying ${agentsToQuery.length} agents...`);

    // Execute in parallel with timeout
    const promises = agentsToQuery.map(async ([agentId, agent]) => {
      try {
        const result = await this.executeWithTimeout(agent.handler, query, timeout);
        this.aggregator.addResult(agentId, result, { capabilities: agent.capabilities });
      } catch (error) {
        this.aggregator.addError(agentId, error);
      }
    });

    await Promise.all(promises);

    // Check minimum results
    const stats = this.aggregator.getStats();
    if (stats.successful < minResults) {
      return {
        success: false,
        error: `Insufficient results: only ${stats.successful} of ${minResults} required`
      };
    }

    // Aggregate results
    const aggregated = this.aggregator.aggregate();

    return {
      success: true,
      stats,
      ...aggregated
    };
  }

  // Execute with timeout
  async executeWithTimeout(handler, query, timeout) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Execution timeout'));
      }, timeout);

      Promise.resolve(handler(query))
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }
}

// Usage
async function demoResultAggregation() {
  const executor = new MultiAgentExecutor();

  // Register different agents with different capabilities
  executor.registerAgent('researcher', async (query) => {
    // Simulate research agent
    return { type: 'research', findings: 'AI market growing at 25% CAGR' };
  }, ['research']);

  executor.registerAgent('analyst', async (query) => {
    // Simulate analyst agent
    return { type: 'analysis', prediction: 'Tech sector will outperform' };
  }, ['analysis']);

  executor.registerAgent('news', async (query) => {
    // Simulate news agent
    return { type: 'news', headline: 'Major AI partnership announced' };
  }, ['news']);

  // Execute query with different strategies
  console.log('\n--- Strategy: ALL ---');
  const result1 = await executor.executeQuery('What is the AI market outlook?', {
    strategy: AggregationStrategy.ALL
  });
  console.log(JSON.stringify(result1, null, 2));

  console.log('\n--- Strategy: BEST (with scores) ---');
  executor.aggregator.addResult('researcher', { data: 'result1' }, { score: 0.9 });
  executor.aggregator.addResult('analyst', { data: 'result2' }, { score: 0.7 });
  executor.aggregator.addResult('news', { data: 'result3' }, { score: 0.8 });

  const result2 = executor.aggregate();
  console.log(JSON.stringify(result2, null, 2));

  console.log('\n--- Strategy: CONSENSUS ---');
  executor.aggregator.clear();
  executor.aggregator.addResult('researcher', { outlook: 'positive' }, { score: 0.9 });
  executor.aggregator.addResult('analyst', { outlook: 'positive' }, { score: 0.8 });
  executor.aggregator.addResult('news', { outlook: 'neutral' }, { score: 0.7 });

  const result3 = await executor.aggregator.aggregateConsensus(
    executor.aggregator.results
  );
  console.log(JSON.stringify(result3, null, 2));
}

demoResultAggregation();
```

### 4. Agent Discovery & Registry (智能体发现与注册)

以下代码实现了A2A协议中的智能体发现与注册机制：

```javascript
// Agent Card - Discovery Metadata
class AgentCard {
  constructor(agentId, name, description, capabilities, endpoints = {}) {
    this.agentId = agentId;
    this.name = name;
    this.description = description;
    this.capabilities = capabilities;
    this.endpoints = endpoints;
    this.version = '1.0';
    this.status = 'active';
    this.metadata = {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      provider: 'default',
      authType: 'none'
    };
  }

  toJSON() {
    return {
      agentId: this.agentId,
      name: this.name,
      description: this.description,
      capabilities: this.capabilities,
      version: this.version,
      status: this.status,
      endpoints: this.endpoints,
      metadata: this.metadata
    };
  }

  static fromJSON(json) {
    const card = new AgentCard(
      json.agentId,
      json.name,
      json.description,
      json.capabilities,
      json.endpoints
    );
    card.version = json.version;
    card.status = json.status;
    card.metadata = json.metadata;
    return card;
  }
}

// Agent Registry - Discovery Service
class AgentRegistry {
  constructor() {
    this.agents = new Map();
    this.subscriptions = new Map();
  }

  // Register an agent
  register(agentCard) {
    this.agents.set(agentCard.agentId, agentCard);
    console.log(`[Registry] Registered agent: ${agentCard.name} (${agentCard.agentId})`);
    this.notifySubscribers('register', agentCard);
    return agentCard;
  }

  // Unregister an agent
  unregister(agentId) {
    const agent = this.agents.get(agentId);
    if (agent) {
      this.agents.delete(agentId);
      console.log(`[Registry] Unregistered agent: ${agentId}`);
      this.notifySubscribers('unregister', agent);
      return true;
    }
    return false;
  }

  // Update agent status
  updateStatus(agentId, status) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.metadata.updatedAt = Date.now();
      console.log(`[Registry] Updated status for ${agentId}: ${status}`);
      this.notifySubscribers('status', agent);
      return agent;
    }
    return null;
  }

  // Discover agents by capability
  discoverByCapability(capability) {
    return Array.from(this.agents.values())
      .filter(agent => agent.status === 'active')
      .filter(agent => agent.capabilities.includes(capability));
  }

  // Discover agents by multiple capabilities (all must match)
  discoverByCapabilities(requiredCapabilities) {
    return Array.from(this.agents.values())
      .filter(agent => agent.status === 'active')
      .filter(agent => requiredCapabilities.every(cap => agent.capabilities.includes(cap)));
  }

  // Get agent by ID
  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  // Get all active agents
  getAllActive() {
    return Array.from(this.agents.values())
      .filter(agent => agent.status === 'active');
  }

  // Subscribe to registry changes
  subscribe(callback) {
    const subscriptionId = `sub_${Date.now()}`;
    this.subscriptions.set(subscriptionId, callback);
    return subscriptionId;
  }

  // Unsubscribe
  unsubscribe(subscriptionId) {
    return this.subscriptions.delete(subscriptionId);
  }

  // Notify subscribers
  notifySubscribers(event, agent) {
    this.subscriptions.forEach(callback => {
      try {
        callback(event, agent);
      } catch (error) {
        console.error('[Registry] Subscription error:', error);
      }
    });
  }

  // Get registry statistics
  getStats() {
    const agents = Array.from(this.agents.values());
    return {
      total: agents.length,
      active: agents.filter(a => a.status === 'active').length,
      inactive: agents.filter(a => a.status === 'inactive').length,
      byCapability: this.getCapabilityCounts()
    };
  }

  // Get capability distribution
  getCapabilityCounts() {
    const counts = {};
    this.agents.forEach(agent => {
      agent.capabilities.forEach(cap => {
        counts[cap] = (counts[cap] || 0) + 1;
      });
    });
    return counts;
  }
}

// A2A Server - Handles Agent Communication
class A2AServer {
  constructor(registry) {
    this.registry = registry;
    this.messageHandlers = new Map();
  }

  // Handle incoming A2A message
  async handleMessage(messageJson) {
    const message = A2AMessage.fromJSON(messageJson);

    console.log(`[A2AServer] Handling ${message.type} from ${message.sender}`);

    // Route based on message type
    switch (message.type) {
      case A2AMessageType.REQUEST:
        return await this.handleRequest(message);

      case A2AMessageType.NOTIFICATION:
        return await this.handleNotification(message);

      case 'discovery':
        return this.handleDiscovery(message);

      case 'heartbeat':
        return this.handleHeartbeat(message);

      default:
        console.warn(`[A2AServer] Unknown message type: ${message.type}`);
    }
  }

  // Handle discovery request
  handleDiscovery(message) {
    const { capability, agentId } = message.payload;

    let results;
    if (agentId) {
      const agent = this.registry.getAgent(agentId);
      results = agent ? [agent] : [];
    } else if (capability) {
      results = this.registry.discoverByCapability(capability);
    } else {
      results = this.registry.getAllActive();
    }

    return A2AMessage.response(
      'server',
      message.sender,
      { agents: results.map(a => a.toJSON()) },
      message.id
    );
  }

  // Handle agent request
  async handleRequest(message) {
    const { targetAgent, action, payload } = message.payload;

    const agent = this.registry.getAgent(targetAgent);
    if (!agent) {
      return A2AMessage.error(
        'server',
        message.sender,
        { code: 'AGENT_NOT_FOUND', message: `Agent ${targetAgent} not found` },
        message.id
      );
    }

    // Find handler for this agent
    const handler = this.messageHandlers.get(targetAgent);
    if (!handler) {
      return A2AMessage.error(
        'server',
        message.sender,
        { code: 'NO_HANDLER', message: 'Agent not available' },
        message.id
      );
    }

    try {
      const result = await handler(action, payload);
      return A2AMessage.response('server', message.sender, result, message.id);
    } catch (error) {
      return A2AMessage.error('server', message.sender, error, message.id);
    }
  }

  // Handle notification
  async handleNotification(message) {
    console.log(`[A2AServer] Notification: ${message.payload.event}`);
    // Process notification
    return null;
  }

  // Handle heartbeat
  handleHeartbeat(message) {
    const { agentId, status } = message.payload;
    if (status) {
      this.registry.updateStatus(agentId, status);
    }
    return A2AMessage.response('server', message.sender, { status: 'ok' }, message.id);
  }

  // Register message handler for agent
  onAgentMessage(agentId, handler) {
    this.messageHandlers.set(agentId, handler);
  }
}

// Usage
function demoAgentDiscovery() {
  const registry = new AgentRegistry();

  // Register agents
  const card1 = new AgentCard(
    'research-agent',
    'Research Agent',
    'Specialized in market research and analysis',
    ['research', 'analysis', 'data_gathering'],
    { apiEndpoint: '/api/agents/research-agent' }
  );

  const card2 = new AgentCard(
    'writer-agent',
    'Writer Agent',
    'Content creation and copywriting',
    ['writing', 'editing', 'translation'],
    { apiEndpoint: '/api/agents/writer-agent' }
  );

  const card3 = new AgentCard(
    'data-agent',
    'Data Agent',
    'Data processing and visualization',
    ['data_processing', 'analysis', 'visualization'],
    { apiEndpoint: '/api/agents/data-agent' }
  );

  registry.register(card1);
  registry.register(card2);
  registry.register(card3);

  // Subscribe to changes
  const subId = registry.subscribe((event, agent) => {
    console.log(`[Watch] ${event}: ${agent.name}`);
  });

  console.log('\n--- Discovery by Capability: research ---');
  const researchers = registry.discoverByCapability('research');
  console.log(researchers.map(a => a.name));

  console.log('\n--- Discovery: agents with analysis ---');
  const analysts = registry.discoverByCapabilities(['analysis']);
  console.log(analysts.map(a => a.name));

  console.log('\n--- Registry Statistics ---');
  console.log(registry.getStats());

  // Simulate A2A server
  console.log('\n--- A2A Server Discovery ---');
  const server = new A2AServer(registry);

  const discoveryMsg = A2AMessage.request('client', 'server', {
    capability: 'writing'
  });

  const response = server.handleDiscovery(discoveryMsg);
  console.log('Discovery response:', response.payload);

  // Cleanup
  registry.unsubscribe(subId);
}

demoAgentDiscovery();
```

### 5. RPC Communication (远程过程调用)

以下代码实现了基于RPC（远程过程调用）的智能体通信模式，提供了更直接的智能体间调用能力：

```javascript
// RPC Communication for Agents
// RPC通信模式用于智能体间调用

// RPC Message Types
const RPCMethod = {
  INVOKE: 'invoke',           // Call remote agent method
  STREAM: 'stream',           // Stream responses
  BATCH: 'batch',             // Batch multiple calls
  BROADCAST: 'broadcast'      // Broadcast to multiple agents
};

const RPCErrorCode = {
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  TIMEOUT: -32001,
  AGENT_UNAVAILABLE: -32002,
  AUTH_FAILED: -32003
};

// RPC Request
class RPCRequest {
  constructor(method, params, options = {}) {
    this.jsonrpc = '2.0';
    this.method = method;
    this.params = params;
    this.id = options.id || `rpc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timeout = options.timeout || 30000;
    this.retry = options.retry || 0;
    this.metadata = options.metadata || {};
  }

  toJSON() {
    return {
      jsonrpc: this.jsonrpc,
      method: this.method,
      params: this.params,
      id: this.id,
      timeout: this.timeout,
      retry: this.retry,
      metadata: this.metadata
    };
  }

  static fromJSON(json) {
    return new RPCRequest(json.method, json.params, {
      id: json.id,
      timeout: json.timeout,
      retry: json.retry,
      metadata: json.metadata
    });
  }
}

// RPC Response
class RPCResponse {
  constructor(id, result = null, error = null) {
    this.jsonrpc = '2.0';
    this.id = id;
    if (error) {
      this.error = {
        code: error.code || RPCErrorCode.INTERNAL_ERROR,
        message: error.message || 'Internal error',
        data: error.data
      };
    } else {
      this.result = result;
    }
  }

  static success(id, result) {
    return new RPCResponse(id, result);
  }

  static error(id, error) {
    return new RPCResponse(id, null, error);
  }

  isError() {
    return !!this.error;
  }

  toJSON() {
    const obj = {
      jsonrpc: this.jsonrpc,
      id: this.id
    };
    if (this.error) {
      obj.error = this.error;
    } else {
      obj.result = this.result;
    }
    return obj;
  }
}

// RPC Agent Stub - Client side
class RPCAgentStub {
  constructor(agentId, agentName, transport) {
    this.agentId = agentId;
    this.agentName = agentName;
    this.transport = transport;
    this.pendingRequests = new Map();
  }

  // Call remote agent method
  async invoke(method, params, options = {}) {
    const request = new RPCRequest(method, params, options);

    console.log(`[${this.agentName}] Calling ${this.agentId}.${method}`);

    // Set up timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`RPC timeout: ${method}`));
      }, request.timeout);
    });

    // Send request with retry logic
    let lastError;
    for (let attempt = 0; attempt <= request.retry; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`[${this.agentName}] Retry attempt ${attempt} for ${method}`);
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }

        const responsePromise = this.transport.send(request);
        const response = await Promise.race([responsePromise, timeoutPromise]);

        if (response.isError()) {
          throw new Error(`RPC Error: ${response.error.message}`);
        }

        console.log(`[${this.agentName}] Received response for ${method}`);
        return response.result;

      } catch (error) {
        lastError = error;
        console.error(`[${this.agentName}] Attempt ${attempt + 1} failed:`, error.message);
      }
    }

    throw lastError;
  }

  // Stream responses
  async *stream(method, params, options = {}) {
    const request = new RPCRequest(RPCMethod.STREAM, params, options);

    console.log(`[${this.agentName}] Starting stream: ${this.agentId}.${method}`);

    const stream = await this.transport.stream(request);

    for await (const chunk of stream) {
      if (chunk.error) {
        throw new Error(`Stream error: ${chunk.error.message}`);
      }
      yield chunk.result;
    }
  }

  // Batch multiple calls
  async batch(calls, options = {}) {
    const requests = calls.map(call =>
      new RPCRequest(call.method, call.params, options)
    );

    console.log(`[${this.agentName}] Batch call: ${requests.length} requests`);

    const response = await this.transport.batch(requests);

    return response.map((resp, index) => {
      if (resp.isError()) {
        return { error: resp.error, call: calls[index] };
      }
      return { result: resp.result, call: calls[index] };
    });
  }

  // Broadcast to multiple agents
  async broadcast(agentIds, method, params, options = {}) {
    const promises = agentIds.map(agentId =>
      this.invoke.call({ agentId, agentName: this.agentName, transport: this.transport },
        method, params, options)
    );

    console.log(`[${this.agentName}] Broadcasting to ${agentIds.length} agents`);

    return Promise.allSettled(promises);
  }

  // Create convenience methods
  createMethod(methodName) {
    return (params, options) => this.invoke(methodName, params, options);
  }
}

// RPC Agent Server - Server side
class RPCAgentServer {
  constructor(agentId, agentName) {
    this.agentId = agentId;
    this.agentName = agentName;
    this.methods = new Map();
    this.middleware = [];
  }

  // Register a method
  registerMethod(name, handler, schema = null) {
    this.methods.set(name, { handler, schema });
    console.log(`[${this.agentName}] Registered RPC method: ${name}`);
  }

  // Add middleware
  use(middleware) {
    this.middleware.push(middleware);
  }

  // Handle incoming RPC request
  async handleRequest(requestJson) {
    const request = RPCRequest.fromJSON(requestJson);

    console.log(`[${this.agentName}] Handling RPC: ${request.method}`);

    // Check method exists
    const methodInfo = this.methods.get(request.method);
    if (!methodInfo) {
      console.warn(`[${this.agentName}] Method not found: ${request.method}`);
      return RPCResponse.error(request.id, {
        code: RPCErrorCode.METHOD_NOT_FOUND,
        message: `Method not found: ${request.method}`
      });
    }

    // Execute with middleware
    try {
      const result = await this.executeWithMiddleware(request, methodInfo);
      return RPCResponse.success(request.id, result);
    } catch (error) {
      console.error(`[${this.agentName}] Method execution error:`, error);
      return RPCResponse.error(request.id, {
        code: RPCErrorCode.INTERNAL_ERROR,
        message: error.message,
        data: error.stack
      });
    }
  }

  // Execute with middleware chain
  async executeWithMiddleware(request, methodInfo) {
    let context = { request, params: request.params };

    // Run middleware
    for (const mw of this.middleware) {
      await mw(context);
      if (context.response) {
        return context.response;
      }
    }

    // Execute method
    const { handler } = methodInfo;

    // Validate params if schema provided
    if (methodInfo.schema) {
      this.validateParams(request.params, methodInfo.schema);
    }

    // Call handler
    return await methodInfo.handler(request.params, context);
  }

  // Simple param validation
  validateParams(params, schema) {
    for (const [key, type] of Object.entries(schema)) {
      if (schema[key].required && !(key in params)) {
        throw new Error(`Missing required parameter: ${key}`);
      }
      if (params[key] !== undefined && typeof params[key] !== type) {
        throw new Error(`Invalid type for ${key}: expected ${type}`);
      }
    }
  }

  // Handle batch requests
  handleBatch(requests) {
    return requests.map(req => this.handleRequest(req));
  }
}

// Simple Transport (in-process)
class InProcessTransport {
  constructor(server) {
    this.server = server;
  }

  async send(request) {
    return await this.server.handleRequest(request.toJSON());
  }

  async batch(requests) {
    return this.server.handleBatch(requests.map(r => r.toJSON()));
  }

  async *stream(request) {
    // For streaming, yield chunks
    const result = await this.send(request);
    yield { result };
  }
}

// HTTP Transport (for distributed systems)
class HTTPTransport {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
    this.options = options;
  }

  async send(request) {
    const response = await fetch(`${this.baseUrl}/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.options.headers
      },
      body: JSON.stringify(request.toJSON())
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return RPCResponse.fromJSON(await response.json());
  }

  async batch(requests) {
    const response = await fetch(`${this.baseUrl}/rpc/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requests.map(r => r.toJSON()))
    });

    const results = await response.json();
    return results.map(r => RPCResponse.fromJSON(r));
  }

  async *stream(request) {
    const response = await fetch(`${this.baseUrl}/rpc/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.toJSON())
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(l => l.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          yield data;
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }
}

// Usage
async function demoRPCCommunication() {
  console.log('\n=== RPC Communication Demo ===\n');

  // Create RPC server
  const server = new RPCAgentServer('research-agent', 'Research Agent');

  // Add authentication middleware
  server.use(async (context) => {
    const token = context.request.metadata?.token;
    if (!token && context.request.method !== 'getCapabilities') {
      context.response = RPCResponse.error(context.request.id, {
        code: RPCErrorCode.AUTH_FAILED,
        message: 'Authentication required'
      });
    }
  });

  // Register methods with schemas
  server.registerMethod('analyze', async (params, context) => {
    const { symbol, period } = params;

    console.log(`[Research Agent] Analyzing ${symbol} for ${period}`);

    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      symbol,
      period,
      analysis: 'Bullish trend detected',
      confidence: 0.85,
      target: 180.00
    };
  }, { symbol: 'string', period: 'string' });

  server.registerMethod('getRecommendations', async (params, context) => {
    const { sector, count = 5 } = params;

    console.log(`[Research Agent] Getting ${count} recommendations for ${sector}`);

    return {
      sector,
      recommendations: [
        { symbol: 'AAPL', score: 0.9 },
        { symbol: 'MSFT', score: 0.85 },
        { symbol: 'GOOGL', score: 0.8 }
      ]
    };
  }, { sector: 'string' });

  server.registerMethod('getCapabilities', async (params, context) => {
    return {
      agentId: 'research-agent',
      name: 'Research Agent',
      version: '1.0.0',
      methods: ['analyze', 'getRecommendations', 'getCapabilities'],
      capabilities: ['research', 'analysis', 'data_gathering']
    };
  }, {});

  // Create in-process transport
  const transport = new InProcessTransport(server);

  // Create client stub
  const client = new RPCAgentStub('research-agent', 'Client', transport);

  // Call methods
  console.log('\n--- Direct Method Call ---');
  const result1 = await client.invoke('getCapabilities', {});
  console.log('Capabilities:', result1);

  console.log('\n--- Analysis Call ---');
  const result2 = await client.invoke('analyze', {
    symbol: 'AAPL',
    period: '1Y'
  }, { timeout: 10000 });
  console.log('Analysis result:', result2);

  console.log('\n--- Batch Call ---');
  const batchResults = await client.batch([
    { method: 'getCapabilities', params: {} },
    { method: 'analyze', params: { symbol: 'MSFT', period: '6M' } }
  ]);
  console.log('Batch results:', batchResults);

  // Test authentication
  console.log('\n--- Auth Test (should fail) ---');
  try {
    await client.invoke('analyze', { symbol: 'TSLA', period: '1M' });
  } catch (error) {
    console.log('Expected error:', error.message);
  }

  // Test with auth
  console.log('\n--- Auth Test (with token) ---');
  const authResult = await client.invoke('analyze',
    { symbol: 'TSLA', period: '1M' },
    { metadata: { token: 'valid-token' } }
  );
  console.log('Auth success:', authResult);
}

demoRPCCommunication();
```

### A2A Protocol Official Documentation

### A2A协议官方文档

以下内容基于A2A（Agent-to-Agent）协议的官方规范，提供了协议的完整技术参考：

#### A2A Protocol Overview

#### A2A协议概述

A2A是Google提出的智能体间通信协议，旨在解决多智能体系统中智能体之间的通信问题。A2A协议强调"能力发现"和"自然语言协作"两个核心原则。

**核心特性：**
- **能力发现（Capability Discovery）**：通过Agent Card进行服务发现
- **自然语言协作（Natural Language Collaboration）**：支持非结构化对话
- **任务导向（Task-Oriented）**：支持长时间运行的任务
- **安全认证（Authentication）**：内置认证和授权机制

#### Agent Card Specification

#### Agent Card规范

Agent Card是智能体的元数据描述文件，遵循JSON Schema规范：

```json
{
  "name": "string",
  "description": "string",
  "url": "string",
  "provider": {
    "organization": "string",
    "url": "string"
  },
  "version": "string",
  "capabilities": {
    "streaming": boolean,
    "pushNotifications": boolean,
    "stateTransitionHistory": boolean
  },
  "authentication": {
    "type": "string",
    "schemes": ["string"],
    "credential": "string"
  },
  "defaultInputModes": ["string"],
  "defaultOutputModes": ["string"],
  "skills": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "tags": ["string"],
      "examples": ["string"]
    }
  ]
}
```

#### Message Protocol

#### 消息协议

A2A协议支持多种消息类型：

**1. JSON-RPC 2.0消息格式**
```json
{
  "jsonrpc": "2.0",
  "id": "string",
  "method": "string",
  "params": {
    "message": {
      "role": "user|agent",
      "parts": [
        {
          "type": "text|image|file",
          "text": "string",
          "mimeType": "string",
          "data": "string"
        }
      ],
      "metadata": {}
    },
    "taskId": "string",
    "sessionId": "string",
    "metadata": {}
  }
}
```

**2. 任务状态消息**
```json
{
  "id": "string",
  "status": {
    "state": "submitted|working|completed|failed|input-required",
    "message": {
      "role": "agent",
      "parts": [{"type": "text", "text": "Progress update..."}]
    },
    "metadata": {}
  },
  "final": boolean
}
```

#### Streaming Support

#### 流式支持

A2A协议支持Server-Sent Events (SSE)进行流式响应：

```javascript
// Server-Side SSE Implementation
async function handleA2AStream(request, response) {
  response.setHeader('Content-Type', 'text/event-stream');
  response.setHeader('Cache-Control', 'no-cache');
  response.setHeader('Connection', 'keep-alive');

  const taskId = request.params.taskId;

  // Send task updates
  const sendEvent = (event, data) => {
    response.write(`event: ${event}\n`);
    response.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Initial status
  sendEvent('message', {
    id: taskId,
    status: { state: 'working' }
  });

  // Process task
  for await (const chunk of processTask(request)) {
    sendEvent('message', {
      id: taskId,
      status: {
        state: 'working',
        message: { role: 'agent', parts: [{ type: 'text', text: chunk }] }
      }
    });
  }

  // Final result
  sendEvent('message', {
    id: taskId,
    status: { state: 'completed' },
    final: true
  });

  response.end();
}
```

#### Task Lifecycle

#### 任务生命周期

A2A协议定义了完整的任务生命周期：

```
submitted → working → (completed | failed | input-required)
```

**状态说明：**
- **submitted**：任务已提交，等待处理
- **working**：任务正在执行中
- **completed**：任务成功完成
- **failed**：任务执行失败
- **input-required**：需要用户输入

#### Authentication & Security

#### 认证与安全

A2A协议支持多种认证方案：

```json
{
  "authentication": {
    "type": "oauth2|api_key|jwt",
    "schemes": ["Bearer", "Basic"],
    "credential": "encrypted-credential"
  }
}
```

**OAuth 2.0流程：**
1. 客户端从Agent Card获取授权服务器URL
2. 进行OAuth授权流程
3. 获取访问令牌
4. 在请求中携带Bearer Token

#### Implementation Example

#### 实现示例

```javascript
// A2A Client Implementation
class A2AClient {
  constructor(agentCard) {
    this.agentCard = agentCard;
    this.baseUrl = agentCard.url;
    this.capabilities = agentCard.capabilities;
  }

  // Send task to agent
  async sendTask(task, options = {}) {
    const response = await fetch(`${this.baseUrl}/tasks/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.token}`
      },
      body: JSON.stringify({
        message: task.message,
        taskId: options.taskId,
        sessionId: options.sessionId,
        metadata: options.metadata
      })
    });

    return await response.json();
  }

  // Get task result
  async getTask(taskId, options = {}) {
    const url = new URL(`${this.baseUrl}/tasks/${taskId}`);
    if (options.historyLength) {
      url.searchParams.set('historyLength', options.historyLength);
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${options.token}`
      }
    });

    return await response.json();
  }

  // Stream task updates
  async *streamTask(taskId, options = {}) {
    const url = new URL(`${this.baseUrl}/tasks/${taskId}/stream`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${options.token}`
      }
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          yield JSON.parse(line.slice(6));
        }
      }
    }
  }
}

// Usage
async function demoA2AClient() {
  // Agent Card (usually fetched from registry)
  const agentCard = {
    name: 'Research Agent',
    url: 'https://api.research-agent.example.com',
    version: '1.0.0',
    capabilities: {
      streaming: true,
      pushNotifications: false,
      stateTransitionHistory: true
    },
    authentication: {
      type: 'oauth2',
      schemes: ['Bearer']
    }
  };

  // Create client
  const client = new A2AClient(agentCard);

  // Send task
  const result = await client.sendTask({
    message: {
      role: 'user',
      parts: [{ type: 'text', text: 'Research NVIDIA latest earnings' }]
    }
  }, { token: 'access-token' });

  console.log('Task result:', result);

  // Stream updates
  for await (const update of client.streamTask(result.id)) {
    console.log('Update:', update.status.state);
    if (update.final) {
      console.log('Final result:', update);
    }
  }
}
```

### 本章小结

本章我们深入探讨了智能体间通信(A2A)模式的核心概念和实现方式。A2A协议是构建多智能体系统的基础，使不同智能体能够有效地共享信息、协调行动和协作完成复杂任务。

### 关键要点回顾

**1. A2A消息协议**
- 标准化的消息结构，支持多种消息类型
- 消息优先级和TTL机制
- 请求-响应、通知、错误等消息模式
- 消息序列化和反序列化

**2. 任务委派**
- 基于能力的智能体匹配
- 负载均衡和任务队列管理
- 任务状态跟踪和依赖处理
- 委派结果返回

**3. 结果聚合**
- 多种聚合策略：First、All、Best、Weighted、Consensus
- LLM驱动的共识发现
- 错误处理和降级策略
- 实时结果监听

**4. 智能体发现与注册**
- Agent Card元数据标准
- 基于能力的智能体发现
- 注册中心状态管理
- A2A服务器消息路由

**5. RPC通信**
- JSON-RPC 2.0标准协议
- 支持同步调用、流式响应、批量调用和广播
- 中间件机制用于认证和日志
- 多种传输层支持（进程内、HTTP）

**6. A2A官方协议**
- Agent Card规范和技能定义
- JSON-RPC消息格式
- 任务生命周期管理
- 流式响应(SSE)支持
- OAuth2认证机制

### A2A 最佳实践

1. **使用标准化消息格式**：遵循A2A协议的消息结构，确保互操作性

2. **实现智能任务委派**：根据智能体能力和负载进行任务分配

3. **选择合适的聚合策略**：根据业务场景选择结果聚合方式

4. **实现发现机制**：建立注册中心支持动态智能体发现

5. **处理失败和超时**：为智能体间通信添加重试和降级机制

### A2A 应用场景

| 场景 | 应用方式 |
|------|---------|

| 多智能体协作 | 研究员+分析师+作家协同完成报告 |
| 任务分发 | 根据能力将任务分发给最合适的智能体 |
| 结果汇总 | 聚合多个视角的分析结果 |
| 动态发现 | 根据需求发现和调用可用智能体 |
| 企业集成 | 不同系统间的智能体通信 |
| RPC调用 | 分布式智能体间的直接方法调用 |

### A2A vs MCP vs RPC

| 特性 | A2A | MCP | RPC |
|------|-----|-----|-----|

| 焦点 | 智能体间通信 | 上下文管理 | 方法调用 |
| 消息模式 | 请求/响应/通知 | 请求/响应 | 请求/响应 |
| 适用范围 | 多智能体系统 | 单智能体工具调用 | 分布式服务 |
| 状态管理 | 分布式 | 集中式 | 无状态 |
| 调用粒度 | 任务级 | 函数级 | 方法级 |

### 总结

## 社区热议与实践分享

A2A 协议自 2025 年 4 月发布以来迅速成为 AI Agent 生态的焦点，社区围绕协议定位、与 MCP 的关系以及企业落地展开了热烈讨论。

### A2A vs MCP：互补而非竞争

社区达成的关键共识是：A2A 与 MCP **互补而非竞争**。[Google 开发者博客](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)明确表示 A2A 补充了 Anthropic 的 MCP。[IBM](https://www.ibm.com/think/topics/agent2agent-protocol) 总结为：MCP 装备单个 Agent 的能力和数据，A2A 则让 Agent 作为团队协作。[Koyeb](https://www.koyeb.com/blog/a2a-and-mcp-start-of-the-ai-agent-protocol-wars) 发文讨论这是否标志着"AI Agent 协议战争"的开始。

### 生态爆发式增长

A2A 从发布时 50+ 合作伙伴迅速扩展至 150+ 组织，涵盖每一个主要云服务商和领先技术提供商。协议已移交 [Linux Foundation](https://github.com/a2aproject/A2A) 治理，v0.3 版本引入了 gRPC 支持、签名安全卡和 Python SDK 扩展。

据 [IDC 预测](https://research.aimultiple.com/agent2agent/)，Agentic AI 支出到 2029 年将超过 $1.3 万亿，年复合增长率 31.9%。

### 企业落地案例

来自 [Google Cloud 博客](https://cloud.google.com/blog/products/ai-machine-learning/agent2agent-protocol-is-getting-an-upgrade)的企业案例：
- **Adobe**：利用 A2A 实现分布式 Agent 与 Google Cloud 生态的互操作
- **Tyson Foods / Gordon Food Service**：供应链协作 A2A 系统
- **Twilio**：延迟感知 Agent 选择（Latency Aware Agent Selection）
- **ServiceNow、SAP、Salesforce**：企业工作流 Agent 互通

### 协议技术亮点

A2A 的核心能力包括：
- **能力发现**：通过 JSON 格式的 "Agent Cards" 声明能力
- **任务管理**：定义任务生命周期状态
- **Agent 协作**：上下文和指令共享
- **UX 协商**：适配不同 UI 能力
- 基于 HTTP、SSE、JSON-RPC 构建，企业级认证和授权

---

## 参考资源

### 官方资源

- [Google 开发者博客 - A2A 协议公告](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
- [Google Cloud 博客 - A2A 协议升级](https://cloud.google.com/blog/products/ai-machine-learning/agent2agent-protocol-is-getting-an-upgrade)
- [A2A GitHub 仓库](https://github.com/a2aproject/A2A)
- [A2A Protocol 官网](https://a2aprotocol.ai/)

### 行业分析

- [IBM - What Is Agent2Agent Protocol?](https://www.ibm.com/think/topics/agent2agent-protocol)
- [Koyeb - A2A and MCP: Start of the AI Agent Protocol Wars?](https://www.koyeb.com/blog/a2a-and-mcp-start-of-the-ai-agent-protocol-wars)
- [Platform Engineering - Google Cloud Unveils A2A Protocol](https://platformengineering.com/editorial-calendar/best-of-2025/google-cloud-unveils-agent2agent-protocol-a-new-standard-for-ai-agent-interoperability-2/)
- [Virtualization Review - Google A2A Joins Viral MCP](https://virtualizationreview.com/articles/2025/04/09/protocols-for-agentic-ai-googles-new-a2a-joins-viral-mcp.aspx)
- [AIMultiple - Multi-Agent Communication with A2A in 2026](https://research.aimultiple.com/agent2agent/)
- [OneReach - A2A Protocol Explained (2026)](https://onereach.ai/blog/what-is-a2a-agent-to-agent-protocol/)

### 总结

A2A(智能体间通信)模式是构建复杂多智能体系统的核心技术。通过本章介绍的消息协议、任务委派、结果聚合、发现机制以及RPC通信，开发者可以构建高效、可靠的多智能体协作系统。A2A与MCP互补，共同支撑现代AI智能体架构。

---

*本章代码示例均基于 LangChain JavaScript SDK 实现，可直接在实际项目中使用或根据具体需求进行修改。*