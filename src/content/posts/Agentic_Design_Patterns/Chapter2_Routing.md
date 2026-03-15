---
title: 'Chapter 2: Routing'
date: '2026-03-15'
excerpt: 'While sequential processing via prompt chaining is a foundational technique for executing deterministic, linear workflows with language models, its applicability is limited. 本章融合社区洞察，深入探讨路由模式在智能体系统中的核心作用。'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 2: Routing

# 第二章：路由

## Routing Pattern Overview

## 路由模式概述

While sequential processing via prompt chaining is a foundational technique for executing deterministic, linear workflows with language models, its applicability is limited in scenarios requiring adaptive responses.

虽然通过提示链进行顺序处理是使用语言模型执行确定性线性工作流的基础技术，但其适用性在需要自适应响应的场景中有限。

Real-world agentic systems must often arbitrate between multiple potential actions based on contingent factors, such as the state of the environment, user input, or the outcome of a preceding operation.

现实世界的智能体系统经常需要根据偶发因素（如环境状态、用户输入或先前操作的结果）在多个潜在行动之间进行仲裁。

This capacity for dynamic decision-making, which governs the flow of control to different specialized functions, tools, or sub-processes, is achieved through a mechanism known as routing.

这种动态决策的能力，控制不同专业功能、工具或子流程的控制流，是通过称为路由的机制实现的。

Routing introduces conditional logic into an agent's operational framework, enabling a shift from a fixed execution path to a model where the agent dynamically evaluates specific criteria to select from a set of possible subsequent actions.

路由将条件逻辑引入智能体的操作框架，实现从固定执行路径到智能体动态评估特定标准以从一组可能的后续动作中进行选择的模型的转变。

This allows for more flexible and context-aware system behavior.

这允许更灵活和上下文感知的系统行为。

For instance, an agent designed for customer inquiries, when equipped with a routing function, can first classify an incoming query to determine the user's intent.

例如，一个为客户咨询设计的智能体，当配备路由功能时，可以首先对传入查询进行分类以确定用户的意图。

Based on this classification, it can then direct the query to a specialized agent for direct question-answering, a database retrieval tool for account information, or an escalation procedure for complex issues.

根据此分类，它可以将查询导向专门的智能体进行直接问答、数据库检索工具获取账户信息，或针对复杂问题的升级程序。

Therefore, a more sophisticated agent using routing could:

因此，使用路由的更复杂的智能体可以：

1. Analyze the user's query.

1. 分析用户的查询。

1. Route the query based on its intent:

1. 根据其意图路由查询：

- If the intent is "check order status", route to a sub-agent or tool chain that interacts with the order database.

- 如果意图是"检查订单状态"，路由到与订单数据库交互的子智能体或工具链。

- If the intent is "product information", route to a sub-agent or chain that searches the product catalog.

- 如果意图是"产品信息"，路由到搜索产品目录的子智能体或链。

- If the intent is "technical support", route to a different chain that accesses troubleshooting guides or escalates to a human.

- 如果意图是"技术支持"，路由到访问故障排除指南或升级给人工的不同链。

- If the intent is unclear, route to a clarification sub-agent or prompt chain.

- 如果意图不明确，路由到澄清子智能体或提示链。

The core component of the Routing pattern is a mechanism that performs the evaluation and directs the flow.

路由模式的核心组件是执行评估并引导流程的机制。

This mechanism can be implemented in several ways:

这种机制可以通过几种方式实现：

### LLM-based Routing

### 基于LLM的路由

The language model itself can be prompted to analyze the input and output a specific identifier or instruction that indicates the next step or destination.

语言模型本身可以被提示分析输入并输出指示下一步或目的地的特定标识符或指令。

For example, a prompt might ask the LLM to "Analyze the following user query and output only the category: 'Order Status', 'Product Info', 'Technical Support', or 'Other'."

例如，提示可能要求LLM"分析以下用户查询并仅输出类别：'订单状态'、'产品信息'、'技术支持'或'其他'。"

