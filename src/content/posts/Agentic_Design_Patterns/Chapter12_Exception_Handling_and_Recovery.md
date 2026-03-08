---
title: 'Chapter 12: Exception Handling and Recovery'
date: '2025-12-25'
excerpt: 'Robust agentic systems must be able to handle errors and unexpected situations gracefully.'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 12: Exception Handling and Recovery

# 第十二章：异常处理与恢复

## Exception Handling Pattern Overview

## 异常处理模式概述

Robust agentic systems must be able to handle errors and unexpected situations gracefully.

健壮的智能体系统必须能够优雅地处理错误和意外情况。

The exception handling pattern involves detecting errors, recovering from failures, and maintaining system stability.

异常处理模式涉及检测错误、从故障中恢复以及维护系统稳定性。

### Types of Exceptions

### 异常类型

**Tool Failures**: External tools or APIs may fail or return unexpected results.

**工具故障**: 外部工具或API可能失败或返回意外结果。

**LLM Errors**: The language model may produce invalid outputs or fail to generate responses.

**LLM错误**: 语言模型可能产生无效输出或无法生成响应。

**Input Validation**: User input may be invalid or unexpected.

**输入验证**: 用户输入可能无效或意外。

**Resource Limits**: The system may run out of memory, API quota, or other resources.

**资源限制**: 系统可能耗尽内存、API配额或其他资源。

### Recovery Strategies

### 恢复策略

**Retry**: Attempt the failed operation again, potentially with different parameters.

**重试**: 再次尝试失败的操作，可能使用不同的参数。

**Fallback**: Use an alternative approach when the primary method fails.

**回退**: 当主要方法失败时使用替代方法。

**Escalation**: Notify a human when the system cannot handle an error.

**升级**: 当系统无法处理错误时通知人工。

**Graceful Degradation**: Continue operating in a reduced capacity when full operation is not possible.

**优雅降级**: 当无法完全运行时以降低容量继续运行。

## Hands-On Code Examples

## 实践代码示例

### 1. Error Handling (错误处理)

以下代码实现了智能体系统中的错误处理机制：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Error Types
class AgentError extends Error {
  constructor(message, type, recoverable = false) {
    super(message);
    this.name = 'AgentError';
    this.type = type;
    this.recoverable = recoverable;
    this.timestamp = Date.now();
  }
}

class ToolError extends AgentError {
  constructor(message, toolName, originalError = null) {
    super(message, 'TOOL_ERROR', true);
    this.name = 'ToolError';
    this.toolName = toolName;
    this.originalError = originalError;
  }
}

class LLMError extends AgentError {
  constructor(message, model, originalError = null) {
    super(message, 'LLM_ERROR', true);
    this.name = 'LLMError';
    this.model = model;
    this.originalError = originalError;
  }
}

class ValidationError extends AgentError {
  constructor(message, field, value) {
    super(message, 'VALIDATION_ERROR', false);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

class ResourceLimitError extends AgentError {
  constructor(message, resourceType, limit) {
    super(message, 'RESOURCE_LIMIT', true);
    this.name = 'ResourceLimitError';
    this.resourceType = resourceType;
    this.limit = limit;
  }
}

// Error Handler
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.errorHandlers = new Map();
  }

  // Register error handler
  registerHandler(errorType, handler) {
    this.errorHandlers.set(errorType, handler);
  }

  // Handle error
  async handle(error) {
    console.error(`[Error] ${error.name}: ${error.message}`);

    // Log error
    this.errorLog.push({
      error: error.message,
      type: error.type,
      timestamp: error.timestamp,
      recoverable: error.recoverable,
    });

    // Find handler
    const handler = this.errorHandlers.get(error.type);

    if (handler) {
      try {
        return await handler(error);
      } catch (handlerError) {
        console.error(`[Error] Handler failed: ${handlerError.message}`);
      }
    }

    // Default handling
    if (error.recoverable) {
      return { action: 'retry', reason: 'recoverable error' };
    }

    return { action: 'escalate', reason: 'unrecoverable error' };
  }

  // Get error statistics
  getStats() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      recoverable: 0,
      unrecoverable: 0,
    };

    this.errorLog.forEach((e) => {
      stats.byType[e.type] = (stats.byType[e.type] || 0) + 1;
      if (e.recoverable) stats.recoverable++;
      else stats.unrecoverable++;
    });

    return stats;
  }
}

