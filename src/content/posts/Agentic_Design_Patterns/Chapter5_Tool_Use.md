---
title: 'Chapter 5: Tool Use'
date: '2026-03-15'
excerpt: 'One of the most powerful capabilities of agentic systems is their ability to interact with external tools and services. 融合社区洞察与最新实践，涵盖 MCP 标准化、可靠性研究及行业领袖观点。'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 5: Tool Use

# 第五章：工具使用

## Tool Use Pattern Overview

## 工具使用模式概述

One of the most powerful capabilities of agentic systems is their ability to interact with external tools and services.

智能体系统最强大的能力之一是它们与外部工具和服务交互的能力。

Tool use enables agents to extend beyond their internal knowledge and capabilities, accessing real-time information, performing computations, and manipulating external systems.

工具使用使智能体能够超越其内部知识和能力，获取实时信息、执行计算和操作外部系统。

This pattern is fundamental to creating agents that can truly act in the world.

这种模式是创建能够在世界中真正行动的智能体的基础。

### What Are Tools?

### 什么是工具？

In the context of agentic systems, a tool is any capability that an agent can invoke to perform a specific action beyond simple text generation.

在智能体系统的上下文中，工具是智能体可以调用来执行超出简单文本生成的特定操作的能力。

Common types of tools include:

常见的工具类型包括：

- **Search**: Accessing search engines or internal knowledge bases.

- **搜索**: 访问搜索引擎或内部知识库。

- **APIs**: Interacting with external services (e.g., weather APIs, financial data APIs).

- **API**: 与外部服务交互（如天气API、金融数据API）。

- **Database Queries**: Retrieving or storing information in databases.

- **数据库查询**: 在数据库中检索或存储信息。

- **Code Execution**: Running code to perform computations or tests.

- **代码执行**: 运行代码以执行计算或测试。

- **File Operations**: Reading from or writing to files.

- **文件操作**: 读取或写入文件。

- **Physical Actions**: Controlling robots or other physical devices (in more advanced implementations).

- **物理操作**: 控制机器人或其他物理设备（在更高级的实现中）。

### How Tool Use Works

### 工具使用如何工作

The tool use pattern typically follows this flow:

工具使用模式通常遵循以下流程：

1. **Task Analysis**: The agent analyzes the user's request to determine what actions are needed.

1. **任务分析**: 智能体分析用户的请求以确定需要什么操作。

1. **Tool Selection**: The agent selects the appropriate tool(s) from its available toolkit.

1. **工具选择**: 智能体从其可用工具包中选择适当的工具。

1. **Parameter Preparation**: The agent prepares the parameters needed to invoke the tool.

1. **参数准备**: 智能体准备调用工具所需的参数。

1. **Execution**: The tool is invoked and returns results.

1. **执行**: 工具被调用并返回结果。

1. **Response Integration**: The agent integrates the tool's output into its final response.

1. **响应集成**: 智能体将工具的输出集成到其最终响应中。

### Tool Definition and Registration

### 工具定义和注册

Tools must be properly defined and registered with the agent system.

工具必须正确定义并注册到智能体系统中。

This typically involves specifying:

这通常涉及指定：

- The tool's name and description

- 工具的名称和描述

- The parameters the tool accepts

- 工具接受的参数

- What the tool returns

- 工具返回什么

- Any constraints or limitations

- 任何约束或限制

## Practical Applications & Use Cases

## 实际应用和用例

### Information Retrieval

### 信息检索

Agents can use search tools to access up-to-date information that may not be in their training data.

智能体可以使用搜索工具访问可能不在其训练数据中的最新信息。

This is crucial for tasks requiring current events, specific facts, or domain-specific knowledge.

对于需要时事、特定事实或领域特定知识的任务至关重要。

### Computation

### 计算

Agents can use calculators, code interpreters, or other computational tools to perform precise calculations that LLMs typically struggle with.

智能体可以使用计算器、代码解释器或其他计算工具来执行LLM通常难以处理的精确计算。

### Automation

### 自动化

By interfacing with external systems through APIs, agents can automate complex workflows that involve multiple systems.

通过API与外部系统接口，智能体可以自动化涉及多个系统的复杂工作流。

For example, an agent might create calendar events, send emails, or manage tasks in project management software.

例如，智能体可能会创建日历事件、发送电子邮件或在项目管理软件中管理任务。

---

## Hands-On Code Examples

## 实践代码示例

The following code examples demonstrate how to implement tool use patterns in JavaScript using LangChain:

以下代码示例展示如何使用 LangChain 在 JavaScript 中实现工具使用模式：

### Tool Definition and Registration

### 工具定义和注册

This example shows how to define and register tools for an agent:

此示例展示如何为智能体定义和注册工具：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { Tool } from '@langchain/core/tools';
import { z } from 'zod';

// --- Define Custom Tools ---

// Tool 1: Weather Search
const weatherTool = new Tool({
  name: 'weather_search',
  description:
    'Search for current weather information in a specific city. Input should be a city name.',
  func: async (city) => {
    // In production, this would call a real weather API
    const weatherData = {
      'New York': { temp: '72°F', condition: 'Sunny', humidity: '45%' },
      London: { temp: '58°F', condition: 'Rainy', humidity: '78%' },
      Tokyo: { temp: '68°F', condition: 'Cloudy', humidity: '60%' },
    };
    return JSON.stringify(weatherData[city] || { error: 'City not found' });
  },
});

