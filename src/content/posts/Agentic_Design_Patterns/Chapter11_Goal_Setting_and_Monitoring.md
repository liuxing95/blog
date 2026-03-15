---
title: 'Chapter 11: Goal Setting and Monitoring'
date: '2026-03-15'
excerpt: 'Effective agents not only respond to immediate requests but also work toward longer-term goals. 融合社区洞察与前沿实践，全面解析目标设定与监控模式。'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 11: Goal Setting and Monitoring

# 第十一章：目标设定与监控

## Goal Setting and Monitoring Pattern Overview

## 目标设定与监控模式概述

Effective agents not only respond to immediate requests but also work toward longer-term goals.

有效的智能体不仅响应即时请求，还朝着更长期的目标努力。

The goal setting and monitoring pattern involves defining clear objectives, tracking progress, and adjusting strategies to achieve those goals.

目标设定和监控模式涉及定义明确的目标、跟踪进度和调整策略以实现这些目标。

### Goal Definition

### 目标定义

Goals should be:

目标应该是：

- **Specific**: Clearly defined and unambiguous.

- **具体**: 清晰定义且明确。

- **Measurable**: Quantifiable progress indicators.

- **可衡量**: 可量化的进度指标。

- **Achievable**: Realistic given available resources.

- **可实现**: 考虑到可用资源是现实的。

- **Relevant**: Aligned with overall objectives.

- **相关**: 与整体目标一致。

- **Time-Bound**: Clear deadlines or timeframes.

- **有期限**: 明确的截止日期或时间范围。

### Progress Monitoring

### 进度监控

Agents should track their progress toward goals and be able to:

智能体应该能够跟踪他们实现目标的进度，并且能够：

- Measure completion of sub-goals

- 衡量子目标的完成

- Identify obstacles and blockers

- 识别障碍和阻碍

- Adjust timelines and strategies as needed

- 根据需要调整时间表和策略

- Report status to users or other systems

- 向用户或其他系统报告状态

### Goal Refinement

### 目标优化

Goals may need to be refined based on:

目标可能需要根据以下情况进行优化：

- Changing user needs

- 变化的用户需求

- New information or constraints

- 新信息或约束

- Progress feedback

- 进度反馈

- Environmental changes

- 环境变化

## Practical Applications & Use Cases

## 实际应用和用例

### Project Management

### 项目管理

Agents can help manage projects by tracking milestones, identifying risks, and coordinating team efforts.

智能体可以通过跟踪里程碑、识别风险和协调团队努力来帮助管理项目。

### Personal Productivity

### 个人生产力

Personal assistants can help users achieve long-term goals by breaking them down into manageable tasks and tracking progress.

个人助手可以通过将长期目标分解为可管理的任务并跟踪进度来帮助用户实现目标。

### Business Process Automation

### 业务流程自动化

Agents can monitor and optimize business processes toward specific efficiency or quality goals.

智能体可以监控和优化业务流程以实现特定的效率或质量目标。

## Hands-On Code Examples

## 实践代码示例

### 1. Goal Definition (目标定义)

以下代码实现了符合SMART标准的智能体目标定义系统：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Goal Status
const GoalStatus = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
  CANCELLED: 'cancelled',
};

// Priority Levels
const Priority = {
  LOW: 1,
  MEDIUM: 5,
  HIGH: 10,
  CRITICAL: 20,
};

// Goal Item
class Goal {
  constructor(config) {
    this.id = `goal_${Date.now()}`;
    this.title = config.title;
    this.description = config.description;
    this.status = GoalStatus.PENDING;

    // SMART criteria
    this.specific = config.specific || '';
    this.measurable = config.measurable || {}; // { target: number, unit: string }
    this.achievable = config.achievable || true;
    this.relevant = config.relevant || '';
    this.timeBound = config.timeBound || null; // { deadline: Date, duration: number }

    this.priority = config.priority || Priority.MEDIUM;
    this.category = config.category || 'general';

    this.subGoals = [];
    this.progress = 0;
    this.metrics = [];

    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    this.completedAt = null;
  }

  // Add sub-goal
  addSubGoal(subGoal) {
    this.subGoals.push(subGoal);
    this.updatedAt = Date.now();
  }

  // Update progress
  updateProgress(progress) {
    this.progress = Math.min(100, Math.max(0, progress));
    this.updatedAt = Date.now();

    if (this.progress === 100) {
      this.status = GoalStatus.COMPLETED;
      this.completedAt = Date.now();
    }
  }

  // Check if goal is on track
  isOnTrack() {
    if (!this.timeBound || !this.timeBound.deadline) return true;

    const now = Date.now();
    const deadline = new Date(this.timeBound.deadline).getTime();
    const timeRemaining = deadline - now;

    // If more than 80% time elapsed but less than 50% progress
    const totalDuration = deadline - this.createdAt;
    const timeElapsed = now - this.createdAt;
    const progressRatio = this.progress / 100;

    return timeElapsed / totalDuration >= progressRatio - 0.2;
  }

  // Get status summary
  getSummary() {
    return {
      id: this.id,
      title: this.title,
      status: this.status,
      progress: `${this.progress}%`,
      priority: this.priority,
      onTrack: this.isOnTrack(),
      subGoals: this.subGoals.length,
      deadline: this.timeBound?.deadline,
    };
  }
}

// Goal Manager
class GoalManager {
  constructor() {
    this.goals = new Map();
    this.listeners = new Map();
  }

  // Create goal with validation
  createGoal(config) {
    // Validate SMART criteria
    const validation = this.validateGoal(config);
    if (!validation.valid) {
      console.warn(`[Goal] Warning: ${validation.warnings.join(', ')}`);
    }

    const goal = new Goal(config);
    goal.status = GoalStatus.ACTIVE;
    this.goals.set(goal.id, goal);

    console.log(`[Goal] Created goal: ${goal.title}`);
    return goal;
  }

  // Validate goal meets SMART criteria
  validateGoal(config) {
    const warnings = [];

    if (!config.specific) warnings.push('Goal is not specific');
    if (!config.measurable) warnings.push('Goal is not measurable');
    if (!config.achievable) warnings.push('Goal may not be achievable');
    if (!config.relevant) warnings.push('Goal relevance not defined');
    if (!config.timeBound) warnings.push('Goal has no deadline');

    return {
      valid: warnings.length === 0,
      warnings,
    };
  }

  // Get goal by ID
  getGoal(id) {
    return this.goals.get(id);
  }

  // Get all goals
  getAllGoals() {
    return Array.from(this.goals.values());
  }

  // Get goals by status
  getGoalsByStatus(status) {
    return this.getAllGoals().filter((g) => g.status === status);
  }

  // Get goals by category
  getGoalsByCategory(category) {
    return this.getAllGoals().filter((g) => g.category === category);
  }

  // Get on-track goals
  getOnTrackGoals() {
    return this.getAllGoals().filter((g) => g.isOnTrack());
  }

  // Subscribe to goal changes
  subscribe(goalId, listener) {
    if (!this.listeners.has(goalId)) {
      this.listeners.set(goalId, []);
    }
    this.listeners.get(goalId).push(listener);
  }

  // Notify listeners
  notifyListeners(goalId, event, data) {
    const listeners = this.listeners.get(goalId);
    if (listeners) {
      listeners.forEach((listener) => listener(event, data));
    }
  }
}

// Usage
const goalManager = GoalManager();

// Create goals
const goal1 = goalManager.createGoal({
  title: 'Learn Machine Learning',
  description: 'Master machine learning fundamentals and apply them to projects',
  specific: 'Complete ML courses and build 3 projects',
  measurable: { target: 3, unit: 'projects' },
  achievable: true,
  relevant: 'Career advancement in AI',
  timeBound: { deadline: '2024-12-31', duration: 180 },
  priority: Priority.HIGH,
  category: 'learning',
});

const goal2 = goalManager.createGoal({
  title: 'Increase Sales',
  description: 'Boost Q4 sales performance',
  specific: 'Increase monthly sales by 20%',
  measurable: { target: 20, unit: 'percent' },
  achievable: true,
  relevant: 'Company growth',
  timeBound: { deadline: '2024-12-31', duration: 90 },
  priority: Priority.CRITICAL,
  category: 'business',
});

// Add sub-goals
goal1.addSubGoal({ title: "Complete Andrew Ng's ML Course", completed: true });
goal1.addSubGoal({ title: 'Build image classifier project', completed: false });
goal1.addSubGoal({ title: 'Build NLP sentiment analyzer', completed: false });

// Update progress
goal1.updateProgress(33);

// Get summary
console.log('\nGoal Summary:');
console.log(goal1.getSummary());

console.log('\nAll Goals:');
goalManager.getAllGoals().forEach((g) => {
  console.log(`- ${g.title}: ${g.progress}% (${g.status})`);
});

