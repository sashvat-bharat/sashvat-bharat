import React from 'react';
import type { Metadata } from 'next';
import { getLegalMarkdown } from '@/lib/legal';

import "@/styles/global.css";
import "@/styles/legal/legal.css";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Sashvat Bharat. Learn about the terms governing access and use of our platforms.",
  alternates: {
    canonical: '/legal/terms',
  },
};

const TermsOfService = () => {
  const htmlContent = getLegalMarkdown('terms.md');

  return (
    <div className="home-container">
      <div className="legal_container">
        <h1>Terms of Service</h1>
        <p className="legal_last_updated">Last Updated: July 24, 2026</p>

        <div className="legal_content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
};

export default TermsOfService;
