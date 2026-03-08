---
title: 'Chapter 6: Planning'
date: '2025-12-25'
excerpt: 'While individual tool uses and reflections are valuable, complex tasks often require an agent to develop a multi-step plan before execution.'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 6: Planning

# 第六章：规划

## Planning Pattern Overview

## 规划模式概述

While individual tool uses and reflections are valuable, complex tasks often require an agent to develop a multi-step plan before execution.

虽然单独的智能体工具使用和反思很有价值，但复杂任务通常需要智能体在执行之前制定多步计划。

The planning pattern enables agents to think ahead, breaking down complex objectives into manageable steps and sequencing them appropriately.

规划模式使智能体能够前瞻性地思考，将复杂目标分解为可管理的步骤并适当地排序。

This capability is essential for agents that need to handle complex, multi-faceted tasks that cannot be accomplished in a single step.

这种能力对于需要处理无法一步完成的复杂、多方面任务的智能体至关重要。

### How Planning Works

### 规划如何工作

The planning process typically involves:

规划过程通常涉及：

1. **Goal Decomposition**: Breaking down the overall objective into smaller sub-goals.

1. **目标分解**: 将整体目标分解为更小的子目标。

1. **Step Identification**: Determining the specific actions needed to achieve each sub-goal.

1. **步骤识别**: 确定实现每个子目标所需的具体操作。

1. **Sequencing**: Ordering the steps in a logical sequence.

1. **排序**: 按逻辑顺序排列步骤。

1. **Dependency Analysis**: Understanding which steps depend on others.

1. **依赖性分析**: 了解哪些步骤依赖于其他步骤。

1. **Plan Refinement**: Reviewing and improving the plan based on feedback.

1. **计划改进**: 根据反馈审查和改进计划。

### Types of Planning

### 规划的类型

**Static Planning**: The agent creates a complete plan upfront and then executes it step by step.

**静态规划**: 智能体预先创建完整计划，然后逐步执行。

This approach is straightforward but can be inflexible if unexpected issues arise.

这种方法简单，但如果出现意外问题可能不够灵活。

**Dynamic Planning**: The agent creates an initial plan but adapts it as it executes, based on the results of each step.

**动态规划**: 智能体创建初始计划，但在执行时根据每个步骤的结果进行适应。

This approach is more robust but also more complex to implement.

这种方法更健壮，但也更复杂。

**Hierarchical Planning**: The agent creates plans at multiple levels of abstraction, from high-level objectives to detailed action sequences.

**分层规划**: 智能体在多个抽象层次创建计划，从高级目标到详细的动作序列。

### Hands-On Code Example

## 实践代码示例

### 1. Static Planning (静态规划)

以下代码实现了静态规划模式，智能体首先创建一个完整的计划，然后逐步执行：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Step 1: Create the plan
const planPrompt = ChatPromptTemplate.fromTemplate(
  `Create a step-by-step plan for: {task}

Break down the task into numbered steps. Each step should be specific and actionable.`,
);

// Step 2: Execute each step
const executePrompt = ChatPromptTemplate.fromTemplate(
  `You are executing step {stepNumber} of a plan.

Plan:
{plan}

Current step: {currentStep}

Execute this step and provide the result:`,
);

// Create plan chain
const planChain = planPrompt.pipe(llm).pipe(new StringOutputParser());
const executeChain = executePrompt.pipe(llm).pipe(new StringOutputParser());

// Static planning function
async function staticPlanning(task) {
  console.log('Creating plan...');
  const plan = await planChain.invoke({ task });

  // Parse plan into steps (simple splitting by newlines/numbers)
  const steps = plan.split('\n').filter((s) => s.trim().length > 0);

  console.log(`Executing ${steps.length} steps...`);
  const results = [];

  for (let i = 0; i < steps.length; i++) {
    console.log(`Executing step ${i + 1}...`);
    const result = await executeChain.invoke({
      stepNumber: i + 1,
      plan: plan,
      currentStep: steps[i],
    });
    results.push({ step: steps[i], result });
  }

  return { plan, results };
}

