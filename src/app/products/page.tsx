import React from 'react';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

import "@/styles/global.css";
import "@/styles/products/products.css";
import ProductsExplorer, { ProductItem } from '@/components/products/ProductsExplorer';

export const metadata: Metadata = {
  title: "Projects",
  description: "Discover our high-performance AI engines, autonomous tools, and productivity applications.",
  alternates: {
    canonical: '/products',
  },
};

function getProducts(): ProductItem[] {
  const filePath = path.join(process.cwd(), 'content/products.json');
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

const page = () => {
  const products = getProducts();

  return (
    <div className='home-container'>
      
      <div className='products_container'>
        {/* Hero Section */}
        <section className='products_hero'>
          <h1>Products & Systems</h1>
          <p>
            High-performance agent systems, productivity applications, and harnesses designed for next-generation intelligence.
          </p>
        </section>

        {/* Filterable Products List */}
        <section className='products_section'>
          <ProductsExplorer products={products} />
        </section>
      </div>
    </div>
  );
}

export default page;
