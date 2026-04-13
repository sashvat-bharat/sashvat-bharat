/**
 * generate-research-index.mjs
 *
 * Scans every .md file inside content/research/, extracts the YAML
 * frontmatter, and writes a lightweight JSON index to content/research.json.
 *
 * This runs automatically before `pnpm dev` and `pnpm build` via the
 * predev / prebuild hooks in package.json, so the listing page never
 * touches the raw markdown files.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const RESEARCH_DIR = path.join(process.cwd(), 'content', 'research');
const OUTPUT_PATH  = path.join(process.cwd(), 'content', 'research.json');

function generate() {
    // Ensure the research directory exists
    if (!fs.existsSync(RESEARCH_DIR)) {
        console.log('[generate-research-index] content/research/ not found — writing empty index.');
        fs.writeFileSync(OUTPUT_PATH, '[]', 'utf8');
        return;
    }

    const files = fs.readdirSync(RESEARCH_DIR).filter((f) => f.endsWith('.md'));

    const entries = files.map((file) => {
        const slug = file.replace(/\.md$/, '');
        const raw  = fs.readFileSync(path.join(RESEARCH_DIR, file), 'utf8');
        const { data } = matter(raw);

        return {
            slug,
            title:              data.title       ?? '',
            date:               data.date        ?? '',
            description:        data.description ?? '',
            author:             data.author      ?? undefined,
            author_affiliation: data.author_affiliation ?? undefined,
        };
    });

    // Sort newest-first so consumers don't have to
    entries.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2) + '\n', 'utf8');

    console.log(
        `[generate-research-index] Wrote ${entries.length} entry(s) → content/research.json`
    );
}

generate();
