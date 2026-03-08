---
title: 'Chapter 17: Agentic Governance'
date: '2025-12-25'
excerpt: 'As agents become more autonomous, proper governance becomes essential to ensure responsible AI deployment.'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 17: Agentic Governance

# 第十七章：智能体治理

## Agentic Governance Pattern Overview

## 智能体治理模式概述

As agents become more autonomous, proper governance becomes essential to ensure responsible AI deployment.

随着智能体变得更加自主，适当的治理对于确保负责任的AI部署变得至关重要。

This pattern addresses frameworks for overseeing agent behavior, coordinating multiple agents, and scaling deployments responsibly.

此模式解决了监督智能体行为，协调多个智能体和负责任地扩展部署的框架。

### AI Governance Frameworks

### AI治理框架

**Policy Definition**: Establish clear policies governing agent behavior.

**政策定义**: 建立管理智能体行为的明确政策。

**Oversight Mechanisms**: Implement mechanisms for monitoring and controlling agents.

**监督机制**: 实施监控和控制智能体的机制。

**Accountability Structures**: Define who is responsible for agent actions.

**问责结构**: 定义谁对智能体的行为负责。

**Compliance Verification**: Regularly verify compliance with established policies.

**合规验证**: 定期验证是否符合既定政策。

### Agent Coordination

### 智能体协调

**Orchestration**: Coordinate multiple agents working on related tasks.

**编排**: 协调多个智能体处理相关任务。

**Conflict Resolution**: Handle conflicts between agents or with human operators.

**冲突解决**: 处理智能体之间或与人类操作员之间的冲突。

**Resource Allocation**: Manage computational and other resources across agents.

**资源分配**: 跨智能体管理计算和其他资源。

**Performance Monitoring**: Track and optimize agent performance.

**性能监控**: 跟踪和优化智能体性能。

### Scaling Considerations

### 规模化考量

**Horizontal Scaling**: Add more agent instances to handle increased load.

**水平扩展**: 添加更多智能体实例以处理增加的负载。

**Vertical Scaling**: Increase capabilities of individual agents.

**垂直扩展**: 增加单个智能体的能力。

**Distributed Agents**: Deploy agents across multiple locations or systems.

**分布式智能体**: 在多个位置或系统部署智能体。

**Load Balancing**: Distribute work evenly across agent instances.

**负载均衡**: 在智能体实例之间均匀分配工作。

---

## Practical Applications & Use Cases

## 实际应用和用例

### Enterprise AI Governance

### 企业AI治理

Organizations implement governance frameworks to ensure AI systems operate responsibly and comply with regulations.

组织实施治理框架以确保AI系统负责任地运营并符合法规。

### Multi-Agent Systems

### 多智能体系统

Coordinating multiple agents requires clear protocols and oversight mechanisms.

协调多个智能体需要明确的协议和监督机制。

### Regulatory Compliance

### 监管合规

Governance ensures agents adhere to industry-specific regulations and standards.

治理确保智能体遵守行业特定的法规和标准。

### Risk Management

### 风险管理

Governance frameworks include mechanisms for identifying and mitigating AI-related risks.

治理框架包含识别和降低AI相关风险的机制。

---

## Hands-On Code Examples

## 实践代码示例

The following code examples demonstrate how to implement governance patterns in JavaScript using LangChain:

以下代码示例展示如何使用 LangChain 在 JavaScript 中实现治理模式：

### 1. Policy Engine

### 1. 策略引擎

This example shows how to implement a policy engine for agent governance:

此示例展示如何实现智能体治理的策略引擎：

