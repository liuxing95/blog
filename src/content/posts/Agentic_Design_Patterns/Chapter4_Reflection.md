---
title: 'Chapter 4: Reflection'
date: '2026-03-15'
excerpt: 'Reflection is a critical pattern that enables agents to evaluate their own outputs and improve their performance over time. 融合社区洞察与最新实践分享。'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 4: Reflection

# 第四章：反思

## Reflection Pattern Overview

## 反思模式概述

Reflection is a critical pattern that enables agents to evaluate their own outputs and improve their performance over time.

反思是一个关键模式，使智能体能够评估自己的输出并随着时间提高性能。

Unlike traditional software where outputs are typically final, agents can be designed to review, critique, and refine their own responses before delivering them to the user.

与输出通常是最终的传统软件不同，智能体可以被设计为在向用户交付之前审查、批评和改进自己的响应。

This self-evaluation capability is fundamental to building more reliable and accurate agents.

这种自我评估能力是构建更可靠和准确智能体的基础。

At its core, reflection involves having the agent examine its own output and assess whether it meets the required quality standards.

从本质上讲，反思涉及让智能体检查自己的输出并评估它是否符合所需的质量标准。

If the output is deemed unsatisfactory, the agent can then attempt to improve it, either by regenerating it with modified parameters or by applying specific correction strategies.

如果输出被认为不满意，智能体可以尝试改进它，要么通过使用修改后的参数重新生成，要么通过应用特定的纠正策略。

### How Reflection Works

### 反思如何工作

The reflection pattern typically involves a multi-step process:

反思模式通常涉及多步过程：

1. **Generation**: The agent initially generates an output based on the given task.

1. **生成**: 智能体最初根据给定任务生成输出。

1. **Evaluation**: The agent (or a separate evaluation component) assesses the output against specific criteria.

1. **评估**: 智能体（或单独的评估组件）根据特定标准评估输出。

1. **Decision**: Based on the evaluation, the agent decides whether to accept the output or attempt improvement.

1. **决策**: 基于评估，智能体决定是接受输出还是尝试改进。

1. **Refinement**: If improvement is needed, the agent generates a new version of the output, potentially incorporating feedback from the evaluation.

1. **改进**: 如果需要改进，智能体生成新版本的输出，可能结合评估的反馈。

This process can be repeated iteratively until a satisfactory output is produced or a maximum number of iterations is reached.

这个过程可以迭代重复，直到产生满意的输出或达到最大迭代次数。

### Types of Reflection

### 反思的类型

**Self-Reflection**: The agent evaluates its own output without external feedback.

**自我反思**: 智能体在没有外部反馈的情况下评估自己的输出。

This can be done by prompting the LLM to review its own response and identify potential issues.

这可以通过提示LLM审查自己的响应并识别潜在问题来完成。

**External Feedback**: The agent incorporates feedback from external sources, such as tool execution results, user feedback, or validation checks.

**外部反馈**: 智能体结合来自外部来源的反馈，如工具执行结果、用户反馈或验证检查。

For example, after generating code, an agent might run a linter or test suite and use the results to identify and fix errors.

例如，在生成代码后，智能体可能会运行linter或测试套件，并使用结果来识别和修复错误。

**Critique by Another Agent**: In more sophisticated implementations, a separate "critic" agent can be used to evaluate the primary agent's outputs.

**另一个智能体的批评**: 在更复杂的实现中，可以使用单独的"批评者"智能体来评估主要智能体的输出。

This approach can provide more objective evaluation and catch issues that the primary agent might miss.

这种方法可以提供更客观的评估，并捕获主要智能体可能遗漏的问题。

### Hands-On Code Example

## 实践代码示例

### 1. Self-Reflection (自我反思)

以下代码实现了自我反思模式，智能体首先生成响应，然后对自己的输出进行评估：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Step 1: Generate initial response
const generatePrompt = ChatPromptTemplate.fromTemplate('Write a short summary about: {topic}');

