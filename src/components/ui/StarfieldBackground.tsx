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
    const DENSITY = 0.1; // Percentage of grid nodes populated
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
      particleState: "idle" | "moving" = "idle";
      idleTimer = 0;

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

        // Base sizes: 1x1 or 2x2 for regular stars, 4x4 for the focal hero block
        if (this.isHero) {
          this.size = 4;
          this.speed = 0.015;
          this.alpha = 1.0;
        } else {
          this.size = Math.random() > 0.85 ? 2 : 1;
          this.speed = 0.02 + Math.random() * 0.03;
          this.alpha = 0.2 + Math.random() * 0.8;
        }

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

      draw(context: CanvasRenderingContext2D, color: string) {
        context.fillStyle = color;
        context.globalAlpha = this.alpha;

        const drawX = Math.floor(this.x);
        const drawY = Math.floor(this.y);
        context.fillRect(drawX, drawY, this.size, this.size);
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
        const starColor = "#FFFFFF";

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw(ctx, starColor);
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
