'use client';

import { SearchX } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getAuthorAvatar } from '@/lib/authors';
import { formatResearchDate } from '@/lib/date-utils';

export interface ResearchPaperItem {
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

interface ResearchExplorerProps {
  researchPapers: ResearchPaperItem[];
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

export default function ResearchExplorer({ researchPapers }: ResearchExplorerProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Built-in static filters + dynamically collected unique categories from papers
  const filterOptions = useMemo(() => {
    const defaultFilters = [
      'All',
      'OSS',
      'Harness',
      'Agents',
      'Protocols',
      'Artificial Intelligence',
      'Yearly View',
    ];
    const dynamicCategories = new Set<string>();

    for (const paper of researchPapers) {
      const tags = extractItemTags(paper.frontmatter);
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
  }, [researchPapers]);

  // Filter research papers based on selected filter tag/category and search query
  const filteredPapers = useMemo(() => {
    return researchPapers.filter((paper) => {
      const title = paper.frontmatter.title?.toLowerCase() || '';
      const description = paper.frontmatter.description?.toLowerCase() || '';
      const date = paper.frontmatter.date?.toLowerCase() || '';
      const tags = extractItemTags(paper.frontmatter).map((t) => t.toLowerCase());
      const authorText = formatAuthorNames(
        paper.frontmatter.authors,
        paper.frontmatter.author,
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
  }, [researchPapers, selectedFilter, searchQuery]);

  const handleResetFilters = () => {
    setSelectedFilter('All');
    setSearchQuery('');
  };

  const renderCard = (paper: ResearchPaperItem) => {
    const authorText = formatAuthorNames(paper.frontmatter.authors, paper.frontmatter.author);
    const authorsList =
      paper.frontmatter.authors && paper.frontmatter.authors.length > 0
        ? paper.frontmatter.authors
        : paper.frontmatter.author
          ? [{ name: paper.frontmatter.author }]
          : [];
    const tags = extractItemTags(paper.frontmatter);

    return (
      <Link
        href={`/research/${paper.slug}`}
        key={paper.slug}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className='research_card'>
          <div className='card_top_section'>
            <div className='card_meta_header'>
              <span className='publish_time'>{formatResearchDate(paper.frontmatter.date)}</span>
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
            <h2 className='title_heading'>{paper.frontmatter.title}</h2>
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

      {filteredPapers.length > 0 ? (
        <div className='research_cards_grid'>{filteredPapers.map(renderCard)}</div>
      ) : (
        <div className='empty_state_container'>
          <div className='empty_state_icon_wrapper'>
            <SearchX size={26} />
          </div>
          <h3 className='empty_state_title'>No research papers found</h3>
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