// Usage
const errorHandler = new ErrorHandler();

// Register custom handlers
errorHandler.registerHandler('TOOL_ERROR', async (error) => {
  console.log(`[Handler] Attempting to recover from tool error in ${error.toolName}`);
  return { action: 'fallback', tool: error.toolName };
});

errorHandler.registerHandler('VALIDATION_ERROR', async (error) => {
  console.log(`[Handler] Validation failed for field: ${error.field}`);
  return { action: 'reject', reason: 'invalid input' };
});

// Test error handling
async function demoErrors() {
  // Test tool error
  const toolError = new ToolError('API timeout', 'weather_api', new Error('ETIMEDOUT'));
  const result1 = await errorHandler.handle(toolError);
  console.log('Tool error result:', result1);

  // Test validation error
  const validationError = new ValidationError('Invalid email', 'email', 'not-an-email');
  const result2 = await errorHandler.handle(validationError);
  console.log('Validation error result:', result2);

  // Get stats
  console.log('\nError Statistics:');
  console.log(errorHandler.getStats());
}

demoErrors();
```

### 2. Retry Mechanism (重试机制)

以下代码实现了带指数退避的重试机制：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Retry Strategy
class RetryStrategy {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.initialDelay = options.initialDelay || 1000; // ms
    this.maxDelay = options.maxDelay || 30000; // ms
    this.backoffMultiplier = options.backoffMultiplier || 2;
    this.retryableErrors = options.retryableErrors || ['TOOL_ERROR', 'LLM_ERROR', 'NETWORK_ERROR'];
  }

  // Calculate delay with exponential backoff
  calculateDelay(attempt) {
    const delay = Math.min(
      this.initialDelay * Math.pow(this.backoffMultiplier, attempt),
      this.maxDelay,
    );
    // Add jitter
    return delay + Math.random() * 1000;
  }

  // Should retry
  shouldRetry(error, attempt) {
    if (attempt >= this.maxRetries) {
      return { shouldRetry: false, reason: 'max retries exceeded' };
    }

    if (!this.retryableErrors.includes(error.type)) {
      return { shouldRetry: false, reason: 'non-retryable error' };
    }

    return { shouldRetry: true, delay: this.calculateDelay(attempt) };
  }
}

// Retryable function wrapper
async function withRetry(fn, strategy = new RetryStrategy()) {
  let attempt = 0;
  let lastError;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const { shouldRetry, delay, reason } = strategy.shouldRetry(error, attempt);

      console.log(`Attempt ${attempt + 1} failed: ${error.message}`);
      console.log(`Should retry: ${shouldRetry}, Reason: ${reason}`);

      if (!shouldRetry) {
        throw error;
      }

      attempt++;
      console.log(`Waiting ${Math.round(delay)}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Retry Executor with Circuit Breaker
class RetryExecutor {
  constructor() {
    this.strategy = new RetryStrategy({ maxRetries: 3, initialDelay: 500 });
    this.circuitState = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.successCount = 0;
    this.circuitThreshold = 5;
    this.circuitTimeout = 30000;
  }

  async execute(operation, operationName = 'operation') {
    // Check circuit breaker
    if (this.circuitState === 'OPEN') {
      throw new Error(`Circuit breaker OPEN: ${operationName} temporarily unavailable`);
    }

    try {
      const result = await withRetry(operation, this.strategy);

      // Success - reset circuit
      this.successCount++;
      this.failureCount = 0;
      if (this.circuitState === 'HALF_OPEN') {
        this.circuitState = 'CLOSED';
        console.log('[Circuit Breaker] Closed after successful call');
      }

      return result;
    } catch (error) {
      this.failureCount++;
      console.log(`[Circuit Breaker] Failure count: ${this.failureCount}/${this.circuitThreshold}`);

      // Open circuit
      if (this.failureCount >= this.circuitThreshold) {
        this.circuitState = 'OPEN';
        console.log('[Circuit Breaker] Opened due to repeated failures');

        // Auto-reset after timeout
        setTimeout(() => {
          this.circuitState = 'HALF_OPEN';
          console.log('[Circuit Breaker] Half-open for testing');
        }, this.circuitTimeout);
      }

      throw error;
    }
  }

  getStatus() {
    return {
      circuitState: this.circuitState,
      failureCount: this.failureCount,
      successCount: this.successCount,
    };
  }
}

