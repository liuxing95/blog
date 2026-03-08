---
title: 'Chapter 18: Agentic Regulations'
date: '2025-12-25'
excerpt: 'Agents must operate within legal and regulatory frameworks that vary by jurisdiction and application.'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 18: Agentic Regulations

# 第十八章：智能体法规

## Agentic Regulations Pattern Overview

## 智能体法规模式概述

Agents must operate within legal and regulatory frameworks that vary by jurisdiction and application.

智能体必须在因管辖区域和应用而异的法律和监管框架内运行。

This pattern ensures compliance with applicable regulations while maintaining agent effectiveness.

此模式确保在保持智能体效能的同时符合适用法规。

### Compliance by Design

### 设计合规

**Regulatory Analysis**: Identify relevant regulations for the agent's use case.

**法规分析**: 识别智能体用例的相关法规。

**Compliance Requirements**: Document specific requirements that must be met.

**合规要求**: 记录必须满足的具体要求。

**Implementation Guidelines**: Follow guidelines to meet regulatory standards.

**实施指南**: 遵循指南以满足监管标准。

**Documentation**: Maintain thorough documentation of compliance measures.

**文档**: 维护全面的合规措施文档。

### Legal Frameworks

### 法律框架

**Liability**: Understand legal liability for agent actions.

**责任**: 理解智能体行为的法律责任。

**Intellectual Property**: Address IP considerations for agent-generated content.

**知识产权**: 解决智能体生成内容的知识产权问题。

**Contract Law**: Ensure agent actions comply with contractual obligations.

**合同法**: 确保智能体行为符合合同义务。

**Tort Law**: Consider potential tort liabilities from agent behavior.

**侵权法**: 考虑智能体行为可能产生的侵权责任。

### Regulatory Requirements

### 监管要求

**Reporting**: Meet regulatory reporting requirements.

**报告**: 满足监管报告要求。

**Transparency**: Provide required disclosures about agent capabilities.

**透明度**: 提供关于智能体能力的必要披露。

**Human Oversight**: Maintain required human oversight of agent decisions.

**人工监督**: 保持对智能体决策的必要人工监督。

**Audit Trails**: Keep records required for regulatory audits.

**审计跟踪**: 保留监管审计所需的记录。

## Practical Applications & Use Cases

## 实际应用与用例场景

### Financial Services | 金融服务

In financial services, AI agents must comply with regulations like MiFID II, GDPR, and local banking laws. Trading agents need to maintain detailed audit trails, provide transparent pricing, and ensure fair dealing with customers. Compliance is not optional—violations can result in significant fines and reputational damage.

在金融服务中，AI智能体必须遵守MiFID II、GDPR和当地银行法等法规。交易智能体需要维护详细的审计跟踪、提供透明定价并确保公平对待客户。合规不是可选的——违规可能导致重大罚款和声誉损害。

### Healthcare and Medical | 医疗健康

Healthcare agents operate under strict regulations like HIPAA, GDPR, and FDA guidelines. They must ensure patient data privacy, maintain medical record integrity, and provide accurate information. Any AI-assisted diagnosis or treatment recommendations must be clearly labeled and supervised by licensed professionals.

医疗智能体在HIPAA、GDPR和FDA指南等严格法规下运行。它们必须确保患者数据隐私、维护医疗记录完整性并提供准确信息。任何AI辅助诊断或治疗建议必须明确标注并由持证专业人员监督。

### Data Protection and Privacy | 数据保护与隐私

With regulations like GDPR, CCPA, and LGPD, agents must implement privacy-by-design principles. This includes data minimization, purpose limitation, and ensuring individuals can exercise their rights to access, correct, and delete their data.

根据GDPR、CCPA和LGPD等法规，智能体必须实施隐私设计原则。这包括数据最小化、目的限制，并确保个人可以行使访问、更正和删除数据的权利。

### Employment and HR | 人力资源

HR agents must comply with equal employment opportunity laws, avoid discriminatory practices, and maintain confidential employee information. Automated hiring decisions require human oversight and documentation to ensure fairness.

人力资源智能体必须遵守平等就业机会法、避免歧视性做法并维护员工信息的机密性。自动化招聘决策需要人工监督和文档以确保公平。

---

## Hands-On Code Examples

## 动手实践代码示例

### Example 1: Regulatory Compliance Framework | 示例1：监管合规框架

