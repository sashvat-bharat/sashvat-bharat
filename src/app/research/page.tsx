import React from 'react';
import Link from 'next/link';
import "@/styles/global.css";
import "@/styles/research/research.css";
import TopBar from '@/components/layout/TopBar';
import { getAllResearchList } from '@/lib/markdown';

const page = async () => {
  // Fetch the data at build time (SSG)
  const researchPapers = getAllResearchList();

  return (
    <div className='research_page_container'>
      <TopBar />
      <br />

      <div className='research_articles_container'>
        <h1 className='heading'>Research</h1>

        {/* Dynamically map through the markdown files */}
        {researchPapers.map((paper) => (
          <Link href={`/research/${paper.slug}`} key={paper.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className='research_card'>
              <p className='publish_time'>Published: {paper.frontmatter.date}</p>
              <h1 className='title_heading'>{paper.frontmatter.title}</h1>
              <p className='short_description'>{paper.frontmatter.description}</p>
            </div>
          </Link>
        ))}

        {/* Fallback if folder is empty */}
        {researchPapers.length === 0 && (
          <p style={{ color: 'gray' }}>No research papers published yet.</p>
        )}
      </div>
    </div>
  );
}

export default page;