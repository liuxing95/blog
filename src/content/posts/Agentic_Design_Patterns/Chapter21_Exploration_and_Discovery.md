---
title: 'Chapter 21: Exploration and Discovery'
date: '2026-03-15'
excerpt: 'Beyond handling specific tasks, agents can explore and discover new capabilities or information. 融合社区洞察与最新实践，深入探索智能体的自主发现能力。'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 21: Exploration and Discovery

# 第二十一章：探索与发现

## Exploration Pattern Overview

## 探索模式概述

Beyond handling specific tasks, agents can explore and discover new capabilities or information.

除了处理特定任务，智能体还可以探索和发现新能力或信息。

This pattern enables agents to learn about their environment and expand their capabilities.

此模式使智能体能够了解其环境并扩展其能力。

### Exploration Strategies

### 探索策略

**Capability Discovery**: Identify available tools and resources.

**能力发现**: 识别可用的工具和资源。

**Information Gathering**: Proactively collect relevant information.

**信息收集**: 主动收集相关信息。

**Experimentation**: Try new approaches to improve performance.

**实验**: 尝试新方法来提高性能。

**Learning from Feedback**: Use user interactions to discover improvement opportunities.

**从反馈中学习**: 使用用户交互来发现改进机会。

## Practical Applications & Use Cases

## 实际应用与用例场景

### Autonomous Research Agents | 自主研究智能体

Research agents can autonomously explore vast information spaces, discovering patterns and insights that human researchers might miss. Platforms like DeepMind's AlphaFold demonstrate how exploration-driven approaches can solve previously intractable problems by systematically exploring solution spaces. In financial research, exploration agents can analyze thousands of data sources to discover emerging market trends.

自主研究智能体可以自主探索广阔的信息空间，发现人类研究人员可能错过的模式和见解。DeepMind的AlphaFold等平台展示了探索驱动的方法如何通过系统地探索解决方案空间来解决以前无法解决的问题。在金融研究中，探索智能体可以分析数千个数据源以发现新兴市场趋势。

### Adaptive Learning Systems | 自适应学习系统

Agents that explore and discover new patterns in user behavior can continuously improve their recommendations. Netflix and Spotify use exploration algorithms to discover content preferences that users didn't know they had. Similarly, investment agents can explore market conditions to discover new strategies that outperform traditional approaches.

探索并发现用户行为中新模式的智能体可以持续改进其推荐。Netflix和Spotify使用探索算法来发现用户不知道自己有的内容偏好。类似地，投资智能体可以探索市场条件以发现优于传统方法的新策略。

### Tool and Capability Discovery | 工具和能力发现

In dynamic environments, agents must discover available tools and capabilities. Modern AI assistants explore API documentation, tool schemas, and capability descriptions to understand what actions they can take. This self-discovery enables agents to adapt to new environments without explicit programming.

在动态环境中，智能体必须发现可用的工具和能力。现代AI助手探索API文档、工具模式和能力描述，以了解它们可以采取什么行动。这种自我发现使智能体能够适应新环境而无需明确编程。

### Anomaly and Opportunity Detection | 异常和机会检测

Exploration agents excel at detecting anomalies that deviate from normal patterns. In trading, this could mean discovering unusual price movements or volume patterns that signal potential opportunities or risks. The key is systematic exploration that balances exploitation of known patterns with exploration of new ones.

探索智能体擅长检测偏离正常模式的异常。在交易中，这可能意味着发现可能预示潜在机会或风险的异常价格走势或成交量模式。关键是在已知模式的利用与新模式的探索之间取得系统平衡。

---

## Hands-On Code Examples

## 动手实践代码示例

### Example 1: Capability Discovery | 示例1：能力发现

