'use client';

import { useEffect, useState } from 'react';
import { MermaidProps } from 'mdx-mermaid/lib/Mermaid';
import dynamic from 'next/dynamic';

// 创建一个包装器来处理 mounted 状态
const MermaidWrapper = ({ chart, config: configSrc }: MermaidProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        suppressHydrationWarning={true}
        style={{
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '4px',
        }}
      >
        Preparing diagram...
      </div>
    );
  }

  return <MermaidComponent chart={chart} config={configSrc} />;
};

const MermaidComponent = dynamic(
  () => import('mdx-mermaid/lib/Mermaid').then((mod) => ({ default: mod.Mermaid })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '4px',
        }}
      >
        Loading diagram...
      </div>
    ),
  },
);

export const Mermaid = (props: MermaidProps) => {
  return (
    <div suppressHydrationWarning={true}>
      <MermaidWrapper {...props} />
    </div>
  );
};

export default Mermaid;
