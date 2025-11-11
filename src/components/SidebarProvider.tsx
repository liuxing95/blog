import { getAllPosts } from '@/service/posts';
import Sidebar from './Sidebar';
import type { Post } from '@/service/posts';

interface TagNode {
  name: string;
  children: Map<string, TagNode>;
  posts: Post[];
  level: number;
}

function createTagNode(name: string, level: number): TagNode {
  return {
    name,
    children: new Map(),
    posts: [],
    level,
  };
}

export default function SidebarProvider() {
  const posts = getAllPosts();

  // Build hierarchical tag tree
  const rootNode = createTagNode('', 0);

  posts.forEach((post) => {
    const tags = post.matter.tags;

    if (tags.length === 0) {
      // Posts without tags go to root level
      rootNode.posts.push(post);
      return;
    }

    // Navigate/create the tag hierarchy
    let currentNode = rootNode;

    tags.forEach((tag, index) => {
      const normalizedTag = tag.trim();

      if (!currentNode.children.has(normalizedTag)) {
        currentNode.children.set(normalizedTag, createTagNode(normalizedTag, index + 1));
      }

      currentNode = currentNode.children.get(normalizedTag)!;
    });

    // Add post to the deepest level
    currentNode.posts.push(post);
  });

  // Sort posts by date within each node (recursively)
  function sortNodePosts(node: TagNode) {
    node.posts.sort((a, b) =>
      new Date(b.matter.date).getTime() - new Date(a.matter.date).getTime()
    );

    node.children.forEach((childNode) => sortNodePosts(childNode));
  }

  sortNodePosts(rootNode);

  return <Sidebar tagTree={rootNode} />;
}
