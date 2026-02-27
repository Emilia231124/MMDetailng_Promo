"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import MagneticButton from "@/components/ui/MagneticButton";

const PHONE = "+7 (928) 000-00-00";
const PHONE_HREF = "tel:+79280000000";
const WHATSAPP_HREF = "https://wa.me/79280000000";

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const buttons = buttonsRef.current;
      const note = noteRef.current;
      if (!title) return;

      // Title: scale + opacity driven by scroll (scrub)
      gsap.fromTo(
        title,
        { scale: 0.82, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      // Subtitle + buttons + note: stagger fade-in
      const elements = [subtitle, buttons, note].filter(Boolean);
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: title, start: "top 60%" },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="flex h-[70vh] items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,169,126,0.05) 0%, var(--bg-secondary) 60%, var(--bg-primary) 100%)",
      }}
      aria-label="Записаться на детейлинг"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">

        <h2
          ref={titleRef}
          className="font-display text-[12vw] font-bold uppercase leading-none text-[var(--text-primary)] md:text-8xl"
        >
          ГОТОВЫ?
        </h2>

        <p
          ref={subtitleRef}
          className="mt-6 font-body text-lg text-[var(--text-secondary)] md:text-xl"
        >
          Запишитесь на детейлинг прямо сейчас
        </p>

        {/* Buttons */}
        <div
          ref={buttonsRef}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <MagneticButton
            href="/booking"
            className="w-full bg-[var(--accent-primary)] px-10 py-4 font-mono text-sm uppercase tracking-widest text-[var(--bg-primary)] transition-opacity duration-300 hover:opacity-80 sm:w-auto"
          >
            Записаться онлайн
          </MagneticButton>
          <MagneticButton
            href={PHONE_HREF}
            className="w-full border border-[var(--accent-primary)] px-10 py-4 font-mono text-sm uppercase tracking-widest text-[var(--accent-primary)] transition-colors duration-300 hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] sm:w-auto"
          >
            {PHONE}
          </MagneticButton>
        </div>

        {/* WhatsApp note */}
        <p
          ref={noteRef}
          className="mt-6 font-body text-sm text-[var(--text-muted)]"
        >
          или напишите нам в{" "}
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-primary)] underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            WhatsApp
          </a>
        </p>

      </div>
    </section>
  );
}
