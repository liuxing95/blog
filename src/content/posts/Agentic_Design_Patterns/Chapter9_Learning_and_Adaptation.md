---
title: 'Chapter 9: Learning and Adaptation'
date: '2025-12-25'
excerpt: 'While memory allows agents to retain information, learning enables them to improve their performance based on that information.'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 9: Learning and Adaptation

# 第九章：学习与适应

## Learning and Adaptation Pattern Overview

## 学习与适应模式概述

While memory allows agents to retain information, learning enables them to improve their performance based on that information.

虽然内存允许智能体保留信息，但学习使它们能够根据这些信息提高性能。

Learning and adaptation involve the ability to modify behavior based on feedback, new information, and changing conditions.

学习和适应涉及根据反馈、新信息和变化的条件修改行为的能力。

This pattern is essential for creating agents that can get better over time without explicit reprogramming.

这种模式对于创建能够随着时间变得更好而无需明确重新编程的智能体至关重要。

### Types of Learning

### 学习的类型

**Supervised Learning**: The agent learns from labeled examples provided by humans or other systems.

**监督学习**: 智能体从人类或其他系统提供的标记示例中学习。

**Reinforcement Learning**: The agent learns from rewards and punishments received for its actions.

**强化学习**: 智能体从其行为获得的奖励和惩罚中学习。

**Self-Supervised Learning**: The agent learns from the structure of the data itself without external labels.

**自监督学习**: 智能体从数据本身的结构中学习，无需外部标签。

**Few-Shot Learning**: The agent learns from a small number of examples.

**少样本学习**: 智能体从少量示例中学习。

### Adaptation Mechanisms

### 适应机制

**Prompt Optimization**: Automatically improving prompts based on feedback.

**提示优化**: 根据反馈自动改进提示。

**Tool Selection**: Learning which tools work best for different types of tasks.

**工具选择**: 学习哪些工具最适合不同类型的任务。

**Strategy Adjustment**: Modifying the approach based on success or failure.

**策略调整**: 根据成功或失败修改方法。

## Practical Applications & Use Cases

## 实际应用和用例

### Personalized Responses

### 个性化响应

Agents can learn user preferences and adapt their responses accordingly.

智能体可以学习用户偏好并相应地调整响应。

### Performance Improvement

### 性能改进

Agents can identify patterns in successful and unsuccessful outcomes and adjust their strategies accordingly.

智能体可以识别成功和失败结果的模式并相应地调整策略。

### Domain Adaptation

### 领域适应

Agents can adapt to new domains or topics by learning from relevant examples.

智能体可以通过学习相关示例来适应新领域或主题。

---

## Hands-On Code Examples

## 实践代码示例

The following code examples demonstrate how to implement learning and adaptation patterns in JavaScript using LangChain:

以下代码示例展示如何使用 LangChain 在 JavaScript 中实现学习和适应模式：

### Prompt Optimization Based on Feedback

### 基于反馈的提示优化

This example shows how an agent can learn and improve its prompts based on feedback:

此示例展示智能体如何根据反馈学习和改进其提示：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// --- Configuration ---
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

// --- Prompt Optimization System ---

class PromptOptimizer {
  constructor() {
    this.promptHistory = [];
    this.performanceScores = [];
  }

