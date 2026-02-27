"use client";

import { useRef, useCallback, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Scroll phases (normalized 0→1 over the entire pinned distance) */
const PHASE_INTRO_END = 0.15;
const PHASE_REVEAL_END = 0.85;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BeforeAfterReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const afterImageRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const labelBeforeRef = useRef<HTMLDivElement>(null);
  const labelAfterRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Slider value for reduced-motion fallback
  const [sliderValue, setSliderValue] = useState(0);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const sectionHeight = isMobile ? "250vh" : "300vh";

  // ── Core reveal function (called by ScrollTrigger or slider) ─────────────
  const applyReveal = useCallback((progress: number) => {
    const after = afterImageRef.current;
    const divider = dividerRef.current;
    const labelBefore = labelBeforeRef.current;
    const labelAfter = labelAfterRef.current;
    const fill = progressFillRef.current;
    const intro = introRef.current;
    const cta = ctaRef.current;

    if (!after || !divider) return;

    // Phase 1: Intro (0 → PHASE_INTRO_END)
    if (intro) {
      const introP = Math.min(progress / PHASE_INTRO_END, 1);
      // Fade in quickly, then fade out
      const introOpacity =
        introP < 0.5 ? introP * 2 : Math.max(0, (1 - introP) * 2);
      gsap.set(intro, { opacity: introOpacity });
    }

    // Phase 2: Reveal (PHASE_INTRO_END → PHASE_REVEAL_END)
    const revealRaw =
      (progress - PHASE_INTRO_END) / (PHASE_REVEAL_END - PHASE_INTRO_END);
    const revealProgress = Math.max(0, Math.min(1, revealRaw));

    const clipRight = 100 - revealProgress * 100;
    after.style.clipPath = `inset(0 ${clipRight}% 0 0)`;
    divider.style.left = `${revealProgress * 100}%`;

    if (fill) {
      fill.style.width = `${revealProgress * 100}%`;
    }

    // Labels: appear when divider is near each label area
    if (labelBefore) {
      const labelBeforeOpacity =
        revealProgress > 0.05 && revealProgress < 0.95 ? 1 : 0;
      gsap.set(labelBefore, { opacity: labelBeforeOpacity });
    }
    if (labelAfter) {
      const labelAfterOpacity = revealProgress > 0.1 ? 1 : 0;
      gsap.set(labelAfter, { opacity: labelAfterOpacity });
    }

    // Phase 3: CTA (PHASE_REVEAL_END → 1.0)
    if (cta) {
      const ctaProgress =
        (progress - PHASE_REVEAL_END) / (1 - PHASE_REVEAL_END);
      const ctaOpacity = Math.max(0, Math.min(1, ctaProgress * 3));
      gsap.set(cta, { opacity: ctaOpacity, y: ctaOpacity === 0 ? 20 : 0 });
    }
  }, []);

  // ── GSAP setup ────────────────────────────────────────────────────────────
  useGSAP(
    () => {
      const section = sectionRef.current;
      const sticky = stickyRef.current;
      if (!section || !sticky) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Set initial states
      gsap.set(afterImageRef.current, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(dividerRef.current, { left: "0%" });
      gsap.set([labelBeforeRef.current, labelAfterRef.current], { opacity: 0 });
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });

      if (prefersReduced) {
        // Reduced motion: skip scroll animation; slider controls reveal
        return;
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: sticky,
        scrub: 0.5,
        onUpdate: (self) => {
          applyReveal(self.progress);
        },
      });
    },
    { scope: sectionRef }
  );

  // ── Slider handler (prefers-reduced-motion fallback) ─────────────────────
  function handleSlider(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value) / 100;
    setSliderValue(val * 100);
    applyReveal(PHASE_INTRO_END + val * (PHASE_REVEAL_END - PHASE_INTRO_END));
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      aria-label="Сравнение до и после детейлинга"
      style={{ height: sectionHeight }}
    >
      {/* Sticky viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden bg-[var(--bg-primary)]"
      >
        {/* ── Section intro ─────────────────────────────────────────────── */}
        <div
          ref={introRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center"
          style={{ pointerEvents: "none" }}
        >
          <span className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)]">
            РЕЗУЛЬТАТ
          </span>
          <h2 className="font-display text-5xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-7xl">
            ВИДИШЬ РАЗНИЦУ?
          </h2>
        </div>

        {/* ── Images container ──────────────────────────────────────────── */}
        <div className="absolute inset-0">

          {/* Before — bottom layer, always visible */}
          <div className="absolute inset-0">
            {/* TODO: Replace with actual photo:
              <Image
                src="/images/before-car.webp"
                alt="Автомобиль до детейлинга"
                fill
                className="object-cover"
              />
            */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #333 100%)",
              }}
            >
              {/* Псевдо-царапины через тонкие линии */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(73deg, transparent, transparent 120px, rgba(255,255,255,0.03) 121px, rgba(255,255,255,0.03) 122px), repeating-linear-gradient(23deg, transparent, transparent 80px, rgba(255,255,255,0.02) 81px)",
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[25vw] font-bold uppercase leading-none text-white/5">
                ДО
              </span>
            </div>
          </div>

          {/* After — top layer, revealed by clip-path left→right */}
          <div
            ref={afterImageRef}
            className="absolute inset-0"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            {/* TODO: Replace with actual photo:
              <Image
                src="/images/after-car.webp"
                alt="Автомобиль после детейлинга"
                fill
                className="object-cover"
              />
            */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #1a1a3e 0%, #0f0f2e 30%, #2a2a5e 100%)",
              }}
            >
              {/* Блик — радиальный белый gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 40% at 65% 40%, rgba(255,255,255,0.08) 0%, transparent 70%)",
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[25vw] font-bold uppercase leading-none text-white/5">
                ПОСЛЕ
              </span>
            </div>
          </div>

          {/* ── Divider line ──────────────────────────────────────────────── */}
          <div
            ref={dividerRef}
            className="absolute top-0 z-10 h-full"
            style={{ left: "0%", transform: "translateX(-50%)" }}
          >
            {/* Vertical line */}
            <div
              className="absolute inset-y-0 left-1/2 w-[2px] md:w-[2px]"
              style={{
                background: "var(--accent-primary)",
                boxShadow: "0 0 20px var(--accent-glow), 0 0 40px rgba(212,175,55,0.3)",
                transform: "translateX(-50%)",
              }}
            />
            {/* Center circle */}
            <div
              className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{
                background: "var(--accent-primary)",
                boxShadow: "0 0 16px var(--accent-glow)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 7H1M10 7h3M7 4V1M7 10v3" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="7" cy="7" r="2" fill="#0A0A0A"/>
              </svg>
            </div>
          </div>

          {/* ── Labels ──────────────────────────────────────────────────── */}
          <div
            ref={labelBeforeRef}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 font-mono text-sm uppercase tracking-widest text-[var(--text-secondary)] opacity-0 md:left-8 md:text-base"
          >
            ДО
          </div>
          <div
            ref={labelAfterRef}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 font-mono text-sm uppercase tracking-widest text-[var(--accent-primary)] opacity-0 md:right-8 md:text-base"
          >
            ПОСЛЕ
          </div>

          {/* ── CTA overlay (appears at progress > 0.85) ───────────────── */}
          <div
            ref={ctaRef}
            className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-4 text-center opacity-0 md:bottom-24"
          >
            <p className="font-body text-base text-[var(--text-secondary)] md:text-lg">
              Запишитесь и убедитесь сами
            </p>
            <Link
              href="/booking"
              className="inline-block rounded-none bg-[var(--accent-primary)] px-8 py-3 font-mono text-sm uppercase tracking-widest text-[var(--bg-primary)] transition-opacity hover:opacity-80 w-full md:w-auto"
            >
              Записаться
            </Link>
          </div>

        </div>

        {/* ── Progress bar ─────────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-[var(--border)]">
          <div
            ref={progressFillRef}
            className="h-full bg-[var(--accent-primary)] transition-none"
            style={{ width: "0%" }}
          />
        </div>

        {/* ── Reduced-motion slider fallback ─────────────────────────── */}
        <div className="motion-reduce:flex absolute bottom-8 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Перетащите для сравнения
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={handleSlider}
            className="w-64 accent-[var(--accent-primary)]"
            aria-label="Сравнение до и после"
          />
        </div>

      </div>
    </section>
  );
}