console.log('\nOn Track Goals:');
goalManager.getOnTrackGoals().forEach((g) => {
  console.log(`- ${g.title}`);
});
```

### 2. Progress Monitoring (进度监控)

以下代码实现了智能体进度监控系统：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Metric Types
const MetricType = {
  PERCENTAGE: 'percentage',
  COUNT: 'count',
  TIME: 'time',
  CUSTOM: 'custom',
};

// Progress Metric
class Metric {
  constructor(name, type, value, target, unit = '') {
    this.name = name;
    this.type = type;
    this.value = value;
    this.target = target;
    this.unit = unit;
    this.history = [];
    this.recordedAt = Date.now();
  }

  // Update value
  update(value) {
    this.history.push({
      value: this.value,
      timestamp: this.recordedAt,
    });
    this.value = value;
    this.recordedAt = Date.now();
  }

  // Get completion percentage
  getCompletion() {
    if (this.target === 0) return 0;
    return Math.min(100, (this.value / this.target) * 100);
  }

  // Check if on track
  isOnTrack() {
    const completion = this.getCompletion();
    return completion >= 50; // Expecting at least 50% completion
  }
}

// Progress Monitor
class ProgressMonitor {
  constructor() {
    this.goals = new Map();
    this.metrics = new Map();
    this.alerts = [];
  }

  // Track progress for a goal
  trackGoal(goalId, metrics) {
    this.goals.set(goalId, {
      metrics: metrics.map((m) => new Metric(m.name, m.type, m.value, m.target, m.unit)),
      startTime: Date.now(),
      lastUpdate: Date.now(),
    });

    console.log(`[Monitor] Tracking goal ${goalId} with ${metrics.length} metrics`);
  }

  // Add metric to goal
  addMetric(goalId, metric) {
    const goal = this.goals.get(goalId);
    if (!goal) {
      console.warn(`[Monitor] Goal ${goalId} not found`);
      return;
    }

    goal.metrics.push(
      new Metric(metric.name, metric.type, metric.value, metric.target, metric.unit),
    );
    goal.lastUpdate = Date.now();
  }

  // Update metric value
  updateMetric(goalId, metricName, value) {
    const goal = this.goals.get(goalId);
    if (!goal) return;

    const metric = goal.metrics.find((m) => m.name === metricName);
    if (metric) {
      metric.update(value);
      this.checkAlerts(goalId, metric);
    }
  }

  // Check for alerts
  checkAlerts(goalId, metric) {
    const completion = metric.getCompletion();

    if (metric.isOnTrack() === false) {
      const alert = {
        goalId,
        metric: metric.name,
        type: 'warning',
        message: `${metric.name} is behind target: ${completion.toFixed(1)}%`,
        timestamp: Date.now(),
      };
      this.alerts.push(alert);
      console.log(`[Monitor] ALERT: ${alert.message}`);
    }
  }

  // Get progress report
  getProgressReport(goalId) {
    const goal = this.goals.get(goalId);
    if (!goal) return null;

    const metrics = goal.metrics.map((m) => ({
      name: m.name,
      value: m.value,
      target: m.target,
      completion: `${m.getCompletion().toFixed(1)}%`,
      onTrack: m.isOnTrack(),
    }));

    const overallProgress = metrics.reduce((sum, m) => sum + m.completion, 0) / metrics.length;

    return {
      goalId,
      overallProgress: `${overallProgress.toFixed(1)}%`,
      metrics,
      alerts: this.alerts.filter((a) => a.goalId === goalId),
      lastUpdate: goal.lastUpdate,
    };
  }

  // Get all alerts
  getAlerts() {
    return this.alerts;
  }

  // Clear alerts
  clearAlerts(goalId = null) {
    if (goalId) {
      this.alerts = this.alerts.filter((a) => a.goalId !== goalId);
    } else {
      this.alerts = [];
    }
  }

  // Generate progress summary using LLM
  async generateSummary(goalId) {
    const report = this.getProgressReport(goalId);
    if (!report) return 'Goal not found';

    const prompt = ChatPromptTemplate.fromTemplate(
      `Generate a progress summary for this goal:

Progress: {progress}
Metrics: {metrics}
Alerts: {alerts}

Provide a brief summary:`,
    );

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    return chain.invoke({
      progress: report.overallProgress,
      metrics: JSON.stringify(report.metrics),
      alerts: report.alerts.length > 0 ? JSON.stringify(report.alerts) : 'No alerts',
    });
  }
}

// Usage
const monitor = new ProgressMonitor();

// Track goal with metrics
monitor.trackGoal('goal_1', [
  { name: 'tasks_completed', type: MetricType.COUNT, value: 5, target: 10, unit: 'tasks' },
  { name: 'time_spent', type: MetricType.TIME, value: 20, target: 40, unit: 'hours' },
  { name: 'quality_score', type: MetricType.PERCENTAGE, value: 75, target: 100, unit: '%' },
]);

// Update metrics
monitor.updateMetric('goal_1', 'tasks_completed', 7);
monitor.updateMetric('goal_1', 'time_spent', 25);

// Get progress report
console.log('\n--- Progress Report ---');
console.log(monitor.getProgressReport('goal_1'));

// Get alerts
console.log('\n--- Alerts ---');
console.log(monitor.getAlerts());

// Generate LLM summary
async function demoSummary() {
  const summary = await monitor.generateSummary('goal_1');
  console.log('\n--- LLM Summary ---');
  console.log(summary);
}

demoSummary();
```

### 3. Goal Refinement (目标优化)

以下代码实现了基于反馈和情境的目标优化系统：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Refinement Reasons
const RefinementReason = {
  USER_FEEDBACK: 'user_feedback',
  PROGRESS_SLOW: 'progress_slow',
  RESOURCE_CHANGE: 'resource_change',
  NEW_INFORMATION: 'new_information',
  ENVIRONMENT_CHANGE: 'environment_change',
};

// Goal Revision
class GoalRevision {
  constructor(goalId, reason, oldValue, newValue) {
    this.id = `revision_${Date.now()}`;
    this.goalId = goalId;
    this.reason = reason;
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.timestamp = Date.now();
  }
}

// Goal Refiner
class GoalRefiner {
  constructor() {
    this.goals = new Map();
    this.revisions = [];
  }

  // Load existing goal
  loadGoal(goal) {
    this.goals.set(goal.id, goal);
  }

  // Refine goal based on feedback
  async refineGoal(goalId, newSpecs, reason) {
    const goal = this.goals.get(goalId);
    if (!goal) {
      throw new Error(`Goal ${goalId} not found`);
    }

    // Store revision history
    const revision = new GoalRevision(
      goalId,
      reason,
      {
        target: goal.measurable?.target,
        deadline: goal.timeBound?.deadline,
        priority: goal.priority,
      },
      newSpecs,
    );
    this.revisions.push(revision);

    // Apply refinements
    if (newSpecs.target !== undefined) {
      goal.measurable.target = newSpecs.target;
    }
    if (newSpecs.deadline !== undefined) {
      goal.timeBound.deadline = newSpecs.deadline;
    }
    if (newSpecs.priority !== undefined) {
      goal.priority = newSpecs.priority;
    }
    if (newSpecs.description !== undefined) {
      goal.description = newSpecs.description;
    }

    goal.updatedAt = Date.now();

    console.log(`[Refiner] Goal ${goal.title} refined: ${reason}`);
    return goal;
  }

  // Auto-refine based on progress
  async autoRefine(goalId) {
    const goal = this.goals.get(goalId);
    if (!goal) return null;

    // Calculate if goal needs adjustment
    const progressRatio = goal.progress / 100;
    const now = Date.now();
    const deadline = goal.timeBound?.deadline ? new Date(goal.timeBound.deadline).getTime() : null;

    if (!deadline) return null;

    const timeElapsed = now - goal.createdAt;
    const totalDuration = deadline - goal.createdAt;
    const timeRatio = timeElapsed / totalDuration;

    // If progress is significantly behind time
    if (progressRatio < timeRatio - 0.2) {
      console.log(`[Refiner] Auto-refining goal: progress behind schedule`);

      // Suggest new deadline
      const newDeadline = new Date(goal.createdAt + timeElapsed / progressRatio);
      const newSpecs = {
        deadline: newDeadline.toISOString().split('T')[0],
      };

      return await this.refineGoal(goalId, newSpecs, RefinementReason.PROGRESS_SLOW);
    }

    return null;
  }

  // Use LLM to suggest refinements
  async suggestRefinements(goalId, context) {
    const goal = this.goals.get(goalId);
    if (!goal) return null;

    const prompt = ChatPromptTemplate.fromTemplate(
      `Analyze this goal and suggest refinements based on the context:

Goal: {title}
Description: {description}
Current Progress: {progress}%
Target: {target} {unit}
Deadline: {deadline}

Context: {context}

Suggest:
1. Is the target achievable?
2. Should the deadline be adjusted?
3. Any other recommendations?

Respond in JSON format:
{
  "targetAdjustment": "increase/decrease/same",
  "deadlineAdjustment": "extend/shorten/same",
  "recommendations": ["rec1", "rec2"]
}`,
    );

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    try {
      const response = await chain.invoke({
        title: goal.title,
        description: goal.description,
        progress: goal.progress,
        target: goal.measurable?.target || 'N/A',
        unit: goal.measurable?.unit || '',
        deadline: goal.timeBound?.deadline || 'N/A',
        context,
      });

      return JSON.parse(response);
    } catch (e) {
      console.log('[Refiner] LLM suggestion failed:', e.message);
      return null;
    }
  }

  // Get revision history
  getRevisionHistory(goalId) {
    return this.revisions.filter((r) => r.goalId === goalId);
  }

  // Rollback to previous revision
  async rollback(goalId) {
    const revisions = this.getRevisionHistory(goalId);
    if (revisions.length === 0) return null;

    const lastRevision = revisions[revisions.length - 1];
    const goal = this.goals.get(goalId);

    if (goal && lastRevision) {
      goal.measurable.target = lastRevision.oldValue.target;
      goal.timeBound.deadline = lastRevision.oldValue.deadline;
      goal.priority = lastRevision.oldValue.priority;
      goal.updatedAt = Date.now();

      console.log(`[Refiner] Rolled back goal to previous revision`);
      return goal;
    }

    return null;
  }
}

// Usage
async function demoRefinement() {
  const refiner = new GoalRefiner();

  // Create and load a goal
  const goal = new Goal({
    title: 'Launch Mobile App',
    description: 'Launch a new mobile app to the app store',
    specific: 'Release version 1.0 with core features',
    measurable: { target: 100, unit: '%' },
    achievable: true,
    relevant: 'Company expansion',
    timeBound: { deadline: '2024-06-30', duration: 180 },
  });

  goal.updateProgress(30); // Only 30% after 60% of time
  refiner.loadGoal(goal);

  // Manual refinement
  console.log('\n--- Manual Refinement ---');
  await refiner.refineGoal(
    goal.id,
    {
      deadline: '2024-08-31',
    },
    RefinementReason.PROGRESS_SLOW,
  );

  // LLM-based suggestions
  console.log('\n--- LLM Suggestions ---');
  const suggestions = await refiner.suggestRefinements(
    goal.id,
    'User feedback indicates feature scope is too large',
  );
  console.log(suggestions);

  // Revision history
  console.log('\n--- Revision History ---');
  console.log(refiner.getRevisionHistory(goal.id));
}

