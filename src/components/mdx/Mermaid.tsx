'use client';
import dynamic from 'next/dynamic';

const MermaidComponent = dynamic(
  () => import('mdx-mermaid/lib/Mermaid').then((mod) => ({ default: mod.Mermaid })),
  {
    ssr: false,
    loading: () => <p>Loading diagram...</p>,
  },
);

export default MermaidComponent;
