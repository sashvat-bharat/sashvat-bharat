"use client";

import React, { useEffect, useRef } from "react";

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GRID_SIZE = 24; // Grid cell spacing in pixels
    const DENSITY = 0.09; // Percentage of grid nodes populated
    let cols = 0;
    let rows = 0;
    let particles: Particle[] = [];
    let dpr = 1;
    let animFrameId: number;

    class Particle {
      isHero: boolean;
      gx = 0;
      gy = 0;
      targetGx = 0;
      targetGy = 0;
      x = 0;
      y = 0;
      size = 1;
      speed = 0.02;
      alpha = 1;
      baseAlpha = 1;
      particleState: "idle" | "moving" = "idle";
      idleTimer = 0;
      colorType: "white" | "deepblue" | "purplish" = "white";
      pulsePhase = Math.random() * Math.PI * 2;
      pulseSpeed = 0.015 + Math.random() * 0.025;

      constructor(isHero = false) {
        this.isHero = isHero;
        this.reset();
      }

      reset() {
        this.gx = Math.floor(Math.random() * (cols || 1));
        this.gy = Math.floor(Math.random() * (rows || 1));
        this.targetGx = this.gx;
        this.targetGy = this.gy;

        this.x = this.gx * GRID_SIZE;
        this.y = this.gy * GRID_SIZE;

        const roll = Math.random();

        if (this.isHero) {
          this.size = 3;
          this.speed = 0.015;
          this.baseAlpha = 1.0;
          this.colorType = "purplish";
        } else {
          this.size = roll > 0.9 ? 2 : 1;
          this.speed = 0.02 + Math.random() * 0.03;
          this.baseAlpha = 0.2 + Math.random() * 0.8;

          // Color distribution: ~50% crisp white, ~27% deep blue, ~23% light purplish
          const colorRoll = Math.random();
          if (colorRoll > 0.77) {
            this.colorType = "purplish";
          } else if (colorRoll > 0.5) {
            this.colorType = "deepblue";
          } else {
            this.colorType = "white";
          }
        }

        this.alpha = this.baseAlpha;
        this.particleState = "idle";
        this.idleTimer = Math.floor(Math.random() * 120) + 30;
      }

      pickNewTarget() {
        const isHorizontal = Math.random() > 0.5;
        const distance =
          (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);

        if (isHorizontal) {
          this.targetGx = Math.max(0, Math.min(cols - 1, this.gx + distance));
        } else {
          this.targetGy = Math.max(0, Math.min(rows - 1, this.gy + distance));
        }

        this.particleState = "moving";
      }

      update() {
        const targetX = this.targetGx * GRID_SIZE;
        const targetY = this.targetGy * GRID_SIZE;

        // Subtle radiation pulse / twinkling animation
        this.pulsePhase += this.pulseSpeed;
        const pulse = Math.sin(this.pulsePhase);
        this.alpha = Math.max(0.15, Math.min(1.0, this.baseAlpha + pulse * 0.2));

        if (this.particleState === "moving") {
          const dx = targetX - this.x;
          const dy = targetY - this.y;

          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
            this.x = targetX;
            this.y = targetY;
            this.gx = this.targetGx;
            this.gy = this.targetGy;
            this.particleState = "idle";
            this.idleTimer = Math.floor(Math.random() * 180) + 40;
          } else {
            this.x += dx * this.speed;
            this.y += dy * this.speed;
          }
        } else if (this.particleState === "idle") {
          this.idleTimer--;
          if (this.idleTimer <= 0) {
            this.pickNewTarget();
          }
        }
      }

      draw(context: CanvasRenderingContext2D) {
        const drawX = Math.floor(this.x);
        const drawY = Math.floor(this.y);

        context.globalAlpha = this.alpha;

        if (this.isHero) {
          // Hero Star: Refined outer aura bloom
          context.shadowColor = "rgba(168, 85, 247, 0.95)";
          context.shadowBlur = 14;
          context.fillStyle = "rgba(147, 51, 234, 0.3)";
          context.fillRect(drawX - 2, drawY - 2, this.size + 4, this.size + 4);

          // Hero Core
          context.shadowColor = "rgba(96, 165, 250, 0.9)";
          context.shadowBlur = 8;
          context.fillStyle = "#F3E8FF";
          context.fillRect(drawX, drawY, this.size, this.size);
        } else if (this.colorType === "purplish") {
          // Soft violet bloom halo
          context.shadowColor = "rgba(192, 132, 252, 0.9)";
          context.shadowBlur = this.size > 1 ? 9 : 5;
          context.fillStyle = "rgba(168, 85, 247, 0.25)";
          context.fillRect(drawX - 1, drawY - 1, this.size + 2, this.size + 2);

          // Bright purplish-violet star core
          context.shadowBlur = this.size > 1 ? 6 : 3;
          context.fillStyle = "#F3E8FF";
          context.fillRect(drawX, drawY, this.size, this.size);
        } else if (this.colorType === "deepblue") {
          // Soft deep blue bloom halo
          context.shadowColor = "rgba(59, 130, 246, 0.9)";
          context.shadowBlur = this.size > 1 ? 9 : 5;
          context.fillStyle = "rgba(37, 99, 235, 0.25)";
          context.fillRect(drawX - 1, drawY - 1, this.size + 2, this.size + 2);

          // Bright deep blue star core
          context.shadowBlur = this.size > 1 ? 6 : 3;
          context.fillStyle = "#BAE6FD";
          context.fillRect(drawX, drawY, this.size, this.size);
        } else {
          // Fine crisp white star
          context.shadowColor = "rgba(255, 255, 255, 0.6)";
          context.shadowBlur = this.size > 1 ? 4 : 2;
          context.fillStyle = "#FFFFFF";
          context.fillRect(drawX, drawY, this.size, this.size);
        }

        // Reset shadow properties
        context.shadowBlur = 0;
        context.shadowColor = "transparent";
      }
    }

    function initCanvas() {
      if (!canvas || !ctx) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      cols = Math.floor(width / GRID_SIZE);
      rows = Math.floor(height / GRID_SIZE);

      const totalNodes = cols * rows;
      const count = Math.floor(totalNodes * DENSITY);

      particles = [];

      for (let i = 0; i < count; i++) {
        particles.push(new Particle(false));
      }

      particles.push(new Particle(true));
    }

    function animate() {
      if (!canvas || !ctx) return;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Always clear canvas
      ctx.clearRect(0, 0, width, height);

      // Only draw and animate star particles in dark mode
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";

      if (isDark) {
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw(ctx);
        }
      }

      animFrameId = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener("resize", handleResize);
    initCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