demoRefinement();
```

### 4. Project Management with Goals (项目管理)

以下代码实现了基于智能体目标的项目管理系统：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Task Status
const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
};

// Project Task
class Task {
  constructor(config) {
    this.id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.title = config.title;
    this.description = config.description;
    this.status = TaskStatus.PENDING;
    this.assignee = config.assignee || null;
    this.priority = config.priority || Priority.MEDIUM;
    this.goalId = config.goalId || null;
    this.dependencies = config.dependencies || [];
    this.estimatedHours = config.estimatedHours || 0;
    this.actualHours = 0;
    this.subtasks = [];
    this.createdAt = Date.now();
    this.completedAt = null;
  }

  start() {
    this.status = TaskStatus.IN_PROGRESS;
  }

  complete() {
    this.status = TaskStatus.COMPLETED;
    this.completedAt = Date.now();
  }

  block() {
    this.status = TaskStatus.BLOCKED;
  }

  addSubtask(subtask) {
    this.subtasks.push({
      id: `subtask_${Date.now()}`,
      title: subtask,
      completed: false,
    });
  }

  completeSubtask(subtaskId) {
    const subtask = this.subtasks.find((s) => s.id === subtaskId);
    if (subtask) {
      subtask.completed = true;
    }
  }

  getProgress() {
    if (this.subtasks.length === 0) {
      return this.status === TaskStatus.COMPLETED ? 100 : 0;
    }
    const completed = this.subtasks.filter((s) => s.completed).length;
    return Math.round((completed / this.subtasks.length) * 100);
  }
}

// Project Manager with Goals
class ProjectManager {
  constructor() {
    this.goals = new GoalManager();
    this.tasks = new Map();
    this.resources = new Map();
  }

  // Create project with goals and tasks
  createProject(config) {
    const { goals, tasks } = config;

    // Create goals
    const createdGoals = goals.map((g) => this.goals.createGoal(g));

    // Create tasks linked to goals
    const createdTasks = tasks.map((t) => {
      const task = new Task({
        ...t,
        goalId: t.goalId || createdGoals[0]?.id,
      });
      this.tasks.set(task.id, task);
      return task;
    });

    console.log(
      `[Project] Created project with ${createdGoals.length} goals and ${createdTasks.length} tasks`,
    );
    return { goals: createdGoals, tasks: createdTasks };
  }

  // Get task by ID
  getTask(taskId) {
    return this.tasks.get(taskId);
  }

  // Get tasks by goal
  getTasksByGoal(goalId) {
    return Array.from(this.tasks.values()).filter((t) => t.goalId === goalId);
  }

  // Get task progress for a goal
  getGoalProgress(goalId) {
    const tasks = this.getTasksByGoal(goalId);
    if (tasks.length === 0) return 0;

    const totalProgress = tasks.reduce((sum, t) => sum + t.getProgress(), 0);
    return Math.round(totalProgress / tasks.length);
  }

  // Update goal progress based on tasks
  syncGoalProgress(goalId) {
    const tasks = this.getTasksByGoal(goalId);
    const progress = this.getGoalProgress(goalId);

    const goal = this.goals.getGoal(goalId);
    if (goal) {
      goal.updateProgress(progress);
    }

    return progress;
  }

  // Get project status
  getProjectStatus() {
    const allTasks = Array.from(this.tasks.values());
    const completed = allTasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const blocked = allTasks.filter((t) => t.status === TaskStatus.BLOCKED).length;
    const inProgress = allTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length;

    const allGoals = this.goals.getAllGoals();
    const goalsOnTrack = this.goals.getOnTrackGoals().length;

    return {
      tasks: {
        total: allTasks.length,
        completed,
        blocked,
        inProgress,
        completionRate: `${Math.round((completed / allTasks.length) * 100)}%`,
      },
      goals: {
        total: allGoals.length,
        onTrack: goalsOnTrack,
        atRisk: allGoals.length - goalsOnTrack,
      },
    };
  }

  // Identify blocked tasks
  getBlockedTasks() {
    return Array.from(this.tasks.values()).filter((t) => t.status === TaskStatus.BLOCKED);
  }

  // Find critical path
  getCriticalPath(goalId) {
    const tasks = this.getTasksByGoal(goalId);

    // Simple critical path: longest chain of dependent tasks
    const taskMap = new Map(tasks.map((t) => [t.id, t]));
    const inDegree = new Map();

    tasks.forEach((t) => {
      inDegree.set(t.id, t.dependencies.length);
    });

    const criticalPath = [];
    let current = tasks.find((t) => inDegree.get(t.id) === 0);

    while (current) {
      criticalPath.push(current);
      current.dependencies.forEach((depId) => {
        inDegree.set(depId, inDegree.get(depId) - 1);
      });
      current = tasks.find((t) => inDegree.get(t.id) === 0 && !criticalPath.includes(t));
    }

    return criticalPath;
  }

  // Generate project report
  async generateReport() {
    const status = this.getProjectStatus();
    const blocked = this.getBlockedTasks();

    const prompt = ChatPromptTemplate.fromTemplate(
      `Generate a project status report:

Task Status: {taskStatus}
Blocked Tasks: {blocked}

Goals On Track: {goalsOnTrack}
Goals At Risk: {goalsAtRisk}

Provide a summary and recommendations:`,
    );

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    return chain.invoke({
      taskStatus: JSON.stringify(status.tasks),
      blocked: blocked.map((t) => t.title).join(', ') || 'None',
      goalsOnTrack: status.goals.onTrack,
      goalsAtRisk: status.goals.atRisk,
    });
  }
}

// Usage
async function demoProject() {
  const project = new ProjectManager();

  // Create project
  const { goals, tasks } = project.createProject({
    goals: [
      {
        title: 'Launch MVP',
        description: 'Launch minimum viable product',
        specific: 'Complete core features and beta testing',
        measurable: { target: 100, unit: '%' },
        achievable: true,
        relevant: 'Business growth',
        timeBound: { deadline: '2024-12-31', duration: 180 },
        priority: Priority.HIGH,
        category: 'product',
      },
    ],
    tasks: [
      {
        title: 'Design UI/UX',
        description: 'Create user interface designs',
        priority: Priority.HIGH,
        estimatedHours: 40,
        subtasks: ['Wireframes', 'Visual design', 'Prototypes'],
      },
      {
        title: 'Backend Development',
        description: 'Build API and database',
        priority: Priority.HIGH,
        estimatedHours: 80,
        dependencies: [],
        subtasks: ['Database schema', 'API endpoints', 'Authentication'],
      },
      {
        title: 'Frontend Development',
        description: 'Build user interface',
        priority: Priority.HIGH,
        estimatedHours: 60,
        dependencies: ['task_1'], // Depends on Design
        subtasks: ['Components', 'State management', 'Integration'],
      },
      {
        title: 'Testing',
        description: 'Test the application',
        priority: Priority.MEDIUM,
        estimatedHours: 30,
        dependencies: ['task_2', 'task_3'],
        subtasks: ['Unit tests', 'Integration tests', 'User testing'],
      },
    ],
  });

  // Simulate task progress
  const task1 = project.getTask(tasks[0].id);
  task1.start();
  task1.completeSubtask(task1.subtasks[0].id);
  task1.complete();

  // Sync progress to goal
  project.syncGoalProgress(goals[0].id);

  // Get project status
  console.log('\n--- Project Status ---');
  console.log(project.getProjectStatus());

  // Get blocked tasks
  console.log('\n--- Blocked Tasks ---');
  console.log(project.getBlockedTasks());

  // Generate report
  console.log('\n--- Project Report ---');
  const report = await project.generateReport();
  console.log(report);
}

demoProject();
```

### 5. Personal Productivity Tracker (个人生产力追踪)

以下代码实现了个人生产力目标追踪系统：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.7 });

// Habit Types
const HabitType = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  ONE_TIME: 'one_time',
};

// Habit Tracker
class Habit {
  constructor(config) {
    this.id = `habit_${Date.now()}`;
    this.name = config.name;
    this.type = config.type || HabitType.DAILY;
    this.target = config.target || 1;
    this.unit = config.unit || 'times';
    this.streak = 0;
    this.longestStreak = 0;
    this.completions = [];
    this.createdAt = Date.now();
  }

  // Log completion
  complete(date = new Date()) {
    const completionDate = date.toISOString().split('T')[0];

    // Check if already completed today
    const alreadyCompleted = this.completions.some((c) => c.date === completionDate);

    if (!alreadyCompleted) {
      this.completions.push({
        date: completionDate,
        timestamp: Date.now(),
      });

      // Update streak
      this.updateStreak();
    }
  }

  // Update streak
  updateStreak() {
    const sortedDates = this.completions
      .map((c) => c.date)
      .sort()
      .reverse();

    if (sortedDates.length === 0) {
      this.streak = 0;
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
      // Count consecutive days
      let currentStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diff = (prevDate - currDate) / 86400000;

        if (diff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
      this.streak = currentStreak;
      this.longestStreak = Math.max(this.longestStreak, this.streak);
    } else {
      this.streak = 0;
    }
  }

  // Get completion rate
  getCompletionRate(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const relevantCompletions = this.completions.filter((c) => new Date(c.date) >= startDate);

    return (relevantCompletions.length / days) * 100;
  }

  // Get stats
  getStats() {
    return {
      name: this.name,
      currentStreak: this.streak,
      longestStreak: this.longestStreak,
      totalCompletions: this.completions.length,
      completionRate: `${this.getCompletionRate().toFixed(1)}%`,
    };
  }
}

// Personal Productivity System
class ProductivityTracker {
  constructor() {
    this.habits = new Map();
    this.goals = new GoalManager();
    this.dailyLogs = [];
  }

  // Add habit
  addHabit(config) {
    const habit = new Habit(config);
    this.habits.set(habit.id, habit);
    console.log(`[Tracker] Added habit: ${habit.name}`);
    return habit;
  }

