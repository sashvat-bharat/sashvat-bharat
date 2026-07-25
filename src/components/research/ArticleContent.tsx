"use client";

import React, { useEffect, useRef } from 'react';

interface ArticleContentProps {
  htmlContent: string;
}

export default function ArticleContent({ htmlContent }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

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

      // Create header bar
      const headerBar = document.createElement('div');
      headerBar.className = 'code_block_header';

      const langSpan = document.createElement('span');
      langSpan.className = 'code_block_language';
      langSpan.textContent = meta ? `${language} • ${meta}` : language;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'code_block_copy_btn';
      copyBtn.type = 'button';
      copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
      copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>Copy</span>`;

      copyBtn.addEventListener('click', async () => {
        const textToCopy = codeEl?.textContent || pre.textContent || '';
        try {
          await navigator.clipboard.writeText(textToCopy);
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>Copied!</span>`;
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>Copy</span>`;
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code', err);
        }
      });

      headerBar.appendChild(langSpan);
      headerBar.appendChild(copyBtn);

      pre.insertBefore(headerBar, pre.firstChild);
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
      className="content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
