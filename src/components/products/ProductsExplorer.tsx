'use client';

import { Package } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export interface ProductButton {
  name?: string;
  label?: string;
  link?: string;
  url?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export interface ProductItem {
  id: string;
  title: string;
  category?: string | string[];
  tags?: string | string[];
  link?: string;
  state?: string;
  description: string;
  features: string[];
  buttons?: ProductButton[];
  links?: ProductButton[];
}

interface ProductsExplorerProps {
  products: ProductItem[];
}

function getProductTags(product: ProductItem): string[] {
  const set = new Set<string>();
  if (product.tags) {
    if (Array.isArray(product.tags)) {
      for (const t of product.tags) {
        if (typeof t === 'string' && t.trim()) set.add(t.trim());
      }
    } else if (typeof product.tags === 'string') {
      set.add((product.tags as string).trim());
    }
  }
  if (product.category) {
    if (Array.isArray(product.category)) {
      for (const c of product.category) {
        if (typeof c === 'string' && c.trim()) set.add(c.trim());
      }
    } else if (typeof product.category === 'string') {
      set.add(product.category.trim());
    }
  }
  return Array.from(set);
}

export default function ProductsExplorer({ products }: ProductsExplorerProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collect unique tags/categories dynamically from products list for the filter bar
  const filterOptions = useMemo(() => {
    const defaultFilters = ['All'];
    const dynamicTags = new Set<string>();

    for (const product of products) {
      const tags = getProductTags(product);
      for (const tag of tags) {
        dynamicTags.add(tag);
      }
    }

    return [...defaultFilters, ...Array.from(dynamicTags)];
  }, [products]);

  // Filter products based on selected tag filter and search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const title = product.title?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      const tags = getProductTags(product).map((t) => t.toLowerCase());

      // 1. Tag matching from filter bar
      let passesFilter = true;
      if (selectedFilter !== 'All') {
        passesFilter = tags.includes(selectedFilter.toLowerCase());
      }

      // 2. Search query matching
      let passesSearch = true;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.trim().toLowerCase();
        passesSearch =
          title.includes(query) ||
          description.includes(query) ||
          tags.some((tag) => tag.includes(query));
      }

      return passesFilter && passesSearch;
    });
  }, [products, selectedFilter, searchQuery]);

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
            placeholder='Search products...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className='products_grid'>
          {filteredProducts.map((product) => (
            <div className='product_card' key={product.id}>
              <div className='product_header'>
                <h3 className='product_title'>{product.title}</h3>
                <p className='product_description'>{product.description}</p>
              </div>
              <div className='product_features'>
                {product.features.map((feature) => (
                  <div className='feature_item' key={feature}>
                    <span className='feature_bullet' />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className='product_footer'>
                {product.buttons && product.buttons.length > 0 ? (
                  product.buttons.map((btn, idx) => {
                    const label = btn.name || btn.label || 'Learn More';
                    const href = btn.link || btn.url;
                    const isSecondary = btn.variant === 'secondary' || (!btn.variant && idx > 0);
                    const btnClass = `action_btn ${isSecondary ? 'secondary_btn' : ''}`;

                    const buttonKey = `${product.id}-${label}-${href || 'btn'}`;

                    if (btn.disabled || !href) {
                      return (
                        <button key={buttonKey} type='button' className={btnClass} disabled>
                          {label}
                        </button>
                      );
                    }

                    const isExternal = href.startsWith('http://') || href.startsWith('https://');

                    if (isExternal) {
                      return (
                        <a
                          key={buttonKey}
                          href={href}
                          className={btnClass}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {label}
                        </a>
                      );
                    }

                    return (
                      <Link key={buttonKey} href={href} className={btnClass}>
                        {label}
                      </Link>
                    );
                  })
                ) : product.state === 'coming soon' ? (
                  <button type='button' className='action_btn' disabled>
                    Coming Soon
                  </button>
                ) : product.link ? (
                  (() => {
                    const isExternal =
                      product.link.startsWith('http://') || product.link.startsWith('https://');
                    return isExternal ? (
                      <a
                        href={product.link}
                        className='action_btn'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Get Started
                      </a>
                    ) : (
                      <Link href={product.link} className='action_btn'>
                        Get Started
                      </Link>
                    );
                  })()
                ) : (
                  <button type='button' className='action_btn'>
                    Get Started
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='empty_state_container'>
          <Package size={40} color='var(--text-secondary)' />
          <h3 className='empty_state_title'>No Products found</h3>
          <p className='empty_state_desc'>
            We couldn&apos;t find any products matching your search query or active filter.
          </p>
        </div>
      )}
    </>
  );
}
