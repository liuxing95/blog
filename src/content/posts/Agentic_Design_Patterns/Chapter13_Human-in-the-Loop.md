---
title: 'Chapter 13: Human-in-the-Loop'
date: '2026-03-15'
excerpt: 'While agents can operate autonomously, there are situations where human oversight, input, or approval is essential. 融合社区洞察与行业实践，深入探讨人在回路模式的最新发展趋势。'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 13: Human-in-the-Loop

# 第十三章：人在回路

## Human-in-the-Loop Pattern Overview

## 人在回路模式概述

While agents can operate autonomously, there are situations where human oversight, input, or approval is essential.

虽然智能体可以自主运作，但在某些情况下，人工监督、输入或批准是必不可少的。

The human-in-the-loop pattern involves incorporating human decision-making into agent workflows.

人在回路模式涉及将人工决策纳入智能体工作流。

### When to Involve Humans

### 何时让人类参与

**High-Stakes Decisions**: When errors could have serious consequences.

**高风险决策**: 当错误可能产生严重后果时。

**Ambiguous Situations**: When the agent lacks confidence or context to make a decision.

**模糊情况**: 当智能体缺乏做出决策的信心或上下文时。

**User Preference**: When users want to review or approve agent actions.

**用户偏好**: 当用户想要审查或批准智能体行动时。

**Learning**: When human feedback can help the agent improve.

**学习**: 当人工反馈可以帮助智能体改进时。

### Implementation Approaches

### 实现方法

**Approval Gates**: Require human approval before executing certain actions.

**批准门**: 在执行某些操作之前需要人工批准。

**Review Steps**: Include human review of agent outputs.

**审查步骤**: 包含对智能体输出的人工审查。

**Feedback Loops**: Collect human feedback to improve future performance.

**反馈回路**: 收集人工反馈以改进未来性能。

**On-Demand Intervention**: Allow humans to intervene at any point.

**按需干预**: 允许人类在任何时候干预。

---

## Hands-On Code Examples

## 实践代码示例

以下代码实现了人在回路(HITL)模式的多种场景：

### 1. Approval Gate (批准门)

以下代码实现了需要人工批准才能执行的操作：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0.7 });

// Approval Status
const ApprovalStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired'
};

// Approval Request
class ApprovalRequest {
  constructor(id, action, details, requester) {
    this.id = id;
    this.action = action;
    this.details = details;
    this.requester = requester;
    this.status = ApprovalStatus.PENDING;
    this.approver = null;
    this.comments = null;
    this.createdAt = Date.now();
    this.respondedAt = null;
  }

  approve(approver, comments = '') {
    this.status = ApprovalStatus.APPROVED;
    this.approver = approver;
    this.comments = comments;
    this.respondedAt = Date.now();
  }

  reject(approver, comments = '') {
    this.status = ApprovalStatus.REJECTED;
    this.approver = approver;
    this.comments = comments;
    this.respondedAt = Date.now();
  }

  isPending() {
    return this.status === ApprovalStatus.PENDING;
  }

  isExpired(maxAgeMs = 86400000) {
    return Date.now() - this.createdAt > maxAgeMs;
  }
}

// Approval Gate Manager
class ApprovalGate {
  constructor(config = {}) {
    this.pendingApprovals = new Map();
    this.approvalHistory = [];
    this.maxAge = config.maxAgeMs || 86400000; // 24 hours default
    this.autoExpire = config.autoExpire || false;
  }

  // Request approval for an action
  requestApproval(action, details, requester) {
    const request = new ApprovalRequest(
      `approval_${Date.now()}`,
      action,
      details,
      requester
    );

    this.pendingApprovals.set(request.id, request);
    console.log(`[Approval] Request #${request.id}: ${action}`);
    console.log(`  Details: ${JSON.stringify(details)}`);
    console.log(`  Requested by: ${requester}`);

    return request;
  }

  // Approve request
  approve(requestId, approver, comments = '') {
    const request = this.pendingApprovals.get(requestId);
    if (!request) {
      throw new Error(`Approval request ${requestId} not found`);
    }

    request.approve(approver, comments);
    this.approvalHistory.push(request);
    this.pendingApprovals.delete(requestId);

    console.log(`[Approval] Request #${requestId} APPROVED by ${approver}`);
    return request;
  }

  // Reject request
  reject(requestId, approver, comments = '') {
    const request = this.pendingApprovals.get(requestId);
    if (!request) {
      throw new Error(`Approval request ${requestId} not found`);
    }

    request.reject(approver, comments);
    this.approvalHistory.push(request);
    this.pendingApprovals.delete(requestId);

    console.log(`[Approval] Request #${requestId} REJECTED by ${approver}`);
    return request;
  }

  // Get pending approvals
  getPending(requester = null) {
    let approvals = Array.from(this.pendingApprovals.values());

    if (requester) {
      approvals = approvals.filter(a => a.requester === requester);
    }

    return approvals;
  }

  // Check and auto-expire old requests
  checkExpired() {
    if (!this.autoExpire) return;

    for (const [id, request] of this.pendingApprovals.entries()) {
      if (request.isExpired(this.maxAge)) {
        request.status = ApprovalStatus.EXPIRED;
        this.approvalHistory.push(request);
        this.pendingApprovals.delete(id);
        console.log(`[Approval] Request #${id} EXPIRED`);
      }
    }
  }

  // Get approval statistics
  getStats() {
    const history = this.approvalHistory;
    return {
      total: history.length,
      approved: history.filter(r => r.status === ApprovalStatus.APPROVED).length,
      rejected: history.filter(r => r.status === ApprovalStatus.REJECTED).length,
      expired: history.filter(r => r.status === ApprovalStatus.EXPIRED).length,
      pending: this.pendingApprovals.size
    };
  }
}

// High-risk actions requiring approval
const HIGH_RISK_ACTIONS = [
  'delete_data',
  'refund',
  'transfer_funds',
  'modify_permissions',
  'send_email',
  'execute_trade'
];

// Agent with Approval Gate
class ApprovalAgent {
  constructor(name, llm) {
    this.name = name;
    this.llm = llm;
    this.approvalGate = new ApprovalGate();
  }

  // Check if action requires approval
  requiresApproval(action) {
    return HIGH_RISK_ACTIONS.includes(action);
  }