// Usage
const task = 'Plan a birthday party for 10 people';
const result = await staticPlanning(task);
console.log('Plan:', result.plan);
console.log('Results:', result.results);
```

### 2. Dynamic Planning (动态规划)

以下代码实现了动态规划模式，智能体在执行过程中根据每步结果调整计划：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Initial plan creation
const initialPlanPrompt = ChatPromptTemplate.fromTemplate(
  `Create an initial plan for: {task}

Break down into 3-5 main steps.`,
);

// Re-planning based on previous results
const replanPrompt = ChatPromptTemplate.fromTemplate(
  `You are dynamically adjusting a plan based on execution results.

Original task: {task}
Current plan progress:
{history}

Latest result: {latestResult}

Should the plan change? If yes, explain what to modify and provide the updated next steps. If no, simply state the next step to execute.`,
);

// Execute step
const executePrompt = ChatPromptTemplate.fromTemplate(
  `Execute this step: {step}

Provide your result:`,
);

const initialPlanChain = initialPlanPrompt.pipe(llm).pipe(new StringOutputParser());
const replanChain = replanPrompt.pipe(llm).pipe(new StringOutputParser());
const executeChain = executePrompt.pipe(llm).pipe(new StringOutputParser());

// Dynamic planning function
async function dynamicPlanning(task, maxIterations = 5) {
  console.log('Creating initial plan...');

  let currentPlan = await initialPlanChain.invoke({ task });
  let history = [];
  let shouldContinue = true;
  let iteration = 0;

  while (shouldContinue && iteration < maxIterations) {
    iteration++;
    console.log(`\n--- Iteration ${iteration} ---`);

    // Decide next step (simplified - just take first line)
    const nextStep = currentPlan.split('\n')[0];
    console.log('Executing:', nextStep);

    const result = await executeChain.invoke({ step: nextStep });
    history.push({ step: nextStep, result });

    // Check if we need to replan
    const feedback = await replanChain.invoke({
      task,
      history: history.map((h) => `${h.step}: ${h.result}`).join('\n'),
      latestResult: result,
    });

    // Simple check - if feedback contains "no" or "continue", proceed
    if (
      feedback.toLowerCase().includes('complete') ||
      feedback.toLowerCase().includes('finished')
    ) {
      shouldContinue = false;
    } else {
      // Update plan based on feedback
      currentPlan = feedback;
    }
  }

  return history;
}

// Usage
const task = 'Research and write a report on AI trends';
await dynamicPlanning(task);
```

### 3. Hierarchical Planning (分层规划)

以下代码实现了分层规划模式，在多个抽象层次创建计划：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Level 1: High-level planning (goals)
const highLevelPrompt = ChatPromptTemplate.fromTemplate(
  `For the task: {task}

Provide 2-4 high-level goals (abstract objectives).`,
);

// Level 2: Mid-level planning (phases)
const midLevelPrompt = ChatPromptTemplate.fromTemplate(
  `Break down this goal into phases:

Goal: {goal}

Task: {task}

Provide 2-3 phases for achieving this goal.`,
);

// Level 3: Low-level planning (specific actions)
const lowLevelPrompt = ChatPromptTemplate.fromTemplate(
  `For this phase, provide specific actionable steps:

Phase: {phase}

Task: {task}

Provide 3-5 concrete steps to complete this phase.`,
);

// Execution
const executePrompt = ChatPromptTemplate.fromTemplate(`Execute this step: {step}`);

const highLevelChain = highLevelPrompt.pipe(llm).pipe(new StringOutputParser());
const midLevelChain = midLevelPrompt.pipe(llm).pipe(new StringOutputParser());
const lowLevelChain = lowLevelPrompt.pipe(llm).pipe(new StringOutputParser());
const executeChain = executePrompt.pipe(llm).pipe(new StringOutputParser());

// Hierarchical planning function
async function hierarchicalPlanning(task) {
  console.log('=== Level 1: High-Level Goals ===');
  const goals = await highLevelChain.invoke({ task });
  console.log(goals);

  // For each goal, create mid-level phases
  const goalList = goals.split('\n').filter((g) => g.trim());
  const plan = [];

  for (const goal of goalList) {
    console.log(`\n=== Level 2: Phases for "${goal}" ===`);
    const phases = await midLevelChain.invoke({ goal, task });
    console.log(phases);

    const phaseList = phases.split('\n').filter((p) => p.trim());
    const goalPlan = { goal, phases: [] };

    // For each phase, create low-level steps
    for (const phase of phaseList) {
      console.log(`\n=== Level 3: Steps for "${phase}" ===`);
      const steps = await lowLevelChain.invoke({ phase, task });
      console.log(steps);

      goalPlan.phases.push({ phase, steps: steps.split('\n').filter((s) => s.trim()) });
    }

    plan.push(goalPlan);
  }

  return plan;
}

