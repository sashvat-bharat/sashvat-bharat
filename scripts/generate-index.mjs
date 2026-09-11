/**
 * generate-index.mjs
 *
 * Scans every .md file inside content/research/ and content/articles/,
 * extracts the YAML frontmatter, and writes lightweight JSON indexes
 * to content/research.json and content/articles.json.
 *
 * This runs automatically before `pnpm dev` and `pnpm build` via the
 * predev / prebuild hooks in package.json, so listing pages never
 * touch raw markdown files.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

function loadAuthorsMap() {
  const authorsJsonPath = path.join(process.cwd(), 'content', 'authors.json');
  if (!fs.existsSync(authorsJsonPath)) return {};
  try {
    const raw = JSON.parse(fs.readFileSync(authorsJsonPath, 'utf8'));
    const map = {};
    const extRegex = /\.(jpe?g|png|webp|avif|svg)$/i;

    for (const [key, val] of Object.entries(raw)) {
      if (!key || !val) continue;
      const k = key.trim();
      const v = val.trim();
      if (extRegex.test(k)) {
        map[v.toLowerCase()] = `/peoples/${k.replace(/^\/+/, '')}`;
      } else if (extRegex.test(v)) {
        map[k.toLowerCase()] = `/peoples/${v.replace(/^\/+/, '')}`;
      } else {
        map[k.toLowerCase()] = v.startsWith('/') ? v : `/peoples/${v}`;
      }
    }
    return map;
  } catch {
    return {};
  }
}

function buildIndex(dirPath, outputPath, label) {
  if (!fs.existsSync(dirPath)) {
    console.log(
      `[generate-index] ${label} directory not found (${dirPath}) — writing empty index.`,
    );
    fs.writeFileSync(outputPath, '[]\n', 'utf8');
    return;
  }

  const authorsMap = loadAuthorsMap();
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.md'));

  const entries = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(dirPath, file), 'utf8');
    const { data } = matter(raw);

    let authors = [];
    if (Array.isArray(data.authors)) {
      authors = data.authors.map((a) => {
        const name = a.name ?? '';
        const avatar = a.avatar ?? authorsMap[name.trim().toLowerCase()] ?? '';
        return {
          name,
          affiliation: a.affiliation ?? '',
          avatar,
        };
      });
    } else if (data.author) {
      const name = data.author;
      const avatar = data.avatar ?? authorsMap[name.trim().toLowerCase()] ?? '';
      authors = [
        {
          name,
          affiliation: data.author_affiliation ?? '',
          avatar,
        },
      ];
    }

    // Support single string, comma-separated string, or array of tags/categories
    const rawTags = data.tags ?? data.category ?? data.categories ?? data.tag;
    let tags = [];
    if (Array.isArray(rawTags)) {
      tags = rawTags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof rawTags === 'string' && rawTags.trim()) {
      tags = rawTags.includes(',')
        ? rawTags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [rawTags.trim()];
    }

    return {
      date: data.date ?? '',
      tags,
      slug,
      title: data.title ?? '',
      description: data.description ?? '',
      authors,
    };
  });

  // Sort newest-first so consumers don't have to
  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  fs.writeFileSync(outputPath, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');

  console.log(
    `[generate-index] Wrote ${entries.length} ${label} entry(s) → ${path.relative(process.cwd(), outputPath)}`,
  );
}

function generate() {
  buildIndex(
    path.join(process.cwd(), 'content', 'research'),
    path.join(process.cwd(), 'content', 'research.json'),
    'research',
  );
  buildIndex(
    path.join(process.cwd(), 'content', 'articles'),
    path.join(process.cwd(), 'content', 'articles.json'),
    'articles',
  );
}

generate();
