"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  hx: number;
  hy: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
};

/**
 * Canvas particle logo, in the spirit of the old personal-site experiment:
 * the logo is drawn offscreen, its opaque pixels become particles that spring
 * home, the cursor repels them, and a click/tap scatters them outward.
 * Falls back to a plain static logo when the user prefers reduced motion.
 */
export default function ParticleLogo({
  src,
  className = "",
  label = "Interactive SLHS TSA Spartan logo made of dots. Move your cursor to scatter them.",
}: {
  src: string;
  className?: string;
  label?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let resizeTimer = 0;
    let particles: Particle[] = [];
    let running = false;
    let visible = true;
    let destroyed = false;
    let ready = false;
    let W = 0;
    let H = 0;

    const pointer = { x: -9999, y: -9999, active: false, base: 90, boostUntil: 0 };
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const img = new window.Image();

    function layout() {
      const rect = wrap!.getBoundingClientRect();
      W = Math.max(120, Math.floor(rect.width));
      H = Math.floor(Math.min(W * 0.58, 400));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function fitRect() {
      const pad = 0.05;
      const availW = W * (1 - 2 * pad);
      const availH = H * (1 - 2 * pad);
      const s = Math.min(availW / img.naturalWidth, availH / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      return { dx: (W - dw) / 2, dy: (H - dh) / 2, dw, dh };
    }

    function buildParticles() {
      particles = [];
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const octx = off.getContext("2d");
      if (!octx) return;
      const { dx, dy, dw, dh } = fitRect();
      octx.drawImage(img, dx, dy, dw, dh);
      const data = octx.getImageData(0, 0, W, H).data;

      const cap = W < 560 ? 1900 : 4200;
      const countAt = (g: number) => {
        let n = 0;
        for (let y = 0; y < H; y += g)
          for (let x = 0; x < W; x += g) if (data[(y * W + x) * 4 + 3] > 140) n++;
        return n;
      };
      let gap = W < 560 ? 4 : 3;
      while (countAt(gap) > cap) gap++;

      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          const i = (y * W + x) * 4;
          if (data[i + 3] > 140) {
            particles.push({
              hx: x,
              hy: y,
              x: Math.random() * W,
              y: Math.random() * H,
              vx: 0,
              vy: 0,
              size: Math.max(1.6, gap * 0.62),
              color: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`,
            });
          }
        }
      }
      pointer.base = Math.max(28, Math.min(W * 0.11, 120));
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, W, H);
      const { dx, dy, dw, dh } = fitRect();
      ctx!.drawImage(img, dx, dy, dw, dh);
    }

    function tick(now: number) {
      if (destroyed) return;
      ctx!.clearRect(0, 0, W, H);
      const r = now < pointer.boostUntil ? pointer.base * 1.9 : pointer.base;
      const r2 = r * r;
      for (const p of particles) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = ((r - d) / r) * 2.4;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        p.vx += (p.hx - p.x) * 0.022;
        p.vy += (p.hy - p.y) * 0.022;
        p.vx *= 0.84;
        p.vy *= 0.84;
        p.x += p.vx;
        p.y += p.vy;
        ctx!.fillStyle = p.color;
        ctx!.fillRect(p.x, p.y, p.size, p.size);
      }
      raf = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function start() {
      if (running || !visible || destroyed || !ready || mqReduce.matches) return;
      running = true;
      raf = requestAnimationFrame(tick);
    }

    function setup() {
      if (!ready) return;
      stop();
      layout();
      if (mqReduce.matches) {
        drawStatic();
        return;
      }
      buildParticles();
      start();
    }

    const toLocal = (e: PointerEvent) => {
      const b = canvas!.getBoundingClientRect();
      return { x: e.clientX - b.left, y: e.clientY - b.top };
    };

    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const onDown = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      pointer.boostUntil = performance.now() + 650;
      for (const p of particles) {
        const dx = p.x - x;
        const dy = p.y - y;
        const d = Math.hypot(dx, dy) || 1;
        const falloff = Math.max(0, 1 - d / (W * 0.55));
        if (falloff > 0) {
          const k = 9 * falloff * (0.5 + Math.random() * 0.9);
          p.vx += (dx / d) * k;
          p.vy += (dy / d) * k;
        }
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onReduceChange = () => setup();

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) start();
        else stop();
      },
      { threshold: 0.05 },
    );

    let firstObserve = true;
    const ro = new ResizeObserver(() => {
      if (firstObserve) {
        firstObserve = false;
        return;
      }
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 180);
    });

    img.onload = () => {
      if (destroyed) return;
      ready = true;
      setup();
      io.observe(canvas!);
      ro.observe(wrap!);
    };
    img.src = src;

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    mqReduce.addEventListener("change", onReduceChange);

    return () => {
      destroyed = true;
      stop();
      window.clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      mqReduce.removeEventListener("change", onReduceChange);
    };
  }, [src]);

  return (
    <div ref={wrapRef} className={`relative w-full ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        className="block w-full cursor-crosshair"
        style={{ touchAction: "pan-y" }}
      />
    </div>
  );
}