  // Execute action with approval gate
  async executeWithApproval(action, details, requester) {
    // Check if approval is required
    if (!this.requiresApproval(action)) {
      console.log(`[${this.name}] Executing ${action} without approval`);
      return this.executeAction(action, details);
    }

    console.log(`[${this.name}] ${action} requires human approval`);

    // Request approval
    const approvalRequest = this.approvalGate.requestApproval(
      action,
      details,
      requester
    );

    // In real system, this would wait for human response
    // For demo, we simulate approval after checking
    console.log(`[${this.name}] Waiting for approval...`);

    return approvalRequest;
  }

  // Execute the actual action
  async executeAction(action, details) {
    console.log(`[${this.name}] Executing: ${action}`);

    // Simulate action execution
    const results = {
      delete_data: () => ({ success: true, deleted: details.records }),
      refund: () => ({ success: true, refundId: `REF_${Date.now()}`, amount: details.amount }),
      transfer_funds: () => ({ success: true, transactionId: `TXN_${Date.now()}`, from: details.from, to: details.to }),
      send_email: () => ({ success: true, emailId: `EMAIL_${Date.now()}`, to: details.to }),
      execute_trade: () => ({ success: true, tradeId: `TRADE_${Date.now()}`, symbol: details.symbol, quantity: details.quantity })
    };

    const executor = results[action];
    return executor ? executor() : { success: true, action };
  }

  // Process approval response
  async processApproval(requestId, approver, approved, comments) {
    const request = this.approvalGate.pendingApprovals.get(requestId);
    if (!request) {
      return { error: 'Request not found' };
    }

    if (approved) {
      this.approvalGate.approve(requestId, approver, comments);
      return await this.executeAction(request.action, request.details);
    } else {
      this.approvalGate.reject(requestId, approver, comments);
      return { rejected: true, reason: comments };
    }
  }
}

// Usage
async function demoApprovalGate() {
  const agent = new ApprovalAgent('FinanceBot', llm);

  // Non-high-risk action - no approval needed
  console.log('\n--- Action 1: Query (No Approval) ---');
  await agent.executeWithApproval('query_data', { table: 'transactions' }, 'user_1');

  // High-risk action - requires approval
  console.log('\n--- Action 2: Refund (Requires Approval) ---');
  const refundRequest = await agent.executeWithApproval(
    'refund',
    { orderId: 'ORD_123', amount: 99.99, reason: 'Customer request' },
    'support_agent'
  );

  // Simulate human approval
  console.log('\n--- Human Reviews and Approves ---');
  const result = await agent.processApproval(
    refundRequest.id,
    'manager_1',
    true,
    'Approved - valid customer complaint'
  );
  console.log('Result:', result);

  // Show statistics
  console.log('\n--- Approval Statistics ---');
  console.log(agent.approvalGate.getStats());
}

demoApprovalGate();
```

### 2. Human Review (人工审查)

以下代码实现了对智能体输出的人工审查机制：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0.7 });

// Review Status
const ReviewStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REVISION_REQUESTED: 'revision_requested',
  REJECTED: 'rejected'
};

// Review Request
class ReviewRequest {
  constructor(id, content, type, context = {}) {
    this.id = id;
    this.content = content;
    this.type = type; // 'text', 'code', 'email', 'report'
    this.context = context;
    this.status = ReviewStatus.PENDING;
    this.reviewer = null;
    this.feedback = null;
    this.ratings = {};
    this.createdAt = Date.now();
    this.completedAt = null;
  }

  approve(reviewer, feedback = '') {
    this.status = ReviewStatus.APPROVED;
    this.reviewer = reviewer;
    this.feedback = feedback;
    this.completedAt = Date.now();
  }

  requestRevision(reviewer, feedback) {
    this.status = ReviewStatus.REVISION_REQUESTED;
    this.reviewer = reviewer;
    this.feedback = feedback;
    this.completedAt = Date.now();
  }

  reject(reviewer, feedback) {
    this.status = ReviewStatus.REJECTED;
    this.reviewer = reviewer;
    this.feedback = feedback;
    this.completedAt = Date.now();
  }

  addRating(criterion, score, notes = '') {
    this.ratings[criterion] = { score, notes, timestamp: Date.now() };
  }

  getAverageRating() {
    const ratings = Object.values(this.ratings);
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
  }
}

// Review Criteria
const ReviewCriteria = {
  ACCURACY: { name: 'Accuracy', weight: 0.3, description: 'Is the content factually correct?' },
  CLARITY: { name: 'Clarity', weight: 0.25, description: 'Is the content clear and easy to understand?' },
  TONE: { name: 'Tone', weight: 0.2, description: 'Is the tone appropriate?' },
  COMPLETENESS: { name: 'Completeness', weight: 0.25, description: 'Is all necessary information included?' }
};

// Review Manager
class ReviewManager {
  constructor() {
    this.pendingReviews = new Map();
    this.completedReviews = [];
    this.reviewers = new Set();
  }

  // Add reviewer
  addReviewer(reviewerId, name, expertise = []) {
    this.reviewers.add({ id: reviewerId, name, expertise });
    console.log(`[Review] Added reviewer: ${name}`);
  }

  // Submit content for review
  submitForReview(content, type, context = {}, submittedBy = 'system') {
    const request = new ReviewRequest(
      `review_${Date.now()}`,
      content,
      type,
      context
    );
    request.submittedBy = submittedBy;

    this.pendingReviews.set(request.id, request);
    console.log(`[Review] Submitted #${request.id} for ${type} review`);

    return request;
  }

  // Get pending reviews for a reviewer
  getPendingForReviewer(reviewerId) {
    return Array.from(this.pendingReviews.values())
      .filter(r => r.status === ReviewStatus.PENDING);
  }

  // Submit review
  submitReview(requestId, reviewerId, decision, feedback, ratings = {}) {
    const request = this.pendingReviews.get(requestId);
    if (!request) {
      throw new Error(`Review request ${requestId} not found`);
    }

    // Add ratings
    for (const [criterion, rating] of Object.entries(ratings)) {
      request.addRating(criterion, rating.score, rating.notes);
    }

    // Set decision
    if (decision === 'approve') {
      request.approve(reviewerId, feedback);
    } else if (decision === 'revision') {
      request.requestRevision(reviewerId, feedback);
    } else if (decision === 'reject') {
      request.reject(reviewerId, feedback);
    }

    this.completedReviews.push(request);
    this.pendingReviews.delete(requestId);

    console.log(`[Review] Completed #${requestId}: ${request.status}`);
    return request;
  }

  // Agent with auto-review for high-stakes content
  async generateWithReview(prompt, contentType, context = {}) {
    // Generate initial content
    const reviewRequest = this.submitForReview('', contentType, context);

    const chatPrompt = ChatPromptTemplate.fromTemplate(prompt);
    const chain = chatPrompt.pipe(llm).pipe(new StringOutputParser());
    const content = await chain.invoke(context);

    reviewRequest.content = content;
    console.log(`[Review] Generated ${contentType}, submitting for review`);

    return reviewRequest;
  }

  // Get review statistics
  getStats() {
    const completed = this.completedReviews;
    return {
      total: completed.length,
      approved: completed.filter(r => r.status === ReviewStatus.APPROVED).length,
      revisions: completed.filter(r => r.status === ReviewStatus.REVISION_REQUESTED).length,
      rejected: completed.filter(r => r.status === ReviewStatus.REJECTED).length,
      pending: this.pendingReviews.size,
      avgRating: completed.length > 0
        ? (completed.reduce((sum, r) => sum + r.getAverageRating(), 0) / completed.length).toFixed(2)
        : 0
    };
  }
}