```typescript
// Capability discovery system for agents
// 智能体的能力发现系统
import { ChatOpenAI } from "@langchain/openai";

// Capability definition
// 能力定义
interface Capability {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: string[];
  returns: string;
  confidence: number;
  lastVerified: number;
  usageCount: number;
}

// Discovered tool
// 发现的工具
interface DiscoveredTool {
  id: string;
  name: string;
  endpoint: string;
  methods: string[];
  description: string;
  reliability: number;
}

// Capability discovery agent
// 能力发现智能体
class CapabilityDiscoveryAgent {
  private capabilities: Map<string, Capability> = new Map();
  private tools: Map<string, DiscoveredTool> = new Map();
  private discoveryHistory: any[] = [];

  // Discover capabilities from environment
  async discoverCapabilities(environment: any): Promise<Capability[]> {
    const discovered: Capability[] = [];

    // Explore available APIs
    if (environment.apis) {
      for (const api of environment.apis) {
        const capability = await this.exploreAPI(api);
        if (capability) {
          discovered.push(capability);
          this.capabilities.set(capability.id, capability);
        }
      }
    }

    // Explore available tools
    if (environment.tools) {
      for (const tool of environment.tools) {
        const discoveredTool = await this.exploreTool(tool);
        this.tools.set(discoveredTool.id, discoveredTool);
      }
    }

    // Log discovery
    this.discoveryHistory.push({
      timestamp: Date.now(),
      discovered: discovered.length,
      environment: environment.name
    });

    console.log(`[Discovery] Discovered ${discovered.length} new capabilities`);
    return discovered;
  }

  // Explore a single API
  private async exploreAPI(api: any): Promise<Capability | null> {
    // Simulate API exploration
    const capability: Capability = {
      id: `cap-${api.name}`,
      name: api.name,
      description: api.description || `API for ${api.name}`,
      category: api.category || "general",
      parameters: api.parameters || [],
      returns: api.returns || "unknown",
      confidence: 0.9,
      lastVerified: Date.now(),
      usageCount: 0
    };

    return capability;
  }

  // Explore a tool
  private async exploreTool(tool: any): Promise<DiscoveredTool> {
    return {
      id: `tool-${tool.name}`,
      name: tool.name,
      endpoint: tool.endpoint,
      methods: tool.methods || ["execute"],
      description: tool.description,
      reliability: 0.85
    };
  }

  // Get capability by category
  getCapabilitiesByCategory(category: string): Capability[] {
    return Array.from(this.capabilities.values())
      .filter(c => c.category === category);
  }

  // Find capability for task
  findCapabilityForTask(task: string): Capability | null {
    const allCaps = Array.from(this.capabilities.values());

    // Simple keyword matching
    for (const cap of allCaps) {
      if (task.toLowerCase().includes(cap.name.toLowerCase()) ||
          cap.description.toLowerCase().includes(task.toLowerCase())) {
        return cap;
      }
    }

    return null;
  }

  // Update capability usage
  recordCapabilityUsage(capabilityId: string): void {
    const capability = this.capabilities.get(capabilityId);
    if (capability) {
      capability.usageCount++;
      capability.lastVerified = Date.now();
    }
  }

  // Get discovery report
  getDiscoveryReport(): any {
    const caps = Array.from(this.capabilities.values());
    const categories = new Set(caps.map(c => c.category));

    return {
      totalCapabilities: caps.length,
      byCategory: Object.fromEntries(
        Array.from(categories).map(cat => [
          cat,
          caps.filter(c => c.category === cat).length
        ])
      ),
      mostUsed: caps.sort((a, b) => b.usageCount - a.usageCount).slice(0, 5),
      discoveryHistory: this.discoveryHistory
    };
  }
}

// Example usage: 创建示例
const discoveryAgent = new CapabilityDiscoveryAgent();

// Discover capabilities from environment
const env = {
  name: "trading-platform",
  apis: [
    { name: "get_stock_price", description: "Get current stock price", category: "market_data" },
    { name: "place_order", description: "Place trading order", category: "trading" },
    { name: "get_portfolio", description: "Get portfolio holdings", category: "portfolio" }
  ],
  tools: [
    { name: "calculator", endpoint: "/tools/calc", methods: ["compute"] },
    { name: "notifier", endpoint: "/tools/notify", methods: ["send", "schedule"] }
  ]
};

discoveryAgent.discoverCapabilities(env);

console.log("\n=== Discovery Report ===");
console.log(discoveryAgent.getDiscoveryReport());
```

### Example 2: Information Gathering | 示例2：信息收集

```typescript
// Information gathering and exploration system
// 信息收集和探索系统
import { ChatOpenAI } from "@langchain/openai";

// Information source
// 信息源
interface InformationSource {
  id: string;
  type: "api" | "database" | "web" | "file";
  name: string;
  endpoint?: string;
  reliability: number;
  lastUpdated: number;
  schema?: any;
}

// Gathered information
// 收集的信息
interface GatheredInformation {
  source: string;
  data: any;
  timestamp: number;
  relevance: number;
  freshness: number;
}

// Information gathering agent
// 信息收集智能体
class InformationGatheringAgent {
  private sources: Map<string, InformationSource> = new Map();
  private gatheredInfo: GatheredInformation[] = [];
  private explorationBudget = 100; // Max API calls per session

  // Register information source
  registerSource(source: InformationSource): void {
    this.sources.set(source.id, source);
    console.log(`[Info] Registered source: ${source.name}`);
  }

  // Gather information about topic
  async gatherInformation(topic: string, maxSources: number = 5): Promise<GatheredInformation[]> {
    const results: GatheredInformation[] = [];

    // Find relevant sources
    const relevantSources = Array.from(this.sources.values())
      .filter(s => this.isRelevant(s, topic))
      .slice(0, maxSources);

    for (const source of relevantSources) {
      if (this.explorationBudget <= 0) break;

      try {
        const info = await this.querySource(source, topic);
        results.push(info);
        this.gatheredInfo.push(info);
        this.explorationBudget--;

        console.log(`[Info] Gathered from ${source.name}: ${info.relevance}% relevant`);
      } catch (error) {
        console.error(`[Info] Failed to query ${source.name}:`, error);
      }
    }

    return results;
  }

  // Check if source is relevant to topic
  private isRelevant(source: InformationSource, topic: string): boolean {
    // Simple relevance check
    return source.name.toLowerCase().includes(topic.toLowerCase().split(" ")[0]) ||
           source.type === "web";
  }

  // Query a source
  private async querySource(source: InformationSource, topic: string): Promise<GatheredInformation> {
    // Simulate querying
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      source: source.name,
      data: { topic, results: [`Result from ${source.name}`] },
      timestamp: Date.now(),
      relevance: Math.random() * 0.5 + 0.5, // 50-100%
      freshness: Math.random() * 0.3 + 0.7 // 70-100%
    };
  }

  // Explore related topics
  async exploreRelatedTopics(topic: string): Promise<string[]> {
    // Use LLM to suggest related topics
    const related = [
      `${topic} trends`,
      `${topic} analysis`,
      `${topic} news`,
      `${topic} forecast`
    ];

    return related;
  }

  // Get information synthesis
  synthesizeInformation(topic: string): any {
    const relevant = this.gatheredInfo.filter(info =>
      info.data.topic === topic
    );

    if (relevant.length === 0) {
      return { status: "no_data", message: "No information gathered for this topic" };
    }

    // Calculate aggregate metrics
    const avgRelevance = relevant.reduce((sum, i) => sum + i.relevance, 0) / relevant.length;
    const avgFreshness = relevant.reduce((sum, i) => sum + i.freshness, 0) / relevant.length;

    return {
      topic,
      sourceCount: relevant.length,
      avgRelevance,
      avgFreshness,
      sources: relevant.map(i => i.source),
      synthesized: "Information synthesized from multiple sources"
    };
  }

  // Get exploration budget
  getBudget(): number {
    return this.explorationBudget;
  }
}

// Example usage: 创建示例
const gatheringAgent = new InformationGatheringAgent();

// Register sources
gatheringAgent.registerSource({
  id: "yahoo-finance",
  type: "api",
  name: "Yahoo Finance",
  endpoint: "https://query1.finance.yahoo.com",
  reliability: 0.9,
  lastUpdated: Date.now()
});

gatheringAgent.registerSource({
  id: "market-watch",
  type: "web",
  name: "MarketWatch",
  reliability: 0.85,
  lastUpdated: Date.now()
});

gatheringAgent.registerSource({
  id: "sec-api",
  type: "api",
  name: "SEC API",
  reliability: 0.95,
  lastUpdated: Date.now()
});

// Gather information
gatheringAgent.gatherInformation("AAPL stock").then(info => {
  console.log("\nGathered information:", info);
});

// Synthesize
console.log("\nSynthesis:", gatheringAgent.synthesizeInformation("AAPL stock"));
console.log("Budget remaining:", gatheringAgent.getBudget());
```

