---
title: 'Chapter 7: Multi-Agent'
date: '2026-03-15'
excerpt: 'While individual agents can handle many tasks effectively, complex systems often benefit from having multiple specialized agents that work together. 融合社区洞察与最新框架实践。'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 7: Multi-Agent

# 第七章：多智能体

## Multi-Agent Pattern Overview

## 多智能体模式概述

While individual agents can handle many tasks effectively, complex systems often benefit from having multiple specialized agents that work together.

虽然单独的智能体可以有效处理许多任务，但复杂系统通常受益于多个协同工作的专业智能体。

The multi-agent pattern involves coordinating multiple agents, each with their own role, expertise, and responsibilities, to accomplish complex objectives that would be difficult or impossible for a single agent.

多智能体模式涉及协调多个智能体，每个智能体都有自己的角色、专业知识和责任，以实现单个智能体难以或不可能完成的复杂目标。

### Benefits of Multi-Agent Systems

### 多智能体系统的好处

**Specialization**: Different agents can specialize in different tasks or domains.

**专业化**: 不同的智能体可以专注于不同的任务或领域。

**Scalability**: Adding more agents can increase the system's capacity to handle more tasks.

**可扩展性**: 添加更多智能体可以增加系统处理更多任务的能力。

**Robustness**: If one agent fails, others can potentially compensate.

**健壮性**: 如果一个智能体失败，其他智能体可能会补偿。

**Parallelism**: Multiple agents can work on different aspects of a problem simultaneously.

**并行性**: 多个智能体可以同时处理问题的不同方面。

### Multi-Agent Architectures

### 多智能体架构

**Hierarchical**: A central agent coordinates sub-agents that handle specific tasks.

**分层**: 中央智能体协调处理特定任务的子智能体。

**Collaborative**: Agents work together as peers, sharing information and coordinating their efforts.

**协作**: 智能体作为对等体一起工作，共享信息并协调他们的努力。

**Competitive**: Agents may compete or debate to arrive at the best solution.

**竞争**: 智能体可能会竞争或辩论以达成最佳解决方案。

### Communication Between Agents

### 智能体之间的通信

Effective multi-agent systems require clear communication protocols.

有效的多智能体系统需要清晰的通信协议。

Agents must be able to:

智能体必须能够：

- Share relevant information

- 共享相关信息

- Request assistance from other agents

- 向其他智能体请求帮助

- Coordinate their actions

- 协调他们的行动

- Resolve conflicts

- 解决冲突

## Practical Applications & Use Cases

## 实际应用和用例

### Complex Workflows

### 复杂工作流

For tasks like launching a product, agents can specialize in different aspects—marketing, development, logistics—and coordinate their efforts.

对于推出产品等任务，智能体可以专注于不同方面——营销、开发、物流——并协调他们的工作。

### Research and Analysis

### 研究和分析

Multi-agent systems can divide research tasks among specialized agents—one might focus on academic sources, another on industry reports, and a third on synthesizing findings.

多智能体系统可以将研究任务分配给专业智能体——一个可能专注于学术来源，另一个专注于行业报告，第三个专注于综合发现。

### Customer Service

### 客户服务

Different agents can handle different types of inquiries—billing, technical support, general questions—while coordinating to provide seamless customer experience.

不同的智能体可以处理不同类型的查询——计费、技术支持、一般问题——同时协调以提供无缝的客户体验。

---

## Hands-On Code Examples

## 实践代码示例

The following code examples demonstrate how to implement multi-agent patterns in JavaScript using LangChain:

以下代码示例展示如何使用 LangChain 在 JavaScript 中实现多智能体模式：

### Hierarchical Multi-Agent System

### 分层多智能体系统

This example shows a hierarchical architecture where a central coordinator agent manages specialized sub-agents:

此示例展示分层架构，其中中央协调智能体管理专业子智能体：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// --- Configuration ---
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

// --- Define Specialized Sub-Agents ---

// Researcher Agent - Focuses on gathering information
const createResearcherAgent = (topic) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a Research Specialist. Your role is to gather comprehensive information about: {topic}
Provide detailed findings with sources.`,
    ],
    ['user', 'Please research this topic thoroughly.'],
  ]);

  return prompt.pipe(llm).pipe(new StringOutputParser());
};

// Analyst Agent - Focuses on analyzing data
const createAnalystAgent = (researchData) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a Data Analyst. Your role is to analyze the following research data and identify key insights, trends, and patterns.
Research Data:
{researchData}`,
    ],
    ['user', 'Provide a detailed analysis with key findings.'],
  ]);

  return prompt.pipe(llm).pipe(new StringOutputParser());
};

// Writer Agent - Focuses on creating content
const createWriterAgent = (analysis) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a Content Writer. Your role is to transform analytical insights into engaging, clear content.
Analysis:
{analysis}`,
    ],
    ['user', 'Create a well-structured article based on this analysis.'],
  ]);

  return prompt.pipe(llm).pipe(new StringOutputParser());
};

// --- Coordinator Agent ---
const createCoordinatorAgent = (task) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a Project Coordinator. Your role is to break down complex tasks and delegate to specialized agents.
Current Task: {task}

Determine which agents are needed and in what sequence.
Available agents: Researcher, Analyst, Writer`,
    ],
    ['user', 'Provide a coordination plan.'],
  ]);

  return prompt.pipe(llm).pipe(new StringOutputParser());
};

// --- Hierarchical Execution Pipeline ---

async function runHierarchicalAgentSystem(task) {
  console.log(`\n--- Running Hierarchical Multi-Agent System ---`);
  console.log(`Task: ${task}\n`);

  try {
    // Step 1: Coordinator plans the approach
    const coordinationPlan = await createCoordinatorAgent(task)(task);
    console.log('--- Coordinator Plan ---');
    console.log(coordationPlan);
    console.log();

    // Step 2: Researcher gathers information
    console.log('--- Researcher Agent Working ---');
    const topic = task; // In production, coordinator would extract this
    const researchData = await createResearcherAgent(topic)(topic);
    console.log('Research complete.\n');

    // Step 3: Analyst processes the research
    console.log('--- Analyst Agent Working ---');
    const analysis = await createAnalystAgent(researchData)(researchData);
    console.log('Analysis complete.\n');

    // Step 4: Writer creates final content
    console.log('--- Writer Agent Working ---');
    const finalContent = await createWriterAgent(analysis)(analysis);
    console.log('Content creation complete.\n');

    return finalContent;
  } catch (error) {
    console.error(`Error in hierarchical system: ${error}`);
    throw error;
  }
}