// Execute the plan
async function executeHierarchicalPlan(plan) {
  console.log('\n=== Executing Plan ===');

  for (const goalPlan of plan) {
    console.log(`\n--- Goal: ${goalPlan.goal} ---`);

    for (const phasePlan of goalPlan.phases) {
      console.log(`\nPhase: ${phasePlan.phase}`);

      for (const step of phasePlan.steps) {
        console.log(`Executing: ${step}`);
        const result = await executeChain.invoke({ step });
        console.log(`Result: ${result.substring(0, 100)}...`);
      }
    }
  }
}

// Usage
const task = 'Build a web application';
const plan = await hierarchicalPlanning(task);
await executeHierarchicalPlan(plan);
```

## Practical Applications & Use Cases

## 实际应用和用例

### Complex Task Automation

### 复杂任务自动化

For tasks like planning a trip, organizing an event, or conducting research, agents need to create multi-step plans that coordinate various resources and actions.

对于计划旅行、组织活动或进行研究等任务，智能体需要创建协调各种资源和行动的多步计划。

### Problem Solving

### 问题解决

When faced with complex problems, planning allows agents to break them down into manageable steps and systematically work toward a solution.

当面对复杂问题时，规划允许智能体将问题分解为可管理的步骤并系统地朝着解决方案努力。

### Recipe Execution

### 食谱执行

In domains like cooking or DIY, agents can follow step-by-step plans, adapting to the specific conditions and materials available.

在烹饪或DIY等领域，智能体可以遵循分步计划，适应特定条件和可用材料。

### 投资智能体

在设计一个投资智能体时，选择 **Prompt Chaining（提示词链接）** 还是 **Planning Pattern + CoT（规划模式 + 思维链）**，核心取决于一个关键问题：**“如何完成任务（How）”是已经明确的，还是需要智能体自己去探索的？**

以下是这两种模式在投资智能体中的具体应用场景对比：

#### 场景一：使用 Prompt Chaining（提示词链接）

**适用特征**：任务是**高度标准化、可重复**的。工作流（怎么做）人类已经完全掌握，需要极高的**可预测性和稳定性**，不允许智能体自由发挥。

**投资场景 1：标准化财报数据提取与入库**

- **任务**：每当有公司发布新的季度财报（PDF），提取核心财务指标并存入数据库。
- **工作流设计**（人类预设好流水线）：
  - **Step 1 (提取)**：提示词专门要求模型从长篇财报中提取营收、净利润、EPS 等具体数字。
  - **Step 2 (格式化)**：提示词将上一步的输出转化为严格的 JSON 格式（如 `{"revenue": 1000, "eps": 1.2}`）。
  - **Step 3 (计算验证)**：调用外部计算器工具验证提取的利润率是否正确。
- **为什么用它**：这种数据处理任务需要绝对的准确和格式统一。通过把任务切碎，降低了模型的认知负荷，防止它在长文本中遗漏指令（指令忽视）或产生幻觉。

**投资场景 2：每日收盘市场简报生成**

- **任务**：每天收盘后，生成一份结构化的市场总结邮件发给客户。
- **工作流设计**：
  - **Step 1**：获取三大股指数据并总结。
  - **Step 2**：结合 Step 1 的数据，识别涨跌幅最大的板块。
  - **Step 3**：根据上述信息，以“资深分析师”的口吻起草包含图表占位符的最终邮件。
- **为什么用它**：内容的结构（摘要 -> 趋势 -> 邮件）是固定的。人类定义好这条“管道（Pipeline）”，智能体只需要按部就班地传递数据即可。

---

#### 场景二：使用 Planning Pattern + CoT（规划模式 + 思维链）

**适用特征**：任务是**开放式、多方面、且高度复杂的**。初始状态和目标状态明确，但**路径未知**，需要智能体具备远见（Foresight），能够动态推理、试错和适应。

**投资场景 1：深度宏观与行业研究 (Deep Research)**

- **任务**：用户提问：“考虑到最近中东局势升级和美联储可能推迟降息，我应该如何调整我的新能源汽车股票仓位？”
- **工作流设计**（AI 自主拆解与推理）：
  - **规划 (Planning)**：智能体自主决定需要分几步走。它可能会规划出：1. 检索中东局势对原油价格的影响；2. 检索美联储降息预期；3. 分析油价和利率对新能源车企（如特斯拉、比亚迪）供应链和销量的影响；4. 综合得出结论。
  - **思维链 (CoT)**：在执行每一步时，智能体会利用 CoT “一步一步地思考”。例如，在检索后，它会在内部进行推理：“_因为油价上涨通常利好传统能源，但同时也可能增加消费者的电动车替换意愿，我需要进一步搜索特定车企的订单数据来验证..._”。
- **为什么用它**：这类问题无法通过单一查询解决，且充满了未知的知识空白（Knowledge gaps）。智能体必须像一个真正的研究员一样，边检索、边推理、边发现缺失的信息，然后不断完善自己的搜索计划。

**投资场景 2：个性化投资组合诊断与策略制定**

- **任务**：用户上传了自己的持仓明细，要求：“帮我找出持仓中的隐性风险，并提供对冲策略。”
- **工作流设计**：
  - 智能体会利用 **CoT (思维链)** 将复杂的金融诊断分解。它会在内部生成一系列推理轨迹：“_思考1：分析用户持仓，发现科技股占比高达 70%。思考2：目前科技股估值处于历史高位，且容易受利率波动影响。思考3：用户需要对冲策略，我应该去寻找低相关性的资产（如黄金、防御性板块）或期权策略..._”。
  - **规划与适应 (Adaptability)**：如果智能体在规划对冲策略时发现某只推荐的ETF已经退市，它不会直接崩溃，而是会**适应**这个新约束，重新评估并规划出替代的投资标的。

#### 总结法则 (Rule of Thumb)

- 如果你是在构建投资智能体的**后台数据处理管线**（如研报解析、新闻打标、定时报告），请使用由人类精心设计的 **Prompt Chaining**，以换取极高的稳定性和确定性。
- 如果你是在构建面向客户的**首席投资顾问/深度研究员**，用来解答模糊、复杂的宏观经济或定制化策略问题，请赋予它 **Planning Pattern + CoT** 的能力，让它根据目标去自主探索、推理和试错。

### Investment Agent: Prompt Chaining for Financial Report Extraction

### 投资智能体：提示词链接之标准化财报数据提取

This example demonstrates Prompt Chaining for standardized financial data extraction - a fixed workflow with high predictability.

此示例展示提示词链接在标准化财报数据提取中的应用——具有高度可预测性的固定工作流。

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ model: 'gpt-4o', temperature: 0.1 });

// --- Step 1: Extract financial metrics from PDF ---
const extractPrompt = ChatPromptTemplate.fromTemplate(
  `You are a financial data extractor. Extract the following key metrics from this earnings report:

Target Metrics:
- Revenue (营收)
- Net Income (净利润)
- EPS (每股收益)
- Operating Margin (营业利润率)

Report Text:
{reportText}

Return ONLY the extracted numbers in this format:
{"revenue": "X", "netIncome": "X", "eps": "X", "operatingMargin": "X"}`,
);

// --- Step 2: Format to strict JSON ---
const formatPrompt = ChatPromptTemplate.fromTemplate(
  `Convert the following financial data into strict JSON format:

Raw Data:
{rawData}

Return ONLY valid JSON with these exact keys:
{"revenue": number, "netIncome": number, "eps": number, "operatingMargin": number}`,
);

// --- Step 3: Validate with calculator ---
const validatePrompt = ChatPromptTemplate.fromTemplate(
  `Verify if these financial metrics are consistent:

Extracted Data:
{jsonData}

Calculations to verify:
1. Operating Margin = (Operating Income / Revenue) * 100
2. Net Income should be positive for profitable companies

Return validation result:
{"valid": boolean, "issues": []}`,
);

// --- Create Chains ---
const extractChain = extractPrompt.pipe(llm).pipe(new StringOutputParser());
const formatChain = formatPrompt.pipe(llm).pipe(new StringOutputParser());
const validateChain = validatePrompt.pipe(llm).pipe(new StringOutputParser());

// --- Prompt Chaining Execution ---
async function extractFinancialData(reportText) {
  console.log('\n=== Step 1: Extract ===');
  const rawData = await extractChain.invoke({ reportText });
  console.log('Extracted:', rawData);

  console.log('\n=== Step 2: Format ===');
  const jsonData = await formatChain.invoke({ rawData });
  console.log('Formatted:', jsonData);

  console.log('\n=== Step 3: Validate ===');
  const validation = await validateChain.invoke({ jsonData });
  console.log('Validation:', validation);

  return { rawData, jsonData, validation };
}

// --- Usage ---
const sampleReport = `
Apple Inc. reported Q4 2024 earnings:
Total Revenue: $94.9 billion
Operating Income: $27.0 billion
Net Income: $23.6 billion
EPS: $1.40
`;

extractFinancialData(sampleReport);
```