// Step 2: Self-reflection prompt
const reflectPrompt = ChatPromptTemplate.fromTemplate(
  `Evaluate the following summary and identify any issues or areas for improvement:

Summary: {summary}

Provide your feedback on:
1. Accuracy
2. Clarity
3. Completeness
If there are issues, provide an improved version.`,
);

// Generate chain
const generateChain = generatePrompt.pipe(llm).pipe(new StringOutputParser());

// Reflection chain
const reflectChain = reflectPrompt.pipe(llm).pipe(new StringOutputParser());

// Main reflection function
async function selfReflect(topic) {
  console.log('Generating initial response...');
  const initialResponse = await generateChain.invoke({ topic });

  console.log('Performing self-reflection...');
  const feedback = await reflectChain.invoke({ summary: initialResponse });

  return { initialResponse, feedback };
}

// Usage
const result = await selfReflect('artificial intelligence');
console.log('Initial:', result.initialResponse);
console.log('Feedback:', result.feedback);
```

### 2. External Feedback (外部反馈)

以下代码展示了如何结合外部工具执行结果进行反思：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Simulated code execution function (external feedback)
async function executeCode(code) {
  // Simulate code execution
  console.log(`Executing: ${code}`);
  // In real scenario, this would actually execute the code
  try {
    // Simulate execution result
    return { success: true, output: 'Syntax OK', error: null };
  } catch (e) {
    return { success: false, output: null, error: e.message };
  }
}

// Generate code prompt
const codeGenPrompt = ChatPromptTemplate.fromTemplate('Write a function that {task}');

// Evaluation prompt with external feedback
const evaluatePrompt = ChatPromptTemplate.fromTemplate(
  `You wrote the following code:

{code}

The code was executed with this result:
- Success: {success}
- Output: {output}
- Error: {error}

If there were errors, fix them. Provide the corrected code:`,
);

const generateChain = codeGenPrompt.pipe(llm).pipe(new StringOutputParser());
const evaluateChain = evaluatePrompt.pipe(llm).pipe(new StringOutputParser());

// Main function with external feedback
async function codeWithExternalFeedback(task) {
  let code = await generateChain.invoke({ task });
  let maxIterations = 3;

  for (let i = 0; i < maxIterations; i++) {
    const result = await executeCode(code);

    if (result.success) {
      console.log('Code executed successfully!');
      return code;
    }

    console.log(`Iteration ${i + 1}: Fixing errors...`);
    code = await evaluateChain.invoke({
      code,
      success: result.success,
      output: result.output,
      error: result.error,
    });
  }

  return code;
}

// Usage
const fixedCode = await codeWithExternalFeedback('calculate factorial');
console.log('Final code:', fixedCode);
```

### 3. Critique by Another Agent (批评者智能体)

以下代码实现了生产者-批评者架构：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Producer (generates the response)
const producer = new ChatOpenAI({ temperature: 0.7, model: 'gpt-4' });
// Critic (evaluates the response)
const critic = new ChatOpenAI({ temperature: 0, model: 'gpt-4' });

// Producer prompt
const producerPrompt = ChatPromptTemplate.fromTemplate('Provide investment advice for: {query}');

// Critic evaluation prompt
const criticPrompt = ChatPromptTemplate.fromTemplate(
  `You are a financial risk analyst. Evaluate the following investment advice:

Advice: {advice}

Evaluate:
1. Risk level (1-10)
2. Potential red flags or concerns
3. Factual accuracy
4. Whether it aligns with conservative investment principles

Provide detailed feedback:`,
);

// Producer chain
const producerChain = producerPrompt.pipe(producer).pipe(new StringOutputParser());

// Critic chain
const criticChain = criticPrompt.pipe(critic).pipe(new StringOutputParser());

// Main critique function
async function critiqueExample(query) {
  console.log('Producer: Generating advice...');
  const advice = await producerChain.invoke({ query });

  console.log('Critic: Evaluating advice...');
  const feedback = await criticChain.invoke({ advice });

  return { advice, feedback };
}