```typescript
// Regulatory compliance framework for AI agents
// AI智能体的监管合规框架
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Regulation types and jurisdictions
// 法规类型和管辖区域
enum RegulationType {
  DATA_PRIVACY = "data_privacy",
  FINANCIAL = "financial",
  HEALTHCARE = "healthcare",
  CONSUMER_PROTECTION = "consumer_protection",
  EMPLOYMENT = "employment",
  INTELLECTUAL_PROPERTY = "intellectual_property"
}

enum Jurisdiction {
  US = "us",
  EU = "eu",
  UK = "uk",
  GLOBAL = "global"
}

// Compliance requirement definition
// 合规要求定义
interface ComplianceRequirement {
  id: string;
  regulation: RegulationType;
  jurisdiction: Jurisdiction;
  description: string;
  mandatory: boolean;
  implementationGuidelines: string[];
  verificationMethod: "automated" | "manual" | "hybrid";
  lastUpdated: Date;
}

// Compliance status tracking
// 合规状态跟踪
interface ComplianceStatus {
  requirementId: string;
  status: "compliant" | "non_compliant" | "in_progress" | "not_applicable";
  evidence: string[];
  lastChecked: Date;
  issues?: string[];
}

// Compliance engine
// 合规引擎
class ComplianceEngine {
  private requirements: Map<string, ComplianceRequirement> = new Map();
  private statuses: Map<string, ComplianceStatus> = new Map();
  private auditLog: Array<{
    timestamp: Date;
    action: string;
    requirementId?: string;
    details: any;
  }> = [];

  // Add compliance requirement
  addRequirement(requirement: ComplianceRequirement): void {
    this.requirements.set(requirement.id, requirement);
    this.statuses.set(requirement.id, {
      requirementId: requirement.id,
      status: "not_applicable",
      evidence: [],
      lastChecked: new Date()
    });

    this.logAction("requirement_added", { requirementId: requirement.id });
    console.log(`[Compliance] Added requirement: ${requirement.id}`);
  }

  // Check compliance for a specific requirement
  async checkCompliance(requirementId: string, context: any): Promise<ComplianceStatus> {
    const requirement = this.requirements.get(requirementId);
    if (!requirement) {
      throw new Error(`Requirement not found: ${requirementId}`);
    }

    const status: ComplianceStatus = {
      requirementId,
      status: "in_progress",
      evidence: [],
      lastChecked: new Date()
    };

    // Automated verification based on implementation guidelines
    for (const guideline of requirement.implementationGuidelines) {
      const result = await this.verifyGuideline(guideline, context);
      status.evidence.push(result);

      if (!result.passed) {
        status.issues = status.issues || [];
        status.issues.push(result.issue || "Guideline not met");
      }
    }

    // Determine final status
    if (!status.issues || status.issues.length === 0) {
      status.status = "compliant";
    } else if (requirement.mandatory) {
      status.status = "non_compliant";
    } else {
      status.status = "in_progress";
    }

    this.statuses.set(requirementId, status);
    this.logAction("compliance_checked", { requirementId, status: status.status });

    return status;
  }

  // Verify a specific guideline
  private async verifyGuideline(guideline: string, context: any): Promise<any> {
    // Simplified verification logic
    // 简化的验证逻辑
    return {
      guideline,
      passed: true,
      evidence: "Automated check passed"
    };
  }

  // Get overall compliance report
  getComplianceReport(): any {
    const statuses = Array.from(this.statuses.values());
    const compliant = statuses.filter(s => s.status === "compliant").length;
    const nonCompliant = statuses.filter(s => s.status === "non_compliant").length;
    const inProgress = statuses.filter(s => s.status === "in_progress").length;

    return {
      totalRequirements: this.requirements.size,
      compliant,
      nonCompliant,
      inProgress,
      complianceRate: this.requirements.size > 0
        ? (compliant / this.requirements.size) * 100
        : 100,
      lastAudit: new Date().toISOString()
    };
  }

  // Log compliance action
  private logAction(action: string, details: any): void {
    this.auditLog.push({
      timestamp: new Date(),
      action,
      ...details
    });
  }

  // Get audit log
  getAuditLog(limit: number = 100): any[] {
    return this.auditLog.slice(-limit);
  }
}

// Example: GDPR compliance setup
// 示例：GDPR合规设置
function setupGDPRCompliance(): ComplianceEngine {
  const engine = new ComplianceEngine();

  // Add GDPR requirements
  const gdprRequirements: ComplianceRequirement[] = [
    {
      id: "gdpr-article-5",
      regulation: RegulationType.DATA_PRIVACY,
      jurisdiction: Jurisdiction.EU,
      description: "Lawfulness, fairness and transparency in processing",
      mandatory: true,
      implementationGuidelines: [
        "Verify legal basis for processing",
        "Ensure data subject notification",
        "Implement transparent data practices"
      ],
      verificationMethod: "hybrid",
      lastUpdated: new Date()
    },
    {
      id: "gdpr-article-15",
      regulation: RegulationType.DATA_PRIVACY,
      jurisdiction: Jurisdiction.EU,
      description: "Right of access by data subject",
      mandatory: true,
      implementationGuidelines: [
        "Implement data access API",
        "Verify requester identity",
        "Provide data in portable format"
      ],
      verificationMethod: "automated",
      lastUpdated: new Date()
    },
    {
      id: "gdpr-article-17",
      regulation: RegulationType.DATA_PRIVACY,
      jurisdiction: Jurisdiction.EU,
      description: "Right to erasure",
      mandatory: true,
      implementationGuidelines: [
        "Implement data deletion workflow",
        "Notify third parties of deletion",
        "Document deletion completion"
      ],
      verificationMethod: "hybrid",
      lastUpdated: new Date()
    }
  ];

  gdprRequirements.forEach(req => engine.addRequirement(req));

  return engine;
}

// Run example: 运行示例
const gdprEngine = setupGDPRCompliance();
console.log("\n=== GDPR Compliance Report ===");
console.log(gdprEngine.getComplianceReport());
```

### Example 2: Audit Trail System | 示例2：审计跟踪系统

