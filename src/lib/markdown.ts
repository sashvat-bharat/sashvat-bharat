import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
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
    return fs.readdirSync(researchDir).map((file) => file.replace(/\.md$/, ''));
}

// Fetch single post content + parse to HTML
export async function getResearchBySlug(slug: string) {
    const fullPath = path.join(researchDir, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
        return {
            slug,
            frontmatter: {},
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
        frontmatter: data,
        contentHtml,
    };
}

// Add this inside lib/markdown.ts
export function getAllResearchList() {
    const slugs = getResearchSlugs();

    const posts = slugs.map((slug) => {
        const fullPath = path.join(researchDir, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
            slug,
            frontmatter: data as { 
                title: string; 
                date: string; 
                description: string;
                author?: string;
                author_affiliation?: string;
            },
        };
    });

    // Sort them by date (newest first)
    return posts.sort((a, b) =>
        new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
}