// Tool 2: Stock Price Lookup
const stockTool = new Tool({
  name: 'stock_price_lookup',
  description:
    'Get current stock price for a given ticker symbol. Input should be a stock symbol like AAPL, GOOGL, MSFT.',
  func: async (ticker) => {
    // In production, this would call a real stock API
    const stockData = {
      AAPL: { price: 178.52, change: '+1.2%', volume: '52.3M' },
      GOOGL: { price: 141.8, change: '-0.5%', volume: '21.1M' },
      MSFT: { price: 378.91, change: '+0.8%', volume: '18.7M' },
    };
    return JSON.stringify(stockData[ticker.toUpperCase()] || { error: 'Ticker not found' });
  },
  schema: z.string(),
});

// Tool 3: Calculator
const calculatorTool = new Tool({
  name: 'calculator',
  description:
    "Perform mathematical calculations. Input should be a mathematical expression like '2 + 2' or 'sqrt(16)'.",
  func: async (expression) => {
    try {
      // WARNING: eval() is used here for demonstration only. In production, use a safe math parser.
      const result = eval(expression);
      return JSON.stringify({ expression, result });
    } catch (error) {
      return JSON.stringify({ error: 'Invalid expression' });
    }
  },
});

// --- Bind Tools to LLM ---
const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

const llmWithTools = llm.bind({
  tools: [weatherTool, stockTool, calculatorTool],
});

// --- Run Tool-Enabled Agent ---
async function runToolExample(userQuery) {
  console.log(`\n--- Running Tool Example for Query: '${userQuery}' ---`);

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are a helpful assistant with access to tools. Use them when needed.'],
    ['user', '{query}'],
  ]);

  const chain = prompt.pipe(llmWithTools);

  const response = await chain.invoke({ query: userQuery });

  console.log('\n--- Response ---');
  console.log(response.content);

  // Check if the model wants to call a tool
  if (response.tool_calls && response.tool_calls.length > 0) {
    console.log('\n--- Tool Calls Requested ---');
    for (const toolCall of response.tool_calls) {
      console.log(`- Tool: ${toolCall.name}`);
      console.log(`  Args: ${JSON.stringify(toolCall.args)}`);
    }
  }
}

// Test queries
runToolExample("What's the weather like in New York?");
runToolExample("What's the current price of AAPL?");
runToolExample('Calculate 15 * 23 + 50');
```

### Tool Execution with Agents

### 智能体的工具执行

This example demonstrates how to create an agent that can autonomously decide when and how to use tools:

此示例展示如何创建一个能够自主决定何时以及如何使用工具的智能体：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { Tool } from '@langchain/core/tools';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';

// --- Define Tools ---

// Search Tool
const searchTool = new Tool({
  name: 'web_search',
  description: 'Search the web for information. Input should be a search query.',
  func: async (query) => {
    // In production, integrate with Google, Bing, or other search APIs
    return `Search results for "${query}": [Mock results - In production, this would return real search results]`;
  },
});

// Calculator Tool
const calculatorTool = new Tool({
  name: 'calculator',
  description: 'Perform mathematical calculations.',
  func: async (expression) => {
    try {
      const result = eval(expression);
      return JSON.stringify({ expression, result });
    } catch {
      return JSON.stringify({ error: 'Invalid expression' });
    }
  },
});

// --- Create Agent with Tools ---

const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0,
});

// Define the prompt template
const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are a helpful research assistant.
You have access to the following tools:
- web_search: Search the web for information
- calculator: Perform mathematical calculations

Use tools when necessary to answer user questions. Always show your reasoning.`,
  ],
  ['human', '{input}'],
  ['placeholder', '{agent_scratchpad}'],
]);

// Create the agent
const agent = await createOpenAIFunctionsAgent({
  llm,
  tools: [searchTool, calculatorTool],
  prompt,
});

// Create the executor
const agentExecutor = new AgentExecutor({
  agent,
  tools: [searchTool, calculatorTool],
});

// --- Run the Agent ---
async function runAgentQuery(query) {
  console.log(`\n--- Running Agent Query: '${query}' ---`);

  try {
    const result = await agentExecutor.invoke({ input: query });

    console.log('\n--- Agent Response ---');
    console.log(result.output);
  } catch (error) {
    console.error(`\nAn error occurred: ${error}`);
  }
}