// Usage
const result = await critiqueExample('Should I invest all my savings in cryptocurrency?');
console.log('Advice:', result.advice);
console.log('Critique:', result.feedback);
```

## Practical Applications & Use Cases

## 实际应用和用例

### Code Generation and Debugging

### 代码生成和调试

Reflection is particularly valuable in code generation tasks.

反思在代码生成任务中特别有价值。

After generating code, an agent can use tools to execute the code, analyze any errors, and then refine the code to fix those errors.

生成代码后，智能体可以使用工具执行代码，分析任何错误，然后改进代码以修复这些错误。

This iterative refinement process can significantly improve the quality and reliability of generated code.

这种迭代改进过程可以显著提高生成代码的质量和可靠性。

### Document Generation

### 文档生成

When generating complex documents, reflection can help ensure consistency and quality.

在生成复杂文档时，反思可以帮助确保一致性和质量。

The agent can review its draft for coherence, factual accuracy, and adherence to style guidelines.

智能体可以审查其草稿的一致性、事实准确性和风格指南遵守情况。

### 投资 Agent

在设计投资 Agent 时，**反思模式（Reflection Pattern）是确保交易安全、控制风险并提升决策准确性的核心防线**。在执行“买入”或“卖出”这种具有直接财务后果的操作时，反思机制主要用于在生成交易信号与最终执行之间建立一个**自我纠正和验证的反馈循环**。

针对买卖步骤的正确性反思，可以从以下几个关键维度进行设计：

#### 1. 引入“生产者-批评者”架构进行交叉验证

单一智能体在评估自己的决策时容易产生“认知偏见”。在投资场景中，应该采用**“生产者-批评者”模型（Producer-Critic Model）**：

- **生产者（交易员智能体）：** 负责根据当前市场数据和指标，提出初始的买入或卖出草案（例如：“建议以市价买入 100 股特斯拉”）。
- **批评者（风控/审查智能体）：** 扮演挑剔的审查员角色。它会仔细审查交易员的推理，检查事实的准确性、完整性以及是否存在潜在偏见。如果发现数据缺失或推理前后矛盾，它会提出关键问题并要求修改。

#### 2. 基于目标和人类约束（Guardrails）的合规性反思

在反思阶段，系统必须将买卖建议与预设的总体目标和底线进行对齐核对：

- **风险与目标核对：** 审查该笔买卖是否符合“在保持风险承受能力的同时最大化收益”的总体目标。如果卖出操作会导致投资组合的风险敞口越过阈值，反思机制必须阻断或要求调整该操作。
- **人类策略限制：** 系统可以采用“人在环上（Human-on-the-loop）”的策略，即人类专家预先设定了硬性规则（例如：“单一公司持仓最多 5%”或“下跌 10% 自动卖出”）。批评者智能体在反思时，需核实当前买卖动作是否违反了这些硬性指标。

#### 3. 利用多模型辩论（Chain of Debates）达成共识

对于高风险的买入或卖出决策，可以超越单线的反思，引入**辩论链（Chain of Debates, CoD）**或**辩论图（GoD）**框架。

- **执行方式：** 安排多个代表不同视角的模型或智能体（例如，一个主攻“基本面分析”，另一个主攻“技术面分析”或“情绪面分析”）像委员会开会一样提出初始想法。
- **互相批评：** 它们会针对“是否应该买入”互相批评对方的推理，交换反驳意见。
- **降低偏见：** 最终的买卖结论不再是单一思路的结果，而是通过识别整个图谱中最稳健、证据最充分的论点集群来达成共识，从而显著降低个体模型的偏见和失误率。

#### 4. 针对执行异常的“事后反思”

反思不仅发生在交易“之前”，也发生在交易执行“受挫”之时。

- 如果在下达买卖指令时遇到异常（例如遇到“资金不足”或“市场已休市”等错误）。
- Agent 不应盲目重试无效交易或直接崩溃。它应当通过反思过程来分析失败的原因，调整策略（例如：降低买入数量以适应当前资金，或更改为盘后交易指令），然后以改进后的方法重新尝试。

#### 5. 结合长期记忆的累积学习

**反思模式与记忆机制结合时最为强大**。

- Agent 应该记录过去的交易决策及其反思过程，并追踪这些买卖最终是盈利还是亏损。
- 在未来进行新的买卖反思时，Agent 会利用**对话历史或长期记忆**作为上下文，不仅仅孤立地评估当前交易，而是参考历史反馈和经验教训。这使得反思成为一个累积的过程，让 Agent 能够"吃一堑长一智"，避免在相同的市场伪信号上重复犯错。

### Investment Agent: Producer-Critic Trading Validation

### 投资智能体：生产者-批评者交易验证

This example demonstrates the first pattern: using Producer-Critic architecture to validate trading decisions before execution.

此示例展示第一个模式：使用生产者-批评者架构在执行前验证交易决策。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// --- Configuration ---
const traderLLM = new ChatOpenAI({ model: "gpt-4o", temperature: 0.7 });
const criticLLM = new ChatOpenAI({ model: "gpt-4o", temperature: 0.2 });

// --- Producer (Trader Agent) ---
const traderPrompt = ChatPromptTemplate.fromMessages([
  ["system", `You are a Trading Analyst. Based on the following market data for {symbol}:

- Current Price: {price}
- P/E Ratio: {pe}
- Revenue Growth: {revenueGrowth}
- Recent News: {news}

Generate a trading recommendation (BUY/SELL/HOLD) with specific action (quantity, order type).`],
  ["user", "Generate trading recommendation:"],
]);

// --- Critic (Risk Review Agent) ---
const criticPrompt = ChatPromptTemplate.fromMessages([
  ["system", `You are a Risk Review Analyst. Evaluate the following trading recommendation for potential issues:

Trader's Recommendation: {recommendation}

Evaluate:
1. Factual accuracy of the data interpretation
2. Potential biases in the reasoning
3. Missing information or red flags
4. Risk level (1-10)

If approved, state "APPROVED". If rejected, state "REJECTED" and provide reasons.`],
  ["user", "Review trading recommendation:"],
]);

const traderChain = traderPrompt.pipe(traderLLM).pipe(new StringOutputParser());
const criticChain = criticPrompt.pipe(criticLLM).pipe(new StringOutputParser());

// --- Producer-Critic Validation Function ---
async function validateTrade(tradeRequest) {
  console.log("\n=== Producer-Critic Trading Validation ===");

  // Step 1: Producer generates recommendation
  console.log("[Producer] Generating trading recommendation...");
  const recommendation = await traderChain.invoke(tradeRequest);
  console.log("[Producer] Recommendation:", recommendation);

  // Step 2: Critic evaluates recommendation
  console.log("\n[Critic] Evaluating recommendation...");
  const review = await criticChain.invoke({ recommendation });
  console.log("[Critic] Review:", review);

  // Step 3: Decision
  const isApproved = review.toUpperCase().includes("APPROVED");
  return {
    recommendation,
    review,
    approved: isApproved,
  };
}

// --- Usage ---
const tradeRequest = {
  symbol: "TSLA",
  price: "$245.00",
  pe: "65.2",
  revenueGrowth: "24%",
  news: "Q4 earnings beat, new model announced, but increased competition in China",
};

validateTrade(tradeRequest).then(result => {
  console.log("\n=== Final Decision ===");
  console.log("Approved:", result.approved);
});
```

### Investment Agent: Guardrails Compliance Reflection

### 投资智能体：基于约束的合规性反思

This example demonstrates the second pattern: validating trades against predefined rules and risk constraints.

此示例展示第二个模式：根据预定义规则和风险约束验证交易。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0.3 });

// --- Portfolio Constraints ---
const portfolioConstraints = {
  maxPositionPerStock: 0.05, // Max 5% per stock
  maxPortfolioRisk: 0.15, // Max 15% portfolio risk
  stopLossPercent: 0.10, // 10% stop loss
  maxStocks: 20, // Max 20 positions
};