// Usage
async function demoReview() {
  const reviewManager = new ReviewManager();

  // Add reviewers
  reviewManager.addReviewer('reviewer_1', 'Alice', ['technical', 'code']);
  reviewManager.addReviewer('reviewer_2', 'Bob', ['marketing', 'writing']);

  // Generate and submit for review
  console.log('\n--- Generating Marketing Email ---');
  const emailRequest = await reviewManager.generateWithReview(
    'Write a professional marketing email about our new product: {product}',
    'email',
    { product: 'AI Assistant Pro' }
  );

  // Simulate reviewer action
  console.log('\n--- Reviewer Evaluating ---');
  const result = reviewManager.submitReview(
    emailRequest.id,
    'reviewer_2',
    'approve',
    'Great email! Minor tone adjustment suggested.',
    {
      accuracy: { score: 5, notes: 'All facts correct' },
      clarity: { score: 4, notes: 'Clear message' },
      tone: { score: 4, notes: 'Professional but could be warmer' },
      completeness: { score: 5, notes: 'All key points covered' }
    }
  );

  console.log('\n--- Review Result ---');
  console.log(`Status: ${result.status}`);
  console.log(`Average Rating: ${result.getAverageRating()}/5`);
  console.log(`Feedback: ${result.feedback}`);

  console.log('\n--- Statistics ---');
  console.log(reviewManager.getStats());
}

demoReview();
```

### 3. Feedback Loop (反馈回路)

以下代码实现了收集人工反馈以改进智能体性能的系统：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0.7 });

// Feedback Types
const FeedbackType = {
  RATING: 'rating',
  CORRECTION: 'correction',
  SUGGESTION: 'suggestion',
  UPVOTE: 'upvote',
  DOWNVOTE: 'downvote'
};

// Quality Ratings
const QualityRating = {
  EXCELLENT: 5,
  GOOD: 4,
  AVERAGE: 3,
  POOR: 2,
  VERY_POOR: 1
};

// Feedback Item
class Feedback {
  constructor(agentId, interactionId, type, userId) {
    this.id = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.agentId = agentId;
    this.interactionId = interactionId;
    this.type = type;
    this.userId = userId;
    this.content = {};
    this.createdAt = Date.now();
  }

  setRating(category, score, notes = '') {
    this.content.rating = { category, score, notes };
  }

  setCorrection(original, corrected, reason = '') {
    this.content.correction = { original, corrected, reason };
  }

  setSuggestion(suggestion, priority = 'medium') {
    this.content.suggestion = { suggestion, priority };
  }

  setVote(isPositive) {
    this.content.vote = isPositive ? 'upvote' : 'downvote';
  }
}

// Feedback Collector
class FeedbackCollector {
  constructor(agentId) {
    this.agentId = agentId;
    this.feedbackList = [];
    this.userFeedback = new Map();
    this.aggregatedMetrics = {};
  }

  // Collect rating feedback
  collectRating(interactionId, userId, category, score, notes = '') {
    const feedback = new Feedback(this.agentId, interactionId, FeedbackType.RATING, userId);
    feedback.setRating(category, score, notes);
    this.addFeedback(feedback);
    return feedback;
  }

  // Collect correction feedback
  collectCorrection(interactionId, userId, original, corrected, reason = '') {
    const feedback = new Feedback(this.agentId, interactionId, FeedbackType.CORRECTION, userId);
    feedback.setCorrection(original, corrected, reason);
    this.addFeedback(feedback);
    return feedback;
  }

  // Collect suggestion
  collectSuggestion(interactionId, userId, suggestion, priority = 'medium') {
    const feedback = new Feedback(this.agentId, interactionId, FeedbackType.SUGGESTION, userId);
    feedback.setSuggestion(suggestion, priority);
    this.addFeedback(feedback);
    return feedback;
  }

  // Collect vote
  collectVote(interactionId, userId, isPositive) {
    const feedback = new Feedback(this.agentId, interactionId, FeedbackType.UPVOTE, userId);
    feedback.setVote(isPositive);
    this.addFeedback(feedback);
    return feedback;
  }

  // Add feedback to collection
  addFeedback(feedback) {
    this.feedbackList.push(feedback);

    if (!this.userFeedback.has(feedback.userId)) {
      this.userFeedback.set(feedback.userId, []);
    }
    this.userFeedback.get(feedback.userId).push(feedback);

    console.log(`[Feedback] Collected ${feedback.type} from ${feedback.userId}`);
  }

  // Get feedback for specific interaction
  getFeedbackForInteraction(interactionId) {
    return this.feedbackList.filter(f => f.interactionId === interactionId);
  }

  // Get all feedback from user
  getFeedbackFromUser(userId) {
    return this.userFeedback.get(userId) || [];
  }

  // Aggregate feedback metrics
  computeMetrics() {
    const feedbackList = this.feedbackList;

    // Average ratings by category
    const ratingsByCategory = {};
    const corrections = feedbackList.filter(f => f.type === FeedbackType.CORRECTION);
    const suggestions = feedbackList.filter(f => f.type === FeedbackType.SUGGESTION);
    const upvotes = feedbackList.filter(f => f.content.vote === 'upvote').length;
    const downvotes = feedbackList.filter(f => f.content.vote === 'downvote').length;

    feedbackList.forEach(f => {
      if (f.type === FeedbackType.RATING && f.content.rating) {
        const { category, score } = f.content.rating;
        if (!ratingsByCategory[category]) {
          ratingsByCategory[category] = { total: 0, count: 0 };
        }
        ratingsByCategory[category].total += score;
        ratingsByCategory[category].count++;
      }
    });

    this.aggregatedMetrics = {
      totalFeedback: feedbackList.length,
      ratingsByCategory: Object.fromEntries(
        Object.entries(ratingsByCategory).map(([k, v]) => [k, (v.total / v.count).toFixed(2)])
      ),
      correctionsCount: corrections.length,
      suggestionsCount: suggestions.length,
      upvotes,
      downvotes,
      netSentiment: upvotes - downvotes,
      sentimentScore: feedbackList.length > 0
        ? (((upvotes - downvotes) / feedbackList.length) * 100).toFixed(1) + '%'
        : 'N/A'
    };

    return this.aggregatedMetrics;
  }

  // Generate improvement recommendations using LLM
  async generateImprovements() {
    const metrics = this.computeMetrics();

    const prompt = ChatPromptTemplate.fromTemplate(
      `Based on the following user feedback metrics, suggest improvements for the agent:

Metrics: {metrics}
Corrections: {corrections}

Suggest the top 3 areas for improvement:`
    );

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    return chain.invoke({
      metrics: JSON.stringify(metrics, null, 2),
      corrections: 'See metrics.correctionsCount'
    });
  }

  // Get improvement patterns from corrections
  getCorrectionPatterns() {
    const corrections = this.feedbackList.filter(f => f.type === FeedbackType.CORRECTION);

    // Group by correction reason if available
    const patterns = {};
    corrections.forEach(c => {
      const reason = c.content.correction?.reason || 'unknown';
      if (!patterns[reason]) {
        patterns[reason] = [];
      }
      patterns[reason].push(c.content.correction);
    });

    return patterns;
  }
}

// Agent with Feedback Integration
class FeedbackAwareAgent {
  constructor(name, llm) {
    this.name = name;
    this.llm = llm;
    this.feedbackCollector = new FeedbackCollector(name);
    this.promptHistory = [];
  }

  // Generate response with feedback context
  async generateWithFeedback(prompt, context = {}) {
    // Get recent feedback for context
    const recentFeedback = this.feedbackCollector.feedbackList.slice(-10);
    const metrics = this.feedbackCollector.computeMetrics();

    // Build feedback context
    let feedbackContext = '';
    if (recentFeedback.length > 0) {
      feedbackContext = '\n\nRecent user feedback to consider:\n';
      recentFeedback.forEach(f => {
        if (f.type === FeedbackType.RATING && f.content.rating) {
          feedbackContext += `- Rating (${f.content.rating.category}): ${f.content.rating.score}/5\n`;
        } else if (f.type === FeedbackType.CORRECTION && f.content.correction) {
          feedbackContext += `- Correction: ${f.content.correction.original} -> ${f.content.correction.corrected}\n`;
        }
      });
    }

    // Enhance prompt with feedback
    const enhancedPrompt = prompt + feedbackContext;

    // Generate response
    const chatPrompt = ChatPromptTemplate.fromTemplate(enhancedPrompt);
    const chain = chatPrompt.pipe(llm).pipe(new StringOutputParser());
    const response = await chain.invoke(context);

    // Store in history
    const interactionId = `interaction_${Date.now()}`;
    this.promptHistory.push({ prompt, response, interactionId });

    return { response, interactionId };
  }

  // Get current metrics
  getMetrics() {
    return this.feedbackCollector.computeMetrics();
  }
}

// Usage
async function demoFeedbackLoop() {
  const agent = new FeedbackAwareAgent('SupportBot', llm);

  // Simulate user interactions and feedback
  console.log('\n--- Interaction 1 ---');
  const result1 = await agent.generateWithFeedback(
    'Explain how to reset password',
    { user: 'user_1' }
  );
  console.log('Response:', result1.response.substring(0, 100) + '...');

  // Collect feedback
  agent.feedbackCollector.collectRating(result1.interactionId, 'user_1', 'accuracy', 4);
  agent.feedbackCollector.collectVote(result1.interactionId, 'user_1', true);

  console.log('\n--- Interaction 2 ---');
  const result2 = await agent.generateWithFeedback(
    'Write a formal apology email',
    { user: 'user_2' }
  );
  console.log('Response:', result2.response.substring(0, 100) + '...');

  // More feedback
  agent.feedbackCollector.collectCorrection(
    result2.interactionId,
    'user_2',
    'We are sorry for the inconvenience',
    'We sincerely apologize for any inconvenience this may have caused',
    'Tone too casual for formal email'
  );

  console.log('\n--- Interaction 3 ---');
  const result3 = await agent.generateWithFeedback(
    'Summarize the meeting notes',
    { user: 'user_1' }
  );
  agent.feedbackCollector.collectRating(result3.interactionId, 'user_1', 'accuracy', 2, 'Missing key points');
  agent.feedbackCollector.collectVote(result3.interactionId, 'user_1', false);

  // Get metrics
  console.log('\n--- Feedback Metrics ---');
  const metrics = agent.getMetrics();
  console.log(metrics);

  // Get improvement suggestions
  console.log('\n--- AI Improvement Suggestions ---');
  const improvements = await agent.generateImprovements();
  console.log(improvements);
}

demoFeedbackLoop();
```

### 4. Escalation System (升级系统)

以下代码实现了智能体何时以及如何将控制权交给人类的系统：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0.7 });

// Escalation Reasons
const EscalationReason = {
  CONFIDENCE_LOW: 'confidence_low',
  SENSITIVE_TOPIC: 'sensitive_topic',
  USER_REQUEST: 'user_request',
  SAFETY_CONCERN: 'safety_concern',
  LEGAL_ISSUE: 'legal_issue',
  EXCEEDED_RETRIES: 'exceeded_retries',
  UNKNOWN_DOMAIN: 'unknown_domain',
  MANUAL_APPROVAL: 'manual_approval'
};

// Priority Levels
const EscalationPriority = {
  LOW: 1,
  NORMAL: 5,
  HIGH: 10,
  CRITICAL: 20
};