// Test queries
runAgentQuery('What is the population of Tokyo?');
runAgentQuery(
  'If I have $10,000 invested at 7% annual interest for 5 years, how much will I have?',
);
runAgentQuery('What are the latest developments in AI?');
```

### Multi-Tool Orchestration

### 多工具编排

This example shows how to orchestrate multiple tools for complex workflows:

此示例展示如何为复杂工作流编排多个工具：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { Tool } from '@langchain/core/tools';
import { RunnableParallel } from '@langchain/core/runnables';

// --- Define Tools ---

const getStockPrice = new Tool({
  name: 'get_stock_price',
  description: 'Get the current stock price for a given ticker symbol.',
  func: async (ticker) => {
    const prices = {
      AAPL: 178.52,
      GOOGL: 141.8,
      MSFT: 378.91,
      AMZN: 178.25,
      TSLA: 248.5,
    };
    const price = prices[ticker.toUpperCase()];
    return price ? `$${price}` : 'Ticker not found';
  },
});

const getStockNews = new Tool({
  name: 'get_stock_news',
  description: 'Get recent news headlines for a given stock ticker.',
  func: async (ticker) => {
    // In production, call a news API
    const news = {
      AAPL: ['Apple announces new AI features', 'iPhone sales exceed expectations'],
      GOOGL: ['Google Cloud growth accelerates', 'AI investments pay off'],
      MSFT: ['Microsoft Teams reaches 300M users', 'Azure revenue up 29%'],
    };
    const headlines = news[ticker.toUpperCase()] || ['No recent news found'];
    return headlines.map((h, i) => `${i + 1}. ${h}`).join('\n');
  },
});

const getFinancialMetrics = new Tool({
  name: 'get_financial_metrics',
  description: 'Get key financial metrics for a stock (P/E ratio, EPS, etc.).',
  func: async (ticker) => {
    const metrics = {
      AAPL: { peRatio: 28.5, eps: 6.26, marketCap: '2.8T' },
      GOOGL: { peRatio: 24.2, eps: 5.86, marketCap: '1.7T' },
      MSFT: { peRatio: 35.1, eps: 10.81, marketCap: '2.8T' },
    };
    return JSON.stringify(metrics[ticker.toUpperCase()] || { error: 'Metrics not found' });
  },
});

// --- Parallel Tool Execution ---

async function analyzeStock(ticker) {
  console.log(`\n--- Analyzing Stock: ${ticker} ---`);

  // Execute all tools in parallel (Fan-out)
  const parallelTools = new RunnableParallel({
    price: () => getStockPrice.invoke(ticker),
    news: () => getStockNews.invoke(ticker),
    metrics: () => getFinancialMetrics.invoke(ticker),
  });

  const results = await parallelTools.invoke();

  console.log('\n--- Tool Results ---');
  console.log('Price:', results.price);
  console.log('News:', results.news);
  console.log('Metrics:', results.metrics);

  return results;
}

// --- Synthesis with LLM ---

const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

async function generateStockReport(ticker, data) {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a financial analyst. Based on the following data for {ticker}, provide a brief investment summary.`,
    ],
    ['user', `Stock: {ticker}\nPrice: {price}\nNews: {news}\nMetrics: {metrics}`],
  ]);

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  const report = await chain.invoke({
    ticker,
    price: data.price,
    news: data.news,
    metrics: data.metrics,
  });

  return report;
}

// --- Main Pipeline ---

async function stockAnalysisPipeline(ticker) {
  // Step 1: Gather data in parallel
  const data = await analyzeStock(ticker);

  // Step 2: Generate synthesis report
  const report = await generateStockReport(ticker, data);

  console.log('\n--- Final Investment Report ---');
  console.log(report);
}

