---
title: 'Chapter 20: Agentic UX Design'
date: '2025-12-25'
excerpt: 'User experience is critical for agent adoption and effectiveness.'
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