// Run the system
runHierarchicalAgentSystem('The impact of artificial intelligence on healthcare').then((result) => {
  console.log('\n--- Final Output ---\n');
  console.log(result);
});
```

### Collaborative Multi-Agent System

### 协作多智能体系统

This example demonstrates agents working together as peers, sharing information and coordinating efforts:

此示例展示智能体作为对等体一起工作，共享信息并协调工作：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableParallel } from '@langchain/core/runnables';

// --- Configuration ---
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

// --- Define Peer Agents ---

// Agent 1: Financial Expert
const financialAgent = async (query) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a Financial Expert. Provide insights from a financial perspective.
Consider: ROI, costs, revenue, market trends, investment opportunities.`,
    ],
    ['user', '{query}'],
  ]);

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ query });
};

// Agent 2: Technical Expert
const technicalAgent = async (query) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a Technical Expert. Provide insights from a technical perspective.
Consider: Feasibility, architecture, technology stack, implementation challenges.`,
    ],
    ['user', '{query}'],
  ]);

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ query });
};

// Agent 3: Legal Expert
const legalAgent = async (query) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a Legal Expert. Provide insights from a legal perspective.
Consider: Compliance, regulations, risks, contracts, intellectual property.`,
    ],
    ['user', '{query}'],
  ]);

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ query });
};

// --- Collaborative Execution (Parallel) ---

async function runCollaborativeAgents(query) {
  console.log(`\n--- Running Collaborative Multi-Agent System ---`);
  console.log(`Query: ${query}\n`);

  // Execute all agents in parallel (Fan-out)
  const parallelResults = await new RunnableParallel({
    financial: () => financialAgent(query),
    technical: () => technicalAgent(query),
    legal: () => legalAgent(query),
  }).invoke();

  console.log('--- All Expert Inputs Received ---');
  console.log('Financial:', parallelResults.financial.substring(0, 100) + '...');
  console.log('Technical:', parallelResults.technical.substring(0, 100) + '...');
  console.log('Legal:', parallelResults.legal.substring(0, 100) + '...');
  console.log();

  // Synthesize results (Fan-in)
  const synthesisPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a Project Manager synthesizing expert opinions.
Combine the following expert perspectives into a comprehensive recommendation.

**Financial Perspective:**
{financial}

**Technical Perspective:**
{technical}

**Legal Perspective:**
{legal}

Provide a balanced recommendation considering all perspectives.`,
    ],
    ['user', 'Please synthesize these expert opinions.'],
  ]);

  const synthesisChain = synthesisPrompt.pipe(llm).pipe(new StringOutputParser());
  const finalRecommendation = await synthesisChain.invoke(parallelResults);

  return finalRecommendation;
}

// Run the collaborative system
runCollaborativeAgents('Should we build a mobile app or a web app for our startup?').then(
  (result) => {
    console.log('\n--- Final Recommendation ---\n');
    console.log(result);
  },
);
```

### Competitive Multi-Agent System (Debate)

### 竞争多智能体系统（辩论）

This example shows agents debating to arrive at the best solution:

此示例展示智能体通过辩论来达成最佳解决方案：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// --- Configuration ---
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

// --- Define Debate Agents ---

// Pro Agent - Argues in favor
const createProAgent = (topic, context = '') => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are arguing IN FAVOR of: {topic}
Provide strong arguments supporting this position.
Previous context: {context}

Be persuasive, cite benefits, and address potential counterarguments.`,
    ],
    ['user', 'Present your strongest arguments.'],
  ]);

  return prompt.pipe(llm).pipe(new StringOutputParser());
};

// Con Agent - Argues against
const createConAgent = (topic, context = '') => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are arguing AGAINST: {topic}
Provide strong arguments opposing this position.
Previous context: {context}

Be persuasive, cite risks, and highlight potential problems.`,
    ],
    ['user', 'Present your strongest counterarguments.'],
  ]);

  return prompt.pipe(llm).pipe(new StringOutputParser());
};

// Judge Agent - Evaluates and decides
const createJudgeAgent = (topic, proArgs, conArgs) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a Judge evaluating arguments about: {topic}

**Arguments IN FAVOR:**
{pro}

**Arguments AGAINST:**
{con}

Evaluate both sides objectively and provide a final recommendation.
Consider: Strength of arguments, risks, benefits, and overall viability.`,
    ],
    ['user', 'What is your final decision?'],
  ]);

  return prompt.pipe(llm).pipe(new StringOutputParser());
};

// --- Debate Execution ---

async function runDebate(topic, rounds = 2) {
  console.log(`\n--- Running Debate: ${topic} ---`);
  console.log(`Rounds: ${rounds}\n`);

  let context = '';

  for (let round = 1; round <= rounds; round++) {
    console.log(`--- Round ${round} ---`);

    // Pro presents arguments
    const proArgs = await createProAgent(topic, context)('');
    console.log('Pro Arguments:', proArgs.substring(0, 200) + '...');

    // Con presents counterarguments
    const conArgs = await createConAgent(topic, context)('');
    console.log('\nCon Arguments:', conArgs.substring(0, 200) + '...');

    // Update context for next round
    context += `\nRound ${round} - Pro: ${proArgs}\nRound ${round} - Con: ${conArgs}\n`;
    console.log();
  }

  // Judge makes final decision
  console.log('--- Judge Making Decision ---');
  const finalDecision = await createJudgeAgent(topic, proArgs, conArgs)('');

  return finalDecision;
}

// Run the debate
runDebate('Should companies adopt a 4-day work week?', 2).then((decision) => {
  console.log('\n--- Final Decision ---\n');
  console.log(decision);
});
```

