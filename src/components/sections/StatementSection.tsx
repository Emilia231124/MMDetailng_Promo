'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StatementSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const heading = headingRef.current;
    const subtitle = subtitleRef.current;

    if (!section || !content || !heading || !subtitle) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          scrub: true,
          markers: false,
        },
      });

      // Подзаголовок исчезает первым (0% → 40%)
      tl.to(
        subtitle,
        {
          opacity: 0,
          y: -60,
          duration: 0.4,
          ease: 'none',
        },
        0
      );

      // Заголовок исчезает с задержкой (10% → 60%)
      tl.to(
        heading,
        {
          opacity: 0,
          y: -100,
          duration: 0.5,
          ease: 'none',
        },
        0.1
      );

      // Оставшиеся 40% — чёрная пустота (ничего не происходит, просто скролл)
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100vh] bg-[#050505] z-10"
    >
      <div
        ref={contentRef}
        className="flex flex-col items-center justify-center h-screen px-6"
      >
        <h2
          ref={headingRef}
          className="text-center font-bold uppercase leading-[0.95] tracking-tight"
          style={{
            fontFamily: 'var(--font-display), sans-serif',
            fontSize: 'clamp(2.5rem, 8vw, 8rem)',
            color: '#FFFFFF',
          }}
        >
          КАЖДАЯ ДЕТАЛЬ
          <br />
          <span style={{ color: '#C41E2A' }}>ИМЕЕТ</span> ЗНАЧЕНИЕ
        </h2>
        <p
          ref={subtitleRef}
          className="mt-6 md:mt-8 text-center text-base md:text-xl max-w-2xl leading-relaxed"
          style={{
            fontFamily: 'var(--font-body), sans-serif',
            color: '#999999',
          }}
        >
          МЫ ВОЗВРАЩАЕМ МАШИНАМ ЗАВОДСКОЕ СОСТОЯНИЕ
          <br />
          А НЕ ПРОСТО МОЕМ ИХ
        </p>
      </div>
    </section>
  );
};

export default StatementSection;