// Usage
async function demoRetry() {
  const executor = new RetryExecutor();

  // Simulate flaky operation
  let callCount = 0;
  const flakyOperation = async () => {
    callCount++;
    console.log(`\n--- Call attempt ${callCount} ---`);

    if (callCount < 3) {
      throw new ToolError('Service unavailable', 'test_service');
    }

    return 'Operation succeeded!';
  };

  // Execute with retry
  try {
    const result = await executor.execute(flakyOperation, 'test_operation');
    console.log('\nResult:', result);
  } catch (error) {
    console.log('\nFinal error:', error.message);
  }

  console.log('\nCircuit Breaker Status:');
  console.log(executor.getStatus());
}

demoRetry();
```

### 3. Fallback Strategy (回退策略)

以下代码实现了多级回退策略：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Different LLM instances for fallback
const primaryLLM = new ChatOpenAI({
  model: 'gpt-4',
  temperature: 0.7,
  maxRetries: 2,
});

const fallbackLLM1 = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxRetries: 2,
});

const fallbackLLM2 = new ChatOpenAI({
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxRetries: 2,
});

// Tool fallback
class ToolFallback {
  constructor() {
    this.primaryTools = new Map();
    this.fallbackTools = new Map();
  }

  register(toolName, primary, fallback) {
    this.primaryTools.set(toolName, primary);
    this.fallbackTools.set(toolName, fallback);
  }

  async execute(toolName, ...args) {
    const primary = this.primaryTools.get(toolName);
    const fallback = this.fallbackTools.get(toolName);

    if (!primary && !fallback) {
      throw new Error(`Tool '${toolName}' not registered`);
    }

    try {
      if (primary) {
        console.log(`[Fallback] Using primary tool: ${toolName}`);
        return await primary(...args);
      }
    } catch (error) {
      console.log(`[Fallback] Primary tool failed: ${error.message}`);

      if (fallback) {
        console.log(`[Fallback] Switching to fallback tool: ${toolName}`);
        return await fallback(...args);
      }

      throw error;
    }
  }
}

// LLM Fallback Chain
class LLMFallbackChain {
  constructor() {
    this.llms = [primaryLLM, fallbackLLM1, fallbackLLM2];
    this.currentIndex = 0;
  }

  async generate(prompt) {
    const errors = [];

    for (let i = this.currentIndex; i < this.llms.length; i++) {
      const llm = this.llms[i];
      console.log(`[Fallback] Trying LLM ${i + 1}: ${llm.modelName}`);

      try {
        const response = await llm.invoke(prompt);
        this.currentIndex = i; // Reset to successful LLM
        return response;
      } catch (error) {
        console.log(`[Fallback] LLM ${i + 1} failed: ${error.message}`);
        errors.push({ llm: llm.modelName, error: error.message });
      }
    }

    throw new Error('All LLM fallbacks failed');
  }

  reset() {
    this.currentIndex = 0;
  }
}

// Response Fallback
class ResponseFallback {
  constructor() {
    this.strategies = [];
  }

  addStrategy(priority, generator) {
    this.strategies.push({ priority, generator });
    this.strategies.sort((a, b) => b.priority - a.priority);
  }

  async generate(context) {
    for (const strategy of this.strategies) {
      try {
        console.log(`[Response Fallback] Trying strategy with priority ${strategy.priority}`);
        const result = await strategy.generator(context);

        if (result && result.trim().length > 0) {
          return result;
        }
      } catch (error) {
        console.log(`[Response Fallback] Strategy failed: ${error.message}`);
      }
    }

    return 'I apologize, but I am unable to process your request at this time.';
  }
}

// Complete Fallback System
class FallbackSystem {
  constructor() {
    this.toolFallback = new ToolFallback();
    this.llmChain = new LLMFallbackChain();
    this.responseFallback = new ResponseFallback();

    // Setup default response fallbacks
    this.responseFallback.addStrategy(10, async (ctx) => {
      // Try with full context
      const prompt = ChatPromptTemplate.fromTemplate(`Provide a detailed response to: {query}`);
      const chain = prompt.pipe(primaryLLM).pipe(new StringOutputParser());
      return chain.invoke({ query: ctx.query });
    });

    this.responseFallback.addStrategy(5, async (ctx) => {
      // Try with simplified prompt
      const prompt = ChatPromptTemplate.fromTemplate(`Briefly answer: {query}`);
      const chain = prompt.pipe(fallbackLLM1).pipe(new StringOutputParser());
      return chain.invoke({ query: ctx.query });
    });

    this.responseFallback.addStrategy(1, async (ctx) => {
      // Static fallback
      return `I understand you're asking about "${ctx.query}". Please try rephrasing your question.`;
    });
  }

  async executeWithFallback(query) {
    console.log(`\n[System] Processing query: ${query}`);

    try {
      // Try main pipeline
      const prompt = ChatPromptTemplate.fromTemplate(`Answer: {query}`);
      const chain = prompt.pipe(primaryLLM).pipe(new StringOutputParser());
      return await chain.invoke({ query });
    } catch (error) {
      console.log(`[System] Main pipeline failed: ${error.message}`);

      try {
        // Try LLM fallback
        return await this.llmChain.generate(query);
      } catch (error) {
        console.log(`[System] LLM chain failed: ${error.message}`);

        // Try response fallback
        return await this.responseFallback.generate({ query });
      }
    }
  }
}