```typescript
// Comprehensive audit trail system for regulatory compliance
// 符合监管合规的综合审计跟踪系统
import { ChatOpenAI } from "@langchain/openai";

// Audit event types
// 审计事件类型
enum AuditEventType {
  DATA_ACCESS = "data_access",
  DATA_MODIFICATION = "data_modification",
  DECISION_MADE = "decision_made",
  EXTERNAL_API_CALL = "external_api_call",
  USER_ACTION = "user_action",
  SYSTEM_EVENT = "system_event",
  COMPLIANCE_CHECK = "compliance_check",
  SECURITY_EVENT = "security_event"
}

// Audit event severity
// 审计事件严重性
enum AuditSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical"
}

// Complete audit event structure
// 完整的审计事件结构
interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  severity: AuditSeverity;
  timestamp: number;
  actor: {
    type: "user" | "agent" | "system";
    id: string;
    metadata?: any;
  };
  action: string;
  resource?: {
    type: string;
    id: string;
    metadata?: any;
  };
  outcome: "success" | "failure" | "partial";
  details: Record<string, any>;
  complianceFlags: string[];
  jurisdiction?: string;
  dataClassification?: "public" | "internal" | "confidential" | "restricted";
}

// Immutable audit log (append-only)
// 不可变审计日志（仅追加）
class AuditTrail {
  private events: AuditEvent[] = [];
  private storage: "memory" | "database" | "blockchain" = "memory";
  private encryptionKey?: string;

  // Log an audit event
  log(event: Omit<AuditEvent, "id" | "timestamp">): AuditEvent {
    const fullEvent: AuditEvent = {
      ...event,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    // Add to events array
    this.events.push(fullEvent);

    // In production, also write to persistent storage
    // 在生产环境中，也写入持久存储
    console.log(`[Audit] ${event.eventType}: ${event.action} by ${event.actor.id}`);

    return fullEvent;
  }

  // Query audit events with filters
  query(filters: {
    eventType?: AuditEventType;
    actorId?: string;
    resourceId?: string;
    startDate?: Date;
    endDate?: Date;
    severity?: AuditSeverity;
    outcome?: string;
  }): AuditEvent[] {
    let results = [...this.events];

    if (filters.eventType) {
      results = results.filter(e => e.eventType === filters.eventType);
    }
    if (filters.actorId) {
      results = results.filter(e => e.actor.id === filters.actorId);
    }
    if (filters.resourceId) {
      results = results.filter(e => e.resource?.id === filters.resourceId);
    }
    if (filters.startDate) {
      results = results.filter(e => e.timestamp >= filters.startDate!.getTime());
    }
    if (filters.endDate) {
      results = results.filter(e => e.timestamp <= filters.endDate!.getTime());
    }
    if (filters.severity) {
      results = results.filter(e => e.severity === filters.severity);
    }
    if (filters.outcome) {
      results = results.filter(e => e.outcome === filters.outcome);
    }

    return results;
  }

  // Generate compliance report
  generateReport(startDate: Date, endDate: Date): any {
    const events = this.query({ startDate, endDate });

    return {
      period: { start: startDate.toISOString(), end: endDate.toISOString() },
      totalEvents: events.length,
      byType: this.countByField(events, "eventType"),
      bySeverity: this.countByField(events, "severity"),
      byOutcome: this.countByField(events, "outcome"),
      complianceSummary: this.generateComplianceSummary(events),
      generatedAt: new Date().toISOString()
    };
  }

  private countByField(events: AuditEvent[], field: keyof AuditEvent): Record<string, number> {
    const counts: Record<string, number> = {};
    events.forEach(e => {
      const value = String(e[field]);
      counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
  }

  private generateComplianceSummary(events: AuditEvent[]): any {
    const dataAccess = events.filter(e => e.eventType === AuditEventType.DATA_ACCESS);
    const modifications = events.filter(e => e.eventType === AuditEventType.DATA_MODIFICATION);

    return {
      dataAccessEvents: dataAccess.length,
      dataModificationEvents: modifications.length,
      unauthorizedAccessAttempts: events.filter(e =>
        e.eventType === AuditEventType.SECURITY_EVENT && e.outcome === "failure"
      ).length,
      complianceChecksPerformed: events.filter(e =>
        e.eventType === AuditEventType.COMPLIANCE_CHECK
      ).length
    };
  }

  // Export for regulatory submission
  exportForRegulator(format: "json" | "csv" | "xml"): string {
    if (format === "json") {
      return JSON.stringify(this.events, null, 2);
    }
    // Other formats would be implemented here
    return JSON.stringify(this.events);
  }
}

// Agent with built-in audit logging
// 内置审计日志记录的智能体
class AuditableAgent {
  protected auditTrail: AuditTrail;
  protected agentId: string;

  constructor(agentId: string, auditTrail: AuditTrail) {
    this.agentId = agentId;
    this.auditTrail = auditTrail;
  }

  // Protected method to log all actions
  protected logAction(
    eventType: AuditEventType,
    action: string,
    details: Record<string, any>,
    options: {
      resource?: any;
      severity?: AuditSeverity;
      classification?: "public" | "internal" | "confidential" | "restricted";
    } = {}
  ): void {
    this.auditTrail.log({
      eventType,
      severity: options.severity || AuditSeverity.INFO,
      actor: { type: "agent", id: this.agentId },
      action,
      resource: options.resource,
      outcome: "success",
      details,
      complianceFlags: [],
      dataClassification: options.classification
    });
  }
}

// Example usage: 创建示例
const auditTrail = new AuditTrail();

// Log sample events
auditTrail.log({
  eventType: AuditEventType.DATA_ACCESS,
  severity: AuditSeverity.INFO,
  timestamp: Date.now(),
  actor: { type: "agent", id: "customer-service-agent" },
  action: "retrieve_customer_profile",
  resource: { type: "customer", id: "cust-12345" },
  outcome: "success",
  details: { fields: ["name", "email", "account_status"] },
  complianceFlags: ["gdpr-article-15"],
  dataClassification: "confidential"
});

auditTrail.log({
  eventType: AuditEventType.DECISION_MADE,
  severity: AuditSeverity.INFO,
  timestamp: Date.now(),
  actor: { type: "agent", id: "credit-assessment-agent" },
  action: "approve_loan",
  outcome: "success",
  details: { amount: 50000, term: "24 months", risk_score: 0.65 },
  complianceFlags: ["fair_lending_compliance"],
  jurisdiction: "US"
});

// Generate report
console.log("\n=== Audit Report ===");
const report = auditTrail.generateReport(new Date(Date.now() - 86400000), new Date());
console.log(JSON.stringify(report, null, 2));
```

### Example 3: Data Privacy Protection | 示例3：数据隐私保护

