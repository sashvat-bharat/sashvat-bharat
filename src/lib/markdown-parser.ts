// ─────────────────────────────────────────────────────────────────────────────
// Sashvat Bharat — Custom Markdown Parser
// A fully type-safe, zero-dependency Markdown → HTML parser.
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
// §1  TYPE DEFINITIONS — AST Node Types
// ═══════════════════════════════════════════════════════════════════════════════

/** All supported block-level node types */
export type BlockNodeType =
    | 'heading'
    | 'paragraph'
    | 'code_block'
    | 'blockquote'
    | 'horizontal_rule'
    | 'unordered_list'
    | 'ordered_list'
    | 'table'
    | 'definition_list'
    | 'footnote_definition'
    | 'html_block'
    | 'empty';

/** All supported inline node types */
export type InlineNodeType =
    | 'text'
    | 'bold'
    | 'italic'
    | 'bold_italic'
    | 'underline'
    | 'strikethrough'
    | 'highlight'
    | 'inline_code'
    | 'link'
    | 'image'
    | 'line_break'
    | 'footnote_ref'
    | 'superscript'
    | 'subscript'
    | 'emoji'
    | 'html_inline';

// ── Inline nodes ─────────────────────────────────────────────────────────────

export interface TextNode {
    type: 'text';
    content: string;
}

export interface BoldNode {
    type: 'bold';
    children: InlineNode[];
}

export interface ItalicNode {
    type: 'italic';
    children: InlineNode[];
}

export interface BoldItalicNode {
    type: 'bold_italic';
    children: InlineNode[];
}

export interface UnderlineNode {
    type: 'underline';
    children: InlineNode[];
}

export interface StrikethroughNode {
    type: 'strikethrough';
    children: InlineNode[];
}

export interface HighlightNode {
    type: 'highlight';
    children: InlineNode[];
}

export interface InlineCodeNode {
    type: 'inline_code';
    content: string;
}

export interface LinkNode {
    type: 'link';
    href: string;
    title?: string;
    children: InlineNode[];
}

export interface ImageNode {
    type: 'image';
    src: string;
    alt: string;
    title?: string;
}

export interface LineBreakNode {
    type: 'line_break';
}

export interface FootnoteRefNode {
    type: 'footnote_ref';
    id: string;
}

export interface SuperscriptNode {
    type: 'superscript';
    children: InlineNode[];
}

export interface SubscriptNode {
    type: 'subscript';
    children: InlineNode[];
}

export interface EmojiNode {
    type: 'emoji';
    name: string;
    unicode: string;
}

export interface HtmlInlineNode {
    type: 'html_inline';
    content: string;
}

export type InlineNode =
    | TextNode
    | BoldNode
    | ItalicNode
    | BoldItalicNode
    | UnderlineNode
    | StrikethroughNode
    | HighlightNode
    | InlineCodeNode
    | LinkNode
    | ImageNode
    | LineBreakNode
    | FootnoteRefNode
    | SuperscriptNode
    | SubscriptNode
    | EmojiNode
    | HtmlInlineNode;

// ── Block nodes ──────────────────────────────────────────────────────────────

export interface HeadingNode {
    type: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children: InlineNode[];
    id: string; // auto-generated slug for anchor links
}

export interface ParagraphNode {
    type: 'paragraph';
    children: InlineNode[];
}

export interface CodeBlockNode {
    type: 'code_block';
    language: string;
    content: string;
    meta?: string; // optional metadata after language (e.g. filename)
}

export interface BlockquoteNode {
    type: 'blockquote';
    children: BlockNode[]; // supports nesting
}

export interface HorizontalRuleNode {
    type: 'horizontal_rule';
}

export interface ListItemNode {
    children: InlineNode[];
    subList?: UnorderedListNode | OrderedListNode;
    checked?: boolean; // for task lists: true = checked, false = unchecked, undefined = not a task
}

export interface UnorderedListNode {
    type: 'unordered_list';
    items: ListItemNode[];
}

export type OrderedListStyle = 'numeric' | 'alpha-lower' | 'alpha-upper' | 'roman-lower' | 'roman-upper';

export interface OrderedListNode {
    type: 'ordered_list';
    start: number;
    style: OrderedListStyle;
    items: ListItemNode[];
}

export interface TableAlignment {
    align: 'left' | 'center' | 'right' | 'none';
}

export interface TableNode {
    type: 'table';
    headers: InlineNode[][];
    alignments: TableAlignment[];
    rows: InlineNode[][][];
}

export interface DefinitionListNode {
    type: 'definition_list';
    items: Array<{
        term: InlineNode[];
        definitions: InlineNode[][];
    }>;
}

export interface FootnoteDefinitionNode {
    type: 'footnote_definition';
    id: string;
    children: BlockNode[];
}

export interface HtmlBlockNode {
    type: 'html_block';
    content: string;
}

export interface EmptyNode {
    type: 'empty';
}

export type BlockNode =
    | HeadingNode
    | ParagraphNode
    | CodeBlockNode
    | BlockquoteNode
    | HorizontalRuleNode
    | UnorderedListNode
    | OrderedListNode
    | TableNode
    | DefinitionListNode
    | FootnoteDefinitionNode
    | HtmlBlockNode
    | EmptyNode;

// ── Document root ────────────────────────────────────────────────────────────

export interface MarkdownDocument {
    children: BlockNode[];
    footnotes: Map<string, FootnoteDefinitionNode>;
}

// ── Parser options ───────────────────────────────────────────────────────────

export interface MarkdownParserOptions {
    /** Generate heading IDs for anchor links (default: true) */
    headingIds?: boolean;
    /** Enable GitHub-Flavored Markdown extensions: tables, task lists, strikethrough (default: true) */
    gfm?: boolean;
    /** Enable extended syntax: highlight, underline, superscript, subscript, footnotes (default: true) */
    extendedSyntax?: boolean;
    /** Sanitize raw HTML in output (default: false) */
    sanitizeHtml?: boolean;
    /** Custom CSS class prefix for generated elements */
    classPrefix?: string;
}

const DEFAULT_OPTIONS: Required<MarkdownParserOptions> = {
    headingIds: true,
    gfm: true,
    extendedSyntax: true,
    sanitizeHtml: false,
    classPrefix: 'md',
};


// ═══════════════════════════════════════════════════════════════════════════════
// §2  EMOJI MAP (common shortcodes)
// ═══════════════════════════════════════════════════════════════════════════════