  // Analyze feedback and generate improved prompt
  async optimizePrompt(originalPrompt, feedback) {
    const optimizationPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a Prompt Optimization Expert. Your task is to improve prompts based on feedback.
Analyze the original prompt and feedback, then create an improved version.

Original Prompt: {original}
Feedback: {feedback}

Provide:
1. Issues identified
2. Improved prompt
3. Expected improvement`,
      ],
      ['user', 'Optimize this prompt.'],
    ]);

    const chain = optimizationPrompt.pipe(llm).pipe(new StringOutputParser());
    const result = await chain.invoke({
      original: originalPrompt,
      feedback: feedback,
    });

    return result;
  }

  // Track prompt performance
  recordPerformance(prompt, score) {
    this.promptHistory.push({ prompt, score, timestamp: Date.now() });
    this.performanceScores.push(score);
  }

  // Get best performing prompt
  getBestPrompt() {
    if (this.promptHistory.length === 0) return null;
    const best = this.promptHistory.reduce((a, b) => (a.score > b.score ? a : b));
    return best.prompt;
  }

  // Get average performance
  getAverageScore() {
    if (this.performanceScores.length === 0) return 0;
    return this.performanceScores.reduce((a, b) => a + b, 0) / this.performanceScores.length;
  }
}

// --- Example Usage ---

async function runPromptOptimization() {
  const optimizer = new PromptOptimizer();

  // Initial prompt
  let currentPrompt = 'Explain quantum computing to a 5-year-old.';

  console.log('=== Prompt Optimization Demo ===\n');

  // Simulate feedback and optimization rounds
  const feedbackExamples = [
    'The explanation was too technical and used too many jargon words.',
    'Good, but could be more engaging with analogies.',
    'Perfect! The child understood the basic concept.',
  ];

  for (let i = 0; i < feedbackExamples.length; i++) {
    console.log(`--- Round ${i + 1} ---`);
    console.log(`Original Prompt: ${currentPrompt}`);
    console.log(`Feedback: ${feedbackExamples[i]}\n`);

    const improvement = await optimizer.optimizePrompt(currentPrompt, feedbackExamples[i]);
    console.log('Optimization Result:', improvement.substring(0, 300) + '...\n');

    // Simulate performance score (would come from actual evaluation)
    const score = Math.random() * 0.4 + 0.6; // Random score between 0.6-1.0
    optimizer.recordPerformance(currentPrompt, score);
    console.log(`Performance Score: ${score.toFixed(2)}\n`);

    // Update prompt for next round (in real system, extract the optimized prompt)
    currentPrompt = improvement.split('\n')[1] || currentPrompt;
  }

  console.log('=== Summary ===');
  console.log('Best Prompt:', optimizer.getBestPrompt());
  console.log('Average Score:', optimizer.getAverageScore().toFixed(2));
}

runPromptOptimization();
```

### Tool Selection Learning

### 工具选择学习

This example demonstrates an agent that learns which tools work best for different tasks:

此示例展示一个智能体学习哪些工具最适合不同任务：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// --- Configuration ---
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

// --- Tool Definitions ---
const tools = {
  search: {
    name: 'web_search',
    description: 'Best for: current events, latest news, real-time information',
    strengths: ['fresh information', 'broad coverage'],
    bestFor: ['news', 'current events', 'trends'],
  },
  database: {
    name: 'database_query',
    description: 'Best for: factual data, statistics, historical records',
    strengths: ['accurate data', 'structured information'],
    bestFor: ['facts', 'numbers', 'statistics', 'historical'],
  },
  calculator: {
    name: 'math_tool',
    description: 'Best for: calculations, computations, numerical analysis',
    strengths: ['precision', 'complex calculations'],
    bestFor: ['math', 'calculations', 'numbers', 'computation'],
  },
  wikipedia: {
    name: 'wikipedia',
    description: 'Best for: general knowledge, definitions, overviews',
    strengths: ['broad knowledge', 'definitions'],
    bestFor: ['definitions', 'general knowledge', 'concepts'],
  },
};

// --- Tool Selection Learning System ---

class ToolSelectionLearner {
  constructor() {
    this.taskHistory = [];
    this.toolPerformance = {};
  }

  // Analyze task and recommend best tool
  async selectTool(task) {
    const selectionPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a Tool Selection Expert. Analyze the task and select the best tool.
Available tools:
- search: For current events and latest information
- database: For factual data and statistics
- calculator: For mathematical calculations
- wikipedia: For general knowledge and definitions

Task: {task}

Analyze the task keywords and select the most appropriate tool.
Provide your reasoning.`,
      ],
      ['user', 'Select the best tool.'],
    ]);

    const chain = selectionPrompt.pipe(llm).pipe(new StringOutputParser());
    const result = await chain.invoke({ task: task });

    // Extract tool name from response
    const selectedTool =
      Object.keys(tools).find((t) => result.toLowerCase().includes(t)) || 'search';

    return { tool: selectedTool, reasoning: result };
  }

  // Record task outcome and update performance
  recordOutcome(task, selectedTool, success) {
    this.taskHistory.push({ task, selectedTool, success, timestamp: Date.now() });

    if (!this.toolPerformance[selectedTool]) {
      this.toolPerformance[selectedTool] = { successes: 0, total: 0 };
    }

    this.toolPerformance[selectedTool].total++;
    if (success) {
      this.toolPerformance[selectedTool].successes++;
    }
  }

  // Get recommended tool based on history
  getRecommendedTool(taskKeywords) {
    let bestTool = 'search';
    let bestScore = 0;

    for (const [toolName, performance] of Object.entries(this.toolPerformance)) {
      const score = performance.successes / performance.total;
      // Check if tool is suitable for task keywords
      const isSuitable = tools[toolName].bestFor.some((kw) =>
        taskKeywords.toLowerCase().includes(kw),
      );

      if (isSuitable && score > bestScore) {
        bestScore = score;
        bestTool = toolName;
      }
    }

    return bestTool;
  }

  // Get performance statistics
  getPerformanceStats() {
    return Object.entries(this.toolPerformance).map(([tool, perf]) => ({
      tool,
      successRate: ((perf.successes / perf.total) * 100).toFixed(1) + '%',
      totalUses: perf.total,
    }));
  }
}

// --- Example Usage ---

async function runToolSelectionLearning() {
  const learner = new ToolSelectionLearner();

  console.log('=== Tool Selection Learning Demo ===\n');

  // Simulate task execution with feedback
  const tasks = [
    { task: 'What is the population of Tokyo?', expectedTool: 'database', success: true },
    { task: 'Calculate 15% of 2500', expectedTool: 'calculator', success: true },
    { task: 'What happened in the news today?', expectedTool: 'search', success: true },
    { task: 'Who was Albert Einstein?', expectedTool: 'wikipedia', success: true },
    { task: 'What is machine learning?', expectedTool: 'wikipedia', success: true },
  ];

  for (const { task, success } of tasks) {
    const { tool, reasoning } = await learner.selectTool(task);
    console.log(`Task: ${task}`);
    console.log(`Selected Tool: ${tool}`);
    console.log(`Reasoning: ${reasoning.substring(0, 100)}...`);
    console.log(`Success: ${success}\n`);

    learner.recordOutcome(task, tool, success);
  }

  console.log('=== Performance Statistics ===');
  console.log(learner.getPerformanceStats());

  // Test learned recommendation
  console.log('\n=== Learned Recommendations ===');
  console.log("For 'math problem':", learner.getRecommendedTool('math problem'));
  console.log("For 'latest news':", learner.getRecommendedTool('latest news'));
}

runToolSelectionLearning();
```

### Strategy Adjustment Based on Success/Failure

### 基于成功/失败的策略调整

This example shows how an agent can adjust its strategy based on outcomes:

此示例展示智能体如何根据结果调整策略：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// --- Configuration ---
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

// --- Strategy Adjustment System ---

const strategies = {
  direct: {
    name: 'Direct Answer',
    description: 'Provide answer immediately without elaboration',
    bestFor: ['simple facts', 'clear questions'],
  },
  detailed: {
    name: 'Detailed Explanation',
    description: 'Provide comprehensive answer with examples',
    bestFor: ['complex topics', 'educational'],
  },
  conversational: {
    name: 'Conversational',
    description: 'Friendly, engaging tone with follow-up',
    bestFor: ['opinions', 'discussions'],
  },
  analytical: {
    name: 'Analytical',
    description: 'Step-by-step analysis with data',
    bestFor: ['analysis', 'comparisons'],
  },
};

class StrategyAdjuster {
  constructor() {
    this.strategyHistory = [];
    this.strategyPerformance = {};
  }

  // Analyze task and select initial strategy
  async selectStrategy(task) {
    const analysisPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `Analyze this task and select the best response strategy.
Strategies:
- direct: For simple factual questions
- detailed: For complex explanations
- conversational: For discussions and opinions
- analytical: For analysis and comparisons

Task: {task}

Select the most appropriate strategy and explain why.`,
      ],
      ['user', 'Analyze and select strategy.'],
    ]);

    const chain = analysisPrompt.pipe(llm).pipe(new StringOutputParser());
    const result = await chain.invoke({ task });

    const selectedStrategy =
      Object.keys(strategies).find((s) => result.toLowerCase().includes(s)) || 'direct';

    return { strategy: selectedStrategy, analysis: result };
  }

  // Execute task with selected strategy
  async executeWithStrategy(task, strategyKey) {
    const strategy = strategies[strategyKey];

    const executionPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `{strategy}

Task: {task}

Respond using the {strategy} strategy.`,
      ],
      ['user', '{task}'],
    ]);

    const chain = executionPrompt.pipe(llm).pipe(new StringOutputParser());
    return chain.invoke({ task, strategy: strategy.description });
  }

  // Adjust strategy based on outcome
  async adjustStrategy(task, currentStrategy, wasSuccessful, feedback) {
    if (wasSuccessful) {
      console.log(`Strategy ${currentStrategy} worked well! Maintaining...`);
      return currentStrategy;
    }

    console.log(`Strategy ${currentStrategy} failed. Analyzing adjustment...`);

    const adjustmentPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `Analyze why the previous strategy failed and recommend an adjustment.
Previous Strategy: {currentStrategy}
Task: {task}
Feedback: {feedback}

Available strategies:
- direct: For simple factual questions
- detailed: For complex explanations
- conversational: For discussions and opinions
- analytical: For analysis and comparisons

Recommend a new strategy and explain the change.`,
      ],
      ['user', 'Analyze and recommend adjustment.'],
    ]);

    const chain = adjustmentPrompt.pipe(llm).pipe(new StringOutputParser());
    const result = await chain.invoke({
      currentStrategy: strategies[currentStrategy].name,
      task,
      feedback,
    });

    const newStrategy =
      Object.keys(strategies).find((s) => result.toLowerCase().includes(s)) || 'detailed';

    // Record performance
    this.recordPerformance(currentStrategy, false);
    this.recordPerformance(newStrategy, true);

    return newStrategy;
  }

  recordPerformance(strategy, success) {
    if (!this.strategyPerformance[strategy]) {
      this.strategyPerformance[strategy] = { successes: 0, failures: 0 };
    }

    if (success) {
      this.strategyPerformance[strategy].successes++;
    } else {
      this.strategyPerformance[strategy].failures++;
    }
  }

  getBestStrategy() {
    let best = null;
    let bestScore = 0;

    for (const [strategy, perf] of Object.entries(this.strategyPerformance)) {
      const total = perf.successes + perf.failures;
      const score = perf.successes / total;
      if (score > bestScore) {
        bestScore = score;
        best = strategy;
      }
    }

    return best;
  }
}

