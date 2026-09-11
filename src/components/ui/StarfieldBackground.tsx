'use client';

import { useEffect, useRef } from 'react';

interface StarPalette {
  color: string;
}

// Astrophysical star color spectrum modeled directly after stars.png:
// Predominantly crisp diamond white, warm stellar amber/peach dwarfs, soft cyan/blue, and subtle lavender.
const STAR_PALETTES: StarPalette[] = [
  // Diamond / crisp white
  { color: '#FFFFFF' },
  { color: '#F0F6FC' },
  // Warm stellar amber / peach dwarf stars (visible throughout stars.png)
  { color: '#FED7AA' },
  { color: '#FFD8A8' },
  { color: '#FDBA74' },
  // Subtle cool blue / cyan
  { color: '#BAE6FD' },
  { color: '#93C5FD' },
  // Soft lavender / violet
  { color: '#E9D5FF' },
];

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let stars: Star[] = [];

    class Star {
      x = 0;
      y = 0;
      radius = 1;
      baseAlpha = 0.8;
      alpha = 0.8;
      palette: StarPalette;

      // Tier: 'micro' (distant background dust) or 'standard' (clear mid-ground stars)
      tier: 'micro' | 'standard';

      // Twinkle / scintillation
      twinklePhase = Math.random() * Math.PI * 2;
      twinkleSpeed = 0.008 + Math.random() * 0.015;
      twinkleAmp = 0.12 + Math.random() * 0.16;

      // Motion
      mode: 'idle' | 'gliding' = 'idle';
      idleTimer = 0;
      startX = 0;
      startY = 0;
      targetX = 0;
      targetY = 0;
      controlX = 0;
      controlY = 0;
      glideProgress = 1;
      glideDuration = 200;

      // Ambient zero-G micro-drift (very slow & calm)
      ambientAngle = Math.random() * Math.PI * 2;
      ambientSpeed = 0.004 + Math.random() * 0.01;
      swayPhase = Math.random() * Math.PI * 2;
      swaySpeed = 0.003 + Math.random() * 0.006;

      constructor(tier: 'micro' | 'standard', randomPos = true) {
        this.tier = tier;

        // Palette selection weighted towards white & warm amber
        const roll = Math.random();
        if (roll < 0.5) {
          this.palette = STAR_PALETTES[Math.floor(Math.random() * 2)];
        } else if (roll < 0.75) {
          this.palette = STAR_PALETTES[2 + Math.floor(Math.random() * 3)];
        } else if (roll < 0.9) {
          this.palette = STAR_PALETTES[5 + Math.floor(Math.random() * 2)];
        } else {
          this.palette = STAR_PALETTES[7];
        }

        if (tier === 'micro') {
          this.radius = 0.45 + Math.random() * 0.4;
          this.baseAlpha = 0.2 + Math.random() * 0.4;
          this.ambientSpeed = 0.003 + Math.random() * 0.006;
          this.twinkleAmp = 0.1 + Math.random() * 0.12;
        } else {
          this.radius = 0.85 + Math.random() * 0.65;
          this.baseAlpha = 0.55 + Math.random() * 0.4;
          this.ambientSpeed = 0.006 + Math.random() * 0.01;
          this.twinkleAmp = 0.14 + Math.random() * 0.16;
        }

        this.alpha = this.baseAlpha;
        this.reset(randomPos);
      }

      reset(randomPos = false) {
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (randomPos) {
          this.x = Math.random() * w;
          this.y = Math.random() * h;
        }

        this.startX = this.x;
        this.startY = this.y;
        this.targetX = this.x;
        this.targetY = this.y;
        this.controlX = this.x;
        this.controlY = this.y;
        this.glideProgress = 1;
        this.mode = 'idle';
        this.idleTimer = Math.floor(Math.random() * 300) + 100;
      }

      pickNewGlide(w: number, h: number) {
        this.startX = this.x;
        this.startY = this.y;

        const angle = Math.random() * Math.PI * 2;
        const distance =
          this.tier === 'standard' ? 30 + Math.random() * 55 : 15 + Math.random() * 28;

        let targetX = this.startX + Math.cos(angle) * distance;
        let targetY = this.startY + Math.sin(angle) * distance;

        // Wrap gently
        if (targetX < -30) targetX = w + 30;
        else if (targetX > w + 30) targetX = -30;
        if (targetY < -30) targetY = h + 30;
        else if (targetY > h + 30) targetY = -30;

        this.targetX = targetX;
        this.targetY = targetY;

        // Bezier control point for natural curved trajectory
        const midX = (this.startX + this.targetX) / 2;
        const midY = (this.startY + this.targetY) / 2;
        const dx = this.targetX - this.startX;
        const dy = this.targetY - this.startY;
        const len = Math.hypot(dx, dy) || 1;

        const curveAmount = (Math.random() - 0.5) * len * 0.45;
        this.controlX = midX + (-dy / len) * curveAmount;
        this.controlY = midY + (dx / len) * curveAmount;

        this.glideProgress = 0;
        // Slowed down, graceful movement
        this.glideDuration = Math.floor(distance * 4.8) + 140;
        this.mode = 'gliding';
      }

      update(w: number, h: number) {
        // Natural twinkle scintillation
        this.twinklePhase += this.twinkleSpeed;
        const shimmer = Math.sin(this.twinklePhase);
        this.alpha = Math.max(0.08, Math.min(1.0, this.baseAlpha + shimmer * this.twinkleAmp));

        if (this.mode === 'gliding') {
          this.glideProgress += 1 / this.glideDuration;

          if (this.glideProgress >= 1) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.mode = 'idle';
            this.idleTimer = Math.floor(Math.random() * 300) + 120;
          } else {
            // Cubic smoothstep easing
            const t = this.glideProgress;
            const easeT = t * t * (3 - 2 * t);
            const oneMinusT = 1 - easeT;

            // Quadratic Bezier curve
            this.x =
              oneMinusT * oneMinusT * this.startX +
              2 * oneMinusT * easeT * this.controlX +
              easeT * easeT * this.targetX;

            this.y =
              oneMinusT * oneMinusT * this.startY +
              2 * oneMinusT * easeT * this.controlY +
              easeT * easeT * this.targetY;
          }
        } else {
          // Ambient zero-G organic drift (slow & gentle)
          this.swayPhase += this.swaySpeed;
          this.x +=
            Math.cos(this.ambientAngle) * this.ambientSpeed + Math.sin(this.swayPhase) * 0.025;
          this.y +=
            Math.sin(this.ambientAngle) * this.ambientSpeed + Math.cos(this.swayPhase) * 0.025;

          this.idleTimer--;
          if (this.idleTimer <= 0) {
            this.pickNewGlide(w, h);
          }
        }

        // Viewport wrapping
        const bound = 30;
        if (this.x < -bound) this.x = w + bound;
        else if (this.x > w + bound) this.x = -bound;
        if (this.y < -bound) this.y = h + bound;
        else if (this.y > h + bound) this.y = -bound;
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.alpha;
        context.fillStyle = this.palette.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    function initCanvas() {
      if (!canvas || !ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Star density matching stars.png: rich backdrop of micro stars + mid-field stars
      const totalCount = Math.max(240, Math.min(360, Math.floor((width * height) / 5200)));
      const standardCount = Math.floor(totalCount * 0.3);
      const microCount = totalCount - standardCount;

      stars = [];

      // 1. Distant micro stars (dense celestial field)
      for (let i = 0; i < microCount; i++) {
        stars.push(new Star('micro', true));
      }

      // 2. Standard bright stars
      for (let i = 0; i < standardCount; i++) {
        stars.push(new Star('standard', true));
      }
    }

    function animate() {
      if (!canvas || !ctx) return;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Always clear canvas
      ctx.clearRect(0, 0, width, height);

      // Only draw and animate star particles in dark mode
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      if (isDark) {
        for (let i = 0; i < stars.length; i++) {
          stars[i].update(width, height);
          stars[i].draw(ctx);
        }
      }

      animFrameId = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);
    initCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