```typescript
// Data privacy protection implementation
// 数据隐私保护实现
import { ChatOpenAI } from "@langchain/openai";

// Data classification levels
// 数据分类级别
enum DataClassification {
  PUBLIC = "public",
  INTERNAL = "internal",
  CONFIDENTIAL = "confidential",
  RESTRICTED = "restricted"
}

// PII (Personally Identifiable Information) types
// PII（个人可识别信息）类型
enum PIIType {
  NAME = "name",
  EMAIL = "email",
  PHONE = "phone",
  SSN = "ssn",
  ADDRESS = "address",
  FINANCIAL = "financial",
  HEALTH = "health",
  BIOMETRIC = "biometric"
}

// Data processing purpose
// 数据处理目的
enum ProcessingPurpose {
  SERVICE_DELIVERY = "service_delivery",
  MARKETING = "marketing",
  ANALYTICS = "analytics",
  THREAT_PREVENTION = "threat_prevention",
  LEGAL_COMPLIANCE = "legal_compliance"
}

// Privacy policy configuration
// 隐私政策配置
interface PrivacyPolicy {
  allowPIIProcessing: boolean;
  requireConsent: boolean;
  dataRetentionDays: number;
  allowedPurposes: ProcessingPurpose[];
  geographicRestrictions: string[];
  encryptionRequired: boolean;
}

// Data subject rights
// 数据主体权利
interface DataSubjectRights {
  access: boolean;
  rectification: boolean;
  erasure: boolean;
  portability: boolean;
  objection: boolean;
  restriction: boolean;
}

// Privacy engine
// 隐私引擎
class PrivacyEngine {
  private policies: Map<string, PrivacyPolicy> = new Map();
  private consentRecords: Map<string, { purpose: ProcessingPurpose; timestamp: number; valid: boolean }[]> = new Map();
  private dataInventory: Map<string, { classification: DataClassification; piiTypes: PIIType[]; jurisdiction: string }> = new Map();

  // Register privacy policy
  registerPolicy(policyId: string, policy: PrivacyPolicy): void {
    this.policies.set(policyId, policy);
    console.log(`[Privacy] Registered policy: ${policyId}`);
  }

  // Check if processing is allowed
  canProcess(policyId: string, purpose: ProcessingPurpose, hasConsent: boolean): { allowed: boolean; reason?: string } {
    const policy = this.policies.get(policyId);
    if (!policy) {
      return { allowed: false, reason: "Policy not found" };
    }

    if (policy.requireConsent && !hasConsent) {
      return { allowed: false, reason: "Consent required" };
    }

    if (!policy.allowedPurposes.includes(purpose)) {
      return { allowed: false, reason: "Purpose not allowed" };
    }

    return { allowed: true };
  }

  // Record consent
  recordConsent(userId: string, purpose: ProcessingPurpose): void {
    const records = this.consentRecords.get(userId) || [];
    records.push({ purpose, timestamp: Date.now(), valid: true });
    this.consentRecords.set(userId, records);
    console.log(`[Privacy] Recorded consent for user ${userId}: ${purpose}`);
  }

  // Check consent
  hasConsent(userId: string, purpose: ProcessingPurpose): boolean {
    const records = this.consentRecords.get(userId) || [];
    return records.some(r => r.purpose === purpose && r.valid);
  }

  // Anonymize PII data
  anonymizeData(data: any, piiTypes: PIIType[]): any {
    const anonymized = { ...data };

    for (const piiType of piiTypes) {
      switch (piiType) {
        case PIIType.NAME:
          anonymized.name = "[REDACTED]";
          break;
        case PIIType.EMAIL:
          if (anonymized.email) {
            const [local, domain] = anonymized.email.split("@");
            anonymized.email = `${local.substring(0, 2)}***@${domain}`;
          }
          break;
        case PIIType.PHONE:
          anonymized.phone = "***-***-****";
          break;
        case PIIType.SSN:
          anonymized.ssn = "***-**-****";
          break;
      }
    }

    return anonymized;
  }

  // Handle data subject access request
  handleAccessRequest(userId: string): any {
    // In production, would retrieve from database
    return {
      userId,
      requestDate: new Date().toISOString(),
      data: {
        profile: { name: "John Doe", email: "john@example.com" },
        preferences: { notifications: true },
        activity: [{ action: "login", timestamp: Date.now() }]
      }
    };
  }

  // Handle data erasure request (right to be forgotten)
  handleErasureRequest(userId: string): { success: boolean; deletedRecords: string[] } {
    // In production, would delete from all databases
    const deletedRecords = [
      `user_profile:${userId}`,
      `user_preferences:${userId}`,
      `user_activity:${userId}`,
      `user_sessions:${userId}`
    ];

    // Invalidate consent records
    const consents = this.consentRecords.get(userId);
    if (consents) {
      consents.forEach(c => c.valid = false);
    }

    console.log(`[Privacy] Erasure completed for user: ${userId}`);
    return { success: true, deletedRecords };
  }
}

// Data masking utilities
// 数据掩码工具
class DataMasking {
  // Mask sensitive data based on classification
  static mask(data: any, classification: DataClassification): any {
    switch (classification) {
      case DataClassification.RESTRICTED:
        return this.maskAll(data);
      case DataClassification.CONFIDENTIAL:
        return this.maskPartial(data);
      case DataClassification.INTERNAL:
        return this.maskNone(data);
      default:
        return data;
    }
  }

  private static maskAll(data: any): any {
    return "[REDACTED]";
  }

  private static maskPartial(data: any): any {
    if (typeof data === "string") {
      if (data.includes("@")) {
        const [local, domain] = data.split("@");
        return `${local.substring(0, 2)}***@${domain}`;
      }
      if (data.length > 4) {
        return data.substring(0, 2) + "***" + data.substring(data.length - 2);
      }
    }
    return data;
  }

  private static maskNone(data: any): any {
    return data;
  }
}

// Example usage: 创建示例
const privacyEngine = new PrivacyEngine();

// Register GDPR policy
privacyEngine.registerPolicy("gdpr", {
  allowPIIProcessing: true,
  requireConsent: true,
  dataRetentionDays: 365,
  allowedPurposes: [ProcessingPurpose.SERVICE_DELIVERY, ProcessingPurpose.ANALYTICS],
  geographicRestrictions: ["EU"],
  encryptionRequired: true
});

// Record consent
privacyEngine.recordConsent("user-123", ProcessingPurpose.SERVICE_DELIVERY);

// Check processing
const canProcess = privacyEngine.canProcess("gdpr", ProcessingPurpose.SERVICE_DELIVERY, true);
console.log("\nCan process:", canProcess);

// Handle access request
const accessResult = privacyEngine.handleAccessRequest("user-123");
console.log("\nAccess request result:", accessResult);

// Handle erasure request
const erasureResult = privacyEngine.handleErasureRequest("user-123");
console.log("\nErasure result:", erasureResult);
```