const EMOJI_MAP: Record<string, string> = {
    smile: '😄', laughing: '😆', blush: '😊', heart_eyes: '😍',
    thinking: '🤔', thumbsup: '👍', thumbsdown: '👎', clap: '👏',
    fire: '🔥', rocket: '🚀', star: '⭐', check: '✅',
    x: '❌', warning: '⚠️', info: 'ℹ️', bulb: '💡',
    heart: '❤️', broken_heart: '💔', wave: '👋', pray: '🙏',
    eyes: '👀', tada: '🎉', sparkles: '✨', zap: '⚡',
    bug: '🐛', wrench: '🔧', lock: '🔒', key: '🔑',
    book: '📖', memo: '📝', link: '🔗', globe: '🌍',
    sun: '☀️', moon: '🌙', cloud: '☁️', umbrella: '☂️',
    coffee: '☕', beer: '🍺', pizza: '🍕', apple: '🍎',
    hundred: '💯', muscle: '💪', ok_hand: '👌', v: '✌️',
    point_up: '☝️', point_down: '👇', point_left: '👈', point_right: '👉',
};


// ═══════════════════════════════════════════════════════════════════════════════
// §3  UTILITY HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Escape HTML special characters */
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** Generate a URL-safe slug from heading text */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

/** Extract raw text from an array of inline nodes (for slugification, etc.) */
function extractText(nodes: InlineNode[]): string {
    return nodes
        .map((node) => {
            switch (node.type) {
                case 'text':
                    return node.content;
                case 'inline_code':
                    return node.content;
                case 'bold':
                case 'italic':
                case 'bold_italic':
                case 'underline':
                case 'strikethrough':
                case 'highlight':
                case 'superscript':
                case 'subscript':
                    return extractText(node.children);
                case 'link':
                    return extractText(node.children);
                case 'image':
                    return node.alt;
                case 'emoji':
                    return node.unicode;
                case 'footnote_ref':
                    return '';
                case 'line_break':
                    return '';
                case 'html_inline':
                    return '';
            }
        })
        .join('');
}

/** Detect ordered-list style from the marker text */
function detectListStyle(marker: string): { style: OrderedListStyle; start: number } {
    const trimmed = marker.replace(/[.)]\s*$/, '').trim();

    // Numeric: 1, 2, 3...
    if (/^\d+$/.test(trimmed)) {
        return { style: 'numeric', start: parseInt(trimmed, 10) };
    }
    // Lowercase alpha: a, b, c...
    if (/^[a-z]$/.test(trimmed)) {
        return { style: 'alpha-lower', start: trimmed.charCodeAt(0) - 96 };
    }
    // Uppercase alpha: A, B, C...
    if (/^[A-Z]$/.test(trimmed)) {
        return { style: 'alpha-upper', start: trimmed.charCodeAt(0) - 64 };
    }
    // Lowercase roman: i, ii, iii, iv...
    if (/^[ivxlcdm]+$/.test(trimmed)) {
        return { style: 'roman-lower', start: romanToInt(trimmed) };
    }
    // Uppercase roman: I, II, III, IV...
    if (/^[IVXLCDM]+$/.test(trimmed)) {
        return { style: 'roman-upper', start: romanToInt(trimmed.toLowerCase()) };
    }

    return { style: 'numeric', start: 1 };
}

/** Convert a roman numeral string to integer */
function romanToInt(s: string): number {
    const map: Record<string, number> = {
        i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000,
    };
    let result = 0;
    for (let i = 0; i < s.length; i++) {
        const current = map[s[i]] ?? 0;
        const next = map[s[i + 1]] ?? 0;
        if (current < next) {
            result -= current;
        } else {
            result += current;
        }
    }
    return result || 1;
}


