---
title: 'Chapter 3: Parallelization'
date: '2025-12-25'
excerpt: 'While prompt chaining and routing provide mechanisms for handling sequential and conditional logic respectively, many tasks in agentic systems can ...'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 3: Parallelization

# 第三章：并行化

## Parallelization Pattern Overview

## 并行化模式概述

While prompt chaining and routing provide mechanisms for handling sequential and conditional logic respectively, many tasks in agentic systems can benefit from parallel execution.

虽然提示链和路由分别提供了处理顺序和条件逻辑的机制，但智能体系统中的许多任务可以从并行执行中受益。

Parallelization, in the context of LLM-based agents, refers to the technique of executing multiple operations concurrently rather than sequentially.

在基于LLM的智能体的上下文中，并行化是指同时执行多个操作而非顺序执行的技术。

This approach can dramatically reduce overall latency, improve throughput, and enable agents to gather information from multiple sources simultaneously.

这种方法可以显著降低总体延迟，提高吞吐量，并使智能体能够同时从多个来源收集信息。

The core idea is to decompose a problem into independent sub-tasks that can be executed simultaneously, then aggregate their results.

核心思想是将问题分解为可以同时执行的独立子任务，然后聚合它们的结果。

In agentic systems, parallelization is particularly valuable when dealing with I/O-bound operations, such as making multiple API calls, querying databases, or retrieving information from various documents.

在智能体系统中，并行化在处理I/O密集型操作时特别有价值，例如进行多个API调用、查询数据库或从各种文档中检索信息。

By executing these operations concurrently, an agent can significantly reduce the time required to complete complex, multi-faceted tasks.

通过同时执行这些操作，智能体可以显著减少完成复杂、多方面任务所需的时间。

### Types of Parallelization

### 并行化的类型

There are two primary approaches to parallelization in agentic systems:

在智能体系统中主要有两种并行化方法：

**Horizontal Parallelization**: This involves executing multiple independent LLM calls or tool executions at the same time.

**水平并行化**: 这涉及同时执行多个独立的LLM调用或工具执行。

For example, an agent might need to gather information from multiple different sources—such as searching for a product across multiple e-commerce sites, or retrieving customer data from different databases.

例如，智能体可能需要从多个不同来源收集信息——例如在多个电子商务网站搜索产品，或从不同数据库检索客户数据。

These operations have no dependencies on each other and can be executed concurrently.

这些操作彼此没有依赖关系，可以同时执行。

**Vertical Parallelization**: This involves using multiple LLM calls within a single step, where the outputs are combined or compared.

**垂直并行化**: 这涉及在单个步骤中使用多个LLM调用，其中输出被组合或比较。

For example, an agent might generate multiple drafts of a response using different approaches, then select or synthesize the best result.

例如，智能体可能使用不同方法生成多个响应草稿，然后选择或综合最佳结果。

Another example is using multiple LLMs to review or validate each other's outputs.

另一个例子是使用多个LLM相互审查或验证输出。

### Implementation Considerations

### 实现注意事项

While parallelization offers significant performance benefits, it also introduces complexity that must be carefully managed.

虽然并行化提供了显著的性能优势，但也引入了必须仔细管理的复杂性。

**Error Handling**: When multiple operations execute in parallel, failures can occur independently.

**错误处理**: 当多个操作并行执行时，失败可能独立发生。

The system must be designed to handle partial failures gracefully, potentially retrying failed operations while allowing successful ones to proceed.

系统必须设计为优雅地处理部分失败，可能重试失败的操作同时允许成功的操作继续进行。

**Resource Management**: Parallel execution consumes more resources (memory, API quota, compute).

**资源管理**: 并行执行消耗更多资源（内存、API配额、计算）。

Careful consideration must be given to rate limiting, cost management, and the capacity to handle concurrent requests.

必须仔细考虑速率限制、成本管理和处理并发请求的能力。

**Consistency**: When aggregating results from parallel operations, ensuring consistency can be challenging.

**一致性**: 当聚合并行操作的结果时，确保一致性可能具有挑战性。

The agent must have clear strategies for resolving conflicts, reconciling contradictory information, or selecting among multiple valid outputs.

