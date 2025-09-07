'use client';

import React from 'react';

// 支持的 admonition 类型
export const ADMONITION_TYPES = ['note', 'tip', 'info', 'warning', 'danger'] as const;
export type AdmonitionType = (typeof ADMONITION_TYPES)[number];

// 默认标题映射
const DEFAULT_TITLES: Record<AdmonitionType, string> = {
  note: '📝 Note',
  tip: '💡 Tip',
  info: 'ℹ️ Info',
  warning: '⚠️ Warning',
  danger: '🚨 Danger',
};

// CSS 类映射
const ADMONITION_CLASSES: Record<AdmonitionType, string> = {
  note: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
  tip: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
  info: 'border-cyan-200 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-900/20',
  warning: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
  danger: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
};

// 标题颜色映射
const ADMONITION_TITLE_CLASSES: Record<AdmonitionType, string> = {
  note: 'text-blue-800 dark:text-blue-200',
  tip: 'text-green-800 dark:text-green-200',
  info: 'text-cyan-800 dark:text-cyan-200',
  warning: 'text-yellow-800 dark:text-yellow-200',
  danger: 'text-red-800 dark:text-red-200',
};

export interface AdmonitionProps {
  type: AdmonitionType;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Admonition({ type, title, children, className = '' }: AdmonitionProps) {
  const displayTitle = title || DEFAULT_TITLES[type];

  return (
    <div
      className={`admonition admonition-${type} border-l-4 p-4 mb-4 rounded-r-lg ${ADMONITION_CLASSES[type]} ${className}`}
      data-admonition-type={type}
    >
      <div
        className={`admonition-title font-semibold mb-2 flex items-center gap-2 ${ADMONITION_TITLE_CLASSES[type]}`}
      >
        {displayTitle}
      </div>
      {children && (
        <div className="admonition-content prose prose-sm max-w-none dark:prose-invert">
          {children}
        </div>
      )}
    </div>
  );
}

// 为每种类型创建便捷组件
export function Note({ title, children, className }: Omit<AdmonitionProps, 'type'>) {
  return (
    <Admonition type="note" title={title} className={className}>
      {children}
    </Admonition>
  );
}

export function Tip({ title, children, className }: Omit<AdmonitionProps, 'type'>) {
  return (
    <Admonition type="tip" title={title} className={className}>
      {children}
    </Admonition>
  );
}

export function Info({ title, children, className }: Omit<AdmonitionProps, 'type'>) {
  return (
    <Admonition type="info" title={title} className={className}>
      {children}
    </Admonition>
  );
}

export function Warning({ title, children, className }: Omit<AdmonitionProps, 'type'>) {
  return (
    <Admonition type="warning" title={title} className={className}>
      {children}
    </Admonition>
  );
}

export function Danger({ title, children, className }: Omit<AdmonitionProps, 'type'>) {
  return (
    <Admonition type="danger" title={title} className={className}>
      {children}
    </Admonition>
  );
}