// Usage
async function demoFallback() {
  const system = new FallbackSystem();

  // Register custom tool fallback
  system.toolFallback.register(
    'get_weather',
    async (city) => {
      // Primary - might fail
      throw new Error('Weather API unavailable');
    },
    async (city) => {
      // Fallback - return cached/static data
      return `Weather for ${city}: Sunny, 72°F (cached data)`;
    },
  );

  // Execute query
  const result = await system.executeWithFallback('What is the capital of France?');
  console.log('\nFinal Result:', result);

  // Test tool fallback
  console.log('\n--- Tool Fallback Test ---');
  const toolResult = await system.toolFallback.execute('get_weather', 'New York');
  console.log('Tool result:', toolResult);
}

demoFallback();
```

### 4. Graceful Degradation (优雅降级)

以下代码实现了优雅降级机制：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Service Health Status
const HealthStatus = {
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  UNHEALTHY: 'unhealthy',
};

// Service with Health Check
class Service {
  constructor(name, healthCheckFn, operationFn) {
    this.name = name;
    this.healthCheckFn = healthCheckFn;
    this.operationFn = operationFn;
    this.status = HealthStatus.HEALTHY;
    this.lastCheck = null;
    this.errorCount = 0;
  }

  async checkHealth() {
    try {
      await this.healthCheckFn();
      this.status = HealthStatus.HEALTHY;
      this.errorCount = 0;
    } catch (error) {
      this.errorCount++;
      this.status = this.errorCount > 5 ? HealthStatus.UNHEALTHY : HealthStatus.DEGRADED;
    }
    this.lastCheck = Date.now();
    return this.status;
  }

  async execute(...args) {
    if (this.status === HealthStatus.UNHEALTHY) {
      throw new Error(`Service ${this.name} is unhealthy`);
    }
    return this.operationFn(...args);
  }
}

// Graceful Degradation Manager
class GracefulDegradationManager {
  constructor() {
    this.services = new Map();
    this.degradationLevel = 0;
    this.maxDegradationLevel = 3;
  }

  registerService(name, primaryFn, degradedFn, minimalFn) {
    this.services.set(name, {
      primary: primaryFn,
      degraded: degradedFn || primaryFn,
      minimal: minimalFn || (() => 'Service temporarily unavailable'),
    });
  }

  setDegradationLevel(level) {
    this.degradationLevel = Math.min(level, this.maxDegradationLevel);
    console.log(`[Degradation] Level set to ${level}`);
  }

  async execute(serviceName, ...args) {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not registered`);
    }

    // Select function based on degradation level
    let fn;
    let mode;

    if (this.degradationLevel === 0) {
      fn = service.primary;
      mode = 'primary';
    } else if (this.degradationLevel === 1) {
      fn = service.degraded;
      mode = 'degraded';
    } else {
      fn = service.minimal;
      mode = 'minimal';
    }

    console.log(`[Degradation] Executing ${serviceName} in ${mode} mode`);

    try {
      return await fn(...args);
    } catch (error) {
      console.log(`[Degradation] ${mode} mode failed: ${error.message}`);

      // Try fallback modes
      if (mode !== 'minimal') {
        try {
          return await service.minimal(...args);
        } catch {
          throw error;
        }
      }

      throw error;
    }
  }

  getStatus() {
    const status = {};
    for (const [name, service] of this.services.entries()) {
      status[name] = {
        degradationLevel: this.degradationLevel,
        mode:
          this.degradationLevel === 0
            ? 'primary'
            : this.degradationLevel === 1
              ? 'degraded'
              : 'minimal',
      };
    }
    return status;
  }
}

