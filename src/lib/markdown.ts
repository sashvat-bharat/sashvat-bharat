import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const researchDir = path.join(process.cwd(), 'content/research');

// Fetch all slugs for static generation
export function getResearchSlugs() {
    return fs.readdirSync(researchDir).map((file) => file.replace(/\.md$/, ''));
}

// Fetch single post content + parse to HTML
export async function getResearchBySlug(slug: string) {
    const fullPath = path.join(researchDir, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Parse frontmatter (title, date, description)
    const { data, content } = matter(fileContents);

    // Parse Markdown to HTML
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

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
            frontmatter: data as { title: string; date: string; description: string },
        };
    });

    // Sort them by date (newest first)
    return posts.sort((a, b) =>
        new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
}