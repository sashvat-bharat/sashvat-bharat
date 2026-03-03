"use client"
import React, { useState, useEffect, useRef } from 'react';

/**
 * Sashvat Bharat - Stealth Intelligence Edition
 * Focus: Sophistication, Precision, "Stealth" UI.
 * Changes: Slimmed down CTA, refined typography, darker palette.
 */

const Page = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Subtle magnetic pull - 150px range, max 10px movement
        if (dist < 150) {
          const power = (150 - dist) / 150;
          setBtnOffset({ x: dx * 0.1 * power, y: dy * 0.1 * power });
        } else {
          setBtnOffset({ x: 0, y: 0 });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="container">
      {/* The "Neural Network" background - very subtle */}
      <div className="bg-mesh" style={{
        background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(132, 114, 76, 0.08) 0%, transparent 50%)`
      }} />

      <header className="nav">
        <div className="brand">SASHVAT BHARAT</div>
        <div className="status">
          <span className="pulse"></span>
          LIVE NODES: 1,204
        </div>
      </header>

      <main className="hero">
        <div className="content-box">
          <p className="pre-title">Sovereign Intelligence Systems</p>
          <h1 className="title">
            The Future is <br />
            <span className="accent">Architected.</span>
          </h1>

          <div className="cta-section">
            <button
              ref={buttonRef}
              className="stealth-btn"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`
              }}
            >
              <div className="btn-glow" style={{ opacity: isHovered ? 1 : 0 }}></div>
              <span className="btn-text">DEPLOY STACK</span>
              <div className="btn-border"></div>
            </button>
            <p className="sub-hint">Available for Private Beta</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="f-left">CORE-01 // BENGALURU</div>
        <div className="f-right">BY AKSHAT DWIVEDI</div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&display=swap');

        :root {
          --bg: #080808;
          --gold: #c5a059;
          --gold-muted: rgba(197, 160, 89, 0.2);
          --text: #e0e0e0;
          --dim: #555555;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: var(--bg);
          color: var(--text);
          font-family: 'Space Grotesk', sans-serif;
          overflow: hidden;
        }

        .container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .bg-mesh {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        /* Nav Bar */
        .nav {
          padding: 2.5rem 3.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .brand {
          font-weight: 700;
          letter-spacing: 0.3rem;
          font-size: 0.8rem;
          color: var(--gold);
        }

        .status {
          font-size: 0.65rem;
          letter-spacing: 2px;
          color: var(--dim);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pulse {
          width: 4px;
          height: 4px;
          background: #4caf50;
          border-radius: 50%;
          box-shadow: 0 0 8px #4caf50;
          animation: blink 2s infinite;
        }

        @keyframes blink { 50% { opacity: 0.3; } }

        /* Hero Section */
        .hero {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 5;
        }

        .content-box {
          text-align: center;
          max-width: 800px;
        }

        .pre-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.6rem;
          color: var(--dim);
          margin-bottom: 1.5rem;
        }

        .title {
          font-size: clamp(3rem, 10vw, 6rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -2px;
          margin-bottom: 4rem;
        }

        .accent {
          font-weight: 700;
          color: white;
          text-shadow: 0 0 30px rgba(255,255,255,0.1);
        }

        /* THE STEALTH BUTTON */
        .cta-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .stealth-btn {
          position: relative;
          background: #000;
          color: white;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 14px 48px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 4px;
          border-radius: 2px;
          cursor: pointer;
          transition: border 0.4s ease, transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
          overflow: hidden;
        }

        .btn-text {
          position: relative;
          z-index: 2;
          transition: letter-spacing 0.3s ease;
        }

        .stealth-btn:hover .btn-text {
          letter-spacing: 6px;
        }

        .btn-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, var(--gold-muted), transparent 70%);
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .btn-border {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 1px;
          background: var(--gold);
          transition: all 0.4s ease;
          transform: translateX(-50%);
        }

        .stealth-btn:hover .btn-border {
          width: 80%;
          box-shadow: 0 0 10px var(--gold);
        }

        .sub-hint {
          font-size: 0.6rem;
          color: var(--dim);
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        /* Footer */
        .footer {
          padding: 2.5rem 3.5rem;
          display: flex;
          justify-content: space-between;
          font-size: 0.6rem;
          letter-spacing: 2px;
          color: var(--dim);
          border-top: 1px solid rgba(255,255,255,0.03);
        }

        @media (max-width: 768px) {
          .nav, .footer { padding: 1.5rem; }
          .title { font-size: 3.5rem; }
          .pre-title { letter-spacing: 0.3rem; }
        }
      `}</style>
    </div>
  );
};

export default Page;