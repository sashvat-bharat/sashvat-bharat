'use client';

import { useEffect, useRef } from 'react';

interface ArticleContentProps {
  htmlContent: string;
}

const COPY_ICON_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>Copy</span>`;
const COPIED_ICON_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>Copied!</span>`;

function attachCopyBehavior(copyBtn: HTMLButtonElement, getText: () => string) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(getText());
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = COPIED_ICON_SVG;
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = COPY_ICON_SVG;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  });
}

function createHeaderBar(label: string, copyBtn: HTMLButtonElement): HTMLDivElement {
  const headerBar = document.createElement('div');
  headerBar.className = 'code_block_header';

  const langSpan = document.createElement('span');
  langSpan.className = 'code_block_language';
  langSpan.textContent = label;

  headerBar.appendChild(langSpan);
  headerBar.appendChild(copyBtn);
  return headerBar;
}

function createCopyButton(ariaLabel: string): HTMLButtonElement {
  const copyBtn = document.createElement('button');
  copyBtn.className = 'code_block_copy_btn';
  copyBtn.type = 'button';
  copyBtn.setAttribute('aria-label', ariaLabel);
  copyBtn.innerHTML = COPY_ICON_SVG;
  return copyBtn;
}

export default function ArticleContent({ htmlContent }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run DOM enhancement when rendered markdown changes (client-side navigation between articles)
  useEffect(() => {
    if (!contentRef.current) return;

    // Process all code blocks to add modern header & copy button
    const preBlocks = contentRef.current.querySelectorAll('pre');
    preBlocks.forEach((pre) => {
      // Check if already processed
      if (pre.querySelector('.code_block_header')) return;

      const codeEl = pre.querySelector('code');
      const langClass = Array.from(codeEl?.classList || []).find((c) => c.startsWith('language-'));
      const language = langClass ? langClass.replace('language-', '').toUpperCase() : 'CODE';
      const meta = codeEl?.getAttribute('data-meta') || '';

      const copyBtn = createCopyButton('Copy code to clipboard');
      attachCopyBehavior(copyBtn, () => codeEl?.textContent || pre.textContent || '');

      const headerBar = createHeaderBar(meta ? `${language} • ${meta}` : language, copyBtn);
      pre.insertBefore(headerBar, pre.firstChild);
    });

    // Process KaTeX display math blocks to add header & copy button.
    // Copies the raw LaTeX wrapped in $$ delimiters so it pastes back
    // into markdown as properly formatted display math.
    const mathBlocks = contentRef.current.querySelectorAll('.md-math-display');
    mathBlocks.forEach((block) => {
      const mathEl = block as HTMLElement;
      // Check if already processed
      if (mathEl.querySelector('.code_block_header')) return;

      const rawLatex = mathEl.getAttribute('data-latex') || '';
      const formatted = rawLatex ? `$$\n${rawLatex}\n$$` : '';

      const copyBtn = createCopyButton('Copy LaTeX to clipboard');
      attachCopyBehavior(copyBtn, () => formatted);

      const headerBar = createHeaderBar('LaTeX', copyBtn);
      mathEl.insertBefore(headerBar, mathEl.firstChild);
    });

    // Process headings for hover anchor links
    const headings = contentRef.current.querySelectorAll('h2[id], h3[id], h4[id]');
    headings.forEach((heading) => {
      if (heading.querySelector('.heading_anchor_link')) return;

      const id = heading.getAttribute('id');
      if (!id) return;

      const anchor = document.createElement('a');
      anchor.className = 'heading_anchor_link';
      anchor.href = `#${id}`;
      anchor.setAttribute('aria-label', `Link to section ${heading.textContent}`);
      anchor.innerHTML = `#`;

      heading.appendChild(anchor);
    });
  }, [htmlContent]);

  return (
    <div
      ref={contentRef}
      className='content'
      // biome-ignore lint/security/noDangerouslySetInnerHtml: htmlContent is escaped/sanitized by the custom markdown parser
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