// --- Example Usage ---

async function runStrategyAdjustment() {
  const adjuster = new StrategyAdjuster();

  console.log('=== Strategy Adjustment Demo ===\n');

  // Simulate task execution with strategy adjustment
  const taskExamples = [
    { task: 'What is 2+2?', feedback: 'Too detailed', success: false },
    { task: 'Explain quantum physics', feedback: 'Too brief', success: false },
    { task: 'What do you think about AI?', feedback: 'Good engagement', success: true },
    { task: 'Compare Python and JavaScript', feedback: 'Good analysis', success: true },
  ];

  let currentStrategy = 'direct';

  for (const { task, feedback, success } of taskExamples) {
    console.log(`--- Task: ${task} ---`);
    console.log(`Current Strategy: ${currentStrategy}`);

    // Execute with current strategy
    const response = await adjuster.executeWithStrategy(task, currentStrategy);
    console.log(`Response: ${response.substring(0, 100)}...`);

    // Adjust if needed
    currentStrategy = await adjuster.adjustStrategy(task, currentStrategy, success, feedback);

    console.log(`New Strategy: ${currentStrategy}\n`);
  }

  console.log('=== Best Performing Strategy ===');
  console.log(adjuster.getBestStrategy());
}

runStrategyAdjustment();
```

### Personalized Response System

### 个性化响应系统

This example demonstrates an agent that learns user preferences and adapts accordingly:

此示例展示一个学习用户偏好并相应调整的智能体：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// --- Configuration ---
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

// --- User Preference Learning System ---

class PersonalizedAgent {
  constructor(userId) {
    this.userId = userId;
    this.preferences = {
      detailLevel: 'medium', // brief, medium, detailed
      tone: 'professional', // casual, professional, friendly
      format: 'paragraph', // bullet, paragraph, numbered
      topics: [],
    };
    this.interactionHistory = [];
  }

  // Learn from user feedback
  learnFromFeedback(feedback) {
    const feedback_lower = feedback.toLowerCase();

    // Learn detail level preferences
    if (feedback_lower.includes('too brief') || feedback_lower.includes('more detail')) {
      this.preferences.detailLevel = 'detailed';
    } else if (feedback_lower.includes('too long') || feedback_lower.includes('too much')) {
      this.preferences.detailLevel = 'brief';
    }

    // Learn tone preferences
    if (feedback_lower.includes('too casual') || feedback_lower.includes('more formal')) {
      this.preferences.tone = 'professional';
    } else if (feedback_lower.includes('too formal') || feedback_lower.includes('friendlier')) {
      this.preferences.tone = 'friendly';
    }

    // Learn format preferences
    if (feedback_lower.includes('bullet') || feedback_lower.includes('list')) {
      this.preferences.format = 'bullet';
    } else if (feedback_lower.includes('numbered') || feedback_lower.includes('steps')) {
      this.preferences.format = 'numbered';
    }

    // Learn topic interests
    const topicKeywords = ['AI', 'machine learning', 'technology', 'science', 'business'];
    for (const topic of topicKeywords) {
      if (feedback_lower.includes(topic.toLowerCase())) {
        if (!this.preferences.topics.includes(topic)) {
          this.preferences.topics.push(topic);
        }
      }
    }

    this.interactionHistory.push({ feedback, timestamp: Date.now() });
  }

  // Generate personalized response
  async generateResponse(query) {
    // Build personalization instructions
    const detailInstructions = {
      brief: 'Keep your response concise and to the point.',
      medium: 'Provide a balanced response with moderate detail.',
      detailed: 'Provide comprehensive details with examples and explanations.',
    };

    const toneInstructions = {
      casual: 'Use a casual, relaxed tone.',
      professional: 'Use a professional, formal tone.',
      friendly: 'Use a friendly, warm tone.',
    };

    const formatInstructions = {
      bullet: 'Use bullet points for key information.',
      paragraph: 'Use flowing paragraphs.',
      numbered: 'Use numbered lists for steps or items.',
    };

    const personalization = `
${detailInstructions[this.preferences.detailLevel]}
${toneInstructions[this.preferences.tone]}
${formatInstructions[this.preferences.format]}
${this.preferences.topics.length > 0 ? `Consider mentioning related topics: ${this.preferences.topics.join(', ')}` : ''}
`.trim();

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a personalized assistant. Adapt your responses based on user preferences.
User Preferences:
- Detail Level: ${this.preferences.detailLevel}
- Tone: ${this.preferences.tone}
- Format: ${this.preferences.format}
- Interested Topics: ${this.preferences.topics.join(', ') || 'None specified'}

Guidelines:
${personalization}`,
      ],
      ['user', '{query}'],
    ]);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    return chain.invoke({ query });
  }

  // Get current preferences
  getPreferences() {
    return { ...this.preferences };
  }
}

// --- Example Usage ---