### Investment Agent: Prompt Chaining for Daily Market Summary

### 投资智能体：提示词链接之每日市场简报生成

This example demonstrates Prompt Chaining for generating daily market summary - a fixed pipeline structure.

此示例展示提示词链接在每日市场简报生成中的应用——固定的流水线结构。

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ model: 'gpt-4o', temperature: 0.5 });

// --- Simulated Market Data ---
const marketData = {
  indices: [
    { name: 'S&P 500', value: 4780.24, change: '+0.8%' },
    { name: 'NASDAQ', value: 15055.65, change: '+1.2%' },
    { name: 'DOW', value: 37545.33, change: '+0.5%' },
  ],
  sectors: [
    { name: 'Tech', change: '+1.5%', topGainers: ['NVDA', 'AAPL'] },
    { name: 'Energy', change: '-1.2%', topLosers: ['XOM', 'CVX'] },
    { name: 'Healthcare', change: '+0.3%', topGainers: ['UNH', 'JNJ'] },
  ],
};

// --- Step 1: Summarize index performance ---
const summarizeIndicesPrompt = ChatPromptTemplate.fromTemplate(
  `Summarize the performance of these stock indices:

Indices Data:
{indicesData}

Provide a brief 2-3 sentence summary of market direction.`,
);

// --- Step 2: Identify sector trends ---
const sectorTrendsPrompt = ChatPromptTemplate.fromTemplate(
  `Based on the index summary and sector data, identify key sector trends:

Index Summary:
{indexSummary}

Sector Data:
{sectorData}

Identify:
- Top performing sectors
- Worst performing sectors
- Key market themes`,
);

// --- Step 3: Generate final email ---
const emailPrompt = ChatPromptTemplate.fromTemplate(
  `You are a senior analyst. Draft a professional market summary email.

Market Overview:
{indexSummary}

Sector Trends:
{sectorTrends}

Requirements:
- Professional tone
- Include actionable insights
- Add chart placeholders where relevant
- Keep it concise (3-5 paragraphs)`,
);

// --- Create Chains ---
const summarizeChain = summarizeIndicesPrompt.pipe(llm).pipe(new StringOutputParser());
const sectorChain = sectorTrendsPrompt.pipe(llm).pipe(new StringOutputParser());
const emailChain = emailPrompt.pipe(llm).pipe(new StringOutputParser());

// --- Prompt Chaining Execution ---
async function generateDailyBrief() {
  console.log('\n=== Generating Daily Market Brief ===\n');

  // Step 1: Summarize indices
  console.log('Step 1: Summarizing indices...');
  const indexSummary = await summarizeChain.invoke({
    indicesData: JSON.stringify(marketData.indices),
  });
  console.log('Index Summary:', indexSummary.substring(0, 100), '...');

  // Step 2: Analyze sectors
  console.log('\nStep 2: Analyzing sector trends...');
  const sectorTrends = await sectorChain.invoke({
    indexSummary,
    sectorData: JSON.stringify(marketData.sectors),
  });
  console.log('Sector Trends:', sectorTrends.substring(0, 100), '...');

  // Step 3: Generate email
  console.log('\nStep 3: Drafting final email...');
  const email = await emailChain.invoke({
    indexSummary,
    sectorTrends,
  });

  console.log('\n=== Final Market Brief ===');
  console.log(email);

  return email;
}

