"use client";

/**
 * Adapted from ReactBits "TiltedCard" (ts-tailwind variant)
 * https://reactbits.dev/components/tilted-card
 * Copyright (c) 2026 David Haz — MIT + Commons Clause (see ./LICENSE.txt)
 *
 * Changes for this site: renders arbitrary children instead of a fixed <img>,
 * drops the tooltip/caption/mobile-warning chrome, and disables the tilt when
 * the user prefers reduced motion. The spring mechanics are kept as published.
 */

import { useEffect, useRef } from "react";
import type { SpringOptions } from "motion/react";
import { motion, useMotionValue, useSpring } from "motion/react";

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  children,
  className = "",
  rotateAmplitude = 10,
  scaleOnHover = 1.04,
}: {
  children: React.ReactNode;
  className?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useRef(false);

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current || reduceMotion.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
  }

  function handleMouseEnter() {
    if (reduceMotion.current) return;
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      ref={ref}
      className={`[perspective:800px] ${className}`}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="will-change-transform [transform-style:preserve-3d]"
        style={{ rotateX, rotateY, scale }}
      >
        {children}
      </motion.div>
    </div>
  );
}
