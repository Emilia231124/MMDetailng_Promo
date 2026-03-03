"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";

export default function HeroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleWordsRef = useRef<HTMLSpanElement[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const bg = bgRef.current;
    const content = contentRef.current;
    const subtitle = subtitleRef.current;
    const words = titleWordsRef.current.filter(Boolean);

    if (!bg || !content) return;

    // --- Entrance animations ---
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // 1. Background: zoom-out
    tl.fromTo(bg, { scale: 1.1 }, { scale: 1, duration: 1.5 }, 0);

    // 2. Content fade-in
    tl.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.3);

    // 3. Title words: slide up from overflow-hidden wrappers
    if (words.length) {
      tl.fromTo(
        words,
        { y: "110%" },
        { y: "0%", duration: 0.8, stagger: 0.2 },
        0.5
      );
    }

    // 4. Subtitle
    if (subtitle) {
      tl.fromTo(subtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.8);
    }

    // --- Scroll parallax ---
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(bg, { y: `${p * -20}%` });
        gsap.set(content, { y: `${p * 30}%`, opacity: 1 - p * 1.5 });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, { scope: sectionRef });

  const titleWords = ["MM", "DETAILING"];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/hero-poster.webp"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/herobw.webm" type="video/webm" />
        </video>
      </div>

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-end pb-[40vh] px-6 will-change-transform"
        style={{ opacity: 0 }}
      >
        {/* Title */}
        <h1 className="flex flex-wrap justify-center gap-x-6 font-display font-bold uppercase tracking-tighter leading-none text-center">
          {titleWords.map((word, i) => (
            <span key={word} className="overflow-hidden block">
              <span
                ref={(el) => {
                  if (el) titleWordsRef.current[i] = el;
                }}
                className={[
                  "block text-[12vw] md:text-[8vw]",
                  "text-[var(--text-primary)]",
                ].join(" ")}
                style={{ transform: "translateY(110%)" }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-6 font-body text-base md:text-2xl uppercase tracking-wide text-[var(--text-secondary)] text-center bottom"
          style={{ opacity: 0 }}
        >
          Премиум детейлинг в Махачкале
        </p>
      </div>
    </section>
  );
}