generateDailyBrief();
```

### Investment Agent: Planning + CoT for Deep Research

### 投资智能体：规划模式+思维链之深度宏观研究

This example demonstrates Planning Pattern + CoT for complex, open-ended research tasks where the path is unknown.

此示例展示规划模式+思维链在复杂、开放的研究任务中的应用——路径未知，需要自主探索。

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ model: 'gpt-4o', temperature: 0.7 });

// --- Planning Phase ---
const planningPrompt = ChatPromptTemplate.fromTemplate(
  `You are an investment research planner. The user asks:

"{query}"

Break down this complex research task into a plan with 4-6 research steps.
Each step should address a specific aspect of the question.

Output the plan as a numbered list.`,
);

// --- Chain of Thought Execution ---
const cotPrompt = ChatPromptTemplate.fromTemplate(
  `You are executing step {stepNum}: {stepName}

Previous research results:
{history}

Current task: {stepTask}

Think step-by-step about:
1. What information do I need?
2. What is the logical chain of reasoning?
3. What are the knowledge gaps?

Provide your research findings and reasoning:`,
);

// --- Research Execution ---
const researchPrompt = ChatPromptTemplate.fromTemplate(
  `Execute this research step:

Step: {stepName}
Task: {stepTask}

Provide concise research findings:`,
);

// --- Synthesis ---
const synthesisPrompt = ChatPromptTemplate.fromTemplate(
  `You are the Chief Investment Strategist. Synthesize all research findings into a coherent investment recommendation.

Research History:
{history}

User Question: {query}

Provide:
1. Executive Summary
2. Key Findings from each research area
3. Investment Recommendation
4. Risk Factors
5. Recommended Actions`,
);

// --- Chains ---
const planningChain = planningPrompt.pipe(llm).pipe(new StringOutputParser());
const cotChain = cotPrompt.pipe(llm).pipe(new StringOutputParser());
const researchChain = researchPrompt.pipe(llm).pipe(new StringOutputParser());
const synthesisChain = synthesisPrompt.pipe(llm).pipe(new StringOutputParser());

// --- Planning + CoT Execution ---
async function deepResearch(query) {
  console.log(`\n=== Deep Research: ${query} ===`);

  // Phase 1: Create Plan
  console.log('\n[Planning Phase] Creating research plan...');
  const plan = await planningChain.invoke({ query });
  const steps = plan.split('\n').filter((s) => s.trim());
  console.log('Plan:', steps);

  // Phase 2: Execute with CoT
  let history = [];
  for (let i = 0; i < steps.length; i++) {
    const stepName = steps[i].replace(/^\d+\.\s*/, '').trim();
    console.log(`\n[Research Phase ${i + 1}] ${stepName}`);

    // Chain of Thought
    const cot = await cotChain.invoke({
      stepNum: i + 1,
      stepName,
      stepTask: stepName,
      history: history.join('\n\n'),
    });
    console.log('CoT Reasoning:', cot.substring(0, 200), '...');

    // Execute research
    const result = await researchChain.invoke({
      stepName,
      stepTask: stepName,
    });
    console.log('Research Result:', result.substring(0, 150), '...');

    history.push(`Step ${i + 1} - ${stepName}: ${result}`);
  }

  // Phase 3: Synthesis
  console.log('\n[Synthesis Phase] Generating final recommendation...');
  const finalReport = await synthesisChain.invoke({
    history: history.join('\n\n---\n\n'),
    query,
  });

  console.log('\n=== Final Investment Report ===');
  console.log(finalReport);

  return finalReport;
}

// --- Usage ---
const complexQuery =
  '考虑到最近中东局势升级和美联储可能推迟降息，我应该如何调整我的新能源汽车股票仓位？';

deepResearch(complexQuery);
```

### Investment Agent: Planning for Portfolio Diagnosis

### 投资智能体：规划模式之投资组合诊断与策略制定

This example demonstrates Planning with adaptability - the agent adapts when encountering constraints (e.g., ETF delisting).

此示例展示具有适应性的规划——智能体在遇到约束时能够自适应（如ETF退市）。

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ model: 'gpt-4o', temperature: 0.5 });

