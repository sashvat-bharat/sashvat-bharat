"use client";

import React, { useState, useMemo } from 'react';
import { Terminal, Package } from 'lucide-react';

export interface ProductItem {
  id: string;
  title: string;
  category: string | string[];
  link?: string;
  state?: string;
  description: string;
  features: string[];
}

interface ProductsExplorerProps {
  products: ProductItem[];
}

export default function ProductsExplorer({ products }: ProductsExplorerProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collect unique categories dynamically from products list
  const filterOptions = useMemo(() => {
    const defaultFilters = ['All'];
    const dynamicCategories = new Set<string>();

    products.forEach((product) => {
      if (product.category) {
        if (Array.isArray(product.category)) {
          product.category.forEach((cat) => dynamicCategories.add(cat));
        } else {
          dynamicCategories.add(product.category);
        }
      }
    });

    return [...defaultFilters, ...Array.from(dynamicCategories)];
  }, [products]);

  // Filter products based on selected filter category and search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const title = product.title?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      
      const categories = Array.isArray(product.category)
        ? product.category.map((c) => c.toLowerCase())
        : [product.category?.toLowerCase() || ''];

      // 1. Category filter matching
      let passesFilter = true;
      if (selectedFilter !== 'All') {
        passesFilter = categories.includes(selectedFilter.toLowerCase());
      }

      // 2. Search query matching
      let passesSearch = true;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.trim().toLowerCase();
        passesSearch = title.includes(query) || 
                       description.includes(query) || 
                       categories.some((cat) => cat.includes(query));
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
              className={selectedFilter === filter ? 'active' : ''}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className='search-section'>
          <input
            type="text"
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                  <div className='product_icon_wrapper'>
                    <Terminal size={24} />
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {Array.isArray(product.category) ? (
                      product.category.map((cat, idx) => (
                        <span className='product_meta_tag' key={idx}>{cat}</span>
                      ))
                    ) : (
                      <span className='product_meta_tag'>{product.category}</span>
                    )}
                  </div>
                </div>
                <h3 className='product_title'>{product.title}</h3>
                <p className='product_description'>{product.description}</p>
              </div>
              <div className='product_features'>
                {product.features.map((feature, idx) => (
                  <div className='feature_item' key={idx}>
                    <span className='feature_bullet' />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className='product_footer'>
                {product.state === 'coming soon' ? (
                  <button className='action_btn' disabled>Coming Soon</button>
                ) : product.link ? (
                  <a 
                    href={product.link} 
                    className='action_btn' 
                    target='_blank' 
                    rel='noopener noreferrer'
                  >
                    Get Started
                  </a>
                ) : (
                  <button className='action_btn'>Get Started</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='empty_state_container'>
          <Package size={40} color="var(--text-secondary)" />
          <h3 className='empty_state_title'>No Products found</h3>
          <p className='empty_state_desc'>
            We couldn&apos;t find any Producst matching your search query or active filter.
          </p>
        </div>
      )}
    </>
  );
}
