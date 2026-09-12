import type { Metadata } from 'next';

import '@/styles/global.css';
import '@/styles/research/research.css';
import ResearchExplorer from '@/components/research/ResearchExplorer';
import { getAllResearchList } from '@/lib/markdown';

export const metadata: Metadata = {
  title: 'Research & Publications',
  description:
    'Explore the latest research, whitepapers, and technical articles from Sashvat Bharat on AI/ML and autonomous systems.',
  alternates: {
    canonical: '/research',
  },
  openGraph: {
    title: 'Research & Publications | Sashvat Bharat',
    description:
      'Explore the latest research, whitepapers, and technical articles from Sashvat Bharat on AI/ML and autonomous systems.',
    url: 'https://sashvat.com/research',
  },
};

const page = async () => {
  // Fetch the data at build time (SSG)
  const researchPapers = getAllResearchList();

  return (
    <div className='home-container'>
      <div className='research_articles_container'>
        <center>
          <h1 className='heading'>Super Intelligence Research Lab</h1>
          <p className='subheading'>
            Exploring systems engineering, reasoning models, and foundational architectures for
            autonomous agents.
          </p>
        </center>

        <ResearchExplorer researchPapers={researchPapers} />
      </div>
    </div>
  );
};

export default page;
