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


        <div className='intro-text'>
          <h1>Rule the Horizon. Beyond Limits!</h1>
          <p>Built to last. Designed to lead. Engineered for the future.</p>
        </div>


        <center>
          <button className="event-horizon-btn">
            <span className="btn-text">Enter the Horizon</span>
            <div className="btn-underline"></div>
          </button>
        </center>

      </div>
    </>
  )
}

export default HeroSection