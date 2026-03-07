'use client';

import { useRef, useEffect, type ElementType, type ReactNode, type Ref } from 'react';
import { gsap } from '@/lib/gsap-config';

type AllowedTag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';

interface ScrollRevealTextProps {
  children: ReactNode;
  /** HTML-тег для рендера (default: 'div') */
  as?: AllowedTag;
  className?: string;
  /** Задержка до начала анимации, сек */
  delay?: number;
  /** Способ разбивки текста для stagger-анимации */
  splitBy?: 'lines' | 'words' | 'chars';
  /** Задержка между единицами текста, сек */
  stagger?: number;
  /** ScrollTrigger start (default 'top 85%') */
  triggerStart?: string;
}

/**
 * Переиспользуемый компонент scroll-triggered текстовой анимации.
 * Текст появляется снизу вверх побуквенно / пословно / построчно.
 *
 * Использование: /services, /portfolio, /about, /pricing
 */
export default function ScrollRevealText({
  children,
  as = 'div',
  className,
  delay = 0,
  splitBy = 'lines',
  stagger = 0.08,
  triggerStart = 'top 85%',
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Сохраняем оригинальное содержимое для возможного cleanup
    const originalHTML = el.innerHTML;
    const ctx = gsap.context(() => {
      const text = el.textContent ?? '';

      if (splitBy === 'words' || splitBy === 'chars') {
        const units = splitBy === 'words' ? text.split(' ') : text.split('');
        el.innerHTML = units
          .map(
            (unit) =>
              `<span style="display:inline-block;overflow:hidden;vertical-align:top;">` +
              `<span class="reveal-unit" style="display:inline-block;transform:translateY(110%);">${unit}${splitBy === 'words' ? '&nbsp;' : ''}</span>` +
              `</span>`
          )
          .join('');

        const revealUnits = el.querySelectorAll<HTMLElement>('.reveal-unit');

        gsap.to(revealUnits, {
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger,
          delay,
          scrollTrigger: {
            trigger: el,
            start: triggerStart,
            toggleActions: 'play none none none',
          },
        });
      } else {
        // lines: весь блок поднимается как один
        const inner = document.createElement('div');
        inner.innerHTML = el.innerHTML;
        gsap.set(inner, { y: '110%' });
        el.style.overflow = 'hidden';
        el.innerHTML = '';
        el.appendChild(inner);

        gsap.to(inner, {
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: triggerStart,
            toggleActions: 'play none none none',
          },
        });
      }
    }, el);

    return () => {
      ctx.revert();
      // Восстанавливаем оригинальный HTML при unmount
      if (el) {
        el.innerHTML = originalHTML;
        el.style.overflow = '';
      }
    };
  }, [delay, splitBy, stagger, triggerStart]);

  const El = as as ElementType;

  return (
    <El ref={ref as Ref<HTMLElement>} className={className}>
      {children}
    </El>
  );
}
