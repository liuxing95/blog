---
title: 'Chapter 20: Agentic UX Design'
date: '2026-03-15'
excerpt: 'User experience is critical for agent adoption and effectiveness. 融合社区洞察与行业前沿实践，探索智能体用户体验设计的最新趋势。'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 20: Agentic UX Design

# 第二十章：智能体用户体验设计

## Agentic UX Design Pattern Overview

## 智能体用户体验设计模式概述

User experience is critical for agent adoption and effectiveness.

用户体验对于智能体的采用和效能至关重要。

This pattern focuses on designing interactions that are intuitive, trustworthy, and aligned with human needs.

此模式专注于设计直观、可信且符合人类需求的交互。

### Human-Centered AI

### 以人为中心的AI

**User Research**: Understand user needs and contexts.

**用户研究**: 了解用户需求和场景。

**Task Alignment**: Design agents that support actual user tasks.

**任务对齐**: 设计支持实际用户任务的智能体。

**Feedback Mechanisms**: Provide clear feedback on agent actions.

**反馈机制**: 提供关于智能体操作的清晰反馈。

**Error Handling**: Design graceful error recovery.

**错误处理**: 设计优雅的错误恢复。

### Trust Building

### 信任建立

**Transparency**: Be clear about agent capabilities and limitations.

**透明度**: 明确智能体的能力和局限性。

**Reliability**: Consistently perform as expected.

**可靠性**: 如预期一致地执行。

**Competence**: Demonstrate ability to handle tasks effectively.

**能力**: 展示有效处理任务的能力。

**Dependability**: Be available and responsive when needed.

**可信赖性**: 在需要时可用并响应迅速。

### Explainability

### 可解释性

**Decision Explanation**: Explain why agents make specific decisions.

**决策解释**: 解释智能体做出特定决策的原因。

**Action Justification**: Provide rationale for agent actions.

**行动理由**: 提供智能体行动的理由。

**Uncertainty Communication**: communicate when agents are uncertain.

**不确定性沟通**: 在智能体不确定时进行沟通。

**History Tracking**: Maintain clear history of agent interactions.

**历史跟踪**: 保持智能体交互的清晰历史。

## Practical Applications & Use Cases

## 实际应用与用例场景

### Conversational Interfaces | 对话界面

Agent-based conversational interfaces require careful attention to dialogue flow, context maintenance, and natural language understanding. The best implementations maintain conversation history, handle ambiguity gracefully, and provide clear options when user intent is unclear. Companies like Intercom and Drift have shown that well-designed AI chatbots can increase customer satisfaction by 30% while handling 60% of routine inquiries.

基于智能体的对话界面需要仔细关注对话流程、上下文维护和自然语言理解。最好的实现会保持对话历史，在用户意图不明确时优雅地处理，并提供清晰的选项。Intercom和Drift等公司表明，精心设计的AI聊天机器人可以在处理60%常规咨询的同时将客户满意度提高30%。

### Trust-Critical Applications | 信任关键应用

In domains like healthcare, finance, and legal services, user trust is paramount. Agents must provide clear explanations of their recommendations, acknowledge limitations, and seamlessly involve human experts when appropriate. Medical AI systems like Babylon Health demonstrate how transparent reasoning and clear uncertainty communication can build user confidence in AI-assisted diagnosis.

在医疗、金融和法律服务等领域，用户信任至关重要。智能体必须提供清晰的建议解释，承认局限性，并在适当时无缝引入人类专家。Babylon Health等医疗AI系统展示了透明的推理和清晰的不确定性沟通如何建立用户对AI辅助诊断的信心。

### Multi-Modal Interactions | 多模态交互

Modern agent interfaces often combine text, voice, visual elements, and even gesture. The key is choosing the right modality for each context—voice for hands-free scenarios, visual for complex data, text for detailed documentation. Effective multi-modal agents seamlessly transition between modalities while maintaining context.

现代智能体界面通常结合文本、语音、视觉元素甚至手势。关键是为每个上下文选择正确的模态——免提场景使用语音，复杂数据使用视觉，详细文档使用文本。有效的多模态智能体在保持上下文的同时无缝切换模态。

### Accessibility | 无障碍设计

Agent interfaces must be accessible to users with diverse abilities. This includes screen reader compatibility, keyboard navigation, high contrast options, and support for users with cognitive disabilities. Inclusive design isn't just ethical—it's good business, as it expands the potential user base by 15-20%.

智能体界面必须能够被具有不同能力的用户访问。这包括屏幕阅读器兼容性、键盘导航、高对比度选项以及对认知障碍用户的支持。包容性设计不仅是道德的——也是好生意，因为它可以将潜在用户群扩展15-20%。

---

## Hands-On Code Examples

## 动手实践代码示例

### Example 1: Conversation State Management | 示例1：对话状态管理