### Example 3: Experimentation Framework | 示例3：实验框架

```typescript
// Experimentation framework for agent improvement
// 智能体改进的实验框架
import { ChatOpenAI } from "@langchain/openai";

// Experiment definition
// 实验定义
interface Experiment {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  status: "draft" | "running" | "completed" | "paused";
  variant: string;
  control: string;
  startDate?: number;
  endDate?: number;
  metrics: ExperimentMetric[];
  results?: ExperimentResults;
}

// Experiment metric
// 实验指标
interface ExperimentMetric {
  name: string;
  value: number;
  target?: number;
}

// Experiment results
// 实验结果
interface ExperimentResults {
  control: Record<string, number>;
  variant: Record<string, number>;
  winner: "control" | "variant" | "inconclusive";
  confidence: number;
  pValue?: number;
}

// Experiment runner
// 实验运行器
class ExperimentationFramework {
  private experiments: Map<string, Experiment> = new Map();
  private activeExperiments: Set<string> = new Set();

  // Create experiment
  createExperiment(
    name: string,
    description: string,
    hypothesis: string
  ): Experiment {
    const experiment: Experiment = {
      id: `exp-${Date.now()}`,
      name,
      description,
      hypothesis,
      status: "draft",
      variant: "new_approach",
      control: "baseline",
      metrics: []
    };

    this.experiments.set(experiment.id, experiment);
    console.log(`[Experiment] Created: ${experiment.id}`);

    return experiment;
  }

  // Start experiment
  startExperiment(experimentId: string): void {
    const exp = this.experiments.get(experimentId);
    if (!exp) throw new Error("Experiment not found");

    exp.status = "running";
    exp.startDate = Date.now();
    this.activeExperiments.add(experimentId);

    console.log(`[Experiment] Started: ${experimentId}`);
  }

  // Record metric
  recordMetric(experimentId: string, metricName: string, value: number): void {
    const exp = this.experiments.get(experimentId);
    if (!exp) return;

    exp.metrics.push({
      name: metricName,
      value
    });
  }

  // Run A/B test
  runABTest(
    experimentId: string,
    controlData: Record<string, number>,
    variantData: Record<string, number>
  ): ExperimentResults {
    // Calculate winner (simplified)
    const controlAvg = Object.values(controlData).reduce((a, b) => a + b, 0) / Object.values(controlData).length;
    const variantAvg = Object.values(variantData).reduce((a, b) => a + b, 0) / Object.values(variantData).length;

    const improvement = ((variantAvg - controlAvg) / controlAvg) * 100;
    const confidence = Math.min(0.99, Math.abs(improvement) / 10);

    let winner: "control" | "variant" | "inconclusive" = "inconclusive";
    if (confidence > 0.95 && improvement > 5) {
      winner = "variant";
    } else if (confidence > 0.95 && improvement < -5) {
      winner = "control";
    }

    const results: ExperimentResults = {
      control: controlData,
      variant: variantData,
      winner,
      confidence
    };

    // Update experiment
    const exp = this.experiments.get(experimentId);
    if (exp) {
      exp.results = results;
      exp.status = "completed";
      exp.endDate = Date.now();
      this.activeExperiments.delete(experimentId);
    }

    return results;
  }

  // Get active experiments
  getActiveExperiments(): Experiment[] {
    return Array.from(this.experiments.values())
      .filter(exp => exp.status === "running");
  }

  // Get experiment by ID
  getExperiment(experimentId: string): Experiment | undefined {
    return this.experiments.get(experimentId);
  }

  // Get all experiments
  getAllExperiments(): Experiment[] {
    return Array.from(this.experiments.values());
  }
}

// Example usage: 创建示例
const framework = new ExperimentationFramework();

// Create experiment
const exp = framework.createExperiment(
  "Response Formatting Test",
  "Testing different response formats",
  "Users prefer shorter, bulleted responses"
);

// Start experiment
framework.startExperiment(exp.id);

// Simulate data collection
for (let i = 0; i < 100; i++) {
  framework.recordMetric(exp.id, "engagement", Math.random());
}

// Run A/B test
const results = framework.runABTest(
  exp.id,
  { engagement: 0.65, completion: 0.70 },
  { engagement: 0.75, completion: 0.80 }
);

console.log("\n=== Experiment Results ===");
console.log("Winner:", results.winner);
console.log("Confidence:", (results.confidence * 100).toFixed(1) + "%");
```