// Escalation Ticket
class EscalationTicket {
  constructor(id, reason, priority, context) {
    this.id = id;
    this.reason = reason;
    this.priority = priority;
    this.context = context;
    this.status = 'open';
    this.assignedTo = null;
    this.createdAt = Date.now();
    this.resolvedAt = null;
    this.resolution = null;
  }

  assign(agentId) {
    this.assignedTo = agentId;
    console.log(`[Escalation] Ticket #${this.id} assigned to ${agentId}`);
  }

  resolve(resolution) {
    this.status = 'resolved';
    this.resolution = resolution;
    this.resolvedAt = Date.now();
    console.log(`[Escalation] Ticket #${this.id} resolved: ${resolution}`);
  }

  getWaitingTime() {
    return Date.now() - this.createdAt;
  }
}

// Escalation Manager
class EscalationManager {
  constructor(config = {}) {
    this.openTickets = new Map();
    this.closedTickets = [];
    this.escalationRules = [];
    this.autoAssign = config.autoAssign || false;
    this.maxWaitingTime = config.maxWaitingTimeMs || 300000; // 5 minutes
  }

  // Add escalation rule
  addRule(condition, action) {
    this.escalationRules.push({ condition, action });
    console.log(`[Escalation] Added rule: ${condition.description}`);
  }

  // Check if should escalate
  shouldEscalate(context) {
    for (const rule of this.escalationRules) {
      if (rule.condition(context)) {
        return { shouldEscalate: true, action: rule.action };
      }
    }
    return { shouldEscalate: false };
  }

  // Create escalation ticket
  createTicket(reason, priority, context) {
    const ticket = new EscalationTicket(
      `ESC_${Date.now()}`,
      reason,
      priority,
      context
    );

    this.openTickets.set(ticket.id, ticket);
    console.log(`[Escalation] Created ticket #${ticket.id}: ${reason}`);

    if (this.autoAssign) {
      this.autoAssignTicket(ticket.id);
    }

    return ticket;
  }

  // Auto-assign ticket to available agent
  autoAssignTicket(ticketId) {
    const ticket = this.openTickets.get(ticketId);
    if (!ticket) return;

    // Simple round-robin assignment
    const agents = ['agent_1', 'agent_2', 'agent_3'];
    const existingAssigned = Array.from(this.openTickets.values())
      .filter(t => t.assignedTo && t.status === 'open');

    const nextIndex = existingAssigned.length % agents.length;
    ticket.assign(agents[nextIndex]);
  }

  // Resolve ticket
  resolveTicket(ticketId, resolution) {
    const ticket = this.openTickets.get(ticketId);
    if (!ticket) {
      throw new Error(`Ticket ${ticketId} not found`);
    }

    ticket.resolve(resolution);
    this.openTickets.delete(ticketId);
    this.closedTickets.push(ticket);

    return ticket;
  }

  // Get open tickets by priority
  getOpenByPriority() {
    return Array.from(this.openTickets.values())
      .sort((a, b) => b.priority - a.priority);
  }

  // Get overdue tickets
  getOverdueTickets() {
    return Array.from(this.openTickets.values())
      .filter(t => t.getWaitingTime() > this.maxWaitingTime);
  }

  // Get statistics
  getStats() {
    const open = Array.from(this.openTickets.values());
    const closed = this.closedTickets;

    return {
      open: open.length,
      closed: closed.length,
      byPriority: {
        critical: open.filter(t => t.priority >= EscalationPriority.HIGH).length,
        high: open.filter(t => t.priority === EscalationPriority.HIGH).length,
        normal: open.filter(t => t.priority === EscalationPriority.NORMAL).length,
        low: open.filter(t => t.priority <= EscalationPriority.LOW).length
      },
      overdue: open.filter(t => t.getWaitingTime() > this.maxWaitingTime).length,
      avgResolutionTime: closed.length > 0
        ? (closed.reduce((sum, t) => sum + (t.resolvedAt - t.createdAt), 0) / closed.length / 1000 / 60).toFixed(1) + ' min'
        : 'N/A'
    };
  }
}

