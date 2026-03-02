'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap, Draggable } from '@/lib/gsap-config';

// ─── Данные ───────────────────────────────────────────────────────────────────

interface Slide {
  id: number;
  category: string;
  title: string;
  // Градиенты вместо изображений (placeholder до появления реальных фото)
  gradient: string;
}

const slides: Slide[] = [
  { id: 1, category: 'PPF',      title: 'BMW X5',              gradient: 'linear-gradient(135deg, #1a0a0a 0%, #2d1010 100%)' },
  { id: 2, category: 'CERAMIC',  title: 'Mercedes S-Class',    gradient: 'linear-gradient(135deg, #0a0a1a 0%, #10102d 100%)' },
  { id: 3, category: 'INTERIOR', title: 'Toyota Land Cruiser', gradient: 'linear-gradient(135deg, #0a1a0a 0%, #10201a 100%)' },
  { id: 4, category: 'POLISH',   title: 'Porsche Cayenne',     gradient: 'linear-gradient(135deg, #1a1a0a 0%, #2d2d10 100%)' },
  { id: 5, category: 'PPF',      title: 'Audi Q8',             gradient: 'linear-gradient(135deg, #1a0a1a 0%, #2d102d 100%)' },
  { id: 6, category: 'TINT',     title: 'Range Rover Sport',   gradient: 'linear-gradient(135deg, #0a1a1a 0%, #10282d 100%)' },
  { id: 7, category: 'CERAMIC',  title: 'Lexus LX',            gradient: 'linear-gradient(135deg, #150a0a 0%, #251515 100%)' },
  { id: 8, category: 'INTERIOR', title: 'BMW 7 Series',        gradient: 'linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)' },
];

const CARD_COUNT = slides.length;
const ROTATION_STEP = 45; // 45° между карточками

// ─── Размеры ──────────────────────────────────────────────────────────────────
const CARD_SIZE    = 300; // px — квадрат на мобайле
const CARD_SIZE_MD = 450; // px — квадрат на десктопе
const RADIUS       = 380; // расстояние от центра до карточек (мобайл)
const RADIUS_MD    = 650; // расстояние от центра до карточек (десктоп)

// ─── Компонент ────────────────────────────────────────────────────────────────

