---
title: 'Chapter 10: Model Context Protocol (MCP)'
date: '2026-03-15'
excerpt: 'The Model Context Protocol (MCP) is a standardized framework for managing context and communication in agentic systems. 融合社区洞察与行业实践，全面解析MCP从Anthropic内部实验到行业标准的演进历程。'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 10: Model Context Protocol (MCP)

# 第十章：模型上下文协议(MCP)

## MCP Pattern Overview

## MCP模式概述

The Model Context Protocol (MCP) is a standardized framework for managing context and communication in agentic systems.

模型上下文协议(MCP)是智能体系统中管理上下文和通信的标准化框架。

MCP provides a common language and structure for agents to share context, request assistance, and coordinate their actions.

MCP为智能体提供通用语言和结构来共享上下文、请求协助和协调他们的行动。

### Key Components of MCP

### MCP的关键组件

**Context Format**: A standardized format for representing the current state, including conversation history, user information, and relevant data.

**上下文格式**: 表示当前状态的标准化格式，包括对话历史、用户信息和相关数据。

**Communication Protocol**: Rules for how agents exchange information and requests.

**通信协议**: 智能体如何交换信息和请求的规则。

**State Management**: Mechanisms for tracking and updating the shared state.

**状态管理**: 跟踪和更新共享状态的机制。

### Benefits of MCP

### MCP的好处

**Interoperability**: Different agents and systems can work together more easily.

**互操作性**: 不同的智能体和系统可以更容易地协同工作。

**Scalability**: MCP supports adding new agents and capabilities without disrupting existing systems.

**可扩展性**: MCP支持添加新的智能体和能力而不会破坏现有系统。

**Consistency**: Standardized context management ensures consistent behavior across interactions.

**一致性**: 标准化的上下文管理确保跨交互的一致行为。

## Practical Applications & Use Cases

## 实际应用和用例

### Multi-Agent Systems

### 多智能体系统

MCP enables multiple agents to coordinate effectively by sharing context and state.

MCP通过共享上下文和状态使多个智能体能够有效协调。

### Complex Workflows

### 复杂工作流

MCP provides a structured way to manage the flow of information in complex workflows.

MCP提供了在复杂工作流中管理信息流动的结构化方式。

### Enterprise Integration

### 企业集成

MCP facilitates integration between different enterprise systems and applications.

MCP促进不同企业系统和应用之间的集成。

## Hands-On Code Examples

## 实践代码示例

### 1. Context Format (上下文格式)

以下代码实现了标准化的上下文格式，用于表示对话状态、用户信息和相关数据：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0.7 });

// Standardized Context Format following MCP
class MCPContext {
  constructor() {
    this.version = "1.0";
    this.conversationHistory = [];
    this.userProfile = {};
    this.relevantData = new Map();
    this.metadata = {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sessionId: null
    };
  }

  // Add message to conversation
  addMessage(role, content, metadata = {}) {
    this.conversationHistory.push({
      role,
      content,
      timestamp: Date.now(),
      metadata
    });
    this.metadata.updatedAt = Date.now();
  }

  // Set user profile
  setUserProfile(profile) {
    this.userProfile = { ...this.userProfile, ...profile };
    this.metadata.updatedAt = Date.now();
  }

  // Add relevant data
  addData(key, value) {
    this.relevantData.set(key, {
      value,
      timestamp: Date.now()
    });
    this.metadata.updatedAt = Date.now();
  }

  // Get data by key
  getData(key) {
    return this.relevantData.get(key)?.value;
  }

  // Serialize to JSON (for transmission)
  toJSON() {
    return {
      version: this.version,
      conversationHistory: this.conversationHistory,
      userProfile: this.userProfile,
      relevantData: Object.fromEntries(
        Array.from(this.relevantData.entries()).map(([k, v]) => [k, v.value])
      ),
      metadata: this.metadata
    };
  }

  // Deserialize from JSON (for reception)
  static fromJSON(json) {
    const context = new MCPContext();
    context.version = json.version;
    context.conversationHistory = json.conversationHistory;
    context.userProfile = json.userProfile;
    context.relevantData = new Map(
      Object.entries(json.relevantData || {}).map(([k, v]) => [k, { value: v, timestamp: Date.now() }])
    );
    context.metadata = json.metadata;
    return context;
  }

  // Get context summary for LLM
  getContextSummary() {
    let summary = "Context:\n";

    if (Object.keys(this.userProfile).length > 0) {
      summary += `User Profile: ${JSON.stringify(this.userProfile)}\n`;
    }

    if (this.relevantData.size > 0) {
      summary += "Relevant Data:\n";
      for (const [key, { value }] of this.relevantData.entries()) {
        summary += `- ${key}: ${JSON.stringify(value)}\n`;
      }
    }

    if (this.conversationHistory.length > 0) {
      summary += "\nConversation:\n";
      summary += this.conversationHistory
        .slice(-5)
        .map(m => `${m.role}: ${m.content}`)
        .join('\n');
    }

    return summary;
  }
}

// Usage
const context = new MCPContext();
context.setUserProfile({
  name: "John",
  language: "en",
  preferences: { detailLevel: "medium" }
});

context.addData("current_project", "AI Agent Development");
context.addData("budget", 50000);

context.addMessage("user", "I need help with the project");
context.addMessage("assistant", "Of course! What would you like to know?");

