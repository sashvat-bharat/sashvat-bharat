"use client";

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { formatResearchDateFull } from '@/lib/date-utils';

interface Author {
  name: string;
  affiliation?: string;
}

interface ArticleHeaderProps {
  title: string;
  date?: string;
  category?: string;
  authors: Author[];
  readingMinutes: number;
}

export default function ArticleHeader({
  title,
  date,
  category,
  authors,
  readingMinutes,
}: ArticleHeaderProps) {
  const [copied, setCopied] = useState(false);

  const formattedDate = formatResearchDateFull(date);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy link', e);
    }
  };

  const avatarCount = authors && authors.length > 0 ? Math.min(authors.length, 4) : 1;

  return (
    <header className="article_hero_header">

      {/* (Tag • Date • Time to Read — Share) */}
      <div className="article_meta_bar">
        <div className="article_meta_left">{category && <span className="article_category_text">{category}</span>} {category && formattedDate && <span className="meta_dot">•</span>} {formattedDate && (<time dateTime={date} className="article_meta_date">{formattedDate}</time>)} {formattedDate && <span className="meta_dot">•</span>} <span className="article_meta_time">{readingMinutes} min read</span></div>
        <button type="button" onClick={handleCopyLink} className={`article_share_btn_minimal ${copied ? 'copied' : ''}`} aria-label="Share or copy article link">{copied ? <Check size={14} /> : <Share2 size={14} />}<span>{copied ? 'Copied' : 'Share'}</span></button>
      </div>

      {/* Article Main Title */}
      <h1 className="article_main_title">{title}</h1>

      {/* Minimal Author Footer */}
      <div className="article_authors_card">
        <div className="author_avatars_group">{Array.from({ length: avatarCount }).map((_, idx) => (<div className="author_avatar_placeholder" key={idx} />))}</div>
        <div className="author_names_container"><span className="author_names_text">{authors.map((author, index) => (<span key={index} className="author_item"><span className="author_name_str">{author.name}</span>{index < authors.length - 1 && <span className="author_comma_str">, </span>}</span>))}</span></div>
      </div>

      {/* Minimal Separator Divider */}
      <div className="article_header_divider" />
    </header>
  );
}