The agentic system then reads this output and directs the workflow accordingly.

然后智能体系统读取此输出并相应地引导工作流。

### Embedding-based Routing

### 基于嵌入的路由

The input query can be converted into a vector embedding (see RAG, Chapter 14).

输入查询可以转换为向量嵌入（见第14章RAG）。

This embedding is then compared to embeddings representing different routes or capabilities.

然后将此嵌入与代表不同路由或能力的嵌入进行比较。

The query is routed to the route whose embedding is most similar.

查询被路由到其嵌入最相似的路由。

This is useful for semantic routing, where the decision is based on the meaning of the input rather than just keywords.

这对于语义路由很有用，其中决策基于输入的含义而不仅仅是关键词。

### Rule-based Routing

### 基于规则的路由

This involves using predefined rules or logic (e.g., if-else statements, switch cases) based on keywords, patterns, or structured data extracted from the input.

这涉及使用基于从输入中提取的关键词、模式或结构化数据的预定义规则或逻辑（如if-else语句、switch case）。

This can be faster and more deterministic than LLM-based routing, but is less flexible for handling nuanced or novel inputs.

这可能比基于LLM的路由更快、更确定性，但对于处理细微或新颖的输入则不那么灵活。

### Machine Learning Model-Based Routing

### 基于机器学习模型的路由

It employs a discriminative model, such as a classifier, that has been specifically trained on a small corpus of labeled data to perform a routing task.

它使用判别模型（如分类器），该模型已在小型标记数据语料库上专门训练以执行路由任务。

While it shares conceptual similarities with embedding-based methods, its key characteristic is the supervised fine-tuning process, which adjusts the model's parameters to create a specialized routing function.

虽然它与基于嵌入的方法有概念上的相似性，但其关键特征是监督微调过程，调整模型的参数以创建专门的路由功能。

### Routing mechanism applications

### 路由机制应用

Routing mechanisms can be implemented at multiple junctures within an agent's operational cycle.

路由机制可以在智能体操作周期中的多个环节实现。

They can be applied at the outset to classify a primary task, at intermediate points within a processing chain to determine a subsequent action, or during a subroutine to select the most appropriate tool from a given set.

它们可以在开始时用于分类主要任务，在处理链中的中间点用于确定后续操作，或在子程序中用于从给定集合中选择最合适的工具。

Computational frameworks such as LangChain, LangGraph, and Google's Agent Developer Kit (ADK) provide explicit constructs for defining and managing such conditional logic.

LangChain、LangGraph和谷歌智能体开发工具包(ADK)等计算框架提供了明确定义和管理这种条件逻辑的结构。

With its state-based graph architecture, LangGraph is particularly well-suited for complex routing scenarios where decisions are contingent upon the accumulated state of the entire system.

凭借其基于状态的图架构，LangGraph特别适合决策依赖于整个系统累积状态的复杂路由场景。

## Practical Applications & Use Cases

## 实际应用和用例

The routing pattern is a critical control mechanism in the design of adaptive agentic systems, enabling them to dynamically alter their execution path in response to variable inputs and internal states.

路由模式是设计自适应智能体系统的关键控制机制，使它们能够动态改变执行路径以响应可变的输入和内部状态。

### Human-Computer Interaction

### 人机交互

In human-computer interaction, such as with virtual assistants or AI-driven tutors, routing is employed to interpret user intent.

在人机交互中，如虚拟助手或AI驱动的导师，路由用于解释用户意图。

An initial analysis of a natural language query determines the most appropriate subsequent action, whether it is invoking a specific information retrieval tool, escalating to a human operator, or selecting the next module in a curriculum based on user performance.

对自然语言查询的初步分析确定最合适的后续操作，无论它是调用特定信息检索工具、升级给人工操作员，还是根据用户表现在课程中选择下一个模块。

### Automated Data and Document Processing

### 自动数据和文档处理

Within automated data and document processing pipelines, routing serves as a classification and distribution function.