```typescript
// Conversation state management for agent UX
// 智能体用户体验的对话状态管理
import { ChatOpenAI } from "@langchain/openai";

// Conversation state
// 对话状态
interface ConversationState {
  sessionId: string;
  messages: Message[];
  context: Record<string, any>;
  userProfile?: UserProfile;
  agentState: "idle" | "thinking" | "responding" | "waiting";
  lastUpdated: number;
}

// Message structure
// 消息结构
interface Message {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  timestamp: number;
  metadata?: {
    intent?: string;
    confidence?: number;
    actions?: string[];
  };
}

// User profile
// 用户画像
interface UserProfile {
  id: string;
  preferences: {
    language: string;
    verbosity: "brief" | "normal" | "detailed";
    explanations: boolean;
  };
  history: {
    totalConversations: number;
    avgSatisfaction: number;
  };
}

// Conversation manager
// 对话管理器
class ConversationManager {
  private conversations: Map<string, ConversationState> = new Map();
  private maxHistoryLength = 50;

  // Start new conversation
  createSession(sessionId: string, userProfile?: UserProfile): ConversationState {
    const state: ConversationState = {
      sessionId,
      messages: [],
      context: {},
      userProfile,
      agentState: "idle",
      lastUpdated: Date.now()
    };

    this.conversations.set(sessionId, state);
    console.log(`[Conversation] Created session: ${sessionId}`);

    return state;
  }

  // Add message to conversation
  addMessage(
    sessionId: string,
    role: "user" | "agent" | "system",
    content: string,
    metadata?: any
  ): Message {
    const state = this.conversations.get(sessionId);
    if (!state) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const message: Message = {
      id: `msg-${Date.now()}`,
      role,
      content,
      timestamp: Date.now(),
      metadata
    };

    state.messages.push(message);
    state.lastUpdated = Date.now();

    // Trim history if needed
    if (state.messages.length > this.maxHistoryLength) {
      state.messages = state.messages.slice(-this.maxHistoryLength);
    }

    console.log(`[Conversation] Added ${role} message to session ${sessionId}`);
    return message;
  }

  // Get conversation context
  getContext(sessionId: string): ConversationState | undefined {
    return this.conversations.get(sessionId);
  }

  // Update context
  updateContext(sessionId: string, key: string, value: any): void {
    const state = this.conversations.get(sessionId);
    if (state) {
      state.context[key] = value;
      state.lastUpdated = Date.now();
    }
  }

  // Get recent messages
  getRecentMessages(sessionId: string, count: number = 10): Message[] {
    const state = this.conversations.get(sessionId);
    if (!state) return [];

    return state.messages.slice(-count);
  }

  // Set agent state
  setAgentState(sessionId: string, agentState: "idle" | "thinking" | "responding" | "waiting"): void {
    const state = this.conversations.get(sessionId);
    if (state) {
      state.agentState = agentState;
      state.lastUpdated = Date.now();
    }
  }

  // Check if session exists
  hasSession(sessionId: string): boolean {
    return this.conversations.has(sessionId);
  }

  // Get all sessions
  getAllSessions(): string[] {
    return Array.from(this.conversations.keys());
  }
}

// Example usage: 创建示例
const manager = new ConversationManager();

// Create a session
const session = manager.createSession("user-123", {
  id: "user-123",
  preferences: {
    language: "en",
    verbosity: "normal",
    explanations: true
  },
  history: {
    totalConversations: 5,
    avgSatisfaction: 4.2
  }
});

// Add messages
manager.addMessage("user-123", "user", "What's the weather today?");
manager.addMessage("user-123", "agent", "The weather today is sunny with a high of 72°F.", {
  intent: "weather_query",
  confidence: 0.95
});

console.log("Recent messages:", manager.getRecentMessages("user-123", 5));
```

### Example 2: Explainable AI Responses | 示例2：可解释的AI响应

```typescript
// Explainable AI response system
// 可解释AI响应系统
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Explanation types
// 解释类型
enum ExplanationType {
  DECISION = "decision",
  RECOMMENDATION = "recommendation",
  ACTION = "action",
  UNCERTAINTY = "uncertainty",
  LIMITATION = "limitation"
}

// Explanation structure
// 解释结构
interface Explanation {
  type: ExplanationType;
  title: string;
  reasoning: string;
  supportingEvidence: string[];
  confidence: number;
  alternatives?: string[];
  userFriendly: string;
}

// Explanation generator
// 解释生成器
class ExplanationGenerator {
  private llm: ChatOpenAI;

  constructor() {
    this.llm = new ChatOpenAI({ temperature: 0.3 });
  }

  // Generate explanation for a decision
  async generateExplanation(
    type: ExplanationType,
    decision: string,
    context: Record<string, any>
  ): Promise<Explanation> {
    // Generate user-friendly explanation
    const prompt = ChatPromptTemplate.fromTemplate(
      `You are an AI that explains decisions in simple, user-friendly language.
      Decision: {decision}
      Context: {context}
      Type: {type}

      Provide:
      1. A brief title (max 10 words)
      2. A simple explanation (2-3 sentences, avoid jargon)
      3. The reasoning behind the decision (3-4 bullet points)
      4. Supporting evidence or factors

      Format as JSON with keys: title, userFriendly, reasoning, supportingEvidence`
    );

    try {
      const response = await this.llm.invoke(
        await prompt.format({
          decision,
          context: JSON.stringify(context),
          type
        })
      );

      // Parse response (simplified)
      const explanation: Explanation = {
        type,
        title: `Explanation: ${decision.substring(0, 30)}...`,
        reasoning: `Based on the provided context and analysis, ${decision}`,
        supportingEvidence: Object.keys(context).slice(0, 3),
        confidence: context.confidence || 0.85,
        userFriendly: decision
      };

      // Add alternatives if applicable
      if (context.alternatives) {
        explanation.alternatives = context.alternatives;
      }

      return explanation;

    } catch (error) {
      // Fallback explanation
      return {
        type,
        title: "Decision Made",
        reasoning: "Analysis completed based on available data",
        supportingEvidence: [],
        confidence: 0.5,
        userFriendly: decision
      };
    }
  }

  // Generate uncertainty explanation
  generateUncertaintyExplanation(confidence: number, factors: string[]): Explanation {
    let message: string;
    if (confidence >= 0.8) {
      message = "I'm quite confident in this assessment.";
    } else if (confidence >= 0.6) {
      message = "I'm reasonably confident, but there are some uncertainties.";
    } else if (confidence >= 0.4) {
      message = "I'm uncertain about this - the data is mixed.";
    } else {
      message = "I don't have enough information to give a reliable answer.";
    }

    return {
      type: ExplanationType.UNCERTAINTY,
      title: "Confidence Level",
      reasoning: message,
      supportingEvidence: factors,
      confidence,
      userFriendly: message
    };
  }
}

// Response builder with explanations
// 带解释的响应构建器
class ExplainableResponseBuilder {
  private explanationGenerator: ExplanationGenerator;

  constructor() {
    this.explanationGenerator = new ExplanationGenerator();
  }

  // Build response with explanation
  async buildResponse(
    content: string,
    decision: string,
    context: Record<string, any>,
    includeExplanation: boolean = true
  ): Promise<{ content: string; explanation?: Explanation }> {
    const response: { content: string; explanation?: Explanation } = {
      content
    };

    if (includeExplanation) {
      response.explanation = await this.explanationGenerator.generateExplanation(
        ExplanationType.RECOMMENDATION,
        decision,
        context
      );
    }

    return response;
  }

  // Build response with confidence indicator
  buildResponseWithConfidence(
    content: string,
    confidence: number,
    factors: string[]
  ): { content: string; confidence: number; explanation: Explanation } {
    const explanation = this.explanationGenerator.generateUncertaintyExplanation(
      confidence,
      factors
    );

    return {
      content,
      confidence,
      explanation
    };
  }
}

// Example usage: 创建示例
const builder = new ExplainableResponseBuilder();

// Example with explanation
builder.buildResponse(
  "Based on your risk profile, I recommend a diversified portfolio with 60% stocks and 40% bonds.",
  "Recommended 60/40 portfolio allocation",
  { riskScore: 0.6, age: 35, goals: "growth" }
).then(response => {
  console.log("Response with explanation:");
  console.log("  Content:", response.content);
  console.log("  Explanation:", response.explanation?.title);
});

// Example with confidence
const confidentResponse = builder.buildResponseWithConfidence(
  "The market shows strong upward momentum based on recent trends.",
  0.85,
  ["S&P 500 up 2% this week", "Low unemployment data", "Positive earnings reports"]
);

console.log("\nResponse with confidence:");
console.log("  Content:", confidentResponse.content);
console.log("  Confidence:", confidentResponse.confidence);
console.log("  Explanation:", confidentResponse.explanation.userFriendly);
```

