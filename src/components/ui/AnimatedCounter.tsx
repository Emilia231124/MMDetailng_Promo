"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  // Legacy prop — ignored, kept for compatibility
  value?: number;
}

export default function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2,
  className = "",
}: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  // Plain object animated by GSAP — no state, no re-renders during counting
  const counter = useRef({ value: 0 });

  useGSAP(() => {
    const span = spanRef.current;
    if (!span) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      span.textContent = `${prefix}${end}${suffix}`;
      return;
    }

    counter.current.value = 0;
    span.textContent = `${prefix}0${suffix}`;

    ScrollTrigger.create({
      trigger: span,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(counter.current, {
          value: end,
          duration,
          ease: "power2.out",
          // Snap to nearest integer on every update
          onUpdate() {
            if (span) {
              span.textContent = `${prefix}${Math.round(counter.current.value)}${suffix}`;
            }
          },
          onComplete() {
            // Ensure exact final value
            if (span) span.textContent = `${prefix}${end}${suffix}`;
          },
        });
      },
    });
  });

  return (
    <span ref={spanRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