智能体必须有明确的策略来解决冲突、协调矛盾信息或在多个有效输出中进行选择。

## Practical Applications & Use Cases

## 实际应用和用例

### Multi-Source Information Retrieval

### 多源信息检索

One of the most common use cases for parallelization is gathering information from multiple sources simultaneously.

并行化最常见的用例之一是同时从多个来源收集信息。

For example, a research agent might need to search multiple databases, news sources, and social media platforms to compile comprehensive information on a topic.

例如，研究智能体可能需要搜索多个数据库、新闻来源和社交媒体平台来汇编关于某个主题的综合信息。

By executing these searches in parallel, the agent can gather information much faster than if it had to query each source sequentially.

通过并行执行这些搜索，智能体可以比顺序查询每个来源更快地收集信息。

### Batch Processing

### 批处理

Parallelization is also valuable for batch processing tasks, where the same operation needs to be performed on multiple items.

并行化对于批处理任务也很有价值，其中需要对多个项目执行相同的操作。

For example, an agent might need to classify thousands of customer support tickets, translate a document into multiple languages, or generate summaries for multiple articles.

例如，智能体可能需要对数千个客户支持工单进行分类，将文档翻译成多种语言，或为多篇文章生成摘要。

By processing these items in parallel, the agent can dramatically reduce the total processing time.

通过并行处理这些项目，智能体可以显著减少总处理时间。

### Ensemble Methods

### 集成方法

Parallelization can also be used to implement ensemble methods, where multiple LLM calls generate different perspectives or approaches that are then combined.

并行化也可用于实现集成方法，其中多个LLM调用生成不同的观点或方法，然后组合。

For example, an agent might generate multiple solutions to a problem using different prompting strategies, then select the best one or combine elements from each.

例如，智能体可能使用不同的提示策略生成多个问题解决方案，然后选择最佳方案或组合每个方案的要素。

This approach can improve the quality and robustness of the outputs.

这种方法可以提高输出的质量和健壮性。

### 投资智能体

在设计一个投资智能体（Investment Agent）时，**并行化模式（Parallelization Pattern）**的核心目标是**显著减少总体延迟**，特别是针对那些涉及外部 API 调用、数据库查询或独立数据处理的 I/O 密集型任务。

在投资领域，时间就是金钱，顺序执行（即查完股票价格，再去查新闻，最后再算指标）会导致严重的效率瓶颈。要应用并行化策略，关键在于**识别工作流中互不依赖的子任务**。

#### 1. 多源信息收集与研究 (Information Gathering)

当用户询问“帮我分析一下特斯拉（TSLA）是否值得投资”时，Agent 需要大量数据支撑。这些数据源通常是独立的，完全可以同时获取。

- **设计思路（扇出 / Fan-out）**：
  系统通过路由器将任务分配给一个**并行容器（Parallel Agent）**，该容器同时触发多个专门的“研究员子智能体”：
  - **基本面智能体**：调用财报数据库 API 获取市盈率、营收增长等数据。
  - **情绪分析智能体**：同时抓取 Twitter、Reddit 或金融新闻，分析市场情绪。
  - **技术面智能体**：同时调用行情 API 获取 K 线数据、均线和交易量。
- **收益**：相比于顺序查询，这种方式能以最慢的那个 API 的响应时间为准，极大地加快了信息收集速度。

#### 2. 多资产对比分析 (Multi-Asset Comparison / Agentic RAG)

投资中经常涉及标的对比，例如“对比微软（MSFT）和苹果（AAPL）在 AI 领域的投资布局和财务健康度”。

- **设计思路（多步推理并行化）**：
  Agent 首先将这个复杂查询解构（Decompose）为独立的子查询。
  - **并行查询 A**：检索微软的 AI 布局和财务数据。
  - **并行查询 B**：检索苹果的 AI 布局和财务数据。
- **收益**：通过并发执行多文档检索（如向量数据库的查询），系统能成倍缩短复杂比较任务的时间。

#### 3. 并发数据处理与验证 (Data Processing & Analysis)

当处理一份长篇的行业研报或公司财报时，可以同时对该文档应用不同的分析逻辑。

