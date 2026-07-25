import React from 'react';
import type { Metadata } from 'next';
import { getLegalMarkdown } from '@/lib/legal';

import "@/styles/global.css";
import "@/styles/legal/legal.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Sashvat Bharat. Learn about how we handle and protect data in our systems.",
  alternates: {
    canonical: '/legal/privacy-policy',
  },
};

const PrivacyPolicy = () => {
  const htmlContent = getLegalMarkdown('privacy-policy.md');

  return (
    <div className="home-container">
      <div className="legal_container">
        <h1>Privacy Policy</h1>
        <p className="legal_last_updated">Last Updated: July 24, 2026</p>

        <div className="legal_content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
