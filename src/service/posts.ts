import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface PostMatter {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  author: string;
  series?: string; // Optional series field
}

function createSlugFromPath(filePath: string, postsDirectory: string): string {
  const relativePath = path.relative(postsDirectory, filePath);
  const pathWithoutExt = relativePath.replace(/\.(mdx?|md)$/, '');
  
  // For Chinese characters and special characters, use a more URL-friendly approach
  return encodeURIComponent(pathWithoutExt.replace(/\//g, '-'));
}

function createDefaultMatter(filePath: string): PostMatter {
  // Extract filename without extension as title
  const fileName = path.basename(filePath, path.extname(filePath));
  const title = fileName.replace(/^\d+\./, '').replace(/-/g, ' '); // Remove number prefix and replace dashes
  
  // Try to extract series from directory name
  const relativePath = path.relative(postsDirectory, filePath);
  const dirName = path.dirname(relativePath);
  const series = dirName !== '.' ? dirName : undefined;
  
  return {
    title,
    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    excerpt: `${title} - 暂无摘要`,
    tags: ['未分类'],
    author: 'Devin',
    series
  };
}

export interface Post {
  slug: string;
  matter: PostMatter;
  content: string;
}

function getAllMarkdownFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

export function getAllPosts(): Post[] {
  const markdownFiles = getAllMarkdownFiles(postsDirectory);
  
  const allPostsData = markdownFiles.map((filePath) => {
    // Generate slug from file path relative to posts directory
    const slug = createSlugFromPath(filePath, postsDirectory);
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Use default matter if frontmatter is missing or incomplete
    const defaultMatter = createDefaultMatter(filePath);
    const finalMatter = {
      title: data.title || defaultMatter.title,
      date: data.date || defaultMatter.date,
      excerpt: data.excerpt || defaultMatter.excerpt,
      tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : defaultMatter.tags,
      author: data.author || defaultMatter.author,
      series: data.series || defaultMatter.series,
    };

    return {
      slug,
      matter: finalMatter,
      content,
    };
  });

  return allPostsData.sort((a, b) => {
    return new Date(b.matter.date).getTime() - new Date(a.matter.date).getTime();
  });
}

export function getPostBySlug(slug: string): Post | null {
  try {
    // Decode the slug for comparison
    const decodedSlug = decodeURIComponent(slug);
    const markdownFiles = getAllMarkdownFiles(postsDirectory);
    
    for (const filePath of markdownFiles) {
      const relativePath = path.relative(postsDirectory, filePath);
      const pathWithoutExt = relativePath.replace(/\.(mdx?|md)$/, '');
      const normalizedPath = pathWithoutExt.replace(/\//g, '-');
      
      // Check both encoded and decoded versions
      if (normalizedPath === decodedSlug || encodeURIComponent(normalizedPath) === slug) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        // Use default matter if frontmatter is missing or incomplete
        const defaultMatter = createDefaultMatter(filePath);
        const finalMatter = {
          title: data.title || defaultMatter.title,
          date: data.date || defaultMatter.date,
          excerpt: data.excerpt || defaultMatter.excerpt,
          tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : defaultMatter.tags,
          author: data.author || defaultMatter.author,
          series: data.series || defaultMatter.series,
        };

        return {
          slug: createSlugFromPath(filePath, postsDirectory),
          matter: finalMatter,
          content,
        };
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  
  posts.forEach(post => {
    post.matter.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): Post[] {
  const posts = getAllPosts();
  return posts.filter(post => 
    post.matter.tags.includes(tag)
  );
}

export interface TagWithCount {
  name: string;
  count: number;
}

export function getTagsWithCounts(): TagWithCount[] {
  const posts = getAllPosts();
  const tagCounts = new Map<string, number>();
  
  posts.forEach(post => {
    post.matter.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export interface SeriesWithCount {
  name: string;
  count: number;
  posts: Post[];
}

export function getAllSeries(): string[] {
  const posts = getAllPosts();
  const series = new Set<string>();
  
  posts.forEach(post => {
    if (post.matter.series) {
      series.add(post.matter.series);
    }
  });
  
  return Array.from(series).sort();
}

export function getSeriesWithCounts(): SeriesWithCount[] {
  const posts = getAllPosts();
  const seriesMap = new Map<string, Post[]>();
  
  posts.forEach(post => {
    if (post.matter.series) {
      if (!seriesMap.has(post.matter.series)) {
        seriesMap.set(post.matter.series, []);
      }
      seriesMap.get(post.matter.series)!.push(post);
    }
  });
  
  return Array.from(seriesMap.entries())
    .map(([name, posts]) => ({
      name,
      count: posts.length,
      posts: posts.sort((a, b) => new Date(a.matter.date).getTime() - new Date(b.matter.date).getTime())
    }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsBySeries(series: string): Post[] {
  const posts = getAllPosts();
  return posts
    .filter(post => post.matter.series === series)
    .sort((a, b) => new Date(a.matter.date).getTime() - new Date(b.matter.date).getTime());
}