// Run the pipeline
stockAnalysisPipeline('AAPL');
```

### Key Takeaways

### 关键要点

- **Tools** extend agent capabilities beyond internal knowledge, enabling real-world interactions.

- **工具**扩展了智能体的能力，使其能够进行超越内部知识的真实世界交互。

- Tools must be properly defined with names, descriptions, and parameter schemas.

- 工具必须正确定义，包括名称、描述和参数模式。

- The agent autonomously decides when and which tools to use based on user queries.

- 智能体根据用户查询自主决定何时使用以及使用哪些工具。

- The **Fan-out/Fan-in** pattern (parallel tool execution followed by synthesis) is effective for complex analysis tasks.

- **扇出/扇入**模式（并行工具执行后进行综合）对于复杂分析任务非常有效。

- LangChain provides `Tool`, `createOpenAIFunctionsAgent`, and `AgentExecutor` for building tool-enabled agents.

- LangChain 提供 `Tool`、`createOpenAIFunctionsAgent` 和 `AgentExecutor` 来构建支持工具的智能体。

- Always validate tool inputs and handle errors gracefully for robust agent systems.

- 始终验证工具输入并优雅地处理错误，以构建健壮的智能体系统。

### 投资智能体

在投资场景中，一个智能体（Agent）要完成从信息收集、逻辑推理到交易执行的完整闭环，通常需要注册以下几类核心工具（Tools / Function Calling）：

**1. 数据获取与信息检索工具 (Data Gathering & Retrieval Tools)**

- **股票市场数据 API (Stock Market Data API)**：这是最基础的工具，用于获取实时的股票报价和历史数据。例如，当用户询问“AAPL 的当前价格是多少？”时，智能体会调用此工具来获取确切数值。
- **网络搜索与资讯 API (Web Search API)**：用于抓取最新的财经新闻、宏观经济事件以分析市场情绪（例如注册框架内置的 Google Search 工具）。
- **内部知识库/RAG 检索工具**：用于深度分析。智能体需要通过检索工具查询公司披露的财务报告、此前的预算数据（如“Alpha 项目的第一季度预算是多少？”），或者利用 GraphRAG 进行复杂的金融实体关系分析。

**2. 分析与精确计算工具 (Analysis & Calculation Tools)**

- **计算器函数 (Calculator Function)**：大语言模型（LLM）本身不擅长精确的数学运算。在涉及资金组合分配、利润率计算时（例如“计算以 150 美元买入 100 股的潜在利润”），智能体必须调用外部计算器工具以确保绝对准确。
- **代码执行环境 (Code Interpreter/Executor)**：针对复杂的金融量化分析、技术指标回测，智能体需要注册代码执行工具（如 Python 沙盒），使其能够动态编写和运行代码来得出分析结果。
- **电子表格处理工具 (Spreadsheet Tool)**：用于读取或操作大量的结构化金融表格数据。

**3. 交易执行与操作系统 (Execution Tools)**

- **交易执行 API (Trading API)**：为了让智能体具备真正的“行动力”，需要接入券商或金融服务的交易 API。这使得智能体在分析完市场数据后，可以直接执行买入、卖出或平仓等金融操作。例如，根据预设规则（“如果股票下跌 10% 则自动卖出”），智能体会调用该 API 瞬间执行交易。

**4. 安全风控与人工协作工具 (Safety & HITL Tools)**

- **人工干预/升级工具 (Escalation to Human)**：金融投资属于高风险领域，必须引入“人在环路中（HITL）”的机制。当智能体遇到极度模糊的市场行情、涉及巨额资金或触碰风控护栏时，它需要调用升级工具（如 `escalate_to_human` 函数）停止自主操作，将决策权转交给人类财务分析师或审查员。

总结来说，为了打破 LLM 静态知识的局限并赋予其在真实金融世界中的操作能力，一个完整的投资 Agent 通常需要通过工具调用（Function Calling）或 MCP（模型上下文协议）机制，注册**行情数据、计算器、代码解释器、交易接口以及人工升级机制**这几大类工具。

### Investment Agent: Data Gathering & Retrieval Tools

### 投资智能体：数据获取与信息检索工具

This example demonstrates the first category: implementing data gathering and retrieval tools for investment agents.

此示例展示第一个类别：为投资智能体实现数据获取和信息检索工具。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Tool } from "@langchain/core/tools";

// --- 1. Stock Market Data API Tool ---
const stockMarketDataTool = new Tool({
  name: "get_stock_price",
  description: "Get real-time stock price and market data. Input: stock ticker symbol (e.g., AAPL, TSLA).",
  async func(symbol) {
    // Simulated stock data - in production, call real market data API
    const marketData = {
      AAPL: { price: 178.52, change: "+1.2%", volume: "52.3M", high: 180.1, low: 176.8 },
      TSLA: { price: 248.50, change: "-2.3%", volume: "89.1M", high: 255.0, low: 245.2 },
      MSFT: { price: 378.91, change: "+0.8%", volume: "18.7M", high: 380.5, low: 375.2 },
    };
    const data = marketData[symbol.toUpperCase()];
    return data ? JSON.stringify(data) : JSON.stringify({ error: "Symbol not found" });
  },
});

// --- 2. Web Search API Tool ---
const webSearchTool = new Tool({
  name: "search_financial_news",
  description: "Search for latest financial news and market information. Input: search query.",
  async func(query) {
    // Simulated news search - in production, integrate with Google/Bing API
    const newsResults = {
      "AAPL earnings": "Apple reports Q4 earnings beat, revenue up 8% YoY, iPhone sales strong",
      "TSLA China": "Tesla faces increased competition in China, announces price adjustments",
      "Fed rates": "Federal Reserve signals potential rate cuts in upcoming meetings",
    };
    // Simple keyword matching
    for (const [key, value] of Object.entries(newsResults)) {
      if (query.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    return `News results for "${query}": [In production, return real search results]`;
  },
});

// --- 3. Knowledge Base / RAG Retrieval Tool ---
const knowledgeBaseTool = new Tool({
  name: "query_financial_kb",
  description: "Query internal financial knowledge base for company reports, budget data, or financial analysis. Input: search query.",
  async func(query) {
    // Simulated RAG/knowledge base - in production, use vector database
    const kbData = {
      "Alpha project Q1 budget": "Alpha project Q1 2024 budget: $2.5M allocated, $2.1M spent",
      "AAPL debt": "Apple total debt: $290B, Debt-to-Equity ratio: 1.8x",
      "MSFT cloud revenue": "Microsoft Azure cloud revenue: $21.7B in Q4 2024",
    };
    for (const [key, value] of Object.entries(kbData)) {
      if (query.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    return `Knowledge base results for "${query}": No specific match found`;
  },
});

// --- Bind Tools to LLM ---
const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.3 });
const llmWithTools = llm.bind({
  tools: [stockMarketDataTool, webSearchTool, knowledgeBaseTool],
});

// --- Usage Example ---
async function queryInvestmentAgent(query) {
  console.log(`\n=== Investment Agent Query: ${query} ===`);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an Investment Research Assistant. Use available tools to gather data and answer questions.`],
    ["user", "{query}"],
  ]);

  const chain = prompt.pipe(llmWithTools);
  const response = await chain.invoke({ query });

  console.log("\n--- Response ---");
  console.log(response.content);

  if (response.tool_calls) {
    console.log("\n--- Tools Invoked ---");
    for (const call of response.tool_calls) {
      console.log(`- ${call.name}:`, call.args);
    }
  }
}