### Example 4: Feedback-Driven Learning | 示例4：反馈驱动学习

```typescript
// Feedback-driven learning system
// 反馈驱动学习系统
import { ChatOpenAI } from "@langchain/openai";

// Feedback item
// 反馈项
interface FeedbackItem {
  id: string;
  type: "explicit" | "implicit" | "behavioral";
  context: string;
  rating?: number;
  action?: string;
  outcome?: string;
  timestamp: number;
}

// Learning insight
// 学习洞察
interface LearningInsight {
  id: string;
  description: string;
  source: string;
  confidence: number;
  action: string;
  implemented: boolean;
}

// Feedback-driven learning agent
// 反馈驱动学习智能体
class FeedbackDrivenLearningAgent {
  private feedbackHistory: FeedbackItem[] = [];
  private insights: LearningInsight[] = [];
  private behaviorModel: Map<string, number> = new Map();

  // Record explicit feedback
  recordFeedback(
    type: "explicit" | "implicit" | "behavioral",
    context: string,
    rating?: number,
    action?: string
  ): void {
    const feedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      type,
      context,
      rating,
      action,
      timestamp: Date.now()
    };

    this.feedbackHistory.push(feedback);
    console.log(`[Learning] Recorded ${type} feedback: ${context}`);

    // Trigger learning if enough feedback
    if (this.feedbackHistory.length % 10 === 0) {
      this.learn();
    }
  }

  // Record behavioral feedback
  recordBehavior(action: string, outcome: string): void {
    this.recordFeedback("behavioral", action, undefined, outcome);

    // Update behavior model
    const currentCount = this.behaviorModel.get(action) || 0;
    this.behaviorModel.set(action, currentCount + 1);
  }

  // Learning process
  private learn(): void {
    console.log("\n[Learning] Processing feedback...");

    // Analyze feedback patterns
    const patterns = this.analyzePatterns();

    // Generate insights
    for (const pattern of patterns) {
      const insight = this.generateInsight(pattern);
      if (insight) {
        this.insights.push(insight);
        console.log(`[Learning] New insight: ${insight.description}`);
      }
    }
  }

  // Analyze feedback patterns
  private analyzePatterns(): any[] {
    const patterns: any[] = [];

    // Group by context
    const byContext = new Map<string, FeedbackItem[]>();
    for (const fb of this.feedbackHistory) {
      const existing = byContext.get(fb.context) || [];
      existing.push(fb);
      byContext.set(fb.context, existing);
    }

    // Find patterns
    for (const [context, items] of byContext) {
      if (items.length >= 5) {
        const ratings = items.filter(i => i.rating !== undefined).map(i => i.rating!);
        const avgRating = ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : null;

        patterns.push({
          context,
          count: items.length,
          avgRating,
          type: items[0].type
        });
      }
    }

    return patterns;
  }

  // Generate insight from pattern
  private generateInsight(pattern: any): LearningInsight | null {
    // Simple insight generation
    if (pattern.avgRating !== null && pattern.avgRating < 3) {
      return {
        id: `insight-${Date.now()}`,
        description: `Low rating for ${pattern.context} (${pattern.avgRating.toFixed(1)})`,
        source: "feedback_analysis",
        confidence: 0.8,
        action: `improve_${pattern.context}`,
        implemented: false
      };
    }

    return null;
  }

  // Get actionable insights
  getActionableInsights(): LearningInsight[] {
    return this.insights.filter(i => !i.implemented && i.confidence > 0.7);
  }

  // Implement insight
  implementInsight(insightId: string): void {
    const insight = this.insights.find(i => i.id === insightId);
    if (insight) {
      insight.implemented = true;
      console.log(`[Learning] Implemented: ${insight.description}`);
    }
  }

  // Get behavior recommendations
  getBehaviorRecommendations(context: string): string[] {
    const recommendations: string[] = [];

    // Based on behavior model
    for (const [action, count] of this.behaviorModel) {
      if (count > 10) {
        recommendations.push(`Continue: ${action} (${count} times)`);
      }
    }

    return recommendations;
  }
}

// Example usage: 创建示例
const learningAgent = new FeedbackDrivenLearningAgent();

// Record feedback
learningAgent.recordFeedback("explicit", "response_clarity", 4);
learningAgent.recordFeedback("explicit", "response_clarity", 3);
learningAgent.recordFeedback("explicit", "response_clarity", 5);
learningAgent.recordFeedback("explicit", "response_speed", 5);
learningAgent.recordFeedback("implicit", "user_retention", 4);

// Record behaviors
learningAgent.recordBehavior("provide_summary", "positive");
learningAgent.recordBehavior("provide_detail", "neutral");
learningAgent.recordBehavior("provide_summary", "positive");

// Get insights
console.log("\n=== Actionable Insights ===");
console.log(learningAgent.getActionableInsights());

console.log("\n=== Behavior Recommendations ===");
console.log(learningAgent.getBehaviorRecommendations("general"));
```

### Example 5: Anomaly Detection | 示例5：异常检测