```javascript
// --- Policy Types ---
const PolicyType = {
  PERMISSION: 'permission',
  BEHAVIOR: 'behavior',
  DATA_ACCESS: 'data_access',
  RATE_LIMIT: 'rate_limit',
};

const PolicyEffect = {
  ALLOW: 'allow',
  DENY: 'deny',
  AUDIT: 'audit',
};

// --- Policy Rule ---
class PolicyRule {
  constructor(config) {
    this.id = `policy_${Date.now()}`;
    this.name = config.name;
    this.type = config.type;
    this.effect = config.effect;
    this.conditions = config.conditions || [];
    this.priority = config.priority || 0;
    this.enabled = config.enabled !== false;
  }

  // Evaluate if policy applies
  evaluate(context) {
    if (!this.enabled) return false;

    for (const condition of this.conditions) {
      if (!this.evaluateCondition(condition, context)) {
        return false;
      }
    }
    return true;
  }

  evaluateCondition(condition, context) {
    const { field, operator, value } = condition;
    const fieldValue = this.getFieldValue(field, context);

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'notEquals':
        return fieldValue !== value;
      case 'contains':
        return fieldValue.includes(value);
      case 'greaterThan':
        return fieldValue > value;
      case 'lessThan':
        return fieldValue < value;
      case 'in':
        return value.includes(fieldValue);
      default:
        return false;
    }
  }

  getFieldValue(field, context) {
    const fields = field.split('.');
    let value = context;
    for (const f of fields) {
      value = value[f];
      if (value === undefined) return undefined;
    }
    return value;
  }
}

// --- Policy Engine ---
class PolicyEngine {
  constructor() {
    this.policies = [];
  }

  // Add policy
  addPolicy(policy) {
    this.policies.push(policy);
    // Sort by priority (higher first)
    this.policies.sort((a, b) => b.priority - a.priority);
    console.log(`[PolicyEngine] Added policy: ${policy.name}`);
  }

  // Evaluate policies
  evaluate(context) {
    const results = {
      allowed: true,
      applicablePolicies: [],
      effects: [],
    };

    for (const policy of this.policies) {
      if (policy.evaluate(context)) {
        results.applicablePolicies.push(policy);

        if (policy.effect === PolicyEffect.DENY) {
          results.allowed = false;
          results.effects.push({
            policy: policy.name,
            effect: 'deny',
            reason: policy.name,
          });
          break;
        } else if (policy.effect === PolicyEffect.AUDIT) {
          results.effects.push({
            policy: policy.name,
            effect: 'audit',
          });
        }
      }
    }

    return results;
  }

  // Check if action is allowed
  isAllowed(action, context) {
    const result = this.evaluate({ ...context, action });
    return result.allowed;
  }
}

// --- Example Usage ---
function runPolicyEngine() {
  const engine = new PolicyEngine();

  console.log('=== Policy Engine Demo ===\n');

  // Add policies
  engine.addPolicy(new PolicyRule({
    name: 'Deny High Risk Trades',
    type: PolicyType.PERMISSION,
    effect: PolicyEffect.DENY,
    priority: 100,
    conditions: [
      { field: 'action', operator: 'equals', value: 'trade' },
      { field: 'riskLevel', operator: 'equals', value: 'high' },
    ],
  }));

  engine.addPolicy(new PolicyRule({
    name: 'Audit All Trades',
    type: PolicyType.AUDIT,
    effect: PolicyEffect.AUDIT,
    priority: 50,
    conditions: [
      { field: 'action', operator: 'equals', value: 'trade' },
    ],
  }));

  engine.addPolicy(new PolicyRule({
    name: 'Allow Read Operations',
    type: PolicyType.PERMISSION,
    effect: PolicyEffect.ALLOW,
    priority: 10,
    conditions: [
      { field: 'action', operator: 'in', value: ['read', 'view', 'search'] },
    ],
  }));

  // Test evaluations
  const testCases = [
    { action: 'trade', riskLevel: 'high', user: 'user1' },
    { action: 'trade', riskLevel: 'low', user: 'user2' },
    { action: 'read', user: 'user3' },
  ];

  for (const context of testCases) {
    console.log(`Context: ${JSON.stringify(context)}`);
    const result = engine.evaluate(context);
    console.log(`Allowed: ${result.allowed}`);
    console.log(`Effects: ${JSON.stringify(result.effects)}\n`);
  }
}

runPolicyEngine();
```

### 2. Agent Oversight System

### 2. 智能体监督系统

This example demonstrates implementing oversight mechanisms:

此示例展示如何实现监督机制：

```javascript
// --- Agent Status ---
const AgentStatus = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  ERROR: 'error',
};

// --- Agent Metrics ---
class AgentMetrics {
  constructor() {
    this.requestsProcessed = 0;
    this.errors = 0;
    this.totalLatency = 0;
    this.startTime = Date.now();
  }

  recordRequest(latency) {
    this.requestsProcessed++;
    this.totalLatency += latency;
  }

  recordError() {
    this.errors++;
  }

  getAverageLatency() {
    if (this.requestsProcessed === 0) return 0;
    return this.totalLatency / this.requestsProcessed;
  }

  getErrorRate() {
    if (this.requestsProcessed === 0) return 0;
    return this.errors / this.requestsProcessed;
  }

  getUptime() {
    return Date.now() - this.startTime;
  }
}

// --- Oversight Agent ---
class OversightAgent {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.status = AgentStatus.IDLE;
    this.metrics = new AgentMetrics();
    this.rules = config.rules || [];
    this.alertCallbacks = [];
  }

  // Start agent
  start() {
    this.status = AgentStatus.RUNNING;
    console.log(`[Oversight] Agent ${this.name} started`);
  }

  // Stop agent
  stop() {
    this.status = AgentStatus.STOPPED;
    console.log(`[Oversight] Agent ${this.name} stopped`);
  }

  // Pause agent
  pause() {
    this.status = AgentStatus.PAUSED;
    console.log(`[Oversight] Agent ${this.name} paused`);
  }

  // Process request with oversight
  async processRequest(request) {
    if (this.status !== AgentStatus.RUNNING) {
      throw new Error(`Agent ${this.name} is not running`);
    }

    const startTime = Date.now();

    try {
      // Pre-execution checks
      await this.preExecutionCheck(request);

      // Process request (simulated)
      const response = await this.executeRequest(request);

      // Record success
      const latency = Date.now() - startTime;
      this.metrics.recordRequest(latency);

      return response;
    } catch (error) {
      // Record error
      this.metrics.recordError();
      await this.handleError(error, request);

      throw error;
    }
  }

  // Pre-execution checks
  async preExecutionCheck(request) {
    for (const rule of this.rules) {
      if (!rule.check(request)) {
        throw new Error(`Rule violation: ${rule.name}`);
      }
    }
  }

  // Execute request (simulated)
  async executeRequest(request) {
    return { result: 'success', data: request };
  }

  // Handle error
  async handleError(error, request) {
    console.error(`[Oversight] Error in ${this.name}:`, error.message);

    // Trigger alerts
    for (const callback of this.alertCallbacks) {
      await callback({
        agent: this.name,
        error: error.message,
        request,
      });
    }

    // Check if should pause
    if (this.metrics.getErrorRate() > 0.1) {
      console.log(`[Oversight] High error rate, pausing agent`);
      this.pause();
    }
  }

  // Register alert callback
  onAlert(callback) {
    this.alertCallbacks.push(callback);
  }

  // Get status report
  getStatus() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      metrics: {
        requestsProcessed: this.metrics.requestsProcessed,
        errorRate: this.metrics.getErrorRate().toFixed(3),
        averageLatency: `${this.metrics.getAverageLatency().toFixed(0)}ms`,
        uptime: `${(this.metrics.getUptime() / 1000).toFixed(0)}s`,
      },
    };
  }
}

// --- Example Usage ---
async function runOversight() {
  const agent = new OversightAgent({
    id: 'agent_1',
    name: 'Trading Agent',
    rules: [
      {
        name: 'Max trade size',
        check: (req) => req.amount <= 100000,
      },
    ],
  });

  // Register alert callback
  agent.onAlert(async (alert) => {
    console.log('[ALERT]', alert);
  });

  console.log('=== Agent Oversight Demo ===\n');

  // Start agent
  agent.start();

  // Process requests
  try {
    await agent.processRequest({ action: 'trade', amount: 50000 });
    await agent.processRequest({ action: 'trade', amount: 75000 });
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Get status
  console.log('\n--- Agent Status ---');
  console.log(agent.getStatus());

  // Stop agent
  agent.stop();
}

runOversight();
```