在自动数据和文档处理管道中，路由作为分类和分发功能。

Incoming data, such as emails, support tickets, or API payloads, is analyzed based on content, metadata, or format.

传入的数据（如电子邮件、支持工单或API有效载荷）基于内容，元数据或格式进行分析。

### Complex Multi-Tool Systems

### 复杂多工具系统

In complex systems involving multiple specialized tools or agents, routing acts as a high-level dispatcher.

在涉及多个专业工具或智能体的复杂系统中，路由作为高级调度器。

A research system composed of distinct agents for searching, summarizing, and analyzing information would use a router to assign tasks to the most suitable agent based on the current objective.

由用于搜索、总结和分析信息的不同智能体组成的研究系统将使用路由器根据当前目标将任务分配给最合适的智能体。

### 投资智能体

设计一个完整的投资智能体（Investment Agent）是一个高度复杂的系统工程，需要处理从高频市场数据分类、模糊的投资咨询到极其严格的交易执行等多种任务。为了兼顾效率、成本、准确性和灵活性，系统通常会**混合使用这四种路由模式**。

#### 1. 基于规则的路由 (Rule-based Routing)

- **核心逻辑**：依赖于预先定义的规则、关键词或正则表达式（例如 `if-else` 语句）。它速度最快、确定性最强，但在处理模糊输入时缺乏灵活性。
- **在投资 Agent 中的应用：高风险操作与明确指令**
  - **交易执行拦截**：在金融交易中，准确性是第一位的。当用户输入带有明确格式的指令时（例如："市价买入 100 股 AAPL"或"查询我的账户余额"），系统会通过正则表达式精准捕获这些关键词和格式，直接将请求**路由给"交易执行 API"或"数据库查询工具"**。这种情况下不需要 LLM 进行推理，以确保零幻觉和最低延迟。
  - **紧急风控干预**：如果系统监控到用户输入包含"清仓"、"平仓"或"账户被盗"等高危紧急词汇，规则路由会立即触发回退机制（Fallback）或升级（Escalation）策略，将控制权转交给人工客服或冻结系统。

#### 2. 基于嵌入的路由 (Embedding-based Routing)

- **核心逻辑**：将用户的查询转换为向量嵌入（Vector Embeddings），并计算其与不同路由或能力的向量之间的语义相似度。它关注的是"含义"而非具体的关键词。
- **在投资 Agent 中的应用：语义模糊的知识检索与研究**
  - **研报与知识库匹配**：用户可能使用非常口语化或模糊的表达，例如"有没有什么环保或者对社会有好处的公司值得买？"。基于嵌入的路由能识别出其语义对应的是"ESG（环境、社会和公司治理）"主题。它会计算出最高的相似度，并将任务**路由给专门连接了"ESG 知识图谱"或"可持续发展研报数据库"的检索智能体（RAG 子系统）**。

#### 3. 基于 LLM 的路由 (LLM-based Routing)

- **核心逻辑**：利用大型语言模型本身的推理能力，分析复杂的输入，并输出下一步行动的特定指令或类别。
- **在投资 Agent 中的应用：复杂意图理解与多智能体编排**
  - **投资策略规划与任务分发**：当用户提出一个复杂的多步推理问题时，例如："考虑到最近美联储降息，我应该如何调整我投资组合里的科技股和债券比例？"。一个轻量级的模型无法处理这种深度逻辑。此时，一个作为"协调器（Coordinator）"的 LLM 路由器会分析这个意图，并将其**分解并路由给多个专家智能体**：将宏观政策分析分配给"宏观经济智能体"，将资产配置计算分配给"投资组合优化智能体"。
  - **资源感知优化**：LLM 路由器还可以评估用户查询的难度。对于"今天苹果的股价是多少？"这类简单查询，它路由给便宜、快速的模型（如 Gemini Flash）；对于上述复杂的资产配置问题，它则路由给更强大、昂贵的模型（如 Gemini Pro）以保证推理质量。

