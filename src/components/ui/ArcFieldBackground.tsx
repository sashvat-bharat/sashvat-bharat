'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import '@/styles/ui/ArcField.css';

/**
 * Hero "stage": a fixed-size box (see ArcField.css) that wraps the hero section and
 * paints dashed arcs with small pixel nodes travelling along them behind it.
 * The pointer snaps to the nearest node and types out a mono tag; with no pointer
 * (touch / idle) a node introduces itself every few seconds.
 *
 * - Not a page background: the canvas is sized to the stage, never the viewport.
 * - Arcs are placed with best-candidate sampling, nodes are spaced by arc length, so
 *   the scatter is even (no clumps, no near-duplicate rings) at any width.
 * - Pauses while off-screen; honors prefers-reduced-motion (one static frame).
 */

// Labels come from the site's own vocabulary (focus areas / products / research).
const LABELS = [
  'AGENT ACCELERATOR',
  'JIT TOOL SPAWNING',
  'HARNESS ENGINEERING',
  'AUTONOMOUS AGENTS',
  'SOVEREIGN INFRA',
  'LOCAL-FIRST',
  'REASONING ENGINES',
  'OPEN-SOURCE CORE',
  'BHARAT 2047',
] as const;

interface Palette {
  dots: readonly string[];
  arc: string;
  solidBg: string;
  solidText: string;
  outlineBg: string;
  outlineBorder: string;
  outlineText: string;
}

const DARK: Palette = {
  dots: ['#ff4d4d', '#ff8a2a', '#ffd23f', '#7dff4f', '#2de2e6', '#4d6bff', '#c04dff', '#ff4fa3'],
  arc: 'rgba(255,255,255,0.2)',
  solidBg: '#f4f4f6',
  solidText: '#08080a',
  outlineBg: 'rgba(8,8,12,0.9)',
  outlineBorder: 'rgba(255,255,255,0.4)',
  outlineText: '#f4f4f6',
};

const LIGHT: Palette = {
  dots: ['#e5383b', '#f06a00', '#d19a00', '#2fae00', '#009fa8', '#2b45e6', '#9b2be0', '#d92a7a'],
  arc: 'rgba(10,10,12,0.2)',
  solidBg: '#121214',
  solidText: '#ffffff',
  outlineBg: 'rgba(255,255,255,0.92)',
  outlineBorder: 'rgba(10,10,12,0.4)',
  outlineText: '#121214',
};

const SNAP_RADIUS = 90;
const HOLD_MS = 1800;
const IDLE_MS = 4000;
const AUTO_EVERY_MS = 2600;
const MAX_TAGS = 3;
const TYPE_CPS = 38;
const ERASE_CPS = 90;
const TAG_H = 20;
const TAG_PAD_X = 8;
const TAG_STEM = 14;
const MARKER = 9;

/** Arcs never rise above this fraction of the stage, keeping the headline clear. */
const ARC_MAX_HEIGHT = 0.44;
/** Candidates tried per arc when placing it (higher = more even scatter). */
const PLACEMENT_CANDIDATES = 28;
/** Target spacing between nodes along an arc, in px. */
const NODE_SPACING = 120;
/** Nodes fade in/out over this many px at each end of their arc. */
const END_FADE_PX = 44;

interface Arc {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  len: number;
}

interface Dot {
  arc: number;
  t: number;
  speed: number;
  size: number;
  round: boolean;
  color: number;
  label: string;
  x: number;
  y: number;
  alpha: number;
}

interface Tag {
  dot: Dot;
  label: string;
  solid: boolean;
  lastHover: number;
  erasing: boolean;
  chars: number;
}

// Deterministic PRNG so the composition is identical across reloads.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Half-ellipse arc length (Ramanujan's approximation of the full perimeter, halved). */
function halfEllipseLength(a: number, b: number) {
  return (Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)))) / 2;
}

