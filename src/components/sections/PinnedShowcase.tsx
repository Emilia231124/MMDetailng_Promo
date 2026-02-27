"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";

// ---------------------------------------------------------------------------
// Types & Data
// ---------------------------------------------------------------------------

interface ShowcaseSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  /** CSS gradient — placeholder до реальных фото.
   *  Замени на next/image когда появятся фотографии:
   *  <Image src={slide.image} alt={slide.title} fill className="object-cover" />
   */
  gradient: string;
}

const SLIDES: ShowcaseSlide[] = [
  {
    id: "ppf",
    title: "ЗАЩИТНАЯ ПЛЁНКА",
    subtitle: "Paint Protection Film",
    description:
      "Невидимая броня для вашего автомобиля. Защита от сколов, царапин и дорожных реагентов.",
    gradient: "linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #0f3460 100%)",
  },
  {
    id: "ceramic",
    title: "КЕРАМИКА",
    subtitle: "Ceramic Coating",
    description:
      "Нанокерамическое покрытие с гидрофобным эффектом. Блеск и защита на годы.",
    gradient: "linear-gradient(135deg, #1a0800 0%, #2d1200 50%, #3d1f00 100%)",
  },
  {
    id: "polish",
    title: "ПОЛИРОВКА",
    subtitle: "Paint Correction",
    description:
      "Восстановление идеального блеска. Удаление царапин, голограмм и окислов.",
    gradient: "linear-gradient(135deg, #0a0a00 0%, #1e1a00 50%, #2e2400 100%)",
  },
  {
    id: "interior",
    title: "ХИМЧИСТКА",
    subtitle: "Interior Detailing",
    description:
      "Глубокая чистка салона. Кожа, ткань, потолок — как с завода.",
    gradient: "linear-gradient(135deg, #050d05 0%, #0a1a0a 50%, #102010 100%)",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PinnedShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  // Per-slide refs (arrays)
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const overlayRefs = useRef<HTMLDivElement[]>([]);
  const titleRefs = useRef<HTMLHeadingElement[]>([]);
  const subtitleRefs = useRef<HTMLParagraphElement[]>([]);
  const descRefs = useRef<HTMLParagraphElement[]>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const intro = introRef.current;
      if (!section || !intro) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ── Initial states ──────────────────────────────────────────────────
      // All slides invisible; overlays at base darkening
      SLIDES.forEach((_, i) => {
        gsap.set(slideRefs.current[i], { autoAlpha: 0 });
        gsap.set(overlayRefs.current[i], { opacity: 0.25 });
        gsap.set(titleRefs.current[i], { autoAlpha: 0, y: prefersReduced ? 0 : 60 });
        gsap.set(subtitleRefs.current[i], { autoAlpha: 0, y: prefersReduced ? 0 : 30 });
        gsap.set(descRefs.current[i], { autoAlpha: 0, y: prefersReduced ? 0 : 20 });
      });

      // ── Master timeline driven by scroll ────────────────────────────────
      // Outer section height = (N + 1) × 100vh → scroll distance = N × 100vh
      // Each "unit" in the timeline corresponds to 1 slide of scroll travel.
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // Duration of one slide segment in timeline units
      const SCREEN = 1;

      // Intro: fade out during the first 0.4 units of scroll
      masterTl.to(
        intro,
        { autoAlpha: 0, y: prefersReduced ? 0 : -40, duration: 0.4 },
        0
      );

      SLIDES.forEach((_, i) => {
        const t = i * SCREEN; // start time of this slide

        const slide = slideRefs.current[i];
        const overlay = overlayRefs.current[i];
        const title = titleRefs.current[i];
        const subtitle = subtitleRefs.current[i];
        const desc = descRefs.current[i];

        const prevSlide = i > 0 ? slideRefs.current[i - 1] : null;
        const prevOverlay = i > 0 ? overlayRefs.current[i - 1] : null;

        // Phase 1 — Entry: slide fades in (t → t+0.3)
        masterTl.to(slide, { autoAlpha: 1, duration: 0.3 }, t);

        // Simultaneously: previous slide scales back and darkens
        if (prevSlide) {
          masterTl.to(
            prevSlide,
            { scale: prefersReduced ? 1 : 0.95, duration: 0.3 },
            t
          );
          masterTl.to(prevOverlay!, { opacity: 0.72, duration: 0.3 }, t);
        }

        // Phase 2 — Content reveal (t+0.25 → t+0.65)
        masterTl.to(
          title,
          { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" },
          t + 0.25
        );
        masterTl.to(
          subtitle,
          { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" },
          t + 0.38
        );
        masterTl.to(
          desc,
          { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" },
          t + 0.5
        );

        // Phase 3 — Hold (t+0.65 → t+0.75): nothing to animate

        // Phase 4 — Exit: text lifts out & overlay deepens (t+0.75 → t+1.0)
        // Only for non-last slides (last slide stays visible)
        if (i < SLIDES.length - 1) {
          masterTl.to(
            [title, subtitle, desc],
            {
              autoAlpha: 0,
              y: prefersReduced ? 0 : -30,
              duration: 0.15,
              stagger: 0.03,
            },
            t + 0.75
          );
          masterTl.to(overlay, { opacity: 0.65, duration: 0.25 }, t + 0.75);
        }
      });
    },
    { scope: sectionRef }
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    // Outer section: tall enough so the sticky inner scrolls through N slides
    <section
      ref={sectionRef}
      aria-label="Наши услуги"
      style={{ height: `${(SLIDES.length + 1) * 100}vh` }}
    >
      {/* Sticky viewport — stays pinned while user scrolls through the section */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[var(--bg-primary)]">

        {/* ── Intro overlay ──────────────────────────────────────────────── */}
        <div
          ref={introRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center"
        >
          <h2 className="font-display text-6xl font-bold uppercase tracking-tight text-[var(--text-primary)] md:text-8xl">
            НАШИ УСЛУГИ
          </h2>
          <div className="mt-6 h-px w-24 bg-[var(--accent-primary)]" />
          <p className="mt-4 font-mono text-sm uppercase tracking-widest text-[var(--text-secondary)]">
            Каждая деталь имеет значение
          </p>
        </div>

        {/* ── Slides ─────────────────────────────────────────────────────── */}
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            ref={(el) => {
              if (el) slideRefs.current[i] = el;
            }}
            className="absolute inset-0"
          >
            {/* Background gradient placeholder
                TODO: Replace with:
                <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={i === 0} />
            */}
            <div
              className="absolute inset-0"
              style={{ background: slide.gradient }}
            />

            {/* Darkening overlay — animated by GSAP */}
            <div
              ref={(el) => {
                if (el) overlayRefs.current[i] = el;
              }}
              className="absolute inset-0 bg-black"
            />

            {/* Slide content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 pb-16 md:p-16 md:pb-24">
              <h3
                ref={(el) => {
                  if (el) titleRefs.current[i] = el;
                }}
                className="font-display text-[15vw] font-bold uppercase leading-none text-[var(--text-primary)] md:text-[10vw]"
                style={{ textShadow: "0 4px 60px rgba(0,0,0,0.6)" }}
              >
                {slide.title}
              </h3>

              <p
                ref={(el) => {
                  if (el) subtitleRefs.current[i] = el;
                }}
                className="mt-2 font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)] md:text-sm"
              >
                {slide.subtitle}
              </p>

              <p
                ref={(el) => {
                  if (el) descRefs.current[i] = el;
                }}
                className="mt-4 max-w-md font-body text-base text-[var(--text-secondary)] md:text-lg"
              >
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
