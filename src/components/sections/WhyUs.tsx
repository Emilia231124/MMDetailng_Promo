"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const STATS = [
  { end: 500, suffix: "+", label: "Выполненных работ" },
  { end: 7,   suffix: "",  label: "Лет опыта" },
  { end: 98,  suffix: "%", label: "Довольных клиентов" },
  { end: 15,  suffix: "+", label: "Видов услуг" },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const left = leftRef.current;
      const stats = statsRef.current;
      if (!left || !stats) return;

      // Left column slides in from left
      gsap.fromTo(
        left,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: left, start: "top 80%" },
        }
      );

      // Stats cards stagger in from right
      const cards = stats.querySelectorAll<HTMLElement>("[data-stat]");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: stats, start: "top 80%" },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--bg-secondary)] py-32 md:py-40 lg:py-48"
      aria-label="Почему MM Detailing"
    >
      <div className="page-container">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 lg:items-center">

          {/* Left: text block */}
          <div ref={leftRef}>
            <span className="font-mono text-sm uppercase tracking-widest text-[var(--accent-red)]">
              ПОЧЕМУ
            </span>
            <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none tracking-tight text-[var(--text-primary)] md:text-6xl lg:text-7xl">
              MM DETAILING
            </h2>
            <p className="mt-6 max-w-lg font-body text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
              Мы не просто моем машины — мы восстанавливаем и защищаем их. Результат гарантирован.
            </p>
          </div>

          {/* Right: 2×2 stats grid */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 gap-6"
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                data-stat
                className="flex flex-col rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] p-6 md:p-8"
              >
                <AnimatedCounter
                  end={stat.end}
                  suffix={stat.suffix}
                  className="font-display text-5xl font-bold text-[var(--accent-red)]"
                />
                <p className="mt-2 font-body text-sm text-[var(--text-secondary)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
