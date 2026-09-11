'use client';

import { SearchX } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getAuthorAvatar } from '@/lib/authors';
import { formatResearchDate } from '@/lib/date-utils';

export interface ArticleItem {
  slug: string;
  frontmatter: {
    title?: string;
    date?: string;
    tags?: string[];
    description?: string;
    authors?: { name: string; affiliation?: string; avatar?: string }[];
    author?: string;
    author_affiliation?: string;
  };
}

interface ArticleExplorerProps {
  articles: ArticleItem[];
}

function extractItemTags(frontmatter: { tags?: string[] }): string[] {
  if (Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0) {
    return frontmatter.tags.map((t) => String(t).trim()).filter(Boolean);
  }
  return [];
}

function formatAuthorNames(authors?: { name: string }[], singleAuthor?: string): string {
  if (authors && authors.length > 0) {
    const names = authors.map((a) => a.name).filter(Boolean);
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]}, ${names[1]}`;
    if (names.length === 3) return `${names[0]}, ${names[1]}, and ${names[2]}`;
    if (names.length > 3) return `${names[0]}, ${names[1]}, and ${names.length - 2} others`;
  }
  return singleAuthor || '';
}

export default function ArticleExplorer({ articles }: ArticleExplorerProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Built-in static filters + dynamically collected unique categories from articles
  const filterOptions = useMemo(() => {
    const defaultFilters = ['All', 'Technology', 'Artificial Intelligence', 'Yearly View'];
    const dynamicCategories = new Set<string>();

    for (const article of articles) {
      const tags = extractItemTags(article.frontmatter);
      for (const tag of tags) {
        dynamicCategories.add(tag);
      }
    }

    const combined = [...defaultFilters];
    for (const cat of dynamicCategories) {
      if (!combined.some((f) => f.toLowerCase() === cat.toLowerCase())) {
        combined.push(cat);
      }
    }
    return combined;
  }, [articles]);

  // Filter articles based on selected filter tag/category and search query
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const title = article.frontmatter.title?.toLowerCase() || '';
      const description = article.frontmatter.description?.toLowerCase() || '';
      const date = article.frontmatter.date?.toLowerCase() || '';
      const tags = extractItemTags(article.frontmatter).map((t) => t.toLowerCase());
      const authorText = formatAuthorNames(
        article.frontmatter.authors,
        article.frontmatter.author,
      ).toLowerCase();

      // 1. Category filter matching
      let passesFilter = true;
      if (selectedFilter !== 'All') {
        const target = selectedFilter.toLowerCase();
        const matchesCategory = tags.some(
          (t) => t === target || t.includes(target) || target.includes(t),
        );
        const matchesTextFallback = title.includes(target) || description.includes(target);
        passesFilter = matchesCategory || matchesTextFallback;
      }

      // 2. Search query matching
      let passesSearch = true;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.trim().toLowerCase();
        const matchesTitle = title.includes(query);
        const matchesDesc = description.includes(query);
        const matchesDate = date.includes(query);
        const matchesCategory = tags.some((t) => t.includes(query));
        const matchesAuthors = authorText.includes(query);

        passesSearch =
          matchesTitle || matchesDesc || matchesDate || matchesCategory || matchesAuthors;
      }

      return passesFilter && passesSearch;
    });
  }, [articles, selectedFilter, searchQuery]);

  const handleResetFilters = () => {
    setSelectedFilter('All');
    setSearchQuery('');
  };

  const renderCard = (article: ArticleItem) => {
    const authorText = formatAuthorNames(article.frontmatter.authors, article.frontmatter.author);
    const authorsList =
      article.frontmatter.authors && article.frontmatter.authors.length > 0
        ? article.frontmatter.authors
        : article.frontmatter.author
          ? [{ name: article.frontmatter.author }]
          : [];
    const tags = extractItemTags(article.frontmatter);

    return (
      <Link
        href={`/articles/${article.slug}`}
        key={article.slug}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className='research_card'>
          <div className='card_top_section'>
            <div className='card_meta_header'>
              <span className='publish_time'>{formatResearchDate(article.frontmatter.date)}</span>
              {tags.length > 0 && (
                <div className='category_tags_group'>
                  {tags.map((tag) => (
                    <span className='category_tag' key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <h2 className='title_heading'>{article.frontmatter.title}</h2>
          </div>

          <div className='card_bottom_section'>
            <div className='author_footer'>
              <div className='author_avatars_group'>
                {authorsList.length > 0 ? (
                  authorsList.slice(0, 3).map((author) => {
                    const avatarSrc = author.avatar || getAuthorAvatar(author.name);
                    return avatarSrc ? (
                      <Image
                        key={author.name}
                        src={avatarSrc}
                        alt={author.name}
                        width={28}
                        height={28}
                        className='author_avatar_image'
                      />
                    ) : (
                      <div className='author_avatar_placeholder' key={author.name} />
                    );
                  })
                ) : (
                  <div className='author_avatar_placeholder' />
                )}
              </div>
              {authorText && <span className='author_names'>{authorText}</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      <div className='filter-and-search-section'>
        <div className='filter-section'>
          {filterOptions.map((filter) => (
            <button
              key={filter}
              type='button'
              className={selectedFilter === filter ? 'active' : ''}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className='search-section'>
          <input
            type='text'
            placeholder='Search...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredArticles.length > 0 ? (
        <div className='research_cards_grid'>{filteredArticles.map(renderCard)}</div>
      ) : (
        <div className='empty_state_container'>
          <div className='empty_state_icon_wrapper'>
            <SearchX size={26} />
          </div>
          <h3 className='empty_state_title'>No articles found</h3>
          <p className='empty_state_description'>
            We couldn&apos;t find any articles matching your search query or active filter. Try
            checking for typos or resetting your filters.
          </p>
          {(selectedFilter !== 'All' || searchQuery.trim() !== '') && (
            <button type='button' className='empty_state_reset_btn' onClick={handleResetFilters}>
              Clear search & filters
            </button>
          )}
        </div>
      )}
    </>
  );
}