#### 4. 基于机器学习模型的路由 (Machine Learning Model-Based Routing)

- **核心逻辑**：使用在特定标记数据集上微调过的判别模型（如分类器）来执行路由。它的权重中编码了路由逻辑，无需在推理时调用生成式 LLM，因此吞吐量大、延迟低。
- **在投资 Agent 中的应用：海量高频数据的实时分发**
  - **市场资讯与舆情分发**：一个完整的投资 Agent 每天需要在后台摄取数以万计的金融新闻、推文和公司财报。如果每一条都用 LLM 去判断该交给谁处理，成本和延迟将是不可接受的。
  - **实现方式**：系统部署一个轻量级的 ML 分类器模型，实时对信息流进行打标并路由。例如，分类器将文章迅速分类，把带有强烈情绪特征的新闻**路由给"情绪分析智能体"**，把长篇的财报文件**路由给"数据提取与摘要智能体"**，把含有并购关键字的突发新闻直接**路由给"紧急交易决策智能体"**。这种方式实现了高吞吐量的高效处理。

#### 5. Node.js 示例代码 (LangChain)

> 依赖: `npm install langchain @langchain/openai`

##### 5.1 路由优先级架构

```
用户输入
  │
  ├─ 1. 规则路由 (最快，零延迟)
  │     ├─ 交易指令 → trade_execution
  │     ├─ 紧急关键词 → emergency_escalation
  │     └─ 账户查询 → account_query
  │
  ├─ 2. 嵌入路由 (语义相似度 > 0.82)
  │     └─ 模糊查询 → knowledge_retrieval (RAG)
  │
  └─ 3. LLM 路由 (兜底，复杂推理)
        ├─ simple_query → 轻量模型
        └─ strategy_planning → 强力模型 + 多智能体
```

##### 5.2 规则路由 (Rule-based Routing)

```js
/** 交易指令正则 */
const TRADE_PATTERN = /^(市价|限价)\s*(买入|卖出)\s*(\d+)\s*股\s*([A-Z]{1,5})$/;
/** 高危关键词 */
const EMERGENCY_KEYWORDS = ["清仓", "平仓", "全部卖出", "账户被盗", "紧急止损"];
/** 账户查询 */
const ACCOUNT_QUERY_PATTERN = /查询.*(账户|余额|持仓|资产)/;

function ruleBasedRouter(query) {
  // 紧急风控拦截（最高优先级）
  const emergencyHit = EMERGENCY_KEYWORDS.find((kw) => query.includes(kw));
  if (emergencyHit) {
    return { matched: true, route: "emergency_escalation", data: { trigger: emergencyHit } };
  }
  // 交易指令
  const tradeMatch = query.match(TRADE_PATTERN);
  if (tradeMatch) {
    return {
      matched: true,
      route: "trade_execution",
      data: { type: tradeMatch[1], action: tradeMatch[2], quantity: +tradeMatch[3], ticker: tradeMatch[4] },
    };
  }
  // 账户查询
  if (ACCOUNT_QUERY_PATTERN.test(query)) {
    return { matched: true, route: "account_query" };
  }
  return { matched: false };
}
```

##### 5.3 嵌入路由 (Embedding-based Routing)

```js
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings();

/** 预定义路由的语义描述 */
const EMBEDDING_ROUTES = [
  { name: "esg_research", description: "环保投资、社会责任、ESG评级、可持续发展、碳中和" },
  { name: "macro_analysis", description: "宏观经济、美联储利率、通货膨胀、货币政策" },
  { name: "sector_research", description: "行业分析、半导体、人工智能、新能源、产业链" },
  { name: "technical_analysis", description: "K线图、均线、MACD、RSI、布林带、技术指标" },
];

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embeddingBasedRouter(query) {
  const [queryVec, routeVecs] = await Promise.all([
    embeddings.embedQuery(query),
    embeddings.embedDocuments(EMBEDDING_ROUTES.map((r) => r.description)),
  ]);

  let bestIdx = 0, bestScore = -1;
  routeVecs.forEach((vec, i) => {
    const score = cosineSimilarity(queryVec, vec);
    if (score > bestScore) { bestScore = score; bestIdx = i; }
  });

  return { route: EMBEDDING_ROUTES[bestIdx].name, score: bestScore };
}
```