```typescript
// Anomaly detection for exploration
// 探索的异常检测
import { ChatOpenAI } from "@langchain/openai";

// Data point
// 数据点
interface DataPoint {
  id: string;
  timestamp: number;
  value: number;
  features: Record<string, number>;
  isAnomaly: boolean;
  anomalyScore?: number;
}

// Anomaly detection agent
// 异常检测智能体
class AnomalyDetectionAgent {
  private dataWindow: DataPoint[] = [];
  private maxWindowSize = 1000;
  private anomalies: DataPoint[] = [];

  // Add data point
  addDataPoint(value: number, features: Record<string, number>): DataPoint {
    const point: DataPoint = {
      id: `dp-${Date.now()}`,
      timestamp: Date.now(),
      value,
      features,
      isAnomaly: false
    };

    // Detect anomaly
    const { isAnomaly, score } = this.detectAnomaly(point);
    point.isAnomaly = isAnomaly;
    point.anomalyScore = score;

    // Store
    this.dataWindow.push(point);
    if (this.dataWindow.length > this.maxWindowSize) {
      this.dataWindow.shift();
    }

    if (isAnomaly) {
      this.anomalies.push(point);
      console.log(`[Anomaly] Detected anomaly: ${score.toFixed(2)} - ${JSON.stringify(features)}`);
    }

    return point;
  }

  // Detect anomaly using statistical methods
  private detectAnomaly(point: DataPoint): { isAnomaly: boolean; score: number } {
    if (this.dataWindow.length < 10) {
      return { isAnomaly: false, score: 0 };
    }

    // Calculate statistics
    const values = this.dataWindow.slice(-50).map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
    );

    // Z-score
    const zScore = Math.abs((point.value - mean) / (std || 1));
    const isAnomaly = zScore > 2.5; // Threshold

    return { isAnomaly, score: zScore };
  }

  // Detect pattern changes
  detectPatternChange(windowSize: number = 20): boolean {
    if (this.dataWindow.length < windowSize * 2) return false;

    const recent = this.dataWindow.slice(-windowSize);
    const previous = this.dataWindow.slice(-windowSize * 2, -windowSize);

    const recentMean = recent.reduce((s, d) => s + d.value, 0) / recent.length;
    const prevMean = previous.reduce((s, d) => s + d.value, 0) / previous.length;

    const change = Math.abs((recentMean - prevMean) / prevMean);
    return change > 0.2; // 20% change
  }

  // Get anomaly report
  getAnomalyReport(): any {
    const recentAnomalies = this.anomalies.filter(
      a => Date.now() - a.timestamp < 24 * 60 * 60 * 1000
    );

    return {
      totalAnomalies: this.anomalies.length,
      recentAnomalies: recentAnomalies.length,
      avgAnomalyScore: recentAnomalies.length > 0
        ? recentAnomalies.reduce((s, a) => s + (a.anomalyScore || 0), 0) / recentAnomalies.length
        : 0,
      hasPatternChange: this.detectPatternChange(),
      recentAnomalyDetails: recentAnomalies.slice(-5).map(a => ({
        timestamp: new Date(a.timestamp).toISOString(),
        value: a.value,
        score: a.anomalyScore?.toFixed(2)
      }))
    };
  }
}

// Example usage: 创建示例
const anomalyDetector = new AnomalyDetectionAgent();

// Simulate data stream
for (let i = 0; i < 100; i++) {
  const value = 100 + Math.random() * 20;
  anomalyDetector.addDataPoint(value, { source: "market_data", symbol: "AAPL" });
}

// Add some anomalies
anomalyDetector.addDataPoint(180, { source: "market_data", symbol: "AAPL" });
anomalyDetector.addDataPoint(50, { source: "market_data", symbol: "AAPL" });

console.log("\n=== Anomaly Report ===");
console.log(anomalyDetector.getAnomalyReport());
```

---

## Investment Agent: Market Exploration System

## 投资智能体：市场探索系统