// --- Guardrails Check Function ---
async function checkGuardrails(trade, portfolio) {
  console.log("\n=== Guardrails Compliance Check ===");

  const guardrailsPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Compliance Checker. Verify if this trade violates any rules.

**Portfolio Constraints:**
- Max position per stock: {maxPosition}%
- Max portfolio risk: {maxRisk}%
- Stop loss threshold: {stopLoss}%
- Max positions: {maxStocks}

**Current Portfolio:**
{portfolio}

**Proposed Trade:**
{trade}

Check each rule and return:
1. VIOLATED rules (if any)
2. PASSED rules
3. Final decision: APPROVED or REJECTED with reasons`],
    ["user", "Check compliance:"],
  ]);

  const chain = guardrailsPrompt.pipe(llm).pipe(new StringOutputParser());

  const result = await chain.invoke({
    maxPosition: (portfolioConstraints.maxPositionPerStock * 100),
    maxRisk: (portfolioConstraints.maxPortfolioRisk * 100),
    stopLoss: (portfolioConstraints.stopLossPercent * 100),
    maxStocks: portfolioConstraints.maxStocks,
    portfolio: JSON.stringify(portfolio, null, 2),
    trade: JSON.stringify(trade, null, 2),
  });

  console.log("Compliance Result:", result);
  return result;
}

// --- Simulated Portfolio ---
const currentPortfolio = [
  { symbol: "AAPL", value: 15000, percent: 0.15 }, // Already at max
  { symbol: "MSFT", value: 10000, percent: 0.10 },
  { symbol: "GOOGL", value: 5000, percent: 0.05 },
];

// --- Test Trade ---
const proposedTrade = {
  action: "BUY",
  symbol: "NVDA",
  quantity: 100,
  price: 450,
  totalValue: 45000,
};

checkGuardrails(proposedTrade, currentPortfolio);
```

### Investment Agent: Chain of Debates Consensus

### 投资智能体：多模型辩论共识

This example demonstrates the third pattern: using multiple agents with different perspectives to debate and reach consensus.

此示例展示第三个模式：使用不同视角的多个智能体进行辩论并达成共识。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const fundamentalLLM = new ChatOpenAI({ model: "gpt-4o", temperature: 0.7 });
const technicalLLM = new ChatOpenAI({ model: "gpt-4o", temperature: 0.7 });
const sentimentLLM = new ChatOpenAI({ model: "gpt-4o", temperature: 0.7 });
const consensusLLM = new ChatOpenAI({ model: "gpt-4o", temperature: 0.2 });

// --- Debate Agents ---

// Fundamental Analysis Agent
const fundamentalAgent = async (symbol) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Fundamental Analysis Expert.
Provide your BUY/SELL/HOLD recommendation for {symbol} based on:
- P/E ratio, revenue growth, profit margins
- Financial health and debt levels

State your position and provide key arguments.`],
    ["user", "Fundamental analysis:"],
  ]);
  return prompt.pipe(fundamentalLLM).pipe(new StringOutputParser()).invoke({ symbol });
};

// Technical Analysis Agent
const technicalAgent = async (symbol) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Technical Analysis Expert.
Provide your BUY/SELL/HOLD recommendation for {symbol} based on:
- Price trends, support/resistance levels
- RSI, MACD, moving averages

State your position and provide key arguments.`],
    ["user", "Technical analysis:"],
  ]);
  return prompt.pipe(technicalLLM).pipe(new StringOutputParser()).invoke({ symbol });
};

// Sentiment Analysis Agent
const sentimentAgent = async (symbol) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Sentiment Analysis Expert.
Provide your BUY/SELL/HOLD recommendation for {symbol} based on:
- News sentiment, social media trends
- Analyst ratings and investor behavior