### Example 4: Human-in-the-Loop Compliance | 示例4：人工监督合规

```typescript
// Human-in-the-loop compliance for regulated decisions
// 受监管决策的人工监督合规
import { ChatOpenAI } from "@langchain/openai";

// Decision criticality levels
// 决策关键性级别
enum DecisionCriticality {
  LOW = "low",           // Agent can decide autonomously
  MEDIUM = "medium",     // Agent decides, human notified
  HIGH = "high",         // Human approval required
  CRITICAL = "critical"  // Human decision required, no autonomous
}

// Review status
// 审核状态
enum ReviewStatus {
  PENDING = "pending",
  IN_REVIEW = "in_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  ESCALATED = "escalated"
}

// Approval request structure
// 审批请求结构
interface ApprovalRequest {
  id: string;
  agentId: string;
  decisionType: string;
  criticality: DecisionCriticality;
  proposedAction: string;
  justification: string;
  supportingData: any;
  requestedBy: string;
  requestedAt: number;
  dueBy?: number;
  status: ReviewStatus;
  reviewer?: string;
  reviewedAt?: number;
  reviewNotes?: string;
}

// Human review manager
// 人工审核管理器
class HumanReviewManager {
  private pendingRequests: Map<string, ApprovalRequest> = new Map();
  private reviewHistory: ApprovalRequest[] = [];
  private escalationRules: Map<DecisionCriticality, number> = new Map();
  private reviewers: Map<string, { name: string; roles: string[]; maxLoad: number; currentLoad: number }> = new Map();

  constructor() {
    // Set escalation timeouts
    this.escalationRules.set(DecisionCriticality.CRITICAL, 15 * 60 * 1000); // 15 minutes
    this.escalationRules.set(DecisionCriticality.HIGH, 60 * 60 * 1000); // 1 hour
    this.escalationRules.set(DecisionCriticality.MEDIUM, 24 * 60 * 60 * 1000); // 24 hours
  }

  // Register a reviewer
  registerReviewer(reviewerId: string, name: string, roles: string[], maxLoad: number = 10): void {
    this.reviewers.set(reviewerId, { name, roles, maxLoad, currentLoad: 0 });
    console.log(`[Review] Registered reviewer: ${name}`);
  }

  // Submit approval request
  submitRequest(request: Omit<ApprovalRequest, "id" | "status">): ApprovalRequest {
    const fullRequest: ApprovalRequest = {
      ...request,
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: ReviewStatus.PENDING
    };

    this.pendingRequests.set(fullRequest.id, fullRequest);

    // Log the submission
    console.log(`[Review] Submitted ${request.decisionType} request: ${fullRequest.id}`);

    // Auto-assign based on criticality
    if (request.criticality === DecisionCriticality.CRITICAL) {
      this.autoAssign(fullRequest.id);
    }

    return fullRequest;
  }

  // Auto-assign to available reviewer
  private autoAssign(requestId: string): void {
    const request = this.pendingRequests.get(requestId);
    if (!request) return;

    const available = Array.from(this.reviewers.values())
      .filter(r => r.currentLoad < r.maxLoad)
      .sort((a, b) => a.currentLoad - b.currentLoad)[0];

    if (available) {
      request.status = ReviewStatus.IN_REVIEW;
      available.currentLoad++;
      console.log(`[Review] Auto-assigned ${requestId} to reviewer`);
    }
  }

  // Approve request
  approve(requestId: string, reviewerId: string, notes?: string): ApprovalRequest {
    const request = this.pendingRequests.get(requestId);
    if (!request) throw new Error("Request not found");

    request.status = ReviewStatus.APPROVED;
    request.reviewer = reviewerId;
    request.reviewedAt = Date.now();
    request.reviewNotes = notes;

    // Update reviewer load
    const reviewer = this.reviewers.get(reviewerId);
    if (reviewer) reviewer.currentLoad--;

    this.pendingRequests.delete(requestId);
    this.reviewHistory.push(request);

    console.log(`[Review] Approved request: ${requestId}`);
    return request;
  }

  // Reject request
  reject(requestId: string, reviewerId: string, reason: string): ApprovalRequest {
    const request = this.pendingRequests.get(requestId);
    if (!request) throw new Error("Request not found");

    request.status = ReviewStatus.REJECTED;
    request.reviewer = reviewerId;
    request.reviewedAt = Date.now();
    request.reviewNotes = reason;

    // Update reviewer load
    const reviewer = this.reviewers.get(reviewerId);
    if (reviewer) reviewer.currentLoad--;

    this.pendingRequests.delete(requestId);
    this.reviewHistory.push(request);

    console.log(`[Review] Rejected request: ${requestId}`);
    return request;
  }

  // Get pending requests
  getPending(criticality?: DecisionCriticality): ApprovalRequest[] {
    let requests = Array.from(this.pendingRequests.values());
    if (criticality) {
      requests = requests.filter(r => r.criticality === criticality);
    }
    return requests;
  }

  // Get review statistics
  getStats(): any {
    const history = this.reviewHistory;
    return {
      pending: this.pendingRequests.size,
      totalReviewed: history.length,
      approved: history.filter(r => r.status === ReviewStatus.APPROVED).length,
      rejected: history.filter(r => r.status === ReviewStatus.REJECTED).length,
      approvalRate: history.length > 0
        ? (history.filter(r => r.status === ReviewStatus.APPROVED).length / history.length) * 100
        : 0
    };
  }
}

// Agent with human review requirement
// 有人工审核要求的智能体
class RegulatedAgent {
  protected reviewManager: HumanReviewManager;
  protected agentId: string;

  constructor(agentId: string, reviewManager: HumanReviewManager) {
    this.agentId = agentId;
    this.reviewManager = reviewManager;
  }

  // Determine if decision needs human review
  protected requiresHumanReview(criticality: DecisionCriticality): boolean {
    return criticality === DecisionCriticality.HIGH ||
           criticality === DecisionCriticality.CRITICAL;
  }

  // Make decision with potential human review
  async makeDecision(
    decisionType: string,
    proposedAction: string,
    justification: string,
    data: any,
    criticality: DecisionCriticality
  ): Promise<{ canProceed: boolean; approvalId?: string; message: string }> {
    if (this.requiresHumanReview(criticality)) {
      const request = this.reviewManager.submitRequest({
        agentId: this.agentId,
        decisionType,
        criticality,
        proposedAction,
        justification,
        supportingData: data,
        requestedBy: "agent",
        requestedAt: Date.now()
      });

      return {
        canProceed: false,
        approvalId: request.id,
        message: `Human approval required for ${decisionType}`
      };
    }

    return { canProceed: true, message: "Decision approved for autonomous execution" };
  }
}

// Example usage: 创建示例
const reviewManager = new HumanReviewManager();

// Register reviewers
reviewManager.registerReviewer("reviewer-1", "Alice Smith", ["compliance", "risk"], 10);
reviewManager.registerReviewer("reviewer-2", "Bob Johnson", ["legal", "compliance"], 5);

// Create regulated agent
const regulatedAgent = new RegulatedAgent("loan-agent", reviewManager);

// Request critical decision (requires human review)
const decision = await regulatedAgent.makeDecision(
  "loan_approval",
  "Approve $50,000 loan",
  "Credit score 750, debt-to-income ratio 0.35",
  { creditScore: 750, income: 80000, requestedAmount: 50000 },
  DecisionCriticality.HIGH
);

console.log("\nDecision result:", decision);

// Simulate human approval
if (decision.approvalId) {
  reviewManager.approve(decision.approvalId, "reviewer-1", "Looks good, approved");
}

// Get statistics
console.log("\nReview statistics:", reviewManager.getStats());
```

