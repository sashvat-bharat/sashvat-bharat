"use client"

import "@/styles/global.css"
import "@/styles/ui/HeroSection.css"
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();

  const handlePromoClick = () => {
    router.push('/research/jit-tool-protocol');
  };

  return (
    <>
      <div className="hero-section">


        <div className="promo-trigger" role="button" tabIndex={0} onClick={handlePromoClick}>
          <span className="promo-text">Introducing the JIT Tool Protocol</span>

          <div className="action-button">
            <svg className="arrow-svg" viewBox="0 0 32 32">
              <path className="shaft" d="M3 16h20" />
              <path className="chevron" d="M18 8l8 8-8 8" />
            </svg>
          </div>
        </div>


        <div className="intro-text">
          <h1 className="main-title">Built for breakthroughs.</h1>

          <p className="support-title">
            Built to last. Designed to lead. Engineered for the future.
          </p>
        </div>


        <center>
          <button onClick={() => { alert("Accessing Event Horizon... Portal initialization is currently in progress. Please check back soon!"); }} className="event-horizon-btn">Enter the Horizon</button>
        </center>

      </div >
    </>
  )
}

export default HeroSection