// Test queries
queryInvestmentAgent("What's the current price of AAPL?");
queryInvestmentAgent("Search for latest AAPL earnings news");
queryInvestmentAgent("What was the Alpha project Q1 budget?");
```

### Investment Agent: Analysis & Calculation Tools

### 投资智能体：分析与精确计算工具

This example demonstrates the second category: implementing calculator, code interpreter, and spreadsheet tools.

此示例展示第二个类别：实现计算器、代码解释器和电子表格工具。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Tool } from "@langchain/core/tools";

// --- 1. Calculator Tool ---
const calculatorTool = new Tool({
  name: "financial_calculator",
  description: "Perform precise financial calculations. Supports: profit/loss, percentage returns, portfolio allocation. Input: mathematical expression.",
  async func(expression) {
    try {
      // Safe evaluation - in production, use math.js or similar
      // Only allow specific patterns for safety
      const safeEval = (expr) => {
        const sanitized = expr.replace(/[^0-9+\-*/.()%]/g, "");
        return Function(`"use strict"; return (${sanitized})`)();
      };
      const result = safeEval(expression);
      return JSON.stringify({ expression, result, formatted: result.toFixed(2) });
    } catch (error) {
      return JSON.stringify({ error: "Invalid calculation expression" });
    }
  },
});

// --- 2. Code Interpreter / Executor Tool ---
const codeExecutorTool = new Tool({
  name: "run_financial_code",
  description: "Execute Python code for complex financial analysis, technical indicators, backtesting. Input: Python code string.",
  async func(code) {
    // Simulated code execution - in production, use Python sandbox
    console.log("\n[Code Executor] Running code...");

    // Simulate some common financial calculations
    if (code.includes("SMA") || code.includes("moving average")) {
      return JSON.stringify({
        output: "Simple Moving Average calculated",
        result: [100, 102, 105, 108, 110],
        interpretation: "Upward trend detected",
      });
    }
    if (code.includes("RSI")) {
      return JSON.stringify({
        output: "RSI calculated",
        result: 65.5,
        interpretation: "Overbought territory (>70)",
      });
    }

    return JSON.stringify({ output: "Code executed", result: "Simulation complete" });
  },
});

// --- 3. Spreadsheet Tool ---
const spreadsheetTool = new Tool({
  name: "analyze_spreadsheet",
  description: "Read and analyze financial data from spreadsheets. Input: file path or data query.",
  async func(query) {
    // Simulated spreadsheet analysis - in production, use proper spreadsheet API
    const spreadsheetData = {
      "portfolio holdings": [
        { symbol: "AAPL", shares: 100, avgCost: 150, currentPrice: 178.52 },
        { symbol: "MSFT", shares: 50, avgCost: 320, currentPrice: 378.91 },
        { symbol: "GOOGL", shares: 30, avgCost: 130, currentPrice: 141.80 },
      ],
      "expense report": [
        { category: "Marketing", amount: 50000 },
        { category: "R&D", amount: 120000 },
        { category: "Operations", amount: 85000 },
      ],
    };

    for (const [key, value] of Object.entries(spreadsheetData)) {
      if (query.toLowerCase().includes(key.toLowerCase())) {
        return JSON.stringify(value);
      }
    }
    return JSON.stringify({ error: "Data not found" });
  },
});

// --- Agent with Calculation Tools ---
const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.3 });
const llmWithTools = llm.bind({
  tools: [calculatorTool, codeExecutorTool, spreadsheetTool],
});

// --- Usage Example ---
async function runFinancialAnalysis(task) {
  console.log(`\n=== Financial Analysis Task: ${task} ===`);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Financial Analysis Assistant. Use calculation tools to perform precise financial analysis.`],
    ["user", "{task}"],
  ]);

  const chain = prompt.pipe(llmWithTools);
  const response = await chain.invoke({ task });

  console.log("\n--- Analysis Result ---");
  console.log(response.content);
}

// Test calculations
runFinancialAnalysis("Calculate profit for buying 100 shares at $150 and selling at $178.52");
runFinancialAnalysis("Run Python code to calculate 20-day SMA for AAPL");
runFinancialAnalysis("Show me the portfolio holdings spreadsheet data");
```

### Investment Agent: Trading Execution Tools

### 投资智能体：交易执行与操作系统

This example demonstrates the third category: implementing trading execution API tools.

此示例展示第三个类别：实现交易执行 API 工具。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Tool } from "@langchain/core/tools";

// --- Trading API Tool ---
const tradingApiTool = new Tool({
  name: "execute_trade",
  description: "Execute a trade order (BUY/SELL). Parameters: symbol, quantity, orderType (market/limit), price (for limit orders).",
  async func(params) {
    // Parse parameters
    let { symbol, action, quantity, orderType, price } = params;
    try {
      const parsed = typeof params === "string" ? JSON.parse(params) : params;
      symbol = parsed.symbol;
      action = parsed.action || "BUY";
      quantity = parsed.quantity;
      orderType = parsed.orderType || "market";
      price = parsed.price;
    } catch (e) {
      return JSON.stringify({ success: false, error: "Invalid parameters" });
    }

    // Simulate trade execution
    console.log(`\n[Trading API] Executing: ${action} ${quantity} shares of ${symbol} at ${orderType} order`);

    // Simulate execution result
    const executedPrice = orderType === "limit" ? price : 250.0; // Mock market price
    const commission = quantity * executedPrice * 0.001; // 0.1% commission

    return JSON.stringify({
      success: true,
      orderId: `ORD-${Date.now()}`,
      symbol,
      action,
      quantity,
      executedPrice: executedPrice.toFixed(2),
      orderType,
      commission: commission.toFixed(2),
      totalValue: (quantity * executedPrice).toFixed(2),
      status: "FILLED",
      timestamp: new Date().toISOString(),
    });
  },
});

// --- Portfolio Management Tool ---
const portfolioTool = new Tool({
  name: "manage_portfolio",
  description: "Get portfolio positions, account balance, or update portfolio settings. Actions: getPositions, getBalance, updateSettings.",
  async func(params) {
    const { action, ...rest } = typeof params === "string" ? JSON.parse(params) : params;

    if (action === "getPositions") {
      return JSON.stringify({
        positions: [
          { symbol: "AAPL", shares: 100, avgCost: 150, currentValue: 17852 },
          { symbol: "MSFT", shares: 50, avgCost: 320, currentValue: 18945.5 },
        ],
        totalValue: 36797.5,
        cashBalance: 5202.5,
      });
    }

    if (action === "getBalance") {
      return JSON.stringify({
        availableCash: 5202.5,
        buyingPower: 10405.0, // 2x margin
        totalValue: 36797.5,
        totalEquity: 42000.0,
      });
    }

    return JSON.stringify({ error: "Unknown action" });
  },
});

// --- Agent with Trading Tools ---
const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0.3 });
const llmWithTools = llm.bind({
  tools: [tradingApiTool, portfolioTool],
});

// --- Usage Example ---
async function executeTradingCommand(command) {
  console.log(`\n=== Trading Command: ${command} ===`);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an Automated Trading Assistant. Execute trades based on user commands. Use trading tools.`],
    ["user", "{command}"],
  ]);

  const chain = prompt.pipe(llmWithTools);
  const response = await chain.invoke({ command });

  console.log("\n--- Trading Result ---");
  console.log(response.content);
}