// Feature Flags with Degradation
class FeatureFlags {
  constructor() {
    this.flags = new Map();
  }

  setFlag(name, enabled, degradedEnabled = true) {
    this.flags.set(name, { enabled, degradedEnabled });
  }

  isEnabled(name) {
    return this.flags.get(name)?.enabled || false;
  }

  isDegradedEnabled(name) {
    return this.flags.get(name)?.degradedEnabled || false;
  }

  // Disable feature gracefully
  disableFeature(name) {
    const flag = this.flags.get(name);
    if (flag) {
      flag.enabled = false;
      console.log(`[Feature] Disabled: ${name}`);
    }
  }

  // Enable degraded mode for feature
  enableDegradedMode(name) {
    const flag = this.flags.get(name);
    if (flag) {
      flag.degradedEnabled = true;
      console.log(`[Feature] Degraded mode enabled: ${name}`);
    }
  }
}

// Complete Graceful Degradation System
class DegradationSystem {
  constructor() {
    this.degradationManager = new GracefulDegradationManager();
    this.featureFlags = new FeatureFlags();

    // Setup services
    this.degradationManager.registerService(
      'analysis',
      // Primary - full analysis with GPT-4
      async (data) => {
        const prompt = ChatPromptTemplate.fromTemplate(`Provide detailed analysis: {data}`);
        const chain = prompt.pipe(llm).pipe(new StringOutputParser());
        return await chain.invoke({ data });
      },
      // Degraded - simpler analysis
      async (data) => {
        const prompt = ChatPromptTemplate.fromTemplate(`Briefly analyze: {data}`);
        const chain = prompt.pipe(llm).pipe(new StringOutputParser());
        return await chain.invoke({ data });
      },
      // Minimal - basic response
      async (data) => `Analysis complete for: ${data.substring(0, 50)}...`,
    );

    // Setup feature flags
    this.featureFlags.setFlag('advanced_analysis', true, true);
    this.featureFlags.setFlag('detailed_explanations', true, false);
    this.featureFlags.setFlag('real_time_data', true, false);
  }

  async analyze(query) {
    // Check if feature is available
    if (!this.featureFlags.isEnabled('analysis')) {
      return 'Analysis service is currently unavailable.';
    }

    // Check if we should use degraded mode
    if (!this.featureFlags.isDegradedEnabled('analysis')) {
      this.degradationManager.setDegradationLevel(1);
    }

    try {
      return await this.degradationManager.execute('analysis', query);
    } catch (error) {
      console.log(`[System] Analysis failed: ${error.message}`);

      // Increase degradation level
      this.degradationManager.setDegradationLevel(this.degradationManager.degradationLevel + 1);

      // Retry with higher degradation
      return await this.degradationManager.execute('analysis', query);
    }
  }

  getSystemStatus() {
    return {
      degradation: this.degradationManager.getStatus(),
      features: Object.fromEntries(
        Array.from(this.featureFlags.flags.entries()).map(([k, v]) => [
          k,
          { enabled: v.enabled, degradedEnabled: v.degradedEnabled },
        ]),
      ),
    };
  }
}

// Usage
async function demoDegradation() {
  const system = new DegradationSystem();

  // Normal operation
  console.log('--- Normal Operation ---');
  const result1 = await system.analyze('Analyze the tech industry trends');
  console.log('Result:', result1.substring(0, 100), '...\n');

  // Simulate degradation
  console.log('--- Degraded Operation ---');
  system.featureFlags.disableFeature('detailed_explanations');
  system.degradationManager.setDegradationLevel(1);

  const result2 = await system.analyze('Analyze healthcare sector');
  console.log('Result:', result2.substring(0, 100), '...\n');

  // Show system status
  console.log('--- System Status ---');
  console.log(system.getSystemStatus());
}