  // Complete habit
  completeHabit(habitId, date = new Date()) {
    const habit = this.habits.get(habitId);
    if (habit) {
      habit.complete(date);
      this.logActivity('habit_completed', { habitId, date: date.toISOString() });
    }
  }

  // Create personal goal
  createGoal(config) {
    return this.goals.createGoal({
      ...config,
      category: 'personal',
    });
  }

  // Log daily activity
  logActivity(type, data) {
    this.dailyLogs.push({
      type,
      data,
      timestamp: Date.now(),
    });
  }

  // Get today's summary
  getTodaySummary() {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = this.dailyLogs.filter(
      (l) => new Date(l.timestamp).toISOString().split('T')[0] === today,
    );

    const habitsCompleted = todayLogs.filter((l) => l.type === 'habit_completed').length;
    const totalHabits = this.habits.size;

    return {
      date: today,
      habitsCompleted,
      totalHabits,
      completionRate: `${((habitsCompleted / totalHabits) * 100).toFixed(1)}%`,
      activities: todayLogs.length,
    };
  }

  // Get weekly progress
  getWeeklyProgress() {
    const progress = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayLogs = this.dailyLogs.filter(
        (l) => new Date(l.timestamp).toISOString().split('T')[0] === dateStr,
      );

      const habitsCompleted = dayLogs.filter((l) => l.type === 'habit_completed').length;

      progress.push({
        date: dateStr,
        habitsCompleted,
        completionRate: `${((habitsCompleted / this.habits.size) * 100).toFixed(1)}%`,
      });
    }

    return progress;
  }

  // Get habit stats
  getHabitStats(habitId) {
    const habit = this.habits.get(habitId);
    return habit ? habit.getStats() : null;
  }

  // Get all habit stats
  getAllHabitStats() {
    return Array.from(this.habits.values()).map((h) => h.getStats());
  }

  // Generate productivity insights
  async generateInsights() {
    const summary = this.getTodaySummary();
    const weeklyProgress = this.getWeeklyProgress();
    const habitStats = this.getAllHabitStats();

    const bestHabit = habitStats.reduce((best, current) =>
      current.currentStreak > best.currentStreak ? current : best,
    );

    const prompt = ChatPromptTemplate.fromTemplate(
      `Generate productivity insights:

Today's Summary: {summary}
Weekly Progress: {weeklyProgress}
Best Performing Habit: {bestHabit}

Provide insights and recommendations:`,
    );

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    return chain.invoke({
      summary: JSON.stringify(summary),
      weeklyProgress: JSON.stringify(weeklyProgress),
      bestHabit: JSON.stringify(bestHabit),
    });
  }

  // Get achievement badges
  getBadges() {
    const badges = [];
    const habits = Array.from(this.habits.values());

    habits.forEach((habit) => {
      if (habit.streak >= 7) badges.push({ name: 'Week Warrior', habit: habit.name });
      if (habit.streak >= 30) badges.push({ name: 'Month Master', habit: habit.name });
      if (habit.longestStreak >= 100) badges.push({ name: 'Century Club', habit: habit.name });
    });

    return badges;
  }
}

// Usage
async function demoProductivity() {
  const tracker = new ProductivityTracker();

  // Add habits
  const habit1 = tracker.addHabit({
    name: 'Morning Exercise',
    type: HabitType.DAILY,
    target: 1,
    unit: 'session',
  });

  const habit2 = tracker.addHabit({
    name: 'Read 30 minutes',
    type: HabitType.DAILY,
    target: 1,
    unit: 'times',
  });

  const habit3 = tracker.addHabit({
    name: 'Learn new skill',
    type: HabitType.WEEKLY,
    target: 3,
    unit: 'times',
  });

  // Create personal goal
  tracker.createGoal({
    title: 'Get Fit in 2024',
    description: 'Improve physical fitness through daily exercise',
    specific: 'Exercise for 30 minutes daily',
    measurable: { target: 365, unit: 'days' },
    achievable: true,
    relevant: 'Health and wellbeing',
    timeBound: { deadline: '2024-12-31', duration: 365 },
    priority: Priority.HIGH,
    category: 'health',
  });

  // Simulate completions
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    tracker.completeHabit(habit1.id, date);
  }

  tracker.completeHabit(habit2.id);

  // Get summaries
  console.log("\n--- Today's Summary ---");
  console.log(tracker.getTodaySummary());

  console.log('\n--- Weekly Progress ---');
  console.log(tracker.getWeeklyProgress());

  console.log('\n--- Habit Stats ---');
  console.log(tracker.getAllHabitStats());

  console.log('\n--- Badges ---');
  console.log(tracker.getBadges());

  // Generate insights
  console.log('\n--- AI Insights ---');
  const insights = await tracker.generateInsights();
  console.log(insights);
}

demoProductivity();
```

将“目标设定与监控”模式接入投资智能体，意味着要将其从一个只能被动回答“某只股票多少钱”的反应式系统，转变为一个能够**主动管理投资组合、具有明确方向感的驱动型实体**。

### 投资智能体

根据文档中关于自动交易机器人和智能体架构的指南，接入该模式需要遵循以下四个核心步骤：

#### 1. 设定 SMART 目标 (Goal Setting)

智能体不能接受“帮我赚钱”这样模糊的指令。必须明确设定**SMART（具体的、可衡量的、可实现的、相关的、有时限的）目标**。

- **投资场景设定**：在系统指令中，为智能体设定一个具体的高级目标，例如：“在保持最大回撤（风险承受能力）不超过 10% 的前提下，本年度最大化投资组合的收益率，目标年化达到 8%”。
- **在框架中的实现**：如果使用 Google ADK 等框架，这些总体目标通常会直接硬编码到**智能体的核心系统指令（Instructions）**中，作为其所有规划和行动的最终基准。

#### 2. 建立实时监控机制 (Monitoring)

目标设定后，智能体必须有手段来知道自己是否正在走向成功。监控涉及持续观察智能体的操作、环境状态以及外部工具的输出。

- **投资场景监控指标**：
  - **市场数据**：持续调用 API 获取实时的股票报价、宏观经济数据或相关新闻。
  - **投资组合价值**：监控当前持仓的实时总市值。
  - **风险指标**：实时计算当前的波动率、仓位集中度以及是否接近 10% 的回撤底线。
- **在框架中的实现**：这种监控通常通过**状态管理（State Management）和定期的工具交互**来完成。系统会在内存中持续更新当前的资产状态，并与设定的目标基准进行对比。

#### 3. 构建反馈循环与行动策略 (Feedback Loops & Actions)

这是该模式发挥作用的关键：智能体需要根据监控到的数据，评估自身表现并决定下一步的行动。

- **顺境执行**：当监控数据显示当前市场条件与策略一致且风险可控时，智能体会主动执行买入或卖出的交易指令，以推进收益目标的实现。
- **逆境纠偏与升级（Escalation）**：如果监控机制发现投资组合偏离了成功路径，智能体必须利用反馈循环来适应和修改计划。例如，如果监控到“风险阈值被突破”（回撤达到 9%），智能体必须立即触发纠正措施调整策略（如清仓高风险股票转入债券），或者在问题极其严重时自动将控制权升级（Escalate）给人类基金经理。

#### 4. 评估与自我判断 (Self-Assessment)

高级的“目标设定与监控”还会结合大模型的评判能力。

- 在投资智能体执行了一系列调仓操作后，系统可以生成一个内部的反思步骤，让 AI 审查自己最近的交易记录，并输出“True/False”来判定这套组合拳是否真正满足了最初设定的“风险控制”目标。如果没有满足，则进入下一次迭代重新规划。

**总结**：
接入该模式的核心在于**闭环**。您需要通过指令赋予投资智能体**明确的财务指标（目标）**，给它配备读取行情的**数据探针（监控）**，并设计一套当亏损或盈利触发阈值时能自动**调整仓位（反馈适应）**的逻辑。这样，它就成了一个真正能独立应对动态金融市场的自主系统。

### 投资智能体代码示例

以下代码实现了投资智能体的目标设定与监控系统：

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser, JsonOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({ temperature: 0.3 });

// ============================================
// 1. SMART Goal Setting (SMART 目标设定)
// ============================================

// Investment Goal Types
const InvestmentGoalType = {
  RETURN: 'return',           // 收益率目标
  RISK: 'risk',               // 风险控制目标
  LIQUIDITY: 'liquidity',      // 流动性目标
  DIVIDEND: 'dividend',        // 股息目标
};

// Investment Goal
class InvestmentGoal {
  constructor(config) {
    this.id = `invest_goal_${Date.now()}`;
    this.name = config.name;
    this.type = config.type;

    // SMART criteria for investments
    this.specific = config.specific;           // 具体描述
    this.targetReturn = config.targetReturn || 0;      // 目标收益率 (e.g., 0.08 for 8%)
    this.maxDrawdown = config.maxDrawdown || 0;         // 最大回撤容忍度 (e.g., 0.10 for 10%)
    this.timeHorizon = config.timeHorizon;     // 投资期限 (days)
    this.riskLevel = config.riskLevel || 'moderate'; // risk appetite

    // Tracking
    this.createdAt = Date.now();
    this.startingValue = config.startingValue || 0;
    this.currentValue = this.startingValue;
    this.isActive = true;
  }

  // Calculate current return
  getCurrentReturn() {
    if (this.startingValue === 0) return 0;
    return (this.currentValue - this.startingValue) / this.startingValue;
  }

  // Check if within risk bounds
  isWithinRiskBounds(currentDrawdown) {
    return currentDrawdown <= this.maxDrawdown;
  }

  // Get goal status
  getStatus() {
    const currentReturn = this.getCurrentReturn();
    const timeElapsed = Date.now() - this.createdAt;
    const timeProgress = timeElapsed / (this.timeHorizon * 24 * 60 * 60 * 1000);

    // Expected progress based on time
    const expectedReturn = this.targetReturn * Math.min(1, timeProgress);
    const isOnTrack = currentReturn >= expectedReturn * 0.8; // Allow 20% buffer

    return {
      name: this.name,
      targetReturn: `${(this.targetReturn * 100).toFixed(1)}%`,
      currentReturn: `${(currentReturn * 100).toFixed(2)}%`,
      maxDrawdown: `${(this.maxDrawdown * 100).toFixed(1)}%`,
      timeProgress: `${(timeProgress * 100).toFixed(1)}%`,
      isOnTrack,
      status: isOnTrack ? 'on_track' : 'behind_schedule',
    };
  }
}

// Investment Goal Manager
class InvestmentGoalManager {
  constructor() {
    this.goals = new Map();
    this.listeners = [];
  }

  // Create SMART investment goal
  createGoal(config) {
    const goal = new InvestmentGoal({
      name: config.name,
      type: config.type,
      specific: config.specific,
      targetReturn: config.annualReturn / 100,      // Convert to decimal
      maxDrawdown: config.maxDrawdown / 100,
      timeHorizon: config.timeHorizonDays,
      startingValue: config.portfolioValue,
    });

    this.goals.set(goal.id, goal);
    console.log(`[InvestmentGoal] Created SMART goal: ${goal.name}`);
    console.log(`  - Target Annual Return: ${config.annualReturn}%`);
    console.log(`  - Max Drawdown: ${config.maxDrawdown}%`);
    console.log(`  - Time Horizon: ${config.timeHorizonDays} days`);

    return goal;
  }

  // Update portfolio value
  updatePortfolioValue(goalId, newValue) {
    const goal = this.goals.get(goalId);
    if (goal) {
      goal.currentValue = newValue;
    }
  }

  // Get goal by ID
  getGoal(goalId) {
    return this.goals.get(goalId);
  }

  // Get all active goals
  getActiveGoals() {
    return Array.from(this.goals.values()).filter((g) => g.isActive);
  }

  // Subscribe to goal changes
  onGoalChange(callback) {
    this.listeners.push(callback);
  }

  // Notify listeners
  notify(event, data) {
    this.listeners.forEach((cb) => cb(event, data));
  }
}

// Usage
const goalManager = InvestmentGoalManager();

// Create SMART investment goal
const investmentGoal = goalManager.createGoal({
  name: '2024 Portfolio Growth',
  type: InvestmentGoalType.RETURN,
  specific: '在保持最大回撤不超过10%的前提下，本年度最大化投资组合的收益率',
  annualReturn: 8,           // 8% target
  maxDrawdown: 10,           // 10% max drawdown
  timeHorizonDays: 365,
  portfolioValue: 100000,   // Starting value: 100万
});

// Simulate portfolio updates
goalManager.updatePortfolioValue(investmentGoal.id, 102000); // 2% gain
console.log('\n--- Goal Status ---');
console.log(investmentGoal.getStatus());
```

