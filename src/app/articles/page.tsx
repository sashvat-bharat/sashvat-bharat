import type { Metadata } from 'next';

import '@/styles/global.css';
import '@/styles/articles/articles.css';
import ArticleExplorer from '@/components/articles/ArticleExplorer';
import { getAllArticlesList } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Articles & Publications',
  description:
    'Explore technical essays, updates, and deep dives into AI systems from Sashvat Bharat.',
  alternates: {
    canonical: '/articles',
  },
  openGraph: {
    title: 'Articles & Publications | Sashvat Bharat',
    description:
      'Explore technical essays, updates, and deep dives into AI systems from Sashvat Bharat.',
    url: 'https://sashvat.com/articles',
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
          <p className='subheading'>
            Technical essays, updates, and deep dives into AI systems and developer architectures.
          </p>
        </center>

        <ArticleExplorer articles={articles} />
      </div>
    </div>
  );
};

export default page;