// Test trading commands
executeTradingCommand("Buy 100 shares of TSLA at market price");
executeTradingCommand("Show my current positions");
executeTradingCommand("What's my account balance?");
```

### Investment Agent: Safety & HITL Tools

### 投资智能体：安全风控与人工协作工具

This example demonstrates the fourth category: implementing human-in-the-loop (HITL) and escalation tools.

此示例展示第四个类别：实现人工在环(HITL)和升级工具。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Tool } from "@langchain/core/tools";

// --- Risk Assessment Configuration ---
const riskThresholds = {
  maxPositionSize: 10000, // Max $10,000 per trade
  maxDailyLoss: 5000, // Max $5,000 daily loss
  requireApprovalAmount: 5000, // Require human approval for trades > $5,000
  maxPortfolioConcentration: 0.2, // Max 20% in single position
};

// --- 1. Risk Check Tool ---
const riskCheckTool = new Tool({
  name: "check_risk_compliance",
  description: "Check if a trade meets risk management rules. Returns: approved, requires_approval, or rejected.",
  async func(tradeParams) {
    const { symbol, quantity, price, action } = typeof tradeParams === "string" ? JSON.parse(tradeParams) : tradeParams;

    const tradeValue = quantity * price;
    const violations = [];
    let status = "approved";

    // Check position size
    if (tradeValue > riskThresholds.maxPositionSize) {
      violations.push(`Trade value $${tradeValue} exceeds max $${riskThresholds.maxPositionSize}`);
      status = "requires_approval";
    }

    // Check approval threshold
    if (tradeValue > riskThresholds.requireApprovalAmount) {
      violations.push(`Trade requires human approval (value > $${riskThresholds.requireApprovalAmount})`);
      status = "requires_approval";
    }

    // Check concentration
    // (In production, would check current portfolio)

    return JSON.stringify({
      status,
      tradeValue,
      violations,
      message: violations.length > 0 ? violations.join("; ") : "Trade approved",
    });
  },
});

// --- 2. Human Escalation Tool ---
const escalationTool = new Tool({
  name: "escalate_to_human",
  description: "Escalate complex or high-risk decisions to human analyst. Use when: ambiguous market conditions, high-value trades, risk rule violations.",
  async func(escalationRequest) {
    const { reason, tradeDetails, context } = typeof escalationRequest === "string" ? JSON.parse(escalationRequest) : escalationRequest;

    // In production, this would notify human via email/Slack/console
    console.log("\n[ESCALATION] =======================================");
    console.log("ESCALATION TO HUMAN ANALYST REQUIRED");
    console.log("================================================");
    console.log("Reason:", reason);
    console.log("Trade Details:", tradeDetails);
    console.log("Context:", context);
    console.log("================================================");

    return JSON.stringify({
      escalationId: `ESC-${Date.now()}`,
      status: "pending_human_review",
      message: "Escalated to human analyst. Awaiting decision.",
      timestamp: new Date().toISOString(),
    });
  },
});

// --- 3. Audit Log Tool ---
const auditLogTool = new Tool({
  name: "log_trade_audit",
  description: "Log all trading decisions for compliance and audit purposes.",
  async func(logEntry) {
    const { timestamp, action, symbol, quantity, price, status, approvedBy } = typeof logEntry === "string" ? JSON.parse(logEntry) : logEntry;

    // In production, store in secure audit database
    console.log("\n[AUDIT] =======================================");
    console.log("Trade Audit Log Entry:");
    console.log(`  Timestamp: ${timestamp || new Date().toISOString()}`);
    console.log(`  Action: ${action}`);
    console.log(`  Symbol: ${symbol}`);
    console.log(`  Quantity: ${quantity}`);
    console.log(`  Price: ${price}`);
    console.log(`  Status: ${status}`);
    console.log(`  Approved By: ${approvedBy || "System"}`);
    console.log("================================================");

    return JSON.stringify({ success: true, logId: `AUDIT-${Date.now()}` });
  },
});

// --- Agent with Safety Tools ---
const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0.3 });
const llmWithTools = llm.bind({
  tools: [riskCheckTool, escalationTool, auditLogTool],
});

// --- Complete Trading Workflow with Safety ---
async function safeTradingWorkflow(tradeRequest) {
  console.log(`\n=== Safe Trading Workflow ===`);
  console.log("Trade Request:", tradeRequest);

  // Step 1: Risk Check
  const riskPrompt = ChatPromptTemplate.fromMessages([
    ["system", `Check if this trade meets risk compliance. Use the risk_check tool.`],
    ["user", "Check risk for: {trade}"],
  ]);

  const riskChain = riskPrompt.pipe(llmWithTools);
  const riskResult = await riskChain.invoke({ trade: JSON.stringify(tradeRequest) });

  console.log("\n--- Risk Check Result ---");
  console.log(riskResult.content);

  // Step 2: Decision based on risk
  if (riskResult.tool_calls) {
    for (const call of riskResult.tool_calls) {
      if (call.name === "check_risk_compliance") {
        // Execute risk check
        const riskOutput = await riskCheckTool.invoke(call.args);
        const riskData = JSON.parse(riskOutput);

        if (riskData.status === "requires_approval") {
          console.log("\n--- Escalating to Human ---");
          const escalationResult = await escalationTool.invoke({
            reason: "High-value trade requires approval",
            tradeDetails: tradeRequest,
            context: riskData.violations,
          });
          console.log("Escalation Result:", escalationResult);
        }

        // Step 3: Log to audit
        await auditLogTool.invoke({
          action: tradeRequest.action,
          symbol: tradeRequest.symbol,
          quantity: tradeRequest.quantity,
          price: tradeRequest.price,
          status: riskData.status,
          approvedBy: riskData.status === "approved" ? "System" : "Pending",
        });
      }
    }
  }
}

// Test with different trade amounts
safeTradingWorkflow({ action: "BUY", symbol: "AAPL", quantity: 10, price: 178.52 }); // Low value - auto approved
safeTradingWorkflow({ action: "BUY", symbol: "TSLA", quantity: 500, price: 250 }); // High value - requires approval
```