- **设计思路**：
  将同一份数据分发给多个处理链。
  - **任务 A**：提取研报中的核心财务数字（营收、利润等）。
  - **任务 B**：识别研报中披露的潜在业务风险（Risk Factors）。
  - **任务 C**：对管理层的语调进行情感分析。
- **收益**：能够快速从海量文本中同时剥离出多个维度的关键投资见解。

#### 4. 结果的汇聚与综合 (The "Fan-in" / Synthesis Step)

并行化设计必须伴随着一个**综合（Synthesis）**或**合并（Merger）**阶段。并行任务的输出虽然快，但往往是碎片化的。

- **设计思路**：
  在所有并行子智能体（如上述的基本面、情绪、技术面智能体）完成工作并将结果存入状态（Session State）后，必须设置一个**综合智能体（Merger Agent / Synthesis Agent）**。
  - 这个综合智能体通常使用能力更强、更昂贵的模型（如 Gemini Pro / GPT-4o）。
  - 它的任务是接收所有并行的输出，进行交叉验证（例如：基本面看好但情绪面看空，指出这种矛盾），并最终生成一份结构化、带有引用的投资分析报告。

### 架构落地实现建议

- 在代码框架层面，如果您使用 **Google ADK**，可以通过 `ParallelAgent` 类来包裹上述多个并行的研究员智能体，然后再接一个 `SequentialAgent` 来执行后续的综合智能体。
- 如果您使用 **LangChain**，则可以通过 LCEL 的 `RunnableParallel` 将获取新闻、获取价格、获取财报这三个 Chain 组装成一个字典，并发运行后再传入最终的生成提示词中。

## Hands-On Code Examples

## 实践代码示例

The following code examples demonstrate how to implement parallelization patterns in JavaScript using LangChain:

以下代码示例展示如何使用 LangChain 在 JavaScript 中实现并行化模式：

### LangChain RunnableParallel Example

### LangChain RunnableParallel 示例

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel, RunnablePassthrough } from "@langchain/core/runnables";

// --- Configuration ---
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
});

// --- Define Independent Chains ---
// These three chains represent distinct tasks that can be executed in parallel.

// Chain 1: Summarize the topic
const summarizeChain = ChatPromptTemplate.fromMessages([
  ["system", "Summarize the following topic concisely:"],
  ["user", "{topic}"],
]).pipe(llm).pipe(new StringOutputParser());

// Chain 2: Generate questions about the topic
const questionsChain = ChatPromptTemplate.fromMessages([
  ["system", "Generate three interesting questions about the following topic:"],
  ["user", "{topic}"],
]).pipe(llm).pipe(new StringOutputParser());

// Chain 3: Extract key terms from the topic
const termsChain = ChatPromptTemplate.fromMessages([
  ["system", "Identify 5-10 key terms from the following topic, separated by commas:"],
  ["user", "{topic}"],
]).pipe(llm).pipe(new StringOutputParser());

// --- Build the Parallel + Synthesis Chain ---

// 1. Define the block of tasks to run in parallel
const mapChain = new RunnableParallel({
  summary: summarizeChain,
  questions: questionsChain,
  keyTerms: termsChain,
  topic: new RunnablePassthrough(), // Pass the original topic through
});

// 2. Define the final synthesis prompt
const synthesisPrompt = ChatPromptTemplate.fromMessages([
  ["system", `Based on the following information:
Summary: {summary}
Related Questions: {questions}
Key Terms: {keyTerms}
Synthesize a comprehensive answer.`],
  ["user", "Original topic: {topic}"],
]);

// 3. Construct the full chain
const fullParallelChain = mapChain.pipe(synthesisPrompt).pipe(llm).pipe(new StringOutputParser());

// --- Run the Chain ---
async function runParallelExample(topic) {
  console.log(`\n--- Running Parallel LangChain Example for Topic: '${topic}' ---`);

  try {
    // Invoke the chain with the topic
    const response = await fullParallelChain.invoke(topic);

    console.log("\n--- Final Response ---");
    console.log(response);
  } catch (error) {
    console.error(`\nAn error occurred during chain execution: ${error}`);
  }
}