console.log("Context Summary:");
console.log(context.getContextSummary());
console.log("\nSerialized Context:");
console.log(JSON.stringify(context.toJSON(), null, 2));
```

### 2. Communication Protocol (通信协议)

以下代码实现了MCP通信协议，定义了智能体之间如何交换信息和请求：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0.7 });

// MCP Message Types
const MessageType = {
  REQUEST: 'request',
  RESPONSE: 'response',
  NOTIFICATION: 'notification',
  ERROR: 'error'
};

// MCP Priority Levels
const Priority = {
  LOW: 1,
  NORMAL: 5,
  HIGH: 10,
  CRITICAL: 20
};

// MCP Message Structure
class MCPMessage {
  constructor(type, sender, receiver, content, options = {}) {
    this.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.type = type;
    this.sender = sender;
    this.receiver = receiver;
    this.content = content;
    this.priority = options.priority || Priority.NORMAL;
    this.metadata = options.metadata || {};
    this.timestamp = Date.now();
    this.correlationId = options.correlationId || null;
  }

  // Create a request message
  static request(sender, receiver, content, options = {}) {
    return new MCPMessage(MessageType.REQUEST, sender, receiver, content, options);
  }

  // Create a response message
  static response(sender, receiver, content, correlationId, options = {}) {
    return new MCPMessage(MessageType.RESPONSE, sender, receiver, content, {
      ...options,
      correlationId
    });
  }

  // Create a notification message
  static notification(sender, receiver, content, options = {}) {
    return new MCPMessage(MessageType.NOTIFICATION, sender, receiver, content, options);
  }

  // Create an error message
  static error(sender, receiver, error, correlationId, options = {}) {
    return new MCPMessage(MessageType.ERROR, sender, receiver, { error }, correlationId, options);
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      sender: this.sender,
      receiver: this.receiver,
      content: this.content,
      priority: this.priority,
      metadata: this.metadata,
      timestamp: this.timestamp,
      correlationId: this.correlationId
    };
  }
}

// MCP Communication Protocol Handler
class MCPProtocol {
  constructor(agentId) {
    this.agentId = agentId;
    this.messageQueue = [];
    this.handlers = new Map();
    this.pendingRequests = new Map();
  }

  // Register message handler
  on(messageType, handler) {
    this.handlers.set(messageType, handler);
  }

  // Send message
  async send(message) {
    console.log(`[${this.agentId}] Sending ${message.type} to ${message.receiver}`);

    // Add to queue
    this.messageQueue.push(message);

    // Handle based on type
    if (message.type === MessageType.REQUEST) {
      return this.handleRequest(message);
    } else if (message.type === MessageType.NOTIFICATION) {
      return this.handleNotification(message);
    }

    return null;
  }

  // Handle incoming request
  async handleRequest(message) {
    const handler = this.handlers.get(MessageType.REQUEST);
    let response;

    if (handler) {
      try {
        response = await handler(message.content, message);
        return MCPMessage.response(
          this.agentId,
          message.sender,
          response,
          message.id
        );
      } catch (error) {
        return MCPMessage.error(
          this.agentId,
          message.sender,
          error.message,
          message.id
        );
      }
    }

    return MCPMessage.response(
      this.agentId,
      message.sender,
      { status: "no handler found" },
      message.id
    );
  }

  // Handle notification
  async handleNotification(message) {
    const handler = this.handlers.get(MessageType.NOTIFICATION);
    if (handler) {
      await handler(message.content, message);
    }
  }

  // Send request and wait for response
  async sendRequest(receiver, content, options = {}) {
    const message = MCPMessage.request(this.agentId, receiver, content, options);
    this.pendingRequests.set(message.id, message);

    // In real implementation, this would wait for actual response
    console.log(`[${this.agentId}] Awaiting response for ${message.id}`);

    return message;
  }

  // Get message history
  getHistory(limit = 50) {
    return this.messageQueue.slice(-limit);
  }
}

// Usage
const agentA = new MCPProtocol("AgentA");
const agentB = new MCPProtocol("AgentB");

// Register handlers
agentB.on(MessageType.REQUEST, async (content, message) => {
  console.log(`[AgentB] Received request: ${content.task}`);

  if (content.task === "calculate") {
    // Simulate calculation
    const result = eval(content.expression);
    return { result, agent: "AgentB" };
  }

  return { status: "processed", content: content.task };
});

// Send messages
async function demoProtocol() {
  // Send request
  const request = MCPMessage.request(
    "AgentA",
    "AgentB",
    { task: "calculate", expression: "10 + 20" },
    { priority: Priority.HIGH }
  );

  const response = await agentB.handleRequest(request);
  console.log("\nResponse:", response.toJSON());

  // Send notification
  const notification = MCPMessage.notification(
    "AgentA",
    "AgentB",
    { event: "task_completed", taskId: "123" }
  );

  await agentB.handleNotification(notification);
  console.log("\nNotification sent");

  // Show message history
  console.log("\nMessage History:");
  agentB.getHistory().forEach(m => {
    console.log(`- ${m.type}: ${m.sender} -> ${m.receiver}`);
  });
}

demoProtocol();
```

### 3. State Management (状态管理)

以下代码实现了MCP状态管理机制，用于跟踪和更新共享状态：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0.7 });

// State Change Types
const ChangeType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete'
};

// State Item
class StateItem {
  constructor(key, value, metadata = {}) {
    this.key = key;
    this.value = value;
    this.metadata = metadata;
    this.version = 1;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.createdBy = null;
    this.updatedBy = null;
  }

  update(value, updatedBy) {
    this.value = value;
    this.version++;
    this.updatedAt = Date.now();
    this.updatedBy = updatedBy;
  }
}

// State Manager following MCP
class MCPStateManager {
  constructor(agentId) {
    this.agentId = agentId;
    this.state = new Map();
    this.changeHistory = [];
    this.listeners = new Map();
    this.locks = new Map();
  }

  // Create state
  create(key, value, metadata = {}, createdBy = null) {
    if (this.state.has(key)) {
      throw new Error(`State key '${key}' already exists`);
    }

    const item = new StateItem(key, value, metadata);
    item.createdBy = createdBy || this.agentId;

    this.state.set(key, item);
    this.recordChange(ChangeType.CREATE, key, value);

    this.notifyListeners(key, ChangeType.CREATE, value);
    return item;
  }