async function runPersonalizedAgent() {
  const agent = new PersonalizedAgent('user_123');

  console.log('=== Personalized Agent Demo ===\n');

  // Initial query
  console.log('--- Initial Query ---');
  let response = await agent.generateResponse('What is machine learning?');
  console.log('Response:', response.substring(0, 200) + '...\n');

  // User provides feedback
  console.log("--- User Feedback: 'Too brief, I want more details and examples' ---");
  agent.learnFromFeedback('Too brief, I want more details and examples');
  console.log('Updated Preferences:', agent.getPreferences());

  // Query again with learned preferences
  console.log('\n--- Second Query ---');
  response = await agent.generateResponse('What is machine learning?');
  console.log('Response:', response.substring(0, 200) + '...\n');

  // More feedback
  console.log("--- User Feedback: 'Too formal, be friendlier and use bullet points' ---");
  agent.learnFromFeedback('Too formal, be friendlier and use bullet points');
  console.log('Updated Preferences:', agent.getPreferences());

  // Query with updated preferences
  console.log('\n--- Third Query ---');
  response = await agent.generateResponse('What is machine learning?');
  console.log('Response:', response.substring(0, 200) + '...\n');

  console.log('=== Interaction History ===');
  console.log('Total feedback sessions:', agent.interactionHistory.length);
}

runPersonalizedAgent();
```

### Key Takeaways

### 关键要点

- **Learning and adaptation** enable agents to improve over time without explicit reprogramming.

- **学习和适应**使智能体能够随着时间改进而无需明确重新编程。

- **Prompt optimization** helps agents learn from feedback and improve their outputs.

- **提示优化**帮助智能体从反馈中学习并改进输出。

- **Tool selection learning** enables agents to choose the best tools for different tasks.

- **工具选择学习**使智能体能够为不同任务选择最佳工具。

- **Strategy adjustment** allows agents to modify their approach based on success/failure.

- **策略调整**允许智能体根据成功/失败修改方法。

- **Personalization** helps agents adapt to individual user preferences.

- **个性化**帮助智能体适应个人用户偏好。

- These patterns create agents that continuously improve and provide better experiences.

- 这些模式创建了能够持续改进并提供更好体验的智能体。

### 投资智能体

设计一个投资智能体的自我学习和适应机制，核心在于让它能够从千变万化的金融市场中汲取教训，并根据交易结果不断优化自身的决策逻辑。金融市场是高度动态和不可预测的，静态的预编程逻辑远远不够。

结合系统架构模式，您可以从以下五个维度来设计投资智能体的学习与适应机制：

#### 1. 基于内存的经验学习 (Memory-Based Learning)

这是最基础且易于实现的学习机制，让智能体拥有“复盘”的能力。

- **设计方式：** 利用向量数据库构建**情节记忆（Episodic Memory）**。每次交易（或给出的投资建议）结束后，系统将“当时的市场状态、采取的操作（买入/卖出）、背后的逻辑以及最终的盈亏结果”打包存入数据库。
- **如何适应：** 当智能体面临新的投资决策时，它首先会通过 RAG（检索增强生成）搜索过去类似的市场情境。如果它检索到“上次在类似的技术面指标下买入导致了亏损”，它就会将这个“失败经验”作为上下文，调整当前的行动，从而避免重复犯错。

#### 2. 强化学习与目标对齐 (Reinforcement Learning & DPO)

投资天然具有明确的衡量指标（收益率、最大回撤等），非常适合引入强化学习。

- **设计方式（RL）：** 为智能体设定明确的**奖励（Rewards，如实现盈利、控制风险）**和**惩罚（Penalties，如产生亏损、违反风控底线）**。在模拟盘（Paper Trading）中，智能体不断尝试不同的交易策略，系统根据结果给予反馈，使其学会在变化的市场中选择最优行为。
- **设计方式（DPO - 直接偏好优化）：** 投资是非常个性化的。您可以利用 DPO 技术将智能体与特定用户的风险偏好对齐。通过收集用户对智能体推荐策略的反馈（例如用户更喜欢稳健的股息策略，而不是激进的期权策略），直接更新模型的策略，增加首选响应的概率。

#### 3. 实时在线学习 (Online Learning)

投资智能体不能依赖过时的数据，它必须能够消化连续的数据流。

- **设计方式：** 构建在线学习管道，使智能体能够不断接收最新的宏观经济数据、财报和实时新闻。
- **如何适应：** 智能体（特别是交易机器人）通过不断摄取这些实时市场数据，动态地调整其内部的交易参数、技术指标权重或对市场情绪的判断，从而实现实时的策略优化。

#### 4. 引入“批评者”建立反馈闭环 (Critic Agent Feedback Loop)

结合反思模式（Reflection），利用专门的子智能体来驱动学习。

- **设计方式：** 在系统中设置一个专门的**批评智能体（Critic Agent）**。每当主要交易智能体提出一个投资方案后，批评智能体会根据事实的正确性、逻辑的连贯性以及是否遗漏了关键风险数据来进行严格审查。
- **如何适应：** 批评智能体的反馈不仅用于纠正当前的这笔交易，还可以被系统记录下来，作为微调（Fine-tuning）路由逻辑或主智能体提示词的依据。长期来看，主智能体会“吸收”这些批评，变得更加严谨。

### 5. 交易算法的自主演化 (Evolutionary Algorithms)

对于极其高阶的量化投资智能体，可以借鉴 Google AlphaEvolve 系统的设计，让智能体自己“写”并“优化”交易策略代码。

- **设计方式：** 智能体利用 LLM 生成多种初始的量化交易算法方案。
- **如何适应：** 系统在一个沙盒回测环境中自动运行这些代码，根据夏普比率或胜率等预定义标准对算法进行评分。然后，系统将反馈结果交给 LLM，让其迭代修改代码，创造出能够适应最新市场结构的新型交易算法。这赋予了智能体修改自身执行逻辑（修改自己的源代码）的终极适应能力。

**总结来说：**
您在设计时，不需要让 AI 自己凭空学会这些。您需要**搭建基础设施**：为它接上实时数据流（在线学习），为它配置记忆数据库（记录过往盈亏），为它设计回测和评分机制（强化学习），以及为它配备审查逻辑（批评者）。有了这些"系统护栏"和"反馈管道"，投资智能体就能在市场中不断自我进化了。

### 投资智能体代码示例

以下代码示例展示了投资智能体的自我学习和适应机制：

#### 1. 基于内存的经验学习（RAG复盘系统）

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// 投资智能体 - 基于内存的经验学习系统
class TradingMemoryLearner {
  constructor(llm) {
    this.llm = llm;
    this.episodicMemory = []; // 情节记忆库
  }

  // 记录交易经验
  async recordTradeExperience(trade) {
    const experience = {
      id: `trade_${Date.now()}`,
      timestamp: new Date().toISOString(),
      marketState: trade.marketState, // 市场状态：牛市/熊市/震荡
      technicalIndicators: trade.technicalIndicators, // 技术指标
      action: trade.action, // 买入/卖出/持有
      reasoning: trade.reasoning, // 交易理由
      result: trade.result, // profit/loss
      pnl: trade.pnl || null, // 盈亏金额
      lesson: null, // 经验教训（后续生成）
    };

    // 如果有结果，生成经验教训
    if (trade.result) {
      experience.lesson = await this.generateLesson(experience);
    }

    this.episodicMemory.push(experience);
    console.log(
      `已记录交易经验: ${experience.action} ${experience.marketState} -> ${experience.result}`,
    );
    return experience;
  }

  // 生成交易经验教训
  async generateLesson(experience) {
    const lessonPrompt = `基于以下交易记录，总结关键经验教训:

市场状态: ${experience.marketState}
技术指标: ${experience.technicalIndicators}
交易操作: ${experience.action}
交易理由: ${experience.reasoning}
结果: ${experience.result}
盈亏: ${experience.pnl}

请用一句话总结最重要的经验教训`;

    const chain = ChatPromptTemplate.fromTemplate(lessonPrompt)
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    return chain.invoke({});
  }

  // RAG检索相似经验
  async retrieveSimilarExperience(currentMarketState, currentIndicators) {
    // 简单关键词匹配（生产环境应使用向量相似度）
    const relevant = this.episodicMemory.filter((e) => {
      const stateMatch = e.marketState === currentMarketState;
      const hasLesson = e.lesson !== null;
      return stateMatch && hasLesson;
    });

    // 按相关性排序
    relevant.sort((a, b) => {
      const aWin = a.result === 'profit' ? 1 : 0;
      const bWin = b.result === 'profit' ? 1 : 0;
      return bWin - aWin;
    });

    return relevant.slice(0, 3);
  }

  // 基于历史经验做决策
  async makeDecisionWithMemory(currentMarketState, currentIndicators, proposedAction) {
    const similarExp = await this.retrieveSimilarExperience(currentMarketState, currentIndicators);

    if (similarExp.length === 0) {
      return { decision: proposedAction, warning: null, fromHistory: false };
    }

    // 分析历史经验
    const profitableCount = similarExp.filter((e) => e.result === 'profit').length;
    const totalCount = similarExp.length;
    const successRate = profitableCount / totalCount;

    let warning = null;
    let adjustedAction = proposedAction;

    if (successRate < 0.4) {
      warning = `警告: 在类似市场状态(${currentMarketState})下，过去${totalCount}次相同操作中有${totalCount - profitableCount}次亏损，成功率仅${(successRate * 100).toFixed(0)}%`;
      // 建议改变策略
      adjustedAction = proposedAction === 'buy' ? 'hold' : proposedAction;
    }

    console.log(`\n--- 历史经验分析 ---`);
    console.log(`相似经验数量: ${totalCount}`);
    console.log(`成功率: ${(successRate * 100).toFixed(0)}%`);
    similarExp.forEach((e) => {
      console.log(`  - ${e.action} ${e.marketState}: ${e.result} (${e.lesson})`);
    });

    return {
      decision: adjustedAction,
      warning,
      fromHistory: true,
      successRate,
      similarExp,
    };
  }

  // 获取所有经验教训
  getAllLessons() {
    return this.episodicMemory
      .filter((e) => e.lesson)
      .map((e) => ({
        marketState: e.marketState,
        action: e.action,
        result: e.result,
        lesson: e.lesson,
      }));
  }
}

// 使用示例
const memoryLearner = new TradingMemoryLearner(llm);

// 模拟历史交易记录
await memoryLearner.recordTradeExperience({
  marketState: '牛市',
  technicalIndicators: 'RSI超买',
  action: 'buy',
  reasoning: '基本面良好，追高买入',
  result: 'loss',
  pnl: -1500,
});

await memoryLearner.recordTradeExperience({
  marketState: '牛市',
  technicalIndicators: 'RSI超买',
  action: 'buy',
  reasoning: '技术面超买但基本面强劲',
  result: 'loss',
  pnl: -800,
});

await memoryLearner.recordTradeExperience({
  marketState: '牛市',
  technicalIndicators: 'RSI超买',
  action: 'hold',
  reasoning: '等待回调',
  result: 'profit',
  pnl: 500,
});

// 新交易决策
console.log('\n=== 新交易决策 ===');
const decision = await memoryLearner.makeDecisionWithMemory('牛市', 'RSI超买', 'buy');
console.log(`建议操作: ${decision.decision}`);
if (decision.warning) console.log(`警告: ${decision.warning}`);
```

#### 2. 强化学习与DPO偏好对齐

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// 投资智能体 - 强化学习与偏好对齐系统
class RLTradingAgent {
  constructor(userId) {
    this.userId = userId;
    this.qTable = {};           // Q学习表
    this.strategies = ['conservative', 'moderate', 'aggressive'];
    this.userPreferences = {
      riskTolerance: 'moderate',
      preferredStrategy: null,
    };
    this.tradeHistory = [];
    this.initializeQTable();
  }

  // 初始化Q表
  initializeQTable() {
    const states = ['bull', 'bear', 'volatile', 'stable'];
    const actions = ['buy', 'sell', 'hold'];

    for (const state of states) {
      this.qTable[state] = {};
      for (const action of actions) {
        // 初始Q值为0
        this.qTable[state][action] = 0;
      }
    }
  }

  // 选择动作（epsilon-greedy策略）
  chooseAction(state, epsilon = 0.1) {
    if (Math.random() < epsilon) {
      // 探索：随机选择
      const actions = Object.keys(this.qTable[state] || {});
      return actions[Math.floor(Math.random() * actions.length)];
    } else {
      // 利用：选择Q值最高的动作
      const qValues = this.qTable[state];
      return Object.entries(qValues).sort((a, b) => b[1] - a[1])[0][0];
    }
  }

  // 执行交易并获取奖励
  executeTrade(state, action, actualResult) {
    // 奖励函数设计
    let reward = 0;

    if (actualResult === 'profit') {
      reward = 100; // 盈利奖励
      // 根据用户风险偏好调整
      if (this.userPreferences.riskTolerance === 'conservative' && action === 'aggressive') {
        reward -= 20; // 保守用户做激进操作惩罚
      }
    } else if (actualResult === 'loss') {
      reward = -100; // 亏损惩罚
    } else {
      reward = 10; // 持有（中性）
    }

    // 更新Q值
    this.updateQValue(state, action, reward);
    this.tradeHistory.push({ state, action, result: actualResult, reward });

    return reward;
  }

  // Q值更新（Q-learning公式）
  updateQValue(state, action, reward, alpha = 0.1, gamma = 0.9) {
    const currentQ = this.qTable[state][action];
    const maxNextQ = Math.max(...Object.values(this.qTable[state] || { buy: 0, sell: 0, hold: 0 }));

    // Q(s,a) = Q(s,a) + alpha * (reward + gamma * maxQ(s') - Q(s,a))
    this.qTable[state][action] = currentQ + alpha * (reward + gamma * maxNextQ - currentQ);
  }