### Example 5: Regulatory Reporting | 示例5：监管报告

```typescript
// Automated regulatory reporting system
// 自动化监管报告系统
import { ChatOpenAI } from "@langchain/openai";

// Report types
// 报告类型
enum ReportType {
  TRANSACTION_MONTHLY = "transaction_monthly",
  SUSPICIOUS_ACTIVITY = "suspicious_activity",
  CUSTOMER_COMPLAINTS = "customer_complaints",
  DATA_BREACH = "data_breach",
  OPERATIONAL_RISK = "operational_risk",
  CAPITAL_REQUIREMENTS = "capital_requirements"
}

// Report frequency
// 报告频率
enum ReportFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  AD_HOC = "ad_hoc"
}

// Report template
// 报告模板
interface ReportTemplate {
  type: ReportType;
  name: string;
  frequency: ReportFrequency;
  requiredFields: string[];
  regulatoryBody: string;
  deadline: string; // e.g., "15th of following month"
}

// Report generation request
// 报告生成请求
interface ReportRequest {
  id: string;
  templateType: ReportType;
  periodStart: Date;
  periodEnd: Date;
  data: any;
  status: "draft" | "review" | "submitted" | "accepted" | "rejected";
  submittedAt?: Date;
}

// Automated reporting engine
// 自动化报告引擎
class RegulatoryReportingEngine {
  private templates: Map<ReportType, ReportTemplate> = new Map();
  private reportSchedule: Map<ReportType, NodeJS.Timeout> = new Map();
  private submittedReports: ReportRequest[] = [];

  // Register report template
  registerTemplate(template: ReportTemplate): void {
    this.templates.set(template.type, template);
    console.log(`[Reporting] Registered template: ${template.name}`);
  }

  // Generate report
  async generateReport(
    templateType: ReportType,
    periodStart: Date,
    periodEnd: Date,
    dataProvider: () => Promise<any>
  ): Promise<ReportRequest> {
    const template = this.templates.get(templateType);
    if (!template) {
      throw new Error(`Template not found: ${templateType}`);
    }

    // Gather data
    const data = await dataProvider();

    // Validate required fields
    const missingFields = template.requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    const report: ReportRequest = {
      id: `report-${Date.now()}`,
      templateType,
      periodStart,
      periodEnd,
      data: this.formatReportData(template, data),
      status: "draft"
    };

    console.log(`[Reporting] Generated draft report: ${report.id}`);
    return report;
  }

  // Format data according to template
  private formatReportData(template: ReportTemplate, data: any): any {
    const formatted: any = {};

    for (const field of template.requiredFields) {
      formatted[field] = data[field];
    }

    formatted.metadata = {
      generatedAt: new Date().toISOString(),
      templateVersion: "1.0",
      regulatoryBody: template.regulatoryBody
    };

    return formatted;
  }

  // Submit report
  async submitReport(reportId: string): Promise<ReportRequest> {
    const report = this.submittedReports.find(r => r.id === reportId);
    if (!report) {
      // Find in pending (would need to track separately in production)
      throw new Error("Report not found");
    }

    report.status = "submitted";
    report.submittedAt = new Date();

    console.log(`[Reporting] Submitted report: ${reportId} to ${this.templates.get(report.templateType)?.regulatoryBody}`);

    // Simulate regulatory acceptance
    setTimeout(() => {
      report.status = "accepted";
      console.log(`[Reporting] Report ${reportId} accepted by regulator`);
    }, 1000);

    return report;
  }

  // Schedule automated reporting
  scheduleReport(templateType: ReportType, cronExpression: string, dataProvider: () => Promise<any>): void {
    console.log(`[Reporting] Scheduled ${templateType} with schedule: ${cronExpression}`);
    // In production, would use node-cron or similar
  }

  // Get compliance calendar
  getComplianceCalendar(year: number): any[] {
    const events: any[] = [];

    this.templates.forEach(template => {
      if (template.frequency === ReportFrequency.MONTHLY) {
        for (let month = 0; month < 12; month++) {
          events.push({
            type: template.type,
            name: template.name,
            deadline: `${template.deadline} ${new Date(year, month + 1, 1).toLocaleString("default", { month: "long" })}`,
            regulatoryBody: template.regulatoryBody
          });
        }
      }
    });

    return events;
  }
}

// Example: FINRA reporting setup
// 示例：FINRA报告设置
function setupFinancialReporting(): RegulatoryReportingEngine {
  const engine = new RegulatoryReportingEngine();

  // Register regulatory templates
  engine.registerTemplate({
    type: ReportType.TRANSACTION_MONTHLY,
    name: "Monthly Transaction Report",
    frequency: ReportFrequency.MONTHLY,
    requiredFields: ["totalVolume", "transactionCount", "customerCount", "complianceFlags"],
    regulatoryBody: "FINRA",
    deadline: "15th of following month"
  });

  engine.registerTemplate({
    type: ReportType.SUSPICIOUS_ACTIVITY,
    name: "Suspicious Activity Report (SAR)",
    frequency: ReportFrequency.AD_HOC,
    requiredFields: ["suspiciousTransactions", "customerId", "description", "amount", "date"],
    regulatoryBody: "FINRA",
    deadline: "30 days from detection"
  });

  return engine;
}

// Example usage: 创建示例
const reportingEngine = setupFinancialReporting();

// Generate monthly report
const reportData = {
  totalVolume: 15000000,
  transactionCount: 45000,
  customerCount: 1200,
  complianceFlags: 23
};

const monthlyReport = await reportingEngine.generateReport(
  ReportType.TRANSACTION_MONTHLY,
  new Date("2024-01-01"),
  new Date("2024-01-31"),
  async () => reportData
);

console.log("\nGenerated report:", monthlyReport.id);

// Get compliance calendar
const calendar = reportingEngine.getComplianceCalendar(2024);
console.log("\nCompliance calendar for 2024:");
calendar.slice(0, 3).forEach(event => console.log(`  - ${event.name}: ${event.deadline}`));
```