// Run the example
const testTopic = "The history of space exploration";
runParallelExample(testTopic);
```

### Parallel Agents with State Management

### 带状态管理的并行智能体

This example demonstrates how to implement a research agent system with parallel execution and state aggregation:

此示例展示了如何实现具有并行执行和状态聚合的研究智能体系统：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

// --- Configuration ---
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
});

// --- Define Researcher Sub-Agents (to run in parallel) ---

// Researcher 1: Renewable Energy
const researcherAgent1 = async (topic) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an AI Research Assistant specializing in energy.
Research the latest advancements in '{topic}'.
Summarize your key findings concisely (1-2 sentences). Output *only* the summary.`],
    ["user", "Topic: {topic}"],
  ]);

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ topic });
};

// Researcher 2: Electric Vehicles
const researcherAgent2 = async (topic) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an AI Research Assistant specializing in transportation.
Research the latest developments in '{topic}'.
Summarize your key findings concisely (1-2 sentences). Output *only* the summary.`],
    ["user", "Topic: {topic}"],
  ]);

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ topic });
};

// Researcher 3: Carbon Capture
const researcherAgent3 = async (topic) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an AI Research Assistant specializing in climate solutions.
Research the current state of '{topic}'.
Summarize your key findings concisely (1-2 sentences). Output *only* the summary.`],
    ["user", "Topic: {topic}"],
  ]);

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ topic });
};

// --- Parallel Execution (Fan-out) ---
async function runParallelResearch(topic) {
  console.log(`\n--- Running Parallel Research for Topic: '${topic}' ---`);

  // Execute all researchers in parallel
  const parallelResults = await new RunnableParallel({
    renewableEnergy: () => researcherAgent1(topic),
    evTechnology: () => researcherAgent2(topic),
    carbonCapture: () => researcherAgent3(topic),
  }).invoke();

  return parallelResults;
}

// --- Merger Agent (Fan-in / Synthesis) ---
async function runMergerAgent(results) {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an AI Assistant responsible for combining research findings into a structured report.
Your primary task is to synthesize the following research summaries, clearly attributing findings to their source areas.

**Crucially: Your entire response MUST be grounded *exclusively* on the information provided below.**
Do NOT add any external knowledge or details not present in these specific summaries.

**Input Summaries:**
* **Renewable Energy:** {renewableEnergy}
* **Electric Vehicles:** {evTechnology}
* **Carbon Capture:** {carbonCapture}

Output a structured report with headings for each topic.`],
    ["user", "Please synthesize these findings."],
  ]);

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke(results);
}

// --- Main Pipeline (Sequential) ---
async function runResearchPipeline(topic) {
  try {
    // Step 1: Run parallel research
    const parallelResults = await runParallelResearch(topic);

    // Step 2: Run merger agent to synthesize results
    const finalReport = await runMergerAgent(parallelResults);

    console.log("\n--- Final Synthesis Report ---");
    console.log(finalReport);
  } catch (error) {
    console.error(`\nAn error occurred during pipeline execution: ${error}`);
  }
}

// Run the pipeline
const testTopic = "sustainable technology advancements";
runResearchPipeline(testTopic);
```

### Investment Agent: Multi-Source Information Gathering

### 投资智能体：多源信息收集与研究

This example demonstrates how to implement the first pattern: gathering information from multiple independent sources (fundamental, sentiment, technical analysis) in parallel.

此示例展示如何实现第一个模式：并行从多个独立来源（基本面、情绪、技术面）收集信息。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

// --- Configuration ---
const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });
const strongLLM = new ChatOpenAI({ model: "gpt-4o", temperature: 0.3 });

// --- Define Specialized Research Sub-Agents ---

// 1. Fundamental Analysis Agent
const fundamentalAnalysisAgent = async (symbol) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Fundamental Analysis Expert.
Research the fundamental data for {symbol}.
Include: P/E ratio, revenue growth, profit margins, debt levels, and key financial metrics.
Provide a concise analysis (2-3 sentences).`],
    ["user", "Analyze {symbol} fundamentals:"],
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ symbol });
};

// 2. Sentiment Analysis Agent
const sentimentAnalysisAgent = async (symbol) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Market Sentiment Analyst.
Analyze the market sentiment for {symbol} based on recent news and social media.
Include: recent news themes, social media trends, analyst ratings, and investor sentiment.
Provide a concise analysis (2-3 sentences).`],
    ["user", "Analyze {symbol} sentiment:"],
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ symbol });
};