### Example 3: User Feedback Collection | 示例3：用户反馈收集

```typescript
// User feedback collection system
// 用户反馈收集系统
import { ChatOpenAI } from "@langchain/openai";

// Feedback types
// 反馈类型
enum FeedbackType {
  SATISFACTION = "satisfaction",
  USABILITY = "usability",
  ACCURACY = "accuracy",
  SPEED = "speed",
  OVERALL = "overall"
}

// Feedback entry
// 反馈条目
interface FeedbackEntry {
  id: string;
  sessionId: string;
  type: FeedbackType;
  rating: number; // 1-5
  comment?: string;
  timestamp: number;
  context?: Record<string, any>;
}

// Feedback collector
// 反馈收集器
class FeedbackCollector {
  private feedback: FeedbackEntry[] = [];
  private pendingRequests: Map<string, FeedbackType[]> = new Map();

  // Request feedback from user
  requestFeedback(sessionId: string, types: FeedbackType[]): string {
    const requestId = `fb-${Date.now()}`;
    this.pendingRequests.set(requestId, types);

    console.log(`[Feedback] Requested feedback for session ${sessionId}`);
    return requestId;
  }

  // Collect feedback
  collectFeedback(
    sessionId: string,
    type: FeedbackType,
    rating: number,
    comment?: string
  ): FeedbackEntry {
    const entry: FeedbackEntry = {
      id: `feedback-${Date.now()}`,
      sessionId,
      type,
      rating: Math.min(5, Math.max(1, rating)),
      comment,
      timestamp: Date.now()
    };

    this.feedback.push(entry);
    console.log(`[Feedback] Collected ${type} feedback: ${rating}/5`);

    return entry;
  }

  // Get feedback for session
  getSessionFeedback(sessionId: string): FeedbackEntry[] {
    return this.feedback.filter(f => f.sessionId === sessionId);
  }

  // Get average ratings
  getAverageRatings(): Record<FeedbackType, number> {
    const ratings: Record<FeedbackType, { sum: number; count: number }> = {
      [FeedbackType.SATISFACTION]: { sum: 0, count: 0 },
      [FeedbackType.USABILITY]: { sum: 0, count: 0 },
      [FeedbackType.ACCURACY]: { sum: 0, count: 0 },
      [FeedbackType.SPEED]: { sum: 0, count: 0 },
      [FeedbackType.OVERALL]: { sum: 0, count: 0 }
    };

    for (const f of this.feedback) {
      ratings[f.type].sum += f.rating;
      ratings[f.type].count++;
    }

    const averages: Record<FeedbackType, number> = {} as any;
    for (const type of Object.keys(ratings) as FeedbackType[]) {
      const { sum, count } = ratings[type];
      averages[type] = count > 0 ? sum / count : 0;
    }

    return averages;
  }

  // Get NPS score
  getNPSScore(): number {
    const promoters = this.feedback.filter(f =>
      f.type === FeedbackType.OVERALL && f.rating >= 4
    ).length;
    const detractors = this.feedback.filter(f =>
      f.type === FeedbackType.OVERALL && f.rating <= 2
    ).length;
    const total = this.feedback.filter(f =>
      f.type === FeedbackType.OVERALL
    ).length;

    if (total === 0) return 0;

    return ((promoters - detractors) / total) * 100;
  }

  // Generate feedback report
  generateReport(): any {
    return {
      totalFeedback: this.feedback.length,
      averageRatings: this.getAverageRatings(),
      npsScore: this.getNPSScore(),
      recentFeedback: this.feedback.slice(-10).map(f => ({
        type: f.type,
        rating: f.rating,
        comment: f.comment
      }))
    };
  }
}

// In-conversation feedback prompts
// 对话内反馈提示
class FeedbackPrompts {
  private collector: FeedbackCollector;

  constructor(collector: FeedbackCollector) {
    this.collector = collector;
  }

  // Get appropriate feedback prompt
  getPrompt(type: FeedbackType): string {
    const prompts: Record<FeedbackType, string> = {
      [FeedbackType.SATISFACTION]: "How satisfied are you with this response?",
      [FeedbackType.USABILITY]: "Was this easy to understand?",
      [FeedbackType.ACCURACY]: "Was this information accurate?",
      [FeedbackType.SPEED]: "Was this response fast enough?",
      [FeedbackType.OVERALL]: "How would you rate your overall experience?"
    };

    return prompts[type];
  }

  // Generate rating UI description
  getRatingUI(): string {
    return "Please rate: 1 (Poor) to 5 (Excellent)";
  }

  // Handle feedback collection
  handleFeedbackResponse(
    sessionId: string,
    response: string | number,
    type: FeedbackType = FeedbackType.OVERALL
  ): FeedbackEntry | null {
    // If numeric rating
    if (typeof response === "number") {
      return this.collector.collectFeedback(sessionId, type, response);
    }

    // Parse text response (simplified)
    const positive = ["good", "great", "excellent", "satisfied", "helpful"];
    const negative = ["bad", "poor", "unsatisfied", "not helpful"];

    const lower = response.toLowerCase();
    if (positive.some(p => lower.includes(p))) {
      return this.collector.collectFeedback(sessionId, type, 4);
    } else if (negative.some(n => lower.includes(n))) {
      return this.collector.collectFeedback(sessionId, type, 2);
    }

    return null;
  }
}

// Example usage: 创建示例
const collector = new FeedbackCollector();
const prompts = new FeedbackPrompts(collector);

// Simulate feedback collection
collector.collectFeedback("session-1", FeedbackType.SATISFACTION, 5, "Very helpful!");
collector.collectFeedback("session-1", FeedbackType.ACCURACY, 4, "Mostly accurate");
collector.collectFeedback("session-2", FeedbackType.OVERALL, 5, "Excellent service");
collector.collectFeedback("session-3", FeedbackType.OVERALL, 2, "Not what I needed");

console.log("\n=== Feedback Report ===");
console.log(JSON.stringify(collector.generateReport(), null, 2));
```