```javascript
// ============================================
// 2. Real-time Monitoring (实时监控)
// ============================================

// Market Data Provider (simulated)
class MarketDataProvider {
  constructor() {
    this.subscribers = new Map();
  }

  // Get real-time quote (simulated)
  async getQuote(symbol) {
    // In production, this would call real market data API
    const mockPrice = 150 + Math.random() * 50;
    return {
      symbol,
      price: mockPrice,
      timestamp: Date.now(),
      change: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 10000000),
    };
  }

  // Get portfolio positions
  async getPortfolioPositions(portfolioId) {
    // Mock positions
    return [
      { symbol: 'AAPL', shares: 100, avgCost: 145 },
      { symbol: 'GOOGL', shares: 50, avgCost: 2800 },
      { symbol: 'MSFT', shares: 80, avgCost: 310 },
    ];
  }
}

// Risk Metrics Calculator
class RiskMetricsCalculator {
  // Calculate portfolio value
  calculatePortfolioValue(positions, quotes) {
    let totalValue = 0;
    const positionValues = [];

    for (const pos of positions) {
      const quote = quotes[pos.symbol];
      if (quote) {
        const value = pos.shares * quote.price;
        positionValues.push({ ...pos, value, currentPrice: quote.price });
        totalValue += value;
      }
    }

    return { totalValue, positions: positionValues };
  }

  // Calculate drawdown from peak
  calculateDrawdown(currentValue, peakValue) {
    if (peakValue === 0) return 0;
    return (peakValue - currentValue) / peakValue;
  }

  // Calculate position concentration
  calculateConcentration(positions) {
    const totalValue = positions.reduce((sum, p) => sum + p.value, 0);
    return positions.map((p) => ({
      symbol: p.symbol,
      concentration: (p.value / totalValue) * 100,
    }));
  }

  // Calculate portfolio volatility
  calculateVolatility(positions, historicalData) {
    // Simplified volatility calculation
    // In production, would use actual historical returns
    return Math.random() * 0.21; //  + 0.10-30% annualized
  }
}

// Real-time Portfolio Monitor
class PortfolioMonitor {
  constructor(config) {
    this.goalManager = config.goalManager;
    this.marketData = new MarketDataProvider();
    this.riskCalculator = new RiskMetricsCalculator();
    this.checkInterval = config.checkIntervalMs || 60000; // Default 1 minute
    this.monitorInterval = null;
    this.peakValue = config.startingValue || 0;
    this.alertThresholds = config.alertThresholds || {
      drawdownWarning: 0.07,    // 7% drawdown warning
      drawdownCritical: 0.09,   // 9% drawdown critical
      concentrationWarning: 0.30, // 30% single position warning
    };
    this.alerts = [];
  }

  // Start monitoring
  start() {
    console.log('[Monitor] Starting portfolio monitoring...');
    this.monitorInterval = setInterval(() => this.check(), this.checkInterval);
    this.check(); // Initial check
  }

  // Stop monitoring
  stop() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      console.log('[Monitor] Stopped monitoring');
    }
  }

  // Check portfolio status
  async check() {
    try {
      // Get market data
      const positions = await this.marketData.getPortfolioPositions('main');
      const quotes = {};
      for (const pos of positions) {
        quotes[pos.symbol] = await this.marketData.getQuote(pos.symbol);
      }

      // Calculate metrics
      const portfolio = this.riskCalculator.calculatePortfolioValue(positions, quotes);
      const drawdown = this.riskCalculator.calculateDrawdown(
        portfolio.totalValue,
        this.peakValue,
      );
      const concentration = this.riskCalculator.calculateConcentration(portfolio.positions);

      // Update peak value
      if (portfolio.totalValue > this.peakValue) {
        this.peakValue = portfolio.totalValue;
      }

      // Check alerts
      this.checkRiskAlerts(drawdown, concentration, portfolio.totalValue);

      // Log status
      console.log(`\n[Monitor] Portfolio Value: $${portfolio.totalValue.toFixed(2)}`);
      console.log(`[Monitor] Peak Value: $${this.peakValue.toFixed(2)}`);
      console.log(`[Monitor] Current Drawdown: ${(drawdown * 100).toFixed(2)}%`);

      return {
        portfolioValue: portfolio.totalValue,
        drawdown,
        concentration,
        positions: portfolio.positions,
        alerts: this.alerts,
      };
    } catch (error) {
      console.error('[Monitor] Check failed:', error);
    }
  }

  // Check for risk alerts
  checkRiskAlerts(drawdown, concentration, portfolioValue) {
    // Drawdown alerts
    if (drawdown >= this.alertThresholds.drawdownCritical) {
      this.addAlert('critical', 'DRAWDOWN_CRITICAL', `Drawdown at ${(drawdown * 100).toFixed(1)}% - near limit`);
    } else if (drawdown >= this.alertThresholds.drawdownWarning) {
      this.addAlert('warning', 'DRAWDOWN_WARNING', `Drawdown at ${(drawdown * 100).toFixed(1)}% - approaching limit`);
    }

    // Concentration alerts
    for (const pos of concentration) {
      if (pos.concentration >= this.alertThresholds.concentrationWarning * 100) {
        this.addAlert('warning', 'CONCENTRATION_WARNING', `${pos.symbol} at ${pos.concentration.toFixed(1)}% concentration`);
      }
    }
  }

  // Add alert
  addAlert(severity, type, message) {
    const alert = { severity, type, message, timestamp: Date.now() };
    this.alerts.push(alert);
    console.log(`[Monitor] ALERT [${severity.toUpperCase()}]: ${message}`);
  }

  // Get recent alerts
  getAlerts(since = null) {
    if (!since) return this.alerts;
    return this.alerts.filter((a) => a.timestamp > since);
  }

  // Clear alerts
  clearAlerts() {
    this.alerts = [];
  }
}

// Usage
const monitor = new PortfolioMonitor({
  goalManager,
  startingValue: 100000,
  checkIntervalMs: 60000,
});

// Start monitoring
monitor.start();

// Simulate after some time
setTimeout(() => {
  console.log('\n--- Alerts ---');
  console.log(monitor.getAlerts());
  monitor.stop();
}, 5000);
```