// 3. Technical Analysis Agent
const technicalAnalysisAgent = async (symbol) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Technical Analysis Expert.
Analyze the technical indicators for {symbol}.
Include: key support/resistance levels, moving averages, RSI, MACD, and volume trends.
Provide a concise analysis (2-3 sentences).`],
    ["user", "Analyze {symbol} technically:"],
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ symbol });
};

// --- Parallel Information Gathering (Fan-out) ---
async function gatherInvestmentInfo(symbol) {
  console.log(`\n--- Gathering Investment Info for ${symbol} in Parallel ---`);

  // Execute all three analyses in parallel
  const parallelResults = await new RunnableParallel({
    fundamental: () => fundamentalAnalysisAgent(symbol),
    sentiment: () => sentimentAnalysisAgent(symbol),
    technical: () => technicalAnalysisAgent(symbol),
  }).invoke();

  return parallelResults;
}

// --- Synthesis Agent (Fan-in) ---
async function synthesizeInvestmentReport(symbol, results) {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Senior Investment Analyst. Create a comprehensive investment report for {symbol}.

**Fundamental Analysis:**
{fundamental}

**Sentiment Analysis:**
{sentiment}

**Technical Analysis:**
{technical}

Synthesize these three perspectives into a coherent investment recommendation.
Highlight any contradictions between the analyses (e.g., strong fundamentals but negative sentiment).
Provide a final rating: BUY / HOLD / SELL with rationale.`],
    ["user", "Create investment report:"],
  ]);

  const chain = prompt.pipe(strongLLM).pipe(new StringOutputParser());
  return chain.invoke({
    symbol,
    fundamental: results.fundamental,
    sentiment: results.sentiment,
    technical: results.technical,
  });
}

// --- Complete Investment Analysis Pipeline ---
async function analyzeStock(symbol) {
  try {
    // Step 1: Gather information from all sources in parallel
    const infoResults = await gatherInvestmentInfo(symbol);

    // Step 2: Synthesize into a final investment report
    const finalReport = await synthesizeInvestmentReport(symbol, infoResults);

    console.log("\n--- Final Investment Report ---");
    console.log(finalReport);
  } catch (error) {
    console.error(`Error analyzing ${symbol}:`, error);
  }
}

// Run the investment analysis
analyzeStock("TSLA");
```

### Investment Agent: Multi-Asset Comparison

### 投资智能体：多资产对比分析

This example demonstrates the second pattern: comparing multiple assets in parallel using decomposed sub-queries.

此示例展示第二个模式：使用分解的子查询并行比较多个资产。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });
const strongLLM = new ChatOpenAI({ model: "gpt-4o", temperature: 0.3 });

// --- Sub-Query Agents for Asset Comparison ---

// Agent A: Research Microsoft's AI strategy and financials
const researchMicrosoft = async (query) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `Research Microsoft (MSFT) based on the following query:
{query}

Provide key findings about their AI investments, financial health, and competitive positioning.`],
    ["user", "Research query:"],
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ query });
};

// Agent B: Research Apple's AI strategy and financials
const researchApple = async (query) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `Research Apple (AAPL) based on the following query:
{query}