### Investment Agent: Complete Tool-Enabled Agent

### 投资智能体：完整的工具驱动智能体

This example demonstrates a complete investment agent with all tool categories integrated.

此示例展示一个集成了所有工具类别的完整投资智能体。

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Tool } from "@langchain/core/tools";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";

// ============================================
// PART 1: Define All Tools
// ============================================

// Data Gathering Tools
const getStockPrice = new Tool({
  name: "get_stock_price",
  description: "Get current stock price. Input: ticker symbol",
  func: async (symbol) => JSON.stringify({ price: 250.0, symbol }),
});

const searchNews = new Tool({
  name: "search_news",
  description: "Search financial news. Input: search query",
  func: async (query) => `Latest news: Positive earnings report for ${query}`,
});

// Analysis Tools
const calculateROI = new Tool({
  name: "calculate_roi",
  description: "Calculate investment returns. Input: JSON with buyPrice, sellPrice, quantity",
  func: async (params) => {
    const { buyPrice, sellPrice, quantity } = JSON.parse(params);
    const profit = (sellPrice - buyPrice) * quantity;
    const roi = ((sellPrice - buyPrice) / buyPrice) * 100;
    return JSON.stringify({ profit, roi: roi.toFixed(2) + "%" });
  },
});

// Trading Tools
const executeTrade = new Tool({
  name: "execute_trade",
  description: "Execute a trade. Input: JSON with action, symbol, quantity",
  func: async (params) => JSON.stringify({ success: true, orderId: "ORD-123" }),
});

// Safety Tools
const checkRisk = new Tool({
  name: "check_risk",
  description: "Check risk compliance. Input: trade parameters",
  func: async (params) => JSON.stringify({ approved: true, riskLevel: "low" }),
});

const escalate = new Tool({
  name: "escalate_to_human",
  description: "Escalate to human analyst. Input: reason",
  func: async (reason) => JSON.stringify({ escalationId: "ESC-1", status: "pending" }),
});

// ============================================
// PART 2: Create the Agent
// ============================================

const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0.3 });

const tools = [getStockPrice, searchNews, calculateROI, executeTrade, checkRisk, escalate];