```javascript
// ============================================
// 3. Feedback Loops & Actions (反馈循环与行动)
// ============================================

// Action Types
const ActionType = {
  REBALANCE: 'rebalance',           // 调仓
  ESCALATE: 'escalate',              // 升级给人类
  HEDGE: 'hedge',                    // 对冲
  STOP_LOSS: 'stop_loss',            // 止损
  TAKE_PROFIT: 'take_profit',        // 止盈
  ADD_POSITION: 'add_position',      // 加仓
  REDUCE_POSITION: 'reduce_position', // 减仓
};

// Trade Action
class TradeAction {
  constructor(type, reason, details) {
    this.id = `action_${Date.now()}`;
    this.type = type;
    this.reason = reason;
    this.details = details;
    this.status = 'pending';
    this.createdAt = Date.now();
    this.executedAt = null;
  }

  execute() {
    this.status = 'executed';
    this.executedAt = Date.now();
    console.log(`[Action] Executed: ${this.type} - ${this.reason}`);
  }

  cancel() {
    this.status = 'cancelled';
    console.log(`[Action] Cancelled: ${this.type}`);
  }
}

// Rebalancing Strategy
class RebalancingStrategy {
  constructor(config) {
    this.targetAllocations = config.targetAllocations || {
      stocks: 0.60,
      bonds: 0.30,
      cash: 0.10,
    };
    this.threshold = config.rebalanceThreshold || 0.05; // 5% deviation trigger
  }

  // Calculate current allocation
  calculateCurrentAllocation(positions, totalValue) {
    const allocation = {};
    for (const pos of positions) {
      const value = pos.value || (pos.shares * pos.currentPrice);
      allocation[pos.assetClass] = (value / totalValue);
    }
    return allocation;
  }

  // Determine if rebalancing needed
  needsRebalancing(currentAllocation) {
    for (const [asset, target] of Object.entries(this.targetAllocations)) {
      const current = currentAllocation[asset] || 0;
      if (Math.abs(current - target) > this.threshold) {
        return true;
      }
    }
    return false;
  }

  // Generate rebalancing actions
  generateActions(currentAllocation, totalValue) {
    const actions = [];

    for (const [asset, target] of Object.entries(this.targetAllocations)) {
      const current = currentAllocation[asset] || 0;
      const diff = target - current;
      const targetValue = totalValue * target;
      const currentValue = totalValue * current;

      if (Math.abs(diff) > this.threshold) {
        const actionType = diff > 0 ? ActionType.ADD_POSITION : ActionType.REDUCE_POSITION;
        actions.push(new TradeAction(
          actionType,
          `Rebalance ${asset}: ${(current * 100).toFixed(1)}% -> ${(target * 100).toFixed(1)}%`,
          { asset, targetValue, currentValue, diff },
        ));
      }
    }

    return actions;
  }
}

// Feedback Loop Controller
class FeedbackLoopController {
  constructor(config) {
    this.monitor = config.monitor;
    this.goalManager = config.goalManager;
    this.strategy = new RebalancingStrategy(config.strategy || {});
    this.actions = [];
    this.autoExecute = config.autoExecute || false;
    this.escalationHandler = config.escalationHandler || null;
  }

  // Process feedback loop
  async processFeedback() {
    const status = await this.monitor.check();
    const goals = this.goalManager.getActiveGoals();

    const actions = [];

    for (const goal of goals) {
      // Check goal achievement
      const goalStatus = goal.getStatus();

      // If behind schedule, consider corrective actions
      if (!goalStatus.isOnTrack) {
        const correctiveActions = await this.suggestCorrectiveActions(goal, status);
        actions.push(...correctiveActions);
      }

      // Check risk limits
      if (status.drawdown >= goal.maxDrawdown * 0.9) {
        // Nearing drawdown limit - escalate or reduce risk
        if (status.drawdown >= goal.maxDrawdown) {
          // Exceeded - must escalate
          if (this.escalationHandler) {
            await this.escalationHandler({
              type: 'DRAWDOWN_EXCEEDED',
              current: status.drawdown,
              limit: goal.maxDrawdown,
              goal: goal.name,
            });
          }
        } else {
          // Approaching - reduce exposure
          actions.push(new TradeAction(
            ActionType.REDUCE_POSITION,
            `Approaching drawdown limit: ${(status.drawdown * 100).toFixed(1)}%`,
            { reductionPercent: 0.2 },
          ));
        }
      }

      // Check for rebalancing
      const needsRebalance = this.strategy.needsRebalancing(status.concentration);
      if (needsRebalance) {
        const rebalanceActions = this.strategy.generateActions(
          status.concentration,
          status.portfolioValue,
        );
        actions.push(...rebalanceActions);
      }
    }

    // Execute actions
    if (this.autoExecute && actions.length > 0) {
      for (const action of actions) {
        action.execute();
        this.actions.push(action);
      }
    }

    return actions;
  }

  // Suggest corrective actions using LLM
  async suggestCorrectiveActions(goal, status) {
    const prompt = ChatPromptTemplate.fromTemplate(
      `Analyze this investment goal status and suggest corrective actions:

Goal: {goalName}
Target Return: {targetReturn}%
Current Return: {currentReturn}%
Status: {goalStatus}

Portfolio Drawdown: {drawdown}%
Portfolio Value: {value}

Suggest 1-3 specific actions to get back on track. Respond in JSON array format:
[{"action": "rebalance/hedge/reduce/add", "reason": "...", "details": {...}}]`,
    );

    const chain = prompt.pipe(llm).pipe(new JsonOutputParser());

    try {
      const response = await chain.invoke({
        goalName: goal.name,
        targetReturn: (goal.targetReturn * 100).toFixed(1),
        currentReturn: (goal.getCurrentReturn() * 100).toFixed(1),
        goalStatus: goal.getStatus().status,
        drawdown: (status.drawdown * 100).toFixed(1),
        value: status.portfolioValue.toFixed(2),
      });

      return response.map((r) => new TradeAction(r.action, r.reason, r.details));
    } catch (error) {
      console.log('[Feedback] LLM suggestion failed, using defaults');
      return [];
    }
  }

  // Get action history
  getActionHistory() {
    return this.actions;
  }
}

// Usage
const feedbackController = new FeedbackLoopController({
  monitor,
  goalManager,
  strategy: {
    targetAllocations: { stocks: 0.60, bonds: 0.30, cash: 0.10 },
    rebalanceThreshold: 0.05,
  },
  autoExecute: false,
  escalationHandler: async (alert) => {
    console.log(`[ESCALATION] ${alert.type} - Manual intervention required!`);
    console.log(`  Goal: ${alert.goal}`);
    console.log(`  Current: ${(alert.current * 100).toFixed(1)}%`);
    console.log(`  Limit: ${(alert.limit * 100).toFixed(1)}%`);
  },
});

// Process feedback
setTimeout(async () => {
  console.log('\n--- Processing Feedback Loop ---');
  const actions = await feedbackController.processFeedback();
  console.log(`Suggested ${actions.length} actions`);
  actions.forEach((a) => console.log(`  - ${a.type}: ${a.reason}`));
  monitor.stop();
}, 6000);
```

```javascript
// ============================================
// 4. Self-Assessment (自我评估)
// ============================================

// Assessment Criteria
const AssessmentCriterion = {
  RISK_COMPLIANCE: 'risk_compliance',     // 风险合规
  RETURN_ACHIEVEMENT: 'return_achievement', // 收益达成
  PROCESS_DISCIPLINE: 'process_discipline', // 流程纪律
  DECISION_QUALITY: 'decision_quality',   // 决策质量
};

// Self-Assessment Result
class AssessmentResult {
  constructor(goalId) {
    this.goalId = goalId;
    this.criteria = {};
    this.overallScore = 0;
    this.recommendations = [];
    this.timestamp = Date.now();
  }

  addCriterion(criterion, score, evidence) {
    this.criteria[criterion] = { score, evidence };
  }

  calculateOverall() {
    const scores = Object.values(this.criteria).map((c) => c.score);
    this.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  }
}

// AI Self-Assessment Agent
class SelfAssessmentAgent {
  constructor(config) {
    this.llm = config.llm || llm;
    this.actionHistory = [];
    this.goalManager = config.goalManager;
  }

  // Record action for assessment
  recordAction(action) {
    this.actionHistory.push(action);
  }

  // Assess goal achievement
  async assessGoal(goalId) {
    const goal = this.goalManager.getGoal(goalId);
    if (!goal) return null;

    const result = new AssessmentResult(goalId);

    // 1. Assess Risk Compliance
    const riskScore = await this.assessRiskCompliance(goal);
    result.addCriterion(
      AssessmentCriterion.RISK_COMPLIANCE,
      riskScore.score,
      riskScore.evidence,
    );

    // 2. Assess Return Achievement
    const returnScore = await this.assessReturnAchievement(goal);
    result.addCriterion(
      AssessmentCriterion.RETURN_ACHIEVEMENT,
      returnScore.score,
      returnScore.evidence,
    );

    // 3. Assess Process Discipline
    const processScore = await this.assessProcessDiscipline(goal);
    result.addCriterion(
      AssessmentCriterion.PROCESS_DISCIPLINE,
      processScore.score,
      processScore.evidence,
    );

    // 4. Assess Decision Quality (using LLM)
    const decisionScore = await this.assessDecisionQuality(goal);
    result.addCriterion(
      AssessmentCriterion.DECISION_QUALITY,
      decisionScore.score,
      decisionScore.evidence,
    );

    // Calculate overall
    result.calculateOverall();

    // Generate recommendations
    result.recommendations = await this.generateRecommendations(goal, result);

    return result;
  }

  // Assess risk compliance
  async assessRiskCompliance(goal) {
    const currentDrawdown = (goal.startingValue - goal.currentValue) / goal.startingValue;
    const maxAllowed = goal.maxDrawdown;

    let score = 100;
    let evidence = '';

    if (currentDrawdown > maxAllowed) {
      score = 0;
      evidence = `Exceeded max drawdown: ${(currentDrawdown * 100).toFixed(1)}% > ${(maxAllowed * 100).toFixed(1)}%`;
    } else if (currentDrawdown > maxAllowed * 0.8) {
      score = 50;
      evidence = `Approaching limit: ${(currentDrawdown * 100).toFixed(1)}% of ${(maxAllowed * 100).toFixed(1)}%`;
    } else {
      evidence = `Within limits: ${(currentDrawdown * 100).toFixed(1)}% of ${(maxAllowed * 100).toFixed(1)}% allowed`;
    }

    return { score, evidence };
  }

  // Assess return achievement
  async assessReturnAchievement(goal) {
    const currentReturn = goal.getCurrentReturn();
    const targetReturn = goal.targetReturn;
    const timeElapsed = Date.now() - goal.createdAt;
    const totalTime = goal.timeHorizon * 24 * 60 * 60 * 1000;
    const expectedReturn = targetReturn * (timeElapsed / totalTime);

    let score = 0;
    let evidence = '';

    if (expectedReturn === 0) {
      score = 100;
      evidence = 'Goal just started';
    } else {
      const achievementRatio = currentReturn / expectedReturn;
      score = Math.min(100, achievementRatio * 100);
      evidence = `Current: ${(currentReturn * 100).toFixed(1)}%, Expected: ${(expectedReturn * 100).toFixed(1)}%`;
    }

    return { score, evidence };
  }

  // Assess process discipline
  async assessProcessDiscipline(goal) {
    // Check if regular monitoring occurred
    const recentActions = this.actionHistory.filter(
      (a) => Date.now() - a.createdAt < 7 * 24 * 60 * 60 * 1000, // Last 7 days
    );

    let score = 100;
    let evidence = '';

    if (recentActions.length === 0) {
      score = 50;
      evidence = 'No recent actions recorded';
    } else {
      evidence = `${recentActions.length} actions in last 7 days`;
    }

    return { score, evidence };
  }

  // Assess decision quality using LLM
  async assessDecisionQuality(goal) {
    const recentActions = this.actionHistory.slice(-10);

    const prompt = ChatPromptTemplate.fromTemplate(
      `Assess the quality of recent trading decisions for this investment goal:

Goal: {goalName}
Target Return: {target}%
Max Drawdown: {maxDrawdown}%

Recent Actions:
{actions}

Rate the decision quality from 0-100 and explain why.
Respond in JSON: {"score": number, "reasoning": "..."}`,
    );

    const chain = prompt.pipe(llm).pipe(new JsonOutputParser());

    try {
      const response = await chain.invoke({
        goalName: goal.name,
        target: (goal.targetReturn * 100).toFixed(1),
        maxDrawdown: (goal.maxDrawdown * 100).toFixed(1),
        actions: JSON.stringify(recentActions.map((a) => ({
          type: a.type,
          reason: a.reason,
          status: a.status,
        }))),
      });

      return { score: response.score, evidence: response.reasoning };
    } catch (error) {
      return { score: 75, evidence: 'Unable to assess - using default score' };
    }
  }

  // Generate recommendations
  async generateRecommendations(goal, result) {
    if (result.overallScore >= 80) {
      return ['Continue current strategy - performing well'];
    }

    const prompt = ChatPromptTemplate.fromTemplate(
      `Based on this self-assessment, suggest specific improvements:

Goal: {goalName}
Overall Score: {score}/100

Criteria Scores:
{criteria}

Provide 3 specific recommendations to improve performance.`,
    );

    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());

    try {
      const response = await chain.invoke({
        goalName: goal.name,
        score: result.overallScore.toFixed(1),
        criteria: Object.entries(result.criteria)
          .map(([k, v]) => `${k}: ${v.score}/100 - ${v.evidence}`)
          .join('\n'),
      });

      return response.split('\n').filter((l) => l.trim());
    } catch (error) {
      return ['Review risk management', 'Consider rebalancing', 'Consult with advisor'];
    }
  }
}

// Usage
const assessmentAgent = new SelfAssessmentAgent({
  goalManager,
});

// Record some actions for assessment
assessmentAgent.recordAction(new TradeAction(ActionType.REDUCE_POSITION, 'Risk management', { symbol: 'AAPL', percent: 10 }));
assessmentAgent.recordAction(new TradeAction(ActionType.HEDGE, 'Portfolio hedge', { strategy: 'protective_put' }));

// Run assessment
setTimeout(async () => {
  console.log('\n--- Running Self-Assessment ---');
  const result = await assessmentAgent.assessGoal(investmentGoal.id);

  console.log(`\nOverall Score: ${result.overallScore.toFixed(1)}/100`);
  console.log('\nCriteria:');
  for (const [criterion, data] of Object.entries(result.criteria)) {
    console.log(`  ${criterion}: ${data.score.toFixed(1)} - ${data.evidence}`);
  }

  console.log('\nRecommendations:');
  result.recommendations.forEach((r) => console.log(`  - ${r}`));

  monitor.stop();
}, 7000);
```

## 社区热议与实践分享

目标设定与监控模式是当前 AI 智能体领域讨论最为活跃的话题之一。从学术研究到开源项目，从科技巨头到独立开发者，社区对这一模式的理解和实践在 2024-2025 年间取得了重大进展。以下是来自社区的关键洞察和讨论。

### 奠基性观点：智能体的核心公式

**Lilian Weng**（OpenAI 研究员）在其广泛引用的博文中提出了一个简洁的智能体定义公式：