export default function PortfolioCarousel() {
  const sectionRef   = useRef<HTMLElement>(null);
  const cylinderRef  = useRef<HTMLDivElement>(null);
  const imagesRef    = useRef<(HTMLDivElement | null)[]>([]);
  const currentAngle = useRef(0);
  const dragStartAngle = useRef(0);

  const [isMd, setIsMd] = useState(false);

  // Responsive breakpoint
  useEffect(() => {
    const check = () => setIsMd(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const radius   = isMd ? RADIUS_MD   : RADIUS;
  const cardSize = isMd ? CARD_SIZE_MD : CARD_SIZE;

  // ─── Параллакс изображений ───────────────────────────────────────────────
  const updateParallax = useCallback((angle: number) => {
    imagesRef.current.forEach((img, i) => {
      if (!img) return;
      // Угол карточки относительно фронта (0° = прямо перед камерой)
      const cardAngle = ((angle + i * ROTATION_STEP) % 360 + 360) % 360;
      // Нормализуем в -180..180
      const normalized = cardAngle > 180 ? cardAngle - 360 : cardAngle;
      // Параллакс: макс ±30px
      const parallaxX = (normalized / 180) * 30;
      gsap.set(img, { x: parallaxX });
    });
  }, []);

  // ─── Вращение цилиндра ───────────────────────────────────────────────────
  const rotateTo = useCallback((angle: number, duration = 0) => {
    currentAngle.current = angle;
    if (!cylinderRef.current) return;
    gsap.to(cylinderRef.current, {
      rotateY: angle,
      duration,
      ease: duration > 0 ? 'power2.out' : 'none',
      onUpdate: () => {
        const current = gsap.getProperty(cylinderRef.current!, 'rotateY') as number;
        updateParallax(current);
      },
    });
  }, [updateParallax]);

  // ─── GSAP Draggable через proxy ──────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current || !cylinderRef.current) return;

    // Невидимый proxy-элемент — Draggable не умеет крутить rotateY напрямую
    const proxy = document.createElement('div');
    sectionRef.current.appendChild(proxy);

    const [draggable] = Draggable.create(proxy, {
      type: 'x',
      trigger: sectionRef.current,
      inertia: true,
      onDragStart() {
        dragStartAngle.current = currentAngle.current;
      },
      onDrag() {
        const newAngle = dragStartAngle.current + this.x * 0.15;
        rotateTo(newAngle);
      },
      onThrowUpdate() {
        const newAngle = dragStartAngle.current + this.x * 0.15;
        rotateTo(newAngle);
      },
    });

    // Начальный параллакс
    updateParallax(0);

    return () => {
      draggable.kill();
      proxy.remove();
    };
  }, [rotateTo, updateParallax, radius]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#050505] flex flex-col overflow-hidden cursor-grab active:cursor-grabbing select-none"
    >
      {/* ── Заголовок ── */}
      <div className="page-container text-center pt-24 md:pt-32 pb-8 md:pb-12 relative z-10">
        <span
          className="block font-mono text-sm uppercase tracking-[0.3em] font-medium mb-4"
          style={{ color: 'var(--accent-red)' }}
        >
          ПОРТФОЛИО
        </span>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
          НАШИ РАБОТЫ
        </h2>
      </div>

      {/* ── 3D Карусель ── */}
      <div className="flex-1 flex items-center justify-center relative">
        {/*
          perspective-wrapper — точка обзора (камера).
          Размер совпадает с карточкой — центр perspective = центр цилиндра.
        */}
        <div
          className="relative"
          style={{
            perspective: '600px',
            perspectiveOrigin: '50% 50%',
            width: `${cardSize * 1.2}px`,
            height: `${cardSize}px`,
          }}
        >
          {/*
            Цилиндр — вращается вокруг Y.
            preserve-3d обязателен: дети должны жить в 3D-пространстве.
          */}
          <div
            ref={cylinderRef}
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d', transform: 'rotateY(0deg)' }}
          >
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: `${cardSize}px`,
                  height: `${cardSize}px`,
                  borderRadius: '30px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: '#0A0A0A',
                  // КРИТИЧНО: отрицательный translateZ = карточки уходят ОТ нас.
                  // Мы внутри цилиндра — как в poppr.be.
                  transform: `rotateY(${i * ROTATION_STEP}deg) translateZ(-${radius}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Изображение с параллаксом (шире карточки на 60px) */}
                <div
                  ref={(el) => { imagesRef.current[i] = el; }}
                  className="absolute"
                  style={{ inset: '-30px' }}
                >
                  {/* Placeholder-градиент вместо <Image> до появления реальных фото */}
                  <div
                    className="absolute inset-0"
                    style={{ background: slide.gradient }}
                  />
                  {/* Водяной знак категории */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="font-display text-[80px] font-bold uppercase leading-none"
                      style={{ color: 'rgba(255,255,255,0.04)' }}
                    >
                      {slide.category}
                    </span>
                  </div>
                </div>

                {/* Градиент снизу */}
                <div
                  className="absolute inset-0 z-10"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, transparent 100%)' }}
                />

                {/* Текст */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <span
                    className="font-mono text-xs uppercase tracking-[0.2em] font-medium"
                    style={{ color: 'var(--accent-red)' }}
                  >
                    {slide.category}
                  </span>
                  <h3 className="font-display text-lg md:text-xl font-bold mt-1 text-[var(--text-primary)]">
                    {slide.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Drag-хинт ── */}
      <div className="text-center pb-8 md:pb-12">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">
          drag
        </span>
      </div>
    </section>
  );
}