  // Read state
  get(key) {
    return this.state.get(key);
  }

  // Get value only
  getValue(key) {
    return this.state.get(key)?.value;
  }

  // Update state
  update(key, value, updatedBy = null) {
    const item = this.state.get(key);
    if (!item) {
      throw new Error(`State key '${key}' not found`);
    }

    const oldValue = item.value;
    item.update(value, updatedBy || this.agentId);

    this.recordChange(ChangeType.UPDATE, key, { old: oldValue, new: value });
    this.notifyListeners(key, ChangeType.UPDATE, value);

    return item;
  }

  // Delete state
  delete(key, deletedBy = null) {
    const item = this.state.get(key);
    if (!item) {
      throw new Error(`State key '${key}' not found`);
    }

    this.state.delete(key);
    this.recordChange(ChangeType.DELETE, key, item.value);

    this.notifyListeners(key, ChangeType.DELETE, null);

    return item;
  }

  // Acquire lock
  async acquireLock(key, owner, timeout = 5000) {
    const lockKey = `lock:${key}`;

    if (this.locks.has(lockKey)) {
      const lock = this.locks.get(lockKey);
      if (lock.owner !== owner && Date.now() < lock.expiresAt) {
        return false;
      }
    }

    this.locks.set(lockKey, {
      owner,
      acquiredAt: Date.now(),
      expiresAt: Date.now() + timeout
    });

    return true;
  }

  // Release lock
  releaseLock(key, owner) {
    const lockKey = `lock:${key}`;
    const lock = this.locks.get(lockKey);

    if (lock && lock.owner === owner) {
      this.locks.delete(lockKey);
      return true;
    }

    return false;
  }

  // Record change history
  recordChange(type, key, value) {
    this.changeHistory.push({
      type,
      key,
      value,
      timestamp: Date.now(),
      agentId: this.agentId
    });

    // Keep only last 1000 changes
    if (this.changeHistory.length > 1000) {
      this.changeHistory = this.changeHistory.slice(-1000);
    }
  }

  // Subscribe to changes
  subscribe(key, listener) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(listener);
  }

  // Notify listeners
  notifyListeners(key, type, value) {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach(listener => listener(type, value));
    }

    // Notify global listeners
    const globalListeners = this.listeners.get('*');
    if (globalListeners) {
      globalListeners.forEach(listener => listener(key, type, value));
    }
  }

  // Get state snapshot
  getSnapshot() {
    const snapshot = {};
    for (const [key, item] of this.state.entries()) {
      snapshot[key] = {
        value: item.value,
        version: item.version,
        updatedAt: item.updatedAt
      };
    }
    return snapshot;
  }

  // Get change history
  getHistory(limit = 100) {
    return this.changeHistory.slice(-limit);
  }

  // Rollback to previous version
  rollback(key) {
    const history = this.changeHistory.filter(c => c.key === key);
    if (history.length < 2) {
      throw new Error("No previous version to rollback to");
    }

    const previousChange = history[history.length - 2];
    this.update(key, previousChange.value);
  }
}

// Usage
const stateManager = new MCPStateManager("AgentA");

// Subscribe to changes
stateManager.subscribe('counter', (type, value) => {
  console.log(`[Listener] Counter changed: ${type} -> ${value}`);
});

stateManager.subscribe('*', (key, type, value) => {
  console.log(`[Global Listener] ${key}: ${type}`);
});

// Create state
stateManager.create('counter', 0, { description: "Task counter" });
stateManager.create('tasks', [], { description: "Task list" });

// Update state
stateManager.update('counter', 1);
stateManager.update('counter', 2);

// Add to array
const tasks = stateManager.getValue('tasks') || [];
tasks.push({ id: 1, title: "Review PR" });
stateManager.update('tasks', tasks);

// Acquire lock
async function demoLocks() {
  const lockAcquired = await stateManager.acquireLock('counter', 'AgentA');
  console.log(`Lock acquired: ${lockAcquired}`);

  if (lockAcquired) {
    stateManager.update('counter', 3);
    stateManager.releaseLock('counter', 'AgentA');
  }

  // Show snapshot
  console.log("\nState Snapshot:");
  console.log(stateManager.getSnapshot());

  // Show history
  console.log("\nChange History:");
  stateManager.getHistory(5).forEach(h => {
    console.log(`- ${h.type} ${h.key}:`, h.value);
  });
}

demoLocks();
```

### 4. Multi-Agent Coordination (多智能体协调)

以下代码实现了基于MCP的多智能体协调系统：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0.7 });

// Agent Definition
class MCPAgent {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.role = config.role;
    this.capabilities = config.capabilities || [];
    this.protocol = new MCPProtocol(this.id);
    this.stateManager = new MCPStateManager(this.id);
    this.llm = config.llm || llm;
  }

  async initialize() {
    console.log(`[${this.name}] Initialized with capabilities: ${this.capabilities.join(', ')}`);
  }

  async processTask(task) {
    console.log(`[${this.name}] Processing task: ${task.type}`);

    const result = await this.executeTask(task);
    return result;
  }

  async executeTask(task) {
    // Task execution logic based on role
    const prompt = ChatPromptTemplate.fromTemplate(
      `You are ${this.role}. Execute this task: {task}