Provide key findings about their AI investments, financial health, and competitive positioning.`],
    ["user", "Research query:"],
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ query });
};

// --- Parallel Asset Research (Fan-out) ---
async function compareAssets(assetA, assetB, comparisonCriteria) {
  console.log(`\n--- Comparing ${assetA} vs ${assetB} in Parallel ---`);

  // Parallel research on both assets
  const results = await new RunnableParallel({
    assetA: () => researchMicrosoft(comparisonCriteria),
    assetB: () => researchApple(comparisonCriteria),
  }).invoke();

  return {
    assetA: { name: assetA, research: results.assetA },
    assetB: { name: assetB, research: results.assetB },
  };
}

// --- Comparison Synthesis Agent ---
async function synthesizeComparison(results) {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an Investment Comparison Analyst. Compare the following two assets:

**{assetA}:**
{researchA}

**{assetB}:**
{researchB}

Provide a detailed comparison covering:
1. AI Strategy and Investments
2. Financial Health
3. Competitive Positioning
4. Investment Recommendation with rationale`],
    ["user", "Create comparison report:"],
  ]);

  const chain = prompt.pipe(strongLLM).pipe(new StringOutputParser());
  return chain.invoke({
    assetA: results.assetA.name,
    researchA: results.assetA.research,
    assetB: results.assetB.name,
    researchB: results.assetB.research,
  });
}

// --- Complete Comparison Pipeline ---
async function runAssetComparison() {
  const comparisonQuery = "AI investment布局、研发支出、财务健康度、竞争优势分析";

  try {
    // Step 1: Parallel research on both assets
    const researchResults = await compareAssets("Microsoft (MSFT)", "Apple (AAPL)", comparisonQuery);

    // Step 2: Synthesize comparison
    const finalComparison = await synthesizeComparison(researchResults);

    console.log("\n--- Final Comparison Report ---");
    console.log(finalComparison);
  } catch (error) {
    console.error("Error during comparison:", error);
  }
}

runAssetComparison();
```

### Investment Agent: Concurrent Data Processing

### 投资智能体：并发数据处理与验证

This example demonstrates the third pattern: applying multiple analysis chains to the same document simultaneously.

此示例展示第三个模式：同时对同一文档应用多个分析链。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });

// Sample research report text
const sampleReport = `
Apple Inc. (AAPL) reported Q4 2024 earnings with revenue of $94.9 billion,
up 8% year-over-year. Services revenue reached $23.1 billion, a new record.
The company announced plans to invest $500 billion in US infrastructure over 4 years.
iPhone sales grew 6% despite global smartphone market slowdown.
However, regulatory challenges in EU and China remain concerns.
Management expressed optimism about AI features coming to iPhone.
Operating margin improved to 28.5%, driven by services mix.
`;

// --- Define Parallel Processing Chains ---

// Chain 1: Extract Financial Metrics
const extractFinancials = async (report) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `Extract key financial metrics from this earnings report:
{report}

Return: Revenue, Growth rate, Profit margin, Operating margin, Key highlights.`],
    ["user", "Extract financials:"],
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ report });
};

// Chain 2: Identify Risk Factors
const identifyRisks = async (report) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `Identify potential risk factors from this earnings report:
{report}

Return: Regulatory risks, Market risks, Operational risks, Competitive risks.`],
    ["user", "Identify risks:"],
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ report });
};

// Chain 3: Sentiment Analysis on Management Tone
const analyzeTone = async (report) => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `Analyze the tone and sentiment of management's comments in this report:
{report}

Return: Overall sentiment (Bullish/Neutral/Bearish), Key confidence indicators, Concerns mentioned.`],
    ["user", "Analyze tone:"],
  ]);
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  return chain.invoke({ report });
};

// --- Parallel Processing (Fan-out) ---
async function processReportInParallel(report) {
  console.log("\n--- Processing Report with Multiple Analysis Chains ---");

  // Execute all three analysis chains in parallel on the same document
  const results = await new RunnableParallel({
    financials: () => extractFinancials(report),
    risks: () => identifyRisks(report),
    sentiment: () => analyzeTone(report),
  }).invoke();

  return results;
}

// --- Complete Processing Pipeline ---
async function analyzeEarningsReport() {
  try {
    // Process the report in parallel
    const analysisResults = await processReportInParallel(sampleReport);

    console.log("\n=== Analysis Results ===");
    console.log("\n--- Financials ---");
    console.log(analysisResults.financials);
    console.log("\n--- Risk Factors ---");
    console.log(analysisResults.risks);
    console.log("\n--- Sentiment Analysis ---");
    console.log(analysisResults.sentiment);
  } catch (error) {
    console.error("Error processing report:", error);
  }
}

analyzeEarningsReport();
```