```typescript
// Investment agent with exploration and discovery capabilities
// 具有探索和发现能力的投资智能体
import { ChatOpenAI } from "@langchain/openai";

// Market opportunity
// 市场机会
interface MarketOpportunity {
  id: string;
  type: "trend" | "anomaly" | "pattern" | "discovery";
  description: string;
  confidence: number;
  potential: number;
  risk: number;
  discoveredAt: number;
  actions: string[];
}

// Investment exploration agent
// 投资探索智能体
class InvestmentExplorationAgent {
  private discoveryAgent: CapabilityDiscoveryAgent;
  private infoGatheringAgent: InformationGatheringAgent;
  private anomalyDetector: AnomalyDetectionAgent;
  private experimentationFramework: ExperimentationFramework;
  private learningAgent: FeedbackDrivenLearningAgent;
  private opportunities: MarketOpportunity[] = [];

  constructor() {
    this.discoveryAgent = new CapabilityDiscoveryAgent();
    this.infoGatheringAgent = new InformationGatheringAgent();
    this.anomalyDetector = new AnomalyDetectionAgent();
    this.experimentationFramework = new ExperimentationFramework();
    this.learningAgent = new FeedbackDrivenLearningAgent();
  }

  // Explore market for opportunities
  async exploreMarket(symbols: string[]): Promise<MarketOpportunity[]> {
    const opportunities: MarketOpportunity[] = [];

    // 1. Gather market information
    for (const symbol of symbols) {
      await this.infoGatheringAgent.gatherInformation(`${symbol} stock`, 3);
    }

    // 2. Detect anomalies in price data
    for (const symbol of symbols) {
      // Simulate price data
      for (let i = 0; i < 50; i++) {
        const price = 100 + Math.random() * 30;
        this.anomalyDetector.addDataPoint(price, { symbol, type: "price" });
      }
    }

    // 3. Analyze for opportunities
    const anomalyReport = this.anomalyDetector.getAnomalyReport();
    if (anomalyReport.hasPatternChange) {
      opportunities.push({
        id: `opp-${Date.now()}`,
        type: "pattern",
        description: "Significant pattern change detected",
        confidence: 0.75,
        potential: 0.8,
        risk: 0.6,
        discoveredAt: Date.now(),
        actions: ["investigate_pattern", "adjust_strategy"]
      });
    }

    // 4. Record learning from exploration
    this.learningAgent.recordFeedback(
      "behavioral",
      "market_exploration",
      undefined,
      opportunities.length > 0 ? "positive" : "neutral"
    );

    this.opportunities = opportunities;
    return opportunities;
  }

  // Discover new investment strategies
  async discoverStrategies(): Promise<string[]> {
    // Use experimentation to discover better strategies
    const exp = this.experimentationFramework.createExperiment(
      "Strategy Discovery",
      "Testing new investment strategies",
      "New strategies will outperform baseline"
    );

    this.experimentationFramework.startExperiment(exp.id);

    // Simulate testing
    const strategies = [
      "momentum_strategy",
      "mean_reversion",
      "pairs_trading",
      "sector_rotation"
    ];

    return strategies;
  }

  // Get market insights
  getMarketInsights(): any {
    return {
      opportunities: this.opportunities.length,
      anomalyReport: this.anomalyDetector.getAnomalyReport(),
      actionableInsights: this.learningAgent.getActionableInsights(),
      explorationBudget: this.infoGatheringAgent.getBudget()
    };
  }
}

// Example: Run investment exploration
// 示例：运行投资探索
async function demoInvestmentExploration() {
  const explorationAgent = new InvestmentExplorationAgent();

  console.log("=== Investment Exploration Agent ===\n");

  // Explore market
  const opportunities = await explorationAgent.exploreMarket(["AAPL", "GOOGL", "MSFT"]);

  console.log("\nDiscovered opportunities:");
  opportunities.forEach(opp => {
    console.log(`  - ${opp.type}: ${opp.description} (confidence: ${opp.confidence})`);
  });

  // Discover strategies
  const strategies = await explorationAgent.discoverStrategies();
  console.log("\nPotential strategies:", strategies);

  // Get insights
  console.log("\nMarket insights:", explorationAgent.getMarketInsights());
}

demoInvestmentExploration();
```

---

## 社区热议与实践分享

探索与发现模式作为智能体设计的核心能力之一，在 2025-2026 年间引发了 AI 社区的广泛讨论。以下是来自行业领袖、研究者和开发者社区的关键洞察。

### 行业领袖观点

**Andrej Karpathy — "智能体的十年"**

前 OpenAI 联合创始人 Karpathy 在 2025 年初于 X (Twitter) 上发表了对智能体时代的预判：