### Example 4: Accessibility Features | 示例4：无障碍功能

```typescript
// Accessibility features for agent interfaces
// 智能体界面的无障碍功能
import { ChatOpenAI } from "@langchain/openai";

// Accessibility preferences
// 无障碍偏好
interface AccessibilityPreferences {
  screenReader: boolean;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  keyboardNavigation: boolean;
  cognitiveSupport: boolean;
}

// Content formatting options
// 内容格式化选项
interface FormattingOptions {
  usePlainLanguage: boolean;
  includeSummaries: boolean;
  breakIntoSteps: boolean;
  useBullets: boolean;
  maxSentenceLength: number;
}

// Accessibility manager
// 无障碍管理器
class AccessibilityManager {
  private userPreferences: Map<string, AccessibilityPreferences> = new Map();

  // Set user preferences
  setPreferences(userId: string, preferences: Partial<AccessibilityPreferences>): void {
    const current = this.userPreferences.get(userId) || {
      screenReader: false,
      highContrast: false,
      largeText: false,
      reducedMotion: true,
      keyboardNavigation: true,
      cognitiveSupport: false
    };

    this.userPreferences.set(userId, { ...current, ...preferences });
    console.log(`[Accessibility] Updated preferences for user ${userId}`);
  }

  // Get user preferences
  getPreferences(userId: string): AccessibilityPreferences {
    return this.userPreferences.get(userId) || {
      screenReader: false,
      highContrast: false,
      largeText: false,
      reducedMotion: true,
      keyboardNavigation: true,
      cognitiveSupport: false
    };
  }

  // Format content for accessibility
  formatContent(userId: string, content: string): string {
    const prefs = this.getPreferences(userId);
    let formatted = content;

    if (prefs.usePlainLanguage || prefs.cognitiveSupport) {
      formatted = this.simplifyLanguage(formatted);
    }

    if (prefs.cognitiveSupport) {
      formatted = this.breakIntoSteps(formatted);
      formatted = this.addSummaries(formatted);
    }

    if (prefs.useBullets) {
      formatted = this.convertToBullets(formatted);
    }

    return formatted;
  }

  // Simplify language
  private simplifyLanguage(text: string): string {
    // In production, would use proper text simplification
    // 简化复杂词汇
    const simplifications: Record<string, string> = {
      "utilize": "use",
      "facilitate": "help",
      "implement": "do",
      "subsequently": "later",
      "therefore": "so",
      "however": "but",
      "additionally": "also",
      "approximately": "about"
    };

    let simplified = text;
    for (const [complex, simple] of Object.entries(simplifications)) {
      simplified = simplified.replace(new RegExp(complex, "gi"), simple);
    }

    return simplified;
  }

  // Break into steps
  private breakIntoSteps(text: string): string {
    // Split long paragraphs
    const sentences = text.split(". ");
    if (sentences.length <= 3) return text;

    // Add step markers
    return sentences.map((s, i) => {
      const step = i + 1;
      return s.trim() + (i < sentences.length - 1 ? "." : "");
    }).join("\n\n");
  }

  // Add summaries
  private addSummaries(text: string): string {
    // Add brief summary at start
    const summary = "Here's what you need to know:\n\n";
    return summary + text;
  }

  // Convert to bullets
  private convertToBullets(text: string): string {
    // Convert lists to bullet points
    return text.replace(/(\d+\.\s)/g, "- ");
  }

  // Generate ARIA labels
  generateARIAlabel(elementType: string, content: string): string {
    const prefs = this.getPreferences(""); // Default for current user
    if (!prefs.screenReader) return "";

    return `${elementType}: ${content.substring(0, 100)}`;
  }

  // Get keyboard navigation hints
  getKeyboardHints(): string[] {
    return [
      "Press Tab to navigate between elements",
      "Press Enter to select",
      "Press Escape to cancel",
      "Use arrow keys for lists"
    ];
  }
}

// Example usage: 创建示例
const accessibilityManager = new AccessibilityManager();

// Set user preferences
accessibilityManager.setPreferences("user-123", {
  cognitiveSupport: true,
  largeText: true
});

// Format content
const content = "We subsequently implemented the solution to facilitate better user experience.";
const formatted = accessibilityManager.formatContent("user-123", content);

console.log("\n=== Accessibility Formatting ===");
console.log("Original:", content);
console.log("Formatted:", formatted);

// Get keyboard hints
console.log("\nKeyboard hints:", accessibilityManager.getKeyboardHints());
```

### Example 5: Trust Building Features | 示例5：信任建设功能