export default function ArcFieldBackground({ children }: { children: ReactNode }) {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!layer || !canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let w = 0;
    let h = 0;
    let arcs: Arc[] = [];
    let dots: Dot[] = [];
    const tags: Tag[] = [];
    const pointer = { cx: -9999, cy: -9999, active: false, lastMove: 0 };
    let hovered: Dot | null = null;
    let visible = true;
    let nextAuto = 0;
    let last = 0;
    let raf = 0;

    const family =
      getComputedStyle(document.body).getPropertyValue('--font-departure-mono').trim() ||
      'monospace';
    const font = `11px ${family}, ui-monospace, monospace`;
    document.fonts?.load(`11px ${family}`).catch(() => {});

    /**
     * Best-candidate (Mitchell) sampling over (horizontal position, size): each new arc is
     * the candidate farthest from every arc already placed, which yields an even, blue-noise
     * scatter with varied sizes and no near-coincident rings.
     */
    function buildScene() {
      const rand = mulberry32(0x5a5bb);
      const count = clamp(Math.round(w / 95), 8, 16);
      const rMin = Math.max(w * 0.07, 60);
      const rMax = Math.max(w * 0.3, 220);
      const yCap = h * ARC_MAX_HEIGHT;

      const placed: { u: number; v: number }[] = [];
      arcs = [];
      for (let i = 0; i < count; i++) {
        let best = { u: 0.5, v: 0.5 };
        let bestScore = -1;
        for (let k = 0; k < PLACEMENT_CANDIDATES; k++) {
          const u = 0.02 + 0.96 * rand();
          const v = rand();
          let score = placed.length ? Number.POSITIVE_INFINITY : rand();
          for (const p of placed) {
            const du = u - p.u;
            const dv = (v - p.v) * 0.7;
            score = Math.min(score, du * du + dv * dv);
          }
          if (score > bestScore) {
            bestScore = score;
            best = { u, v };
          }
        }
        placed.push(best);
        const rx = rMin + (rMax - rMin) * best.v ** 1.2;
        const ry = Math.min(rx * (0.82 + rand() * 0.3), yCap);
        arcs.push({ cx: w * best.u, cy: h, rx, ry, len: halfEllipseLength(rx, ry) });
      }

      // Nodes: evenly spaced along each arc, one constant speed per arc so the spacing holds.
      dots = [];
      arcs.forEach((a, ai) => {
        const n = clamp(Math.round(a.len / NODE_SPACING), 3, 9);
        const phase = rand();
        const dir = rand() < 0.5 ? -1 : 1;
        const speed = ((14 + rand() * 22) / a.len) * dir; // 14–36 px/s along the arc
        for (let j = 0; j < n; j++) {
          const big = rand() < 0.08;
          dots.push({
            arc: ai,
            t: (phase + j / n) % 1,
            speed,
            size: big ? 6 : 3 + Math.floor(rand() * 3),
            round: rand() < 0.4,
            color: (ai * 3 + j * 2 + Math.floor(rand() * 2)) % DARK.dots.length,
            label: LABELS[Math.floor(rand() * LABELS.length)],
            x: 0,
            y: 0,
            alpha: 0,
          });
        }
      });
      for (const d of dots) place(d);
    }

    function place(dot: Dot) {
      const a = arcs[dot.arc];
      const ang = Math.PI * (1 + dot.t);
      dot.x = a.cx + a.rx * Math.cos(ang);
      dot.y = a.cy + a.ry * Math.sin(ang);
      // Fade near the arc ends so the wrap-around is invisible.
      const fade = END_FADE_PX / a.len;
      dot.alpha = Math.min(1, dot.t / fade, (1 - dot.t) / fade);
    }

    function resize(width: number, height: number) {
      const c = canvas;
      const g = ctx;
      if (!c || !g || width < 1 || height < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = width;
      h = height;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      tags.length = 0;
      hovered = null;
      buildScene();
      if (reduceMotion) render(performance.now(), true);
    }

    function spawnTag(dot: Dot, now: number) {
      const live = tags.filter((t) => !t.erasing);
      if (live.length >= MAX_TAGS) {
        const oldest = live.find((t) => t.dot !== hovered);
        if (oldest) oldest.erasing = true;
      }
      tags.push({
        dot,
        label: dot.label,
        solid: Math.random() < 0.5,
        lastHover: now,
        erasing: false,
        chars: 0,
      });
    }

    function pickHover(px: number, py: number): Dot | null {
      if (!pointer.active) return null;
      let best: Dot | null = null;
      let bestD = SNAP_RADIUS * SNAP_RADIUS;
      for (const d of dots) {
        if (d.alpha < 0.4) continue;
        const dx = d.x - px;
        const dy = d.y - py;
        const dd = dx * dx + dy * dy;
        if (dd < bestD) {
          bestD = dd;
          best = d;
        }
      }
      // Hysteresis: stay on the current node unless another is clearly closer.
      if (hovered && hovered.alpha >= 0.4) {
        const dx = hovered.x - px;
        const dy = hovered.y - py;
        const hd = dx * dx + dy * dy;
        if (hd < (SNAP_RADIUS * 1.35) ** 2 && (!best || hd <= bestD * 1.5)) best = hovered;
      }
      return best;
    }

    function update(now: number, dt: number) {
      for (const d of dots) {
        d.t += d.speed * dt;
        if (d.t > 1) d.t -= 1;
        else if (d.t < 0) d.t += 1;
        place(d);
      }

      // The stage scrolls with the page, so convert the pointer to stage coordinates each frame.
      const rect = canvas?.getBoundingClientRect();
      const px = rect ? pointer.cx - rect.left : -9999;
      const py = rect ? pointer.cy - rect.top : -9999;

      hovered = pickHover(px, py);
      if (hovered) {
        const existing = tags.find((t) => t.dot === hovered && !t.erasing);
        if (existing) existing.lastHover = now;
        else spawnTag(hovered, now);
      } else if (!finePointer || now - pointer.lastMove > IDLE_MS) {
        // Idle / touch: let a node introduce itself every so often.
        if (now >= nextAuto) {
          nextAuto = now + AUTO_EVERY_MS;
          const pool = dots.filter(
            (d) =>
              d.alpha > 0.9 &&
              d.y > h * 0.68 &&
              d.y < h * 0.88 &&
              d.x > w * 0.1 &&
              d.x < w * 0.78 &&
              !tags.some((t) => t.dot === d),
          );
          if (pool.length) spawnTag(pool[Math.floor(Math.random() * pool.length)], now);
        }
      }

      for (const t of tags) {
        if (!t.erasing && t.dot !== hovered && now - t.lastHover > HOLD_MS) t.erasing = true;
        if (t.dot.alpha < 0.15) t.erasing = true;
        t.chars = clamp(t.chars + (t.erasing ? -ERASE_CPS : TYPE_CPS) * dt, 0, t.label.length);
      }
      for (let i = tags.length - 1; i >= 0; i--) {
        if (tags[i].erasing && tags[i].chars <= 0) tags.splice(i, 1);
      }
    }

    function drawTag(tag: Tag, now: number, pal: Palette) {
      const g = ctx;
      if (!g) return;
      const { x, y } = tag.dot;
      const typing = !tag.erasing && tag.chars < tag.label.length;
      const text = tag.label.slice(0, Math.floor(tag.chars));
      const swatch = tag.solid ? 0 : 10;
      const textW = g.measureText(text).width;
      const boxW = Math.ceil(TAG_PAD_X * 2 + swatch + textW + 8);
      const above = y - MARKER / 2 - TAG_STEM - TAG_H >= 8;
      const by = Math.round(above ? y - MARKER / 2 - TAG_STEM - TAG_H : y + MARKER / 2 + TAG_STEM);
      const bx = Math.round(clamp(x - 14, 8, Math.max(8, w - boxW - 8)));
      const fg = tag.solid ? pal.solidText : pal.outlineText;
      const accent = tag.solid ? pal.solidBg : pal.dots[tag.dot.color];

      // stem + marker
      g.fillStyle = tag.solid ? pal.solidBg : pal.outlineBorder;
      const stemY = above ? by + TAG_H : y + MARKER / 2;
      g.fillRect(Math.round(x), stemY, 1, TAG_STEM);
      g.fillStyle = accent;
      g.fillRect(Math.round(x - MARKER / 2), Math.round(y - MARKER / 2), MARKER, MARKER);

      // box
      g.fillStyle = tag.solid ? pal.solidBg : pal.outlineBg;
      g.fillRect(bx, by, boxW, TAG_H);
      if (!tag.solid) {
        g.strokeStyle = pal.outlineBorder;
        g.lineWidth = 1;
        g.strokeRect(bx + 0.5, by + 0.5, boxW - 1, TAG_H - 1);
        g.fillStyle = pal.dots[tag.dot.color];
        g.fillRect(bx + TAG_PAD_X, by + TAG_H / 2 - 3, 6, 6);
      }

      // text + block caret
      const tx = bx + TAG_PAD_X + swatch;
      g.fillStyle = fg;
      g.fillText(text, tx, by + TAG_H / 2 + 1);
      if (typing || Math.floor(now / 500) % 2 === 0) {
        g.fillRect(Math.round(tx + textW + 2), by + 5, 6, TAG_H - 10);
      }
    }

    function render(now: number, isStatic = false) {
      const g = ctx;
      if (!g) return;
      const pal = document.documentElement.getAttribute('data-theme') === 'dark' ? DARK : LIGHT;
      g.clearRect(0, 0, w, h);

      // arcs
      g.globalAlpha = 1;
      g.strokeStyle = pal.arc;
      g.lineWidth = 1;
      g.setLineDash([2, 6]);
      g.beginPath();
      for (const a of arcs) {
        g.moveTo(a.cx + a.rx, a.cy);
        g.ellipse(a.cx, a.cy, a.rx, a.ry, 0, 0, Math.PI, true);
      }
      g.stroke();
      g.setLineDash([]);

      // nodes
      for (const d of dots) {
        if (d.alpha <= 0.01) continue;
        g.globalAlpha = d.alpha;
        g.fillStyle = pal.dots[d.color];
        if (d.round) {
          g.beginPath();
          g.arc(d.x, d.y, d.size / 2 + 0.5, 0, Math.PI * 2);
          g.fill();
        } else {
          g.fillRect(Math.round(d.x - d.size / 2), Math.round(d.y - d.size / 2), d.size, d.size);
        }
      }

      // tags
      g.globalAlpha = 1;
      if (!isStatic && tags.length) {
        g.font = font;
        g.textBaseline = 'middle';
        for (const t of tags) drawTag(t, now, pal);
      }
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = 0;
        return;
      }
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      update(now, dt);
      render(now);
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointer.cx = e.clientX;
      pointer.cy = e.clientY;
      pointer.active = true;
      pointer.lastMove = performance.now();
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onTheme = () => render(performance.now(), true);

    const sizeObserver = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) resize(box.width, box.height);
    });
    sizeObserver.observe(layer);

    let themeObserver: MutationObserver | undefined;
    let viewObserver: IntersectionObserver | undefined;
    if (reduceMotion) {
      themeObserver = new MutationObserver(onTheme);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    } else {
      nextAuto = performance.now() + 1200;
      viewObserver = new IntersectionObserver((entries) => {
        visible = entries[entries.length - 1]?.isIntersecting ?? true;
      });
      viewObserver.observe(layer);
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      window.addEventListener('blur', onLeave);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      sizeObserver.disconnect();
      themeObserver?.disconnect();
      viewObserver?.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  return (
    <div className='arcfield-stage'>
      <div ref={layerRef} className='arcfield-layer' aria-hidden='true'>
        <div className='arcfield-glow' />
        <canvas ref={canvasRef} className='arcfield-canvas' />
      </div>
      <div className='arcfield-content'>{children}</div>
    </div>
  );
}
