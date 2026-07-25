import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldCheck, FileText, ArrowRight } from 'lucide-react';

import "@/styles/global.css";
import "@/styles/legal/legal.css";

export const metadata: Metadata = {
  title: "Legal Directory",
  description: "Access Sashvat Bharat's Terms of Service and Privacy Policy agreements.",
  alternates: {
    canonical: '/legal',
  },
};

const LegalDirectory = () => {
  return (
    <div className="home-container">

      <div className="legal_container" style={{ textAlign: 'center', margin: '24px auto 0 auto', padding: '40px 24px 80px 24px' }}>
        <h1 style={{ marginBottom: '16px' }}>Legal & Agreements</h1>
        <p className="legal_subheading" style={{ marginBottom: '64px' }}>
          Please select an agreement from the options below to review our terms.
        </p>

        <div className="legal_content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '640px', margin: '0 auto' }}>
          <Link href="/legal/privacy-policy" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="pillar_card" style={{ cursor: 'pointer', textAlign: 'left', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <ShieldCheck size={24} color="var(--text-primary)" />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>Privacy Policy</h3>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Learn about how we collect, use, protect, and handle user data in our systems.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                <span>Read Policy</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </Link>

          <Link href="/legal/terms" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="pillar_card" style={{ cursor: 'pointer', textAlign: 'left', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <FileText size={24} color="var(--text-primary)" />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>Terms of Service</h3>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Review the terms, rules, and governance policies for using our tools and services.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                <span>Read Terms</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        </div>

        <div className="legal_draft_notice">
          <span className="legal_draft_badge">Draft</span>
          <span>These documents are active drafts. They are currently subject to review and not finalized.</span>
        </div>
      </div>

    </div>
  );
};

export default LegalDirectory;
