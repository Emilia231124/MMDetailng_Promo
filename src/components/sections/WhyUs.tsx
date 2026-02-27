"use client";

import Link from "next/link";
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
      className="bg-[var(--bg-secondary)] py-28 md:py-36"
      aria-label="Почему MM Detailing"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 lg:items-center">

          {/* Left: text block */}
          <div ref={leftRef}>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)]">
              ПОЧЕМУ
            </span>
            <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none text-[var(--text-primary)] md:text-6xl">
              MM DETAILING
            </h2>
            <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
              Мы не просто моем машины — мы восстанавливаем и защищаем их.
              Каждый автомобиль обрабатывается вручную с использованием
              профессиональной химии и оборудования. Результат — гарантирован.
            </p>
            <div className="mt-8">
              <Link
                href="/about"
                className="inline-block border border-[var(--accent-primary)] px-8 py-3 font-mono text-sm uppercase tracking-widest text-[var(--accent-primary)] transition-colors duration-300 hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)]"
              >
                Подробнее о нас
              </Link>
            </div>
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
                  className="font-display text-5xl font-bold text-[var(--accent-primary)]"
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