// ═══════════════════════════════════════════════════════════════════════════════
// §4  INLINE PARSER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parses inline Markdown content into an array of InlineNodes.
 * Handles: bold, italic, bold+italic, underline (++text++), strikethrough (~~text~~),
 * highlight (==text==), inline code (`code`), links, images, footnote refs,
 * superscript (^text^), subscript (~text~), emojis (:name:), HTML inline tags,
 * line breaks (two trailing spaces or `\`), and escaped characters.
 */
class InlineParser {
    private options: Required<MarkdownParserOptions>;

    constructor(options: Required<MarkdownParserOptions>) {
        this.options = options;
    }

    parse(input: string): InlineNode[] {
        const nodes: InlineNode[] = [];
        let i = 0;
        let textBuffer = '';

        const flushText = () => {
            if (textBuffer.length > 0) {
                nodes.push({ type: 'text', content: textBuffer });
                textBuffer = '';
            }
        };

        while (i < input.length) {
            // ── Escape character ─────────────────────────────────────────────
            if (input[i] === '\\' && i + 1 < input.length) {
                const nextChar = input[i + 1];
                if ('\\`*_{}[]()#+-.!~=^|>'.includes(nextChar)) {
                    textBuffer += nextChar;
                    i += 2;
                    continue;
                }
            }

            // ── Line break (trailing `\` before newline) ────────────────────
            if (input[i] === '\\' && i + 1 < input.length && input[i + 1] === '\n') {
                flushText();
                nodes.push({ type: 'line_break' });
                i += 2;
                continue;
            }

            // ── Line break (two or more trailing spaces before newline) ─────
            if (input[i] === ' ' && i + 1 < input.length) {
                let spaces = 0;
                let j = i;
                while (j < input.length && input[j] === ' ') {
                    spaces++;
                    j++;
                }
                if (spaces >= 2 && j < input.length && input[j] === '\n') {
                    flushText();
                    nodes.push({ type: 'line_break' });
                    i = j + 1;
                    continue;
                }
            }

            // ── Inline code (backticks) ────────────────────────────────────
            if (input[i] === '`') {
                // Count opening backticks
                let ticks = 0;
                let j = i;
                while (j < input.length && input[j] === '`') {
                    ticks++;
                    j++;
                }
                // Find matching closing backticks
                const closePattern = '`'.repeat(ticks);
                const closeIdx = input.indexOf(closePattern, j);
                if (closeIdx !== -1) {
                    flushText();
                    let code = input.slice(j, closeIdx);
                    // Strip one leading and trailing space if both present (GFM behaviour)
                    if (code.length >= 2 && code[0] === ' ' && code[code.length - 1] === ' ') {
                        code = code.slice(1, -1);
                    }
                    nodes.push({ type: 'inline_code', content: code });
                    i = closeIdx + ticks;
                    continue;
                }
            }

            // ── Image: ![alt](src "title") ────────────────────────────────
            if (input[i] === '!' && input[i + 1] === '[') {
                const match = input.slice(i).match(/^!\[([^\]]*)\]\(([^)]*)\)/);
                if (match) {
                    flushText();
                    const alt = match[1];
                    const parts = match[2].match(/^(\S+?)(?:\s+"([^"]*)")?$/);
                    const src = parts ? parts[1] : match[2];
                    const title = parts?.[2];
                    nodes.push({ type: 'image', src, alt, title });
                    i += match[0].length;
                    continue;
                }
            }

            // ── Link: [text](href "title") ────────────────────────────────
            if (input[i] === '[') {
                // Footnote ref: [^id]
                if (this.options.extendedSyntax && input[i + 1] === '^') {
                    const fnMatch = input.slice(i).match(/^\[\^([^\]]+)\]/);
                    if (fnMatch) {
                        flushText();
                        nodes.push({ type: 'footnote_ref', id: fnMatch[1] });
                        i += fnMatch[0].length;
                        continue;
                    }
                }

                const linkMatch = input.slice(i).match(/^\[([^\]]*)\]\(([^)]*)\)/);
                if (linkMatch) {
                    flushText();
                    const text = linkMatch[1];
                    const parts = linkMatch[2].match(/^(\S+?)(?:\s+"([^"]*)")?$/);
                    const href = parts ? parts[1] : linkMatch[2];
                    const title = parts?.[2];
                    nodes.push({
                        type: 'link',
                        href,
                        title,
                        children: this.parse(text),
                    });
                    i += linkMatch[0].length;
                    continue;
                }
            }

            // ── Bold+Italic: ***text*** or ___text___ ─────────────────────
            if (
                (input.slice(i, i + 3) === '***' || input.slice(i, i + 3) === '___') &&
                i + 3 < input.length
            ) {
                const delim = input.slice(i, i + 3);
                const closeIdx = input.indexOf(delim, i + 3);
                if (closeIdx !== -1) {
                    flushText();
                    const inner = input.slice(i + 3, closeIdx);
                    nodes.push({ type: 'bold_italic', children: this.parse(inner) });
                    i = closeIdx + 3;
                    continue;
                }
            }

            // ── Bold: **text** or __text__ ────────────────────────────────
            if (
                (input.slice(i, i + 2) === '**' || input.slice(i, i + 2) === '__') &&
                i + 2 < input.length
            ) {
                const delim = input.slice(i, i + 2);
                const closeIdx = input.indexOf(delim, i + 2);
                if (closeIdx !== -1) {
                    flushText();
                    const inner = input.slice(i + 2, closeIdx);
                    nodes.push({ type: 'bold', children: this.parse(inner) });
                    i = closeIdx + 2;
                    continue;
                }
            }

            // ── Italic: *text* or _text_ ──────────────────────────────────
            if ((input[i] === '*' || input[i] === '_') && i + 1 < input.length) {
                const delim = input[i];
                // Don't consume if it's a double-delimiter (handled above)
                if (input[i + 1] !== delim) {
                    const closeIdx = input.indexOf(delim, i + 1);
                    if (closeIdx !== -1 && closeIdx > i + 1) {
                        flushText();
                        const inner = input.slice(i + 1, closeIdx);
                        nodes.push({ type: 'italic', children: this.parse(inner) });
                        i = closeIdx + 1;
                        continue;
                    }
                }
            }

            // ── Highlight: ==text== ───────────────────────────────────────
            if (this.options.extendedSyntax && input.slice(i, i + 2) === '==') {
                const closeIdx = input.indexOf('==', i + 2);
                if (closeIdx !== -1) {
                    flushText();
                    const inner = input.slice(i + 2, closeIdx);
                    nodes.push({ type: 'highlight', children: this.parse(inner) });
                    i = closeIdx + 2;
                    continue;
                }
            }

            // ── Strikethrough: ~~text~~ ───────────────────────────────────
            if (this.options.gfm && input.slice(i, i + 2) === '~~') {
                const closeIdx = input.indexOf('~~', i + 2);
                if (closeIdx !== -1) {
                    flushText();
                    const inner = input.slice(i + 2, closeIdx);
                    nodes.push({ type: 'strikethrough', children: this.parse(inner) });
                    i = closeIdx + 2;
                    continue;
                }
            }

            // ── Underline: ++text++ ───────────────────────────────────────
            if (this.options.extendedSyntax && input.slice(i, i + 2) === '++') {
                const closeIdx = input.indexOf('++', i + 2);
                if (closeIdx !== -1) {
                    flushText();
                    const inner = input.slice(i + 2, closeIdx);
                    nodes.push({ type: 'underline', children: this.parse(inner) });
                    i = closeIdx + 2;
                    continue;
                }
            }

            // ── Superscript: ^text^ ───────────────────────────────────────
            if (this.options.extendedSyntax && input[i] === '^') {
                const closeIdx = input.indexOf('^', i + 1);
                if (closeIdx !== -1 && closeIdx > i + 1 && !input.slice(i + 1, closeIdx).includes(' ')) {
                    flushText();
                    const inner = input.slice(i + 1, closeIdx);
                    nodes.push({ type: 'superscript', children: this.parse(inner) });
                    i = closeIdx + 1;
                    continue;
                }
            }

            // ── Subscript: ~text~ (single tilde, no spaces) ───────────────
            if (this.options.extendedSyntax && input[i] === '~' && input[i + 1] !== '~') {
                const closeIdx = input.indexOf('~', i + 1);
                if (closeIdx !== -1 && closeIdx > i + 1 && !input.slice(i + 1, closeIdx).includes(' ')) {
                    flushText();
                    const inner = input.slice(i + 1, closeIdx);
                    nodes.push({ type: 'subscript', children: this.parse(inner) });
                    i = closeIdx + 1;
                    continue;
                }
            }

            // ── Emoji shortcode: :name: ───────────────────────────────────
            if (input[i] === ':') {
                const emojiMatch = input.slice(i).match(/^:([a-z_]+):/);
                if (emojiMatch && EMOJI_MAP[emojiMatch[1]]) {
                    flushText();
                    nodes.push({
                        type: 'emoji',
                        name: emojiMatch[1],
                        unicode: EMOJI_MAP[emojiMatch[1]],
                    });
                    i += emojiMatch[0].length;
                    continue;
                }
            }

            // ── Inline HTML: <tag> ... </tag> or self-closing <br/> ───────
            if (input[i] === '<') {
                // Self-closing tags
                const selfCloseMatch = input.slice(i).match(/^<([a-zA-Z][a-zA-Z0-9]*)\s*\/?>/);
                if (selfCloseMatch) {
                    const tag = selfCloseMatch[1].toLowerCase();
                    if (['br', 'hr', 'img', 'wbr'].includes(tag)) {
                        flushText();
                        if (tag === 'br') {
                            nodes.push({ type: 'line_break' });
                        } else {
                            nodes.push({ type: 'html_inline', content: selfCloseMatch[0] });
                        }
                        i += selfCloseMatch[0].length;
                        continue;
                    }
                }
                // Paired inline HTML tags
                const htmlMatch = input.slice(i).match(/^<([a-zA-Z][a-zA-Z0-9]*)[^>]*>[\s\S]*?<\/\1>/);
                if (htmlMatch) {
                    flushText();
                    nodes.push({ type: 'html_inline', content: htmlMatch[0] });
                    i += htmlMatch[0].length;
                    continue;
                }
                // Allow standalone tags like <br> as-is
                const standaloneMatch = input.slice(i).match(/^<[a-zA-Z][a-zA-Z0-9]*[^>]*>/);
                if (standaloneMatch) {
                    flushText();
                    nodes.push({ type: 'html_inline', content: standaloneMatch[0] });
                    i += standaloneMatch[0].length;
                    continue;
                }
            }

            // ── Plain text character ──────────────────────────────────────
            textBuffer += input[i];
            i++;
        }

        flushText();
        return nodes;
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// §5  BLOCK PARSER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parses Markdown text into a MarkdownDocument AST.
 * Processes blocks top-to-bottom: fenced code blocks → HTML blocks →
 * headings → horizontal rules → blockquotes → lists → tables →
 * definition lists → footnotes → paragraphs.
 */
