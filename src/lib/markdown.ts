import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { getAuthorAvatar } from './authors';
import { MarkdownParser } from './markdown-parser';

const researchDir = path.join(process.cwd(), 'content/research');
const parser = new MarkdownParser({
  headingIds: true,
  gfm: true,
  extendedSyntax: true,
});

// Fetch all slugs for static generation
export function getResearchSlugs() {
  if (!fs.existsSync(researchDir)) return [];
  return fs
    .readdirSync(researchDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}

export interface Author {
  name: string;
  affiliation?: string;
  avatar?: string;
}

export interface ResearchFrontmatter {
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
  const rawCat = data.tags ?? data.categories ?? data.category ?? data.tag;
  if (Array.isArray(rawCat)) {
    return rawCat.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof rawCat === 'string' && rawCat.trim()) {
    return rawCat.includes(',')
      ? rawCat
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [rawCat.trim()];
  }
  return [];
}

// Fetch single post content + parse to HTML
export async function getResearchBySlug(slug: string): Promise<{
  slug: string;
  frontmatter: ResearchFrontmatter;
  contentHtml: string;
}> {
  const fullPath = path.join(researchDir, `${slug}.md`);
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

// Type for research index entries
export interface ResearchIndexEntry {
  date: string;
  tags?: string[];
  slug: string;
  title: string;
  description: string;
  authors?: Author[];
  author?: string;
  author_affiliation?: string;
}

const researchIndexPath = path.join(process.cwd(), 'content', 'research.json');

// Read the lightweight JSON index instead of scanning & parsing all markdown files.
// Markdown is only loaded when a user navigates to a specific post via getResearchBySlug().
export function getAllResearchList() {
  if (!fs.existsSync(researchIndexPath)) return [];

  const raw = fs.readFileSync(researchIndexPath, 'utf8');
  const entries: ResearchIndexEntry[] = JSON.parse(raw);

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

import { formatResearchDate } from './date-utils';

export { formatResearchDate };
