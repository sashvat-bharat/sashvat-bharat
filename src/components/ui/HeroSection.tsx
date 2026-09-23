'use client';

import '@/styles/global.css';
import '@/styles/ui/HeroSection.css';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className='hero-section'>
      <Link
        href='/articles/agent-accelerator'
        className='promo-trigger'
        style={{ textDecoration: 'none' }}
      >
        <span className='promo-text'>Introducing Agent Accelerator</span>

        <div className='action-button'>
          <svg className='arrow-svg' viewBox='0 0 32 32' role='img' aria-hidden='true'>
            <title>Arrow</title>
            <path className='shaft' d='M3 16h20' />
            <path className='chevron' d='M18 8l8 8-8 8' />
          </svg>
        </div>
      </Link>

      <div className='intro-text'>
        <h1 className='main-title'>Built for breakthroughs.</h1>

        <p className='support-title'>Built to last. Designed to lead. Engineered for the future.</p>
      </div>

      <center>
        <button
          type='button'
          onClick={() => {
            alert(
              'currently in progress. Please check back soon!',
            );
          }}
          className='event-horizon-btn'
        >
          Enter the Horizon
        </button>
      </center>
    </div>
  );
};

export default HeroSection;
