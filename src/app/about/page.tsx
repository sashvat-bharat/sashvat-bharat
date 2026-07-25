import React from 'react';
import type { Metadata } from 'next';
import { getMarkdownContent } from '@/lib/legal';
import ArticleContent from '@/components/research/ArticleContent';

import "@/styles/global.css";
import "@/styles/markdown.css";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Sashvat Bharat, our mission, vision, and core philosophy.",
  alternates: {
    canonical: '/about',
  },
};

const Page = () => {
  const htmlContent = getMarkdownContent('about.md');

  return (
    <div className='home-container'>
      <div className="about_container" style={{ maxWidth: '800px', margin: '24px auto 0 auto', padding: '40px 24px 80px 24px' }}>
        <center>
        <h1 style={{ fontSize: 'clamp(32px, 4.2vw, 48px)', fontWeight: 450, marginBottom: '32px', letterSpacing: '-0.028em', fontFamily: 'var(--font-geist-sans), sans-serif', color: 'var(--text-primary)' }}>
          About Sashvat Bharat
        </h1></center>
        <ArticleContent htmlContent={htmlContent} />
      </div>
    </div>
  );
};

export default Page;
