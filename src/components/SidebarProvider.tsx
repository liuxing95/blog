import { getAllPosts } from '@/service/posts';
import Sidebar from './Sidebar';
import type { Post } from '@/service/posts';

interface TagWithPosts {
  tag: string;
  posts: Post[];
}

export default function SidebarProvider() {
  const posts = getAllPosts();

  // Group posts by tags
  const tagMap = new Map<string, Post[]>();

  posts.forEach((post) => {
    post.matter.tags.forEach((tag) => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      tagMap.get(tag)!.push(post);
    });
  });

  // Convert to array and sort by post count (descending) and tag name
  const taggedPosts: TagWithPosts[] = Array.from(tagMap.entries())
    .map(([tag, posts]) => ({
      tag,
      posts: posts.sort((a, b) =>
        new Date(b.matter.date).getTime() - new Date(a.matter.date).getTime()
      ),
    }))
    .sort((a, b) => {
      // Sort by post count first (descending), then by tag name
      if (b.posts.length !== a.posts.length) {
        return b.posts.length - a.posts.length;
      }
      return a.tag.localeCompare(b.tag, 'zh-CN');
    });

  return <Sidebar taggedPosts={taggedPosts} />;
}
