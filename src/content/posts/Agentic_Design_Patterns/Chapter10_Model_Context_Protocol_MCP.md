---
title: 'Chapter 10: Model Context Protocol (MCP)'
date: '2025-12-25'
excerpt: 'The Model Context Protocol (MCP) is a standardized framework for managing context and communication in agentic systems.'
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