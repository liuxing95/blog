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
}

export interface Post {
  slug: string;
  matter: PostMatter;
  content: string;
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        matter: data as PostMatter,
        content,
      };
    });

  return allPostsData.sort((a, b) => {
    return new Date(b.matter.date).getTime() - new Date(a.matter.date).getTime();
  });
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      matter: data as PostMatter,
      content,
    };
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