### 3. Multi-Agent Coordination

### 3. 多智能体协调

This example shows how to coordinate multiple agents:

此示例展示如何协调多个智能体：

```javascript
// --- Message Types ---
const MessageType = {
  TASK: 'task',
  RESULT: 'result',
  ERROR: 'error',
  COORDINATION: 'coordination',
};

// --- Agent Message ---
class AgentMessage {
  constructor(from, to, type, payload) {
    this.id = `msg_${Date.now()}`;
    this.from = from;
    this.to = to;
    this.type = type;
    this.payload = payload;
    this.timestamp = Date.now();
  }
}

// --- Base Agent ---
class BaseAgent {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.capabilities = config.capabilities || [];
    this.messageQueue = [];
  }

  // Send message to another agent
  send(to, type, payload) {
    const message = new AgentMessage(this.id, to, type, payload);
    console.log(`[${this.name}] Sent ${type} to ${to}`);
    return message;
  }

  // Receive message
  receive(message) {
    this.messageQueue.push(message);
    console.log(`[${this.name}] Received ${message.type} from ${message.from}`);
  }

  // Process message
  async processMessage(message) {
    throw new Error('processMessage not implemented');
  }
}

// --- Coordinator Agent ---
class CoordinatorAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.agents = new Map();
    this.taskQueue = [];
  }

  // Register agent
  registerAgent(agent) {
    this.agents.set(agent.id, agent);
    console.log(`[Coordinator] Registered: ${agent.name}`);
  }

  // Assign task to agent
  assignTask(task, agentId) {
    const agent = this.agents.get(agentId);

    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    console.log(`[Coordinator] Assigning task to ${agent.name}`);

    // Send task message
    const message = this.send(agentId, MessageType.TASK, task);
    agent.receive(message);

    return message;
  }

  // Broadcast task to multiple agents
  broadcastTask(task, agentIds) {
    const messages = [];

    for (const agentId of agentIds) {
      const msg = this.assignTask(task, agentId);
      messages.push(msg);
    }

    return messages;
  }

  // Find best agent for task
  findBestAgent(taskRequirements) {
    let bestAgent = null;
    let bestScore = 0;

    for (const agent of this.agents.values()) {
      const matchCount = taskRequirements.filter((req) =>
        agent.capabilities.includes(req)
      ).length;

      if (matchCount > bestScore) {
        bestScore = matchCount;
        bestAgent = agent;
      }
    }

    return bestAgent;
  }

  // Coordinate complex task
  async coordinateTask(task) {
    const subTasks = this.decomposeTask(task);
    const results = [];

    for (const subTask of subTasks) {
      const bestAgent = this.findBestAgent(subTask.requirements);

      if (bestAgent) {
        this.assignTask(subTask, bestAgent.id);
        results.push({ task: subTask, agent: bestAgent.name, status: 'assigned' });
      } else {
        results.push({ task: subTask, agent: null, status: 'no_agent' });
      }
    }

    return results;
  }

  // Decompose complex task
  decomposeTask(task) {
    // Simplified task decomposition
    return [
      { id: 1, requirements: ['analysis'], data: task.data },
      { id: 2, requirements: ['execution'], data: task.data },
      { id: 3, requirements: ['reporting'], data: task.data },
    ];
  }
}

// --- Example Usage ---
function runCoordination() {
  const coordinator = new CoordinatorAgent({
    id: 'coordinator',
    name: 'Main Coordinator',
  });

  console.log('=== Multi-Agent Coordination Demo ===\n');

  // Create agents
  const analysisAgent = new BaseAgent({
    id: 'analysis_agent',
    name: 'Analysis Agent',
    capabilities: ['analysis', 'data_processing'],
  });

  const tradingAgent = new BaseAgent({
    id: 'trading_agent',
    name: 'Trading Agent',
    capabilities: ['execution', 'order_management'],
  });

  const reportingAgent = new BaseAgent({
    id: 'reporting_agent',
    name: 'Reporting Agent',
    capabilities: ['reporting', 'visualization'],
  });

  // Register agents
  coordinator.registerAgent(analysisAgent);
  coordinator.registerAgent(tradingAgent);
  coordinator.registerAgent(reportingAgent);

  // Find best agent
  console.log('\n--- Finding Best Agent ---');
  const best = coordinator.findBestAgent(['execution', 'order_management']);
  console.log(`Best agent: ${best?.name}`);

  // Coordinate task
  console.log('\n--- Coordinating Task ---');
  const results = coordinator.coordinateTask({
    id: 'portfolio_task',
    data: { portfolio: 'main' },
  });
  console.log('Results:', results);
}

runCoordination();
```

