"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// ---------------------------------------------------------------------------
// Types & Data
// ---------------------------------------------------------------------------

interface ShowcaseSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  /** Путь к фото относительно /public. Файлы: /public/images/services/ppf.png и т.д. */
  image: string;
}

const SLIDES: ShowcaseSlide[] = [
  {
    id: "ppf",
    title: "ЗАЩИТНАЯ ПЛЁНКА",
    subtitle: "PAINT PROTECTION FILM",
    description:
      "Невидимая броня для вашего автомобиля. Защита от сколов, царапин и дорожных реагентов.",
    image: "/images/services/ppf.png",
  },
  {
    id: "ceramic",
    title: "КЕРАМИКА",
    subtitle: "CERAMIC COATING",
    description:
      "Нанокерамическое покрытие с гидрофобным эффектом. Блеск и защита на годы.",
    image: "/images/services/ceramic.png",
  },
  {
    id: "polish",
    title: "ПОЛИРОВКА",
    subtitle: "PAINT CORRECTION",
    description:
      "Восстановление идеального блеска. Удаление царапин, голограмм и окислов.",
    image: "/images/services/polish.png",
  },
  {
    id: "interior",
    title: "ХИМЧИСТКА",
    subtitle: "INTERIOR DETAILING",
    description: "Глубокая чистка салона до заводского состояния.",
    image: "/images/services/interior.png",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PinnedShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  // Per-slide refs
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const bgRefs = useRef<HTMLDivElement[]>([]);
  const subtitleRefs = useRef<HTMLSpanElement[]>([]);
  const titleRefs = useRef<HTMLHeadingElement[]>([]);
  const descRefs = useRef<HTMLParagraphElement[]>([]);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const sectionHeight = isMobile
    ? `${SLIDES.length * 250}vh`
    : `${SLIDES.length * 300}vh`;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ── Initial states ──────────────────────────────────────────────────
      SLIDES.forEach((_, i) => {
        gsap.set(slideRefs.current[i], { autoAlpha: 0 });
        gsap.set(bgRefs.current[i], { scale: prefersReduced ? 1 : 1.05 });
        gsap.set(subtitleRefs.current[i], { autoAlpha: 0, y: prefersReduced ? 0 : 20 });
        gsap.set(titleRefs.current[i], { autoAlpha: 0, y: prefersReduced ? 0 : 40 });
        gsap.set(descRefs.current[i], { autoAlpha: 0, y: prefersReduced ? 0 : 20 });
      });

      // ── Master timeline driven by scroll ────────────────────────────────
      // Each SCREEN unit = one slide's scroll distance in the timeline
      const SCREEN = 1;

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      SLIDES.forEach((_, i) => {
        const t = i * SCREEN;

        const slide = slideRefs.current[i];
        const bg = bgRefs.current[i];
        const subtitle = subtitleRefs.current[i];
        const title = titleRefs.current[i];
        const desc = descRefs.current[i];

        const prevSlide = i > 0 ? slideRefs.current[i - 1] : null;
        const prevBg = i > 0 ? bgRefs.current[i - 1] : null;

        // Phase 1 — Entry: slide fades in, bg zooms in (t → t+0.3)
        masterTl.to(slide, { autoAlpha: 1, duration: 0.3 }, t);
        masterTl.to(bg, { scale: 1, duration: 0.5, ease: "power2.out" }, t);

        // Simultaneously: previous slide dims and scales back
        if (prevSlide) {
          masterTl.to(
            prevBg!,
            { scale: prefersReduced ? 1 : 0.98, duration: 0.3 },
            t
          );
          masterTl.to(prevSlide, { autoAlpha: 0, duration: 0.3 }, t + 0.7);
        }

        // Phase 2 — Content reveal
        masterTl.to(
          subtitle,
          { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" },
          t + 0.25
        );
        masterTl.to(
          title,
          { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" },
          t + 0.35
        );
        masterTl.to(
          desc,
          { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" },
          t + 0.5
        );

        // Phase 3 — Exit: text lifts out (only non-last slides)
        if (i < SLIDES.length - 1) {
          masterTl.to(
            [subtitle, title, desc],
            {
              autoAlpha: 0,
              y: prefersReduced ? 0 : -20,
              duration: 0.15,
              stagger: 0.03,
            },
            t + 0.75
          );
        }
      });
    },
    { scope: sectionRef }
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      aria-label="Наши услуги"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[var(--bg-primary)]">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            ref={(el) => { if (el) slideRefs.current[i] = el; }}
            className="absolute inset-0"
          >
            {/* Background image */}
            <div
              ref={(el) => { if (el) bgRefs.current[i] = el; }}
              className="absolute inset-0"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover object-center"
                priority={i === 0}
              />
            </div>

            {/* Overlay — многослойный, для читаемости текста */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[rgba(5,5,5,0.4)] to-transparent" />
            <div className="absolute inset-0 bg-[rgba(5,5,5,0.25)]" />

            {/* Текстовый блок — нижняя треть, левый край */}
            <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-12 md:px-16 md:pb-24 lg:px-24">
              <span
                ref={(el) => { if (el) subtitleRefs.current[i] = el; }}
                className="block font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-[var(--accent-red)] mb-4 md:mb-6"
              >
                {slide.subtitle}
              </span>

              <h3
                ref={(el) => { if (el) titleRefs.current[i] = el; }}
                className="font-display text-4xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tight"
              >
                {slide.title}
              </h3>

              <p
                ref={(el) => { if (el) descRefs.current[i] = el; }}
                className="mt-6 md:mt-8 text-base md:text-lg text-white/60 max-w-lg leading-relaxed"
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
