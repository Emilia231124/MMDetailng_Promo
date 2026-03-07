'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap-config';
import { cn } from '@/lib/utils';

interface ScrollRevealImageProps {
  /** Содержимое: фото через next/image или градиентный placeholder */
  children: React.ReactNode;
  className?: string;
  /** Задержка, сек */
  delay?: number;
  /** ScrollTrigger start (default 'top 90%') */
  triggerStart?: string;
}

/**
 * Переиспользуемый компонент анимации появления изображения при скролле.
 * opacity 0→1 + translateY 40→0 + scale 1.03→1
 *
 * Использование: /services, /portfolio, /about
 */
export default function ScrollRevealImage({
  children,
  className,
  delay = 0,
  triggerStart = 'top 90%',
}: ScrollRevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40, scale: 1.03 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: triggerStart,
            toggleActions: 'play none none none',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, triggerStart]);

  return (
    <div ref={ref} className={cn('opacity-0', className)}>
      {children}
    </div>
  );
}