### 4. Compliance Checker

### 4. 合规检查器

This example demonstrates compliance verification:

此示例展示合规验证：

```javascript
// --- Compliance Standards ---
const ComplianceStandard = {
  GDPR: 'gdpr',
  SOC2: 'soc2',
  HIPAA: 'hipaa',
  FINRA: 'finra',
};

// --- Compliance Rule ---
class ComplianceRule {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.standard = config.standard;
    this.description = config.description;
    this.check = config.check;
    this.severity = config.severity || 'high';
  }
}

// --- Compliance Violation ---
class ComplianceViolation {
  constructor(rule, details) {
    this.ruleId = rule.id;
    this.ruleName = rule.name;
    this.standard = rule.standard;
    this.severity = rule.severity;
    this.details = details;
    this.timestamp = Date.now();
  }
}

// --- Compliance Checker ---
class ComplianceChecker {
  constructor() {
    this.rules = new Map();
    this.violations = [];
  }

  // Add compliance rule
  addRule(rule) {
    if (!this.rules.has(rule.standard)) {
      this.rules.set(rule.standard, []);
    }
    this.rules.get(rule.standard).push(rule);
    console.log(`[Compliance] Added rule: ${rule.name} (${rule.standard})`);
  }

  // Check compliance
  check(context) {
    const results = {
      passed: true,
      violations: [],
      checkedRules: 0,
    };

    for (const [standard, rules] of this.rules.entries()) {
      for (const rule of rules) {
        results.checkedRules++;

        try {
          const passed = rule.check(context);

          if (!passed) {
            const violation = new ComplianceViolation(rule, context);
            results.violations.push(violation);
            results.passed = false;
          }
        } catch (error) {
          console.error(`[Compliance] Error checking rule ${rule.name}:`, error);
        }
      }
    }

    // Store violations
    this.violations.push(...results.violations);

    return results;
  }

  // Check specific standard
  checkStandard(standard, context) {
    const rules = this.rules.get(standard) || [];
    const results = {
      passed: true,
      violations: [],
    };

    for (const rule of rules) {
      const passed = rule.check(context);
      if (!passed) {
        results.violations.push(new ComplianceViolation(rule, context));
        results.passed = false;
      }
    }

    return results;
  }

  // Get violation report
  getReport(standard = null) {
    let violations = this.violations;

    if (standard) {
      violations = violations.filter((v) => v.standard === standard);
    }

    const bySeverity = { critical: 0, high: 0, medium: 0, low: 0 };
    const byStandard = {};

    for (const v of violations) {
      bySeverity[v.severity] = (bySeverity[v.severity] || 0) + 1;
      byStandard[v.standard] = (byStandard[v.standard] || 0) + 1;
    }

    return {
      totalViolations: violations.length,
      bySeverity,
      byStandard,
      violations: violations.slice(-10), // Last 10
    };
  }
}

// --- Example Usage ---
function runCompliance() {
  const checker = new ComplianceChecker();

  console.log('=== Compliance Checker Demo ===\n');

  // Add GDPR rules
  checker.addRule(new ComplianceRule({
    id: 'gdpr_1',
    name: 'Data Retention Limit',
    standard: ComplianceStandard.GDPR,
    description: 'Personal data must not be retained beyond necessary period',
    severity: 'high',
    check: (ctx) => ctx.dataRetentionDays <= 365,
  }));

  checker.addRule(new ComplianceRule({
    id: 'gdpr_2',
    name: 'Consent Required',
    standard: ComplianceStandard.GDPR,
    description: 'Processing requires user consent',
    severity: 'critical',
    check: (ctx) => ctx.hasConsent === true,
  }));

  // Add FINRA rules
  checker.addRule(new ComplianceRule({
    id: 'finra_1',
    name: 'Trade Audit Trail',
    standard: ComplianceStandard.FINRA,
    description: 'All trades must be logged',
    severity: 'critical',
    check: (ctx) => ctx.action === 'trade' ? ctx.auditLogged === true : true,
  }));

  // Check compliance
  console.log('\n--- Compliance Check 1 ---');
  const result1 = checker.check({
    dataRetentionDays: 180,
    hasConsent: true,
    auditLogged: true,
  });
  console.log(`Passed: ${result1.passed}`);
  console.log(`Violations: ${result1.violations.length}`);

  console.log('\n--- Compliance Check 2 ---');
  const result2 = checker.check({
    dataRetentionDays: 400,
    hasConsent: false,
    auditLogged: true,
    action: 'trade',
  });
  console.log(`Passed: ${result2.passed}`);
  console.log(`Violations: ${result2.violations.length}`);
  result2.violations.forEach(v => console.log(`  - ${v.ruleName}`));

  // Get report
  console.log('\n--- Violation Report ---');
  const report = checker.getReport();
  console.log('Total:', report.totalViolations);
  console.log('By Severity:', report.bySeverity);
}

runCompliance();
```

### 5. Resource Management

### 5. 资源管理

This example shows resource allocation and load balancing:

此示例展示资源分配和负载均衡：

