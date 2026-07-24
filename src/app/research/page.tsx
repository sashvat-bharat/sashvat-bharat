import React from 'react';
import type { Metadata } from 'next';

import "@/styles/global.css";
import "@/styles/research/research.css";
import { getAllResearchList } from '@/lib/markdown';
import ResearchExplorer from '@/components/research/ResearchExplorer';

export const metadata: Metadata = {
  title: "Research & Publications",
  description: "Explore the latest research, whitepapers, and technical articles from Sashvat Bharat on AI/ML and autonomous systems.",
  alternates: {
    canonical: '/research',
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
          <p className='subheading'>Exploring systems engineering, reasoning models, and foundational architectures for autonomous agents.</p>
        </center>

        <ResearchExplorer researchPapers={researchPapers} />
      </div>
    </div>
  );
}

export default page;
