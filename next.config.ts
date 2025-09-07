import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import withPWA from 'next-pwa';

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      'remark-directive',
      './src/extensions/admonitions/index.ts',
      ['mdx-mermaid', { output: 'svg' }],
    ],
    rehypePlugins: ['rehype-raw'],
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === 'development',
  disable: false,
  sw: 'sw.js',
  publicExcludes: ['!robots.txt', '!sitemap.xml'],
});

// @ts-ignore
export default pwaConfig(withMDX(nextConfig));