```typescript
// Trust building features for agent interfaces
// 智能体界面的信任建设功能
import { ChatOpenAI } from "@langchain/openai";

// Trust indicators
// 信任指标
interface TrustIndicators {
  accuracy: number;
  reliability: number;
  transparency: number;
  competence: number;
  overall: number;
}

// Capability disclosure
// 能力披露
interface CapabilityDisclosure {
  capability: string;
  description: string;
  limitations: string[];
  accuracy?: string;
}

// Trust manager
// 信任管理器
class TrustManager {
  private capabilities: CapabilityDisclosure[] = [];
  private trustHistory: Map<string, TrustIndicators> = new Map();

  // Register agent capabilities
  registerCapabilities(capabilities: CapabilityDisclosure[]): void {
    this.capabilities = capabilities;
    console.log(`[Trust] Registered ${capabilities.length} capabilities`);
  }

  // Get capability disclosure for user
  getCapabilityDisclosure(capability: string): CapabilityDisclosure | undefined {
    return this.capabilities.find(c => c.capability === capability);
  }

  // Generate capability description
  generateCapabilityDescription(): string[] {
    return this.capabilities.map(cap => {
      let description = `**${cap.capability}**: ${cap.description}`;

      if (cap.limitations.length > 0) {
        description += `\n   Limitations: ${cap.limitations.join(", ")}`;
      }

      if (cap.accuracy) {
        description += `\n   Accuracy: ${cap.accuracy}`;
      }

      return description;
    });
  }

  // Update trust score
  updateTrustScore(sessionId: string, indicators: Partial<TrustIndicators>): void {
    const current = this.trustHistory.get(sessionId) || {
      accuracy: 0.8,
      reliability: 0.8,
      transparency: 0.8,
      competence: 0.8,
      overall: 0.8
    };

    const updated = { ...current, ...indicators };
    updated.overall = (
      updated.accuracy +
      updated.reliability +
      updated.transparency +
      updated.competence
    ) / 4;

    this.trustHistory.set(sessionId, updated);
    console.log(`[Trust] Updated trust score for ${sessionId}: ${updated.overall.toFixed(2)}`);
  }

  // Get trust score
  getTrustScore(sessionId: string): TrustIndicators {
    return this.trustHistory.get(sessionId) || {
      accuracy: 0.8,
      reliability: 0.8,
      transparency: 0.8,
      competence: 0.8,
      overall: 0.8
    };
  }

  // Generate trust badge
  generateTrustBadge(): string {
    const avgTrust = 0.85; // Would be calculated from actual data
    let badge = "";

    if (avgTrust >= 0.9) {
      badge = "⭐⭐⭐⭐⭐ Highly Trusted";
    } else if (avgTrust >= 0.8) {
      badge = "⭐⭐⭐⭐ Trusted";
    } else if (avgTrust >= 0.7) {
      badge = "⭐⭐⭐ Generally Reliable";
    } else {
      badge = "⭐⭐ Beta";
    }

    return badge;
  }

  // Generate transparency statement
  generateTransparencyStatement(): string {
    return `This AI assistant:
    - Provides information based on trained data
    - May not always have the most current information
    - Cannot verify real-world accuracy of all claims
    - Should not replace professional advice for important decisions
    - Is continuously learning and improving`;
  }

  // Check if guidance needed
  needsHumanGuidance(confidence: number, taskType: string): boolean {
    // Tasks that always need human oversight
    const criticalTasks = ["medical", "legal", "financial", "health"];
    if (criticalTasks.some(t => taskType.toLowerCase().includes(t))) {
      return true;
    }

    // Low confidence
    return confidence < 0.6;
  }
}

// Example usage: 创建示例
const trustManager = new TrustManager();

// Register capabilities
trustManager.registerCapabilities([
  {
    capability: "Information Retrieval",
    description: "Find and summarize information from various sources",
    limitations: ["May not have latest information", "Cannot browse live websites"],
    accuracy: "~85% for general topics"
  },
  {
    capability: "Data Analysis",
    description: "Analyze data and provide insights",
    limitations: ["Limited to provided data", "Cannot access external databases"]
  },
  {
    capability: "Writing Assistance",
    description: "Help with writing, editing, and proofreading",
    limitations: ["Style preferences may vary"]
  }
]);

// Update trust based on interactions
trustManager.updateTrustScore("session-1", {
  accuracy: 0.9,
  reliability: 0.85
});

console.log("\n=== Trust Features ===");
console.log("Capability disclosures:");
trustManager.generateCapabilityDescription().forEach(c => console.log(c));

console.log("\nTransparency statement:");
console.log(trustManager.generateTransparencyStatement());

console.log("\nTrust badge:", trustManager.generateTrustBadge());
console.log("Needs human guidance:", trustManager.needsHumanGuidance(0.5, "medical advice"));
```

---

## Investment Agent: UX-Optimized Trading Interface

## 投资智能体：用户体验优化的交易界面

```typescript
// Investment agent with excellent UX
// 具有出色用户体验的投资智能体
import { ChatOpenAI } from "@langchain/openai";

// Investment-specific UX components
// 投资特定的用户体验组件
interface TradeExplanation {
  action: string;
  rationale: string;
  riskLevel: string;
  expectedOutcome: string;
  alternatives: string[];
  confidence: number;
}

// Investment UX manager
// 投资用户体验管理器
class InvestmentUXManager {
  private conversationManager: ConversationManager;
  private feedbackCollector: FeedbackCollector;
  private trustManager: TrustManager;
  private explanationBuilder: ExplainableResponseBuilder;

  constructor() {
    this.conversationManager = new ConversationManager();
    this.feedbackCollector = new FeedbackCollector();
    this.trustManager = new TrustManager();
    this.explanationBuilder = new ExplainableResponseBuilder();
  }

  // Handle investment query
  async handleQuery(
    sessionId: string,
    query: string
  ): Promise<{
    response: string;
    explanation?: Explanation;
    tradeInfo?: TradeExplanation;
  }> {
    // Add user message
    this.conversationManager.addMessage(sessionId, "user", query);

    // Set agent state to thinking
    this.conversationManager.setAgentState(sessionId, "thinking");

    // Generate response (simplified)
    const response = "Based on your risk profile and current market conditions, I recommend considering a diversified portfolio with 60% stocks and 40% bonds.";

    // Generate explanation
    const explanation = await this.explanationBuilder.generateExplanation(
      ExplanationType.RECOMMENDATION,
      "Recommended 60/40 portfolio allocation",
      {
        riskProfile: "moderate",
        marketCondition: "bull",
        confidence: 0.78
      }
    );

    // Add agent response
    this.conversationManager.addMessage(sessionId, "agent", response, {
      intent: "portfolio_recommendation",
      confidence: 0.78
    });

    // Set agent state back to idle
    this.conversationManager.setAgentState(sessionId, "idle");

    // Check if human guidance needed
    if (this.trustManager.needsHumanGuidance(0.78, "investment advice")) {
      return {
        response: response + "\n\n⚠️ Please consult with a financial advisor for personalized advice.",
        explanation,
        tradeInfo: {
          action: "Portfolio rebalancing",
          rationale: "Diversification based on risk profile",
          riskLevel: "Moderate",
          expectedOutcome: "Balanced growth with controlled volatility",
          alternatives: ["More aggressive (80/20)", "More conservative (40/60)"],
          confidence: 0.78
        }
      };
    }

    return { response, explanation, tradeInfo: undefined };
  }

  // Collect user feedback
  collectFeedback(sessionId: string, rating: number, comment?: string): void {
    this.feedbackCollector.collectFeedback(sessionId, FeedbackType.SATISFACTION, rating, comment);
  }

  // Get session status
  getSessionStatus(sessionId: string): any {
    const context = this.conversationManager.getContext(sessionId);
    const trustScore = this.trustManager.getTrustScore(sessionId);
    const feedback = this.feedbackCollector.getSessionFeedback(sessionId);

    return {
      hasSession: !!context,
      agentState: context?.agentState || "unknown",
      messageCount: context?.messages.length || 0,
      trustScore,
      feedbackCount: feedback.length
    };
  }
}

// Example: Run investment UX demo
// 示例：运行投资用户体验演示
async function demoInvestmentUX() {
  const uxManager = new InvestmentUXManager();
  const sessionId = "investor-123";

  // Create session
  uxManager.getSessionStatus(sessionId);

  console.log("\n=== Investment Agent UX Demo ===\n");

  // Handle query
  const result = await uxManager.handleQuery(
    sessionId,
    "What's a good investment strategy for me?"
  );

  console.log("Response:", result.response);
  console.log("\nTrade Info:", result.tradeInfo);

  // Collect feedback
  uxManager.collectFeedback(sessionId, 5, "Very helpful explanation!");

  // Get session status
  console.log("\nSession Status:", uxManager.getSessionStatus(sessionId));
}

demoInvestmentUX();
```