### State-Sharing Multi-Agent System

### 状态共享多智能体系统

This example demonstrates agents sharing state and working together:

此示例展示智能体共享状态并协同工作：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// --- Shared State ---
const sharedState = {
  context: {},
  results: {},
  messages: [],
};

// --- Define State-Managing Agents ---

// Manager Agent - Coordinates and maintains state
class ManagerAgent {
  constructor(name) {
    this.name = name;
    this.llm = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.7 });
  }

  async assignTask(agentName, task) {
    console.log(`\n[${this.name}] Assigning task to ${agentName}: ${task}`);
    sharedState.messages.push({
      from: this.name,
      to: agentName,
      task: task,
      timestamp: new Date().toISOString(),
    });
    return task;
  }

  async synthesizeResults() {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a Manager synthesizing results from your team.
Team Results:
{results}

Provide a comprehensive summary.`,
      ],
      ['user', 'Synthesize the team results.'],
    ]);

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());
    return chain.invoke({ results: JSON.stringify(sharedState.results) });
  }
}

// Worker Agent - Executes specific tasks
class WorkerAgent {
  constructor(name, specialty) {
    this.name = name;
    this.specialty = specialty;
    this.llm = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.7 });
  }

  async execute(task) {
    console.log(`\n[${this.name}] Executing: ${task}`);

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a ${this.specialty} specialist. Execute the given task efficiently.
Your specialty: ${this.specialty}`,
      ],
      ['user', '{task}'],
    ]);

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());
    const result = await chain.invoke({ task });

    // Store result in shared state
    sharedState.results[this.name] = result;
    sharedState.messages.push({
      agent: this.name,
      result: result,
      timestamp: new Date().toISOString(),
    });

    console.log(`[${this.name}] Completed: ${result.substring(0, 100)}...`);
    return result;
  }
}

// --- Execution ---

async function runMultiAgentSystem() {
  console.log('=== Starting Multi-Agent System with Shared State ===\n');

  // Create agents
  const manager = new ManagerAgent('ProjectManager');
  const worker1 = new WorkerAgent('DataCollector', 'data collection');
  const worker2 = new WorkerAgent('DataAnalyzer', 'data analysis');
  const worker3 = new WorkerAgent('ReportWriter', 'technical writing');

  // Manager assigns tasks
  await manager.assignTask('DataCollector', 'Collect information about renewable energy trends');
  await manager.assignTask('DataAnalyzer', 'Analyze the collected data for key trends');
  await manager.assignTask('ReportWriter', 'Write a comprehensive report on renewable energy');

  // Workers execute in parallel (simulated)
  const [dataResult, analysisResult, reportResult] = await Promise.all([
    worker1.execute('Research latest renewable energy technologies and market trends'),
    worker2.execute('Analyze the trends and identify opportunities'),
    worker3.execute('Create a professional report on renewable energy'),
  ]);

  // Manager synthesizes results
  console.log('\n--- Manager Synthesizing Results ---');
  const finalReport = await manager.synthesizeResults();

  console.log('\n=== Final Report ===');
  console.log(finalReport);

  console.log('\n=== Shared State Summary ===');
  console.log('Total messages:', sharedState.messages.length);
  console.log('Agents with results:', Object.keys(sharedState.results).join(', '));
}

// Run the system
runMultiAgentSystem();
```

### Key Takeaways

### 关键要点

- **Multi-agent systems** enable complex tasks to be handled by specialized agents working together.

- **多智能体系统**使复杂任务能够由协同工作的专业智能体处理。

- **Hierarchical** architecture uses a central coordinator to manage sub-agents.

- **分层**架构使用中央协调器管理子智能体。

- **Collaborative** architecture has agents working as peers, sharing information.

- **协作**架构让智能体作为对等体工作，共享信息。

- **Competitive** architecture (debate) helps explore different perspectives.

- **竞争**架构（辩论）有助于探索不同观点。

- Communication protocols and shared state are essential for effective multi-agent coordination.

- 通信协议和共享状态对于有效的多智能体协调至关重要。

- LangChain provides building blocks for creating sophisticated multi-agent systems.

- LangChain 为创建复杂的多智能体系统提供了构建块。

### 投资智能体

根据文档《Architecting Multi-Agent Collaboration Patterns》（第7章），当面对投资这种复杂、多领域的任务时，单体智能体的能力往往会受到限制。为了解决这个问题，系统会采用**多智能体协作（Multi-Agent Collaboration）**模式，其核心原则是**任务分解（Task decomposition）**，即将一个高级投资目标拆解为离散的子问题，分配给拥有特定工具和专长的不同智能体。

在构建一个投资智能体系统时，通常会采用**“专家团队（Expert Teams）”**的协作形式来进行划分。一个完整的投资多智能体系统可以划分如下：

#### 1. 核心智能体角色划分 (专家团队)

- **数据获取与研究智能体 (Data Fetching / Research Agent)**
  - **职责**：专门负责信息检索和基础数据的收集。它负责获取实时股票数据、扫描学术/金融数据库，或者抓取公司的财务报表。
- **情绪分析智能体 (Sentiment Analysis Agent)**
  - **职责**：专注于分析非结构化数据，如读取市场新闻、社交媒体舆情，从而判断市场情绪是贪婪还是恐慌。
- **技术与量化分析智能体 (Technical Analysis Agent)**
  - **职责**：负责统计处理和技术指标的计算。它专门分析K线图、均线、交易量等数据，提供纯量化视角的见解。
- **策略与综合智能体 (Strategy / Synthesis Agent)**
  - **职责**：类似于基金经理。它接收前面数据、情绪、技术三个智能体的输出，将分散的信息综合起来，生成最终的投资建议或研究报告。
- **风控与合规审查智能体 (Risk & Compliance Reviewer Agent)**
  - **职责**：采用**批评者-审查者（Critic-Reviewer）**模式。在策略智能体提出买卖计划后，该智能体负责批判性地评估该输出是否符合投资政策、风险承受度以及合规性。这能大幅提高系统的鲁棒性，减少因幻觉或错误导致的财务风险。

#### 2. 它们之间如何协作？(通信结构)

这些划分出的智能体不是孤立的，它们需要通过特定的通信结构来协同工作：

- **层级结构 / 监督者模式 (Hierarchical / Supervisor)**：
  可以设置一个“主控/监督者智能体（Supervisor）”。它接收用户的指令（例如：“帮我分析最近的科技股”），然后动态地将数据收集任务委派给“研究智能体”，将计算任务委派给“量化智能体”，最后由监督者综合它们的结果。
- **并行处理 (Parallel Processing)**：
  在信息收集阶段，研究智能体、情绪分析智能体和量化分析智能体可以**同时工作**处理问题的不同部分，之后再将结果合并，从而极大提高效率。
- **辩论与共识 (Debate and Consensus)**：
  具有不同信息来源和视角的智能体（例如看多基本面的智能体和看空技术面的智能体）可以进行讨论以评估投资选项，最终达成共识或做出更明智的决策。
- **顺序交接 (Sequential Handoffs)**：
  在执行阶段，一个智能体（策略）完成投资计划，然后将其输出传递给下一个智能体（风控），风控通过后再传递给最终的执行智能体。

通过这种精细的划分和协作，整个多智能体系统的**集体性能将远超任何单个智能体的潜在能力**，从而能够胜任复杂、高风险的金融市场分析。

### Investment Agent: Expert Teams Collaboration

### 投资智能体：专家团队协作模式

This example demonstrates the "Expert Teams" pattern where specialized agents collaborate with defined roles.

此示例展示"专家团队"模式，专业智能体按定义的角色协作。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// --- Configuration ---
const researchLLM = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });
const synthesisLLM = new ChatOpenAI({ model: "gpt-4o", temperature: 0.3 });

// --- 1. Data Fetching / Research Agent ---
class ResearchAgent {
  async analyze(query) {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a Data Research Agent. Gather comprehensive financial data for: {query}

Provide: stock prices, financial, and metrics, earnings data key fundamentals.`],
      ["user", "Research:"],
    ]);
    const chain = prompt.pipe(researchLLM).pipe(new StringOutputParser());
    return chain.invoke({ query });
  }
}