```javascript
// --- Resource Types ---
const ResourceType = {
  COMPUTE: 'compute',
  MEMORY: 'memory',
  API_CALLS: 'api_calls',
  STORAGE: 'storage',
};

// --- Resource Allocation ---
class ResourceAllocation {
  constructor(config) {
    this.agentId = config.agentId;
    this.limits = config.limits || {};
    this.usage = {};
  }

  // Allocate resource
  allocate(resourceType, amount) {
    const limit = this.limits[resourceType];

    if (limit) {
      const current = this.usage[resourceType] || 0;
      if (current + amount > limit) {
        return { success: false, reason: 'Limit exceeded' };
      }
    }

    this.usage[resourceType] = (this.usage[resourceType] || 0) + amount;
    return { success: true };
  }

  // Release resource
  release(resourceType, amount) {
    const current = this.usage[resourceType] || 0;
    this.usage[resourceType] = Math.max(0, current - amount);
  }

  // Get usage
  getUsage(resourceType) {
    return this.usage[resourceType] || 0;
  }

  // Get utilization percentage
  getUtilization(resourceType) {
    const limit = this.limits[resourceType];
    const usage = this.usage[resourceType] || 0;

    if (!limit) return 0;
    return (usage / limit) * 100;
  }
}

// --- Resource Manager ---
class ResourceManager {
  constructor(config) {
    this.allocations = new Map();
    this.defaultLimits = config.defaultLimits || {};
  }

  // Register agent with resource limits
  registerAgent(agentId, limits = {}) {
    const finalLimits = { ...this.defaultLimits, ...limits };
    this.allocations.set(agentId, new ResourceAllocation({
      agentId,
      limits: finalLimits,
    }));
    console.log(`[Resources] Registered agent ${agentId}`);
  }

  // Request resource allocation
  request(agentId, resourceType, amount) {
    const allocation = this.allocations.get(agentId);

    if (!allocation) {
      return { success: false, reason: 'Agent not registered' };
    }

    return allocation.allocate(resourceType, amount);
  }

  // Release resource
  release(agentId, resourceType, amount) {
    const allocation = this.allocations.get(agentId);
    if (allocation) {
      allocation.release(resourceType, amount);
    }
  }

  // Get agent resource status
  getAgentStatus(agentId) {
    const allocation = this.allocations.get(agentId);

    if (!allocation) {
      return null;
    }

    const status = {
      agentId,
      resources: {},
    };

    for (const [type, limit] of Object.entries(allocation.limits)) {
      status.resources[type] = {
        limit,
        usage: allocation.getUsage(type),
        utilization: `${allocation.getUtilization(type).toFixed(1)}%`,
      };
    }

    return status;
  }

  // Find overloaded agents
  getOverloadedAgents(threshold = 80) {
    const overloaded = [];

    for (const [agentId, allocation] of this.allocations.entries()) {
      for (const [type, limit] of Object.entries(allocation.limits)) {
        if (allocation.getUtilization(type) >= threshold) {
          overloaded.push({
            agentId,
            resourceType: type,
            utilization: allocation.getUtilization(type),
          });
        }
      }
    }

    return overloaded;
  }

  // Rebalance resources
  rebalance() {
    console.log('[Resources] Rebalancing resources...');

    const overloaded = this.getOverloadedAgents();

    for (const overload of overloaded) {
      console.log(`  Agent ${overload.agentId}: ${overload.resourceType} at ${overload.utilization.toFixed(1)}%`);
    }

    return overloaded;
  }
}

// --- Load Balancer ---
class LoadBalancer {
  constructor(resourceManager) {
    this.resourceManager = resourceManager;
    this.agentMetrics = new Map();
  }

  // Select best agent for task
  selectAgent(agentIds, requirements) {
    let bestAgent = null;
    let bestScore = Infinity;

    for (const agentId of agentIds) {
      const status = this.resourceManager.getAgentStatus(agentId);

      if (!status) continue;

      // Calculate score based on resource utilization
      let score = 0;

      for (const [type, req] of Object.entries(requirements)) {
        const utilization = parseFloat(status.resources[type]?.utilization || '0');
        score += utilization;
      }

      if (score < bestScore) {
        bestScore = score;
        bestAgent = agentId;
      }
    }

    return bestAgent;
  }

  // Distribute task
  distribute(task, agentIds, requirements) {
    const agent = this.selectAgent(agentIds, requirements);

    if (!agent) {
      return { success: false, reason: 'No suitable agent found' };
    }

    return { success: true, agentId: agent };
  }
}

// --- Example Usage ---
function runResourceManagement() {
  const manager = new ResourceManager({
    defaultLimits: {
      compute: 1000,
      api_calls: 500,
    },
  });

  console.log('=== Resource Management Demo ===\n');

  // Register agents
  manager.registerAgent('agent_1', { compute: 800, api_calls: 400 });
  manager.registerAgent('agent_2', { compute: 600, api_calls: 300 });
  manager.registerAgent('agent_3', { compute: 1000, api_calls: 600 });

  // Allocate resources
  console.log('\n--- Resource Allocation ---');
  console.log('Request 100 compute for agent_1:', manager.request('agent_1', 'compute', 100));
  console.log('Request 600 compute for agent_1:', manager.request('agent_1', 'compute', 600));

  // Get status
  console.log('\n--- Agent Status ---');
  console.log(manager.getAgentStatus('agent_1'));

  // Get overloaded
  console.log('\n--- Overloaded Agents ---');
  console.log(manager.getOverloadedAgents());

  // Load balancer
  const balancer = new LoadBalancer(manager);
  const result = balancer.distribute(
    { type: 'analysis' },
    ['agent_1', 'agent_2', 'agent_3'],
    { compute: 100 }
  );
  console.log('\n--- Load Balancing ---');
  console.log('Selected agent:', result);
}

runResourceManagement();
```