##### 5.4 LLM 路由 (LLM-based Routing)

```js
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0 });

const classifyPrompt = PromptTemplate.fromTemplate(`
分析以下投资查询，输出 JSON 分类结果。

类别: "simple_query" | "strategy_planning" | "multi_step_analysis" | "general_chat"
复杂度: "low" | "medium" | "high"
子智能体(仅复杂任务): "macro_economist" | "portfolio_optimizer" | "stock_analyst" | "risk_manager"

查询: {query}

输出 JSON: {{"category":"...","complexity":"...","sub_agents":[...]}}
`);

const llmRouter = RunnableSequence.from([classifyPrompt, llm, new StringOutputParser()]);

async function llmBasedRouter(query) {
  const raw = await llmRouter.invoke({ query });
  return JSON.parse(raw.replace(/```json?\n?|```/g, "").trim());
}
```

##### 5.5 ML 模型路由 (模拟高频新闻分发)

```js
/**
 * 模拟 ML 分类器（生产环境替换为 ONNX/TF.js 微调模型）
 */
function mlModelRouter(newsItem) {
  const text = `${newsItem.title} ${newsItem.content}`.toLowerCase();

  const rules = [
    { category: "sentiment_analysis", target: "情绪分析智能体", keywords: ["暴跌","暴涨","恐慌","崩盘","surge","crash"] },
    { category: "data_extraction", target: "数据提取与摘要智能体", keywords: ["财报","季报","营收","eps","earnings","revenue"] },
    { category: "urgent_trading", target: "紧急交易决策智能体", keywords: ["并购","收购","退市","破产","merger","acquisition"] },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return { category: rule.category, target: rule.target };
    }
  }
  return { category: "general_news", target: "通用资讯存储" };
}
```

##### 5.6 主路由器 — 级联四种路由

```js
async function investmentAgentRouter(query) {
  // 第一层：规则路由（最快）
  const rule = ruleBasedRouter(query);
  if (rule.matched) return { via: "rule", ...rule };

  // 第二层：嵌入路由（语义匹配）
  const embed = await embeddingBasedRouter(query);
  if (embed.score > 0.82) return { via: "embedding", ...embed };

  // 第三层：LLM 路由（复杂推理）
  const intent = await llmBasedRouter(query);
  return { via: "llm", ...intent };
}
```

##### 5.7 LCEL 声明式路由（RunnableBranch）

```js
import { RunnableBranch, RunnableLambda } from "@langchain/core/runnables";

const router = RunnableBranch.from([
  // 交易指令
  [(input) => TRADE_PATTERN.test(input.query),
   new RunnableLambda({ func: (input) => ({ via: "rule", route: "trade", ...input.query.match(TRADE_PATTERN).groups }) })],
  // 紧急风控
  [(input) => EMERGENCY_KEYWORDS.some((kw) => input.query.includes(kw)),
   new RunnableLambda({ func: (input) => ({ via: "rule", route: "emergency" }) })],
  // 默认: LLM 路由
  new RunnableLambda({ func: (input) => llmBasedRouter(input.query) }),
]);

// 使用: await router.invoke({ query: "市价买入 100股 AAPL" });
```

---

## 社区热议与实践分享

路由模式作为智能体系统的核心调度机制，在 2025-2026 年经历了从简单规则匹配到智能语义路由的重大演变。

### 语义路由的崛起

