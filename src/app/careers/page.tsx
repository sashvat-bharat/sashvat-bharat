import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';

import '@/styles/global.css';
import '@/styles/careers/careers.css';
import CareersExplorer, { type CareerRole } from '@/components/careers/CareersExplorer';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Join Sashvat Bharat. We are assembling a high-density collective of systems engineers, machine learning scientists, and builders solving foundational AI.',
  alternates: {
    canonical: '/careers',
  },
  openGraph: {
    title: 'Careers | Sashvat Bharat',
    description:
      'Join Sashvat Bharat. We are assembling a high-density collective of systems engineers, machine learning scientists, and builders solving foundational AI.',
    url: 'https://sashvat.com/careers',
  },
};

interface CareersData {
  hiring: boolean;
  roles: CareerRole[];
}

function getCareersData(): CareersData {
  const filePath = path.join(process.cwd(), 'content/careers.json');
  if (!fs.existsSync(filePath)) return { hiring: false, roles: [] };
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { hiring: false, roles: parsed };
    }
    return {
      hiring: Boolean(parsed.hiring),
      roles: Array.isArray(parsed.roles) ? parsed.roles : [],
    };
  } catch {
    return { hiring: false, roles: [] };
  }
}

export default function CareersPage() {
  const { hiring, roles } = getCareersData();

  return (
    <div className='home-container'>
      <div className='careers_container'>
        {/* ── 1. Hero Section ── */}
        <section className='careers_hero'>
          <div className={`careers_badge ${hiring ? 'hiring_active' : 'hiring_paused'}`}>
            <span className={`badge_dot ${hiring ? 'active' : 'paused'}`} />
            <span>{hiring ? "We're Hiring" : 'Not Actively Hiring'}</span>
          </div>

          <h1>Engineering Foundational Intelligence</h1>
          <p>
            {hiring
              ? 'We are assembling a high-density research and systems lab dedicated to building deterministic multi-agent architectures, self-evolving memory runtimes, and sovereign computing infrastructure.'
              : 'We are currently operating as a high-velocity, close-knit core team. While active recruitment is temporarily on pause, we are always eager to connect with exceptional minds.'}
          </p>

          {/* Highlights Strip */}
          <div className='careers_highlights_strip'>
            <div className='highlight_item'>
              <span className='highlight_val'>Agentic Systems</span>
              <span className='highlight_label'>
                Autonomous reasoning loops and dynamic tool execution
              </span>
            </div>
            <div className='highlight_item'>
              <span className='highlight_val'>Systems & Runtimes</span>
              <span className='highlight_label'>
                High-throughput, deterministic execution and memory models
              </span>
            </div>
            <div className='highlight_item'>
              <span className='highlight_val'>Clean Architecture</span>
              <span className='highlight_label'>
                Zero unnecessary layers, engineered from first principles
              </span>
            </div>
            <div className='highlight_item'>
              <span className='highlight_val'>Applied Research</span>
              <span className='highlight_label'>
                Bridging foundational mathematics with resilient production software
              </span>
            </div>
          </div>
        </section>

        {/* ── 2. Open Roles / Hiring Status ── */}
        <section className='careers_positions_section'>
          <div className='section_header'>
            <h2>Open Positions</h2>
            <p>
              {hiring
                ? 'Explore active opportunities to build foundational AI systems with us.'
                : 'Current status of our active recruiting and team growth.'}
            </p>
          </div>

          <CareersExplorer roles={roles} isHiring={hiring} />
        </section>
      </div>
    </div>
  );
}
