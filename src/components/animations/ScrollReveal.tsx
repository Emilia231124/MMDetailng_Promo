"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";

interface ScrollRevealProps {
  children: ReactNode;
  /** Направление появления (default "up") */
  direction?: "up" | "down" | "left" | "right";
  /** Алиас для direction — для обратной совместимости */
  from?: "bottom" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  direction,
  from,
  delay = 0,
  duration = 0.8,
  distance = 40,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Маппинг: direction → начальные координаты
  const resolveTransform = () => {
    const dir = direction ?? (from === "bottom" ? "up" : from === "left" ? "left" : from === "right" ? "right" : "up");
    return {
      x: dir === "left" ? -distance : dir === "right" ? distance : 0,
      y: dir === "up" ? distance : dir === "down" ? -distance : 0,
    };
  };

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const { x, y } = resolveTransform();

      gsap.fromTo(
        el,
        { opacity: 0, x, y },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
