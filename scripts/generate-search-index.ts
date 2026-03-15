import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

interface SearchIndexItem {
    slug: string;
    title: string;
    excerpt: string;
    tags: string[];
    date: string;
    series?: string;
    content: string;
}

function getAllMarkdownFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
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

function stripMarkdown(content: string): string {
    return content
        // Remove frontmatter
        .replace(/^---[\s\S]*?---\n?/, '')
        // Remove import statements
        .replace(/^import\s+.*$/gm, '')
        // Remove JSX/HTML tags
        .replace(/<[^>]+>/g, '')
        // Remove markdown images
        .replace(/!\[.*?\]\(.*?\)/g, '')
        // Remove markdown links but keep text
        .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
        // Remove headers markers
        .replace(/^#{1,6}\s+/gm, '')
        // Remove bold/italic
        .replace(/[*_]{1,3}(.*?)[*_]{1,3}/g, '$1')
        // Remove code blocks
        .replace(/```[\s\S]*?```/g, '')
        // Remove inline code
        .replace(/`([^`]*)`/g, '$1')
        // Remove blockquotes
        .replace(/^>\s+/gm, '')
        // Remove horizontal rules
        .replace(/^[-*_]{3,}$/gm, '')
        // Remove admonition syntax
        .replace(/^:::\w+.*$/gm, '')
        .replace(/^:::$/gm, '')
        // Collapse whitespace
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function createSlugFromPath(filePath: string): string {
    const relativePath = path.relative(postsDirectory, filePath);
    const pathWithoutExt = relativePath.replace(/\.(mdx?|md)$/, '');
    return encodeURIComponent(pathWithoutExt.replace(/\//g, '-'));
}

function generate(): void {
    const markdownFiles = getAllMarkdownFiles(postsDirectory);

    const index: SearchIndexItem[] = markdownFiles.map((filePath) => {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        const relativePath = path.relative(postsDirectory, filePath);
        const dirName = path.dirname(relativePath);
        const fileName = path.basename(filePath, path.extname(filePath));
        const defaultTitle = fileName.replace(/^\d+\./, '').replace(/-/g, ' ');

        const slug = createSlugFromPath(filePath);
        const plainContent = stripMarkdown(content).slice(0, 500);

        return {
            slug,
            title: data.title || defaultTitle,
            excerpt: data.excerpt || `${defaultTitle} - 暂无摘要`,
            tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : ['未分类'],
            date: data.date ? String(data.date).split('T')[0] : new Date().toISOString().split('T')[0],
            series: data.series || (dirName !== '.' ? dirName : undefined),
            content: plainContent,
        };
    });

    // Sort by date descending
    index.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const outputPath = path.join(process.cwd(), 'public/search-index.json');
    fs.writeFileSync(outputPath, JSON.stringify(index));

    console.log(`Search index generated: ${index.length} posts -> ${outputPath}`);
}

generate();
