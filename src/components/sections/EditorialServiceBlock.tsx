'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import ScrollRevealText from '@/components/ui/ScrollRevealText';
import ScrollRevealImage from '@/components/ui/ScrollRevealImage';
import type { ServiceData } from '@/lib/data/services';

// Маппинг slug → короткий subtitle-label
const SUBTITLE_MAP: Record<string, string> = {
  ppf: 'PPF',
  ceramic: 'CERAMIC',
  polishing: 'POLISH',
  interior: 'INTERIOR',
  tinting: 'TINT',
  wash: 'WASH',
  'vinyl-wrap': 'VINYL',
  'headlight-polish': 'LIGHTS',
};

interface EditorialServiceBlockProps {
  service: ServiceData;
  /** Порядковый номер (0-based) */
  index: number;
  /** true — фото справа, текст слева */
  reversed?: boolean;
}

/**
 * Один блок услуги в editorial-стиле.
 * Zigzag layout: чётные — фото слева, нечётные — фото справа.
 * Фото: градиентный placeholder (заменяется реальным фото при добавлении /images/services/).
 * Текст появляется при скролле через ScrollRevealText.
 */
export default function EditorialServiceBlock({
  service,
  index,
  reversed = false,
}: EditorialServiceBlockProps) {
  const subtitle = SUBTITLE_MAP[service.slug] ?? service.slug.toUpperCase();
  const serviceNum = String(index + 1).padStart(2, '0');

  return (
    <section className="relative border-t border-[var(--border)] py-24 lg:py-32">
      <div className="page-container">
        {/* Порядковый номер — скромный, сверху */}
        <span
          className="mb-8 block font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--text-dim)]"
          aria-hidden
        >
          {serviceNum}
        </span>

        {/* Основной grid: zigzag */}
        <div
          className={cn(
            'grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-6'
          )}
        >
          {/* Фото — основное */}
          <div
            className={cn(
              'lg:col-span-5',
              reversed ? 'lg:col-start-8 lg:row-start-1' : 'lg:col-start-1 lg:row-start-1'
            )}
          >
            <ScrollRevealImage className="relative overflow-hidden" delay={0.1}>
              {/* Градиентный placeholder — заменить на <Image> при появлении реальных фото */}
              <div
                className="aspect-[4/5] w-full"
                style={{ background: service.gradient }}
                role="img"
                aria-label={service.title}
              >
                {/* Внутренний блик для визуальной глубины */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.04) 0%, transparent 60%)',
                  }}
                  aria-hidden
                />
              </div>
            </ScrollRevealImage>
          </div>

          {/* Текстовый блок */}
          <div
            className={cn(
              'lg:col-span-5 lg:self-center',
              reversed ? 'lg:col-start-2 lg:row-start-1' : 'lg:col-start-7 lg:row-start-1'
            )}
          >
            {/* Subtitle — category label, red, mono */}
            <ScrollRevealText
              as="span"
              splitBy="chars"
              stagger={0.03}
              className="mb-4 block font-mono text-[11px] uppercase tracking-[0.35em] text-[var(--accent-red)]"
            >
              {subtitle}
            </ScrollRevealText>

            {/* Title */}
            <ScrollRevealText
              as="h2"
              splitBy="words"
              stagger={0.06}
              delay={0.15}
              className="mb-6 font-display text-[clamp(2rem,4vw,3.5rem)] font-bold uppercase leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)]"
            >
              {service.title}
            </ScrollRevealText>

            {/* Description */}
            <ScrollRevealText
              as="p"
              splitBy="lines"
              delay={0.3}
              className="mb-8 max-w-[380px] font-body text-[clamp(13px,1.1vw,16px)] leading-relaxed text-[var(--text-secondary)]"
            >
              {service.desc}
            </ScrollRevealText>

            {/* Features — список, staggered */}
            <ul className="mb-10 space-y-2" aria-label="Включено в услугу">
              {service.features.slice(0, 3).map((feat, i) => (
                <li key={feat}>
                  <ScrollRevealText
                    as="span"
                    splitBy="words"
                    stagger={0.04}
                    delay={0.4 + i * 0.1}
                    className="block font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]"
                  >
                    {feat}
                  </ScrollRevealText>
                </li>
              ))}
            </ul>

            {/* CTA — ссылка на страницу услуги */}
            <ScrollRevealText
              as="span"
              splitBy="words"
              delay={0.7}
              className="block"
            >
              <Link
                href={`/services/${service.slug}`}
                className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--text-primary)] transition-colors duration-300 hover:text-[var(--accent-red)]"
              >
                <span>Подробнее</span>
                <span
                  className="transition-transform duration-300 group-hover:translate-x-2"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </ScrollRevealText>
          </div>
        </div>

        {/* Второй, меньший визуальный элемент — смещён для асимметрии */}
        <div
          className={cn(
            'mt-8 lg:mt-[-60px]',
            reversed
              ? 'ml-auto mr-[8%] w-[28%] max-w-[240px]'
              : 'ml-[55%] w-[28%] max-w-[240px]'
          )}
        >
          <ScrollRevealImage delay={0.35}>
            <div
              className="aspect-[3/4] w-full"
              style={{
                background: service.gradient,
                filter: 'brightness(0.7)',
              }}
              role="presentation"
              aria-hidden
            />
          </ScrollRevealImage>
        </div>
      </div>
    </section>
  );
}