State your position and provide key arguments.`],
    ["user", "Sentiment analysis:"],
  ]);
  return prompt.pipe(sentimentLLM).pipe(new StringOutputParser()).invoke({ symbol });
};

// --- Consensus Agent ---
const consensusAgent = async (debates) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are the Consensus Moderator. Review the debate and reach a final decision.

**Fundamental View:**
{fundamental}

**Technical View:**
{technical}

**Sentiment View:**
{sentiment}

Analyze each perspective, identify areas of agreement/disagreement, and provide:
1. Final recommendation (BUY/SELL/HOLD)
2. Confidence level
3. Key reasoning that combines all perspectives`],
    ["user", "Reach consensus:"],
  ]);

  return prompt.pipe(consensusLLM).pipe(new StringOutputParser()).invoke(debates);
};

// --- Chain of Debates Function ---
async function chainOfDebates(symbol) {
  console.log(`\n=== Chain of Debates for ${symbol} ===`);

  // Phase 1: Each agent provides initial view
  console.log("\n[Debate Phase] Each agent provides initial view...");
  const [fundamental, technical, sentiment] = await Promise.all([
    fundamentalAgent(symbol),
    technicalAgent(symbol),
    sentimentAgent(symbol),
  ]);

  console.log("\n--- Fundamental View ---", fundamental);
  console.log("\n--- Technical View ---", technical);
  console.log("\n--- Sentiment View ---", sentiment);

  // Phase 2: Reach consensus
  console.log("\n[Consensus Phase] Moderating debate...");
  const consensus = await consensusAgent({
    fundamental,
    technical,
    sentiment,
  });

  console.log("\n=== Final Consensus ===");
  console.log(consensus);
  return consensus;
}

// Run the debate
chainOfDebates("AAPL");
```

### Investment Agent: Post-Execution Anomaly Reflection

### 投资智能体：执行异常后的反思

This example demonstrates the fourth pattern: reflecting on execution failures and adjusting strategy.

此示例展示第四个模式：反思执行失败并调整策略。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0.5 });

// --- Simulated Trade Execution ---
async function executeTrade(trade) {
  console.log(`\n[Execution] Attempting to execute: ${trade.action} ${trade.quantity} shares of ${trade.symbol}`);

  // Simulate execution logic
  const randomFailure = Math.random() < 0.3; // 30% chance of failure

  if (randomFailure) {
    return {
      success: false,
      error: "Insufficient funds",
      originalTrade: trade,
    };
  }

  return {
    success: true,
    executedPrice: trade.price * 1.02, // Assume slippage
    executedQuantity: trade.quantity,
  };
}

// --- Anomaly Reflection ---
async function reflectOnFailure(executionResult) {
  console.log("\n[Reflection] Analyzing execution failure...");

  const reflectionPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Trading Strategy Refiner. Analyze why this trade failed and propose adjustments.

**Original Trade:**
{trade}

**Error:**
{error}

Analyze the failure reason and propose:
1. Adjusted trade parameters (quantity, order type)
2. Alternative strategies
3. Whether to retry or abort`],
    ["user", "Reflect on failure:"],
  ]);

  const chain = reflectionPrompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({
    trade: JSON.stringify(executionResult.originalTrade),
    error: executionResult.error,
  });
}

// --- Trade Execution with Reflection ---
async function executeWithReflection(trade, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`\n=== Attempt ${attempt} ===`);

    const result = await executeTrade(trade);

    if (result.success) {
      console.log("Trade executed successfully!");
      console.log("Result:", result);
      return result;
    }

    console.log("Trade failed:", result.error);

    if (attempt < maxRetries) {
      console.log("\n[Reflection] Analyzing failure...");
      const adjustment = await reflectOnFailure(result);
      console.log("Adjustment suggestion:", adjustment);

      // Adjust trade based on reflection
      if (result.error === "Insufficient funds") {
        trade.quantity = Math.floor(trade.quantity * 0.7); // Reduce quantity by 30%
        console.log(`[Adjustment] Reduced quantity to ${trade.quantity}`);
      }
    }
  }

  console.log("\n[Reflection] Max retries reached. Trade aborted.");
  return { success: false, aborted: true };
}

// --- Usage ---
const initialTrade = {
  action: "BUY",
  symbol: "TSLA",
  quantity: 100,
  price: 250,
};