### Investment Agent: Complete System with Fan-in/Fan-out

### 投资智能体：完整的扇出/扇入系统

This example demonstrates the complete investment agent system combining all four patterns: parallel gathering, processing, and synthesis.

此示例展示完整的投资智能体系统，结合所有四个模式：并行收集、处理和综合。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

// --- Configuration ---
const researchLLM = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });
const synthesisLLM = new ChatOpenAI({ model: "gpt-4o", temperature: 0.3 });

// --- Complete Investment Agent Class ---
class InvestmentAgent {
  constructor(symbol) {
    this.symbol = symbol;
    this.sessionState = {};
  }

  // Phase 1: Parallel Information Gathering (Fan-out)
  async gatherInformation() {
    console.log(`\n[Phase 1] Gathering information for ${this.symbol}...`);

    const gatherChain = new RunnableParallel({
      // Parallel data collection from multiple sources
      fundamentals: async () => {
        const prompt = ChatPromptTemplate.fromMessages([
          ["system", `Analyze fundamentals for {symbol}. Include: P/E, revenue, growth, margins.`],
          ["user", "Fundamental analysis:"],
        ]);
        return prompt.pipe(researchLLM).pipe(new StringOutputParser()).invoke({ symbol: this.symbol });
      },
      sentiment: async () => {
        const prompt = ChatPromptTemplate.fromMessages([
          ["system", `Analyze market sentiment for {symbol}. Include: news, social, analyst views.`],
          ["user", "Sentiment analysis:"],
        ]);
        return prompt.pipe(researchLLM).pipe(new StringOutputParser()).invoke({ symbol: this.symbol });
      },
      technical: async () => {
        const prompt = ChatPromptTemplate.fromMessages([
          ["system", `Analyze technicals for {symbol}. Include: trends, indicators, levels.`],
          ["user", "Technical analysis:"],
        ]);
        return prompt.pipe(researchLLM).pipe(new StringOutputParser()).invoke({ symbol: this.symbol });
      },
    });

    const results = await gatherChain.invoke();
    this.sessionState.gatheredData = results;
    console.log("[Phase 1] Complete - Data gathered in parallel");
    return results;
  }

  // Phase 2: Process and Validate Data (Parallel Processing)
  async processData() {
    console.log(`\n[Phase 2] Processing and validating data...`);

    const gathered = this.sessionState.gatheredData;

    const processChain = new RunnableParallel({
      // Validate fundamentals against sentiment
      crossValidation: async () => {
        const prompt = ChatPromptTemplate.fromMessages([
          ["system", `Cross-validate: Fundamentals say {fundamentals}. Sentiment says {sentiment}. Identify contradictions.`],
          ["user", "Validate:"],
        ]);
        return prompt.pipe(researchLLM).pipe(new StringOutputParser()).invoke({
          fundamentals: gathered.fundamentals,
          sentiment: gathered.sentiment,
        });
      },
      // Generate investment thesis
      thesis: async () => {
        const prompt = ChatPromptTemplate.fromMessages([
          ["system", `Based on fundamentals: {fundamentals}, technicals: {technical}, create investment thesis.`],
          ["user", "Generate thesis:"],
        ]);
        return prompt.pipe(researchLLM).pipe(new StringOutputParser()).invoke({
          fundamentals: gathered.fundamentals,
          technical: gathered.technical,
        });
      },
    });

    const results = await processChain.invoke();
    this.sessionState.processedData = results;
    console.log("[Phase 2] Complete - Data processed and validated");
    return results;
  }

