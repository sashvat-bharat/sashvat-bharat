import fs from 'fs';
import path from 'path';
import { MarkdownParser } from './markdown-parser';

const parser = new MarkdownParser({
    headingIds: true,
    gfm: true,
    extendedSyntax: true,
});

export function getLegalMarkdown(filename: string): string {
  const filePath = path.join(process.cwd(), 'content/legal', filename);
  if (!fs.existsSync(filePath)) {
    return '<p>Document not found</p>';
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return parser.parse(content);
}

export function getMarkdownContent(filename: string): string {
  const filePath = path.join(process.cwd(), 'content', filename);
  if (!fs.existsSync(filePath)) {
    return '<p>Document not found</p>';
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return parser.parse(content);
}