// --- 2. Sentiment Analysis Agent ---
class SentimentAgent {
  async analyze(query) {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a Sentiment Analysis Agent. Analyze market sentiment for: {query}

Include: news sentiment, social media trends, analyst ratings, investor behavior.`],
      ["user", "Analyze sentiment:"],
    ]);
    const chain = prompt.pipe(researchLLM).pipe(new StringOutputParser());
    return chain.invoke({ query });
  }
}

// --- 3. Technical Analysis Agent ---
class TechnicalAgent {
  async analyze(query) {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a Technical Analysis Agent. Provide technical insights for: {query}

Include: price trends, support/resistance levels, RSI, MACD, volume analysis.`],
      ["user", "Technical analysis:"],
    ]);
    const chain = prompt.pipe(researchLLM).pipe(new StringOutputParser());
    return chain.invoke({ query });
  }
}

// --- 4. Strategy / Synthesis Agent ---
class StrategyAgent {
  async synthesize(data, sentiment, technical) {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a Strategy Agent (Portfolio Manager). Synthesize all inputs into an investment recommendation.

**Fundamental Data:**
{data}

**Sentiment Analysis:**
{sentiment}

**Technical Analysis:**
{technical}

Provide:
1. Investment Rating (BUY/SELL/HOLD)
2. Target Price
3. Key Reasons
4. Risk Factors`],
      ["user", "Generate strategy:"],
    ]);
    const chain = prompt.pipe(synthesisLLM).pipe(new StringOutputParser());
    return chain.invoke({ data, sentiment, technical });
  }
}

// --- 5. Risk & Compliance Reviewer Agent ---
class RiskReviewAgent {
  async review(strategy) {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a Risk & Compliance Reviewer Agent. Critically evaluate this investment strategy.

**Proposed Strategy:**
{strategy}

Evaluate:
1. Risk level (1-10)
2. Compliance with investment policy
3. Potential red flags
4. Is this approved or rejected?`],
      ["user", "Review risk:"],
    ]);
    const chain = prompt.pipe(synthesisLLM).pipe(new StringOutputParser());
    return chain.invoke({ strategy });
  }
}

// --- Expert Teams Execution ---
async function runExpertTeams(symbol) {
  console.log(`\n=== Running Expert Teams for ${symbol} ===`);

  // Create expert agents
  const researchAgent = new ResearchAgent();
  const sentimentAgent = new SentimentAgent();
  const technicalAgent = new TechnicalAgent();
  const strategyAgent = new StrategyAgent();
  const riskAgent = new RiskReviewAgent();

  // Execute research
  console.log("\n[Research Agent] Gathering data...");
  const data = await researchAgent.analyze(symbol);

  console.log("\n[Sentiment Agent] Analyzing sentiment...");
  const sentiment = await sentimentAgent.analyze(symbol);

  console.log("\n[Technical Agent] Technical analysis...");
  const technical = await technicalAgent.analyze(symbol);

  // Strategy synthesis
  console.log("\n[Strategy Agent] Synthesizing recommendation...");
  const strategy = await strategyAgent.synthesize(data, sentiment, technical);
  console.log("Strategy:", strategy.substring(0, 200), "...");

  // Risk review
  console.log("\n[Risk Review Agent] Evaluating...");
  const riskReview = await riskAgent.review(strategy);
  console.log("Risk Review:", riskReview);

  return { data, sentiment, technical, strategy, riskReview };
}