demoDegradation();
```

### 5. Complete Exception Handling System (完整的异常处理系统)

以下代码实现了一个完整的异常处理与恢复系统：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Complete Exception Handling System
class AgentExceptionSystem {
  constructor() {
    this.errorHandler = new ErrorHandler();
    this.retryExecutor = new RetryExecutor();
    this.fallbackSystem = new FallbackSystem();
    this.degradationManager = new GracefulDegradationManager();

    this.setupErrorHandlers();
    this.setupDegradationLevels();
  }

  setupErrorHandlers() {
    // Handle tool errors
    this.errorHandler.registerHandler('TOOL_ERROR', async (error) => {
      console.log(`[System] Handling tool error: ${error.toolName}`);
      return { action: 'fallback', useFallback: true };
    });

    // Handle LLM errors
    this.errorHandler.registerHandler('LLM_ERROR', async (error) => {
      console.log(`[System] Handling LLM error: ${error.model}`);
      return { action: 'retry', maxRetries: 2 };
    });

    // Handle validation errors
    this.errorHandler.registerHandler('VALIDATION_ERROR', async (error) => {
      console.log(`[System] Handling validation error: ${error.field}`);
      return { action: 'reject', message: `Invalid ${error.field}` };
    });

    // Handle resource errors
    this.errorHandler.registerHandler('RESOURCE_LIMIT', async (error) => {
      console.log(`[System] Handling resource limit: ${error.resourceType}`);
      return { action: 'degrade', level: 1 };
    });
  }

  setupDegradationLevels() {
    // Level 0: Full functionality
    this.degradationManager.registerService(
      'chat',
      async (prompt) => {
        const chain = ChatPromptTemplate.fromTemplate(prompt)
          .pipe(llm)
          .pipe(new StringOutputParser());
        return chain.invoke({});
      },
      null,
      () => 'Service is operating in reduced mode.',
    );

    // Level 1: Reduced features
    this.degradationManager.registerService(
      'analysis',
      async (data) => {
        const chain = ChatPromptTemplate.fromTemplate(`Analyze: {data}`)
          .pipe(llm)
          .pipe(new StringOutputParser());
        return chain.invoke({ data });
      },
      async (data) => `Basic analysis: ${data.substring(0, 100)}`,
      () => 'Analysis not available.',
    );
  }

  async executeOperation(operation, options = {}) {
    const {
      useRetry = true,
      useFallback = true,
      useDegradation = true,
      operationName = 'operation',
    } = options;

    try {
      if (useRetry) {
        return await this.retryExecutor.execute(() => operation(), operationName);
      }
      return await operation();
    } catch (error) {
      console.log(`[System] Operation failed: ${error.message}`);

      // Handle error
      const handling = await this.errorHandler.handle(error);

      // Execute recovery action
      switch (handling.action) {
        case 'retry':
          if (useRetry) {
            console.log('[System] Retrying operation...');
            return await this.executeOperation(operation, {
              ...options,
              useRetry: false, // Prevent infinite retry
            });
          }
          break;

        case 'fallback':
          if (useFallback && handling.useFallback) {
            console.log('[System] Using fallback...');
            // Would execute fallback logic here
          }
          break;

        case 'degrade':
          if (useDegradation) {
            console.log('[System] Degrading service...');
            this.degradationManager.setDegradationLevel(handling.level || 1);
          }
          break;

        case 'escalate':
          console.log('[System] Escalating to human...');
          return { error: error.message, escalated: true };

        case 'reject':
          return { error: handling.message, rejected: true };
      }

      throw error;
    }
  }

  getSystemHealth() {
    return {
      errorStats: this.errorHandler.getStats(),
      circuitBreaker: this.retryExecutor.getStatus(),
      degradation: this.degradationManager.getStatus(),
    };
  }
}

// Usage
async function demoCompleteSystem() {
  const system = new AgentExceptionSystem();

  // Test various scenarios
  console.log('=== Scenario 1: Normal Operation ===');
  try {
    const result = await system.executeOperation(
      async () => {
        const chain = ChatPromptTemplate.fromTemplate('Say hello')
          .pipe(llm)
          .pipe(new StringOutputParser());
        return chain.invoke({});
      },
      { operationName: 'greeting' },
    );
    console.log('Result:', result);
  } catch (e) {
    console.log('Error:', e.message);
  }

  console.log('\n=== Scenario 2: Simulated Failure ===');
  try {
    await system.executeOperation(
      async () => {
        throw new ToolError('API timeout', 'external_api');
      },
      { operationName: 'external_call' },
    );
  } catch (e) {
    console.log('Final Error:', e.message);
  }

  console.log('\n=== System Health ===');
  console.log(system.getSystemHealth());
}

demoCompleteSystem();
```

## Practical Applications & Use Cases

## 实际应用和用例
