import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MarkdownParser } from './markdown-parser';

const articlesDir = path.join(process.cwd(), 'content/articles');
const parser = new MarkdownParser({
    headingIds: true,
    gfm: true,
    extendedSyntax: true,
});

// Fetch all slugs for static generation
export function getArticlesSlugs() {
    if (!fs.existsSync(articlesDir)) return [];
    return fs.readdirSync(articlesDir)
        .filter((file) => file.endsWith('.md'))
        .map((file) => file.replace(/\.md$/, ''));
}

export interface Author {
    name: string;
    affiliation?: string;
}

export interface ArticleFrontmatter {
    title?: string;
    date?: string;
    category?: string;
    description?: string;
    authors?: Author[];
    author?: string;
    author_affiliation?: string;
    [key: string]: unknown;
}

// Fetch single post content + parse to HTML
export async function getArticleBySlug(slug: string): Promise<{
    slug: string;
    frontmatter: ArticleFrontmatter;
    contentHtml: string;
}> {
    const fullPath = path.join(articlesDir, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
        return {
            slug,
            frontmatter: {
                authors: [],
                author: '',
                author_affiliation: '',
            },
            contentHtml: '<p>Content not found</p>',
        };
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Parse frontmatter (title, date, description)
    const { data, content } = matter(fileContents);

    // Parse Markdown to HTML using our custom parser
    const contentHtml = parser.parse(content);

    return {
        slug,
        frontmatter: {
            ...data,
            category: data.category ?? '',
            authors: Array.isArray(data.authors)
                ? data.authors
                : data.author
                ? [{ name: data.author, affiliation: data.author_affiliation ?? '' }]
                : [],
            author: data.author ?? (Array.isArray(data.authors) ? data.authors[0]?.name : ''),
            author_affiliation: data.author_affiliation ?? (Array.isArray(data.authors) ? data.authors[0]?.affiliation : ''),
        },
        contentHtml,
    };
}

// Type for article index entries
export interface ArticleIndexEntry {
    date: string;
    category: string;
    slug: string;
    title: string;
    description: string;
    authors?: Author[];
    author?: string;
    author_affiliation?: string;
}

const articlesIndexPath = path.join(process.cwd(), 'content', 'articles.json');

// Read the lightweight JSON index instead of scanning & parsing all markdown files.
export function getAllArticlesList() {
    if (!fs.existsSync(articlesIndexPath)) return [];

    const raw = fs.readFileSync(articlesIndexPath, 'utf8');
    const entries: ArticleIndexEntry[] = JSON.parse(raw);

    // Wrap into the same shape the page component expects
    const posts = entries.map((entry) => ({
        slug: entry.slug,
        frontmatter: {
            date: entry.date,
            category: entry.category ?? '',
            title: entry.title,
            description: entry.description,
            authors: entry.authors ?? (entry.author ? [{ name: entry.author, affiliation: entry.author_affiliation }] : []),
            author: entry.author ?? entry.authors?.[0]?.name ?? '',
            author_affiliation: entry.author_affiliation ?? entry.authors?.[0]?.affiliation ?? '',
        },
    }));

    // Sort by date (newest first)
    return posts.sort((a, b) =>
        new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
}

import { formatResearchDate as formatArticleDate } from './date-utils';
export { formatArticleDate };