runExpertTeams("TSLA");
```

### Investment Agent: Hierarchical Supervisor Pattern

### 投资智能体：层级监督者模式

This example demonstrates the Hierarchical/Supervisor pattern where a central coordinator delegates tasks.

此示例展示层级/监督者模式，中央协调器委派任务。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });

// --- Supervisor Agent ---
class SupervisorAgent {
  async delegate(task) {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a Supervisor Agent. Your job is to delegate user tasks to the right specialist agents.

User Task: {task}

Available Specialists:
- ResearchAgent: For data gathering and research
- SentimentAgent: For market sentiment analysis
- TechnicalAgent: For technical analysis
- StrategyAgent: For investment strategy synthesis

Determine which agents are needed and in what order. Return a delegation plan.`],
      ["user", "Delegate:"],
    ]);
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    return chain.invoke({ task });
  }
}

// --- Specialist Agents ---
const agents = {
  research: async (query) => "Research: Gathered fundamentals, earnings, financial metrics...",
  sentiment: async (query) => "Sentiment: Market is bullish, positive news flow...",
  technical: async (query) => "Technical: Stock in uptrend, RSI at 65...",
  strategy: async (data) => "Strategy: BUY rating, target price $300...",
};

// --- Hierarchical Execution ---
async function runSupervisorSystem(userQuery) {
  console.log(`\n=== Supervisor System ===`);
  console.log("User Query:", userQuery);

  // Supervisor delegates
  console.log("\n[Supervisor] Delegating tasks...");
  const supervisor = new SupervisorAgent();
  const delegation = await supervisor.delegate(userQuery);
  console.log("Delegation Plan:", delegation);

  // Execute based on delegation
  console.log("\n[Execution] Running specialist agents...");

  // Parallel execution of independent tasks
  const [research, sentiment, technical] = await Promise.all([
    agents.research(userQuery),
    agents.sentiment(userQuery),
    agents.technical(userQuery),
  ]);

  // Strategy synthesis
  const strategy = await agents.strategy({ research, sentiment, technical });

  console.log("\n=== Final Result ===");
  console.log(strategy);

  return strategy;
}

runSupervisorSystem("Analyze TSLA for potential investment");
```

### Investment Agent: Parallel Processing Collaboration

### 投资智能体：并行处理协作模式

This example demonstrates parallel processing where agents work simultaneously on different aspects.

此示例展示并行处理，智能体同时处理不同方面。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });

// --- Specialized Analysis Agents ---

// Parallel agents for information gathering
const fundamentalAnalysis = async (symbol) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `Analyze fundamentals for {symbol}. Include: P/E, revenue, margins.`],
    ["user", "Fundamental analysis:"],
  ]);
  return prompt.pipe(llm).pipe(new StringOutputParser()).invoke({ symbol });
};

const sentimentAnalysis = async (symbol) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `Analyze sentiment for {symbol}. Include: news, social, analyst views.`],
    ["user", "Sentiment analysis:"],
  ]);
  return prompt.pipe(llm).pipe(new StringOutputParser()).invoke({ symbol });
};

const technicalAnalysis = async (symbol) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `Technical analysis for {symbol}. Include: trends, indicators, levels.`],
    ["user", "Technical analysis:"],
  ]);
  return prompt.pipe(llm).pipe(new StringOutputParser()).invoke({ symbol });
};

// --- Parallel Execution (Fan-out) ---
async function parallelAnalysis(symbol) {
  console.log(`\n=== Parallel Processing for ${symbol} ===`);

  // All three agents work in parallel
  const parallelResults = await new RunnableParallel({
    fundamentals: () => fundamentalAnalysis(symbol),
    sentiment: () => sentimentAnalysis(symbol),
    technical: () => technicalAnalysis(symbol),
  }).invoke();

  console.log("\n[Parallel Agents] All analyses complete!");
  console.log("- Fundamentals:", parallelResults.fundamentals.substring(0, 100));
  console.log("- Sentiment:", parallelResults.sentiment.substring(0, 100));
  console.log("- Technical:", parallelResults.technical.substring(0, 100));

  return parallelResults;
}

// --- Fan-in: Synthesis ---
async function synthesizeResults(results) {
  const synthesisPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an Investment Strategist. Combine all analyses into a recommendation.

**Fundamentals:** {fundamentals}
**Sentiment:** {sentiment}
**Technical:** {technical}

Provide final investment recommendation.`],
    ["user", "Synthesize:"],
  ]);

  const chain = synthesisPrompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke(results);
}

// --- Full Pipeline ---
async function runParallelCollaboration(symbol) {
  // Fan-out: Parallel processing
  const results = await parallelAnalysis(symbol);

  // Fan-in: Synthesis
  console.log("\n[Synthesis] Combining results...");
  const recommendation = await synthesizeResults(results);

  console.log("\n=== Final Recommendation ===");
  console.log(recommendation);
}

runParallelCollaboration("AAPL");
```

### Investment Agent: Debate and Consensus Pattern

### 投资智能体：辩论与共识模式

This example demonstrates Debate and Consensus where agents with different perspectives discuss and reach agreement.

此示例展示辩论与共识，不同视角的智能体讨论并达成一致。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0.7 });

// --- Debate Agents with Different Perspectives ---

// Bullish Fundamental Analyst
const bullishAgent = async (symbol, context = "") => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Bullish Fundamental Analyst.
Argue IN FAVOR of buying {symbol}.

Consider: Strong fundamentals, growth potential, competitive advantages.
Previous arguments: {context}

Provide compelling bullish arguments.`],
    ["user", "Bullish case:"],
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ symbol, context });
};

// Bearish Technical Analyst
const bearishAgent = async (symbol, context = "") => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Bearish Technical Analyst.
Argue AGAINST buying {symbol}.

Consider: Overbought indicators, negative technical signals, resistance levels.
Previous arguments: {context}

Provide compelling bearish arguments.`],
    ["user", "Bearish case:"],
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ symbol, context });
};

// Neutral Judge / Consensus Builder
const judgeAgent = async (symbol, bullishArgs, bearishArgs) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Judge Agent. Evaluate arguments and reach consensus for {symbol}.

**Bullish Arguments:**
{bullish}

**Bearish Arguments:**
{bearish}

Weigh both sides and provide:
1. Final consensus recommendation
2. Confidence level
3. Key reasoning`],
    ["user", "Reach consensus:"],
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ symbol, bullish: bullishArgs, bearish: bearishArgs });
};