> "Agent = LLM + memory + planning skills + tool use"
>
> -- [Lilian Weng (@lilianweng), X/Twitter](https://x.com/lilianweng/status/1673535600690102273)

这一公式将"规划能力"（planning）置于智能体架构的核心位置，明确了目标分解和进度监控是智能体区别于普通 LLM 的关键特征。

**Swyx**（Latent Space 创始人、AI Engineer 大会发起人）进一步简化了这一定义：

> "agent = llm + memory + planning + tools + while loop"
>
> -- [Swyx (@swyx), X/Twitter](https://x.com/swyx)

Swyx 强调了"while loop"（循环）的重要性——真正的智能体不是一次性生成结果，而是在持续的循环中设定目标、执行行动、评估结果、调整策略。这正是目标设定与监控模式的核心思想。

### Andrew Ng 的四大智能体设计模式

**Andrew Ng**（DeepLearning.AI 创始人）提出的四大智能体设计模式中，"规划"（Planning）模式与目标设定和监控直接相关：

> "Instead of having an LLM generate its final output directly, an agentic workflow prompts the LLM multiple times, giving it opportunities to build step by step to higher-quality output."
>
> -- [Andrew Ng (@AndrewYNg), X/Twitter](https://x.com/AndrewYNg/status/1773393357022298617)

Ng 在 2025 年发布的 Agentic AI 课程中进一步强调：**评估（evals）和错误分析的能力是决定一个人能否成功构建 AI 智能体的最大预测因子**。他的课程教授如何通过数据驱动的评估来指导复杂智能体工作流中各组件的优化——这本质上就是"监控"模式在工程实践中的体现。

### BabyAGI：目标驱动智能体的里程碑

**Yohei Nakajima**（风险投资人、BabyAGI 创建者）用仅 140 行 Python 代码创建了第一个广泛传播的开源自主智能体：

> "Introducing Task-driven Autonomous Agent: An agent that leverages GPT-4, Pinecone vector search, and LangChain framework to autonomously create and perform tasks based on an objective."
>
> -- [Yohei Nakajima (@yoheinakajima), X/Twitter](https://x.com/yoheinakajima/status/1640934493489070080)

BabyAGI 的核心架构完美诠释了目标设定与监控模式的三个关键组件：

1. **执行智能体（Execution Agent）**：根据目标执行具体任务
2. **任务创建智能体（Task Creation Agent）**：根据执行结果创建后续任务
3. **优先级排序智能体（Prioritization Agent）**：重新排序所有待处理任务

这个项目在 Twitter 上获得了数百万次展示，GitHub 上累积超过 16,000 颗星标，并被 Fast Company、Business Insider、Forbes 等主流媒体广泛报道。

在 2024 年推出的 BabyAGI 2.0 中，Nakajima 引入了"自我构建"的概念——智能体不仅能追踪和执行任务，还能动态创建和优化自身的功能函数。这代表了目标监控从"跟踪外部目标"向"自我进化"的重要跃迁。

### Karpathy 的 AutoResearch：约束即创新

**Andrej Karpathy**（前 Tesla AI 负责人、OpenAI 联合创始人）在 2026 年初发布了 AutoResearch 项目，展示了目标驱动智能体的惊人潜力：

> "The goal is to engineer your agents to make the fastest research progress indefinitely and without any of your own involvement."
>
> -- [Andrej Karpathy (@karpathy), X/Twitter](https://x.com/karpathy/status/2002118205729562949)

AutoResearch 的设计哲学与本章讨论的模式高度一致：

- **明确目标**：优化单一指标（训练效率）
- **持续监控**：每次实验后自动评估结果
- **反馈循环**：保留有效改进，丢弃无效尝试
- **自主迭代**：在两天内自动处理约 700 次变更

Karpathy 在运行智能体后发推称"this is what post-agi feels like... i didn't touch anything"——这种完全自主的目标追踪和优化能力正是目标设定与监控模式的终极体现。

社区从 AutoResearch 中总结出一个关键洞察：**约束是创新的源泉**。与其构建宽泛的、无约束的智能体，不如让智能体专注于一个文件、一个指标、一个 GPU——然后在清晰的目标框架下持续迭代。

### Harrison Chase 与 LangChain：智能体的上下文工程

**Harrison Chase**（LangChain CEO）在 2025 年提出了"上下文工程"（Context Engineering）的概念，直接关联到目标监控：

> "When agents mess up, they mess up because they don't have the right context; when they succeed, they succeed because they have the right context."
>
> -- Harrison Chase, [Interrupt 2025 Conference](https://blog.langchain.com/three-years-langchain/)

Chase 还分享了 LangChain 在长流程智能体中的实践经验：当智能体执行一个 200 步的流程时，**它需要一种方式来跟踪自己的进度并保持连贯性**。这正是目标监控在工程实践中的直接需求。LangChain 的 Deep Agents 实现了"待办清单"式的任务管理，智能体可以在文件系统中创建执行计划并逐步跟踪完成情况。

### Anthropic 的 Claude Tasks：结构化目标执行

Anthropic 在 2025 年推出了 **Claude Tasks Mode**，这是目标设定与监控模式在商业产品中的标杆实现：

- 用户设定目标后，Claude 自动生成结构化的执行计划
- 每个步骤的进度都被可视化展示
- 智能体在执行前会提出澄清问题，确保目标理解准确
- 支持中途调整目标和步骤，无需重启整个流程

配合 **Agent Skills**（2025 年 10 月发布的开放标准）和 **MCP 协议**，Claude 展示了一个完整的目标管理生态：从目标定义到工具调用，从进度监控到跨平台协作。

### Google DeepMind 的安全监控研究

Google DeepMind 在 2025 年发表的 AGI 安全路线图中，对"监控"提出了更深层次的思考：

- **监控智能体**（Monitor Agent）的职责是检测与人类目标不一致的行为
- 当监控智能体不确定某个行为是否安全时，应选择**拒绝该行为或标记供人类审查**
- **MONA 框架**（Myopic Optimization with Nonmyopic Approval）确保 AI 的长期规划对人类来说是可理解的

DeepMind 的 **SIMA 2** 项目更进一步，展示了智能体如何在虚拟世界中自主设定挑战、学习新技能、并通过试错持续改进——这是目标设定与监控在具身智能体中的前沿应用。

### 行业趋势与关键共识

综合社区讨论，以下趋势已形成广泛共识：

**1. 有界自主（Bounded Autonomy）成为主流**

大多数组织选择"有界自主"而非完全自主。智能体在结果可预测的领域独立行动，在风险或不确定性增加时保留人类参与。这种模式通过明确的行动限制来执行。

**2. 验证智能体（Verifier Agents）的兴起**

现代多智能体架构中出现了专门的验证智能体——它们不执行任务，而是**专门监控其他智能体的思维链和工具调用输出**，形成"制衡"机制。预计到 2030 年，"守护型智能体"（Guardian Agents）将占据智能体 AI 市场的 10-15%。

**3. 目标监控从可选变为必选**

传统的日志记录已经不够——你需要监控整个"智能体循环"：推理过程、工具选择和输出生成。Gartner 预测到 2026 年底，40% 的企业应用将嵌入 AI 智能体，其中目标监控是核心架构组件。

**4. 从"计划-执行"到"计划-行动-反思-重复"**

社区普遍认同 **Plan-Act-Reflect-Repeat** 循环是最有效的目标管理模式。智能体在每次行动后都要反思结果、评估是否接近目标、并在必要时调整策略。Google Cloud 的智能体设计指南将此作为推荐的核心模式。

### 本章小结

本章我们深入探讨了智能体目标设定与监控模式的核心概念和实现方式。这一模式使智能体能够不仅仅响应即时请求，还能朝着长期目标有序推进。

### 关键要点回顾

**1. 目标定义 (Goal Definition)**

- SMART原则：具体(Specific)、可衡量(Measurable)、可实现(Achievable)、相关性(Relevant)、有期限(Time-Bound)
- Goal类和GoalManager提供了完整的目标管理能力
- 支持子目标分解和进度追踪

**2. 进度监控 (Progress Monitoring)**

- Metric类支持多种指标类型：百分比、计数、时间、自定义
- 告警机制及时发现进度落后的情况
- LLM生成进度总结和洞察

**3. 目标优化 (Goal Refinement)**

- 支持多种优化原因：用户反馈、进度缓慢、资源变化、新信息、环境变化
- 自动优化功能根据进度自动调整目标
- LLM智能建议优化方案
- 版本历史记录和回滚功能

**4. 项目管理 (Project Management)**

- 任务状态管理和依赖关系追踪
- 关键路径识别
- 项目状态汇总和报告生成

**5. 个人生产力追踪 (Personal Productivity)**

- 习惯追踪和连续天数统计
- 成就徽章系统
- AI驱动的生产力洞察

### 目标管理最佳实践

1. **使用SMART原则定义目标**：确保每个目标都有明确的衡量标准和截止日期。

2. **分解大目标为子目标**：将复杂目标分解为可管理的小任务，更容易追踪进度。

3. **建立进度监控机制**：定期检查关键指标，设置告警阈值及时发现偏差。

4. **灵活调整目标**：根据反馈和环境变化适时优化目标，保持可行性。

5. **利用AI辅助决策**：借助LLM分析进度数据，提供智能建议和洞察。

### 目标管理应用场景

| 场景     | 应用方式                       |
| -------- | ------------------------------ |

| 项目管理 | 追踪里程碑、识别风险、协调团队 |
| 个人发展 | 习惯养成、技能学习、健康目标   |
| 业务运营 | 销售目标、效率优化、质量控制   |
| 团队协作 | 目标对齐、进度透明、绩效评估   |

### 总结

目标设定与监控是智能体系统的重要组成部分，它使智能体能够具备前瞻性和主动性。通过本章介绍的模式和技术，开发者可以构建能够自我管理、持续优化的高效智能体系统。随着AI技术的不断进步，目标管理功能将在更多场景中发挥重要作用。

---

_本章代码示例均基于 LangChain JavaScript SDK 实现，可直接在实际项目中使用或根据具体需求进行修改。_

## 参考资源

### 核心博文与教程

- [LLM Powered Autonomous Agents -- Lilian Weng (Lil'Log)](https://lilianweng.github.io/posts/2023-06-23-agent/) -- OpenAI 研究员 Lilian Weng 关于 LLM 智能体规划、记忆和工具使用的奠基性博文
- [Agentic AI Course -- Andrew Ng (DeepLearning.AI)](https://www.deeplearning.ai/courses/agentic-ai/) -- Andrew Ng 的智能体设计模式课程，涵盖反思、工具使用、规划和多智能体协作
- [Agentic AI: One Year After Andrew Ng's Design Patterns -- Hailey Quach](https://medium.com/@haileyq/agentic-ai-one-year-after-andrew-ngs-design-patterns-hype-or-reality-6fbd87dbe870) -- 对 Andrew Ng 四大模式的一年回顾与实践评估
- [Breaking Down Tasks into Steps for LLM Agents -- APXML](https://apxml.com/courses/intro-llm-agents/chapter-5-basic-agent-planning/decomposing-complex-tasks) -- LLM 智能体任务分解的实用教程
- [Coding Agents 101: The Art of Actually Getting Things Done -- Devin AI](https://devin.ai/agents101) -- 自主编程智能体的任务分解与目标管理实践

### 开源项目与框架

- [BabyAGI -- Yohei Nakajima (GitHub)](https://github.com/yoheinakajima/babyagi) -- 第一个广泛传播的目标驱动自主智能体框架
- [AutoResearch -- Andrej Karpathy (GitHub)](https://github.com/karpathy/autoresearch) -- 自主 ML 研究智能体，展示了目标驱动的持续优化
- [LangChain / LangGraph](https://blog.langchain.com/three-years-langchain/) -- Harrison Chase 领导的智能体框架，支持长流程任务跟踪和上下文工程
- [Awesome Agent Papers -- GitHub](https://github.com/luo-junyu/Awesome-Agent-Papers) -- 大语言模型智能体方向的论文精选列表

### 学术研究

- [Understanding the Planning of LLM Agents: A Survey (arXiv)](https://arxiv.org/pdf/2402.02716) -- LLM 智能体规划能力的全面综述
- [LLM Multi-Agent Systems: Challenges and Open Problems (arXiv)](https://arxiv.org/html/2402.03578v2) -- 多智能体系统中的目标协调与监控挑战
- [Agentic AI: A Comprehensive Survey of Architectures, Applications, and Future Directions (Springer)](https://link.springer.com/article/10.1007/s10462-025-11422-4) -- 智能体 AI 架构和应用的综合调查
- [Levels of Autonomy for AI Agents Working Paper (arXiv)](https://arxiv.org/html/2506.12469v1) -- AI 智能体自主性等级的定义框架
- [2025 AI Agent Index -- MIT](https://aiagentindex.mit.edu/2025/further-details/) -- MIT 对 AI 智能体自主性和目标复杂度的量化评估

### 企业架构指南

- [Choose a Design Pattern for Your Agentic AI System -- Google Cloud](https://docs.google.com/architecture/choose-design-pattern-agentic-ai-system) -- Google Cloud 的智能体设计模式选择指南
- [What is AI Agent Planning? -- IBM](https://www.ibm.com/think/topics/ai-agent-planning) -- IBM 对 AI 智能体规划模式的详解
- [Agentic AI Planning Pattern for Enterprise Workflows -- Tungsten Automation](https://www.tungstenautomation.com/learn/blog/the-agentic-ai-planning-pattern) -- 企业工作流中的智能体规划模式
- [Top AI Agentic Workflow Patterns -- ByteByteGo](https://blog.bytebytego.com/p/top-ai-agentic-workflow-patterns) -- 主流智能体工作流模式的架构解析
- [Taking a Responsible Path to AGI -- Google DeepMind](https://deepmind.google/blog/taking-a-responsible-path-to-agi/) -- DeepMind 关于智能体安全监控和目标对齐的研究路线图

### 行业分析与趋势

- [7 Agentic AI Trends to Watch in 2026 -- Machine Learning Mastery](https://machinelearningmastery.com/7-agentic-ai-trends-to-watch-in-2026/) -- 2026 年智能体 AI 关键趋势预测
- [Agentic AI Trends for 2026 -- EMA](https://www.ema.co/additional-blogs/addition-blogs/agentic-ai-trends-predictions-2025) -- 智能体 AI 行业趋势分析
- [AI in 2026: Predictions Mapped to the Agentic AI Maturity Model -- Ali Arsanjani (Medium)](https://dr-arsanjani.medium.com/ai-in-2026-predictions-mapped-to-the-agentic-ai-maturity-model-c6f851a40ef5) -- 基于成熟度模型的 AI 智能体预测
- [Designing Agentic AI Systems: How Real Applications Combine Patterns -- DEV Community](https://dev.to/sreeni5018/designing-agentic-ai-systems-how-real-applications-combine-patterns-not-hype-1ob4) -- 实际应用中多种智能体模式的组合实践

### 社交媒体与社区讨论

- [Andrew Ng (@AndrewYNg) -- X/Twitter](https://x.com/AndrewYNg/status/1773393357022298617) -- Andrew Ng 关于四大智能体设计模式的原始推文
- [Yohei Nakajima (@yoheinakajima) -- X/Twitter](https://x.com/yoheinakajima/status/1640934493489070080) -- BabyAGI 任务驱动智能体的发布推文
- [Lilian Weng (@lilianweng) -- X/Twitter](https://x.com/lilianweng/status/1673535600690102273) -- "Agent = LLM + memory + planning + tool use" 的经典定义
- [Andrej Karpathy (@karpathy) -- X/Twitter](https://x.com/karpathy/status/2002118205729562949) -- 2025 LLM 年度回顾，涵盖智能体发展
- [Harrison Chase (@hwchase17) -- X/Twitter](https://x.com/hwchase17/status/1980680421706006663) -- LangChain 智能体工程平台的最新进展
- [Swyx (@swyx) -- X/Twitter](https://x.com/swyx) -- "agent = llm + memory + planning + tools + while loop" 的简洁定义