> "Personally I think 2025-2035 is the decade of agents. I feel a huge amount of work across the board to make it actually work. But it *should* work."
>
> — Andrej Karpathy, [X/Twitter](https://x.com/karpathy/status/1882544526033924438)

Karpathy 随后发布了 [autoresearch](https://github.com/karpathy/autoresearch) 项目，让 AI 智能体在夜间自主运行数百个机器学习实验。在一次隔夜运行中，智能体完成了 126 个实验，将损失从 0.9979 降至 0.9697，发现了约 20 个可叠加的改进方案，将"GPT-2 训练时间"指标缩短了 11%。这个项目直接展示了探索与发现模式在自主研究中的巨大价值。

**Andrew Ng — 智能体设计模式的奠基者**

吴恩达提出的四大智能体设计模式（反思、工具使用、规划、多智能体协作）已经成为行业的基础框架。他在 [X/Twitter](https://x.com/AndrewYNg/status/1773393357022298617) 上分享道：

> "Instead of having an LLM generate its final output directly, an agentic workflow prompts the LLM multiple times, giving it opportunities to build step by step toward higher-quality output."

Ng 在其 [DeepLearning.AI 课程](https://www.deeplearning.ai/courses/agentic-ai/) 中强调，决定执行质量的最大预测因子是对评估（evals）和错误分析的严格流程管理——让数据引导开发者聚焦改进方向，而不是盲目猜测。

**Harrison Chase — 从工具发现到深度智能体**

LangChain 创始人 Harrison Chase 在 2025 年提出了"深度智能体"（Deep Agents）概念。他在 [ODSC AI West 2025](https://opendatascience.com/harrison-chase-on-deep-agents-the-next-evolution-in-autonomous-ai/) 演讲中指出：

> "What makes them 'deep' is the sophistication around that loop — planning, context management, memory, subagents, and richer prompting."

Chase 还推动了"环境智能体"（Ambient Agents）概念——在后台持续运行、响应事件而非等待人类提示的 AI 系统。这与探索模式高度吻合：智能体不再被动等待任务指派，而是主动在环境中发现信息和机会。

### 工具发现与协议标准化

2025 年最引人注目的社区趋势之一是**工具发现协议的标准化**。

**MCP（模型上下文协议）的崛起**

Anthropic 在 2024 年底推出的 [Model Context Protocol (MCP)](https://en.wikipedia.org/wiki/Model_Context_Protocol)，在 2025 年迅速成为连接智能体与外部工具的事实标准。关键里程碑包括：

- OpenAI 的 Sam Altman 在 X 上表示："People love MCP and we are excited to add support across our products."
- Google DeepMind 确认将在 Gemini 模型中支持 MCP
- 截至 2025 年底，社区已构建超过 17,000 个 MCP 服务器
- Anthropic 将 MCP 捐赠给 Linux 基金会下的 Agentic AI Foundation

**动态工具发现**

随着工具生态的爆发式增长，Anthropic 引入了 [Tool Search](https://tessl.io/blog/anthropic-brings-mcp-tool-search-to-claude-code/) 功能，让智能体按需发现和加载工具，而非预加载整个工具目录。这种"渐进式发现"（Progressive Discovery）方法将工具定义的 token 消耗从 150,000 降低到 2,000——节省了 98.7%。

Cobus Greyling（Kore AI 首席布道师）在 [Medium 系列文章](https://cobusgreyling.medium.com/agentic-discovery-8b314b4b88e3)中将这种能力命名为"Agentic Discovery"：

> "Agentic Discovery refers to an AI agent's ability to autonomously explore new strategies and solutions by self-evaluating and refining its process, leading to innovative outcomes."

### 学术研究前沿

**探索广度 vs. 深度的权衡**

[FML-bench](https://arxiv.org/html/2510.10472v1) 基准测试揭示了一个重要发现：不同智能体展现出截然不同的探索策略。TheAIScientist 采用"广而浅"的策略，AIDE 保持中等的广度和深度，而 Claude Code 则展现"窄而深"的模式。研究结论是：**更广泛的研究探索空间在发现有前景的想法方面更加有效**。

**不确定性感知探索**

[SELAUR](https://arxiv.org/html/2508.12752v1)（Self Evolving LLM Agent via Uncertainty-aware Rewards）框架将 LLM 内在的不确定性信号融入奖励设计，使智能体即使从失败经验中也能提取有意义的学习线索，显著提升了探索效率。

**世界模型与自主探索**

Yann LeCun 创立的 [AMI Labs](https://techcrunch.com/2026/03/09/yann-lecuns-ami-labs-raises-1-03-billion-to-build-world-models/) 在 2026 年初融资超过 10 亿美元，专注于构建"世界模型"——一种能够内部模拟物理世界并预测行为后果的 AI 系统。LeCun 认为这是"让智能体系统真正可靠的关键"。与此同时，NVIDIA 的 Jim Fan 领导的 [GEAR Lab](https://research.nvidia.com/labs/gear/) 通过 Voyager 等项目，展示了智能体在开放世界中自主探索和持续学习的能力。

**自主发现的强化学习算法**

2025 年发表在 [Nature](https://www.nature.com/articles/s41586-025-09761-x) 上的一项突破性研究表明，机器可以通过元学习从大量复杂环境中自主发现超越人工设计的强化学习规则，在 Atari 基准测试中取得了领先性能。

### 社区实践总结

综合社区讨论和实践经验，探索与发现模式呈现以下关键趋势：

| 趋势 | 社区共识 |
|------|----------|
| **协议标准化** | MCP 已成为工具发现的行业标准，17,000+ 服务器构成庞大生态 |
| **动态发现** | 从静态工具加载转向按需、渐进式工具发现成为主流 |
| **广度优先探索** | 研究表明广泛探索多样化方向优于深钻单一路径 |
| **环境感知智能体** | 从被动响应指令转向主动感知环境变化，持续后台运行 |
| **世界模型** | 内部模拟和预测能力成为可靠自主探索的关键基础设施 |
| **从实验到生产** | 2026 年标志着智能体探索能力从原型验证进入生产部署阶段 |

---

## Chapter Summary | 本章小结

### Key Points | 核心要点

| Aspect | Description | 描述 |
|--------|-------------|------|

| **Capability Discovery** | Identify available tools and resources | 识别可用的工具和资源 |
| **Information Gathering** | Proactively collect relevant information | 主动收集相关信息 |
| **Experimentation** | Test new approaches systematically | 系统地测试新方法 |
| **Feedback Learning** | Improve from user interactions | 从用户交互中改进 |
| **Anomaly Detection** | Discover unusual patterns | 发现异常模式 |

### Best Practices | 最佳实践

1. **Balance Exploration and Exploitation**: Don't just exploit known patterns—explore new possibilities.

   平衡探索与利用：不要只是利用已知模式——探索新的可能性。

2. **Systematic Experimentation**: Use proper experimental design to validate discoveries.

   系统实验：使用适当的实验设计来验证发现。

3. **Learn from Feedback**: Continuously improve based on user feedback and behavioral data.

   从反馈中学习：基于用户反馈和行为数据持续改进。

4. **Detect Anomalies**: Look for patterns that deviate from the norm—they often signal opportunities.

   检测异常：寻找偏离常规的模式——它们通常预示机会。

5. **Document Discoveries**: Keep track of what you learn for future reference.

   记录发现：跟踪你学到的东西以供将来参考。

### Application Scenarios | 应用场景

| Scenario | Exploration Type | 应用 |
|----------|------------------|------|

| **Research** | Information gathering | 研究 |
| **Trading** | Anomaly detection | 交易 |
| **Product** | Capability discovery | 产品 |
| **Optimization** | Experimentation | 优化 |
| **Learning** | Feedback-driven | 学习 |

### Exploration Metrics | 探索指标

- **Discovery Rate**: New capabilities found per session.

  发现率：每个会话发现的新能力。

- **Experiment Success Rate**: Percentage of successful experiments.

  实验成功率：成功实验的百分比。

- **Anomaly Detection Rate**: Anomalies detected per time period.

  异常检测率：每个时间段检测到的异常。

- **Learning Velocity**: Speed of insight generation.

  学习速度：洞察生成速度。

- **Opportunity Conversion**: Discoveries that lead to actions.

  机会转化：导致行动的发现。

---

## 参考资源

### 行业领袖与社区讨论

- [Andrej Karpathy — 2025 LLM Year in Review](https://karpathy.bearblog.dev/year-in-review-2025/) — Karpathy 对 2025 年 LLM 发展的深度年度总结
- [Andrej Karpathy — autoresearch 项目](https://github.com/karpathy/autoresearch) — AI 智能体自主运行机器学习实验的开源项目
- [Andrew Ng — Agentic AI 课程](https://www.deeplearning.ai/courses/agentic-ai/) — 四大智能体设计模式的系统课程
- [Andrew Ng — 四大智能体设计模式推文](https://x.com/AndrewYNg/status/1773393357022298617) — 关于智能体工作流的核心推文
- [Harrison Chase — Deep Agents 演讲](https://opendatascience.com/harrison-chase-on-deep-agents-the-next-evolution-in-autonomous-ai/) — 深度智能体的演进方向
- [Harrison Chase — Ambient Agents 讨论](https://inferencebysequoia.substack.com/p/ambient-agents-and-the-new-agent) — 环境智能体与新型智能体收件箱
- [Cobus Greyling — Agentic Discovery 系列](https://cobusgreyling.medium.com/agentic-discovery-8b314b4b88e3) — 智能体自主发现能力的深入分析

### 协议与工具发现

- [Model Context Protocol (MCP) — Wikipedia](https://en.wikipedia.org/wiki/Model_Context_Protocol) — MCP 协议概述
- [Anthropic — Tool Search in Claude Code](https://tessl.io/blog/anthropic-brings-mcp-tool-search-to-claude-code/) — 动态工具发现功能
- [Anthropic — Code Execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) — 渐进式工具发现的代码优先方法
- [A Year of MCP — 2025 Review](https://www.pento.ai/blog/a-year-of-mcp-2025-review) — MCP 生态的年度回顾
- [Agent Skills: The Missing Piece](https://subramanya.ai/2025/12/18/agent-skills-the-missing-piece-of-the-enterprise-ai-puzzle/) — 智能体技能与 MCP 的互补关系

### 学术研究

- [Deep Research: A Survey of Autonomous Research Agents](https://arxiv.org/html/2508.12752v1) — 自主研究智能体的综合综述
- [FML-bench: Importance of Exploration Breadth](https://arxiv.org/html/2510.10472v1) — 探索广度对 AI 研究智能体的重要性
- [Agentic AI for Scientific Discovery](https://arxiv.org/html/2503.08979v1) — 智能体 AI 在科学发现中的进展与挑战
- [Agentic Discovery: Closing the Loop with Cooperative Agents](https://arxiv.org/html/2510.13081v1) — 协作智能体的闭环发现
- [Discovering State-of-the-Art RL Algorithms — Nature 2025](https://www.nature.com/articles/s41586-025-09761-x) — 自主发现强化学习算法的突破
- [Rethinking Exploration-Exploitation Trade-Off via Cognitive Consistency](https://www.sciencedirect.com/science/article/abs/pii/S0893608025002217) — 通过认知一致性重新思考探索-利用权衡
- [The 2025 AI Agent Index](https://arxiv.org/html/2602.17753v1) — 已部署智能体系统的技术与安全特征

### 行业报告与趋势

- [7 Agentic AI Trends to Watch in 2026 — Machine Learning Mastery](https://machinelearningmastery.com/7-agentic-ai-trends-to-watch-in-2026/) — 2026 年七大智能体趋势
- [5 Key Trends Shaping Agentic Development in 2026 — The New Stack](https://thenewstack.io/5-key-trends-shaping-agentic-development-in-2026/) — 塑造智能体开发的五大关键趋势
- [The State of AI Agents in 2026 — Jon Radoff](https://meditations.metavert.io/p/the-state-of-ai-agents-in-2026) — 2026 年 AI 智能体状态报告
- [Microsoft Discovery — Transforming R&D with Agentic AI](https://azure.microsoft.com/en-us/blog/transforming-rd-with-agentic-ai-introducing-microsoft-discovery/) — 微软的智能体驱动研发平台
- [AWS — Guidance for Agentic Data Exploration](https://aws.amazon.com/solutions/guidance/agentic-data-exploration-on-aws/) — AWS 智能体数据探索方案

### 世界模型与具身智能

- [Yann LeCun's AMI Labs — TechCrunch](https://techcrunch.com/2026/03/09/yann-lecuns-ami-labs-raises-1-03-billion-to-build-world-models/) — AMI Labs 融资与世界模型愿景
- [NVIDIA GEAR Lab](https://research.nvidia.com/labs/gear/) — Jim Fan 领导的通用具身智能体研究
- [World Models Race 2026 — Introl](https://introl.com/blog/world-models-race-agi-2026) — 2026 年世界模型竞赛格局

### 开源资源

- [Autonomous Agents 论文集](https://github.com/tmgthb/Autonomous-Agents) — 每日更新的自主智能体研究论文合集
- [Awesome Exploration RL](https://github.com/opendilab/awesome-exploration-rl) — 强化学习探索方法资源合集
- [LangChain](https://github.com/langchain-ai/langchain) — 智能体工程的核心框架（99,000+ Stars）