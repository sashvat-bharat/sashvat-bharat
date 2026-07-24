import React from 'react';
import type { Metadata } from 'next';

import "@/styles/global.css";
import "@/styles/articles/articles.css";
import { getAllArticlesList } from '@/lib/articles';
import ArticleExplorer from '@/components/articles/ArticleExplorer';

export const metadata: Metadata = {
  title: "Articles & Updates",
  description: "Explore the latest articles, posts, and announcements from Sashvat Bharat.",
  alternates: {
    canonical: '/articles',
  },
};

const page = async () => {
  // Fetch the data at build time (SSG)
  const articles = getAllArticlesList();

  return (
    <div className='home-container'>
      <div className='research_articles_container'>
        <center>
          <h1 className='heading'>Articles & Publications</h1>
          <p className='subheading'>Technical essays, updates, and deep dives into AI systems and developer architectures.</p>
        </center>

        <ArticleExplorer articles={articles} />
      </div>
    </div>
  );
}

export default page;