---

## 社区热议与实践分享

## Community Insights & Practitioner Perspectives

随着智能体（Agent）产品在2025-2026年加速落地，业界围绕"智能体用户体验设计"展开了广泛而深入的讨论。以下汇集了来自社交媒体、技术博客和行业报告中的核心观点与实践洞察。

### 从 UX 到 AX：体验设计的范式转移

2025-2026年，行业最显著的共识之一是：传统的用户体验设计（UX）正在向**智能体体验设计（AX, Agentic Experience）**演进。

**Greg Isenberg** 在 X（Twitter）上提出了这一概念转变：

> "There's a quiet shift happening in how we design software. We're moving from UX to AX (agentic experience). Traditional UX is screen-centric: you tap a button, product reacts, job done. Every session starts from zero... The companies building AX instead of UX will own the next decade."
>
> -- [Greg Isenberg (@gregisenberg), X](https://x.com/gregisenberg/status/1947693459147526179)

传统UX以屏幕为中心，用户点击按钮、产品响应、任务完成，每次会话都从零开始。而AX（智能体体验）是以关系为中心的：智能体跟踪持续目标、推动下一步行动、随时间改进，并规划自己的路径——感知、推理、选择设计者未预设的操作。

**John Maeda**（微软工程副总裁）在2025年SXSW大会的Design in Tech报告中进一步阐述了这一趋势：

> "It's not adding agents to your UX. It's about the UX for AI. It's to make it easier for AI to use software."
>
> -- [John Maeda, 2025 Design in Tech Report](https://johnmaeda.medium.com/autodesigners-on-autopilot-88c5b07609b9)

他强调，设计者需要思考的不再仅仅是"人如何使用软件"，而是"AI智能体如何使用软件"——API优先、可编程接口、以及LLMs.txt运动都是这一转变的具体体现。

### 长时任务智能体的UX挑战

**Aaron Levie**（Box CEO）是智能体UX领域最活跃的讨论者之一，他在多条推文中系统阐述了设计挑战：

> "AI Agent UX is one of the most interesting design questions today. It's clear that for now you need a high degree of visibility into the work the agent is doing, and need to have the ability to interact with it at a granular level."
>
> -- [Aaron Levie (@levie), X](https://x.com/levie/status/1921783416653271270)

> "The UX for long running AI Agents is going to be one of the most interesting design questions in the coming years. The more the agent is doing complex tasks for you in the background, the more the UI of software is about the meta elements of managing their work."
>
> -- [Aaron Levie (@levie), X](https://x.com/levie/status/1926401273261072652)

他的核心观点是：当前大多数智能体UX针对的是用户可以即时审查和控制的短暂任务；但随着模型能力、工具使用和上下文窗口的提升，智能体将能处理越来越长的后台任务——此时UI的核心将转变为"管理智能体工作"的元界面。

### Jakob Nielsen 的预测与设计建议

UX领域的奠基人 **Jakob Nielsen** 在其 Substack 专栏中对智能体UX做出了系统性预测：

> "Artificial Intelligence will evolve from passive tools (chat UI that waits for a prompt) to active Agentic Systems (software that plans, executes, and iterates on tasks autonomously). In UX terms, this is a fundamental shift in interaction design from Conversational UI to Delegative UI."
>
> -- [Jakob Nielsen, "18 Predictions for 2026"](https://jakobnielsenphd.substack.com/p/2026-predictions)

Nielsen 特别指出，交互设计正从**对话式UI**（Conversational UI，向AI提问）转向**委托式UI**（Delegative UI，向AI指派目标）。他建议设计者关注以下几点：

- **智能体仪表盘（Agent Dashboard）**：将任务显示为卡片，展示状态、成本和"介入"操作；支持暂停、恢复和回滚
- **对所有智能体设计进行可用性测试**：这些是全新的用户体验，不能仅凭通用可用性指南来设计
- **保持用户最终控制权**：即使AI完成所有工作，传统界面逐渐消失，用户仍须拥有最终决策权

在另一篇文章《No More User Interface?》中，Nielsen 总结道：

> "UX doesn't die; it metamorphoses. We'll still craft humane experiences, but increasingly through policies, protocols, and orchestrations rather than panels and palettes."
>
> -- [Jakob Nielsen, "No More User Interface?"](https://jakobnielsenphd.substack.com/p/no-more-ui)

### 三大核心智能体UX模式

风险投资人 **Sandhya Hegde** 在其 Substack 系列文章中，基于对大量智能体产品的深度分析，提炼出三种核心UX模式：

1. **协作式（Collaborative）**：用户与智能体实时协作，如对话或命令式交互（例如 Cursor 的 Chat/Cmd+K）
2. **嵌入式（Embedded）**：智能体无缝融入现有工作流，在用户操作过程中主动提供建议（例如 Cursor 的 Tab 自动补全）
3. **异步式（Asynchronous）**：智能体在后台独立执行复杂任务，完成后通知用户（例如 Cursor 的 Cmd+I 后台重构）

> "Successful AI products will pick a persona and embrace multiple agentic UX patterns within the same GUI to achieve great results... Cursor has 3 primary features, each with a different agent UX pattern."
>
> -- [Sandhya Hegde, "Agentic UX & Design Patterns"](https://blog.calibrelabs.ai/p/agentic-ux-and-design-patterns)

她特别强调，成功的智能体产品不会只用一种UX模式，而是在同一产品中组合使用多种模式来覆盖不同任务场景。

### 信任、控制与可解释性

Smashing Magazine 在2026年初发表的深度文章中，系统阐述了智能体UX的三大设计支柱：

- **意图预览（Intent Preview）**：在智能体执行操作前，展示其计划摘要，建立"知情同意"机制
- **操作审计与撤销（Action Audit & Undo）**：对于在一定时间后变为不可逆的操作，UI必须清晰传达这一时间窗口
- **升级路径（Escalation Pathway）**：当智能体无法处理时，提供平滑的人工升级机制

> "Errors are not a possibility; they are an inevitability. The long-term success of an agentic system depends less on its ability to be perfect and more on its ability to recover gracefully when it fails."
>
> -- [Smashing Magazine, "Designing For Agentic AI"](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/)

### 管理AI如同管理人

**Julie Zhuo**（前 Facebook 设计副总裁）在 Lenny Rachitsky 的播客中提出了一个独到的观点：管理AI智能体所需的技能与管理团队成员惊人地相似。

> "The skills that make you a great manager also make you great at working with AI."
>
> -- [Julie Zhuo on Lenny's Podcast](https://www.lennysnewsletter.com/p/from-managing-people-to-managing-ai-julie-zhuo)

正如管理者需要理解团队成员的优势并提供清晰目标，有效使用AI也需要理解模型能力并提供精确指令。这一类比为智能体UX设计提供了实用的心智模型。

### Google A2UI：智能体驱动界面的开放标准

Google 于2025年底发布了 **A2UI（Agent to User Interface）**开源项目，旨在标准化智能体如何生成用户界面。其核心设计原则包括：

- **安全优先**：A2UI是声明式数据格式而非可执行代码，智能体只能请求渲染预批准的UI组件
- **LLM友好**：UI以平面组件列表表示，便于LLM增量生成，支持渐进式渲染
- **框架无关**：将UI结构与UI实现分离，同一JSON载荷可在Web、Flutter、React、SwiftUI等多平台渲染

这代表了智能体UX设计中的一个重要技术方向：让智能体能够根据对话上下文动态生成最适合的界面，而非仅限于文本响应。

### 社区共识总结

综合以上社区讨论，2025-2026年智能体UX设计的核心共识可归纳为：

| 主题 | 核心观点 | 代表人物/来源 |
|------|----------|---------------|
| **从UX到AX** | 设计重心从人机界面转向智能体体验生态 | Greg Isenberg, John Maeda |
| **可见性 vs 自主性** | 短任务需要高可见性，长任务需要元管理界面 | Aaron Levie |
| **委托式UI** | 从对话式（问AI）转向委托式（给AI指派目标） | Jakob Nielsen |
| **多模式组合** | 协作式+嵌入式+异步式在同一产品中共存 | Sandhya Hegde |
| **信任即货币** | 透明度、可撤销性和升级路径是信任基础 | Smashing Magazine |
| **管理即技能** | 管理AI与管理人使用相同的领导力技能 | Julie Zhuo |
| **声明式UI标准** | A2UI等标准推动智能体生成安全可控的界面 | Google |

---

## Chapter Summary | 本章小结

### Key Points | 核心要点

| Aspect | Description | 描述 |
|--------|-------------|------|

| **Conversation Management** | State tracking and context management | 状态跟踪和上下文管理 |
| **Explainability** | User-friendly explanations for decisions | 决策的用户友好解释 |
| **Feedback Collection** | Systematic satisfaction tracking | 系统性满意度跟踪 |
| **Accessibility** | Inclusive design for all users | 面向所有用户的包容性设计 |
| **Trust Building** | Transparency and capability disclosure | 透明度和能力披露 |

### Best Practices | 最佳实践

1. **Design for Humans**: Prioritize user needs, contexts, and limitations in all design decisions.

   为人设计：在所有设计决策中优先考虑用户需求、上下文和局限性。

2. **Explain Decisions**: Always provide clear, jargon-free explanations for agent recommendations.

   解释决策：始终为智能体建议提供清晰、无术语的解释。

3. **Collect Feedback**: Make it easy for users to provide feedback at natural points in the conversation.

   收集反馈：在对话的自然节点上让用户提供反馈变得容易。

4. **Be Accessible**: Ensure your agent works for users with diverse abilities and preferences.

   无障碍：确保您的智能体适用于具有不同能力和偏好的用户。

5. **Build Trust**: Be transparent about capabilities and limitations.

   建立信任：对能力和局限性保持透明。

### Application Scenarios | 应用场景

| Scenario | UX Focus | 应用 |
|----------|----------|------|

| **Customer Service** | Fast resolution, empathy | 客户服务 |
| **Healthcare** | Trust, clear explanations | 医疗健康 |
| **Finance** | Transparency, security | 金融 |
| **Education** | Accessibility, engagement | 教育 |
| **E-commerce** | Personalization, guidance | 电子商务 |

### UX Metrics | 用户体验指标

- **Task Completion Rate**: Percentage of tasks completed successfully.

  任务完成率：成功完成的任务百分比。

- **User Satisfaction (CSAT)**: Direct satisfaction ratings.

  用户满意度：直接满意度评分。

- **Net Promoter Score (NPS)**: Likelihood to recommend.

  净推荐值：推荐可能性。

- **Time to Resolution**: How quickly user needs are met.

  解决时间：用户需求满足的速度。

- **Accessibility Compliance**: WCAG compliance level.

  无障碍合规：WCAG合规级别。

---

## 参考资源

## References & Resources

以下资源按类别整理，涵盖智能体UX设计的理论框架、实践指南、社区讨论和技术标准。

### 行业深度文章与设计框架

- [Designing For Agentic AI: Practical UX Patterns For Control, Consent, And Accountability](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/) -- Smashing Magazine, 2026年2月。系统阐述控制、同意和问责的实用UX模式
- [Beyond Generative: The Rise Of Agentic AI And User-Centric Design](https://www.smashingmagazine.com/2026/01/beyond-generative-rise-agentic-ai-user-centric-design/) -- Smashing Magazine, 2026年1月。从生成式AI到智能体AI的设计范式转变
- [Secrets of Agentic UX: Emerging Design Patterns for Human Interaction with AI Agents](https://uxmag.com/articles/secrets-of-agentic-ux-emerging-design-patterns-for-human-interaction-with-ai-agents) -- UX Magazine。基于感知、推理、记忆和能动性四大核心能力的设计框架
- [UX Design for Agents](https://microsoft.design/articles/ux-design-for-agents/) -- Microsoft Design。微软设计师和用户研究员共创的智能体UX设计原则
- [Agent-Based Experience Design: The Future of UX in an AI-Driven World](https://standardbeagle.com/agent-based-experience-design/) -- Standard Beagle Studio。探索智能体体验设计（AX）的定义、意义和实践路径
- [How Agentic AI Enables a New Approach to User Experience Design](https://www.studio.ey.com/en_gl/insights/how-agentic-AI-enables-a-new-approach-to-user-experience-design) -- EY Studio。智能体AI如何重塑用户体验设计方法论
- [State of Design 2026: When Interfaces Become Agents](https://tejjj.medium.com/state-of-design-2026-when-interfaces-become-agents-fc967be10cba) -- Medium (Tejj)。当界面成为智能体时设计的未来形态
- [Designing User Interfaces for Agentic AI](https://codewave.com/insights/designing-agentic-ai-ui/) -- Codewave。智能体AI用户界面设计的全面指南

### 社区博客与分析

- [Agentic UX & Design Patterns](https://blog.calibrelabs.ai/p/agentic-ux-and-design-patterns) -- Sandhya Hegde, highCalibre Substack。三种核心智能体UX模式的深度分析
- [Building a Mental Model for AI Agents](https://manialabs.substack.com/p/building-a-mental-model-for-ai-agents) -- Sandhya Hegde。构建AI智能体心智模型的系统方法
- [18 Predictions for 2026](https://jakobnielsenphd.substack.com/p/2026-predictions) -- Jakob Nielsen on UX。UX领域奠基人对2026年的预测，包含委托式UI等关键趋势
- [No More User Interface?](https://jakobnielsenphd.substack.com/p/no-more-ui) -- Jakob Nielsen on UX。探讨用户界面消失后UX设计的未来
- [Hello AI Agents: Goodbye UI Design, RIP Accessibility](https://jakobnielsenphd.substack.com/p/ai-agents) -- Jakob Nielsen on UX。AI智能体对UI设计和无障碍设计的颠覆性影响
- [Autodesigners on Autopilot: 2025 Design in Tech Report](https://johnmaeda.medium.com/autodesigners-on-autopilot-88c5b07609b9) -- John Maeda。从UX到AX的设计转型
- [From Managing People to Managing AI](https://www.lennysnewsletter.com/p/from-managing-people-to-managing-ai-julie-zhuo) -- Julie Zhuo on Lenny's Podcast。管理AI与管理团队的技能迁移

### 社交媒体关键讨论（X / Twitter）

- [Aaron Levie: AI Agent UX 是当今最有趣的设计问题](https://x.com/levie/status/1921783416653271270) -- 关于智能体可见性和粒度交互的讨论
- [Aaron Levie: 长时运行AI智能体的UX](https://x.com/levie/status/1926401273261072652) -- 后台复杂任务的元管理界面设计
- [Greg Isenberg: 从UX到AX的范式转移](https://x.com/gregisenberg/status/1947693459147526179) -- 智能体体验设计的概念定义
- [Aditya Naganath: 2026年AI展望](https://x.com/anaganath/status/2006222575081513307) -- 智能体产品落地的基础设施挑战

### 技术标准与开源项目

- [A2UI: An Open Project for Agent-Driven Interfaces](https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/) -- Google Developers Blog。Google推出的智能体驱动界面开放标准
- [A2UI 官方网站](https://a2ui.org/) -- A2UI协议规范与文档
- [A2UI GitHub 仓库](https://github.com/google/A2UI) -- 开源代码与实现示例
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) -- Anthropic。构建有效智能体的核心原则
- [Building Agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk) -- Anthropic Engineering。使用 Claude Agent SDK 构建智能体的技术指南
- [Agentic Design Patterns: UI/UX & Human-AI Interaction](https://agentic-design.ai/patterns/ui-ux-patterns) -- 智能体设计模式的系统化参考
- [5 Key Trends Shaping Agentic Development in 2026](https://thenewstack.io/5-key-trends-shaping-agentic-development-in-2026/) -- The New Stack。2026年塑造智能体开发的五大趋势

### 行业报告与预测

- [IEEE: 2026年将是智能体AI的大年](https://x.com/IEEEorg/status/1988284386639294517) -- IEEE全球技术领袖调查
- [Gartner: 智能体AI为2025年十大技术趋势之首](https://www.gartner.com/en/articles/top-technology-trends-2025) -- Gartner。将智能体AI命名为2025年首要技术趋势
- [IBM 2025调查](https://standardbeagle.com/agent-based-experience-design/) -- 99%的企业开发者正在探索或已在开发AI智能体
- [Salesforce 预测](https://standardbeagle.com/agent-based-experience-design/) -- 到2026财年末将有10亿AI智能体投入服务