  // Phase 3: Synthesis and Merger (Fan-in)
  async synthesize() {
    console.log(`\n[Phase 3] Synthesizing final report...`);

    const gathered = this.sessionState.gatheredData;
    const processed = this.sessionState.processedData;

    const synthesisPrompt = ChatPromptTemplate.fromMessages([
      ["system", `Create a comprehensive investment report for {symbol}.

**Fundamental Analysis:**
{fundamentals}

**Sentiment Analysis:**
{sentiment}

**Technical Analysis:**
{technical}

**Cross-Validation:**
{crossValidation}

**Investment Thesis:**
{thesis}

Provide:
1. Executive Summary
2. Investment Rating (BUY/HOLD/SELL)
3. Key Risks
4. Price Target Rationale
5. Time Horizon Recommendation`],
      ["user", "Create final report:"],
    ]);

    const finalReport = await synthesisPrompt
      .pipe(synthesisLLM)
      .pipe(new StringOutputParser())
      .invoke({
        symbol: this.symbol,
        fundamentals: gathered.fundamentals,
        sentiment: gathered.sentiment,
        technical: gathered.technical,
        crossValidation: processed.crossValidation,
        thesis: processed.thesis,
      });

    console.log("[Phase 3] Complete - Final report synthesized");
    return finalReport;
  }

  // Main分析方法 - orchestrates all phases
  async analyze() {
    console.log(`\n========================================`);
    console.log(`Starting Investment Analysis: ${this.symbol}`);
    console.log(`========================================`);

    try {
      await this.gatherInformation();
      await this.processData();
      const report = await this.synthesize();

      console.log(`\n========================================`);
      console.log(`Investment Analysis Complete for ${this.symbol}`);
      console.log(`========================================`);
      console.log(report);

      return report;
    } catch (error) {
      console.error("Analysis failed:", error);
      throw error;
    }
  }

  // Compare方法 - for multi-asset comparison
  async compare(otherSymbol) {
    console.log(`\n========================================`);
    console.log(`Comparing ${this.symbol} vs ${otherSymbol}`);
    console.log(`========================================`);

    // Parallel comparison
    const comparison = await new RunnableParallel({
      assetA: () => this.analyze(),
      assetB: async () => {
        const other = new InvestmentAgent(otherSymbol);
        return other.analyze();
      },
    }).invoke();

    return comparison;
  }
}

// --- Usage Examples ---

// Example 1: Single stock analysis
async function analyzeSingleStock() {
  const agent = new InvestmentAgent("TSLA");
  await agent.analyze();
}

// Example 2: Multi-asset comparison
async function compareStocks() {
  const agent = new InvestmentAgent("MSFT");
  await agent.compare("AAPL");
}

// Run single stock analysis
analyzeSingleStock();
```

### Key Takeaways

### 关键要点

- **Parallelization** enables executing independent tasks concurrently to improve efficiency.

- **并行化**使能够同时执行独立任务以提高效率。

- It is particularly useful when tasks involve waiting for external resources, such as API calls.

- 它在任务涉及等待外部资源（如API调用）时特别有用。

- The adoption of a concurrent or parallel architecture introduces substantial complexity and cost, impacting debugging and maintenance.

- 采用并发或并行架构会引入大量复杂性和成本，影响调试和维护。

- LangChain's LCEL (LangChain Expression Language) provides `RunnableParallel` for easy parallel execution.

- LangChain的LCEL（LangChain表达式语言）提供`RunnableParallel`以便于并行执行。

- The **Fan-out/Fan-in** pattern (parallel execution followed by aggregation) is a common approach for parallel agent systems.

- **扇出/扇入**模式（并行执行后进行聚合）是并行智能体系统的常见方法。

- Parallelization helps reduce overall latency and makes agentic systems more responsive for complex tasks.

- 并行化有助于减少总体延迟，使智能体系统在处理复杂任务时更具响应性。

### Conclusion

### 结论

The parallelization pattern is a method for optimizing computational resources and reducing latency in agentic workflows by executing independent tasks simultaneously.

并行化模式是一种通过同时执行独立任务来优化计算资源并减少智能体工作流延迟的方法。

By identifying tasks that can run concurrently—such as multiple API calls, data processing, or content generation—and aggregating their results, agents can dramatically improve their throughput and responsiveness.

通过识别可以并发运行的任务（如多个API调用、数据处理或内容生成）并聚合其结果，智能体可以显著提高其吞吐量和响应能力。

This pattern, when combined with sequential chains and routing mechanisms, forms the foundation for building sophisticated, efficient, and scalable agentic systems.

此模式与顺序链和路由机制相结合，为构建复杂、高效和可扩展的智能体系统奠定了基础。