// --- Portfolio Data ---
const userPortfolio = [
  { symbol: 'AAPL', shares: 100, value: 17850, sector: 'Technology' },
  { symbol: 'MSFT', shares: 50, value: 18945, sector: 'Technology' },
  { symbol: 'NVDA', shares: 30, value: 14760, sector: 'Technology' },
  { symbol: 'GOOGL', shares: 40, value: 5672, sector: 'Technology' },
  { symbol: 'TSLA', shares: 20, value: 4960, sector: 'Consumer/Ev' },
];

// --- Phase 1: Analyze Portfolio ---
const analyzePortfolioPrompt = ChatPromptTemplate.fromTemplate(
  `Analyze this investment portfolio for risks:

Portfolio:
{portfolio}

Identify:
1. Sector concentration risk
2. Individual position size risks
3. Correlation risks
4. Any obvious imbalances`,
);

// --- Phase 2: Generate Hedging Strategy ---
const hedgingStrategyPrompt = ChatPromptTemplate.fromTemplate(
  `Based on the portfolio analysis:

Analysis:
{analysis}

Generate a hedging strategy that includes:
1. Low-correlation assets to add
2. Defensive sector recommendations
3. Specific hedging instruments (ETFs, options)

Note: If recommending ETFs, verify they are currently trading.`,
);

// --- Phase 3: Adaptability Check ---
const adaptabilityCheckPrompt = ChatPromptTemplate.fromTemplate(
  `You encountered an issue while executing the hedging strategy.

Original Recommendation:
{originalRec}

Issue:
{issue}

Adapt and provide an alternative strategy that works around this constraint.
Explain your reasoning.`,
);

// --- Phase 4: Final Recommendations ---
const finalRecPrompt = ChatPromptTemplate.fromTemplate(
  `Compile the final investment strategy:

Portfolio Analysis:
{analysis}

Hedging Strategy:
{strategy}

Final adaptations:
{adaptations}

Provide a complete strategy document with specific actionable recommendations.`,
);

// --- Chains ---
const analyzeChain = analyzePortfolioPrompt.pipe(llm).pipe(new StringOutputParser());
const hedgingChain = hedgingStrategyPrompt.pipe(llm).pipe(new StringOutputParser());
const adaptChain = adaptabilityCheckPrompt.pipe(llm).pipe(new StringOutputParser());
const finalChain = finalRecPrompt.pipe(llm).pipe(new StringOutputParser());

// --- Portfolio Diagnosis with Planning ---
async function diagnosePortfolio() {
  console.log('\n=== Portfolio Diagnosis & Strategy ===\n');

  // Step 1: Analyze portfolio
  console.log('[Step 1] Analyzing portfolio...');
  const analysis = await analyzeChain.invoke({
    portfolio: JSON.stringify(userPortfolio, null, 2),
  });
  console.log('Analysis:', analysis.substring(0, 200), '...');

  // Step 2: Generate hedging strategy
  console.log('\n[Step 2] Generating hedging strategy...');
  let strategy = await hedgingChain.invoke({ analysis });
  console.log('Strategy:', strategy.substring(0, 200), '...');

  // Step 3: Simulate constraint/adaptability
  // Simulate finding that recommended ETF is delisted
  const simulatedIssue = "Recommended ETF 'ARKK' has been delisted and is no longer tradable";
  const simulatedOriginalRec = 'Add ARKK for innovation sector exposure';

  if (strategy.includes('ARKK') || strategy.toLowerCase().includes('arkk')) {
    console.log('\n[Adaptability Check] Detected issue with recommendation...');
    const adaptations = await adaptChain.invoke({
      originalRec: simulatedOriginalRec,
      issue: simulatedIssue,
    });
    console.log('Adapted Strategy:', adaptations);

    // Update strategy with adaptation
    strategy = adaptations;
  }

  // Step 4: Final recommendations
  console.log('\n[Step 4] Compiling final strategy...');
  const finalRec = await finalChain.invoke({
    analysis,
    strategy,
    adaptations: strategy.includes('Adapt')
      ? 'Replaced delisted ETF with QQQ'
      : 'No adaptations needed',
  });

  console.log('\n=== Final Investment Strategy ===');
  console.log(finalRec);

  return finalRec;
}

diagnosePortfolio();
```
