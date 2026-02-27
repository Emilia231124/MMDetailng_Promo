"use client";

import { useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";

interface TextRevealProps {
  /** Текст для анимации. Поддерживает переносы строк через \n */
  children: string;
  className?: string;
  delay?: number;
  /** Скорость анимации одного слова (default 0.6s) */
  duration?: number;
  /** Тег-обёртка (default span) */
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

export default function TextReveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  as: Tag = "span",
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  // Разбиваем текст на слова, сохраняя переносы строк
  const words = useMemo(() => children.split(/(\s+)/), [children]);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const wordEls = el.querySelectorAll<HTMLElement>("[data-word]");
      if (wordEls.length === 0) return;

      gsap.fromTo(
        wordEls,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration,
          delay,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    // @ts-expect-error — динамический тег
    <Tag ref={containerRef} className={className} aria-label={children}>
      {words.map((word, i) => {
        // Пробелы рендерим как обычные span
        if (/^\s+$/.test(word)) {
          return <span key={i} aria-hidden>{word}</span>;
        }
        return (
          <span
            key={i}
            className="inline-block overflow-hidden"
            aria-hidden
          >
            <span data-word className="inline-block">
              {word}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