---

## Investment Agent: Regulatory Compliance Trading System

## 投资智能体：合规交易系统

```typescript
// Investment agent with regulatory compliance
// 具有监管合规功能的投资智能体
import { ChatOpenAI } from "@langchain/openai";

// Trading regulation types
// 交易法规类型
enum TradingRegulation {
  MARKET_ABUSE = "market_abuse",
  BEST_EXECUTION = "best_execution",
  KNOW_YOUR_CUSTOMER = "know_your_customer",
  SUITABILITY = "suitability",
  RECORD_KEEPING = "record_keeping",
  REPORTING = "reporting"
}

// Investment compliance rule
// 投资合规规则
interface ComplianceRule {
  id: string;
  regulation: TradingRegulation;
  description: string;
  checkFunction: (trade: any) => Promise<{ passed: boolean; reason?: string }>;
}

// Compliance checker for investment trades
// 投资交易合规检查器
class InvestmentComplianceChecker {
  private rules: ComplianceRule[] = [];
  private auditTrail: AuditTrail;

  constructor(auditTrail: AuditTrail) {
    this.auditTrail = auditTrail;
    this.initializeRules();
  }

  private initializeRules(): void {
    // Market abuse prevention
    this.rules.push({
      id: "market-abuse-1",
      regulation: TradingRegulation.MARKET_ABUSE,
      description: "Check for suspicious trading patterns",
      checkFunction: async (trade) => {
        // Simplified check
        if (trade.volume > 1000000 && trade.frequency > 100) {
          return { passed: false, reason: "High volume and frequency flagged" };
        }
        return { passed: true };
      }
    });

    // Best execution
    this.rules.push({
      id: "best-execution-1",
      regulation: TradingRegulation.BEST_EXECUTION,
      description: "Verify best execution practices",
      checkFunction: async (trade) => {
        if (!trade.executionVenue) {
          return { passed: false, reason: "No execution venue specified" };
        }
        return { passed: true };
      }
    });

    // KYC compliance
    this.rules.push({
      id: "kyc-1",
      regulation: TradingRegulation.KNOW_YOUR_CUSTOMER,
      description: "Verify customer identity and status",
      checkFunction: async (trade) => {
        if (!trade.customerId || !trade.kycVerified) {
          return { passed: false, reason: "KYC not completed" };
        }
        return { passed: true };
      }
    });

    // Suitability
    this.rules.push({
      id: "suitability-1",
      regulation: TradingRegulation.SUITABILITY,
      description: "Verify investment suitability",
      checkFunction: async (trade) => {
        if (trade.riskLevel === "high" && trade.customerRiskProfile === "conservative") {
          return { passed: false, reason: "Investment not suitable for customer risk profile" };
        }
        return { passed: true };
      }
    });
  }

  // Check all rules for a trade
  async checkTrade(trade: any): Promise<{ approved: boolean; results: any[] }> {
    const results = [];

    for (const rule of this.rules) {
      const result = await rule.checkFunction(trade);
      results.push({
        ruleId: rule.id,
        regulation: rule.regulation,
        ...result
      });

      // Log to audit trail
      this.auditTrail.log({
        eventType: AuditEventType.COMPLIANCE_CHECK,
        severity: result.passed ? AuditSeverity.INFO : AuditSeverity.WARNING,
        timestamp: Date.now(),
        actor: { type: "agent", id: "compliance-checker" },
        action: `compliance_check:${rule.id}`,
        outcome: result.passed ? "success" : "failure",
        details: { tradeId: trade.id, reason: result.reason },
        complianceFlags: [rule.id]
      });
    }

    const approved = results.every(r => r.passed);
    return { approved, results };
  }
}

// Investment agent with compliance
// 具有合规功能的投资智能体
class CompliantInvestmentAgent {
  private complianceChecker: InvestmentComplianceChecker;
  private reviewManager: HumanReviewManager;
  private auditTrail: AuditTrail;

  constructor(auditTrail: AuditTrail, reviewManager: HumanReviewManager) {
    this.auditTrail = auditTrail;
    this.reviewManager = reviewManager;
    this.complianceChecker = new InvestmentComplianceChecker(auditTrail);
  }

  // Execute trade with full compliance checking
  async executeTrade(trade: {
    customerId: string;
    symbol: string;
    quantity: number;
    side: "buy" | "sell";
    price: number;
  }): Promise<{ success: boolean; orderId?: string; message: string }> {
    const tradeId = `trade-${Date.now()}`;

    try {
      // 1. Compliance check
      const complianceResult = await this.complianceChecker.checkTrade({
        ...trade,
        id: tradeId,
        kycVerified: true,
        customerRiskProfile: "moderate",
        riskLevel: "medium"
      });

      if (!complianceResult.approved) {
        const failedRules = complianceResult.results.filter(r => !r.passed);
        const reason = failedRules.map(r => r.reason).join("; ");

        // Log rejection
        this.auditTrail.log({
          eventType: AuditEventType.DECISION_MADE,
          severity: AuditSeverity.WARNING,
          timestamp: Date.now(),
          actor: { type: "agent", id: "investment-agent" },
          action: "trade_rejected",
          outcome: "failure",
          details: { tradeId, reason },
          complianceFlags: failedRules.map(r => r.ruleId)
        });

        return { success: false, message: `Trade rejected: ${reason}` };
      }

      // 2. For high-value trades, require human approval
      const tradeValue = trade.quantity * trade.price;
      if (tradeValue > 100000) {
        const approvalRequest = this.reviewManager.submitRequest({
          agentId: "investment-agent",
          decisionType: "high_value_trade",
          criticality: DecisionCriticality.HIGH,
          proposedAction: `Execute ${trade.side} ${trade.quantity} ${trade.symbol}`,
          justification: `Trade value: $${tradeValue}`,
          supportingData: trade,
          requestedBy: "system",
          requestedAt: Date.now()
        });

        return {
          success: false,
          message: `High-value trade requires approval: ${approvalRequest.id}`
        };
      }

      // 3. Execute trade
      const orderId = `order-${Date.now()}`;

      // Log successful execution
      this.auditTrail.log({
        eventType: AuditEventType.DECISION_MADE,
        severity: AuditSeverity.INFO,
        timestamp: Date.now(),
        actor: { type: "agent", id: "investment-agent" },
        action: "trade_executed",
        outcome: "success",
        details: { orderId, trade },
        complianceFlags: complianceResult.results.map(r => r.ruleId)
      });

      return { success: true, orderId, message: "Trade executed successfully" };

    } catch (error) {
      return { success: false, message: `Trade execution error: ${error}` };
    }
  }
}

// Example: Run investment compliance system
// 示例：运行投资合规系统
async function runInvestmentCompliance() {
  const auditTrail = new AuditTrail();
  const reviewManager = new HumanReviewManager();
  reviewManager.registerReviewer("compliance-officer", "Jane Doe", ["trading", "compliance"]);

  const agent = new CompliantInvestmentAgent(auditTrail, reviewManager);

  console.log("\n=== Investment Compliance System ===\n");

  // Test regular trade
  const result1 = await agent.executeTrade({
    customerId: "cust-123",
    symbol: "AAPL",
    quantity: 100,
    side: "buy",
    price: 150
  });
  console.log("Regular trade:", result1);

  // Test high-value trade
  const result2 = await agent.executeTrade({
    customerId: "cust-456",
    symbol: "GOOGL",
    quantity: 10000,
    side: "buy",
    price: 140
  });
  console.log("High-value trade:", result2);

  // Get compliance report
  console.log("\nCompliance report:", auditTrail.generateReport(new Date(Date.now() - 86400000), new Date()));
}

// Run: 运行
runInvestmentCompliance();
```

