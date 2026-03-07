'use client';

import ScrollRevealText from '@/components/ui/ScrollRevealText';
import PinnedServicePair from '@/components/sections/PinnedServicePair';
import type { Service } from '@/components/sections/PinnedServicePair';

// imgLargeVw/HVh — ширина (vw) и высота (vh) большого фото
// imgSmallVw/HVh — ширина (vw) и высота (vh) малого фото (min 25vw)
// Landscape feel: большой Vw + маленький HVh
// Portrait feel: стандартный Vw + большой HVh
const services: Service[] = [
  // ═══ PAGE-VIEW 1 ═══
  {
    id: 'ppf',
    title: 'Защитная плёнка',
    features: ['Полная оклейка', 'Частичная оклейка', 'Антигравийные зоны'],
    imgLarge: '/images/services/ppf.png',
    imgSmall: '/images/services/ppf_hide.png',
    imgLargeVw: 26, imgLargeHVh: 44,   // portrait
    imgSmallVw: 35, imgSmallHVh: 25,
  },
  {
    id: 'ceramic',
    title: 'Керамическое покрытие',
    features: ['Однослойное', 'Многослойное', 'Колёсные диски'],
    imgLarge: '/images/services/ceramic.png',
    imgSmall: '/images/services/ceramic_hide.png',
    imgLargeVw: 38, imgLargeHVh: 28,   // landscape (wider, shorter)
    imgSmallVw: 27, imgSmallHVh: 24,
  },
  // ═══ PAGE-VIEW 2 ═══
  {
    id: 'polishing',
    title: 'Полировка кузова',
    features: ['Мягкая полировка', 'Абразивная', 'Восстановительная'],
    imgLarge: '/images/services/polishing.png',
    imgSmall: '/images/services/polish_hide.png',
    imgLargeVw: 32, imgLargeHVh: 34,   // near-square / 4:3 feel
    imgSmallVw: 32, imgSmallHVh: 30,
  },
  {
    id: 'interior',
    title: 'Химчистка салона',
    features: ['Полная химчистка', 'Кожа', 'Потолок'],
    imgLarge: '/images/services/interior.png',
    imgSmall: '/images/services/interior_hide.png',
    imgLargeVw: 28, imgLargeHVh: 42,   // portrait (taller)
    imgSmallVw: 30, imgSmallHVh: 24,   // landscape small
  },
  // ═══ PAGE-VIEW 3 ═══
  {
    id: 'tint',
    title: 'Тонировка',
    features: ['Атермальная', 'Классическая', 'Бронирование стёкол'],
    imgLarge: '/images/services/tint.png',
    imgSmall: '/images/services/tint_hide.png',
    imgLargeVw: 34, imgLargeHVh: 26,   // landscape
    imgSmallVw: 28, imgSmallHVh: 26,
  },
  {
    id: 'detailing',
    title: 'Детейлинг‑мойка',
    features: ['Комплексная мойка', 'Мойка двигателя', 'Уход за дисками'],
    imgLarge: '/images/services/detailing.png',
    imgSmall: '/images/services/detailing_hide.png',
    imgLargeVw: 24, imgLargeHVh: 40,   // portrait
    imgSmallVw: 30, imgSmallHVh: 28,
  },
  // ═══ PAGE-VIEW 4 ═══
  {
    id: 'leather',
    title: 'Реставрация кожи',
    features: ['Покраска', 'Ремонт разрывов', 'Восстановление текстуры'],
    imgLarge: '/images/services/leather.png',
    imgSmall: '/images/services/leather_hide.png',
    imgLargeVw: 32, imgLargeHVh: 30,   // landscape
    imgSmallVw: 24, imgSmallHVh: 36,
  },
  {
    id: 'windshield',
    title: 'Защита лобового стекла',
    features: ['Антидождь', 'Бронеплёнка', 'Керамика для стёкол'],
    imgLarge: '/images/services/windshield.png',
    imgSmall: '/images/services/windshield_hide.png',
    imgLargeVw: 28, imgLargeHVh: 42,   // portrait
    imgSmallVw: 28, imgSmallHVh: 22,   // landscape small
  },
  // ═══ PAGE-VIEW 5 (одиночная) — Русификация 1.5× larger ═══
  {
    id: 'russification',
    title: 'Русификация авто',
    features: ['Приборная панель', 'Мультимедиа', 'Голосовой помощник'],
    imgLarge: '/images/services/russification.png',
    imgSmall: '/images/services/russification_hide.png',
    imgLargeVw: 38, imgLargeHVh: 38,   // 1.5× base × 1.2
    imgSmallVw: 32, imgSmallHVh: 36,   // 1.5× base small × 1.2
    extraImgs: [
      '/images/services/russification_2.png',
      '/images/services/russification_3.png',
    ],
    extraVw: [36, 26],    // 1.5× of [20, 15] × 1.2
    extraHVh: [24, 36],   // landscape + portrait × 1.2
  },
];

const pageViews: [Service, Service | undefined][] = [
  [services[0], services[1]],
  [services[2], services[3]],
  [services[4], services[5]],
  [services[6], services[7]],
  [services[8], undefined],
];

export default function ServicesPageContent() {
  return (
    <main style={{ background: '#050505', minHeight: '100vh' }}>
      <div style={{ height: '80px' }} aria-hidden />

      {/* Заголовок + подтекст */}
      <section style={{ paddingTop: '140px', paddingBottom: '100px' }}>
        <div className="services-page-container">
          <ScrollRevealText
            as="h1"
            splitBy="words"
            stagger={0.08}
            className="font-display text-[clamp(2.5rem,6vw,5rem)] font-bold uppercase leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)]"
          >
            Что мы предлагаем
          </ScrollRevealText>

          <ScrollRevealText
            as="p"
            splitBy="words"
            stagger={0.03}
            delay={0.5}
            className="mt-8 max-w-[58%] font-body text-[clamp(18px,1.5vw,21px)] leading-relaxed text-[var(--text-secondary)]"
          >
            Полный комплекс работ — от невидимой защиты кузова до детальной реставрации каждой поверхности. Профессиональное оборудование, сертифицированные материалы, подход без компромиссов.<br></br> Кроме того, мы одни из первых детейлинг-центров в регионе, кто закрыл актуальный запрос владельцев китайских авто: полная русификация интерфейса — прямо на месте или с выездом к клиенту.
          </ScrollRevealText>
        </div>
      </section>

      {pageViews.map(([left, right], index) => (
        <PinnedServicePair
          key={left.id}
          left={left}
          right={right}
          layoutIndex={index}
        />
      ))}

      <div style={{ height: 'clamp(200px, 20vh, 400px)' }} aria-hidden />
    </main>
  );
}