// --- Debate Execution ---
async function runDebateConsensus(symbol, rounds = 2) {
  console.log(`\n=== Debate & Consensus for ${symbol} ===`);

  let context = "";

  for (let round = 1; round <= rounds; round++) {
    console.log(`\n--- Round ${round} ---`);

    // Both sides present arguments in parallel
    const [bullishArgs, bearishArgs] = await Promise.all([
      bullishAgent(symbol, context),
      bearishAgent(symbol, context),
    ]);

    console.log("\n[Bullish]:", bullishArgs.substring(0, 150));
    console.log("\n[Bearish]:", bearishArgs.substring(0, 150));

    // Update context
    context += `\nRound ${round} - Bullish: ${bullishArgs}\nBearish: ${bearishArgs}\n`;
  }

  // Final consensus
  console.log("\n=== Reaching Consensus ===");
  const finalArgs = await Promise.all([
    bullishAgent(symbol, context),
    bearishAgent(symbol, context),
  ]);

  const consensus = await judgeAgent(symbol, finalArgs[0], finalArgs[1]);

  console.log("\n=== Final Consensus ===");
  console.log(consensus);

  return consensus;
}

runDebateConsensus("TSLA", 2);
```

### Investment Agent: Sequential Handoffs Pattern

### 投资智能体：顺序交接模式

This example demonstrates Sequential Handoffs where one agent passes results to the next in sequence.

此示例展示顺序交接，一个智能体将结果顺序传递给下一个。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });

// --- Sequential Pipeline Agents ---

// Step 1: Data Collection Agent
class DataCollectionAgent {
  async execute(symbol) {
    console.log("\n[Step 1] Data Collection Agent: Gathering data...");
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `Gather financial data for {symbol}: stock price, P/E, revenue, earnings.`],
      ["user", "Collect data:"],
    ]);
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    const result = await chain.invoke({ symbol });
    console.log("[Step 1] Complete");
    return { data: result, symbol };
  }
}

// Step 2: Analysis Agent
class AnalysisAgent {
  async execute(input) {
    console.log("\n[Step 2] Analysis Agent: Analyzing data...");
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `Analyze this financial data for {symbol}:

{data}

Provide: key findings, ratios, and initial assessment.`],
      ["user", "Analyze:"],
    ]);
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    const result = await chain.invoke({ symbol: input.symbol, data: input.data });
    console.log("[Step 2] Complete");
    return { ...input, analysis: result };
  }
}

// Step 3: Strategy Agent
class StrategyAgent {
  async execute(input) {
    console.log("\n[Step 3] Strategy Agent: Developing strategy...");
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `Based on analysis for {symbol}:

**Data:** {data}
**Analysis:** {analysis}

Create investment strategy with: rating, target price, rationale.`],
      ["user", "Create strategy:"],
    ]);
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    const result = await chain.invoke({
      symbol: input.symbol,
      data: input.data,
      analysis: input.analysis,
    });
    console.log("[Step 3] Complete");
    return { ...input, strategy: result };
  }
}

// Step 4: Risk Review Agent
class RiskReviewAgent {
  async execute(input) {
    console.log("\n[Step 4] Risk Review Agent: Checking compliance...");
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `Review this investment strategy for {symbol}:

**Strategy:** {strategy}

Evaluate: risk level, compliance, approval/rejection.`],
      ["user", "Review risk:"],
    ]);
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    const result = await chain.invoke({ symbol: input.symbol, strategy: input.strategy });
    console.log("[Step 4] Complete");
    return { ...input, riskReview: result };
  }
}

// Step 5: Execution Agent
class ExecutionAgent {
  async execute(input) {
    console.log("\n[Step 5] Execution Agent: Finalizing...");
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `Prepare final investment memo for {symbol}:

**Data:** {data}
**Analysis:** {analysis}
**Strategy:** {strategy}
**Risk Review:** {riskReview}

Create final execution memo with all details.`],
      ["user", "Execute:"],
    ]);
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    const result = await chain.invoke({
      symbol: input.symbol,
      data: input.data,
      analysis: input.analysis,
      strategy: input.strategy,
      riskReview: input.riskReview,
    });
    console.log("[Step 5] Complete");
    return { ...input, execution: result };
  }
}

// --- Sequential Handoff Execution ---
async function runSequentialHandoffs(symbol) {
  console.log(`\n========================================`);
  console.log(`Starting Sequential Pipeline for ${symbol}`);
  console.log(`========================================`);

  // Create pipeline agents
  const dataAgent = new DataCollectionAgent();
  const analysisAgent = new AnalysisAgent();
  const strategyAgent = new StrategyAgent();
  const riskAgent = new RiskReviewAgent();
  const executionAgent = new ExecutionAgent();

  // Sequential execution with handoffs
  let result = await dataAgent.execute(symbol);
  result = await analysisAgent.execute(result);
  result = await strategyAgent.execute(result);
  result = await riskAgent.execute(result);
  result = await executionAgent.execute(result);

  console.log("\n========================================");
  console.log("Pipeline Complete!");
  console.log("========================================");
  console.log("\nFinal Execution Memo:");
  console.log(result.execution);

  return result;
}

runSequentialHandoffs("NVDA");
```

---

## 社区热议与实践分享

多智能体模式已成为 2025-2026 年 AI 社区中讨论最为热烈的话题之一。据 Gartner 统计，从 2024 年第一季度到 2025 年第二季度，多智能体系统相关咨询量激增了 **1,445%**，这一惊人数字标志着行业对系统设计方式的根本性转变。以下是来自行业领袖和社区的关键洞察。

### 行业领袖观点

**Andrew Ng（吴恩达）— 多智能体协作是关键设计模式**