Provide your result:`
    );

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());
    return chain.invoke({ task: JSON.stringify(task) });
  }
}

// Multi-Agent Coordinator
class MCPCoordinator {
  constructor() {
    this.agents = new Map();
    this.taskQueue = [];
    this.completedTasks = [];
  }

  // Register agent
  registerAgent(agent) {
    this.agents.set(agent.id, agent);
    console.log(`Coordinator: Registered ${agent.name}`);
  }

  // Route task to appropriate agent
  routeTask(task) {
    // Find capable agents
    const capableAgents = Array.from(this.agents.values())
      .filter(agent => task.requiredCapabilities.every(cap => agent.capabilities.includes(cap)));

    if (capableAgents.length === 0) {
      console.log(`Coordinator: No agent found for task requiring ${task.requiredCapabilities.join(', ')}`);
      return null;
    }

    // Select agent (round-robin or least loaded)
    const selectedAgent = capableAgents[0];
    console.log(`Coordinator: Routed task to ${selectedAgent.name}`);

    return selectedAgent;
  }

  // Execute task with coordination
  async executeTask(task) {
    const agent = this.routeTask(task);

    if (!agent) {
      return { error: "No suitable agent found" };
    }

    try {
      const result = await agent.processTask(task);

      this.completedTasks.push({
        task,
        agent: agent.id,
        result,
        completedAt: Date.now()
      });

      return { agent: agent.name, result };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Execute parallel tasks
  async executeParallel(tasks) {
    console.log(`Coordinator: Executing ${tasks.length} tasks in parallel`);

    const promises = tasks.map(task => this.executeTask(task));
    const results = await Promise.all(promises);

    return results;
  }

  // Execute sequential tasks with dependencies
  async executeSequential(tasks) {
    console.log(`Coordinator: Executing ${tasks.length} tasks sequentially`);

    const results = [];
    const sharedState = {};

    for (const task of tasks) {
      // Inject results from previous tasks if needed
      if (task.dependsOn) {
        task.context = task.dependsOn.map(depId => {
          return results.find(r => r.taskId === depId);
        });
      }

      const result = await this.executeTask(task);
      results.push({ taskId: task.id, ...result });

      // Store in shared state
      if (task.outputKey) {
        sharedState[task.outputKey] = result;
      }
    }

    return { results, sharedState };
  }

  // Get system status
  getStatus() {
    return {
      registeredAgents: this.agents.size,
      pendingTasks: this.taskQueue.length,
      completedTasks: this.completedTasks.length,
      agents: Array.from(this.agents.values()).map(a => ({
        id: a.id,
        name: a.name,
        role: a.role
      }))
    };
  }
}

// Usage
async function demoMultiAgent() {
  // Create coordinator
  const coordinator = new MCPCoordinator();

  // Create agents
  const researchAgent = new MCPAgent({
    id: "researcher",
    name: "Research Agent",
    role: "Research Specialist",
    capabilities: ["research", "analysis", "information_gathering"],
    llm
  });

  const writerAgent = new MCPAgent({
    id: "writer",
    name: "Writer Agent",
    role: "Content Writer",
    capabilities: ["writing", "summarization", "formatting"],
    llm
  });

  const codeAgent = new MCPAgent({
    id: "coder",
    name: "Code Agent",
    role: "Software Developer",
    capabilities: ["coding", "debugging", "testing"],
    llm
  });

  // Register agents
  await researchAgent.initialize();
  await writerAgent.initialize();
  await codeAgent.initialize();

  coordinator.registerAgent(researchAgent);
  coordinator.registerAgent(writerAgent);
  coordinator.registerAgent(codeAgent);

  // Execute single task
  console.log("\n--- Single Task ---");
  const singleResult = await coordinator.executeTask({
    id: "task1",
    type: "research",
    requiredCapabilities: ["research"],
    content: "Find latest AI trends"
  });
  console.log("Result:", singleResult);

  // Execute parallel tasks
  console.log("\n--- Parallel Tasks ---");
  const parallelResults = await coordinator.executeParallel([
    { id: "task2", type: "research", requiredCapabilities: ["research"], content: "AI in healthcare" },
    { id: "task3", type: "writing", requiredCapabilities: ["writing"], content: "Write about AI" }
  ]);
  console.log("Results:", parallelResults);

  // Execute sequential tasks
  console.log("\n--- Sequential Tasks ---");
  const sequentialResults = await coordinator.executeSequential([
    { id: "task4", type: "research", requiredCapabilities: ["research"], content: "Quantum computing", outputKey: "research_result" },
    { id: "task5", type: "writing", requiredCapabilities: ["writing"], content: "Write about {research_result}" }
  ]);
  console.log("Results:", sequentialResults);

  // Get status
  console.log("\n--- System Status ---");
  console.log(coordinator.getStatus());
}

demoMultiAgent();
```

### 5. Complex Workflow Management (复杂工作流管理)

以下代码实现了基于MCP的复杂工作流管理系统：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0.7 });

// Workflow Status
const WorkflowStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PAUSED: 'paused'
};

// Workflow Step
class WorkflowStep {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.type = config.type; // 'task', 'condition', 'parallel', 'loop'
    this.config = config.config;
    this.dependsOn = config.dependsOn || [];
    this.status = WorkflowStatus.PENDING;
    this.result = null;
    this.error = null;
    this.startedAt = null;
    this.completedAt = null;
  }
}

// MCP Workflow Engine
class MCPWorkflowEngine {
  constructor() {
    this.workflows = new Map();
    this.executionHistory = [];
  }

  // Define workflow
  defineWorkflow(workflowId, steps) {
    const workflow = {
      id: workflowId,
      steps: steps.map(s => new WorkflowStep(s)),
      status: WorkflowStatus.PENDING,
      createdAt: Date.now()
    };

    this.workflows.set(workflowId, workflow);
    console.log(`Workflow '${workflowId}' defined with ${steps.length} steps`);
    return workflow;
  }