const prompt = ChatPromptTemplate.fromMessages([
  ["system", `You are an Investment Agent with access to financial tools.

Available Tools:
- get_stock_price: Get stock prices
- search_news: Search financial news
- calculate_roi: Calculate investment returns
- execute_trade: Execute buy/sell orders
- check_risk: Check risk compliance
- escalate_to_human: Escalate to human for review

Workflow:
1. Gather relevant data (prices, news)
2. Analyze the investment opportunity
3. Check risk compliance
4. If approved, execute trade
5. If high-risk, escalate to human

Always prioritize risk management.`],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = await createOpenAIFunctionsAgent({
  llm,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true,
});

// ============================================
// PART 3: Run the Agent
// ============================================

async function runInvestmentAgent(query) {
  console.log(`\n========================================`);
  console.log(`Investment Agent Query: ${query}`);
  console.log(`========================================`);

  try {
    const result = await agentExecutor.invoke({ input: query });
    console.log("\n--- Final Result ---");
    console.log(result.output);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Test various queries
runInvestmentAgent("What's the current price of TSLA?");
runInvestmentAgent("Search for TSLA news");
runInvestmentAgent("Calculate potential profit if I buy 100 shares at $240 and sell at $260");
runInvestmentAgent("I want to buy 100 shares of TSLA");
```

### Conclusion

### 结论

The tool use pattern is fundamental to creating agents that can interact with the external world and perform meaningful actions beyond text generation.

工具使用模式是创建能够与外部世界交互并执行超越文本生成的有意义操作的智能体的基础。

By properly defining, registering, and orchestrating tools, agents can access real-time information, perform computations, and automate complex workflows across multiple systems.

通过正确定义、注册和编排工具，智能体可以获取实时信息、执行计算并跨多个系统自动化复杂工作流。

This pattern, combined with other agentic design patterns like parallelization and routing, enables the construction of sophisticated, multi-functional agentic systems capable of solving real-world problems.

---

## 社区热议与实践分享

工具使用模式在 2025-2026 年经历了从 Function Calling 到 MCP 标准化的重大变革，社区围绕工具发现、安全性和生产最佳实践展开了热烈讨论。

### MCP：工具使用的新标准

[Anthropic](https://www.anthropic.com/engineering/code-execution-with-mcp) 提出的 Model Context Protocol (MCP) 在 2025 年底捐赠给 Linux Foundation 后迅速成为行业标准。截至 2026 年 2 月，MCP SDK 月下载量突破 9700 万次，被 OpenAI、Google、Microsoft、AWS 全面采用。

[Composio](https://composio.dev/content/ai-agent-tool-calling-guide) 发布的 2026 工具调用指南指出：现代生产环境的工具调用已演进为 6 步流程，新增了**工具发现（Step 0）** — Agent 通过 MCP 或向量存储查询工具注册表，按用户意图查找相关工具定义，防止上下文窗口饱和。

### 代码执行 vs 直接工具调用

Anthropic 工程团队的[实践文章](https://www.anthropic.com/engineering/code-execution-with-mcp)揭示了一个重要洞察：直接工具调用会为每个定义和结果消耗上下文。Agent 通过**编写代码来调用工具**而非直接调用，可以更高效地利用上下文，按需加载工具、在数据到达模型前过滤、在单步中执行复杂逻辑。

### 生产部署的执行层缺口

[DEV Community](https://dev.to/aristoaistack/mcp-explained-how-ai-agents-actually-work-2026-5p8) 指出最常见的失败点：团队实现了工具搜索（发现）和 MCP（标准化），但低估了**执行层**的复杂性。知道调用哪个工具很简单，成功调用它所需的基础设施才是真正的挑战 — 包括 OAuth 流程、Token 刷新、错误处理和多租户隔离。

### MCP 网关：安全与可观测性

[Maxim](https://www.getmaxim.ai/articles/top-5-mcp-gateways-in-2025-the-complete-guide-to-enterprise-ready-ai-agent-infrastructure/) 和 [Integrate.io](https://www.integrate.io/blog/best-mcp-gateways-and-ai-agent-security-tools/) 的指南强调：直接 MCP 连接提供零洞察力。当 Agent 跨 10 个服务执行 50 次工具调用时，缺乏结构化日志和分布式追踪意味着调试只能靠猜。MCP 网关通过容器化隔离、综合可观测性和集中管理解决这些问题。

### 可组合 Agent 模式

[mcp-agent](https://github.com/lastmile-ai/mcp-agent) 框架践行了"MCP 是构建 Agent 所需的一切"理念，以可组合方式实现了 Anthropic Building Effective Agents 中描述的每种模式，支持基于 Temporal 的暂停、恢复和恢复。

---

## 参考资源

### 官方资源与标准

- [Anthropic - Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [OpenAI for Developers 2025](https://developers.openai.com/blog/openai-for-developers-2025/)
- [mcp-agent (GitHub)](https://github.com/lastmile-ai/mcp-agent)

### 生产实践指南

- [Composio - Tool Calling Explained: The Core of AI Agents (2026)](https://composio.dev/content/ai-agent-tool-calling-guide)
- [DEV Community - MCP Explained: How AI Agents Actually Work (2026)](https://dev.to/aristoaistack/mcp-explained-how-ai-agents-actually-work-2026-5p8)
- [DEV Community - MCP vs A2A: Complete Guide (2026)](https://dev.to/pockit_tools/mcp-vs-a2a-the-complete-guide-to-ai-agent-protocols-in-2026-30li)
- [The New Stack - AI Engineering Trends 2025: Agents, MCP, Vibe Coding](https://thenewstack.io/ai-engineering-trends-in-2025-agents-mcp-and-vibe-coding/)

### 安全与网关

- [Maxim - Top 5 MCP Gateways (2025)](https://www.getmaxim.ai/articles/top-5-mcp-gateways-in-2025-the-complete-guide-to-enterprise-ready-ai-agent-infrastructure/)
- [Integrate.io - Best MCP Gateways and AI Agent Security Tools (2026)](https://www.integrate.io/blog/best-mcp-gateways-and-ai-agent-security-tools/)

此模式与其他智能体设计模式（如并行化和路由）相结合，能够构建复杂的、多功能的智能体系统来解决现实世界的问题。