吴恩达在其广受关注的 [推文](https://x.com/AndrewYNg/status/1780991671855161506) 中明确指出：

> "Multi-agent collaboration has emerged as a key AI agentic design pattern. Given a complex task like writing software, a multi-agent approach would break down the task into subtasks to be executed by different roles — such as a software engineer, product manager, designer, QA engineer."

他进一步解释了多智能体模式有效的三个核心原因：
1. 消融研究（如 AutoGen 论文）证实多智能体性能优于单智能体
2. 即便 LLM 支持超长上下文，对复杂输入的理解能力仍参差不齐；智能体工作流让模型一次聚焦一件事，从而提高表现
3. 多智能体设计模式为开发者提供了将复杂任务分解为子任务的思维框架

吴恩达还与 CrewAI 合作推出了 ["Practical Multi AI Agents and Advanced Use Cases"](https://x.com/AndrewYNg/status/1849112129904738656) 课程，并公开披露了他对 CrewAI 的种子投资——这体现了他对多智能体框架商业前景的信心。

**Andrej Karpathy — "这是智能体的十年"**

OpenAI 联合创始人 Karpathy 在 2025 年提出了颇具影响力的观点。当业界纷纷宣称这是"智能体之年"时，他冷静地 [纠正](https://karpathy.ai/) 道：这更准确地说是**"智能体的十年"（the decade of agents）**。他坦承："AI 智能体目前还不够好用。它们的多模态能力不足，缺乏记忆，无法有效规划——大约需要十年才能真正成熟。"

然而在 2025 年 12 月 27 日的 [长推文](https://blockchain.news/ainews/andrej-karpathy-hints-at-post-agi-experience-analysis-of-autonomous-ai-systems-and-2026-trends) 中，他承认编码智能体已跨越质变门槛——从脆弱的演示进化到持续、长周期的任务完成能力。这种务实而审慎的态度引发了广泛共鸣。

**Harrison Chase（LangChain CEO）— "深度智能体"概念**

LangChain 创始人 Harrison Chase 在 [ODSC AI West 2025 大会](https://opendatascience.com/harrison-chase-on-deep-agents-the-next-evolution-in-autonomous-ai/) 上提出了"深度智能体（Deep Agents）"概念。他指出，智能体的核心循环架构（调用 LLM → 决定行动 → 执行工具 → 重复）并未改变，真正变化的是围绕该循环的复杂度——规划、上下文管理、记忆、子智能体和更丰富的提示工程。他将子智能体描述为**"模块化认知单元"**，每个子智能体拥有独立的上下文和工具，避免主智能体的混淆和 token 膨胀。

**Yohei Nakajima（BabyAGI 创始人）— 从任务驱动到自我改进**

BabyAGI 的创造者 Yohei Nakajima 在 2025 年持续探索智能体前沿。他在 [博客](https://yoheinakajima.com/better-ways-to-build-self-improving-ai-agents/) 中分享了"构建自我改进型 AI 智能体的更好方法"，并密切关注 [A2A 协议](https://yoheinakajima.com/) 和 MCP 客户端的发展趋势。他通过对 X 平台上相关推文的自动化分析，持续追踪社区对多智能体协作的讨论脉络。

### 框架生态演进

2025-2026 年的多智能体框架格局经历了深刻变革，形成了"四强争霸"的局面：

| 框架 | 核心特色 | 最新进展 |
|------|----------|----------|
| **CrewAI** | 基于角色的轻量级多智能体编排 | 超过 10 万开发者获得认证；60% 的 Fortune 500 公司使用；获得 1800 万美元 A 轮融资 |
| **AutoGen** | 对话模式驱动的多智能体协作 | v0.4 引入异步消息传递；与 Semantic Kernel 合并为统一智能体框架 |
| **LangGraph** | 图结构智能体编排 | 2025 年 5 月 GA 发布；近 400 家公司生产环境使用 |
| **OpenAI Agents SDK** | 从 Swarm 进化的生产级方案 | 取代实验性 Swarm 框架；提供生产就绪的多智能体编排 |

社区中流传着一个简洁的选择指南：**如果你的工作流像流程图（有循环），选 LangGraph；如果像对话线程，选 AutoGen；如果像工作分配表（谁做什么、什么顺序），选 CrewAI。**

### 协议标准化：MCP 与 A2A

2025 年最具影响力的发展之一是智能体通信协议的标准化：

- **Anthropic MCP（Model Context Protocol）**：自 2024 年 11 月发布以来迅速走红，Python 和 TypeScript SDK 月下载量超过 **9700 万次**。2025 年 12 月，Anthropic 将 MCP 捐赠给 Linux 基金会新成立的 Agentic AI Foundation（AAIF），OpenAI 和 Google 均为白金成员。MCP 专注于解决**单个智能体如何连接工具和数据**的问题。

- **Google A2A（Agent-to-Agent Protocol）**：2025 年 4 月在 Google Cloud Next 大会发布，获得 Atlassian、Salesforce、SAP 等 50 多家技术合作伙伴支持。A2A 解决的是**智能体之间如何互相通信和协作**的问题。

社区共识是：**MCP 和 A2A 不是竞争关系，而是互补标准**。MCP 赋能单个智能体的工具接入（纵向），A2A 实现智能体间的发现与协作（横向）——二者共同构成多智能体互操作生态的基础。

### 生产环境现状

根据 LangChain 发布的 [State of Agent Engineering](https://www.langchain.com/state-of-agent-engineering) 报告（基于 2025 年 11-12 月间 1,340 份问卷）：

- **57.3%** 的受访者已在生产环境运行智能体，另有 30.4% 正在积极开发
- **89%** 的组织已为智能体实施可观测性方案，71.5% 具备完整的追踪能力
- **质量**是头号生产障碍（32% 引用），而成本担忧相比去年有所下降
- 超过 **75%** 的团队在生产中使用多个模型，根据复杂度、成本和延迟灵活路由

### 社区热门讨论话题

**"单一超级智能体 vs. 多智能体协作"之争**

这是社区中持续最久的辩论。一方认为模型能力的提升将使单一全能智能体成为可能；另一方则坚持多智能体架构在复杂任务上的固有优势。业界的共识逐渐明朗：

> "你终将触及单一智能体能力的天花板，然后不得不回归多智能体协作。你会在多智能体框架和单一神级智能体之间来回推拉。"

**"Agentic Mesh" — 2026 年的新趋势**

社区中出现了"智能体网格（Agentic Mesh）"的概念：未来不再是选择单一框架，而是构建模块化生态——一个 LangGraph "大脑"可以编排一个 CrewAI "营销团队"，同时调用 OpenAI 专用工具处理快速子任务。这标志着多智能体架构正从"选择框架"走向**"编排生态"**。

---

### Conclusion

### 结论

The multi-agent pattern enables the creation of sophisticated systems where specialized agents collaborate, compete, or coordinate to solve complex problems.

多智能体模式能够创建复杂的系统，其中专业智能体协作、竞争或协调以解决复杂问题。

By leveraging the strengths of multiple agents, each with their own expertise and responsibilities, these systems can achieve capabilities beyond what any single agent could accomplish.

通过利用多个智能体各自的专业知识和职责，这些系统可以实现任何单个智能体无法达到的能力。

When designing multi-agent systems, careful consideration should be given to communication protocols, state management, and the coordination mechanisms that bind the agents together.

在设计多智能体系统时，应仔细考虑通信协议、状态管理以及将智能体绑定在一起的协调机制。

---

## 参考资源

### 行业报告与研究

- [LangChain: State of Agent Engineering 2025](https://www.langchain.com/state-of-agent-engineering) — 基于 1,340 份问卷的智能体工程现状全景报告
- [Gartner: 40% of Enterprise Applications Will Embed AI Agents by 2026](https://machinelearningmastery.com/7-agentic-ai-trends-to-watch-in-2026/) — 企业智能体应用趋势预测
- [IBM: AI Agents in 2025 — Expectations vs. Reality](https://www.ibm.com/think/insights/ai-agents-2025-expectations-vs-reality) — 对智能体落地现实的冷静分析
- [Multi-AI Agents Systems in 2025: Key Insights, Examples, and Challenges](https://ioni.ai/post/multi-ai-agents-in-2025-key-insights-examples-and-challenges) — 多智能体系统综合洞察

### 多智能体框架

- [CrewAI](https://crewai.com/) — 基于角色的轻量级多智能体编排平台
- [Microsoft AutoGen](https://github.com/microsoft/autogen) — 对话驱动的多智能体协作框架
- [LangGraph](https://www.langchain.com/) — 图结构智能体编排工具（LangChain 生态）
- [OpenAI Agents SDK](https://github.com/openai/swarm) — 从 Swarm 进化的生产级多智能体方案
- [框架对比: CrewAI vs AutoGen vs LangGraph (2026)](https://www.secondtalent.com/resources/crewai-vs-autogen-usage-performance-features-and-popularity-in/) — 主流框架横向评测

### 协议与标准

- [Anthropic MCP (Model Context Protocol)](https://www.gravitee.io/blog/googles-agent-to-agent-a2a-and-anthropics-model-context-protocol-mcp) — 智能体工具接入标准协议
- [Google A2A (Agent-to-Agent Protocol)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) — 智能体间通信开放协议
- [MCP vs A2A 深度对比](https://www.clarifai.com/blog/mcp-vs-a2a-clearly-explained) — 两大协议的互补关系解析
- [A2A and MCP: Start of the AI Agent Protocol Wars?](https://www.koyeb.com/blog/a2a-and-mcp-start-of-the-ai-agent-protocol-wars) — 协议生态竞争分析

### 学术研究

- [AAAI 2025 Workshop: Advancing LLM-Based Multi-Agent Collaboration](https://multiagents.org/2025-cfp/) — 多智能体协作前沿学术研讨
- [WMAC 2026: AAAI Bridge Program on Multi-Agent Collaboration](https://multiagents.org/workshop/) — 2026 年多智能体协作研究项目
- [Awesome Agent Papers (GitHub)](https://github.com/luo-junyu/Awesome-Agent-Papers) — LLM 智能体论文持续更新合集
- [arXiv: Multiagent Systems](https://arxiv.org/list/cs.MA/current) — 多智能体系统最新论文

### 行业领袖社交媒体

- [Andrew Ng: 多智能体协作设计模式](https://x.com/AndrewYNg/status/1780991671855161506) — 关于多智能体作为关键设计模式的系统阐述
- [Andrew Ng: Agentic AI 课程](https://x.com/AndrewYNg/status/1975614372799283423) — 覆盖四大智能体设计模式的实战课程
- [Harrison Chase: Deep Agents 演讲](https://opendatascience.com/harrison-chase-on-deep-agents-the-next-evolution-in-autonomous-ai/) — LangChain CEO 关于"深度智能体"的前沿思考
- [Yohei Nakajima: 自我改进型 AI 智能体](https://yoheinakajima.com/better-ways-to-build-self-improving-ai-agents/) — BabyAGI 创始人的智能体构建方法论

### 框架选型与实战指南

- [8 Best Multi-Agent AI Frameworks for 2026](https://www.multimodal.dev/post/best-multi-agent-ai-frameworks) — 2026 年最佳多智能体框架盘点
- [Multi-Agent Frameworks Explained for Enterprise AI Systems](https://www.adopt.ai/blog/multi-agent-frameworks) — 企业级多智能体框架深度解读
- [The Great AI Agent Showdown of 2026](https://topuzas.medium.com/the-great-ai-agent-showdown-of-2026-openai-autogen-crewai-or-langgraph-7b27a176b2a1) — OpenAI vs AutoGen vs CrewAI vs LangGraph 全面对比
- [World Economic Forum: Rethinking UX in Multi-Agent AI](https://www.weforum.org/stories/2025/08/rethinking-the-user-experience-in-the-age-of-multi-agent-ai/) — 世界经济论坛对多智能体用户体验的思考