---

## 投资智能体

将治理模式接入投资智能体，意味着要构建一个能够**合规运营、多智能体协调、风险可控**的管理系统。投资领域监管严格，需要完善的治理框架来确保智能体的行为符合法规要求。

### 投资智能体

根据文档中关于智能体治理的最佳实践，接入该模式需要遵循以下核心设计：

#### 1. 投资策略合规检查 (Strategy Compliance)

投资智能体需要确保所有交易策略符合监管要求：

- **策略审批**：新策略上线前需要经过合规审批流程
- **交易限制**：遵守持仓限制、交易限额等监管要求
- **信息披露**：确保所有投资建议包含必要的风险披露
- **记录保留**：保留完整的交易记录以备审计

#### 2. 多智能体交易协调 (Multi-Agent Trading Coordination)

大型投资系统通常由多个专业智能体组成：

- **分析智能体**：负责市场分析和选股
- **交易智能体**：负责执行交易指令
- **风控智能体**：负责风险监控和止损
- **报告智能体**：负责生成投资报告

各智能体需要协调工作，确保信息流畅和决策一致。

#### 3. 投资决策审计追溯 (Decision Audit Trail)

每笔投资决策都需要完整的审计记录：

- **决策日志**：记录决策时间、依据、参与者
- **变更追踪**：记录策略参数的所有修改
- **异常记录**：记录所有被拒绝的交易和原因
- **合规报告**：定期生成合规报告供审计

#### 4. 资源配置与限流 (Resource Management)

投资系统需要合理分配计算资源和API调用配额：

- **计算配额**：为不同智能体分配合适的计算资源
- **API限流**：控制对外部API的调用频率
- **负载均衡**：在多个智能体实例间分配工作负载
- **容量规划**：根据交易量预测资源需求

### 投资智能体代码示例

以下代码示例展示投资智能体的治理系统实现：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.3 });

// ============================================
// 1. 投资合规策略引擎 (Investment Compliance Policy)
// ============================================

// 投资合规规则
class InvestmentComplianceRule {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.category = config.category; // trading, risk, disclosure
    this.severity = config.severity || 'high';
    this.check = config.check;
  }

  evaluate(context) {
    try {
      return this.check(context);
    } catch (error) {
      return false;
    }
  }
}

// 投资合规引擎
class InvestmentComplianceEngine {
  constructor() {
    this.rules = [];
    this.initializeDefaultRules();
  }

  // 初始化默认规则
  initializeDefaultRules() {
    // 交易限制规则
    this.addRule(new InvestmentComplianceRule({
      id: 'rule_1',
      name: '单只股票持仓上限',
      category: 'trading',
      severity: 'critical',
      check: (ctx) => {
        const concentration = ctx.positionValue / ctx.portfolioValue;
        return concentration <= 0.20; // 不超过20%
      },
    }));

    this.addRule(new InvestmentComplianceRule({
      id: 'rule_2',
      name: '每日交易次数限制',
      category: 'trading',
      severity: 'high',
      check: (ctx) => ctx.dailyTradeCount <= 50,
    }));

    // 风险控制规则
    this.addRule(new InvestmentComplianceRule({
      id: 'rule_3',
      name: '最大回撤限制',
      category: 'risk',
      severity: 'critical',
      check: (ctx) => ctx.currentDrawdown <= 0.10, // 不超过10%
    }));

    // 信息披露规则
    this.addRule(new InvestmentComplianceRule({
      id: 'rule_4',
      name: '风险披露要求',
      category: 'disclosure',
      severity: 'medium',
      check: (ctx) => ctx.includeRiskDisclosure === true,
    }));
  }

  // 添加规则
  addRule(rule) {
    this.rules.push(rule);
    console.log(`[Compliance] 添加规则: ${rule.name}`);
  }

  // 检查合规性
  checkCompliance(context) {
    const results = {
      compliant: true,
      violations: [],
      warnings: [],
    };

    for (const rule of this.rules) {
      const passed = rule.evaluate(context);

      if (!passed) {
        const violation = {
          ruleId: rule.id,
          ruleName: rule.name,
          category: rule.category,
          severity: rule.severity,
        };

        if (rule.severity === 'critical') {
          results.compliant = false;
          results.violations.push(violation);
        } else {
          results.warnings.push(violation);
        }
      }
    }

    return results;
  }

  // 获取特定类别规则
  getRulesByCategory(category) {
    return this.rules.filter((r) => r.category === category);
  }
}

// ============================================
// 2. 投资智能体协调系统 (Investment Agent Coordination)
// ============================================

// 投资智能体类型
const InvestmentAgentType = {
  ANALYZER: 'analyzer',     // 分析智能体
  TRADER: 'trader',        // 交易智能体
  RISK_MANAGER: 'risk_manager', // 风控智能体
  REPORTER: 'reporter',    // 报告智能体
};

// 投资智能体
class InvestmentAgent {
  constructor(config) {
    this.id = config.id;
    this.type = config.type;
    this.name = config.name;
    this.status = 'idle';
    this.capabilities = config.capabilities || [];
  }