  // 获取当前最优策略
  getBestPolicy() {
    const policy = {};
    for (const state of Object.keys(this.qTable)) {
      const actions = this.qTable[state];
      const best = Object.entries(actions).sort((a, b) => b[1] - a0];
[1])[      policy[state] = { action: best[0], qValue: best[1] };
    }
    return policy;
  }

  // DPO: 根据用户反馈调整偏好
  alignWithPreference(userFeedback) {
    const feedback = userFeedback.toLowerCase();

    // 分析用户偏好
    if (feedback.includes('稳健') || feedback.includes('保守') || feedback.includes('低风险')) {
      this.userPreferences.riskTolerance = 'conservative';
      this.userPreferences.preferredStrategy = 'conservative';
    } else if (feedback.includes('激进') || feedback.includes('高风险') || feedback.includes('高回报')) {
      this.userPreferences.riskTolerance = 'aggressive';
      this.userPreferences.preferredStrategy = 'aggressive';
    } else {
      this.userPreferences.riskTolerance = 'moderate';
    }

    // 调整Q表权重（模拟DPO）
    this.adjustQTableForPreference();
    console.log(`用户偏好已更新: ${this.userPreferences.riskTolerance}`);
  }

  // 根据偏好调整Q表
  adjustQTableForPreference() {
    const preferenceMultiplier = {
      conservative: { buy: 0.7, hold: 1.3, sell: 1.0 },
      moderate: { buy: 1.0, hold: 1.0, sell: 1.0 },
      aggressive: { buy: 1.5, hold: 0.7, sell: 0.8 },
    };

    const mult = preferenceMultiplier[this.userPreferences.riskTolerance];
    for (const state of Object.keys(this.qTable)) {
      for (const action of Object.keys(this.qTable[state])) {
        this.qTable[state][action] *= mult[action];
      }
    }
  }

  // 获取学习统计
  getStats() {
    const wins = this.tradeHistory.filter(t => t.result === 'profit').length;
    const total = this.tradeHistory.length;
    return {
      totalTrades: total,
      wins,
      winRate: total > 0 ? ((wins / total) * 100).toFixed(1) + '%') : 'N/A',
      currentPolicy: this.getBestPolicy(),
    };
  }
}

// 使用示例
const rlAgent = new RLTradingAgent('user001');

// 模拟多轮交易学习
const marketStates = ['bull', 'bull', 'volatile', 'bear', 'volatile', 'bull'];
const actions = ['buy', 'buy', 'buy', 'sell', 'hold', 'buy'];
const results = ['profit', 'loss', 'loss', 'profit', 'profit', 'profit'];

console.log('=== 强化学习训练 ===');
for (let i = 0; i < marketStates.length; i++) {
  const state = marketStates[i];
  const action = actions[i];
  const result = results[i];

  // 选择动作
  const chosenAction = rlAgent.chooseAction(state);
  // 执行并获取奖励
  const reward = rlAgent.executeTrade(state, chosenAction, result);
  console.log(`状态: ${state}, 选择: ${chosenAction}, 结果: ${result}, 奖励: ${reward}`);
}

// DPO偏好对齐
console.log('\n=== DPO偏好对齐 ===');
rlAgent.alignWithPreference('我比较保守，希望稳健收益');

// 查看学习结果
console.log('\n=== 学习结果 ===');
console.log(rlAgent.getStats());
console.log('\n当前策略:');
console.log(rlAgent.getBestPolicy());
```

#### 3. 实时在线学习系统

```javascript
import { ChatOpenAI } from '@langchain/openai';

// 投资智能体 - 实时在线学习系统
class OnlineLearningTrader {
  constructor() {
    this.dataStream = []; // 数据流缓冲区
    this.indicatorWeights = {
      // 技术指标权重（可学习）
      rsi: 0.25,
      macd: 0.25,
      movingAvg: 0.25,
      volume: 0.25,
    };
    this.marketSentiment = 'neutral'; // 市场情绪
    this.isLearning = false;
  }

  // 接收实时数据流
  async ingestDataStream(data) {
    this.dataStream.push({
      ...data,
      timestamp: Date.now(),
    });

    // 保持最近100条数据
    if (this.dataStream.length > 100) {
      this.dataStream.shift();
    }

    // 实时更新模型
    await this.updateModelRealtime();
  }

  // 实时模型更新
  async updateModelRealtime() {
    if (this.dataStream.length < 10) return; // 需要足够数据

    // 分析最近数据模式
    const recentData = this.dataStream.slice(-10);

    // 检测市场情绪变化
    const priceChanges = recentData.map((d) => d.priceChange || 0);
    const avgChange = priceChanges.reduce((a, b) => a + b, 0) / priceChanges.length;

    if (avgChange > 2) {
      this.marketSentiment = 'bullish';
    } else if (avgChange < -2) {
      this.marketSentiment = 'bearish';
    } else {
      this.marketSentiment = 'neutral';
    }

    // 动态调整指标权重
    await this.adjustIndicatorWeights(recentData);

    console.log(
      `实时学习: 市场情绪=${this.marketSentiment}, 指标权重=${JSON.stringify(this.indicatorWeights)}`,
    );
  }

  // 调整指标权重
  async adjustIndicatorWeights(recentData) {
    // 简单自适应：检测哪些指标在最近数据中更有效
    const correlations = {};

    for (const indicator of Object.keys(this.indicatorWeights)) {
      // 模拟计算指标与价格的相关性
      const values = recentData.map((d) => d[indicator]).filter((v) => v !== undefined);
      if (values.length < 2) continue;

      // 计算简单相关性
      const priceChanges = recentData.map((d) => d.priceChange || 0).slice(-values.length);
      const correlation = this.calculateCorrelation(values, priceChanges);
      correlations[indicator] = Math.abs(correlation);
    }

    // 根据相关性调整权重
    const totalCorrelation = Object.values(correlations).reduce((a, b) => a + b, 0);
    if (totalCorrelation > 0) {
      for (const indicator of Object.keys(correlations)) {
        this.indicatorWeights[indicator] = correlations[indicator] / totalCorrelation;
      }
    }
  }