[Aurelio Labs](https://github.com/aurelio-labs/semantic-router) 开源的 Semantic Router 成为社区热门项目，其核心理念是利用语义向量空间进行超快速决策，而非等待 LLM 生成响应。[Red Hat](https://developers.redhat.com/articles/2025/05/20/llm-semantic-router-intelligent-request-routing) 在 2025 年 5 月也发布了企业级 LLM 语义路由方案，结合语义理解和缓存来提升性能、降低成本。

2026 年 1 月，[vLLM 发布了 Semantic Router v0.1（代号 Iris）](https://blog.vllm.ai/2026/01/05/vllm-sr-iris.html)，标志着智能 LLM 路由的重大里程碑。自 2025 年 9 月实验性发布以来，社区贡献了 600+ PR、300+ Issues 修复，超过 50 位工程师参与。亮点包括 HaluGate 三阶段幻觉检测管道和交互式路由策略管理面板。

### 学术前沿：MasRouter 与 RouteLLM

[MasRouter（arXiv:2502.11133）](https://arxiv.org/abs/2502.11133) 提出了首个针对多智能体系统的路由解决方案，通过级联控制网络实现协作模式确定、角色分配和 LLM 路由。实验表明：在 MBPP 上比 SOTA 提升 1.8%-8.2%，在 HumanEval 上减少 52.07% 开销，且即插即用地集成到主流 MAS 框架中。

[RouteLLM（OpenReview）](https://openreview.net/forum?id=8sSqNntaMr) 引入了利用人类偏好数据训练路由模型的框架，可在推理时动态选择强弱模型，成本降低 2 倍以上而不牺牲响应质量。

### 成本优化路由

[AnyLLM](https://useanyllm.com/) 利用上下文多臂赌博机（Contextual Multi-Armed Bandit）学习最优请求分发，自动在廉价模型、高性能 Agent 或人工流程之间做出路由决策。[The New Stack](https://thenewstack.io/how-to-build-an-ai-agent-with-semantic-router-and-llm-tools/) 发表了系列文章，展示语义路由如何让 AI Agent 为正确的任务选择正确的 LLM，同时减少 LLM 依赖。

### 社区共识

社区普遍认为 2026 年路由模式的最佳实践是**多层级联**：规则路由处理确定性高的请求（最快、零延迟），嵌入路由处理语义模糊的查询，LLM 路由作为兜底处理复杂推理。正如 [LangChain 文档](https://docs.langchain.com/oss/python/langchain/multi-agent/router-knowledge-base)所推荐：当你有多个独立知识源、需要低延迟并行查询且希望显式控制路由逻辑时，使用 Router 模式。

---

## 参考资源

### 学术论文

- [MasRouter: Learning to Route LLMs for Multi-Agent Systems (arXiv:2502.11133)](https://arxiv.org/abs/2502.11133)
- [RouteLLM: Learning to Route LLMs from Preference Data (OpenReview)](https://openreview.net/forum?id=8sSqNntaMr)
- [The Landscape of Emerging AI Agent Architectures (arXiv:2404.11584)](https://arxiv.org/html/2404.11584v1)

### 框架与工具

- [Aurelio Labs Semantic Router (GitHub)](https://github.com/aurelio-labs/semantic-router)
- [vLLM Semantic Router v0.1 Iris (Jan 2026)](https://blog.vllm.ai/2026/01/05/vllm-sr-iris.html)
- [AnyLLM - Intelligent LLM Routing](https://useanyllm.com/)
- [LangChain Router Knowledge Base](https://docs.langchain.com/oss/python/langchain/multi-agent/router-knowledge-base)
- [Awesome AI Model Routing (GitHub)](https://github.com/Not-Diamond/awesome-ai-model-routing)

### 博客与教程

- [Red Hat - LLM Semantic Router (May 2025)](https://developers.redhat.com/articles/2025/05/20/llm-semantic-router-intelligent-request-routing)
- [The New Stack - Build an AI Agent with Semantic Router](https://thenewstack.io/how-to-build-an-ai-agent-with-semantic-router-and-llm-tools/)
- [Latitude - Dynamic LLM Routing: Tools and Frameworks](https://latitude.so/blog/dynamic-llm-routing-tools-and-frameworks)