  async execute(task) {
    this.status = 'running';
    console.log(`[${this.name}] 执行任务: ${task.type}`);

    // 模拟执行
    await new Promise((resolve) => setTimeout(resolve, 100));

    this.status = 'idle';
    return { success: true, result: task };
  }

  getStatus() {
    return { id: this.id, type: this.type, name: this.name, status: this.status };
  }
}

// 投资协调器
class InvestmentCoordinator {
  constructor(complianceEngine) {
    this.complianceEngine = complianceEngine;
    this.agents = new Map();
    this.taskHistory = [];
  }

  // 注册智能体
  registerAgent(agent) {
    this.agents.set(agent.id, agent);
    console.log(`[Coordinator] 注册智能体: ${agent.name} (${agent.type})`);
  }

  // 协调投资任务
  async coordinateInvestmentTask(task) {
    console.log(`\n[Coordinator] 开始协调投资任务: ${task.id}`);

    const results = [];

    // 1. 分析阶段
    const analyzer = this.findAgent(InvestmentAgentType.ANALYZER);
    if (analyzer) {
      const analysisResult = await analyzer.execute({ type: 'analysis', ...task });
      results.push({ stage: 'analysis', result: analysisResult });
      console.log('[Coordinator] 分析完成');
    }

    // 2. 合规检查
    const complianceResult = this.complianceEngine.checkCompliance(task.context);

    if (!complianceResult.compliant) {
      console.log('[Coordinator] 合规检查未通过');
      return {
        success: false,
        reason: 'compliance_failed',
        violations: complianceResult.violations,
      };
    }

    console.log('[Coordinator] 合规检查通过');

    // 3. 交易执行
    const trader = this.findAgent(InvestmentAgentType.TRADER);
    if (trader && task.execute) {
      const tradeResult = await trader.execute(task);
      results.push({ stage: 'execution', result: tradeResult });
      console.log('[Coordinator] 交易执行完成');
    }

    // 4. 风控检查
    const riskManager = this.findAgent(InvestmentAgentType.RISK_MANAGER);
    if (riskManager) {
      const riskResult = await riskManager.execute({ type: 'risk_check', ...task });
      results.push({ stage: 'risk_check', result: riskResult });
    }

    // 5. 报告生成
    const reporter = this.findAgent(InvestmentAgentType.REPORTER);
    if (reporter) {
      const reportResult = await reporter.execute({ type: 'report', results });
      results.push({ stage: 'report', result: reportResult });
    }

    // 记录任务历史
    this.taskHistory.push({
      taskId: task.id,
      timestamp: Date.now(),
      results,
    });

    return { success: true, results };
  }

  // 查找特定类型智能体
  findAgent(type) {
    for (const agent of this.agents.values()) {
      if (agent.type === type) {
        return agent;
      }
    }
    return null;
  }

  // 获取任务历史
  getTaskHistory(limit = 10) {
    return this.taskHistory.slice(-limit);
  }
}

// ============================================
// 3. 投资决策审计系统 (Investment Decision Audit)
// ============================================

// 审计事件类型
const AuditEventType = {
  DECISION: 'decision',
  TRADE: 'trade',
  PARAMETER_CHANGE: 'parameter_change',
  COMPLIANCE_VIOLATION: 'compliance_violation',
  SYSTEM_ALERT: 'system_alert',
};

