"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap-config";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function BeforeAfterReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery("(max-width: 767px)");

  useGSAP(
    () => {
      const section = sectionRef.current;
      const sticky = stickyRef.current;
      if (!section || !sticky) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        // Статичное отображение 50/50
        if (afterRef.current) {
          afterRef.current.style.clipPath = "inset(0 50% 0 0)";
        }
        if (lineRef.current) {
          lineRef.current.style.left = "50%";
          lineRef.current.style.opacity = "0.3";
        }
        return;
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: sticky,
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;

          const clipRight = 100 - p * 100;
          if (afterRef.current) {
            afterRef.current.style.clipPath = `inset(0 ${clipRight}% 0 0)`;
          }

          if (lineRef.current) {
            lineRef.current.style.left = `${p * 100}%`;
            const lineOpacity = p > 0.05 && p < 0.95 ? 0.3 : 0;
            lineRef.current.style.opacity = String(lineOpacity);
          }
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Сравнение до и после детейлинга"
      className={isMobile ? "relative h-[200vh]" : "relative h-[250vh]"}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* Before — нижний слой, всегда виден */}
        <div className="absolute inset-0">
          <Image
            src="/images/before-car.png"
            alt="Автомобиль до детейлинга"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* After — верхний слой с clip-path reveal */}
        <div
          ref={afterRef}
          className="absolute inset-0"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          <Image
            src="/images/after-car.png"
            alt="Автомобиль после детейлинга"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Линия-разделитель — максимально subtle */}
        <div
          ref={lineRef}
          className="absolute top-0 bottom-0 z-10 flex items-center justify-center pointer-events-none"
          style={{ left: "0%", opacity: 0, transform: "translateX(-50%)" }}
        >
          {/* Вертикальная линия 1px */}
          <div className="absolute inset-y-0 w-px bg-white/15" />
        </div>
      </div>
    </section>
  );
}