  // 简单相关性计算
  calculateCorrelation(x, y) {
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;

    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.slice(0, n).reduce((acc, xi) => acc + xi * xi, 0);
    const sumY2 = y.slice(0, n).reduce((acc, yi) => acc + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  // 基于最新数据做决策
  async makeRealtimeDecision() {
    if (this.dataStream.length === 0) {
      return { action: 'hold', confidence: 0, reason: '无足够数据' };
    }

    const latest = this.dataStream[this.dataStream.length - 1];

    // 计算加权信号
    let buySignal = 0;
    let sellSignal = 0;

    // RSI信号
    if (latest.rsi < 30) buySignal += this.indicatorWeights.rsi;
    if (latest.rsi > 70) sellSignal += this.indicatorWeights.rsi;

    // MACD信号
    if (latest.macd > 0) buySignal += this.indicatorWeights.macd;
    if (latest.macd < 0) sellSignal += this.indicatorWeights.macd;

    // 市场情绪调整
    if (this.marketSentiment === 'bullish') buySignal *= 1.2;
    if (this.marketSentiment === 'bearish') sellSignal *= 1.2;

    // 决策
    let action = 'hold';
    let confidence = 0;

    if (buySignal > sellSignal && buySignal > 0.3) {
      action = 'buy';
      confidence = buySignal;
    } else if (sellSignal > buySignal && sellSignal > 0.3) {
      action = 'sell';
      confidence = sellSignal;
    }

    return {
      action,
      confidence: confidence.toFixed(2),
      signals: { buy: buySignal.toFixed(2), sell: sellSignal.toFixed(2) },
      marketSentiment: this.marketSentiment,
      weights: this.indicatorWeights,
    };
  }

  // 获取模型状态
  getModelState() {
    return {
      dataPoints: this.dataStream.length,
      marketSentiment: this.marketSentiment,
      indicatorWeights: this.indicatorWeights,
      lastUpdate: this.dataStream[this.dataStream.length - 1]?.timestamp,
    };
  }
}

// 使用示例
const onlineTrader = new OnlineLearningTrader();

// 模拟实时数据流
console.log('=== 实时在线学习演示 ===\n');

const simulatedData = [
  { rsi: 25, macd: 0.5, priceChange: 1.5 },
  { rsi: 28, macd: 0.6, priceChange: 2.0 },
  { rsi: 35, macd: 0.4, priceChange: 1.8 },
  { rsi: 45, macd: 0.3, priceChange: 1.2 },
  { rsi: 55, macd: 0.2, priceChange: 0.8 },
  { rsi: 65, macd: -0.1, priceChange: -0.5 },
  { rsi: 72, macd: -0.3, priceChange: -1.5 },
  { rsi: 78, macd: -0.5, priceChange: -2.5 },
  { rsi: 82, macd: -0.6, priceChange: -3.0 },
  { rsi: 28, macd: 0.8, priceChange: 3.5 },
];

for (const data of simulatedData) {
  await onlineTrader.ingestDataStream(data);
}

console.log('\n=== 实时决策 ===');
const decision = await onlineTrader.makeRealtimeDecision();
console.log(`决策: ${decision.action}`);
console.log(`置信度: ${decision.confidence}`);
console.log(`信号: ${JSON.stringify(decision.signals)}`);
console.log(`市场情绪: ${decision.marketSentiment}`);

console.log('\n=== 模型状态 ===');
console.log(onlineTrader.getModelState());
```

#### 4. 批评者反馈闭环

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// 投资智能体 - 批评者反馈系统
class CriticTradingAgent {
  constructor() {
    this.trader = new TradingAgent(llm);
    this.critic = new CriticAgent(llm);
    this.feedbackHistory = [];
  }

  // 主交易智能体生成建议
  async generateTradeSuggestion(marketData) {
    return this.trader.analyzeAndSuggest(marketData);
  }

  // 批评者审查
  async criticize(tradeSuggestion, marketData) {
    return this.critic.review(tradeSuggestion, marketData);
  }

  // 完整反馈循环
  async tradeWithCriticism(marketData) {
    console.log('=== 交易智能体分析 ===');
    const suggestion = await this.generateTradeSuggestion(marketData);
    console.log(`建议: ${suggestion.action} ${suggestion.ticker}`);
    console.log(`理由: ${suggestion.reasoning}`);

    console.log('\n=== 批评者审查 ===');
    const criticism = await this.critique(suggestion, marketData);

    // 记录反馈
    this.feedbackHistory.push({
      suggestion,
      criticism,
      timestamp: Date.now(),
    });

    return { suggestion, criticism };
  }
}

// 交易智能体（主智能体）
class TradingAgent {
  constructor(llm) {
    this.llm = llm;
  }

  async analyzeAndSuggest(marketData) {
    const prompt = `作为投资分析师，分析以下市场数据并给出交易建议:

当前价格: ${marketData.price}
涨跌幅: ${marketData.change}%
RSI: ${marketData.rsi}
MACD: ${marketData.macd}
市场情绪: ${marketData.sentiment}

请给出:
1. 操作建议 (buy/sell/hold)
2. 目标股票
3. 简要理由`;

    const chain = ChatPromptTemplate.fromTemplate(prompt)
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    const result = await chain.invoke({});

    // 简单解析
    const action = result.toLowerCase().includes('buy')
      ? 'buy'
      : result.toLowerCase().includes('sell')
        ? 'sell'
        : 'hold';

    return {
      action,
      ticker: marketData.ticker || 'AAPL',
      reasoning: result,
      rawResponse: result,
    };
  }
}

// 批评智能体
class CriticAgent {
  constructor(llm) {
    this.llm = llm;
  }

  async review(suggestion, marketData) {
    const prompt = `作为严格的交易审查员，审查以下交易建议:

交易建议:
- 操作: ${suggestion.action}
- 股票: ${suggestion.ticker}
- 理由: ${suggestion.reasoning}

市场数据:
- 价格: ${marketData.price}
- 涨跌幅: ${marketData.change}%
- RSI: ${marketData.rsi}
- MACD: ${marketData.macd}

请严格审查并指出:
1. 事实错误（如数据不一致）
2. 逻辑漏洞
3. 遗漏的关键风险
4. 最终评分 (0-10)

用JSON格式返回:
{"issues": [], "risks": [], "score": 8, "verdict": "批准/拒绝/修改建议"}`;

    const chain = ChatPromptTemplate.fromTemplate(prompt)
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    const result = await chain.invoke({});

    // 解析结果
    try {
      const parsed = JSON.parse(result);
      return parsed;
    } catch {
      return {
        issues: [],
        risks: ['解析失败'],
        score: 5,
        verdict: '需要人工审核',
      };
    }
  }
}

// 使用示例
const agent = new CriticTradingAgent(llm);

// 模拟市场数据
const marketData = {
  ticker: 'NVDA',
  price: 485.5,
  change: 3.2,
  rsi: 72, // 超买
  macd: 0.8, // 强势
  sentiment: 'bullish',
};

// 执行带批评的交易
console.log('=== 完整反馈循环 ===\n');
const result = await agent.tradeWithCriticism(marketData);

console.log('\n=== 审查结果 ===');
console.log(`评分: ${result.criticism.score}/10`);
console.log(`裁决: ${result.criticism.verdict}`);
if (result.criticism.risks?.length > 0) {
  console.log(`风险提示: ${result.criticism.risks.join(', ')}`);
}
```

#### 5. 交易算法自主演化

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// 投资智能体 - 交易算法自主演化系统
class EvolutionaryTradingSystem {
  constructor() {
    this.algorithms = []; // 算法种群
    this.generation = 0;
    this.bestAlgorithm = null;
  }

  // 初始化种群
  async initializePopulation(size = 5) {
    console.log(`=== 初始化第${this.generation}代种群 ===`);

    const initialPrompts = [
      '基于RSI超买时卖出，RSI超卖时买入的均值回归策略',
      '基于MACD金叉买入，死叉卖出的趋势跟踪策略',
      '基于成交量放大时买入，缩量时卖出的动量策略',
      '基于50日均线上穿买入，下穿卖出的均线策略',
      '基于波动率突破时买入的突破策略',
    ];

    for (const strategy of initialPrompts.slice(0, size)) {
      const algorithm = await this.generateAlgorithm(strategy);
      this.algorithms.push(algorithm);
    }

    console.log(`生成了 ${this.algorithms.length} 个初始算法\n`);
    return this.algorithms;
  }

  // 生成算法代码
  async generateAlgorithm(strategyDescription) {
    const prompt = `作为量化交易专家，根据以下策略描述生成可执行的JavaScript算法代码:

策略描述: ${strategyDescription}

请生成:
1. 策略名称
2. 核心逻辑（用注释说明）
3. 买入条件函数 buyCondition(data)
4. 卖出条件函数 sellCondition(data)
5. 参数配置

返回JSON格式:
{
  "name": "策略名",
  "description": "描述",
  "code": "代码",
  "parameters": {}
}`;

    const chain = ChatPromptTemplate.fromTemplate(prompt)
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    const result = await chain.invoke({});

    try {
      const parsed = JSON.parse(result);
      return {
        ...parsed,
        generation: this.generation,
        fitness: null,
      };
    } catch {
      return {
        name: '解析失败',
        description: strategyDescription,
        code: '// 解析失败',
        parameters: {},
        generation: this.generation,
        fitness: null,
      };
    }
  }

  // 回测评估（模拟）
  backtest(algorithm, marketData) {
    // 模拟回测：基于简单规则评分
    const dataPoints = marketData.length;
    let wins = 0;

    for (const data of marketData) {
      // 简化模拟：随机生成结果
      const rand = Math.random();
      if (rand > 0.4) wins++;
    }

    const winRate = wins / dataPoints;
    const fitness = winRate * 100; // 适应度 = 胜率 * 100

    algorithm.fitness = fitness;
    console.log(`算法 "${algorithm.name}" 适应度: ${fitness.toFixed(1)}`);

    return fitness;
  }

  // 演化下一代
  async evolveNextGeneration(marketData) {
    console.log(`\n=== 演化第 ${this.generation + 1} 代 ===`);

    // 评估当前代
    console.log('评估当前代...');
    for (const algo of this.algorithms) {
      this.backtest(algo, marketData);
    }

    // 选择最优
    this.algorithms.sort((a, b) => (b.fitness || 0) - (a.fitness || 0));
    this.bestAlgorithm = this.algorithms[0];

    console.log(
      `最优算法: ${this.bestAlgorithm.name} (适应度: ${this.bestAlgorithm.fitness?.toFixed(1)})`,
    );

    // 生成下一代
    const newAlgorithms = [];

    // 精英保留：直接保留前2名
    for (let i = 0; i < 2 && i < this.algorithms.length; i++) {
      newAlgorithms.push({ ...this.algorithms[i], generation: this.generation + 1 });
    }

    // 变异和交叉：生成新算法
    while (newAlgorithms.length < 5) {
      const parent = this.algorithms[Math.floor(Math.random() * this.algorithms.length)];
      const mutated = await this.mutateAlgorithm(parent);
      newAlgorithms.push(mutated);
    }

    this.algorithms = newAlgorithms;
    this.generation++;

    console.log(`生成了 ${this.algorithms.length} 个新算法\n`);

    return this.algorithms;
  }

  // 算法变异
  async mutateAlgorithm(parent) {
    const mutationPrompt = `作为量化交易专家，对以下交易策略进行变异改进:

原策略: ${parent.description}

请:
1. 修改一个核心参数或条件
2. 生成改进后的策略描述
3. 保持代码结构相似

返回JSON:
{"name": "新策略名", "description": "改进后的描述", "code": "新代码"}`;

    const chain = ChatPromptTemplate.fromTemplate(mutationPrompt)
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    const result = await chain.invoke({});

    try {
      const parsed = JSON.parse(result);
      return {
        ...parsed,
        generation: this.generation,
        fitness: null,
        parent: parent.name,
      };
    } catch {
      return {
        name: `${parent.name}_v2`,
        description: parent.description,
        code: parent.code,
        generation: this.generation,
        fitness: null,
        parent: parent.name,
      };
    }
  }

  // 获取最佳策略
  getBestAlgorithm() {
    return this.bestAlgorithm;
  }

  // 演化循环
  async runEvolution(generations = 3, marketData = []) {
    await this.initializePopulation();

    for (let i = 0; i < generations; i++) {
      await this.evolveNextGeneration(marketData);
    }

    console.log('\n=== 演化完成 ===');
    console.log(`最终最优算法: ${this.bestAlgorithm?.name}`);
    console.log(`适应度: ${this.bestAlgorithm?.fitness?.toFixed(1)}`);

    return this.bestAlgorithm;
  }
}

// 使用示例
const evolutionSystem = new EvolutionaryTradingSystem();

// 模拟市场数据
const mockMarketData = Array(100)
  .fill(null)
  .map((_, i) => ({
    price: 100 + Math.random() * 50,
    rsi: 30 + Math.random() * 40,
    macd: Math.random() * 2 - 1,
    volume: 1000000 + Math.random() * 500000,
  }));

// 运行演化
const best = await evolutionSystem.runEvolution(3, mockMarketData);

console.log('\n=== 最优策略详情 ===');
console.log(`名称: ${best.name}`);
console.log(`描述: ${best.description}`);
console.log(`代数: ${best.generation}`);
```

### 结论

The learning and adaptation pattern is crucial for creating intelligent agents that can improve their performance over time.

学习和适应模式对于创建能够随着时间提高其性能的智能体至关重要。

By implementing mechanisms for feedback analysis, strategy adjustment, and preference learning, agents can provide increasingly better responses and experiences.

通过实施反馈分析、策略调整和偏好学习机制，智能体可以提供越来越好的响应和体验。

This pattern, combined with memory systems, enables the creation of truly adaptive AI agents that grow and improve with each interaction.

此模式与内存系统相结合，能够创建真正具有适应性的AI智能体，随着每次交互而成长和改进。
