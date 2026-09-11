import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { getAuthorAvatar } from './authors';
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
  return fs
    .readdirSync(articlesDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}

export interface Author {
  name: string;
  affiliation?: string;
  avatar?: string;
}

export interface ArticleFrontmatter {
  title?: string;
  date?: string;
  tags?: string[];
  description?: string;
  authors?: Author[];
  author?: string;
  author_affiliation?: string;
  [key: string]: unknown;
}

function extractTags(data: Record<string, unknown>): string[] {
  const rawTags = data.tags ?? data.category ?? data.categories ?? data.tag;
  if (Array.isArray(rawTags)) {
    return rawTags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof rawTags === 'string' && rawTags.trim()) {
    return rawTags.includes(',')
      ? rawTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [rawTags.trim()];
  }
  return [];
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

  const tags = extractTags(data as Record<string, unknown>);

  const rawAuthors: Author[] = Array.isArray(data.authors)
    ? data.authors
    : data.author
      ? [{ name: data.author, affiliation: data.author_affiliation ?? '' }]
      : [];

  const authors = rawAuthors.map((a) => ({
    ...a,
    avatar: a.avatar || getAuthorAvatar(a.name) || undefined,
  }));

  return {
    slug,
    frontmatter: {
      ...data,
      tags,
      authors,
      author: data.author ?? (Array.isArray(data.authors) ? data.authors[0]?.name : ''),
      author_affiliation:
        data.author_affiliation ??
        (Array.isArray(data.authors) ? data.authors[0]?.affiliation : ''),
    },
    contentHtml,
  };
}

// Type for article index entries
export interface ArticleIndexEntry {
  date: string;
  tags?: string[];
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
  const posts = entries.map((entry) => {
    const tags = extractTags(entry as unknown as Record<string, unknown>);
    const rawAuthors =
      entry.authors ??
      (entry.author ? [{ name: entry.author, affiliation: entry.author_affiliation }] : []);
    const authors = rawAuthors.map((a) => ({
      ...a,
      avatar: a.avatar || getAuthorAvatar(a.name) || undefined,
    }));

    return {
      slug: entry.slug,
      frontmatter: {
        date: entry.date,
        tags,
        title: entry.title,
        description: entry.description,
        authors,
        author: entry.author ?? entry.authors?.[0]?.name ?? '',
        author_affiliation: entry.author_affiliation ?? entry.authors?.[0]?.affiliation ?? '',
      },
    };
  });

  // Sort by date (newest first)
  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
}

import { formatResearchDate as formatArticleDate } from './date-utils';

export { formatArticleDate };