// 审计记录
class AuditRecord {
  constructor(type, details) {
    this.id = `audit_${Date.now()}`;
    this.type = type;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// 投资审计系统
class InvestmentAuditSystem {
  constructor() {
    this.records = [];
  }

  // 记录决策
  recordDecision(decision) {
    const record = new AuditRecord(AuditEventType.DECISION, {
      decisionId: decision.id,
      agent: decision.agent,
      context: decision.context,
      result: decision.result,
      reasoning: decision.reasoning,
    });
    this.records.push(record);
    console.log(`[Audit] 记录决策: ${decision.id}`);
  }

  // 记录交易
  recordTrade(trade) {
    const record = new AuditRecord(AuditEventType.TRADE, {
      tradeId: trade.id,
      symbol: trade.symbol,
      action: trade.action,
      quantity: trade.quantity,
      price: trade.price,
      timestamp: trade.timestamp,
    });
    this.records.push(record);
    console.log(`[Audit] 记录交易: ${trade.symbol} ${trade.action}`);
  }

  // 记录参数变更
  recordParameterChange(change) {
    const record = new AuditRecord(AuditEventType.PARAMETER_CHANGE, {
      parameter: change.parameter,
      oldValue: change.oldValue,
      newValue: change.newValue,
      changedBy: change.changedBy,
      reason: change.reason,
    });
    this.records.push(record);
  }

  // 记录合规违规
  recordViolation(violation) {
    const record = new AuditRecord(AuditEventType.COMPLIANCE_VIOLATION, {
      ruleId: violation.ruleId,
      ruleName: violation.ruleName,
      severity: violation.severity,
      context: violation.context,
    });
    this.records.push(record);
    console.log(`[Audit] 记录违规: ${violation.ruleName}`);
  }

  // 查询审计记录
  query(filters = {}) {
    let results = [...this.records];

    if (filters.type) {
      results = results.filter((r) => r.type === filters.type);
    }

    if (filters.startDate) {
      results = results.filter((r) => new Date(r.timestamp) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      results = results.filter((r) => new Date(r.timestamp) <= new Date(filters.endDate));
    }

    return results;
  }

  // 生成审计报告
  generateReport(startDate, endDate) {
    const records = this.query({ startDate, endDate });

    const summary = {
      totalRecords: records.length,
      byType: {},
      decisionCount: 0,
      tradeCount: 0,
      violationCount: 0,
    };

    for (const record of records) {
      summary.byType[record.type] = (summary.byType[record.type] || 0) + 1;

      if (record.type === AuditEventType.DECISION) summary.decisionCount++;
      if (record.type === AuditEventType.TRADE) summary.tradeCount++;
      if (record.type === AuditEventType.COMPLIANCE_VIOLATION) summary.violationCount++;
    }

    return { summary, records };
  }
}

// 使用示例
function demoInvestmentGovernance() {
  console.log('=== 投资智能体治理系统演示 ===\n');

  // 1. 合规引擎
  const complianceEngine = new InvestmentComplianceEngine();

  // 测试合规检查
  console.log('--- 合规检查测试 ---');
  const testContext = {
    positionValue: 15000,
    portfolioValue: 100000,
    dailyTradeCount: 30,
    currentDrawdown: 0.08,
    includeRiskDisclosure: true,
  };

  const result = complianceEngine.checkCompliance(testContext);
  console.log(`合规状态: ${result.compliant ? '通过' : '未通过'}`);
  if (result.violations.length > 0) {
    console.log('违规项:', result.violations);
  }

  // 2. 协调系统
  const coordinator = new InvestmentCoordinator(complianceEngine);

  // 注册智能体
  coordinator.registerAgent(new InvestmentAgent({
    id: 'analyzer_1',
    type: InvestmentAgentType.ANALYZER,
    name: '市场分析智能体',
    capabilities: ['technical_analysis', 'fundamental_analysis'],
  }));

  coordinator.registerAgent(new InvestmentAgent({
    id: 'trader_1',
    type: InvestmentAgentType.TRADER,
    name: '交易执行智能体',
    capabilities: ['order_execution', 'position_management'],
  }));

  coordinator.registerAgent(new InvestmentAgent({
    id: 'risk_1',
    type: InvestmentAgentType.RISK_MANAGER,
    name: '风险监控智能体',
    capabilities: ['risk_monitoring', 'stop_loss'],
  }));

  coordinator.registerAgent(new InvestmentAgent({
    id: 'reporter_1',
    type: InvestmentAgentType.REPORTER,
    name: '报告生成智能体',
    capabilities: ['report_generation', 'performance_analysis'],
  }));

  // 协调任务
  console.log('\n--- 协调投资任务 ---');
  coordinator.coordinateInvestmentTask({
    id: 'task_001',
    context: testContext,
    execute: true,
  });

  // 3. 审计系统
  const auditSystem = new InvestmentAuditSystem();

  // 记录审计事件
  auditSystem.recordDecision({
    id: 'decision_001',
    agent: 'analyzer_1',
    context: { symbol: 'AAPL' },
    result: 'buy',
    reasoning: '技术指标显示超卖',
  });

  auditSystem.recordTrade({
    id: 'trade_001',
    symbol: 'AAPL',
    action: 'buy',
    quantity: 100,
    price: 150,
    timestamp: Date.now(),
  });

  // 生成报告
  console.log('\n--- 审计报告 ---');
  const report = auditSystem.generateReport(
    new Date(Date.now() - 24 * 60 * 60 * 1000),
    new Date()
  );
  console.log('汇总:', JSON.stringify(report.summary, null, 2));
}

demoInvestmentGovernance();
```

### 本章小结

本章深入探讨了智能体治理模式的核心概念和实现方式。治理对于确保智能体系统负责任地运行至关重要。

### 关键要点回顾

**1. 策略引擎 (Policy Engine)**
- 定义和管理智能体行为策略
- 基于条件的策略评估
- 支持allow/deny/audit等多种效果

**2. 智能体监督 (Agent Oversight)**
- 实时监控智能体状态
- 错误处理和自动恢复
- 性能指标追踪

**3. 多智能体协调 (Multi-Agent Coordination)**
- 任务分配和协调
- 智能体发现和能力匹配
- 复杂任务分解

**4. 合规检查 (Compliance Checking)**
- 多标准合规验证
- 违规追踪和报告
- 自动化合规审计

**5. 资源管理 (Resource Management)**
- 资源分配和限制
- 负载均衡
- 容量规划和重平衡

**6. 投资智能体治理**
- 策略合规检查
- 多智能体协调
- 决策审计追溯
- 资源配置限流

### 治理最佳实践

1. **明确政策**：制定清晰的智能体行为政策
2. **分层监督**：实施多层监督机制
3. **自动化合规**：尽可能自动化合规检查
4. **完整审计**：记录所有关键操作
5. **持续监控**：实时监控智能体行为

### 治理应用场景

| 场景 | 治理措施 |
|------|----------|

| 金融交易 | 合规引擎、交易限额、审计追溯 |
| 医疗保健 | HIPAA合规、数据访问控制 |
| 企业运营 | 多智能体协调、资源分配 |
| 客户服务 | 策略引擎、投诉处理 |

### 总结

智能体治理是构建可信AI系统的基础。通过本章介绍的治理模式和技术，开发者可以构建能够负责任地运行、符合监管要求、具备完整审计能力的智能体系统。随着AI系统变得越来越自主，治理的重要性将持续增长。

---

_本章代码示例均基于 LangChain JavaScript SDK 实现，可直接在实际项目中使用或根据具体需求进行修改。_