executeWithReflection(initialTrade);
```

### Investment Agent: Memory-Based Cumulative Learning

### 投资智能体：基于记忆的累积学习

This example demonstrates the fifth pattern: combining reflection with long-term memory for learning from past decisions.

此示例展示第五个模式：将反思与长期记忆结合，从过去的决策中学习。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0.3 });

// --- Memory Store (Simulated) ---
class TradingMemory {
  constructor() {
    this.decisions = [];
  }

  async addDecision(decision) {
    this.decisions.push({
      ...decision,
      timestamp: new Date().toISOString(),
    });
    console.log(`[Memory] Stored decision: ${decision.symbol} ${decision.action}`);
  }

  getRecentDecisions(symbol, limit = 5) {
    return this.decisions
      .filter(d => d.symbol === symbol)
      .slice(-limit);
  }

  getAllDecisions() {
    return this.decisions;
  }
}

const memory = new TradingMemory();

// --- Trading Agent with Memory ---
class ReflectiveTradingAgent {
  constructor(symbol) {
    this.symbol = symbol;
    this.memory = memory;
  }

  // Generate trading decision
  async generateDecision(marketData) {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a Trading Agent for {symbol}.

Market Data: {marketData}

Provide a trading recommendation (BUY/SELL/HOLD) with reasoning.`],
      ["user", "Generate decision:"],
    ]);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    return chain.invoke({ symbol: this.symbol, marketData });
  }

  // Reflect on decision with historical context
  async reflectWithMemory(decision) {
    const history = this.memory.getRecentDecisions(this.symbol, 5);

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are reflecting on a trading decision.

**Current Decision:**
{decision}

**Historical Context (past decisions):**
{history}

Analyze:
1. Is this decision consistent with past patterns?
2. What lessons from past decisions should be considered?
3. Any red flags or confirmations from history?

Provide reflection and any adjustments to the decision.`],
      ["user", "Reflect with history:"],
    ]);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    return chain.invoke({
      decision,
      history: JSON.stringify(history, null, 2),
    });
  }

  // Learn from outcome (called after trade result is known)
  async learnFromOutcome(decision, outcome) {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are learning from a completed trade.

**Decision Made:**
{decision}

**Outcome (profit/loss):**
{outcome}

Analyze:
1. Was the decision correct? Why or why not?
2. What can be learned for future decisions?
3. Key insights to remember?`],
      ["user", "Learn from outcome:"],
    ]);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    const lesson = await chain.invoke({ decision, outcome });

    // Store in memory
    await this.memory.addDecision({
      symbol: this.symbol,
      action: decision.action,
      reasoning: decision.reasoning,
      outcome: outcome,
      lesson: lesson,
    });

    return lesson;
  }

  // Main workflow
  async trade(marketData, outcome = null) {
    console.log(`\n=== Trading Workflow for ${this.symbol} ===`);

    // If we have an outcome, learn from it first
    if (outcome) {
      console.log("[Learning Phase] Learning from past outcome...");
      const lesson = await this.learnFromOutcome(this.lastDecision, outcome);
      console.log("Lesson learned:", lesson);
    }

    // Generate new decision
    console.log("\n[Generation Phase] Generating new decision...");
    const decision = await this.generateDecision(marketData);
    this.lastDecision = { action: decision, reasoning: "Generated", symbol: this.symbol };
    console.log("Decision:", decision);

    // Reflect with memory
    console.log("\n[Reflection Phase] Reflecting with historical context...");
    const reflection = await this.reflectWithMemory(decision);
    console.log("Reflection:", reflection);

    return { decision, reflection };
  }
}

// --- Usage ---
async function runReflectiveTrading() {
  const agent = new ReflectiveTradingAgent("NVDA");

  // First trade
  console.log("\n--- First Trade ---");
  await agent.trade("Price: $450, P/E: 65, News: Strong earnings");

  // Simulate outcome and learn
  console.log("\n--- Simulated Outcome: +15% profit ---");
  await agent.trade("Price: $460, P/E: 68, News: New product launch", "+15% profit");

  // Second trade with memory
  console.log("\n--- Second Trade (with memory) ---");
  await agent.trade("Price: $470, P/E: 70, News: Analyst upgrade");

  // Show all stored memories
  console.log("\n=== Stored Decisions ===");
  console.log(memory.getAllDecisions());
}