  // Execute workflow
  async executeWorkflow(workflowId, initialContext = {}) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow '${workflowId}' not found`);
    }

    workflow.status = WorkflowStatus.RUNNING;
    const executionContext = { ...initialContext };
    const stepResults = new Map();

    try {
      for (const step of workflow.steps) {
        // Check dependencies
        const dependenciesMet = step.dependsOn.every(depId => {
          const depStep = workflow.steps.find(s => s.id === depId);
          return depStep && depStep.status === WorkflowStatus.COMPLETED;
        });

        if (!dependenciesMet) {
          throw new Error(`Dependencies not met for step '${step.id}'`);
        }

        // Execute step
        console.log(`\n[Workflow] Executing step: ${step.name}`);
        step.status = WorkflowStatus.RUNNING;
        step.startedAt = Date.now();

        // Inject dependency results into context
        step.dependsOn.forEach(depId => {
          const depStep = workflow.steps.find(s => s.id === depId);
          if (depStep && depStep.result) {
            executionContext[`${depId}_result`] = depStep.result;
          }
        });

        step.result = await this.executeStep(step, executionContext);
        step.status = WorkflowStatus.COMPLETED;
        step.completedAt = Date.now();

        stepResults.set(step.id, step.result);
        console.log(`[Workflow] Step '${step.name}' completed`);
      }

      workflow.status = WorkflowStatus.COMPLETED;
      console.log(`\n[Workflow] Workflow '${workflowId}' completed successfully`);

      return { status: 'success', results: Object.fromEntries(stepResults) };

    } catch (error) {
      workflow.status = WorkflowStatus.FAILED;
      console.error(`[Workflow] Workflow '${workflowId}' failed:`, error.message);

      return { status: 'failed', error: error.message };
    }
  }

  // Execute individual step
  async executeStep(step, context) {
    switch (step.type) {
      case 'task':
        return await this.executeTaskStep(step, context);

      case 'condition':
        return await this.executeConditionStep(step, context);

      case 'parallel':
        return await this.executeParallelStep(step, context);

      case 'loop':
        return await this.executeLoopStep(step, context);

      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  // Task step execution
  async executeTaskStep(step, context) {
    const { agent, task } = step.config;

    // Simulate task execution with LLM
    const prompt = ChatPromptTemplate.fromTemplate(
      `Execute this task: {task}

Context: {context}

Result:`
    );

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    return chain.invoke({
      task,
      context: JSON.stringify(context)
    });
  }

  // Condition step execution
  async executeConditionStep(step, context) {
    const { condition, ifTrue, ifFalse } = step.config;

    // Evaluate condition
    const prompt = ChatPromptTemplate.fromTemplate(
      `Evaluate this condition: {condition}

Context: {context}

Respond with 'true' or 'false':`
    );

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    const result = await chain.invoke({ condition, context: JSON.stringify(context) });

    const isTrue = result.toLowerCase().includes('true');

    // Execute appropriate branch
    if (isTrue && ifTrue) {
      return await this.executeTaskStep({ config: ifTrue }, context);
    } else if (!isTrue && ifFalse) {
      return await this.executeTaskStep({ config: ifFalse }, context);
    }

    return { evaluated: isTrue };
  }

  // Parallel step execution
  async executeParallelStep(step, context) {
    const { tasks } = step.config;

    const promises = tasks.map(task =>
      this.executeTaskStep({ config: task }, context)
    );

    return await Promise.all(promises);
  }

  // Loop step execution
  async executeLoopStep(step, context) {
    const { maxIterations, task } = step.config;
    const results = [];

    for (let i = 0; i < maxIterations; i++) {
      console.log(`[Workflow] Loop iteration ${i + 1}/${maxIterations}`);

      const result = await this.executeTaskStep({ config: task }, {
        ...context,
        iteration: i + 1
      });

      results.push(result);

      // Check for early termination
      if (result.terminate) {
        console.log(`[Workflow] Loop terminated early at iteration ${i + 1}`);
        break;
      }
    }

    return { iterations: results.length, results };
  }

  // Get workflow status
  getWorkflowStatus(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return null;

    return {
      id: workflow.id,
      status: workflow.status,
      steps: workflow.steps.map(s => ({
        id: s.id,
        name: s.name,
        status: s.status,
        duration: s.completedAt && s.startedAt ? s.completedAt - s.startedAt : null
      }))
    };
  }
}

// Usage
async function demoWorkflow() {
  const engine = new MCPWorkflowEngine();

  // Define a research and writing workflow
  const workflow = engine.defineWorkflow("research_writing", [
    {
      id: "step1",
      name: "Research Topic",
      type: "task",
      config: {
        agent: "researcher",
        task: "Research the latest developments in AI agents"
      }
    },
    {
      id: "step2",
      name: "Check Quality",
      type: "condition",
      config: {
        condition: "Is the research comprehensive enough?",
        ifTrue: { agent: "writer", task: "Write a detailed article" },
        ifFalse: { agent: "researcher", task: "Add more details to the research" }
      }
    },
    {
      id: "step3",
      name: "Parallel Tasks",
      type: "parallel",
      config: {
        tasks: [
          { agent: "editor", task: "Proofread the article" },
          { agent: "formatter", task: "Format for publication" }
        ]
      }
    },
    {
      id: "step4",
      name: "Review Loop",
      type: "loop",
      config: {
        maxIterations: 3,
        task: {
          agent: "reviewer",
          task: "Review and suggest improvements for iteration {iteration}"
        }
      }
    }
  ]);

  // Execute workflow
  console.log("\n--- Executing Workflow ---\n");
  const result = await engine.executeWorkflow("research_writing", {
    topic: "AI Agents",
    deadline: "2024-12-31"
  });

  console.log("\n--- Workflow Result ---");
  console.log(result);

  // Get status
  console.log("\n--- Workflow Status ---");
  console.log(engine.getWorkflowStatus("research_writing"));
}

demoWorkflow();
```

## Practical Applications & Use Cases

## 实际应用和用例

## 社区热议与实践分享

自2024年11月Anthropic发布MCP以来，该协议在AI开发者社区引发了广泛而深入的讨论。从Twitter/X上的热议到技术博客的深度分析，MCP已经从一个内部实验迅速演变为行业标准。以下是来自社区的关键洞察和实践分享。

### 行业领袖的声音

**Sam Altman (OpenAI CEO)** 在2025年3月26日发推宣布OpenAI全面支持MCP：

> "people love MCP and we are excited to add support across our products. available today in the agents SDK and support for chatgpt desktop app + responses api coming soon!"
> — [@sama](https://x.com/sama/status/1904957253456941061), 2025年3月26日

这条推文获得了约180万次浏览和1万次点赞，标志着MCP从Anthropic的单方协议正式成为跨厂商的行业标准。

**Mike Krieger (Anthropic 首席产品官)** 随即回应：

> "Excited to see the MCP love spread to OpenAI – welcome! MCP has gone from a glimmer in @jspahrsummers and @dsp_'s eyes last year to a thriving open standard with thousands of integrations and growing."
> — [@mikeyk](https://x.com/mikeyk/status/1904959317121597520), 2025年3月26日

**Alex Albert (Anthropic, Claude Relations 负责人)** 感叹MCP的飞速发展：

> "Great to see OpenAI adding support for MCP! It's amazing to think that in less than 4 months, MCP has gone from just an idea we had at Anthropic on how to make integrations easier for devs to the industry standard for all AI app integrations."
> — [@alexalbert__](https://x.com/alexalbert__/status/1904965223448006805), 2025年3月27日

**Andrej Karpathy (前Tesla AI负责人、OpenAI联合创始人)** 虽未直接评论MCP，但在2025年6月提出的"上下文工程"概念与MCP的核心理念高度一致：

> "+1 for 'context engineering' over 'prompt engineering'. ...in every industrial-strength LLM app, context engineering is the delicate art and science of filling the context window with just the right information for the next step."
> — [@karpathy](https://x.com/karpathy/status/1937902205765607626), 2025年6月

MCP正是实现"上下文工程"的关键基础设施——它标准化了LLM如何访问外部工具和数据，这正是Karpathy所说的"恰当地填充上下文窗口"的核心。

### MCP的诞生故事

MCP的诞生源于一个非常实际的痛点。联合创始人 **David Soria Parra** ([@dsp_](https://x.com/dsp_)) 在2024年4月加入Anthropic后，发现工程师们不断在Claude Desktop和IDE之间复制粘贴代码，AI系统就像"一个被放在罐子里的大脑，无法触及外部世界"。他无法为每个人构建特定的工作流，于是想到需要一个标准化协议让人们自助构建集成。他把这个想法带给了 **Justin Spahr-Summers** ([@jspahrsummers](https://x.com/jspahrsummers))，两人共同创建了MCP并在2024年11月公开发布。

### 社区关键议题

#### 1. 爆发式增长：从实验到标准

MCP的采纳速度在协议标准史上几乎前所未有：

- **2024年11月**：Anthropic发布MCP开放标准，提供Python和TypeScript SDK
- **2025年3月**：OpenAI全面采纳MCP
- **2025年4月**：Google DeepMind确认Gemini将支持MCP
- **2025年5月**：Microsoft在Build 2025上宣布Windows 11将拥抱MCP
- **2025年11月**：协议规范重大更新，新增异步操作、无状态支持和服务器注册表
- **2025年12月**：Anthropic将MCP捐赠给Linux基金会下的Agentic AI Foundation (AAIF)

截至发布一年后，MCP已实现 **9700万+** 月度SDK下载量，**10,000+** 活跃服务器，并获得Anthropic、OpenAI、Google和Microsoft的共同支持。

正如 [The New Stack](https://thenewstack.io/why-the-model-context-protocol-won/) 所评论的："很难想到其他技术和协议在如此短的时间内获得了如此多顶级科技巨头的一致支持。"

#### 2. MCP vs A2A：互补而非竞争

2025年4月，Google发布了 Agent-to-Agent (A2A) 协议，社区一度出现"协议战争"的担忧。但经过深入讨论，业界达成共识：

- **MCP** 解决的是智能体与工具之间的通信（纵向连接）
- **A2A** 解决的是智能体与智能体之间的通信（横向连接）

两者的关系就像USB接口和WiFi——一个连接设备与外设，一个连接设备与设备。2025年12月，MCP和A2A均被纳入Linux基金会的AAIF，由OpenAI、Anthropic、Google、Microsoft、AWS和Block六家联合治理，进一步确认了两者互补的定位。

#### 3. 安全问题：社区最大的担忧

安全研究者 **Simon Willison** 在2025年4月发表了引发广泛讨论的文章 [Model Context Protocol has prompt injection security problems](https://simonwillison.net/2025/Apr/9/mcp-prompt-injection/)，揭示了MCP面临的三大安全挑战：

- **提示注入(Prompt Injection)**：攻击者在内容中嵌入隐藏指令，AI无法区分合法命令和恶意指令。OWASP将其列为2025年LLM应用十大漏洞之首。
- **工具投毒(Tool Poisoning)**：恶意指令藏在工具描述的元数据中，对LLM可见但用户通常看不到。工具只需被投毒一次就能影响所有会话。
- **"地毯抽拉"攻击(Rug Pull)**：MCP工具可以在安装后悄悄修改自身定义——第一天你批准了一个安全的工具，第七天它可能已经将你的API密钥发送给攻击者。

Willison提出了"致命三要素(Lethal Trifecta)"的概念：当AI系统同时具备（1）访问私密数据、（2）暴露于不可信内容、（3）能够外部通信这三个条件时，数据泄露风险极高。他警告道：

> "I really want this stuff to work safely and securely, but the lack of progress over the past two and a half years doesn't fill me with confidence."

社区推荐的缓解策略包括：始终保持人工审批(human-in-the-loop)、严格的输入验证、上下文隔离、以及使用经验证的工具注册表。

#### 4. 开发者实践分享

**a16z (Andreessen Horowitz)** 的合伙人 Yoko Li 在2025年3月发表了[深度分析文章](https://a16z.com/a-deep-dive-into-mcp-and-the-future-of-ai-tooling/)，指出MCP的核心价值在于：

> "APIs were the internet's first great unifier—creating a shared language for software to communicate—but AI models lack an equivalent. MCP could do the same for AI agents by turning standalone tools into interoperable building blocks."

**LangChain CEO Harrison Chase** 在 [MCP: Flash in the Pan or Future Standard?](https://blog.langchain.com/mcp-fad-or-fixture/) 一文中分享了他从怀疑到认可的转变：

> MCP在你需要为一个你无法控制的智能体提供工具时最有价值。真正的价值将来自"长尾"连接——就像Zapier连接邮件、Google Sheets和Slack一样，用户可以用MCP创建自己的工作流。

实践者们也在积极分享他们的MCP工作流经验。一位开发者总结道：

> "The sweet spot I've found is being very intentional about requirements upfront, letting Claude handle implementation with good tooling, then being thorough about validation. I'm not trying to control every line of code — I'm designing a system where Claude can succeed. This is the new job of a developer."

#### 5. 治理与未来展望

2025年12月9日，Anthropic将MCP捐赠给新成立的 [Agentic AI Foundation (AAIF)](https://aaif.io/)，标志着MCP从厂商主导转向社区治理。AAIF由Linux基金会托管，白金会员包括Amazon、Anthropic、Block、Bloomberg、Cloudflare、Google、Microsoft和OpenAI。

2026年路线图包括：更好的流式支持、更丰富的资源类型、改进的采样能力（让MCP服务器自行触发模型调用以支持多智能体工作流）。Gartner预测，到2026年底，40%的企业应用将内置AI智能体（2025年这一比例不到5%）。

### 本章小结

本章我们深入探讨了模型上下文协议(MCP)的核心概念和实现方式。MCP作为智能体系统中的关键技术，为解决上下文管理、通信协调和状态维护等问题提供了标准化的解决方案。

### 关键要点回顾

**1. 上下文格式 (Context Format)**
- MCPContext类提供了标准化的上下文表示方法
- 支持对话历史、用户画像和相关数据的统一管理
- 序列化和反序列化功能便于上下文传输

**2. 通信协议 (Communication Protocol)**
- 四种消息类型：请求、响应、通知、错误
- 优先级机制支持任务调度
- 关联ID用于请求-响应配对

**3. 状态管理 (State Management)**
- 版本控制和变更历史追踪
- 分布式锁机制防止并发冲突
- 发布-订阅模式支持状态变化监听

**4. 多智能体协调 (Multi-Agent Coordination)**
- 基于能力的任务路由
- 支持并行和顺序任务执行
- 协调器模式实现智能体协作

**5. 复杂工作流管理 (Workflow Management)**
- 支持任务、条件、并行、循环等多种步骤类型
- 依赖管理确保执行顺序
- 状态追踪和错误处理

### MCP vs 传统方案对比

| 特性 | 传统方案 | MCP方案 |
|------|---------|---------|

| 上下文传递 | 每次请求携带完整历史 | 标准化上下文对象，按需序列化 |
| 状态同步 | 依赖外部存储 | 内置状态管理，支持版本控制和回滚 |
| 智能体通信 | 各自实现 | 统一协议，支持请求/响应模式 |
| 工作流管理 | 硬编码逻辑 | 声明式工作流定义，灵活可扩展 |

### 最佳实践建议

1. **合理设计上下文大小**：虽然MCP提供了高效的上下文管理，但仍需注意不要在上下文中包含过多无关信息，以免影响模型性能。

2. **使用锁机制保护关键状态**：在多智能体并发操作时，务必使用MCP提供的锁机制来保护共享状态。

3. **实现适当的错误处理**：MCP的错误消息机制可以帮助快速定位问题，建议建立完善的错误处理和重试策略。

4. **监控和日志记录**：利用MCP的状态变更历史和消息队列，进行系统监控和问题排查。

5. **渐进式采用**：如果现有系统不需要一次性完全迁移到MCP，可以从简单的上下文管理开始，逐步扩展到其他功能。

### 总结

模型上下文协议(MCP)为构建可靠、高效的智能体系统提供了坚实的技术基础。通过标准化的上下文格式、通信协议和状态管理机制，开发者可以更专注于业务逻辑的实现，而无需担心底层的协调问题。随着智能体技术的不断发展，MCP将继续在多智能体系统、企业集成和复杂工作流等领域发挥重要作用。

---

*本章代码示例均基于 LangChain JavaScript SDK 实现，可直接在实际项目中使用或根据具体需求进行修改。*

---

## 参考资源

### 官方文档与规范

- [Model Context Protocol 官方网站](https://modelcontextprotocol.io/) — MCP协议完整文档与规范
- [MCP 规范 2025-11-25 版本](https://modelcontextprotocol.io/specification/2025-11-25) — 最新协议规范
- [MCP 官方博客](http://blog.modelcontextprotocol.io/) — 协议更新与公告
- [Anthropic MCP 发布公告](https://www.anthropic.com/news/model-context-protocol) — 原始发布说明
- [Anthropic 将 MCP 捐赠给 AAIF 的公告](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)

### 基金会与治理

- [Agentic AI Foundation (AAIF)](https://aaif.io/) — MCP 现归属的 Linux 基金会项目
- [Linux 基金会 AAIF 成立公告](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) — AAIF 正式成立新闻稿
- [GitHub 博客：MCP 加入 Linux 基金会](https://github.blog/open-source/maintainers/mcp-joins-the-linux-foundation-what-this-means-for-developers-building-the-next-era-of-ai-tools-and-agents/)
- [OpenAI 联合创立 AAIF](https://openai.com/index/agentic-ai-foundation/)

### 行业深度分析

- [A Deep Dive Into MCP and the Future of AI Tooling — a16z](https://a16z.com/a-deep-dive-into-mcp-and-the-future-of-ai-tooling/) — Andreessen Horowitz 对 MCP 生态的全面分析
- [MCP: Flash in the Pan or Future Standard? — LangChain](https://blog.langchain.com/mcp-fad-or-fixture/) — Harrison Chase 与 Nuno Campos 的正反辩论
- [Why the Model Context Protocol Won — The New Stack](https://thenewstack.io/why-the-model-context-protocol-won/) — MCP 胜出的原因分析
- [A Year of MCP: From Internal Experiment to Industry Standard — Pento](https://www.pento.ai/blog/a-year-of-mcp-2025-review) — MCP 一周年回顾
- [One Year of MCP — DEV Community](https://dev.to/ajeetraina/one-year-of-model-context-protocol-from-experiment-to-industry-standard-5hj8)

### 安全研究

- [Model Context Protocol has prompt injection security problems — Simon Willison](https://simonwillison.net/2025/Apr/9/mcp-prompt-injection/) — MCP 安全问题深度分析
- [MCP Security: How to Stop Prompt Injection Attacks — DataDome](https://datadome.co/agent-trust-management/mcp-security-prompt-injection-prevention/)
- [MCP Security Vulnerabilities — Practical DevSecOps](https://www.practical-devsecops.com/mcp-security-vulnerabilities/)
- [Protecting against indirect prompt injection attacks in MCP — Microsoft](https://developer.microsoft.com/blog/protecting-against-indirect-injection-attacks-mcp)
- [Top 10 MCP Security Risks — Prompt Security](https://prompt.security/blog/top-10-mcp-security-risks)

### MCP vs A2A 协议对比

- [MCP vs A2A: The Complete Guide to AI Agent Protocols in 2026 — DEV Community](https://dev.to/pockit_tools/mcp-vs-a2a-the-complete-guide-to-ai-agent-protocols-in-2026-30li)
- [A2A and MCP: Start of the AI Agent Protocol Wars? — Koyeb](https://www.koyeb.com/blog/a2a-and-mcp-start-of-the-ai-agent-protocol-wars)
- [What Is Agent2Agent (A2A) Protocol? — IBM](https://www.ibm.com/think/topics/agent2agent-protocol)

### 创始人访谈与播客

- [MCP Co-Creator on the Next Wave of LLM Innovation — a16z](https://a16z.com/podcast/mcp-co-creator-on-the-next-wave-of-llm-innovation/) — David Soria Parra 访谈
- [The Creators of Model Context Protocol — Latent Space](https://podcasts.apple.com/ec/podcast/the-creators-of-model-context-protocol/id1674008350?i=1000702137438)
- [One Year of MCP — Latent Space](https://podcasts.apple.com/ke/podcast/one-year-of-mcp-with-david-soria-parra-and-aaif/id1674008350?i=1000742901858) — David Soria Parra 与 AAIF 领导者的周年回顾
- [Anthropic and the MCP — Software Engineering Daily](https://softwareengineeringdaily.com/2025/05/13/anthropic-and-the-model-context-protocol-with-david-soria-parra/)

### 社区 Twitter/X 关键推文

- [Sam Altman 宣布 OpenAI 支持 MCP](https://x.com/sama/status/1904957253456941061) — 2025年3月26日
- [Mike Krieger 欢迎 OpenAI 加入 MCP](https://x.com/mikeyk/status/1904959317121597520) — 2025年3月26日
- [Alex Albert 庆祝 MCP 成为行业标准](https://x.com/alexalbert__/status/1904965223448006805) — 2025年3月27日
- [Alex Albert 最初发布 MCP](https://x.com/alexalbert__/status/1861079762506252723) — 2024年11月
- [Andrej Karpathy 论上下文工程](https://x.com/karpathy/status/1937902205765607626) — 2025年6月
- [Simon Willison 论 GitHub MCP 攻击](https://x.com/simonw/status/1927158639325823372) — 2025年5月

### 开发者工具与生态

- [MCP Protocol: a new AI dev tools building block — The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/mcp)
- [awesome-mcp-servers — GitHub](https://github.com/punkpeye/awesome-mcp-servers) — 社区维护的 MCP 服务器合集
- [mcp-agent — LastMile AI](https://github.com/lastmile-ai/mcp-agent) — 基于 MCP 的智能体构建框架
- [Introduction to Model Context Protocol — Anthropic 课程](https://anthropic.skilljar.com/introduction-to-model-context-protocol)
- [Agentic AI & MCP for Platform Engineering Teams](https://ranthebuilder.cloud/blog/agentic-ai-mcp-for-platform-teams-strategy-and-real-world-patterns)

### 企业应用案例

- [MCP Enterprise Adoption Guide — Deepak Gupta](https://guptadeepak.com/the-complete-guide-to-model-context-protocol-mcp-enterprise-adoption-market-trends-and-implementation-strategies/)
- [Powering AI Agents with Real-Time Data Using MCP and Confluent](https://www.confluent.io/blog/ai-agents-using-anthropic-mcp/)
- [What is MCP? — IBM](https://www.ibm.com/think/topics/model-context-protocol)
- [Code Execution with MCP — Anthropic Engineering](https://www.anthropic.com/engineering/code-execution-with-mcp)