// Agent with Escalation Capability
class EscalationAgent {
  constructor(name, llm, escalationManager) {
    this.name = name;
    this.llm = llm;
    this.escalationManager = escalationManager;
    this.confidenceThreshold = 0.7;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  // Process user request with escalation check
  async processRequest(userInput, context = {}) {
    console.log(`\n[${this.name}] Processing: ${userInput.substring(0, 50)}...`);

    // Check escalation rules first
    const escalationCheck = this.escalationManager.shouldEscalate({
      input: userInput,
      context,
      retryCount: this.retryCount
    });

    if (escalationCheck.shouldEscalate) {
      console.log(`[${this.name}] Escalation triggered: ${escalationCheck.action.reason}`);
      return this.escalate(escalationCheck.action, userInput, context);
    }

    try {
      // Attempt to generate response
      const response = await this.generateResponse(userInput, context);

      // Check confidence (simulated)
      const confidence = this.estimateConfidence(response);

      if (confidence < this.confidenceThreshold) {
        console.log(`[${this.name}] Low confidence (${confidence}), escalating...`);
        return this.escalate(
          { reason: EscalationReason.CONFIDENCE_LOW, priority: EscalationPriority.NORMAL },
          userInput,
          context
        );
      }

      this.retryCount = 0; // Reset on success
      return { success: true, response };

    } catch (error) {
      this.retryCount++;
      console.log(`[${this.name}] Error (attempt ${this.retryCount}): ${error.message}`);

      if (this.retryCount >= this.maxRetries) {
        return this.escalate(
          { reason: EscalationReason.EXCEEDED_RETRIES, priority: EscalationPriority.HIGH },
          userInput,
          context
        );
      }

      throw error;
    }
  }

  // Generate response
  async generateResponse(input, context) {
    const prompt = ChatPromptTemplate.fromTemplate(
      'Answer this user question: {input}'
    );
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    return chain.invoke({ input });
  }

  // Estimate confidence (simplified)
  estimateConfidence(response) {
    // Simple heuristic based on response length
    if (response.length < 20) return 0.3;
    if (response.length > 500) return 0.9;
    return 0.7;
  }

  // Escalate to human
  async escalate(action, input, context) {
    const ticket = this.escalationManager.createTicket(
      action.reason,
      action.priority || EscalationPriority.NORMAL,
      { input, context, agent: this.name }
    );

    // Generate human-readable summary
    const summary = await this.generateSummary(input, context);

    return {
      escalated: true,
      ticketId: ticket.id,
      reason: action.reason,
      summary,
      message: 'A human agent will review your request shortly.'
    };
  }

  // Generate summary for human agent
  async generateSummary(input, context) {
    const prompt = ChatPromptTemplate.fromTemplate(
      'Summarize this customer request for a human agent to understand: {input}'
    );
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    return chain.invoke({ input });
  }
}

// Usage
async function demoEscalation() {
  const escalationManager = new EscalationManager({ autoAssign: true });

  // Define escalation rules
  escalationManager.addRule(
    (ctx) => ctx.input.toLowerCase().includes('refund') || ctx.input.toLowerCase().includes('lawsuit'),
    { reason: EscalationReason.SENSITIVE_TOPIC, priority: EscalationPriority.HIGH }
  );

  escalationManager.addRule(
    (ctx) => ctx.input.toLowerCase().includes('help me'),
    { reason: EscalationReason.USER_REQUEST, priority: EscalationPriority.NORMAL }
  );

  escalationManager.addRule(
    (ctx) => ctx.retryCount >= 3,
    { reason: EscalationReason.EXCEEDED_RETRIES, priority: EscalationPriority.HIGH }
  );

  const agent = new EscalationAgent('SupportBot', llm, escalationManager);

  // Test normal request
  console.log('\n=== Test 1: Normal Request ===');
  await agent.processRequest('What are your business hours?');

  // Test sensitive topic
  console.log('\n=== Test 2: Sensitive Topic ===');
  await agent.processRequest('I want to file a refund for my order');

  // Test with simulated errors (retry logic)
  console.log('\n=== Test 3: Error Recovery ===');
  agent.retryCount = 2; // Simulate previous failures
  await agent.processRequest('Tell me about your company');

  // Check escalation stats
  console.log('\n=== Escalation Statistics ===');
  console.log(escalationManager.getStats());

  // Simulate human resolution
  const openTickets = escalationManager.getOpenByPriority();
  if (openTickets.length > 0) {
    console.log('\n=== Resolving Ticket ===');
    escalationManager.resolveTicket(openTickets[0].id, 'Issue resolved by human agent');
  }
}

demoEscalation();
```

## 社区热议与实践分享

人在回路模式在 2025-2026 年引发了 AI 社区的广泛讨论。从学术研究到工程实践，从框架设计到哲学思辨，业界对 HITL 模式的理解正在快速演进。以下是来自社区的关键洞察和实践分享。

### 行业领袖观点

**Andrew Ng — 智能体工作流的倡导者**

Andrew Ng 在其 [DeepLearning.AI 智能体课程](https://www.deeplearning.ai/courses/agentic-ai/) 中将人在回路定义为智能体工作流的关键保障。他强调，即使是简单的智能体工作流，通常也需要"人在回路"检查才能在生产环境中运行。他的研究表明，将 GPT-3.5 包装在智能体循环中可以在 HumanEval 编码基准上达到 95.1% 的准确率，超越了单独使用 GPT-4 的表现 —— 但前提是有人类参与质量把关。

> *"I think AI agentic workflows will drive massive AI progress this year — perhaps even more than the next generation of foundation models."*
> — [Andrew Ng (@AndrewYNg)](https://x.com/AndrewYNg/status/1770897666702233815)

**Harrison Chase — 从"对话代理"到"环境代理"**

LangChain 创始人 Harrison Chase 在 [AI Ascent 2025](https://sequoiacap.com/podcast/training-data-harrison-chase-2/) 上提出了"环境代理"(Ambient Agents) 的概念，强调**环境运行并不等于完全自主**。他设计了 [Agent Inbox](https://blog.langchain.com/tag/in-the-loop/) 原型 —— 一个专门用于人机协作的交互界面，支持批准/拒绝、编辑操作、回答问题和"时间旅行"（回溯决策）等交互模式。Chase 本人使用环境邮件代理已超过一年，该代理能自动起草回复和发送日历邀请，但始终保持人在回路监督。

> LangChain 官方推文: *"LangGraph Agents - Breakpoints. Human-in-the-loop (HIL) is one of the most requested agent features."*
> — [LangChain (@LangChainAI)](https://x.com/LangChainAI/status/1810716040579408319)

**Anthropic — 用数据说话的自主性研究**

Anthropic 发布了迄今为止最全面的 [智能体自主性实证研究](https://www.anthropic.com/research/measuring-agent-autonomy)，分析了数百万次 Claude Code 交互数据，揭示了几个关键发现：

- **信任随经验增长**：新用户（少于 50 次会话）仅约 20% 的时间使用全自动批准模式；而经验丰富的用户（750+ 次会话）这一比例超过 40%
- **监督策略的转变**：有经验的用户中断频率和自动批准频率同时增加 —— 这反映了从"逐项批准"到"监控+干预"的策略转变
- **智能体自我调节**：Claude Code 主动暂停请求澄清的频率高于人类中断它的频率。在最复杂的任务中，代理自发停下来请求澄清的次数是人类中断它的两倍多
- **低风险为主**：仅 0.8% 的观察到的操作是不可逆的（如发送客户邮件）

> *"New Anthropic research: Measuring AI agent autonomy in practice. We analyzed millions of interactions across Claude Code and our API."*
> — [Anthropic (@AnthropicAI)](https://x.com/AnthropicAI/status/2024210035480678724)

**Martin Fowler / Thoughtworks — 软件工程中的人机循环**

Martin Fowler 的 Thoughtworks 团队发表了 [Humans and Agents in Software Engineering Loops](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html)，提出人类应该**构建和管理工作循环**，而不是放手让代理自行运作或事无巨细地微观管理 —— 这被称为"在回路上"(on the loop)而非"在回路中"(in the loop)。文章引发了关于"学徒差距"(Apprentice Gap) 的讨论：如果在职业生涯早期就将人移到"回路上"，未来可能没有人能深入理解底层技术来构建可靠的系统。

### 社区开发者实践

**X/Twitter 上的热门讨论**

社区开发者在实践中分享了大量 HITL 相关经验：

1. **Allie K. Miller** 观察到一个有趣的现象：随着使用经验增加，用户对 HITL 的态度逐渐放松。她指出这可能有两种原因 —— 乐观解读是用户更了解 AI 的能力边界，悲观解读则是用户"陷入信任惯性，50% 的自动批准只是放弃审查的表现"。([来源](https://x.com/alliekmiller/status/2025989758850335109))

2. **Christian Bromann** 构建了一个 [LangChain HITL 中间件](https://x.com/bromann/status/1988653017982226704)，在执行每一步之前暂停等待人工批准，展示了如何在现有框架上增加人类监督层。

3. **Swarup Das** 在深入研究 HITL 中断模式后[分享了心得](https://x.com/swarupdcs/status/2025208634175881411)，重点关注批准模式 —— 如何在代理采取行动之前向用户展示批准请求。

4. **Peter Girnus** 提供了一个发人深省的[一线视角](https://x.com/gothburz/status/2031702304752030197)：在高度机密的军事环境中，HITL 审查可能沦为"仪式" —— 当审查窗口只有几秒钟、压力巨大时，人类批准的价值大打折扣。

5. **Jd Fiscus** 展示了一个完整的[智能体开发工作流](https://x.com/nerding_io/status/1932378886857535922)：Jira AI 代理处理工单 -> Codex/Claude 编码 -> PR 工作流 -> CodeRabbit 自动审查 -> 人在回路做最终批准。

### 框架与平台的 HITL 支持

主流 AI 智能体框架在 2025-2026 年纷纷加强了对 HITL 模式的原生支持：

| 框架/平台 | HITL 实现方式 | 关键特性 |
|-----------|-------------|---------|
| **LangGraph** | 断点 (Breakpoints) + 中断/恢复模型 | 任意节点暂停、状态持久化、检查点回溯 |
| **Google ADK** | `require_confirmation` 参数 + `LongRunningFunctionTool` | 工具级别确认流、异步等待人工输入 |
| **Cloudflare Agents** | 关键点暂停 (Critical Point Pause) | 在关键决策点暂停等待人工审查 |
| **AI SDK (Vercel)** | [Next.js HITL 配方](https://x.com/aisdk/status/1887920757084405766) | 前端集成的人机交互步骤 |
| **AG2** | 内置人在回路支持 | 多种交互模式配置 |
| **n8n** | 工具审批 (Tool Approval) 模式 | 审查 AI 意图而非最终输出 |

### 安全视角：HITL 的攻防博弈

值得关注的是，安全研究社区也在审视 HITL 机制的脆弱性。Checkmarx 在 2025 年底发表了关于 [LITL 攻击](https://checkmarx.com/zero-post/turning-ai-safeguards-into-weapons-with-hitl-dialog-forging/) 的研究，揭示了攻击者如何利用间接提示注入让代理呈现看似无害的 HITL 对话框，诱导用户批准实际上是远程代码执行的恶意操作。OWASP 将 HITL 对话框列为 LLM Top 10 漏洞的推荐缓解措施之一，但 LITL 攻击表明它也可能成为"最后一道防线中的薄弱环节"。

此外，arXiv 上最新发表的 [OpenClaw 安全分析](https://arxiv.org/html/2603.10387) 提出了一个分层防御框架：允许列表过滤已知安全操作、基于模式的风险分类（包含 35 条检测规则）、语义判断器评估指令意图，以及对高风险操作强制要求人工批准。

### 社区共识与争议

**共识点：**

1. **HITL 不是可选的** —— 在高风险场景中，人类监督是生产就绪的必要条件
2. **监督模式应该演进** —— 从"逐项批准"走向"监控+干预"是自然趋势
3. **框架原生支持至关重要** —— 低摩擦的 HITL 集成能显著提高采纳率
4. **透明度是信任基础** —— 智能体应主动暴露推理过程和决策依据

**争议点：**

1. **"回路疲劳"问题** —— 当审批请求过多时，人类是否真的在认真审查？
2. **自主性边界** —— 何时该完全信任代理、何时必须保留人工控制？
3. **初级开发者困境** —— 如果新手从一开始就使用"回路上"模式，他们能否积累足够的深层技术理解？
4. **安全 vs 效率** —— HITL 增加的延迟和成本是否总是值得的？

---

### 本章小结

本章我们深入探讨了人在回路(Human-in-the-Loop, HITL)模式的核心概念和实现方式。这一模式通过将人类智慧与AI能力相结合，创建更安全、更可靠的智能体系统。

### 关键要点回顾

**1. 批准门 (Approval Gate)**
- 高风险操作前需要人工审批
- 支持批准、拒绝、评论等反馈
- 可设置自动过期机制
- 完整的审批历史记录和统计

**2. 人工审查 (Human Review)**
- 多维度评分系统(准确性、清晰度、语气、完整性)
- 支持修订请求和拒绝
- 评级统计和平均分计算
- 适用于内容审核、代码审查等场景

**3. 反馈回路 (Feedback Loop)**
- 多种反馈类型：评分、纠正、建议、投票
- 按用户和交互维度收集反馈
- 聚合指标计算和模式分析
- LLM驱动的改进建议生成

**4. 升级系统 (Escalation)**
- 多种升级原因：低置信度、敏感话题、安全问题等
- 优先级队列管理
- 自动分配和超时处理
- 完整的工单统计和解决时间追踪

### HITL 最佳实践

1. **明确升级标准**：制定清晰的规则，定义何时需要人工介入

2. **保持人工在环**：在高风险决策中始终保留人类监督

3. **收集有价值的反馈**：设计有效的反馈收集机制，帮助改进系统

4. **平衡自动化与人工**：根据场景选择适当的自动化程度

5. **持续监控和改进**：定期分析升级数据，优化流程

### HITL 应用场景

| 场景 | 应用方式 |
|------|---------|

| 客户服务 | 智能解答+人工升级处理复杂问题 |
| 金融交易 | 自动审核+人工批准大额交易 |
| 医疗辅助 | AI建议+医生最终决策 |
| 内容审核 | AI初筛+人工复核敏感内容 |
| 代码审查 | AI审查+人工批准合并 |

### 总结

人在回路模式是构建负责任AI系统的关键。通过本章介绍的模式和技术，开发者可以在充分发挥AI能力的同时，确保人类监督和控制始终存在。随着AI技术的不断进步，HITL将继续在需要高可靠性、高安全性的应用场景中发挥重要作用。

---

*本章代码示例均基于 LangChain JavaScript SDK 实现，可直接在实际项目中使用或根据具体需求进行修改。*

---

## 参考资源

### 学术研究与技术报告

- [Measuring AI Agent Autonomy in Practice](https://www.anthropic.com/research/measuring-agent-autonomy) — Anthropic 对 Claude Code 数百万次交互的实证分析，揭示智能体自主性与人类监督的动态关系
- [Designing Meaningful Human Oversight in AI](https://www.researchgate.net/publication/395540553_Designing_Meaningful_Human_Oversight_in_AI) — 提出结构化理由、推理轨迹、置信度信号等监督机制目录
- [Design Considerations for Human Oversight of AI](https://arxiv.org/abs/2510.19512) — 基于共同设计工作坊和工作设计理论的 AI 监督设计考量
- [Trustworthy AI in Practice: A Comprehensive Review of Human Oversight](https://www.techrxiv.org/users/688001/articles/1346357) — 对 HITL、HOTL、HIC 机制在 AI 生命周期中的全面综述
- [OpenClaw Security Analysis and Defense Framework](https://arxiv.org/html/2603.10387) — 提出分层 HITL 防御框架，包含允许列表、风险分类和语义判断

### 框架文档与实现指南

- [LangGraph Human-in-the-Loop](https://towardsdatascience.com/langgraph-201-adding-human-oversight-to-your-deep-research-agent/) — LangGraph 201：为深度研究代理添加人类监督
- [Google ADK: Human-in-the-Loop Made Easy](https://medium.com/google-cloud/2-minute-adk-human-in-the-loop-made-easy-da9e74d9845a) — Google ADK 的 HITL 快速实现指南
- [Developer's Guide to Multi-Agent Patterns in ADK](https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/) — Google 开发者博客的多智能体模式指南，包含 HITL 设计模式
- [Cloudflare Agents: Human in the Loop](https://developers.cloudflare.com/agents/concepts/human-in-the-loop/) — Cloudflare 智能体平台的 HITL 概念文档
- [AG2: Human in the Loop](https://docs.ag2.ai/latest/docs/user-guide/basic-concepts/human-in-the-loop/) — AG2 框架的人在回路用户指南
- [IBM: Human-in-the-Loop AI Agent with LangGraph & watsonx](https://www.ibm.com/think/tutorials/human-in-the-loop-ai-agent-langraph-watsonx-ai) — IBM 的 HITL 智能体教程

### 行业洞察与最佳实践

- [Human-in-the-Loop for AI Agents: Best Practices](https://www.permit.io/blog/human-in-the-loop-for-ai-agents-best-practices-frameworks-use-cases-and-demo) — Permit.io 的 HITL 最佳实践、框架和用例指南
- [Production AI Playbook: Human Oversight](https://blog.n8n.io/production-ai-playbook-human-oversight/) — n8n 的生产级 AI 人类监督实战手册
- [Human-in-the-Loop (HitL) Agentic AI for High-Stakes Oversight](https://onereach.ai/blog/human-in-the-loop-agentic-ai-systems/) — OneReach 关于高风险场景下 HITL 的深入分析
- [The Rise of Agentic AI: Why Human-in-the-Loop Still Matters](https://imerit.net/resources/blog/the-rise-of-agentic-ai-why-human-in-the-loop-still-matters-una/) — iMerit 对 HITL 持续重要性的论述
- [Building Trustworthy Agentic AI With Human Oversight](https://www.digitaldividedata.com/blog/building-trustworthy-agentic-ai-with-human-oversight) — 构建可信智能体 AI 的人类监督方法论
- [How Human-in-the-Loop Is Evolving with AI Agents](https://builtin.com/articles/human-in-the-loop-evolution) — Built In 关于 HITL 演进趋势的分析
- [The Definitive Guide to Agentic Design Patterns in 2026](https://www.sitepoint.com/the-definitive-guide-to-agentic-design-patterns-in-2026/) — SitePoint 的智能体设计模式权威指南

### 架构设计与系统模式

- [Humans and Agents in Software Engineering Loops](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html) — Martin Fowler / Thoughtworks 关于软件工程中人机循环的深度分析
- [AI Agent Orchestration Patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns) — Microsoft Azure 架构中心的 AI 智能体编排模式
- [Augmentation Over Automation: HITL AI Agent Design](https://medium.com/google-cloud/augmentation-over-automation-human-in-the-loop-ai-agent-design-in-shoppers-concierge-311100255281) — Google Cloud 社区关于"增强优先于自动化"的 HITL 设计理念
- [Harrison Chase: Ambient Agents and the Agent Inbox](https://sequoiacap.com/podcast/training-data-harrison-chase-2/) — Sequoia Capital 播客：LangChain 创始人谈环境代理与代理收件箱

### 安全与治理

- [LITL Attack: Turning AI Safeguards Into Weapons](https://checkmarx.com/zero-post/turning-ai-safeguards-into-weapons-with-hitl-dialog-forging/) — Checkmarx 关于利用 HITL 对话框进行攻击的安全研究
- [7 Agentic AI Trends to Watch in 2026](https://machinelearningmastery.com/7-agentic-ai-trends-to-watch-in-2026/) — Machine Learning Mastery 对智能体 AI 趋势的展望，包含治理与监督维度
- [Anthropic: Most Gen AI Use Still Involves Human Oversight](https://www.pymnts.com/news/artificial-intelligence/2026/anthropic-says-most-gen-ai-use-still-involves-human-oversight/) — Anthropic 经济指数显示大部分生成式 AI 使用仍涉及人类监督

### 社区讨论 (X/Twitter)

- [Andrew Ng (@AndrewYNg)](https://x.com/AndrewYNg/status/1975614372799283423) — 宣布智能体 AI 课程，涵盖四大设计模式
- [Anthropic (@AnthropicAI)](https://x.com/AnthropicAI/status/2024210035480678724) — 发布智能体自主性实证研究
- [LangChain (@LangChainAI)](https://x.com/LangChainAI/status/1810716040579408319) — LangGraph 断点实现 HITL
- [Allie K. Miller (@alliekmiller)](https://x.com/alliekmiller/status/2025989758850335109) — 关于 HITL 信任放松现象的观察
- [Christian Bromann (@bromann)](https://x.com/bromann/status/1988653017982226704) — LangChain HITL 中间件实现
- [AI SDK (@aisdk)](https://x.com/aisdk/status/1887920757084405766) — Next.js HITL 配方
- [LlamaIndex (@llama_index)](https://x.com/llama_index/status/1923134285940441102) — Tig 终端 HITL 编码代理