import { NextResponse } from 'next/server';
import { getAllPosts, getAllSeries, getAllTags } from '@/service/posts';

export async function GET() {
  const posts = getAllPosts();
  const series = getAllSeries();
  const tags = getAllTags();
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  const currentDate = new Date().toISOString();
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 主页 -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 文章列表页 -->
  <url>
    <loc>${baseUrl}/posts</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- 标签页 -->
  <url>
    <loc>${baseUrl}/tags</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- 系列页 -->
  <url>
    <loc>${baseUrl}/series</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- 关于页 -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- 文章页面 -->
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/posts/${post.slug}</loc>
    <lastmod>${new Date(post.matter.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
  
  <!-- 标签页面 -->
  ${tags.map(tag => `
  <url>
    <loc>${baseUrl}/tags/${encodeURIComponent(tag)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  
  <!-- 系列页面 -->
  ${series.map(seriesName => `
  <url>
    <loc>${baseUrl}/series/${encodeURIComponent(seriesName)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}