class BlockParser {
    private options: Required<MarkdownParserOptions>;
    private inlineParser: InlineParser;
    private footnotes: Map<string, FootnoteDefinitionNode>;
    private headingCounter: Map<string, number>;

    constructor(options: Required<MarkdownParserOptions>) {
        this.options = options;
        this.inlineParser = new InlineParser(options);
        this.footnotes = new Map();
        this.headingCounter = new Map();
    }

    parse(input: string): MarkdownDocument {
        // Normalize line endings
        const normalized = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const lines = normalized.split('\n');
        const children = this.parseLines(lines);

        return { children, footnotes: this.footnotes };
    }

    private parseLines(lines: string[]): BlockNode[] {
        const nodes: BlockNode[] = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            // ── Skip empty lines ─────────────────────────────────────────
            if (line.trim() === '') {
                i++;
                continue;
            }

            // ── Fenced code block (``` or ~~~) ───────────────────────────
            const fenceMatch = line.match(/^(\s{0,3})(```|~~~)(.*)$/);
            if (fenceMatch) {
                const indent = fenceMatch[1].length;
                const fence = fenceMatch[2];
                const infoString = fenceMatch[3].trim();
                const langMatch = infoString.match(/^(\S+)(?:\s+(.*))?$/);
                const language = langMatch?.[1] ?? '';
                const meta = langMatch?.[2];

                const codeLines: string[] = [];
                i++;
                let closed = false;
                while (i < lines.length) {
                    const closeFenceMatch = lines[i].match(
                        new RegExp(`^\\s{0,3}${fence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}+\\s*$`)
                    );
                    if (closeFenceMatch) {
                        closed = true;
                        i++;
                        break;
                    }
                    // Remove indent if present
                    let codeLine = lines[i];
                    if (indent > 0) {
                        const leadingSpaces = codeLine.match(/^(\s*)/)?.[1]?.length ?? 0;
                        codeLine = codeLine.slice(Math.min(indent, leadingSpaces));
                    }
                    codeLines.push(codeLine);
                    i++;
                }
                // If unclosed, treat as a code block up to end of input
                if (!closed) {
                    // All remaining lines are part of the code block
                }
                nodes.push({
                    type: 'code_block',
                    language,
                    content: codeLines.join('\n'),
                    meta,
                });
                continue;
            }

            // ── Indented code block (4+ spaces or 1 tab) ────────────────
            if (line.match(/^(?:    |\t)/)) {
                const codeLines: string[] = [];
                while (i < lines.length && (lines[i].match(/^(?:    |\t)/) || lines[i].trim() === '')) {
                    if (lines[i].trim() === '') {
                        codeLines.push('');
                    } else {
                        codeLines.push(lines[i].replace(/^(?:    |\t)/, ''));
                    }
                    i++;
                }
                // Trim trailing empty lines
                while (codeLines.length > 0 && codeLines[codeLines.length - 1] === '') {
                    codeLines.pop();
                }
                nodes.push({
                    type: 'code_block',
                    language: '',
                    content: codeLines.join('\n'),
                });
                continue;
            }

            // ── HTML block ───────────────────────────────────────────────
            if (line.match(/^\s{0,3}<(?:div|pre|table|details|summary|p|ul|ol|dl|section|article|nav|header|footer|main|aside|figure|figcaption|fieldset|form|blockquote|h[1-6])[>\s/]/i)) {
                const htmlLines: string[] = [line];
                i++;
                while (i < lines.length) {
                    htmlLines.push(lines[i]);
                    if (lines[i].match(/<\/(?:div|pre|table|details|summary|p|ul|ol|dl|section|article|nav|header|footer|main|aside|figure|figcaption|fieldset|form|blockquote|h[1-6])>/i)) {
                        i++;
                        break;
                    }
                    i++;
                }
                nodes.push({ type: 'html_block', content: htmlLines.join('\n') });
                continue;
            }

            // ── ATX Heading (# to ######) ───────────────────────────────
            const headingMatch = line.match(/^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/);
            if (headingMatch) {
                const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
                const content = headingMatch[2];
                const children = this.inlineParser.parse(content);
                const rawSlug = slugify(extractText(children));
                const id = this.uniqueHeadingId(rawSlug);
                nodes.push({ type: 'heading', level, children, id });
                i++;
                continue;
            }

            // ── Setext heading (underline with === or ---) ──────────────
            if (i + 1 < lines.length) {
                const nextLine = lines[i + 1];
                if (nextLine.match(/^\s{0,3}=+\s*$/)) {
                    const children = this.inlineParser.parse(line.trim());
                    const rawSlug = slugify(extractText(children));
                    const id = this.uniqueHeadingId(rawSlug);
                    nodes.push({ type: 'heading', level: 1, children, id });
                    i += 2;
                    continue;
                }
                if (nextLine.match(/^\s{0,3}-{2,}\s*$/) && !line.match(/^\s*$/)) {
                    const children = this.inlineParser.parse(line.trim());
                    const rawSlug = slugify(extractText(children));
                    const id = this.uniqueHeadingId(rawSlug);
                    nodes.push({ type: 'heading', level: 2, children, id });
                    i += 2;
                    continue;
                }
            }

            // ── Horizontal rule (---, ***, ___) ─────────────────────────
            if (line.match(/^\s{0,3}([-*_])\s*(\1\s*){2,}$/)) {
                nodes.push({ type: 'horizontal_rule' });
                i++;
                continue;
            }

            // ── Blockquote ──────────────────────────────────────────────
            if (line.match(/^\s{0,3}>/)) {
                const quoteLines: string[] = [];
                while (i < lines.length && (lines[i].match(/^\s{0,3}>/) || (lines[i].trim() !== '' && !lines[i].match(/^\s{0,3}(#{1,6}\s|```|~~~|[-*_]{3,}|\|)/)))) {
                    if (lines[i].match(/^\s{0,3}>/)) {
                        // Remove the `> ` prefix (or just `>` without a space)
                        quoteLines.push(lines[i].replace(/^\s{0,3}>\s?/, ''));
                    } else {
                        // Lazy continuation line
                        quoteLines.push(lines[i]);
                    }
                    i++;
                }
                // Recursively parse the content inside the blockquote
                const innerParser = new BlockParser(this.options);
                const innerDoc = innerParser.parse(quoteLines.join('\n'));
                // Merge footnotes from nested parse
                Array.from(innerDoc.footnotes.entries()).forEach(([k, v]) => {
                    this.footnotes.set(k, v);
                });
                nodes.push({ type: 'blockquote', children: innerDoc.children });
                continue;
            }

            // ── Table (GFM) ─────────────────────────────────────────────
            if (this.options.gfm && line.includes('|') && i + 1 < lines.length) {
                const separatorLine = lines[i + 1];
                if (separatorLine && separatorLine.match(/^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/)) {
                    const tableNode = this.parseTable(lines, i);
                    if (tableNode) {
                        nodes.push(tableNode.node);
                        i = tableNode.endIndex;
                        continue;
                    }
                }
            }

            // ── Footnote definition [^id]: ... ──────────────────────────
            if (this.options.extendedSyntax) {
                const fnDefMatch = line.match(/^\[\^([^\]]+)\]:\s*(.*)$/);
                if (fnDefMatch) {
                    const id = fnDefMatch[1];
                    const firstLine = fnDefMatch[2];
                    const fnLines: string[] = [firstLine];
                    i++;
                    // Continuation lines are indented
                    while (i < lines.length && (lines[i].match(/^\s{2,}/) || lines[i].trim() === '')) {
                        if (lines[i].trim() === '') {
                            fnLines.push('');
                        } else {
                            fnLines.push(lines[i].replace(/^\s{2,}/, ''));
                        }
                        i++;
                    }
                    const innerParser = new BlockParser(this.options);
                    const innerDoc = innerParser.parse(fnLines.join('\n'));
                    const fnNode: FootnoteDefinitionNode = {
                        type: 'footnote_definition',
                        id,
                        children: innerDoc.children,
                    };
                    this.footnotes.set(id, fnNode);
                    nodes.push(fnNode);
                    continue;
                }
            }

            // ── Definition list ─────────────────────────────────────────
            if (this.options.extendedSyntax && i + 1 < lines.length && lines[i + 1]?.match(/^\s{0,3}:\s+/)) {
                const dlNode = this.parseDefinitionList(lines, i);
                if (dlNode) {
                    nodes.push(dlNode.node);
                    i = dlNode.endIndex;
                    continue;
                }
            }

            // ── Unordered list (-, *, +) ────────────────────────────────
            if (line.match(/^\s{0,3}[-*+]\s+/)) {
                const listResult = this.parseUnorderedList(lines, i);
                nodes.push(listResult.node);
                i = listResult.endIndex;
                continue;
            }

            // ── Ordered list (1. / 1) / a. / a) / i. / I. / A.) ────────
            if (line.match(/^\s{0,3}(?:\d+|[a-zA-Z]|[ivxlcdmIVXLCDM]+)[.)]\s+/)) {
                const listResult = this.parseOrderedList(lines, i);
                nodes.push(listResult.node);
                i = listResult.endIndex;
                continue;
            }

            // ── Paragraph (default) ─────────────────────────────────────
            {
                const paraLines: string[] = [line];
                i++;
                while (i < lines.length) {
                    const nextLine = lines[i];
                    // Stop at: blank line, heading, fence, rule, blockquote, list, table separator, html block
                    if (
                        nextLine.trim() === '' ||
                        nextLine.match(/^#{1,6}\s/) ||
                        nextLine.match(/^(\s{0,3})(```|~~~)/) ||
                        nextLine.match(/^\s{0,3}([-*_])\s*(\1\s*){2,}$/) ||
                        nextLine.match(/^\s{0,3}>/) ||
                        nextLine.match(/^\s{0,3}[-*+]\s+/) ||
                        nextLine.match(/^\s{0,3}(?:\d+|[a-zA-Z]|[ivxlcdmIVXLCDM]+)[.)]\s+/) ||
                        nextLine.match(/^\s{0,3}<(?:div|pre|table|details)[>\s/]/i) ||
                        (nextLine.match(/^\s{0,3}=+\s*$/) && paraLines.length === 1) ||
                        (nextLine.match(/^\s{0,3}-{2,}\s*$/) && paraLines.length === 1)
                    ) {
                        break;
                    }
                    paraLines.push(nextLine);
                    i++;
                }
                const content = paraLines.join('\n');
                const children = this.inlineParser.parse(content);
                nodes.push({ type: 'paragraph', children });
            }
        }

        return nodes;
    }

    /** Generate a unique heading ID (appends -1, -2 etc. for duplicates) */
    private uniqueHeadingId(rawSlug: string): string {
        if (!this.options.headingIds) return '';
        const slug = rawSlug || 'heading';
        const count = this.headingCounter.get(slug) ?? 0;
        this.headingCounter.set(slug, count + 1);
        return count === 0 ? slug : `${slug}-${count}`;
    }

    /** Parse a GFM table starting at line index `start` */
    private parseTable(lines: string[], start: number): { node: TableNode; endIndex: number } | null {
        const parseRow = (line: string): string[] => {
            let trimmed = line.trim();
            if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
            if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
            return trimmed.split('|').map((cell) => cell.trim());
        };

        // Header row
        const headerCells = parseRow(lines[start]);
        // Separator row
        const sepCells = parseRow(lines[start + 1]);

        if (headerCells.length === 0) return null;

        // Parse alignments
        const alignments: TableAlignment[] = sepCells.map((cell) => {
            const trimmed = cell.trim();
            const left = trimmed.startsWith(':');
            const right = trimmed.endsWith(':');
            if (left && right) return { align: 'center' };
            if (right) return { align: 'right' };
            if (left) return { align: 'left' };
            return { align: 'none' };
        });

        // Parse header inline content
        const headers = headerCells.map((cell) => this.inlineParser.parse(cell));

        // Parse body rows
        const rows: InlineNode[][][] = [];
        let i = start + 2;
        while (i < lines.length) {
            const line = lines[i];
            if (!line.includes('|') || line.trim() === '') break;
            const cells = parseRow(line);
            rows.push(cells.map((cell) => this.inlineParser.parse(cell)));
            i++;
        }

        return {
            node: { type: 'table', headers, alignments, rows },
            endIndex: i,
        };
    }

    /** Parse a definition list starting at line index `start` */
    private parseDefinitionList(
        lines: string[],
        start: number
    ): { node: DefinitionListNode; endIndex: number } | null {
        const items: DefinitionListNode['items'] = [];
        let i = start;

        while (i < lines.length) {
            const termLine = lines[i];
            if (!termLine || termLine.trim() === '') { i++; continue; }

            // Check if next line is a definition
            if (i + 1 >= lines.length || !lines[i + 1]?.match(/^\s{0,3}:\s+/)) break;

            const term = this.inlineParser.parse(termLine.trim());
            const definitions: InlineNode[][] = [];
            i++;

            while (i < lines.length && lines[i]?.match(/^\s{0,3}:\s+/)) {
                const defContent = lines[i].replace(/^\s{0,3}:\s+/, '');
                definitions.push(this.inlineParser.parse(defContent));
                i++;
            }

            items.push({ term, definitions });
        }

        if (items.length === 0) return null;

        return {
            node: { type: 'definition_list', items },
            endIndex: i,
        };
    }

    /** Parse an unordered list starting at line index `start` */
    private parseUnorderedList(
        lines: string[],
        start: number
    ): { node: UnorderedListNode; endIndex: number } {
        const items: ListItemNode[] = [];
        let i = start;

        while (i < lines.length) {
            const match = lines[i].match(/^(\s{0,3})([-*+])\s+(.*)/);
            if (!match) break;

            const itemIndent = match[1].length;
            let content = match[3];

            // Check for task list checkbox
            let checked: boolean | undefined;
            if (this.options.gfm) {
                const taskMatch = content.match(/^\[([ xX])\]\s+(.*)/);
                if (taskMatch) {
                    checked = taskMatch[1].toLowerCase() === 'x';
                    content = taskMatch[2];
                }
            }

            i++;

            // Collect continuation lines and detect sub-lists
            const subLines: string[] = [];
            while (i < lines.length) {
                const nextLine = lines[i];
                if (nextLine.trim() === '') {
                    // Blank line might be a separator — peek ahead
                    if (i + 1 < lines.length && lines[i + 1].match(/^\s{2,}/)) {
                        subLines.push('');
                        i++;
                        continue;
                    }
                    break;
                }
                // If indented more than original list marker, it's a continuation or sub-list
                const nextIndent = nextLine.match(/^(\s*)/)?.[1]?.length ?? 0;
                if (nextIndent > itemIndent + 1) {
                    subLines.push(nextLine);
                    i++;
                } else if (nextLine.match(/^\s{0,3}[-*+]\s+/)) {
                    // Same-level list item → stop
                    break;
                } else {
                    break;
                }
            }

            // If there are sub-lines, check if they form a sub-list
            let subList: UnorderedListNode | OrderedListNode | undefined;
            if (subLines.length > 0) {
                // De-indent sub-lines
                const minIndent = Math.min(
                    ...subLines.filter((l) => l.trim() !== '').map((l) => l.match(/^(\s*)/)?.[1]?.length ?? 0)
                );
                const dedented = subLines.map((l) => (l.trim() === '' ? '' : l.slice(minIndent)));

                // Check if sub-lines form a list
                const firstSub = dedented.find((l) => l.trim() !== '');
                if (firstSub?.match(/^\s{0,3}[-*+]\s+/)) {
                    const subResult = this.parseUnorderedList(dedented, 0);
                    subList = subResult.node;
                } else if (firstSub?.match(/^\s{0,3}(?:\d+|[a-zA-Z])[.)]\s+/)) {
                    const subResult = this.parseOrderedList(dedented, 0);
                    subList = subResult.node;
                } else {
                    // Continuation text — append to content
                    content += '\n' + dedented.join('\n');
                }
            }

            const children = this.inlineParser.parse(content);
            items.push({ children, subList, checked });
        }

        return { node: { type: 'unordered_list', items }, endIndex: i };
    }

    /** Parse an ordered list starting at line index `start` */
    private parseOrderedList(
        lines: string[],
        start: number
    ): { node: OrderedListNode; endIndex: number } {
        const items: ListItemNode[] = [];
        let i = start;

        // Detect style from first marker
        const firstMatch = lines[start].match(/^\s{0,3}((?:\d+|[a-zA-Z]|[ivxlcdmIVXLCDM]+)[.)])\s+/);
        const { style, start: listStart } = firstMatch
            ? detectListStyle(firstMatch[1])
            : { style: 'numeric' as OrderedListStyle, start: 1 };

        const listPattern = /^(\s{0,3})(?:\d+|[a-zA-Z]|[ivxlcdmIVXLCDM]+)[.)]\s+(.*)/;

        while (i < lines.length) {
            const match = lines[i].match(listPattern);
            if (!match) break;

            const itemIndent = match[1].length;
            let content = match[2];

            // Check for task list checkbox
            let checked: boolean | undefined;
            if (this.options.gfm) {
                const taskMatch = content.match(/^\[([ xX])\]\s+(.*)/);
                if (taskMatch) {
                    checked = taskMatch[1].toLowerCase() === 'x';
                    content = taskMatch[2];
                }
            }

            i++;

            // Collect continuation / sub-list lines
            const subLines: string[] = [];
            while (i < lines.length) {
                const nextLine = lines[i];
                if (nextLine.trim() === '') {
                    if (i + 1 < lines.length && lines[i + 1].match(/^\s{2,}/)) {
                        subLines.push('');
                        i++;
                        continue;
                    }
                    break;
                }
                const nextIndent = nextLine.match(/^(\s*)/)?.[1]?.length ?? 0;
                if (nextIndent > itemIndent + 1) {
                    subLines.push(nextLine);
                    i++;
                } else if (nextLine.match(listPattern)) {
                    break;
                } else {
                    break;
                }
            }

            let subList: UnorderedListNode | OrderedListNode | undefined;
            if (subLines.length > 0) {
                const minIndent = Math.min(
                    ...subLines.filter((l) => l.trim() !== '').map((l) => l.match(/^(\s*)/)?.[1]?.length ?? 0)
                );
                const dedented = subLines.map((l) => (l.trim() === '' ? '' : l.slice(minIndent)));
                const firstSub = dedented.find((l) => l.trim() !== '');
                if (firstSub?.match(/^\s{0,3}[-*+]\s+/)) {
                    const subResult = this.parseUnorderedList(dedented, 0);
                    subList = subResult.node;
                } else if (firstSub?.match(/^\s{0,3}(?:\d+|[a-zA-Z]|[ivxlcdmIVXLCDM]+)[.)]\s+/)) {
                    const subResult = this.parseOrderedList(dedented, 0);
                    subList = subResult.node;
                } else {
                    content += '\n' + dedented.join('\n');
                }
            }

            const children = this.inlineParser.parse(content);
            items.push({ children, subList, checked });
        }

        return {
            node: { type: 'ordered_list', start: listStart, style, items },
            endIndex: i,
        };
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// §6  HTML RENDERER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Renders a MarkdownDocument AST into an HTML string.
 */
class HtmlRenderer {
    private options: Required<MarkdownParserOptions>;
    private prefix: string;

    constructor(options: Required<MarkdownParserOptions>) {
        this.options = options;
        this.prefix = options.classPrefix;
    }

    render(doc: MarkdownDocument): string {
        return this.renderBlocks(doc.children) + this.renderFootnoteSection(doc.footnotes);
    }

    // ── Block rendering ──────────────────────────────────────────────────────

    private renderBlocks(nodes: BlockNode[]): string {
        return nodes.map((node) => this.renderBlock(node)).join('\n');
    }

    private renderBlock(node: BlockNode): string {
        switch (node.type) {
            case 'heading':
                return this.renderHeading(node);
            case 'paragraph':
                return `<p>${this.renderInlines(node.children)}</p>`;
            case 'code_block':
                return this.renderCodeBlock(node);
            case 'blockquote':
                return `<blockquote class="${this.prefix}-blockquote">\n${this.renderBlocks(node.children)}\n</blockquote>`;
            case 'horizontal_rule':
                return '<hr />';
            case 'unordered_list':
                return this.renderUnorderedList(node);
            case 'ordered_list':
                return this.renderOrderedList(node);
            case 'table':
                return this.renderTable(node);
            case 'definition_list':
                return this.renderDefinitionList(node);
            case 'footnote_definition':
                return ''; // Rendered separately in footnote section
            case 'html_block':
                return this.options.sanitizeHtml ? escapeHtml(node.content) : node.content;
            case 'empty':
                return '';
        }
    }

    private renderHeading(node: HeadingNode): string {
        const tag = `h${node.level}`;
        const idAttr = node.id ? ` id="${escapeHtml(node.id)}"` : '';
        const content = this.renderInlines(node.children);
        return `<${tag}${idAttr}>${content}</${tag}>`;
    }

    private renderCodeBlock(node: CodeBlockNode): string {
        const escaped = escapeHtml(node.content);
        const langClass = node.language
            ? ` class="language-${escapeHtml(node.language)}"`
            : '';
        const metaAttr = node.meta
            ? ` data-meta="${escapeHtml(node.meta)}"`
            : '';
        return `<pre><code${langClass}${metaAttr}>${escaped}</code></pre>`;
    }

    private renderUnorderedList(node: UnorderedListNode): string {
        const items = node.items.map((item) => this.renderListItem(item)).join('\n');
        return `<ul>\n${items}\n</ul>`;
    }

    private renderOrderedList(node: OrderedListNode): string {
        const startAttr = node.start !== 1 ? ` start="${node.start}"` : '';
        const typeAttr = this.getOlType(node.style);
        const items = node.items.map((item) => this.renderListItem(item)).join('\n');
        return `<ol${typeAttr}${startAttr}>\n${items}\n</ol>`;
    }

    private getOlType(style: OrderedListStyle): string {
        switch (style) {
            case 'numeric':
                return '';
            case 'alpha-lower':
                return ' type="a"';
            case 'alpha-upper':
                return ' type="A"';
            case 'roman-lower':
                return ' type="i"';
            case 'roman-upper':
                return ' type="I"';
        }
    }

    private renderListItem(item: ListItemNode): string {
        let content = this.renderInlines(item.children);

        // Task list checkbox
        if (item.checked !== undefined) {
            const checkbox = item.checked
                ? `<input type="checkbox" checked disabled /> `
                : `<input type="checkbox" disabled /> `;
            content = checkbox + content;
        }

        const subListHtml = item.subList
            ? '\n' + (item.subList.type === 'unordered_list'
                ? this.renderUnorderedList(item.subList)
                : this.renderOrderedList(item.subList))
            : '';

        return `<li>${content}${subListHtml}</li>`;
    }

    private renderTable(node: TableNode): string {
        const headerCells = node.headers.map((cell, idx) => {
            const align = node.alignments[idx]?.align;
            const style = align && align !== 'none' ? ` style="text-align: ${align}"` : '';
            return `<th${style}>${this.renderInlines(cell)}</th>`;
        });
        const thead = `<thead>\n<tr>\n${headerCells.join('\n')}\n</tr>\n</thead>`;

        const bodyRows = node.rows.map((row) => {
            const cells = row.map((cell, idx) => {
                const align = node.alignments[idx]?.align;
                const style = align && align !== 'none' ? ` style="text-align: ${align}"` : '';
                return `<td${style}>${this.renderInlines(cell)}</td>`;
            });
            return `<tr>\n${cells.join('\n')}\n</tr>`;
        });
        const tbody = bodyRows.length > 0
            ? `<tbody>\n${bodyRows.join('\n')}\n</tbody>`
            : '';

        return `<table class="${this.prefix}-table">\n${thead}\n${tbody}\n</table>`;
    }

    private renderDefinitionList(node: DefinitionListNode): string {
        const items = node.items
            .map((item) => {
                const dt = `<dt>${this.renderInlines(item.term)}</dt>`;
                const dds = item.definitions
                    .map((def) => `<dd>${this.renderInlines(def)}</dd>`)
                    .join('\n');
                return `${dt}\n${dds}`;
            })
            .join('\n');
        return `<dl>\n${items}\n</dl>`;
    }

    private renderFootnoteSection(footnotes: Map<string, FootnoteDefinitionNode>): string {
        if (footnotes.size === 0) return '';

        const items = Array.from(footnotes.entries())
            .map(([id, fn]) => {
                const content = this.renderBlocks(fn.children);
                return `<li id="fn-${escapeHtml(id)}">\n${content}\n<a href="#fnref-${escapeHtml(id)}" class="${this.prefix}-footnote-backref" aria-label="Back to content">↩</a>\n</li>`;
            })
            .join('\n');

        return `\n<section class="${this.prefix}-footnotes" role="doc-endnotes">\n<hr />\n<ol>\n${items}\n</ol>\n</section>`;
    }

    // ── Inline rendering ─────────────────────────────────────────────────────

    /** Render an array of inline nodes to HTML. Public for use by MarkdownParser.parseInline(). */
    renderInlineNodes(nodes: InlineNode[]): string {
        return this.renderInlines(nodes);
    }

    private renderInlines(nodes: InlineNode[]): string {
        return nodes.map((node) => this.renderInline(node)).join('');
    }

    private renderInline(node: InlineNode): string {
        switch (node.type) {
            case 'text':
                return escapeHtml(node.content);
            case 'bold':
                return `<strong>${this.renderInlines(node.children)}</strong>`;
            case 'italic':
                return `<em>${this.renderInlines(node.children)}</em>`;
            case 'bold_italic':
                return `<strong><em>${this.renderInlines(node.children)}</em></strong>`;
            case 'underline':
                return `<u>${this.renderInlines(node.children)}</u>`;
            case 'strikethrough':
                return `<del>${this.renderInlines(node.children)}</del>`;
            case 'highlight':
                return `<mark>${this.renderInlines(node.children)}</mark>`;
            case 'inline_code':
                return `<code>${escapeHtml(node.content)}</code>`;
            case 'link': {
                const title = node.title ? ` title="${escapeHtml(node.title)}"` : '';
                return `<a href="${escapeHtml(node.href)}"${title}>${this.renderInlines(node.children)}</a>`;
            }
            case 'image': {
                const title = node.title ? ` title="${escapeHtml(node.title)}"` : '';
                return `<img src="${escapeHtml(node.src)}" alt="${escapeHtml(node.alt)}"${title} />`;
            }
            case 'line_break':
                return '<br />';
            case 'footnote_ref':
                return `<sup class="${this.prefix}-footnote-ref"><a href="#fn-${escapeHtml(node.id)}" id="fnref-${escapeHtml(node.id)}">[${escapeHtml(node.id)}]</a></sup>`;
            case 'superscript':
                return `<sup>${this.renderInlines(node.children)}</sup>`;
            case 'subscript':
                return `<sub>${this.renderInlines(node.children)}</sub>`;
            case 'emoji':
                return `<span class="${this.prefix}-emoji" title=":${escapeHtml(node.name)}:" role="img" aria-label="${escapeHtml(node.name)}">${node.unicode}</span>`;
            case 'html_inline':
                return this.options.sanitizeHtml ? escapeHtml(node.content) : node.content;
        }
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// §7  PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The main MarkdownParser class.
 *
 * @example
 * ```ts
 * import { MarkdownParser } from '@/lib/markdown-parser';
 *
 * const parser = new MarkdownParser();
 *
 * // Parse to AST
 * const ast = parser.parseToAst('# Hello **world**');
 *
 * // Parse directly to HTML
 * const html = parser.parse('# Hello **world**');
 * // → '<h1 id="hello-world">Hello <strong>world</strong></h1>'
 * ```
 */
export class MarkdownParser {
    private options: Required<MarkdownParserOptions>;

    constructor(options?: MarkdownParserOptions) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    /**
     * Parse Markdown input into a structured AST (MarkdownDocument).
     * Useful when you need to inspect or transform the document tree
     * before rendering.
     */
    parseToAst(input: string): MarkdownDocument {
        const blockParser = new BlockParser(this.options);
        return blockParser.parse(input);
    }

    /**
     * Parse Markdown input and render it to an HTML string.
     * This is the main entry point for most use-cases.
     */
    parse(input: string): string {
        const doc = this.parseToAst(input);
        const renderer = new HtmlRenderer(this.options);
        return renderer.render(doc);
    }

    /**
     * Parse only inline Markdown content (no block-level structures).
     * Useful for rendering inline content like table cells or headings
     * from pre-split text.
     */
    parseInline(input: string): string {
        const inlineParser = new InlineParser(this.options);
        const nodes = inlineParser.parse(input);
        const renderer = new HtmlRenderer(this.options);
        return renderer.renderInlineNodes(nodes);
    }
}

/**
 * Convenience function: parse Markdown to HTML with default options.
 *
 * @example
 * ```ts
 * import { parseMarkdown } from '@/lib/markdown-parser';
 *
 * const html = parseMarkdown('Hello **world**');
 * // → '<p>Hello <strong>world</strong></p>'
 * ```
 */
export function parseMarkdown(input: string, options?: MarkdownParserOptions): string {
    const parser = new MarkdownParser(options);
    return parser.parse(input);
}

/**
 * Convenience function: parse Markdown to AST with default options.
 */
export function parseMarkdownToAst(
    input: string,
    options?: MarkdownParserOptions
): MarkdownDocument {
    const parser = new MarkdownParser(options);
    return parser.parseToAst(input);
}