runReflectiveTrading();
```

---

## 社区热议与实践分享

反思模式被 Andrew Ng 列为四大 Agentic 设计模式之一，社区围绕其实现方式、效果提升和成本权衡展开了深入讨论。

### Andrew Ng 的倡导

[Andrew Ng](https://www.deeplearning.ai/the-batch/agentic-design-patterns-part-2-reflection/) 在 DeepLearning.AI 发表了关于反思模式的专题文章，指出：与其让 LLM 直接生成最终输出，不如多次提示它，给予逐步构建更高质量输出的机会。他强调反思模式"实现相对快速，但带来了令人惊讶的性能提升"。

### 关键研究：Reflexion 与 CRITIC

[Reflexion（arXiv:2303.11366）](https://arxiv.org/abs/2303.11366) 是反思框架的里程碑 — 不通过更新权重强化 Agent，而是通过**语言反馈**。Agent 对任务反馈信号进行语言反思，在情景记忆缓冲区中维护反思文本，以促进后续决策。

CRITIC 框架使 LLM 能用外部工具验证和纠正自身输出，在多种任务上实现了 10-30% 的准确率提升。Self-Refine 则展示了自我优化在对话生成到数学推理等多样任务上约 20 个百分点的提升。

### 2025 年前沿：多智能体反思（MAR）

单 Agent 反思面临"思维退化"问题 — Agent 即使识别了失败仍重复相同推理。[MAR（arXiv:2512.20845）](https://arxiv.org/html/2512.20845) 用结构化辩论替代单 Agent 自我批评，多个角色化批评者生成更丰富的反思。实验表明：HotPotQA 精确匹配从 44 提升至 47，HumanEval pass@1 从 76.4 提升至 82.6。

### Nature 2025：双循环反思

[Nature npj AI](https://www.nature.com/articles/s44387-025-00045-3) 发表了受元认知启发的双循环反思方法：LLM 对照人类参考响应批评自身推理过程（外省），从获得的洞察中构建反思库。

### 成本权衡

社区共识：反思显著提升准确率，但需要多次额外 LLM 调用，增加延迟和成本。[Towards Data Science](https://towardsdatascience.com/agentic-ai-from-first-principles-reflection/) 的实践文章建议：在业务场景中，需评估质量提升是否值得额外开销。

---

## 参考资源

### 学术论文

- [Reflexion: Language Agents with Verbal Reinforcement Learning (arXiv:2303.11366)](https://arxiv.org/abs/2303.11366)
- [MAR: Multi-Agent Reflexion (arXiv:2512.20845)](https://arxiv.org/html/2512.20845)
- [Self-Reflection in LLM Agents: Effects on Problem-Solving (arXiv:2405.06682)](https://arxiv.org/abs/2405.06682)
- [Self-reflection Enhances LLMs (Nature npj AI, 2025)](https://www.nature.com/articles/s44387-025-00045-3)

### 博客与教程

- [Andrew Ng - Agentic Design Patterns Part 2: Reflection](https://www.deeplearning.ai/the-batch/agentic-design-patterns-part-2-reflection/)
- [Towards Data Science - Agentic AI from First Principles: Reflection](https://towardsdatascience.com/agentic-ai-from-first-principles-reflection/)
- [Medium - The Reflection Pattern: How Self-Critique Makes AI Smarter](https://medium.com/@vishwajeetv2003/the-reflection-pattern-how-self-critique-makes-ai-smarter-035df3b36aae)
- [Hugging Face - How Do Agents Learn from Their Own Mistakes?](https://huggingface.co/blog/Kseniase/reflection)
- [Emergent Mind - Reflective LLM-based Agent](https://www.emergentmind.com/topics/reflective-llm-based-agent)