---

## Chapter Summary | 本章小结

### Key Points | 核心要点

| Aspect | Description | 描述 |
|--------|-------------|------|

| **Compliance Framework** | Systematic approach to regulatory adherence | 监管遵守的系统方法 |
| **Audit Trail** | Immutable record of all agent actions | 所有智能体操作的不可变记录 |
| **Privacy Protection** | Data minimization, consent management | 数据最小化、同意管理 |
| **Human Oversight** | Required approvals for critical decisions | 关键决策的必要审批 |
| **Reporting** | Automated regulatory report generation | 自动化监管报告生成 |

### Best Practices | 最佳实践

1. **Design for Compliance**: Build compliance into agent architecture from the start, not as an afterthought.

   设计合规：将合规性融入智能体架构，从一开始就考虑，而非事后补救。

2. **Maintain Comprehensive Audit Trails**: Log all significant actions with enough detail for regulatory review.

   维护全面的审计跟踪：记录所有重大操作，并提供足够的细节以供监管审查。

3. **Implement Privacy by Design**: Minimize data collection, implement consent management, and ensure data subject rights.

   实施隐私设计：最小化数据收集，实施同意管理，确保数据主体权利。

4. **Define Clear Escalation Paths**: Establish human review requirements for high-stakes decisions.

   定义明确的升级路径：为高风险决策建立人工审核要求。

5. **Automate Where Possible**: Use automated compliance checking and reporting to reduce human error.

   尽可能自动化：使用自动合规检查和报告来减少人为错误。

### Application Scenarios | 应用场景

| Scenario | Regulations | 应用 |
|----------|-------------|------|

| **Financial Trading** | MiFID II, SEC, FINRA | 金融交易 |
| **Healthcare** | HIPAA, FDA, GDPR | 医疗健康 |
| **E-commerce** | CCPA, consumer protection | 电子商务 |
| **HR Systems** | EEOC, labor laws | 人力资源系统 |
| **Data Processing** | GDPR, LGPD, CCPA | 数据处理 |

### Security Considerations | 安全考虑

- **Regulatory Changes**: Build systems that can adapt to new regulations.

  监管变化：构建能够适应新法规的系统。

- **Cross-Border Compliance**: Handle different requirements for different jurisdictions.

  跨境合规：处理不同管辖区域的不同要求。

- **Audit Readiness**: Ensure systems can produce required documentation on demand.

  审计就绪：确保系统可以按需生成所需文档。